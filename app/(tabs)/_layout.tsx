import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name='index' options={{ title: "Home" }} />
        <Tabs.Screen name='sales' options={{ title: "Sales" }} />
        <Tabs.Screen name='products' options={{ title: "Products" }} />
        <Tabs.Screen name='analytics' options={{ title: "Analytics" }} />
    </Tabs>
  )
}

export default TabLayout