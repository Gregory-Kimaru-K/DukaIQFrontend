import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";

export const useSheetOne = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpenOne, setIsOpenOne] = useState(false);
  const [snap, setSnap] = useState(3);
  const snapPoints: string[] = ["40%", "60%", "75%", "100%"];

  const openSheetOne = useCallback((index: number) => {
    setSnap(index);
    setIsOpenOne(true);
  }, []);

  const onSheetChange = useCallback((index: number) => {
    setSnap(index);
  }, []);

  const onClose = useCallback(() => {
    setIsOpenOne(false);
  }, []);

  useEffect(() => {
    if (isOpenOne && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(snap);
    }
  }, [isOpenOne, snap]);

  return {
    bottomSheetRef,
    isOpenOne,
    setIsOpenOne,
    snap,
    setSnap,
    snapPoints,
    openSheetOne,
    onSheetChange,
    onClose,
  };
};
