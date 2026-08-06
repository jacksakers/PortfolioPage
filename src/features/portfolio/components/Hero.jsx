import { useTheme } from '../../../contexts/ThemeContext';

export default function Hero() {
  const { siteSettings, loading } = useTheme();

  if (loading) return null;

  if (!siteSettings) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-semibold text-gray-900">Portfolio coming soon</h1>
      </div>
    );
  }

  const { ownerName, tagline, bio, profileImageUrl } = siteSettings;

  return (
    <section className="flex flex-col items-center text-center gap-4 py-12">
      {profileImageUrl && (
        <img
          src={profileImageUrl}
          alt={ownerName}
          className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
        />
      )}
      <h1 className="text-3xl font-bold text-gray-900">{ownerName}</h1>
      {tagline && <p className="text-lg text-[var(--color-primary)] font-medium">{tagline}</p>}
      {bio && <p className="max-w-xl text-gray-600">{bio}</p>}
    </section>
  );
}
