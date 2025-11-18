import React from "react";
import { Pressable, Text, View, Platform, Dimensions } from "react-native";
// 👇 FIX 1: Tambahkan ToastConfigParams di sini
import Toast, { type ToastConfigParams } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

// Global variable untuk menyimpan bottomOffset
let globalBottomOffset = 130;

export const setToastBottomOffset = (offset: number) => {
    globalBottomOffset = offset;
};

interface ShowToastParams {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
}

const playNotificationSound = async () => {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require("../../assets/sounds/notification-AMP.mp3") // Pastikan path ini benar
        );

        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.isLoaded && status.didJustFinish) {
                await sound.unloadAsync();
            }
        });
    } catch (error) {
        // console.log("Error playing sound:", error);
    }
};

const IconWrapper = ({
    name,
    color,
    bgColor,
}: {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}) => (
    <View style={{ backgroundColor: bgColor, borderRadius: 999, padding: 6 }}>
        <Ionicons name={name} size={24} color={color} />
    </View>
);

const CheckIcon = () => <IconWrapper name="checkmark" color="white" bgColor="#22c55e" />;
const ErrorIcon = () => <IconWrapper name="close" color="white" bgColor="#ef4444" />;
const InfoIcon = () => <IconWrapper name="information" color="white" bgColor="#3b82f6" />;
const WarningIcon = () => <IconWrapper name="warning" color="white" bgColor="#facc15" />;
const CloseIcon = () => <Ionicons name="close" size={20} color="#374151" />;

const toastConfig = {
    // 👇 Menggunakan generic <any> agar aman
    success: ({ text1, text2 }: ToastConfigParams<any>) => (
        <View className="w-[90%] opacity-95 bg-green-100 rounded-3xl shadow-lg flex-row border border-green-200">
            <View className="flex-1 flex-row items-center p-3 px-4">
                <CheckIcon />
                <View className="flex-1 ml-3">
                    <Text className="text-gray-900 text-base font-bold">{text1}</Text>
                    {text2 ? <Text className="text-gray-600 text-sm mt-1">{text2}</Text> : null}
                </View>
                <Pressable onPress={() => Toast.hide()} className="ml-2 p-1">
                    <CloseIcon />
                </Pressable>
            </View>
        </View>
    ),
    error: ({ text1, text2 }: ToastConfigParams<any>) => (
        <View className="w-[90%] opacity-95 bg-red-100 rounded-3xl shadow-lg flex-row border border-red-200">
            <View className="flex-1 flex-row items-center p-3 px-4">
                <ErrorIcon />
                <View className="flex-1 ml-3">
                    <Text className="text-gray-900 text-base font-bold">{text1}</Text>
                    {text2 ? <Text className="text-gray-600 text-sm mt-1">{text2}</Text> : null}
                </View>
                <Pressable onPress={() => Toast.hide()} className="ml-2 p-1">
                    <CloseIcon />
                </Pressable>
            </View>
        </View>
    ),

    info: ({ text1, text2 }: ToastConfigParams<any>) => (
        <View className="w-[90%] opacity-95 bg-blue-100 rounded-3xl shadow-lg flex-row border border-blue-200">
            <View className="flex-1 flex-row items-center p-3 px-4">
                <InfoIcon />
                <View className="flex-1 ml-3">
                    <Text className="text-gray-900 text-base font-bold">{text1}</Text>
                    {text2 ? <Text className="text-gray-600 text-sm mt-1">{text2}</Text> : null}
                </View>
                <Pressable onPress={() => Toast.hide()} className="ml-2 p-1">
                    <CloseIcon />
                </Pressable>
            </View>
        </View>
    ),

    warning: ({ text1, text2 }: ToastConfigParams<any>) => (
        <View className="w-[90%] opacity-95 bg-yellow-100 rounded-3xl shadow-lg flex-row border border-yellow-200">
            <View className="flex-1 flex-row items-center p-3 px-4">
                <WarningIcon />
                <View className="flex-1 ml-3">
                    <Text className="text-gray-900 text-base font-bold">{text1}</Text>
                    {text2 ? <Text className="text-gray-600 text-sm mt-1">{text2}</Text> : null}
                </View>
                <Pressable onPress={() => Toast.hide()} className="ml-2 p-1">
                    <CloseIcon />
                </Pressable>
            </View>
        </View>
    ),
};

export const showToast = ({ type, title, message }: ShowToastParams) => {
    playNotificationSound();

    Toast.show({
        type,
        text1: title,
        text2: message ?? "",
        position: "bottom",
        bottomOffset: globalBottomOffset,
        visibilityTime: 3000,
    });
};

export const handleSuccess = ({ message }: { message: string }) => {
    showToast({ type: "success", title: "Berhasil", message });
};

export const handleError = ({ message }: { message: string }) => {
    showToast({ type: "error", title: "Terjadi Kesalahan", message });
};

export const handleWarning = ({ message }: { message: string }) => {
    showToast({ type: "warning", title: "Peringatan", message });
};

export const handleInfo = ({ message }: { message: string }) => {
    showToast({ type: "info", title: "Info", message });
};

export default toastConfig;
