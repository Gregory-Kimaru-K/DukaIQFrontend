import CustomStack from "@/components/stacks/CustomStack";
import { globalStyles } from "@/constants/styles";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Statistics = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStack
        header="STATISTICS"
        desc="Analyze, View sales visually"
        stackType="type1"
      />
      <Text style={globalStyles.h1}>Statistics</Text>
    </SafeAreaView>
  );
};

export default Statistics;
