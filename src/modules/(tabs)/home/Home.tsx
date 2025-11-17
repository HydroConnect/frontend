import { Typography } from "@/src/components/Typography";
import React, { useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatusCard from "./components/StatusCard";
import PumpingStatusCard from "../../../components/PumpingStatusCard";
import WaterRemainingCard from "./components/WaterRemainingCard";
import QualityCard from "../../../components/QualityCard";
import PumpDurationChart from "./components/PumpDurationChart";
import { fetchData, prefetch } from "@/lib/rest";
import NetInfo from "@react-native-community/netinfo";
import type { iSummaries } from "@/schemas/summaries";
import type { iReadings } from "@/schemas/readings";
import { percentToLevel } from "@/lib/chemFormula";

const Home = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1;
    const [latestReading, setLatestReading] = useState<null | iReadings>(null);
    const [summaries, setSummaries] = useState<null | iSummaries[]>(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await prefetch(setLatestReading, setSummaries);
        await fetchData(setLatestReading, setSummaries);
        setRefreshing(false);
    };

    useEffect(() => {
        prefetch(setLatestReading, setSummaries).then(() => {
            fetchData(setLatestReading, setSummaries);
        });
        NetInfo.addEventListener((state) => {
            if (state.isInternetReachable) {
                fetchData(setLatestReading, setSummaries);
            }
        });
    }, []);

    return (
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#7D9F8C"]} // Android
                        tintColor="#000000" // iOS
                    />
                }>
                <Typography variant="h3" weight="semibold">
                    Hydroconnect
                </Typography>
                <View className="my-[15%]">
                    <StatusCard status="safe" />
                </View>
                <View className="mb-[5%]">
                    <PumpingStatusCard reading={latestReading} />
                </View>
                <View className="flex-row gap-[8%] mt-[3%]">
                    <View className="flex-1">
                        <WaterRemainingCard
                            control={latestReading ? latestReading.control : null}
                        />
                    </View>
                </View>
                <View className="mt-[8%]">
                    <QualityCard
                        label="Kualitas Air"
                        level={
                            latestReading === null ? null : percentToLevel(latestReading!.percent)
                        }
                        isButton
                    />
                </View>
                <View className="mt-[14%]">
                    <PumpDurationChart summaries={summaries} />
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
