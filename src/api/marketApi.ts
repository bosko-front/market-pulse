import axios from "axios";
import { normalizeSymbol } from "@/src/services/helpers";
import { INITIAL_CRYPTO } from "@/src/constants/crypto";
import { SearchResult } from "@/src/types/market";

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export const marketApi = axios.create({
    baseURL: BASE_URL,
    params: { token: API_KEY },
});

export async function searchSymbols(query: string): Promise<SearchResult[]> {
    if (!query) return [] as SearchResult[];

    const res = await marketApi.get("/search", { params: { q: query } });
    return (res.data.result as SearchResult[])
        .filter((r) => !!r.symbol && !!r.description)
        .slice(0, 10);
}

export async function fetchQuote(symbol: string) {
    const res = await marketApi.get("/quote", { params: { symbol } });
    return res.data;
}

// Example: Apple, Tesla, Microsoft...
export async function fetchStockBatch() {
    const symbols = ["AAPL", "TSLA", "MSFT", "AMZN", "GOOGL", "NVDA"];
    const results = await Promise.all(
        symbols.map(async (s) => {
            const quote = await fetchQuote(s);
            return {
                symbol: s,
                price: quote.c,
                change: quote.dp,
                isPositive: quote.dp >= 0,
            };
        })
    );
    return results;
}

// Example: Bitcoin, Ethereum, Solana...
export async function fetchCryptoBatch() {
    const symbols = ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT"];
    const results = await Promise.all(
        symbols.map(async (s) => {
            const quote = await fetchQuote(s);
            return {
                symbol: s.replace("BINANCE:", ""),
                price: quote.c,
                change: quote.dp,
                isPositive: quote.dp >= 0,
            };
        })
    );
    return results;
}


export async function fetchTopQuotesForResults(results: any[]) {
    const topSymbols = results.slice(0, 3).map((r) => r.symbol);
    const quotes = await Promise.all(
        topSymbols.map(async (s) => {
            try {
                // Try exact symbol first
                const q = await fetchQuote(s);
                return {
                    symbol: s,
                    price: q.c,
                    change: q.dp,
                    isPositive: q.dp >= 0,
                };
            } catch (e1) {
                // Retry with normalized fallback (strip suffix like .L, .NE, .V)
                try {
                    const clean = normalizeSymbol(s);
                    const q2 = await fetchQuote(clean);
                    return {
                        symbol: clean,
                        price: q2.c,
                        change: q2.dp,
                        isPositive: q2.dp >= 0,
                    };
                } catch (e2) {
                    if (__DEV__) console.warn("Quote fetch failed for", s);
                    return null;
                }
            }
        })
    );

    return quotes.filter(Boolean);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchBatchQuotes(symbols: string[]) {
    const output: any[] = [];
    for (const s of symbols) {
        try {
            const q = await fetchQuote(s);
            output.push({
                symbol: s,
                price: q.c,
                change: q.dp,
                isPositive: q.dp >= 0,
            });
            await sleep(50); // 50ms pause between each to avoid spikes
        } catch (e) {
            if (__DEV__) console.warn("Quote failed", s);
        }
    }
    return output;
}

// Use it for initial crypto list
export async function fetchInitialCryptoBatch() {
    const symbols = INITIAL_CRYPTO.map((i) => i.symbol);
    const quotes = await fetchBatchQuotes(symbols);

    return INITIAL_CRYPTO.map((meta) => {
        const q = quotes.find((x) => x.symbol === meta.symbol);
        return {
            symbol: meta.symbol.replace("BINANCE:", ""),
            name: meta.description,
            price: q?.price ?? undefined,
            change: q?.change ?? undefined,
            isPositive: q?.isPositive ?? true,
        };
    });
}
