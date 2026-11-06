(() => {
  const assets = './assets/compare-risk/';
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
    ['年化标准差(%)', '23.12', '10.28', '将收益率波动换算为年化标准差。'],
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
    return `<div class="zc-risk-view-toggle" role="group" aria-label="收益与发布视图">
      <button type="button" data-risk-view="chart" aria-pressed="${view === 'chart'}" aria-label="图表视图" title="图表视图">
        <span class="zc-risk-chart-icon" aria-hidden="true">${[1, 2, 3, 4].map(i => icon(`view-chart-${i}`, '?v=2')).join('')}</span>
      </button>
      <button type="button" data-risk-view="table" aria-pressed="${view === 'table'}" aria-label="列表视图" title="列表视图">
        <span class="zc-risk-table-icon" aria-hidden="true">${[1, 2, 2].map(i => `<span>${icon(`view-table-dot-${i}`, '?v=2')}<i></i></span>`).join('')}</span>
      </button>
    </div>`;
  }

  function help(key, title, description) {
    return `<span class="zc-risk-help">
      <button type="button" aria-label="${title}说明" aria-describedby="zc-risk-help-${key}">${icon(`${key}-help`)}</button>
      <span class="zc-risk-help-popover" id="zc-risk-help-${key}" role="tooltip">${description}</span>
    </span>`;
  }

  function heading(key, title, { view, description, note } = {}) {
    return `<div class="zc-section-head zc-risk-head">
      <div class="zc-risk-heading">
        <h2>${title}</h2>${description ? help(key, title, description) : ''}${note ? `<small>${note}</small>` : ''}
      </div>
      <div class="zc-risk-actions">
        ${view ? viewToggle(view) : ''}
        <div class="zc-risk-actions-main">
          <button class="zc-text" type="button" data-risk-download="${key}" aria-label="下载${title}"><span class="zc-action-icon zc-download-icon" aria-hidden="true"></span>下载</button>
          <button class="zc-text" type="button" data-risk-refresh="${key}" aria-label="刷新${title}"><span class="zc-action-icon zc-refresh-icon" aria-hidden="true"></span>刷新</button>
        </div>
      </div>
    </div>`;
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

  function distributionTable(title, rowHeading, data, funds) {
    const shownFunds = funds.filter(fund => fund.visible);
    if (!shownFunds.length || !data?.labels.length) return '<div class="zc-risk-no-data">暂无可显示的数据</div>';
    const columns = shownFunds.map(fund => data.series.find(series => series.name === fund.name));
    const rows = data.labels.map((label, i) => `<tr><th scope="row">${escape(label)}</th>${columns.map(series => {
      const value = series?.values[i];
      return `<td>${Number.isFinite(value) ? percent(value) : '—'}</td>`;
    }).join('')}</tr>`).join('');
    return `<div class="zc-table-wrap zc-risk-list-wrap"><table class="zc-table zc-risk-table zc-risk-list" aria-label="${title}">
      <thead><tr><th scope="col">${rowHeading}</th>${shownFunds.map(fund => `<th scope="col">${fundHeading(fund)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  }

  function overview({ funds, series, unit, view }) {
    const title = `${unit}度收益`;
    const entries = [
      ['returns', title, '日期'],
      ['distribution', `${title}分布`, '收益区间'],
    ];
    return `<section data-risk-section="overview">
      ${heading('overview', '收益与发布', { view })}
      <div class="zc-risk-pair">${entries.map(([key, name, rowHeading]) => `<article>
        <h3>${name}</h3>
        ${view === 'table' ? distributionTable(name, rowHeading, series[key], funds) : chart(key, name, funds)}
      </article>`).join('')}</div>
    </section>`;
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
        return `<td>${value}</td>`;
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
    return `<div class="zc-risk-view">
      ${overview(options)}
      ${chartSection('interval', '区间收益', funds)}
      ${chartSection('forecast', '收益预测', funds, { description: forecastHelp })}
      ${chartSection('rolling', '收益波动走势', funds, { description: rollingHelp })}
      ${chartSection('drawdown', '区间最大回撤', funds, { note: '区间最小起始日期为 2022-12-06' })}
      <section class="zc-risk-metrics" data-risk-section="metrics">
        ${heading('metrics', '收益风险指标')}
        <div class="zc-risk-metric-tables">
          ${metricTable('收益指标', returnMetrics, funds, series.interval)}
          ${metricTable('风险指标', riskMetrics, funds, series.drawdown)}
        </div>
      </section>
    </div>`;
  }

  window.CompareRiskView = { render };
})();
