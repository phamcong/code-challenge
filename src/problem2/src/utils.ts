export const TOKEN_ICON_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export type Price = {
  currency: string;
  date: string;
  price: number;
};

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
  const seen = new Set<string>();
  return prices.filter((p) => {
    if (seen.has(p.currency)) return false;
    seen.add(p.currency);
    return true;
  });
} 