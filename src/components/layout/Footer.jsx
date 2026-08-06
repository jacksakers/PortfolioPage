import { useTheme } from '../../contexts/ThemeContext';

export default function Footer() {
  const { siteSettings } = useTheme();
  const ownerName = siteSettings?.ownerName || 'Portfolio';

  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} {ownerName}. All rights reserved.
      </div>
    </footer>
  );
}
