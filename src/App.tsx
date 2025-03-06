import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

const App: React.FC = () => {
  // State management with proper initialization
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date formatting utility
  const formatDate = (dateString: string) => 
    format(new Date(dateString), 'MMM dd, yyyy');

  // API fetch function with proper cleanup
  const fetchQuote = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      
      const data = await response.json();
      setQuote(data);
      
    } catch (err) {
      if (retryCount < 3) {
        setTimeout(() => fetchQuote(retryCount + 1), 1000);
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial quote
  useEffect(() => { 
    fetchQuote();
  }, []);

  // Main render with all state variables used
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full transition-all hover:shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Inspired Quotes
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-6">
            <p className="mb-4">{error}</p>
            <button
              onClick={() => fetchQuote()}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
            >
              Retry
            </button>
          </div>
        ) : quote ? (
          <div className="space-y-6">
            <blockquote className="text-2xl text-gray-800 italic leading-relaxed">
              "{quote.content}"
            </blockquote>

            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {quote.author}
                </p>
                <div className="flex gap-2 mt-2">
                  {quote.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right text-sm text-gray-500">
                <p>Added: {formatDate(quote.dateAdded)}</p>
                <p>Modified: {formatDate(quote.dateModified)}</p>
                <p className="mt-2">{quote.length} characters</p>
              </div>
            </div>

            <button
              onClick={() => fetchQuote()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02]"
            >
              Generate New Quote
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;