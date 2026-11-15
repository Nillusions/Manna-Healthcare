/**
 * Manna Home Care: navigation
 * Mobile menu (accessible toggle, focus handling, Escape to close),
 * header scroll state and services jump-nav highlighting.
 */
(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const desktopQuery = window.matchMedia('(min-width: 1024px)');

  /* ---------- Mobile menu ---------- */
  const focusableSelector = 'a[href], button:not([disabled])';

  const isOpen = () => toggle && toggle.getAttribute('aria-expanded') === 'true';

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
    document.dispatchEvent(new CustomEvent('manna:menu', { detail: { open: true } }));
    const first = nav.querySelector(focusableSelector);
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu({ returnFocus = true } = {}) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    document.dispatchEvent(new CustomEvent('manna:menu', { detail: { open: false } }));
    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

    // Close when a link inside the menu is followed (e.g. same-page anchors)
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a') && isOpen()) closeMenu({ returnFocus: false });
    });

    document.addEventListener('keydown', (event) => {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      // Keep keyboard focus inside the open menu (toggle + menu items)
      if (event.key === 'Tab') {
        const items = [toggle, ...nav.querySelectorAll(focusableSelector)];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // Reset state when moving up to the desktop layout
    desktopQuery.addEventListener('change', (e) => {
      if (e.matches && isOpen()) closeMenu({ returnFocus: false });
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Services page: highlight current section in jump nav ---------- */
  const jumpLinks = document.querySelectorAll('.jump-nav__list a');
  if (jumpLinks.length && 'IntersectionObserver' in window) {
    const linkFor = new Map();
    jumpLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) linkFor.set(section, link);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          jumpLinks.forEach((l) => {
            l.classList.remove('is-active');
            l.removeAttribute('aria-current');
          });
          const active = linkFor.get(entry.target);
          if (active) {
            active.classList.add('is-active');
            active.setAttribute('aria-current', 'true');
            // keep the active pill in view on small screens without moving the page
            const list = active.parentElement.parentElement;
            const left = active.offsetLeft - list.clientWidth / 2 + active.clientWidth / 2;
            list.scrollTo({ left, behavior: 'smooth' });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    linkFor.forEach((_, section) => observer.observe(section));
  }
})();
