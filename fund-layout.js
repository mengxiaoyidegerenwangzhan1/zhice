(() => {
  let cleanup = () => {};
  function mount(page) {
    cleanup();
    if (!page) return;
    const header = page.querySelector('.fund-identity-panel');
    const spacer = document.createElement('div');
    spacer.className = 'fund-identity-space';
    header.before(spacer);
    let expandedHeight = header.offsetHeight, compact = false;
    const measure = () => {
      if (!compact) expandedHeight = header.offsetHeight;
      if (compact) spacer.style.height = expandedHeight + 'px';
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
    cleanup = () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', measure); observer.disconnect(); };
  }
  window.FundLayout = {mount, dispose: () => {cleanup(); cleanup = () => {};}};
})();
