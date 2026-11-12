(() => {
  const actionSelector = [
    'button[data-download]',
    'button[data-risk-download]',
    'button[data-analysis-download]',
    'button[data-manager-allocation-image]',
    'button[data-refresh]',
    'button[data-risk-refresh]',
    'button[data-analysis-refresh]',
    'button[aria-label^="下载"]',
    'button[title^="下载"]',
    'button[aria-label^="刷新"]',
    'button[title^="刷新"]',
  ].join(',');
  const labels = {
    'download-image': '下载图片',
    'download-table': '下载表格',
    refresh: '刷新',
  };
  const chartSelector = '[data-risk-chart], [data-manager-chart], [data-manager-allocation-chart], .zc-chart, canvas';
  const automaticLabels = new WeakSet();

  function actionFor(button) {
    if (button.id === 'zc-export') return null;
    const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''}`;
    if (button.matches('[data-refresh], [data-risk-refresh], [data-analysis-refresh]') || /(^|\s)刷新/.test(label)) {
      return 'refresh';
    }
    if (button.hasAttribute('data-manager-allocation-image') || button.dataset.analysisDownload === 'image') {
      return 'download-image';
    }
    if (button.dataset.analysisDownload === 'table') return 'download-table';
    if (button.hasAttribute('data-download')) return 'download-image';

    const section = button.closest('section');
    if (button.hasAttribute('data-risk-download')) {
      return section?.querySelector(chartSelector) ? 'download-image' : 'download-table';
    }
    if (button.hasAttribute('data-analysis-download')) {
      return section?.querySelector('table') ? 'download-table' : 'download-image';
    }
    if (/下载(图片|图像)/.test(label)) return 'download-image';
    if (/下载表格/.test(label)) return 'download-table';
    if (section?.querySelector(chartSelector)) return 'download-image';
    if (section?.querySelector('table')) return 'download-table';
    return null;
  }

  function normalize(button) {
    const action = actionFor(button);
    if (!action) return;
    const previousAction = button.dataset.sharedAction;
    button.classList.add('site-action-icon');
    button.dataset.sharedAction = action;
    if (!button.getAttribute('aria-label') || automaticLabels.has(button)) {
      const heading = button.closest('section')?.querySelector('h2')?.firstChild?.textContent.trim();
      button.setAttribute('aria-label', heading ? `${labels[action]}，${heading}` : labels[action]);
      automaticLabels.add(button);
    }
    if (!button.title || button.title === '下载' || button.title === '刷新' || button.title === labels[previousAction]) {
      button.title = labels[action];
    }
  }

  function normalizeWithin(root) {
    const buttons = [...root.querySelectorAll(actionSelector)];
    if (root.matches?.(actionSelector)) buttons.unshift(root);
    buttons.forEach(normalize);
    const groups = new Set(buttons.filter(button => button.hasAttribute('data-shared-action')).map(button => button.parentElement));
    groups.forEach(group => {
      const onlyActions = [...group.children].every(child => child.matches('button[data-shared-action]'));
      group.classList.toggle('site-action-group', onlyActions);
      group.toggleAttribute('data-shared-actions', onlyActions);
    });
  }

  normalizeWithin(document);

  // Route and module renders replace their content. Only child-list changes are
  // observed, so adding presentation attributes cannot trigger another pass.
  new MutationObserver(records => {
    const roots = new Set();
    records.forEach(record => {
      const section = record.target.closest?.('section');
      if (section) roots.add(section);
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) roots.add(node);
      });
    });
    roots.forEach(normalizeWithin);
  }).observe(document.body, { childList: true, subtree: true });
})();
