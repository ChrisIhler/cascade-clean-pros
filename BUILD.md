# Build & deploy — Cascade Clean Pros

This site is **prerendered React** with no in-browser Babel. The full page is
baked into `index.html` (so Google, Bing, and social scrapers see real content),
and `app.js` hydrates it for interactivity (nav, service tabs, FAQ, quote form).

## Edit the site
Edit **`src/app.jsx`** — that's the real source (palette `C`, `GRAD`, fonts,
copy, sections, and the quote form which POSTs to the Google Apps Script
`FORM_ENDPOINT`). SEO tags / `<head>` live in `index.template.html`.

## Build
```bash
npm install      # first time only
npm run build    # regenerates index.html + app.js from src/
```

## Deploy
Commit the regenerated `index.html` + `app.js` and push to `main`.
Cloudflare Pages serves them as static files — **no build step runs on
Cloudflare**, so you must run `npm run build` locally before committing.

## Files
| File | Role |
|------|------|
| `src/app.jsx` | React source — the editable site |
| `src/entry-client.jsx` | hydration entry |
| `src/entry-server.jsx` | prerender entry |
| `build.mjs` | esbuild compile + prerender |
| `index.template.html` | HTML shell: `<head>`/SEO + `<!--PRERENDER-->` slot |
| `index.html`, `app.js` | **built output — do not hand-edit; regenerate** |
| `sitemap.xml` | static sitemap |
