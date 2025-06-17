import React from "react";
import { TextField } from "@mui/material";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "",
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // Only allow numbers and decimals
    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const hasError = value !== "" && !/^\d*\.?\d*$/.test(value);

  return (
    <TextField
      type="text"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      fullWidth
      variant="outlined"
      error={hasError}
      helperText={hasError ? "Please enter a valid number" : ""}
      inputProps={{
        inputMode: "decimal",
        pattern: "[0-9]*[.]?[0-9]*",
      }}
    />
  );
};

export default AmountInput;
