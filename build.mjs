// Build: compile the React source to a hydration bundle (app.js) and prerender
// the page into index.html (from index.template.html). No in-browser Babel.
import esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const PROD = { "process.env.NODE_ENV": '"production"' };

// 1. Client hydration bundle -> app.js
await esbuild.build({
  entryPoints: [join(__dirname, "src/entry-client.jsx")],
  bundle: true, platform: "browser", format: "iife", jsx: "transform",
  minify: true, define: PROD, outfile: join(__dirname, "app.js"), logLevel: "warning",
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
const { render } = require(serverCjs);
const prerender = render();
rmSync(tmp, { recursive: true, force: true });

// 3. Inject prerender into the template -> index.html
const tpl = readFileSync(join(__dirname, "index.template.html"), "utf8");
if (!tpl.includes("<!--PRERENDER-->")) throw new Error("template missing <!--PRERENDER--> placeholder");
const out = tpl.replace("<!--PRERENDER-->", prerender);
writeFileSync(join(__dirname, "index.html"), out);

console.log(`Built index.html (${out.length} bytes) + app.js. Prerender: ${prerender.length} bytes.`);
