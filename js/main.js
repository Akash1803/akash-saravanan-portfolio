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

// ---- Footer year (only if a #year span is present) ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Scroll reveal (mark ready so the head failsafe stands down) ----
window.__revealReady = true;
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

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
