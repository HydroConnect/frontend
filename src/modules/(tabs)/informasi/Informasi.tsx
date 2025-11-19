import { View, ScrollView, useWindowDimensions, Linking } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import NotificationCard from "./components/NotificationCard";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, useRouter } from "expo-router";
import LogoAirMati from "@/assets/images/informasi/LogoAirMati";
import LogoAirNyala from "@/assets/images/informasi/LogoAirNyala";
import { debounce } from "@/lib/utils";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import PageTitle from "@/src/components/PageTitle";

const Informasi = () => {
    const { height } = useWindowDimensions();
    const navbarPadding = height * 0.1;
    const router = useRouter();

    let timeout = {};

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
                    contentContainerStyle={{ paddingBottom: navbarPadding }} // Responsif berdasarkan tinggi layar
                >
                    <PageTitle title="Informasi" className={"mb-[45px]"} />
                    {/* Info Section */}
                    <View className="mb-[5%]">
                        {/* Pemantauan Sistem Button */}
                        <Button
                            variant="secondary"
                            label="Pemantauan Sistem"
                            textVariant="body"
                            textWeight="semibold"
                            className="mb-[5%]"
                            icon={() => <Entypo name="chevron-right" size={18} color="black" />}
                            onPress={() => {
                                debounce(timeout, () => {
                                    router.push("/(details)/system-quality");
                                });
                            }}
                        />
                        <View className="h-[1.5px] bg-[#A6A6A6] mb-[24px]" />

                        {/* Hubungi Kami Button */}
                        <Button
                            label="Hubungi Kami"
                            variant="primary"
                            textVariant="body"
                            textWeight="semibold"
                            className="mb-[5%]"
                            icon={(props) => (
                                <Entypo name="chevron-right" size={18} color="white" />
                            )}
                            onPress={() => {
                                Linking.openURL("https://www.instagram.com/hydroconnect.project/");
                            }}
                        />

                        {/* Tentang Kami Button */}
                        <Button
                            label="Tentang Kami"
                            variant="primary"
                            textVariant="body"
                            textWeight="semibold"
                            icon={(props) => (
                                <Entypo name="chevron-right" size={18} color="white" />
                            )}
                            onPress={() => {
                                router.push("/(details)/about-us");
                            }}
                        />
                    </View>

                    {/*Garis Hitam */}
                    <View className="h-[1.5px] bg-[#A6A6A6] mb-[24px]" />

                    {/* Pemberitahuan Section */}
                    <View className="mb-20">
                        <Typography variant="h3" weight="semibold" className="mb-[12px]">
                            Pemberitahuan
                        </Typography>

                        {/* Hari ini */}
                        <Typography
                            variant="title"
                            weight="semibold"
                            className="mb-[12px] text-gray-700">
                            Hari ini
                        </Typography>

                        <NotificationCard
                            title="Pompa dimatikan"
                            timestamp={new Date(2025, 10, 7, 8, 20)} // 7 November 2025, 08:20
                            icon={<LogoAirMati width={50} height={50} />}
                        />

                        <NotificationCard
                            title="Pompa dinyalakan"
                            timestamp={new Date(2025, 10, 7, 10, 45)} // 7 November 2025, 10:45
                            icon={<LogoAirNyala width={50} height={50} />}
                        />

                        {/* Kemarin */}
                        <Typography
                            variant="title"
                            weight="semibold"
                            className="mb-[12px] text-gray-700">
                            Kemarin
                        </Typography>

                        <NotificationCard
                            title="Pompa dimatikan"
                            timestamp={new Date(2025, 10, 6, 15, 30)} // 6 November 2025, 15:30
                            icon={<LogoAirMati width={50} height={50} />}
                        />

                        <NotificationCard
                            title="Pompa dinyalakan"
                            timestamp={new Date(2025, 10, 6, 7, 15)} // 6 November 2025, 07:15
                            icon={<LogoAirNyala width={50} height={50} />}
                        />
                    </View>
                </ScrollView>
            </View>
        </RefreshableScreen>
    );
};

export default Informasi;
