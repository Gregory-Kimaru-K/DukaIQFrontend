import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";
import { productDetailsStyles as styles } from "./styles";

type ExpiryDateFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const ExpiryDateField = ({ value, onChange }: ExpiryDateFieldProps) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Expiry Date</Text>
      <BottomSheetTextInput
        keyboardType="numbers-and-punctuation"
        placeholder="YYYY-MM-DD"
        placeholderTextColor={Colors.text.WHITE + "80"}
        value={value}
        style={[globalStyles.text, styles.input]}
        onChangeText={onChange}
      />
    </View>
  );
};

export default ExpiryDateField;
