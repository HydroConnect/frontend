import HCtext from "@/assets/images/onboarding/HCtext";
import Button from "@/src/components/Button";
import { Typography } from "@/src/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

const OnboardingScreen1 = () => {
    const router = useRouter();
    return (
        <View className="flex-1 relative bg-white">
            <View className="flex-1 justify-between items-center pb-[17%] px-8">
                <View className="mt-[120px] w-[330px] items-center">
                    <Typography variant="h3" className="text-black text-center w-full h-[32px]">
                        Selamat Datang di
                    </Typography>

                    <View className="mt-[150px] items-center">
                        {/* Ganti HCicon dengan Image */}
                        <Image
                            source={require("@/assets/images/onboarding/HCicon.jpg")}
                            style={{ width: 123, height: 87 }}
                            resizeMode="contain"
                        />
                        <HCtext />
                    </View>
                </View>

                <Button
                    label="Mulai"
                    variant="primary"
                    onPress={() => router.push("/onboarding/onboarding2")}
                    textVariant="h3"
                    textWeight="semibold"
                    className="w-[75%] absolute bottom-[10%] mb-10"
                />
            </View>
        </View>
    );
};

export default OnboardingScreen1;
