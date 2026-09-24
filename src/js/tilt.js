// Interactive 3D Perspective Tilt with dynamic glare
export function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    let bounds = el.getBoundingClientRect();
    let isHovering = false;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let animId = null;

    const maxTilt = parseFloat(el.getAttribute('data-tilt-max') || '14');

    function updateBounds() {
      bounds = el.getBoundingClientRect();
    }

    function onMouseMove(e) {
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      // Normalized coordinates -1 to 1
      const normX = (x / bounds.width - 0.5) * 2;
      const normY = (y / bounds.height - 0.5) * 2;

      targetRotateY = normX * maxTilt;
      targetRotateX = -normY * maxTilt;

      // Update glare CSS variables
      const percentX = (x / bounds.width) * 100;
      const percentY = (y / bounds.height) * 100;
      el.style.setProperty('--mouse-x', `${percentX}%`);
      el.style.setProperty('--mouse-y', `${percentY}%`);
    }

    function renderLoop() {
      // Smooth lerp interpolation
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;

      el.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

      if (isHovering || Math.abs(currentRotateX) > 0.05 || Math.abs(currentRotateY) > 0.05) {
        animId = requestAnimationFrame(renderLoop);
      } else {
        el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    el.addEventListener('mouseenter', () => {
      isHovering = true;
      updateBounds();
      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }
    });

    el.addEventListener('mousemove', onMouseMove);

    el.addEventListener('mouseleave', () => {
      isHovering = false;
      targetRotateX = 0;
      targetRotateY = 0;
    });

    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, { passive: true });
  });
}
