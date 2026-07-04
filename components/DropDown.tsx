import { Colors } from "@/constants/colors";
import React, { useEffect, useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
type DropDownItem = {
  id: string | number;
  label: string;
  value?: string;
};

type DropDownProps = {
  data: DropDownItem[];
  value?: string;
  placeholder?: string;
  onSelect: (item: DropDownItem) => void;
  noDataMessage?: string;
};

const DropDown = ({
  data,
  value = "",
  placeholder = "Search...",
  onSelect,
  noDataMessage = "No results found",
}: DropDownProps) => {
  const [searchText, setSearchText] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return data;
    return data.filter((item) => {
      const label = item.label.toLowerCase();
      const valueText = (item.value ?? item.label).toLowerCase();
      return label.includes(query) || valueText.includes(query);
    });
  }, [data, searchText]);

  const handleSelect = (item: DropDownItem) => {
    setSearchText(item.label);
    setOpen(false);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchText}
        placeholder={placeholder}
        placeholderTextColor="#ffffff80"
        style={styles.input}
        onChangeText={(text) => {
          setSearchText(text);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />

      {open && (
        <View style={styles.listContainer}>
          {filteredData.length === 0 ? (
            <Pressable onPress={() => setOpen(false)}>
              <Text style={styles.noDataText}>{searchText}</Text>
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
                  <Text style={styles.itemText}>{item.label}</Text>
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
    maxHeight: 350,
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
