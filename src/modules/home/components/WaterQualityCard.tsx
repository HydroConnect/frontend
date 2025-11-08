import { View, Pressable } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import StatusPill from "@/src/components/StatusPill";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/src/components/Button";

// 1. Tentukan tipe status (level 1 s/d 5)
type Level = 1 | 2 | 3 | 4 | 5;

interface WaterQualityCardProps {
    level: Level;
}

// --- Definisikan warna-warna bar ---
const BAR_OK = "bg-blue-500"; // Biru (Aman)
const BAR_WARN = "bg-yellow-500"; // Kuning (Bahaya)
const BAR_EMPTY = "bg-blue-50"; // Abu-abu/biru muda

// 2. ✨ "Otak" Komponen: Objek Konfigurasi
//    Ini nerjemahin 'level' jadi style & teks
const statusConfig: Record<
    Level,
    {
        pillVariant: "ok" | "warn";
        pillText: string;
        barSegments: string[]; // Array dari 5 warna bar
    }
> = {
    1: {
        // Bahaya 1
        pillVariant: "warn",
        pillText: "Bahaya",
        barSegments: [BAR_WARN, BAR_EMPTY, BAR_EMPTY, BAR_EMPTY, BAR_EMPTY],
    },
    2: {
        // Bahaya 2
        pillVariant: "warn",
        pillText: "Bahaya",
        barSegments: [BAR_WARN, BAR_WARN, BAR_EMPTY, BAR_EMPTY, BAR_EMPTY],
    },
    3: {
        // Aman 3
        pillVariant: "ok",
        pillText: "Aman", // Di gambar "Bersih", tapi di list "Aman 3"
        barSegments: [BAR_OK, BAR_OK, BAR_OK, BAR_EMPTY, BAR_EMPTY],
    },
    4: {
        // Aman 4
        pillVariant: "ok",
        pillText: "Aman",
        barSegments: [BAR_OK, BAR_OK, BAR_OK, BAR_OK, BAR_EMPTY],
    },
    5: {
        // Aman 5
        pillVariant: "ok",
        pillText: "Aman",
        barSegments: [BAR_OK, BAR_OK, BAR_OK, BAR_OK, BAR_OK],
    },
};

// 3. Komponen Utamanya
const WaterQualityCard: React.FC<WaterQualityCardProps> = ({ level }) => {
    const { pillVariant, pillText, barSegments } = statusConfig[level];

    const handleInfoPress = () => {
        console.log("Tombol info Kualitas Air ditekan");
    };

    const handleButtonPress = () => {
        console.log("Tombol Selengkapnya ditekan");
    };

    return (
        <View className="rounded-2xl p-4 shadow-md bg-green-50">
            <View className="flex-row items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    Kualitas Air
                </Typography>
                <View className="flex flex-row gap-1 justify-center items-center">
                    <Pressable onPress={handleInfoPress}>
                        <Ionicons name="help-circle" size={30} color={"#7D9F8C"} />
                    </Pressable>
                    <StatusPill variant={pillVariant} text={pillText} />
                </View>
            </View>
            <View className="mt-4">
                <View className="flex-row items-center gap-1 bg-white rounded-full p-1.5">
                    {barSegments.map((segmentColor, index) => {
                        // Tentukan rounded berdasarkan posisi
                        let roundedClass = "rounded-none"; // default: tengah
                        if (index === 0) {
                            roundedClass = "rounded-l-full"; // paling kiri
                        } else if (index === barSegments.length - 1) {
                            roundedClass = "rounded-r-full"; // paling kanan
                        }

                        return (
                            <React.Fragment key={index}>
                                <View className={`flex-1 py-3.5 ${roundedClass} ${segmentColor}`} />
                                {/* Tambah separator setelah segmen ke-2 (index 1) */}
                                {index === 1 && (
                                    <View
                                        className="bg-neutral-400"
                                        style={{ width: 2, height: "100%" }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </View>
            </View>
            {/* --- Bagian Tombol "Button" --- */}
            <Button
                onPress={handleButtonPress}
                label="Selengkapnya"
                variant="primary"
                className="mt-4 w-full"
                textVariant="body"
                textWeight="semibold"
            />
        </View>
    );
};

export default WaterQualityCard;
