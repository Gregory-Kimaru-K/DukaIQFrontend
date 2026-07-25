import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'

interface TotalProps {
    handlePayments: () => void;
    draft?: boolean;
    label?: string;
}

const Total = ({ handlePayments, draft=false, label }: TotalProps) => {
    return (
        <View style={styles.total}>
            <Text style={[globalStyles.h2, { fontWeight: "bold" }]}>TOTAL</Text>
            <Pressable
                style={styles.btn}
                onPress={handlePayments}>
                <Text
                    style={[
                    globalStyles.h2,
                    { fontWeight: "bold", color: Colors.brand.ORANGE },
                    ]}
                >
                    {label ?? (draft ? "0 Products" : "KSH. 1,800")}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    total: {
        flexDirection: "row",
        padding: 12,
        paddingVertical: 20,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: Colors.brand.ORANGE,
        alignItems: "center",
      },
    btn: {
        backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
        padding: 12,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 8,
    },
})

export default Total
