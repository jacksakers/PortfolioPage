import Hero from './components/Hero';
import HomeGallery from './components/HomeGallery';
import FeaturedPosts from './components/FeaturedPosts';
import { useTheme } from '../../contexts/ThemeContext';

export default function HomePage() {
  const { siteSettings } = useTheme();
  return (
    <div className="space-y-10">
      <Hero />
      <FeaturedPosts />
      <HomeGallery images={siteSettings?.galleryImages} />
    </div>
  );
}
