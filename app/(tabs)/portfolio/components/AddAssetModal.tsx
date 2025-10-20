import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/src/constants/colors";
import { Typography } from "@/src/constants/typography";
import { usePortfolioStore} from "@/src/store/usePortfolioStore";
import { BlurView } from "expo-blur";

type AddAssetModalProps = {
    onClose: () => void;
    editSymbol?: string | null;
};
export function AddAssetModal({ onClose, editSymbol }: AddAssetModalProps) {
    const { items, addItem, updateItem } = usePortfolioStore();

    const editing = !!editSymbol;
    const existing = items.find((i) => i.symbol === editSymbol);

    const [symbol, setSymbol] = useState(existing?.symbol ?? "");
    const [shares, setShares] = useState(
        existing ? String(existing.shares) : ""
    );
    const [avgPrice, setAvgPrice] = useState(
        existing ? String(existing.avgPrice) : ""
    );

    const handleSave = () => {
        if (!symbol || !shares || !avgPrice) return;

        if (editing) {
            updateItem(symbol, {
                shares: parseFloat(shares),
                avgPrice: parseFloat(avgPrice),
            });
        } else {
            addItem({
                symbol: symbol.toUpperCase().trim(),
                shares: parseFloat(shares),
                avgPrice: parseFloat(avgPrice),
                currentPrice: parseFloat(avgPrice), // placeholder until live data
            });
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onClose();
    }


    return (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.container}
            >
                <View style={styles.modal}>
                    <Text style={[Typography.headingMd, styles.title]}>
                        Add Asset
                    </Text>

                    <TextInput
                        placeholder="Symbol (e.g. AAPL or BTCUSDT)"
                        placeholderTextColor={Colors.textMuted}
                        value={symbol}
                        onChangeText={setSymbol}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Number of shares"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="decimal-pad"
                        value={shares}
                        onChangeText={setShares}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Average price"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="decimal-pad"
                        value={avgPrice}
                        onChangeText={setAvgPrice}
                        style={styles.input}
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            !(symbol && shares && avgPrice) && { opacity: 0.5 },
                        ]}
                        onPress={handleSave}
                        disabled={!symbol || !shares || !avgPrice}
                        activeOpacity={0.8}
                    >
                        <Text style={[Typography.bodyMd, styles.buttonText]}>
                            {editing ? "Save Changes" : "Add"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                        <Text style={[Typography.bodySm, styles.cancelText]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    modal: {
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: 20,
        padding: 24,
    },
    title: {
        color: Colors.onGradientTextPrimary,
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: 12,
        color: Colors.onGradientTextPrimary,
        marginBottom: 14,
    },
    button: {
        backgroundColor: Colors.success,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 6,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    cancelButton: {
        marginTop: 12,
        alignItems: "center",
    },
    cancelText: {
        color: Colors.onGradientTextMuted,
    },
});
