import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '@/constants/styles'

type CheckHeadType = {
    head: string;
}
const CheckHead = ({ head } : CheckHeadType) => {
  return (
    <View style={styles.head}>
            <Text style={globalStyles.h1pro}>{head}</Text>
            <Pressable>
              <Text style={{ color: "red", fontSize: 18 }}>Clear</Text>
            </Pressable>
          </View>
  )
}

const styles = StyleSheet.create({
    head: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 12,
    },
})
export default CheckHead