import { View, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/src/components/Typography";

const Panduan = () => {
    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["#E0EEE6", "#FFFFFF"]}
                className="w-full h-1/4 absolute top-0 left-0 right-0"
            />
            <ScrollView className="flex-1 py-[5%] px-[8%]" showsVerticalScrollIndicator={false}>
                <Typography variant="h3" weight="semibold">
                    Panduan
                </Typography>
            </ScrollView>
        </View>
    );
};

export default Panduan;
