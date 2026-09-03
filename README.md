# Akash S — Portfolio

Single-page static portfolio. No build step.

**Live:** https://akash1803.github.io/akash-saravanan-portfolio/  
**Repo:** https://github.com/Akash1803/akash-saravanan-portfolio

## Run locally

    python -m http.server 4173

Then open http://localhost:4173

## Update content

All content lives in `index.html` — each section is marked with a
`<!-- ===== SECTION ===== -->` comment. Colors/spacing live in
`css/styles.css` under the `:root` token block. `[BRACKETED]` text is
placeholder awaiting the content pass.

## Deploying

Hosted on GitHub Pages from the `main` branch (root folder). Every push to
`main` redeploys the site within a minute or two:

    git add -A
    git commit -m "describe the change"
    git push

The site is served under the `/akash-saravanan-portfolio/` base path, so
`404.html` (which GitHub serves for any missing URL) uses absolute links
for its stylesheet, favicon and home button. Everything else uses relative
URLs and works from any base path or `file://`. If the repo is ever renamed
or moved to a user site, update the three links in `404.html`.
