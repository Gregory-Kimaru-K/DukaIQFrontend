import { globalStyles } from "@/constants/styles";
import { DraftItem } from "@/databases/repositories/BatchRepo";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpiryDateField from "./product-details/ExpiryDateField";
import NumberStepperField from "./product-details/NumberStepperField";
import SegmentedControl from "./product-details/SegmentedControl";
import { productDetailsStyles as styles } from "./product-details/styles";
import TaxTypeSelector from "./product-details/TaxTypeSelector";
import { useProductDetailsForm } from "./product-details/useProductDetailsForm";

type ProductDetsProps = {
  draftItem?: DraftItem | null;
  onSaved?: () => void | Promise<void>;
  quaintity?: number;
  setQuantity?: React.Dispatch<React.SetStateAction<number>>;
};

const ProductDets = ({ draftItem, onSaved }: ProductDetsProps) => {
  const form = useProductDetailsForm(draftItem, onSaved);
  const isPacket = form.stockType === "PACKET";

  return (
    <SafeAreaView style={{ gap: 8 }}>
      <View style={globalStyles.image_cont}>
        <Image
          source={require("../../assets/Portraits.png")}
          style={globalStyles.image}
        />
      </View>

      <Text style={[globalStyles.h1pro, { textAlign: "center" }]}>
        {draftItem?.product.name ?? "Product Details"}
      </Text>

      <SegmentedControl
        value={form.stockType}
        options={[
          { label: "UNITS", value: "UNITS" },
          { label: "PACKETS", value: "PACKET" },
        ]}
        onChange={form.setStockType}
      />

      <Text style={styles.head}>PER {form.stockType}</Text>

      <View style={{ gap: 12, alignItems: "center" }}>
        <NumberStepperField
          label={`Buying Per ${form.stockType}`}
          prefix="KSH."
          value={form.buyingPrice}
          onChange={form.setBuyingPrice}
        />

        <NumberStepperField
          label="Quantity"
          prefix="Units"
          value={form.quantity}
          onChange={form.setQuantity}
        />

        {isPacket && (
          <NumberStepperField
            label="Quantity per Packet"
            prefix="Units"
            value={form.packQuantity}
            onChange={form.setPackQuantity}
          />
        )}

        {isPacket && (
          <View style={styles.field}>
            <Text style={styles.label}>Unit Price</Text>
            <Text style={globalStyles.text}>KSH. {form.unitPrice}</Text>
          </View>
        )}

        {isPacket && (
          <SegmentedControl
            compact
            value={form.profitMode}
            options={[
              { label: "Per Pack", value: "PACK" },
              { label: "Per Unit", value: "UNIT" },
            ]}
            onChange={form.setProfitMode}
          />
        )}

        <NumberStepperField
          label="Profit Margin"
          prefix="KSH."
          value={form.selling}
          onChange={form.setSelling}
        />

        <ExpiryDateField
          value={form.expiryDate}
          onChange={form.setExpiryDate}
        />

        <TaxTypeSelector
          taxTypes={form.taxTypes}
          selectedTaxTypeId={form.selectedTaxTypeId}
          onSelect={form.handleSelectTaxType}
        />

        <NumberStepperField
          label="Tax Amount"
          prefix="KSH."
          value={form.taxAmount}
          onChange={form.setTaxAmount}
        />
      </View>

      <Pressable style={globalStyles.btn} onPress={form.handleSave}>
        <Text style={[globalStyles.h2]}>Save</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProductDets;
