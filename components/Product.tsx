import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Product = ({
        image,
        isFocused = false,
        }: {
        image: string;
        isFocused?: boolean;
    }) => {
    return (
        <Pressable style={[styles.container, isFocused && styles.containerFocused]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={[styles.image_cont, isFocused && styles.image_contf]}>
                    {image === "img1" ? (
                        <Image
                            source={require("../assets/Flour.png")}
                            style={{ width: 40, height: 40 }}
                        />
                    ) : (
                        <Image
                            source={require("../assets/milbottle.png")}
                            style={{ width: 40, height: 40 }}
                        />
                    )}
                </View>
                {isFocused && (
                    <View style={styles.quantity}>
                        <Text style={globalStyles.text}>2</Text>
                    </View>
                )}
            </View>
            <Text style={globalStyles.text}>Product 1</Text>
            <Text style={styles.price}>KSH.200/UNIT</Text>
        </Pressable>
    )};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.brand.LIGHT_DARK_BLUE,
        width: 160,
        height: 160,
        padding: 10,
        borderRadius: 8,
        gap: 12,
        justifyContent: "center",
    },
    containerFocused: {
        backgroundColor: Colors.brand.LIGHT_BLUE,
    },
    image_cont: {
        backgroundColor: Colors.brand.LIGHT_BLUE,
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginBottom: 8,
    },
    image_contf: {
        backgroundColor: Colors.brand.BLUE
    },
    price: {
        color: Colors.brand.ORANGE,
        fontSize: 16,
        fontWeight: "bold",
    },
    quantity: {
        backgroundColor: Colors.brand.ORANGE,
        width: 20,
        height: 20,
        alignItems:"center",
        justifyContent: "center",
        borderRadius: "50%"
    }
});

export default Product;
