import { TabButton } from "@/components/TabButton";
import { Colors } from "@/constants/colors";
import { useSegments } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { AnimatePresence, MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabOrder = ["statistics", "index", ,"transactions"];

const TabsLayout = () => {
  const segments = useSegments();
  const currentRoute =
    (segments.length === 3 ? segments[segments.length - 1] : "index") ??
    "index";
  const previousRouteRef = useRef(currentRoute);
  const [slideDirection, setSlideDirection] = useState(0);
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
    <SafeAreaView style={styles.wrapper} edges={["bottom"]}>
      <Tabs style={{ backgroundColor: Colors.brand.DARK_BLUE, flex: 1 }}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={animationKey}
            style={styles.contentWrapper}
            from={{ opacity: 0, translateY: 500 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 500,
              // easing: Easing.inOut(Easing.ease),
            }}
            exit={{ opacity: 0 }}
            exitTransition={{
              type: "timing",
              duration: 10
            }}
          >
            <TabSlot />
          </MotiView>
        </AnimatePresence>
        <TabList style={styles.tab}>
          <TabTrigger name="index" href="./" asChild>
            <TabButton icon="albums-outline" />
          </TabTrigger>
          <TabTrigger name="statistics" href="./statistics" asChild>
            <TabButton icon="stats-chart-outline" />
          </TabTrigger>
        </TabList>
      </Tabs>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.brand.DARK_BLUE,
  },
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

export default TabsLayout;