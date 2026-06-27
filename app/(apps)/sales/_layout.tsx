import { TabButton } from "@/components/TabButton";
import { Colors } from "@/constants/colors";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React from "react";
import { StyleSheet } from "react-native";

const SalesLayout = () => {
    return (
        <Tabs>
            <TabSlot />
            <TabList style={styles.tab}>
                <TabTrigger name="statistics" href="./statistics" asChild>
                    <TabButton icon="stats-chart-outline"/>
                </TabTrigger>
                <TabTrigger name="index" href="/" asChild>
                    <TabButton icon="cart-outline" />
                </TabTrigger>
                <TabTrigger name="transactions" href="./transactions" asChild>
                    <TabButton icon="albums-outline" />
                </TabTrigger>
            </TabList>
        </Tabs>
    );
};

const styles = StyleSheet.create({
    tab: {
        height: 80,
        backgroundColor: Colors.brand.DARK_BLUE,
        justifyContent: "space-around",
        alignItems:"center" ,
        borderTopWidth: 4,
        borderTopColor: Colors.brand.BLUE
    }
})
export default SalesLayout;
