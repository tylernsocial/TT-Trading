import { useState } from "react";

function StockSearch() {
  // Store the text entered by the user in the search field.
  const [searchTerm, setSearchTerm] = useState("");
  // Store the stock results returned by the FastAPI backend.
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Submit the search request without reloading the page.
  async function handleSubmit(event) {
  event.preventDefault();
  // Ignore blank or whitespace-only searches before contacting the backend.
  if (!searchTerm.trim()) {
    setError("Please enter a stock symbol or company name.");
    return;
  }
  
  // Show the request state and clear any message from a previous search.
  setLoading(true);
  setError("");

  try {
    // Encode the user's input so symbols and company names are safe in the URL.
    const response = await fetch(
      `http://127.0.0.1:8000/api/stocks/search?query=${encodeURIComponent(
        searchTerm
      )}`
    );

    if (!response.ok) {
      throw new Error("Search request failed.");
    }

    // The backend returns matching stocks under the results property.
    const data = await response.json();

    setResults(data.results);
  } catch (error) {
    console.error(error);
    setError("Unable to search stocks right now.");
  } finally {
    // End the loading state whether the request succeeds or fails.
    setLoading(false);
  }
}

  return (
    <div>
      <h2>Search Stocks</h2>

      {/* Submit the search when the user presses Enter or clicks the button. */}
      <form onSubmit={handleSubmit}>
        {/* Keep the input synchronized with searchTerm as the user types. */}
        <input
          type="text"
          placeholder="Search by company or ticker..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {/* Trigger the form submission and backend search. */}
        <button type="submit">Search</button>
      </form>
      {loading && <p>Searching...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && results.length === 0 && searchTerm && (
      <p>No results found.</p>
    )}


      {/* Render each stock returned by the backend search. */}
      <div>
        {results.map((stock, index) => (
          <div key={index}>
            <h3>{stock.symbol}</h3>
            <p>{stock.name}</p>
            <p>
              {stock.exchange} | {stock.country} | {stock.currency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockSearch;