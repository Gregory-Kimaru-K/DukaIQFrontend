import { View, Text } from 'react-native'
import React from 'react'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors'

const index = () => {
  const router = useRouter()
  const iconPress = () => {
    router.push("/(apps)/products/(other)")
  }
  return (
    <SafeAreaView>
      <CustomStackTwo header='RESTOCK' desc='Draft, Create and View' icon='add' onIconPress={iconPress} />
      <Text>index</Text>
    </SafeAreaView>
  )
}

export default index