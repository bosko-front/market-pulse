import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/src/constants/colors";

type Props = {
    children: React.ReactNode;
    style?: ViewStyle;
};

export function GradientBackground({ children, style }: Props) {
    return (
        <LinearGradient
            colors={Colors.brandGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
