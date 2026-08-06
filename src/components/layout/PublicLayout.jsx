import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../contexts/ThemeContext';
import { getLayoutWidthClass } from '../../utils/theme';

export default function PublicLayout() {
  const { theme } = useTheme();
  const widthClass = getLayoutWidthClass(theme.layoutWidth);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 w-full mx-auto px-4 py-8 ${widthClass}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
