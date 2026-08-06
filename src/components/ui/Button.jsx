import { useTheme } from '../../contexts/ThemeContext';

// Themed call-to-action used across the public portfolio (links and buttons alike).
export default function Button({ as: Component = 'button', variant, className = '', children, ...props }) {
  const { theme } = useTheme();
  const resolvedVariant = variant || theme.buttonStyle;

  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-[var(--radius-button)] transition-colors';
  const solid = 'bg-[var(--color-primary)] text-white hover:opacity-90';
  const outline =
    'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white';

  const variantClass = resolvedVariant === 'outline' ? outline : solid;

  return (
    <Component className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </Component>
  );
}
