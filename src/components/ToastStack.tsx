import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Pressable,
    Text,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ToastItem {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
}

let toastQueue: ToastItem[] = [];
let setToastsCallback: ((toasts: ToastItem[]) => void) | null = null;
let toastIdCounter = 0;

const playNotificationSound = async () => {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require("../../assets/sounds/notification-AMP.mp3")
        );
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.isLoaded && status.didJustFinish) {
                await sound.unloadAsync();
            }
        });
    } catch (error) {}
};

export const addToast = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message?: string
) => {
    playNotificationSound();

    const id = `toast-${toastIdCounter++}`;
    const newToast: ToastItem = { id, type, title, ...(message && { message }) };

    toastQueue = [newToast, ...toastQueue];

    if (toastQueue.length > 4) {
        toastQueue = toastQueue.slice(0, 4);
    }

    if (setToastsCallback) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setToastsCallback([...toastQueue]);
    }

    setTimeout(() => {
        removeToast(id);
    }, 3000);
};

const removeToast = (id: string) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);

    if (setToastsCallback) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setToastsCallback([...toastQueue]);
    }
};

const IconWrapper = ({ name, color, bgColor }: { name: any; color: string; bgColor: string }) => (
    <View style={{ backgroundColor: bgColor, borderRadius: 999, padding: 6 }}>
        <Ionicons name={name} size={24} color={color} />
    </View>
);
const CheckIcon = () => <MaterialIcons name="check" size={24} color="white" />;
const ErrorIcon = () => <MaterialIcons name="error-outline" size={24} color="white" />;
const InfoIcon = () => <MaterialIcons name="info-outline" size={24} color="white" />;
const WarningIcon = () => <MaterialIcons name="warning" size={24} color="white" />;
const CloseIcon = () => <MaterialIcons name="close" size={20} color="white" />;

const getToastStyles = (type: ToastItem["type"]) => {
    switch (type) {
        case "success":
            return { bg: "bg-green-400", icon: <CheckIcon /> };
        case "error":
            return { bg: "bg-red-500", icon: <ErrorIcon /> };
        case "info":
            return { bg: "bg-blue-500", icon: <InfoIcon /> };
        case "warning":
            return { bg: "bg-yellow-500", icon: <WarningIcon /> };
    }
};

const ToastComponent = ({ toast, index }: { toast: ToastItem; index: number }) => {
    const styles = getToastStyles(toast.type);

    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
    }, []);

    const offset = index * 15;
    const scale = 1 - index * 0.05;
    const opacity = 1 - index * 0.2;

    const translateYEntry = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
    });

    return (
        <Animated.View
            style={{
                position: "absolute",
                bottom: 80,
                left: "5%",
                zIndex: 100 - index,
                opacity: opacity,
                transform: [
                    { translateY: translateYEntry },
                    { translateY: -offset },
                    { scale: scale },
                ],
            }}
            className={`w-[90%] ${styles.bg} rounded-3xl shadow-lg flex-row`}>
            <View className="flex-1 flex-row items-center p-3 px-4">
                {styles.icon}
                <View className="flex-1 ml-3">
                    <Text className="text-white text-base font-bold">{toast.title}</Text>
                    {toast.message ? (
                        <Text className="text-white text-sm mt-1">{toast.message}</Text>
                    ) : null}
                </View>
                <Pressable onPress={() => removeToast(toast.id)} className="ml-2 p-1">
                    <CloseIcon />
                </Pressable>
            </View>
        </Animated.View>
    );
};

export const ToastStack = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        setToastsCallback = setToasts;
        return () => {
            setToastsCallback = null;
        };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                bottom: 40,
                left: 0,
                right: 0,
                height: 150,
                justifyContent: "flex-end",
                alignItems: "center",
                zIndex: 9999,
            }}>
            {toasts.map((toast, index) => (
                <ToastComponent key={toast.id} toast={toast} index={index} />
            ))}
        </View>
    );
};

export const toastSuccess = ({ message }: { message: string }) =>
    addToast("success", "Berhasil", message);
export const toastError = ({ message }: { message: string }) =>
    addToast("error", "Terjadi Kesalahan", message);
export const toastWarning = ({ message }: { message: string }) =>
    addToast("warning", "Peringatan", message);
export const toastInfo = ({ message }: { message: string }) => addToast("info", "Info", message);
