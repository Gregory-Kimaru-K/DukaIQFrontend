import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { StyleSheet } from "react-native";

export const productDetailsStyles = StyleSheet.create({
  field: {
    backgroundColor: Colors.brand.BLUE,
    borderRadius: 8,
    padding: 8,
    width: "80%",
    gap: 4,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 8,
  },
  quantityButton: {
    borderWidth: 1.5,
    borderColor: "#ffffff",
    borderRadius: 4,
  },
  input: {
    minWidth: 80,
    paddingVertical: 2,
  },
  label: {
    ...globalStyles.text,
    fontWeight: "bold",
  },
  segmented: {
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
    backgroundColor: Colors.brand.LIGHT_BLUE,
    padding: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  segment: {
    ...globalStyles.text,
    padding: 4,
    borderRadius: 4,
  },
  segmentFocus: {
    backgroundColor: Colors.brand.LIGHT_DARK_BLUE,
  },
  compactSegmented: {
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
    backgroundColor: Colors.brand.LIGHT_BLUE,
    padding: 4,
    borderRadius: 4,
  },
  compactSegmentFocus: {
    backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
  },
  head: {
    textTransform: "capitalize",
    textAlign: "left",
    fontWeight: "bold",
    ...globalStyles.h5,
  },
  taxList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  taxOption: {
    borderWidth: 1,
    borderColor: Colors.brand.LIGHT_BLUE,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 2,
  },
  taxOptionFocus: {
    backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
  },
  taxRate: {
    ...globalStyles.text,
    opacity: 0.7,
  },
});
