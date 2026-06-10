// Convert ~/cascade-marketing/pages/*.md -> build/src/page-content.js
// (SERVICE_PAGES + LOCATION_PAGES, bundled into client + server so prerender +
// hydration match). Empty input is a valid state (writes empty arrays).
// Run from the build/ dir:  node convert-pages.mjs
import { marked } from "marked";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.env.HOME, "Desktop", "Cascade Clean Pros", "Cascade-Clean-Pros-Business", "Marketing", "pages");

function frontmatter(txt) {
  const m = txt.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: txt };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/);
    if (mm) meta[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2] };
}

const services = [], locations = [];
const files = existsSync(SRC) ? readdirSync(SRC).filter(f => f.endsWith(".md")) : [];
for (const f of files) {
  const { meta, body } = frontmatter(readFileSync(join(SRC, f), "utf8"));
  const slug = meta.slug || f.replace(/\.md$/, "");
  // classify: explicit type wins; else "<city>-wa" slugs are locations
  const type = (meta.type || (/-wa$/.test(slug) ? "location" : "service")).toLowerCase();
  const cleaned = body
    .replace(/^\s*\[INTERNAL-LINK:[^\]]*\]\s*$/gim, "")
    .replace(/\[INTERNAL-LINK:[^\]]*\]/gi, "")
    .replace(/^\s*\[(?:IMAGE|CHART):[^\]]*\]\s*$/gim, "")
    .replace(/\[(?:IMAGE|CHART):[^\]]*\]/gi, "")
    .replace(/\[(?:UNIQUE INSIGHT|PERSONAL EXPERIENCE)\]\s*/gi, "");
  const html = marked.parse(cleaned, { gfm: true }).trim();
  const base = type === "location" ? "/locations/" : "/services/";
  const rec = { slug, path: base + slug + "/", title: meta.title || slug,
    metaDescription: meta.metaDescription || "", primaryKeyword: meta.primaryKeyword || "", html };
  (type === "location" ? locations : services).push(rec);
}

const out = "// AUTO-GENERATED from ~/cascade-marketing/pages/*.md by convert-pages.mjs — do not edit by hand.\n" +
  "export const SERVICE_PAGES = " + JSON.stringify(services, null, 2) + ";\n" +
  "export const LOCATION_PAGES = " + JSON.stringify(locations, null, 2) + ";\n";
writeFileSync(join(process.cwd(), "src", "page-content.js"), out);
console.log(`wrote src/page-content.js — ${services.length} service page(s), ${locations.length} location page(s)`);
