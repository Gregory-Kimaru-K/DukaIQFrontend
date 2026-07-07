import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'
import Search from '@/components/Search'
import Draft from '@/components/products/Draft'
import Product from '@/components/products/Product'
import { useSheetOne } from '@/hooks/useSheetOne'
import BottomSheetWrapper from '@/components/wrappers/BottomSheetWrapper'
import ProductDraw from '@/components/drawerproduct/ProductDraw'

const Index = () => {
  const router = useRouter()
  const productAdd = useSheetOne()

  return (
    <SafeAreaView style={{ backgroundColor: Colors.brand.DARK_BLUE, height: "100%" }}>
      <CustomStackTwo header='DRAFT-XXX' desc='Restock and View batches' icon='add' onIconPress={() => productAdd.openSheetOne(2)} />
        <Search />
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        <Product />
        <Product />
      </ScrollView>
      {productAdd.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={productAdd.bottomSheetRef}
          snap={productAdd.snap}
          snapPoints={productAdd.snapPoints}
          onSheetChange={productAdd.onSheetChange}
          onClose={productAdd.onClose}
        >
          <ProductDraw />
        </BottomSheetWrapper>
      )}
    </SafeAreaView>
  )
}

export default Index