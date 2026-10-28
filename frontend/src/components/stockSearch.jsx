import { useState } from "react";

function StockSearch() {
  // Store the text entered by the user in the search field.
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <h2>Search Stocks</h2>

      {/* A controlled input keeps the displayed value in sync with searchTerm. */}
      {/* Update the search term whenever the user changes the input. */}
      <input
        type="text"
        placeholder="Search by company or ticker..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {/* The search action can be connected here when search behavior is added. */}
      <button>Search</button>
    </div>
  );
}

export default StockSearch;