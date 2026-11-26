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
    { id: 'c', name: '孟棋', company: '景顺长城基金管理有限公司', type: '偏股型', profileIndex: 2, products: [
      { code: '002244', name: '景顺长城低碳科技主题灵活配置混合A', type: '混合型', tenureReturn: 15.75 },
      { code: '000059', name: '景顺长城优信增利债券A', type: '债券型', tenureReturn: 6.32 },
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
  let renderGeneration = 0;
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
      const representative = mode === 'representative';
      Object.assign(entity, manager, representative ? product : {}, {
        profileIndex: representative ? (manager.profileIndex + manager.products.indexOf(product)) % colors.length : manager.profileIndex,
        representativeFund: product, managerName: manager.name,
      });
      return entity;
    });
  }

  function options() {
    return { managers, funds: entities(), mode, referenceId, view: riskView, ui };
  }

  function riskOptions(section = 'overview') {
    const defaults = {
      overview: { start: '2024-01-01' },
      forecast: { period: '近3年', start: '2023-11-06', commonStart: '2025-12-09', holdingMonths: 3 },
      rolling: { period: '近1年', start: '2025-11-06', commonStart: '2025-12-09' },
      metrics: { benchmark: '上证综指', frequency: '原始频率' },
    };
    return { ...options(), ...range(`risk-${section}`, defaults[section]) };
  }

  function range(scope, initial = {}) {
    const key = `${mode}:${scope}`;
    if (!ranges.has(key)) {
      const value = { start: '2025-12-09', end: '2026-11-06', period: '共同时段', unit: '月', holdingMonths: 3, ...initial };
      value.defaultPeriod = value.period;
      value.commonStart ??= value.start;
      value.commonEnd ??= value.end;
      ranges.set(key, value);
    }
    return ranges.get(key);
  }

  function timeControls(scope, initial = {}) {
    const value = range(scope, initial);
    return window.ZhiceComparisonTime.markup(scope, value, {
      showDate: initial.showDate !== false,
    });
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
    if (!rows.length) return;
    const csv = rows.map(row => [...row.cells].map(cell => `"${cell.textContent.trim().replaceAll('"', '""')}"`).join(',')).join('\r\n');
    download(`${filename}.csv`, '\ufeff' + csv, 'text/csv;charset=utf-8');
  }

  function exportImage(section, filename) {
    const sectionCharts = charts.filter(chart => section.contains(chart.getDom()));
    if (!sectionCharts.length) { window.CompareAllocationView.exportTableImage(section, filename, download); return; }
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
    const tenures = managers.map(manager => {
      const dates = mode === 'representative' ? selectedProduct(manager) : manager;
      return { name: manager.name, start: dates.tenureStart, end: dates.tenureEnd };
    });
    window.ZhiceComparisonTime.bind(root, range, render, { tenures });
    root.querySelectorAll('[data-manager-field]').forEach(button => {
      button.onclick = () => { range(button.dataset.managerScope)[button.dataset.managerField] = button.dataset.managerValue; render(); };
    });
    root.querySelectorAll('[data-analysis-download], [data-risk-download]').forEach(button => {
      button.onclick = () => {
        const section = button.closest('section');
        const title = section.querySelector('h2')?.childNodes[0]?.textContent || '经理对比';
        const hasChart = charts.some(chart => section.contains(chart.getDom()));
        const format = button.dataset.analysisDownload || button.dataset.riskDownload;
        if (format === 'image' || (format !== 'table' && hasChart && !section.querySelector('table'))) exportImage(section, title);
        else exportTable(section, title);
      };
    });
    root.querySelectorAll('[data-analysis-refresh], [data-risk-refresh]').forEach(button => {
      button.onclick = () => {
        const section = button.closest('section');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        section.setAttribute('aria-busy', 'true');
        setTimeout(() => { if (section.isConnected) render(); }, 300);
      };
    });
  }
  const ui = { range, timeControls, setting, bind: bindUi };

  function productPicker(manager) {
    const product = selectedProduct(manager);
    const meta = item => `<span class="manager-product-meta"><span>${item.code}　${item.type}</span><span>任期回报 <b class="${item.tenureReturn < 0 ? 'negative' : 'positive'}">${item.tenureReturn.toFixed(2)}%</b></span></span>`;
    const choices = manager.products.map(item =>
      `<button type="button" role="option" aria-selected="${item.code === product.code}" data-manager-product="${manager.id}" data-product-code="${item.code}"><span>${escape(item.name)}</span>${meta(item)}</button>`
    ).join('');
    return `<details class="manager-product" data-manager-product-card="${manager.id}"><summary aria-label="${manager.name}的代表基金"><span class="manager-product-title"><span title="${escape(product.name)}">${escape(product.name)}</span><img src="${assets}down.svg" width="20" height="20" alt=""></span>${meta(product)}</summary><div class="manager-product-options" role="listbox" aria-label="${manager.name}的代表基金选项">${choices}</div></details>`;
  }

  function managerCard(manager) {
    const pinned = referenceId === manager.id;
    const product = mode === 'representative' ? selectedProduct(manager) : null;
    const pin = pinned
      ? `<button type="button" class="zc-reference-badge" data-manager-pin="${manager.id}" aria-label="取消参照 ${manager.name}">${img('reference-pin')}<span>参照</span></button>`
      : `<button type="button" data-manager-pin="${manager.id}" aria-label="钉住参照 ${manager.name}"><img src="./assets/compare-figma/47-50726_imgProperty3.svg" width="14" height="14" alt=""></button>`;
    return `<article class="zc-fund manager-slot ${manager.visible ? '' : 'is-hidden'} ${pinned ? 'is-reference' : ''}" style="--series:${manager.color}">
      <div class="zc-card-tools"><div>${pin}${pinned ? '' : `<button type="button" data-manager-eye="${manager.id}" aria-label="${manager.visible ? '隐藏' : '显示'} ${manager.name}" aria-pressed="${manager.visible}">${img(`eye-${manager.visible ? 'visible' : 'hidden'}`)}</button>`}</div><button type="button" data-manager-remove="${manager.id}" aria-label="移除 ${manager.name}"><img src="./assets/compare-figma/47-50726_imgFrame2036082637.svg" width="14" height="14" alt=""></button></div>
      <div class="manager-identity"><i aria-hidden="true"></i><strong class="manager-name">${escape(manager.name)}</strong>${product ? `<strong class="manager-compact-product" title="${escape(product.name)}">${escape(product.name)}</strong>` : ''}${manager.type ? `<span>${escape(manager.type)}</span>` : ''}</div>
      ${product ? manager.summaryOnly ? `<div class="manager-product"><span class="manager-product-title"><span title="${escape(product.name)}">${escape(product.name)}</span></span></div>` : productPicker(manager) : ''}
    </article>`;
  }

  function cards() {
    return `<div class="zc-fund-row"><div class="manager-pk" role="img" aria-label="经理 PK"><img class="manager-pk-logo" src="${assets}manager-pk-logo.png?v=2" width="72" height="25" alt=""></div><div class="zc-fund-slots">${Array.from({ length: 4 }, (_, index) => {
      const manager = managers[index];
      if (!manager) return `<article class="zc-fund zc-search-slot manager-slot"><label class="zc-search"><input type="text" data-manager-search="${index}" placeholder="输入基金经理姓名" aria-label="搜索基金经理" autocomplete="off" role="combobox" aria-expanded="false"><span class="zc-search-icon"><img src="./assets/compare-figma/47-50726_imgFrame.svg" width="20" height="20" alt=""><img class="is-focus" src="./assets/compare-controls/search-focus.svg" width="20" height="20" alt=""></span></label><div class="manager-search-results" id="manager-results-${index}" role="listbox" hidden></div></article>`;
      return managerCard(manager);
    }).join('')}</div></div>`;
  }

  function navigation() {
    const labels = mode === 'comprehensive' ? ['人物概览比较', '收益与风险比较', '资产配置比较'] : ['产品概览比较', '收益与风险比较', '资产配置比较', '收益归因比较'];
    return `<div class="zc-controls manager-controls"><div class="zc-tabs" role="tablist" aria-label="经理比较模式">${[['comprehensive', '综合比较'], ['representative', '代表产品比较']].map(([key, label]) => `<button type="button" role="tab" data-manager-mode="${key}" aria-selected="${mode === key}" class="${mode === key ? 'active' : ''}">${label}</button>`).join('')}</div><div class="manager-subtabs" role="tablist" aria-label="比较维度">${labels.map((label, index) => `<button type="button" role="tab" data-manager-tab="${index}" aria-selected="${tabs[mode] === index}" class="${tabs[mode] === index ? 'selected' : ''}">${label}</button>`).join('')}</div></div>`;
  }

  function empty() {
    return `<div class="zc-design-empty"><div class="zc-illustration"><div class="zc-illustration-art">${['img', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6'].map((file, index) => `<span class="zc-art-layer layer-${index}"><img src="./assets/compare-final/51-57569_${file}.svg" alt="">${index === 5 ? '<span class="zc-badge-plus"><i></i><i></i></span>' : ''}</span>`).join('')}</div></div><p>请选择 <strong>2–4位</strong> 基金经理进行比较</p></div>`;
  }

  function moduleView() {
    if (tabs[mode] === 0) return window.ManagerOverviewView;
    if (mode === 'comprehensive') return tabs[mode] === 1 ? window.ManagerRiskView : window.ManagerAllocationView;
    return tabs[mode] === 2 ? window.CompareAllocationView : tabs[mode] === 3 ? window.CompareAttributionView : window.CompareRiskView;
  }

  function summaryComparison() {
    const representative = mode === 'representative';
    const rows = representative ? [
      ['基金经理', manager => manager.name],
      ['代表基金', manager => selectedProduct(manager)?.name],
      ['现任公司', manager => manager.company],
      ['基金类型', manager => selectedProduct(manager)?.type],
    ] : [
      ['基金经理', manager => manager.name],
      ['现任公司', manager => manager.company],
      ['经理类型', manager => manager.type],
      ['管理年限', manager => manager.tenure == null ? null : `${manager.tenure}年`],
      ['在管规模', manager => manager.scale == null ? null : `${manager.scale}亿`],
      ['代表基金', manager => selectedProduct(manager)?.name],
    ];
    const tableRows = rows.map(([label, value]) => `<tr><th scope="row">${label}</th>${managers.map(manager => {
      const text = manager.visible ? value(manager) ?? '—' : '';
      return `<td class="${manager.id === referenceId ? 'is-reference' : ''}">${escape(text)}</td>`;
    }).join('')}</tr>`).join('');
    return `<div class="zc-manager-overview"><section><div class="zc-mo-head"><h2>${representative ? '代表基金信息' : '基金经理信息'}</h2></div><div class="zc-mo-table-wrap"><table class="zc-mo-table"><colgroup><col style="width:120px">${'<col>'.repeat(managers.length)}</colgroup><tbody>${tableRows}</tbody></table></div></section></div>`;
  }

  function render() {
    if (!host || !document.body.classList.contains('zc-manager-mode')) return;
    charts.forEach(chart => { if (!chart.isDisposed()) chart.dispose(); });
    charts = [];
    const ready = managers.length >= 2;
    const summaryOnly = managers.some(manager => manager.summaryOnly);
    const hasSummary = tabs[mode] === 0;
    const canExport = compared && (!summaryOnly || hasSummary);
    const selector = `<section class="zc-selector">${cards()}<div class="zc-actions"><button type="button" class="zc-primary" data-manager-start ${ready ? '' : 'disabled'}>开始比较</button><button type="button" class="zc-secondary" data-manager-clear>清空</button>${ready ? `<button type="button" class="zc-secondary" data-manager-export ${canExport ? '' : 'disabled'}>导出对比</button>` : ''}</div></section>`;
    const view = moduleView();
    let params;
    let content;
    if (compared) {
      if (summaryOnly) {
        content = hasSummary ? summaryComparison() : '<div class="zc-empty">所选基金经理暂无可比较的数据</div>';
      } else {
        params = options();
        if (mode === 'representative' && tabs[mode] === 1) {
          Object.assign(params, riskOptions(), {
            series: window.CompareRiskCharts.data(riskOptions()),
            seriesBySection: Object.fromEntries(['overview', 'interval', 'forecast', 'rolling', 'drawdown', 'metrics'].map(key => [`risk-${key}`, window.CompareRiskCharts.data(riskOptions(key))])),
          });
        }
        content = view.render(params);
      }
      content = `<div class="zc-results-card"><div class="zc-content">${content}</div></div>`;
    } else content = empty();
    host.innerHTML = `<div class="zc-compare zc-manager ${compared ? 'has-results' : 'is-empty'} ${mode === 'representative' ? 'is-representative' : ''}">${compared ? '<div class="zc-sticky-region"><div class="zc-sticky-panel">' : '<div class="manager-initial-panel">'}${selector}${navigation()}</div>${compared ? '</div>' : ''}${content}</div>`;
    bind();
    if (params) {
      charts = mode === 'representative' && tabs[mode] === 1
        ? window.CompareRiskCharts.mount(host, { ...params, sectionOptions: riskOptions })
        : view.mount?.(host, params) || [];
      view.bind?.(host, params);
      ui.bind(host);
    }
  }

  function focusAfterRender(selector) {
    render();
    host.querySelector(selector)?.focus({ preventScroll: true });
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
        const matches = catalog.filter(manager => !managers.some(item => item.id === manager.id) && manager.name.includes(query));
        panel.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        const highlight = value => query
          ? value.split(query).map(escape).join(`<strong>${escape(query)}</strong>`)
          : escape(value);
        panel.innerHTML = matches.length ? matches.map(manager => `<button type="button" role="option" data-manager-add="${manager.id}"><span>${highlight(manager.name)}</span><span>${escape(manager.company.replace(/管理有限公司$/, ''))}</span><small>${manager.type}</small></button>`).join('') : '<div class="zc-search-no-results">暂无匹配经理</div>';
        panel.querySelectorAll('[data-manager-add]').forEach(button => {
          button.onclick = event => {
            event.stopPropagation();
            const manager = catalog.find(item => item.id === button.dataset.managerAdd);
            const color = colors.find(value => !managers.some(item => item.color === value));
            managers.push({ ...manager, visible: true, color, order: nextOrder++, productCode: manager.products[0].code });
            focusAfterRender('[data-manager-search]');
            closeSearch();
          };
        });
      };
      input.onfocus = update;
      input.onclick = () => { if (panel.hidden) update(); };
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
    host.querySelector('[data-manager-clear]').onclick = () => {
      managers = [];
      compared = false;
      referenceId = null;
      nextOrder = 0;
      tabs.comprehensive = 0;
      tabs.representative = 0;
      Object.values(subjects).forEach(cache => cache.clear());
      focusAfterRender('[data-manager-clear]');
    };
    host.querySelector('[data-manager-export]')?.addEventListener('click', () => {
      const content = host.querySelector('.zc-content');
      if (content.querySelector('table')) exportTable(content, '经理对比');
      else exportImage(content, '经理对比');
    });
    host.querySelectorAll('[data-manager-remove]').forEach(button => { button.onclick = () => {
      managers = managers.filter(manager => manager.id !== button.dataset.managerRemove);
      if (referenceId === button.dataset.managerRemove) { referenceId = null; managers.sort((a, b) => a.order - b.order); }
      if (managers.length < 2) {
        compared = false;
        tabs.comprehensive = 0;
        tabs.representative = 0;
      }
      focusAfterRender('[data-manager-search]');
      closeSearch();
    }; });
    host.querySelectorAll('[data-manager-pin]').forEach(button => { button.onclick = () => {
      referenceId = referenceId === button.dataset.managerPin ? null : button.dataset.managerPin;
      managers.sort((a, b) => a.order - b.order);
      const index = managers.findIndex(manager => manager.id === referenceId);
      if (index >= 0) {
        managers[index].visible = true;
        managers.unshift(...managers.splice(index, 1));
      }
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
      focusAfterRender(`[data-manager-product-card="${manager.id}"] summary`);
    }; });
    host.querySelectorAll('[data-risk-view]').forEach(button => { button.onclick = () => { riskView = button.dataset.riskView; render(); }; });
  }

  document.addEventListener('click', event => {
    if (!document.body.classList.contains('zc-manager-mode')) return;
    if (!event.target.closest('.zc-search-slot')) closeSearch();
    host.querySelectorAll('details[open]').forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
  });
  window.addEventListener('resize', () => charts.forEach(chart => { if (!chart.isDisposed()) chart.resize(); }));

  function useManagers(entries) {
    managers = entries.map((manager, order) => ({
      ...manager, order, color: colors[order], visible: true, productCode: manager.products[0]?.code,
    }));
    nextOrder = managers.length;
    compared = managers.length >= 2;
    mode = 'comprehensive';
    referenceId = null;
    tabs.comprehensive = 0;
    tabs.representative = 0;
    riskView = 'chart';
    ranges.clear();
    Object.values(subjects).forEach(cache => cache.clear());
    managers.forEach(manager => window.ManagerOverviewView.resetFundVisibility(manager.id));
  }

  async function loadManagers(target, managerIds, generation) {
    target.innerHTML = '<div class="app-page" role="status">正在加载经理比较…</div>';
    let entries;
    try {
      const { getManagerListData } = await import('./manager-list-data.js?v=20261125-manager-screen');
      const data = getManagerListData();
      const rows = new Map(data.managers.map(manager => [manager.id, manager]));
      const companies = new Map(data.companies.map(company => [company.id, company.name]));
      const catalogIds = new Map(catalog.map(manager => [`compare:${manager.id}`, manager]));
      entries = [...new Set(managerIds)].map(id => rows.get(id)).filter(Boolean).slice(0, colors.length).map(row => {
        return catalogIds.get(row.id) ?? {
          ...row, company: companies.get(row.companyId), summaryOnly: true,
          products: row.product ? [{ name: row.product, type: row.productType }] : [],
        };
      });
    } catch (error) {
      if (generation !== renderGeneration) return;
      console.error('Selected managers could not be loaded', error);
      target.innerHTML = '<div class="app-page" role="status">经理比较加载失败，请刷新页面重试。</div>';
      return;
    }
    if (generation !== renderGeneration) return;
    useManagers(entries);
    render();
  }

  window.ManagerCompareView = {
    getCatalog() {
      return catalog.map(({ id, name, company, type, products }) => ({
        id, name, company, type, product: products[0]?.name ?? null, productType: products[0]?.type ?? null,
      }));
    },
    render(target, { managerIds } = {}) {
      const generation = ++renderGeneration;
      host = target;
      window.CompareView.prepareHeader(target);
      if (Array.isArray(managerIds)) return loadManagers(target, managerIds, generation);
      render();
    },
    dispose() {
      renderGeneration++;
      charts.forEach(chart => { if (!chart.isDisposed()) chart.dispose(); });
      charts = [];
    },
  };
})();
