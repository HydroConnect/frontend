import { Linking, View, type NativeScrollEvent } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import NotificationCard from "./components/NotificationCard";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { debounce, formatDate, isSameDay } from "@/lib/utils";
import { RefreshableScreen } from "@/src/components/RefreshableScreen";
import PageTitle from "@/src/components/PageTitle";
import {
    disableNotifications,
    enableNotification,
    getIsNotificationEnabled,
    getNotifications,
} from "@/lib/notifications";
import type { iUsageNotification } from "@/schemas/usageNotification";
import { errorHandler } from "@/lib/errorHandler";
import AnimatedSwitch from "@/src/components/AnimatedSwitch";

const SCROLL_PADDING_BOTTOM = 100;
let shouldScroll = false;

const Informasi = () => {
    const router = useRouter();
    const [latest, setLatest] = useState<number | null>(null);
    const [usageNotifications, setUsageNotifications] = useState<iUsageNotification[]>([]);
    const [isNEnabled, setIsNEnabled] = useState<boolean>(false);

    let timeout = {};
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const today = new Date();

    useEffect(() => {
        getIsNotificationEnabled().then((val) => {
            setIsNEnabled(val);
        });
        getNotifications(null).then((data) => {
            if (data instanceof Error) {
                errorHandler(data);
                return;
            }

            setUsageNotifications(data[0]);
            setLatest(data[1]);
            shouldScroll = true;
        });
    }, []);

    return (
        <RefreshableScreen
            fun={() => {
                getNotifications(null).then((data) => {
                    if (data instanceof Error) {
                        errorHandler(data);
                        return;
                    }
                    setUsageNotifications(data[0]);
                    setLatest(data[1]);
                    shouldScroll = true;
                });
            }}
            onScroll={({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
                if (
                    shouldScroll &&
                    nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
                        nativeEvent.contentSize.height - SCROLL_PADDING_BOTTOM
                ) {
                    shouldScroll = false;
                    getNotifications(latest).then((data) => {
                        if (data instanceof Error) {
                            errorHandler(data);
                            return;
                        }

                        if (data[0].length === 0) {
                            shouldScroll = false;
                            return;
                        }
                        setUsageNotifications([...usageNotifications, ...data[0]]);
                        setLatest(data[1]);
                        shouldScroll = true;
                    });
                }
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
                <View className="flex-1 pt-[5%] px-[8%]">
                    <PageTitle title="Informasi" className={"mb-[45px]"} />

                    {/* Notifikasi Toggle Section */}
                    <View className="bg-green-50 rounded-2xl p-4 mb-6">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 mr-4">
                                <Typography variant="title" weight="semibold" className="mb-1">
                                    Izinkan Notifikasi
                                </Typography>
                                <Typography variant="label" className="text-gray-600">
                                    Terima pemberitahuan status pompa
                                </Typography>
                            </View>
                            <AnimatedSwitch
                                value={isNEnabled}
                                onValueChange={async (value) => {
                                    if (value) {
                                        const err = await enableNotification();
                                        if (err instanceof Error) {
                                            errorHandler(err);
                                        }
                                    } else {
                                        const err = await disableNotifications();
                                        if (err instanceof Error) {
                                            errorHandler(err);
                                        }
                                    }
                                    setIsNEnabled(await getIsNotificationEnabled());
                                }}
                            />
                        </View>
                    </View>

                    {/*Garis Hitam */}
                    <View className="h-[1.5px] bg-[#A6A6A6] mb-[24px]" />

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

                        {usageNotifications.map((notif, idx) => {
                            const nowDate = new Date(notif.timestamp);
                            if (
                                idx === 0 ||
                                !isSameDay(
                                    nowDate,
                                    new Date(usageNotifications[idx - 1]!.timestamp)
                                )
                            ) {
                                return (
                                    <React.Fragment key={`group-${idx}`}>
                                        <Typography
                                            variant="title"
                                            weight="semibold"
                                            className="mb-[12px] text-gray-700"
                                            key={`S${idx}`}>
                                            {isSameDay(today, nowDate)
                                                ? "Hari Ini"
                                                : isSameDay(nowDate, yesterday)
                                                  ? "Kemarin"
                                                  : formatDate(nowDate)}
                                        </Typography>
                                        <NotificationCard usageNotification={notif} key={idx} />
                                    </React.Fragment>
                                );
                            }
                            return <NotificationCard usageNotification={notif} key={idx} />;
                        })}
                    </View>
                </View>
            </View>
        </RefreshableScreen>
    );
};

export default Informasi;
