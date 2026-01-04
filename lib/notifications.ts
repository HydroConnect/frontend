import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { type iUsageNotification, type iUsageNotificationSQL } from "@/schemas/usageNotification";
import { db } from "./sqlite";
import { MAX_NOTIFICATIONS_COUNT, USAGE_NOTIFICATION_PAGING_LIMIT } from "./constants";
import { errorHandler, HttpError, SystemError, SystemErrorEnum } from "./errorHandler";

export let expoPushToken: null | string = null;

export async function enableNotification(
    notificationHandler?: (notification: Notifications.Notification) => void,
    FullEraseErrorHandler = errorHandler
): Promise<string | null> {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            return null;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new SystemError(SystemErrorEnum.NotificationProjectIdNotFound);
        }
        try {
            const _pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            expoPushToken = _pushTokenString;

            // Set Handler
            Notifications.setNotificationHandler({
                handleNotification: async (notification) => {
                    // Delete if Full
                    getNotificationsCount()
                        .then((cnt) => {
                            if (cnt > MAX_NOTIFICATIONS_COUNT) {
                                deleteNOldest(1).catch((err) => {
                                    FullEraseErrorHandler(err);
                                });
                            }
                        })
                        .catch((err) => {
                            FullEraseErrorHandler(err);
                        });

                    if (notificationHandler) {
                        notificationHandler(notification);
                    }

                    return {
                        shouldPlaySound: true,
                        shouldSetBadge: false,
                        shouldShowBanner: true,
                        shouldShowList: true,
                    };
                },
            });

            return expoPushToken;
        } catch {
            throw new HttpError(500);
        }
    } else {
        throw new SystemError(SystemErrorEnum.NotRealDevice);
    }
}

export async function disableNotifications() {
    expoPushToken = null;
    Notifications.setNotificationHandler(null);
}

export async function getNotifications(
    latest: null | number
): Promise<[iUsageNotification[], null | number]> {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        let qRes: iUsageNotificationSQL[];
        if (latest === null) {
            qRes = await db.getAllAsync(
                `SELECT * FROM notifications ORDER BY notification_id DESC LIMIT ?`,
                USAGE_NOTIFICATION_PAGING_LIMIT
            );
        } else {
            qRes = await db.getAllAsync(
                `SELECT * FROM notifications WHERE notification_id < $from AND notification_id > $to ORDER BY notification_id DESC`,
                { $from: latest, $to: latest - USAGE_NOTIFICATION_PAGING_LIMIT }
            );
        }

        if (qRes.length !== 0) {
            latest = qRes[qRes.length - 1]!.notification_id;
        }
        return [qRes, latest];
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}

export async function saveNotification(notification: iUsageNotification) {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        await db.runAsync(
            `INSERT INTO notifications (timestamp, type) VALUES ($timestamp, $type)`,
            { $timestamp: notification.timestamp, $type: notification.type }
        );
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}

export async function clearNotification() {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        await db.runAsync(`DELETE FROM notifications`);
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}

export async function getNotificationsCount(): Promise<number> {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        const qRes = (await db.getFirstAsync(`SELECT COUNT(1) FROM notifications`)) as any;
        return qRes["COUNT(1)"];
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}

export async function deleteNOldest(n: number) {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        await db.runAsync(
            `DELETE FROM notifications WHERE notification_id IN (SELECT notification_id FROM notifications ORDER BY notification_id ASC LIMIT $n)`,
            { $n: n }
        );
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}
