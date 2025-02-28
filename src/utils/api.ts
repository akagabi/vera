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

// Get API key from environment variable or use fallback for development
const getApiKey = () => {
  // In production, this will be replaced with the environment variable
  // In development, we use a fallback that will be replaced during build
  return (
    import.meta.env.VITE_EXCHANGE_RATE_API_KEY || "45bee481c6995e54e23e20d8"
  );
};

// Fetch exchange rates from API
export const fetchExchangeRates = async (
  base: string = "EUR"
): Promise<ExchangeRates> => {
  try {
    // Try to fetch from network using the API key
    const apiKey = getApiKey();
    // Using the correct endpoint format for exchangerate-api.com
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();

    // Check if the API request was successful
    if (data.result !== "success") {
      throw new Error(`API Error: ${data.error || "Unknown error"}`);
    }

    const rates: ExchangeRates = {
      base: data.base_code,
      date: new Date(data.time_last_update_unix * 1000)
        .toISOString()
        .split("T")[0],
      rates: data.conversion_rates,
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
        console.log("Using cached exchange rates from IndexedDB");
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

  // If we're converting from the base currency (which is what rates are based on)
  if (fromCurrency === "EUR") {
    return amount * rates[toCurrency];
  }

  // If we're converting to the base currency
  if (toCurrency === "EUR") {
    return amount / rates[fromCurrency];
  }

  // Cross-currency conversion (neither is the base currency)
  // First convert from source currency to EUR, then from EUR to target currency
  const amountInEUR = amount / rates[fromCurrency];
  return amountInEUR * rates[toCurrency];
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
