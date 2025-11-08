import React from "react";
import { View, Platform } from "react-native";
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

    // Custom shadow untuk Android - hanya shadow bawah
    const shadowStyle = Platform.select({
        ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        },
        android: {
            elevation: 8,
        },
    });

    return (
        <View className={`rounded-3xl overflow-hidden ${bgColor}`} style={shadowStyle}>
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
            <View
                className="absolute left-0 right-0 w-full z-0"
                style={{
                    bottom: -10,
                    height: 150,
                }}>
                <WaveComponent width="100%" height="120%" preserveAspectRatio="xMidYMax slice" />
            </View>
        </View>
    );
};

export default StatusCard;
