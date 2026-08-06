import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DEFAULT_THEME = {
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  fontFamily: 'Inter, sans-serif',
};

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = siteSettings?.theme ?? DEFAULT_THEME;

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
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--font-family', theme.fontFamily);
  }, [theme]);

  const value = { siteSettings, theme, loading };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
