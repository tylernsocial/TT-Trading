import { useParams } from 'react-router-dom'

function StockDetail() {
  // Read the stock symbol from the URL route, such as /stocks/AAPL.
  const { symbol } = useParams()

  // Display the symbol for the selected stock.
  return <h2>Stock Detail: {symbol}</h2>
}

export default StockDetail
