import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { productDetailsStyles as styles } from "./styles";

type NumberStepperFieldProps = {
  label: string;
  prefix: string;
  value: number;
  onChange: (value: number) => void;
};

const NumberStepperField = ({
  label,
  prefix,
  value,
  onChange,
}: NumberStepperFieldProps) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.quantity}>
        <Text style={styles.label}>{prefix}</Text>
        <Pressable
          style={styles.quantityButton}
          onPress={() => onChange(Math.max(0, value - 1))}
        >
          <Ionicons name="remove" size={16} color={"#ffffff"} />
        </Pressable>

        <BottomSheetTextInput
          keyboardType="numeric"
          value={value.toString()}
          style={[globalStyles.text, styles.input]}
          onChangeText={(text) => {
            const nextValue = Number(text);
            onChange(Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue));
          }}
        />

        <Pressable
          style={styles.quantityButton}
          onPress={() => onChange(value + 1)}
        >
          <Ionicons name="add" size={16} color={"#ffffff"} />
        </Pressable>
      </View>
    </View>
  );
};

export default NumberStepperField;
