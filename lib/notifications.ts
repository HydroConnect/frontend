import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { type iUsageNotification } from "@/schemas/usageNotification";
import { BACKEND_API_BASE_URL, BACKEND_API_REST_VERSION, ENVIRONMENT_STATUS } from "./constants";
import { HttpError, SystemError, SystemErrorEnum } from "./errorHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let expoPushToken: null | string = null;

export async function getIsNotificationEnabled() {
    return (await AsyncStorage.getItem("isNotificationEnabled")) ? true : false;
}

async function setIsNotificationEnabled(value: boolean) {
    if (value) {
        await AsyncStorage.setItem("isNotificationEnabled", "true");
    } else {
        await AsyncStorage.removeItem("isNotificationEnabled");
    }
}

export async function enableNotification(
    notificationHandler?: (notification: Notifications.Notification) => void
): Promise<string | null | Error> {
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
            return await disableNotifications();
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            return new SystemError(SystemErrorEnum.NotificationProjectIdNotFound);
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

            // Add to Server
            try {
                const result = await fetch(
                    `${BACKEND_API_BASE_URL}/rest/${BACKEND_API_REST_VERSION}/notifications/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: expoPushToken }),
                    }
                );
                if (result.status !== 200) {
                    throw "Connection Error";
                }
            } catch (err) {
                if (err === "Connection Error") {
                    return new HttpError(400);
                }
                return new HttpError(500);
            }

            await setIsNotificationEnabled(true);
            //@ts-ignore It's hardcoded
            if (ENVIRONMENT_STATUS !== "PRODUCTION") {
                console.log(expoPushToken);
            }
            return expoPushToken;
        } catch {
            return new HttpError(500);
        }
    } else {
        return new SystemError(SystemErrorEnum.NotRealDevice);
    }
}

export async function disableNotifications() {
    try {
        const result = await fetch(
            `${BACKEND_API_BASE_URL}/rest/${BACKEND_API_REST_VERSION}/notifications/unregister`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: expoPushToken }),
            }
        );
        if (result.status !== 200) {
            throw "Connection Error";
        }

        expoPushToken = null;
        Notifications.setNotificationHandler(null);
        await setIsNotificationEnabled(false);
        return null;
    } catch (err) {
        if (err === "Connection Error") {
            return new HttpError(400);
        }
        return new HttpError(500);
    }
}

export async function getNotifications(
    latest: null | number
): Promise<[iUsageNotification[], null | number] | Error> {
    try {
        const result = await fetch(
            `${BACKEND_API_BASE_URL}/rest/${BACKEND_API_REST_VERSION}/notifications${latest !== null ? `?latest=${latest}` : ""}`
        );
        if (result.status !== 200) {
            throw "Connection Error";
        }
        const json = await result.json();
        return [json, json.length !== 0 ? json[json.length - 1].notificationId : null];
    } catch (err) {
        if (err === "Connection Error") {
            return new HttpError(400);
        }
        return new HttpError(500);
    }
}
