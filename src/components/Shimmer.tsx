import React from "react";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useWindowDimensions, type DimensionValue } from "react-native";

const BaseShimmer = createShimmerPlaceholder(LinearGradient);

type ShimmerProps = {
    width?: DimensionValue;
    height?: number;
    className?: string;
    rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
    style?: object;
};

const roundedMap = {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 24,
    full: 9999,
};

export const Shimmer: React.FC<ShimmerProps> = ({
    width,
    height = 100,
    rounded = "lg",
    style = {},
}) => {
    const { width: screenWidth } = useWindowDimensions();

    // Kalkulasi width: jika ada width prop gunakan itu, kalau tidak gunakan screen width
    const calculatedWidth = width ? (typeof width === "number" ? width : screenWidth) : screenWidth;

    return (
        <BaseShimmer
            width={calculatedWidth}
            height={height}
            shimmerColors={["#E5E7EB", "#F3F4F6", "#E5E7EB"]}
            style={{
                borderRadius: roundedMap[rounded],
                ...style,
            }}
        />
    );
};

// Card Shimmer untuk card-card di Home
export const CardShimmer: React.FC<{
    className?: string;
    variant?: "full" | "half";
}> = ({ variant = "full" }) => {
    const { width: screenWidth } = useWindowDimensions();

    let cardWidth: number;

    if (variant === "full") {
        cardWidth = screenWidth * 0.84;
    } else {
        cardWidth = screenWidth * 0.38;
    }

    return <Shimmer height={200} rounded={"3xl"} width={cardWidth} />;
};
