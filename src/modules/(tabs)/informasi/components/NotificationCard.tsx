import React from "react";
import { View } from "react-native";
import { Typography } from "@/src/components/Typography";
import type { iUsageNotification } from "@/schemas/usageNotification";
import LogoAirNyala from "@/assets/images/informasi/LogoAirNyala";
import LogoAirMati from "@/assets/images/informasi/LogoAirMati";
import { formatDate, getJam } from "@/lib/utils";

interface NotificationCardProps {
    usageNotification: iUsageNotification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ usageNotification }) => {
    const date = new Date(usageNotification.timestamp);
    return (
        <View className="flex-row gap-1 items-center bg-[#EDEDED] rounded-xl p-4 mb-[20px]">
            <View className={`w-15 h-15 rounded-full items-center justify-center mr-3`}>
                {usageNotification.type ? (
                    <LogoAirNyala width={50} height={50} />
                ) : (
                    <LogoAirMati width={50} height={50} />
                )}
            </View>
            <View className="flex-1">
                <Typography variant="title" weight="semibold" className="mb-1">
                    {usageNotification.type ? "Pompa Dinyalakan" : "Pompa Dimatikan"}
                </Typography>
                <Typography variant="label" weight="semibold" className="text-neutral-600">
                    {`${formatDate(date)} (${getJam(date)})`}
                </Typography>
            </View>
        </View>
    );
};

export default NotificationCard;
