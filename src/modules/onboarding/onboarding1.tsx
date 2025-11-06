import { Typography } from "@/src/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const OnboardingScreen1 = () => {
    const router = useRouter();
    return (
        <View>
            <Typography variant="h2" className="mb-4">
                Onboarding 1
            </Typography>

            <Pressable onPress={() => router.push("/onboarding/onboarding2")}>
                <Text>Next</Text>
            </Pressable>
        </View>
    );
};

export default OnboardingScreen1;
