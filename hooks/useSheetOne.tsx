import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";

type UseBottomSheetProps = {
  initialIndex?: number;
  snapPoints?: string[];
};

export const useSheetOne = ({
  initialIndex = 1,
  snapPoints = ["40%", "60%", "75%", "100%"],
}: UseBottomSheetProps = {}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpenOne, setIsOpenOne] = useState(false);

  const clampIndex = (i: number) => {
    const max = Math.max(0, snapPoints.length - 1);
    return Math.max(-1, Math.min(i, max));
  };

  const effectiveInitial = clampIndex(initialIndex);
  const [snap, setSnap] = useState<number>(effectiveInitial);

  const openSheetOne = useCallback(
    (index?: number) => {
      const idx =
        typeof index === "number" ? clampIndex(index) : effectiveInitial;
      setSnap(idx);
      setIsOpenOne(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [effectiveInitial, snapPoints],
  );

  const onSheetChange = useCallback(
    (index?: number) => {
      if (typeof index === "number") setSnap(clampIndex(index));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [snapPoints],
  );

  const onClose = useCallback(() => {
    setIsOpenOne(false);
  }, []);

  useEffect(() => {
    if (isOpenOne && bottomSheetRef.current) {
      const idx = clampIndex(snap);
      // @ts-ignore
      bottomSheetRef.current.snapToIndex(idx);
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
