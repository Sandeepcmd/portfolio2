import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { sound } from './sound.js';

gsap.registerPlugin(ScrollTrigger);

export function refreshScroll() {
  ScrollTrigger.refresh();
}

export function initAnimations() {
  // 1. Hero Section Entrance Animation
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

  heroTl
    .from('.hero-pill-badge', { y: -20, opacity: 0, delay: 0.1 })
    .from('.hero-title', { y: 35, opacity: 0 }, '-=0.6')
    .from('.hero-subtitle', { y: 25, opacity: 0 }, '-=0.6')
    .from('.hero-cta-group', { y: 20, opacity: 0 }, '-=0.5')
    .from('.hero-socials', { y: 15, opacity: 0 }, '-=0.6')
    .from('.hero-stats-strip', { y: 20, opacity: 0 }, '-=0.5')
    .from('.profile-card', { scale: 0.92, opacity: 0, rotationY: -15, duration: 1.1 }, '-=0.9')
    .from('.floating-badge', { scale: 0.8, opacity: 0, stagger: 0.2 }, '-=0.6');

  // Helper for safe scroll reveal that never traps elements at opacity 0
  function safeScrollReveal(elementsSelector, triggerSelector, yOffset = 25, stagger = 0.12) {
    const elements = document.querySelectorAll(elementsSelector);
    if (!elements.length) return;

    elements.forEach((el, index) => {
      // Check if element is already in or above viewport
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight;

      if (inView) {
        gsap.set(el, { opacity: 1, y: 0, clearProps: 'all' });
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: (index % 4) * stagger,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              once: true,
              onEnter: () => {
                gsap.to(el, { opacity: 1, y: 0, duration: 0.6 });
              }
            }
          }
        );
      }
    });
  }

  // 2. Section Headings Scroll Trigger Reveal
  safeScrollReveal('.section-tag, .section-heading, .section-description', null, 20, 0.08);

  // 3. Number Counter Roll-Ups
  const counterElements = document.querySelectorAll('[data-counter]');
  counterElements.forEach((el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const suffix = el.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals) + suffix;
          }
        });
      }
    });
  });

  // 4. Project Cards Reveal
  safeScrollReveal('.project-card-3d', '.projects-grid', 30, 0.12);

  // 5. Timeline Cards Reveal
  safeScrollReveal('.timeline-card', '.experience-timeline', 30, 0.15);

  // 6. Skill Category Cards Reveal
  safeScrollReveal('.skill-category-card', '.skills-category-grid', 25, 0.08);

  // 7. Achievement Cards Reveal
  safeScrollReveal('.achievement-card', '.achievements-grid', 25, 0.1);

  // 8. Celebration Confetti Button
  const celebrateBtn = document.getElementById('celebrate-achievements-btn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      sound.playChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#7c3aed', '#ec4899', '#06b6d4', '#10b981']
      });
    });
  }

  // 9. Sync Active Nav Links with Scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Safety trigger refreshes
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.addEventListener('hashchange', () => {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });
  setTimeout(() => ScrollTrigger.refresh(), 400);
  setTimeout(() => ScrollTrigger.refresh(), 1200);
}
