import MiniSummary from "@/components/sales/MiniSummary";
import Sale from "@/components/sales/Sale";
import CustomStack from "@/components/stacks/CustomStack";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Transactions = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStack
        header="TRANSACTIONS"
        desc="View, edit and delete sales"
        stackType="type1"
      />
      <ScrollView style={globalStyles.container}>
        <MiniSummary />
        <Text
          style={[
            globalStyles.h2,
            { fontWeight: "bold", textAlign: "center", marginVertical: 12 },
          ]}
        >
          All Transactions
        </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  add_btn: {
    position: "fixed",
    bottom: 110,
    backgroundColor: Colors.brand.ORANGE,
    width: "56%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  view: {
    paddingBottom: 140,
  },
});

export default Transactions;
