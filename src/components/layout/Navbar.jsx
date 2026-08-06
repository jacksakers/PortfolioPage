import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const { data: sections } = useCollection('sections');
  const { siteSettings } = useTheme();
  const [open, setOpen] = useState(false);

  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const siteTitle = siteSettings?.ownerName || siteSettings?.title || 'Portfolio';

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'text-[var(--color-primary)]' : 'text-gray-700 hover:text-[var(--color-primary)]'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-semibold text-gray-900">
          {siteTitle}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          {sorted.map((section) => (
            <NavLink key={section.id} to={`/portfolio/${section.slug}`} className={linkClass}>
              {section.title}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden p-2 text-gray-700"
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gray-200 px-4 py-2 space-y-1">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          {sorted.map((section) => (
            <NavLink
              key={section.id}
              to={`/portfolio/${section.slug}`}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {section.title}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
