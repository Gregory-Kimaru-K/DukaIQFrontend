import { StyleSheet } from "react-native"
import { Colors } from "./colors"

const BASE_TEXT = {
    color: Colors.text.WHITE
}
export const globalStyles = StyleSheet.create({
    bold: {
        fontWeight: "bold"
    },
    h1pro: {
        ...BASE_TEXT,
        fontSize: 32,
        fontWeight: "900"
    },
    h1: {
        ...BASE_TEXT,
        fontSize: 28,
        fontWeight: '700'
    },
    h2: {
        ...BASE_TEXT,
        fontSize: 24
    },
    h3: {
        ...BASE_TEXT,
        fontSize: 20
    },
    h4: {
        ...BASE_TEXT,
        fontSize: 18
    },
    h5: {
        ...BASE_TEXT,
        fontSize: 16
    },
    text: {
        ...BASE_TEXT,
        fontSize: 14
    },
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.brand.DARK_BLUE
    },
    add_btn: {
        backgroundColor: Colors.brand.ORANGE,
        width: "64%",
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 24,
    },
    gesture: {
        width: "100%",
        height: "100%",
        position: "absolute",
        bottom: 0,
    },
    contentContainer: {
        flex: 1,
        zIndex: 2,
    },
    sheetBackground: {
        backgroundColor: "rgba(3, 31, 75, 0.58)",
        borderTopWidth: 4,
        borderTopColor: Colors.brand.LIGHT_BLUE,
    },
    sheetBackground2: {
        backgroundColor: "rgba(3, 31, 75, 0.88)",
    },
    handleIndicator: {
        backgroundColor: "#FFFFFF",
    },
    image_cont: {
      backgroundColor: "rgba(230, 100, 19, 0.48)",
      padding: 12,
      alignSelf: "center",
      borderRadius: 16,
    },
    image: {
        width: 56,
        height: 56
    },
    scan: {
        width: "64%",
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    btn: {
        backgroundColor: Colors.brand.ORANGE,
        width: "64%",
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 8,
        marginTop: 12
    },
    inputContainer: {
        width: "92%",
        alignSelf: "center"
    },
    input: {
        width: "100%",
        height:44,
        padding: 8,
        backgroundColor: Colors.brand.DARK_LIGHT_BLUE,
        color: "#ffffff",
        fontSize: 16,
        borderRadius: 8,
    }
})