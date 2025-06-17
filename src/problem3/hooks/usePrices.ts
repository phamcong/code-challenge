import { useState, useEffect } from 'react';

export interface Price {
  [key: string]: number;
}

// Simulated API response type
interface ApiPrice {
  currency: string;
  price: string; // API might return prices as strings
}

const mockPriceData: ApiPrice[] = [
  { currency: "ETH", price: "2150.75" },
  { currency: "OSMO", price: "1.23" },
  { currency: "ARB", price: "1.45" },
  { currency: "ZIL", price: "0.02" },
  { currency: "NEO", price: "11.25" }
];

/**
 * Custom hook to fetch and manage token prices
 * @returns {Price} Object mapping currency to its current price
 */
export const usePrices = (): Price => {
  const [prices, setPrices] = useState<Price>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Simulate API call
        const response = await new Promise<ApiPrice[]>((resolve) => {
          setTimeout(() => resolve(mockPriceData), 1000);
        });

        // Transform and validate the data
        const transformedPrices = response.reduce<Price>((acc, item) => {
          const price = parseFloat(item.price);
          
          // Validate the price
          if (typeof item.currency === 'string' && !isNaN(price) && price >= 0) {
            acc[item.currency] = price;
          } else {
            console.warn(`Invalid price data: ${JSON.stringify(item)}`);
          }
          
          return acc;
        }, {});

        setPrices(transformedPrices);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setPrices({}); // Reset to empty object on error
      }
    };

    // Set up polling for price updates
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 30000); // Update every 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array as we handle updates with interval

  return prices;
}; 