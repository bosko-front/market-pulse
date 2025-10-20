import {View, StyleSheet, ScrollView, TouchableOpacity, Text} from "react-native";
import { GradientBackground } from "@/src/components/ui/GradientBackground";
import { PortfolioHeader } from "./components/PortfolioHeader";
import { PortfolioCharts } from "./components/PortfolioCharts";
import { PortfolioTable } from "./components/PortfolioTable";
import {useEffect, useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {AddAssetModal} from "@/app/(tabs)/portfolio/components/AddAssetModal";
import {Colors} from "@/src/constants/colors";
import {usePortfolioStore} from "@/src/store/usePortfolioStore";
import { useIsFocused } from "@react-navigation/native";
import {BottomBlurOverlay} from "@/src/components/ui/BottomBlurOverlay";

export default function PortfolioScreen() {
    const insets = useSafeAreaInsets();
    const [showModal, setShowModal] = useState(false);
    const refreshPrices = usePortfolioStore((s) => s.refreshPrices);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) return;
        refreshPrices();
        const id = setInterval(refreshPrices, 60_000);
        return () => clearInterval(id);
    }, [isFocused, refreshPrices]);



    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container} style={{ paddingBottom: insets.bottom + 120, flex: 1,paddingTop:insets.top + 10 }} showsVerticalScrollIndicator={ false}>
                <PortfolioHeader />
                <PortfolioCharts />
                <PortfolioTable />

                {showModal && <AddAssetModal onClose={() => setShowModal(false)} />}
            </ScrollView>
            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 95 }]}
                onPress={() => setShowModal(true)}
                activeOpacity={0.85}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
            <BottomBlurOverlay/>

        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 24,
        paddingBottom: 140,
    },
    fab: {
        backgroundColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        right: 24,
        shadowColor: "#00E676",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    }
});
