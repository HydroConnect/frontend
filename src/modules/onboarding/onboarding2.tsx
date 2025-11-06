import { Typography } from "@/src/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const OnboardingScreen2 = () => {
    const router = useRouter();
    return (
        <View>
            <Typography variant="h2" className="mb-4">
                Onboarding 2
            </Typography>
            <Pressable onPress={() => router.push("/onboarding/onboarding3")}>
                <Text>Next</Text>
            </Pressable>
        </View>
    );
};

export default OnboardingScreen2;
