import Draft from "@/components/products/Draft";
import CustomStackTwo from "@/components/stacks/CustomStackTwo";
import { Batch } from "@/databases/models/stock/Batch";
import { BatchRepo } from "@/databases/repositories/BatchRepo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/constants/styles";
import Products404 from "@/components/products/Products404";

const BatchIndex = () => {
  const router = useRouter();
  const [batches, setBatches] = useState<Array<{ batch: Batch; itemCount: number }>>([]);

  const loadBatches = async () => {
    const nextBatches = await BatchRepo.listSavedBatches();
    const withCounts = await Promise.all(
      nextBatches.map(async (batch) => ({
        batch,
        itemCount: (await BatchRepo.listBatchItemsByBatch(batch.id)).length,
      })),
    );
    setBatches(withCounts);
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const iconPress = () => {
    router.push("/(apps)/products/(other)");
  };

  const openBatch = (batchId: string) => {
    router.push(`/(apps)/products/(other)/batches/${batchId}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomStackTwo
        header="RESTOCK"
        desc="View, Add and Edit Batches"
        icon="add"
        onIconPress={iconPress}
      />
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
        style={{ flex: 1 }}
      >
        {batches.length > 0 ? (
          batches.map((batch) => (
            <Draft
              key={batch.batch.id}
              batch={batch.batch}
              itemCount={batch.itemCount}
              onPress={() => openBatch(batch.batch.id)}
            />
          ))
        ) : (
          <Products404 icon={"file-tray-stacked-outline"} title="No Batches" desc="You have no saved batches to display." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BatchIndex;
