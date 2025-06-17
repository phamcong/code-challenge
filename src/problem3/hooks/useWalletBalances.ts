import { useState, useEffect } from 'react';

export const BLOCKCHAIN = {
  Osmosis: "Osmosis",
  Ethereum: "Ethereum",
  Arbitrum: "Arbitrum",
  Zilliqa: "Zilliqa",
  Neo: "Neo"
} as const;

export type Blockchain = typeof BLOCKCHAIN[keyof typeof BLOCKCHAIN];

export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

// Simulated API response type
interface ApiWalletBalance {
  currency: string;
  amount: string; // API might return amounts as strings
  blockchain: string;
}

const mockApiData: ApiWalletBalance[] = [
  { currency: "ETH", amount: "1.5", blockchain: "Ethereum" },
  { currency: "OSMO", amount: "100.35", blockchain: "Osmosis" },
  { currency: "ARB", amount: "50.0", blockchain: "Arbitrum" },
  { currency: "ZIL", amount: "1000.0", blockchain: "Zilliqa" },
  { currency: "NEO", amount: "30.0", blockchain: "Neo" }
];

/**
 * Custom hook to fetch and manage wallet balances
 * @returns {WalletBalance[]} Array of wallet balances
 */
export const useWalletBalances = (): WalletBalance[] => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        // Simulate API call
        const response = await new Promise<ApiWalletBalance[]>((resolve) => {
          setTimeout(() => resolve(mockApiData), 1000);
        });

        // Transform and validate the data
        const transformedBalances = response
          .map((item) => ({
            currency: item.currency,
            amount: parseFloat(item.amount),
            blockchain: item.blockchain as Blockchain
          }))
          .filter((item): item is WalletBalance => {
            // Validate the data
            const isValid = 
              typeof item.currency === 'string' &&
              !isNaN(item.amount) &&
              item.amount >= 0 &&
              Object.values(BLOCKCHAIN).includes(item.blockchain);

            if (!isValid) {
              console.warn(`Invalid balance data: ${JSON.stringify(item)}`);
            }
            return isValid;
          });

        setBalances(transformedBalances);
      } catch (error) {
        console.error('Error fetching wallet balances:', error);
        setBalances([]); // Reset to empty array on error
      }
    };

    fetchBalances();
  }, []); // Empty dependency array as we only want to fetch once on mount

  return balances;
}; 