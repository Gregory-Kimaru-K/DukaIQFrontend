import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '@/constants/styles'
import Search from '../Search'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/colors'
import CheckHead from '../sales/CheckHead'
import ScanProducts from '../ScanProducts'
import { ScrollView } from 'react-native-gesture-handler'
import { ProductRepo } from '@/databases/repositories/ProductRepo'
import { Product as ProductModel } from '@/databases/models/products/Product'
import Product from '../products/Product'
import Products404 from '../products/Products404'

const ProductDraw = () => {
  const [barcode, setBarcode] = useState('')
  const [search, setSearch] = useState('')
  const repoProducts = ProductRepo
  const [products, setProducts] = useState<ProductModel[]>([])

  useEffect(() => {
    const products = repoProducts.listProducts()
    setProducts(products)
  }, [repoProducts])
  
  return (
    <View style={styles.container}>
      <CheckHead head='Draft Products' />
     <ScanProducts barcode={barcode} setBarcode={setBarcode} />
      <Search />
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        {products.length > 0 ? (
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))
        ) : (
          <Products404 />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingTop: 12
  },
})

export default ProductDraw