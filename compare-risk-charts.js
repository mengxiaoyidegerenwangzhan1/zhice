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
  const returnZoomId = 'zc-risk-return-range';
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

  function histogramCounts(values, thresholds) {
    const counts = Array(thresholds.length + 1).fill(0);
    for (const value of values) {
      const index = thresholds.findIndex(limit => value <= limit);
      counts[index === -1 ? thresholds.length : index]++;
    }
    return counts;
  }

  function histogram(values, thresholds) {
    return histogramCounts(values, thresholds).map(count => round(100 * count / values.length));
  }

  function calendarReturns(funds, buckets, months) {
    const labels = months === 1 ? Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
      : months === 3 ? ['一季度', '二季度', '三季度', '四季度'] : ['年度'];
    const years = new Map();
    for (const bucket of buckets) {
      const year = new Date(bucket.first * day).getUTCFullYear();
      if (!years.has(year)) years.set(year, []);
      years.get(year).push(bucket);
    }
    return {
      labels,
      years: Array.from(years, ([year, periods]) => ({
        year,
        series: funds.map(fund => {
          const values = Array(labels.length).fill(null);
          for (const period of periods) {
            const month = new Date(period.first * day).getUTCMonth();
            values[Math.floor(month / months)] = gain(period.first - 1, period.last, fund);
          }
          return {
            id: fund.id, name: fund.name, color: fund.color, values,
            total: gain(periods[0].first - 1, periods.at(-1).last, fund),
          };
        }),
      })).reverse(),
    };
  }

  function distributionCounts(funds, valuesById) {
    const thresholds = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];
    return {
      labels: ['≤ -10%', '-10% ~ -8%', '-8% ~ -6%', '-6% ~ -4%', '-4% ~ -2%', '-2% ~ 0%',
        '0% ~ 2%', '2% ~ 4%', '4% ~ 6%', '6% ~ 8%', '8% ~ 10%', '> 10%'],
      positiveIndexes: [6, 7, 8, 9, 10, 11],
      negativeIndexes: [0, 1, 2, 3, 4, 5],
      series: funds.map(fund => {
        const values = valuesById.get(fund.id);
        const total = values.length;
        const counts = histogramCounts(values, thresholds);
        const positive = values.filter(value => value > 0).length;
        const zero = values.filter(value => value === 0).length;
        const summary = count => ({ count, ratio: round(100 * count / total) });
        return {
          id: fund.id, name: fund.name, color: fund.color, total, counts,
          ratios: counts.map(count => round(100 * count / total)),
          positive: summary(positive), negative: summary(total - positive), zero: summary(zero),
        };
      }),
    };
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
    const returnsById = new Map(funds.map(fund => [fund.id,
      buckets.map(bucket => gain(bucket.first - 1, bucket.last, fund)),
    ]));
    const periodReturns = fund => returnsById.get(fund.id);
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
      calendar: calendarReturns(funds, buckets, months),
      distributionCounts: distributionCounts(funds, returnsById),
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

  function rangePreview(values) {
    if (!values?.length) return '';
    const low = Math.min(...values);
    const span = Math.max(...values) - low || 1;
    const points = values.map((value, index) =>
      `${100 * index / (values.length - 1)},${20 - 16 * (value - low) / span}`).join(' ');
    return `<svg class="zc-risk-range-preview" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="#a8bcd2" stroke-width="1" vector-effect="non-scaling-stroke"/>
    </svg>`;
  }

  function mountReturnRange(element, chart, { labels, series }) {
    const slider = document.createElement('div');
    slider.className = 'zc-risk-range';
    slider.setAttribute('role', 'group');
    slider.setAttribute('aria-label', '调整收益图显示范围');
    slider.innerHTML = `<div class="zc-risk-range-track">
      ${rangePreview(series[0]?.values)}
      <div class="zc-risk-range-selection" aria-hidden="true"></div>
      <button class="zc-risk-range-handle is-start" type="button" role="slider" aria-label="显示范围开始" data-range-edge="start"></button>
      <button class="zc-risk-range-handle is-end" type="button" role="slider" aria-label="显示范围结束" data-range-edge="end"></button>
    </div>`;
    const track = slider.querySelector('.zc-risk-range-track');
    const selection = slider.querySelector('.zc-risk-range-selection');
    const startHandle = slider.querySelector('[data-range-edge="start"]');
    const endHandle = slider.querySelector('[data-range-edge="end"]');
    const lastIndex = labels.length - 1;
    const indexAt = percent => Math.round(percent * lastIndex / 100);
    const percentAt = index => 100 * index / lastIndex;
    const clamp = (value, limit = 100) => Math.max(0, Math.min(limit, value));
    let start = 0;
    let end = 100;
    let startIndex = 0;
    let endIndex = lastIndex;
    let drag = null;

    function updateHandle(handle, index, min, max) {
      handle.setAttribute('aria-valuemin', String(min));
      handle.setAttribute('aria-valuemax', String(max));
      handle.setAttribute('aria-valuenow', String(index));
      handle.setAttribute('aria-valuetext', labels[index]);
    }

    function setRange(nextStart, nextEnd) {
      start = nextStart;
      end = nextEnd;
      const nextStartIndex = indexAt(start);
      const nextEndIndex = indexAt(end);
      slider.style.setProperty('--zc-range-start', `${start}%`);
      slider.style.setProperty('--zc-range-end', `${end}%`);
      slider.classList.toggle('is-zoomed', start > 0 || end < 100);
      updateHandle(startHandle, nextStartIndex, 0, nextEndIndex);
      updateHandle(endHandle, nextEndIndex, nextStartIndex, lastIndex);
      if (nextStartIndex === startIndex && nextEndIndex === endIndex) return;
      startIndex = nextStartIndex;
      endIndex = nextEndIndex;
      chart.dispatchAction({
        type: 'dataZoom', dataZoomId: returnZoomId, startValue: startIndex, endValue: endIndex,
      });
    }

    function pointerPercent(event) {
      const bounds = track.getBoundingClientRect();
      return clamp(100 * (event.clientX - bounds.left) / bounds.width);
    }

    track.addEventListener('pointerdown', event => {
      if (drag || event.button !== 0) return;
      const handle = event.target.closest('[data-range-edge]');
      const move = event.target === selection && end - start < 100;
      drag = {
        pointer: event.pointerId, anchor: pointerPercent(event), start, end,
        mode: handle?.dataset.rangeEdge ?? (move ? 'move' : 'brush'),
      };
      track.setPointerCapture(event.pointerId);
      handle?.focus({ preventScroll: true });
      event.preventDefault();
    });

    function moveRange(event) {
      if (event.pointerId !== drag?.pointer) return;
      const position = pointerPercent(event);
      const offset = position - drag.anchor;
      if (drag.mode === 'start') {
        setRange(Math.min(clamp(drag.start + offset), end), end);
      } else if (drag.mode === 'end') {
        setRange(start, Math.max(clamp(drag.end + offset), start));
      } else if (drag.mode === 'move') {
        const width = drag.end - drag.start;
        const left = clamp(drag.start + offset, 100 - width);
        setRange(left, left + width);
      } else if (Math.abs(offset) >= .5) {
        setRange(Math.min(drag.anchor, position), Math.max(drag.anchor, position));
      }
    }

    function finishDrag(event) {
      if (event.pointerId !== drag?.pointer) return;
      if (event.type === 'pointerup') moveRange(event);
      drag = null;
      setRange(percentAt(startIndex), percentAt(endIndex));
    }

    track.addEventListener('pointermove', moveRange);
    track.addEventListener('pointerup', finishDrag);
    track.addEventListener('pointercancel', finishDrag);
    track.addEventListener('lostpointercapture', finishDrag);

    for (const handle of [startHandle, endHandle]) {
      handle.addEventListener('keydown', event => {
        const isStart = handle === startHandle;
        const index = isStart ? startIndex : endIndex;
        const min = isStart ? 0 : startIndex;
        const max = isStart ? endIndex : lastIndex;
        const delta = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -5, PageUp: 5 };
        if (event.key !== 'Home' && event.key !== 'End' && !Object.hasOwn(delta, event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? min : event.key === 'End' ? max : Math.max(min, Math.min(max, index + delta[event.key]));
        if (isStart) setRange(percentAt(next), end);
        else setRange(start, percentAt(next));
      });
    }

    setRange(0, 100);
    element.after(slider);
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
      grid: { left: 40, right, top: 12, bottom: slider ? 55 : 24 },
      xAxis: {
        type: 'category', data: labels, boundaryGap: !line,
        axisLine: { onZero: false, lineStyle: { color: '#eaeaea' } },
        axisTick: { show: false },
        axisLabel: { color: '#555759', fontSize: 12, margin: 8, hideOverlap: true },
        ...(key === 'distribution' && {
          axisPointer: {
            label: {
              show: true, margin: 8, padding: [0, 2], backgroundColor: '#fff',
              color: '#262626', fontSize: 12, fontWeight: 700, borderRadius: 0,
              shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0,
            },
          },
        }),
      },
      yAxis: {
        type: 'value', min, max, splitNumber: 6,
        axisLabel: { formatter: '{value}%', color: '#555759', fontSize: 12, margin: 9 },
        splitLine: { lineStyle: { color: '#e9eaec', type: 'dashed' } },
      },
      dataZoom: slider ? [{ id: returnZoomId, type: 'inside', xAxisIndex: 0, disabled: true }] : [],
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
      if (key === 'returns' && dataset.labels.length > 1) mountReturnRange(element, chart, dataset);
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
