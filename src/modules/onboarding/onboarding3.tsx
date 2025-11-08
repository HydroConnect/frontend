import { Typography } from "@/src/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import Button from "@/src/components/Button";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const OnboardingScreen3 = () => {
    const router = useRouter();
    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["#FFFFFF", "#E0EEE6"]}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "25%",
                    width: "100%",
                }}
            />

            <Button
                label="Kembali"
                onPress={() => router.back()}
                variant="secondary"
                textVariant="body"
                textWeight="semibold"
                className="w-[30%] ml-[5%] mt-[20%]"
                iconPosition="left"
                icon={(props) => <Entypo name="chevron-left" size={16} color="currentColor" />}
            />

            <View className="flex-1 items-center justify-center px-8">
                <View className="relative w-40 h-40 mb-12">
                    <Text className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 text-[33vw] opacity-60 scale-110">
                        💧
                    </Text>

                    <Text className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 text-[25vw] z-10">
                        ⚙️
                    </Text>
                </View>

                <Typography
                    variant="d2"
                    weight="semibold"
                    className="text-black text-center mb-4 text-[45px]">
                    Merawat Filter{"\n"}dan Pompa
                </Typography>

                {/* Subtitle */}
                <Typography
                    variant="h3"
                    weight="regular"
                    className="text-black text-center mb-16 px-4 text-[24px]">
                    Menjaga kualitas air dan masa{"\n"}pakai alat Hydroconnect
                </Typography>

                <Button
                    label="Lanjut"
                    variant="primary"
                    onPress={() => {
                        router.replace("/(tabs)/home");
                    }}
                    textVariant="h3"
                    textWeight="semibold"
                    className="w-[75%] absolute bottom-[15%] self-center z-20"
                    iconSize={25}
                />
            </View>
        </View>
    );
};

export default OnboardingScreen3;
