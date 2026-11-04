import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react";

function StockDetail() {
  // Read the stock symbol from the URL route, such as /stocks/AAPL.
  const { symbol } = useParams()
  // Stores the stock data
  const [quote, setQuote] = useState(null);
  // Tells whether the request is still happening 
  const [loading, setLoading] = useState(true);
  // Stores an error message
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      try {
        // Reset request state whenever the selected symbol changes.
        setLoading(true);
        setError("");

        // Request the latest quote from the backend API.
        const response = await fetch(
          `http://127.0.0.1:8000/api/stocks/${symbol}/quote`
        );

        // Treat non-2xx responses as failed quote requests.
        if (!response.ok) {
          throw new Error("Failed to fetch stock quote.");
        }

        // Parse the successful response and store it for the page.
        const data = await response.json();

        setQuote(data);
      } catch (error) {
        // Log the technical error while showing a user-friendly message.
        console.error(error);
        setError("Unable to load stock information.");
      } finally {
        // Stop showing the loading state after success or failure.
        setLoading(false);
      }
    }

    // Load a new quote whenever the route's stock symbol changes. (dependency array)
    fetchQuote();
  }, [symbol]);

  // Show a loading message until the quote request completes.
  if (loading) {
    return <p>Loading stock information...</p>;
  }

  // Show the user-friendly error message when the request fails.
  if (error) {
    return <p>{error}</p>;
  }

  // Handle a successful request that did not return quote data.
  if (!quote) {
    return <p>No stock information available.</p>;
  }

  // Render the loaded quote's identity, pricing, trading range, and market status.
  return (
    <div>
      <h2>
        {quote.symbol} — {quote.name}
      </h2>

      <h3>
        {quote.price} {quote.currency}
      </h3>

      <p>
        Change: {quote.change} ({quote.percent_change}%)
      </p>

      <p>Exchange: {quote.exchange}</p>

      <p>Open: {quote.open}</p>
      <p>High: {quote.high}</p>
      <p>Low: {quote.low}</p>
      <p>Previous Close: {quote.previous_close}</p>
      <p>Volume: {quote.volume}</p>

      <p>
        Market: {quote.is_market_open ? "Open" : "Closed"}
      </p>
    </div>
  );
}

export default StockDetail
