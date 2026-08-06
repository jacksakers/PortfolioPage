import { useTheme } from '../../contexts/ThemeContext';
import { getLayoutWidthClass } from '../../utils/theme';

export default function Footer() {
  const { siteSettings, theme } = useTheme();
  const ownerName = siteSettings?.ownerName || 'Portfolio';
  const { contactEmail, linkedinUrl, resumeUrl } = siteSettings || {};
  const widthClass = getLayoutWidthClass(theme.layoutWidth);
  const hasLinks = contactEmail || linkedinUrl || resumeUrl;

  return (
    <footer className="border-t border-black/5 mt-16">
      <div className={`${widthClass} mx-auto px-4 py-6 text-sm text-[var(--color-text-muted)] text-center space-y-2`}>
        {hasLinks && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="hover:text-[var(--color-primary)]">
                {contactEmail}
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)]">
                LinkedIn
              </a>
            )}
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)]">
                Resume
              </a>
            )}
          </div>
        )}
        <p>
          © {new Date().getFullYear()} {ownerName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
