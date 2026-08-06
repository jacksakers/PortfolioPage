import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import SiteSettingsPanel from './components/SiteSettingsPanel';
import SectionsPanel from './components/SectionsPanel';
import ItemsPanel from './components/ItemsPanel';
import DataHubPanel from './components/DataHubPanel';

const PANELS = {
  settings: SiteSettingsPanel,
  sections: SectionsPanel,
  items: ItemsPanel,
  data: DataHubPanel,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('settings');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const ActivePanel = PANELS[activeTab];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 p-6 md:p-8">
        <ActivePanel />
      </main>
    </div>
  );
}
