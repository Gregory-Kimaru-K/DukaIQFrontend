import { View, Text } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors'
import { globalStyles } from '@/constants/styles'
import { StyleSheet, Image } from 'react-native'
const Sale = () => {
    return (
        <View style={styles.sale}>
            <View style={styles.image_cont}>
                <Image source={require("../../assets/Checkmark.png")} style={styles.image}/>
            </View>
            <View style={{ width: "84%", gap: 16 }}>
                <View style={styles.sales_top}>
                    <Text style={[globalStyles.h2, {fontWeight: "bold"}]}>ORD-xxxxxx</Text>

                <View style={{ backgroundColor: Colors.brand.DARK_LIGHT_BLUE, padding: 4, borderRadius: 8 }}>
                        <Text style={globalStyles.text}>Cash</Text>
                </View>
                <Text style={[globalStyles.text, {fontWeight: "bold"}]}>5.13PM</Text>
            </View>

                <View style={styles.sales_bt}>
                    <Text style={globalStyles.text}>3 items</Text>
                    <Text style={[globalStyles.text, {fontWeight: "bold"}]}>KSH. 500</Text>
                </View>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
  image: {
    width: 40,
    height: 40
  },
  image_cont: {
    width: "12%",
    height: 44,
    backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",    
  },
  sales_cont: {
    marginTop: 12,
    gap: 12,
  },
  sale: {paddingVertical: 8,
    borderTopWidth: 4,
    borderTopColor: Colors.brand.BLUE,
    width: "100%",
    flexDirection: "row",
    flex: 1,
    gap: "1%",
    alignItems: "center"
  },
  sales_top: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sales_bt: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  }
})

export default Sale