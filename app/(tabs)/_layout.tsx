import { BottomNavbar } from "@/src/components/layout/BottomNavbar";
import { Tabs } from "expo-router";
import React from "react";

const Layout = () => {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <BottomNavbar {...props} />}>
            <Tabs.Screen name="home" options={{ title: "Kualitas Air" }} />
            <Tabs.Screen name="panduan" options={{ title: "Panduan" }} />
            <Tabs.Screen name="informasi" options={{ title: "Informasi" }} />
        </Tabs>
    );
};

export default Layout;
