import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import HomePage from './features/portfolio/HomePage'
import SectionView from './features/portfolio/SectionView'
import LoginPage from './features/auth/LoginPage'
import AdminDashboard from './features/admin/AdminDashboard'
import ProtectedRoute from './features/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio/:slug" element={<SectionView />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
