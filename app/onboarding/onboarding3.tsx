import OnboardingScreen3 from "@/src/modules/onboarding/onboarding3";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Onboarding3 = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="white" style="dark" />
            <OnboardingScreen3 />
        </SafeAreaView>
    );
};

export default Onboarding3;
