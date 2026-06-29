import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors'
import CustomStack from '@/components/CustomStack'
import { globalStyles } from '@/constants/styles'
import { SafeAreaView } from 'react-native-safe-area-context'

const Index = () => {
  return (
    <SafeAreaView>
      <CustomStack header='SELL' desc="Create, View, edit and delete sales" stackType='type1'/>
      <ScrollView style={globalStyles.container}>
        <View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Index