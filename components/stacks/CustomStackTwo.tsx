import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface StackProps {
  header: string;
  desc: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onIconPress: () => void;
  count?:boolean;
  countNo?: number;
  draft?: boolean;
};
const CustomStackTwo = ({ header, desc, icon, onIconPress, count=false, countNo=0, draft=false }: StackProps) => {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/(apps)")}>
        <Ionicons name="grid" size={40} color={Colors.brand.ORANGE} />
      </Pressable>
      <View style={styles.text_cont}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.headerScroll}
          contentContainerStyle={styles.headerScrollContent}
        >
          <MaskedView
            maskElement={
              <Text numberOfLines={1} style={[styles.draftStyle, styles.maskedText]}>
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
              <Text numberOfLines={1} style={[styles.draftStyle, styles.gradientText]}>
                {header}
              </Text>
            </LinearGradient>
          </MaskedView>
        </ScrollView>

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
        {(count && countNo!==0) && (
          <View style={styles.products}>
            <Text style={globalStyles.text}>{countNo}</Text>
          </View>
        )}
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
    alignItems: "baseline",
    minWidth: 0,
    marginBottom: 4
  },
  headerScroll: {
    alignSelf: "center",
    maxHeight: 36
  },
  headerScrollContent: {
    alignItems: "flex-start",
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
    padding: 4,
    backgroundColor: Colors.brand.ORANGE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  gradient: {
    alignSelf: "flex-start",
  },
  maskedText: {
    color: "black",
  },
  gradientText: {
    color: "rgba(255,255,255,0)",
  },
  draftStyle: {
    ...globalStyles.h1,
    fontWeight: "700",
  }
});
export default CustomStackTwo;
