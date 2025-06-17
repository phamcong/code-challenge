import { Box, BoxProps } from "@mui/material";
import { FC, useMemo } from "react";
import { usePrices } from "./hooks/usePrices";
import { useWalletBalances } from "./hooks/useWalletBalances";

// Proper type definitions
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

// Constants for blockchain priorities
const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

// Props interface with only needed properties
interface WalletPageProps extends Pick<BoxProps, "className" | "style"> {}

// Row component props
interface WalletRowProps {
  usdValue: number;
  formattedAmount: string;
  currency: string;
}

// Separate Row component with proper memoization
const WalletRow: FC<WalletRowProps> = ({
  usdValue,
  formattedAmount,
  currency,
}) => (
  <Box className="wallet-row">
    <span>{currency}</span>
    <span>{formattedAmount}</span>
    <span>${usdValue.toFixed(2)}</span>
  </Box>
);

// Main component with proper typing and optimizations
export const WalletPage: FC<WalletPageProps> = ({ className, style }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoized priority getter
  const getPriority = (blockchain: Blockchain): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
  };

  // Memoized balance filtering and sorting
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        // Keep only positive balances with valid priority
        return balance.amount > 0 && getPriority(balance.blockchain) > -99;
      })
      .sort((a, b) => {
        const priorityA = getPriority(a.blockchain);
        const priorityB = getPriority(b.blockchain);

        if (priorityA !== priorityB) {
          return priorityB - priorityA; // Sort by priority descending
        }
        // Secondary sort by amount if priorities are equal
        return b.amount - a.amount;
      });
  }, [balances]); // Remove prices from dependency as it's not used in calculation

  // Memoized USD calculations
  const balancesWithUsd = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      usdValue: (prices[balance.currency] ?? 0) * balance.amount,
      formattedAmount: balance.amount.toFixed(2),
    }));
  }, [sortedBalances, prices]);

  return (
    <Box className={className} style={style}>
      {balancesWithUsd.map((balance) => (
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          usdValue={balance.usdValue}
          formattedAmount={balance.formattedAmount}
          currency={balance.currency}
        />
      ))}
    </Box>
  );
};

export default WalletPage;
