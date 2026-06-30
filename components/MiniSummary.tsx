import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '@/constants/styles'
import { Image } from 'expo-image'
import { Colors } from '@/constants/colors'
import { LinearGradient } from 'expo-linear-gradient'

const MiniSummary = () => {
  return (
    <View style={styles.container}>
      <View style={{ gap: 12 }}>
        <LinearGradient 
          colors={["#F2760D", "#E66413", "#B24209"]}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.sale}>
          <Text style={globalStyles.text}>Today's Sales</Text>
          <Text style={[globalStyles.text, {fontWeight: "bold"}]}>KSH. 600</Text>
          <Text style={globalStyles.text}>1 Transaction</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#0009b5","#0b1190", "#03074c","#020325"]}
          start={[0,0]}
          end={[0,0.9]}
          
          style={styles.profit}>
          <Image source={require("../assets/Profit.png")} style={styles.icon} />
          <Text style={globalStyles.text}>Today's Net Profit</Text>
          <Text style={[globalStyles.text, {fontWeight: "bold"}]}>KSH. 300</Text>
        </LinearGradient>
      </View>

      <View style={{ gap: 12 }}>
        <LinearGradient
          colors={["#0009b5","#040a74", "#03074c","#020325"]}
          start={[0,0]}
          end={[0,1]}
          style={styles.monetary}>
          <Image source={require("../assets/iphone.png")} style={styles.icon} />
          <Text style={globalStyles.text}>Mpesa</Text>
          <Text style={globalStyles.text}>KSH. 300</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#0009b5","#040a74", "#03074c","#020325"]}
          start={[0,0]}
          end={[0,1]}
          style={styles.monetary}>
          <Image source={require("../assets/dollarbag.png")} style={styles.icon} />
          <Text style={globalStyles.text}>Cash</Text>
          <Text style={globalStyles.text}>KSH. 300</Text>
        </LinearGradient>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 12
  },
  icon: {
    width: 40,
    height: 40
  },
  sale: {
    backgroundColor: Colors.brand.ORANGE,
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    borderRadius: 16
  },
  profit: {
    backgroundColor: Colors.brand.LIGHT_BLUE,
    width: 220,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16
  },
  monetary: {
    backgroundColor: "blue",
    width: 130,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16
  }
})

export default MiniSummary