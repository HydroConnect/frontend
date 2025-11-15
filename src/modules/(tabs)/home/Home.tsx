import { Typography } from "@/src/components/Typography";
import React, { useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatusCard from "./components/StatusCard";
import PumpingStatusCard from "../../../components/PumpingStatusCard";
import WaterRemainingCard from "./components/WaterRemainingCard";
import FilterStatusCard from "./components/FilterStatusCard";
import QualityCard from "../../../components/QualityCard";
import PumpDurationChart from "./components/PumpDurationChart";
import { getLatest, getSummaries } from "@/lib/rest";
import type { iSummaries } from "@/schemas/summaries";
import type { iReadings } from "@/schemas/readings";

const Home = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1;
    const [latestReading, setLatestReading] = useState<null | iReadings>(null);
    const [summaries, setSummaries] = useState<null | iSummaries[]>(null);

    useEffect(() => {
        getLatest().then((data) => {
            if (data instanceof Error) {
                console.log("Error Occured!\n");
                return;
            }
            setLatestReading(data);
        });
        getSummaries().then((data) => {
            if (data instanceof Error) {
                console.log("Error Occured!\n");
                return;
            }
            setSummaries(data);
        });
        console.log("WWW");
    }, []);

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["#E0EEE6", "#FFFFFF"]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "25%",
                    width: "100%",
                }}
            />
            <ScrollView
                className="flex-1 pt-[5%] px-[8%]"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: navbarPadding }} // Responsif berdasarkan tinggi layar
            >
                <Typography variant="h3" weight="semibold">
                    Hydroconnect
                </Typography>
                <View className="my-[15%]">
                    <StatusCard status="safe" />
                </View>
                <View className="mb-[5%]">
                    <PumpingStatusCard reading={latestReading} />
                </View>
                <View className="flex-row gap-[8%] mt-[3%]">
                    <View className="flex-1">
                        <WaterRemainingCard
                            control={latestReading ? latestReading.control : null}
                        />
                    </View>
                    <View className="flex-1">
                        <FilterStatusCard percent={latestReading ? latestReading.percent : null} />
                    </View>
                </View>
                <View className="mt-[8%]">
                    <QualityCard label="Kualitas Air" level={5} isButton />
                </View>
                <View className="mt-[14%]">
                    <PumpDurationChart summaries={summaries} />
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
