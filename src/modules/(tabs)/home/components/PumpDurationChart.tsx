import { View, Pressable } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import StatusPill from "@/src/components/StatusPill"; // Impor StatusPill global-mu
import { Ionicons } from "@expo/vector-icons";

// 1. Definisikan tipe data yang akan diterima
//    Ini yang akan kamu kirim dari API/WebSocket
interface BarData {
    day: string; // "Senin", "Selasa", ...
    hours: number;
}

interface PumpDurationChartProps {
    // Array 7 hari dari data
    weeklyData: BarData[];
    // Data untuk "Telah menyala..."
    totalHours: number;
    // Data untuk "Minggu, 24 November 2025"
    currentDate: string;
}

// 2. Tentukan tinggi MAKSIMAL chart-nya (dalam px)
const CHART_MAX_HEIGHT_PX = 150; // 100px (atau h-24 di Tailwind)

// 3. Komponen Utamanya
const PumpDurationChart: React.FC<PumpDurationChartProps> = ({
    weeklyData,
    totalHours,
    currentDate,
}) => {
    const handleInfoPress = () => {
        console.log("Tombol info Lama Pompa ditekan");
    };

    // 4. Cari nilai jam tertinggi untuk nentuin skala
    const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1); // (kasih 1 biar nggak / 0)

    return (
        <View className="rounded-3xl p-4 bg-green-50">
            <View className="flex-row items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    Pompa Menyala
                </Typography>
                <Pressable onPress={handleInfoPress}>
                    <Ionicons name="help-circle" size={30} color={"#7D9F8C"} />
                </Pressable>
            </View>
            {/* --- Subjudul (Tanggal) --- */}
            <Typography variant="label" className="text-black">
                {currentDate}
            </Typography>
            <View className="mt-3 self-start">
                <StatusPill variant="default" text={`Telah menyala ${totalHours} Jam`} />
            </View>
            {/* --- Bagian CHART (Intinya) --- */}
            <View
                className="mt-[3%] flex-row justify-between items-end"
                style={{ height: CHART_MAX_HEIGHT_PX + 40 }}>
                {weeklyData.map((item, index) => {
                    // 5. Hitung tinggi bar-nya
                    const barHeight = (item.hours / maxHours) * CHART_MAX_HEIGHT_PX;

                    return (
                        <View key={index} className="flex-1 items-center space-y-1">
                            {/* Label Atas (Jam) */}
                            <Typography
                                variant="c2"
                                weight="semibold"
                                className="text-blue-400 mb-1">
                                {item.hours} jam
                            </Typography>

                            {/* Bar-nya */}
                            <View
                                style={{ height: barHeight }}
                                className="w-3/4 rounded-[10px] bg-blue-400"
                            />

                            {/* Label Bawah (Hari) */}
                            <Typography variant="c2" weight="semibold" className="text-black mt-1">
                                {item.day}
                            </Typography>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default PumpDurationChart;
