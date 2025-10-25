import { BrowserRouter as Router } from 'react-router-dom'
import { useEffect } from 'react'
import { setupSocketListeners } from './sockets/socket'
import AppRoutes from './AppRoutes'

function App() {
  useEffect(() => {
    setupSocketListeners()
  }, [])

  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
