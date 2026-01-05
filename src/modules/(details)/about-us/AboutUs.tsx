import { View, ScrollView, Image } from "react-native";
import React from "react";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import { router } from "expo-router";
import HCtext from "@/assets/images/onboarding/HCtext";
import KMTKLogo from "@/assets/images/about-us/KMTK";
import KMTETILogo from "@/assets/images/about-us/KMTETI";
import TelkomLogo from "@/assets/images/about-us/Telkom";
import IEEESightLogo from "@/assets/images/about-us/IEEESight";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const AboutUs = () => {
    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="pt-[5%] px-[8%]">
                    {/* Title */}
                    <Typography variant="h2" weight="semibold" className="mb-6">
                        Tentang Kami
                    </Typography>

                    {/* HydroConnect Logo */}
                    <View className="items-center my-6 flex flex-row w-full justify-center gap-3 ">
                        <Image
                            source={require("@/assets/images/onboarding/HCicon.jpg")}
                            style={{ width: 70, height: 70 }}
                            resizeMode="contain"
                        />
                        <View className="h-[75%] w-[2px] bg-black rounded-full" />

                        <View className="items-center justify-center">
                            <HCtext width={200} height={28} />
                            <Typography variant="body" className="text-gray-600 mt-2">
                                by IEEE Student Branch UGM
                            </Typography>
                        </View>
                    </View>

                    {/* Organization Logos */}
                    <View className="flex-row justify-evenly items-center mb-8 gap-4">
                        <KMTETILogo width={50} height={50} />
                        <KMTKLogo width={50} height={50} />
                        <TelkomLogo width={50} height={50} />
                        <IEEESightLogo width={80} height={50} />
                    </View>

                    {/* Tentang Aplikasi Section */}
                    <View className="mb-8">
                        <Typography variant="h3" weight="semibold" className="mb-4">
                            Tentang Aplikasi
                        </Typography>

                        <Typography
                            variant="body"
                            className="text-gray-700 text-justify mb-6 leading-6">
                            HydroConnect adalah sistem monitoring kualitas air berbasis IoT yang
                            memungkinkan Anda memantau kondisi air secara real-time. Aplikasi ini
                            dirancang untuk memudahkan pengelolaan sistem penyediaan air bersih
                            dengan teknologi sensor canggih dan notifikasi otomatis.
                        </Typography>

                        {/* Feature Cards */}
                        <View className="gap-4">
                            {/* Real-time Monitoring */}
                            <View className="flex-row bg-green-50 rounded-2xl p-4 items-center">
                                <View className="bg-green-500 rounded-full p-3 mr-4">
                                    <Ionicons name="water" size={24} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Typography variant="title" weight="semibold" className="mb-1">
                                        Monitoring Real-time
                                    </Typography>
                                    <Typography variant="label" className="text-gray-600">
                                        Pantau pH, TDS, turbiditas, dan suhu air secara langsung
                                    </Typography>
                                </View>
                            </View>

                            {/* Pump Control */}
                            <View className="flex-row bg-green-50 rounded-2xl p-4 items-center">
                                <View className="bg-green-500 rounded-full p-3 mr-4">
                                    <MaterialCommunityIcons name="pump" size={24} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Typography variant="title" weight="semibold" className="mb-1">
                                        Kontrol Pompa
                                    </Typography>
                                    <Typography variant="label" className="text-gray-600">
                                        Lihat status pompa dan durasi pengoperasian harian
                                    </Typography>
                                </View>
                            </View>

                            {/* Notifications */}
                            <View className="flex-row bg-green-50 rounded-2xl p-4 items-center">
                                <View className="bg-green-500 rounded-full p-3 mr-4">
                                    <Ionicons name="notifications" size={24} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Typography variant="title" weight="semibold" className="mb-1">
                                        Notifikasi Otomatis
                                    </Typography>
                                    <Typography variant="label" className="text-gray-600">
                                        Dapatkan pemberitahuan saat kondisi air tidak normal
                                    </Typography>
                                </View>
                            </View>

                            {/* Reports */}
                            <View className="flex-row bg-green-50 rounded-2xl p-4 items-center">
                                <View className="bg-green-500 rounded-full p-3 mr-4">
                                    <Ionicons name="document-text" size={24} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Typography variant="title" weight="semibold" className="mb-1">
                                        Laporan Berkala
                                    </Typography>
                                    <Typography variant="label" className="text-gray-600">
                                        Unduh data historis dalam format CSV untuk analisis
                                    </Typography>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className="px-[8%] pb-8 pt-4 bg-white">
                <Button
                    label="Kembali"
                    variant="primary"
                    onPress={() => {
                        router.back();
                    }}
                    className="w-full"
                    textVariant="h3"
                    iconPosition="left"
                    icon={(props) => <Entypo name="chevron-left" size={25} color="white" />}
                />
            </View>
        </View>
    );
};

export default AboutUs;
