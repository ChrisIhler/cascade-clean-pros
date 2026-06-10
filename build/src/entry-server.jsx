import React from "react";
import { renderToString } from "react-dom/server";
import App from "./app.jsx";
import { BLOG_POSTS } from "./blog-content.js";
import { SERVICE_PAGES, LOCATION_PAGES } from "./page-content.js";

export function render(route) {
  return renderToString(React.createElement(App, { route }));
}

// Sub-page route manifest consumed by build.mjs (one prerendered file per entry).
// Index routes are emitted only when their collection is non-empty.
export const SUBROUTES = [
  {
    path: "/blog/",
    kind: "blogindex",
    title: "Blog — Exterior Cleaning Guides for the Pacific Northwest | Cascade Clean Pros",
    description: "Guides to pressure washing, soft washing, roof moss removal, and home exterior care across King & Snohomish County, WA.",
  },
  ...BLOG_POSTS.map(p => ({
    path: p.path,
    kind: "post",
    slug: p.slug,
    title: `${p.title} | Cascade Clean Pros`,
    description: p.metaDescription,
    iso: p.dateISO,
  })),
  ...(SERVICE_PAGES.length ? [{
    path: "/services/",
    kind: "servicesindex",
    title: "Our Services — Pressure & Soft Washing | Cascade Clean Pros",
    description: "Pressure washing, soft washing, house washing, roof moss treatment, gutter, driveway and commercial cleaning across King & Snohomish County, WA.",
  }] : []),
  ...SERVICE_PAGES.map(p => ({
    path: p.path, kind: "service", slug: p.slug,
    title: `${p.title} | Cascade Clean Pros`, description: p.metaDescription,
  })),
  ...(LOCATION_PAGES.length ? [{
    path: "/locations/",
    kind: "locationsindex",
    title: "Service Areas — King & Snohomish County, WA | Cascade Clean Pros",
    description: "Owner-operated pressure and soft washing across the greater Seattle–Everett corridor in King & Snohomish County, Washington.",
  }] : []),
  ...LOCATION_PAGES.map(p => ({
    path: p.path, kind: "location", slug: p.slug,
    title: `${p.title} | Cascade Clean Pros`, description: p.metaDescription,
  })),
];
