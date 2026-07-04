import React from 'react'
import { Stack } from 'expo-router'

const CreditorLayout = () => {
    return (
    <Stack initialRouteName='(tabs)'>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='(other)' options={{ headerShown: false }} />
    </Stack>
    )
}

export default CreditorLayout