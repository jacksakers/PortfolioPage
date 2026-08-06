// Central definitions for the site's theming/customization system.
// Shared by ThemeContext (applies CSS vars), SiteSettingsPanel (renders controls),
// and the public layout components (Navbar/PublicLayout width, Hero layout, etc).

export const FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter', google: 'Inter:wght@400;500;600;700' },
  { value: '"Roboto Condensed", sans-serif', label: 'Roboto Condensed', google: 'Roboto+Condensed:wght@400;700' },
  { value: '"Playfair Display", serif', label: 'Playfair Display', google: 'Playfair+Display:wght@400;700' },
  { value: 'Merriweather, serif', label: 'Merriweather', google: 'Merriweather:wght@400;700' },
  { value: 'Poppins, sans-serif', label: 'Poppins', google: 'Poppins:wght@400;500;600;700' },
  { value: 'Lora, serif', label: 'Lora', google: 'Lora:wght@400;600;700' },
  { value: '"Space Mono", monospace', label: 'Space Mono', google: 'Space+Mono:wght@400;700' },
  { value: 'system-ui, sans-serif', label: 'System Default', google: null },
];

export const RADIUS_OPTIONS = [
  { value: 'none', label: 'Sharp corners', card: '0px', button: '0px' },
  { value: 'small', label: 'Soft corners', card: '0.5rem', button: '0.375rem' },
  { value: 'large', label: 'Very rounded', card: '1rem', button: '0.75rem' },
  { value: 'full', label: 'Pill-shaped buttons', card: '1rem', button: '9999px' },
];

export const BUTTON_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid fill' },
  { value: 'outline', label: 'Outline' },
];

export const HERO_LAYOUT_OPTIONS = [
  { value: 'centered', label: 'Centered' },
  { value: 'split', label: 'Split (photo beside text)' },
  { value: 'banner', label: 'Bold banner' },
];

export const NAVBAR_STYLE_OPTIONS = [
  { value: 'light', label: 'Light (white bar)' },
  { value: 'bold', label: 'Bold (colored bar)' },
];

export const LAYOUT_WIDTH_OPTIONS = [
  { value: 'narrow', label: 'Narrow', className: 'max-w-3xl' },
  { value: 'normal', label: 'Normal', className: 'max-w-5xl' },
  { value: 'wide', label: 'Wide', className: 'max-w-6xl' },
];

export const CARD_STYLE_OPTIONS = [
  { value: 'shadow', label: 'Soft shadow' },
  { value: 'bordered', label: 'Bordered' },
  { value: 'flat', label: 'Flat' },
];

export const BACKGROUND_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid color' },
  { value: 'gradient', label: 'Soft gradient' },
];

export const DEFAULT_THEME = {
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  backgroundColor: '#f9fafb',
  surfaceColor: '#ffffff',
  textColor: '#111827',
  mutedTextColor: '#6b7280',
  headingFont: FONT_OPTIONS[0].value,
  bodyFont: FONT_OPTIONS[0].value,
  radius: 'small',
  buttonStyle: 'solid',
  heroLayout: 'centered',
  navbarStyle: 'light',
  layoutWidth: 'normal',
  cardStyle: 'shadow',
  backgroundStyle: 'solid',
  navbarSticky: true,
};

// Merges saved theme data with defaults, migrating the old single "fontFamily" field.
export function resolveTheme(savedTheme) {
  const merged = { ...DEFAULT_THEME, ...savedTheme };
  if (savedTheme?.fontFamily && !savedTheme?.headingFont && !savedTheme?.bodyFont) {
    merged.headingFont = savedTheme.fontFamily;
    merged.bodyFont = savedTheme.fontFamily;
  }
  return merged;
}

export function getRadiusOption(value) {
  return RADIUS_OPTIONS.find((option) => option.value === value) || RADIUS_OPTIONS[1];
}

export function getLayoutWidthClass(value) {
  return LAYOUT_WIDTH_OPTIONS.find((option) => option.value === value)?.className || 'max-w-5xl';
}

export function getCardStyleClass(value) {
  if (value === 'flat') return 'shadow-none border border-black/5';
  if (value === 'bordered') return 'shadow-none border-2 border-[var(--color-primary)]/30';
  return 'shadow-sm border border-black/5';
}

// Returns an inline style object for the page background (solid color or a soft gradient).
export function getBackgroundStyle(theme) {
  if (theme.backgroundStyle === 'gradient') {
    return {
      backgroundImage: `linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 10%, var(--color-background)) 0%, var(--color-background) 320px)`,
    };
  }
  return { backgroundColor: 'var(--color-background)' };
}

function loadGoogleFont(googleParam) {
  if (!googleParam || typeof document === 'undefined') return;
  const id = `google-font-${googleParam}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleParam}&display=swap`;
  document.head.appendChild(link);
}

export function ensureFontLoaded(fontValue) {
  const option = FONT_OPTIONS.find((font) => font.value === fontValue);
  if (option) loadGoogleFont(option.google);
}
