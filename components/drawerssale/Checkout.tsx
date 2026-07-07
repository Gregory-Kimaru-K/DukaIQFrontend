import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckItem from "./CheckItem";
import Total from "../sales/Total";
import CheckHead from "../sales/CheckHead";

type CheckoutProps = {
  closeOne: () => void;
  openTwo: (index: number) => void;
}

const Checkout = ({closeOne, openTwo} : CheckoutProps) => {
  const handlePayments = () => {
    closeOne()
    openTwo(3)
  }
  return (
    <SafeAreaView style={styles.container}>
      <CheckHead head="CART" />
      <Pressable style={{ alignItems: "center" }}>
        <LinearGradient
          colors={["#07439F", "#031e47", "#021025"]}
          start={[0, 0]}
          end={[0, 1]}
          style={globalStyles.scan}
        >
          <Ionicons name="image" size={56} color={Colors.brand.ORANGE} />
        </LinearGradient>
      </Pressable>
      <Total handlePayments={handlePayments} />
      <View style={{ paddingBottom: 50 }}>
        <CheckItem />
        <CheckItem />
        {/* <CheckItem />
        <CheckItem />
        <CheckItem />
        <CheckItem />
        <CheckItem />
        <CheckItem />
        <CheckItem />
        <CheckItem />
        <CheckItem /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
});
export default Checkout;
