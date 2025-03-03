import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { getTransfers, deleteTransfer, Transfer } from '../lib/api';

// Currency symbol mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  LKR: 'Rs.',
  AUD: 'A$',
  INR: '₹',
  EUR: '€'
};

interface TransferHistoryProps {
  refreshTrigger: boolean;
}

const TransferHistory: React.FC<TransferHistoryProps> = ({ refreshTrigger }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch transfer history
  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true);
      try {
        const data = await getTransfers();
        setTransfers(data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch transfers:', err);
        setError('Failed to load transfer history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [refreshTrigger]);

  // Handle revoke transfer
  const handleRevoke = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTransfer(id);
      setTransfers(transfers.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to revoke transfer:', err);
      setError('Failed to revoke transfer');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Transfer History</h2>
      
      {loading && <p className="text-gray-500 text-center py-4">Loading transfer history...</p>}
      
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      
      {!loading && transfers.length === 0 && (
        <p className="text-gray-500 text-center py-8">No transfers found. Make a transfer to see it here.</p>
      )}
      
      {transfers.length > 0 && (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From → To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transfers.map((transfer) => (
                <tr key={transfer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transfer.fromCountry} → {transfer.toCountry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {CURRENCY_SYMBOLS[transfer.fromCurrency]}{transfer.amount.toFixed(2)} →{' '}
                      <span className="font-medium">{CURRENCY_SYMBOLS[transfer.toCurrency]}{transfer.convertedAmount.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(transfer.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRevoke(transfer._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={deletingId === transfer._id}
                    >
                      {deletingId === transfer._id ? 'Revoking...' : <FaTrash />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransferHistory;