import { View, Pressable } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import { StatusPill } from "@/src/components/StatusPill"; // Impor StatusPill global-mu
import { CardShimmer } from "@/src/components/Shimmer";
import { Ionicons } from "@expo/vector-icons";
import { InfoTooltip } from "@/src/components/Tooltip";
import { TooltipContent } from "@/src/components/TooltipContent";

type SensorStatus = "safe" | "danger";

interface SensorStatusCardProps {
    title: string; // Misal: "Sensor suhu", "Sensor pH"
    controlValue: boolean | null;
}

const SensorStatusCard: React.FC<SensorStatusCardProps> = ({ title, controlValue }) => {
    // Tentukan variant pill berdasarkan status
    if (controlValue === null) {
        return <CardShimmer />;
    }
    const status: SensorStatus = controlValue ? "safe" : "danger";
    const pillVariant = status === "safe" ? "ok" : "warn";
    const pillText = status === "safe" ? "Aman" : "Bahaya";

    return (
        <View className="rounded-3xl p-4 w-full bg-green-50 flex-row items-center justify-between">
            <Typography variant="h3" weight="semibold">
                {title}
            </Typography>
            <View className="flex-row items-center gap-2">
                <InfoTooltip
                    iconSize={30}
                    content={<TooltipContent description={`Status dari ${title}`} />}
                />
                <StatusPill variant={pillVariant} text={pillText} />
            </View>
        </View>
    );
};

export default SensorStatusCard;
