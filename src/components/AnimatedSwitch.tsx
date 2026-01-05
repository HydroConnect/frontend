import React from "react";
import { Pressable } from "react-native";
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface AnimatedSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    trackColors?: { on: string; off: string };
    thumbColor?: string;
    duration?: number;
    className?: string;
}

const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({
    value,
    onValueChange,
    trackColors = { on: "#3B6850", off: "#D1D5DB" }, // green-500 and gray-300
    thumbColor = "#FFFFFF",
    duration = 300,
    className = "",
}) => {
    const height = useSharedValue(0);
    const width = useSharedValue(0);
    const animatedValue = useSharedValue(value ? 1 : 0);

    React.useEffect(() => {
        animatedValue.value = withTiming(value ? 1 : 0, { duration });
    }, [value]);

    const trackAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            animatedValue.value,
            [0, 1],
            [trackColors.off, trackColors.on]
        );

        return {
            backgroundColor: color,
            borderRadius: height.value / 2,
        };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const moveValue = interpolate(animatedValue.value, [0, 1], [0, width.value - height.value]);

        return {
            transform: [{ translateX: moveValue }],
            borderRadius: height.value / 2,
        };
    });

    return (
        <Pressable onPress={() => onValueChange(!value)}>
            <Animated.View
                onLayout={(e) => {
                    height.value = e.nativeEvent.layout.height;
                    width.value = e.nativeEvent.layout.width;
                }}
                className={`items-start w-[60px] h-[32px] p-[3px] ${className}`}
                style={trackAnimatedStyle}>
                <Animated.View
                    className="h-full aspect-square"
                    style={[thumbAnimatedStyle, { backgroundColor: thumbColor }]}
                />
            </Animated.View>
        </Pressable>
    );
};

export default AnimatedSwitch;
