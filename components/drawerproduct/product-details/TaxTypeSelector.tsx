import { globalStyles } from "@/constants/styles";
import { TaxType } from "@/databases/models/stock/TaxType";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { productDetailsStyles as styles } from "./styles";

type TaxTypeSelectorProps = {
  taxTypes: TaxType[];
  selectedTaxTypeId?: string;
  onSelect: (taxType: TaxType) => void;
};

const TaxTypeSelector = ({
  taxTypes,
  selectedTaxTypeId,
  onSelect,
}: TaxTypeSelectorProps) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Tax Type</Text>
      <View style={styles.taxList}>
        {taxTypes.map((taxType) => (
          <Pressable
            key={taxType.id}
            onPress={() => onSelect(taxType)}
            style={[
              styles.taxOption,
              selectedTaxTypeId === taxType.id && styles.taxOptionFocus,
            ]}
          >
            <Text style={[globalStyles.text, styles.label]}>{taxType.name}</Text>
            <Text style={styles.taxRate}>{taxType.rate}%</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default TaxTypeSelector;
