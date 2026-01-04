import { View, Pressable } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import { StatusPill } from "@/src/components/StatusPill"; // Impor StatusPill global-mu
import { Ionicons } from "@expo/vector-icons";
import type { iSummaries } from "@/schemas/summaries";
import { formatDate, getHari, getHourMinute, round } from "@/lib/utils";
import { SUMMARY_GRAPH_PRECISION } from "@/lib/constants";
import { CardShimmer } from "@/src/components/Shimmer";
import { InfoTooltip } from "@/src/components/Tooltip";
import { TooltipContent } from "@/src/components/TooltipContent";

const CHART_MAX_HEIGHT_PX = 150; // 100px (atau h-24 di Tailwind)

const PumpDurationChart: React.FC<{ summaries: iSummaries[] | null; [key: string]: unknown }> = ({
    summaries,
}) => {
    if (summaries === null) {
        return <CardShimmer />;
    }

    // Nilai seconds tertinggi untuk nentuin skala
    let maxHour = 0;
    for (let i = 0; i < summaries.length; i++) {
        maxHour = Math.max(maxHour, round(summaries[i]!.uptime / 3600, SUMMARY_GRAPH_PRECISION));
    }

    const [todayHour, todayMin] = getHourMinute(
        round(summaries[0]!.uptime / 3600, SUMMARY_GRAPH_PRECISION)
    );

    return (
        <View className="rounded-3xl p-4 bg-green-50">
            <View className="flex-row items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    Pompa Menyala
                </Typography>
                <InfoTooltip
                    iconSize={30}
                    content={
                        <TooltipContent description="Lama Pompa Menyala Menunjukkan Banyaknya Air yang Digunakan" />
                    }
                />
            </View>

            {/* --- Subjudul (Tanggal) --- */}
            <Typography variant="label" className="text-black">
                {formatDate(new Date())}
            </Typography>
            <View className="mt-3 self-start">
                <StatusPill
                    variant="default"
                    text={`Telah menyala ${todayHour === 0 ? "" : `${todayHour} Jam`}${todayMin} Min`}
                />
            </View>

            {/* --- Bagian CHART (Intinya) --- */}
            <View
                className="mt-[3%] flex-row justify-between items-end"
                style={{ height: CHART_MAX_HEIGHT_PX + 40 }}>
                {summaries.toReversed().map(({ uptime, timestamp }, index) => {
                    // 5. Hitung tinggi bar-nya
                    const hourUptime = round(uptime / 3600, SUMMARY_GRAPH_PRECISION);
                    const barHeight =
                        Math.max(2, (hourUptime / maxHour) * CHART_MAX_HEIGHT_PX) || 2;
                    const [hourUp, minUp] = getHourMinute(hourUptime);

                    return (
                        <View key={index} className="flex-1 items-center space-y-1">
                            {/* Label Atas (Jam) */}
                            <Typography
                                variant="c2"
                                weight="semibold"
                                className="text-blue-400 mb-1">
                                {`${hourUp === 0 ? "" : `${hourUp}:`}${minUp} ${hourUp === 0 ? "min" : "jam"}`}
                            </Typography>

                            {/* Bar-nya */}
                            <View
                                style={{ height: barHeight }}
                                className="w-3/4 rounded-[10px] bg-blue-400"
                            />

                            {/* Label Bawah (Hari) */}
                            <Typography variant="c2" weight="semibold" className="text-black mt-1">
                                {getHari(new Date(timestamp))}
                            </Typography>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default PumpDurationChart;
