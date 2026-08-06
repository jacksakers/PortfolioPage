import { useTheme } from '../../contexts/ThemeContext';
import { getCardStyleClass } from '../../utils/theme';

export default function Card({ children, className = '' }) {
  const { theme } = useTheme();
  return (
    <div className={`bg-[var(--color-surface)] rounded-[var(--radius-card)] ${getCardStyleClass(theme.cardStyle)} ${className}`}>
      {children}
    </div>
  );
}
