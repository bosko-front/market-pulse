import { QueryClient, useQuery } from "@tanstack/react-query";
import { marketApi } from "./marketApi";
import { sanitizeQuote } from "@/src/services/helpers";
import { AssetTab, CryptoDetail, StockDetail, SymbolDetail } from "@/src/types/market";


// ---------------------
// Fetchers
// ---------------------
async function fetchStockDetail(symbol: string): Promise<StockDetail> {
    const [quoteRes, profileRes] = await Promise.all([
        marketApi.get("/quote", { params: { symbol } }),
        marketApi.get("/stock/profile2", { params: { symbol } }),
    ]);

    return {
        type: "stock",
        symbol,
        quote: quoteRes.data,
        profile: profileRes.data,
    };
}

async function fetchCryptoDetail(symbol: string): Promise<CryptoDetail> {
    const normalized = symbol.startsWith("BINANCE:")
        ? symbol
        : `BINANCE:${symbol}`;

    const res = await marketApi.get("/quote", { params: { symbol: normalized } });

    return {
        type: "crypto",
        symbol: normalized,
        quote: sanitizeQuote(res.data),
    };
}

// ---------------------
// Hook
// ---------------------
export function useSymbolDetail(symbol?: string, type?: AssetTab) {
    const normalized =
        type === "crypto"
            ? symbol?.startsWith("BINANCE:") ? symbol : `BINANCE:${symbol}`
            : symbol;

    return useQuery<SymbolDetail>({
        queryKey: ["symbolDetail", normalized, type],
        queryFn: async () => {
            if (!normalized) throw new Error("Missing symbol");
            return type === "crypto"
                ? await fetchCryptoDetail(normalized)
                : await fetchStockDetail(normalized);
        },
        enabled: !!normalized,
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });
}

// ---------------------
// Prefetch
// ---------------------
export async function prefetchSymbolDetail(
    symbol: string,
    type: AssetTab,
    queryClient: QueryClient
) {
    const normalized =
        type === "crypto"
            ? symbol.startsWith("BINANCE:") ? symbol : `BINANCE:${symbol}`
            : symbol;

    await queryClient.prefetchQuery({
        queryKey: ["symbolDetail", normalized, type],
        queryFn: () =>
            type === "crypto"
                ? fetchCryptoDetail(normalized)
                : fetchStockDetail(normalized),
        staleTime: 1000 * 60 * 2,
    });
}
