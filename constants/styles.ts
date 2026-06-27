import { StyleSheet } from "react-native"
import { Colors } from "./colors"

const BASE_TEXT = {
    color: Colors.text.WHITE
}
export const globalStyles = StyleSheet.create({
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
    }
})