const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
  fromCurrency: {
    type: String,
    required: true,
    enum: ['USD', 'LKR', 'AUD', 'INR']
  },
  toCurrency: {
    type: String,
    required: true,
    enum: ['USD', 'LKR', 'AUD', 'INR']
  },
  fromCountry: {
    type: String,
    required: true,
    enum: ['USA', 'Sri Lanka', 'Australia', 'India']
  },
  toCountry: {
    type: String,
    required: true,
    enum: ['USA', 'Sri Lanka', 'Australia', 'India']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  convertedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  exchangeRate: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Transfer = mongoose.model('Transfer', TransferSchema);

module.exports = Transfer;