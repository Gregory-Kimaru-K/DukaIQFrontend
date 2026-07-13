import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDown from "../sales/DropDown";

const ShopOptions = [
  { id: "1", label: "Shop 1" },
  { id: "2", label: "Shop 2" },
  { id: "3", label: "Shop 3" },
  { id: "4", label: "Shop 4" },
];

const CatOptions = [
  { id: "1", label: "Shop 1" },
  { id: "2", label: "Shop 2" },
  { id: "3", label: "Shop 3" },
  { id: "4", label: "Shop 4" },
];

const TypeOptions = [
  { id: "1", label: "Shop 1" },
  { id: "2", label: "Shop 2" },
  { id: "3", label: "Shop 3" },
  { id: "4", label: "Shop 4" },
];

const ProductAdd = () => {
    const [shopName, setShopName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [TypeName, setTypeName] = useState("");
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={globalStyles.h1pro}>Create Product</Text>

                    <Pressable style={{ alignItems: "center" }}>
                        <LinearGradient
                            colors={["#07439F", "#031e47", "#021025"]}
                            start={[0, 0]}
                            end={[0, 1]}
                            style={globalStyles.scan}
                        >
                            <Ionicons name="image" size={56} color={Colors.brand.ORANGE} />
                        </LinearGradient>
                    </Pressable>

                    <View style={globalStyles.inputContainer}>
                        <Text style={globalStyles.h5}>Product Name</Text>
                        <TextInput style={globalStyles.input} placeholder="Product Name" placeholderTextColor={"#ffffff80"} />
                    </View>

                    <View style={globalStyles.inputContainer}>
                        <Text style={globalStyles.h5}>Barcode Number</Text>
                        <View style={[globalStyles.input, { justifyContent: "center" }]}>
                            <Text style={[globalStyles.h5, {color: "#ffffff80"}]}>Barcode Number</Text>
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
                            data={ShopOptions}
                            value={categoryName}
                            placeholder="Search or Create Category"
                            onSelect={(item) => setCategoryName(item.label)}
                            noDataMessage="No matching Category"
                        />
                    </View>

                    <View style={globalStyles.inputContainer}>
                        <Text style={globalStyles.h5}>Type Name</Text>
                        <DropDown
                            data={ShopOptions}
                            value={TypeName}
                            placeholder="Search or Create Type"
                            onSelect={(item) => setTypeName(item.label)}
                            noDataMessage="No matching Type"
                        />
                    </View>
                    <Pressable style={globalStyles.btn}>
                        <Text style={[globalStyles.h2, {fontWeight: "bold"}]}>CREATE PRODUCT</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 24,
    gap: 20,
  },
});
export default ProductAdd;
