import React from "react";
import { View, Text, Pressable } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "@/src/components/Typography";

interface InfoTooltipProps {
    content: React.ReactNode; // Isinya bisa text biasa atau komponen (list, dll)
    iconSize?: number;
    iconColor?: string;
}

export const InfoTooltip = ({
    content,
    iconSize = 24,
    iconColor = "#7D9F8C",
}: InfoTooltipProps) => {
    return (
        <Popover
            placement={PopoverPlacement.AUTO}
            arrowSize={{ width: 0, height: 0 }}
            from={
                <Pressable className="pr-1">
                    <Ionicons name="help-circle" size={iconSize} color={iconColor} />
                </Pressable>
            }
            popoverStyle={{ borderRadius: 16, padding: 16, backgroundColor: "white" }}
            animationConfig={{ duration: 200 }}>
            <View className="max-w-[250px]">{content}</View>
        </Popover>
    );
};
