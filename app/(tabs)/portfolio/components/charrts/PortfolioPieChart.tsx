import React from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { Colors } from "@/src/constants/colors";

export function PortfolioPieChart() {
    const items = usePortfolioStore((s) => s.items);

    const COLORS = [
        Colors.brandPrimary,
        "#2979FF",
        "#FFC107",
        "#E91E63",
        "#8E24AA",
        "#FF7043",
    ];

    const data = items
        .filter((i) => i.shares > 0)
        .map((i, idx) => ({
            value: i.shares * i.currentPrice,
            color: COLORS[idx % COLORS.length],
            text: i.symbol.replace("BINANCE:", ""),
        }));

    if (data.length === 0) return null;

    return (
        <View style={{ marginVertical: 16, alignItems: "center" }}>
            <PieChart
                data={data}
                donut
                showText
                textColor="white"
                radius={80}
                innerRadius={50}
                textSize={12}
                strokeColor="transparent"
                strokeWidth={1}
                // centerLabelComponent={() => (
                //     <View style={{ alignItems: "center" }}>
                //         <View>
                //             <PieChart.CenterLabel text="Portfolio" />
                //         </View>
                //     </View>
                // )}
            />
        </View>
    );
}
