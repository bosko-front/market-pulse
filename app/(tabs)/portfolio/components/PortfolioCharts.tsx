import React from "react";
import { View, StyleSheet } from "react-native";
import {PortfolioLineChart} from "@/app/(tabs)/portfolio/components/charrts/PortfolioLineChart";
import {PortfolioPieChart} from "@/app/(tabs)/portfolio/components/charrts/PortfolioPieChart";


export function PortfolioCharts() {
    return (
        <View style={styles.container}>
            <PortfolioLineChart />
            {/*<PortfolioPieChart />*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
});
