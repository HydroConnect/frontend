import { downloadReports, resumeDownload } from "@/lib/downloadReports";
import { connectAndListen, disconnect, isConnected } from "@/lib/io";
import { getLatest, getSummaries } from "@/lib/rest";
import { downloadRequestSample } from "@/schemas/downloadRequest";
import type { iReadings } from "@/schemas/readings";
import { type iSummaries } from "@/schemas/summaries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, FlatList, Text, View } from "react-native";

const ApiTest = () => {
    const [log, setLog] = useState<any>();
    const [summary, setSummary] = useState<iSummaries[] | null>(null);

    function print(input: any) {
        console.log(input);
        setLog(JSON.stringify(input));
    }

    return (
        <View className="flex w-[100%] h-[100%] relative justify-center items-center">
            <View className="relative w-max h-maxflex items-center justify-center">
                <View>
                    <Link href={"/"} push asChild>
                        <Text className="font-bold">Back</Text>
                    </Link>
                    <Text>{log}</Text>
                </View>
                <View className="h-56 w-max bg-slate-50">
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
                    <FlatList
                        className="h-40"
                        data={summary ?? []}
                        renderItem={({ item }) => {
                            return <Text className="text-black">Data at {item.timestamp}</Text>;
                        }}
                    />
                </View>
                <View className="h-56 w-max bg-slate-200">
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
                <View className="h-56 w-max bg-slate-300">
                    <Button
                        title="IO /download-request"
                        onPress={async () => {
                            const hasil = await downloadReports(downloadRequestSample);
                            if (hasil instanceof Error) {
                                console.log(hasil);
                            }
                        }}
                    />
                    <Button
                        title="IO /resume-request"
                        onPress={async () => {
                            const hasil = await resumeDownload();
                            if (hasil instanceof Error) {
                                console.log(hasil);
                            }
                        }}
                    />
                    <Button
                        title="IO /resume-request (_forcePick)"
                        onPress={async () => {
                            const hasil = await resumeDownload(true);
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
            </View>
        </View>
    );
};

export default ApiTest;
