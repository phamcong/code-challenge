import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AmountInput from '../AmountInput';

describe('AmountInput', () => {
  it('renders as editable input and calls onChange', () => {
    const handleChange = jest.fn();
    render(<AmountInput value="123" onChange={handleChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '456' } });
    expect(handleChange).toHaveBeenCalledWith('456');
  });

  it('renders as read-only input', () => {
    render(<AmountInput value="789" readOnly />);
    const input = screen.getByDisplayValue('789');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('readonly');
  });

  it('renders as disabled input', () => {
    render(<AmountInput value="123" disabled />);
    const input = screen.getByDisplayValue('123');
    expect(input).toBeDisabled();
  });

  it('shows the placeholder', () => {
    render(<AmountInput value="" placeholder="Enter amount" />);
    const input = screen.getByPlaceholderText('Enter amount');
    expect(input).toBeInTheDocument();
  });
}); 