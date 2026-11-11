(() => {
  const assets = './assets/compare-attribution/';
  const defaultRange = { start: '2026-11-05', end: '2026-11-06', period: '近1年', disabled: true };
  const industries = [
    { name: '电子', stock: [[23.45, 18.64], [27.68, 17.42]], brinson: [[.42, 1.24, 1.66], [.55, .97, 1.52]], ranks: [1, 2] },
    { name: '公用事业', stock: [[10.80, 6.28], [8.35, 7.86]], brinson: [[.18, .26, .44], [.10, .41, .51]], ranks: [5, 5], stockRanks: [5, null] },
    { name: '食品饮料', stock: [[13.72, -4.35], [11.94, -6.24]], brinson: [[-.24, -.62, -.86], [-.30, -.48, -.78]] },
    { name: '有色金属', stock: [[9.81, 12.72], [12.86, 21.38]], brinson: [[.35, .84, 1.19], [.46, 1.12, 1.58]], ranks: [2, 1] },
    { name: '银行', stock: [[12.93, 8.56], [11.38, 10.62]], brinson: [[.12, .38, .50], [.08, .56, .64]], ranks: [4, 3] },
    { name: '综合', stock: [[2.06, -1.84], [2.06, -1.84]], brinson: [[-.05, -.09, -.14], [-.05, -.09, -.14]] },
    { name: '石油石化', stock: [[7.54, 3.92], [6.12, 5.67]], brinson: [[.08, .17, .25], [.13, .12, .25]] },
    { name: '商贸零售', stock: [[4.12, -6.18], [5.23, -3.45]], brinson: [[-.16, -.28, -.44], [-.10, -.34, -.44]] },
    { name: '煤炭', stock: [[5.07, 10.35], [3.91, 8.96]], brinson: [[.26, .51, .77], [.19, .43, .62]], ranks: [3, 4], stockRanks: [3, 5] },
    { name: '美容护理', stock: [[3.24, -2.76], [4.08, -4.13]], brinson: [[-.04, -.14, -.18], [-.06, -.10, -.16]] },
    { name: '交通运输', stock: [[7.26, 5.14], [6.39, 9.24]], brinson: [[.10, .22, .32], [.14, .35, .49]], stockRanks: [null, 4] },
  ];
  const industryOptions = ['申万一级行业', '申万二级行业', '中信一级行业'];
  const benchmarkOptions = ['沪深300', '中证500', '中证800', '中证全指'];
  const state = {
    stockIndustry: industryOptions[0], brinsonIndustry: industryOptions[0],
    brinsonBenchmark: benchmarkOptions[0], factorBenchmark: benchmarkOptions[0],
    sort: { stock: null, brinson: null },
    expanded: new Set(['total']),
  };
  const styleFactors = [
    ['贝塔', [2.54, 2.32]], ['动量', [-.55, -.32]], ['规模', [2.64, 2.85]], ['盈利', [-.82, -.64]], ['波动', [-.39, -.26]],
    ['成长', [.06, .14]], ['价值', [.33, .40]], ['杠杆', [-.02, -.06]], ['流动性', [-.38, -.39]], ['中盘', [.05, .06]],
  ];
  let binding;
  let tableResize;

  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const icon = name => `<img src="${assets}${name}.svg" alt="">`;
  const slots = funds => Array.from({ length: 4 }, (_, i) => funds[i]);
  const scopeFor = key => `attribution-${key}`;

  function periodScale(key, options) {
    const range = options.ui?.range?.(scopeFor(key)) || defaultRange;
    const periods = { '近1月': .16, '近3月': .36, '近6月': .62, '近1年': 1, '近3年': 1.7, '今年以来': .88, '共同时段': 1.15 };
    if (range.period !== '自定义') return periods[range.period] || 1;
    return Math.max(.01, Math.min(3, (Date.parse(range.end) - Date.parse(range.start) + 86400000) / (365 * 86400000)));
  }

  function referenceFund(options) {
    return options.funds.find(fund => fund?.id === options.referenceId);
  }

  function profileValues(values, fund) {
    if (!fund || fund.id === 'c') return values[0].map(() => null);
    return values[fund.id === 'b' ? 1 : 0];
  }

  function comparisonCell(fund, value, referenceValue, options, settings = {}) {
    const reference = referenceFund(options);
    const isReference = Boolean(reference && fund?.id === reference.id);
    const compared = Boolean(reference && fund && !isReference);
    const classes = [isReference ? 'is-reference' : '', compared ? 'has-difference' : '', settings.summary ? 'is-summary' : ''].filter(Boolean).join(' ');
    if (!fund?.visible) return `<td class="${classes}"></td>`;
    if (!Number.isFinite(value)) return `<td class="${classes}"><span class="zc-attr-missing">--</span></td>`;
    const roundedValue = Math.round(value * 100) / 100;
    const numberClass = `zc-attr-number${roundedValue < 0 ? ' is-negative' : ''}${settings.positive && roundedValue > 0 ? ' is-positive' : ''}`;
    const rank = settings.rank ? `<img class="zc-attr-rank rank-${settings.rank}" src="${assets}rank-${settings.rank}.png" width="20" alt="排名第${settings.rank}">` : '';
    let difference = '';
    if (compared) {
      const delta = Number.isFinite(referenceValue) ? Math.round((value - referenceValue) * 100) / 100 : null;
      const text = delta === null ? '--' : `${delta > 0 ? '+' : ''}${delta.toFixed(2)}pp`;
      const shown = options.showDifferences !== false;
      difference = `<span class="zc-attr-difference" data-attr-difference="${delta ?? ''}" aria-hidden="${!shown}"${delta === null && shown ? ' title="参照基金暂无数据，无法计算差值"' : ''}>${shown ? text : ''}</span>`;
    }
    return `<td class="${classes}">${rank}<span class="zc-attr-value-pair"><span class="${numberClass}" data-attr-value="${roundedValue}">${roundedValue.toFixed(2)}%</span>${difference}</span></td>`;
  }

  function fundCells(fund, values, referenceValues, options, settings = {}) {
    return values.map((value, i) => comparisonCell(fund, value, referenceValues[i], options, {
      positive: settings.positiveIndex === i,
      rank: settings.rankIndex === i ? settings.rank : null,
      summary: settings.summary,
    })).join('');
  }

  function select(field, label, options) {
    return `<details class="zc-attr-select"><summary aria-label="${label} ${escape(state[field])}" aria-haspopup="listbox"><span>${label}</span><strong>${escape(state[field])}</strong>${icon('down')}</summary><div class="zc-attr-menu" role="listbox" aria-label="${label}">${options.map(value => `<button type="button" role="option" aria-selected="${state[field] === value}" data-attr-field="${field}" data-attr-choice="${escape(value)}">${escape(value)}</button>`).join('')}</div></details>`;
  }

  function heading(key, title, options) {
    const descriptions = {
      stock: '按行业查看各基金的平均配置权重和累计收益。角标分别标识各基金收益排名前五的行业。',
      brinson: '将相对基准的超额收益拆分为行业配置效应和选股效应。',
      factor: '将股票组合收益拆分为全A因子、风格因子、行业因子和个股选择收益。',
    };
    const filters = key === 'stock' ? select('stockIndustry', '行业', industryOptions)
      : key === 'brinson' ? select('brinsonBenchmark', '基准', benchmarkOptions) + select('brinsonIndustry', '行业', industryOptions)
      : select('factorBenchmark', '基准', benchmarkOptions);
    return `<div class="zc-section-head zc-attr-head"><h2>${title}<span class="zc-attr-help"><button type="button" aria-label="${title}说明" aria-describedby="zc-attr-help-${key}">${icon('help')}</button><span role="tooltip" id="zc-attr-help-${key}">${descriptions[key]}</span></span></h2><div class="zc-attr-toolbar">${filters}${options.ui?.timeControls?.(scopeFor(key), defaultRange) || ''}<div class="zc-attr-actions"><button type="button" class="zc-text" data-analysis-download="${scopeFor(key)}" aria-label="下载${title}"><span class="zc-action-icon zc-download-icon" aria-hidden="true"></span>下载</button><button type="button" class="zc-text" data-analysis-refresh="${scopeFor(key)}" aria-label="刷新${title}"><span class="zc-action-icon zc-refresh-icon" aria-hidden="true"></span>刷新</button></div></div></div>`;
  }

  function industryNames(key) {
    const selection = state[key === 'stock' ? 'stockIndustry' : 'brinsonIndustry'];
    if (selection === '申万二级行业') return ['半导体', '电力', '白酒', '工业金属', '国有大型银行', '综合', '石油开采', '一般零售', '煤炭开采', '化妆品', '物流'];
    if (selection === '中信一级行业') return ['电子', '电力及公用事业', '食品饮料', '有色金属', '银行', '综合', '石油石化', '商贸零售', '煤炭', '消费者服务', '交通运输'];
    return industries.map(row => row.name);
  }

  function rowValues(row, fund, key, scale) {
    const values = profileValues(row[key], fund);
    const benchmark = key === 'brinson' ? 1 + benchmarkOptions.indexOf(state.brinsonBenchmark) * .08 : 1;
    return values.map((value, i) => Number.isFinite(value) ? value * benchmark * (key === 'stock' && i === 0 ? 1 : scale) : null);
  }

  function sortState(key, funds) {
    const sort = state.sort[key];
    if (!sort) return null;
    const fund = sort.fundId ? funds.find(item => item?.id === sort.fundId) : funds[sort.fund];
    if (!fund) {
      state.sort[key] = null;
      return null;
    }
    if (!sort.fundId) state.sort[key] = { fundId: fund.id, metric: sort.metric, direction: sort.direction };
    return state.sort[key];
  }

  function sortedRows(key, funds, scale) {
    const names = industryNames(key);
    const rows = industries.map((row, i) => ({ ...row, label: names[i], index: i }));
    const sort = sortState(key, funds);
    if (!sort) return rows;
    const fund = funds.find(item => item?.id === sort.fundId);
    return rows.sort((a, b) => {
      const left = rowValues(a, fund, key, scale)[sort.metric];
      const right = rowValues(b, fund, key, scale)[sort.metric];
      return (sort.direction === 'asc' ? left - right : right - left) || a.index - b.index;
    });
  }

  function metricHeaders(key, options) {
    const { funds } = options;
    const reference = referenceFund(options);
    const labels = key === 'stock' ? ['行业权重均值', '行业累计收益'] : ['配置效应', '选股效应', '超额收益'];
    const sort = sortState(key, funds);
    return slots(funds).map((fund, fundIndex) => labels.map((label, metric) => {
      const active = sort?.fundId === fund?.id && sort?.metric === metric;
      const order = active ? `${sort.direction === 'asc' ? '升序' : '降序'}排列` : '未排序';
      return `<th scope="col" class="${reference && reference.id === fund?.id ? 'is-reference' : ''}" aria-sort="${active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}"><button type="button" class="zc-attr-sort ${active ? `is-${sort.direction}` : ''}" data-attr-sort="${key}" data-attr-fund="${escape(fund?.id || '')}" data-attr-metric="${metric}" aria-label="${escape(fund?.name || `基金${fundIndex + 1}`)} ${label} ${order}" ${fund?.visible && fund.id !== 'c' ? '' : 'disabled'}><span>${label}</span>${icon(active ? 'sort-desc' : 'sort')}</button></th>`;
    }).join('')).join('');
  }

  function industryTable(key, options) {
    const scale = periodScale(key, options);
    const metricCount = key === 'stock' ? 2 : 3;
    const funds = slots(options.funds);
    const reference = referenceFund(options);
    const rows = sortedRows(key, funds, scale).map(row => {
      const referenceValues = rowValues(row, reference, key, scale);
      return `<tr><th scope="row">${escape(row.label)}</th>${funds.map(fund => {
        const profile = fund?.id === 'b' ? 1 : 0;
        const ranks = key === 'stock' ? row.stockRanks || row.ranks : row.ranks;
        return fundCells(fund, rowValues(row, fund, key, scale), referenceValues, options, { rankIndex: metricCount - 1, rank: ranks?.[profile] });
      }).join('')}</tr>`;
    }).join('');
    const summaryValues = [[1.02, 2.49, 3.51], [1.14, 2.95, 4.09]];
    const scaledSummary = fund => profileValues(summaryValues, fund).map(value => Number.isFinite(value) ? value * scale * (1 + benchmarkOptions.indexOf(state.brinsonBenchmark) * .08) : null);
    const summary = key === 'brinson' ? `<tr class="zc-attr-summary"><th scope="row">合计</th>${funds.map(fund => fundCells(fund, scaledSummary(fund), scaledSummary(reference), options, { summary: true })).join('')}</tr>` : '';
    return `<div class="zc-attr-scroll" tabindex="0" role="region" aria-label="${key === 'stock' ? '股票资产收益贡献' : 'Brinson归因'}表格，可纵向滚动"><table class="zc-attr-table zc-attr-${key}-table" data-attr-table="${key}"><colgroup><col class="zc-attr-label-col">${'<col>'.repeat(4 * metricCount)}</colgroup><thead><tr><th scope="col">行业</th>${metricHeaders(key, options)}</tr>${summary}</thead><tbody>${rows}</tbody></table></div>`;
  }

  function factorRows() {
    const industryFactors = [['电子', [.12, .31]], ['公用事业', [.08, .20]], ['食品饮料', [.04, .10]]];
    const details = (prefix, rows) => rows.map(([label, values]) => ({ id: `${prefix}-${label}`, label, values, level: 3 }));
    return [
      { id: 'total', label: '总收益', values: [6.63, 7.18], level: 1, children: [
        { id: 'total-all', label: '全A因子', values: [5.07, 5.07], level: 2 },
        { id: 'total-style', label: '风格因子', values: [3.46, 4.10], level: 2, children: details('total-style', styleFactors) },
        { id: 'total-industry', label: '行业因子', values: [.24, .61], level: 2, children: details('total-industry', industryFactors) },
        { id: 'total-selection', label: '个股选择', values: [-2.14, -2.60], level: 2 },
      ] },
      { id: 'active', label: '主动性收益', values: [6.26, 6.81], level: 1, children: [
        { id: 'active-all', label: '全A因子', values: [0, 0], level: 2 },
        { id: 'active-style', label: '风格因子', values: [4.87, 5.51], level: 2, children: details('active-style', styleFactors.map(([label, values]) => [label, [values[0] * 4.87 / 3.47, values[1] * 5.51 / 4.11]])) },
        { id: 'active-industry', label: '行业因子', values: [1.52, 1.89], level: 2, children: details('active-industry', industryFactors.map(([label, values]) => [label, [values[0] * 1.52 / .24, values[1] * 1.89 / .61]])) },
        { id: 'active-selection', label: '个股选择', values: [-.13, -.59], level: 2 },
      ] },
    ];
  }

  function factorTable(options) {
    const funds = slots(options.funds);
    const scale = periodScale('factor', options) * (1 + benchmarkOptions.indexOf(state.factorBenchmark) * .08);
    const reference = referenceFund(options);
    const scaledValue = (row, fund) => {
      const value = profileValues(row.values.map(value => [value]), fund)[0];
      return Number.isFinite(value) ? value * scale : null;
    };
    function renderRows(rows) {
      return rows.map(row => {
        const expanded = state.expanded.has(row.id);
        const label = row.children ? `<button type="button" class="zc-attr-expand" data-attr-expand="${row.id}" aria-expanded="${expanded}" aria-label="${expanded ? '收起' : '展开'}${row.label}">${icon('tree-open')}<span>${row.label}</span></button>` : `<span class="zc-attr-factor-label">${row.label}</span>`;
        const referenceValue = scaledValue(row, reference);
        return `<tr class="zc-attr-level-${row.level}" data-attr-row="${row.id}"${row.children ? ` data-attr-expand-row="${row.id}"` : ''}><th scope="row">${label}</th>${funds.map(fund => comparisonCell(fund, scaledValue(row, fund), referenceValue, options, { positive: true })).join('')}</tr>${row.children && expanded ? renderRows(row.children) : ''}`;
      }).join('');
    }
    return `<div class="zc-attr-factor-wrap"><table class="zc-attr-table zc-attr-factor-table" aria-label="股票组合的收益因子分解"><colgroup><col class="zc-attr-label-col">${'<col>'.repeat(4)}</colgroup><tbody>${renderRows(factorRows())}</tbody></table></div>`;
  }

  function section(key, options) {
    const titles = { stock: '股票资产收益贡献', brinson: 'Brinson归因', factor: '股票组合的收益因子分解' };
    return `<section class="zc-attr-section" data-analysis-section="${scopeFor(key)}">${heading(key, titles[key], options)}${key === 'factor' ? factorTable(options) : industryTable(key, options)}</section>`;
  }

  function render(options) {
    return `<div class="zc-attribution-view${referenceFund(options) ? ' has-reference' : ''}${options.showDifferences === false ? ' hide-differences' : ''}">${['stock', 'brinson', 'factor'].map(key => section(key, options)).join('')}</div>`;
  }

  function replaceSection(key, root, options) {
    const current = root.querySelector(`[data-analysis-section="${scopeFor(key)}"]`);
    if (!current) return;
    const scroll = current.querySelector('.zc-attr-scroll');
    const scrollTop = scroll?.scrollTop || 0;
    if (scroll) tableResize?.unobserve(scroll);
    current.outerHTML = section(key, options);
    const replacement = root.querySelector(`[data-analysis-section="${scopeFor(key)}"]`);
    const nextScroll = replacement.querySelector('.zc-attr-scroll');
    if (nextScroll) {
      nextScroll.scrollTop = scrollTop;
      tableResize?.observe(nextScroll);
    }
    sizeTable(replacement);
    options.ui?.bind?.(replacement);
  }

  function sizeTable(root) {
    root.querySelectorAll('.zc-attr-scroll').forEach(scroll => {
      const header = scroll.querySelector('thead');
      const firstRow = scroll.querySelector('tbody tr');
      scroll.style.setProperty('--zc-attr-fixed-height', `${header.offsetHeight}px`);
      scroll.style.setProperty('--zc-attr-row-height', `${firstRow?.offsetHeight || 45}px`);
    });
  }

  function mount(root, options) {
    binding?.abort();
    tableResize?.disconnect();
    binding = new AbortController();
    sizeTable(root);
    tableResize = new ResizeObserver(() => sizeTable(root));
    root.querySelectorAll('.zc-attr-scroll').forEach(scroll => tableResize.observe(scroll));
    root.addEventListener('click', event => {
      const choice = event.target.closest('[data-attr-choice]');
      if (choice) {
        const field = choice.dataset.attrField;
        state[field] = choice.dataset.attrChoice;
        replaceSection(field.startsWith('stock') ? 'stock' : field.startsWith('brinson') ? 'brinson' : 'factor', root, options);
      }
      const sortButton = event.target.closest('[data-attr-sort]');
      if (sortButton && !sortButton.disabled) {
        const key = sortButton.dataset.attrSort;
        const fundId = sortButton.dataset.attrFund;
        const metric = Number(sortButton.dataset.attrMetric);
        const previous = sortState(key, options.funds);
        const same = previous?.fundId === fundId && previous?.metric === metric;
        state.sort[key] = same && previous.direction === 'asc' ? null : { fundId, metric, direction: same ? 'asc' : 'desc' };
        replaceSection(key, root, options);
        root.querySelector(`[data-attr-sort="${key}"][data-attr-fund="${fundId}"][data-attr-metric="${metric}"]`)?.focus({ preventScroll: true });
      }
      const expand = event.target.closest('[data-attr-expand], [data-attr-expand-row]');
      if (expand) {
        const id = expand.dataset.attrExpand || expand.dataset.attrExpandRow;
        state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id);
        replaceSection('factor', root, options);
        root.querySelector(`[data-attr-expand="${id}"]`)?.focus({ preventScroll: true });
      }
      root.querySelectorAll('.zc-attr-select[open]').forEach(details => {
        if (!details.contains(event.target)) details.open = false;
      });
    }, { signal: binding.signal });
    root.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      root.querySelectorAll('.zc-attr-select[open]').forEach(details => {
        details.open = false;
        details.querySelector('summary').focus();
      });
    }, { signal: binding.signal });
    return [];
  }

  window.CompareAttributionView = { render, mount };
})();
