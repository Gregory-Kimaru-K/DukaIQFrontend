import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProductsLayout = () => {
    return (
        <Stack initialRouteName='(tabs)'>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='(other)' options={{ headerShown: false }} />
        </Stack>
    )
}

export default ProductsLayout