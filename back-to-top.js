(() => {
  const control = document.createElement('div');
  control.className = 'site-back-to-top';
  control.hidden = true;
  control.innerHTML = `
    <button type="button" aria-label="回到顶部">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M4.5 3h15M4.5 14l7.5-7.5 7.5 7.5M12 6.5V21" />
      </svg>
    </button>`;
  document.body.append(control);

  const updateVisibility = () => {
    control.toggleAttribute('hidden', window.scrollY < window.innerHeight / 2);
  };
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  window.addEventListener('pageshow', updateVisibility);
  updateVisibility();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  control.querySelector('button').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
})();
