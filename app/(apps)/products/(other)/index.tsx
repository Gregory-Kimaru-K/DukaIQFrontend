import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'
import Search from '@/components/Search'
import Product from '@/components/products/Product'
import { useSheetOne } from '@/hooks/useSheetOne'
import BottomSheetWrapper from '@/components/wrappers/BottomSheetWrapper'
import ProductDraw from '@/components/drawerproduct/ProductDraw'
import RestockDraw from '@/components/drawerproduct/RestockDraw'
import Payments from '@/components/drawerssale/Payments'

const Index = () => {
  const productAdd = useSheetOne()
  const restock = useSheetOne()
  const paymentStock = useSheetOne()
  const credit = useSheetOne()
  return (
    <SafeAreaView style={{ backgroundColor: Colors.brand.DARK_BLUE, height: "100%" }}>
      <CustomStackTwo header='DRAFT-XXX' desc='Restock and View batches' icon='add' onIconPress={() => productAdd.openSheetOne(3)} />
        <Search />
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        <Product />
        <Product />
      </ScrollView>
      <Pressable
        style={[globalStyles.add_btn, { position: "fixed", bottom: 10 }]}
        onPress={() => restock.openSheetOne(3)}
        >
          <Text style={[globalStyles.h2, { fontWeight: "700" }]}>RESTOCK</Text>
      </Pressable>
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

      {restock.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={restock.bottomSheetRef}
          snap={restock.snap}
          snapPoints={restock.snapPoints}
          onSheetChange={restock.onSheetChange}
          onClose={restock.onClose}
        >
          <RestockDraw openPay={() => paymentStock.openSheetOne(3)} />
        </BottomSheetWrapper>
      )}
      {paymentStock.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={paymentStock.bottomSheetRef}
          snap={paymentStock.snap}
          snapPoints={paymentStock.snapPoints}
          onSheetChange={paymentStock.onSheetChange}
          onClose={paymentStock.onClose}
        >
          <Payments closeTwo={restock.onClose} openOne={() => restock.openSheetOne(3)} />
        </BottomSheetWrapper>
      )}
    </SafeAreaView>
  )
}

export default Index