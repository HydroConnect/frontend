import { Typography } from "@/src/components/Typography";
import React from "react";
import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatusCard from "./components/StatusCard";
import PumpingStatusCard from "./components/PumpingStatusCard";

const Home = () => {
    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["#E0EEE6", "#FFFFFF"]}
                className="w-full h-1/4 absolute top-0 left-0 right-0"
            />
            <ScrollView className="flex-1 py-[5%] px-[8%]" showsVerticalScrollIndicator={false}>
                <Typography variant="h3" weight="semibold">
                    Hydroconnect
                </Typography>
                <View className="my-[15%]">
                    <StatusCard status="safe" />
                </View>
                <View className="mb-[5%]">
                    <PumpingStatusCard
                        status="idle"
                        lastPumpTime="10:00"
                        lastPumpDate="Sabtu, 31 Oktober 2025"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
