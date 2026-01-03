import { downloadReports, resumeDownload } from "@/lib/downloadReports";
import { connectAndListen, disconnect, isConnected } from "@/lib/io";
import { getLatest, getSummaries } from "@/lib/rest";
import { downloadRequestSample } from "@/schemas/downloadRequest";
import type { iReadings } from "@/schemas/readings";
import { type iSummaries } from "@/schemas/summaries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import {
    getNotifications,
    registerForPushNotificationsAsync,
    resetNotificationDB,
    saveNotification,
    sendPushNotification,
} from "@/lib/notifications";
import { usageNotificationSample, type iUsageNotification } from "@/schemas/usageNotification";

const ApiTest = () => {
    const [log, setLog] = useState<any>();
    const [summary, setSummary] = useState<iSummaries[] | null>(null);
    const [expoPushToken, setExpoPushToken] = useState("");
    const [latestNPointer, setLatestNPointer] = useState<number | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const [myNotifs, setMyNotifs] = useState<iUsageNotification[]>([]);

    function print(input: any) {
        console.log(input);
        setLog(JSON.stringify(input));
    }

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ""))
            .catch((error: any) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            }
        );

        const responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response);
            }
        );

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        // <View className="flex w-[100%] h-[100%] relative justify-center items-center">
        <ScrollView
            style={{
                position: "relative",
                // justifyContent: "center",
                // alignItems: "center",
                // display: "flex",
                // flex: 0,
                marginLeft: "auto",
                marginRight: "auto",
                width: "80%",
            }}>
            <View className="relative h-10"></View>
            <View>
                <Link href={"/"} push asChild>
                    <Text className="font-bold">Back</Text>
                </Link>
                <Text>{log}</Text>
            </View>
            <View className="mb-5 h-56 w-max bg-slate-200">
                <Button
                    title="GET /summary"
                    onPress={() => {
                        getSummaries().then((data) => {
                            if (data instanceof Error) {
                                print(data);
                                return;
                            }
                            setSummary(data);
                        });
                    }}
                />
                <Button
                    title="GET /latest"
                    onPress={() => {
                        getLatest().then((data) => {
                            if (data instanceof Error) {
                                print(data);
                                return;
                            }
                            print(data);
                        });
                    }}
                />
                <View className="bg-slate-200 h-40">
                    {(summary ?? []).map((item, index) => {
                        return (
                            <Text key={index} className="text-black">
                                Data at {item.timestamp}
                            </Text>
                        );
                    })}
                </View>
            </View>
            <View className="mb-5 h-56 w-max bg-slate-200">
                <Button
                    title="IO /listen"
                    onPress={() => {
                        connectAndListen(
                            () => {
                                console.log("Connected");
                            },
                            () => {
                                console.log("Connection lost!");
                            },
                            (readings: iReadings) => {
                                print(readings);
                            }
                        );
                    }}
                />
                <Button
                    title="IO /disconnect"
                    onPress={() => {
                        disconnect();
                    }}
                />
                <Button
                    title="Check connection"
                    onPress={() => {
                        print(isConnected());
                    }}
                />
            </View>
            <View className="mb-5 h-56 w-max bg-slate-200">
                <Button
                    title="IO /download-request"
                    onPress={async () => {
                        const hasil = await downloadReports(downloadRequestSample, () => {});
                        if (hasil instanceof Error) {
                            console.log(hasil);
                        }
                    }}
                />
                <Button
                    title="IO /resume-request"
                    onPress={async () => {
                        const hasil = await resumeDownload(() => {});
                        if (hasil instanceof Error) {
                            console.log(hasil);
                        }
                    }}
                />
                <Button
                    title="IO /resume-request (_forcePick)"
                    onPress={async () => {
                        const hasil = await resumeDownload(() => {}, true);
                        if (hasil instanceof Error) {
                            console.log(hasil);
                        }
                    }}
                />
                <Button
                    title="IO /reset"
                    onPress={async () => {
                        await AsyncStorage.clear();
                        console.log("RESET!");
                    }}
                />
            </View>
            <View className="mb-5 h-56 w-max bg-slate-200">
                <Text>Your Expo push token: {expoPushToken}</Text>
                <Button
                    title="Press to Send Notification"
                    onPress={async () => {
                        console.log("Pressed!");
                        await sendPushNotification(expoPushToken);
                    }}
                />
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text>Title: {notification && notification.request.content.title} </Text>
                    <Text>Body: {notification && notification.request.content.body}</Text>
                    <Text>
                        Data: {notification && JSON.stringify(notification.request.content.data)}
                    </Text>
                </View>

                <Button
                    title="Get Notification (Latest)"
                    onPress={async () => {
                        const [nowNotifs, nowPointer] = await getNotifications(latestNPointer);
                        setMyNotifs(nowNotifs);
                        setLatestNPointer(nowPointer);
                    }}
                />
                <Button
                    title="Reset Latest"
                    onPress={async () => {
                        setLatestNPointer(null);
                    }}
                />
                <Button
                    title="Save Notification"
                    onPress={async () => {
                        await saveNotification(usageNotificationSample);
                    }}
                />
                <Button
                    title="Reset Notification"
                    onPress={async () => {
                        await resetNotificationDB();
                    }}
                />
                <Text>Latest Pointer: {latestNPointer}</Text>
            </View>
            <View className="relative h-[500px]"></View>
        </ScrollView>
        // </View>
    );
};

export default ApiTest;
