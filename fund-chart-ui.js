/* Fund analysis charts share the comparison tooltip and line conventions.
 * All table/download views read the ECharts series currently on the page.
 */
(() => {
  'use strict';
  const peerColor = '#9D9DA7';
  const tableViews = new WeakMap();
  const sourceOptions = new WeakMap();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const array = value => Array.isArray(value) ? value : value == null ? [] : [value];
  const raw = value => value && typeof value === 'object' && !Array.isArray(value) ? value.value : value;
  const missing = value => value == null || value === '' || value === '-' || value === '--' || (typeof value === 'number' && !Number.isFinite(value));
  const numeric = value => !missing(value) && Number.isFinite(Number(value));
  const nameOf = (series, index) => series.name && !String(series.name).startsWith('series\u0000') ? series.name : `数据 ${index + 1}`;
  const selector = '.fund-chart, .fund-donut-chart, [data-fund-chart]';
  function charts(root = document) {
    const elements = [...root.querySelectorAll(selector)];
    if (root.matches?.(selector)) elements.unshift(root);
    return elements.map(el => window.echarts?.getInstanceByDom(el)).filter(chart => chart && !chart.isDisposed());
  }
  function axisFor(option, series, dimension = 'y') {
    return array(option[`${dimension}Axis`])[Number(series?.[`${dimension}AxisIndex`]) || 0] || {};
  }
  function percentage(option, series, chartId) {
    const axis = axisFor(option, series);
    if (typeof axis.axisLabel?.formatter === 'string' && axis.axisLabel.formatter.includes('%')) return true;
    if (/收益|回报|波动率|回撤|占比|概率/.test(axis.name || '')) return true;
    if (series.type === 'pie') return true;
    return /overview-(return|risk)|cumulative-return|investor-gap|monthly-return|return-(distribution|forecast)|vol-drawdown|drawdown-bars|scenario|manager-performance|risk-return|risk-scatter|asset-history|board-history|region-history|industry-history|drift-(area|bars)|bond-(change|pure-history)|allocation-attribution|industry-attribution|stock-selection|trading-attribution|factor-attribution|manager-ranking/.test(chartId);
  }
  function formatNumber(value, isPercent = false) {
    if (missing(value)) return '--';
    if (!numeric(value)) return escape(value);
    const num = Number(value);
    return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}${isPercent ? '%' : ''}`;
  }
  function primarySeries(series) {
    return /本基金|华夏成长|交银定期|易方达科汇/.test(series.name || '') && !/同类/.test(series.name || '');
  }
  function colors(option, series, index) {
    return typeof series.itemStyle?.color === 'string' ? series.itemStyle.color
      : typeof series.lineStyle?.color === 'string' ? series.lineStyle.color
      : array(option.color)[index % Math.max(array(option.color).length, 1)] || '#6865A7';
  }
  function graphicLabel(option, series) {
    const axes = array(option.yAxis);
    if (axes.length < 2 || Number(series.yAxisIndex) === 0 || !series.yAxisIndex) return '';
    if (axes[series.yAxisIndex]?.name) return axes[series.yAxisIndex].name;
    const labels = array(option.graphic).flatMap(item => array(item.elements?.length ? item.elements : item)).filter(item => item.type === 'text').map(item => item.style?.text).filter(Boolean);
    return labels[series.yAxisIndex] || `坐标 ${Number(series.yAxisIndex) + 1}`;
  }
  function pointText(param, option, chartId) {
    const series = array(option.series)[param.seriesIndex] || {};
    const value = raw(param.value);
    const percent = percentage(option, series, chartId);
    if (Array.isArray(value)) {
      if (series.type === 'scatter' && !/更换|分红|预警/.test(series.name || '')) {
        const x = axisFor(option, series, 'x');
        const y = axisFor(option, series, 'y');
        return `${escape(x.name || 'X')} ${formatNumber(value[0], /率|回报|收益|占比/.test(x.name || ''))}<br>${escape(y.name || 'Y')} ${formatNumber(value[value.length - 1], percent)}`;
      }
      return formatNumber(value[value.length - 1], percent);
    }
    return formatNumber(value, percent);
  }
  function formatter(instance, params) {
    const option = instance.getOption();
    let items = array(params).filter(item => item && !/更换|分红|预警/.test(item.seriesName || ''));
    if (!items.length) items = array(params).filter(Boolean);
    if (!items.length) return '';
    const id = instance.getDom().id;
    // Linked axes can provide both panels' series. Keep the visible panel's rows.
    const activeAxis = items[0].axisIndex;
    if (activeAxis !== undefined) items = items.filter(item => item.axisIndex === undefined || item.axisIndex === activeAxis);
    const seen = new Set();
    items = items.filter(item => {
      const series = array(option.series)[item.seriesIndex] || {};
      const key = `${item.seriesName}|${graphicLabel(option, series)}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    const heading = items[0].axisValueLabel ?? items[0].axisValue ?? items[0].name ?? '';
    const width = Math.min(292, Math.max(180, instance.getDom().clientWidth - 18));
    return `<div class="zc-return-line-tooltip fund-chart-tip" style="width:${width}px">${heading !== '' ? `<strong class="fund-chart-tip-date">${escape(heading)}</strong>` : ''}<ul class="fund-chart-tip-rows">${items.map(item => {
      const series = array(option.series)[item.seriesIndex] || {};
      const label = nameOf(series, item.seriesIndex);
      const group = graphicLabel(option, series);
      const color = colors(option, series, item.seriesIndex);
      return `<li class="fund-chart-tip-row"><i style="background:${escape(color)}"></i><span class="zc-line-tip-name fund-chart-tip-name">${escape(label)}${group ? ` · ${escape(group)}` : ''}</span><b class="fund-chart-tip-value">${pointText(item, option, id)}</b></li>`;
    }).join('')}</ul></div>`;
  }
  function enhance(root = document) {
    root.querySelectorAll('.fund-source-chart svg path[stroke], .fund-source-chart svg polyline[stroke]').forEach(line => {
      const color = (line.getAttribute('stroke') || '').toLowerCase();
      if (!color || ['#ddd', '#dddddd', '#eee', '#eeeeee', '#eaeaea', '#666', '#666666', '#ccc', '#cccccc'].includes(color)) return;
      const chart = line.closest('[data-source-chart]');
      const benchmark = chart?.dataset.sourceChart === 'manager-index' && color === '#ffc069';
      line.setAttribute('stroke-width', benchmark ? '1' : '2');
      line.setAttribute('vector-effect', 'non-scaling-stroke');
    });
    charts(root).forEach(instance => {
      const option = instance.getOption();
      if (!sourceOptions.has(instance)) sourceOptions.set(instance, option);
      const series = array(option.series);
      const hasFundSeries = series.some(primarySeries);
      const lineCount = series.filter(item => item.type === 'line').length;
      const updates = series.map((item, index) => {
        const update = { type: item.type };
        if (item.id) update.id = item.id;
        if (item.name) update.name = item.name;
        if (item.type === 'line') {
          const primary = primarySeries(item) || (!hasFundSeries && lineCount === 1);
          update.lineStyle = { ...item.lineStyle, width: primary ? 2 : 1 };
          if (/同类平均/.test(item.name || '')) {
            update.lineStyle = { ...update.lineStyle, color: peerColor, type: 'solid' };
            update.itemStyle = { ...item.itemStyle, color: peerColor, borderColor: peerColor };
          } else if (typeof item.lineStyle?.color === 'string') {
            update.itemStyle = { ...item.itemStyle, color: item.lineStyle.color };
          }
        }
        return update;
      });
      const tooltip = {
        show: true, confine: true, renderMode: 'html', trigger: option.tooltip?.[0]?.trigger || 'axis',
        backgroundColor: 'transparent', borderWidth: 0,
        padding: 0, textStyle: { color: '#333', fontSize: 12, fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' },
        extraCssText: 'box-shadow:none;white-space:normal;',
        axisPointer: { type: 'line', lineStyle: { color: '#b9b8d8', type: 'solid', width: 1 } },
        formatter: params => formatter(instance, params),
      };
      instance.setOption({ series: updates, tooltip }, { lazyUpdate: false });
      instance.getDom().dataset.fundChartUnified = 'true';
    });
  }
  function tabular(instance) {
    const option = instance.getOption();
    const allSeries = array(option.series).filter(series => !/更换|分红|预警/.test(series.name || ''));
    const axes = array(option.xAxis);
    if (allSeries.length && allSeries.every(series => series.type === 'pie')) {
      return { headers: ['分类', '数值'], rows: array(allSeries[0].data).map(item => [item.name || '--', raw(item)]) };
    }
    if (allSeries.length && allSeries.every(series => series.type === 'scatter')) {
      return { headers: ['系列', 'X', 'Y'], rows: allSeries.flatMap((series, i) => array(series.data).map(item => {
        const point = raw(item);return [nameOf(series, i), ...array(point)];
      })) };
    }
    // A wide table keeps comparison-series values on the same category row.
    const rowCount = Math.max(0, ...allSeries.map(series => array(series.data).length));
    const headers = ['日期 / 类别', ...allSeries.map((series, i) => {
      const label = graphicLabel(option, series);
      return `${nameOf(series, i)}${label ? ` · ${label}` : ''}${percentage(option, series, instance.getDom().id) ? '（%）' : ''}`;
    })];
    const rows = Array.from({ length: rowCount }, (_, index) => {
      const reference = allSeries[0] || {};
      let category = axes[Number(reference.xAxisIndex) || 0]?.data?.[index];
      if (category && typeof category === 'object') category = category.value;
      if (category == null) category = array(option.yAxis)[Number(reference.yAxisIndex) || 0]?.data?.[index];
      if (category == null) category = String(index + 1);
      return [category, ...allSeries.map(series => {
        const point = raw(array(series.data)[index]);
        return Array.isArray(point) ? point[point.length - 1] : point;
      })];
    });
    return { headers, rows };
  }
  function tableHTML(instance) {
    const data = tabular(instance);
    if (!data.rows.length) return '<p class="fund-chart-table-empty">暂无数据</p>';
    return `<div class="fund-table-wrap fund-chart-data-table"><table class="fund-table"><thead><tr>${data.headers.map((header, i) => `<th${i ? ' class="is-num"' : ''}>${escape(header)}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row => `<tr>${row.map((value, i) => `<td${i ? ' class="is-num"' : ''}>${i && numeric(value) ? formatNumber(value) : missing(value) ? '--' : escape(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function showTable(instance, show) {
    const el = instance.getDom();
    let table = tableViews.get(instance);
    if (show) {
      if (!table) {
        table = document.createElement('div');
        table.className = 'fund-chart-table-view';
        table.setAttribute('data-chart-table-for', el.id);
        tableViews.set(instance, table);
        el.insertAdjacentElement('afterend', table);
      }
      table.innerHTML = tableHTML(instance);
      table.hidden = false;
      el.hidden = true;
    } else {
      if (table) table.hidden = true;
      el.hidden = false;
      instance.resize();
    }
  }
  function filename(root) {
    return (root.querySelector?.('h2, h3')?.textContent.trim() || '基金分析').replace(/[\\/:*?"<>|]/g, '-');
  }
  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function csvCell(value) {
    let text = missing(value) ? '--' : String(value);
    if (/^[=+@]/.test(text) || (/^-/.test(text) && !numeric(text))) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }
  function exportCSV(root) {
    const datasets = charts(root).map(instance => ({ title: instance.getDom().getAttribute('aria-label') || instance.getDom().id, ...tabular(instance) }));
    root.querySelectorAll('table:not(.fund-chart-data-table table)').forEach(table => {
      if (table.closest('.fund-chart-table-view')) return;
      const rows = [...table.rows].map(row => [...row.cells].map(cell => cell.textContent.trim()));
      if (rows.length) datasets.push({ title: '', headers: rows[0], rows: rows.slice(1) });
    });
    if (!datasets.length) return false;
    const text = datasets.map(data => [[data.title], data.headers, ...data.rows].map(row => row.map(csvCell).join(',')).join('\r\n')).join('\r\n\r\n');
    download(new Blob(['\ufeff', text], { type: 'text/csv;charset=utf-8' }), `${filename(root)}.csv`);
    return true;
  }
  async function exportImage(root) {
    const urls = [];
    const elements = [...root.querySelectorAll('.fund-chart, .fund-donut-chart, [data-fund-chart]')];
    if (root.matches?.('.fund-chart, .fund-donut-chart, [data-fund-chart]')) elements.unshift(root);
    elements.forEach(el => {
      const instance = window.echarts?.getInstanceByDom(el);
      if (instance && !instance.isDisposed()) {
        urls.push(instance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff', excludeComponents: ['toolbox'] }));
      } else if (el.matches('.fund-source-chart') && el.querySelector('svg')) {
        const svg = el.querySelector('svg').cloneNode(true);
        const view = svg.getAttribute('viewBox')?.split(/\s+/).map(Number) || [0, 0, 600, 300];
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', String(view[2] * 2)); svg.setAttribute('height', String(view[3] * 2));
        urls.push(URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' })));
      }
    });
    if (!urls.length) return false;
    const images = await Promise.all(urls.map(url => new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image); image.onerror = () => resolve(null); image.src = url;
    })));
    const visible = images.filter(Boolean);
    if (!visible.length) return false;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(...visible.map(image => image.width));
    canvas.height = visible.reduce((total, image) => total + image.height + 32, 0);
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';context.fillRect(0, 0, canvas.width, canvas.height);
    let y = 16; visible.forEach(image => { context.drawImage(image, 0, y); y += image.height + 32; });
    await new Promise(resolve => canvas.toBlob(blob => { if (blob) download(blob, `${filename(root)}.png`); resolve(); }, 'image/png'));
    urls.filter(url => url.startsWith('blob:')).forEach(url => URL.revokeObjectURL(url));
    return true;
  }
  function parseDate(value) {
    if (typeof value !== 'string') return null;
    const match = /^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?$/.exec(value.trim());
    if (!match) return null;
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3] || 1);
    const time = Date.UTC(year, month - 1, day);
    const date = new Date(time);
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? time : null;
  }
  function extent(root) {
    const dates = charts(root).flatMap(instance => array((sourceOptions.get(instance) || instance.getOption()).xAxis)
      .flatMap(axis => array(axis.data).map(value => parseDate(typeof value === 'object' ? value?.value : value)).filter(value => value !== null)));
    if (!dates.length) return null;
    const iso = value => new Date(value).toISOString().slice(0, 10);
    return { start: iso(Math.min(...dates)), end: iso(Math.max(...dates)) };
  }
  function applyRange(root, start, end) {
    const from = parseDate(start), until = parseDate(end);
    if (from === null || until === null || from > until) return false;
    let applied = false;
    charts(root).forEach(instance => {
      const source = sourceOptions.get(instance) || instance.getOption();
      if (!sourceOptions.has(instance)) sourceOptions.set(instance, source);
      const masks = new Map();
      const xAxis = array(source.xAxis).map((axis, index) => {
        const dates = array(axis.data).map(value => parseDate(typeof value === 'object' ? value?.value : value));
        if (!dates.length || dates.some(value => value === null)) return axis;
        const indices = dates.flatMap((date, i) => date >= from && date <= until ? [i] : []);
        masks.set(index, { indices, count: dates.length });
        return { ...axis, data: indices.map(i => axis.data[i]) };
      });
      if (!masks.size) return;
      applied = true;
      const series = array(source.series).map(item => {
        const mask = masks.get(Number(item.xAxisIndex) || 0);
        if (!mask) return item;
        let data = array(item.data);
        if (item.type === 'scatter' && data.length !== mask.count) {
          data = data.flatMap(point => {
            const value = raw(point);
            if (!Array.isArray(value)) return [];
            const newIndex = mask.indices.indexOf(Number(value[0]));
            if (newIndex < 0) return [];
            const filtered = [newIndex, ...value.slice(1)];
            return [point && typeof point === 'object' && !Array.isArray(point) ? { ...point, value: filtered } : filtered];
          });
        } else data = mask.indices.map(i => data[i]);
        return { ...item, data };
      });
      const empty = [...masks.values()].every(mask => !mask.indices.length);
      const graphic = [...array(source.graphic)];
      if (empty) graphic.push({ id: 'fund-range-empty', type: 'text', left: 'center', top: 'middle', style: { text: '所选时段暂无数据', fill: '#999', fontSize: 14, fontFamily: '"PingFang SC", sans-serif' } });
      const currentLegend = instance.getOption().legend;
      instance.setOption({ ...source, xAxis, series, graphic, legend: currentLegend, dataZoom: array(source.dataZoom).map(zoom => ({ ...zoom, start: 0, end: 100 })) }, { notMerge: true });
      instance.getDom().toggleAttribute('data-empty-range', empty);
      const table = tableViews.get(instance);
      if (table && !table.hidden) table.innerHTML = tableHTML(instance);
    });
    if (applied) enhance(root);
    return applied;
  }
  function refresh(root) {
    charts(root).forEach(instance => {
      const option = instance.getOption();
      instance.clear(); instance.setOption(option); instance.resize();
      const table = tableViews.get(instance);
      if (table && !table.hidden) table.innerHTML = tableHTML(instance);
    });
  }
  window.FundChartUI = { enhance, charts, tableHTML, showTable, exportCSV, exportImage, refresh, applyRange, extent, data: tabular };
})();
