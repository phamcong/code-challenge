import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';

// Mock the fetch function
const mockPrices = [
  { currency: 'ETH', price: 2000, date: new Date().toISOString() },
  { currency: 'BTC', price: 30000, date: new Date().toISOString() },
  { currency: 'USDT', price: 1, date: new Date().toISOString() }
];

declare const global: {
  fetch: jest.Mock;
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockPrices)
  })
) as jest.Mock;

describe('App', () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  it('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('fetches and displays token prices', async () => {
    render(<App />);
    
    // Wait for loading to finish and tokens to be displayed
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    const toInput = screen.getByLabelText('To');
    expect(toInput).toHaveValue('BTC');
  });

  it('handles API error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch token prices.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles malformed API response gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(null)
    });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch token prices.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('performs token swap correctly', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Get initial token values
    const fromToken = screen.getByLabelText('From').getAttribute('value');
    const toToken = screen.getByLabelText('To').getAttribute('value');

    // Click swap button
    fireEvent.click(screen.getByLabelText('Swap tokens'));

    // Check if tokens are swapped
    expect(screen.getByLabelText('From')).toHaveValue(toToken);
    expect(screen.getByLabelText('To')).toHaveValue(fromToken);
  });

  it('handles swap error gracefully', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Simulate an error by setting invalid state
    const amountInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(amountInput, { target: { value: 'invalid' } });

    // Click swap button
    fireEvent.click(screen.getByLabelText('Swap tokens'));

    // Check if amount is cleared
    expect(amountInput).toHaveValue('');
  });

  it('calculates conversion correctly when entering amount', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Enter amount in the "From" input
    const fromInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(fromInput, { target: { value: '1' } });

    // Check if conversion is calculated correctly
    // For example, if from ETH (2000) to BTC (30000), 1 ETH = 0.0667 BTC
    const toInput = screen.getAllByRole('textbox')[1];
    await waitFor(() => {
      const value = parseFloat(toInput.getAttribute('value') || '0');
      expect(value).toBeCloseTo(0.0667, 3);
    });
  });

  it('handles invalid amount input gracefully', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Enter invalid amount
    const amountInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(amountInput, { target: { value: 'invalid' } });

    // Check if amount is cleared
    expect(amountInput).toHaveValue('');
  });

  it('handles invalid price data', async () => {
    const invalidPrices = [
      { currency: 'ETH', price: NaN, date: new Date().toISOString() },
      { currency: 'BTC', price: 30000, date: new Date().toISOString() }
    ];

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(invalidPrices)
    });

    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('BTC');
    }, { timeout: 3000 });

    // Should only show valid tokens
    const fromInput = screen.getByLabelText('From');
    expect(fromInput).not.toHaveValue('ETH');
  });

  it('maintains amount values during swap', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Enter amounts
    const fromInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(fromInput, { target: { value: '1' } });

    // Get the calculated "To" amount
    const toInput = screen.getAllByRole('textbox')[1];
    const toAmount = toInput.getAttribute('value');

    // Perform swap
    fireEvent.click(screen.getByLabelText('Swap tokens'));

    // Check if amounts are maintained but swapped
    expect(fromInput).toHaveValue(toAmount);
    expect(toInput).toHaveValue('1');
  });

  it('updates conversion when changing tokens', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Enter initial amount
    const fromInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(fromInput, { target: { value: '1' } });

    // Get initial conversion
    const toInput = screen.getAllByRole('textbox')[1];
    const initialAmount = toInput.getAttribute('value');

    // Change token selection
    const toSelect = screen.getByLabelText('To');
    fireEvent.mouseDown(toSelect);
    fireEvent.click(screen.getByText('USDT'));

    // Check if conversion is updated
    expect(toInput.getAttribute('value')).not.toBe(initialAmount);
  });

  it('handles token change error gracefully', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Enter invalid amount
    const amountInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(amountInput, { target: { value: 'invalid' } });

    // Change token selection
    const toSelect = screen.getByLabelText('To');
    fireEvent.mouseDown(toSelect);
    fireEvent.click(screen.getByText('USDT'));

    // Check if amount is cleared
    expect(amountInput).toHaveValue('');
  });

  it('excludes selected tokens from other dropdown', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Open "From" token selection
    const fromSelect = screen.getByLabelText('From');
    fireEvent.mouseDown(fromSelect);

    // Get selected "To" token
    const toToken = screen.getByLabelText('To').getAttribute('value');

    // Check if "To" token is not in "From" options
    expect(screen.queryByText(toToken || '')).not.toBeInTheDocument();
  });

  it('handles missing token prices gracefully', async () => {
    render(<App />);
    
    // Wait for tokens to be loaded
    await waitFor(() => {
      const fromInput = screen.getByLabelText('From');
      expect(fromInput).toHaveValue('ETH');
    }, { timeout: 3000 });

    // Set tokens to empty array
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([])
    });

    // Trigger a re-fetch by changing tokens
    const toSelect = screen.getByLabelText('To');
    fireEvent.mouseDown(toSelect);
    fireEvent.click(screen.getByText('USDT'));

    // Check if amounts are cleared
    const fromInput = screen.getAllByRole('textbox')[0];
    const toInput = screen.getAllByRole('textbox')[1];
    expect(fromInput).toHaveValue('');
    expect(toInput).toHaveValue('');
  });
}); 