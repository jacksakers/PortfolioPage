export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-sm border border-black/5 ${className}`}
    >
      {children}
    </div>
  );
}
