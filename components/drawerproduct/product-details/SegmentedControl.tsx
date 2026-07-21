import React from "react";
import { Text, View } from "react-native";
import { productDetailsStyles as styles } from "./styles";

type SegmentedControlProps<T extends string> = {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  compact?: boolean;
};

const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  compact = false,
}: SegmentedControlProps<T>) => {
  return (
    <View style={compact ? styles.compactSegmented : styles.segmented}>
      {options.map((option) => (
        <Text
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[
            styles.segment,
            value === option.value &&
              (compact ? styles.compactSegmentFocus : styles.segmentFocus),
          ]}
        >
          {option.label}
        </Text>
      ))}
    </View>
  );
};

export default SegmentedControl;
