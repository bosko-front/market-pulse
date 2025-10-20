import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Colors } from "@/src/constants/colors";
import { Radius } from "@/src/constants/radius";
import {
    StyleSheet
} from "react-native";
import React from "react";
import {Spacing} from "@/src/constants/spacing";
import {Typography} from "@/src/constants/typography";
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconSymbol} from "@/src/components/ui/icon-symbol-ios";
import {HapticTab} from "@/src/components/HapticTab";


export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton:HapticTab,
                tabBarActiveTintColor: Colors.brandSecondary,
                tabBarInactiveTintColor: "rgba(255,255,255,0.7)",
                tabBarLabelStyle: {
                    fontSize: Typography.bodyXs.fontSize,
                    fontWeight: Typography.bodyXs.fontWeight
                },
                tabBarStyle: {
                    position: "absolute",
                    // bottom: 25,
                    left: 24,
                    right: 24,
                    height: 70,
                    borderRadius: Radius.xl,
                    // backgroundColor: "rgba(2,6,23,0.75)", // darker glass base
                    borderWidth: 1,
                    borderColor: "rgba(99,102,241,0.25)",
                    elevation: 20,
                    shadowColor: "#000",
                    shadowOpacity: 0.35,
                    shadowRadius: Radius.lg,
                    shadowOffset: { width: 0, height: 6 },
                    overflow: "hidden",
                    marginHorizontal: Spacing.xl,
                    marginBottom:insets.bottom + 10,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint="dark"
                        intensity={80}
                        style={StyleSheet.absoluteFillObject}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name="markets"
                options={{
                    title: "Markets",
                    tabBarIcon: ({ color, size, focused }) => (
                        <IconSymbol name="chart.line.uptrend.xyaxis" color={color} weight={focused ? 'bold' : 'regular'} />

                    ),
                }}
            />
            <Tabs.Screen
                name="portfolio"
                options={{
                    title: "Portfolio",
                    tabBarIcon: ({ color, size, focused }) => (
                        <IconSymbol
                            name={focused ? "chart.pie.fill" : "chart.pie"}
                            color={color}
                            weight={focused ? 'bold' : 'regular'}
                        />
            ),
                }}
            />
        </Tabs>
    );
}
