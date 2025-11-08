import React from "react";
import { View } from "react-native";
import { Typography } from "@/src/components/Typography";
import { StatusPill } from "@/src/components/StatusPill";
import GreenWave from "@/assets/images/home/GreenWave";
import YellowWave from "@/assets/images/home/YellowWave";
import BlueWave from "@/assets/images/home/BlueWave";

type StatusType = "safe" | "empty" | "dirty";

interface StatusCardProps {
    status: StatusType;
}

const statusConfig: Record<
    StatusType,
    {
        title: string;
        bgColor: string;
        titleColor: string;
        WaveComponent: React.FC<any>;
        pills: { text: string; variant: "ok" | "warn" }[];
    }
> = {
    safe: {
        title: "Air siap digunakan",
        bgColor: "bg-blue-50",
        titleColor: "text-blue-700",
        WaveComponent: BlueWave,
        pills: [
            { text: "Air Tersedia", variant: "ok" },
            { text: "Filter Aman", variant: "ok" },
            { text: "Kualitas Air Aman", variant: "ok" },
        ],
    },
    dirty: {
        title: "Perlu Dibersihkan",
        bgColor: "bg-green-50",
        titleColor: "text-green-800",
        WaveComponent: GreenWave,
        pills: [
            { text: "Air Tersedia", variant: "ok" },
            { text: "Filter Kotor", variant: "warn" },
            { text: "Air Kotor", variant: "warn" },
        ],
    },
    empty: {
        title: "Perlu Persiapan",
        bgColor: "bg-yellow-150",
        titleColor: "text-black",
        WaveComponent: YellowWave,
        pills: [
            { text: "Air Hampir Habis", variant: "warn" },
            { text: "Filter Aman", variant: "ok" },
            { text: "Kualitas Air Aman", variant: "ok" },
        ],
    },
};

const StatusCard: React.FC<StatusCardProps> = ({ status }) => {
    const { title, bgColor, WaveComponent, pills, titleColor } = statusConfig[status];

    return (
        <View className={`rounded-3xl shadow-lg overflow-hidden ${bgColor}`}>
            <View className="p-4 z-10 flex flex-col items-center">
                <Typography variant="h3" weight="semibold" className={titleColor}>
                    {title}
                </Typography>
                {/* Render Pills */}
                <View className="mt-4 flex flex-col items-center justify-center gap-[0.45rem]">
                    {pills.map((pill, index) => (
                        <StatusPill key={index} text={pill.text} variant={pill.variant} />
                    ))}
                </View>
            </View>
            <View className="absolute bottom-0 left-0 right-0 w-full h-32 z-0">
                <WaveComponent width="100%" height="100%" preserveAspectRatio="none" />
            </View>
        </View>
    );
};

export default StatusCard;
