import React from "react";
import AboutUs from "@/src/modules/(details)/about-us/AboutUs";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

const index = () => {
    return (
        <View className="flex-1">
            <SafeAreaView className="bg-white" edges={["top"]} />
            <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
                <StatusBar backgroundColor="white" style="dark" />
                <AboutUs />
            </SafeAreaView>
        </View>
    );
};

export default index;
