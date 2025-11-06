import { Typography } from "@/src/components/Typography";
import React from "react";
import { View } from "react-native";

const Home = () => {
    return (
        <View className="flex items-center justify-center bg-green-300 flex-1">
            <Typography variant="h1">Dashboard</Typography>
        </View>
    );
};

export default Home;
