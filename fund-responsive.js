(() => {
  'use strict';
  let activePage = null, observer = null, mutations = null, frame = 0;
  let lastChartWidth = 0;
  const number = value => Number.parseFloat(value) || 0;

  function prepareHeading(head) {
    const controls = head.querySelector(':scope > .fund-panel-controls');
    if (!controls || controls.dataset.responsivePrepared) return;
    controls.dataset.responsivePrepared = 'true';
    const filters = document.createElement('div'); filters.className = 'fund-responsive-filters';
    const utility = document.createElement('div'); utility.className = 'fund-responsive-utilities';
    [...controls.children].forEach(child => {
      (child.matches('.zc-module-actions,.zc-view-switch,.fund-summary-toggle') ? utility : filters).append(child);
    });
    if (filters.children.length) controls.append(filters);
    if (utility.children.length) controls.append(utility);
  }

  function intrinsicWidth(element) {
    if (!element) return 0;
    if (element.classList.contains('fund-linked-time')) {
      const parts = [...element.querySelectorAll('.lt-controls > *')].filter(part => !part.hidden);
      return parts.reduce((sum, part) => sum + part.scrollWidth, 0) + Math.max(0, parts.length - 1) * number(getComputedStyle(element.querySelector('.lt-controls')).columnGap);
    }
    return element.scrollWidth;
  }

  function layoutHeading(head) {
    prepareHeading(head);
    const title = head.querySelector(':scope > div:first-child');
    const filters = head.querySelector('.fund-responsive-filters');
    const utility = head.querySelector('.fund-responsive-utilities');
    if (!filters) { head.classList.remove('is-responsive-wrapped'); return; }
    const children = [...filters.children].filter(child => !child.hidden);
    const needed = children.reduce((sum, child) => sum + intrinsicWidth(child), 0) + Math.max(0, children.length - 1) * 12;
    const titleWidth = title ? title.scrollWidth : 0;
    const utilityWidth = utility ? utility.scrollWidth : 0;
    const gaps = utilityWidth ? 32 : 16;
    const wrapped = needed + titleWidth + utilityWidth + gaps > head.clientWidth + 1;
    if (head.classList.contains('is-responsive-wrapped') !== wrapped) head.classList.toggle('is-responsive-wrapped', wrapped);
  }

  function layoutIdentity(header) {
    if (!header) return;
    const title = header.querySelector('.fund-title-row h1');
    const stars = header.querySelector('.fund-stars');
    const actions = header.querySelector('.fund-identity-actions');
    if (!title || !actions) return;
    const label = document.createElement('span');
    label.textContent = title.textContent;
    label.style.cssText = 'position:fixed;left:-10000px;top:0;white-space:nowrap;visibility:hidden;pointer-events:none;';
    label.style.font = getComputedStyle(title).font;
    document.body.append(label);
    const titleWidth = label.getBoundingClientRect().width;
    let naturalStarsWidth = 0;
    if (stars) {
      const starStyle = getComputedStyle(stars);
      label.textContent = stars.textContent;
      label.style.font = starStyle.font;
      label.style.letterSpacing = starStyle.letterSpacing;
      naturalStarsWidth = label.getBoundingClientRect().width;
    }
    label.remove();
    const style = getComputedStyle(header);
    const room = header.clientWidth - number(style.paddingLeft) - number(style.paddingRight);
    const actionChildren = [...actions.children];
    const actionGap = number(getComputedStyle(actions).columnGap);
    const actionWidth = actionChildren.reduce((sum, child) => sum + child.offsetWidth, 0) + Math.max(0, actionChildren.length - 1) * actionGap;
    const titleRow = header.querySelector('.fund-title-row');
    const titleRowGap = number(getComputedStyle(titleRow).gap);
    const compact = header.closest('.fund-analysis-page')?.classList.contains('is-header-compact');
    const narrow = window.matchMedia('(max-width:800px)').matches;
    header.classList.toggle('is-stars-collapsed', Boolean(compact && (narrow || titleWidth + naturalStarsWidth + titleRowGap + actionWidth + 24 > room)));
    const starsWidth = stars && getComputedStyle(stars).display !== 'none' ? naturalStarsWidth : 0;
    const titleGap = starsWidth ? titleRowGap : 0;
    header.style.setProperty('--fund-identity-actions-width', actionWidth + 'px');
    header.classList.toggle('is-actions-wrapped', titleWidth + starsWidth + titleGap + actionWidth + 24 > room);
  }

  function update() {
    frame = 0;
    const page = activePage;
    if (!page || !page.isConnected) return;
    const viewport = document.documentElement.clientWidth;
    const scale = viewport > 1200 ? Math.min(1, viewport / 1440) : 1;
    page.style.setProperty('--fund-responsive-scale', String(scale));
    document.body.style.setProperty('--fund-responsive-scale', String(scale));
    const rect = page.getBoundingClientRect();
    const actualScale = page.offsetWidth ? rect.width / page.offsetWidth : scale;
    const style = getComputedStyle(page);
    const paddingLeft = number(style.paddingLeft) * actualScale;
    const paddingRight = number(style.paddingRight) * actualScale;
    const cardLeft = rect.left + paddingLeft;
    const cardWidth = rect.width - paddingLeft - paddingRight;
    const navigation = document.querySelector('body > .app-topbar:not(#zc-header)');
    const navBottom = navigation?.getBoundingClientRect().bottom || 52;
    // Fixed descendants inherit CSS zoom; convert viewport pixels back to their local pixels.
    page.style.setProperty('--fund-fixed-left', cardLeft / actualScale + 'px');
    page.style.setProperty('--fund-fixed-width', cardWidth / actualScale + 'px');
    page.style.setProperty('--fund-fixed-top', navBottom / actualScale + 'px');
    layoutIdentity(page.querySelector('.fund-identity-panel'));
    page.querySelectorAll('.fund-panel-head').forEach(layoutHeading);
    const chartWidth = Math.round(cardWidth * 10) / 10;
    if (chartWidth !== lastChartWidth) {
      lastChartWidth = chartWidth;
      window.FundChartUI?.charts(page).forEach(chart => chart.resize());
    }
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function dispose() {
    if (frame) cancelAnimationFrame(frame); frame = 0;
    observer?.disconnect(); mutations?.disconnect(); observer = mutations = null;
    window.removeEventListener('resize', schedule);
    activePage = null; lastChartWidth = 0;
    document.body.style.removeProperty('--fund-responsive-scale');
  }

  function mount(page) {
    dispose(); if (!page) return;
    activePage = page;
    page.querySelectorAll('.fund-panel-head').forEach(prepareHeading);
    update();
    observer = new ResizeObserver(schedule); observer.observe(page);
    const nav = document.querySelector('body > .app-topbar:not(#zc-header)'); if (nav) observer.observe(nav);
    mutations = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList' || record.target === page)) schedule();
    });
    mutations.observe(page, {childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    window.addEventListener('resize', schedule, {passive:true});
    document.fonts?.ready.then(() => { if (activePage === page) schedule(); });
  }
  window.FundResponsive = {mount, dispose, update:schedule, geometry};
})();
