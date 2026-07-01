import MaskedView from "@react-native-masked-view/masked-view";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

const Header = () => {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/Ultra/Ultra-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.header}>
      <MaskedView
        maskElement={
          <Text style={[styles.headerTitle, styles.maskedText]}>DUKAIQ</Text>
        }
      >
        <LinearGradient
          colors={[Colors.brand.WHITE_ORANGE, Colors.brand.LIGHT_YELLOW]}
          start={[0, 0.40]}
          end={[0, 0.64]}
          style={styles.gradient}
        >
          <Text style={[styles.headerTitle, styles.gradientText]}>DUKAIQ</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: Colors.brand.BLUE
  },
  gradient: {
    width: "100%",
  },
  headerTitle: {
    fontSize: 40,
    fontFamily: "Ultra",
    letterSpacing: 4,
  },
  maskedText: {
    color: "black",
  },
  gradientText: {
    color: "transparent",
  },
});

export default Header;
