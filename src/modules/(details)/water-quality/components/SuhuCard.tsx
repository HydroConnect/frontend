import { View, Pressable } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import { Ionicons } from "@expo/vector-icons";
import { CardShimmer } from "@/src/components/Shimmer";
import { InfoTooltip } from "@/src/components/Tooltip";
import { TooltipContent } from "@/src/components/TooltipContent";

interface SuhuCardProps {
    label: string;
    temp: number | null;
}

export interface SuhuPillProps {
    className?: string;
    temp: number | null;
}

export const SuhuPill: React.FC<SuhuPillProps> = ({ temp, className }) => {
    // Base (NULL style)
    let bgColor = "bg-white";
    let textColor = "text-green-600";

    if (typeof temp === "number") {
        if (temp < 20) {
            bgColor = "bg-blue-100";
            textColor = "text-blue-700";
        } else if (temp > 30) {
            bgColor = "bg-red-100";
            textColor = "text-red-700";
        } else {
            bgColor = "bg-green-400";
            textColor = "text-gray-100";
        }
    }

    return (
        <View
            className={`${className ?? ""} flex-row items-center justify-center ${bgColor} px-4 py-2 rounded-full border-[1px] border-gray-500 border-solid shadow-sm`}>
            <Typography variant="title" weight="semibold" className={textColor}>
                {`${temp} °C`}
            </Typography>
        </View>
    );
};

const SuhuCard: React.FC<SuhuCardProps> = ({ label, temp }) => {
    if (temp === null) {
        return <CardShimmer />;
    }

    const handleInfoPress = () => {
        console.log("Tombol info Kualitas Air ditekan");
    };

    return (
        <View className="w-full rounded-3xl p-4 bg-green-50">
            <View className="flex-row items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    {label}
                </Typography>
                <View className="flex flex-row gap-1 justify-center items-center">
                    <InfoTooltip
                        iconSize={30}
                        content={<TooltipContent description="Suhu Air Saat Ini" />}
                    />
                    <SuhuPill temp={20!} className="" />
                </View>
            </View>
        </View>
    );
};

export default SuhuCard;
