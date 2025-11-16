import React from "react";
import SystemQuality from "@/src/modules/(details)/system-quality/SystemQuality";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const index = () => {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={["bottom", "top"]}>
            <StatusBar backgroundColor="white" style="dark" />
            <SystemQuality />
        </SafeAreaView>
    );
};

export default index;
