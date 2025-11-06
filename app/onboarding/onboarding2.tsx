import OnboardingScreen2 from "@/src/modules/onboarding/onboarding2";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Onboarding2 = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="white" style="dark" />
            <OnboardingScreen2 />
        </SafeAreaView>
    );
};

export default Onboarding2;
