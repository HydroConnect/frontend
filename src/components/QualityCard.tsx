import { View, Pressable } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import { StatusPill } from "@/src/components/StatusPill";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/src/components/Button";
import { useRouter } from "expo-router";
import { CardShimmer } from "./Shimmer";
import type { Level } from "@/lib/chemFormula";

interface QualityCardProps {
    label: string;
    level: null | Level;
    isButton?: boolean;
    customPillText?: string; // Custom text untuk pill, override default "Aman"/"Bahaya"
}

const BAR_OK = "bg-blue-400";
const BAR_WARN = "bg-yellow-500";
const BAR_EMPTY = "bg-blue-50";

const statusConfig: Record<
    Level,
    {
        pillVariant: "ok" | "warn";
        pillText: string | any;
        barSegments: string[];
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
        pillText: "Aman",
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

const QualityCard: React.FC<QualityCardProps> = ({ level, label, isButton, customPillText }) => {
    const router = useRouter();
    if (level === null) {
        return <CardShimmer />;
    }
    const { pillVariant, pillText, barSegments } = statusConfig[level];

    // Gunakan customPillText jika ada, kalau tidak pakai default dari statusConfig
    const displayPillText = customPillText || pillText;
    // Jika ada customPillText, gunakan variant "default", kalau tidak pakai dari statusConfig
    const displayPillVariant = customPillText ? "default" : pillVariant;

    const handleInfoPress = () => {
        console.log("Tombol info Kualitas Air ditekan");
    };

    const handleButtonPress = () => {
        router.push("/(details)/water-quality");
    };

    return (
        <View className="w-full rounded-3xl p-4 bg-green-50">
            <View className="flex-row items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    {label}
                </Typography>
                <View className="flex flex-row gap-1 justify-center items-center">
                    <Pressable onPress={handleInfoPress}>
                        <Ionicons name="help-circle" size={30} color={"#7D9F8C"} />
                    </Pressable>
                    <StatusPill variant={displayPillVariant} text={displayPillText} />
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
            {isButton && (
                <Button
                    onPress={handleButtonPress}
                    label="Selengkapnya"
                    variant="primary"
                    className="mt-4 w-full"
                    textVariant="body"
                />
            )}
        </View>
    );
};

export default QualityCard;
