import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Splashscreen from "@/src/modules/onboarding/Splashscreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ENVIRONMENT_STATUS } from "@/lib/constants";

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        if (ENVIRONMENT_STATUS === "PRODUCTION") {
            const timer = setTimeout(() => {
                router.push("/onboarding/onboarding1");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    if (ENVIRONMENT_STATUS === "PRODUCTION") {
        return (
            <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
                <StatusBar backgroundColor="white" style="dark" />
                <Splashscreen />
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 items-center justify-center bg-pink-300">
            <Text>hydroconnect pelis aku butuh duithh</Text>

            <TouchableOpacity
                onPress={() => router.push("/ApiTest")}
                className="bg-slate-400 w-40 h-20 flex justify-center items-center mt-4">
                <Text className="font-bold">Api Test</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/onboarding/onboarding1")}
                className="bg-red-200 w-40 h-20 flex justify-center items-center mt-4">
                <Text className="font-bold">Home</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Index;
