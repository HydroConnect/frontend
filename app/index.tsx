import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-pink-300">
      <Text>hydroconnect pelis aku butuh duithh</Text>

      <TouchableOpacity
        onPress={() => router.push("/ApiTest")}
        className="bg-slate-400 w-40 h-20 flex justify-center items-center mt-4"
      >
        <Text className="font-bold">Api Test</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/home")}
        className="bg-red-200 w-40 h-20 flex justify-center items-center mt-4"
      >
        <Text className="font-bold">Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
