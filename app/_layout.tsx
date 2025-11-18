import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Dimensions, Platform, useWindowDimensions } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import "./globals.css";
import { ReadingCTX } from "@/lib/contexts/readingCTX";
import { SummariesCTX } from "@/lib/contexts/summariesCTX";
import type { iReadings } from "@/schemas/readings";
import type { iSummaries } from "@/schemas/summaries";
import { ConnectionCTX } from "@/lib/contexts/connectionCTX";
import { ToastStack } from "@/src/components/ToastStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 390;
const scale = Math.min(width / guidelineBaseWidth, 1.1);
const baseRem = 16 * scale;

export default function RootLayout() {
    const [connection, setConnection] = useState<boolean>(false);
    const [reading, setReading] = useState<null | iReadings>(null);
    const [summaries, setSummaries] = useState<null | iSummaries[]>(null);
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
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <ConnectionCTX value={{ connection: connection, setConnection: setConnection }}>
                        <SummariesCTX value={{ summaries: summaries, setSummaries: setSummaries }}>
                            <ReadingCTX value={{ reading: reading, setReading: setReading }}>
                                <View style={{ "--rem": baseRem } as any} className="flex-1">
                                    <Stack
                                        screenOptions={{
                                            animation: "slide_from_right",
                                            animationDuration: 100,
                                        }}>
                                        <Stack.Screen
                                            name="index"
                                            options={{ headerShown: false }}
                                        />
                                        <Stack.Screen
                                            name="ApiTest"
                                            options={{ headerShown: false }}
                                        />
                                        <Stack.Screen
                                            name="(tabs)"
                                            options={{ headerShown: false }}
                                        />
                                        <Stack.Screen
                                            name="onboarding"
                                            options={{ headerShown: false }}
                                        />
                                        <Stack.Screen
                                            name="(details)"
                                            options={{ headerShown: false }}
                                        />
                                    </Stack>
                                    <ToastStack />
                                </View>
                            </ReadingCTX>
                        </SummariesCTX>
                    </ConnectionCTX>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
