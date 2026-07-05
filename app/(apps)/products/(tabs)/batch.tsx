import Draft from "@/components/products/Draft";
import CustomStackTwo from "@/components/stacks/CustomStackTwo";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const batch = () => {
  const router = useRouter();
  const iconPress = () => {
    router.push("/(apps)/products/(other)");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomStackTwo
        header="RESTOCK"
        desc="View, Add and Edit Batches"
        icon="add"
        onIconPress={iconPress}
      />
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
        style={{ flex: 1 }}
      >
        <Draft />
        <Draft />
        <Draft />
        <Draft />
      </ScrollView>
    </SafeAreaView>
  );
};

export default batch;
