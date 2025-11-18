import { View, ScrollView, useWindowDimensions } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/src/components/Typography";
import BoxVideo from "./components/boxVideo";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import PageTitle from "@/src/components/PageTitle";

const Panduan = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1; // 10% dari tinggi layar, lebih responsif

    const panduanData = [
        {
            id: 1,
            title: "Cara Menyalakan Pompa",
            videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            steps: ["Lorem", "Ipsum"],
        },
        {
            id: 2,
            title: "Cara Memberihkan Filter",
            videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            steps: ["Lorem", "Ipsum"],
        },
        {
            id: 3,
            title: "Cara Merawat Panel Surya dan Alat Sensor",
            videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            steps: ["Lorem", "Ipsum"],
        },
    ];

    return (
        <RefreshableScreen>
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
                        {panduanData.map((item) => (
                            <BoxVideo
                                key={item.id}
                                title={item.title}
                                videoUrl={item.videoUrl}
                                thumbnailUrl={item.thumbnailUrl}
                                steps={item.steps}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </RefreshableScreen>
    );
};

export default Panduan;
