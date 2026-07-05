import { Stack } from "expo-router";
import React from "react";

const ProductsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(other)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ProductsLayout;
