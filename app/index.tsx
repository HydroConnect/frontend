import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const index = () => {
    return (
        <View className="flex-1 items-center justify-center bg-pink-300">
            <Text className="">hydroconnect pelis aku butuh duithh</Text>
            <Link href={"/ApiTest"} push asChild>
                <TouchableOpacity className="bg-slate-400 w-40 h-20 flex justify-center items-center">
                    <Text className="font-bold">Api Test</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default index;
