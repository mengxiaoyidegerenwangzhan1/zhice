const labelFont = 'Roboto, "PingFang SC", sans-serif';
const textColor = '#666';
const dividerColor = '#eaeaea';
const primary = '#6865a7';
const labelStyle = { color: textColor, fontSize: 12 };
const ratio = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const tooltip = {
  renderMode: 'richText',
  confine: true,
  borderColor: dividerColor,
  textStyle: { ...labelStyle, fontFamily: labelFont, color: '#333' },
};

function percent(value) {
  return Number.isFinite(value) ? ratio.format(value) + '%' : '—';
}

function emptyChart() {
  return {
    animation: false,
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'middle',
      textStyle: { ...labelStyle, fontFamily: labelFont, fontWeight: 'normal' },
    },
  };
}

function donutChart({ categories, colors, values }) {
  if (!values.some(value => Number.isFinite(value) && value > 0)) return emptyChart();

  return {
    animation: false,
    textStyle: { fontFamily: labelFont },
    tooltip: { ...tooltip, trigger: 'item', valueFormatter: percent },
    series: [{
      name: '占比',
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['54%', '86%'],
      startAngle: 90,
      label: { show: false },
      labelLine: { show: false },
      emphasis: { scaleSize: 4 },
      data: categories.map((name, index) => ({
        name,
        value: Number.isFinite(values[index]) && values[index] > 0 ? values[index] : 0,
        itemStyle: { color: colors[index] ?? primary },
      })),
    }],
  };
}

function legendLayout(categories, width, height, selected) {
  const itemGap = 12;
  const rowHeight = 24;
  let rows = 1;
  let occupied = 0;
  for (const label of categories) {
    const itemWidth = Math.min(width, Array.from(label).reduce(
      (pixels, char) => pixels + (char.charCodeAt(0) > 255 ? 12 : 7),
      16,
    ));
    if (occupied && occupied + itemWidth + itemGap > width - 20) {
      rows += 1;
      occupied = 0;
    }
    occupied += itemWidth + itemGap;
  }
  const scroll = rows > 4 || height - rows * rowHeight < 195;

  return {
    legend: {
      type: scroll ? 'scroll' : 'plain',
      data: categories,
      selected,
      bottom: 0,
      left: 4,
      right: 4,
      icon: 'roundRect',
      itemWidth: 10,
      itemHeight: 8,
      itemGap,
      textStyle: labelStyle,
      pageIconColor: primary,
      pageIconInactiveColor: '#cbcbcb',
      pageTextStyle: labelStyle,
    },
    grid: {
      top: 16,
      right: 40,
      bottom: (scroll ? 1 : rows) * rowHeight + 4,
      left: 3,
      containLabel: true,
    },
  };
}

function trendChart({ categories, colors, history }, key, width, height) {
  if (!history.length) return emptyChart();
  const isAsset = key === 'assets';
  const industryMaximum = Math.max(...history.map(row =>
    row.values.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0)
  ));
  const maximum = isAsset ? 100 : Math.max(30, Math.ceil(industryMaximum / 5) * 5);

  return {
    animation: false,
    textStyle: { fontFamily: labelFont },
    ...legendLayout(categories, width, height),
    tooltip: {
      ...tooltip,
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#b9b8d8', type: 'dashed' } },
      formatter: items => {
        const values = items
          .filter(item => Number.isFinite(item.value) && item.value > 0)
          .sort((a, b) => b.value - a.value);
        const limit = 8;
        const labels = values.slice(0, limit).map(item =>
          item.marker + item.seriesName + '  ' + percent(item.value)
        );
        if (values.length > limit) labels.push('另有 ' + (values.length - limit) + ' 类');
        return [items[0]?.axisValueLabel, ...labels].filter(Boolean).join('\n');
      },
    },
    xAxis: {
      type: 'category',
      data: history.map(row => row.date),
      boundaryGap: history.length === 1,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: dividerColor } },
      axisLabel: {
        ...labelStyle,
        margin: 10,
        showMinLabel: true,
        showMaxLabel: true,
        hideOverlap: true,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: maximum,
      ...(isAsset ? { interval: 20 } : { splitNumber: 6 }),
      axisLabel: { ...labelStyle, formatter: '{value}%' },
      splitLine: { lineStyle: { color: dividerColor, type: 'dashed' } },
    },
    series: categories.map((name, index) => {
      const color = colors[index] ?? primary;
      return {
        name,
        type: 'line',
        stack: key,
        data: history.map(row => Number.isFinite(row.values[index]) ? row.values[index] : null),
        symbol: 'circle',
        showSymbol: history.length === 1,
        symbolSize: 6,
        connectNulls: false,
        lineStyle: { color, width: 1 },
        itemStyle: { color },
        areaStyle: { color, opacity: 0.9 },
        emphasis: { focus: 'series' },
      };
    }),
  };
}

export function mountHoldingCharts(root, config) {
  const echarts = globalThis.echarts;
  if (!root || !echarts) return () => {};

  const entries = ['assets', 'industry'].flatMap(key =>
    ['current', 'trend'].map(view => ({
      key, view, model: config[key],
      element: root.querySelector('[data-holdings-chart="' + key + '-' + view + '"]'),
    }))
  ).filter(entry => entry.element && entry.model);
  if (!entries.length) return () => {};

  function selectSlice(entry, index) {
    if (entry.hovered === index) return;
    if (entry.hovered != null) {
      entry.chart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: entry.hovered });
    }
    entry.hovered = index;
    config.onHover?.(entry.key, index);
  }

  function bindDonut(entry) {
    const isSlice = params => params?.seriesType === 'pie' && Number.isInteger(params.dataIndex);
    entry.chart.on('mouseover', params => {
      if (isSlice(params)) selectSlice(entry, params.dataIndex);
    });
    entry.chart.on('mouseout', params => {
      if (isSlice(params) && entry.hovered === params.dataIndex) selectSlice(entry, null);
    });
    entry.chart.on('globalout', () => selectSlice(entry, null));
  }

  function syncChart(entry) {
    const width = entry.element.clientWidth;
    const height = entry.element.clientHeight;
    if (!width || !height || (width === entry.width && height === entry.height)) return;

    entry.width = width;
    entry.height = height;
    if (entry.chart && !entry.chart.isDisposed()) {
      entry.chart.resize();
      if (entry.view === 'trend' && entry.model.history.length) {
        const selected = entry.chart.getOption().legend?.[0]?.selected;
        entry.chart.setOption(legendLayout(entry.model.categories, width, height, selected), {
          replaceMerge: ['legend'],
        });
      }
      return;
    }

    const isCurrent = entry.view === 'current';
    entry.chart = echarts.getInstanceByDom(entry.element) ??
      echarts.init(entry.element, null, { renderer: 'canvas' });
    entry.chart.setOption(isCurrent ? donutChart(entry.model) :
      trendChart(entry.model, entry.key, width, height), { notMerge: true });
    if (isCurrent) bindDonut(entry);
  }

  function hoverTableRow(event) {
    const row = event.target.closest?.('[data-holdings-row][data-holdings-index]');
    if (!row || row.contains(event.relatedTarget)) return;
    const entry = entries.find(item => item.key === row.dataset.holdingsRow && item.view === 'current');
    if (!entry?.chart || entry.chart.isDisposed()) return;
    const index = Number(row.dataset.holdingsIndex);
    if (!Number.isInteger(index) || index < 0 || index >= entry.model.categories.length) return;
    const over = event.type === 'mouseover' || event.type === 'focusin';
    if (over) {
      selectSlice(entry, index);
      entry.chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: index });
    } else if (entry.hovered === index) {
      selectSlice(entry, null);
    }
  }

  const syncCharts = () => entries.forEach(syncChart);
  syncCharts();
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(syncCharts) : null;
  if (observer) entries.forEach(entry => observer.observe(entry.element));
  else window.addEventListener('resize', syncCharts);

  const hoverEvents = ['mouseover', 'mouseout', 'focusin', 'focusout'];
  hoverEvents.forEach(event => root.addEventListener(event, hoverTableRow));

  return () => {
    observer?.disconnect();
    if (!observer) window.removeEventListener('resize', syncCharts);
    hoverEvents.forEach(event => root.removeEventListener(event, hoverTableRow));
    entries.forEach(entry => {
      if (entry.chart && !entry.chart.isDisposed()) entry.chart.dispose();
      if (entry.hovered != null) config.onHover?.(entry.key, null);
    });
  };
}
