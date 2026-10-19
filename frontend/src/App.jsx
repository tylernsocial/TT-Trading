import { useEffect, useState } from 'react'

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
    </main>
  )
}

export default App

