import { Routes, Route } from 'react-router-dom'
import HomePage from './features/portfolio/HomePage'
import LoginPage from './features/auth/LoginPage'
import AdminDashboard from './features/admin/AdminDashboard'
import ProtectedRoute from './features/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
