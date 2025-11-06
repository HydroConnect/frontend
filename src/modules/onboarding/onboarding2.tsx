import { Typography } from "@/src/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Button from "@/src/components/Button";
import { AntDesign } from "@expo/vector-icons";

const OnboardingScreen2 = () => {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            {/* Back Button */}

            <Button
                label="Kembali"
                onPress={() => router.back()}
                variant="secondary"
                textVariant="body"
                textWeight="semibold"
                className="w-[27.5%] ml-[5%] mt-[12%]"
                iconPosition="left"
                icon={(props) => <AntDesign name="left" size={16} color="currentColor" />}
            />

            {/* Main Content */}
            <View className="flex-1 items-center justify-center px-8">
                {/* Icon/Image Placeholder */}
                <View className="relative w-40 h-40 mb-12">
                    {/* 💧 background drop */}
                    <Text className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 text-[33vw] opacity-60 scale-110">
                        💧
                    </Text>

                    {/* 🔍 front magnifier */}
                    <Text className="absolute top-[55%] left-2/3 -translate-x-1/2 -translate-y-1/2 text-[30vw] z-10">
                        🔍
                    </Text>
                </View>

                {/* Title */}
                <Typography variant="d2" weight="semibold" className="text-black text-center mb-4">
                    Memantau{"\n"}Kualitas Air
                </Typography>

                {/* Subtitle */}
                <Typography
                    variant="h3"
                    weight="regular"
                    className="text-black text-center mb-16 px-4">
                    Memastikan Air aman digunakan{"\n"}untuk kegiatan sehari-hari
                </Typography>

                <Button
                    label="Lanjut"
                    variant="primary"
                    onPress={() => {
                        router.push("/onboarding/onboarding3");
                    }}
                    textVariant="h3"
                    textWeight="semibold"
                    className="w-[75%] absolute bottom-[10%] mb-10"
                />
            </View>
        </View>
    );
};

export default OnboardingScreen2;
