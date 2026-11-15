/**
 * Manna Home Care: GSAP animations
 * Subtle, purposeful motion. No scroll hijacking.
 * - Respects prefers-reduced-motion (nothing is hidden or animated)
 * - If GSAP fails to load, all content stays visible
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (!hasGsap || reduceMotion) {
    root.classList.remove('gsap-on');
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.8 });

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const distance = isMobile ? 18 : 28;

  /* ---------- Hero entrance ---------- */
  const heroItems = gsap.utils.toArray('[data-hero]');
  if (heroItems.length) {
    const tl = gsap.timeline({ delay: 0.05 });
    tl.fromTo(
      heroItems,
      { opacity: 0, y: distance },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }
    );

    const frame = document.querySelector('[data-hero-frame]');
    if (frame) {
      tl.fromTo(
        frame,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        0.1
      );
      const img = frame.querySelector('img');
      if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0.1);
    }

  }

  /* ---------- Scroll reveals (headings, cards, lists) ---------- */
  ScrollTrigger.batch('[data-reveal]:not([data-hero]):not([data-hero-frame])', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: distance },
        { opacity: 1, y: 0, stagger: 0.1, overwrite: true, clearProps: 'transform' }
      ),
  });

  /* ---------- Subtle image parallax ---------- */
  gsap.utils.toArray('[data-parallax]').forEach((wrap) => {
    const img = wrap.querySelector('img');
    if (!img) return;
    const amount = parseFloat(wrap.dataset.parallax) || 8;
    gsap.fromTo(
      img,
      // images are ~115% of their frame's height, so a small upward drift never shows a gap
      { yPercent: 0 },
      {
        yPercent: -amount,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
  });

  /* ---------- Coverage map pulse ---------- */
  gsap.utils.toArray('.coverage__pulse').forEach((ring, i) => {
    gsap.fromTo(
      ring,
      { scale: 0.6, opacity: 0.6, transformOrigin: '50% 50%' },
      { scale: 1.5, opacity: 0, duration: 2.8, ease: 'sine.out', repeat: -1, delay: i * 1.4 }
    );
  });

  /* ---------- Mobile menu links ---------- */
  document.addEventListener('manna:menu', (event) => {
    if (!event.detail.open) return;
    const items = document.querySelectorAll('#site-nav .site-nav__link, #site-nav .site-nav__cta, #site-nav .site-nav__meta');
    gsap.fromTo(
      items,
      // opacity (not opacity) so links stay focusable while they fade in
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, delay: 0.05, clearProps: 'opacity,transform' }
    );
  });

  /* ---------- Keyboard users: reveal anything that receives focus ---------- */
  document.addEventListener('focusin', (event) => {
    const target = event.target.closest('[data-reveal]');
    if (target && parseFloat(getComputedStyle(target).opacity) < 1) {
      gsap.to(target, { opacity: 1, y: 0, duration: 0.3, overwrite: true });
    }
  });

  // Images load lazily and change layout; keep trigger positions accurate.
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
