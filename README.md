# Akash S — Portfolio

Single-page static portfolio. No build step.

## Run locally

    python -m http.server 4173

Then open http://localhost:4173

## Update content

All content lives in `index.html` — each section is marked with a
`<!-- ===== SECTION ===== -->` comment. Colors/spacing live in
`css/styles.css` under the `:root` token block. `[BRACKETED]` text is
placeholder awaiting the content pass.

## Deploying

On GitHub Pages, `404.html` is served for any missing path, so before
deploying, three URLs in it must be made absolute for the site's base
path (or the CSS inlined): the stylesheet link, the favicon link, and
the `href="/"` home link. The rest of the site uses only relative URLs
and works from any base path or `file://`.
