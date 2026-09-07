import { View, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { globalStyles } from '@/constants/styles'
import CheckItem from '../drawerssale/CheckItem'
import { Image } from 'expo-image'
import Total from '../sales/Total'
import CheckHead from '../sales/CheckHead'
import { SafeAreaView } from 'react-native-safe-area-context'
import {BatchRepo} from '@/databases/repositories/BatchRepo'
import { DraftItem } from '@/databases/repositories/BatchRepo'

interface RestockDrawProps {
    openPay: (draftItemIds?: string[]) => void;
    draftId: string;
}

const RestockDraw = ({ openPay, draftId }: RestockDrawProps) => {
    const [draftItems, setDraftItems] = React.useState<DraftItem[]>([])
    const [selectedDraftItemIds, setSelectedDraftItemIds] = React.useState<string[]>([])
    const Batchrepo = BatchRepo

    const loadDraftItems = async () => {
        if (!draftId) return;
        const items = await Batchrepo.listDraftItems(draftId)
        setDraftItems(items)
        setSelectedDraftItemIds((currentIds) =>
            currentIds.filter((id) => items.some((item) => item.id === id)),
        )
    }

    useEffect(() => {
        loadDraftItems()
    }, [draftId])

    const handleToggleDraftItem = (item: DraftItem) => {
        setSelectedDraftItemIds((currentIds) =>
            currentIds.includes(item.id)
                ? currentIds.filter((id) => id !== item.id)
                : [...currentIds, item.id],
        )
    }

    const itemsToRestock = selectedDraftItemIds.length > 0
        ? draftItems.filter((item) => selectedDraftItemIds.includes(item.id))
        : draftItems

    const totalAmount = itemsToRestock.reduce(
        (total, item) => total + ((item.price * item.quantity) + (item.vat ?? 0)),
        0,
    )

    return (
        <SafeAreaView style={styles.container}>
            <CheckHead head='Restock' />
            <View style={globalStyles.image_cont}>
                <Image source={require("../../assets/Supplier.png")} style={globalStyles.image} />
            </View>
            <Total
                handlePayments={() => openPay(
                    selectedDraftItemIds.length > 0 ? selectedDraftItemIds : undefined,
                )}
                label={`KSH. ${totalAmount}`}
            />
            <View>
                {draftItems.map((item, index) => (
                    <CheckItem
                        key={item.id ?? index}
                        restock={true}
                        item={item}
                        onToggleSelect={handleToggleDraftItem}
                        selected={selectedDraftItemIds.includes(item.id)}
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
