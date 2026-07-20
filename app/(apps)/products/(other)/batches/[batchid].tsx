import Product from "@/components/products/Product";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { Batch } from "@/databases/models/stock/Batch";
import { BatchItem } from "@/databases/models/stock/BatchItem";
import { BatchRepo } from "@/databases/repositories/BatchRepo";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BatchView = () => {
  const { batchid } = useLocalSearchParams<{ batchid: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [items, setItems] = useState<BatchItem[]>([]);

  useEffect(() => {
    const loadBatch = async () => {
      if (!batchid) return;
      const nextBatch = await BatchRepo.getBatchById(batchid);
      if (!nextBatch) return;

      setBatch(nextBatch);
      setItems(await BatchRepo.listBatchItemsByBatch(nextBatch.id));
    };

    loadBatch();
  }, [batchid]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.brand.DARK_BLUE }}>
      <ScrollView contentContainerStyle={{ gap: 12, paddingVertical: 12 }}>
        <Text style={[globalStyles.h2, { textAlign: "center" }]}>
          {batch?.vendor ?? "Batch"}
        </Text>
        {items.map((item) => (
          <View key={item.id}>
            <Product product={item.product} />
            <Text style={[globalStyles.text, { paddingHorizontal: 18 }]}>
              {item.quantity} {item.product.unit} - Buy KSH.{item.price} - Sell KSH.{item.profit}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BatchView;
