import Search from "@/components/Search";
import ProductDets from "@/components/drawerproduct/ProductDets";
import ProductDraw from "@/components/drawerproduct/ProductDraw";
import RestockDraw from "@/components/drawerproduct/RestockDraw";
import Payments from "@/components/drawerssale/Payments";
import Product from "@/components/products/Product";
import Products404 from "@/components/products/Products404";
import CustomStackTwo from "@/components/stacks/CustomStackTwo";
import BottomSheetWrapper from "@/components/wrappers/BottomSheetWrapper";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { Product as ProductModel } from "@/databases/models/products/Product";
import { DraftBatch } from "@/databases/models/stock/Draft";
import { DraftItem } from "@/databases/models/stock/DraftItem";
import { BatchRepo } from "@/databases/repositories/BatchRepo";
import { useSheetOne } from "@/hooks/useSheetOne";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DraftView = () => {
  const { draftid } = useLocalSearchParams<{ draftid: string }>();
  const productAdd = useSheetOne();
  const restock = useSheetOne();
  const paymentStock = useSheetOne();
  const productDetails = useSheetOne();
  const [draft, setDraft] = useState<DraftBatch | null>(null);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [selectedDraftItem, setSelectedDraftItem] = useState<DraftItem | null>(null);
  const [quantity, setQuantity] = useState(0);

  const loadDraft = async () => {
    if (!draftid) return undefined;
    const nextDraft = await BatchRepo.getDraftById(draftid);
    if (!nextDraft) return undefined;

    const nextItems = await BatchRepo.listDraftItems(nextDraft.id);
    setDraft(nextDraft);
    setDraftItems(nextItems);
    return nextDraft;
  };

  useEffect(() => {
    loadDraft();
  }, [draftid]);

  const handleSelectProduct = async (product: ProductModel) => {
    const currentDraft = draft ?? (await loadDraft());
    if (!currentDraft) return;

    const draftItem = await BatchRepo.addProductToDraft(currentDraft, product.id);
    setSelectedDraftItem(draftItem);
    productAdd.onClose();
    await loadDraft();
    productDetails.openSheetOne(3);
  };

  const handleOpenDraftItem = (item: DraftItem) => {
    setSelectedDraftItem(item);
    productDetails.openSheetOne(3);
  };

  const handleSavedDetails = async () => {
    await loadDraft();
  };

  const handleCompleteDraft = async () => {
    if (!draft) return;

    const batch = await BatchRepo.completeDraft(draft.id);
    if (!batch) {
      alert("Add products before restocking");
      return;
    }
    await loadDraft();
    restock.onClose();
    alert("Restock batch saved");
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors.brand.DARK_BLUE, height: "100%" }}
    >
      <CustomStackTwo
        header={draft?.name ?? "DRAFT"}
        desc="Restock and View batches"
        icon="add"
        onIconPress={() => productAdd.openSheetOne(3)}
        draft={true}
      />
      <Search />
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        {draftItems.length > 0 ? (
          draftItems.map((item) => (
            <View key={item.id}>
              <Product
                product={item.product}
                onPress={() => handleOpenDraftItem(item)}
              />
              <Text style={[globalStyles.text, { paddingHorizontal: 18 }]}>
                {item.quantity} {item.product.unit} - Buy KSH.{item.price} - Sell KSH.{item.profit}
              </Text>
            </View>
          ))
        ) : (
          <Products404 />
        )}
      </ScrollView>
      <Pressable
        style={[globalStyles.add_btn, { position: "fixed", bottom: 10 }]}
        onPress={() => restock.openSheetOne(3)}
      >
        <Text style={[globalStyles.h2, { fontWeight: "700" }]}>RESTOCK</Text>
      </Pressable>
      {productAdd.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={productAdd.bottomSheetRef}
          snap={productAdd.snap}
          snapPoints={productAdd.snapPoints}
          onSheetChange={productAdd.onSheetChange}
          onClose={productAdd.onClose}
        >
          <ProductDraw onSelectProduct={handleSelectProduct} />
        </BottomSheetWrapper>
      )}

      {restock.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={restock.bottomSheetRef}
          snap={restock.snap}
          snapPoints={restock.snapPoints}
          onSheetChange={restock.onSheetChange}
          onClose={restock.onClose}
        >
          <RestockDraw openPay={handleCompleteDraft} />
        </BottomSheetWrapper>
      )}
      {paymentStock.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={paymentStock.bottomSheetRef}
          snap={paymentStock.snap}
          snapPoints={paymentStock.snapPoints}
          onSheetChange={paymentStock.onSheetChange}
          onClose={paymentStock.onClose}
        >
          <Payments
            closeTwo={restock.onClose}
            openOne={() => restock.openSheetOne(3)}
          />
        </BottomSheetWrapper>
      )}
      {productDetails.isOpenOne && (
        <BottomSheetWrapper
          bottomSheetRef={productDetails.bottomSheetRef}
          snap={productDetails.snap}
          snapPoints={productDetails.snapPoints}
          onSheetChange={productDetails.onSheetChange}
          onClose={productDetails.onClose}
        >
          <ProductDets
            draftItem={selectedDraftItem}
            onSaved={handleSavedDetails}
            quaintity={quantity}
            setQuantity={setQuantity}
          />
        </BottomSheetWrapper>
      )}
    </SafeAreaView>
  );
};

export default DraftView;
