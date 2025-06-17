import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Link,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AmountInput from "./AmountInput";
import TokenSelector from "./TokenSelector";
import { Price, uniqueTokens } from "./utils";

const PRICE_URL = "https://interview.switcheo.com/prices.json";

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [tokens, setTokens] = useState<Price[]>([]);
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"from" | "to">("from");

  useEffect(() => {
    setLoading(true);
    fetch(PRICE_URL)
      .then((res) => res.json())
      .then((data: Price[]) => {
        const validPrices = data.filter(
          (p) => typeof p.price === "number" && !isNaN(p.price)
        );
        setTimeout(() => {
          setPrices(validPrices);
          setTokens(uniqueTokens(validPrices));
          setFromToken(validPrices[0]?.currency || "");
          setToToken(validPrices[1]?.currency || "");
          setLoading(false);
        }, 1000);
      })
      .catch(() => {
        setError("Failed to fetch token prices.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!fromToken || !toToken) {
      setFromAmount("");
      setToAmount("");
      return;
    }
    const fromPrice = prices.find((p) => p.currency === fromToken)?.price;
    const toPrice = prices.find((p) => p.currency === toToken)?.price;
    if (!fromPrice || !toPrice) {
      setFromAmount("");
      setToAmount("");
      return;
    }
    if (lastChanged === "from") {
      if (!fromAmount || isNaN(Number(fromAmount))) {
        setToAmount("");
        return;
      }
      const result = (parseFloat(fromAmount) * fromPrice) / toPrice;
      setToAmount(result ? result.toString() : "");
    } else {
      if (!toAmount || isNaN(Number(toAmount))) {
        setFromAmount("");
        return;
      }
      const result = (parseFloat(toAmount) * toPrice) / fromPrice;
      setFromAmount(result ? result.toString() : "");
    }
  }, [fromAmount, toAmount, fromToken, toToken, prices, lastChanged]);

  function handleSwap() {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setError("");
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container 
        maxWidth="sm" 
        sx={{ 
          py: 4, 
          position: "relative", 
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        {loading && (
          <Box 
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 1000
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Paper 
          component="form" 
          elevation={3} 
          sx={{ 
            p: 3,
            width: "100%",
            maxWidth: "500px",
            mx: "auto"
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Box
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
            }}
          >
            Currency Swap
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box flex={1}>
              <TokenSelector
                value={fromToken}
                onChange={setFromToken}
                options={tokens}
                disabled={loading}
                label="From"
                exclude={toToken}
              />
              <AmountInput
                value={fromAmount}
                onChange={(v) => {
                  setFromAmount(v);
                  setLastChanged("from");
                }}
                disabled={loading}
                placeholder="Amount"
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleSwap}
              disabled={loading}
              aria-label="Swap tokens"
              sx={{ minWidth: "auto", p: 1 }}
            >
              <SwapHorizIcon />
            </Button>
            <Box flex={1}>
              <TokenSelector
                value={toToken}
                onChange={setToToken}
                options={tokens}
                disabled={loading}
                label="To"
                exclude={fromToken}
              />
              <AmountInput
                value={toAmount}
                onChange={(v) => {
                  setToAmount(v);
                  setLastChanged("to");
                }}
                disabled={loading}
                placeholder="Amount"
              />
            </Box>
          </Box>
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
        </Paper>
        <Box component="footer" sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Powered by Switcheo | Token icons from{" "}
            <Link
              href="https://github.com/Switcheo/token-icons/tree/main/tokens"
              target="_blank"
              rel="noopener noreferrer"
            >
              Switcheo Token Icons
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
