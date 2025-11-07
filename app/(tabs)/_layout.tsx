import { BottomNavbar } from "@/src/components/layout/BottomNavbar";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = () => {
    return (
        <SafeAreaView className="flex-1 bg-black" edges={["bottom"]}>
            <Tabs
                screenOptions={{ headerShown: false }}
                tabBar={(props) => <BottomNavbar {...props} />}>
                <Tabs.Screen name="home" options={{ title: "Kualitas Air" }} />
                <Tabs.Screen name="panduan" options={{ title: "Panduan" }} />
                <Tabs.Screen name="informasi" options={{ title: "Informasi" }} />
            </Tabs>
        </SafeAreaView>
    );
};

export default Layout;
