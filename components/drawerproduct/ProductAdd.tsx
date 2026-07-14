import { globalStyles } from "@/constants/styles";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDown from "../sales/DropDown";
import ScanProducts from "../ScanProducts";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const ShopOptions = [
  { id: "1", label: "Shop 1" },
  { id: "2", label: "Shop 2" },
  { id: "3", label: "Shop 3" },
  { id: "4", label: "Shop 4" },
  { id: "5", label: "Shop 5" },
  { id: "6", label: "Shop 6" },
  { id: "7", label: "Shop 7" },
  { id: "8", label: "Shop 8" },
  { id: "9", label: "Shop 9" },
  { id: "10", label: "Shop 10" },
  { id: "11", label: "Shop 11" },
  { id: "12", label: "Shop 12" },
  { id: "13", label: "Shop 13" },
];

const CatOptions = [
  { id: "1", label: "Cat 1" },
  { id: "2", label: "Cat 2" },
  { id: "3", label: "Cat 3" },
  { id: "4", label: "Cat 4" },
  { id: "5", label: "Shop 5" },
  { id: "6", label: "Shop 6" },
  { id: "7", label: "Shop 7" },
  { id: "8", label: "Shop 8" },
  { id: "9", label: "Shop 9" },
  { id: "10", label: "Shop 10" },
  { id: "11", label: "Shop 11" },
  { id: "12", label: "Shop 12" },
  { id: "13", label: "Shop 13" },
];

const TypeOptions = [
  { id: "1", label: "Type 1" },
  { id: "2", label: "Type 2" },
  { id: "3", label: "Type 3" },
  { id: "4", label: "Type 4" },
  { id: "5", label: "Shop 5" },
  { id: "6", label: "Shop 6" },
  { id: "7", label: "Shop 7" },
  { id: "8", label: "Shop 8" },
  { id: "9", label: "Shop 9" },
  { id: "10", label: "Shop 10" },
  { id: "11", label: "Shop 11" },
  { id: "12", label: "Shop 12" },
  { id: "13", label: "Shop 13" },
];

const ProductAdd = () => {
  const [shopName, setShopName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [TypeName, setTypeName] = useState("");
  return (
    <SafeAreaView style={styles.container}>
        <Text style={globalStyles.h1pro}>Create Product</Text>
        <ScanProducts />

        <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Product Name</Text>
        <BottomSheetTextInput
            style={globalStyles.input}
            placeholder="Product Name"
            placeholderTextColor={"#ffffff80"}
        />
        </View>

        <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Barcode Number</Text>
        <View style={[globalStyles.input, { justifyContent: "center" }]}>
            <Text style={[globalStyles.h5, { color: "#ffffff80" }]}>
            Barcode Number
            </Text>
        </View>
        </View>

        <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Shop Name</Text>
        <DropDown
            data={ShopOptions}
            value={shopName}
            placeholder="Search or Create Shop"
            onSelect={(item) => setShopName(item.label)}
            noDataMessage="No matching Shop"
        />
        </View>
        <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Category Name</Text>
        <DropDown
            data={CatOptions}
            value={categoryName}
            placeholder="Search or Create Category"
            onSelect={(item) => setCategoryName(item.label)}
            noDataMessage="No matching Category"
        />
        </View>

        <View style={globalStyles.inputContainer}>
        <Text style={globalStyles.h5}>Type Name</Text>
        <DropDown
            data={TypeOptions}
            value={TypeName}
            placeholder="Search or Create Type"
            onSelect={(item) => setTypeName(item.label)}
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
