import React, { useContext, useEffect, useRef, useState } from "react";
import { View, ScrollView, useWindowDimensions, Text } from "react-native";
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
import {
    cancelDownloads,
    checkUnfinishedProgress,
    downloadReports,
    resumeDownload,
} from "@/lib/downloadReports";
import { getMidnightDate, round } from "@/lib/utils";
import { DownloadError, DownloadErrorEnum, errorHandler } from "@/lib/errorHandler";
import { DownloadProgressCTX } from "@/lib/contexts/downloadProgressCTX";
import ProgressBar from "./components/ProgressBar";
import { toastInfo } from "@/src/components/ToastStack";

const SystemQuality = () => {
    const [isRangeModalVisible, setRangeModalVisible] = useState(false);
    const { downloadProgress, setDownloadProgress } = useContext(DownloadProgressCTX)!;
    const scrollViewRef = useRef<ScrollView>(null);

    function progressHandler(progress: number | null) {
        setDownloadProgress(progress);
    }

    const handleSelectRange = async (startDate: Date, endDate: Date) => {
        endDate.setUTCDate(endDate.getDate() + 1);
        const err = await downloadReports(
            {
                downloadId: `${new Date().toISOString()}`,
                from: getMidnightDate(startDate).toISOString(),
                to: getMidnightDate(endDate).toISOString(),
            },
            progressHandler
        );

        if (err instanceof Error) {
            if (
                err instanceof DownloadError &&
                (err.type === DownloadErrorEnum.UnfinishedDownload ||
                    err.type === DownloadErrorEnum.DownloadInProgress)
            ) {
                const err2 = await resumeDownload(progressHandler);

                if (err2 instanceof Error) {
                    errorHandler(err2);
                }
            } else {
                errorHandler(err);
            }
        }
    };
    const router = useRouter();
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1 + 100;

    const { reading, setReading } = useContext(ReadingCTX)!;

    useEffect(() => {
        fetchData(setReading, null);
        checkUnfinishedProgress().then((value) => {
            setDownloadProgress(value);
        });
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

                    {downloadProgress !== null ? (
                        <View className="flex justify-center items-center gap-5 bg-green-50 p-5 rounded-[27px]">
                            <View className="flex-col justify-center items-center gap-3 w-full">
                                <View className="bg-green-600 p-2 rounded-[18px]">
                                    <Text className="text-gray-100 text-h3 font-bold">
                                        {round(downloadProgress, 2)}
                                    </Text>
                                </View>
                                <ProgressBar
                                    progress={downloadProgress}
                                    className="mt-2 w-full pl-4 pr-4"
                                />
                            </View>
                            <View className="flex-row gap-4 justify-center items-center">
                                <Button
                                    label="Resume"
                                    variant="primary"
                                    onPress={async () => {
                                        const err = await resumeDownload(progressHandler);
                                        if (err instanceof Error) {
                                            errorHandler(err);
                                        }
                                    }}
                                    className="w-[40%]"
                                    textVariant="label"
                                />
                                <Button
                                    label="Cancel Download"
                                    variant="primary"
                                    onPress={async () => {
                                        const err = await cancelDownloads();
                                        if (err instanceof Error) {
                                            errorHandler(err);
                                        } else {
                                            toastInfo({ message: "Cancelling Download!" });
                                        }
                                        setDownloadProgress(null);
                                    }}
                                    className="w-[50%] bg-red-600"
                                    textVariant="label"
                                />
                            </View>
                        </View>
                    ) : (
                        ""
                    )}

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
