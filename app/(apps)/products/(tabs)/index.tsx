import Draft from "@/components/products/Draft";
import Products404 from "@/components/products/Products404";
import CustomStackTwo from "@/components/stacks/CustomStackTwo";
import { globalStyles } from "@/constants/styles";
import { DraftBatch } from "@/databases/models/stock/Draft";
import { BatchRepo } from "@/databases/repositories/BatchRepo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Array<{ draft: DraftBatch; itemCount: number }>>([]);

  const loadDrafts = async () => {
    const nextDrafts = await BatchRepo.listDrafts();
    const withCounts = await Promise.all(
      nextDrafts.map(async (draft) => ({
        draft,
        itemCount: (await BatchRepo.listDraftItems(draft.id)).length,
      })),
    );
    setDrafts(withCounts);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const iconPress = () => {
    router.push("/(apps)/products/(other)");
  };

  const openDraft = (draftId: string) => {
    router.push(`/(apps)/products/(other)/drafts/${draftId}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomStackTwo
        header="DRAFTING"
        desc="Create and View Drafts"
        icon="add"
        onIconPress={iconPress}
      />
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
        style={{ flex: 1 }}
      >
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <Draft
              key={draft.draft.id}
              batch={draft.draft}
              itemCount={draft.itemCount}
              onPress={() => openDraft(draft.draft.id)}
            />
          ))
        ) : (
          <Products404 icon={"clipboard-outline"} title="No Drafts" desc="You have no drafts to display." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
