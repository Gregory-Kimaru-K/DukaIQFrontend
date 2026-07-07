import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'
import { StyleSheet, Image } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'


const CheckItem = ({ restock=false }: {restock?: boolean}) => {
    const [quantity, setQuantity] = useState(1)
    const [price, setPrice] = useState(600)
    return (
        <View style={styles.item}>
            <View style={styles.itemsCont}>
                <View style={styles.title}>
                    <Text style={{fontWeight: "bold", color: "#ffffff", fontSize: 18}}>Prod_1</Text>
                    <Text style={[globalStyles.text, {color: "#ffffff6b"}]}>KSH. 200 / Unit</Text>
                </View>
                <View style={styles.quantity}>
                    <Pressable style={styles.actionBtn} onPress={() => setQuantity(quantity-1)}>
                        <Ionicons name='remove' size={20} color={"#ffffff"} />
                    </Pressable>
                    <TextInput defaultValue={`${quantity}`} keyboardType='numeric' style={{ color: "#ffffff" }} />
                    <Pressable style={styles.actionBtn} onPress={() => setQuantity(quantity+1)}>
                        <Ionicons name='add' size={20} color={"#ffffff"} />
                    </Pressable>
                </View>
                {restock ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{fontWeight: "bold", color: Colors.brand.ORANGE, fontSize: 18}}>KSH.</Text>
                        <TextInput
                            value={price.toString()}
                            style={{fontWeight: "bold", color: Colors.brand.ORANGE, fontSize: 18}}
                             />
                    </View>
                )
                    :
                    <Text style={{fontWeight: "bold", color: Colors.brand.ORANGE, fontSize: 18}}>KSH. 600</Text>

                }
                <Pressable>
                    <Ionicons name='close-circle' size={28} color={Colors.brand.LIGHT_BLUE} />
                </Pressable>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    item: {
        padding: 8,
        borderBottomWidth: 2,
        borderBottomColor: Colors.brand.LIGHT_BLUE
    },
    itemsCont: {
        width: "100%",
        flexDirection: "row",
        alignItems:"center",
        justifyContent: "space-between"
    },
    title: {
        gap: 8,
        alignItems: "center"
    },
    actionBtn: {
        borderWidth: 2,
        borderColor: Colors.brand.LIGHT_BLUE,
        borderRadius: 6
    },
    quantity: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    }
})

export default CheckItem