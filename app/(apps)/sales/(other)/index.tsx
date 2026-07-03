import Cart from "@/components/drawers/Cart";
import Product from "@/components/Product";
import Search from "@/components/Search";
import CustomStackTwo from "@/components/stacks/CustomStackTwo";
import { globalStyles } from "@/constants/styles";
import { useSheetOne } from "@/hooks/useSheetOne";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateSaleScreen = () => {
  const {
    bottomSheetRef,
    isOpenOne,
    snap,
    snapPoints,
    openSheetOne,
    onSheetChange,
    onClose,
  } = useSheetOne();

  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStackTwo
        header="SELL"
        desc="Tap, search or scan barcode"
        icon="cart-outline"
        onIconPress={() => openSheetOne(3)}
      />
      <Search />
      <ScrollView
        contentContainerStyle={styles.productsContent}
        style={[globalStyles.container, styles.products]}
      >
        <Product image="img1" isFocused />
        <Product image="img2" />
        <Product image="img2" />
        <Product image="img1" />
      </ScrollView>
      <Pressable
        style={[globalStyles.add_btn, { position: "fixed", bottom: 0 }]}
        onPress={() => openSheetOne(3)}
      >
        <Text style={[globalStyles.h2, { fontWeight: "700" }]}>
          Scan Product
        </Text>
      </Pressable>
      {isOpenOne && (
        <Cart
          bottomSheetRef={bottomSheetRef}
          snap={snap}
          snapPoints={snapPoints}
          onSheetChange={onSheetChange}
          onClose={onClose}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  products: {
    flexGrow: 0,
  },
  productsContent: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

export default CreateSaleScreen;
