import React from "react";
import { View, Text } from "react-native";
import { Typography } from "./Typography";

interface TooltipListItem {
    label: string;
    value: string;
}

interface TooltipContentProps {
    title?: string;
    description?: string;
    items?: TooltipListItem[];
}

export const TooltipContent = ({ title, description, items }: TooltipContentProps) => {
    return (
        <View>
            {/* 1. Render Judul (Kalau ada props title) */}
            {title && (
                <Typography variant="h3" weight="semibold" className="mb-2">
                    {title}
                </Typography>
            )}

            {/* 2. Render Deskripsi (Kalau ada props description) */}
            {description && (
                <Typography variant="body" weight="semibold" className="text-black leading-5">
                    {description}
                </Typography>
            )}

            {/* 3. Render List Items (Kalau ada props items) */}
            {items && items.length > 0 && (
                <View className="ml-2 mt-2">
                    {items.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body"
                            weight="semibold"
                            className="text-black mb-1">
                            {item.label}. {item.value}
                        </Typography>
                    ))}
                </View>
            )}
        </View>
    );
};
