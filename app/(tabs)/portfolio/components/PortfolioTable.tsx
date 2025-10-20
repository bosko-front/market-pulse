import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { usePortfolioStore} from "@/src/store/usePortfolioStore";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { AddAssetModal } from "./AddAssetModal";
import { Ionicons } from "@expo/vector-icons";

export function PortfolioTable() {
    const items = usePortfolioStore((s) => s.items);
    const removeItem = usePortfolioStore((s) => s.removeItem);

    const [editingItem, setEditingItem] = useState<string | null>(null);

    if (!items.length) {
        return (
            <View style={styles.emptyState}>
                <Text style={[Typography.bodyMd, styles.emptyText]}>No assets yet</Text>
                <Text style={[Typography.bodySm, styles.emptySub]}>
                    Tap “+” to add your first holding
                </Text>
            </View>
        );
    }

    const renderRightActions = (symbol: string) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                removeItem(symbol);
            }}
        >
            <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.table}>
            <View style={styles.headerRow}>
                <Text style={[Typography.bodySm, styles.headerText]}>Symbol</Text>
                <Text style={[Typography.bodySm, styles.headerText]}>Shares</Text>
                <Text style={[Typography.bodySm, styles.headerText]}>Avg. Price</Text>
                <Text style={[Typography.bodySm, styles.headerText]}>P/L</Text>
            </View>

            <View style={styles.divider} />

            {items.map((i) => {
                const pl = (i.currentPrice - i.avgPrice) * i.shares;
                const isPositive = pl >= 0;

                return (
                    <Swipeable
                        key={i.symbol}
                        renderRightActions={() => renderRightActions(i.symbol)}
                        overshootRight={false}
                    >
                        <TouchableOpacity
                            style={styles.row}
                            onLongPress={() => setEditingItem(i.symbol)}
                            activeOpacity={0.7}
                        >
                            <Text style={[Typography.bodyMd, styles.symbol]}>
                                {i.symbol.replace("BINANCE:", "")}
                            </Text>
                            <Text style={[Typography.bodyMd, styles.cell]}>{i.shares}</Text>
                            <Text style={[Typography.bodyMd, styles.cell]}>
                                ${i.avgPrice.toFixed(2)}
                            </Text>
                            <Text
                                style={[
                                    Typography.bodyMd,
                                    styles.cell,
                                    { color: isPositive ? Colors.success : Colors.error },
                                ]}
                            >
                                {isPositive ? "+" : ""}
                                {pl.toFixed(0)}
                            </Text>
                        </TouchableOpacity>
                    </Swipeable>
                );
            })}

            {editingItem && (
                <AddAssetModal
                    onClose={() => setEditingItem(null)}
                    editSymbol={editingItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    table: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: 12,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    headerText: {
        color: Colors.onGradientTextMuted,
        width: 70,
        textAlign: "right",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    cell: {
        color: Colors.onGradientTextPrimary,
        width: 70,
        textAlign: "right",
    },
    symbol: {
        color: Colors.onGradientTextPrimary,
        width: 80,
    },
    deleteButton: {
        backgroundColor: Colors.error,
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        borderRadius: 10,
        marginVertical: 4,
    },
    emptyState: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        color: Colors.onGradientTextPrimary,
        marginBottom: 6,
    },
    emptySub: {
        color: Colors.onGradientTextMuted,
    },
});
