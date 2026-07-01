import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/stacks/Header';
import { Colors } from '@/constants/colors';

const AppsLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: Colors.brand.DARK_BLUE
            },
            headerTitle: () => <Header />,
            }} />
        <Stack.Screen name='sales' options={{
            headerShown: false
        }} />
    </Stack>
  )
}

export default AppsLayout