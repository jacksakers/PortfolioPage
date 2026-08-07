import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import HomePage from './features/portfolio/HomePage'
import SectionView from './features/portfolio/SectionView'
import ItemDetailPage from './features/portfolio/ItemDetailPage'
import SearchPage from './features/portfolio/SearchPage'
import TimelinePage from './features/portfolio/TimelinePage'
import LoginPage from './features/auth/LoginPage'
import AdminDashboard from './features/admin/AdminDashboard'
import ProtectedRoute from './features/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/post/:itemId" element={<ItemDetailPage />} />
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
