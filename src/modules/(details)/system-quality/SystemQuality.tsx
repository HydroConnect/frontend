import React, { useContext, useEffect, useState } from "react";
// 👇 Pastikan import ScrollView ada lagi
import { View, ScrollView, useWindowDimensions, Text } from "react-native";
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
import RangeSelectionModal from "./components/CSVModal";

const SystemQuality = () => {
    const [isRangeModalVisible, setRangeModalVisible] = useState(false);
    const handleSelectRange = (endDate: Date, rangeType: "week" | "month" | "year") => {
        console.log("Waktu Akhir Dipilih:", endDate);
        console.log("Range Dipilih:", rangeType);
    };
    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1 + 100;

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
                    <Typography variant="h3" weight="semibold" className="pb-[15%]">
                        <Text>Pemantauan Sistem</Text>{" "}
                        {connection ? <Text>(Connected)</Text> : <Text>(Disconnected)</Text>}
                    </Typography>

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

                    <View className="mx-2 mt-[20%]">
                        <Button
                            label="Impor Data CSV"
                            variant="secondary"
                            onPress={() => setRangeModalVisible(true)}
                            className="w-full mx-auto mt-[10%]"
                            textVariant="h3"
                            isIcon={false}
                        />

                        <Button
                            label="Kembali"
                            variant="primary"
                            onPress={() => {
                                router.back();
                            }}
                            className="w-full mx-auto mt-[10%] mb-[10%]"
                            textVariant="h3"
                            iconPosition="left"
                            icon={(props) => <Entypo name="chevron-left" size={25} color="white" />}
                        />
                    </View>
                </ScrollView>
                <RangeSelectionModal
                    visible={isRangeModalVisible}
                    onClose={() => setRangeModalVisible(false)}
                    onSelectRange={handleSelectRange}
                />
            </View>
        </RefreshableScreen>
    );
};

export default SystemQuality;
