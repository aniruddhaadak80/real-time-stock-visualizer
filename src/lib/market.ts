export type PricePoint = {
  time: string;
  value: number;
};

export type StockStats = {
  price: number;
  change: number;
  volume: number;
  high: number;
};

export const BASE_PRICES: Record<string, number> = {
  AAPL: 180,
  GOOGL: 140,
  MSFT: 370,
  AMZN: 175,
  TSLA: 180,
};

export const DEFAULT_PRICE = 100;
export const BASE_VOLUME = 5_000_000;
export const SERIES_DAYS = 30;

export const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const basePriceFor = (symbol: string): number => BASE_PRICES[symbol] ?? DEFAULT_PRICE;

/** Build the mock price series for a symbol. */
export function generateSeries(symbol: string, days: number = SERIES_DAYS): PricePoint[] {
  const basePrice = basePriceFor(symbol);
  const now = new Date();
  const data: PricePoint[] = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const randomChange = (Math.random() - 0.5) * 5;
    const value = basePrice + randomChange;

    data.push({
      time: formatDate(date),
      value: Number(value.toFixed(2)),
    });
  }

  return data;
}

/**
 * The stats for a series. The high belongs to the given series only, so
 * switching symbol never carries the maximum of the previous one over.
 */
export function statsForSeries(series: PricePoint[]): StockStats {
  if (series.length === 0) {
    return { price: 0, change: 0, volume: BASE_VOLUME, high: 0 };
  }
  const values = series.map((point) => point.value);
  return {
    price: values[values.length - 1],
    change: 0,
    volume: BASE_VOLUME,
    high: Math.max(...values),
  };
}

/** The next live value, continuing from the current last value. */
export function nextTickValue(lastValue: number): number {
  return Number((lastValue + (Math.random() - 0.5) * 2).toFixed(2));
}
