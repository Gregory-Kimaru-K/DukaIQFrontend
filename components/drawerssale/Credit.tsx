import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import CoutryPickerComp from "../sales/CoutryPickerComp";
import DropDown from "../sales/DropDown";

const customerOptions = [
  { id: "1", label: "John Doe" },
  { id: "2", label: "Jane Kamau" },
  { id: "3", label: "David Mwangi" },
  { id: "4", label: "Susan Wanjiru" },
  { id: "5", label: "Michael Otieno" },
  { id: "6", label: "Amy Wendo" },
  { id: "7", label: "What Fuck" },
  { id: "8", label: "Grego Otis" },
  { id: "9", label: "Hellen Someone" },
  { id: "10", label: "Dont Knoow" },
];

const Credit = () => {
  const [customerName, setCustomerName] = useState("");
  return (
    <SafeAreaView style={{ gap: 12 }}>
      <Pressable>
        <Ionicons name="chevron-back-outline" color={"#ffffff"} size={32} />
      </Pressable>
      <Text style={[globalStyles.h1pro, { textAlign: "center" }]}>
        PAY WITH MPESA
      </Text>
      <Text
        style={[
          globalStyles.h1pro,
          { textAlign: "center", color: Colors.brand.ORANGE },
        ]}
      >
        KSH. 1800
      </Text>

      <View style={{ alignSelf: "center", width: "100%" }}>
        <Text style={globalStyles.text}>Customer Name</Text>
        <DropDown
          data={customerOptions}
          value={customerName}
          placeholder="Search customer"
          onSelect={(item) => setCustomerName(item.label)}
          noDataMessage="No matching customer"
        />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={globalStyles.text}>Customer Phone Number</Text>
        <View style={styles.textCont}>
          <CoutryPickerComp />
          <TextInput
            style={styles.textin}
            placeholder="7xx-xxx-xxx"
            placeholderTextColor={"#ffffff1d"}
            keyboardType="name-phone-pad"
          />
        </View>
      </View>

      <Pressable style={styles.btn}>
        <Image
          source={require("../../assets/debtwt.png")}
          style={styles.image}
        />
        <Text style={globalStyles.h4}>Credit Payment</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image_cont: {
    backgroundColor: "rgba(230, 100, 19, 0.48)",
    padding: 12,
    alignSelf: "center",
    borderRadius: 16,
  },
  textCont: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textin: {
    backgroundColor: Colors.brand.BLUE,
    width: "78%",
    color: "#ffffff",
    fontSize: 24,
    padding: 8,
    borderRadius: 8,
  },
  image: {
    width: 28,
    height: 28,
  },
  btn: {
    flexDirection: "row",
    width: "72%",
    height: 64,
    justifyContent: "space-around",
    backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
    alignItems: "center",
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 40,
  },
  dropdown: {
    backgroundColor: Colors.brand.BLUE,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  droptype: {
    width: "86%",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    fontSize: 18,
  },
});

export default Credit;
