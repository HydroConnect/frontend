import { View, ScrollView, useWindowDimensions, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { Typography } from "@/src/components/Typography";
import QualityCard from "@/src/components/QualityCard";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { fetchData, prefetch } from "@/lib/rest";
import type { iReadings } from "@/schemas/readings";
import { percentToLevel, scorePH, scoreTDS, scoreTurbidity } from "@/lib/chemFormula";

const WaterQuality = () => {
    const [latestReading, setLatestReading] = useState<null | iReadings>(null);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif

    const onRefresh = async () => {
        setRefreshing(true);
        await prefetch(setLatestReading, null);
        await fetchData(setLatestReading, null);
        setRefreshing(false);
    };

    useEffect(() => {
        prefetch(setLatestReading, null).then(() => {
            fetchData(setLatestReading, null);
        });
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
                    Kualitas Air
                </Typography>
                <View className="flex flex-col items-center justify-center gap-[5%] mx-2">
                    <QualityCard
                        label="Turbiditas"
                        level={
                            latestReading === null
                                ? null
                                : percentToLevel(scoreTurbidity(latestReading!.turbidity))
                        }
                    />
                    <QualityCard
                        label="Keasaman"
                        level={
                            latestReading === null
                                ? null
                                : percentToLevel(scorePH(latestReading!.pH))
                        }
                    />
                    <QualityCard
                        label="Kekeruhan"
                        level={
                            latestReading === null
                                ? null
                                : percentToLevel(scoreTDS(latestReading!.tds))
                        }
                    />
                    <QualityCard label="Suhu" level={latestReading === null ? null : 5} />
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
                        icon={() => <Entypo name="chevron-left" size={25} color="white" />}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default WaterQuality;
