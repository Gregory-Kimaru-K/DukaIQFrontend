import { View, Text } from 'react-native'
import React from 'react'
import CustomStack from '@/components/CustomStack'
import { globalStyles } from '@/constants/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, StyleSheet } from 'react-native'
import Sale from '@/components/Sale'
import { Colors } from '@/constants/colors'

const Transactions = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStack header='TRANSACTIONS' desc="View, edit and delete sales" stackType='type1'/>
       <ScrollView style={globalStyles.container}>
        <View>
          <Text></Text>
        </View>
        <View>
          <Text style={[globalStyles.text, {fontWeight: "bold", paddingVertical: 12}]}>Today</Text>
          {Array.from({ length: 30 }).map((_, i) => (
            <Sale key={i} />
          ))}
        </View>
        <View style={styles.view}>
          <Text style={[globalStyles.text, {fontWeight: "bold", paddingVertical: 12}]}>Yesterday</Text>
          {Array.from({ length: 30 }).map((_, i) => (
            <Sale key={i} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  add_btn: {
    position: "fixed",
    bottom: 110,
    backgroundColor: Colors.brand.ORANGE,
    width: "56%",
    height: 56,
    alignItems: "center",
    justifyContent:"center",
    alignSelf:"center",
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  view: {
    paddingBottom: 140
  }
})

export default Transactions