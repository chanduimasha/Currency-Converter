const express = require('express');
const axios = require('axios');
const Transfer = require('../models/Transfer');
const router = express.Router();

// Currency codes and country mappings
const COUNTRY_CURRENCY_MAP = {
  'USA': 'USD',
  'Sri Lanka': 'LKR',
  'Australia': 'AUD',
  'India': 'INR'
};

// Get latest exchange rates
router.get('/rates', async (req, res) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`);
    
    // Filter rates to only include currencies we're interested in
    const rates = response.data.conversion_rates;
    const filteredRates = {
      USD: rates.USD,
      LKR: rates.LKR,
      AUD: rates.AUD,
      INR: rates.INR
    };

    res.json({ rates: filteredRates });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ message: 'Failed to fetch exchange rates', error: error.message });
  }
});

// Get all transfers
router.get('/transfers', async (req, res) => {
  try {
    const transfers = await Transfer.find().sort({ date: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transfers', error: error.message });
  }
});

// Create a new transfer
// Create a new transfer
router.post('/transfers', async (req, res) => {
  try {
    const { fromCountry, toCountry, amount } = req.body;
    
    // Check if all required fields are present
    if (!fromCountry || !toCountry || !amount) {
      return res.status(400).json({ message: 'Please provide fromCountry, toCountry, and amount' });
    }

    // Validate amount is a number and greater than zero
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Get currency codes
    const fromCurrency = COUNTRY_CURRENCY_MAP[fromCountry];
    const toCurrency = COUNTRY_CURRENCY_MAP[toCountry];

    if (!fromCurrency || !toCurrency) {
      return res.status(400).json({ 
        message: 'Invalid country selection', 
        supportedCountries: Object.keys(COUNTRY_CURRENCY_MAP)
      });
    }

    // Fetch current exchange rate
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`
    );

    if (!response.data || !response.data.conversion_rate) {
      throw new Error('Invalid response from exchange rate API');
    }

    const exchangeRate = response.data.conversion_rate;
    const convertedAmount = amount * exchangeRate;

    // Create new transfer record
    const transfer = new Transfer({
      fromCountry,
      toCountry,
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount,
      exchangeRate
    });

    await transfer.save();
    res.status(201).json(transfer);
  } catch (error) {
    console.error('Error creating transfer:', error);
    
    // More detailed error response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({ 
        message: 'Exchange rate API error', 
        error: error.response.data 
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ 
        message: 'Exchange rate API not responding', 
        error: 'Network error' 
      });
    }
    
    res.status(500).json({ message: 'Failed to create transfer', error: error.message });
  }
});

// Delete a transfer (revoke)
router.delete('/transfers/:id', async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }
    res.json({ message: 'Transfer revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to revoke transfer', error: error.message });
  }
});

module.exports = router;