import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { globalStyles } from '@/constants/styles'
import { Colors } from '@/constants/colors'

const ProductEdit = () => {
    const [stockType, setStockType] = useState("UNITS")
    return (
        <View style={{ gap:8 }}>

            <View style={styles.quantity_type}>
                <Text
                    onPress={() => setStockType("UNITS")}
                    style={[globalStyles.text,
                        {backgroundColor:stockType === "UNITS" ? Colors.brand.LIGHT_DARK_BLUE : undefined, padding: 4, borderRadius: 4}]}
                    >
                        UNITS
                </Text>
                <Text
                    onPress={() => setStockType("PACKET")}
                    style={[globalStyles.text,
                        {backgroundColor:stockType === "PACKET" ? Colors.brand.LIGHT_DARK_BLUE : undefined, padding: 4, borderRadius: 4}]}
                    >
                        PACKETS
                </Text>
            </View>

            <Text style={styles.head}>PER {stockType}</Text>


            <View style={{ gap: 12, alignItems: "center" }}>
                <View style={styles.dets}>
                    <Text style={styles.module_head}>Buying Price</Text>
                    <View style={styles.quantity}>
                        <Text style={styles.bold_text}>KSH.</Text>
                        <Pressable style={styles.quantity_btn}>
                            <Ionicons name="remove" size={16} color={"#ffffff"}  />
                        </Pressable>

                        <TextInput value='100000' style={[globalStyles.text]} />

                        <Pressable style={styles.quantity_btn}>
                            <Ionicons name="add" size={16} color={"#ffffff"}  />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.dets}>
                    <Text style={styles.module_head}>Packet Quantity</Text>
                    <View style={styles.quantity}>
                        <Text style={styles.bold_text}>Units</Text>
                        <Pressable style={styles.quantity_btn}>
                            <Ionicons name="remove" size={16} color={"#ffffff"} />
                        </Pressable>
                        <TextInput value='100000' style={[globalStyles.text]} />
                        <Pressable style={styles.quantity_btn}>
                            <Ionicons name="add" size={16} color={"#ffffff"} />
                        </Pressable>
                    </View>
                </View>

                {stockType==="PACKET" && (
                    <View style={styles.dets}>
                        <Text style={styles.module_head}>Quantity per Packet</Text>
                        <View style={styles.quantity}>
                            <Text style={styles.bold_text}>Units</Text>
                            <Pressable style={styles.quantity_btn}>
                                <Ionicons name="remove" size={16} color={"#ffffff"} />
                            </Pressable>
                            <TextInput value='100000' style={[globalStyles.text]} />
                            <Pressable style={styles.quantity_btn}>
                                <Ionicons name="add" size={16} color={"#ffffff"} />
                            </Pressable>
                        </View>
                    </View>
                )}

                <View style={styles.dets}>
                    <Text style={styles.bold_text}>Unit Price</Text>
                    <Text style={globalStyles.text}>KSH. 20</Text>
                </View>
                <View style={styles.dets}>
                    <Text style={styles.module_head}>Buying Price</Text>
                    <View style={styles.quantity}>
                        <Text style={styles.bold_text}>KSH.</Text>
                        <Pressable style={styles.quantity_btn}>
                            <Ionicons name="remove" size={16} color={"#ffffff"}  />
                        </Pressable>

                        <TextInput value='100000' style={[globalStyles.text]} />

                        <Pressable style={styles.quantity_btn}>
                            <Ionicons name="add" size={16} color={"#ffffff"}  />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    quantity: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingLeft: 8
    },
    head: {
        textTransform: "capitalize",
        textAlign: "left",
        fontWeight: "bold",
        ...globalStyles.h5
    },
    dets: {
        backgroundColor: Colors.brand.BLUE,
        borderRadius: 8,
        padding: 8,
        width: "80%",
        gap:4
    },
    dets2: {
        backgroundColor: Colors.brand.BLUE,
        borderRadius: 8,
        padding: 8,
        width: "40%",
        gap:4
    },
    quantity_btn: {
        borderWidth: 1.5,
        borderColor: "#ffffff",
        borderRadius: 4
    },
    quantity_type: {
        flexDirection: "row",
        gap: 8,
        alignSelf: "center",
        backgroundColor: Colors.brand.LIGHT_BLUE,
        padding: 8,
        alignItems: "center",
        borderRadius: 8
    },
    module_head: {
        ...globalStyles.text,
        fontWeight: "bold"
    },
    bold_text: {
        ...globalStyles.text,
        fontWeight: "bold"
    }
})

export default ProductEdit