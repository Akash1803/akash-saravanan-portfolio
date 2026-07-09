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

// ---- Contact form (posts to Web3Forms; no backend needed) ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = contactForm.querySelector('button[type="submit"]');
    status.style.color = 'var(--accent-ink)';
    status.textContent = 'Sending…';
    if (btn) btn.disabled = true;
    fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm)
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success === true || String(data.success) === 'true') {
          status.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
          contactForm.reset();
        } else {
          status.style.color = 'var(--flag)';
          status.textContent = 'Something went wrong. Please email me directly at akashcivil04@gmail.com.';
        }
      })
      .catch(() => {
        status.style.color = 'var(--flag)';
        status.textContent = 'Network error. Please email me directly at akashcivil04@gmail.com.';
      })
      .finally(() => { if (btn) btn.disabled = false; });
  });
}

// ---- Hero photo: show the monogram if the image is missing ----
const heroImg = document.querySelector('.hero-photo img');
if (heroImg) {
  const showMonogram = () => {
    heroImg.style.display = 'none';
    const mono = document.querySelector('.hero-monogram');
    if (mono) mono.style.display = 'grid';
  };
  heroImg.addEventListener('error', showMonogram);
  if (heroImg.complete && heroImg.naturalWidth === 0) showMonogram();
}
