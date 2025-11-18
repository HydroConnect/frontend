import { View, ScrollView, useWindowDimensions, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { Typography } from "@/src/components/Typography";
import QualityCard from "@/src/components/QualityCard";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { fetchData } from "@/lib/rest";
import { percentToLevel, scorePH, scoreTDS, scoreTurbidity } from "@/lib/chemFormula";
import { ReadingCTX } from "@/lib/contexts/readingCTX";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import { ConnectionCTX } from "@/lib/contexts/connectionCTX";
import SuhuCard from "./components/SuhuCard";
import PageTitle from "@/src/components/PageTitle";

const WaterQuality = () => {
    const { reading, setReading } = useContext(ReadingCTX)!;
    const { connection } = useContext(ConnectionCTX)!;

    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif

    useEffect(() => {
        fetchData(setReading, null);
    }, []);

    return (
        <RefreshableScreen>
            <View className="flex-1 bg-white">
                <ScrollView
                    className="flex-1 pt-[5%] px-[8%]"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: navbarPadding }}>
                    <PageTitle title="Kualitas Air" className="mb-[45px]" />

                    <View className="flex flex-col items-center justify-center gap-[5%] mx-2">
                        <QualityCard
                            label="Turbiditas"
                            level={
                                reading === null
                                    ? null
                                    : percentToLevel(scoreTurbidity(reading!.turbidity))
                            }
                            customPillText={`PPM ${reading === null ? null : reading!.turbidity}`}
                        />
                        <QualityCard
                            label="Keasaman"
                            level={reading === null ? null : percentToLevel(scorePH(reading!.pH))}
                            customPillText={`pH ${reading === null ? null : reading!.pH}`}
                        />
                        <QualityCard
                            label="Kekeruhan"
                            level={reading === null ? null : percentToLevel(scoreTDS(reading!.tds))}
                            customPillText={`${reading === null ? null : reading!.tds} NTU`}
                        />
                        <SuhuCard
                            label="Suhu"
                            temp={reading === null ? null : reading!.temperature}
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
                            icon={() => <Entypo name="chevron-left" size={25} color="white" />}
                        />
                    </View>
                </ScrollView>
            </View>
        </RefreshableScreen>
    );
};

export default WaterQuality;
