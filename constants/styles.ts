import { StyleSheet } from "react-native"
import { Colors } from "./colors"

const BASE_TEXT = {
    color: Colors.text.WHITE
}
export const globalStyles = StyleSheet.create({
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
        backgroundColor: "rgba(3, 31, 75, 0.96)",
    },
    handleIndicator: {
        backgroundColor: "#FFFFFF",
    }
})