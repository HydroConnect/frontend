import React from "react";
import AboutUs from "@/src/modules/(details)/about-us/AboutUs";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const index = () => {
    return (
        <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
            <StatusBar backgroundColor="white" style="dark" />
            <AboutUs />
        </SafeAreaView>
    );
};

export default index;
