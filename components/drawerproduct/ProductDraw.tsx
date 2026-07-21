import { View, StyleSheet, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Search from '../Search'
import CheckHead from '../sales/CheckHead'
import ScanProducts from '../ScanProducts'
import { ProductRepo } from '@/databases/repositories/ProductRepo'
import { Product as ProductModel } from '@/databases/models/products/Product'
import Product from '../products/Product'
import Products404 from '../products/Products404'
import Total from '../sales/Total'
import { globalStyles } from '@/constants/styles'

type ProductDrawProps = {
  onSelectProduct?: (product: ProductModel) => void;
  onSelectProducts?: (products: ProductModel[]) => void | Promise<void>;
};

const ProductDraw = ({ onSelectProduct, onSelectProducts }: ProductDrawProps) => {
  const [barcode, setBarcode] = useState('')
  const repoProducts = ProductRepo
  const [products, setProducts] = useState<ProductModel[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  const toggleSelectedProduct = useCallback((product: ProductModel) => {
    setSelectedProductIds((currentIds) =>
      currentIds.includes(product.id)
        ? currentIds.filter((id) => id !== product.id)
        : [...currentIds, product.id],
    );
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const nextProducts = await repoProducts.listProducts()
      setProducts(nextProducts)
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const cleanBarcode = barcode.trim();
    if (!cleanBarcode || products.length === 0) return;

    const scannedProduct = products.find(
      (product) => product.barcode?.trim() === cleanBarcode,
    );

    if (!scannedProduct) {
      alert("No product found for this barcode");
      setBarcode("");
      return;
    }

    toggleSelectedProduct(scannedProduct);
    setBarcode("");
  }, [barcode, products, toggleSelectedProduct])

  const selectedProducts = products.filter((product) =>
    selectedProductIds.includes(product.id),
  );

  const handlePressProduct = (product: ProductModel) => {
    if (selectedProductIds.length > 0) {
      toggleSelectedProduct(product);
      return;
    }

    onSelectProduct?.(product);
  };

  const handleSelectedProducts = async () => {
    if (selectedProducts.length === 0) return;

    if (onSelectProducts) {
      await onSelectProducts(selectedProducts);
    } else {
      for (const product of selectedProducts) {
        await onSelectProduct?.(product);
      }
    }

    setSelectedProductIds([]);
  };
  
  return (
    <View style={styles.container}>
      <CheckHead head='Draft Products' />
     <ScanProducts barcode={barcode} setBarcode={setBarcode} />
      {selectedProducts.length > 0 && (
        <Total
          draft
          handlePayments={handleSelectedProducts}
          label={`${selectedProducts.length} ${
            selectedProducts.length === 1 ? "Product" : "Products"
          }`}
        />
      )}
      <Search />
      <View style={{ gap: 12 }}>
        {products.length > 0 ? (
          products.map((product) => (
            <Product
              key={product.id}
              product={product}
              isFocused={selectedProductIds.includes(product.id)}
              onPress={handlePressProduct}
              onLongPress={toggleSelectedProduct}
            />
          ))
        ) : (
          <Products404 />
        )}
      </View>
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
