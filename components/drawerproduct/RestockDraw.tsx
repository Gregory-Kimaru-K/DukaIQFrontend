import { View, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { globalStyles } from '@/constants/styles'
import CheckItem from '../drawerssale/CheckItem'
import { Image } from 'expo-image'
import Total from '../sales/Total'
import CheckHead from '../sales/CheckHead'
import { SafeAreaView } from 'react-native-safe-area-context'
import {BatchRepo} from '@/databases/repositories/BatchRepo'
import { DraftItem } from '@/databases/models/stock/DraftItem'

interface RestockDrawProps {
    openPay: () => void;
    draftId: string;
    onDraftChanged?: () => void | Promise<void>;
}

const RestockDraw = ({ openPay, draftId, onDraftChanged }: RestockDrawProps) => {
    const [draftItems, setDraftItems] = React.useState<DraftItem[]>([])
    const Batchrepo = BatchRepo

    const loadDraftItems = async () => {
        if (!draftId) return;
        const items = await Batchrepo.listDraftItems(draftId)
        setDraftItems(items)
    }

    useEffect(() => {
        loadDraftItems()
    }, [draftId])

    const handleRemoveDraftItem = async (item: DraftItem) => {
        await Batchrepo.deleteDraftItem(item.id)
        await loadDraftItems()
        await onDraftChanged?.()
    }

    const totalAmount = draftItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    )

    return (
        <SafeAreaView style={styles.container}>
            <CheckHead head='Restock' />
            <View style={globalStyles.image_cont}>
                <Image source={require("../../assets/Supplier.png")} style={globalStyles.image} />
            </View>
            <Total handlePayments={openPay} label={`KSH. ${totalAmount}`} />
            <View>
                {draftItems.map((item, index) => (
                    <CheckItem
                        key={item.id ?? index}
                        restock={true}
                        item={item}
                        onRemove={handleRemoveDraftItem}
                    />
                ))}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        gap: 12
    }
})
export default RestockDraw
