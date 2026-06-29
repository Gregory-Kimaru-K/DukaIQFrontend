import { View, Text } from 'react-native'
import React from 'react'
import CustomStack from '@/components/CustomStack'
import { globalStyles } from '@/constants/styles'
import { SafeAreaView } from 'react-native-safe-area-context'

const Transactions = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStack header='TRANSACTIONS' desc="View, edit and delete sales" stackType='type1'/>
      <Text style={globalStyles.h1}>Transactions</Text>
    </SafeAreaView>
  )
}

export default Transactions