import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Product as ProductModel } from '@/databases/models/products/Product'

type ProductProps = {
    isFocused?: boolean;
    product: ProductModel;
    draft?: boolean;
    quantity?: number;
    onPress?: (product: ProductModel) => void;
    updated_at?: string;
};

const Product = ({ isFocused: isFocusedProp = false, product, onPress, quantity, draft, updated_at }: ProductProps) => {
    const [isFocusedState, setIsFocusedState] = useState(false);
    const isFocused = isFocusedProp || isFocusedState;

    return (
        <Pressable
            focusable
            onFocus={() => setIsFocusedState(true)}
            onBlur={() => setIsFocusedState(false)}
            onPress={() => onPress?.(product)}
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
                        style={[ globalStyles.h4, styles.wrap, { fontWeight: "bold", color: isFocused ? Colors.brand.LIGHT_BLUE : Colors.text.WHITE } ]}
                        >
                        {product.name}
                    </Text>
                    <View style={{ backgroundColor: isFocused ? Colors.brand.LIGHT_BLUE : "#07449f92", padding: 3.2, borderRadius: 5 }}>
                        <Text style={globalStyles.text}>{product.shop.name}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={[ globalStyles.text, { color: isFocused ? Colors.brand.LIGHT_BLUE : Colors.text.WHITE }, ]} >{draft ? quantity : product.current_stock} {product.unit}</Text>
                    <Text style={[ globalStyles.text, { color: isFocused ? Colors.brand.LIGHT_BLUE : Colors.text.WHITE } ]}>
                        Updated at {
                          (() => {
                            const raw = draft ? updated_at : product.updated_at;
                            return raw
                              ? new Date(raw).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
                              : "--:--";
                          })()
                        }
                      </Text>
               
                </View>
            </View>
            <Pressable onPress={() => onPress?.(product)}>
            <Ionicons
                name={"chevron-forward"}
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
    alignItems: "center",
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
  wrap: {
    width: "50%",
    flexWrap: "wrap",
  },
});

export default Product;
