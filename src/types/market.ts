// Central market domain types to improve type safety and organization

export type AssetTab = "stocks" | "crypto";

export interface Quote {
  c: number; // current price
  o: number; // open
  h: number; // high
  l: number; // low
  pc?: number; // previous close
  dp?: number; // percent change
  d?: number; // absolute change
  t?: number; // timestamp (ms)
  [key: string]: any;
}

export interface StockProfile {
  name?: string;
  ticker?: string;
  finnhubIndustry?: string;
  country?: string;
  weburl?: string;
  [key: string]: any;
}

export interface BaseSymbolItem {
  symbol: string; // raw symbol as returned by API
  displaySymbol?: string;
  description: string;
  type?: string; // e.g. "Common Stock" or "crypto"
}

export interface CryptoSymbol extends BaseSymbolItem {
  type: "crypto" | string;
}

export interface SearchResult extends BaseSymbolItem {
  // may include additional API fields
  [key: string]: any;
}

export type StockDetail = {
  type: "stock";
  symbol: string;
  quote: Quote | null | undefined;
  profile: StockProfile;
};

export type CryptoDetail = {
  type: "crypto";
  symbol: string; // expected to be BINANCE:... when used
  quote: Quote | null | undefined;
};

export type SymbolDetail = StockDetail | CryptoDetail;
