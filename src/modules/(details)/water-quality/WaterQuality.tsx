import { View, ScrollView, useWindowDimensions } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import QualityCard from "@/src/components/QualityCard";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const WaterQuality = () => {
    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif
    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1 pt-[5%] px-[8%]"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: navbarPadding }}>
                <Typography variant="h3" weight="semibold" className="pb-[15%]">
                    Kualitas Air
                </Typography>
                <View className="flex flex-col items-center justify-center gap-[5%] mx-2">
                    <QualityCard label="Turbiditas" level={4} />
                    <QualityCard label="Keasaman" level={5} />
                    <QualityCard label="Kekeruhan" level={3} />
                    <QualityCard label="Suhu" level={3} />
                </View>
                <View className="flex items-center justify-center">
                    <Button
                        label="Kembali"
                        variant="primary"
                        onPress={() => {
                            router.back();
                        }}
                        className="w-[75%] mt-[10%]"
                        textVariant="h3"
                        iconPosition="left"
                        icon={(props) => <Entypo name="chevron-left" size={25} color="white" />}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default WaterQuality;
