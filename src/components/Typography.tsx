import React from "react";
import { Text as RNText, type TextProps } from "react-native";

type TypoVariant = "d1" | "d2" | "h1" | "h2" | "h3" | "title" | "body" | "label" | "c1" | "c2";

type TypoWeight = "regular" | "semibold";

interface TypographyProps extends TextProps {
    children: React.ReactNode;
    variant: TypoVariant;
    weight?: TypoWeight;
    className?: string;
    key?: string | number;
}

const variantStyles: Record<TypoVariant, string> = {
    d1: "text-d1",
    d2: "text-d2",
    h1: "text-h1",
    h2: "text-h2",
    h3: "text-h3",
    title: "text-title",
    body: "text-body",
    label: "text-label",
    c1: "text-c1",
    c2: "text-c2",
};

const weightStyles: Record<TypoWeight, string> = {
    regular: "font-sans",
    semibold: "font-sans-semibold",
};

// 7. Komponennya
export function Typography({
    children,
    variant,
    weight = "regular", // Default-nya 'regular'
    className = "",
    ...props // Untuk props lain (cth: style, onPress)
}: TypographyProps) {
    // Gabungkan semua style
    const finalClassName = `${variantStyles[variant]} ${weightStyles[weight]} ${className}`;

    return (
        <RNText className={finalClassName} {...props}>
            {children}
        </RNText>
    );
}
