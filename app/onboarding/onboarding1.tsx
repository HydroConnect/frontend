import OnboardingScreen1 from "@/src/modules/onboarding/onboarding1";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler, ToastAndroid, Platform } from "react-native";
import { useFocusEffect } from "expo-router";

const Onboarding1 = () => {
    const backPressedOnce = useRef(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (backPressedOnce.current) {
                    // Keluar dari aplikasi
                    BackHandler.exitApp();
                    return true;
                }

                // Tampilkan toast
                backPressedOnce.current = true;

                if (Platform.OS === "android") {
                    ToastAndroid.show("Tekan sekali lagi untuk keluar", ToastAndroid.SHORT);
                }

                // Reset setelah 2 detik
                setTimeout(() => {
                    backPressedOnce.current = false;
                }, 2000);

                return true;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => subscription.remove();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
            <StatusBar backgroundColor="white" style="dark" />
            <OnboardingScreen1 />
        </SafeAreaView>
    );
};

export default Onboarding1;
