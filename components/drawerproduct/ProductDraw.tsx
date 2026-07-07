import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '@/constants/styles'
import Search from '../Search'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import Product from '../products/Product'

const ProductDraw = () => {
  return (
    <View>
      <Text style={globalStyles.h1}>Add Products</Text>
      <Search />
    </View>
  )
}

export default ProductDraw