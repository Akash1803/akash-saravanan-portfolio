# Portfolio Website — Design Spec

**Date:** 2026-07-06
**Status:** Approved design, pending implementation plan
**Owner:** Akash (FarmwiseAI — Full-Stack / GIS Developer)

## 1. Purpose & success criteria

A personal portfolio serving two goals at once: an evergreen professional
home page and a job-application asset for recruiters.

Success looks like:

- A recruiter understands who Akash is within 10 seconds of landing.
- Loads near-instantly; Lighthouse 95+ in all four categories.
- Reads cleanly from a 360px phone to a 1440px desktop.
- Visually polished and mature — elevated minimal, not template-y.
- Content is easy for Akash to update later by editing readable HTML.

## 2. Scope

**In scope:** one static single-page website + local git repo + a
refreshed resume PDF produced during the content pass.

**Out of scope (deferred):** GitHub Pages deployment (build now, deploy
in a later session), blog, contact form/backend, custom domain,
migration to React/Next (only if the static site is ever outgrown).

## 3. Technology & structure

Static site, no frameworks, no build step. Content lives directly in
semantic HTML; JavaScript is used only for interactivity, so the page
stays fully readable with JS disabled.

```
C:\Users\FAI-Akash\portfolio\
├── index.html        ← all content, clear section comments
├── css\styles.css    ← design tokens, themes, all section styles
├── js\main.js        ← ~150 lines: interactivity only
├── assets\
│   ├── resume.pdf    ← refreshed resume (download button target)
│   ├── profile.jpg   ← optional; monogram fallback if absent
│   └── projects\     ← project screenshots
├── docs\superpowers\specs\   ← this spec + future specs
└── README.md         ← how-to-update-content notes for future Akash
```

## 4. Page architecture (final order, top to bottom)

1. **Sticky nav** — name/monogram left; anchor links (About ·
   Experience · Projects · Skills · Education · Contact) right; theme
   toggle. Glassy (translucent + backdrop blur). Scroll-spy highlights
   the active section. Hamburger menu below ~768px.
2. **Hero / self-intro** — name large, role headline (e.g. "Full-Stack
   & GIS Developer"), 2-line value statement, location. CTAs: **View
   Projects** + **Download Resume**. Social icons: GitHub, LinkedIn,
   email (mailto).
3. **About + basic details** — short first-person narrative beside a
   compact facts panel (location, languages, current role, email).
4. **Experience** — vertical timeline: role, company, period, 3–4
   impact-statement bullets each ("built X that did Y"), not duty lists.
5. **Projects** — responsive card grid. Card: name, one-liner, tech
   tags, GitHub/live links. Clicking expands an accessible inline
   detail panel/modal: problem → what was built → specific role →
   screenshot. The flagship work project may get a larger featured card.
6. **Skills grid** — tag chips grouped by category (Languages ·
   Frontend · Backend · GIS/Data · Tools). No skill-percentage bars.
7. **Education** — compact cards: degree, institution, years, notable
   coursework/achievements.
8. **Contact** — invitation line + email button, LinkedIn, GitHub;
   repeat resume download.
9. **Footer** — small: "Built by Akash" + year.

## 5. Design system — "elevated minimal"

Clean minimal foundation with deliberate visual richness. Professional
enough for recruiters, distinctive enough to be memorable.

- **Typography:** one distinctive display font for headings + clean
  body font. Self-hosted or system-stack fallback — no layout-shifting
  webfont loads. Strict type scale, generous line-height.
- **Color:** near-neutral base, one confident accent. Light + dark
  themes via CSS custom properties; defaults to `prefers-color-scheme`,
  manual toggle persists in `localStorage`.
- **Richness touches:** glassy sticky nav, subtle gradient accents on
  hero/CTAs, quiet background texture (fine grid or map-contour lines —
  a nod to GIS work), consistent shadow/radius system.
- **Motion:** soft scroll-reveal of sections, gentle hover lifts,
  smooth theme transition — all gated behind `prefers-reduced-motion`.
- **Maturity details:** favicon, Open Graph + social-preview tags,
  custom selection color, `:focus-visible` styles, 404 page, semantic
  landmarks and heading hierarchy.

## 6. Interactivity (`js/main.js`)

- Theme toggle with `localStorage` persistence.
- Mobile nav open/close.
- Project card expand/collapse — keyboard operable, correct ARIA
  (`aria-expanded`, focus management).
- Scroll-spy nav highlight + scroll-reveal via `IntersectionObserver`.
- Graceful no-JS fallback: all project detail content visible statically.

## 7. Content plan (industry standard)

- **Source:** Akash's current resume (outdated) as the skeleton; a
  short section-by-section interview fills gaps and updates stale facts.
  The refreshed facts also regenerate `assets/resume.pdf`.
- **Voice:** confident first-person ("I build…"), impact-focused
  bullets with concrete numbers where possible.
- **Work-project confidentiality:** the CUMTA WebGIS platform is a
  government client project. Describe role, stack, scale, and
  engineering challenges (e.g. large-feature map rendering, CAD/GIS
  pipelines) — no client-confidential specifics, no live links, no
  restricted screenshots unless cleared.
- **Photo:** professional photo if Akash has one he likes; otherwise a
  styled monogram/initials mark.

## 8. Repository & deployment

- Local git repo at `C:\Users\FAI-Akash\portfolio` (created).
- **Deploy later:** GitHub Pages wiring (personal account, repo name,
  username) is a separate future step. The site must run perfectly by
  opening `index.html` locally or via any static file server.

## 9. Verification

- Responsive pass at 360 / 768 / 1024 / 1440 px.
- Keyboard-only navigation walkthrough (nav, cards, toggle).
- Both themes visually checked; toggle persistence verified.
- Lighthouse audit — target 95+ (Performance, Accessibility, Best
  Practices, SEO).
- All links resolve; resume PDF downloads; social-preview tags render.

## 10. Decisions log

| Decision | Choice |
|---|---|
| Purpose | Professional presence + job applications |
| Format | Single-page static site (HTML/CSS/JS, no build step) |
| Structure | Semantic HTML + separate CSS/JS; content in HTML |
| Section order | Hero → About → Experience → Projects → Skills → Education → Contact |
| Projects UI | Cards + expandable detail |
| Theme | Light + dark, system default, persisted toggle |
| Design | Elevated minimal (glassy nav, subtle gradients, quiet texture) |
| Contact | Direct links (mailto, LinkedIn, GitHub) — no form |
| Hosting | GitHub Pages eventually; build-only for now |
| Folder | `C:\Users\FAI-Akash\portfolio` |
| Content | Resume as base + interview; first-person; NDA-safe work descriptions |
