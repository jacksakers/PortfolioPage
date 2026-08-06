import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { useTheme } from '../../contexts/ThemeContext';
import { getLayoutWidthClass } from '../../utils/theme';

export default function Navbar() {
  const { data: sections } = useCollection('sections');
  const { siteSettings, theme } = useTheme();
  const [open, setOpen] = useState(false);

  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const siteTitle = siteSettings?.ownerName || siteSettings?.title || 'Portfolio';
  const widthClass = getLayoutWidthClass(theme.layoutWidth);
  const isBold = theme.navbarStyle === 'bold';

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium ${
      isBold
        ? isActive
          ? 'bg-white/20 text-white'
          : 'text-white/80 hover:text-white'
        : isActive
          ? 'text-[var(--color-primary)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 ${
        isBold
          ? 'bg-[var(--color-primary)] border-b-4 border-[var(--color-secondary)]'
          : 'bg-[var(--color-surface)] border-b border-black/5'
      }`}
    >
      <div className={`${widthClass} mx-auto px-4 flex items-center justify-between h-16`}>
        <Link to="/" className={`font-heading font-semibold ${isBold ? 'text-white' : 'text-[var(--color-text)]'}`}>
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
          className={`md:hidden p-2 ${isBold ? 'text-white' : 'text-[var(--color-text)]'}`}
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className={`md:hidden border-t px-4 py-2 space-y-1 ${isBold ? 'border-white/20' : 'border-black/5'}`}>
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
