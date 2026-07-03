import Product from "@/components/Product";
import Search from "@/components/Search";
import CustomStackTwo from "@/components/stacks/CustomStackTwo";
import { globalStyles } from "@/constants/styles";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { useCallback, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkout from "@/components/drawers/Checkout";
import { Colors } from "@/constants/colors";

const CreateSaleScreen = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [snap, setSnap] = useState(3)
  const snapPoints: string[] = ["40%", "60%", "75%", "100%"];
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
    setIsOpen(true);
    setSnap(index)
  }, []);
  return (
    <SafeAreaView style={globalStyles.container}>
      <CustomStackTwo
        header="SELL"
        desc="Tap, search or scan barcode"
        icon="cart-outline"
        iconChange={() => handleSheetChanges(1)}
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
        onPress={() => handleSheetChanges(1)}
      >
        <Text style={[globalStyles.h2, { fontWeight: "700" }]}>
          Scan Product
        </Text>
      </Pressable>
      {isOpen && (
        <>
        <GestureHandlerRootView style={styles.gesture}>
                <BlurView
                    tint="dark"
                    // @ts-ignore
                    style={{ width: "100%", height: snapPoints[snap-1], position: "absolute", bottom: 0, zIndex: 0}}
                    intensity={Platform.OS == "ios" ? 16 : 0}
                    blurReductionFactor={80}
                    experimentalBlurMethod="dimezisBlurView"
                    />
                <BottomSheet
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    index={3}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    onClose={() => setIsOpen(false)}
                    backgroundStyle={Platform.OS == "ios" ? styles.sheetBackground : styles.sheetBackground2}
                    handleIndicatorStyle={styles.handleIndicator}
                >
                        <BottomSheetScrollView style={styles.contentContainer}>
                            <Checkout />
                        </BottomSheetScrollView>
                </BottomSheet>
        </GestureHandlerRootView>
        </>
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
  gesture: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex:2
  },
  sheetBackground: {
    backgroundColor: "rgba(3, 31, 75, 0.58)",
    borderTopWidth: 4,
    borderTopColor: Colors.brand.LIGHT_BLUE,
  },
  sheetBackground2: {
    backgroundColor: "rgba(3, 31, 75, 0.96)",
  },
  handleIndicator: {
    backgroundColor: "#FFFFFF",
  },
  sheetText: {
    color: "#FFFFFF",
  },
});

export default CreateSaleScreen;