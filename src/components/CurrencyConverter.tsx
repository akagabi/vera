import React, { useState, useEffect } from "react";
import { getExchangeRates, convertCurrency, ExchangeRates } from "../utils/api";
import { ArrowUpDownIcon, RefreshCwIcon } from "lucide-react";

// Initial currencies
const FROM_CURRENCY = "EUR";
const TO_CURRENCY = "COP";
// Base currency for fetching all rates - using EUR as the base
const BASE_CURRENCY = "EUR";

// Common currencies to show in dropdown
const COMMON_CURRENCIES = [
  { code: "EUR", name: "Euro" },
  { code: "COP", name: "Colombian Peso" },
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "MXN", name: "Mexican Peso" },
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>(FROM_CURRENCY);
  const [toCurrency, setToCurrency] = useState<string>(TO_CURRENCY);
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Fetch exchange rates on component mount
  useEffect(() => {
    fetchRates();
  }, []);

  // Convert when amount, fromCurrency, or toCurrency changes
  useEffect(() => {
    if (rates && rates.rates) {
      try {
        const numAmount = parseFloat(amount) || 0;
        const result = convertCurrency(
          numAmount,
          fromCurrency,
          toCurrency,
          rates.rates
        );
        setConvertedAmount(result.toFixed(2));
      } catch (error) {
        setError("Error converting currency");
        console.error(error);
      }
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  // Fetch rates from API - always fetch with BASE_CURRENCY (EUR) to get all rates
  const fetchRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getExchangeRates(BASE_CURRENCY);
      setRates(data);
      setLastUpdated(new Date(data.timestamp).toLocaleString());
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch exchange rates");
      setIsLoading(false);
      console.error(error);
    }
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Format the input to handle only numbers
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Calculate the exchange rate between fromCurrency and toCurrency
  const getExchangeRate = (): number | null => {
    if (!rates || !rates.rates) return null;

    try {
      // If converting 1 unit of fromCurrency to toCurrency
      if (fromCurrency === BASE_CURRENCY) {
        // Direct conversion from base currency
        return rates.rates[toCurrency];
      } else if (toCurrency === BASE_CURRENCY) {
        // Inverse conversion to base currency
        return 1 / rates.rates[fromCurrency];
      } else {
        // Cross-currency conversion
        return rates.rates[toCurrency] / rates.rates[fromCurrency];
      }
    } catch (error) {
      console.error("Error calculating exchange rate:", error);
      return null;
    }
  };

  const exchangeRate = getExchangeRate();

  return (
    <div className="card w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-2 border-b pb-4">
        <h3 className="text-3xl font-bold">Currency Converter</h3>
        <p className="text-sm text-muted">
          Convert between currencies using the latest exchange rates
        </p>
      </div>
      <div className="p-6 space-y-4">
        {error && (
          <div className="bg-danger-light text-danger p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-bold">
            Amount
          </label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            disabled={isLoading}
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="space-y-2">
            <label htmlFor="fromCurrency" className="text-sm font-bold">
              From
            </label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              disabled={isLoading}
              className="form-select"
            >
              {COMMON_CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwapCurrencies}
            disabled={isLoading}
            className="btn mt-6"
            aria-label="Swap currencies"
          >
            <ArrowUpDownIcon className="h-4 w-4" />
          </button>

          <div className="space-y-2">
            <label htmlFor="toCurrency" className="text-sm font-bold">
              To
            </label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              disabled={isLoading}
              className="form-select"
            >
              {COMMON_CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <div className="bg-muted p-3 rounded">
            <div className="text-sm text-muted">Converted Amount</div>
            <div className="text-3xl font-bold mt-1">
              {isLoading ? (
                <span className="text-muted">Loading...</span>
              ) : (
                <>
                  {convertedAmount} {toCurrency}
                </>
              )}
            </div>
            <div className="text-xs text-muted mt-2">
              1 {fromCurrency} ={" "}
              {exchangeRate ? exchangeRate.toFixed(4) : "..."} {toCurrency}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center p-6 pt-0 border-t mt-6 justify-between">
        <div className="text-xs text-muted">
          {lastUpdated ? `Last updated: ${lastUpdated}` : "Updating..."}
        </div>
        <button
          onClick={fetchRates}
          disabled={isLoading}
          className="btn btn-outline"
        >
          <RefreshCwIcon className="h-3 w-3 mr-2" />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;
