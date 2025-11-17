import OnboardingScreen2 from "@/src/modules/onboarding/onboarding2";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Onboarding2 = () => {
    return (
        <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
            <StatusBar backgroundColor="white" style="dark" />
            <OnboardingScreen2 />
        </SafeAreaView>
    );
};

export default Onboarding2;
