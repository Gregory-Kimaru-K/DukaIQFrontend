import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStack from '@/components/stacks/CustomStack'

const statistics = () => {
  return (
    <SafeAreaView>
      <CustomStack header='STATISTICS' desc='Analyse Products Trends' />
      <Text>statistics</Text>
    </SafeAreaView>
  )
}

export default statistics