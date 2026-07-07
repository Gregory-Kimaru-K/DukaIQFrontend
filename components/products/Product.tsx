import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ProductEdit from "./ProductEdit";

type ProductProps = {
    isFocused?: boolean;
};

const Product = ({ isFocused: isFocusedProp = false }: ProductProps) => {
    const [isFocusedState, setIsFocusedState] = useState(false);
    const isFocused = isFocusedProp || isFocusedState;
    const [open, setOpen] = useState(false)

    return (
        <Pressable
            focusable
            onFocus={() => setIsFocusedState(true)}
            onBlur={() => setIsFocusedState(false)}
            onLongPress={() => setIsFocusedState(!isFocused)}
            style={[
            styles.container,
            isFocused ? styles.containerFocused : styles.containerDefault,
            ]}
        >
            <View style={isFocused ? styles.image_cont_focused : styles.image_cont}>
                <Image source={isFocused ? require("../../assets/BluePortraits.png") : require("../../assets/Portraits.png")}
                    style={styles.image} />
            </View>


            <View style={{ width: "72%", gap: 12 }}>
                <View style={styles.row}>
                    <Text
                        style={[ globalStyles.h4,{ fontWeight: "bold",color: isFocused ? Colors.brand.LIGHT_BLUE : Colors.text.WHITE } ]}
                        >
                        PRODUCT-XXXX
                    </Text>
                    <View style={{ backgroundColor: isFocused ? Colors.brand.LIGHT_BLUE : "#07449f92", padding: 3.2, borderRadius: 5}}>
                        <Text style={globalStyles.text}>Shop_1</Text>
                    </View>
                </View>

                {open && <ProductEdit />}

                <View style={styles.row}>
                    <Text style={[ globalStyles.text, { color: isFocused ? Colors.brand.LIGHT_BLUE : Colors.text.WHITE }, ]} >20 Unit</Text>
                    <Text style={[ globalStyles.text, { color: isFocused ? Colors.brand.LIGHT_BLUE : Colors.text.WHITE } ]}>Updated at 5:12PM</Text>
                </View>
            </View>
            <Pressable onPress={() => setOpen(!open)}>
            <Ionicons
                name={open ? "chevron-down" : "chevron-forward"}
                size={32}
                color={isFocused ? Colors.brand.LIGHT_BLUE : "#ffffff"}
                style={{ alignSelf: "center" }}
            />
            </Pressable>
        </Pressable>
    );
};

const styles = StyleSheet.create({
  container: {
    width: "96%",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 8,
    justifyContent: "space-between",
    // alignItems: "center",
    paddingHorizontal: 4,
    borderRadius: 16,
  },
  containerDefault: {
    backgroundColor: "#031f4ba2",
    borderWidth: 1,
    borderColor: Colors.brand.DARK_LIGHT_BLUE,
  },
  containerFocused: {
    backgroundColor: Colors.brand.LIGHT_YELLOW,
  },
  image_cont: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#e6641366",
  },
  image_cont_focused: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#07449f81",
  },
  image: {
    height: 36,
    width: 36,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Product;
