import { collection, doc, getDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const SETTINGS_DOC_ID = 'main';

// Throws if jsonData does not match the site data schema (see docs/design.txt).
export function validateSiteData(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Site data must be an object.');
  }
  if (!jsonData.siteSettings || typeof jsonData.siteSettings !== 'object') {
    throw new Error('Site data is missing "siteSettings".');
  }
  if (!Array.isArray(jsonData.sections)) {
    throw new Error('Site data is missing a "sections" array.');
  }
  if (!Array.isArray(jsonData.items)) {
    throw new Error('Site data is missing an "items" array.');
  }
  jsonData.sections.forEach((section, i) => {
    if (!section.id || !section.title || !section.slug) {
      throw new Error(`Section at index ${i} is missing required fields (id, title, slug).`);
    }
  });
  jsonData.items.forEach((item, i) => {
    if (!item.id || !item.sectionId || !item.title) {
      throw new Error(`Item at index ${i} is missing required fields (id, sectionId, title).`);
    }
  });
  return true;
}

export async function exportSiteData() {
  const [settingsSnap, sectionsSnap, itemsSnap] = await Promise.all([
    getDoc(doc(db, 'siteSettings', SETTINGS_DOC_ID)),
    getDocs(collection(db, 'sections')),
    getDocs(collection(db, 'items')),
  ]);

  return {
    siteSettings: settingsSnap.exists() ? settingsSnap.data() : {},
    sections: sectionsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    items: itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  };
}

// Wipes existing sections/items and replaces them with jsonData in a single batch.
export async function importSiteData(jsonData) {
  validateSiteData(jsonData);

  const [existingSections, existingItems] = await Promise.all([
    getDocs(collection(db, 'sections')),
    getDocs(collection(db, 'items')),
  ]);

  const batch = writeBatch(db);

  existingSections.docs.forEach((d) => batch.delete(d.ref));
  existingItems.docs.forEach((d) => batch.delete(d.ref));

  batch.set(doc(db, 'siteSettings', SETTINGS_DOC_ID), jsonData.siteSettings);
  jsonData.sections.forEach(({ id, ...rest }) => batch.set(doc(db, 'sections', id), rest));
  jsonData.items.forEach(({ id, ...rest }) => batch.set(doc(db, 'items', id), rest));

  await batch.commit();
}
