import { Colors } from "@/constants/colors";
import { Category } from "@/databases/models/products/Category";
import { Shop } from "@/databases/models/products/Shop";
import { Type } from "@/databases/models/products/Type";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DropDownItem = { id: string | number; name?: string; label?: string };

interface DropDownProps<T extends DropDownItem> {
  data: T[];
  value?: string;
  placeholder?: string;
  onSelect: (item: T) => void;
  noDataMessage?: string;
  onCreate?: (item: string) => void;
}

const getItemLabel = (item: DropDownItem) =>
  item.name ?? item.label ?? "";

const DropDown = <T extends DropDownItem>({
  data,
  value = "",
  placeholder = "Search...",
  onSelect,
  noDataMessage = "No results found",
  onCreate,
}: DropDownProps<T>) => {
  const [searchText, setSearchText] = useState(value || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value !== searchText) {
      setSearchText(value || "");
    }
  }, [value]);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return data;
    return data.filter((item) => {
      const label = getItemLabel(item).toLowerCase();
      return label.includes(query);
    });
  }, [data, searchText]);

  const handleSelect = (item: T) => {
    const nextText = getItemLabel(item);
    console.log("Selected value:", nextText);
    setSearchText(nextText);
    setOpen(false);
    onSelect(item);
    console.log("Selected value:", nextText);
  };

  const handleCreate = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (onCreate) {
      onCreate(trimmedName);
    }
    setSearchText(trimmedName);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <BottomSheetTextInput
        value={searchText}
        placeholder={placeholder}
        placeholderTextColor="#ffffff80"
        style={styles.input}
        onChangeText={(text) => {
          setSearchText(text);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && (
        <View style={styles.listContainer}>
          {filteredData.length === 0 ? (
            <Pressable onPress={() => handleCreate(searchText)}>
              <Text style={styles.noDataText}>
                {searchText.trim()
                  ? `Create "${searchText.trim()}"`
                  : "Create new entry"}
              </Text>
            </Pressable>
          ) : (
            <BottomSheetScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              nestedScrollEnabled
            >
              {filteredData.map((item) => (
                <Pressable
                  key={item.id.toString()}
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>{getItemLabel(item)}</Text>
                </Pressable>
              ))}
            </BottomSheetScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  input: {
    width: "100%",
    backgroundColor: Colors.brand.BLUE,
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: {
    marginTop: 8,
    maxHeight: 160,
    backgroundColor: "#0f1b34",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2b4a7a",
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 10,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1d335c",
  },
  itemText: {
    color: "#ffffff",
    fontSize: 16,
  },
  noDataText: {
    padding: 12,
    color: "#ffffff70",
  },
});

export default DropDown;
