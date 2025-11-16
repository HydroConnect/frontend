import { View, ScrollView, useWindowDimensions, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import PumpingStatusCard from "@/src/components/PumpingStatusCard";
import SensorStatusCard from "./components/SensorStatusCard";
import type { iReadings } from "@/schemas/readings";
import { getLatest } from "@/lib/rest";

const SystemQuality = () => {
    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif
    const [latestReading, setLatestReading] = useState<iReadings | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        const data = await getLatest();
        if (!(data instanceof Error)) {
            setLatestReading(data);
        } else {
            console.log("Error Occured!");
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1 pt-[5%] px-[8%]"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: navbarPadding }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#7D9F8C"]} // Android
                        tintColor="#000000" // iOS
                    />
                }>
                <Typography variant="h3" weight="semibold" className="pb-[15%]">
                    Pemantauan Sistem
                </Typography>
                <View className="flex flex-col items-center justify-center gap-[5%] mx-2">
                    <PumpingStatusCard reading={latestReading} />
                    <SensorStatusCard
                        controlValue={
                            latestReading === null
                                ? null
                                : (((latestReading.control >> 4) & 1) as unknown as boolean)
                        }
                        title="Valve"
                    />
                    <SensorStatusCard
                        controlValue={
                            latestReading === null
                                ? null
                                : (((latestReading.control >> 3) & 1) as unknown as boolean)
                        }
                        title="Sensor"
                    />
                    <SensorStatusCard
                        controlValue={
                            latestReading === null
                                ? null
                                : (((latestReading.control >> 2) & 1) as unknown as boolean)
                        }
                        title="Distribusi"
                    />
                    <SensorStatusCard
                        controlValue={
                            latestReading === null
                                ? null
                                : (((latestReading.control >> 1) & 1) as unknown as boolean)
                        }
                        title="Tandon"
                    />
                    <SensorStatusCard
                        controlValue={
                            latestReading === null
                                ? null
                                : (((latestReading.control >> 0) & 1) as unknown as boolean)
                        }
                        title="Tanki"
                    />
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
