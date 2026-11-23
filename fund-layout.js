(() => {
  let cleanup = () => {};
  function mount(page) {
    cleanup();
    if (!page) return;
    const header = page.querySelector('.fund-identity-panel');
    const summaryToggle = page.querySelector('.fund-summary-toggle');
    const summaryContent = page.querySelector('#fund-summary-content');
    if (summaryToggle && summaryContent) {
      summaryToggle.addEventListener('click', () => {
        const expanded = summaryToggle.getAttribute('aria-expanded') !== 'true';
        summaryToggle.setAttribute('aria-expanded', String(expanded));
        summaryContent.hidden = !expanded;
        summaryToggle.querySelector('span').textContent = expanded ? '收起' : '展开';
        requestAnimationFrame(() => window.FundChartUI?.charts(page).forEach(chart => chart.resize()));
      });
    }

    const tabs = page.querySelector('.fund-tabs');
    tabs?.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const items = [...tabs.querySelectorAll('[role="tab"]:not(:disabled)')];
      const current = items.indexOf(event.target.closest('[role="tab"]'));
      if (current < 0) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
      sessionStorage.setItem('zhice-fund-tab-focus', items[index].dataset.fundTab);
      items[index].click();
    });
    const focusedTab = sessionStorage.getItem('zhice-fund-tab-focus');
    if (focusedTab) {
      sessionStorage.removeItem('zhice-fund-tab-focus');
      const button = [...tabs.querySelectorAll('[role="tab"]')].find(item => item.dataset.fundTab === focusedTab);
      button?.focus({preventScroll:true});
    }

    const revealActiveTab = () => {
      if (!tabs || tabs.scrollWidth <= tabs.clientWidth || getComputedStyle(tabs).overflowX !== 'auto') return;
      const selected = tabs.querySelector('[aria-selected="true"]');
      if (!selected) return;
      const inset = parseFloat(getComputedStyle(tabs).paddingLeft) || 0;
      const left = selected.offsetLeft;
      const right = left + selected.offsetWidth;
      if (left < tabs.scrollLeft + inset) tabs.scrollLeft = Math.max(0, left - inset);
      else if (right > tabs.scrollLeft + tabs.clientWidth - inset) tabs.scrollLeft = right - tabs.clientWidth + inset;
    };
    const revealFrame = requestAnimationFrame(revealActiveTab);

    const spacer = document.createElement('div');
    spacer.className = 'fund-identity-space';
    header.before(spacer);
    let expandedHeight = header.offsetHeight, compact = false;
    const measure = () => {
      if (!compact) expandedHeight = header.offsetHeight;
      if (compact) spacer.style.height = expandedHeight + 'px';
      revealActiveTab();
    };
    const update = () => {
      const shouldCompact = window.scrollY > page.offsetTop + 110;
      if (shouldCompact === compact) return;
      if (shouldCompact) expandedHeight = header.offsetHeight;
      compact = shouldCompact;
      page.classList.toggle('is-header-compact', compact);
      spacer.style.height = compact ? expandedHeight + 'px' : '0px';
      requestAnimationFrame(() => window.FundChartUI?.charts(page).forEach(chart => chart.resize()));
    };
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure); observer.observe(header);
    update();
    page.querySelectorAll('.fund-identity-actions button').forEach(button => {
      const label = button.getAttribute('aria-label');
      if (label === '收藏') {
        const key = 'zhice-favorite-' + snapshot.fund.code;
        let selected = localStorage.getItem(key) === 'true';
        const render = () => { button.setAttribute('aria-pressed', String(selected)); button.classList.toggle('is-saved', selected); button.querySelector('span').textContent = selected ? '已收藏' : '收藏'; };
        render(); button.addEventListener('click', () => { selected = !selected; localStorage.setItem(key, String(selected)); render(); });
      }
      if (label === '对比') button.addEventListener('click', () => { location.hash = '#/compare'; });
      if (label === '切换') button.addEventListener('click', () => { location.hash = '#/screener'; });
    });
    // Numeric alignment belongs to the cell, so totals share the body column edge.
    page.querySelectorAll('table').forEach(table => {
      table.querySelectorAll('tbody tr').forEach(row => {
        [...row.cells].forEach((cell, index) => {
          const text = cell.textContent.trim();
          if (index > 0 && /^[-+−]?\d[\d,.]*(?:%|亿|万|天|年|个月)?$/.test(text)) cell.classList.add('is-num');
        });
      });
    });
    cleanup = () => { cancelAnimationFrame(revealFrame); window.removeEventListener('scroll', update); window.removeEventListener('resize', measure); observer.disconnect(); };
  }
  window.FundLayout = {mount, dispose: () => {cleanup(); cleanup = () => {};}};
})();
