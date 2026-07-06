# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Akash S's single-page static portfolio (elevated-minimal, survey-map visual identity, light/dark themes) ready for a content pass, per the approved spec at `docs/superpowers/specs/2026-07-06-portfolio-website-design.md`.

**Architecture:** One semantic `index.html` holding all content; one `css/styles.css` carrying the whole design system via CSS custom properties (two themes); one small `js/main.js` for progressive enhancement only (theme toggle, mobile nav, scroll-spy, scroll-reveal). Project cards use native `<details>` so expansion works without JS.

**Tech Stack:** Plain HTML5 + CSS3 + vanilla ES6. No frameworks, no build step, no CDN dependencies at runtime (fonts self-hosted). Python's `http.server` for local preview.

## Global Constraints

- Repo root: `C:\Users\FAI-Akash\portfolio` (git repo exists, branch `main`). All paths below are relative to it.
- Git identity is already configured locally (Akash S <akashcivil04@gmail.com>). Never change it.
- No runtime network dependencies: every font/icon/script must be a local file or inline.
- Content that needs Akash's confirmation is written in square brackets `[LIKE THIS]` and/or marked `<!-- CONTENT-PASS -->`. Never invent unbracketed facts.
- Section IDs are fixed API: `about`, `experience`, `projects`, `skills`, `education`, `contact`.
- Design tokens are fixed API (Task 2 defines them): use only `var(--…)` tokens for color/spacing/type — no hard-coded colors in later tasks.
- All motion must be disabled under `@media (prefers-reduced-motion: reduce)`.
- Page must be fully readable with JavaScript disabled.
- Verification commands assume the preview server from Task 1 Step 4 is running at `http://localhost:4173`.
- Commit after every task; messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` (add it as a second `-m` flag; not shown in each step for brevity).

---

### Task 1: Scaffold, fonts, and HTML skeleton

**Files:**
- Create: `.gitignore`, `README.md`, `index.html`, `css/styles.css` (stub), `js/main.js` (stub), `assets/fonts/` (downloaded woff2 files), `assets/favicon.svg`
- Test: manual curl checks against local server

**Interfaces:**
- Produces: the fixed section IDs (`about`…`contact`), `<html>` element that gets `data-theme` set by an inline boot script, font files `assets/fonts/clash-display-{600,700}.woff2`, `archivo-{400,500,600}.woff2`, `ibm-plex-mono-{400,500}.woff2`.
- Later tasks fill the empty `<section>` shells and the two stub files.

- [ ] **Step 1: Create `.gitignore` and `README.md`**

`.gitignore`:

```gitignore
Thumbs.db
.DS_Store
*.log
```

`README.md`:

```markdown
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
```

- [ ] **Step 2: Download and self-host the three font families**

Run from repo root (Git Bash). The css2/fontshare APIs return `@font-face` CSS whose `src:` URLs we download:

```bash
mkdir -p assets/fonts
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
# Clash Display 600,700 (Fontshare)
curl -sA "$UA" "https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" -o /tmp/cd.css
# Archivo 400,500,600 + IBM Plex Mono 400,500 (Google)
curl -sA "$UA" "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&display=swap" -o /tmp/ar.css
curl -sA "$UA" "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" -o /tmp/pm.css
grep -o 'https://[^)]*woff2' /tmp/cd.css | sort -u
grep -o 'https://[^)]*woff2' /tmp/ar.css | sort -u
grep -o 'https://[^)]*woff2' /tmp/pm.css | sort -u
```

Download **one URL per weight** (Google lists many unicode-range subsets — pick the `latin` subset block for each weight, it is the last URL inside each weight's `@font-face` block that has `U+0000-00FF` in its `unicode-range`). Save as:

```bash
curl -sA "$UA" "<clash 600 url>"  -o assets/fonts/clash-display-600.woff2
curl -sA "$UA" "<clash 700 url>"  -o assets/fonts/clash-display-700.woff2
curl -sA "$UA" "<archivo 400 latin url>" -o assets/fonts/archivo-400.woff2
curl -sA "$UA" "<archivo 500 latin url>" -o assets/fonts/archivo-500.woff2
curl -sA "$UA" "<archivo 600 latin url>" -o assets/fonts/archivo-600.woff2
curl -sA "$UA" "<plex mono 400 latin url>" -o assets/fonts/ibm-plex-mono-400.woff2
curl -sA "$UA" "<plex mono 500 latin url>" -o assets/fonts/ibm-plex-mono-500.woff2
```

Verify every file is a real woff2 (not an error page):

```bash
file assets/fonts/*.woff2 2>/dev/null || ls -la assets/fonts/
```

Expected: 7 files, each > 10 KB. **If any download fails, continue anyway** — the CSS fallback stacks (Task 2) keep the site working; note the failure in the task report.

- [ ] **Step 3: Create `assets/favicon.svg`** (survey-benchmark mark: triangle over circle, accent color)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="36" r="20" fill="none" stroke="#0E7C66" stroke-width="4"/>
  <path d="M32 8 L46 32 H18 Z" fill="#0E7C66"/>
  <circle cx="32" cy="36" r="4" fill="#0E7C66"/>
</svg>
```

- [ ] **Step 4: Create `index.html` skeleton** (complete file; sections are empty shells that later tasks fill between their marker comments)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Akash S — Full-Stack &amp; GIS Developer</title>
  <meta name="description" content="Akash S — full-stack and GIS developer in Chennai, India. I build web-based mapping platforms and spatial data tools.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Akash S — Full-Stack &amp; GIS Developer">
  <meta property="og:description" content="I build web-based mapping platforms and spatial data tools.">
  <meta name="theme-color" content="#F6F7F5">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <script>
    // Theme boot: runs pre-paint so there is no flash of wrong theme.
    (function () {
      var t = localStorage.getItem('theme');
      if (t !== 'light' && t !== 'dark') {
        t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
  <script src="js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#about">Skip to content</a>

  <!-- ===== NAV ===== -->
  <!-- /NAV -->

  <main>
    <!-- ===== HERO ===== -->
    <!-- /HERO -->
    <!-- ===== ABOUT ===== -->
    <section class="section" id="about"></section>
    <!-- /ABOUT -->
    <!-- ===== EXPERIENCE ===== -->
    <section class="section" id="experience"></section>
    <!-- /EXPERIENCE -->
    <!-- ===== PROJECTS ===== -->
    <section class="section" id="projects"></section>
    <!-- /PROJECTS -->
    <!-- ===== SKILLS ===== -->
    <section class="section" id="skills"></section>
    <!-- /SKILLS -->
    <!-- ===== EDUCATION ===== -->
    <section class="section" id="education"></section>
    <!-- /EDUCATION -->
    <!-- ===== CONTACT ===== -->
    <section class="section" id="contact"></section>
    <!-- /CONTACT -->
  </main>

  <!-- ===== FOOTER ===== -->
  <!-- /FOOTER -->
</body>
</html>
```

Also create stub `css/styles.css` containing only `/* Design system arrives in Task 2 */` and stub `js/main.js` containing only `'use strict';`.

- [ ] **Step 5: Start the preview server (leave it running for all tasks)**

```bash
cd /c/Users/FAI-Akash/portfolio && python -m http.server 4173
```

Run in background. Verify:

```bash
curl -s http://localhost:4173/ | grep -c 'id="projects"'
```

Expected output: `1`

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold, self-hosted fonts, HTML skeleton"
```

---

### Task 2: Design system — tokens, base styles, background grid

**Files:**
- Modify: `css/styles.css` (replace stub with the full base layer)

**Interfaces:**
- Produces (fixed API for all later tasks): color tokens `--paper --surface --ink --muted --line --contour --accent --accent-ink --accent-soft --flag`, shadows `--shadow-1 --shadow-2`, radii `--r-s --r-m --r-l`, fonts `--font-display --font-body --font-mono`, layout `--w-max`, and utility classes `.section .section-head .eyebrow .section-title .reveal .in .skip-link`.

- [ ] **Step 1: Write the base layer** (replace `css/styles.css` entirely)

```css
/* ============ Fonts ============ */
@font-face { font-family: "Clash Display"; src: url("../assets/fonts/clash-display-600.woff2") format("woff2"); font-weight: 600; font-display: swap; }
@font-face { font-family: "Clash Display"; src: url("../assets/fonts/clash-display-700.woff2") format("woff2"); font-weight: 700; font-display: swap; }
@font-face { font-family: "Archivo"; src: url("../assets/fonts/archivo-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Archivo"; src: url("../assets/fonts/archivo-500.woff2") format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Archivo"; src: url("../assets/fonts/archivo-600.woff2") format("woff2"); font-weight: 600; font-display: swap; }
@font-face { font-family: "IBM Plex Mono"; src: url("../assets/fonts/ibm-plex-mono-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "IBM Plex Mono"; src: url("../assets/fonts/ibm-plex-mono-500.woff2") format("woff2"); font-weight: 500; font-display: swap; }

/* ============ Tokens ============ */
:root {
  --paper: #F6F7F5;
  --surface: #FFFFFF;
  --ink: #16211E;
  --muted: #5A6963;
  --line: #DFE5E1;
  --contour: #E7ECE8;
  --accent: #0E7C66;
  --accent-ink: #0A5C4C;
  --accent-soft: rgba(14, 124, 102, 0.08);
  --flag: #C97B2D;
  --shadow-1: 0 1px 2px rgba(22,33,30,.05), 0 4px 16px rgba(22,33,30,.06);
  --shadow-2: 0 2px 4px rgba(22,33,30,.07), 0 14px 36px rgba(22,33,30,.11);
  --r-s: 8px; --r-m: 14px; --r-l: 20px;
  --font-display: "Clash Display", "Segoe UI", system-ui, sans-serif;
  --font-body: "Archivo", "Segoe UI", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", Consolas, monospace;
  --w-max: 1100px;
  color-scheme: light;
}
[data-theme="dark"] {
  --paper: #0F1714;
  --surface: #161F1B;
  --ink: #E7EDEA;
  --muted: #93A29B;
  --line: #243029;
  --contour: #1A241F;
  --accent: #57B99D;
  --accent-ink: #79CDB6;
  --accent-soft: rgba(87, 185, 157, 0.10);
  --flag: #D8925B;
  --shadow-1: 0 1px 2px rgba(0,0,0,.35), 0 4px 16px rgba(0,0,0,.35);
  --shadow-2: 0 2px 4px rgba(0,0,0,.4), 0 14px 36px rgba(0,0,0,.5);
  color-scheme: dark;
}
/* No-JS dark fallback: boot script always sets data-theme when JS runs,
   so this only fires when JS is off and the OS prefers dark. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) {
    --paper: #0F1714; --surface: #161F1B; --ink: #E7EDEA; --muted: #93A29B;
    --line: #243029; --contour: #1A241F;
    --accent: #57B99D; --accent-ink: #79CDB6; --accent-soft: rgba(87,185,157,.10);
    --flag: #D8925B;
    --shadow-1: 0 1px 2px rgba(0,0,0,.35), 0 4px 16px rgba(0,0,0,.35);
    --shadow-2: 0 2px 4px rgba(0,0,0,.4), 0 14px 36px rgba(0,0,0,.5);
    color-scheme: dark;
  }
}

/* ============ Reset & base ============ */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--ink);
  background: var(--paper);
  transition: background-color .35s ease, color .35s ease;
}
/* Survey-grid backdrop, faded toward the middle of the page */
body::before {
  content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-image:
    linear-gradient(var(--contour) 1px, transparent 1px),
    linear-gradient(90deg, var(--contour) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.25) 40%, rgba(0,0,0,.55));
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.25) 40%, rgba(0,0,0,.55));
}
img, svg { max-width: 100%; display: block; }
h1, h2, h3 { font-family: var(--font-display); line-height: 1.12; margin: 0 0 .5em; letter-spacing: -0.01em; }
p { margin: 0 0 1em; }
a { color: var(--accent-ink); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover { color: var(--accent); }
::selection { background: var(--accent); color: var(--paper); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }

/* ============ Layout utilities ============ */
.section { max-width: var(--w-max); margin: 0 auto; padding: clamp(4rem, 9vh, 6.5rem) 1.5rem 0; }
.section-head { margin-bottom: 2.25rem; }
.eyebrow {
  font-family: var(--font-mono); font-size: .8125rem; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase; color: var(--accent-ink);
  display: flex; align-items: center; gap: .75rem; margin: 0 0 .6rem;
}
/* contour-tick ornament after the eyebrow */
.eyebrow::after { content: ""; height: 1px; width: 3.5rem; background:
  repeating-linear-gradient(90deg, var(--accent-ink) 0 6px, transparent 6px 10px); }
.section-title { font-size: clamp(1.75rem, 3.5vw, 2.375rem); font-weight: 600; }

.skip-link {
  position: absolute; left: 1rem; top: -3rem; z-index: 100;
  background: var(--accent); color: #fff; padding: .5rem 1rem;
  border-radius: var(--r-s); transition: top .2s ease;
}
.skip-link:focus { top: 1rem; }

/* ============ Scroll reveal (JS adds .in) ============ */
.reveal { opacity: 0; translate: 0 16px; transition: opacity .6s ease, translate .6s ease; }
.reveal.in { opacity: 1; translate: 0 0; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .reveal { opacity: 1; translate: none; }
}
```

Then append at the very end of the file (it must stay last in the cascade; later tasks insert their blocks ABOVE it):

```css
/* ============ No-JS fallback (keep last) ============ */
```

And in `index.html` `<head>`, after the main.js script tag, add:

```html
  <noscript><style>.reveal{opacity:1;translate:none}</style></noscript>
```

- [ ] **Step 2: Verify tokens load and grid renders**

```bash
curl -s http://localhost:4173/css/styles.css | grep -c -- "--accent: #0E7C66"
```

Expected output: `1`. Open `http://localhost:4173` in a browser (or screenshot via browser tooling): faint grid visible, off-white cool background, no console errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: design tokens, two themes, base styles, survey-grid backdrop"
```

---

### Task 3: Glassy nav, theme toggle, mobile menu

**Files:**
- Modify: `index.html` (between `<!-- ===== NAV ===== -->` and `<!-- /NAV -->`), `css/styles.css` (insert above the No-JS block), `js/main.js`

**Interfaces:**
- Consumes: tokens from Task 2.
- Produces: `#themeToggle`, `#navToggle`, `#navLinks` element IDs consumed by `js/main.js`; `.nav-link` + `.active` classes consumed by Task 9's scroll-spy; JS functions stay file-local.

- [ ] **Step 1: Nav HTML** (replace the NAV placeholder region)

```html
  <header class="nav">
    <div class="nav-inner">
      <a class="brand" href="#top" aria-label="Akash S — back to top">
        <svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true" width="26" height="26">
          <circle cx="32" cy="36" r="20" fill="none" stroke="currentColor" stroke-width="4"/>
          <path d="M32 8 L46 32 H18 Z" fill="currentColor"/>
          <circle cx="32" cy="36" r="4" fill="currentColor"/>
        </svg>
        <span>Akash&nbsp;S</span>
      </a>
      <nav aria-label="Section navigation">
        <button id="navToggle" class="nav-toggle" aria-expanded="false" aria-controls="navLinks" aria-label="Menu">
          <span></span><span></span>
        </button>
        <ul id="navLinks" class="nav-links">
          <li><a class="nav-link" href="#about">About</a></li>
          <li><a class="nav-link" href="#experience">Experience</a></li>
          <li><a class="nav-link" href="#projects">Projects</a></li>
          <li><a class="nav-link" href="#skills">Skills</a></li>
          <li><a class="nav-link" href="#education">Education</a></li>
          <li><a class="nav-link" href="#contact">Contact</a></li>
        </ul>
      </nav>
      <button id="themeToggle" class="theme-toggle" aria-label="Switch theme">
        <svg class="icon-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
        </svg>
        <svg class="icon-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>
        </svg>
      </button>
    </div>
  </header>
```

Also add `id="top"` to the `<main>` tag: `<main id="top">`.

- [ ] **Step 2: Nav CSS** (insert above the No-JS block in `styles.css`)

```css
/* ============ Nav ============ */
.nav {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--paper) 72%, transparent);
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}
.nav-inner {
  max-width: var(--w-max); margin: 0 auto; padding: .7rem 1.5rem;
  display: flex; align-items: center; gap: 1rem;
}
.brand {
  display: flex; align-items: center; gap: .55rem; margin-right: auto;
  font-family: var(--font-display); font-weight: 600; font-size: 1.1rem;
  color: var(--ink); text-decoration: none;
}
.brand-mark { color: var(--accent); }
.nav-links { display: flex; gap: .25rem; list-style: none; margin: 0; padding: 0; }
.nav-link {
  display: block; padding: .45rem .8rem; border-radius: var(--r-s);
  font-size: .95rem; font-weight: 500; color: var(--muted); text-decoration: none;
}
.nav-link:hover { color: var(--ink); background: var(--accent-soft); }
.nav-link.active { color: var(--accent-ink); background: var(--accent-soft); }
.theme-toggle, .nav-toggle {
  display: grid; place-items: center; width: 38px; height: 38px;
  border: 1px solid var(--line); border-radius: var(--r-s);
  background: var(--surface); color: var(--ink); cursor: pointer;
}
.theme-toggle:hover, .nav-toggle:hover { border-color: var(--accent); color: var(--accent-ink); }
[data-theme="dark"] .icon-moon { display: none; }
[data-theme="light"] .icon-sun { display: none; }
:root:not([data-theme]) .icon-sun { display: none; } /* no-JS: show moon as inert */
.nav-toggle { display: none; }
.nav-toggle span { display: block; width: 16px; height: 2px; background: currentColor; margin: 2.5px 0; transition: transform .25s ease; }

@media (max-width: 767px) {
  .nav-toggle { display: grid; }
  .nav-links {
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; padding: .75rem 1.25rem 1rem; gap: .15rem;
    background: color-mix(in srgb, var(--paper) 94%, transparent);
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line);
    display: none;
  }
  .nav-links.open { display: flex; }
  .nav-toggle[aria-expanded="true"] span:first-child { transform: translateY(4.5px) rotate(45deg); }
  .nav-toggle[aria-expanded="true"] span:last-child { transform: translateY(-2.5px) rotate(-45deg); }
}
```

- [ ] **Step 3: Toggle JS** (replace `js/main.js` entirely)

```js
'use strict';

// ---- Theme toggle (boot script in <head> already set data-theme) ----
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ---- Mobile menu ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
```

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'id="themeToggle"'
```

Expected: `1`. In a browser: nav is translucent-blurred over the grid; theme button flips light/dark and persists on reload; below 768px the hamburger opens/closes the menu.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: glassy sticky nav with theme toggle and mobile menu"
```

---

### Task 4: Hero with contour-field signature

**Files:**
- Modify: `index.html` (HERO region), `css/styles.css` (insert above No-JS block)

**Interfaces:**
- Consumes: tokens; `.reveal` utility.
- Produces: `.btn .btn-primary .btn-ghost` button classes reused by Task 9 (contact); `.socials` block markup reused by Task 9.

- [ ] **Step 1: Hero HTML** (replace the HERO placeholder region; note `<main id="top">` already set)

```html
    <section class="hero" aria-label="Introduction">
      <svg class="contours" viewBox="0 0 900 640" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="var(--accent)" stroke-width="1.1" opacity="0.5">
          <path pathLength="1" d="M450 320c-140-96-96-208 32-224s272 48 288 160-96 192-208 176-64-40-112-112z"/>
          <path pathLength="1" d="M430 330c-180-110-130-260 40-280s340 60 360 200-120 240-260 220-80-50-140-140z"/>
          <path pathLength="1" d="M410 345c-220-124-164-312 48-336s408 72 432 240-144 288-312 264-96-60-168-168z"/>
          <path pathLength="1" d="M470 310c-100-80-70-156 24-168s204 36 216 120-72 144-156 132-48-30-84-84z"/>
          <path pathLength="1" d="M490 300c-60-56-42-104 16-112s136 24 144 80-48 96-104 88-32-20-56-56z"/>
        </g>
      </svg>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">Chennai, India · 13.0827° N, 80.2707° E</p>
          <h1 class="hero-title">Akash&nbsp;S</h1>
          <p class="hero-role">Full-Stack &amp; GIS Developer</p>
          <p class="hero-sub"><!-- CONTENT-PASS -->[I build web-based mapping platforms and spatial data tools — from CAD-to-web pipelines to map interfaces used by government planners.]</p>
          <div class="cta-row">
            <a class="btn btn-primary" href="#projects">View projects</a>
            <a class="btn btn-ghost" href="assets/resume.pdf" download>Download resume</a>
          </div>
          <ul class="socials" aria-label="Profiles">
            <li><a href="[GITHUB-URL]" aria-label="GitHub"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.38-3.87-1.38-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.04.77 2.1v3.11c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg></a></li>
            <li><a href="[LINKEDIN-URL]" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8.09h4.56V23H.22V8.09Zm7.58 0h4.37v2.04h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 6.99V23h-4.55v-7.21c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V23H7.8V8.09Z"/></svg></a></li>
            <li><a href="mailto:akashcivil04@gmail.com" aria-label="Email"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7L22 7"/></svg></a></li>
          </ul>
        </div>
        <div class="plate" aria-hidden="true">
          <div class="plate-mark">
            <svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="36" r="20" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 10 L44 32 H20 Z" fill="currentColor"/><circle cx="32" cy="36" r="3.5" fill="currentColor"/></svg>
          </div>
          <p class="plate-line">SURVEY REF</p>
          <p class="plate-coord">AS-2026 · GCP-01</p>
          <div class="plate-scale"><span></span><span></span><span></span><span></span></div>
          <p class="plate-line">EST. SCALE 1:CODE</p>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Hero CSS**

```css
/* ============ Hero ============ */
.hero { position: relative; overflow: hidden; }
.contours {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none;
  mask-image: radial-gradient(90% 90% at 70% 40%, rgba(0,0,0,.5), transparent 75%);
  -webkit-mask-image: radial-gradient(90% 90% at 70% 40%, rgba(0,0,0,.5), transparent 75%);
}
.contours path {
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: draw 2.4s ease-out forwards;
}
.contours path:nth-child(2) { animation-delay: .15s; }
.contours path:nth-child(3) { animation-delay: .3s; }
.contours path:nth-child(4) { animation-delay: .45s; }
.contours path:nth-child(5) { animation-delay: .6s; }
@keyframes draw { to { stroke-dashoffset: 0; } }

.hero-inner {
  max-width: var(--w-max); margin: 0 auto;
  padding: clamp(4.5rem, 12vh, 8rem) 1.5rem clamp(3rem, 8vh, 5rem);
  display: grid; grid-template-columns: 1fr auto; gap: 3rem; align-items: center;
  position: relative;
}
.hero-title {
  font-size: clamp(2.9rem, 8vw, 4.9rem); font-weight: 700;
  letter-spacing: -0.02em; margin: .1em 0 .05em;
}
.hero-role {
  font-family: var(--font-display); font-weight: 600;
  font-size: clamp(1.25rem, 2.6vw, 1.6rem); color: var(--accent-ink); margin: 0 0 .9rem;
}
.hero-sub { max-width: 34rem; font-size: 1.125rem; color: var(--muted); }
.cta-row { display: flex; flex-wrap: wrap; gap: .8rem; margin: 1.6rem 0 1.4rem; }
.btn {
  display: inline-block; padding: .7rem 1.35rem; border-radius: var(--r-s);
  font-weight: 600; font-size: .98rem; text-decoration: none;
  transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-ink));
  box-shadow: var(--shadow-1);
}
.btn-primary:hover { box-shadow: var(--shadow-2); color: #fff; }
.btn-ghost { color: var(--ink); border: 1px solid var(--line); background: var(--surface); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent-ink); }
.socials { display: flex; gap: .4rem; list-style: none; margin: 0; padding: 0; }
.socials a {
  display: grid; place-items: center; width: 40px; height: 40px;
  border-radius: var(--r-s); color: var(--muted);
}
.socials a:hover { color: var(--accent-ink); background: var(--accent-soft); }

/* Survey plate */
.plate {
  border: 1px solid var(--line); border-radius: var(--r-m);
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  box-shadow: var(--shadow-1);
  padding: 1.5rem 1.75rem; text-align: center; color: var(--accent-ink);
  display: grid; gap: .45rem; justify-items: center;
}
.plate-line { font-family: var(--font-mono); font-size: .68rem; letter-spacing: .18em; color: var(--muted); margin: 0; }
.plate-coord { font-family: var(--font-mono); font-size: .85rem; font-weight: 500; margin: 0; }
.plate-scale { display: flex; height: 6px; width: 120px; border: 1px solid var(--accent-ink); }
.plate-scale span { flex: 1; }
.plate-scale span:nth-child(odd) { background: var(--accent-ink); }

@media (max-width: 860px) {
  .hero-inner { grid-template-columns: 1fr; }
  .plate { display: none; }
}
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:4173/ | grep -c 'class="contours"'
```

Expected: `1`. In a browser: contour lines draw themselves in over ~2.5s on load (and do NOT animate when the OS reduce-motion setting is on — Task 2's media query covers this since the animation is CSS); hero text left, survey plate right; plate hidden on narrow viewport.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: hero with animated contour-field signature and survey plate"
```

---

### Task 5: About + facts panel

**Files:**
- Modify: `index.html` (ABOUT region), `css/styles.css`

**Interfaces:** consumes tokens/utilities only; produces nothing later tasks need.

- [ ] **Step 1: About HTML** (fill `<section class="section" id="about">`; add `reveal` class to the section tag: `<section class="section reveal" id="about">`)

```html
      <div class="section-head">
        <p class="eyebrow">About</p>
        <h2 class="section-title">From ground surveys to web maps</h2>
      </div>
      <div class="about-grid">
        <div class="about-text">
          <p><!-- CONTENT-PASS -->[I started in civil engineering and found my way into software through the maps — first drafting them, then building the platforms that serve them. Today I work across the stack: React map interfaces on the front, Python services and spatial data pipelines behind them.]</p>
          <p><!-- CONTENT-PASS -->[What I enjoy most is the unglamorous middle of the problem: getting a 6,000-feature layer to render smoothly, or turning a messy CAD drawing into clean web geometry.]</p>
        </div>
        <dl class="facts">
          <div class="fact"><dt>Location</dt><dd>Chennai, India</dd></div>
          <div class="fact"><dt>Current role</dt><dd>[Software Engineer, FarmwiseAI]</dd></div>
          <div class="fact"><dt>Languages</dt><dd>[English, Tamil]</dd></div>
          <div class="fact"><dt>Email</dt><dd><a href="mailto:akashcivil04@gmail.com">akashcivil04@gmail.com</a></dd></div>
        </dl>
      </div>
```

- [ ] **Step 2: About CSS**

```css
/* ============ About ============ */
.about-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 3rem; align-items: start; }
.about-text p { max-width: 38rem; }
.facts {
  margin: 0; border: 1px solid var(--line); border-radius: var(--r-m);
  background: var(--surface); box-shadow: var(--shadow-1); padding: .5rem 1.4rem;
}
.fact { display: flex; justify-content: space-between; gap: 1rem; padding: .85rem 0; }
.fact + .fact { border-top: 1px dashed var(--line); }
.fact dt { font-family: var(--font-mono); font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.fact dd { margin: 0; font-weight: 500; text-align: right; }
@media (max-width: 767px) { .about-grid { grid-template-columns: 1fr; gap: 1.5rem; } }
```

- [ ] **Step 3: Verify** — `curl -s http://localhost:4173/ | grep -c 'class="facts"'` → `1`; visually: two-column about with facts card, stacking on mobile.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: about section with facts panel"`

---

### Task 6: Experience timeline

**Files:**
- Modify: `index.html` (EXPERIENCE region), `css/styles.css`

**Interfaces:** consumes tokens/utilities. The `--flag` token marks the current position's node.

- [ ] **Step 1: Experience HTML** (fill the section; add `reveal` to its class)

```html
      <div class="section-head">
        <p class="eyebrow">Experience</p>
        <h2 class="section-title">Where I've worked</h2>
      </div>
      <ol class="timeline">
        <li class="t-item t-current">
          <p class="t-date">[2024] — Present</p>
          <h3 class="t-role">[Software Engineer]</h3>
          <p class="t-org">FarmwiseAI · Chennai</p>
          <ul class="t-points">
            <li><!-- CONTENT-PASS -->[Built a web-based GIS platform for a government transport authority — React/Leaflet front end with a Python backend serving spatial layers, used by planners to review land-parcel layouts.]</li>
            <li><!-- CONTENT-PASS -->[Engineered a CAD-to-web pipeline converting DWG/DXF drawings into cached SVG map layers, including failure recovery around an unreliable converter toolchain.]</li>
            <li><!-- CONTENT-PASS -->[Optimized canvas rendering to keep 6,000+ polygon features interactive, with clustering, labeling, and classification logic.]</li>
          </ul>
        </li>
        <li class="t-item">
          <p class="t-date">[YEAR — YEAR]</p>
          <h3 class="t-role">[Earlier role — add from resume]</h3>
          <p class="t-org">[Organization · City]</p>
          <ul class="t-points">
            <li><!-- CONTENT-PASS -->[Impact bullet from resume.]</li>
            <li><!-- CONTENT-PASS -->[Impact bullet from resume.]</li>
          </ul>
        </li>
      </ol>
```

- [ ] **Step 2: Timeline CSS**

```css
/* ============ Experience timeline ============ */
.timeline { list-style: none; margin: 0; padding: 0; position: relative; }
.timeline::before {
  content: ""; position: absolute; left: 7px; top: 6px; bottom: 6px; width: 2px;
  background: repeating-linear-gradient(180deg, var(--line) 0 8px, transparent 8px 13px);
}
.t-item { position: relative; padding: 0 0 2.4rem 2.2rem; }
.t-item:last-child { padding-bottom: .5rem; }
.t-item::before {
  content: ""; position: absolute; left: 0; top: 6px; width: 12px; height: 12px;
  border-radius: 50%; background: var(--paper); border: 3px solid var(--accent);
}
.t-current::before { border-color: var(--flag); }
.t-date { font-family: var(--font-mono); font-size: .82rem; color: var(--muted); margin: 0 0 .2rem; }
.t-role { font-size: 1.3rem; font-weight: 600; margin: 0 0 .1rem; }
.t-org { font-weight: 500; color: var(--accent-ink); margin: 0 0 .7rem; }
.t-points { margin: 0; padding-left: 1.1rem; }
.t-points li { margin-bottom: .45rem; color: var(--muted); }
.t-points li::marker { color: var(--accent); }
```

- [ ] **Step 3: Verify** — `curl -s http://localhost:4173/ | grep -c 'class="timeline"'` → `1`; visually: dashed survey-line spine, teal nodes, amber node on current role.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: experience timeline"`

---

### Task 7: Projects — expandable cards

**Files:**
- Modify: `index.html` (PROJECTS region), `css/styles.css`

**Interfaces:**
- Consumes: tokens, `.tags`/`.tag` are defined HERE and reused by nothing else (skills uses `.chip`).
- Produces: native `<details class="project">` markup — no JS required (Global Constraint: readable without JS is satisfied natively).

- [ ] **Step 1: Projects HTML** (fill the section; add `reveal`)

```html
      <div class="section-head">
        <p class="eyebrow">Projects</p>
        <h2 class="section-title">Selected work</h2>
      </div>
      <div class="projects-grid">
        <details class="project featured">
          <summary class="project-face">
            <span class="p-head">
              <span class="p-name">Government WebGIS Platform</span>
              <span class="p-one">Map review portal for a metropolitan transport authority — parcel layouts, CAD overlays, measurement tools.</span>
            </span>
            <span class="tags"><span class="tag">React</span><span class="tag">Leaflet</span><span class="tag">Python</span><span class="tag">PostGIS</span></span>
          </summary>
          <div class="project-body">
            <div class="p-block"><h4>The problem</h4><p><!-- CONTENT-PASS -->[Planners reviewed land-parcel layouts on paper and desktop CAD — slow to share, impossible to search, disconnected from base maps.]</p></div>
            <div class="p-block"><h4>What I built</h4><p><!-- CONTENT-PASS -->[A single-view web platform: layered map viewer with 6,000+ interactive plot features, DWG/DXF-to-SVG ingestion, measurement and comparison tools, role-based access, and a review mode for stakeholders.]</p></div>
            <div class="p-block"><h4>My role</h4><p><!-- CONTENT-PASS -->[End-to-end developer — frontend map UI, backend services, data pipeline, and deployment packaging.]</p></div>
            <p class="p-note">Built for a government client — code and live site are private.</p>
          </div>
        </details>

        <details class="project">
          <summary class="project-face">
            <span class="p-head">
              <span class="p-name">[Urban Heat Dashboard]</span>
              <span class="p-one"><!-- CONTENT-PASS -->[One-line description — what it shows and for whom.]</span>
            </span>
            <span class="tags"><span class="tag">[Python]</span><span class="tag">[GIS]</span></span>
          </summary>
          <div class="project-body">
            <div class="p-block"><h4>The problem</h4><p><!-- CONTENT-PASS -->[…]</p></div>
            <div class="p-block"><h4>What I built</h4><p><!-- CONTENT-PASS -->[…]</p></div>
            <div class="p-block"><h4>My role</h4><p><!-- CONTENT-PASS -->[…]</p></div>
            <p class="p-links"><a href="[GITHUB-REPO-URL]">Source ↗</a></p>
          </div>
        </details>

        <details class="project">
          <summary class="project-face">
            <span class="p-head">
              <span class="p-name">[QGIS AI Segmentation]</span>
              <span class="p-one"><!-- CONTENT-PASS -->[One-line description.]</span>
            </span>
            <span class="tags"><span class="tag">[QGIS]</span><span class="tag">[ML]</span></span>
          </summary>
          <div class="project-body">
            <div class="p-block"><h4>The problem</h4><p><!-- CONTENT-PASS -->[…]</p></div>
            <div class="p-block"><h4>What I built</h4><p><!-- CONTENT-PASS -->[…]</p></div>
            <div class="p-block"><h4>My role</h4><p><!-- CONTENT-PASS -->[…]</p></div>
            <p class="p-links"><a href="[GITHUB-REPO-URL]">Source ↗</a></p>
          </div>
        </details>
      </div>
```

- [ ] **Step 2: Projects CSS**

```css
/* ============ Projects ============ */
.projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.project { grid-column: span 1; border: 1px solid var(--line); border-radius: var(--r-m);
  background: var(--surface); box-shadow: var(--shadow-1); overflow: hidden;
  transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease; }
.project:hover { box-shadow: var(--shadow-2); transform: translateY(-2px); border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); }
.project.featured { grid-column: 1 / -1; }
.project-face { list-style: none; cursor: pointer; padding: 1.4rem 1.6rem; display: grid; gap: .9rem; position: relative; }
.project-face::-webkit-details-marker { display: none; }
.project-face::after {
  content: ""; position: absolute; right: 1.5rem; top: 1.7rem;
  width: 9px; height: 9px; border-right: 2px solid var(--muted); border-bottom: 2px solid var(--muted);
  transform: rotate(45deg); transition: transform .25s ease;
}
.project[open] .project-face::after { transform: rotate(225deg) translate(-2px, -2px); }
.p-head { display: grid; gap: .3rem; padding-right: 2rem; }
.p-name { font-family: var(--font-display); font-weight: 600; font-size: 1.22rem; }
.p-one { color: var(--muted); font-size: .98rem; }
.tags { display: flex; flex-wrap: wrap; gap: .4rem; }
.tag {
  font-family: var(--font-mono); font-size: .72rem; letter-spacing: .04em;
  padding: .22rem .55rem; border-radius: 999px;
  background: var(--accent-soft); color: var(--accent-ink);
}
.project-body { padding: 0 1.6rem 1.5rem; border-top: 1px dashed var(--line); }
.project[open] .project-body { animation: body-in .3s ease; }
@keyframes body-in { from { opacity: 0; translate: 0 -6px; } to { opacity: 1; translate: 0 0; } }
.p-block h4 {
  font-family: var(--font-mono); font-size: .75rem; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase; color: var(--accent-ink);
  margin: 1.3rem 0 .3rem;
}
.p-block p { margin: 0; color: var(--muted); }
.p-note { font-size: .88rem; color: var(--muted); font-style: italic; margin: 1.2rem 0 0; }
.p-links { margin: 1.2rem 0 0; }
@media (max-width: 767px) { .projects-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verify** — `curl -s http://localhost:4173/ | grep -c '<details class="project'` → `3`. Visually: featured card spans full width; cards expand/collapse on click AND with Enter/Space when the summary is focused (native `<details>` behavior); chevron rotates.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: expandable project cards with featured WebGIS case study"`

---

### Task 8: Skills legend + education cards

**Files:**
- Modify: `index.html` (SKILLS and EDUCATION regions), `css/styles.css`

**Interfaces:** consumes tokens/utilities.

- [ ] **Step 1: Skills HTML** (fill the section; add `reveal`; skill lists are drawn from known work — confirm in content pass)

```html
      <div class="section-head">
        <p class="eyebrow">Skills</p>
        <h2 class="section-title">Map legend</h2>
      </div>
      <div class="legend">
        <div class="legend-group">
          <h3>Languages</h3>
          <ul class="chips"><li class="chip">Python</li><li class="chip">JavaScript</li><li class="chip">SQL</li><li class="chip">[HTML/CSS]</li></ul>
        </div>
        <div class="legend-group">
          <h3>Frontend</h3>
          <ul class="chips"><li class="chip">React</li><li class="chip">Leaflet</li><li class="chip">Vite</li><li class="chip">[Canvas API]</li></ul>
        </div>
        <div class="legend-group">
          <h3>Backend</h3>
          <ul class="chips"><li class="chip">[FastAPI/Flask]</li><li class="chip">REST APIs</li><li class="chip">JWT auth</li><li class="chip">[PostgreSQL]</li></ul>
        </div>
        <div class="legend-group">
          <h3>GIS &amp; Data</h3>
          <ul class="chips"><li class="chip">QGIS</li><li class="chip">PostGIS</li><li class="chip">GeoJSON</li><li class="chip">DWG/DXF pipelines</li></ul>
        </div>
        <div class="legend-group">
          <h3>Tools</h3>
          <ul class="chips"><li class="chip">Git</li><li class="chip">[AWS]</li><li class="chip">[Docker]</li><li class="chip">Claude Code</li></ul>
        </div>
      </div>
```

- [ ] **Step 2: Education HTML** (fill the section; add `reveal`)

```html
      <div class="section-head">
        <p class="eyebrow">Education</p>
        <h2 class="section-title">Where I studied</h2>
      </div>
      <div class="edu-grid">
        <div class="edu-card">
          <p class="edu-years">[YEAR — YEAR]</p>
          <h3 class="edu-degree">[B.E. Civil Engineering]</h3>
          <p class="edu-inst">[Institution name, City]</p>
          <p class="edu-note"><!-- CONTENT-PASS -->[Optional: CGPA, final-year project, or notable achievement.]</p>
        </div>
      </div>
```

- [ ] **Step 3: Skills + education CSS**

```css
/* ============ Skills legend ============ */
.legend {
  border: 1px solid var(--line); border-radius: var(--r-m); background: var(--surface);
  box-shadow: var(--shadow-1); padding: 1.75rem;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1.75rem 2rem;
}
.legend-group h3 {
  font-family: var(--font-mono); font-size: .75rem; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
  margin: 0 0 .7rem; padding-bottom: .45rem; border-bottom: 1px dashed var(--line);
}
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: .45rem; }
.chip {
  font-size: .9rem; font-weight: 500; padding: .3rem .7rem;
  border: 1px solid var(--line); border-radius: 999px; background: var(--paper);
}
.chip:hover { border-color: var(--accent); color: var(--accent-ink); }

/* ============ Education ============ */
.edu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
.edu-card {
  border: 1px solid var(--line); border-left: 3px solid var(--accent);
  border-radius: var(--r-m); background: var(--surface); box-shadow: var(--shadow-1);
  padding: 1.4rem 1.6rem;
}
.edu-years { font-family: var(--font-mono); font-size: .82rem; color: var(--muted); margin: 0 0 .3rem; }
.edu-degree { font-size: 1.15rem; margin: 0 0 .15rem; }
.edu-inst { color: var(--accent-ink); font-weight: 500; margin: 0 0 .5rem; }
.edu-note { color: var(--muted); font-size: .95rem; margin: 0; }
```

- [ ] **Step 4: Verify** — `curl -s http://localhost:4173/ | grep -c 'class="legend-group"'` → `5`; visually: one legend card with 5 grouped columns collapsing gracefully; education card with accent left rule.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: skills legend and education cards"`

---

### Task 9: Contact, footer, scroll-spy, scroll-reveal

**Files:**
- Modify: `index.html` (CONTACT + FOOTER regions), `css/styles.css`, `js/main.js` (append)

**Interfaces:**
- Consumes: `.nav-link`/`.active` (Task 3), `.reveal`/`.in` (Task 2), `.btn` classes (Task 4), section IDs.

- [ ] **Step 1: Contact + footer HTML**

Contact (fill the section; add `reveal`):

```html
      <div class="section-head">
        <p class="eyebrow">Contact</p>
        <h2 class="section-title">Get in touch</h2>
      </div>
      <div class="contact-box">
        <p class="contact-lead">Have a role, a mapping problem, or just want to talk GIS on the web? My inbox is open.</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="mailto:akashcivil04@gmail.com">Email me</a>
          <a class="btn btn-ghost" href="assets/resume.pdf" download>Download resume</a>
        </div>
        <p class="contact-alt">Or find me on <a href="[LINKEDIN-URL]">LinkedIn</a> and <a href="[GITHUB-URL]">GitHub</a>.</p>
      </div>
```

Footer (replace the FOOTER placeholder region):

```html
  <footer class="footer">
    <p>Built by Akash S · <span id="year"></span></p>
    <p class="footer-mono">13.0827° N, 80.2707° E</p>
  </footer>
```

- [ ] **Step 2: Contact + footer CSS**

```css
/* ============ Contact & footer ============ */
.contact-box {
  border: 1px solid var(--line); border-radius: var(--r-l); background: var(--surface);
  box-shadow: var(--shadow-1); padding: clamp(1.75rem, 4vw, 3rem); text-align: center;
}
.contact-lead { font-size: 1.15rem; max-width: 32rem; margin: 0 auto .5rem; }
.contact-box .cta-row { justify-content: center; }
.contact-alt { color: var(--muted); margin: 0; }
.footer {
  max-width: var(--w-max); margin: 0 auto; padding: 3rem 1.5rem 2rem;
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  color: var(--muted); font-size: .9rem;
}
.footer p { margin: 0; }
.footer-mono { font-family: var(--font-mono); font-size: .8rem; }
```

- [ ] **Step 3: Append scroll-spy + reveal + year to `js/main.js`**

```js
// ---- Footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---- Scroll spy: highlight the nav link of the section in view ----
const spyLinks = new Map(
  [...document.querySelectorAll('.nav-link')].map((a) => [a.getAttribute('href').slice(1), a])
);
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = spyLinks.get(entry.target.id);
    if (!link) return;
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link.active').forEach((el) => el.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spyObserver.observe(s));
```

- [ ] **Step 4: Verify** — `curl -s http://localhost:4173/ | grep -c 'class="footer"'` → `1`. In a browser: sections fade up once as they enter the viewport; the nav link for the section in view is highlighted while scrolling; footer year shows 2026.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: contact, footer, scroll-spy and reveal"`

---

### Task 10: 404 page + placeholder resume + README polish

**Files:**
- Create: `404.html`, `assets/resume.pdf` (placeholder), Modify: `README.md`

**Interfaces:** consumes the full stylesheet.

- [ ] **Step 1: Create `404.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Off the map — Akash S</title>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <script>
    (function () {
      var t = localStorage.getItem('theme');
      if (t !== 'light' && t !== 'dark') { t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
</head>
<body>
  <main class="section" style="text-align:center; padding-top:18vh;">
    <p class="eyebrow" style="justify-content:center;">404 · Uncharted</p>
    <h1 class="section-title">This page is off the map</h1>
    <p style="color:var(--muted);">The coordinates you followed don't resolve to anything here.</p>
    <p><a class="btn btn-primary" href="/">Back to the site</a></p>
  </main>
</body>
</html>
```

- [ ] **Step 2: Placeholder resume** — create a one-line text placeholder so the download links don't 404 before the content pass:

```bash
python -c "print('Placeholder — real resume generated during content pass.')" > assets/resume-placeholder.txt
```

Then point BOTH resume buttons (hero + contact) at nothing yet? No — keep them working: temporarily change both `href="assets/resume.pdf"` to `href="assets/resume-placeholder.txt"` and add `<!-- CONTENT-PASS: swap back to resume.pdf -->` beside each. (The content pass, Task 12, generates the real `resume.pdf` and swaps the hrefs back.)

- [ ] **Step 3: Verify** — `curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/404.html` → `200`; `curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/assets/resume-placeholder.txt` → `200`.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: 404 page and placeholder resume target"`

---

### Task 11: Full verification pass

**Files:** none created — this task validates and fixes.

- [ ] **Step 1: Responsive sweep** — with browser tooling (Chrome DevTools MCP or Playwright), screenshot `http://localhost:4173` at widths 360, 768, 1024, 1440. Check: no horizontal scrollbar, nav collapses at <768, hero plate hidden at <860, project grid single-column at <768.
- [ ] **Step 2: Theme sweep** — toggle to dark, screenshot hero + projects. Check: readable contrast everywhere, grid backdrop visible but quiet, chips/cards keep definition. Reload page — theme persists.
- [ ] **Step 3: Keyboard walkthrough** — Tab from page top: skip-link appears first; every nav link, button, social icon, and project summary is reachable with a visible focus ring; Enter toggles a focused project card.
- [ ] **Step 4: No-JS check** — in DevTools, disable JavaScript, reload: all content visible (reveal elements not hidden), project cards still expand, dark OS preference still respected.
- [ ] **Step 5: Lighthouse** — run a Lighthouse audit (Chrome DevTools MCP `lighthouse_audit`, or DevTools manually) on `http://localhost:4173`. Target ≥95 on Performance, Accessibility, Best Practices, SEO. Fix anything below target (common: missing meta, contrast, unlabeled buttons).
- [ ] **Step 6: Fix-and-commit** — apply any fixes found; `git add -A && git commit -m "fix: verification pass adjustments"`. If nothing to fix, skip the commit and record "clean pass".

---

### Task 12: Content pass (INTERACTIVE — requires Akash, do not dispatch to a subagent)

**Files:**
- Modify: `index.html` (all `[BRACKETED]` + `<!-- CONTENT-PASS -->` slots), Create: `assets/resume.pdf`, possibly `assets/profile.jpg`

- [ ] **Step 1: Intake** — ask Akash for: the resume file (any format), GitHub URL, LinkedIn URL, education details, earlier roles, project confirmations (urban-heat-dashboard, QGIS AI segmentation — real names/descriptions/repos), languages, current job title + start year, and whether he has a profile photo. Read the resume with the appropriate parser.
- [ ] **Step 2: Rewrite every placeholder** — replace all bracketed text and CONTENT-PASS slots with confirmed, first-person, impact-focused copy. Verify zero remaining placeholders:

```bash
grep -c "CONTENT-PASS\|\[GITHUB-URL\]\|\[LINKEDIN-URL\]" index.html
```

Expected output: `0`

- [ ] **Step 3: NDA screen** — re-read the WebGIS card and experience bullets: no client-identifying details beyond what Akash approves, no live URLs, no screenshots unless cleared.
- [ ] **Step 4: Generate `assets/resume.pdf`** — build a minimal `resume.html` (reuse tokens inline, print-friendly single column) from the confirmed content, then:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="C:\\Users\\FAI-Akash\\portfolio\\assets\\resume.pdf" "http://localhost:4173/resume.html"
```

Swap both resume button hrefs back to `assets/resume.pdf`; delete `assets/resume-placeholder.txt`; decide with Akash whether `resume.html` stays in the repo or is deleted after PDF generation.

- [ ] **Step 5: Final review with Akash in the browser, fix nits, commit**

```bash
git add -A && git commit -m "feat: real content pass — copy, links, education, resume PDF"
```

---

## Self-Review (completed)

- **Spec coverage:** every spec section maps to a task — architecture/§4 → Tasks 3–9; design system/§5 → Task 2 (+4 signature); interactivity/§6 → Tasks 3, 7 (native details), 9; content plan/§7 → Task 12; verification/§9 → Task 11; 404/OG/favicon → Tasks 1, 10. GitHub Pages deploy is explicitly out of scope per spec §8.
- **Placeholder scan:** the `[BRACKETED]` items inside HTML are *deliberate content slots* consumed by Task 12 — they are product features of this plan, not plan gaps. No TBD/TODO remain in instructions themselves.
- **Type consistency:** token names, section IDs, element IDs (`themeToggle`, `navToggle`, `navLinks`, `year`), and class names cross-checked between Tasks 2/3/4/9 — consistent.
