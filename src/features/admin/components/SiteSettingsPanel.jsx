import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useDocument } from '../../../hooks/useDocument';

const DEFAULT_SETTINGS = {
  title: '',
  ownerName: '',
  tagline: '',
  bio: '',
  profileImageUrl: '',
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    fontFamily: 'Inter, sans-serif',
  },
};

const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]';

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
        theme: { ...DEFAULT_SETTINGS.theme, ...data.theme },
      });
    }
  }, [data]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateTheme = (field, value) =>
    setForm((prev) => ({ ...prev, theme: { ...prev.theme, [field]: value } }));

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900">Site Settings</h2>

      {message && <p className="text-sm text-gray-600">{message}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Site Title">
          <input className={inputClass} value={form.title} onChange={(e) => updateField('title', e.target.value)} />
        </Field>
        <Field label="Owner Name">
          <input className={inputClass} value={form.ownerName} onChange={(e) => updateField('ownerName', e.target.value)} />
        </Field>
      </div>

      <Field label="Tagline">
        <input className={inputClass} value={form.tagline} onChange={(e) => updateField('tagline', e.target.value)} />
      </Field>

      <Field label="Bio">
        <textarea rows={4} className={inputClass} value={form.bio} onChange={(e) => updateField('bio', e.target.value)} />
      </Field>

      <Field label="Profile Image URL">
        <input className={inputClass} value={form.profileImageUrl} onChange={(e) => updateField('profileImageUrl', e.target.value)} />
      </Field>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Theme</h3>
        <div className="flex flex-wrap gap-6">
          <ColorField label="Primary Color" value={form.theme.primaryColor} onChange={(v) => updateTheme('primaryColor', v)} />
          <ColorField label="Secondary Color" value={form.theme.secondaryColor} onChange={(v) => updateTheme('secondaryColor', v)} />
          <Field label="Font Family">
            <input className={inputClass} value={form.theme.fontFamily} onChange={(e) => updateTheme('fontFamily', e.target.value)} />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex flex-col items-start gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-16 border border-gray-300 rounded-md"
      />
    </label>
  );
}
