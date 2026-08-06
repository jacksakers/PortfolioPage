import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { resolveTheme, getRadiusOption, ensureFontLoaded } from '../utils/theme';

const ThemeContext = createContext(undefined);
// Lets admin screens preview unsaved edits: components deep in the tree that call
// useTheme() will transparently see the override's theme/siteSettings instead.
const ThemeOverrideContext = createContext(null);

export function ThemeProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = resolveTheme(siteSettings?.theme);

  useEffect(() => {
    const ref = doc(db, 'siteSettings', 'main');
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        setSiteSettings(snapshot.exists() ? snapshot.data() : null);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const radius = getRadiusOption(theme.radius);
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-surface', theme.surfaceColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--color-text-muted', theme.mutedTextColor);
    root.style.setProperty('--font-heading', theme.headingFont);
    root.style.setProperty('--font-body', theme.bodyFont);
    root.style.setProperty('--radius-card', radius.card);
    root.style.setProperty('--radius-button', radius.button);
    ensureFontLoaded(theme.headingFont);
    ensureFontLoaded(theme.bodyFont);
  }, [theme]);

  const value = { siteSettings, theme, loading };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  const override = useContext(ThemeOverrideContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  if (override) {
    return {
      ...context,
      theme: override.theme ?? context.theme,
      siteSettings: override.siteSettings ?? context.siteSettings,
      loading: false,
    };
  }
  return context;
}

// Wrap a subtree with this to make every useTheme() call within it see unsaved
// form data instead of the live Firestore-backed values. Used for admin previews.
export function ThemePreviewProvider({ theme, siteSettings, children }) {
  const value = { theme, siteSettings };
  return <ThemeOverrideContext.Provider value={value}>{children}</ThemeOverrideContext.Provider>;
}
