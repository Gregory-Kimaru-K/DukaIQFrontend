import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type StackProps = {
  header: string;
  desc: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onIconPress?: () => void;
};
const CustomStackTwo = ({ header, desc, icon, onIconPress }: StackProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="grid" size={40} color={Colors.brand.ORANGE} />
      <View style={styles.text_cont}>
        <MaskedView
          maskElement={
            <Text style={[globalStyles.h1pro, styles.maskedText]}>
              {header}
            </Text>
          }
        >
          <LinearGradient
            colors={["#E66413", "#EC8124", "#F29D35", "#FED757"]}
            start={[0, 0]}
            end={[0.5, 0]}
            style={styles.gradient}
          >
            <Text style={[globalStyles.h1pro, styles.gradientText]}>
              {header}
            </Text>
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
      <Pressable style={styles.Icon} onPress={onIconPress}>
        <Ionicons name={icon} color="#FFFFFF" size={32} />
        <View style={styles.products}>
          <Text style={globalStyles.text}>2</Text>
        </View>
      </Pressable>
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
  text_cont: {
    alignItems: "center",
  },

  Icon: {
    backgroundColor: Colors.brand.BLUE,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  products: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: Colors.brand.ORANGE,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
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
export default CustomStackTwo;
