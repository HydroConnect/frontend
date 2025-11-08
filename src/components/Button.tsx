import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Pressable, View } from "react-native";
import { Typography } from "./Typography";

interface ButtonProps {
    label: string;
    variant: "primary" | "secondary";
    onPress: () => void;
    isIcon?: boolean;
    icon?: (props: { color: string; size: number }) => React.ReactNode;
    iconPosition?: "left" | "right";
    iconColor?: string;
    iconSize?: number;
    textVariant?: "d1" | "d2" | "h1" | "h2" | "h3" | "title" | "body" | "label" | "c1" | "c2";
    textWeight?: "regular" | "semibold";
    className?: string;
}

const Button = ({
    label,
    variant,
    onPress,
    isIcon = true,
    icon,
    iconPosition = "right",
    iconColor,
    iconSize = 20,
    textVariant = "d2",
    textWeight = "semibold",
    className,
}: ButtonProps) => {
    const defaultIconColor = variant === "primary" ? "#f5f5f5" : "#3B6B50"; // white or green-700
    const finalIconColor = iconColor || defaultIconColor;

    // Default icon adalah chevron right
    const defaultIcon = (props: { color: string; size: number }) => (
        <Entypo name="chevron-right" {...props} />
    );

    const finalIcon = icon || defaultIcon;

    return (
        <Pressable
            className={`py-3 rounded-[18px] flex flex-row items-center justify-center ${variant === "primary" ? "bg-green-500" : "bg-green-50"} ${className}`}
            onPress={onPress}>
            <View className="flex flex-row items-center gap-2">
                {isIcon &&
                    iconPosition === "left" &&
                    finalIcon({ color: finalIconColor, size: iconSize })}
                <Typography
                    variant={textVariant}
                    weight={textWeight}
                    className={`${variant === "primary" ? "text-white" : "text-green-700"}`}>
                    {label}
                </Typography>
                {isIcon &&
                    iconPosition === "right" &&
                    finalIcon({ color: finalIconColor, size: iconSize })}
            </View>
        </Pressable>
    );
};

export default Button;
