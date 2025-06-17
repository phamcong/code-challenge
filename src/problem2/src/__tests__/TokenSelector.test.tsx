import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TokenSelector from '../TokenSelector';
import { Price } from '../utils';

describe('TokenSelector', () => {
  const tokens: Price[] = [
    { currency: 'ETH', date: '', price: 1 },
    { currency: 'USDC', date: '', price: 1 },
    { currency: 'BTC', date: '', price: 1 },
  ];

  it('renders all options except excluded', () => {
    render(
      <TokenSelector
        value="ETH"
        onChange={() => {}}
        options={tokens}
        label="From"
        exclude="USDC"
      />
    );
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ETH' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'USDC' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'BTC' })).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const handleChange = jest.fn();
    render(
      <TokenSelector
        value="ETH"
        onChange={handleChange}
        options={tokens}
        label="From"
      />
    );
    fireEvent.change(screen.getByLabelText('From'), { target: { value: 'BTC' } });
    expect(handleChange).toHaveBeenCalledWith('BTC');
  });

  it('shows the token icon', () => {
    render(
      <TokenSelector
        value="ETH"
        onChange={() => {}}
        options={tokens}
        label="From"
      />
    );
    expect(screen.getByAltText('ETH')).toBeInTheDocument();
  });
}); 