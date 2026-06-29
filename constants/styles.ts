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
    }
})