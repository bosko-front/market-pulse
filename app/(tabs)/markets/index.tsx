import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform, ActivityIndicator,
} from "react-native";
import {useEffect, useRef, useState} from "react";
import {Colors} from "@/src/constants/colors";
import {Spacing} from "@/src/constants/spacing";
import {Typography} from "@/src/constants/typography";
import {GradientBackground} from "@/src/components/ui/GradientBackground";
import {MarketCard} from "./components/MarketCard";
import {BottomBlurOverlay} from "@/src/components/ui/BottomBlurOverlay";
import {BlurView} from "expo-blur";
import {Ionicons} from "@expo/vector-icons";
import {useMarketList} from "@/src/api/useMarketQuotes";
import {useSymbolSearchWithQuotes} from "@/src/api/useSymbolSearch";
import {withTiming} from "react-native-reanimated";
import {LastUpdated} from "@/src/components/ui/LastUpdated";
import {Link, useRouter} from "expo-router";
import {prefetchSymbolDetail} from "@/src/api/useSymbolDetail";
import {useQueryClient} from "@tanstack/react-query";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MarketsScreen() {
    const [activeTab, setActiveTab] = useState<"stocks" | "crypto">("stocks");
    const { data, isLoading, isFetching } = useMarketList(activeTab);
    const [query, setQuery] = useState("");
    const { data: searchResults, isLoading: searching } = useSymbolSearchWithQuotes(query, activeTab);
    const insets = useSafeAreaInsets();

    const scrollY = useRef(new Animated.Value(0)).current;

    const HEADER_COLLAPSE = 100;

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_COLLAPSE * 0.8],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const searchTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_COLLAPSE],
        outputRange: [0, -110],
        extrapolate: "clamp",
    });

    const blurOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_COLLAPSE / 2],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    const lastUpdatedTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_COLLAPSE ],
        outputRange: [0, -20],
        extrapolate: "clamp",
    });

    const lastUpdatedOpacity = scrollY.interpolate({
        inputRange: [0, 20 ],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });


    const ToggleContainer = () => {
        return (
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    onPress={() => setActiveTab("stocks")}
                    style={[
                        styles.toggleButton,
                        activeTab === "stocks" && styles.toggleButtonActive,
                    ]}
                >
                    <Text
                        style={[
                            Typography.bodySm,
                            activeTab === "stocks" ? styles.toggleTextActive : styles.toggleText,
                        ]}
                    >
                        Stocks
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab("crypto")}
                    style={[
                        styles.toggleButton,
                        activeTab === "crypto" && styles.toggleButtonActive,
                    ]}
                >
                    <Text
                        style={[
                            Typography.bodySm,
                            activeTab === "crypto" ? styles.toggleTextActive : styles.toggleText,
                        ]}
                    >
                        Crypto
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }


    const AnimatedMarketCard = ({ item, index, showSearchResults }: any) => {
        const fadeAnim = useRef(new Animated.Value(showSearchResults ? 0 : 1)).current;
        const translateY = useRef(new Animated.Value(showSearchResults ? 10 : 0)).current;
        const router = useRouter();
        const queryClient = useQueryClient();

        const handlePress =  () => {
            router.push({
                pathname: `/markets/[symbol]`,
                params: { symbol: item.symbol, type: activeTab },
            });
        };

        const handlePressIn = async () => {
            // ⚡ Prefetch before navigating
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await prefetchSymbolDetail(item.symbol,activeTab, queryClient);

        };

        useEffect(() => {
            if (showSearchResults) {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 250,
                        delay: index * 60,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 250,
                        delay: index * 60,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }, [showSearchResults]);

        return (
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPressIn={handlePressIn}
                    onPress={handlePress}
                >
                    <MarketCard
                        symbol={item.symbol}
                        name={item.description || item.name || item.symbol}
                        price={item.price ? `$${item.price.toFixed(2)}` : "--"}
                        change={item.change ? `${item.change.toFixed(2)}%` : ""}
                        isPositive={item.isPositive ?? true}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    };


    const renderItem = ({ item, index }: any) => (
        <AnimatedMarketCard
            item={item}
            index={index}
            showSearchResults={showSearchResults}
        />
    );


    const showSearchResults = query.length > 1;
    const listData = showSearchResults ? searchResults : data;


    return (
        <GradientBackground>
            <View style={styles.container}>

                <Animated.View
                    style={[styles.headerBlurWrapper, {opacity: blurOpacity}]}
                    pointerEvents="none"
                >
                    <BlurView
                        intensity={Platform.OS === "ios" ? 60 : 40}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.blurDivider}/>
                </Animated.View>

                {/* Header */}
                <View
                    style={[
                        styles.headerContainer,
                        { top: (Platform.OS === "ios" ? 55 : 40) + insets.top * 0.5 }, // ✅ Apply inset here
                    ]}
                >
                    {/* Title + toggles fade out */}
                    <Animated.View style={{opacity: headerOpacity}}>
                        <Text style={[Typography.headingLg, styles.headerTitle]}>Markets</Text>
                        <ToggleContainer/>

                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.searchWrapper,
                            { transform: [{ translateY: searchTranslateY }] },
                        ]}
                    >
                        <View style={styles.searchContainer}>
                            <Ionicons
                                name="search"
                                size={18}
                                color={Colors.onGradientTextMuted}
                                style={styles.searchIcon}
                            />
                            <TextInput
                                placeholder={activeTab === "stocks" ? "Search Stocks" : "Search Crypto"}
                                placeholderTextColor={Colors.onGradientTextMuted}
                                cursorColor={Colors.onGradientTextPrimary}
                                value={query}
                                onChangeText={setQuery}
                                style={styles.searchInput}
                            />
                        </View>

                    </Animated.View>
                    <Animated.View
                        style={{
                            opacity: lastUpdatedOpacity,
                            transform: [{ translateY: lastUpdatedTranslateY }],
                            alignItems: "center",
                            marginTop: 12,
                            zIndex: 20,
                        }}
                    >
                        <LastUpdated isFetching={isFetching} />
                    </Animated.View>
                </View>


                {(query.length > 1 ? searching : isLoading) ? (
                    <View style={styles.loaderWrapper}>
                        <ActivityIndicator size="large" color={Colors.onGradientTextPrimary} />
                        <Text style={{ color: Colors.onGradientTextPrimary, marginTop: 12 }}>
                            Loading...
                        </Text>
                    </View>
                ) : (showSearchResults && (!searchResults || searchResults.length === 0)) ? (
                    <View style={styles.loaderWrapper}>
                        <Text style={{ color: Colors.onGradientTextPrimary, opacity: 0.6 }}>
                            No results found
                        </Text>
                    </View>
                ) : (
                    <Animated.FlatList
                        data={listData}
                        keyExtractor={(item, index) => `${item.symbol}-${index}`}
                        renderItem={renderItem}
                        style={{ opacity: withTiming(showSearchResults ? 1 : 0.6, { duration: 200 }),
                        }}
                        contentContainerStyle={{
                            paddingTop: 290,
                            paddingBottom: 160,
                        }}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                    />
                )}

                <BottomBlurOverlay/>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex:0,
        position:'relative',
        paddingHorizontal: Spacing.screenPadding,
    },
    headerBlurWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        zIndex: 15,
    },
    blurDivider: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    headerContainer: {
        position: "absolute",
        top: Platform.OS === "ios" ? 55 : 40,
        left: Spacing.screenPadding,
        right: Spacing.screenPadding,
        zIndex: 20,
    },
    headerTitle: {
        color: Colors.onGradientTextPrimary,
        marginBottom: Spacing.lg,
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    toggleButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 12,
    },
    toggleButtonActive: {
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    toggleText: {
        color: Colors.onGradientTextMuted,
    },
    toggleTextActive: {
        color: Colors.onGradientTextPrimary,
        fontWeight: "600",
    },
    searchWrapper: {
        zIndex: 25,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === "ios" ? 8 : 6,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: Colors.onGradientTextPrimary,
        fontSize: 15,
        paddingVertical: 6,
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
    },

    dropdown: {
        marginTop: 6,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 10,
        overflow: "hidden",
        zIndex: 999,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    dropdownText: {
        color: Colors.onGradientTextPrimary,
        fontSize: 14,
        fontWeight: "500",
    },
    dropdownDesc: {
        color: Colors.onGradientTextMuted,
        fontSize: 12,
    },
});
