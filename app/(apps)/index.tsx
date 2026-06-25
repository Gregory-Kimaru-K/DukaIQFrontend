import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';

const index = () => {
    const router = useRouter()
    return (
        <View>
            <Text>index apps</Text>
            <Button title="Sales" onPress={() => router.push('/sales')} />
        </View>
    )
}
export default index