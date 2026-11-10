(() => {
  const assets = './assets/compare-risk/';
  const disclosureState = new Map();
  const forecastHelp = '反映了在分析时段内任意日期买入并持有所选周期时长，获得的累计收益的概率分布。';
  const rollingHelp = '展示所选基金在分析时段内的滚动收益变化。';
  const returnMetrics = [
    ['区间收益', '13.24%', '3.66%', '所选区间内的累计收益。'],
    ['年化收益', '3.23%', '0.92%', '将所选区间的收益换算为一年期收益。'],
    ['阿尔法', '3.23%', '0.92%', '扣除基准所解释的收益后，基金的超额收益。'],
    ['夏普比率', '3.23', '0.92', '每单位总波动对应的超额收益。'],
    ['信息比率', '3.23', '0.92', '每单位跟踪误差对应的相对基准超额收益。'],
    ['索提诺比率', '3.23', '0.92', '每单位下行波动对应的超额收益。'],
    ['特雷诺比率', '3.23', '0.92', '每单位系统性风险对应的超额收益。'],
    ['詹森指数', '3.23%', '0.92%', '基金实际收益与基于系统性风险估计的收益之差。'],
    ['M2', '3.23%', '0.92%', '将基金波动调整到与基准一致后比较收益。'],
    ['胜率', '3.23%', '0.92%', '基金收益超过比较基准的观察期占比。'],
  ];
  const riskMetrics = [
    ['最大回撤', '13.24%', '3.66%', '所选区间内从高点到随后低点的最大跌幅。'],
    ['最大回撤区间月份数', '12.00', '12.00', '最大回撤从高点到低点所跨的月数。'],
    ['最大回撤修复日期', '2025-07-21', '2025-08-06', '最大回撤后首次回到回撤前高点的日期。'],
    ['最大回撤修复月份数', '17.00', '18.00', '最大回撤触底后修复所用的月数。'],
    ['年化标准差', '23.12%', '10.28%', '将收益率波动换算为年化标准差。'],
    ['贝塔', '1.06', '0.52', '基金收益相对比较基准变化的敏感度。'],
    ['下行风险', '15.19%', '6.62%', '衡量低于目标收益的波动幅度。'],
    ['跟踪误差', '13.91%', '9.70%', '衡量基金收益与比较基准收益之差的波动。'],
    ['历史VaR', '2.27%', '1.04%', '根据历史收益估计给定置信水平下的损失阈值。'],
    ['历史CVaR', '3.51%', '3.51%', '根据历史收益估计超过 VaR 阈值的平均损失。'],
  ];

  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  function icon(name, query = '') {
    return `<img src="${assets}${name}.svg${query}" alt="">`;
  }

  function viewToggle(view) {
    return `<div class="zc-risk-view-toggle" role="group" aria-label="收益与风险视图">
      <button type="button" data-risk-view="chart" aria-pressed="${view === 'chart'}" aria-label="图表视图" title="图表视图">
        <img src="${assets}view-chart-${view === 'chart' ? 'selected' : 'unselected'}.png" width="24" height="24" alt="">
      </button>
      <button type="button" data-risk-view="table" aria-pressed="${view === 'table'}" aria-label="列表视图" title="列表视图">
        <img src="${assets}view-list-${view === 'table' ? 'selected' : 'unselected'}.png" width="24" height="24" alt="">
      </button>
    </div>`;
  }

  function help(key, title, description) {
    return `<span class="zc-risk-help">
      <button type="button" aria-label="${title}说明" aria-describedby="zc-risk-help-${key}">${icon(`${key}-help`)}</button>
      <span class="zc-risk-help-popover" id="zc-risk-help-${key}" role="tooltip">${description}</span>
    </span>`;
  }

  function heading(key, title, { view, description, note, controls = '', rangeNote = false } = {}) {
    return `<div class="zc-section-head zc-risk-head">
      <div class="zc-risk-heading${rangeNote ? ' has-range-note' : ''}">
        <h2>${title}</h2>${description ? help(key, title, description) : ''}${note ? `<small>${note}</small>` : ''}
      </div>
      <div class="zc-risk-actions">
        ${controls}
        ${view ? viewToggle(view) : ''}
        <div class="zc-risk-actions-main">
          <button class="zc-text" type="button" data-risk-download="${key}" aria-label="下载${title}"><span class="zc-action-icon zc-download-icon" aria-hidden="true"></span>下载</button>
          <button class="zc-text" type="button" data-risk-refresh="${key}" aria-label="刷新${title}"><span class="zc-action-icon zc-refresh-icon" aria-hidden="true"></span>刷新</button>
        </div>
      </div>
    </div>`;
  }

  function rangeFor(options, key, defaults = {}) {
    const initial = { start: options.start, end: options.end, unit: options.unit || '月', period: '共同时段', ...defaults };
    return options.ui?.range(`risk-${key}`, initial) || initial;
  }

  function rangeNote(range) {
    return `${escape(range.start)} ～ ${escape(range.end)}`;
  }

  function timeControls(options, key, range, setting = '', showDate = true) {
    if (!options.ui) return '';
    return `<div class="zc-risk-toolbar">${setting}${options.ui.timeControls(`risk-${key}`, { ...range, showDate })}</div>`;
  }

  function setting(options, key, field, label, choices, initial) {
    if (!options.ui?.setting) return '';
    return `<div class="zc-risk-setting zc-risk-setting-${field}">${options.ui.setting(`risk-${key}`, field, label, choices, initial)}</div>`;
  }

  function frequencyButtons(unit) {
    return `<div class="zc-pill zc-risk-units" role="group" aria-label="收益统计频率">${['月', '季', '年'].map(value => `<button type="button" data-analysis-scope="risk-overview" data-analysis-field="unit" data-analysis-value="${value}" aria-pressed="${unit === value}" class="${unit === value ? 'selected' : ''}">${value}</button>`).join('')}</div>`;
  }

  function legend(key, title, funds) {
    return `<div class="zc-chart-legend zc-risk-legend" data-risk-legend="${key}" role="group" aria-label="${title}图例">
      ${funds.map(fund => `<button type="button" data-risk-fund="${escape(fund.id)}" aria-pressed="${fund.visible}"
        aria-label="${fund.visible ? '隐藏' : '显示'} ${escape(fund.name)}" title="${escape(fund.name)}" class="${fund.visible ? '' : 'is-hidden'}"
        ${fund.visible ? '' : 'disabled'}><i style="--series:${escape(fund.color)}" aria-hidden="true"></i><span>${escape(fund.name)}</span></button>`).join('')}
    </div>`;
  }

  function chart(key, title, funds) {
    const plot = `<div class="zc-chart zc-risk-chart" data-risk-chart="${key}" role="img" aria-label="${title}"></div>`;
    const frame = key === 'returns' ? `<div class="zc-risk-chart-frame">${plot}</div>` : plot;
    return `${frame}${legend(key, title, funds)}`;
  }

  function fundHeading(fund) {
    if (!fund?.visible) return '';
    return `<span class="zc-risk-fund-heading"><i style="--series:${escape(fund.color)}" aria-hidden="true"></i><span>${escape(fund.name)}</span></span>`;
  }

  function percent(value) {
    return `${value.toFixed(2)}%`;
  }

  function tableColumns() {
    return '<colgroup><col class="zc-risk-tree-label-col"><col><col><col><col></colgroup>';
  }

  function disclosure(key, label, expanded) {
    return `<button type="button" class="zc-risk-disclosure" data-risk-disclosure="${key}" aria-expanded="${expanded}" aria-controls="zc-risk-children-${key}">
      <span class="zc-risk-disclosure-arrow" aria-hidden="true"><img src="./assets/compare-attribution/tree-open.svg" width="14" height="14" alt=""></span>
      <span>${label}</span>
    </button>`;
  }

  function returnCell(fund, value) {
    if (!fund?.visible) return '<td></td>';
    const negative = Number.isFinite(value) && value < 0;
    return `<td class="zc-risk-number${negative ? ' is-negative' : ''}">${Number.isFinite(value) ? percent(value) : '—'}</td>`;
  }

  function calendarTable(title, data, funds, unit) {
    if (!data?.years.length) return '<div class="zc-risk-no-data">暂无可显示的数据</div>';
    const slots = Array.from({ length: 4 }, (_, i) => funds[i]);
    const unitKey = { 月: 'month', 季: 'quarter', 年: 'year' }[unit];
    const rows = data.years.map((year, yearIndex) => {
      const key = `calendar-${unitKey}-${year.year}`;
      const expanded = disclosureState.get(key) ?? (yearIndex === 0);
      const values = new Map(year.series.map(series => [series.id, series]));
      const children = data.labels.map((label, index) => `<tr>
        <th scope="row" class="zc-risk-period-label">${escape(label)}</th>
        ${slots.map(fund => returnCell(fund, values.get(fund?.id)?.values[index])).join('')}
      </tr>`).join('');
      return `<tbody class="zc-risk-tree-summary"><tr>
        <th scope="row">${disclosure(key, `<span class="zc-risk-number">${year.year}</span>`, expanded)}</th>
        ${slots.map(fund => returnCell(fund, values.get(fund?.id)?.total)).join('')}
      </tr></tbody>
      <tbody id="zc-risk-children-${key}" data-risk-children="${key}"${expanded ? '' : ' hidden'}>${children}</tbody>`;
    }).join('');
    return `<div class="zc-table-wrap zc-risk-tree-wrap"><table class="zc-table zc-risk-tree-table" aria-label="${title}">
      ${tableColumns()}
      <thead class="zc-risk-visually-hidden"><tr><th scope="col">年份及周期</th>${slots.map(fund => `<th scope="col">${fund?.visible ? escape(fund.name) : ''}</th>`).join('')}</tr></thead>
      ${rows}
    </table></div>`;
  }

  function quantityCell(fund, values, summary) {
    if (!fund?.visible) return '<td></td>';
    if (!values) return '<td class="zc-risk-number">—</td>';
    return `<td class="zc-risk-number"><span class="zc-risk-quantity" aria-label="${values.count}次，占比${percent(values.ratio)}">
      <span>${values.count}</span><span class="zc-risk-quantity-divider" aria-hidden="true">${icon(summary ? 'table-divider-medium' : 'table-divider-regular')}<span class="zc-risk-visually-hidden">｜</span></span><span>${percent(values.ratio)}</span>
    </span></td>`;
  }

  function distributionTable(title, data, funds) {
    if (!data?.series.length) return '<div class="zc-risk-no-data">暂无可显示的数据</div>';
    const slots = Array.from({ length: 4 }, (_, i) => funds[i]);
    const values = new Map(data.series.map(series => [series.id, series]));
    const groups = [
      { key: 'positive', label: '(&gt;0)', indexes: data.positiveIndexes, expanded: true },
      { key: 'negative', label: '(≤0)', indexes: data.negativeIndexes, expanded: false },
    ];
    const rows = groups.map(group => {
      const key = `distribution-${group.key}`;
      const expanded = disclosureState.get(key) ?? group.expanded;
      const indexes = group.indexes.filter(index => {
        const overflow = index === 0 || index === data.labels.length - 1;
        return !overflow || data.series.some(series => series.counts[index] > 0);
      });
      const children = indexes.map(index => `<tr>
        <th scope="row" class="zc-risk-period-label">${escape(data.labels[index])}</th>
        ${slots.map(fund => {
          const series = values.get(fund?.id);
          return quantityCell(fund, series ? { count: series.counts[index], ratio: series.ratios[index] } : null, false);
        }).join('')}
      </tr>`).join('');
      return `<tbody class="zc-risk-tree-summary"><tr>
        <th scope="row">${disclosure(key, group.label, expanded)}</th>
        ${slots.map(fund => quantityCell(fund, values.get(fund?.id)?.[group.key], true)).join('')}
      </tr></tbody>
      <tbody id="zc-risk-children-${key}" data-risk-children="${key}"${expanded ? '' : ' hidden'}>${children}</tbody>`;
    }).join('');
    return `<div class="zc-table-wrap zc-risk-tree-wrap"><table class="zc-table zc-risk-tree-table" aria-label="${title}">
      ${tableColumns()}
      <thead><tr><th scope="col">收益区间</th>${slots.map(fund => `<th scope="col"${fund?.visible ? ` aria-label="${escape(fund.name)}，数量及占比"` : ''}>${fund?.visible ? '数量｜占比' : ''}</th>`).join('')}</tr></thead>
      ${rows}
    </table></div>`;
  }

  function overview(options) {
    const { funds, view } = options;
    const range = rangeFor(options, 'overview');
    const series = options.seriesBySection?.['risk-overview'] || options.series;
    const unit = range.unit;
    const title = `${unit}度收益`;
    const frequency = view === 'table'
      ? setting(options, 'overview', 'unit', '频率', [{ value: '月', label: '月度' }, { value: '季', label: '季度' }, { value: '年', label: '年度' }], unit)
      : frequencyButtons(unit);
    const controls = timeControls(options, 'overview', range, frequency);
    const body = view === 'table'
      ? `<div class="zc-risk-table-stack">
          <article><h3>${title}</h3>${calendarTable(title, series.calendar, funds, unit)}</article>
          <article><h3>${title}分布</h3>${distributionTable(`${title}分布`, series.distributionCounts, funds)}</article>
        </div>`
      : `<div class="zc-risk-pair">
          <article><h3>${title}</h3>${chart('returns', title, funds)}</article>
          <article><h3>${title}分布</h3>${chart('distribution', `${title}分布`, funds)}</article>
        </div>`;
    return `<section data-risk-section="overview">
      ${heading('overview', '收益与发布', { view, controls, note: view === 'table' ? rangeNote(range) : '', rangeNote: true })}
      ${body}
    </section>`;
  }

  function bind(root) {
    root.querySelectorAll('[data-risk-disclosure]').forEach(button => {
      button.onclick = () => {
        const key = button.dataset.riskDisclosure;
        const expanded = button.getAttribute('aria-expanded') !== 'true';
        const children = button.closest('table').querySelector(`[data-risk-children="${key}"]`);
        disclosureState.set(key, expanded);
        button.setAttribute('aria-expanded', String(expanded));
        children.hidden = !expanded;
      };
    });
  }

  function chartSection(key, title, funds, details) {
    return `<section data-risk-section="${key}">${heading(key, title, details)}${chart(key, title, funds)}</section>`;
  }

  function metricTable(title, metrics, funds, interval) {
    const slots = Array.from({ length: 4 }, (_, i) => funds[i]);
    const commonIndex = interval?.labels.indexOf('共同时段') ?? -1;
    const currentValues = new Map(interval?.series.map(item => [item.name, item.values[commonIndex]]));
    const rows = metrics.map(([label, first, other, description], row) => `<tr>
      <th scope="row"><span class="zc-risk-metric-label"><span>${label}</span>
        <button type="button" class="zc-risk-metric-help" aria-label="${label}说明，${description}" title="${description}">${icon('metric-help')}</button>
      </span></th>
      ${slots.map(fund => {
        if (!fund?.visible) return '<td></td>';
        const current = row === 0 ? currentValues.get(fund.name) : undefined;
        const sample = fund.id === 'a' ? first : other;
        const value = Number.isFinite(current) ? percent(current) : (current === null ? '—' : sample);
        return `<td class="${parseFloat(value) < 0 ? 'is-negative' : ''}">${value}</td>`;
      }).join('')}
    </tr>`).join('');
    return `<div class="zc-table-wrap"><table class="zc-table zc-risk-table" aria-label="${title}">
      <colgroup><col class="zc-risk-metric-col">${'<col>'.repeat(4)}</colgroup>
      <thead><tr><th scope="col">${title}</th>${slots.map(fund => `<th scope="col">${fundHeading(fund)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  }

  function render(options) {
    const { funds, series } = options;
    const intervalRange = rangeFor(options, 'interval');
    const forecastRange = rangeFor(options, 'forecast', { period: '近3年', holdingMonths: 3 });
    const rollingRange = rangeFor(options, 'rolling', { period: '近1年' });
    const drawdownRange = rangeFor(options, 'drawdown');
    const metricsRange = rangeFor(options, 'metrics', { benchmark: '上证综指', frequency: '原始频率' });
    const holding = setting(options, 'forecast', 'holdingMonths', '持有周期', [
      { value: 1, label: '一个月' }, { value: 3, label: '三个月' }, { value: 6, label: '六个月' }, { value: 12, label: '一年' },
    ], forecastRange.holdingMonths);
    const benchmark = setting(options, 'metrics', 'benchmark', '基准', ['上证综指', '沪深300', '中证500', '中证800'], metricsRange.benchmark);
    const metricsFrequency = setting(options, 'metrics', 'frequency', '频率', ['原始频率', '日度', '周度', '月度'], metricsRange.frequency);
    const metricsSeries = options.seriesBySection?.['risk-metrics'] || series;
    return `<div class="zc-risk-view">
      ${overview(options)}
      ${chartSection('interval', '区间收益', funds, { note: `截止日期：${escape(intervalRange.end)}` })}
      ${chartSection('forecast', '收益预测', funds, {
        description: forecastHelp,
        note: options.view === 'table' ? rangeNote(forecastRange) : '',
        rangeNote: true,
        controls: timeControls(options, 'forecast', forecastRange, holding, options.view === 'table'),
      })}
      ${chartSection('rolling', '收益波动走势', funds, { description: rollingHelp, controls: timeControls(options, 'rolling', rollingRange) })}
      ${chartSection('drawdown', '区间最大回撤', funds, { note: `区间最小起始日期为：2022-12-06　 截止日期：${escape(drawdownRange.end)}` })}
      <section class="zc-risk-metrics" data-risk-section="metrics">
        ${heading('metrics', '收益风险指标', { controls: timeControls(options, 'metrics', metricsRange, benchmark + metricsFrequency) })}
        <div class="zc-risk-metric-tables">
          ${metricTable('收益指标', returnMetrics, funds, metricsSeries.interval)}
          ${metricTable('风险指标', riskMetrics, funds, metricsSeries.drawdown)}
        </div>
      </section>
    </div>`;
  }

  window.CompareRiskView = { render, bind };
})();
