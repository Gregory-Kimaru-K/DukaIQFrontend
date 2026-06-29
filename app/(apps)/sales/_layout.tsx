import { TabButton } from "@/components/TabButton";
import { Colors } from "@/constants/colors";
import { useSegments } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Easing } from "react-native-reanimated";

const tabOrder = ["index", "statistics", "transactions"];

const SalesLayout = () => {
  const segments = useSegments();
  const currentRoute =
    (segments.length === 3 ? segments[segments.length - 1] : "index") ??
    "index";
  const previousRouteRef = useRef(currentRoute);
  const [slideDirection, setSlideDirection] = useState(1);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const previousRoute = previousRouteRef.current;
    if (previousRoute !== currentRoute) {
      const previousIndex = tabOrder.indexOf(previousRoute);
      const currentIndex = tabOrder.indexOf(currentRoute);
      const direction = currentIndex > previousIndex ? -1 : 1;
      setSlideDirection(direction);
      setAnimationKey((value) => value + 1);
      previousRouteRef.current = currentRoute;
    }
  }, [currentRoute]);

  return (
    <Tabs style={{ backgroundColor: Colors.brand.DARK_BLUE, flex: 1 }}>
      <MotiView
        key={animationKey}
        style={styles.contentWrapper}
        from={{ opacity: 0.2, translateX: slideDirection * 400 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{
          type: "timing",
          duration: 500,
          easing: Easing.inOut(Easing.ease),
        }}
      >
        <TabSlot />
      </MotiView>
      <TabList style={styles.tab}>
        <TabTrigger name="statistics" href="./statistics" asChild>
          <TabButton icon="stats-chart-outline" />
        </TabTrigger>
        <TabTrigger name="index" href="./" asChild>
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
  contentWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  tab: {
    height: 92,
    backgroundColor: Colors.brand.DARK_BLUE,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 4,
    borderTopColor: Colors.brand.BLUE,
  },
});

export default SalesLayout;
