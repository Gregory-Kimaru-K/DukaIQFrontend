import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors';
import { globalStyles } from '@/constants/styles';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const index = () => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <Text style={[globalStyles.h1, {textAlign: "center", marginTop: 32}]}>DUKAIQ APPLICATIONS</Text>
            <LinearGradient
                colors={[Colors.brand.DARK_BLUE, "#011940", "#011940", "#011940", Colors.brand.DARK_BLUE]}
                start={[0,0]}
                end={[0,1]}
                style={styles.gradient}
            >                    
                <Pressable style={styles.btn}>
                    <Image source={require("../../assets/Messaging.png")} style={styles.image} />
                    <Text style={globalStyles.text}>MESSAGES</Text>
                </Pressable>
                <Pressable 
                    style={styles.btn}
                    onPress={() => router.navigate("/(apps)/sales/(tabs)")}>
                    <Image source={require("../../assets/cart.png")} style={styles.image} />
                    <Text style={globalStyles.text}>SALES</Text>
                </Pressable>
                <Pressable style={styles.btn}>
                    
                    <Image source={require("../../assets/Settings.png")} style={styles.image} />
                    <Text style={globalStyles.text}>SETTINGS</Text>
                </Pressable>
                <Pressable
                    style={styles.btn}
                    onPress={() => router.navigate("/(apps)/products/(tabs)")}>
                    <Image source={require("../../assets/Portraits.png")} style={styles.image} />
                    <Text style={globalStyles.text}>PRODUCTS</Text>
                </Pressable>
                <Pressable style={styles.btn}>
                    <Image source={require("../../assets/chart.png")} style={styles.image} />
                    <Text style={globalStyles.text}>ANALYTICS</Text>
                </Pressable>
                <Pressable style={styles.btn}>
                    
                    <Image source={require("../../assets/Expense.png")} style={styles.image} />
                    <Text style={globalStyles.text}>EXPENSES</Text>
                </Pressable>

                <Pressable style={styles.btn}>
                    <Image source={require("../../assets/Tax.png")} style={styles.image} />
                    <Text style={globalStyles.text}>TAX</Text>
                </Pressable>

                <Pressable
                    style={styles.btn}
                    onPress={() => router.navigate("/(apps)/creditors/(tabs)")}>
                    <Image source={require("../../assets/Debt.png")} style={styles.image} />
                    <Text style={globalStyles.text}>CREDITORS</Text>
                </Pressable>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.brand.DARK_BLUE,
        gap: 32
    },
    btn: {
        width: 88,
        height: 88,
        backgroundColor: Colors.brand.LIGHT_DARK_BLUE,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 12
    },
    gradient: {
        width:"100%",
        // height: "100%",
        paddingVertical: 64,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
    },
    image: {
        width: 52,
        height: 52
    },
})
export default index