import React, { useState, useEffect } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { getRates, createTransfer } from '../lib/api';

// Currency to country mapping (this is the critical fix)
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  'USD': 'USA',
  'LKR': 'Sri Lanka',
  'AUD': 'Australia',
  'INR': 'India',
  'EUR': 'European Union'
};

// Country to currency mapping with full names
const CURRENCY_MAP: Record<string, { code: string, name: string, flag: string }> = {
  'USD': { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  'LKR': { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
  'AUD': { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  'INR': { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  'EUR': { code: 'EUR', name: 'Euro', flag: '🇪🇺' }
};

// List of supported currencies
const CURRENCIES = ['USD', 'LKR', 'AUD', 'INR'];

interface CurrencyConverterProps {
  onTransferComplete: () => void;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onTransferComplete }) => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('LKR');
  const [amount, setAmount] = useState('1.00');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Fetch exchange rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const ratesData = await getRates();
        setRates(ratesData);
        console.log('Fetched rates:', ratesData);
      } catch (err) {
        console.error('Failed to fetch rates:', err);
        setError('Failed to fetch exchange rates. Please try again later.');
      }
    };

    fetchRates();
  }, []);

  // Calculate conversion when inputs change
  useEffect(() => {
    if (fromCurrency && toCurrency && amount && rates && Object.keys(rates).length > 0) {
      // Calculate conversion using rates
      if (fromCurrency && toCurrency) {
        // Convert to USD first (if not already USD)
        let amountInUSD = parseFloat(amount);
        if (fromCurrency !== 'USD') {
          amountInUSD = parseFloat(amount) / rates[fromCurrency];
        }

        // Convert from USD to target currency
        const converted = amountInUSD * rates[toCurrency];
        setConvertedAmount(converted);
      }
    } else {
      setConvertedAmount(null);
    }
  }, [fromCurrency, toCurrency, amount, rates]);

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Handle transfer submission
  const handleTransfer = async () => {
    if (!fromCurrency || !toCurrency || !amount || parseFloat(amount) <= 0) {
      setError('Please fill all fields with valid values');
      return;
    }

    // Check if the currencies are supported by the API
    if (!CURRENCY_TO_COUNTRY[fromCurrency] || !CURRENCY_TO_COUNTRY[toCurrency]) {
      setError('One or both selected currencies are not supported for transfers');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Use the correct country names from the mapping
      const transferData = {
        fromCountry: CURRENCY_TO_COUNTRY[fromCurrency],
        toCountry: CURRENCY_TO_COUNTRY[toCurrency],
        amount: parseFloat(amount)
      };
      
      console.log('Sending transfer data:', transferData);
      
      await createTransfer(transferData);
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 3000);
      onTransferComplete();
    } catch (err) {
      console.error('Transfer failed:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to create transfer. Please try again.');
      } else {
        setError('Failed to create transfer. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Amount Field */}
        <div className="bg-white rounded-md border border-gray-200 p-4">
          <label className="block text-sm text-gray-500 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full border-0 p-0 text-2xl font-semibold focus:ring-0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* From Currency */}
        <div className="bg-white rounded-md border border-gray-200 p-4">
          <label className="block text-sm text-gray-500 mb-1">
            From
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-transparent border-0 p-0 pr-8 text-base font-semibold focus:ring-0"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {CURRENCIES.map((currency) => (
                <option key={`from-${currency}`} value={currency}>
                  {currency} - {CURRENCY_MAP[currency].name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Swap button for mobile - outside grid */}
        <div className="md:hidden flex justify-center my-2">
          <button
            onClick={handleSwapCurrencies}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Swap currencies"
          >
            <FaExchangeAlt className="text-blue-500" />
          </button>
        </div>

        {/* To Currency */}
        <div className="bg-white rounded-md border border-gray-200 p-4 relative">
          {/* Swap button for desktop - absolute positioned */}
          <div className="hidden md:block absolute -left-6 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={handleSwapCurrencies}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
              aria-label="Swap currencies"
            >
              <FaExchangeAlt className="text-blue-500" />
            </button>
          </div>
          
          <label className="block text-sm text-gray-500 mb-1">
            To
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-transparent border-0 p-0 pr-8 text-base font-semibold focus:ring-0"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {CURRENCIES.map((currency) => (
                <option key={`to-${currency}`} value={currency}>
                  {currency} - {CURRENCY_MAP[currency].name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Converted Amount Display */}
      {convertedAmount !== null && amount && (
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500 mb-1">
            {parseFloat(amount).toFixed(2)} {fromCurrency} =
          </div>
          <div className="text-2xl font-bold">
            {convertedAmount.toFixed(2)} {toCurrency}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {/* Success message */}
      {transferSuccess && (
        <div className="mt-4 text-green-500 text-sm text-center">
          Transfer created successfully!
        </div>
      )}

      {/* Convert Button */}
      <div className="mt-6">
        <button
          onClick={handleTransfer}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          disabled={loading || !amount || parseFloat(amount) <= 0}
        >
          {loading ? 'Processing...' : 'Convert'}
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;