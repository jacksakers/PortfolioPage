import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../../components/ui/Button';

export default function Hero() {
  const { siteSettings, theme, loading } = useTheme();

  if (loading) return null;

  if (!siteSettings) {
    return (
      <div className="text-center py-16">
        <h1 className="font-heading text-3xl font-semibold text-[var(--color-text)]">Portfolio coming soon</h1>
      </div>
    );
  }

  const { ownerName, tagline, bio, profileImageUrl, resumeUrl, heroBackgroundImageUrl, socialLinks } = siteSettings;
  const layout = theme.heroLayout;

  const resumeButton = resumeUrl && (
    <Button as="a" href={resumeUrl} target="_blank" rel="noopener noreferrer">
      View Resume
    </Button>
  );

  const socialButtons = socialLinks?.length > 0 && (
    <div className="flex flex-wrap justify-center gap-2">
      {socialLinks
        .filter((link) => link.url)
        .map((link) => (
          <Button
            key={link.url}
            as="a"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="!px-3 !py-1.5 text-sm"
          >
            {link.label || link.url}
          </Button>
        ))}
    </div>
  );

  if (layout === 'banner') {
    const bannerStyle = heroBackgroundImageUrl
      ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${heroBackgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : { backgroundColor: 'var(--color-primary)' };

    return (
      <section
        className="-mx-4 sm:mx-0 rounded-[var(--radius-card)] px-6 py-16 sm:py-20 text-center text-white flex flex-col items-center gap-4"
        style={bannerStyle}
      >
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt={ownerName}
            className="h-28 w-28 rounded-full object-cover border-4 border-white/60 shadow-md"
          />
        )}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold">{ownerName}</h1>
        {tagline && <p className="text-lg font-medium text-white/90">{tagline}</p>}
        {bio && <p className="max-w-xl text-white/80">{bio}</p>}
        {resumeButton && <div className="pt-2">{resumeButton}</div>}
        {socialButtons}
      </section>
    );
  }

  if (layout === 'split') {
    return (
      <section className="flex flex-col md:flex-row items-center gap-8 py-12 text-center md:text-left">
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt={ownerName}
            className="h-40 w-40 md:h-56 md:w-56 rounded-[var(--radius-card)] object-cover shadow-md flex-shrink-0"
          />
        )}
        <div className="space-y-3">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-text)]">{ownerName}</h1>
          {tagline && <p className="text-lg text-[var(--color-primary)] font-medium">{tagline}</p>}
          {bio && <p className="max-w-xl text-[var(--color-text-muted)]">{bio}</p>}
          {resumeButton && <div className="pt-1">{resumeButton}</div>}
          {socialButtons && <div className="md:justify-start flex">{socialButtons}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center text-center gap-4 py-12">
      {profileImageUrl && (
        <img
          src={profileImageUrl}
          alt={ownerName}
          className="h-32 w-32 rounded-full object-cover border-4 border-[var(--color-surface)] shadow-md"
        />
      )}
      <h1 className="font-heading text-3xl font-bold text-[var(--color-text)]">{ownerName}</h1>
      {tagline && <p className="text-lg text-[var(--color-primary)] font-medium">{tagline}</p>}
      {bio && <p className="max-w-xl text-[var(--color-text-muted)]">{bio}</p>}
      {resumeButton}
      {socialButtons}
    </section>
  );
}
