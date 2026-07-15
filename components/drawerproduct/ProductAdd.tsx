import { globalStyles } from "@/constants/styles";
import { Category } from "@/databases/models/products/Category";
import { Shop } from "@/databases/models/products/Shop";
import { Type } from "@/databases/models/products/Type";
import { ProductRepo } from "@/databases/repositories/ProductRepo";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDown from "../sales/DropDown";
import ScanProducts from "../ScanProducts";

const ProductAdd = () => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [type, setType] = useState<Type | null>(null);
  const [productName, setProductName] = useState("");
  const [barCode, setBarCode] = useState("");
  const repo = ProductRepo;

  useEffect(() => {
    console.log(shop);
  }, [shop]);
  const shops = repo.listShops();
  const categories = repo.listCategories();
  const types = repo.listTypes();

  const handleSelectShop = (item: Shop | Category | Type) => {
    if (!("shop" in item) && !("category" in item)) {
      setShop(item as Shop);
    }
  };

  const handleCreateShop = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const newShop = repo.createShop({ name: trimmedName });
    setShop(newShop);
  };

  const handleSelectCategory = (item: Shop | Category | Type) => {
    if (typeof item === "object" && item !== null && "shop" in item) {
      setCategory(item as Category);
      setShop((item as Category).shop);
    }
  };

  const handleCreateCategory = (name: string) => {
    if (shop === null) {
      alert("No shop selected for this category");
      return;
    }
    const newCategory = repo.createCategory({ name: name, shop: shop });
    setCategory(newCategory);
  };

  const handleSelectType = (item: Shop | Category | Type) => {
    if (typeof item === "object" && item !== null && "category" in item) {
      setType(item as Type);
    }
  };

  const handleCreateCategor = (name: string) => {
    if (category === null) {
      alert("No category selected for this shop");
      return;
    }
    const newType = repo.createType({ name: name, category: category });
    setType(newType);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={globalStyles.h1pro}>Create Product</Text>
      <ScanProducts barcode={barCode} setBarcode={setBarCode} />

      <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Product Name</Text>
        <BottomSheetTextInput
          style={globalStyles.input}
          placeholder="Product Name"
          placeholderTextColor={"#ffffff80"}
          value={productName}
          onChangeText={setProductName}
        />
      </View>

      <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Barcode Number</Text>
        <View style={[globalStyles.input, { justifyContent: "center" }]}>
          {barCode ? (
            <Text style={[globalStyles.h5, { color: "#ffffff80" }]}>
              {barCode}
            </Text>
          ) : (
            <Text style={[globalStyles.h5, { color: "#ffffff80" }]}>
              Barcode Number
            </Text>
          )}
        </View>
      </View>

      <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Shop Name</Text>
        <DropDown
          data={shops}
          value={shop?.name ?? ""}
          placeholder="Search or Create Shop"
          onSelect={(item) => handleSelectShop(item)}
          noDataMessage="No matching Shop"
          onCreate={(name) => handleCreateShop(name)}
        />
      </View>

      <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Category Name</Text>
        <DropDown
          data={categories}
          value={category?.name ?? ""}
          placeholder="Search or Create Category"
          onSelect={(item) => handleSelectCategory(item)}
          noDataMessage="No matching Category"
          onCreate={(name) => handleCreateCategory(name)}
        />
      </View>

      <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Type Name</Text>
        <DropDown
          data={types}
          value={type?.name ?? ""}
          placeholder="Search or Create Type"
          onSelect={(item) => handleSelectType(item)}
          noDataMessage="No matching Type"
        />
      </View>

      <Pressable style={globalStyles.btn}>
        <Text style={[globalStyles.h2, { fontWeight: "bold" }]}>
          CREATE PRODUCT
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
    gap: 20,
  },
});

export default ProductAdd;
