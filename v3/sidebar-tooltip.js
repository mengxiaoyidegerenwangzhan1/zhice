(() => {
  'use strict';

  const list = document.querySelector('#nav-list');
  if (!list) return;
  const tip = document.createElement('div');
  tip.className = 'nav-sidebar-tooltip';
  tip.id = 'nav-sidebar-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.append(tip);

  let active = null;
  let timer = 0;

  function hide() {
    clearTimeout(timer);
    if (active && !tip.hidden) {
      const ids = (active.getAttribute('aria-describedby') || '').split(/\s+/)
        .filter(id => id && id !== tip.id);
      if (ids.length) active.setAttribute('aria-describedby', ids.join(' '));
      else active.removeAttribute('aria-describedby');
    }
    tip.hidden = true;
    active = null;
  }

  function show() {
    if (!active || !list.contains(active) || !active.getClientRects().length) return hide();
    const bounds = active.getBoundingClientRect();
    tip.textContent = active.dataset.tooltip;
    tip.hidden = false;
    const gap = 5;
    const maxLeft = document.documentElement.clientWidth - tip.offsetWidth - gap;
    const left = bounds.left + (bounds.width - tip.offsetWidth) / 2;
    const above = bounds.top - gap - tip.offsetHeight;
    const below = Math.min(bounds.bottom + gap, window.innerHeight - tip.offsetHeight - gap);
    tip.style.left = Math.max(gap, Math.min(left, maxLeft)) + 'px';
    tip.style.top = Math.max(gap, above >= gap ? above : below) + 'px';
    const describedBy = active.getAttribute('aria-describedby');
    active.setAttribute('aria-describedby', describedBy ? describedBy + ' ' + tip.id : tip.id);
  }

  function schedule(button) {
    if (!button?.dataset.tooltip || button === active) return;
    hide();
    active = button;
    timer = setTimeout(show, 250);
  }

  list.addEventListener('pointerover', event => {
    if (event.pointerType !== 'touch') schedule(event.target.closest('[data-tooltip]'));
  });
  list.addEventListener('pointerout', event => {
    if (active && active.contains(event.target) && !active.contains(event.relatedTarget)) hide();
  });
  list.addEventListener('focusin', event => {
    if (event.target.matches('[data-tooltip]:focus-visible')) schedule(event.target);
  });
  list.addEventListener('focusout', event => {
    if (event.target === active) hide();
  });
  list.addEventListener('click', hide, true);
  document.addEventListener('pointerdown', hide, true);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
  document.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
  window.addEventListener('blur', hide);
  new MutationObserver(() => {
    if (active && !list.contains(active)) hide();
  }).observe(list, {childList: true, subtree: true});
})();
