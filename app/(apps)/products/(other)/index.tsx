import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'
import Search from '@/components/Search'

const Index = () => {
  const router = useRouter()

  const iconPress =() => {
    router.push("/(apps)/products/(tabs)")
  }
  return (
    <SafeAreaView style={{ backgroundColor: Colors.brand.DARK_BLUE, height: "100%" }}>
      <CustomStackTwo header='DRAFT-XXX' desc='Restock and View batches' icon='add' onIconPress={iconPress} />
      <Search />
    </SafeAreaView>
  )
}

export default Index