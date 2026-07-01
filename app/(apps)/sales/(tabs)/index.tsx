import Sale from "@/components/Sale";
import CustomStack from "@/components/stacks/CustomStack";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <CustomStack
        header="SELL"
        desc="Create, View, edit and delete sales"
      />
      <ScrollView style={globalStyles.container}>
        <View>
          <Text
            style={[
              globalStyles.text,
              { fontWeight: "bold", paddingVertical: 12 },
            ]}
          >
            Today
          </Text>
          {Array.from({ length: 30 }).map((_, i) => (
            <Sale key={i} />
          ))}
        </View>
        <View style={styles.view}>
          <Text
            style={[
              globalStyles.text,
              { fontWeight: "bold", paddingVertical: 12 },
            ]}
          >
            Yesterday
          </Text>
          {Array.from({ length: 30 }).map((_, i) => (
            <Sale key={i} />
          ))}
        </View>
      </ScrollView>
      <Pressable
        style={[globalStyles.add_btn, {position: "fixed", bottom: 110}]}
        onPress={() => router.push("/(apps)/sales/(other)")}
      >
        <Text style={[globalStyles.h2, { fontWeight: "700" }]}>ADD SALE</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingBottom: 1,
  },
});

export default Index;
