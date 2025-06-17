export const TOKEN_ICON_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export interface Price {
  currency: string;
  date: string;
  price: number;
}

export function formatAmount(amount: string | number): string {
  return amount
    ? parseFloat(String(amount)).toLocaleString(undefined, {
        maximumFractionDigits: 8,
      })
    : "";
}

export function getTokenIcon(symbol: string): string {
  return `${TOKEN_ICON_BASE}/${symbol}.svg`;
}

export function uniqueTokens(prices: Price[]): Price[] {
  // Filter out invalid prices (null, undefined, NaN, Infinity)
  const validPrices = prices.filter(
    p => typeof p.price === 'number' && !isNaN(p.price) && isFinite(p.price)
  );

  // Create a map to store unique tokens with their first occurrence
  const uniqueTokenMap = new Map<string, Price>();
  
  validPrices.forEach(price => {
    if (!uniqueTokenMap.has(price.currency)) {
      uniqueTokenMap.set(price.currency, price);
    }
  });

  // Convert map values to array and sort by currency
  return Array.from(uniqueTokenMap.values())
    .sort((a, b) => a.currency.localeCompare(b.currency));
} 