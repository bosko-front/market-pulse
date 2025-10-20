import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { LineChart } from "react-native-gifted-charts";
import { Dimensions, View, Text } from "react-native";

const { width } = Dimensions.get("window");

export function PortfolioLineChart() {
    const history = usePortfolioStore((s) => s.history);

    if (history.length < 4) return null;

    const recentHistory = history.slice(-10);
    const values = recentHistory.map((h) => h.totalValue);

    const max = Math.max(...values);
    const min = Math.min(...values);
    const niceMax = Math.ceil(max / 1000) * 1000 + 500;
    const niceMin = Math.floor(min / 1000) * 1000 - 500;

    const data = values.map((v) => ({
        value: v,
        dataPointColor: "#00E676",
        dataPointRadius: 4,
    }));

    return (
        <View style={{ marginVertical: 16, paddingRight: 24 }}>
            <LineChart
                data={data}
                width={width - 40}
                height={160}
                curved
                areaChart
                maxValue={niceMax}
                yAxisOffset={niceMin}
                color="#00E676"
                startFillColor="#00E676"
                endFillColor="#00E676"
                startOpacity={0.25}
                endOpacity={0.02}
                hideRules
                hideOrigin
                hideXAxisText
                noOfSections={5}
                yAxisLabelWidth={58}
                backgroundColor="transparent"
                isAnimated
                animationDuration={800}
                xAxisThickness={0}
                yAxisThickness={0}
                scrollToEnd
                initialSpacing={20}
                spacing={40}
                endSpacing={30}
                yAxisTextStyle={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 11,
                    fontWeight: "700",
                }}
                formatYLabel={(label) => {
                    const num = parseFloat(label);
                    return num >= 1000 ? `$${(num / 1000).toFixed(1)}k` : `$${Math.round(num)}`;
                }}
                pointerConfig={{
                    pointerStripColor: "rgba(255,255,255,0.2)",
                    pointerStripWidth: 1,
                    pointerColor: "#00E676", // ✅ always green
                    radius: 5,
                    pointerLabelWidth: 90,
                    pointerLabelHeight: 36,
                    activatePointersOnLongPress: false,
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelComponent: (items) => {
                        const v = items[0]?.value ?? 0;
                        return (
                            <View
                                style={{
                                    backgroundColor: "rgba(0,0,0,0.75)",
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: "rgba(255,255,255,0.25)",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 14,
                                        fontWeight: "700",
                                    }}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                >
                                    ${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </Text>
                            </View>
                        );
                    },
                }}
            />
        </View>
    );
}
