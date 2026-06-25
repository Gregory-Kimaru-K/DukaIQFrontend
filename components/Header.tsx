import MaskedView from "@react-native-masked-view/masked-view";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/Ultra/Ultra-Regular.ttf"),
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
          colors={["#ff6b6b", "#ffbb3b", "#6bffb4"]}
          start={[0, 0]}
          end={[1, 0]}
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
