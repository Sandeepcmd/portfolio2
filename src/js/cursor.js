// Custom Magnetic Cursor with smooth physics
export function initCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states for interactive elements
  const interactiveTargets = document.querySelectorAll(
    'a, button, input, textarea, .tech-chip, .skill-pill, .timeline-card, .project-card-3d, .quick-cmd-btn, .contact-card-box'
  );

  interactiveTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-hover');
    });
  });

  window.addEventListener('mousedown', () => {
    ring.classList.add('cursor-active');
  });

  window.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-active');
  });
}
