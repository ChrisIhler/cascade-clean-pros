// Build (run from the build/ dir): compile the React source to a hydration bundle
// and prerender every route. Outputs to the REPO ROOT (../): index.html + app.js +
// one <route>/index.html per sub-page (blog index + posts). Cloudflare serves the
// root statically — NO package.json at the repo root, so Cloudflare runs no build;
// you build locally and commit the output.
import esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));   // the build/ dir
const ROOT = join(__dirname, "..");                          // repo root (deploy dir)
const require = createRequire(import.meta.url);
const PROD = { "process.env.NODE_ENV": '"production"' };
const ORIGIN = "https://cascadecleanpros.com";
const TODAY = "2026-06-06";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 1. Client hydration bundle -> ../app.js
await esbuild.build({
  entryPoints: [join(__dirname, "src/entry-client.jsx")],
  bundle: true, platform: "browser", format: "iife", jsx: "transform",
  minify: true, define: PROD, outfile: join(ROOT, "app.js"), logLevel: "warning",
});

// 2. Server bundle -> prerender HTML
const tmp = join(__dirname, ".build");
mkdirSync(tmp, { recursive: true });
const serverCjs = join(tmp, "server.cjs");
await esbuild.build({
  entryPoints: [join(__dirname, "src/entry-server.jsx")],
  bundle: true, platform: "node", format: "cjs", jsx: "transform",
  define: PROD, outfile: serverCjs, logLevel: "warning",
});
const { render, SUBROUTES } = require(serverCjs);

// 3. Home page -> ../index.html (template carries its own head + schema)
const tpl = readFileSync(join(__dirname, "index.template.html"), "utf8");
if (!tpl.includes("<!--PRERENDER-->")) throw new Error("template missing <!--PRERENDER--> placeholder");
const homeHtml = tpl.replace("<!--PRERENDER-->", () => render("/"));
writeFileSync(join(ROOT, "index.html"), homeHtml);

// 4. Shared head chrome reused by sub-pages (favicons + critical CSS) — pulled
//    from the home template so the 50KB favicon blobs are not duplicated in source.
const cssBlock = (tpl.match(/<style>[\s\S]*?<\/style>/) || [""])[0];
const favicons = (tpl.match(/<link rel="(?:icon|apple-touch-icon)[^>]*>/g) || []).join("\n");

function pageSchema(r) {
  const blocks = [];
  const crumbItems = [{ name: "Home", url: ORIGIN + "/" }];
  if (r.kind === "blogindex") {
    crumbItems.push({ name: "Blog", url: ORIGIN + "/blog/" });
    blocks.push({
      "@context": "https://schema.org", "@type": "Blog",
      "name": "Cascade Clean Pros Blog", "url": ORIGIN + "/blog/",
      "description": r.description,
      "publisher": { "@type": "Organization", "name": "Cascade Clean Pros", "url": ORIGIN + "/" }
    });
  } else if (r.kind === "post") {
    const headline = r.title.replace(/\s*\|\s*Cascade Clean Pros\s*$/, "");
    crumbItems.push({ name: "Blog", url: ORIGIN + "/blog/" });
    crumbItems.push({ name: headline, url: ORIGIN + r.path });
    blocks.push({
      "@context": "https://schema.org", "@type": "BlogPosting",
      "headline": headline, "description": r.description,
      "datePublished": TODAY, "dateModified": TODAY,
      "image": ORIGIN + "/media/hero-poster.jpg",
      "author": { "@type": "Organization", "name": "Cascade Clean Pros" },
      "publisher": { "@type": "Organization", "name": "Cascade Clean Pros", "url": ORIGIN + "/" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": ORIGIN + r.path }
    });
  }
  blocks.push({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": crumbItems.map((c, i) => ({
      "@type": "ListItem", "position": i + 1, "name": c.name, "item": c.url
    }))
  });
  return blocks.map(b => `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`).join("\n");
}

function subpageHtml(r) {
  const canonical = ORIGIN + r.path;
  const prerender = render(r.path);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(r.title)}</title>
<meta name="description" content="${esc(r.description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${r.kind === "post" ? "article" : "website"}">
<meta property="og:site_name" content="Cascade Clean Pros">
<meta property="og:title" content="${esc(r.title)}">
<meta property="og:description" content="${esc(r.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ORIGIN}/media/hero-poster.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(r.title)}">
<meta name="twitter:description" content="${esc(r.description)}">
<meta name="twitter:image" content="${ORIGIN}/media/hero-poster.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${pageSchema(r)}
${favicons}
${cssBlock}
</head>
<body>
<div id="root">${prerender}</div>
<script src="/app.js" defer></script>
</body>
</html>`;
}

const written = [];
for (const r of SUBROUTES) {
  const dir = join(ROOT, r.path);              // e.g. ../blog/ or ../blog/<slug>/
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), subpageHtml(r));
  written.push(r.path);
}

rmSync(tmp, { recursive: true, force: true });

// 5. Keep sitemap.xml in sync — add any new sub-page URLs not already listed.
try {
  const smPath = join(ROOT, "sitemap.xml");
  let sm = readFileSync(smPath, "utf8");
  const urls = SUBROUTES.map(r => ORIGIN + r.path);
  const missing = urls.filter(u => !sm.includes(`<loc>${u}</loc>`));
  if (missing.length) {
    const entries = missing.map(u =>
      `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n");
    sm = sm.replace("</urlset>", entries + "\n</urlset>");
    writeFileSync(smPath, sm);
    console.log(`sitemap.xml: added ${missing.length} url(s)`);
  } else {
    console.log("sitemap.xml: already current");
  }
} catch (e) {
  console.log("sitemap.xml: skipped (" + e.message + ")");
}

console.log(`Built ../index.html (${homeHtml.length} bytes) + ../app.js + ${written.length} sub-page(s): ${written.join(", ")}`);
