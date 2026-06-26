import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

const index = () => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <Text style={styles.text}>index apps</Text>
            <Button title="Sales" onPress={() => router.push('/sales')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.brand.DARK_BLUE,
    },
    text: {
        color: "#ffffff"
    }
})
export default index