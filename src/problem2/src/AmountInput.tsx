import React from "react";

type AmountInputProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  readOnly = false,
  disabled = false,
  placeholder = "Amount",
}) => {
  return (
    <input
      type={readOnly ? "text" : "number"}
      min="0"
      step="any"
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      readOnly={readOnly}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};

export default AmountInput; 