import { View, StyleSheet } from "react-native";
import {BlurView} from "expo-blur";
import {LinearGradient} from "expo-linear-gradient";
import {Colors} from "@/src/constants/colors";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export function BottomBlurOverlay() {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 90 + insets.bottom,
            }}
            pointerEvents="none"
        >
            <BlurView tint="default" intensity={60} style={StyleSheet.absoluteFill} />
            <LinearGradient
                colors={[
                    "#6366F1AA",
                    "#0EA5E999",
                    "transparent",
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}
