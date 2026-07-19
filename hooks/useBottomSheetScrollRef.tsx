import type { BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet";
import { createContext, useContext, type RefObject } from "react";

export const BottomSheetScrollRefContext =
  createContext<RefObject<BottomSheetScrollViewMethods | null> | null>(null);

export const useBottomSheetScrollRef = () =>
  useContext(BottomSheetScrollRefContext);
