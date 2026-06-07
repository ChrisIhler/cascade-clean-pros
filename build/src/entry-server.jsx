import React from "react";
import { renderToString } from "react-dom/server";
import App from "./app.jsx";
import { BLOG_POSTS } from "./blog-content.js";

export function render(route) {
  return renderToString(React.createElement(App, { route }));
}

// Sub-page route manifest consumed by build.mjs (one prerendered file per entry).
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
  })),
];
