import { FC, useMemo } from "react";
import {
  Box,
  BoxProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useWalletBalances } from "./hooks/useWalletBalances";
import { usePrices } from "./hooks/usePrices";

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
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
}

// Separate Row component with proper memoization
const WalletRow: FC<WalletRowProps> = ({
  amount,
  usdValue,
  formattedAmount,
  currency,
}) => (
  <TableRow>
    <TableCell>
      <Typography variant="body1" fontWeight="medium">
        {currency}
      </Typography>
    </TableCell>
    <TableCell align="right">
      <Typography variant="body1" fontFamily="monospace">
        {formattedAmount}
      </Typography>
    </TableCell>
    <TableCell align="right">
      <Typography variant="body1" fontFamily="monospace" color="primary">
        ${usdValue.toFixed(2)}
      </Typography>
    </TableCell>
  </TableRow>
);

// Main component with proper typing and optimizations
export const WalletPage: FC<WalletPageProps> = ({ className, style }) => {
  const theme = useTheme();
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
    <Box
      className={className}
      style={style}
      sx={{
        p: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: "auto",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" component="h1">
            Wallet Balances
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Currency</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">Amount</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">Value (USD)</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balancesWithUsd.map((balance) => (
                <WalletRow
                  key={`${balance.blockchain}-${balance.currency}`}
                  amount={balance.amount}
                  usdValue={balance.usdValue}
                  formattedAmount={balance.formattedAmount}
                  currency={balance.currency}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default WalletPage;
