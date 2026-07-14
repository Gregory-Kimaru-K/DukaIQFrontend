import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScanProducts() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
       <TouchableOpacity style={{ alignItems: "center" }}>
            <LinearGradient
                colors={["#07439F", "#031e47", "#021025"]}
                start={[0, 0]}
                end={[0, 1]}
                style={globalStyles.scan}
            >
                <Ionicons name="image" size={56} color={Colors.brand.ORANGE} />
            </LinearGradient>
        </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={globalStyles.scan}
        facing="back"
        onBarcodeScanned={({ type, data }) => {
          if (!scanned) {
            setScanned(true);
            alert(
              `Bar code with type ${type} and data ${data} has been scanned!`,
            );
            // Add your logic here (e.g., fetch data or navigate)
          }
        }}
      />

      {scanned && (
        <TouchableOpacity
          style={[globalStyles.btn, {width: '40%'}]}
          onPress={() => setScanned(false)}
        >
          <Text style={globalStyles.h5}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  button: { backgroundColor: "white", padding: 15, borderRadius: 5 },
  overlayButton: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 5,
  },
});
