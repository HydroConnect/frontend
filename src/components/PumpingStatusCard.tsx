import React from "react";
import { View } from "react-native";
import { Typography } from "@/src//components/Typography";
import StatusPill from "@/src/components/StatusPill";
import type { iReadings } from "@/schemas/readings";
import { ON_OFF_THRESHOLD_MS } from "@/lib/constants";
import { formatDate, getJam } from "@/lib/utils";

const PumpingStatusCard: React.FC<{ reading: iReadings | null; [key: string]: unknown }> = ({
    reading,
}) => {
    if (reading === null) {
        return <View></View>;
    }
    if (Date.now() - new Date(reading.timestamp).getTime() <= ON_OFF_THRESHOLD_MS) {
        return (
            <View className="w-full rounded-3xl p-4 bg-green-50">
                <Typography
                    variant="body"
                    weight="semibold"
                    className="text-center text-neutral-600 mb-2">
                    Data Saat Ini
                </Typography>
                <View className="flex-row justify-center items-center">
                    <StatusPill text="Pompa Menyala" variant="ok" />
                </View>
            </View>
        );
    }
    return (
        <View className="w-full rounded-3xl p-4 bg-neutral-200">
            <Typography
                variant="body"
                weight="semibold"
                className="text-center text-[#383838] mb-2">
                Data Sejak Pompa Menyala
            </Typography>
            <View className="flex-row justify-center items-center space-x-2">
                <StatusPill text={getJam(new Date(reading.timestamp))} variant="default" />
                <StatusPill text={formatDate(new Date(reading.timestamp))} variant="default" />
            </View>
        </View>
    );
};

export default PumpingStatusCard;
