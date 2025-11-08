import React from "react";
import Panduan from "@/src/modules/(tabs)/panduan/Panduan";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const index = () => {
    return (
        <SafeAreaView className="flex-1 bg-green-50" edges={["top"]}>
            <StatusBar backgroundColor="#E0EEE6" style="dark" />
            <Panduan />
        </SafeAreaView>
    );
};

export default index;
