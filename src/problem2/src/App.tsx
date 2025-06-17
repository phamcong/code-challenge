import React, { useEffect, useState } from "react";
import AmountInput from "./AmountInput";
import "./App.scss";
import TokenSelector from "./TokenSelector";
import { Price, uniqueTokens } from "./utils";

const PRICE_URL = "https://interview.switcheo.com/prices.json";

const App: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [tokens, setTokens] = useState<Price[]>([]);
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<'from' | 'to'>('from');

  useEffect(() => {
    setLoading(true);
    fetch(PRICE_URL)
      .then((res) => res.json())
      .then((data: Price[]) => {
        // Filter out tokens without a valid price
        const validPrices = data.filter(p => typeof p.price === 'number' && !isNaN(p.price));
        setPrices(validPrices);
        setTokens(uniqueTokens(validPrices));
        setFromToken(validPrices[0]?.currency || "");
        setToToken(validPrices[1]?.currency || "");
      })
      .catch(() => setError("Failed to fetch token prices."))
      .finally(() => setLoading(false));
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
    if (lastChanged === 'from') {
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
    <div className="swap-container">
      <form className="swap-form" onSubmit={e => e.preventDefault()}>
        <h2>Currency Swap</h2>
        <div className="swap-row">
          <div className="swap-col">
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
              onChange={v => { setFromAmount(v); setLastChanged('from'); }}
              disabled={loading}
              placeholder="Amount"
            />
          </div>
          <button
            type="button"
            className="swap-btn"
            onClick={handleSwap}
            disabled={loading}
            aria-label="Swap tokens"
          >
            ⇅
          </button>
          <div className="swap-col">
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
              onChange={v => { setToAmount(v); setLastChanged('to'); }}
              disabled={loading}
              placeholder="Amount"
            />
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </form>
      <footer className="swap-footer">
        <small>
          Powered by Switcheo | Token icons from <a href="https://github.com/Switcheo/token-icons/tree/main/tokens" target="_blank" rel="noopener noreferrer">Switcheo Token Icons</a>
        </small>
      </footer>
    </div>
  );
};

export default App;
