export function attachDetailHeaderScroll(root, { tabScrollEvent = 'company-tab-scroll', onCompact = () => {}, revealTallHeader = false } = {}) {
  const slot = root.querySelector('.company-header-slot');
  const header = root.querySelector('.company-header');
  const facts = root.querySelector('.company-facts-wrap');
  const title = header.querySelector('h1');
  const switchAction = header.querySelector('[data-company-action="switch"], [data-md-action="switch"]');
  const topbar = document.querySelector('.app-topbar');
  let compact = false;
  let pinned = false;
  let previousY = 0;
  let accumulated = 0;
  let frame = 0;
  let top = 52;
  let anchor = 0;

  function fitCompactMetadata() {
    header.classList.remove('is-metadata-hidden');
    const fits = title.scrollWidth <= title.clientWidth;
    header.classList.toggle('is-metadata-hidden', !fits);
  }

  function measure() {
    top = topbar?.offsetHeight ?? 0;
    root.style.setProperty('--company-sticky-top', `${top}px`);
    anchor = slot.getBoundingClientRect().top + window.scrollY - top;
    header.classList.add('company-no-transition');
    header.classList.remove('is-compact');
    const expandedHeight = header.offsetHeight;
    slot.style.height = `${expandedHeight}px`;
    if (revealTallHeader) {
      // Let short viewports scroll the expanded actions into view before pinning.
      anchor += Math.max(0, top + expandedHeight - window.innerHeight + 8);
    }
    header.classList.toggle('is-compact', compact);
    if (compact) fitCompactMetadata();
    void header.offsetHeight;
    header.classList.remove('company-no-transition');
  }

  function draw(nextCompact, nextPinned) {
    if (pinned !== nextPinned) {
      pinned = nextPinned;
      header.classList.toggle('is-pinned', pinned);
    }
    if (compact !== nextCompact) {
      compact = nextCompact;
      const movingFocus = compact && facts?.contains(document.activeElement);
      header.classList.toggle('is-compact', compact);
      if (compact) fitCompactMetadata();
      if (facts) {
        facts.inert = compact;
        facts.setAttribute('aria-hidden', String(compact));
      }
      if (movingFocus) switchAction?.focus({preventScroll:true});
      if (compact) onCompact();
    }
  }

  function tick() {
    frame = 0;
    if (!root.isConnected) return;
    const y = Math.max(0, window.scrollY);
    const delta = y - previousY;
    previousY = y;
    if (delta !== 0) accumulated = Math.sign(delta) === Math.sign(accumulated) ? accumulated + delta : delta;
    const atAnchor = y <= Math.max(0, anchor + 2);
    const nextPinned = !atAnchor;
    let nextCompact = compact;
    if (atAnchor || accumulated <= -28) nextCompact = false;
    else if (y >= anchor + 48 && accumulated >= 14) nextCompact = true;
    draw(nextCompact, nextPinned);
  }

  function onScroll() {
    if (frame) return;
    frame = requestAnimationFrame(tick);
  }

  function onResize() {
    if (!root.isConnected) return;
    measure();
    onScroll();
  }

  measure();
  tick();
  function resetDirection() {
    previousY = Math.max(0, window.scrollY);
    accumulated = 0;
    onScroll();
  }
  root.addEventListener(tabScrollEvent, resetDirection);
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onResize, { passive:true });
  document.fonts?.ready.then(onResize);
  return () => {
    root.removeEventListener(tabScrollEvent, resetDirection);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (frame) cancelAnimationFrame(frame);
  };
}
