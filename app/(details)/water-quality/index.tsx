import React from "react";
import WaterQuality from "@/src/modules/(details)/water-quality/WaterQuality";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const index = () => {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={["bottom", "top"]}>
            <StatusBar backgroundColor="white" style="dark" />
            <WaterQuality />
        </SafeAreaView>
    );
};

export default index;
