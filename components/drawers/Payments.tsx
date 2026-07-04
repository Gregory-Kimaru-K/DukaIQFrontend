import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CoutryPickerComp from "../CoutryPickerComp";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";



type PaymentsProps = {
  closeTwo: () => void;
  openOne: (index: number) => void;
};

const Payments = ({ closeTwo, openOne }: PaymentsProps) => {
  const handleBack = () => {
    closeTwo()
    openOne(3)
  }

  const [price, setPrice] = useState(1800)
  return (
    <SafeAreaView style={{ gap: 12 }}>
        <Pressable onPress={handleBack}>
            <Ionicons name="chevron-back-outline" color={"#ffffff"} size={32} />
        </Pressable>
      <View style={styles.image_cont}>
        <Image
          source={require("../../assets/iphone.png")}
          style={{ width: 56, height: 56 }}
        />
      </View>
      <Text style={[globalStyles.h1pro, { textAlign: "center" }]}>
        PAY WITH MPESA
      </Text>
        <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center" }}>
            <Text style={[ globalStyles.h1pro, { textAlign: "center", color: Colors.brand.ORANGE }] }>KSH.</Text>
            <TextInput
                style={[ globalStyles.h1pro, { textAlign: "center", color: Colors.brand.ORANGE }] }
                value={price.toString()}
                keyboardType="numeric"
                onChangeText={(text) => {
                    const value = Number(text);
                    setPrice(isNaN(value) ? 0 : value);
                }}
                />
        </View>
      <View style={{ gap: 4 }}>
        <Text style={globalStyles.text}>Customer Phone Number</Text>
        <View style={styles.textCont}>
           <CoutryPickerComp />
           <TextInput style={styles.textin} placeholder="7xx-xxx-xxx" keyboardType="name-phone-pad" placeholderTextColor={"#ffffff1d"}/>
        </View>
      </View>

        <View style={{ gap: 20, alignItems: "center", marginTop: 16 }}>
      <Pressable style={[styles.btn, {borderWidth: 0}]}>
        <Image source={require("../../assets/email.png")} style={styles.image}/>
        <Text style={globalStyles.h4}>Send Payment Request</Text>
      </Pressable>
      <Pressable style={styles.btn}>
        <Image source={require("../../assets/dollarwt.png")} style={styles.image}/>
        <Text style={globalStyles.h4}>Cash Payment</Text>
      </Pressable>
      <Pressable style={[styles.btn, {borderColor: Colors.brand.LIGHT_YELLOW}]}>
        <Image source={require("../../assets/debtwt.png")} style={styles.image}/>
        <Text style={globalStyles.h4}>Credit Payment</Text>
      </Pressable>
      </View>
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
        borderRadius: 8
    },
    image: {
        width: 28,
        height: 28
    },
    btn: {
        flexDirection: "row",
        width: "72%",
        height: 64,
        justifyContent: "space-around",
        backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.brand.ORANGE,
        borderRadius: 12
    }
});

export default Payments;
