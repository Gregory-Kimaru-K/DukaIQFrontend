import { Colors } from "@/constants/colors";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Checkout from "../Checkout";

type CartProps = {
  bottomSheetRef: React.RefObject<any>;
  snap: number;
  snapPoints: string[];
  onSheetChange: (index: number) => void;
  onClose: () => void;
};

const Cart = ({
  bottomSheetRef,
  snap,
  snapPoints,
  onSheetChange,
  onClose,
}: CartProps) => {
  return (
    <GestureHandlerRootView style={styles.gesture}>
      <BlurView
        tint="dark"
        // @ts-ignore
        style={{
          width: "100%",
          height: snapPoints[snap - 1],
          position: "absolute",
          bottom: 0,
          zIndex: 0,
        }}
        intensity={Platform.OS == "ios" ? 16 : 0}
        blurReductionFactor={80}
        experimentalBlurMethod="dimezisBlurView"
      />
      <BottomSheet
        ref={bottomSheetRef}
        onChange={onSheetChange}
        index={snap}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={onClose}
        backgroundStyle={
          Platform.OS == "ios"
            ? styles.sheetBackground
            : styles.sheetBackground2
        }
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetScrollView style={styles.contentContainer}>
          <Checkout />
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  gesture: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex: 2,
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
