import { Typography } from "@/src/components/Typography";
import React from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatusCard from "./components/StatusCard";
import PumpingStatusCard from "../../../components/PumpingStatusCard";
import WaterRemainingCard from "./components/WaterRemainingCard";
import FilterStatusCard from "./components/FilterStatusCard";
import QualityCard from "../../../components/QualityCard";
import PumpDurationChart from "./components/PumpDurationChart";

const MOCK_WEEKLY_DATA = [
    { day: "Sen", hours: 2 },
    { day: "Sel", hours: 3 }, // (Anggap max 4)
    { day: "Rab", hours: 2 },
    { day: "Kam", hours: 1 },
    { day: "Jum", hours: 2 },
    { day: "Sab", hours: 3 },
    { day: "Min", hours: 4 },
];

const Home = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif
    const totalHours = 4; // (Nanti ini juga dari API)
    const currentDate = "Minggu, 24 November 2025"; // (Nanti ini formatTimestamp)

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
            >
                <Typography variant="h3" weight="semibold">
                    Hydroconnect
                </Typography>
                <View className="my-[15%]">
                    <StatusCard status="dirty" />
                </View>
                <View className="mb-[5%]">
                    <PumpingStatusCard
                        status="idle"
                        lastPumpTime="10:00"
                        lastPumpDate="Sabtu, 31 Oktober 2025"
                    />
                </View>
                <View className="flex-row gap-[8%] mt-[3%]">
                    <View className="flex-1">
                        <WaterRemainingCard status="empty" />
                    </View>
                    <View className="flex-1">
                        <FilterStatusCard status="empty" />
                    </View>
                </View>
                <View className="mt-[8%]">
                    <QualityCard label="Kualitas Air" level={5} isButton />
                </View>
                <View className="mt-[14%]">
                    <PumpDurationChart
                        weeklyData={MOCK_WEEKLY_DATA}
                        totalHours={totalHours}
                        currentDate={currentDate}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
