import { Colors } from "@/constants/colors";
import { Stack } from "expo-router";
import React from "react";

const ProdOthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.brand.DARK_BLUE },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default ProdOthLayout;
