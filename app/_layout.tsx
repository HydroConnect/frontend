import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="ApiTest" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* ^^^ REMOVE this line on production ^^^ */}
        </Stack>
    );
}
