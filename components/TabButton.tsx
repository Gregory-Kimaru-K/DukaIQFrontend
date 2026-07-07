import { Colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TabTriggerSlotProps } from "expo-router/ui";
import React, { ComponentProps, forwardRef, Ref, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type Icon = ComponentProps<typeof Ionicons>["name"];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  ref?: Ref<View>;
};

export const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { icon, isFocused, ...props },
  ref,
) {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["transparent", Colors.brand.ORANGE],
      ),
      transform: [
        {
          scale: 1 + progress.value * 0.08,
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      {...(props as any)}
      ref={ref}
      style={[styles.button, animatedStyle]}
    >
      <Ionicons name={icon} size={28} color="#FFFFFF" />
    </AnimatedPressable>
  );
});

TabButton.displayName = "TabButton";

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    width: 48,
    height: 48,
  },
});
