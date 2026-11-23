const palette = ['#E68BA9', '#E7BA70', '#B8CC80', '#AA99DA', '#7CBDC3'];
const textColor = '#666';
const lineColor = '#c9c7e8';
const labelFont = 'Roboto, "PingFang SC", sans-serif';
const axisNumber = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 });
const preciseNumber = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const tooltip = {
  renderMode: 'richText',
  confine: true,
  borderColor: '#E8E7EE',
  textStyle: { color: '#333', fontFamily: labelFont, fontSize: 12 },
};

function emptyChart() {
  return {
    animation: false,
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'middle',
      textStyle: { color: textColor, fontFamily: labelFont, fontSize: 14, fontWeight: 'normal' },
    },
  };
}

function amount(value) {
  return Number.isFinite(value) ? preciseNumber.format(value) + ' 亿元' : '—';
}

function scaleChart(rows, approximate) {
  const data = rows
    .filter(item => item?.date && (Number.isFinite(item.total) || Number.isFinite(item.change)))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!data.length) return emptyChart();

  const values = key => data.map(item => Number.isFinite(item[key]) ? item[key] : null);
  return {
    animation: false,
    textStyle: { fontFamily: labelFont },
    tooltip: {
      ...tooltip,
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#B7B4D2', type: 'dashed' } },
      valueFormatter: amount,
      ...(approximate && {
        formatter: items => [
          items[0]?.axisValueLabel,
          ...items.map(item => `${item.marker}${item.seriesName}：${amount(item.value)}`),
          '图表点位为示意值',
        ].filter(Boolean).join('\n'),
      }),
    },
    legend: {
      bottom: 3, itemWidth: 12, itemHeight: 8, itemGap: 20,
      data: ['总规模', '规模变化'],
      textStyle: { color: textColor, fontSize: 12 },
    },
    grid: { left: 4, right: 12, top: 24, bottom: 37, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date),
      axisTick: { show: false },
      axisLine: { show: true, onZero: false, lineStyle: { color: '#E1E1E9' } },
      axisLabel: {
        color: textColor, fontSize: 12, margin: 10,
        showMinLabel: true, showMaxLabel: true, hideOverlap: true,
        formatter: (date, index) => {
          const year = date.slice(0, 4);
          const earlier = data[index - 1];
          if (index === data.length - 1 && earlier?.date.startsWith(year)) return date.slice(5);
          return earlier?.date.startsWith(year) ? '' : year;
        },
        interval: (index, date) => !index || index === data.length - 1 || !data[index - 1].date.startsWith(date.slice(0, 4)),
      },
    },
    yAxis: {
      type: 'value',
      name: '亿元',
      nameLocation: 'end',
      nameGap: 9,
      nameTextStyle: { color: textColor, fontSize: 12, align: 'right' },
      splitNumber: 5,
      axisLabel: { formatter: value => axisNumber.format(value), color: textColor, fontSize: 12 },
      splitLine: { lineStyle: { color: '#ECECF2', type: 'dashed' } },
    },
    series: [
      {
        name: '总规模', type: 'line', data: values('total'),
        showSymbol: data.length === 1, symbolSize: 5, connectNulls: false, z: 3,
        lineStyle: { color: '#6865A7', width: 2 },
        itemStyle: { color: '#6865A7' },
      },
      {
        name: '规模变化', type: 'bar', data: values('change'),
        barMaxWidth: 22,
        itemStyle: { color: lineColor },
      },
    ],
  };
}

function productChart(rows, useLegend) {
  const items = rows.filter(item => item?.label && Number.isFinite(item.percent) && item.percent > 0);
  if (!items.length) return emptyChart();

  const data = items.map((item, index) => ({
    name: item.label,
    value: item.percent,
    itemStyle: { color: item.color || palette[index % palette.length] },
  }));

  return {
    animation: false,
    textStyle: { fontFamily: labelFont },
    tooltip: {
      ...tooltip,
      trigger: 'item',
      valueFormatter: value => preciseNumber.format(value) + '%',
    },
    legend: useLegend ? {
      bottom: 3, itemWidth: 8, itemHeight: 8, itemGap: 12, icon: 'circle',
      selectedMode: false,
      textStyle: { color: textColor, fontSize: 12 },
    } : undefined,
    series: [{
      name: '规模占比',
      type: 'pie',
      data,
      center: ['50%', useLegend ? '44%' : '50%'],
      radius: ['53%', '82%'],
      startAngle: 90,
      label: { show: false },
      labelLine: { show: false },
      emphasis: { scaleSize: 4 },
    }],
  };
}

export function ratingChartImage(distribution) {
  if (!distribution?.querySelector('.company-rating-plot')) return null;

  const {left, top, width, height} = distribution.getBoundingClientRect();
  if (!width || !height) return null;
  const padding = 16;
  const pixelRatio = 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil((width + padding * 2) * pixelRatio);
  canvas.height = Math.ceil((height + padding * 2) * pixelRatio);
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
  context.translate(padding - left, padding - top);

  function drawShape(element) {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const style = getComputedStyle(element);
    context.fillStyle = style.backgroundColor;
    context.beginPath();
    if (typeof context.roundRect === 'function') {
      context.roundRect(rect.left, rect.top, rect.width, rect.height, Number.parseFloat(style.borderTopLeftRadius) || 0);
    } else {
      context.rect(rect.left, rect.top, rect.width, rect.height);
    }
    context.fill();
  }

  function drawLabel(element) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    context.fillStyle = style.color;
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.textBaseline = 'middle';
    context.fillText(element.textContent.trim(), rect.left, rect.top + rect.height / 2);
  }

  distribution.querySelectorAll('.company-rating-row[aria-pressed="true"]').forEach(drawShape);
  context.setLineDash([4, 4]);
  distribution.querySelectorAll('.company-rating-guides span').forEach(guide => {
    const rect = guide.getBoundingClientRect();
    const style = getComputedStyle(guide);
    context.lineWidth = Number.parseFloat(style.borderLeftWidth) || 1;
    context.strokeStyle = style.borderLeftColor;
    const x = rect.left + rect.width / 2;
    context.beginPath();
    context.moveTo(x, rect.top);
    context.lineTo(x, rect.bottom);
    context.stroke();
  });
  distribution.querySelectorAll('.company-bar').forEach(drawShape);
  distribution.querySelectorAll(
    'h3, .company-rating-row > span:not(.company-bar-track, .company-rating-quantity), .company-rating-quantity > span, .company-rating-axis span'
  ).forEach(drawLabel);
  return canvas.toDataURL('image/png');
}

export function mountCompanyCharts(root, data = {}) {
  const echarts = globalThis.echarts;
  if (!root || !echarts) return () => {};

  const onProductHover = data.onProductHover;
  let hoveredProduct = null;
  function setHoveredProduct(name) {
    if (hoveredProduct === name) return;
    hoveredProduct = name;
    onProductHover(name);
  }

  function bindProductHover(chart) {
    const isSlice = params => params?.componentType === 'series' &&
      params.seriesType === 'pie' && typeof params.name === 'string';
    chart.on('mouseover', params => {
      if (isSlice(params)) setHoveredProduct(params.name);
    });
    chart.on('mouseout', params => {
      if (isSlice(params) && hoveredProduct === params.name) setHoveredProduct(null);
    });
    chart.on('globalout', () => setHoveredProduct(null));
  }

  const entries = [
    ['scale', () => scaleChart(data.scale ?? [], data.scaleApproximate)],
    ['products', element => productChart(data.products ?? [], element.dataset.companyChartLegend !== 'external')],
  ].map(([key, getOptions]) => {
    const element = root.querySelector('[data-company-chart="' + key + '"]');
    return { key, element, getOptions, chart: undefined };
  }).filter(entry => entry.element);
  if (!entries.length) return () => {};

  function syncSize(entry) {
    const { element } = entry;
    if (!element.clientWidth || !element.clientHeight) return;
    if (entry.chart && !entry.chart.isDisposed()) {
      entry.chart.resize();
      return;
    }
    const chart = echarts.getInstanceByDom(element) || echarts.init(element, null, { renderer: 'canvas' });
    chart.setOption(entry.getOptions(element), { notMerge: true });
    if (entry.key === 'products' && typeof onProductHover === 'function') bindProductHover(chart);
    entry.chart = chart;
  }

  const syncCharts = () => entries.forEach(syncSize);
  syncCharts();
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(syncCharts) : undefined;
  if (observer) {
    entries.forEach(entry => observer.observe(entry.element));
  } else {
    window.addEventListener('resize', syncCharts);
  }

  return () => {
    observer?.disconnect();
    if (!observer) window.removeEventListener('resize', syncCharts);
    entries.forEach(({ chart }) => {
      if (chart && !chart.isDisposed()) chart.dispose();
    });
    if (hoveredProduct !== null) setHoveredProduct(null);
  };
}
