import { Typography } from "@/src/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const OnboardingScreen3 = () => {
    const router = useRouter();
    return (
        <View>
            <Typography variant="h2" className="mb-4">
                Onboarding 3
            </Typography>
            <Pressable onPress={() => router.replace("/(tabs)/home")}>
                <Text>Next</Text>
            </Pressable>
        </View>
    );
};

export default OnboardingScreen3;
