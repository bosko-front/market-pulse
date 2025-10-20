import { AssetTab, Quote, SearchResult } from "@/src/types/market";

export function groupSearchResults(results: SearchResult[]) {
    const map = new Map<string, SearchResult>();

    for (const item of results) {
        if (!item?.description || !item?.symbol) continue;

        // Use description + base symbol as unique key
        const baseSymbol = (item.displaySymbol ?? item.symbol)
            .split(".")[0]
            .toUpperCase();

        const cleanName = item.description.trim().toUpperCase();
        const key = `${cleanName}-${baseSymbol}`;

        if (!map.has(key)) {
            map.set(key, item);
        } else {
            const existing = map.get(key)!;

            // Prefer .US or shorter symbol variants
            const itemDisplay = item.displaySymbol ?? item.symbol;
            const existingDisplay = existing.displaySymbol ?? existing.symbol;
            if (
                itemDisplay.endsWith(".US") ||
                (!existingDisplay.endsWith(".US") &&
                    itemDisplay.length < existingDisplay.length)
            ) {
                map.set(key, item);
            }
        }
    }

    return Array.from(map.values());
}

export function normalizeSymbol(symbol: string) {
    return symbol.replace(/\..*$/, "").toUpperCase();
}

export function filterResultsByTab(results: SearchResult[] = [], tab: AssetTab) {
    if (!results?.length) return [];

    if (tab === "stocks") {
        return results.filter((r) => r.type === "Common Stock");
    }

    if (tab === "crypto") {
        return results.filter(
            (r) =>
                r.type?.toLowerCase().includes("crypto") ||
                r.symbol.includes("BINANCE:") ||
                r.symbol.endsWith("USDT")
        );
    }

    return results;
}

export function sanitizeQuote<T extends Quote | null | undefined>(data: T): T {
    if (!data) return data;
    const { c, o, h, l } = data as Quote;
    const hasData = (c ?? 0) > 0 || (o ?? 0) > 0 || (h ?? 0) > 0 || (l ?? 0) > 0;
    return (hasData ? data : null) as T;
}