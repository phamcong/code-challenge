import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import AmountInput from "../AmountInput";

describe("AmountInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with placeholder", () => {
    render(<AmountInput value="" onChange={mockOnChange} placeholder="Enter amount" />);
    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
  });

  it("displays the provided value", () => {
    render(<AmountInput value="123.45" onChange={mockOnChange} />);
    expect(screen.getByRole("textbox")).toHaveValue("123.45");
  });

  it("calls onChange with valid number input", () => {
    render(<AmountInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "123.45" } });
    expect(mockOnChange).toHaveBeenCalledWith("123.45");
  });

  it("prevents invalid number input", () => {
    render(<AmountInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "abc" } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("allows decimal numbers", () => {
    render(<AmountInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "12.34" } });
    expect(mockOnChange).toHaveBeenCalledWith("12.34");
  });

  it("prevents multiple decimal points", () => {
    render(<AmountInput value="12.34" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "12.34." } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<AmountInput value="" onChange={mockOnChange} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("handles backspace correctly", () => {
    render(<AmountInput value="123" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "12" } });
    expect(mockOnChange).toHaveBeenCalledWith("12");
  });

  it("handles paste events with valid numbers", () => {
    render(<AmountInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "123.45" } });
    expect(mockOnChange).toHaveBeenCalledWith("123.45");
  });

  it("handles paste events with invalid input", () => {
    render(<AmountInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "abc123" } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
