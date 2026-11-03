import { useParams } from 'react-router-dom'

function StockDetail() {
  const { symbol } = useParams()

  return <h2>Stock Detail: {symbol}</h2>
}

export default StockDetail
