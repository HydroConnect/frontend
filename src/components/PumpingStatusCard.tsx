import React from "react";
import { View, Platform } from "react-native";
import { Typography } from "@/src//components/Typography";
import StatusPill from "@/src/components/StatusPill";

type PumpingProps = {
    status: "pumping"; // Kalau 'pumping', props lain nggak dibutuhkan
};

type IdleProps = {
    status: "idle";
    lastPumpTime: string; // WAJIB ada kalau 'idle'
    lastPumpDate: string; // WAJIB ada kalau 'idle'
};

type PumpStatusCardProps = PumpingProps | IdleProps;

const PumpingStatusCard: React.FC<PumpStatusCardProps> = (props) => {
    if (props.status === "pumping") {
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
                <StatusPill text={props.lastPumpTime} variant="default" />
                <StatusPill text={props.lastPumpDate} variant="default" />
            </View>
        </View>
    );
};

export default PumpingStatusCard;
