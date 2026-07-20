import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { BatchRepo } from "@/databases/repositories/BatchRepo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const createAndOpenDraft = async () => {
      try {
        const draft = await BatchRepo.createDraft();
        router.replace(`/(apps)/products/(other)/drafts/${draft.id}`);
      } catch (err) {
        console.error("Failed to create draft", err);
        setError("Could not create draft");
      }
    };

    createAndOpenDraft();
  }, [router]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.brand.DARK_BLUE,
        gap: 12,
      }}
    >
      <ActivityIndicator color={Colors.brand.ORANGE} />
      <Text style={globalStyles.text}>
        {error || "Creating draft..."}
      </Text>
    </SafeAreaView>
  );
};

export default Index;
