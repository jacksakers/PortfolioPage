import { getRadiusOption } from '../../../utils/theme';

// Renders a live, scoped mockup of the public site so admins can see the effect
// of each setting before saving. CSS vars are set on this wrapper only (not the
// document), so it never affects the rest of the admin UI.
export default function ThemePreview({ form }) {
  const { theme } = form;
  const radius = getRadiusOption(theme.radius);
  const isBold = theme.navbarStyle === 'bold';
  const buttonClass =
    theme.buttonStyle === 'outline'
      ? 'border-2 bg-transparent'
      : 'text-white';

  return (
    <div
      className="rounded-lg border border-gray-200 overflow-hidden shadow-sm sticky top-4"
      style={{
        '--color-primary': theme.primaryColor,
        '--color-secondary': theme.secondaryColor,
        '--color-background': theme.backgroundColor,
        '--color-surface': theme.surfaceColor,
        '--color-text': theme.textColor,
        '--color-text-muted': theme.mutedTextColor,
        '--font-heading': theme.headingFont,
        '--font-body': theme.bodyFont,
        '--radius-card': radius.card,
        '--radius-button': radius.button,
        fontFamily: 'var(--font-body)',
        backgroundColor: 'var(--color-background)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 text-sm font-semibold"
        style={{
          backgroundColor: isBold ? 'var(--color-primary)' : 'var(--color-surface)',
          color: isBold ? '#fff' : 'var(--color-text)',
          borderBottom: isBold ? '4px solid var(--color-secondary)' : '1px solid rgba(0,0,0,0.08)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        <span>{form.ownerName || 'Your Name'}</span>
        <span className="flex gap-3 text-xs font-medium opacity-80">
          <span>Home</span>
          <span>Research</span>
        </span>
      </div>

      <div className="p-6 flex flex-col items-center text-center gap-2">
        {form.profileImageUrl ? (
          <img
            src={form.profileImageUrl}
            alt=""
            className="h-16 w-16 rounded-full object-cover shadow"
            style={{ border: '3px solid var(--color-surface)' }}
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-black/10" />
        )}
        <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {form.ownerName || 'Your Name'}
        </h1>
        <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
          {form.tagline || 'Your tagline goes here'}
        </p>
        <p className="text-xs max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          {form.bio || 'A short bio describing you will show up here.'}
        </p>

        <button
          className={`mt-2 px-4 py-1.5 text-xs font-medium rounded-[var(--radius-button)] ${buttonClass}`}
          style={{
            backgroundColor: theme.buttonStyle === 'outline' ? 'transparent' : 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
            color: theme.buttonStyle === 'outline' ? 'var(--color-primary)' : '#fff',
          }}
        >
          Sample Button
        </button>

        <div
          className="mt-4 w-full text-left p-3 rounded-[var(--radius-card)] shadow-sm"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            Sample Post Title
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            This is how a card in your Research or Volunteer section will look.
          </p>
          <span
            className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 15%, transparent)', color: 'var(--color-secondary)' }}
          >
            Sample Tag
          </span>
        </div>
      </div>
    </div>
  );
}
