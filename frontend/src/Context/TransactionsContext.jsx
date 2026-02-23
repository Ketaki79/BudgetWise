import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        'http://localhost:8080/api/transactions',
        {
          withCredentials: true, // Important for session cookie
        }
      );

      setTransactions(res.data);

    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. You are not logged in.');
      } else if (err.response) {
        setError(`Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        setTransactions,
        fetchTransactions,
        clearTransactions,
        loading,
        error,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionsProvider');
  }
  return context;
};
