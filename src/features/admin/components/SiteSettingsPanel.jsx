import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useDocument } from '../../../hooks/useDocument';
import LivePreviewFrame from './LivePreviewFrame';
import ImageUploadField from '../../../components/ui/ImageUploadField';
import {
  DEFAULT_THEME,
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  BUTTON_STYLE_OPTIONS,
  HERO_LAYOUT_OPTIONS,
  NAVBAR_STYLE_OPTIONS,
  LAYOUT_WIDTH_OPTIONS,
  CARD_STYLE_OPTIONS,
  BACKGROUND_STYLE_OPTIONS,
  resolveTheme,
} from '../../../utils/theme';

const DEFAULT_SETTINGS = {
  title: '',
  ownerName: '',
  tagline: '',
  bio: '',
  profileImageUrl: '',
  heroBackgroundImageUrl: '',
  resumeUrl: '',
  contactEmail: '',
  socialLinks: [],
  theme: DEFAULT_THEME,
};

const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]';
const selectClass = inputClass;

export default function SiteSettingsPanel() {
  const { data, loading } = useDocument('siteSettings', 'main');
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) {
      setForm({
        ...DEFAULT_SETTINGS,
        ...data,
        theme: resolveTheme(data.theme),
      });
    }
  }, [data]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateTheme = (field, value) =>
    setForm((prev) => ({ ...prev, theme: { ...prev.theme, [field]: value } }));

  const updateSocialLink = (index, field, value) => {
    const socialLinks = [...form.socialLinks];
    socialLinks[index] = { ...socialLinks[index], [field]: value };
    setForm((prev) => ({ ...prev, socialLinks }));
  };
  const addSocialLink = () =>
    setForm((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, { label: '', url: '' }] }));
  const removeSocialLink = (index) =>
    setForm((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), form);
      setMessage('Settings saved.');
    } catch {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading settings...</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Site Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Changes here control how your public portfolio looks and feels. Use the preview on the right to see the
            effect before saving.
          </p>
        </div>

        {message && <p className="text-sm text-gray-600">{message}</p>}

        <Section title="Basic Info" description="The core details shown in your hero section and browser tab.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site Title" help="Shown in the browser tab.">
              <input className={inputClass} value={form.title} onChange={(e) => updateField('title', e.target.value)} />
            </Field>
            <Field label="Owner Name" help="Displayed as the main heading and in the navigation bar.">
              <input
                className={inputClass}
                value={form.ownerName}
                onChange={(e) => updateField('ownerName', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Tagline" help="A short line under your name, e.g. a title or specialty.">
            <input className={inputClass} value={form.tagline} onChange={(e) => updateField('tagline', e.target.value)} />
          </Field>

          <Field label="Bio" help="A few sentences introducing yourself.">
            <textarea rows={4} className={inputClass} value={form.bio} onChange={(e) => updateField('bio', e.target.value)} />
          </Field>

          <ImageUploadField
            label="Profile Photo"
            value={form.profileImageUrl}
            onChange={(url) => updateField('profileImageUrl', url)}
            storagePath="site"
          />
        </Section>

        <Section title="Contact & Links" description="Optional links shown in the hero and site footer.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact Email" help="Shown in the footer as a mailto link.">
              <input
                type="email"
                className={inputClass}
                value={form.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
              />
            </Field>
            <Field label="Resume URL" help="Adds a 'View Resume' button to your hero section.">
              <input
                className={inputClass}
                value={form.resumeUrl}
                onChange={(e) => updateField('resumeUrl', e.target.value)}
              />
            </Field>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Social & Other Links</p>
            <p className="text-xs text-gray-400">e.g. LinkedIn, GitHub, personal website — shown in the footer.</p>
            {form.socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="Label (e.g. LinkedIn)"
                  className={inputClass}
                  value={link.label}
                  onChange={(e) => updateSocialLink(i, 'label', e.target.value)}
                />
                <input
                  placeholder="URL"
                  className={inputClass}
                  value={link.url}
                  onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                />
                <button type="button" onClick={() => removeSocialLink(i)} className="text-red-600 text-sm">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addSocialLink} className="text-sm text-[var(--color-primary)] font-medium">
              + Add Link
            </button>
          </div>
        </Section>

        <Section title="Colors" description="Pick colors for the key surfaces and accents of your site.">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <ColorField
              label="Primary"
              help="Buttons, links, active nav item."
              value={form.theme.primaryColor}
              onChange={(v) => updateTheme('primaryColor', v)}
            />
            <ColorField
              label="Secondary"
              help="Tags and accents."
              value={form.theme.secondaryColor}
              onChange={(v) => updateTheme('secondaryColor', v)}
            />
            <ColorField
              label="Page Background"
              help="Behind everything."
              value={form.theme.backgroundColor}
              onChange={(v) => updateTheme('backgroundColor', v)}
            />
            <ColorField
              label="Card Background"
              help="Cards, navbar (light style)."
              value={form.theme.surfaceColor}
              onChange={(v) => updateTheme('surfaceColor', v)}
            />
            <ColorField
              label="Text"
              help="Headings and main text."
              value={form.theme.textColor}
              onChange={(v) => updateTheme('textColor', v)}
            />
            <ColorField
              label="Muted Text"
              help="Bios, dates, captions."
              value={form.theme.mutedTextColor}
              onChange={(v) => updateTheme('mutedTextColor', v)}
            />
          </div>
        </Section>

        <Section title="Typography" description="Fonts are loaded automatically from Google Fonts.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Heading Font" help="Used for names and section titles.">
              <select
                className={selectClass}
                value={form.theme.headingFont}
                onChange={(e) => updateTheme('headingFont', e.target.value)}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Body Font" help="Used for bios, descriptions, and general text.">
              <select
                className={selectClass}
                value={form.theme.bodyFont}
                onChange={(e) => updateTheme('bodyFont', e.target.value)}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Layout & Style" description="Structural choices for the hero, navigation, and content.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hero Layout" help="How your intro section is arranged.">
              <select
                className={selectClass}
                value={form.theme.heroLayout}
                onChange={(e) => updateTheme('heroLayout', e.target.value)}
              >
                {HERO_LAYOUT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Navigation Bar" help="Light bar blends in; bold bar uses your primary color.">
              <select
                className={selectClass}
                value={form.theme.navbarStyle}
                onChange={(e) => updateTheme('navbarStyle', e.target.value)}
              >
                {NAVBAR_STYLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Page Width" help="How wide the content area is on large screens.">
              <select
                className={selectClass}
                value={form.theme.layoutWidth}
                onChange={(e) => updateTheme('layoutWidth', e.target.value)}
              >
                {LAYOUT_WIDTH_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Corner Style" help="Roundness of cards, images, and buttons.">
              <select
                className={selectClass}
                value={form.theme.radius}
                onChange={(e) => updateTheme('radius', e.target.value)}
              >
                {RADIUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Button Style" help="How links and buttons are rendered.">
              <select
                className={selectClass}
                value={form.theme.buttonStyle}
                onChange={(e) => updateTheme('buttonStyle', e.target.value)}
              >
                {BUTTON_STYLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Card Style" help="How post cards are framed.">
              <select
                className={selectClass}
                value={form.theme.cardStyle}
                onChange={(e) => updateTheme('cardStyle', e.target.value)}
              >
                {CARD_STYLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Page Background" help="Solid color or a soft tint fading from the top.">
              <select
                className={selectClass}
                value={form.theme.backgroundStyle}
                onChange={(e) => updateTheme('backgroundStyle', e.target.value)}
              >
                {BACKGROUND_STYLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {form.theme.heroLayout === 'banner' && (
            <ImageUploadField
              label="Hero Background Photo"
              value={form.heroBackgroundImageUrl}
              onChange={(url) => updateField('heroBackgroundImageUrl', url)}
              storagePath="site"
              aspect="wide"
            />
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.theme.navbarSticky}
              onChange={(e) => updateTheme('navbarSticky', e.target.checked)}
            />
            Keep navigation bar fixed at the top while scrolling
          </label>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      <LivePreviewFrame theme={form.theme} siteSettings={form} />
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <div className="space-y-4 pb-6 border-b border-gray-100 last:border-b-0">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, help, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
      {help && <span className="block text-xs text-gray-400 mt-1">{help}</span>}
    </label>
  );
}

function ColorField({ label, help, value, onChange }) {
  return (
    <label className="flex flex-col items-start gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-16 border border-gray-300 rounded-md"
      />
      {help && <span className="text-xs text-gray-400">{help}</span>}
    </label>
  );
}
