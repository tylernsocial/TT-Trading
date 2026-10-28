import { useState } from "react";

function StockSearch() {
  // Store the text entered by the user in the search field.
  const [searchTerm, setSearchTerm] = useState("");
  // Store the stock results returned by the FastAPI backend.
  const [results, setResults] = useState([])

  // Submit the search request without reloading the page.
  async function handleSubmit(event) {
    event.preventDefault();

    // Request stocks matching the user's search term from the backend API.
    const response = await fetch(
        `http://127.0.0.1:8000/api/stocks/search?query=${searchTerm}`
    )

    // Convert the API response from JSON into a JavaScript object.
    const data =  await response.json()

    // Save the returned stocks so React can display them below the form.
    setResults(data.results);
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