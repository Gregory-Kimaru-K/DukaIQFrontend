import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '@/constants/styles'
import CheckItem from '../drawerssale/CheckItem'
import { Image } from 'expo-image'
import Total from '../sales/Total'
import CheckHead from '../sales/CheckHead'
import { SafeAreaView } from 'react-native-safe-area-context'

const RestockDraw = () => {
    const handlePay =() => {}
    return (
        <SafeAreaView style={styles.container}>
            <CheckHead head='Restock' />
            <View style={globalStyles.image_cont}>
                <Image source={require("../../assets/Supplier.png")} style={globalStyles.image} />
            </View>
            <Total handlePayments={handlePay} />
            <View>
                <CheckItem restock={true} />
                {/* <CheckItem restock={true} />
                <CheckItem restock={true} />
                <CheckItem restock={true} />
                <CheckItem restock={true} />
                <CheckItem restock={true} />
                <CheckItem restock={true} />
                <CheckItem restock={true} /> */}

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        gap: 12
    }
})
export default RestockDraw