import { View, ScrollView, useWindowDimensions } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import PumpingStatusCard from "@/src/components/PumpingStatusCard";
import SensorStatusCard from "./components/SensorStatusCard";

const SystemQuality = () => {
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
                    Pemantauan Sistem
                </Typography>
                <View className="flex flex-col items-center justify-center gap-[5%] mx-2">
                    <PumpingStatusCard status="pumping" />
                    <SensorStatusCard status="safe" title="Sensor suhu" />
                    <SensorStatusCard status="danger" title="Sensor pH" />
                    <SensorStatusCard status="safe" title="Tandon 1" />
                    <SensorStatusCard status="danger" title="Tandon 2" />
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

export default SystemQuality;
