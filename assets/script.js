'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigazione');
const menuLinks = [...navigation.querySelectorAll('a')];

function setMenu(open, returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (!open && returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});
menuLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', event => {
  if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') setMenu(false, true);
  if (event.key === 'Tab') {
    const first = menuToggle;
    const last = menuLinks[menuLinks.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const mobileQuery = window.matchMedia('(max-width: 800px)');
mobileQuery.addEventListener('change', event => { if (!event.matches) setMenu(false); });

// Il contenuto resta leggibile anche senza JavaScript. La navigazione viene
// evidenziata solo quando la relativa sezione entra nell’area centrale.
const sectionLinks = menuLinks.filter(link => link.getAttribute('href').startsWith('#'));
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) sectionLinks.forEach(link => link.removeAttribute('aria-current'));
  }, { threshold: 0.5 });
  heroObserver.observe(document.querySelector('#inizio'));
}

document.querySelector('#copyright-year').textContent = new Date().getFullYear();
