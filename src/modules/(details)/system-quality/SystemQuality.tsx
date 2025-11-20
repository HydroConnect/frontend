import React, { useContext, useEffect, useRef, useState } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import PumpingStatusCard from "@/src/components/PumpingStatusCard";
import SensorStatusCard from "./components/SensorStatusCard";
import { fetchData } from "@/lib/rest";
import { ReadingCTX } from "@/lib/contexts/readingCTX";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import PageTitle from "@/src/components/PageTitle";
import RangeSelectionModal from "./components/CSVModal";
import { downloadReports } from "@/lib/downloadReports";
import { getMidnightDate } from "@/lib/utils";
import { errorHandler } from "@/lib/errorHandler";

const SystemQuality = () => {
    const [isRangeModalVisible, setRangeModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSelectRange = async (startDate: Date, endDate: Date) => {
        endDate.setUTCDate(endDate.getDate() + 1);
        const err = await downloadReports({
            downloadId: `ReportHydroconnect_${new Date().toISOString()}`,
            from: getMidnightDate(startDate).toISOString(),
            to: getMidnightDate(endDate).toISOString(),
        });

        if (err instanceof Error) {
            errorHandler(err);
        }
    };
    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1 + 100;

    const { reading, setReading } = useContext(ReadingCTX)!;

    useEffect(() => {
        fetchData(setReading, null);
    }, []);

    return (
        <RefreshableScreen>
            <View className="flex-1 bg-white">
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 pt-[5%] px-[8%]"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: navbarPadding, flexGrow: 1 }}>
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

                    <View className="mx-2 mt-2">
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
