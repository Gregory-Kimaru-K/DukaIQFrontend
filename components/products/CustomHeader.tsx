import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { globalStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

interface CustomHeaderProps {
    title: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    handleIconPress?: () => void;
}

const CustomHeader = ({ title, icon, handleIconPress }: CustomHeaderProps) => {
    return (
        <View style={styles.container}>
            <Text style={globalStyles.h1}>{title}</Text>
            <Pressable style={styles.btn} onPress={() => handleIconPress?.()}>
                <Ionicons name={icon} size={24} color="#ffffff" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    btn: {
        backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
        padding: 12,
        borderRadius: "50%",
    }
})
export default CustomHeader