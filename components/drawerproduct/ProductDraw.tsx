import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '@/constants/styles'
import Search from '../Search'
import { Image } from 'expo-image'

const ProductDraw = () => {
  return (
    <View style={styles.container}>
        <View style={globalStyles.image_cont}>
        <Image source={require("../../assets/Portraits.png")} style={globalStyles.image} />
        </View>
      <Text style={[globalStyles.h1, { textAlign: "center" }]}>Draft Products</Text>
      <Search />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingTop: 12
  },
    image_cont: {
      backgroundColor: "rgba(230, 100, 19, 0.48)",
      padding: 12,
      alignSelf: "center",
      borderRadius: 16,
    },
})

export default ProductDraw