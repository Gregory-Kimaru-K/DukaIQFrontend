import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StackProps = {
    header: string,
    desc: string,
}
const CustomStack = ({header, desc}: StackProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.text_cont}>

        <MaskedView
          maskElement={
            <Text style={[globalStyles.h1pro, styles.maskedText]}>{header}</Text>
          }
        >
          <LinearGradient
            colors={["#E66413", "#EC8124", "#F29D35", "#FED757"]}
            start={[0, 0]}
            end={[0.5, 0]}
            style={styles.gradient}
          >
            <Text style={[globalStyles.h1pro, styles.gradientText]}>{header}</Text>
          </LinearGradient>
        </MaskedView>
        
        <MaskedView
            maskElement={
                <Text style={[globalStyles.text, styles.maskedText]}>{desc}</Text>
            }
        >
            <LinearGradient
                colors={["#E66413", "#EC8124", "#F29D35", "#FED757"]}
                start={[0, 0]}
                end={[0.8, 0]}
                style={styles.gradient}
                >
                <Text style={[globalStyles.text, styles.gradientText]}>{desc}</Text>
            </LinearGradient>
        </MaskedView>
      </View>
      <View style={styles.Icon}>
        <Ionicons name="grid" color={"#FFFFFF"} size={40} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: 80,
    borderBottomWidth: 4,
    backgroundColor: Colors.brand.DARK_BLUE,
    borderBottomColor: Colors.brand.BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  text_cont: {},
  Icon: {
    backgroundColor: Colors.brand.BLUE,
    padding: 4,
    borderRadius: 12,
  },
  gradient: {
    width: "100%",
  },
  maskedText: {
    color: "black",
  },
  gradientText: {
    color: "rgba(255,255,255,0)",
  },
});
export default CustomStack;
