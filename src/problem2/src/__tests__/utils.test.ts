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
  const prices: Price[] = [
    { currency: 'ETH', date: '', price: 1 },
    { currency: 'ETH', date: '', price: 2 },
    { currency: 'USDC', date: '', price: 1 },
    { currency: 'BTC', date: '', price: 1 },
    { currency: 'USDC', date: '', price: 2 },
  ];
  it('returns only unique tokens by currency', () => {
    const unique = uniqueTokens(prices);
    expect(unique.map(t => t.currency)).toEqual(['ETH', 'USDC', 'BTC']);
  });
}); 