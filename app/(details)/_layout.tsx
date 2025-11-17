import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Layout = () => {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1">
            <View
                className="absolute top-0 left-0 right-0 bg-white z-0"
                style={{ height: insets.top }}
            />

            <View
                className="absolute bottom-0 left-0 right-0 bg-black z-0"
                style={{ height: insets.bottom }}
            />

            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="about-us" options={{ headerShown: false }} />
                <Stack.Screen name="system-quality" options={{ headerShown: false }} />
                <Stack.Screen name="water-quality" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
};

export default Layout;
