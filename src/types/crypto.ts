export interface ICryptoList {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: Roi | null;
  last_updated: string;
}

interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

export interface ICryptoChart {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

export interface IResponseRealtimeOHLCV {
  period_id: string;
  time_period_start: string;
  time_period_end: string;
  time_open: string;
  time_close: string;
  price_open: number;
  price_high: number;
  price_low: number;
  price_close: number;
  volume_traded: number;
  trades_count: number;
  symbol_id: string;
  sequence: number;
  type: string;
}

export interface IIDRCurrency {
  meta: {
    last_updated_at: string;
  };
  data: {
    IDR: {
      code: string;
      value: number;
    };
  };
}
