import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";


type UseBottomSheetProps = {
  initialIndex?: number;
  snapPoints?: string[];
};


export const useSheetOne = ({
    initialIndex=1, 
    snapPoints = ["40%", "60%", "75%", "100%"]}: UseBottomSheetProps = {}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpenOne, setIsOpenOne] = useState(false);
  const [snap, setSnap] = useState(initialIndex);

  const openSheetOne = useCallback((index = initialIndex) => {
    setSnap(index);
    setIsOpenOne(true);
  }, []);

  const onSheetChange = useCallback((index=initialIndex) => {
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
