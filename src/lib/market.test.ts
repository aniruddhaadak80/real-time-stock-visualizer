import { describe, it, expect } from 'vitest';
import {
  BASE_PRICES,
  basePriceFor,
  generateSeries,
  nextTickValue,
  statsForSeries,
} from './market';

describe('basePriceFor', () => {
  it('knows the base price of every listed symbol', () => {
    expect(basePriceFor('MSFT')).toBe(BASE_PRICES.MSFT);
    expect(basePriceFor('GOOGL')).toBe(BASE_PRICES.GOOGL);
  });

  it('falls back to a default for an unknown symbol', () => {
    expect(basePriceFor('NOPE')).toBe(100);
  });
});

describe('generateSeries', () => {
  it('builds a series around the base price of the symbol', () => {
    const series = generateSeries('MSFT');
    expect(series.length).toBe(31);
    for (const point of series) {
      expect(Math.abs(point.value - BASE_PRICES.MSFT)).toBeLessThanOrEqual(2.5);
    }
  });

  it('produces a series around the base price of the selected symbol', () => {
    const msft = generateSeries('MSFT');
    const googl = generateSeries('GOOGL');
    const avg = (list: typeof msft) => list.reduce((t, p) => t + p.value, 0) / list.length;
    expect(avg(msft)).toBeGreaterThan(avg(googl));
  });
});

describe('statsForSeries', () => {
  it('describes the given series only', () => {
    const series = generateSeries('GOOGL');
    const stats = statsForSeries(series);
    expect(stats.price).toBe(series[series.length - 1].value);
    expect(stats.high).toBe(Math.max(...series.map((p) => p.value)));
    expect(stats.change).toBe(0);
  });

  it('never carries the high of another symbol over', () => {
    const msft = statsForSeries(generateSeries('MSFT'));
    const googl = statsForSeries(generateSeries('GOOGL'));
    expect(msft.high).toBeGreaterThan(googl.high);
    expect(googl.high).toBeLessThan(msft.high);
  });

  it('handles an empty series', () => {
    const stats = statsForSeries([]);
    expect(stats.price).toBe(0);
    expect(stats.high).toBe(0);
  });
});

describe('nextTickValue', () => {
  it('continues from the given last value', () => {
    for (let i = 0; i < 50; i++) {
      const next = nextTickValue(180);
      expect(Math.abs(next - 180)).toBeLessThanOrEqual(1);
    }
  });

  it('continues from the previous value when it is chained', () => {
    let value = 180;
    for (let step = 0; step < 30; step++) {
      const previous = value;
      value = nextTickValue(value);
      // Each step starts from the value the previous step produced.
      expect(Math.abs(value - previous)).toBeLessThanOrEqual(1);
    }
    // After 30 chained steps the value can have drifted by at most 30, which
    // is only true when every step continued from the previous one.
    expect(Math.abs(value - 180)).toBeLessThanOrEqual(30);
  });
});
