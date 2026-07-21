import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'
import Ionicons from '@expo/vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'
import { DraftItem } from '@/databases/models/stock/DraftItem'

interface CheckItemProps {
    restock?: boolean;
    item?: DraftItem;
    onRemove?: (item: DraftItem) => void | Promise<void>;
}

const CheckItem = ({ restock=false, item, onRemove }: CheckItemProps) => {
    const [quantity, setQuantity] = useState(1)
    const displayName = item?.product.name ?? "Prod_1";
    const displayQuantity = item?.quantity ?? quantity;
    const unitPrice = item?.price ?? 200;
    const lineTotal = unitPrice * displayQuantity;
    return (
        <View style={styles.item}>
            <View style={styles.itemsCont}>
                <View style={styles.title}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={[globalStyles.text, {color: "#ffffff6b"}]}>KSH. {unitPrice} / Unit</Text>
                </View>
                {restock ? (
                    <Text style={styles.readOnlyQuantity}>
                        {displayQuantity} {item?.product.unit ?? "Unit"}
                    </Text>
                ) : (
                    <View style={styles.quantity}>
                        <Pressable style={styles.actionBtn} onPress={() => setQuantity(quantity-1)}>
                            <Ionicons name='remove' size={20} color={"#ffffff"} />
                        </Pressable>
                        <TextInput defaultValue={`${quantity}`} keyboardType='numeric' style={{ color: "#ffffff" }} />
                        <Pressable style={styles.actionBtn} onPress={() => setQuantity(quantity+1)}>
                            <Ionicons name='add' size={20} color={"#ffffff"} />
                        </Pressable>
                    </View>
                )}
                {restock ? (
                    <Text style={{fontWeight: "bold", color: Colors.brand.ORANGE, fontSize: 18}}>KSH. {lineTotal}</Text>
                )
                    :
                    <Text style={{fontWeight: "bold", color: Colors.brand.ORANGE, fontSize: 18}}>KSH. 600</Text>

                }
                <Pressable onPress={() => item && onRemove?.(item)}>
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
    },
    readOnlyQuantity: {
        ...globalStyles.text,
        fontWeight: "bold",
        minWidth: 56,
        textAlign: "center"
    },
    name: {
        // width: "80%",
        ...globalStyles.h5,
        fontWeight: "bold",
        flexWrap: "wrap"
    }
})

export default CheckItem
