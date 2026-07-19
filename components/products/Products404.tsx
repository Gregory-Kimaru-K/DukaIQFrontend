import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";

const Products404 = () => {
  return (
    <View
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        },
      ]}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: Colors.brand.LIGHT_BLUE + "15",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons
          name="cube-outline"
          size={64}
          color={Colors.brand.LIGHT_BLUE}
        />

        <View
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            backgroundColor: Colors.text.WHITE,
            borderRadius: 20,
            padding: 4,
          }}
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={Colors.brand.LIGHT_BLUE}
          />
        </View>
      </View>

      <Text
        style={[
          globalStyles.text,
          {
            fontSize: 20,
            fontWeight: "700",
            color: Colors.text.WHITE,
            marginBottom: 6,
          },
        ]}
      >
        No Products
      </Text>

      <Text
        style={[
          globalStyles.text,
          {
            textAlign: "center",
            opacity: 0.7,
            maxWidth: 220,
          },
        ]}
      >
        Add your first product.
      </Text>
    </View>
  );
};

export default Products404;