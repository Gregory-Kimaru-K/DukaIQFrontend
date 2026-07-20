import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { DraftItem } from "@/databases/models/stock/DraftItem";
import { BatchRepo } from "@/databases/repositories/BatchRepo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProductDetsProps = {
  draftItem?: DraftItem | null;
  onSaved?: () => void | Promise<void>;
};

const ProductDets = ({ draftItem, onSaved }: ProductDetsProps) => {
  const [stockType, setStockType] = useState("UNITS");
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [packQuantity, setPackQuantity] = useState(0)
  const [price, setPrice] = useState(0);
  const [selling, setSelling] = useState(0);
  const [profiting, setProfiting] = useState("UNIT")

  useEffect(() => {
    if (!draftItem) return;

    setQuantity(draftItem.quantity);
    setBuyingPrice(draftItem.price);
    setSelling(draftItem.profit);
  }, [draftItem]);

  const handlePrice = () => {
    if (stockType === "PACKET") {
      if (packQuantity <= 0) {
        setPrice(0);
        return;
      }
      const buying = Math.ceil(buyingPrice / packQuantity)
      setPrice(isNaN(buying) ? 0 : buying)
    }
  }

  const handleSave = async () => {
    if (!draftItem) {
      alert("Select a product before adding details");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than zero");
      return;
    }

    await BatchRepo.updateDraftItem(draftItem.id, {
      quantity,
      price: stockType === "PACKET" && profiting === "UNIT" ? price : buyingPrice,
      profit: selling,
      updated_at: new Date().toISOString(),
    });
    await onSaved?.();
    alert("Draft product details saved");
  };

  const handleProfit = () => {
    if (stockType === "PACKET") {
      if (packQuantity <= 0) {
        setSelling(0);
        return;
      }
      const buying = Math.ceil(buyingPrice / packQuantity)
      if (profiting === "UNIT") {
        setSelling(isNaN(buying) ? 0 : buying)
      }
      else if(profiting === "PACK") {
        setSelling(buyingPrice)
      }
    }
    else {
      setSelling(buyingPrice)
    }
  }

  useEffect(() => {
    handlePrice()
  }, [quantity, packQuantity, buyingPrice])

  useEffect(() => {
    handleProfit()
  }, [stockType, profiting, quantity, packQuantity, buyingPrice])
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
      <View style={styles.quantity_type}>
        <Text
          onPress={() => setStockType("UNITS")}
          style={[
            globalStyles.text,
            {
              backgroundColor:
                stockType === "UNITS"
                  ? Colors.brand.LIGHT_DARK_BLUE
                  : undefined,
              padding: 4,
              borderRadius: 4,
            },
          ]}
        >
          UNITS
        </Text>
        <Text
          onPress={() => setStockType("PACKET")}
          style={[
            globalStyles.text,
            {
              backgroundColor:
                stockType === "PACKET"
                  ? Colors.brand.LIGHT_DARK_BLUE
                  : undefined,
              padding: 4,
              borderRadius: 4,
            },
          ]}
        >
          PACKETS
        </Text>
      </View>

      <Text style={styles.head}>PER {stockType}</Text>

      <View style={{ gap: 12, alignItems: "center" }}>
        <View style={styles.dets}>
          <Text style={styles.module_head}>Buying Per {stockType}</Text>
          <View style={styles.quantity}>
            <Text style={styles.bold_text}>KSH.</Text>
            <Pressable
              style={styles.quantity_btn}
              onPress={() => setBuyingPrice(Math.max(0, buyingPrice - 1))}
            >
              <Ionicons name="remove" size={16} color={"#ffffff"} />
            </Pressable>

            <BottomSheetTextInput
              keyboardType="numeric"
              value={buyingPrice.toString()}
              style={[globalStyles.text]}
              onChangeText={(text) => {
                const value = Number(text);
                setBuyingPrice(isNaN(value) ? 0 : Math.max(0, value));
              }}
            />

            <Pressable
              style={styles.quantity_btn}
              onPress={() => setBuyingPrice(buyingPrice + 1)}
            >
              <Ionicons name="add" size={16} color={"#ffffff"} />
            </Pressable>
          </View>
        </View>

        <View style={styles.dets}>
          <Text style={styles.module_head}>Quantity</Text>
          <View style={styles.quantity}>
            <Text style={styles.bold_text}>Units</Text>
            <Pressable
              style={styles.quantity_btn}
                onPress={() => setQuantity(Math.max(0, quantity - 1))}
            >
              <Ionicons name="remove" size={16} color={"#ffffff"} />
            </Pressable>
            <BottomSheetTextInput
              keyboardType="numeric"
              value={quantity.toString()}
              style={[globalStyles.text]}
              onChangeText={(text) => {
                  const value = Number(text)
                  setQuantity(isNaN(value) ? 0 : value)
                }}/>
            <Pressable
              style={styles.quantity_btn}
              onPress={() => setQuantity(quantity + 1)}>
              <Ionicons name="add" size={16} color={"#ffffff"} />
            </Pressable>
          </View>
        </View>

        {stockType === "PACKET" && (
          <View style={styles.dets}>
            <Text style={styles.module_head}>Quantity per Packet</Text>
            <View style={styles.quantity}>
              <Text style={styles.bold_text}>Units</Text>
              <Pressable
                style={styles.quantity_btn}
                onPress={() => setPackQuantity(Math.max(0, packQuantity - 1))}
                >
                <Ionicons name="remove" size={16} color={"#ffffff"} />
              </Pressable>

              <BottomSheetTextInput
                keyboardType="numeric"
                value={packQuantity.toString()}
                style={[globalStyles.text]}
                onChangeText={(text) => {
                  const value = Number(text)
                  setPackQuantity(isNaN(value) ? 0 : value)
                }}/>
              <Pressable
                style={styles.quantity_btn}
                onPress={() => setPackQuantity(packQuantity + 1)}>
                <Ionicons name="add" size={16} color={"#ffffff"} />
              </Pressable>
            </View>
          </View>
        )}

        {stockType === "PACKET" && (
          <View style={styles.dets}>
            <Text style={styles.bold_text}>Unit Price</Text>
            <Text style={globalStyles.text}>KSH. {price}</Text>
          </View>
        )}
        <View style={styles.dets}>
          {stockType === "PACKET" && (
            <View style={styles.profiting}>
              <Text
                style={[styles.profiting_st, profiting === "PACK" && styles.profiting_focus]}
                onPress={() => setProfiting("PACK")}>
                  Per Pack
              </Text>
              <Text
                style={[styles.profiting_st, profiting === "UNIT" && styles.profiting_focus]}
                onPress={() => setProfiting("UNIT")}>
                  Per Unit
              </Text>
            </View>
          )}
          <Text style={styles.module_head}>Selling Price</Text>
          <View style={styles.quantity}>
            <Text style={styles.bold_text}>KSH.</Text>
            <Pressable
              style={styles.quantity_btn}
              onPress={() => {
                setSelling(Math.max(0, selling - 1))
              }}
            >
              <Ionicons name="remove" size={16} color={"#ffffff"} />
            </Pressable>

            <BottomSheetTextInput
              keyboardType="numeric"
              value={selling.toString()}
              style={[globalStyles.text]}
              onChangeText={(text) => {
                const value = Number(text)
                setSelling(isNaN(value) ? 0 : value)
              }}/>

            <Pressable
              style={styles.quantity_btn}
              onPress={() => setSelling(selling + 1)}>
              <Ionicons name="add" size={16} color={"#ffffff"} />
            </Pressable>
          </View>
        </View>
      </View>
      <Pressable style={globalStyles.btn} onPress={handleSave}>
        <Text style={[globalStyles.h2]}>Save</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 8,
  },
  head: {
    textTransform: "capitalize",
    textAlign: "left",
    fontWeight: "bold",
    ...globalStyles.h5,
  },
  dets: {
    backgroundColor: Colors.brand.BLUE,
    borderRadius: 8,
    padding: 8,
    width: "80%",
    gap: 4,
  },
  dets2: {
    backgroundColor: Colors.brand.BLUE,
    borderRadius: 8,
    padding: 8,
    width: "40%",
    gap: 4,
  },
  quantity_btn: {
    borderWidth: 1.5,
    borderColor: "#ffffff",
    borderRadius: 4,
  },
  quantity_type: {
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
    backgroundColor: Colors.brand.LIGHT_BLUE,
    padding: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  module_head: {
    ...globalStyles.text,
    fontWeight: "bold",
  },
  bold_text: {
    ...globalStyles.text,
    fontWeight: "bold",
  },
  profiting: {
    flexDirection: "row",
    gap: 8,
    alignSelf: "center",
    backgroundColor: Colors.brand.LIGHT_BLUE,
    padding: 4,
    borderRadius: 4
  },
  profiting_st: {
    ...globalStyles.text,
    padding: 3,
    borderRadius: 4
  },
  profiting_focus: {
    backgroundColor: Colors.brand.DARK_LIGHT_BLUE
  }
});

export default ProductDets;
