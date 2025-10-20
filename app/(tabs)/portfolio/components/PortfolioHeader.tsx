import { View, Text, StyleSheet } from "react-native";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { Spacing } from "@/src/constants/spacing";
import {useEffect, useState} from "react";

export function PortfolioHeader() {

    const total = usePortfolioStore((s) => s.totalValue());
    const percent = usePortfolioStore((s) => s.totalProfitLossPercent());
    const isPositive = percent >= 0;
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const items = usePortfolioStore((s) => s.items);
    useEffect(() => {
        setLastUpdated(new Date());
    }, [items]);

    return (
        <View style={styles.container}>
            {/* 🔹 Title */}
            <Text style={[Typography.headingMd, styles.title]}>
                My Portfolio
            </Text>

            {/* 🔹 Totals Row */}
            <View style={styles.row}>
                <View style={styles.box}>
                    <Text style={[Typography.bodySm, styles.label]}>Total Value</Text>
                    <Text style={[Typography.headingLg, styles.value]}>
                        ${total.toFixed(2)}
                    </Text>
                </View>

                <View style={[styles.box, { alignItems: "flex-end" }]}>
                    <Text style={[Typography.bodySm, styles.label]}>Daily Change</Text>
                    <Text
                        style={[
                            Typography.headingLg,
                            {
                                color: isPositive
                                    ? Colors.success
                                    : Colors.error,
                            },
                        ]}
                    >
                        {isPositive ? "+" : ""}
                        {percent.toFixed(2)}%
                    </Text>
                </View>
            </View>
            {lastUpdated && (
                <Text style={[Typography.bodyXs, styles.lastUpdated]}>
                    Last updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    title: {
        color: Colors.onGradientTextPrimary,
        marginBottom: Spacing.md,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    box: {
        flex: 1,
    },
    label: {
        color: Colors.onGradientTextMuted,
    },
    value: {
        color: Colors.onGradientTextPrimary,
        marginTop: 4,
    },
    lastUpdated: {
        textAlign: "center",
        color: Colors.onGradientTextMuted,
        marginTop: 12,
        opacity: 0.7,
    },
});
