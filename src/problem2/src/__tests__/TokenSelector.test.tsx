import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import TokenSelector from "../TokenSelector";
import { Price } from "../utils";

const mockOptions: Price[] = [
  { currency: "ETH", price: 2000, date: new Date().toISOString() },
  { currency: "BTC", price: 30000, date: new Date().toISOString() },
  { currency: "USDT", price: 1, date: new Date().toISOString() },
];

describe("TokenSelector", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with label", () => {
    render(
      <TokenSelector
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
      />
    );
    expect(screen.getByLabelText("From")).toBeInTheDocument();
  });

  it("displays the selected value", () => {
    render(
      <TokenSelector
        value="ETH"
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
      />
    );
    expect(screen.getByRole("combobox")).toHaveValue("ETH");
  });

  it("opens dropdown on click", async () => {
    render(
      <TokenSelector
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
      />
    );
    
    const combobox = screen.getByRole("combobox");
    await userEvent.click(combobox);
    
    // Check if all options are displayed
    mockOptions.forEach(option => {
      expect(screen.getByText(option.currency)).toBeInTheDocument();
    });
  });

  it("filters options based on input", async () => {
    render(
      <TokenSelector
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
      />
    );
    
    const combobox = screen.getByRole("combobox");
    await userEvent.type(combobox, "ET");
    
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.queryByText("BTC")).not.toBeInTheDocument();
  });

  it("excludes specified token from options", () => {
    render(
      <TokenSelector
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
        exclude="ETH"
      />
    );
    
    const combobox = screen.getByRole("combobox");
    fireEvent.mouseDown(combobox);
    
    expect(screen.queryByText("ETH")).not.toBeInTheDocument();
    expect(screen.getByText("BTC")).toBeInTheDocument();
  });

  it("calls onChange when selecting an option", async () => {
    render(
      <TokenSelector
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
      />
    );
    
    const combobox = screen.getByRole("combobox");
    await userEvent.click(combobox);
    await userEvent.click(screen.getByText("ETH"));
    
    expect(mockOnChange).toHaveBeenCalledWith("ETH");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <TokenSelector
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
        disabled
      />
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("displays token images", async () => {
    render(
      <TokenSelector
        value="ETH"
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
      />
    );
    
    // Check if the selected token image is displayed
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("alt", "ETH");
    expect(images[0]).toHaveAttribute("src", expect.stringContaining("ETH.svg"));
  });

  it("handles image load errors gracefully", async () => {
    render(
      <TokenSelector
        value="ETH"
        onChange={mockOnChange}
        options={mockOptions}
        label="From"
      />
    );
    
    const image = screen.getAllByRole("img")[0];
    fireEvent.error(image);
    
    expect(image).toHaveStyle({ visibility: "hidden" });
  });
});
