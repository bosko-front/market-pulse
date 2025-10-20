import { useQuery } from "@tanstack/react-query";
import {fetchStockBatch, fetchCryptoBatch, fetchInitialCryptoBatch} from "./marketApi";

export function useMarketList(type: "stocks" | "crypto") {
    return useQuery({
        queryKey: ["marketList", type],
        queryFn: type === "stocks" ? fetchStockBatch : fetchInitialCryptoBatch,
        staleTime: 1000 * 60, // 1 minute cache
        refetchInterval: 60 * 1000, // auto-refresh every minute
        refetchOnWindowFocus: false
    });
}

