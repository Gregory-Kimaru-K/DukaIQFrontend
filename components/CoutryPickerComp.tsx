import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/colors';
import type { ListHeaderComponentProps } from "react-native-country-codes-picker";
import { CountryButton, CountryPicker } from "react-native-country-codes-picker";

function ListHeaderComponent({
  countries,
  lang,
  onPress,
}: ListHeaderComponentProps) {
  return (
    <View
      style={{
        paddingBottom: 20,
      }}
    >
      {countries?.map((country, index) => {
        return (
          <CountryButton
            key={index}
            item={country}
            name={country?.name?.[lang || "en"]}
            onPress={() => onPress(country)}
          />
        );
      })}
    </View>
  );
}


const CoutryPickerComp = () => {
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState("+254");
    return (
        <View>
            <Pressable
                onPress={() => setShow(true)}
                style={{
                    backgroundColor: Colors.brand.BLUE,
                    padding: 12,
                    borderRadius: 6
                }}
            >
            <Text
                style={{ color: "#ffffff9c", fontSize: 16 }}>{countryCode}</Text>
            </Pressable>
            <CountryPicker
                show={show}
                lang="en"
                pickerButtonOnPress={(item) => {
                    setCountryCode(item.dial_code);
                    setShow(false);
                }}
                ListHeaderComponent={ListHeaderComponent}
                initialState={"+254"}
                style={styles}
            />
        </View>
  )
}

const styles = StyleSheet.create({
    modal: {
        height: 500,
        backgroundColor: "#08162caa",
    },
    line: {
        backgroundColor: "#07439F",
    },
    countryButtonStyles: {
        width: "96%",
        height: 40,
        alignSelf: "center",
        backgroundColor: "#031f4b90",
        marginTop: 6,
    },
    dialCode: {
        color: "#ffffff",
    },
    // Country name styles [Text]
    countryName: {
        color: "#ffffff",
    },
    textInput: {
        backgroundColor: "#031f4bdc",
        color: "#ffffff"
    },
})
export default CoutryPickerComp