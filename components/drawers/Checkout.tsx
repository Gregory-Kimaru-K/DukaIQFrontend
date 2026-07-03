import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckItem from "./CheckItem";

type CheckoutProps = {
  closeOne: () => void;
  openTwo: (index: number) => void;
}

const Checkout = ({closeOne, openTwo} : CheckoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Text style={globalStyles.h1pro}>Cart</Text>
        <Pressable>
          <Text style={{ color: "red", fontSize: 18 }}>Clear</Text>
        </Pressable>
      </View>
      <Pressable style={{ alignItems: "center" }}>
        <LinearGradient
          colors={["#07439F", "#031e47", "#021025"]}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.scan}
        >
          <Ionicons name="image" size={56} color={Colors.brand.ORANGE} />
        </LinearGradient>
      </Pressable>
      <View style={styles.total}>
        <Text style={[globalStyles.h2, { fontWeight: "bold" }]}>TOTAL</Text>
        <Pressable style={styles.btn}>
          <Text
            style={[
              globalStyles.h2,
              { fontWeight: "bold", color: Colors.brand.ORANGE },
            ]}
          >
            KSH. 1,800
          </Text>
        </Pressable>
      </View>
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
  head: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  scan: {
    width: "64%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  total: {
    flexDirection: "row",
    padding: 12,
    paddingVertical: 20,
    justifyContent: "space-between",
    borderBottomWidth: 3,
    borderColor: Colors.brand.ORANGE,
    alignItems: "center",
  },
  btn: {
    backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
    padding: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 8,
  },
});
export default Checkout;
