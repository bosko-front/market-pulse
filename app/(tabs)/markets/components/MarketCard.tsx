import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Colors } from "@/src/constants/colors";
import { Spacing } from "@/src/constants/spacing";
import { Typography } from "@/src/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type MarketCardProps = {
    symbol: string;
    name: string;
    price: string;
    change: string;
    isPositive?: boolean;
};

// 🔹 Small pulse shimmer used when data is missing
function PulsePlaceholder({ width = 50 }: { width?: number }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.pulse,
                { opacity, width, backgroundColor: "rgba(255,255,255,0.12)" },
            ]}
        />
    );
}


function MarketTrendIcon({ isPositive }: { isPositive: boolean }) {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1.15,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.25,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.6,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    }, []);

    const iconColor = isPositive ? Colors.success : Colors.error;
    const gradientColors = isPositive
        ? ["rgba(0, 230, 118, 0.25)", "rgba(0, 230, 118, 0.05)"]
        : ["rgba(255, 82, 82, 0.25)", "rgba(255, 82, 82, 0.05)"];

    return (
        <View style={styles.iconWrapper}>
            <Animated.View
                style={[
                    styles.iconPulse,
                    {
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            />
            <LinearGradient
                colors={gradientColors}
                style={styles.iconGradient}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
            >
                <Ionicons
                    name={isPositive ? "trending-up" : "trending-down"}
                    size={20}
                    color={iconColor}
                />
            </LinearGradient>
        </View>
    );
}

export function MarketCard({
                               symbol,
                               name,
                               price,
                               change,
                               isPositive = true,
                           }: MarketCardProps) {
    const showPlaceholder = !price || price === "--";

    return (
        <View style={styles.card}>
            {/* Left side */}
            <View style={styles.left}>
                <MarketTrendIcon isPositive={isPositive} />

                <View>
                    <Text style={[Typography.bodyMd, styles.symbol]}>{symbol}</Text>
                    <Text style={[Typography.bodySm, styles.name]}>{name}</Text>
                </View>
            </View>

            {/* Right side */}
            <View style={styles.right}>
                {showPlaceholder ? (
                    <>
                        <PulsePlaceholder width={60} />
                        <View style={{ height: 6 }} />
                        <PulsePlaceholder width={40} />
                    </>
                ) : (
                    <>
                        <Text style={[Typography.bodyMd, styles.price]}>{price}</Text>
                        <Text
                            style={[
                                Typography.bodySm,
                                { color: isPositive ? Colors.success : Colors.error },
                            ]}
                        >
                            {change}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    left: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
    iconWrapper: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    iconGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    iconPulse: {
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    symbol: { color: Colors.textPrimary, fontWeight: "600" },
    name: { color: Colors.textSecondary },
    right: { alignItems: "flex-end" },
    price: { color: Colors.textPrimary, fontWeight: "500" },
    pulse: {
        height: 16,
        borderRadius: 4,
    },
});
