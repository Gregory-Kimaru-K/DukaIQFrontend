import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'
import Ionicons from '@expo/vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'
import { DraftItem } from '@/databases/repositories/BatchRepo'

interface CheckItemProps {
    restock?: boolean;
    item?: DraftItem;
    onRemove?: (item: DraftItem) => void | Promise<void>;
    onToggleSelect?: (item: DraftItem) => void;
    selected?: boolean;
}

const CheckItem = ({ restock=false, item, onRemove, onToggleSelect, selected=false }: CheckItemProps) => {
    const [quantity, setQuantity] = useState(1)
    const displayName = item?.product.name ?? "Prod_1";
    const displayQuantity = item?.quantity ?? quantity;
    const unitPrice = item?.price ?? 200;
    const tax = item?.vat ?? 0;
    const lineTotal = (unitPrice * displayQuantity) + tax;
    return (
        <View style={[styles.item, selected && styles.selectedItem]}>
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
                {restock ? (
                    <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        onPress={() => item && onToggleSelect?.(item)}
                    >
                        <Ionicons
                            name={selected ? "checkmark-circle" : "ellipse-outline"}
                            size={28}
                            color={selected ? Colors.brand.ORANGE : Colors.brand.LIGHT_BLUE}
                        />
                    </Pressable>
                ) : (
                    <Pressable onPress={() => item && onRemove?.(item)}>
                        <Ionicons name='close-circle' size={28} color={Colors.brand.LIGHT_BLUE} />
                    </Pressable>
                )}
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
    selectedItem: {
        backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
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
