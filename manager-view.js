(() => {
  const assets = './assets/manager-select/';
  const colors = ['#9693cc', '#93b9cc', '#ccbd93', '#bc93cc'];
  const catalog = [
    { id: 'a', name: '张志梅', company: '尚正基金管理有限公司', type: '偏股型', profileIndex: 0, products: [
      { code: '013486', name: '尚正竞争优势混合C', type: '混合型', tenureReturn: 15.75 },
      { code: '013485', name: '尚正竞争优势混合A', type: '混合型', tenureReturn: 16.82 },
    ] },
    { id: 'b', name: '黄欣', company: '国联安基金管理有限公司', type: '指数型', profileIndex: 1, products: [
      { code: '020011', name: '国联安中证100指数(LOF)', type: '指数型', tenureReturn: 12.28 },
      { code: '020021', name: '国泰上证180金融ETF联接A', type: '指数型', tenureReturn: 9.13 },
    ] },
    { id: 'c', name: '孟棋', company: '景顺长城基金管理有限公司', type: '偏股型', profileIndex: 2, products: [
      { code: '002244', name: '景顺长城低碳科技主题灵活配置混合A', type: '混合型', tenureReturn: 15.75 },
      { code: '000059', name: '景顺长城优信增利债券A', type: '债券型', tenureReturn: 6.32 },
    ] },
    { id: 'd', name: '李笑薇', company: '富国基金管理有限公司', type: '指数型', profileIndex: 3, products: [
      { code: '100038', name: '富国沪深300增强A', type: '指数型', tenureReturn: 13.08 },
      { code: '100032', name: '富国中证红利指数增强A', type: '指数型', tenureReturn: 10.68 },
    ] },
    { id: 'e', name: '孟晨波', company: '摩根基金', type: '指数型', profileIndex: 1, products: [
      { code: '017341', name: '摩根中证创新药产业ETF联接A', type: '指数型', tenureReturn: 8.15 },
    ] },
    { id: 'f', name: '汪孟海', company: '富国基金管理有限公司', type: '混合型', profileIndex: 2, products: [
      { code: '004585', name: '富国港股通量化精选股票A', type: '股票型', tenureReturn: -3.26 },
    ] },
  ];
  let host;
  let managers = [];
  let mode = 'comprehensive';
  const tabs = { comprehensive: 0, representative: 0 };
  let compared = false;
  let referenceId = null;
  let nextOrder = 0;
  let charts = [];
  let riskView = 'chart';
  let showDifferences = true;
  let noticeUntil = 0;
  let noticeTimer;
  const ranges = new Map();
  const subjects = { comprehensive: new Map(), representative: new Map() };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const img = (file, width = 14, height = width) => `<img src="./assets/compare-controls/${file}.svg" width="${width}" height="${height}" alt="">`;

  function selectedProduct(manager) {
    return manager.products.find(product => product.code === manager.productCode) || manager.products[0];
  }

  function entities() {
    return managers.map(manager => {
      const cache = subjects[mode];
      if (!cache.has(manager.id)) cache.set(manager.id, {});
      const entity = cache.get(manager.id);
      const product = selectedProduct(manager);
      Object.assign(entity, manager, mode === 'representative' ? product : {}, {
        id: manager.id, color: manager.color, visible: manager.visible, profileIndex: manager.profileIndex,
        representativeFund: { ...product }, managerName: manager.name,
      });
      return entity;
    });
  }

  function options() {
    return { managers, funds: entities(), mode, referenceId, showDifferences, view: riskView, ui };
  }

  function riskOptions(section = 'overview') {
    const defaults = {
      overview: { start: '2024-01-01' },
      forecast: { period: '近3年', holdingMonths: 3 },
      rolling: { period: '近1年' },
      metrics: { benchmark: '上证综指', frequency: '原始频率' },
    };
    return { ...options(), ...range(`risk-${section}`, defaults[section]) };
  }

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function range(scope, initial = {}) {
    const key = `${mode}:${scope}`;
    if (!ranges.has(key)) {
      const value = { start: '2025-12-09', end: '2026-11-06', period: '共同时段', unit: '月', holdingMonths: 3, ...initial };
      value.commonStart = value.start;
      value.commonEnd = value.end;
      ranges.set(key, value);
    }
    return ranges.get(key);
  }

  function setPeriod(scope, period) {
    const value = range(scope);
    value.period = period;
    value.end = value.commonEnd;
    if (period === '共同时段' || period === '共同任期') value.start = value.commonStart;
    else if (period.includes('年度')) {
      value.start = `${period.slice(0, 4)}-01-01`;
      value.end = `${period.slice(0, 4)}-12-31`;
    } else if (period === '今年以来') value.start = `${value.end.slice(0, 4)}-01-01`;
    else {
      const months = { '近3月': 3, '近6月': 6, '近1年': 12, '近3年': 36, '近5年': 60 }[period];
      if (months) {
        const date = new Date(`${value.commonEnd}T12:00:00`);
        const day = date.getDate();
        date.setDate(1);
        date.setMonth(date.getMonth() - months);
        date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
        value.start = formatDate(date);
      }
    }
  }

  function timeControls(scope, initial = {}) {
    const value = range(scope, initial);
    const commonLabel = value.commonLabel || '共同时段';
    const primary = [commonLabel, '近1年', '近3年'];
    const isCommon = value.period === '共同时段' || value.period === '共同任期';
    const moreSelected = !isCommon && !primary.includes(value.period);
    const button = label => `<button type="button" data-manager-period="${label}" aria-pressed="${value.period === label || (label === commonLabel && isCommon)}" class="${value.period === label || (label === commonLabel && isCommon) ? 'selected' : ''}">${label}</button>`;
    return `<div class="zc-analysis-time" data-manager-time="${scope}"><div class="zc-quick-wrap"><div class="zc-pill zc-analysis-quick">${primary.map(button).join('')}<button type="button" data-manager-more aria-expanded="false" aria-pressed="${moreSelected}" class="${moreSelected ? 'selected' : ''}">${moreSelected ? value.period : '更多'}<span class="zc-down">${img('more', 10)}</span></button></div><div class="zc-more-panel" hidden><div><small>区间</small>${['近3月', '近6月', '近5年'].map(button).join('')}</div><div><small>年度</small>${['今年以来', '2025年度', '2024年度', '2023年度'].map(button).join('')}</div></div></div>${initial.showDate === false ? '' : `<div class="zc-date-wrap"><button class="zc-date" type="button" disabled aria-label="当前日期范围 ${value.start} 至 ${value.end}"><span>${value.start}</span><small>至</small><span>${value.end}</span>${img('calendar-disabled', 12.6348, 12.1194)}</button></div>`}</div>`;
  }

  function setting(scope, field, label, choices, initial) {
    const value = range(scope);
    if (value[field] === undefined) value[field] = initial;
    const items = choices.map(item => typeof item === 'object' ? item : { value: item, label: item });
    const current = items.find(item => String(item.value) === String(value[field]));
    return `<details class="zc-analysis-select"><summary aria-label="${escape(label)} ${escape(current?.label || value[field])}"><span>${label}</span><strong>${escape(current?.label || value[field])}</strong>${img('more', 10)}</summary><div class="zc-analysis-menu" role="listbox" aria-label="${escape(label)}">${items.map(item => `<button type="button" role="option" aria-selected="${String(item.value) === String(value[field])}" data-manager-field="${field}" data-manager-scope="${scope}" data-manager-value="${escape(item.value)}">${escape(item.label)}</button>`).join('')}</div></details>`;
  }

  function download(filename, body, type) {
    const url = URL.createObjectURL(body instanceof Blob ? body : new Blob([body], { type }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function exportTable(section, filename) {
    const rows = [...section.querySelectorAll('table tr')].filter(row => !row.closest('[hidden]'));
    const csv = rows.map(row => [...row.cells].map(cell => `"${cell.textContent.trim().replaceAll('"', '""')}"`).join(',')).join('\r\n');
    download(`${filename}.csv`, '\ufeff' + csv, 'text/csv;charset=utf-8');
  }

  function exportImage(section, filename) {
    const sectionCharts = charts.filter(chart => section.contains(chart.getDom()));
    if (!sectionCharts.length) return;
    const images = sectionCharts.map(chart => chart.renderToCanvas({ pixelRatio: 2, backgroundColor: '#fff' }));
    const canvas = document.createElement('canvas');
    canvas.width = images.reduce((width, image) => width + image.width, 0);
    const visibleSubjects = entities().filter(subject => subject.visible);
    const legendHeight = visibleSubjects.length * 36;
    canvas.height = Math.max(...images.map(image => image.height)) + 100 + legendHeight;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#333';
    context.font = '600 28px sans-serif';
    context.fillText(filename, 24, 40);
    let left = 0;
    images.forEach((image, index) => {
      const title = sectionCharts[index].getDom().closest('article')?.querySelector('h3')?.textContent || '';
      context.font = '24px sans-serif';
      context.fillStyle = '#555';
      context.fillText(title, left + 24, 80);
      context.drawImage(image, left, 100);
      left += image.width;
    });
    context.font = '22px sans-serif';
    visibleSubjects.forEach((subject, index) => {
      const top = canvas.height - legendHeight + index * 36 + 22;
      context.fillStyle = subject.color;
      context.fillRect(24, top - 10, 22, 4);
      context.fillStyle = '#555';
      context.fillText(subject.name, 60, top);
    });
    canvas.toBlob(blob => { if (blob) download(`${filename}.png`, blob, 'image/png'); });
  }

  function bindUi(root) {
    root.querySelectorAll('[data-manager-time]').forEach(toolbar => {
      toolbar.querySelectorAll('[data-manager-period]').forEach(button => {
        button.onclick = () => { setPeriod(toolbar.dataset.managerTime, button.dataset.managerPeriod); render(); };
      });
      const more = toolbar.querySelector('[data-manager-more]');
      const panel = toolbar.querySelector('.zc-more-panel');
      const open = () => { panel.hidden = false; more.setAttribute('aria-expanded', 'true'); };
      const close = () => { panel.hidden = true; more.setAttribute('aria-expanded', 'false'); };
      more.onclick = () => panel.hidden ? open() : close();
      more.onmouseenter = open;
      toolbar.querySelector('.zc-quick-wrap').onmouseleave = close;
      toolbar.onkeydown = event => { if (event.key === 'Escape') { close(); more.focus(); } };
    });
    root.querySelectorAll('[data-manager-field]').forEach(button => {
      button.onclick = () => { range(button.dataset.managerScope)[button.dataset.managerField] = button.dataset.managerValue; render(); };
    });
    root.querySelectorAll('[data-analysis-download], [data-risk-download]').forEach(button => {
      button.onclick = () => {
        const section = button.closest('section');
        const title = section.querySelector('h2')?.childNodes[0]?.textContent || '经理对比';
        const hasChart = charts.some(chart => section.contains(chart.getDom()));
        if (button.dataset.analysisDownload === 'image' || (hasChart && !section.querySelector('table'))) exportImage(section, title);
        else exportTable(section, title);
      };
    });
    root.querySelectorAll('[data-analysis-refresh], [data-risk-refresh]').forEach(button => {
      button.onclick = () => { button.setAttribute('aria-busy', 'true'); setTimeout(render, 250); };
    });
  }
  const ui = { range, timeControls, setting, bind: bindUi };

  function productPicker(manager) {
    const product = selectedProduct(manager);
    return `<details class="manager-product"><summary aria-label="${manager.name}的代表基金"><span class="manager-product-title">${escape(product.name)}<img src="${assets}down.svg" width="20" height="20" alt=""></span><span class="manager-product-meta"><span>${product.code}　${product.type}</span><span>任期回报 <b class="${product.tenureReturn < 0 ? 'negative' : 'positive'}">${product.tenureReturn.toFixed(2)}%</b></span></span></summary><div class="manager-product-options" role="listbox" aria-label="${manager.name}的代表基金选项">${manager.products.map(item => `<button type="button" role="option" aria-selected="${item.code === product.code}" data-manager-product="${manager.id}" data-product-code="${item.code}"><span>${escape(item.name)}</span><small>${item.code}　${item.type}<b class="${item.tenureReturn < 0 ? 'negative' : 'positive'}">${item.tenureReturn.toFixed(2)}%</b></small></button>`).join('')}</div></details>`;
  }

  function cards() {
    return `<div class="zc-fund-row"><div class="manager-pk"><img class="manager-pk-background" src="${assets}background.svg" alt=""><span>经理<img src="${assets}pk.svg" width="33" height="17.314" alt="PK"></span></div><div class="zc-fund-slots">${Array.from({ length: 4 }, (_, index) => {
      const manager = managers[index];
      if (!manager) return `<article class="zc-fund zc-search-slot manager-slot"><label class="zc-search"><input type="text" data-manager-search="${index}" placeholder="输入基金经理姓名" aria-label="搜索基金经理" autocomplete="off" role="combobox" aria-expanded="false"><span class="zc-search-icon">${img('search-focus', 20)}</span></label><div class="manager-search-results" id="manager-results-${index}" role="listbox" hidden></div></article>`;
      const pinned = referenceId === manager.id;
      return `<article class="zc-fund manager-slot ${manager.visible ? '' : 'is-hidden'} ${pinned ? 'is-reference' : ''}" style="--series:${manager.color}">${pinned ? `<button type="button" class="zc-reference-badge" data-manager-pin="${manager.id}" aria-label="取消参照 ${manager.name}">${img('reference-pin')}<span>参照</span></button>` : ''}<div class="zc-card-tools"><div>${pinned ? '' : `<button type="button" data-manager-pin="${manager.id}" aria-label="钉住参照 ${manager.name}"><img src="./assets/compare-figma/47-50726_imgProperty3.svg" width="14" height="14" alt=""></button><button type="button" data-manager-eye="${manager.id}" aria-label="${manager.visible ? '隐藏' : '显示'} ${manager.name}" aria-pressed="${manager.visible}">${img(`eye-${manager.visible ? 'visible' : 'hidden'}`)}</button>`}</div><button type="button" data-manager-remove="${manager.id}" aria-label="移除 ${manager.name}"><img src="./assets/compare-figma/47-50726_imgFrame2036082637.svg" width="14" height="14" alt=""></button></div><div class="manager-identity"><i aria-hidden="true"></i><strong>${escape(manager.name)}</strong><span>${manager.type}</span></div>${mode === 'representative' ? productPicker(manager) : ''}</article>`;
    }).join('')}</div></div>`;
  }

  function navigation() {
    const labels = mode === 'comprehensive' ? ['人物概览比较', '收益与风险比较', '资产配置比较'] : ['产品概览比较', '收益与风险比较', '资产配置比较', '收益归因比较'];
    return `<div class="zc-controls manager-controls"><div class="zc-tabs" role="tablist" aria-label="经理比较模式">${[['comprehensive', '综合比较'], ['representative', '代表产品比较']].map(([key, label]) => `<button type="button" role="tab" data-manager-mode="${key}" aria-selected="${mode === key}" class="${mode === key ? 'active' : ''}">${label}</button>`).join('')}</div><div class="manager-subtabs" role="tablist" aria-label="比较维度">${labels.map((label, index) => `<button type="button" role="tab" data-manager-tab="${index}" aria-selected="${tabs[mode] === index}" class="${tabs[mode] === index ? 'selected' : ''}">${label}</button>`).join('')}</div>${mode === 'representative' && tabs[mode] === 3 ? `<button class="zc-reference-toggle ${showDifferences ? 'is-on' : ''}" type="button" role="switch" data-manager-differences aria-label="参照差值" aria-checked="${showDifferences}">${img('reference-toggle', 22)}参照差值</button>` : ''}</div>`;
  }

  function empty() {
    return `<div class="zc-design-empty"><div class="zc-illustration"><div class="zc-illustration-art">${['img', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6'].map((file, index) => `<span class="zc-art-layer layer-${index}"><img src="./assets/compare-final/51-57569_${file}.svg" alt="">${index === 5 ? '<span class="zc-badge-plus"><i></i><i></i></span>' : ''}</span>`).join('')}</div></div><p>请选择 <strong>2–4位</strong> 基金经理进行比较</p></div>`;
  }

  function moduleView() {
    if (tabs[mode] === 0) return window.ManagerOverviewView;
    if (mode === 'comprehensive') return tabs[mode] === 1 ? window.ManagerRiskView : window.ManagerAllocationView;
    return tabs[mode] === 2 ? window.CompareAllocationView : tabs[mode] === 3 ? window.CompareAttributionView : window.CompareRiskView;
  }

  function render() {
    if (!host || !document.body.classList.contains('zc-manager-mode')) return;
    charts.forEach(chart => { if (!chart.isDisposed()) chart.dispose(); });
    charts = [];
    const selector = `<section class="zc-selector">${cards()}<div class="zc-actions"><button type="button" class="zc-primary" data-manager-start ${managers.length < 2 ? 'disabled' : ''}>开始比较</button><button type="button" class="zc-secondary" data-manager-clear>清空</button><button type="button" class="zc-secondary" data-manager-export ${compared ? '' : 'disabled'}>导出对比</button></div></section>`;
    const view = moduleView();
    const params = options();
    let content = '';
    if (compared) {
      if (mode === 'representative' && tabs[mode] === 1) {
        Object.assign(params, riskOptions(), {
          series: window.CompareRiskCharts.data(riskOptions()),
          seriesBySection: Object.fromEntries(['overview', 'interval', 'forecast', 'rolling', 'drawdown', 'metrics'].map(key => [`risk-${key}`, window.CompareRiskCharts.data(riskOptions(key))])),
        });
      }
      content = `<div class="zc-results-card"><div class="zc-content">${view.render(params)}</div></div>`;
    } else content = empty();
    host.innerHTML = `<div class="zc-compare zc-manager ${compared ? 'has-results' : 'is-empty'} ${mode === 'representative' ? 'is-representative' : ''}">${compared ? '<div class="zc-sticky-region"><div class="zc-sticky-panel">' : '<div class="manager-initial-panel">'}${selector}${navigation()}</div>${compared ? '</div>' : ''}${content}</div>`;
    bind();
    if (compared) {
      charts = mode === 'representative' && tabs[mode] === 1
        ? window.CompareRiskCharts.mount(host, { ...params, sectionOptions: riskOptions })
        : view.mount?.(host, params) || [];
      view.bind?.(host, params);
      ui.bind(host);
    }
    showNotice();
  }

  function focusAfterRender(selector) {
    render();
    host.querySelector(selector)?.focus({ preventScroll: true });
  }

  function showNotice() {
    clearTimeout(noticeTimer);
    if (noticeUntil <= Date.now()) return;
    const notice = document.createElement('div');
    notice.className = 'zc-type-notice manager-type-notice';
    notice.setAttribute('role', 'status');
    notice.innerHTML = `<span class="zc-warning">!</span><span>主管基金类型不一致的经理不适合放在一起比较</span><button type="button" aria-label="关闭提示"><img src="./assets/compare-figma/47-50726_imgFrame2036082637.svg" width="14" height="14" alt=""></button>`;
    host.querySelector('.zc-selector').before(notice);
    notice.querySelector('button').onclick = () => { noticeUntil = 0; notice.remove(); };
    noticeTimer = setTimeout(() => { noticeUntil = 0; notice.remove(); }, noticeUntil - Date.now());
  }

  function closeSearch() {
    host?.querySelectorAll('.manager-search-results').forEach(panel => { panel.hidden = true; });
    host?.querySelectorAll('[data-manager-search]').forEach(input => input.setAttribute('aria-expanded', 'false'));
  }

  function bindSearch() {
    host.querySelectorAll('[data-manager-search]').forEach(input => {
      const panel = input.closest('article').querySelector('.manager-search-results');
      input.setAttribute('aria-controls', panel.id);
      const update = () => {
        closeSearch();
        const query = input.value.trim();
        const matches = catalog.filter(manager => !managers.some(item => item.id === manager.id) && `${manager.name}${manager.company}${manager.type}`.includes(query));
        panel.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        const highlight = value => escape(value).replaceAll(escape(query), query ? `<strong>${escape(query)}</strong>` : '');
        panel.innerHTML = matches.length ? matches.map(manager => `<button type="button" role="option" data-manager-add="${manager.id}"><span>${highlight(manager.name)}</span><span>${highlight(manager.company)}</span><small>${manager.type}</small></button>`).join('') : '<div class="zc-search-no-results">暂无匹配经理</div>';
        panel.querySelectorAll('[data-manager-add]').forEach(button => {
          button.onclick = event => {
            event.stopPropagation();
            const manager = catalog.find(item => item.id === button.dataset.managerAdd);
            const color = colors.find(value => !managers.some(item => item.color === value));
            managers.push({ ...manager, visible: true, color, order: nextOrder++, productCode: manager.products[0].code });
            if (new Set(managers.map(item => item.type)).size > 1) noticeUntil = Date.now() + 3000;
            focusAfterRender('[data-manager-search]');
            closeSearch();
          };
        });
      };
      input.onfocus = update;
      input.oninput = update;
      input.onkeydown = event => {
        if (event.isComposing) return;
        if (event.key === 'Escape') closeSearch();
        if (event.key === 'Enter' && !panel.hidden) { event.preventDefault(); panel.querySelector('button')?.click(); }
        if (event.key === 'ArrowDown') { event.preventDefault(); if (panel.hidden) update(); panel.querySelector('button')?.focus(); }
      };
      panel.onkeydown = event => {
        const buttons = [...panel.querySelectorAll('button')];
        const index = buttons.indexOf(document.activeElement);
        if (event.key === 'Escape') { input.focus(); closeSearch(); }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const next = index + (event.key === 'ArrowDown' ? 1 : -1);
          if (next < 0) input.focus(); else buttons[Math.min(next, buttons.length - 1)]?.focus();
        }
      };
      input.closest('article').onfocusout = event => { if (!input.closest('article').contains(event.relatedTarget)) closeSearch(); };
    });
  }

  function bind() {
    bindSearch();
    host.querySelectorAll('[data-manager-mode]').forEach(button => { button.onclick = () => { mode = button.dataset.managerMode; focusAfterRender(`[data-manager-mode="${mode}"]`); }; });
    host.querySelectorAll('[data-manager-tab]').forEach(button => { button.onclick = () => { tabs[mode] = Number(button.dataset.managerTab); focusAfterRender(`[data-manager-tab="${tabs[mode]}"]`); }; });
    host.querySelector('[data-manager-start]').onclick = () => { compared = managers.length >= 2; focusAfterRender(`[data-manager-tab="${tabs[mode]}"]`); };
    host.querySelector('[data-manager-clear]').onclick = () => { managers = []; compared = false; referenceId = null; noticeUntil = 0; Object.values(subjects).forEach(cache => cache.clear()); focusAfterRender('[data-manager-search]'); closeSearch(); };
    host.querySelector('[data-manager-export]').onclick = () => exportTable(host.querySelector('.zc-content'), '经理对比');
    host.querySelectorAll('[data-manager-remove]').forEach(button => { button.onclick = () => {
      managers = managers.filter(manager => manager.id !== button.dataset.managerRemove);
      if (referenceId === button.dataset.managerRemove) { referenceId = null; managers.sort((a, b) => a.order - b.order); }
      if (managers.length < 2) compared = false;
      focusAfterRender('[data-manager-search]');
      closeSearch();
    }; });
    host.querySelectorAll('[data-manager-pin]').forEach(button => { button.onclick = () => {
      referenceId = referenceId === button.dataset.managerPin ? null : button.dataset.managerPin;
      managers.sort((a, b) => a.order - b.order);
      const index = managers.findIndex(manager => manager.id === referenceId);
      if (index >= 0) managers.unshift(...managers.splice(index, 1));
      focusAfterRender(`[data-manager-pin="${button.dataset.managerPin}"]`);
    }; });
    host.querySelectorAll('[data-manager-eye]').forEach(button => { button.onclick = () => {
      const manager = managers.find(item => item.id === button.dataset.managerEye);
      manager.visible = !manager.visible;
      if (manager.visible) window.ManagerOverviewView.resetFundVisibility(manager.id);
      if (manager.visible) Object.values(subjects).forEach(cache => { const entity = cache.get(manager.id); if (entity) window.CompareRiskCharts.resetFundVisibility(entity); });
      focusAfterRender(`[data-manager-eye="${manager.id}"]`);
    }; });
    host.querySelectorAll('[data-manager-product]').forEach(button => { button.onclick = () => {
      const manager = managers.find(item => item.id === button.dataset.managerProduct);
      manager.productCode = button.dataset.productCode;
      render();
    }; });
    host.querySelectorAll('[data-risk-view]').forEach(button => { button.onclick = () => { riskView = button.dataset.riskView; render(); }; });
    host.querySelector('[data-manager-differences]')?.addEventListener('click', () => { showDifferences = !showDifferences; render(); });
  }

  document.addEventListener('click', event => {
    if (!document.body.classList.contains('zc-manager-mode')) return;
    if (!event.target.closest('.zc-search-slot')) closeSearch();
    host.querySelectorAll('details[open]').forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
    host.querySelectorAll('[data-manager-time]').forEach(toolbar => { if (!toolbar.contains(event.target)) { toolbar.querySelector('.zc-more-panel').hidden = true; toolbar.querySelector('[data-manager-more]').setAttribute('aria-expanded', 'false'); } });
  });
  window.addEventListener('resize', () => charts.forEach(chart => { if (!chart.isDisposed()) chart.resize(); }));
  window.ManagerCompareView = {
    render(target) { host = target; window.CompareView.prepareHeader(target); render(); },
    dispose() {
      charts.forEach(chart => { if (!chart.isDisposed()) chart.dispose(); });
      charts = [];
      clearTimeout(noticeTimer);
    },
  };
})();
