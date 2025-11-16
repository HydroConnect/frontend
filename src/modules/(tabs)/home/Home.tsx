import { Typography } from "@/src/components/Typography";
import React, { useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatusCard from "./components/StatusCard";
import PumpingStatusCard from "../../../components/PumpingStatusCard";
import WaterRemainingCard from "./components/WaterRemainingCard";
import FilterStatusCard from "./components/FilterStatusCard";
import QualityCard from "../../../components/QualityCard";
import PumpDurationChart from "./components/PumpDurationChart";
import { getLatest, getSummaries } from "@/lib/rest";
import type { iSummaries } from "@/schemas/summaries";
import type { iReadings } from "@/schemas/readings";

const Home = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1;
    const [latestReading, setLatestReading] = useState<null | iReadings>(null);
    const [summaries, setSummaries] = useState<null | iSummaries[]>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        const [latestData, summariesData] = await Promise.all([getLatest(), getSummaries()]);

        if (!(latestData instanceof Error)) {
            setLatestReading(latestData);
        } else {
            console.log("Error fetching latest reading");
        }

        if (!(summariesData instanceof Error)) {
            setSummaries(summariesData);
        } else {
            console.log("Error fetching summaries");
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData();
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
                    <View className="flex-1">
                        <FilterStatusCard percent={latestReading ? latestReading.percent : null} />
                    </View>
                </View>
                <View className="mt-[8%]">
                    <QualityCard label="Kualitas Air" level={5} isButton />
                </View>
                <View className="mt-[14%]">
                    <PumpDurationChart summaries={summaries} />
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
