import { Colors } from "@/constants/colors";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { globalStyles } from "@/constants/styles";

type BottomSheetWrapperProps = {
  bottomSheetRef: React.RefObject<any>;
  snap: number;
  snapPoints: string[];
  onSheetChange: (index: number) => void;
  onClose: () => void;
  children: React.ReactNode;
};

const BottomSheetWrapper = ({
    bottomSheetRef,
    snap,
    snapPoints,
    onSheetChange,
    onClose,
    children
    }: BottomSheetWrapperProps) => {
  return (
    <GestureHandlerRootView style={globalStyles.gesture}>
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
            ? globalStyles.sheetBackground
            : globalStyles.sheetBackground2
        }
        handleIndicatorStyle={globalStyles.handleIndicator}
      >
        <BottomSheetScrollView
          style={globalStyles.contentContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"

          >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default BottomSheetWrapper;