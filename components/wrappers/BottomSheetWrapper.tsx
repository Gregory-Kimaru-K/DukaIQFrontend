import { globalStyles } from "@/constants/styles";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { BottomSheetScrollRefContext } from "@/hooks/useBottomSheetScrollRef";

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
  children,
}: BottomSheetWrapperProps) => {
  const scrollRef =
    useRef<React.ComponentRef<typeof BottomSheetScrollView>>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={globalStyles.gesture}>
      <BlurView
        tint="dark"
        // @ts-ignore
        style={{
          width: "100%",
          height: snap >= 0 && snap < snapPoints.length ? snapPoints[snap] : 0,
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
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onClose={onClose}
        backgroundStyle={
          Platform.OS == "ios"
            ? globalStyles.sheetBackground
            : globalStyles.sheetBackground2
        }
        handleIndicatorStyle={globalStyles.handleIndicator}
      >
        {/* <BottomSheetScrollRefContext.Provider value={scrollRef}> */}
        <BottomSheetScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardHeight + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          nestedScrollEnabled
        >
          {children}
        </BottomSheetScrollView>
        {/* </BottomSheetScrollRefContext.Provider> */}
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default BottomSheetWrapper;
