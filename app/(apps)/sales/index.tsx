import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors'

const Index = () => {
  return (
    <ScrollView style={styles.container}>
      <Text>Index</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.brand.DARK_BLUE
  }
})

export default Index