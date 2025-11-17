import React from "react";
import Home from "@/src/modules/(tabs)/home/Home";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const index = () => {
    return (
        <SafeAreaView className="flex-1 bg-green-50" edges={["top"]}>
            <StatusBar backgroundColor="#E0EEE6" style="dark" />
            <Home />
        </SafeAreaView>
    );
};

export default index;
