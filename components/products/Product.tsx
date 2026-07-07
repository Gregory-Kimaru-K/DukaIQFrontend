import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons'
import { globalStyles } from '@/constants/styles'
import { Colors } from '@/constants/colors'

const Product = () => {
    return (
        <View style={styles.container}>
            <View style={styles.image_cont}>
                <Image source={require("../../assets/Portraits.png")} style={styles.image} />
            </View>
            <View style={{ width: "72%", gap: 12 }}>
                <View style={styles.row}>
                    <Text style={[globalStyles.h4, {fontWeight: "bold"}]}>PRODUCT-XXXX</Text>
                    <View style={{ backgroundColor: "#07449f92", padding: 3.2, borderRadius: 5 }}>
                        <Text style={globalStyles.text}>Shop_1</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={globalStyles.text}>20 Unit</Text>
                    <Text style={globalStyles.text}>Updated at 5:12PM</Text>
                </View>
            </View>
            <Ionicons name='chevron-forward' size={32} color={"#ffffff"} style={{ alignSelf: "center" }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#031f4ba2",
        width: "96%",
        alignSelf: "center",
        flexDirection: "row",
        paddingVertical:8,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.brand.DARK_LIGHT_BLUE
    },
    image_cont: {
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e6641366",
        borderRadius: 4
    },
    image: {
        height: 36,
        width: 36,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})

export default Product