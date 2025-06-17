import React from "react";
import { getTokenIcon, Price } from "./utils";

type TokenSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  options: Price[];
  disabled?: boolean;
  label: string;
  exclude?: string; // Optionally exclude a token (e.g., the other selected token)
};

const TokenSelector: React.FC<TokenSelectorProps> = ({
  value,
  onChange,
  options,
  disabled,
  label,
  exclude,
}) => {
  // Generate a unique id for accessibility
  const selectId = `token-select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="token-select">
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options
          .filter((t) => t.currency !== exclude)
          .map((t) => (
            <option key={t.currency} value={t.currency}>
              {t.currency}
            </option>
          ))}
      </select>
      {value && (
        <img
          src={getTokenIcon(value)}
          alt={value}
          className="token-icon"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}
    </div>
  );
};

export default TokenSelector; 