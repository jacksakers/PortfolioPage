import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Hero from '../../portfolio/components/Hero';
import ItemCard from '../../portfolio/components/ItemCard';
import PreviewChrome from './PreviewChrome';
import { ThemePreviewProvider } from '../../../contexts/ThemeContext';
import { getRadiusOption, getBackgroundStyle } from '../../../utils/theme';

const SAMPLE_ITEM = {
  id: 'preview-sample',
  title: 'Sample Research Poster',
  date: '2026-01-01',
  description: 'This is how your posts will look with the current styling.',
  tags: ['Sample Tag'],
  links: [{ title: 'Example Link', url: '#' }],
  images: [],
};

// Renders the actual public-facing components (Navbar/Hero/Footer/ItemCard) scoped
// to unsaved form data, so admins see a true live preview instead of a mockup.
export default function LivePreviewFrame({ theme, siteSettings }) {
  const radius = getRadiusOption(theme.radius);

  const scopedVars = {
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
    ...getBackgroundStyle(theme),
  };

  return (
    <PreviewChrome style={scopedVars} onClick={(e) => e.preventDefault()}>
      <ThemePreviewProvider theme={theme} siteSettings={siteSettings}>
        <div className="min-h-full flex flex-col">
          <Navbar />
          <main className="flex-1 w-full mx-auto px-4 py-6 max-w-md space-y-6">
            <Hero />
            <ItemCard item={SAMPLE_ITEM} />
          </main>
          <Footer />
        </div>
      </ThemePreviewProvider>
    </PreviewChrome>
  );
}
