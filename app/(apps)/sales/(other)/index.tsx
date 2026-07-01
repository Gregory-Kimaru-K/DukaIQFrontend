import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateSaleScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={[globalStyles.h2, styles.title]}>Create Sale</Text>
        <Text style={[globalStyles.text, styles.subtitle]}>
          This is where you can add a new sale.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.DARK_BLUE,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.brand.BLUE,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    color: Colors.text.WHITE,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.text.WHITE,
    opacity: 0.8,
  },
});

export default CreateSaleScreen;
