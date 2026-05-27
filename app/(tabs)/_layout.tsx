import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#ffd33d',
            headerStyle: {
                backgroundColor: '#25292e',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
                backgroundColor: '#25292e',
            },
        }}
    >

        <Tabs.Screen name='index'
            options={{
                    title: "Home",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
                    )
                }} />

        <Tabs.Screen name='sales'
            options={{
                    title: "Sales",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? "stats-chart-sharp" : "stats-chart-outline"} color={color} size={24} />
                    )
                }} />
        <Tabs.Screen name='products'
            options={{
                    title: "Products",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? "cube-sharp" : "cube-outline"} color={color} size={24} />
                    )
                }} />
        <Tabs.Screen name='analytics'
            options={{
                    title: "Analytics",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? "analytics-sharp" : "analytics-outline"} color={color} size={24} />
                    )
                }} />
    </Tabs>
  )
}

export default TabLayout