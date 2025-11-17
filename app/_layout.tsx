import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { View, Dimensions, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 390;
const scale = Math.min(width / guidelineBaseWidth, 1.1);
const baseRem = 16 * scale;

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        "SourceSansPro-Regular": require("../assets/fonts/source-sans-pro.regular.ttf"),
        "SourceSansPro-Semibold": require("../assets/fonts/source-sans-pro.semibold.ttf"),
    });

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setButtonStyleAsync("light");
        }
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <View style={{ "--rem": baseRem } as any} className="flex-1">
                <Stack
                    screenOptions={{
                        animation: "slide_from_right",
                        animationDuration: 100,
                    }}>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="ApiTest" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                    <Stack.Screen name="(details)" options={{ headerShown: false }} />
                </Stack>
            </View>
        </SafeAreaProvider>
    );
}
