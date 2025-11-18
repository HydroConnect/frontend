import { Typography } from "@/src/components/Typography";
import React, { useContext, useEffect } from "react";
import { View, ScrollView, useWindowDimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatusCard from "./components/StatusCard";
import PumpingStatusCard from "../../../components/PumpingStatusCard";
import WaterRemainingCard from "./components/WaterRemainingCard";
import QualityCard from "../../../components/QualityCard";
import PumpDurationChart from "./components/PumpDurationChart";
import { fetchData } from "@/lib/rest";
import NetInfo from "@react-native-community/netinfo";
import { percentToLevel } from "@/lib/chemFormula";
import { ReadingCTX } from "@/lib/contexts/readingCTX";
import { SummariesCTX } from "@/lib/contexts/summariesCTX";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import { connectAndListen } from "@/lib/io";
import { ConnectionCTX } from "@/lib/contexts/connectionCTX";
import type { iReadings } from "@/schemas/readings";
import { IOT_INTERVAL_MS, ON_OFF_THRESHOLD_MS } from "@/lib/constants";
import { globals } from "@/lib/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

let timeout: null | number = null;

const Home = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1;

    const { reading, setReading } = useContext(ReadingCTX)!;
    const { summaries, setSummaries } = useContext(SummariesCTX)!;
    const { connection, setConnection } = useContext(ConnectionCTX)!;

    useEffect(() => {
        function nowConnectAndListen() {
            connectAndListen(
                () => {
                    setConnection(true);
                    timeout = setTimeout(async () => {
                        await fetchData(setReading, null);
                    }, ON_OFF_THRESHOLD_MS);
                },
                () => {
                    setConnection(false);
                },
                (readings: iReadings) => {
                    if (timeout !== null) {
                        clearTimeout(timeout);
                    }
                    setReading(readings);

                    globals.GSummaries![0]!.uptime += IOT_INTERVAL_MS / 1000;
                    setSummaries([...globals.GSummaries!]); // Must be expanded to avoid memoization
                    AsyncStorage.setItem("summaries", JSON.stringify(globals.GSummaries));

                    timeout = setTimeout(async () => {
                        await fetchData(setReading, null);
                    }, ON_OFF_THRESHOLD_MS);
                }
            );
        }

        fetchData(setReading, setSummaries);
        NetInfo.addEventListener((state) => {
            if (state.isInternetReachable === true) {
                fetchData(setReading, setSummaries);
                if (!connection) {
                    nowConnectAndListen();
                }
            }
        });
        nowConnectAndListen();
    }, []);

    return (
        <RefreshableScreen>
            <View className="flex-1 bg-white">
                <LinearGradient
                    colors={["#E0EEE6", "#FFFFFF"]}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "25%",
                        width: "100%",
                    }}
                />
                <ScrollView
                    className="flex-1 pt-[5%] px-[8%]"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: navbarPadding }} // Responsif berdasarkan tinggi layar
                >
                    <Typography variant="h3" weight="semibold">
                        <Text>Hydroconnect </Text>
                        {connection ? <Text>(Connected)</Text> : <Text>(Disconnected)</Text>}
                    </Typography>
                    <View className="my-[15%]">
                        <StatusCard reading={reading} />
                    </View>
                    <View className="mb-[5%]">
                        <PumpingStatusCard reading={reading} />
                    </View>
                    <View className="flex-row gap-[8%] mt-[3%]">
                        <View className="flex-1">
                            <WaterRemainingCard
                                control={reading === null ? null : reading.control}
                            />
                        </View>
                    </View>
                    <View className="mt-[8%]">
                        <QualityCard
                            label="Kualitas Air"
                            level={reading === null ? null : percentToLevel(reading.percent)}
                            isButton
                        />
                    </View>
                    <View className="mt-[14%]">
                        <PumpDurationChart summaries={summaries} />
                    </View>
                </ScrollView>
            </View>
        </RefreshableScreen>
    );
};

export default Home;
