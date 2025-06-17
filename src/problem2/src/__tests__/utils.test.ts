import { formatAmount, getTokenIcon, uniqueTokens, Price, TOKEN_ICON_BASE } from '../utils';

describe('formatAmount', () => {
  it('formats numbers with up to 8 decimals', () => {
    expect(formatAmount(1234.56789123)).toBe('1,234.56789123');
    expect(formatAmount(0.00000001)).toBe('0.00000001');
    expect(formatAmount(1000)).toBe('1,000');
  });
  it('returns empty string for empty or invalid input', () => {
    expect(formatAmount('')).toBe('');
    expect(formatAmount(NaN)).toBe('');
  });
});

describe('getTokenIcon', () => {
  it('returns the correct icon URL for a token symbol', () => {
    expect(getTokenIcon('ETH')).toBe(`${TOKEN_ICON_BASE}/ETH.svg`);
    expect(getTokenIcon('USDC')).toBe(`${TOKEN_ICON_BASE}/USDC.svg`);
  });
});

describe('uniqueTokens', () => {
  it('returns unique tokens from price data', () => {
    const prices = [
      { currency: 'ETH', price: 2000, date: new Date().toISOString() },
      { currency: 'BTC', price: 30000, date: new Date().toISOString() },
      { currency: 'ETH', price: 2100, date: new Date().toISOString() }, // Duplicate currency
      { currency: 'USDT', price: 1, date: new Date().toISOString() },
    ];

    const result = uniqueTokens(prices);
    expect(result).toHaveLength(3);
    expect(result.map(p => p.currency)).toEqual(['BTC', 'ETH', 'USDT']); // Alphabetically sorted
  });

  it('handles empty array', () => {
    const result = uniqueTokens([]);
    expect(result).toHaveLength(0);
  });

  it('preserves the first occurrence of duplicate tokens', () => {
    const now = new Date().toISOString();
    const prices = [
      { currency: 'ETH', price: 2000, date: now },
      { currency: 'ETH', price: 2100, date: now },
    ];

    const result = uniqueTokens(prices);
    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(2000);
  });

  it('handles null or undefined prices', () => {
    const now = new Date().toISOString();
    const prices = [
      { currency: 'ETH', price: null as any, date: now },
      { currency: 'BTC', price: undefined as any, date: now },
      { currency: 'USDT', price: 1, date: now },
    ];

    const result = uniqueTokens(prices);
    expect(result).toHaveLength(1); // Only USDT should be included
    expect(result[0].currency).toBe('USDT');
  });

  it('handles invalid price values', () => {
    const now = new Date().toISOString();
    const prices = [
      { currency: 'ETH', price: NaN, date: now },
      { currency: 'BTC', price: Infinity, date: now },
      { currency: 'USDT', price: 1, date: now },
    ];

    const result = uniqueTokens(prices);
    expect(result).toHaveLength(1); // Only USDT should be included
    expect(result[0].currency).toBe('USDT');
  });

  it('sorts tokens alphabetically', () => {
    const now = new Date().toISOString();
    const prices = [
      { currency: 'ZRX', price: 1, date: now },
      { currency: 'BTC', price: 30000, date: now },
      { currency: 'ETH', price: 2000, date: now },
      { currency: 'AAVE', price: 100, date: now },
    ];

    const result = uniqueTokens(prices);
    expect(result.map(p => p.currency)).toEqual(['AAVE', 'BTC', 'ETH', 'ZRX']);
  });
}); 