(() => {
  const day = 86_400_000;
  const unitMonths = { 月: 1, 季: 3, 年: 12 };
  const fundProfiles = {
    a: { growth: .00039, swing: .09, phase: .2 },
    b: { growth: .00033, swing: .072, phase: .5 },
    c: { growth: .00033, swing: .073, phase: .55 },
    d: { growth: .00045, swing: .095, phase: .69 },
  };
  const legendChoices = new WeakMap();
  const epoch = Date.UTC(2022, 0, 1) / day;
  const dayIndex = date => Date.parse(`${date}T00:00:00Z`) / day;
  const drawdownStart = dayIndex('2022-12-06');
  const dateLabel = index => new Date(index * day).toISOString().slice(0, 10);
  const round = value => Math.round(value * 100) / 100;

  // The workbench prototype has no historical NAV feed for the comparison funds.
  // A repeatable sample series keeps all six charts consistent across date changes.
  function nav(index, fund) {
    const { growth, swing, phase } = fundProfiles[fund.id] ?? fundProfiles.a;
    const elapsed = index - epoch;
    const trend = .68 * Math.sin(elapsed * .032 + phase)
      + .43 * Math.cos(elapsed * .015 + phase)
      + .08 * Math.sin(elapsed * .48 + phase)
      + .05 * Math.cos(elapsed * .93 + phase);
    const longTerm = 300 * growth * Math.tanh((elapsed - 1420) / 335);
    return Math.exp(longTerm + swing * trend);
  }

  function gain(first, last, fund) {
    return round((nav(last, fund) / nav(first, fund) - 1) * 100);
  }

  function maximumDrawdown(first, last, fund) {
    let peak = nav(first, fund);
    let drawdown = 0;
    for (let index = first + 1; index <= last; index++) {
      const value = nav(index, fund);
      peak = Math.max(peak, value);
      drawdown = Math.max(drawdown, (1 - value / peak) * 100);
    }
    return round(drawdown);
  }

  function periods(first, last, months) {
    const buckets = [];
    for (let index = first; index <= last;) {
      const date = new Date(index * day);
      const month = Math.floor(date.getUTCMonth() / months) * months;
      const next = Date.UTC(date.getUTCFullYear(), month + months, 1) / day;
      buckets.push({ first: index, last: Math.min(last, next - 1) });
      index = next;
    }
    return buckets;
  }

  function monthsBefore(index, count) {
    const date = new Date(index * day);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() - count;
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Date.UTC(year, month, Math.min(date.getUTCDate(), daysInMonth)) / day;
  }

  function histogram(values, thresholds) {
    const counts = Array(thresholds.length + 1).fill(0);
    for (const value of values) {
      const index = thresholds.findIndex(limit => value <= limit);
      counts[index === -1 ? thresholds.length : index]++;
    }
    return counts.map(count => round(100 * count / values.length));
  }

  function data({ funds, start, end, unit }) {
    const first = dayIndex(start);
    const last = dayIndex(end);
    const months = unitMonths[unit] ?? unitMonths.月;
    const buckets = periods(first, last, months);
    const active = funds.filter(fund => fund.visible);
    const intervals = [Date.UTC(new Date(last * day).getUTCFullYear(), 0, 1) / day,
      ...[1, 3, 6, 12, 36, 60].map(count => monthsBefore(last, count)), first];
    const intervalLabels = ['今年以来', '近一个月', '近三个月', '近六个月', '近一年', '近三年', '近五年', '共同时段'];
    const rollCount = Math.min(last - first + 1, 145);
    const rollingDates = Array.from({ length: rollCount }, (_, i) =>
      first + (rollCount === 1 ? 0 : Math.round((last - first) * i / (rollCount - 1))));
    const distributionScale = Math.sqrt(months);
    const distributionThresholds = [-1, 1, 3, 5, 7, 9].map(threshold => threshold * distributionScale);
    const forecastThresholds = [-10, -5, -2, 0, 2, 5, 10];
    const forecastLabels = ['≤ -10%', '-10% ～ -5%', '-5% ～ -2%', '-2% ～ 0%', '0% ～ 2%', '2% ～ 5%', '5% ～ 10%', '> 10%'];
    const forecastDates = [last];
    for (let index = last - 7; index >= first; index -= 7) forecastDates.push(index);

    function dataset(labels, values) {
      return {
        labels,
        series: active.map(fund => ({ id: fund.id, name: fund.name, color: fund.color, values: values(fund) })),
      };
    }
    const periodReturns = fund => buckets.map(bucket => gain(bucket.first - 1, bucket.last, fund));
    return {
      returns: dataset(buckets.map(bucket => dateLabel(bucket.last)), periodReturns),
      distribution: dataset([-2, 0, 2, 4, 6, 8, 10].map(value => `${round(value * distributionScale)}%`),
        fund => histogram(periodReturns(fund), distributionThresholds)),
      interval: dataset(intervalLabels, fund => intervals.map(index => gain(index, last, fund))),
      forecast: dataset(forecastLabels, fund => histogram(forecastDates.map(index =>
        gain(monthsBefore(index, months), index, fund)), forecastThresholds)),
      rolling: dataset(rollingDates.map(dateLabel), fund => rollingDates.map(index =>
        gain(monthsBefore(index, 3), index, fund))),
      drawdown: dataset(intervalLabels, fund => intervals.map(index =>
        last < drawdownStart ? null : maximumDrawdown(Math.max(index, drawdownStart), last, fund))),
    };
  }

  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  function tooltip(params, width) {
    const rows = (Array.isArray(params) ? params : [params]).filter(item => typeof item?.value === 'number');
    if (!rows.length) return '';
    return `<div class="zc-tip" style="width:${Math.min(284, Math.max(148, width - 18))}px">
      <div class="zc-tip-date">${escape(rows[0].axisValueLabel)}</div>
      <div class="zc-tip-rows">${rows.map(item => `<div class="zc-tip-row">
        <i style="background:${item.color}"></i><span class="zc-tip-name">${escape(item.seriesName)}</span>
        <span class="zc-tip-value">${item.value.toFixed(2)}%</span>
      </div>`).join('')}</div>
    </div>`;
  }

  function chartOption(key, { labels, series }, selected, element) {
    const overview = key === 'returns' || key === 'distribution';
    const line = key === 'rolling';
    const probability = key === 'distribution' || key === 'forecast';
    const slider = key === 'returns' && labels.length > 1;
    const right = line ? 38 : key === 'returns' ? 28 : 3;
    const allValues = series.flatMap(item => item.values);
    const minimum = Math.min(0, ...allValues);
    const maximum = Math.max(0, ...allValues);
    const min = probability || key === 'drawdown' ? 0 : Math.min(key === 'returns' ? -15 : 0, Math.floor(minimum / 5) * 5);
    const max = key === 'distribution' ? 100 : Math.max(key === 'returns' ? 15 : 30, Math.ceil(maximum / 5) * 5);
    return {
      animation: false,
      legend: { show: false, selected, data: series.map(item => item.name) },
      tooltip: {
        trigger: 'axis', confine: true, backgroundColor: 'rgba(255,255,255,.98)', borderColor: '#ddd',
        padding: 0, extraCssText: 'border-radius:8px;box-shadow:0 4px 12px #00000014;white-space:normal;',
        axisPointer: line ? { type: 'line', lineStyle: { color: '#b9b8d8' } }
          : { type: 'shadow', shadowStyle: { color: 'rgba(80,86,109,.08)' } },
        formatter: params => tooltip(params, element.clientWidth),
      },
      grid: { left: 40, right, top: 12, bottom: slider ? 37 : 24 },
      xAxis: {
        type: 'category', data: labels, boundaryGap: !line,
        axisLine: { onZero: false, lineStyle: { color: '#eaeaea' } },
        axisTick: { show: false },
        axisLabel: { color: '#555759', fontSize: 12, hideOverlap: true },
      },
      yAxis: {
        type: 'value', min, max, splitNumber: 6,
        axisLabel: { formatter: '{value}%', color: '#555759', fontSize: 12, margin: 9 },
        splitLine: { lineStyle: { color: '#e9eaec', type: 'dashed' } },
      },
      dataZoom: slider ? [{
        type: 'slider', height: 13, left: 40, right, bottom: 1,
        showDetail: false, showDataShadow: true, brushSelect: false,
        handleSize: '85%', backgroundColor: '#f1f3f6', fillerColor: 'rgba(179,198,219,.28)',
        borderColor: '#e4e8ed', handleStyle: { color: '#d6e2ef', borderColor: '#a8bcd2' },
        dataBackground: { lineStyle: { color: '#b8c8da' }, areaStyle: { color: '#e0e8f0' } },
      }] : [],
      series: series.map(item => ({
        name: item.name, type: line ? 'line' : 'bar', data: item.values,
        showSymbol: false, symbolSize: 5, lineStyle: { color: item.color, width: 1.25 },
        barMaxWidth: overview ? 16 : 30, barGap: '10%', barCategoryGap: '35%',
        itemStyle: { color: item.color, borderRadius: line ? 0 : [2, 2, 0, 0] },
      })),
    };
  }

  function mount(root, options) {
    if (!window.echarts) return [];
    const elements = root.querySelectorAll('[data-risk-chart]');
    if (!elements.length) return [];
    const datasets = data(options);
    return Array.from(elements, element => {
      const key = element.dataset.riskChart;
      const dataset = datasets[key];
      const legend = root.querySelector(`[data-risk-legend="${key}"]`);
      const selected = Object.fromEntries(options.funds.map(fund => [fund.name, fund.visible && !legendChoices.get(fund)?.has(key)]));
      const chart = window.echarts.init(element);
      chart.setOption(chartOption(key, dataset, selected, element));
      legend?.querySelectorAll('[data-risk-fund]').forEach(button => {
        const fund = options.funds.find(item => item.id === button.dataset.riskFund);
        if (!fund) return;
        const syncButton = () => {
          const visible = selected[fund.name];
          button.setAttribute('aria-pressed', String(visible));
          button.setAttribute('aria-label', `${visible ? '隐藏' : '显示'} ${fund.name}`);
          button.classList.toggle('is-hidden', !visible);
        };
        syncButton();
        button.onclick = () => {
          if (!fund.visible) return;
          const hiddenCharts = legendChoices.get(fund) ?? new Set();
          if (selected[fund.name]) hiddenCharts.add(key);
          else hiddenCharts.delete(key);
          legendChoices.set(fund, hiddenCharts);
          selected[fund.name] = !selected[fund.name];
          syncButton();
          chart.dispatchAction({ type: 'legendToggleSelect', name: fund.name });
        };
      });
      return chart;
    });
  }

  window.CompareRiskCharts = { data, mount };
})();
