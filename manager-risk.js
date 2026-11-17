(() => {
  const sections = ['interval', 'drawdown', 'rolling', 'metrics'];
  const profileIds = ['a', 'b', 'c', 'd'];
  const assets = './assets/manager-risk/';
  const benchmarkGroups = [
    ['A股指数', '债券指数', '基金指数', '商品指数', '港股指数'],
    ['规模指数', '行业指数', '风格指数'],
    ['上证规模指数', '深证规模指数', '中证规模指数'],
    ['上证综指', '上证180', '上证50', '上证380', '科创50'],
  ];
  const benchmarks = benchmarkGroups.at(-1);
  const chartSubjects = new WeakMap();
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);

  function fundsFor(options) {
    return options.funds || options.managers || [];
  }

  function sampleFunds(options) {
    return fundsFor(options).map((fund, index) => {
      const profileIndex = fund.profileIndex ?? index % profileIds.length;
      const sample = chartSubjects.get(fund) || {};
      if (sample.visible === false && fund.visible !== false) window.CompareRiskCharts.resetFundVisibility(sample);
      Object.assign(sample, { id: fund.id, name: fund.name, color: fund.color, visible: fund.visible !== false, profileIndex });
      chartSubjects.set(fund, sample);
      return sample;
    });
  }

  function rangeFor(options, section) {
    const initial = {
      start: section === 'rolling' ? '2025-11-06' : '2025-12-09',
      end: '2026-11-06', unit: '月', disabled: true,
      commonLabel: section === 'metrics' ? '共同时段' : '共同任期',
      period: section === 'rolling' ? '近1年' : '共同时段',
      ...(section === 'metrics' ? { benchmark: '上证综指', frequency: '原始频率' } : {}),
    };
    const range = options.ui?.range?.(`manager-risk-${section}`, initial) || initial;
    if (section === 'rolling') range.commonStart = '2025-12-09';
    return range;
  }

  function sectionOptions(options, section) {
    const range = rangeFor(options, section);
    return { ...options, ...range, start: section === 'rolling' && range.period === '共同任期' ? range.commonStart : range.start, funds: sampleFunds(options) };
  }

  function adaptedUi(options) {
    const scope = key => key.replace(/^risk-/, 'manager-risk-');
    return {
      range: (key, initial) => ({ ...initial, ...rangeFor(options, key.replace(/^risk-/, '')) }),
      setting: (key, ...args) => options.ui?.setting?.(scope(key), ...args) || '',
      timeControls: (key, initial) => options.ui?.timeControls?.(scope(key), {
        ...initial, ...rangeFor(options, key.replace(/^risk-/, '')), disabled: true,
      }) || '',
    };
  }

  function actions(section) {
    const button = (action, title, icon) => `<button type="button" class="zc-manager-risk-action"
      ${action === 'refresh' ? `data-analysis-refresh="manager-risk-${section}"` : `data-analysis-download="${action}"`}
      aria-label="${title}" title="${title}"><img src="${assets}${icon}.svg" width="18" height="18" alt=""></button>`;
    const download = section === 'metrics' ? button('table', '下载表格', 'table-download') : button('image', '下载图片', 'image-download');
    return `<div class="zc-manager-risk-actions">${download}${button('refresh', '刷新', 'refresh')}</div>`;
  }

  function benchmarkControl(options, scope) {
    if (!options.ui?.setting) return '';
    const template = document.createElement('template');
    template.innerHTML = options.ui.setting(scope, 'benchmark', '基准', benchmarks, benchmarks[0]);
    const details = template.content.querySelector('details');
    const current = options.ui.range(scope).benchmark;
    const panel = details.querySelector('.zc-analysis-menu');
    details.classList.add('zc-manager-benchmark');
    panel.classList.add('zc-manager-benchmark-panel');
    panel.setAttribute('role', 'group');
    panel.innerHTML = benchmarkGroups.map((items, level) => `<div class="zc-manager-benchmark-level" role="${level === benchmarkGroups.length - 1 ? 'radiogroup' : 'group'}" aria-label="第${level + 1}级基准分类">
      ${items.map((label, index) => {
        const terminal = level === benchmarkGroups.length - 1;
        const selected = terminal ? current === label : index === 0;
        const attributes = terminal
          ? `data-manager-field="benchmark" data-manager-scope="${scope}" data-manager-value="${label}" role="radio" aria-checked="${selected}"`
          : `data-manager-benchmark-level="${level}" aria-expanded="${selected}"${index ? ' disabled title="暂无可选指数"' : ''}`;
        return `<button type="button" ${attributes} class="${selected ? 'is-selected' : ''}"><span>${label}</span>
          ${terminal ? (selected ? `<img src="${assets}selected.svg" width="12" height="12" alt="">` : '') : '<img src="./assets/compare-controls/more.svg" width="10" height="10" alt="">'}</button>`;
      }).join('')}
    </div>`).join('');
    return details.outerHTML;
  }

  const average = values => values.reduce((sum, value) => sum + value, 0) / values.length;
  const deviation = (values, mean = average(values)) => Math.sqrt(average(values.map(value => (value - mean) ** 2)));
  const ratio = (top, bottom) => bottom ? top / bottom : NaN;
  const number = value => Number.isFinite(value) ? value.toFixed(2) : '—';
  const percent = value => Number.isFinite(value) ? `${(value * 100).toFixed(2)}%` : '—';
  const monthDistance = (first, last) => (Number(last.slice(0, 4)) - Number(first.slice(0, 4))) * 12
    + Number(last.slice(5, 7)) - Number(first.slice(5, 7));

  function periodicReturns(series, boundaries) {
    return boundaries.slice(1).map((end, index) => (100 + series[end]) / (100 + series[boundaries[index]]) - 1);
  }

  function drawdownMetrics(series, dates) {
    let peakIndex = 0, troughIndex = 0, previousPeak = 0, maximum = 0;
    series.forEach((value, index) => {
      if (value > series[peakIndex]) peakIndex = index;
      const loss = 1 - (100 + value) / (100 + series[peakIndex]);
      if (loss <= maximum) return;
      maximum = loss;
      troughIndex = index;
      previousPeak = peakIndex;
    });
    const recovery = series.findIndex((value, index) => index > troughIndex && value >= series[previousPeak]);
    return [percent(maximum), String(monthDistance(dates[previousPeak], dates[troughIndex])),
      recovery >= 0 ? dates[recovery] : '—', recovery >= 0 ? String(monthDistance(dates[troughIndex], dates[recovery])) : '—'];
  }

  function metrics(series, benchmark, boundaries, dates, periodsPerYear) {
    const returns = periodicReturns(series, boundaries);
    const mean = average(returns), benchmarkMean = average(benchmark);
    const standard = deviation(returns, mean), benchmarkStandard = deviation(benchmark, benchmarkMean);
    const relative = returns.map((value, index) => value - benchmark[index]);
    const covariance = average(returns.map((value, index) => (value - mean) * (benchmark[index] - benchmarkMean)));
    const beta = ratio(covariance, benchmarkStandard ** 2);
    const trackingError = deviation(relative);
    const downside = Math.sqrt(average(returns.map(value => Math.min(0, value) ** 2)));
    const alpha = (mean - beta * benchmarkMean) * periodsPerYear;
    const rank = [...returns].sort((left, right) => left - right);
    const tail = rank.slice(0, Math.max(1, Math.ceil(rank.length * .05)));
    const annualizer = Math.sqrt(periodsPerYear);
    const cumulative = series.at(-1) / 100;
    const annualized = (1 + cumulative) ** (365.25 / (dates.length - 1)) - 1;
    const winRate = relative.filter(value => value > 0).length / relative.length;
    return [
      percent(cumulative), percent(annualized), percent(alpha), number(ratio(mean, standard) * annualizer),
      number(ratio(average(relative), trackingError) * annualizer), number(ratio(mean, downside) * annualizer),
      number(ratio(mean * periodsPerYear, beta)), percent(alpha), percent(ratio(mean, standard) * benchmarkStandard * periodsPerYear),
      percent(winRate), ...drawdownMetrics(series, dates), percent(standard * annualizer), number(beta),
      percent(downside * annualizer), percent(trackingError * annualizer), percent(Math.max(0, -tail.at(-1))),
      percent(Math.max(0, -average(tail))),
    ];
  }

  function updateMetricTables(section, options, range) {
    const isDesignRange = range.start === '2025-12-09' && range.end === '2026-11-06'
      && range.benchmark === benchmarks[0] && range.frequency === '原始频率';
    if (isDesignRange) return;
    const { labels, byId, benchmark } = window.ManagerOverviewView.dailyHistory(options, range);
    if (labels.length < 2) return;
    const monthly = range.frequency === '月度';
    const weekly = range.frequency === '周度';
    const boundaries = labels.map((_, index) => index).filter(index => index === 0 || index === labels.length - 1
      || (monthly ? labels[index].slice(0, 7) !== labels[index + 1].slice(0, 7) : !weekly || index % 7 === 0));
    const benchmarkReturns = periodicReturns(benchmark, boundaries);
    const funds = fundsFor(options);
    const values = funds.map(fund => metrics(byId.get(fund.id).return, benchmarkReturns, boundaries, labels, monthly ? 12 : weekly ? 52 : 365.25));
    const referenceIndex = funds.findIndex(fund => fund.id === options.referenceId);
    section.querySelectorAll('.zc-risk-table tbody tr').forEach((row, rowIndex) => {
      [...row.cells].slice(1).forEach((cell, columnIndex) => {
        const valueEl = cell.querySelector('.zc-risk-value');
        if (!valueEl) return;
        const value = values[columnIndex][rowIndex];
        valueEl.textContent = value;
        const difference = cell.querySelector('.zc-risk-difference');
        if (!difference) return;
        const referenceValue = values[referenceIndex]?.[rowIndex];
        const delta = Number.parseFloat(value) - Number.parseFloat(referenceValue);
        const formatted = /^-?\d+$/.test(value) ? String(delta) : number(delta);
        difference.textContent = Number.isFinite(delta) ? `${delta > 0 ? '+' : ''}${formatted}${value.endsWith('%') ? 'pp' : ''}` : '—';
      });
    });
  }

  function render(options) {
    const samples = sampleFunds(options);
    const template = document.createElement('template');
    template.innerHTML = window.CompareRiskView.render({
      ...sectionOptions(options, 'interval'), funds: samples,
      view: 'chart', ui: adaptedUi(options),
      series: window.CompareRiskCharts.data({ ...sectionOptions(options, 'interval'), funds: samples }),
    });
    const view = document.createElement('div');
    view.className = 'zc-risk-view zc-manager-risk-view';
    for (const key of sections) {
      const section = template.content.querySelector(`[data-risk-section="${key}"]`);
      const range = rangeFor(options, key);
      section.dataset.managerRiskSection = key;
      section.querySelector('.zc-risk-actions-main').outerHTML = actions(key);
      if (key === 'interval' || key === 'drawdown') {
        section.querySelector('.zc-risk-heading').classList.add('has-range-note');
        section.querySelector('.zc-risk-heading small').textContent = `区间最小起始日期：${range.commonStart || '2025-12-09'}　 截止日期：${range.end}`;
      }
      if (key === 'rolling') {
        section.querySelector('h2').textContent = '年化动态波动率';
        section.querySelector('[data-risk-chart]').setAttribute('aria-label', '年化动态波动率');
      }
      if (key === 'metrics') {
        section.querySelector('h2').textContent = '收益风险指标';
        section.querySelector('.zc-risk-setting-benchmark').innerHTML = benchmarkControl(options, 'manager-risk-metrics');
        updateMetricTables(section, options, range);
      }
      view.append(section);
    }
    return view.outerHTML;
  }

  function datasetFor(options, section) {
    return window.CompareRiskCharts.data(sectionOptions(options, section))[section];
  }

  function tooltip(params, dataset, referenceId) {
    const rows = params.filter(item => typeof item.value === 'number');
    if (!rows.length) return '';
    const reference = dataset.allSeries.find(series => series.id === referenceId);
    const referenceValue = reference?.values[rows[0].dataIndex];
    const compare = Number.isFinite(referenceValue);
    return `<div class="zc-tip${compare ? ' has-reference' : ''}"><div class="zc-tip-date">${escape(rows[0].axisValueLabel)}</div>
      <div class="zc-tip-rows">${rows.map(row => {
        const series = dataset.series.find(series => series.name === row.seriesName);
        const selected = series?.id === referenceId;
        const delta = Math.round((row.value - referenceValue) * 100) / 100;
        return `<div class="zc-tip-row${selected ? ' is-reference' : ''}"><i style="background:${series?.color || '#999'}"></i>
          <span class="zc-tip-name">${escape(row.seriesName)}</span><span class="zc-tip-value">${row.value.toFixed(2)}%</span>
          ${compare ? `<span class="zc-tip-difference">${selected ? '' : `${delta > 0 ? '+' : ''}${delta.toFixed(2)}pp`}</span>` : ''}</div>`;
      }).join('')}</div></div>`;
  }

  function mount(root, options) {
    const view = root.matches?.('.zc-manager-risk-view') ? root : root.querySelector('.zc-manager-risk-view');
    if (!view) return [];
    const charts = window.CompareRiskCharts.mount(view, {
      ...sectionOptions(options, 'interval'), sectionOptions: key => sectionOptions(options, key),
    });
    for (const chart of charts) {
      const key = chart.getDom().dataset.riskChart;
      const dataset = datasetFor(options, key);
      const labels = dataset.labels.map(label => label === '共同时段' ? '共同任期' : label);
      chart.setOption({
        tooltip: { formatter: params => tooltip(params, dataset, options.referenceId) },
        xAxis: { data: labels, axisLabel: { color: '#666' }, axisPointer: { label: {
          show: true, margin: 8, padding: [0, 2], backgroundColor: '#fff', color: '#333', fontSize: 12, fontWeight: 500,
        } } },
        yAxis: { axisLabel: { color: '#666' }, splitLine: { lineStyle: { type: [4, 4], dashOffset: 0, cap: 'butt' } } },
      });
    }
    return charts;
  }

  function bindBenchmark(root) {
    root.querySelectorAll('.zc-manager-benchmark-panel').forEach(panel => {
      const details = panel.closest('details');
      const columns = [...panel.children];
      panel.querySelectorAll('[data-manager-benchmark-level]:not(:disabled)').forEach(button => {
        const next = () => columns[Number(button.dataset.managerBenchmarkLevel) + 1]?.querySelector('button:not(:disabled)')?.focus();
        button.onclick = next;
      });
      panel.onkeydown = event => {
        const button = event.target.closest('button');
        if (!button) return;
        const column = button.closest('.zc-manager-benchmark-level');
        const index = columns.indexOf(column);
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          columns[index + 1]?.querySelector('button:not(:disabled)')?.focus();
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          columns[index - 1]?.querySelector('button:not(:disabled)')?.focus();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          details.open = false;
          details.querySelector('summary').focus();
        }
      };
    });
  }

  window.ManagerRiskView = { render, mount, bind: bindBenchmark, benchmarkControl, bindBenchmark, benchmarks };
})();
