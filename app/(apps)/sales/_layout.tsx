import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const SalesLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name='statistics' options={{
            title: "one"
        }}/>
        <Tabs.Screen name='index' options={{
            title: "two"
        }}/>
        <Tabs.Screen name='transactions' options={{
            title: "three"
        }}/>
    </Tabs>
  )
}

export default SalesLayout