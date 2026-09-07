import { ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomStackTwo from '@/components/stacks/CustomStackTwo'
import Product from '@/components/products/Product'
import Search from '@/components/Search'
import { useSheetOne } from '@/hooks/useSheetOne'
import BottomSheetWrapper from '@/components/wrappers/BottomSheetWrapper'
import ProductAdd from '@/components/drawerproduct/ProductAdd'
import { globalStyles } from '@/constants/styles'
import { ProductRepo } from '@/databases/repositories/ProductRepo'
import Products404 from '@/components/products/Products404'

type ProductModel = Awaited<ReturnType<typeof ProductRepo.listProducts>>[number]

const ProductsIndex = () => {
  const proddets = useSheetOne({snapPoints: ["100%"]})
  const repoProducts = ProductRepo
  const [products, setProducts] = useState<ProductModel[]>([])

  const loadProducts = useCallback(async () => {
    const nextProducts = await repoProducts.listProducts()
    setProducts(nextProducts)
  }, [repoProducts])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

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

export default ProductsIndex
