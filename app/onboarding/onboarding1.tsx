import OnboardingScreen1 from "@/src/modules/onboarding/onboarding1";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Onboarding1 = () => {
    return (
        <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
            <StatusBar backgroundColor="white" style="dark" />
            <OnboardingScreen1 />
        </SafeAreaView>
    );
};

export default Onboarding1;
