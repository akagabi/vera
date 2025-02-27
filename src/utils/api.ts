import { openDB } from "idb";

// Define types
export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  timestamp: number;
}

// Initialize IndexedDB
const initDB = async () => {
  return openDB("currency-converter-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("rates")) {
        db.createObjectStore("rates", { keyPath: "base" });
      }
    },
  });
};

// Fetch exchange rates from API
export const fetchExchangeRates = async (
  base: string = "EUR"
): Promise<ExchangeRates> => {
  try {
    // Try to fetch from network
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${base}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const rates: ExchangeRates = {
      base: data.base,
      date: data.date,
      rates: data.rates,
      timestamp: Date.now(),
    };

    // Store in IndexedDB for offline use
    const db = await initDB();
    await db.put("rates", rates);

    return rates;
  } catch (error) {
    console.error("Error fetching rates:", error);

    // Try to get from IndexedDB if network fails
    try {
      const db = await initDB();
      const storedRates = await db.get("rates", base);

      if (storedRates) {
        return storedRates;
      }

      throw new Error("No stored rates available");
    } catch (dbError) {
      console.error("Error getting stored rates:", dbError);
      throw new Error("Failed to get exchange rates");
    }
  }
};

// Convert amount from one currency to another
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number => {
  if (fromCurrency === toCurrency) return amount;

  // If base currency is the same as fromCurrency
  if (rates[toCurrency]) {
    return amount * rates[toCurrency];
  }

  // If we need to convert from a non-base currency
  if (rates[fromCurrency]) {
    // Convert to base first, then to target
    const amountInBase = amount / rates[fromCurrency];
    return amountInBase * rates[toCurrency];
  }

  throw new Error("Currency conversion not possible with available rates");
};

// Check if rates need updating (older than 24 hours)
export const shouldUpdateRates = (timestamp: number): boolean => {
  const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  return Date.now() - timestamp > oneDayMs;
};

// Get stored rates or fetch new ones if needed
export const getExchangeRates = async (
  base: string = "EUR"
): Promise<ExchangeRates> => {
  try {
    const db = await initDB();
    const storedRates = await db.get("rates", base);

    // If no stored rates or rates are old, fetch new ones
    if (!storedRates || shouldUpdateRates(storedRates.timestamp)) {
      return fetchExchangeRates(base);
    }

    return storedRates;
  } catch (error) {
    console.error("Error getting exchange rates:", error);
    return fetchExchangeRates(base);
  }
};
