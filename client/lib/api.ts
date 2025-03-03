import axios, { AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Types for the API
export interface Transfer {
  _id: string;
  fromCountry: string;
  toCountry: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  exchangeRate: number;
  date: string;
}

export interface Rates {
  [currency: string]: number;
}

export interface ApiError {
  message: string;
  error?: string;
  supportedCountries?: string[];
}

// API functions with improved error handling
export const getRates = async (): Promise<Rates> => {
  try {
    const response = await api.get('/api/rates');
    return response.data.rates;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    const errorMessage = err.response?.data?.message || 'Failed to fetch exchange rates';
    console.error('Error fetching rates:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getTransfers = async (): Promise<Transfer[]> => {
  try {
    const response = await api.get('/api/transfers');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    const errorMessage = err.response?.data?.message || 'Failed to fetch transfers';
    console.error('Error fetching transfers:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const createTransfer = async (transferData: {
  fromCountry: string;
  toCountry: string;
  amount: number;
}): Promise<Transfer> => {
  // Validate data before sending
  if (!transferData.fromCountry || !transferData.toCountry) {
    throw new Error('Please select both countries');
  }
  
  if (!transferData.amount || isNaN(transferData.amount) || transferData.amount <= 0) {
    throw new Error('Please enter a valid positive amount');
  }
  
  try {
    // Ensure amount is a number (not a string)
    const data = {
      ...transferData,
      amount: Number(transferData.amount)
    };
    
    const response = await api.post('/api/transfers', data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    console.error('API Error Details:', err.response?.data);
    
    // Detailed error handling
    if (err.response?.status === 400) {
      // Handle validation errors
      const errorMessage = err.response.data.message || 'Invalid input data';
      
      // If the API returns supported countries, include them in the error
      if (err.response.data.supportedCountries) {
        throw new Error(`${errorMessage}. Supported countries: ${err.response.data.supportedCountries.join(', ')}`);
      }
      
      throw new Error(errorMessage);
    }
    
    throw new Error(err.response?.data?.message || 'Failed to create transfer');
  }
};

export const deleteTransfer = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/transfers/${id}`);
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    const errorMessage = err.response?.data?.message || 'Failed to delete transfer';
    console.error('Error deleting transfer:', errorMessage);
    throw new Error(errorMessage);
  }
};

export default api;