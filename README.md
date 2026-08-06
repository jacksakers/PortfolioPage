# MedFolio — Portfolio Builder

A data-driven, customizable portfolio builder built with React, Vite, Tailwind CSS, and Firebase. See [docs/design.txt](docs/design.txt) for the full product design and [docs/implementation.txt](docs/implementation.txt) for the phased roadmap.

## Progress

- **Phase 1 — Foundation & Setup:** done. Vite + React, Tailwind, Firebase (`src/firebaseConfig.js`), routing.
- **Phase 2 — Authentication & Contexts:** done. `AuthContext`, `ThemeContext`, `ProtectedRoute`, `LoginPage`.
- **Phase 3 — Core Data & Hooks:** done.
  - `src/hooks/useCollection.js` — subscribes to a Firestore collection (with optional query constraints).
  - `src/hooks/useDocument.js` — subscribes to a single Firestore document.
  - `src/hooks/useStorage.js` — uploads a file to Firebase Storage and reports progress.
  - `src/utils/siteData.js` — `exportSiteData()` and `importSiteData()` (schema-validated, batched writes) matching the JSON schema in [docs/design.txt](docs/design.txt).
- **Phase 4 — Admin Dashboard:** done. `src/features/admin/AdminDashboard.jsx` hosts a sidebar (`AdminSidebar`) with four panels:
  - `SiteSettingsPanel` — edit site title/bio/profile image and theme colors.
  - `SectionsPanel` — add/edit/delete navigation sections.
  - `ItemsPanel` / `ItemForm` — add/edit/delete posts, with image upload and link lists.
  - `DataHubPanel` — export the full site as JSON, or import a JSON file to replace all data.
- **Phase 5 — Public Portfolio:** done.
  - `src/components/layout/PublicLayout.jsx`, `Navbar.jsx` (dynamic nav from Firestore sections, mobile hamburger menu), `Footer.jsx`.
  - `src/features/portfolio/components/Hero.jsx` — profile image, name, tagline, bio from `siteSettings`.
  - `src/features/portfolio/SectionView.jsx` — generic `/portfolio/:slug` page, renders a grid or timeline layout depending on the section's `type`.
  - `src/features/portfolio/components/ItemCard.jsx` — post card with tags/links and a click-to-expand image lightbox (`src/components/ui/Modal.jsx`).
- **Phase 6 — Polish & Deployment:** done.
  - Responsive layouts throughout (collapsible mobile nav, responsive grids/sidebar).
  - `firestore.rules` / `storage.rules` — public read, authenticated-only write, image type/size limits on Storage uploads.
  - `firebase.json` / `.firebaserc` — Firebase Hosting config (SPA rewrites) and project alias.

## Setup

1. Copy `.env` with your Firebase project config (`VITE_FIREBASE_*` variables).
2. `npm install`
3. `npm run dev`

## Deployment

```
npm run build
firebase deploy
```

This deploys Hosting (the `dist` build output), plus the Firestore and Storage security rules. Requires the [Firebase CLI](https://firebase.google.com/docs/cli) installed and logged in (`firebase login`), with the project alias in `.firebaserc` matching your Firebase project.

## React + Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
