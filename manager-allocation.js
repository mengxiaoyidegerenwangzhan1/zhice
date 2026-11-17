(() => {
  const iconRoot = './assets/manager-allocation/';
  const latestReport = '2026-09-30';
  const reports = [latestReport, '2026-06-30', '2026-03-31', '2025-12-31', '2025-09-30', '2025-06-30', '2025-03-31'];
  const classifications = ['行业分布 - 申万行业分类', '行业分布 - 中信行业分类', '行业分布 - 中证行业分类', '行业分布 - 证监会行业分类', '板块分布'];
  const sections = [
    { key: 'fund-types', title: '旗下基金分布' },
    {
      key: 'assets', title: '大类资产分布', report: true,
      help: [
        '根据基金经理当期在管基金公布的季报统计得到基金经理每个季度所管基金的大类资产分布情况汇总。',
        '不同报告期内，基金经理管理的基金数量可能不同，汇总结果可能存在差异。',
      ],
    },
    { key: 'industries', title: '股票资产分布', help: ['展示基金经理旗下基金的股票持仓分布，占比按所选行业或板块分类汇总。'] },
    { key: 'stocks', title: '前十大重仓股票', report: true, holdings: 10 },
    { key: 'bonds', title: '债券资产分布', report: true, help: ['根据所选报告期汇总基金经理旗下基金的债券资产分布。'] },
    { key: 'bond-holdings', title: '前五大重仓债券', report: true, holdings: 5, help: ['根据所选报告期展示基金经理旗下基金持仓占比最高的五只债券。'] },
  ];
  const fundTypes = [
    ['混合型', [88.72, 5.07]],
    ['股票型', [5.07, 88.72]],
  ];
  const assetLabels = ['股票', '基金', '银行存款', '固定收益', '可转换债券', '其他资产'];
  const assetReports = {
    [latestReport]: [[88.72, 5.07], [0, 89.93], [9.36, 4.14], [0.43, 0.62], [0.11, 0.12], [1.38, 0.12]],
    '2025-03-31': [[86.45, 5.07], [4.68, 85.32], [6.67, 6.43], [0.89, 2.63], [0.13, 0.16], [1.18, 0.39]],
  };
  const industries = [
    ['电子', [20.30, 24.72], '#c9b8e1', 0],
    ['机械设备', [16.17, 12.31], '#7ebaa2', 1],
    ['电力设备', [13.01, 10.81], '#a6c8d3', 1],
    ['计算机', [10.59, 9.31], '#b8afd8', 0],
    ['基础化工', [6.83, 6.12], '#aec9a0', 2],
    ['医药生物', [5.31, 5.09], '#e3cc88', 3],
    ['汽车', [4.39, 4.88], '#8cc2b5', 1],
    ['通信', [4.11, 4.99], '#a2a5d2', 0],
    ['国防军工', [3.75, 3.40], '#94c9c5', 1],
    ['有色金属', [3.50, 3.91], '#adc193', 2],
    ['食品饮料', [2.25, 2.42], '#f4bd84', 3],
    ['公用事业', [1.81, 1.89], '#acc6dc', 4],
    ['交通运输', [1.49, 1.31], '#ec917f', 4],
    ['建筑装饰', [1.39, 1.29], '#eda2a6', 1],
    ['农林牧渔', [1.18, 1.04], '#deb374', 3],
    ['非银金融', [1.04, 1.15], '#85b5d2', 4],
    ['银行', [0.96, 1.31], '#a5c99e', 4],
    ['传媒', [0.81, 0.89], '#ef9d9e', 0],
    ['美容护理', [0.60, 0.63], '#d1cc91', 3],
    ['轻工制造', [0.51, 0.57], '#9ac8b5', 1],
  ];
  const industryGroups = {
    [classifications[1]]: ['科技', '制造', '周期', '消费', '金融及其他'],
    [classifications[2]]: ['信息技术', '工业', '原材料', '消费与医药', '金融及其他'],
    [classifications[3]]: ['信息传输、软件和信息技术服务业', '制造业', '采矿及原材料', '消费与卫生', '其他行业'],
    [classifications[4]]: ['科技板块', '制造板块', '周期板块', '消费板块', '其他板块'],
  };
  const bondLabels = ['可转换债券', '政策性金融债券', '金融债券'];
  const bondReports = {
    [latestReport]: [[0.13, 5.07], [3.34, 0], [3.34, 0]],
  };
  const stockHoldings = [
    [['腾讯控股', 9.37], ['贵州茅台', 8.26], ['泡泡玛特', 8.15], ['中国海洋石油', 7.63], ['神火股份', 7.48], ['美团-W', 7.37], ['盐湖股份', 6.12], ['西藏矿业', 5.32], ['洛阳钼业', 4.82], ['中国移动', 4.28]],
    [['寒武纪', 4.77], ['澜起科技', 3.60], ['北方华创', 3.60], ['中微公司', 3.41], ['中芯国际', 3.29], ['海光信息', 3.29], ['兆易创新', 3.19], ['拓荆科技', 1.82], ['长川科技', 1.44], ['长电科技', 1.24]],
  ];
  const bondHoldings = [
    [['25国债05', 6.24], ['25国开03', 8.45], ['25农发06', 5.30], ['25进出04', 7.89], ['24国债13', 4.75]],
    [['26国债01', 3.34], ['26农发11', 1.12], ['25国债19', 0.73], ['25国开03', 0.38]],
  ];
  const colgroup = '<colgroup><col><col><col><col><col></colgroup>';
  const missing = '<span class="zc-allocation-dash">--</span>';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const icon = name => `<img src="${iconRoot}${name}.svg" width="18" height="18" alt="">`;
  const managers = options => options.managers || options.funds || [];
  const slots = options => Array.from({ length: 4 }, (_, index) => managers(options)[index]);
  const reference = options => managers(options).find(manager => manager.id === options.referenceId);
  const referenceColors = ['#7268ab', '#4f83a6', '#9b8148', '#9a6ba4'];
  const scope = key => `manager-allocation-${key}`;
  const profile = manager => manager?.profileIndex ?? ({ a: 0, b: 1, c: 2 }[manager?.id] ?? 3);
  const value = (options, key, field, fallback) => options.ui?.range?.(scope(key))?.[field] ?? fallback;
  const reportFor = (key, options) => value(options, key, 'report', latestReport);
  const percent = amount => `<span class="zc-allocation-number">${amount.toFixed(2)}%</span>`;

  function rowsFor(key, options) {
    if (key === 'fund-types') return fundTypes;
    if (key === 'assets' || key === 'bonds') {
      const [labels, byReport] = key === 'assets' ? [assetLabels, assetReports] : [bondLabels, bondReports];
      const data = byReport[reportFor(key, options)];
      return labels.map((label, index) => [label, data?.[index] || []]);
    }
    const grouping = industryGroups[value(options, key, 'classification', classifications[0])];
    if (!grouping) return industries;
    return grouping.map((label, group) => {
      const rows = industries.filter(row => row[3] === group);
      const amounts = [0, 1].map(index => rows.reduce((total, row) => total + row[1][index], 0));
      return [label, amounts, rows[0][2]];
    });
  }

  function toolbar({ key, title, report, help, holdings }, options) {
    const setting = options.ui?.setting;
    const distribution = key === 'industries' ? classifications : key === 'bonds' ? ['债券种类'] : null;
    const category = distribution ? setting?.(scope(key), 'classification', '分布', distribution, distribution[0]) || '' : '';
    const period = report ? setting?.(scope(key), 'report', '报告期', reports, latestReport) || '' : '';
    const tooltip = help ? `<span class="zc-allocation-help">
      <button type="button" aria-label="${title}说明" aria-describedby="${scope(key)}-help">
        <img src="${iconRoot}help.svg" width="16" height="16" alt="">
        <img class="zc-manager-allocation-help-active" src="${iconRoot}help-active.svg" width="16" height="16" alt="">
      </button>
      <span id="${scope(key)}-help" role="tooltip">${help.map(line => `<span>${line}</span>`).join('')}</span>
    </span>` : '';
    const asOf = key === 'industries' ? `<small>截止日期： <span class="zc-allocation-number">${escape(options.asOf || '2026-11-06')}</span></small>` : '';
    const download = holdings ? `data-analysis-download="${scope(key)}"` : 'data-manager-allocation-image';
    return `<div class="zc-manager-allocation-head">
      <div class="zc-manager-allocation-heading"><h2>${title}</h2>${tooltip}${asOf}</div>
      <div class="zc-manager-allocation-actions">
        ${category || period ? `<div class="zc-manager-allocation-controls">${category}${period}</div>` : ''}
        <div class="zc-manager-allocation-tools" role="group" aria-label="${title}操作">
          <button type="button" ${download} aria-label="下载${title}${holdings ? '表格' : '图片'}" title="${holdings ? '下载表格' : '下载图片'}">${icon(holdings ? 'download-table' : 'download-chart')}</button>
          <button type="button" data-analysis-refresh="${scope(key)}" aria-label="刷新${title}" title="刷新">${icon('refresh')}</button>
        </div>
      </div>
    </div>`;
  }

  function cell(manager, content, baseline) {
    const cellClass = baseline && manager?.id === baseline.id ? ' class="is-reference"' : '';
    return `<td${cellClass}>${manager?.visible ? content || missing : ''}</td>`;
  }

  function valueCells(row, key, options) {
    const baseline = reference(options);
    const baselineAmount = row[1][profile(baseline)];
    return slots(options).map(manager => {
      const amount = row[1][profile(manager)];
      let content = Number.isFinite(amount) ? percent(amount) : '';
      if (content && key !== 'fund-types' && baseline && manager?.id !== baseline.id) {
        const delta = amount - baselineAmount;
        const difference = Number.isFinite(delta) ? `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}pp` : '--';
        content = `<span class="zc-allocation-value-pair">${content}<span class="zc-allocation-difference${delta < 0 ? ' is-negative' : ''}">${difference}</span></span>`;
      }
      return cell(manager, content, baseline);
    }).join('');
  }

  function chartRow(rows, options) {
    const baseline = reference(options);
    const charts = slots(options).map(manager => {
      if (!manager?.visible) return '<td></td>';
      const hasData = rows.some(row => row[1][profile(manager)] > 0);
      const content = hasData ? `<div class="zc-allocation-chart" data-manager-allocation-chart data-manager-id="${escape(manager.id)}" role="img" aria-label="${escape(manager.name)}股票资产分布"></div>` : '<span class="zc-allocation-empty">暂无数据</span>';
      return cell(manager, `<div class="zc-allocation-chart-slot">${content}</div>`, baseline);
    }).join('');
    return `<table class="zc-allocation-table zc-allocation-chart-table" aria-label="股票资产分布图表">${colgroup}<tbody><tr>
      <th scope="row">大类资产类型<br>/<br>占总资产比</th>${charts}
    </tr></tbody></table>`;
  }

  function distribution({ key, title }, options) {
    const rows = rowsFor(key, options);
    const withChart = key === 'industries';
    const table = `<table class="zc-allocation-table" aria-label="${title}明细">${colgroup}<tbody>${rows.map((row, index) => {
      const marker = row[2] ? `<i style="--category:${row[2]}" aria-hidden="true"></i>` : '';
      return `<tr${withChart ? ` data-manager-allocation-row="${index}"` : ''}><th scope="row"><span class="zc-allocation-row-label">${marker}<span>${row[0]}</span></span></th>${valueCells(row, key, options)}</tr>`;
    }).join('')}</tbody></table>`;
    return `<div class="zc-allocation-table-frame">${withChart ? `${chartRow(rows, options)}<div class="zc-manager-allocation-scroll" tabindex="0" role="region" aria-label="股票资产分布明细">${table}</div>` : table}</div>`;
  }

  function holdings({ key, title, holdings: rowCount }, options) {
    const records = reportFor(key, options) === latestReport ? (key === 'stocks' ? stockHoldings : bondHoldings) : [];
    const baseline = reference(options);
    const columns = slots(options).map(manager => ({ manager, rows: records[profile(manager)] || [] }));
    const otherNames = new Set(columns.filter(({ manager }) => manager?.visible && manager.id !== baseline?.id).flatMap(({ rows }) => rows.map(row => row[0])));
    const matches = new Map((records[profile(baseline)] || []).filter(([name]) => otherNames.has(name)).map(([name], index) => [name, referenceColors[index % referenceColors.length]]));
    const body = Array.from({ length: rowCount }, (_, index) => `<tr><th scope="row"><span class="zc-allocation-number">${index + 1}</span></th>${columns.map(({ manager, rows }) => {
      const row = rows[index];
      if (!row) return cell(manager, '', baseline);
      const [name, amount] = row;
      const color = matches.get(name);
      const stripe = color ? `<i class="zc-allocation-holding-stripe" style="--holding-color:${color}" aria-hidden="true"></i>` : '';
      return cell(manager, `<span class="zc-allocation-holding">${stripe}<span class="zc-allocation-holding-name"${color ? ` style="color:${color}"` : ''}>${escape(name)}</span> ${percent(amount)}</span>`, baseline);
    }).join('')}</tr>`).join('');
    const totals = columns.map(({ manager, rows }) => cell(manager, rows.length ? percent(rows.reduce((total, row) => total + row[1], 0)) : '', baseline)).join('');
    return `<div class="zc-allocation-table-frame"><table class="zc-allocation-table" aria-label="${title}">${colgroup}<tbody>${body}<tr class="zc-allocation-summary"><th scope="row">合计</th>${totals}</tr></tbody></table></div>`;
  }

  function render(options) {
    return `<div class="zc-allocation-view zc-manager-allocation-view">${sections.map(definition => `<section class="zc-manager-allocation-section" data-manager-allocation-section="${definition.key}" data-analysis-section="${scope(definition.key)}">
      ${toolbar(definition, options)}
      ${definition.holdings ? holdings(definition, options) : distribution(definition, options)}
    </section>`).join('')}</div>`;
  }

  function saveImage(section, options, chartByElement) {
    const width = 1080;
    const colWidth = (width - 144) / 4;
    const rowHeight = 45;
    const headerHeight = 96;
    const tableRows = [...section.querySelectorAll('table tr')];
    const chartPosition = tableRows[0].closest('.zc-allocation-chart-table') ? 0 : -1;
    const chartHeight = 204;
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = (headerHeight + tableRows.length * rowHeight + (chartPosition === -1 ? 0 : chartHeight - rowHeight)) * 2;
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, canvas.height / 2);

    const title = section.querySelector('h2').textContent;
    context.fillStyle = '#333';
    context.font = '600 16px "PingFang SC", sans-serif';
    context.fillText(title, 12, 24);
    const activeFilters = [...section.querySelectorAll('summary strong, .zc-manager-allocation-heading small')].map(node => node.textContent.trim());
    context.fillStyle = '#666';
    context.font = '14px "PingFang SC", sans-serif';
    context.fillText(activeFilters.join('　'), 12, 48);
    context.textAlign = 'center';
    slots(options).forEach((manager, index) => {
      if (manager?.visible) context.fillText(manager.name, 144 + colWidth * (index + 0.5), 80, colWidth - 24);
    });

    let top = headerHeight;
    tableRows.forEach((row, rowIndex) => {
      const height = rowIndex === chartPosition ? chartHeight : rowHeight;
      context.fillStyle = '#eaeaea';
      context.fillRect(0, top, width, 1);
      [...row.cells].forEach((entry, index) => {
        const center = index === 0 ? 12 : 144 + colWidth * (index - 0.5);
        const chart = chartByElement.get(entry.querySelector('[data-manager-allocation-chart]'));
        if (chart) {
          const source = chart.renderToCanvas({ pixelRatio: 2, backgroundColor: '#fff' });
          context.drawImage(source, center - 90, top + 12, 180, 180);
          return;
        }
        const dot = entry.querySelector('.zc-allocation-row-label i');
        const dotOffset = dot ? 14 : 0;
        if (dot) {
          context.fillStyle = dot.style.getPropertyValue('--category');
          context.beginPath();
          context.arc(center + 4, top + height / 2, 4, 0, Math.PI * 2);
          context.fill();
        }
        context.fillStyle = '#333';
        context.textAlign = index === 0 ? 'left' : 'center';
        context.textBaseline = 'middle';
        context.fillText(entry.innerText.replace(/\s+/g, ' ').trim(), center + dotOffset, top + height / 2, index === 0 ? 120 - dotOffset : colWidth - 24);
      });
      top += height;
    });
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }

  function mount(root, options) {
    const chartByElement = new Map();
    const rows = rowsFor('industries', options);
    root.querySelectorAll('[data-manager-allocation-chart]').forEach(element => {
      if (!window.echarts) return;
      const manager = managers(options).find(item => item.id === element.dataset.managerId);
      const data = rows.map((row, rowIndex) => ({
        name: row[0], rowIndex, value: row[1][profile(manager)], itemStyle: { color: row[2] },
      })).filter(item => item.value > 0);
      const chart = window.echarts.init(element);
      chartByElement.set(element, chart);
      chart.setOption({
        animation: false,
        tooltip: {
          trigger: 'item', confine: true, backgroundColor: 'rgba(255,255,255,.96)', borderColor: '#eaeaea',
          textStyle: { color: '#333', fontSize: 14 },
          formatter: params => `${escape(params.name)}<br>${percent(Number(params.value))}`,
        },
        series: [{ type: 'pie', radius: ['64%', '100%'], label: { show: false }, emphasis: { scale: false }, data }],
      });
      const section = element.closest('[data-manager-allocation-section]');
      chart.on('mouseover', params => {
        const row = section.querySelector(`[data-manager-allocation-row="${params.data.rowIndex}"]`);
        row?.classList.add('is-chart-hovered');
      });
      chart.on('mouseout', () => section.querySelectorAll('.is-chart-hovered').forEach(row => row.classList.remove('is-chart-hovered')));
    });
    root.querySelectorAll('[data-manager-allocation-row]').forEach(element => {
      const name = rows[Number(element.dataset.managerAllocationRow)][0];
      element.onmouseenter = () => chartByElement.forEach(chart => chart.dispatchAction({ type: 'highlight', name }));
      element.onmouseleave = () => chartByElement.forEach(chart => chart.dispatchAction({ type: 'downplay' }));
    });
    root.querySelectorAll('[data-manager-allocation-image]').forEach(button => {
      button.onclick = () => saveImage(button.closest('[data-manager-allocation-section]'), options, chartByElement);
    });
    return [...chartByElement.values()];
  }

  window.ManagerAllocationView = { render, mount };
})();
