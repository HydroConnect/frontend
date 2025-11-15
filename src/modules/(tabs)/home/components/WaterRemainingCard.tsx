import { View, Pressable } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import StatusPill from "@/src/components/StatusPill";
import { Ionicons } from "@expo/vector-icons";

type CardStatus = "full" | "halfLeft" | "halfRight" | "empty";

// 1. Config yang sudah di-update
const statusConfig: Record<
    CardStatus,
    {
        pillVariant: "ok" | "warn";
        pillText: string;
        segment1Class: string;
        segment2Class: string;
    }
> = {
    full: {
        pillVariant: "ok",
        pillText: "Tersedia",
        segment1Class: "bg-blue-400",
        segment2Class: "bg-blue-400",
    },
    halfLeft: {
        pillVariant: "ok",
        pillText: "Tersedia",
        segment1Class: "bg-yellow-500",
        segment2Class: "bg-blue-50",
    },
    halfRight: {
        pillVariant: "ok",
        pillText: "Tersedia",
        segment1Class: "bg-blue-50",
        segment2Class: "bg-yellow-500",
    },
    empty: {
        pillVariant: "warn",
        pillText: "Habis",
        segment1Class: "bg-yellow-100",
        segment2Class: "bg-blue-50",
    },
};

const WaterRemainingCard: React.FC<{ control: number | null; [key: string]: unknown }> = ({
    control,
}) => {
    if (control === null) {
        return <View></View>;
    }

    const tank = control & 1;
    const reservoir = (control >> 1) & 1;

    console.log(control);

    let status: CardStatus;
    if (tank && reservoir) {
        status = "full";
    } else if (tank && !reservoir) {
        status = "halfLeft";
    } else if (!tank && reservoir) {
        status = "halfRight";
    } else {
        status = "empty";
    }

    const { pillVariant, pillText, segment1Class, segment2Class } = statusConfig[status];

    const handleInfoPress = () => {
        console.log("Tombol info Sisa Air ditekan");
    };

    return (
        <View className="rounded-3xl p-4 bg-green-50">
            <View className="flex-row items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    Sisa Air
                </Typography>
                <Pressable onPress={handleInfoPress}>
                    <Ionicons name="help-circle" size={30} color={"#7D9F8C"} />
                </Pressable>
            </View>
            <View className="mt-2 self-start ">
                <StatusPill variant={pillVariant} text={pillText} />
            </View>
            <View className="mt-4">
                <View className="flex-row items-center gap-1 bg-white rounded-full p-1.5">
                    <View
                        className={`flex-1 py-3.5 rounded-l-full rounded-r-sm ${segment1Class}`}
                    />
                    <View
                        className={`flex-1 py-3.5 rounded-r-full rounded-l-sm ${segment2Class}`}
                    />
                </View>
            </View>
        </View>
    );
};

export default WaterRemainingCard;
