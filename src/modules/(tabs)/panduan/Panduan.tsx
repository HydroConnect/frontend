import { View, ScrollView, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import BoxVideo from "./components/boxVideo";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import PageTitle from "@/src/components/PageTitle";
import { getPanduanData } from "@/lib/rest";
import { CardShimmer } from "@/src/components/Shimmer";
import { errorHandler } from "@/lib/errorHandler";
import type { iPanduanData } from "@/schemas/panduanData";

const Panduan = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif

    const [panduanData, setPanduanData] = useState<iPanduanData[]>([]);
    useEffect(() => {
        getPanduanData().then((val) => {
            if (val instanceof Error) {
                errorHandler(val);
                return;
            }
            setPanduanData(val);
        });
    }, []);

    return (
        <RefreshableScreen
            fun={async () => {
                const res = await getPanduanData(true);
                if (res instanceof Error) {
                    errorHandler(res);
                    return;
                }
                setPanduanData(res);
            }}>
            <View className="flex-1 bg-white">
                <LinearGradient
                    colors={["#E0EEE6", "#FFFFFF"]}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "25%",
                        width: "100%",
                    }}
                />

                <ScrollView
                    className="flex-1 pt-[5%] px-[8%]"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: navbarPadding }}>
                    <PageTitle title="Panduan" className="mb-[45px]" />

                    {/* Video Boxes Container */}
                    <View style={{ gap: 24 }}>
                        {panduanData.length === 0 ? (
                            <CardShimmer key={"S0"} />
                        ) : (
                            panduanData.map((item, idx) => (
                                <BoxVideo
                                    key={idx}
                                    title={item.title}
                                    videoUrl={item.videoUrl}
                                    thumbnailUrl={item.thumbnailUrl}
                                    steps={item.steps}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>
        </RefreshableScreen>
    );
};

export default Panduan;
