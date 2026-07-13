import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import { useRouter } from 'expo-router'
import Product from '@/components/products/Product'
import Search from '@/components/Search'
import { useSheetOne } from '@/hooks/useSheetOne'
import BottomSheetWrapper from '@/components/wrappers/BottomSheetWrapper'
import ProductAdd from '@/components/drawerproduct/ProductAdd'
import { globalStyles } from '@/constants/styles'

const products = () => {
  const router = useRouter()
  const proddets = useSheetOne()
  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStackTwo header="PRODUCTS" desc="Add, View Products" icon='add' onIconPress={() => proddets.openSheetOne(1)}/>
      <Search />
      <Product />
      {proddets.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={proddets.bottomSheetRef}
          snap={proddets.snap}
          snapPoints={proddets.snapPoints}
          onSheetChange={proddets.onSheetChange}
          onClose={proddets.onClose}
        >
          <ProductAdd />
        </BottomSheetWrapper>
      )}
    </SafeAreaView>
  )
}

export default products