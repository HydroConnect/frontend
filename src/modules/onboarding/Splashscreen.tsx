import { View, Image } from "react-native";
import React from "react";
import HCtext from "@/assets/images/onboarding/HCtext";

const Splashscreen = () => {
    return (
        <View className="flex-1 bg-white items-center justify-center">
            <Image
                source={require("@/assets/images/onboarding/HCicon.jpg")}
                style={{ width: "40%", height: "20%" }}
                resizeMode="contain"
            />
            <HCtext />
            <Image
                source={require("@/assets/images/onboarding/HCtext-secondary.png")}
                style={{ width: "50%", marginTop: -30 }}
                resizeMode="contain"
            />
        </View>
    );
};

export default Splashscreen;
