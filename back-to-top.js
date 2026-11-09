(() => {
  const control = document.createElement('div');
  control.className = 'site-back-to-top';
  control.hidden = true;
  control.innerHTML = `
    <button type="button" aria-label="回到顶部">
      <span class="site-back-to-top-icon" aria-hidden="true">
        <img class="is-default" src="./assets/back-to-top/arrow-default.svg" alt="">
        <img class="is-hover" src="./assets/back-to-top/arrow-hover.svg" alt="">
      </span>
    </button>`;
  document.body.append(control);

  let activeScroller = null;
  const isVisible = element => element.isConnected && element.getClientRects().length > 0 && window.getComputedStyle(element).visibility === 'visible';

  const updateVisibility = () => {
    if (activeScroller && !isVisible(activeScroller)) {
      activeScroller = null;
    }
    const scrollTop = activeScroller ? activeScroller.scrollTop : window.scrollY;
    const viewportHeight = activeScroller ? activeScroller.clientHeight : window.innerHeight;
    control.toggleAttribute('hidden', scrollTop < viewportHeight / 2);
  };
  window.addEventListener('scroll', () => {
    activeScroller = null;
    updateVisibility();
  }, { passive: true });
  document.addEventListener('scroll', event => {
    const target = event.target;
    if (target.matches?.('[data-back-to-top-scroll]') && isVisible(target)) {
      activeScroller = target;
    }
    updateVisibility();
  }, { capture: true, passive: true });
  document.addEventListener('click', () => requestAnimationFrame(updateVisibility));
  window.addEventListener('resize', updateVisibility);
  window.addEventListener('pageshow', updateVisibility);
  window.addEventListener('hashchange', updateVisibility);
  updateVisibility();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  control.querySelector('button').addEventListener('click', () => {
    updateVisibility();
    const target = activeScroller || window;
    target.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
})();
