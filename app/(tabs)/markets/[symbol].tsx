import {View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GradientBackground } from "@/src/components/ui/GradientBackground";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { Spacing } from "@/src/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSymbolDetail } from "@/src/api/useSymbolDetail";
import * as Haptics from "expo-haptics";
import {usePortfolioStore} from "@/src/store/usePortfolioStore";

export default function StockDetailScreen() {
    const router = useRouter();
    const { symbol, type } = useLocalSearchParams();
    const { data, isLoading, error } = useSymbolDetail(symbol as string, type as "stocks" | "crypto");
    const insets = useSafeAreaInsets();
    const { addItem, items,updateItem } = usePortfolioStore();

    const hasQuote = data?.quote && data.quote.c > 0;
    const isStock = data?.type === "stock";
    const profileName = isStock ? data?.profile?.name : data?.symbol;


    const onPress = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (!symbol || !data?.quote?.c) {
            Alert.alert("No data", "This asset doesn’t have a valid price yet.");
            return;
        }

        const symbolStr = symbol.toUpperCase();
        const normalizedSymbol = type === "crypto" && !symbolStr.startsWith("BINANCE:")
            ? `BINANCE:${symbolStr}`
            : symbolStr;

        const existing = items.find((i) => i.symbol === normalizedSymbol);
        if (existing) {
            updateItem(symbolStr, { currentPrice: data.quote.c });
            Alert.alert("Updated", `${symbolStr} price refreshed.`);
        } else {
            addItem({
                symbol: symbolStr,
                shares: 0, // placeholder
                avgPrice: data.quote.c,
                currentPrice: data.quote.c,
            });
            Alert.alert("Added", `${symbolStr} was added to your portfolio.`);
        }
        router.back()
    };

    return (
        <GradientBackground>
            <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
                        <Ionicons name="chevron-back" size={22} color={Colors.onGradientTextPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {isLoading ? (
                    <View style={styles.loaderWrapper}>
                        <ActivityIndicator size="large" color={Colors.onGradientTextPrimary} />
                        <Text style={[Typography.bodySm, { color: Colors.onGradientTextPrimary, marginTop: 12 }]}>
                            Loading...
                        </Text>
                    </View>
                ) : error || !data ? (
                    <View style={styles.loaderWrapper}>
                        <Text style={[Typography.bodySm, { color: Colors.onGradientTextPrimary }]}>
                            Failed to load data.
                        </Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                        {/* 🔹 Title */}
                        <View style={styles.titleSection}>
                            <Text style={[Typography.headingLg, styles.title]}>{profileName || symbol}</Text>
                            <Text style={[Typography.bodySm, styles.subtitle]}>({symbol})</Text>
                        </View>

                        {/* 🔹 Chart placeholder */}
                        <View style={styles.chartPlaceholder}>
                            {hasQuote ? (
                                <Text style={[Typography.bodySm, { color: Colors.onGradientTextMuted }]}>
                                    [Chart Placeholder]
                                </Text>
                            ) : (
                                <Text style={[Typography.bodySm, { color: Colors.onGradientTextMuted }]}>
                                    No data available for this pair
                                </Text>
                            )}
                        </View>

                        {/* 🔹 Stats Section */}
                        {hasQuote && (
                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Open</Text>
                                    <Text style={styles.statValue}>${data.quote?.o?.toFixed(2) ?? "--"}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>High</Text>
                                    <Text style={styles.statValue}>${data.quote?.h?.toFixed(2) ?? "--"}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statLabel}>Volume</Text>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            !data.quote?.v && { opacity: 0.5 }, // dim if missing
                                        ]}
                                    >
                                        {data.quote?.v && data.quote.v > 0
                                            ? `${(data.quote.v / 1_000_000).toFixed(1)}M`
                                            : "--"}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* 🔹 Add to Portfolio Button */}
                        <TouchableOpacity
                            style={styles.addButton}
                            activeOpacity={0.85}
                            onPress={onPress}
                        >
                            <Text style={[Typography.bodyMd, styles.addButtonText]}>
                                Add to Portfolio
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.screenPadding,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
    },
    scrollContainer: {
        paddingBottom: 160,
    },
    titleSection: {
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        color: Colors.onGradientTextPrimary,
        textAlign: "center",
        marginBottom: 4,
    },
    subtitle: {
        color: Colors.onGradientTextMuted,
        textAlign: "center",
    },
    chartPlaceholder: {
        height: 220,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.08)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 40,
    },
    statBox: {
        alignItems: "center",
    },
    statLabel: {
        color: Colors.onGradientTextMuted,
        fontSize: 13,
    },
    statValue: {
        color: Colors.onGradientTextPrimary,
        fontSize: 16,
        marginTop: 4,
        fontWeight: "500",
    },
    addButton: {
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    addButtonText: {
        color: Colors.onGradientTextPrimary,
        fontWeight: "600",
    },
});
