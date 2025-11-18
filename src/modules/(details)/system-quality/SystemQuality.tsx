import { View, ScrollView, useWindowDimensions, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import PumpingStatusCard from "@/src/components/PumpingStatusCard";
import SensorStatusCard from "./components/SensorStatusCard";
import { fetchData } from "@/lib/rest";
import { ReadingCTX } from "@/lib/contexts/readingCTX";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import { ConnectionCTX } from "@/lib/contexts/connectionCTX";
import PageTitle from "@/src/components/PageTitle";

const SystemQuality = () => {
    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif

    const { reading, setReading } = useContext(ReadingCTX)!;
    const { connection } = useContext(ConnectionCTX)!;

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
                    <PageTitle title="Status Sistem" className="mb-[45px]" />
                    <View className="flex flex-col items-center justify-center gap-[5%] mx-2">
                        <PumpingStatusCard reading={reading} />
                        <SensorStatusCard
                            controlValue={
                                reading === null
                                    ? null
                                    : (((reading.control >> 4) & 1) as unknown as boolean)
                            }
                            title="Valve"
                        />
                        <SensorStatusCard
                            controlValue={
                                reading === null
                                    ? null
                                    : (((reading.control >> 3) & 1) as unknown as boolean)
                            }
                            title="Sensor"
                        />
                        <SensorStatusCard
                            controlValue={
                                reading === null
                                    ? null
                                    : (((reading.control >> 2) & 1) as unknown as boolean)
                            }
                            title="Distribusi"
                        />
                        <SensorStatusCard
                            controlValue={
                                reading === null
                                    ? null
                                    : (((reading.control >> 1) & 1) as unknown as boolean)
                            }
                            title="Tandon"
                        />
                        <SensorStatusCard
                            controlValue={
                                reading === null
                                    ? null
                                    : (((reading.control >> 0) & 1) as unknown as boolean)
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
        </RefreshableScreen>
    );
};

export default SystemQuality;
