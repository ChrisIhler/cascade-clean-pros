# Build & deploy — Cascade Clean Pros

This site is **prerendered React** with no in-browser Babel. The full page is
baked into `index.html` (so Google, Bing, and social scrapers see real content),
and `app.js` hydrates it for interactivity (nav, service tabs, FAQ, quote form).

> **Why the build tooling lives in `build/`:** Cloudflare Pages serves the repo
> root as static files. If a `package.json` sits at the root, Cloudflare tries to
> run a Node build (which we don't want). Keeping all tooling under `build/`
> means the root is pure static (`index.html`, `app.js`, `sitemap.xml`) and
> deploys with no build step on Cloudflare.

## Edit the site
Edit **`build/src/app.jsx`** — the real source (palette `C`, `GRAD`, fonts, copy,
sections, and the quote form that POSTs to the Google Apps Script `FORM_ENDPOINT`).
The `<head>` / SEO tags live in `build/index.template.html`.

## Build (regenerates root index.html + app.js)
```bash
cd build
npm install      # first time only
npm run build    # writes ../index.html and ../app.js
```

## Deploy
Commit the regenerated `index.html` + `app.js` (repo root) and push to `main`.
Cloudflare serves them statically — **no build runs on Cloudflare**, so run the
build locally before committing.

## Files
| Path | Role |
|------|------|
| `index.html`, `app.js` | **built output (repo root) — do not hand-edit; regenerate** |
| `sitemap.xml` | static sitemap |
| `build/src/app.jsx` | React source — the editable site |
| `build/src/entry-client.jsx` | hydration entry |
| `build/src/entry-server.jsx` | prerender entry |
| `build/build.mjs` | esbuild compile + prerender (outputs to repo root) |
| `build/index.template.html` | HTML shell: `<head>`/SEO + `<!--PRERENDER-->` slot |
