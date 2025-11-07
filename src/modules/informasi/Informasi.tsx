import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import NotificationCard from "./components/NotificationCard";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LogoAirMati from "./components/LogoAirMati";
import LogoAirNyala from "./components/LogoAirNyala";

const Informasi = () => {
    const router = useRouter();
    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["#E0EEE6", "#FFFFFF"]}
                className="w-full h-1/4 absolute top-0 left-0 right-0"
            />
            <ScrollView className="flex-1 py-[5%] px-[8%]" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Typography variant="h3" weight="semibold" className="mb-[48px]">
                    Informasi
                </Typography>

                {/* Info Section */}
                <View className="mb-[20px]">
                    {/* Pemantauan Sistem Button */}
                    <TouchableOpacity 
                        className="flex-row items-center justify-center bg-[#E0EEE6] rounded-full py-[10px] mb-[20px]"
                        onPress={() => {/* Navigate to Pemantauan Sistem */}}
                    >
                        <Typography variant="body" weight="semibold" className="text-[#3B6B50] place-content-center">
                            Pemantauan Sistem
                        </Typography>
                        <MaterialIcons name="chevron-right" size={18} color="#3B6B50" />
                    </TouchableOpacity>

                    <View className="h-[1px] bg-black mb-[20px]" />

                    {/* Hubungi Kami Button */}
                    <Button 
                        label="Hubungi Kami" 
                        variant="primary" 
                        textVariant="body" 
                        textWeight="semibold"
                        className="mb-[20px]"
                        icon={(props) => <MaterialIcons name="chevron-right" size={18} color="white" />} 
                        onPress={() => {/* Navigate to Hubungi Kami */}}
                    />

                    {/* Tentang Kami Button */}
                    <Button 
                        label="Tentang Kami" 
                        variant="primary" 
                        textVariant="body" 
                        textWeight="semibold" 
                        icon={(props) => <MaterialIcons name="chevron-right" size={18} color="white" />}
                        onPress={() => {/* Navigate to Tentang Kami */}}
                    />
                </View>

                    {/*Garis Hitam */}
                    <View className="h-[1px] bg-black mb-[24px]" />

                {/* Pemberitahuan Section */}
                <View className="mb-20">
                    <Typography variant="h3" weight="semibold" className="mb-[12px]">
                        Pemberitahuan
                    </Typography>

                    {/* Hari ini */}
                    <Typography variant="title" weight="semibold" className="mb-[12px] text-gray-700">
                        Hari ini
                    </Typography>

                    <NotificationCard
                        title="Pompa dimatikan"
                        timestamp={new Date(2025, 10, 7, 8, 20)} // 7 November 2025, 08:20
                        icon={<LogoAirMati width={35} height={35} />}
                    />

                    <NotificationCard
                        title="Pompa dinyalakan"
                        timestamp={new Date(2025, 10, 7, 10, 45)} // 7 November 2025, 10:45
                        icon={<LogoAirNyala width={35} height={35} />}
                    />

                    {/* Kemarin */}
                    <Typography variant="title" weight="semibold" className="mb-[12px] text-gray-700">
                        Kemarin
                    </Typography>

                    <NotificationCard
                        title="Pompa dimatikan"
                        timestamp={new Date(2025, 10, 6, 15, 30)} // 6 November 2025, 15:30
                        icon={<LogoAirMati width={35} height={35} />}
                    />

                    <NotificationCard
                        title="Pompa dinyalakan"
                        timestamp={new Date(2025, 10, 6, 7, 15)} // 6 November 2025, 07:15
                        icon={<LogoAirNyala width={35} height={35} />}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default Informasi;
