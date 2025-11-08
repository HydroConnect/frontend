import React from "react";
import { View } from "react-native";
import { Typography } from "@/src/components/Typography";

interface NotificationCardProps {
    title: string;
    timestamp: Date | string; // Bisa menerima Date object atau string
    icon: React.ReactNode;
}

// Fungsi untuk format tanggal dan waktu
const formatTimestamp = (timestamp: Date | string): string => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${dayName}, ${day} ${month} ${year}, Pukul ${hours}.${minutes}`;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
    title,
    timestamp,
    icon,
}) => {
    const formattedTime = formatTimestamp(timestamp);
    
    return (
        <View className="flex-row items-center bg-[#EDEDED] rounded-xl p-4 mb-[20px]">
            <View 
                className={`w-10 h-10 rounded-full items-center justify-center mr-3`}
            >
                {icon}
            </View>
            <View className="flex-1">
                <Typography variant="title" weight="semibold" className="mb-1">
                    {title}
                </Typography>
                <Typography variant="label" weight="semibold">
                    {formattedTime}
                </Typography>
            </View>
        </View>
    );
};

export default NotificationCard;
