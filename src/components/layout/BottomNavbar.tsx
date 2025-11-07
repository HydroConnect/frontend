import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Typography } from "../Typography";

const getIconName = (routeName: string, isFocused: boolean): keyof typeof Ionicons.glyphMap => {
    if (routeName === "home") {
        return isFocused ? "home" : "home-outline";
    } else if (routeName === "informasi") {
        return isFocused ? "information-circle" : "information-circle-outline";
    } else if (routeName === "panduan") {
        return isFocused ? "book" : "book-outline";
    }
    return "ellipse"; // default
};

export function BottomNavbar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View
            // 4. ⚠️ UBAH: Kasih background sesuai referensi (green-50 dari config-mu)
            className="flex-row bg-green-50"
            style={{
                // Padding atas dan bawah (tanpa safe area karena sudah di-handle SafeAreaView)
                paddingVertical: 12,
            }}>
            {state.routes.map((route, index) => {
                const descriptor = descriptors[route.key];
                if (!descriptor) {
                    return null;
                }
                const { options } = descriptor;
                const isFocused = state.index === index;

                // Ambil judul dari 'options' (cth: "Home")
                const label = options.title !== undefined ? (options.title as string) : route.name;

                // Fungsi untuk handle klik
                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                // Fungsi untuk handle klik lama
                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                // 5. ⚠️ UBAH: Logika styling baru
                const iconName = getIconName(route.name, isFocused);

                // Warna (dari config)
                const activeColor = "#3B6B50"; // green-DEFAULT
                const inactiveColor = "#999999"; // neutral-400

                const color = isFocused ? activeColor : inactiveColor;

                // Background pill (sesuai referensi)
                const pillClassName = isFocused
                    ? "bg-green-100 rounded-full" // green-100 is #D0E1D7
                    : "bg-transparent";

                // Warna Teks (sesuai referensi)
                const textColor = isFocused ? "text-green-800" : "text-neutral-400"; // green-800 is #182B20
                const textWeight = "semibold";

                return (
                    // Ini adalah tombol tab-nya
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        className="flex-1 items-center justify-center px-1">
                        {/* 6. ⚠️ BARU: Ini View untuk "Pill" background */}
                        {/* Ikon dan Teks sekarang ada di dalam View ini */}
                        <View className={`w-2/3 px-3 py-2 items-center ${pillClassName}`}>
                            <Ionicons name={iconName} size={24} color={color} />

                            <Typography variant="c2" weight={textWeight} className={textColor}>
                                {label}
                            </Typography>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
