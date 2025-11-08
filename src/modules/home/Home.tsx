import { Typography } from "@/src/components/Typography";
import React from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatusCard from "./components/StatusCard";
import PumpingStatusCard from "./components/PumpingStatusCard";
import WaterRemainingCard from "./components/WaterRemainingCard";
import FilterStatusCard from "./components/FilterStatusCard";
import WaterQualityCard from "./components/WaterQualityCard";

const Home = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif

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
                    <StatusCard status="empty" />
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
                    <WaterQualityCard level={5} />
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
