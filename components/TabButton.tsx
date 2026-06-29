import { Colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TabTriggerSlotProps } from "expo-router/ui";
import { MotiPressable } from "moti/interactions";
import React, { ComponentProps, ComponentType, forwardRef, Ref } from "react";
import { StyleSheet, View } from "react-native";

const SafeMotiPressable = MotiPressable as unknown as ComponentType<any>;

type Icon = ComponentProps<typeof Ionicons>["name"];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  ref?: Ref<View>;
};

export const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { icon, isFocused, ...props },
  ref,
) {
  return (
    <SafeMotiPressable
      {...(props as any)}
      ref={ref}
      style={styles.button}
      animate={{
        scale: isFocused ? 1.08 : 1,
        backgroundColor: isFocused ? "#E66413" : "transparent"
      }}
      transition={{
        type: "spring",
        damping: 16,
        stiffness: 180,
      }}
    >
      <Ionicons name={icon} size={28} color="#FFFFFF" />
    </SafeMotiPressable>
  );
});

TabButton.displayName = "TabButton";

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    width: 56,
    height: 56,
  },
});
