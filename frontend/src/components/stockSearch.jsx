import { useState } from "react";

function StockSearch() {
  // Keep track of the text entered in the stock search field.
  const [searchTerm, setSearchTerm] = useState("");

  // Handle form submission without causing the page to reload.
  function handleSubmit(event) {
    event.preventDefault();

    // Display the current search term until the API search is connected.
    console.log("Searching for:", searchTerm);
  }

  return (
    <div>
      <h2>Search Stocks</h2>

      {/* Submit the search when the user presses Enter or clicks the button. */}
      <form onSubmit={handleSubmit}>
        {/* The input value is controlled by searchTerm and updated as the user types. */}
        <input
          type="text"
          placeholder="Search by company or ticker..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {/* Submit the surrounding form. */}
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default StockSearch;