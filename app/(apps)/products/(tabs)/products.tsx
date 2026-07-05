import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import { useRouter } from 'expo-router'

const products = () => {
  const router = useRouter()
  const IconPress = () => {
    router.push("/(apps)/products/(other)")
  }
  return (
    <SafeAreaView>
      <CustomStackTwo header="PRODUCTS" desc="Add, View Products" icon='add' onIconPress={IconPress} />
      <Text>products</Text>
    </SafeAreaView>
  )
}

export default products