import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import { useRouter } from 'expo-router'
import Product from '@/components/products/Product'
import type { Product as ProductModel } from '@/databases/models/products/Product'
import Search from '@/components/Search'
import { useSheetOne } from '@/hooks/useSheetOne'
import BottomSheetWrapper from '@/components/wrappers/BottomSheetWrapper'
import ProductAdd from '@/components/drawerproduct/ProductAdd'
import { globalStyles } from '@/constants/styles'
import { ProductRepo } from '@/databases/repositories/ProductRepo'
import Products404 from '@/components/products/Products404'

const products = () => {
  const router = useRouter()
  const proddets = useSheetOne({snapPoints: ["100%"]})
  const repoProducts = ProductRepo
  const [products, setProducts] = useState<ProductModel[]>([])

  const loadProducts = async () => {
    const nextProducts = await repoProducts.listProducts()
    setProducts(nextProducts)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStackTwo header="PRODUCTS" desc="Add, View Products" icon='add' onIconPress={() => proddets.openSheetOne(0)}/>
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={{ gap: 12 }}
      >
        <Search />
        {products.length > 0 ? (
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))
        ) : (
          <Products404 />
        )}
      </ScrollView>
      {proddets.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={proddets.bottomSheetRef}
          snap={proddets.snap}
          snapPoints={proddets.snapPoints}
          onSheetChange={proddets.onSheetChange}
          onClose={proddets.onClose}
        >
          <ProductAdd onCreated={loadProducts} />
        </BottomSheetWrapper>
      )}
    </SafeAreaView>
  )
}

export default products
