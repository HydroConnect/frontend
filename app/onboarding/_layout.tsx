import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationDuration: 100,
            }}>
            <Stack.Screen name="onboarding1" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding2" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding3" options={{ headerShown: false }} />
        </Stack>
    );
};

export default Layout;
