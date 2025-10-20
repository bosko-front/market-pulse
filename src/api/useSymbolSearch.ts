import { useQuery } from "@tanstack/react-query";
import { fetchTopQuotesForResults, marketApi, searchSymbols } from "./marketApi";
import { filterResultsByTab, groupSearchResults, normalizeSymbol } from "@/src/services/helpers";
import { useDebounce } from "@/src/hooks/useDebounce";
import { AssetTab, CryptoSymbol, SearchResult } from "@/src/types/market";

async function getCryptoUniverse(): Promise<CryptoSymbol[]> {
    const res = await marketApi.get("/crypto/symbol", {
        params: { exchange: "BINANCE" },
    });

    return res.data.map((r: any) => ({
        ...r,
        type: "crypto",
        displaySymbol: r.displaySymbol,
        description: r.description || r.displaySymbol || r.symbol,
    }));
}

// 🔹 Main hook
export function useSymbolSearchWithQuotes(
    query: string,
    activeTab: AssetTab
) {
    const debounced = useDebounce(query.trim(), 600);

    // Cache crypto universe forever
    const { data: cryptoUniverse = [] } = useQuery({
        queryKey: ["cryptoUniverse"],
        queryFn: getCryptoUniverse,
        staleTime: Infinity,
        gcTime: Infinity,
    });


    return useQuery({
        queryKey: ["symbolSearchQuotes", debounced, activeTab],
        queryFn: async () => {
            if (!debounced) return [];

            let results: SearchResult[] = [];

            if (activeTab === "crypto") {
                if (!cryptoUniverse.length) return []
                const q = debounced.toLowerCase();
                results = cryptoUniverse.filter(
                    (r) =>
                        r.symbol.toLowerCase().includes(q) ||
                        r.displaySymbol?.toLowerCase().includes(q) ||
                        r.description?.toLowerCase().includes(q)
                );
            } else {
                const stockRes = await searchSymbols(debounced);
                results = filterResultsByTab(stockRes, activeTab);
            }

            const grouped = groupSearchResults(results);
            const quotes = await fetchTopQuotesForResults(grouped);

            return grouped.map((r) => {
                const match = quotes.find(
                    (q) =>
                        q &&
                        q.symbol &&
                        r.symbol &&
                        normalizeSymbol(q.symbol) === normalizeSymbol(r.symbol)
                );
                return {
                    ...r,
                    ...match,
                };
            });
        },
        enabled: debounced.length > 1,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });
}
