import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, icons } from 'lucide';
import { sound } from './sound.js';
import { initThreeScene } from './three-scene.js';
import { init3DTilt } from './tilt.js';
import { initCursor } from './cursor.js';
import { initTerminal } from './terminal.js';
import { initAnimations, refreshScroll } from './animations.js';

let lenisInstance = null;

// Initialize Lucide Icons
function initLucide() {
  createIcons({ icons });
}

// Initialize Lenis Smooth Scroll integrated with GSAP ScrollTrigger
function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Smooth anchor navigation handler
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          sound.playClick();
          
          if (lenisInstance) {
            lenisInstance.scrollTo(targetEl, {
              offset: -70,
              duration: 1.2,
              onComplete: () => {
                refreshScroll();
              }
            });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }

          // Update URL hash without abrupt native jumping
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // If user opens direct with a hash
  if (window.location.hash) {
    setTimeout(() => {
      const initialEl = document.querySelector(window.location.hash);
      if (initialEl && lenisInstance) {
        lenisInstance.scrollTo(initialEl, { offset: -70 });
        refreshScroll();
      }
    }, 300);
  }
}

// Global Toast Messenger
function showToast(message) {
  const toast = document.getElementById('global-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  sound.playClick();
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// Copy to Clipboard Helpers
function initClipboardHelpers() {
  const copyElements = document.querySelectorAll('[data-copy]');
  copyElements.forEach((el) => {
    el.addEventListener('click', () => {
      const textToCopy = el.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Copied: ${textToCopy}`);
        });
      }
    });
  });
}

// Sound Toggle Button
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const isEnabled = sound.toggle();
    if (isEnabled) {
      soundBtn.classList.add('sound-active');
      soundBtn.setAttribute('title', 'Sound Effects: ON');
      showToast('Sound Effects: ON 🔊');
    } else {
      soundBtn.classList.remove('sound-active');
      soundBtn.setAttribute('title', 'Sound Effects: OFF');
      showToast('Sound Effects: OFF 🔇');
    }
  });
}

// Mobile Drawer Navigation
function initMobileNav() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl && lenisInstance) {
          lenisInstance.scrollTo(targetEl, { offset: -70 });
        }
      }
    });
  });
}

// Contact Form Handling
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sound.playClick();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (statusMsg) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = '✓ Message received! Sandeep will get back to you within 24 hours.';
      }
      sound.playChime();
      showToast('Message sent successfully! 🚀');
    }, 1200);
  });
}

// Document Ready Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  initSmoothScroll();
  initThreeScene();
  init3DTilt();
  initCursor();
  initTerminal();
  initAnimations();
  initClipboardHelpers();
  initSoundToggle();
  initMobileNav();
  initContactForm();
});
