import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import StockSearch from "./components/stockSearch";
import StockDetail from './pages/stockDetail.jsx'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Failed to fetch API health:', error))
  }, [])

  return (
    <main>
      <h1>TT-Trading</h1>
      <p>Market Intelligence &amp; Paper Trading Platform</p>
      <p>{message}</p>
      <Routes>
        {/* Show the search page at the root and stock details for a selected symbol. */}
        <Route path="/" element={<StockSearch />} />
        <Route path="/stocks/:symbol" element={<StockDetail />} />
      </Routes>
    </main>
  )
}

export default App
