// This component displays the details for one stock search result.
// `stock` is a prop: a value passed into a React component by its parent.
// Props let components receive data and use it to render dynamic content.
function StockSearchResult({ stock }) {
  // `{ stock }` destructures the stock prop so we can access its fields directly.
  return (
    <div>
      <h3>{stock.symbol}</h3>

      <p>{stock.name}</p>

      <p>
        {stock.exchange} | {stock.country} | {stock.currency}
      </p>

      <p>{stock.instrument_type}</p>
    </div>
  );
}

export default StockSearchResult;