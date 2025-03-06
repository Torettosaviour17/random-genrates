
import React, { useState, useEffect } from 'react';

interface Quote {
  content: string;
  author: string;
}

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data: Quote = await response.json();
      setQuote(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch quote. Please try again.');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Random Quote Generator</h1>
        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-gray-700 text-lg">{quote?.content}</p>
            <p className="text-gray-600 mt-2">— {quote?.author}</p>
          </>
        )}
        <button
          onClick={fetchQuote}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition mt-6"
        >
          Generate Quote
        </button>
      </div>
    </div>
  );
};

export default App;