import { View, Pressable, Platform } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import StatusPill from "@/src/components/StatusPill";
import { Ionicons } from "@expo/vector-icons";

type CardStatus = "full" | "half" | "empty";

interface FilterStatusProps {
    status: CardStatus;
}

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
        pillText: "Bersih",
        segment1Class: "bg-blue-500",
        segment2Class: "bg-blue-500",
    },
    half: {
        pillVariant: "ok",
        pillText: "Bersih",
        segment1Class: "bg-yellow-500",
        segment2Class: "bg-blue-50",
    },
    empty: {
        pillVariant: "warn",
        pillText: "Kotor",
        segment1Class: "bg-yellow-100",
        segment2Class: "bg-blue-50",
    },
};

const FilterStatusCard: React.FC<FilterStatusProps> = ({ status }) => {
    const { pillVariant, pillText, segment1Class, segment2Class } = statusConfig[status];

    const handleInfoPress = () => {
        console.log("Tombol info Sisa Air ditekan");
    };

    return (
        <View className="rounded-3xl p-4 bg-green-50">
            <View className="flex-row items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    Filter
                </Typography>
                <Pressable onPress={handleInfoPress}>
                    <Ionicons name="help-circle" size={30} color={"#7D9F8C"} />
                </Pressable>
            </View>
            <View className="mt-2 self-start">
                <StatusPill variant={pillVariant} text={pillText} />
            </View>
            <View className="mt-4">
                <View className="flex-row items-center gap-1.5 bg-white rounded-full p-1.5">
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

export default FilterStatusCard;
