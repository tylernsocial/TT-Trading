import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react";
import StockPriceChart from "../components/stockPriceChart";
function StockDetail() {
  // Read the stock symbol from the URL route, such as /stocks/AAPL.
  const { symbol } = useParams()
  // Stores the stock data
  const [quote, setQuote] = useState(null);
  // Tells whether the request is still happening 
  const [loading, setLoading] = useState(true);
  // Stores an error message
  const [error, setError] = useState("");
  // Will store the array returned from (ie:/api/stocks/AAPL/history)
  const [history, setHistory] = useState([]);
  // Stores the selected historical time range for the chart.
  const [selectedPeriod, setSelectedPeriod] = useState("1M");
  // Tells whether the historical price request is still happening.
  const [historyLoading, setHistoryLoading] = useState(true);
  // Stores an error message from the historical price request.
  const [historyError, setHistoryError] = useState("");

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

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHistory() {
      try {
        setHistoryLoading(true);
        setHistoryError("");

        // Request the selected daily price range for the stock in the route.
        const response = await fetch(
          `http://127.0.0.1:8000/api/stocks/${encodeURIComponent(symbol)}/history?period=${selectedPeriod}`,
          { signal: controller.signal }
        );

        // Treat non-2xx responses as failed history requests.
        if (!response.ok) {
          throw new Error("Failed to fetch stock history.");
        }

        const data = await response.json();

        // Convert closing prices to numbers and order entries chronologically for the chart.
        const formattedHistory = data.values
          .map((item) => ({
            ...item,
            close: Number(item.close),
          }))
          .sort((first, second) =>
            first.datetime.localeCompare(second.datetime)
          );

        // Replace the previous range with the normalized history.
        setHistory(formattedHistory);
      } catch (error) {
        if (error.name !== "AbortError") {
          // Keep quote data and any previous chart visible when a range request fails.
          console.error("History error:", error);
          setHistoryError("Unable to load price history.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setHistoryLoading(false);
        }
      }
    }

    fetchHistory();

    // Cancel an obsolete request when the symbol or period changes.
    return () => controller.abort();
  }, [symbol, selectedPeriod]);
  

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

  // Render the stock quote details and the history chart when historical data is available.
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
      <StockPriceChart
        data={history}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        loading={historyLoading}
        error={historyError}
      />
    </div>
  );
}

export default StockDetail
