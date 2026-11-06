(() => {
  const host = document.getElementById('route-view');
  if (!host) return;

  let activeRegion = null;
  let compact = false;
  let scheduled = false;
  let needsMeasurement = true;
  let collapseAfter = 0;
  let lastScrollY = window.scrollY;
  let savedClickScroll = null;

  const compare = () => host.querySelector('.zc-compare.has-results');

  function measure(page, region) {
    const panel = region.firstElementChild;
    page.classList.remove('is-sticky-compact');
    const expandedHeight = panel.offsetHeight;
    page.classList.add('is-sticky-compact');
    const compactHeight = panel.offsetHeight;
    page.classList.toggle('is-sticky-compact', compact);

    const scale = region.getBoundingClientRect().width / region.offsetWidth || 1;
    const headerHeight = document.getElementById('zc-header').getBoundingClientRect().height / scale;
    region.style.setProperty('--zc-sticky-header', `${headerHeight}px`);
    region.style.setProperty('--zc-sticky-reserve', `${expandedHeight}px`);
    // Let the results reach the compact bar before shrinking the sticky panel.
    collapseAfter = (expandedHeight - compactHeight) * scale;
  }

  function update() {
    scheduled = false;
    const page = compare();
    const region = page?.querySelector('.zc-sticky-region');
    const y = window.scrollY;
    const delta = y - lastScrollY;
    lastScrollY = y;

    if (!region) {
      activeRegion = null;
      compact = false;
      return;
    }
    if (region !== activeRegion || needsMeasurement) {
      measure(page, region);
      activeRegion = region;
      needsMeasurement = false;
    }

    const searching = page.querySelector('.zc-search-slot:focus-within, .zc-search-results:not([hidden])');
    if (y < collapseAfter || delta < -0.5 || searching) compact = false;
    else if (delta > 0.5) compact = true;
    page.classList.toggle('is-sticky-compact', compact);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  function expandSearch(event) {
    const search = event.target.closest('.zc-search');
    const page = compare();
    if (!compact || !search || !page?.contains(search)) return;
    compact = false;
    page.classList.remove('is-sticky-compact');
    lastScrollY = window.scrollY;
    if (event.type === 'pointerdown') {
      // The field moves when the panel expands, so focus the original field directly.
      event.preventDefault();
      search.querySelector('input').focus({ preventScroll: true });
    }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    needsMeasurement = true;
    schedule();
  }, { passive: true });
  host.addEventListener('pointerdown', expandSearch, true);
  host.addEventListener('focusin', expandSearch, true);
  host.addEventListener('click', event => {
    if (!compare() || !event.target.closest('button')) return;
    savedClickScroll = window.scrollY;
    setTimeout(() => { savedClickScroll = null; }, 0);
  }, true);

  new MutationObserver(() => {
    const y = savedClickScroll;
    savedClickScroll = null;
    if (y !== null && compare()) {
      requestAnimationFrame(() => {
        if (compare() && Math.abs(window.scrollY - y) > 1) {
          window.scrollTo({ top: y, behavior: 'instant' });
          lastScrollY = window.scrollY;
        }
        schedule();
      });
    } else {
      schedule();
    }
  }).observe(host, { childList: true });
  schedule();
})();
