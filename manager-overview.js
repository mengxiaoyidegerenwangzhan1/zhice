(() => {
  const assets = './assets/manager-overview/';
  const scope = 'manager-overview-performance';
  const defaultRange = { start: '2025-12-09', end: '2026-11-06', period: '共同时段', benchmark: '上证综指' };
  const benchmarks = ['上证综指', '沪深300', '中证500', '中证800', '中证1000'];
  const managerProfiles = {
    a: { rating: 3, scale: '1.46亿', years: 7, awards: '--', representativeFund: '尚正竞争优势混合A', fundRating: 3, annualizedReturn: 2.26, company: '尚正基金管理有限公司' },
    b: { rating: 1, scale: '324.99亿', years: 17, awards: '英华奖 (1次)', representativeFund: '国联安中证100指数(LOF)', fundRating: 2, annualizedReturn: 2.91, company: '国联安基金管理有限公司' },
    c: { rating: 1, scale: '12.07亿', years: 7, awards: '--', representativeFund: '景顺长城低碳科技主题灵活配置混合', fundRating: 2, annualizedReturn: 12.69, company: '景顺长城基金管理有限公司' },
  };
  const intervalLabels = ['今年以来', '近1月', '近3月', '近6月', '近1年', '近2年', '近3年', '近5年', '共同时段'];
  const intervalData = {
    a: [[-6.82, 526, 941], [2.38, 186, 1082], [-3.76, 438, 1036], [5.42, 267, 997], null, null, null, null, [-4.95, 412, 941]],
    b: [[2.46, 128, 623], [.21, 286, 658], [.74, 203, 646], [1.56, 156, 635], null, null, null, null, [2.81, 119, 623]],
    c: [[-9.35, 112, 168], [3.16, 42, 183], [-6.48, 128, 177], [8.73, 57, 172], null, null, null, null, [-7.62, 105, 168]],
    d: [[1.25, 192, 583], [.69, 211, 607], [-1.85, 309, 601], [3.66, 175, 590], null, null, null, null, [1.84, 201, 583]],
  };
  const anchors = [
    ['2022-01-01', 0], ['2022-10-01', -9], ['2023-06-01', 5], ['2023-11-01', -4],
    ['2024-05-01', 7], ['2024-10-01', 3], ['2025-05-01', 1], ['2025-11-01', -1],
    ['2025-12-08', 0], ['2026-01-05', 4], ['2026-01-25', 1], ['2026-02-09', -3],
    ['2026-03-10', 8], ['2026-04-01', 12], ['2026-04-21', 7], ['2026-05-08', 16],
    ['2026-06-04', 3], ['2026-06-28', 9], ['2026-07-16', 5], ['2026-08-10', 8],
    ['2026-09-05', 5], ['2026-10-14', -10], ['2026-11-06', -7],
  ].map(([day, value]) => [Date.parse(`${day}T12:00:00`), value]);
  const curveVisibility = new Map();
  let resizeObserver;

  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const visible = subject => subject && subject.visible !== false;
  const slots = subjects => Array.from({ length: 4 }, (_, index) => subjects[index]);
  const representativeMode = options => options.mode === 'representative';
  const subjectsFor = options => representativeMode(options) ? options.funds || [] : options.managers || [];
  const curveKey = (subject, kind, options) => `${representativeMode(options) ? 'fund' : 'manager'}:${subject.id}:${kind}`;
  const curveVisible = (subject, kind, options) => visible(subject) && curveVisibility.get(curveKey(subject, kind, options)) !== false;
  const percentage = value => `${Number(value).toFixed(2)}%`;

  function sampleProfile(subject, options) {
    const productCode = representativeMode(options) ? subject.productCode || subject.code || subject.representativeFund?.code : '';
    const key = String(productCode || subject.id);
    let seed = 0;
    for (const character of key) seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
    const knownIndex = ['a', 'b', 'c', 'd'].indexOf(subject.id);
    const managerIndex = Number.isInteger(subject.profileIndex) && subject.profileIndex >= 0 && subject.profileIndex < 4
      ? subject.profileIndex : knownIndex >= 0 ? knownIndex : seed % 4;
    if (!productCode) return { index: managerIndex, multiplier: 1, drift: 0, rankOffset: 0 };
    // Product-specific parameters keep the demonstration repeatable without a market-data feed.
    return { index: seed % 4, multiplier: .9 + seed % 21 / 100, drift: ((seed >>> 4) % 21 - 10) / 10, rankOffset: seed % 61 - 30 };
  }

  function profile(manager) {
    return { ...managerProfiles[manager.id], ...manager };
  }

  function stars(value, label) {
    if (!Number.isFinite(value)) return '<span class="zc-mo-missing">--</span>';
    return `<span class="zc-mo-stars" role="img" aria-label="${label}${value}星">${Array.from({ length: 5 }, (_, index) => `<img src="${assets}star-${index < value ? 'filled' : 'empty'}.svg" width="14.8" height="14.8" alt="">`).join('')}</span>`;
  }

  function numberText(value) {
    return escape(value ?? '--').replace(/(-?\d+(?:\.\d+)?)/g, '<span class="zc-mo-number">$1</span>');
  }

  function link(label, href) {
    return href ? `<a href="${escape(href)}">${escape(label)}</a>` : `<span class="zc-mo-link">${escape(label)}</span>`;
  }

  function dataTable(rows, options, { interval = false } = {}) {
    const subjects = slots(subjectsFor(options));
    return `<div class="zc-mo-table-wrap"><table class="zc-mo-table${interval ? ' zc-mo-interval-table' : ''}"><colgroup><col style="width:120px">${'<col>'.repeat(4)}</colgroup><tbody>${rows.map(row => `<tr><th scope="row">${row.label}</th>${subjects.map(subject => {
      const reference = subject && subject.id === options.referenceId;
      const content = visible(subject) ? row.cell(subject) : '';
      const best = interval && visible(subject) && row.bestIds?.has(subject.id);
      return `<td class="${reference ? 'is-reference' : ''}${best ? ' is-best' : ''}">${content}</td>`;
    }).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function managerInformation(options) {
    return dataTable([
      { label: '基金经理', cell: manager => link(manager.name, manager.href) },
      { label: '经理星级', cell: manager => stars(profile(manager).rating, '经理') },
      { label: '管理规模', cell: manager => numberText(profile(manager).scale) },
      { label: '管理年限', cell: manager => numberText(profile(manager).years == null ? '--' : `${profile(manager).years}年`) },
      { label: '获奖情况', cell: manager => numberText(profile(manager).awards) },
      { label: '代表基金', cell: manager => {
        const fund = profile(manager).representativeFund;
        const name = typeof fund === 'object' ? fund?.name : fund;
        const href = typeof fund === 'object' ? fund.href || (fund.code ? `#/fund/${fund.code}` : '') : '';
        return link(name || '--', href);
      } },
      { label: '基金星级(综合)', cell: manager => stars(profile(manager).fundRating, '基金') },
      { label: '管理以来年化', cell: manager => {
        const value = profile(manager).annualizedReturn;
        return Number.isFinite(value) ? `<span class="zc-mo-number${value < 0 ? ' is-negative' : ''}">${percentage(value)}</span>` : '--';
      } },
      { label: '基金公司', cell: manager => escape(profile(manager).company || '--') },
    ], options);
  }

  function fundInformation(options) {
    const fields = [
      ['基金代码', fund => numberText(fund.code)],
      ['基金简称', fund => link(fund.name, fund.href || (fund.code ? `#/fund/${fund.code}` : ''))],
      ['基金类型', fund => escape(fund.type || '--')],
      ['基金星级(综合)', fund => stars(fund.rating, '基金')],
      ['基金经理', fund => escape((options.managers || []).find(manager => manager.id === fund.id)?.name || '--')],
      ['经理星级(综合)', fund => stars(profile((options.managers || []).find(manager => manager.id === fund.id) || { id: fund.id }).rating, '经理')],
      ['基金公司', fund => escape(fund.company || '--')],
      ['成立日期', fund => numberText(fund.inceptionDate)],
      ['最新单位净值', fund => numberText(fund.nav)],
      ['最新规模', fund => numberText(fund.scale)],
      ['申购状态', fund => escape(fund.purchaseStatus || '--')],
      ['赎回状态', fund => escape(fund.redemptionStatus || '--')],
      ['管理费率', fund => numberText(fund.managementFee)],
      ['托管费率', fund => numberText(fund.custodyFee)],
      ['业绩比较基准', fund => escape(fund.benchmark || '--')],
    ];
    return dataTable(fields.map(([label, cell]) => ({ label, cell })), options);
  }

  function returnEntry(subject, row, options) {
    if (subject.intervalReturns) return subject.intervalReturns[row] ?? null;
    const sample = sampleProfile(subject, options);
    const entry = intervalData[['a', 'b', 'c', 'd'][sample.index]]?.[row];
    if (!entry) return null;
    const [value, rank, total] = entry;
    const duration = [.8, 1 / 12, .25, .5, 1, 2, 3, 5, 1][row];
    return [+(value * sample.multiplier + sample.drift * duration).toFixed(2), Math.max(1, Math.min(total, rank + sample.rankOffset)), total];
  }

  function intervalTable(options) {
    const subjects = subjectsFor(options);
    const reference = subjects.find(subject => subject.id === options.referenceId);
    const rows = intervalLabels.map((label, index) => {
      const values = subjects.filter(visible).map(subject => returnEntry(subject, index, options)?.[0]).filter(Number.isFinite);
      const maximum = values.length > 1 ? Math.max(...values) : null;
      return {
        label,
        bestIds: new Set(subjects.filter(subject => returnEntry(subject, index, options)?.[0] === maximum).map(subject => subject.id)),
        cell(subject) {
          const entry = returnEntry(subject, index, options);
          if (!entry || !Number.isFinite(entry[0])) return '<span class="zc-mo-missing">--</span>';
          const [value, rank, total] = entry;
          const referenceValue = reference && returnEntry(reference, index, options)?.[0];
          const difference = Number.isFinite(referenceValue) ? value - referenceValue : null;
          const delta = reference && subject.id !== reference.id ? `<em class="zc-mo-difference">${difference === null ? '--' : `${difference > 0 ? '+' : ''}${difference.toFixed(2)}pp`}</em>` : '';
          return `<div class="zc-mo-return-value"><span class="zc-mo-number ${value < 0 ? 'is-negative' : 'is-positive'}">${percentage(value)}</span>${delta}</div><small>排名 <span class="zc-mo-number">${rank}</span> / <span class="zc-mo-number zc-mo-total">${total}</span></small>`;
        },
      };
    });
    return dataTable(rows, options, { interval: true });
  }

  function heading(title, key, options, { controls = false, download = false, help = '' } = {}) {
    const rangeDefaults = { ...defaultRange, commonLabel: representativeMode(options) ? '共同时段' : '共同任期' };
    const time = controls ? options.ui?.timeControls?.(scope, rangeDefaults) || '' : '';
    const labelTime = representativeMode(options) ? time : time.replace(/>共同时段</g, '>共同任期<');
    const setting = controls ? options.ui?.setting?.(scope, 'benchmark', '基准', benchmarks, defaultRange.benchmark) || '' : '';
    return `<div class="zc-mo-head"><h2>${title}${help ? `<span class="zc-mo-help"><button type="button" aria-label="${title}说明" aria-describedby="zc-mo-help"><img src="./assets/compare-controls/help.svg" width="16" height="16" alt=""></button><span id="zc-mo-help" role="tooltip">${help}</span></span>` : ''}</h2><div class="zc-mo-toolbar">${setting}${labelTime}<div class="zc-mo-actions">${download ? `<button type="button" data-analysis-download="${key}" aria-label="下载${title}" title="下载图片"><img src="${assets}picture-download.svg" width="18" height="18" alt=""></button>` : ''}<button type="button" data-analysis-refresh="${key}" aria-label="刷新${title}" title="刷新"><img src="${assets}refresh.svg" width="18" height="18" alt=""></button></div></div></div>`;
  }

  function legend(kind, options) {
    return `<div class="zc-mo-legend" role="group" aria-label="${kind === 'return' ? '收益走势' : '动态回撤'}图例">${subjectsFor(options).map(subject => {
      const shown = curveVisible(subject, kind, options);
      return `<button type="button" data-manager-curve="${escape(subject.id)}" data-manager-kind="${kind}" aria-pressed="${shown}" aria-label="${shown ? '隐藏' : '显示'} ${escape(subject.name)} ${kind === 'return' ? '收益走势' : '动态回撤'}曲线" class="${shown ? '' : 'is-hidden'}${subject.id === options.referenceId ? ' is-reference' : ''}"${visible(subject) ? '' : ' disabled'}><i style="background:${shown ? subject.color : '#999'}" aria-hidden="true"></i><span>${escape(subject.name)}</span></button>`;
    }).join('')}</div>`;
  }

  function render(options) {
    return `<div class="zc-manager-overview"><section data-analysis-section="${scope}">${heading('业绩走势', scope, options, { controls: true, download: true, help: '展示所选经理在共同任期内的收益走势与动态回撤，可通过图例单独显示或隐藏曲线。' })}<div class="zc-mo-charts">${[['return', '收益走势'], ['drawdown', '动态回撤']].map(([kind, title]) => `<article><h3>${title}</h3><div class="zc-mo-chart" data-manager-chart="${kind}" role="img" aria-label="${title}折线图"></div>${legend(kind, options)}</article>`).join('')}</div></section><section data-analysis-section="manager-overview-interval">${heading('区间收益', 'manager-overview-interval', options)}${intervalTable(options)}</section><section data-analysis-section="manager-overview-basic">${heading('基本信息', 'manager-overview-basic', options)}${representativeMode(options) ? fundInformation(options) : managerInformation(options)}</section></div>`;
  }

  function trend(when, index) {
    const found = anchors.findIndex((point, i) => i < anchors.length - 1 && when >= point[0] && when <= anchors[i + 1][0]);
    const interval = found < 0 ? (when < anchors[0][0] ? 0 : anchors.length - 2) : found;
    const first = anchors[interval], last = anchors[interval + 1];
    const progress = Math.max(0, Math.min(1, (when - first[0]) / (last[0] - first[0])));
    const day = (when - anchors[0][0]) / 86400000;
    return (first[1] + (last[1] - first[1]) * progress) * [1, .78, .60, .88][index] + Math.sin(day * .43 + index * .8) * .65 + Math.sin(day * .19 + index * .32) * .55 + Math.cos(day * .89 + index * .55) * .35;
  }

  function chartData(options) {
    const range = options.ui?.range?.(scope) || defaultRange;
    const start = Date.parse(`${range.start}T12:00:00`), end = Date.parse(`${range.end}T12:00:00`);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return { labels: [], byId: new Map() };
    const days = Math.round((end - start) / 86400000);
    const count = Math.min(320, days + 1);
    const dates = Array.from({ length: count }, (_, i) => start + (count === 1 ? 0 : Math.round(days * i / (count - 1)) * 86400000));
    const benchmark = Math.max(0, benchmarks.indexOf(range.benchmark)) * .14;
    const byId = new Map(subjectsFor(options).map(subject => {
      const sample = sampleProfile(subject, options);
      const initial = trend(start, sample.index);
      const values = dates.map((day, i) => +((trend(day, sample.index) - initial) * sample.multiplier + sample.drift * i / Math.max(1, count - 1) - Math.sin(i * .08) * benchmark).toFixed(2));
      let peak = 0;
      const drawdown = values.map(value => { peak = Math.max(peak, value); return +(value - peak).toFixed(2); });
      return [subject.id, { return: values, drawdown }];
    }));
    return { labels: dates.map(day => new Date(day).toISOString().slice(0, 10)), byId };
  }

  function tooltip(params, kind, options, data) {
    const points = Array.isArray(params) ? params : [params];
    const subjects = subjectsFor(options);
    const rows = points.filter(point => curveVisible(subjects.find(subject => subject.id === point.seriesId), kind, options) && Number.isFinite(point.value));
    if (!rows.length) return '';
    const referenceValue = data.byId.get(options.referenceId)?.[kind]?.[rows[0].dataIndex];
    return `<div class="zc-mo-tooltip"><div>${escape(rows[0].axisValue)}</div>${rows.map(point => {
      const subject = subjects.find(item => item.id === point.seriesId);
      const delta = options.referenceId && subject.id !== options.referenceId ? `<em>${Number.isFinite(referenceValue) ? `${point.value - referenceValue > 0 ? '+' : ''}${(point.value - referenceValue).toFixed(2)}pp` : '--'}</em>` : '';
      return `<div class="zc-mo-tooltip-row${subject.id === options.referenceId ? ' is-reference' : ''}"><i style="background:${subject.color}"></i><span>${escape(subject.name)}</span><strong>${point.value > 0 ? '+' : ''}${percentage(point.value)}</strong>${delta}</div>`;
    }).join('')}</div>`;
  }

  function chartOptions(kind, options, data) {
    const subjects = subjectsFor(options);
    const values = subjects.filter(subject => curveVisible(subject, kind, options)).flatMap(subject => data.byId.get(subject.id)?.[kind] || []);
    const drawdown = kind === 'drawdown';
    const minimum = Math.min(drawdown ? -25 : -15, Math.floor(Math.min(0, ...values) / 5) * 5);
    const maximum = drawdown ? 0 : Math.max(20, Math.ceil(Math.max(0, ...values) / 5) * 5);
    return {
      animation: false,
      grid: { left: 42, right: 8, top: 8, bottom: 28 },
      tooltip: { trigger: 'axis', confine: true, padding: 0, backgroundColor: 'rgba(255,255,255,.96)', borderColor: '#ddd', extraCssText: 'border-radius:8px;box-shadow:0 4px 12px #00000014;', formatter: params => tooltip(params, kind, options, data), axisPointer: { type: 'line', lineStyle: { color: '#b9b8d8', type: 'solid' } } },
      xAxis: { type: 'category', boundaryGap: false, data: data.labels, axisLine: { lineStyle: { color: '#eaeaea' } }, axisTick: { show: false }, axisLabel: { color: '#666', fontSize: 12, hideOverlap: true, showMinLabel: true, showMaxLabel: true }, axisPointer: { label: { show: true, backgroundColor: '#fff', color: '#262626', fontWeight: 700, margin: 8, padding: [0, 2] } } },
      yAxis: { type: 'value', min: minimum, max: maximum, interval: 5, axisLabel: { formatter: '{value}%', color: '#666', fontSize: 12 }, splitLine: { lineStyle: { color: '#eaeaea', type: drawdown ? 'solid' : 'dashed' } } },
      series: subjects.map(subject => ({ id: subject.id, name: subject.name, type: 'line', showSymbol: false, symbol: 'circle', symbolSize: 6, itemStyle: { color: subject.color }, lineStyle: { color: subject.color, width: 1.2 }, emphasis: { itemStyle: { color: '#fff', borderColor: subject.color, borderWidth: 1 } }, data: curveVisible(subject, kind, options) ? data.byId.get(subject.id)?.[kind] || [] : [] })),
    };
  }

  function mount(root, options) {
    const charts = [];
    const data = chartData(options);
    const chartByKind = new Map();
    root.querySelectorAll('[data-manager-chart]').forEach(host => {
      if (!window.echarts) return;
      window.echarts.getInstanceByDom(host)?.dispose();
      const chart = window.echarts.init(host);
      const kind = host.dataset.managerChart;
      chart.setOption(chartOptions(kind, options, data));
      chartByKind.set(kind, chart);
      charts.push(chart);
    });
    root.querySelectorAll('[data-manager-curve]').forEach(button => {
      button.onclick = () => {
        const subject = subjectsFor(options).find(item => item.id === button.dataset.managerCurve);
        if (!visible(subject)) return;
        const kind = button.dataset.managerKind;
        const shown = !curveVisible(subject, kind, options);
        curveVisibility.set(curveKey(subject, kind, options), shown);
        button.setAttribute('aria-pressed', String(shown));
        button.setAttribute('aria-label', `${shown ? '隐藏' : '显示'} ${subject.name} ${kind === 'return' ? '收益走势' : '动态回撤'}曲线`);
        button.classList.toggle('is-hidden', !shown);
        button.querySelector('i').style.background = shown ? subject.color : '#999';
        chartByKind.get(kind)?.setOption(chartOptions(kind, options, data), { replaceMerge: ['series'] });
      };
    });
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(() => charts.forEach(chart => { if (!chart.isDisposed()) chart.resize(); }));
    root.querySelectorAll('[data-manager-chart]').forEach(host => resizeObserver.observe(host));
    return charts;
  }

  function resetFundVisibility(id) {
    for (const mode of ['manager', 'fund']) {
      for (const kind of ['return', 'drawdown']) curveVisibility.delete(`${mode}:${id}:${kind}`);
    }
  }

  window.ManagerOverviewView = { render, mount, resetFundVisibility };
})();
