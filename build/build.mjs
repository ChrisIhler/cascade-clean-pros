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
const TODAY = "2026-06-09";
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

function pageSchema(r, img = "/media/hero-poster.jpg") {
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
      "datePublished": r.iso || TODAY, "dateModified": TODAY,
      "image": ORIGIN + img,
      "author": { "@type": "Organization", "name": "Cascade Clean Pros" },
      "publisher": { "@type": "Organization", "name": "Cascade Clean Pros", "url": ORIGIN + "/" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": ORIGIN + r.path }
    });
  } else if (r.kind === "service" || r.kind === "location") {
    const headline = r.title.replace(/\s*\|\s*Cascade Clean Pros\s*$/, "");
    const isSvc = r.kind === "service";
    crumbItems.push({ name: isSvc ? "Services" : "Service Areas", url: ORIGIN + (isSvc ? "/services/" : "/locations/") });
    crumbItems.push({ name: headline, url: ORIGIN + r.path });
    blocks.push({
      "@context": "https://schema.org", "@type": "Service",
      "name": headline, "description": r.description, "serviceType": "Exterior cleaning",
      "url": ORIGIN + r.path, "image": ORIGIN + img,
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "King County, Washington" },
        { "@type": "AdministrativeArea", "name": "Snohomish County, Washington" }
      ],
      "provider": { "@type": "LocalBusiness", "name": "Cascade Clean Pros", "telephone": "+1-360-202-7249", "url": ORIGIN + "/" }
    });
  } else if (r.kind === "servicesindex" || r.kind === "locationsindex") {
    const isSvc = r.kind === "servicesindex";
    const url = ORIGIN + (isSvc ? "/services/" : "/locations/");
    crumbItems.push({ name: isSvc ? "Services" : "Service Areas", url });
    blocks.push({
      "@context": "https://schema.org", "@type": "CollectionPage",
      "name": isSvc ? "Services" : "Service Areas", "url": url, "description": r.description,
      "isPartOf": { "@type": "WebSite", "name": "Cascade Clean Pros", "url": ORIGIN + "/" }
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
  const ogImg = (prerender.match(/<img[^>]+src="(\/media\/[^"]+)"/) || [])[1] || "/media/hero-poster.jpg";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-J357S4KMQ5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-J357S4KMQ5');</script>
<title>${esc(r.title)}</title>
<meta name="description" content="${esc(r.description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${r.kind === "post" ? "article" : "website"}">
<meta property="og:site_name" content="Cascade Clean Pros">
<meta property="og:title" content="${esc(r.title)}">
<meta property="og:description" content="${esc(r.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ORIGIN}${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(r.title)}">
<meta name="twitter:description" content="${esc(r.description)}">
<meta name="twitter:image" content="${ORIGIN}${ogImg}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
${pageSchema(r, ogImg)}
${favicons}
${cssBlock}
</head>
<body>
<div id="root">${prerender}</div>
<script src="/app.js" defer></script>
</body>
</html>`;
}

// Prune generated section dirs first so removed routes never linger, then regenerate.
for (const section of ["blog", "services", "locations"]) {
  rmSync(join(ROOT, section), { recursive: true, force: true });
}
const written = [];
for (const r of SUBROUTES) {
  const dir = join(ROOT, r.path);              // e.g. ../blog/ or ../blog/<slug>/
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), subpageHtml(r));
  written.push(r.path);
}

rmSync(tmp, { recursive: true, force: true });

// 5. Rebuild the sub-route entries of sitemap.xml each run (self-healing — removes
//    stale routes). The homepage entry (multi-line) is left untouched.
try {
  const smPath = join(ROOT, "sitemap.xml");
  let sm = readFileSync(smPath, "utf8");
  // strip all previously-generated single-line sub-route entries
  sm = sm.replace(/[ \t]*<url><loc>https:\/\/cascadecleanpros\.com\/[^<]*<\/loc>(?:<lastmod>[^<]*<\/lastmod>)?<changefreq>monthly<\/changefreq><priority>0\.7<\/priority><\/url>\n?/g, "");
  const entries = SUBROUTES.map(r =>
    `  <url><loc>${ORIGIN + r.path}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n");
  sm = sm.replace("</urlset>", entries + (entries ? "\n" : "") + "</urlset>");
  writeFileSync(smPath, sm);
  console.log(`sitemap.xml: refreshed ${SUBROUTES.length} sub-route url(s)`);
} catch (e) {
  console.log("sitemap.xml: skipped (" + e.message + ")");
}

console.log(`Built ../index.html (${homeHtml.length} bytes) + ../app.js + ${written.length} sub-page(s): ${written.join(", ")}`);
