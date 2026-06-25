import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from "../../components/Header"

const AppsLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{
            headerTitle: () => <Header />
            }} />
        <Stack.Screen name='sales' options={{
            headerShown: false
        }} />
    </Stack>
  )
}

export default AppsLayout