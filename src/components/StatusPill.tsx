import React from "react";
import { View } from "react-native";
import { Typography } from "./Typography"; // Sesuaikan path

// Definisikan props
interface StatusPillProps {
    text: string;
    // 1. Tambahkan variant 'default'
    variant: "ok" | "warn" | "default";
}

export const StatusPill: React.FC<StatusPillProps> = ({ text, variant }) => {
    // --- Tentukan style berdasarkan 'variant' ---

    let bgColor = "bg-white";
    let textColor = "text-green-900";
    let icon: string | null = null; // 2. Bikin 'icon' jadi opsional (bisa null)

    if (variant === "ok") {
        icon = "✅";
        // bgColor dan textColor sudah default (putih, hitam)
    } else if (variant === "warn") {
        bgColor = "bg-red-100"; // #FEDEDE
        textColor = "text-red-800"; // #7F2424
        icon = "❌";
    } else if (variant === "default") {
        icon = null;
        textColor = "text-green-900";
    }

    const borderColor = "border-neutral-300";

    return (
        <View
            className={`flex-row items-center justify-center ${bgColor} px-4 py-2 rounded-full border ${borderColor} shadow-sm`}>
            {/* 4. Render emoji HANYA JIKA 'icon' TIDAK NULL */}
            {icon && (
                <Typography variant="label" className="mr-2">
                    {icon}
                </Typography>
            )}

            {/* Teks */}
            <Typography variant="title" weight="semibold" className={textColor}>
                {text}
            </Typography>
        </View>
    );
};

export default StatusPill;
