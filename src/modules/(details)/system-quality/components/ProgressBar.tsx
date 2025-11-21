import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
    progress: number; // 0 - 100
    height?: number;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 14, className }) => {
    const clamped = Math.min(100, Math.max(0, progress));

    return (
        <View className={`${className}`}>
            <View
                className="w-full bg-gray-300 overflow-hidden"
                style={{
                    borderRadius: height,
                    height: height,
                }}>
                <View className="bg-green-400 h-full" style={{ width: `${clamped}%` }} />
            </View>
        </View>
    );
};

export default ProgressBar;
