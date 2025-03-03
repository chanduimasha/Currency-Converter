"use client";
import { useState } from 'react'
import CurrencyConverter from '../components/CurrencyConverter'
import TransferHistory from '../components/TransferHistory'

const Page = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  
  const handleTransferComplete = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Currency Converter</h1>
        <p className="text-gray-600">Transfer money between currencies with real-time rates</p>
      </header>
      
      <div className="mb-8">
        <CurrencyConverter onTransferComplete={handleTransferComplete} />
      </div>
      
      <div className="mb-8">
        <TransferHistory refreshTrigger={refreshTrigger} />
      </div>
    </div>
  </div>
  )
};

export default Page;