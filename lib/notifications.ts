import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { type iUsageNotification, type iUsageNotificationSQL } from "@/schemas/usageNotification";
import { db } from "./sqlite";
import { USAGE_NOTIFICATION_PAGING_LIMIT } from "./constants";
import { SystemError, SystemErrorEnum } from "./errorHandler";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Original Title",
        body: "And here is the body!",
        data: { someData: "goes here" },
    };

    try {
        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
    } catch (err) {
        console.log(err);
    }
}

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
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
            handleRegistrationError(
                "Permission not granted to get push token for push notification!"
            );
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError("Project ID not found");
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError("Must use physical device for push notifications");
    }
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
        console.log(qRes);
        return [qRes, latest];
    } catch (err) {
        console.log(err);
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}

export async function saveNotification(notification: iUsageNotification) {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        const qRes = await db.runAsync(
            `INSERT INTO notifications (timestamp, type) VALUES ($timestamp, $type)`,
            { $timestamp: notification.timestamp, $type: notification.type }
        );
        console.log(qRes.changes, qRes.lastInsertRowId);
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}

export async function resetNotificationDB() {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        const qRes = await db.runAsync(`DELETE FROM notifications`);
        console.log(qRes);
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}

export async function deleteNOldest(n: number) {
    if (db === undefined) {
        throw new SystemError(SystemErrorEnum.DatabaseInitError);
    }
    try {
        const qRes = await db.runAsync(
            `DELETE FROM notifications WHERE notification_id IN (SELECT notification_id FROM notifications ORDER BY notification_id ASC LIMIT $n)`,
            { $n: n }
        );
        console.log(qRes);
    } catch {
        throw new SystemError(SystemErrorEnum.DatabaseExecError);
    }
}
