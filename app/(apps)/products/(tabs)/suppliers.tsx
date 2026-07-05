import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'

const suppliers = () => {
  const router = useRouter()
  const iconPress = () => {
    router.push("/(apps)/products/(other)")
  }
  return (
    <SafeAreaView>
      <CustomStackTwo header='SUPPLIERS' desc='Create and View' icon='add' onIconPress={iconPress} />
      <Text>suppliers</Text>
    </SafeAreaView>
  )
}

export default suppliers