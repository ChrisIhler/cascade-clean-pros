// Convert ~/cascade-marketing/blog/*.md -> build/src/blog-content.js (data module
// bundled into both the client and server builds so prerender + hydration match).
// Run from the build/ dir:  node convert-blog.mjs
import { marked } from "marked";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.env.HOME, "Desktop", "Cascade Clean Pros", "Cascade-Clean-Pros-Business", "Marketing", "blog");
const order = ["soft-wash-vs-pressure-wash", "moss-damage-roof-pnw",
  "how-often-wash-house-pacific-northwest", "does-pressure-washing-damage-vinyl-siding"];

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

const files = readdirSync(SRC).filter(f => f.endsWith(".md"));
const posts = [];
for (const f of files) {
  const txt = readFileSync(join(SRC, f), "utf8");
  const { meta, body } = frontmatter(txt);
  // strip unbuilt internal-link placeholder markers (whole-line and inline)
  const cleaned = body
    .replace(/^\s*\[INTERNAL-LINK:[^\]]*\]\s*$/gim, "")
    .replace(/\[INTERNAL-LINK:[^\]]*\]/gi, "");
  const html = marked.parse(cleaned, { gfm: true }).trim();
  const slug = meta.slug || f.replace(/\.md$/, "");
  posts.push({
    slug,
    path: `/blog/${slug}/`,
    title: meta.title || slug,
    metaDescription: meta.metaDescription || "",
    primaryKeyword: meta.primaryKeyword || "",
    html,
  });
}
posts.sort((a, b) => {
  const i = order.indexOf(a.slug), j = order.indexOf(b.slug);
  return (i < 0 ? 99 : i) - (j < 0 ? 99 : j);
});

if (posts.length === 0) {
  console.error("convert-blog: found 0 markdown posts in " + SRC + " — refusing to overwrite src/blog-content.js (would wipe the live blog).");
  process.exit(1);
}
const out = "// AUTO-GENERATED from ~/cascade-marketing/blog/*.md by convert-blog.mjs — do not edit by hand.\n" +
  "export const BLOG_POSTS = " + JSON.stringify(posts, null, 2) + ";\n";
writeFileSync(join(process.cwd(), "src", "blog-content.js"), out);
console.log("wrote src/blog-content.js with " + posts.length + " post(s): " + posts.map(p => p.slug).join(", "));
