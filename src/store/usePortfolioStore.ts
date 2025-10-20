import {create} from "zustand";
import {createJSONStorage,persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {marketApi} from "@/src/api/marketApi";

export type PortfolioItem = {
    symbol: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
};

type PortfolioState = {
    items: PortfolioItem[];
    history: { timestamp: number; totalValue: number }[];
    addItem: (item: PortfolioItem) => void;
    updateItem: (symbol: string, data: Partial<PortfolioItem>) => void;
    removeItem: (symbol: string) => void;
    clearAll: () => void;
    clearAllStorageOnly: () => Promise<void>;
    refreshPrices: () => Promise<void>;
    recordSnapshot: () => void;

    // computed helpers (functions!)
    totalValue: () => number;
    totalCost: () => number;
    totalProfitLoss: () => number;
    totalProfitLossPercent: () => number;
};

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set, get) => ({
            items: [],
            history: [],

            recordSnapshot: () => {
                const total = get().totalValue();
                const now = Date.now();

                set((state) => {
                    const last = state.history[state.history.length - 1];

                    // 🧠 only push if the value actually changed (avoid duplicates)
                    if (last && Math.abs(last.totalValue - total) < 0.01) return state;

                    const newHistory = [...state.history, { timestamp: now, totalValue: total }];

                    // keep only last 30 points
                    if (newHistory.length > 30) newHistory.shift();

                    return { history: newHistory };
                });
            },

            addItem: (item) => {
                const normalizedSymbol = item.symbol.startsWith("BINANCE:")
                    ? item.symbol
                    : item.symbol.includes(":")
                        ? item.symbol
                        : `BINANCE:${item.symbol}`;

                set((state) => {
                    const filtered = state.items.filter((i) => i.symbol !== normalizedSymbol);
                    const newItems = [
                        ...filtered,
                        {
                            ...item,
                            symbol: normalizedSymbol,
                            shares: Number(item.shares),
                            avgPrice: Number(item.avgPrice),
                            currentPrice: Number(item.currentPrice),
                        },
                    ];

                    const total = newItems.reduce(
                        (sum, i) => sum + i.shares * i.currentPrice,
                        0
                    );

                    const newHistory = [
                        ...state.history,
                        { timestamp: Date.now(), totalValue: total },
                    ].slice(-30);

                    return { items: newItems, history: newHistory };
                });
            },

            updateItem: (symbol, data) => {
                set((state) => {
                    const newItems = state.items.map((i) =>
                        i.symbol === symbol ? { ...i, ...data } : i
                    );

                    const total = newItems.reduce(
                        (sum, i) => sum + i.shares * i.currentPrice,
                        0
                    );

                    const newHistory = [
                        ...state.history,
                        { timestamp: Date.now(), totalValue: total },
                    ].slice(-30);

                    return { items: newItems, history: newHistory };
                });
            },
            removeItem: (symbol) => {
                set((state) => ({
                    items: state.items.filter((i) => i.symbol !== symbol),
                }));
                get().recordSnapshot();
            },

            clearAll: () => set({ items: [] }),

            clearAllStorageOnly: async () => {
                await AsyncStorage.removeItem("portfolio-storage");
                set({ items: [] });
            },

            refreshPrices: async () => {
                const items = get().items;
                if (!items.length) return;

                try {
                    // 🔹 Build all requests in parallel
                    const requests = items.map((i) => {
                        const normalized = i.symbol.startsWith("BINANCE:")
                            ? i.symbol
                            : `BINANCE:${i.symbol}`;
                        return marketApi
                            .get("/quote", { params: { symbol: normalized } })
                            .then((res) => ({
                                ...i,
                                currentPrice: Number(res.data?.c ?? i.currentPrice),
                            }))
                            .catch((err) => {
                                console.warn("Failed to refresh", i.symbol, err);
                                return i; // keep old data if request fails
                            });
                    });

                    // 🔹 Wait for all responses (no single point of failure)
                    const updated = await Promise.allSettled(requests);

                    // 🔹 Extract only fulfilled results
                    const results = updated.map((r) =>
                        r.status === "fulfilled" ? r.value : items[updated.indexOf(r)]
                    );

                    // 🔹 Update Zustand store once (batched)
                    set({ items: results });
                    get().recordSnapshot();
                    console.log("✅ Prices refreshed for", results.length, "assets");
                } catch (err) {
                    console.error("refreshPrices failed:", err);
                }
            },


            // Computed functions (not persisted)
            totalValue: () =>
                get().items.reduce((sum, i) => sum + Number(i.shares) * Number(i.currentPrice || 0), 0),

            totalCost: () =>
                get().items.reduce((sum, i) => sum + Number(i.shares) * Number(i.avgPrice || 0), 0),

            totalProfitLoss: () => get().totalValue() - get().totalCost(),

            totalProfitLossPercent: () => {
                const cost = get().totalCost();
                if (!cost) return 0;
                return ((get().totalValue() - cost) / cost) * 100;
            },
        }),
        {
            name: "portfolio-storage",
            version: 2, // 👈 bump this number to any higher value
            storage: createJSONStorage(() => AsyncStorage),
            migrate: (persistedState, version) => {
                // Wipe old corrupted state automatically
                if (version < 2) {
                    return { items: [] };
                }
                return persistedState;
            },
            partialize: (state) => ({ items: state.items, history: state.history }),
        }
    )
);

