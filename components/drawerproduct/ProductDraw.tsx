import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { globalStyles } from '@/constants/styles'
import Search from '../Search'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/colors'
import CheckHead from '../sales/CheckHead'

const ProductDraw = () => {
  return (
    <View style={styles.container}>
      <CheckHead head='Draft Products' />
      <Pressable style={{ alignItems: "center" }}>
        <LinearGradient
        colors={["#07439F", "#031e47", "#021025"]}
        start={[0, 0]}
        end={[0, 1]}
        style={globalStyles.scan}
        >
          <Ionicons name="image" size={56} color={Colors.brand.ORANGE} />
        </LinearGradient>
      </Pressable>
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