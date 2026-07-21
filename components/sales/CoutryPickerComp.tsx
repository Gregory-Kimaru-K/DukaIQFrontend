import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors';

const CoutryPickerComp = () => {
    return (
        <View>
            <Pressable
                style={{
                    backgroundColor: Colors.brand.BLUE,
                    padding: 12,
                    borderRadius: 6
                }}
            >
            <Text style={{ color: "#ffffff9c", fontSize: 16 }}>+254</Text>
            </Pressable>
        </View>
  )
}

const styles = StyleSheet.create({
    modal: {
        height: 500,
        backgroundColor: "#08162caa",
    },
    line: {
        backgroundColor: "#07439F",
    },
    countryButtonStyles: {
        width: "96%",
        height: 40,
        alignSelf: "center",
        backgroundColor: "#031f4b90",
        marginTop: 6,
    },
    dialCode: {
        color: "#ffffff",
    },
    // Country name styles [Text]
    countryName: {
        color: "#ffffff",
    },
    textInput: {
        backgroundColor: "#031f4bdc",
        color: "#ffffff"
    },
})
export default CoutryPickerComp
