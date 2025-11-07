import { View, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/src/components/Typography";
import BoxVideo from "@/src/modules/panduan/components/boxVideo";

const Panduan = () => {
    const panduanData = [
        {
            id: 1,
            title: 'Cara Menyalakan Pompa',
            videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            steps: ['Lorem', 'Ipsum']
        },
        {
            id: 2,
            title: 'Cara Memberihkan Filter',
            videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            steps: ['Lorem', 'Ipsum']
        },
        {
            id: 3,
            title: 'Cara Merawat Panel Surya dan Alat Sensor',
            videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            steps: ['Lorem', 'Ipsum']
        }
    ];

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["#E0EEE6", "#FFFFFF"]}
                className="w-full h-1/4 absolute top-0 left-0 right-0"
            />
            
            <ScrollView 
                className="flex-1 pt-[5%] px-[8%]" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100, // Biar gak ketutup bottom navbar
                }}
            >
                {/* Header */}
                <View className="mb-8">
                    <Typography variant="h3" weight="semibold">
                        Panduan
                    </Typography>
                </View>

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
    );
};

export default Panduan;