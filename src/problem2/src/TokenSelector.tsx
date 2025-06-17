import React from "react";
import { Autocomplete, TextField, Box, InputAdornment } from "@mui/material";
import { Price } from "./utils";

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: Price[];
  disabled?: boolean;
  label?: string;
  exclude?: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  label = "",
  exclude = "",
}) => {
  const filteredOptions = options.filter(
    (option) => option.currency !== exclude
  );

  const renderTokenImage = (currency: string) => (
    <img
      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`}
      alt={currency}
      style={{ width: 24, height: 24 }}
      onError={(e) =>
        ((e.target as HTMLImageElement).style.visibility = "hidden")
      }
    />
  );

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue || "")}
      options={filteredOptions.map((option) => option.currency)}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: value ? (
              <InputAdornment position="start">
                {renderTokenImage(value)}
              </InputAdornment>
            ) : null,
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {renderTokenImage(option)}
            {option}
          </Box>
        </Box>
      )}
      sx={{ mb: 2 }}
      disableClearable
      fullWidth
    />
  );
};

export default TokenSelector;
