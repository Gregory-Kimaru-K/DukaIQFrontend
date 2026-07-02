import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const Search = () => {
    return (
        <View style={styles.container}>
            <TextInput placeholder="Search Product" placeholderTextColor={"#ffffff75"} style={styles.input} />
            <View style={styles.icon}>
                <Ionicons name='search' size={24} color={"#ffffff"} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        alignSelf: "center",
        marginVertical: 12
    },
    input: {
        backgroundColor: Colors.brand.LIGHT_DARK_BLUE,
        width: "64%",
        height: 48,
        borderRadius: 20,
        padding: 12
    },
    icon: {
        backgroundColor: Colors.brand.BLUE,
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
    }
});

export default Search