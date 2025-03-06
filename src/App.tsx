import React, { useState, useEffect } from 'react';

interface Quote {
  content: string;
  author: string;
}

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://api.quotable.io/random');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Quote = await response.json();
      setQuote(data);
    } catch (err) {
      if (retryCount < 3) {
        // Retry up to 3 times
        setTimeout(() => fetchQuote(retryCount + 1), 1000);
        return;
      }
      setError('Failed to fetch quote. Please check your connection and try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Random Quote Generator</h1>
        
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={() => fetchQuote()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-700 text-lg italic">"{quote?.content}"</p>
            <p className="text-gray-600 mt-4 font-medium">— {quote?.author}</p>
          </>
        )}

        {!loading && !error && (
          <button
            onClick={() => fetchQuote()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition mt-6"
          >
            New Quote
          </button>
        )}
      </div>
    </div>
  );
};

export default App;