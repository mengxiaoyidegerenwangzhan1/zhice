(() => {
  const iconRoot = './assets/manager-allocation/';
  const sections = [
    { key: 'fund-types', title: '旗下基金分布', label: '基金类型<br>/<br>占总资产比' },
    { key: 'assets', title: '大类资产分布', label: '大类资产类型<br>/<br>占总资产比', dated: true, help: '汇总展示经理所管理基金的资产配置，当前数值沿用设计稿综合口径示例。' },
    { key: 'industries', title: '股票资产分布', label: '前五大行业<br>/<br>占净资产比', dated: true, help: '展示各经理综合持仓前五大行业的并集，占比沿用设计稿示例。' },
    { key: 'stocks', title: '前十大重仓股票', dated: true, table: true },
    { key: 'bonds', title: '债券资产分布', label: '债券类型<br>/<br>占总资产比', help: '展示各经理所管理基金的综合债券类型分布，当前数值为设计稿示例。' },
    { key: 'bond-holdings', title: '前五大重仓债券', dated: true, table: true, help: '按经理综合持仓占比排序，展示已披露的重仓债券。' },
  ];
  const snapshots = {
    'fund-types': [
      ['混合型', '#889ffa', [100, null, null]],
      ['股票型', '#ceb2ee', [null, 100, null]],
      ['混合型', '#f0a89d', [null, null, 100]],
    ],
    assets: [
      ['股票', '#889ffa', [88.72, null, null]],
      ['基金', '#ceb2ee', [null, 89.93, 89.93]],
      ['银行存款', '#f0a89d', [9.36, 4.14, null]],
      ['固定收益', '#b0b5f7', [0.43, 5.81, 5.81]],
      ['其他资产', '#f4bd84', [1.38, 0.12, 0.12]],
    ],
    industries: [
      ['其他-港股', '#7ebaa2', [35.36, null, 17.42]],
      ['有色金属', '#adc193', [12.93, null, null]],
      ['电子', '#ccbde6', [12.12, 24.72, 12.88]],
      ['其他-科创板', '#bbb4dc', [10.59, 43.10, 7.47]],
      ['基础化工', '#aec9a0', [6.83, null, null]],
      ['银行', '#91c7c2', [null, 1.31, null]],
      ['医药生物', '#e3cc88', [null, 1.09, null]],
      ['通信', '#a2a5d2', [null, 0.99, 12.75]],
      ['电力设备', '#a6c8d3', [null, null, 6.39]],
    ],
    bonds: [
      ['可转换债券', '#74c0da', [0.13, null, null]],
      ['政策性金融债券', '#f0a89d', [null, null, 3.34]],
      ['金融债券', '#889ffa', [null, null, 3.34]],
      ['国债', '#ceb2ee', [null, 0, 1.12]],
    ],
  };
  const stockHoldings = [
    [['腾讯控股', 9.37], ['贵州茅台', 8.26], ['泡泡玛特', 8.15], ['中国海洋石油', 7.63], ['神火股份', 7.48], ['美团-W', 7.37], ['盐湖股份', 6.12], ['西藏矿业', 5.32], ['洛阳钼业', 4.82], ['中国移动', 4.28]],
    [['寒武纪', 4.77], ['澜起科技', 3.60], ['北方华创', 3.60], ['中微公司', 3.41], ['中芯国际', 3.29], ['海光信息', 3.29], ['兆易创新', 3.19], ['拓荆科技', 1.82], ['长川科技', 1.44], ['长电科技', 1.24]],
    [['新易盛', 6.93], ['中际旭创', 6.50], ['长鑫科技', 6.03], ['药明康德', 5.21], ['中芯国际', 4.23], ['沪电股份', 4.12], ['寒武纪', 2.93], ['长飞光纤光缆', 2.63], ['三环集团', 2.22], ['天孚通信', 2.16]],
  ];
  const bondHoldings = [[], [['26国债01', 0]], [['26农发11', 3.34], ['25国债19', 0.73], ['26国债01', 0.38]]];
  const holdingTotals = { stocks: [68.80, 29.64, 42.95], 'bond-holdings': [null, 0, 4.46] };
  const colors = ['#7268ab', '#4f83a6', '#9b8148', '#9a6ba4'];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const icon = name => `<img src="${iconRoot}${name}.svg" width="18" height="18" alt="">`;
  const missing = '<span class="zc-allocation-dash">—</span>';
  const managerSlots = options => Array.from({ length: 4 }, (_, index) => (options.managers || options.funds || [])[index]);
  const selectedManagers = options => options.managers || options.funds || [];
  const scope = key => `manager-allocation-${key}`;
  const profile = manager => manager?.profileIndex ?? ({ a: 0, b: 1, c: 2 }[manager?.id] ?? 3);
  const reference = options => selectedManagers(options).find(manager => manager.id === options.referenceId);
  const cellClass = (manager, options) => manager && manager.id === options.referenceId ? ' class="is-reference"' : '';
  const valueFor = (row, manager) => row[2][profile(manager)];
  const numeric = (value, precision = 2) => `<span class="zc-allocation-number${value < 0 ? ' is-negative' : ''}">${value.toFixed(precision)}%</span>`;
  const colgroup = '<colgroup><col style="width:120px"><col><col><col><col></colgroup>';

  function rowsFor(key, options) {
    const rows = snapshots[key];
    if (key !== 'industries') return rows;
    const classification = options.ui?.range?.(scope(key))?.classification || '行业分布 - 申万行业分类';
    if (classification === '板块分布') {
      return [['港股', '#7ebaa2', rows[0][2]], ['科创板', '#bbb4dc', rows[3][2]], ['其他板块', '#ccbde6', [0, 1, 2].map(index => rows.reduce((sum, row, rowIndex) => sum + (rowIndex === 0 || rowIndex === 3 ? 0 : (row[2][index] || 0)), 0))]];
    }
    return rows;
  }

  function toolbar(definition, options) {
    const { key, title, help, dated, table } = definition;
    let controls = '';
    if (key === 'industries') {
      controls = options.ui?.setting?.(scope(key), 'classification', '分布', ['行业分布 - 申万行业分类', '行业分布 - 中信行业分类', '行业分布 - 中证行业分类', '行业分布 - 证监会行业分类', '板块分布'], '行业分布 - 申万行业分类') || '';
    }
    if (key === 'bonds') controls = options.ui?.setting?.(scope(key), 'classification', '分布', ['债券种类'], '债券种类') || '';
    if (key === 'bond-holdings') controls = options.ui?.setting?.(scope(key), 'report', '报告期', ['2026-09-30', '2026-06-30', '2026-03-31', '2025-12-31'], '2026-09-30') || '';
    const downloadAttribute = table ? `data-analysis-download="${scope(key)}"` : `data-manager-allocation-image="${scope(key)}"`;
    return `<div class="zc-manager-allocation-head">
      <div class="zc-manager-allocation-heading"><h2>${title}</h2>${help ? `<span class="zc-allocation-help"><button type="button" aria-label="${title}说明" aria-describedby="${scope(key)}-help"><img src="./assets/compare-allocation/help.svg" width="16" height="16" alt=""></button><span id="${scope(key)}-help" role="tooltip">${help}</span></span>` : ''}${dated ? `<small>截止日期<span class="zc-allocation-number">${escape(options.asOf || '2026-11-06')}</span></small>` : ''}</div>
      <div class="zc-manager-allocation-actions ${key === 'industries' ? 'is-industry' : ''}">${controls}<div class="zc-manager-allocation-tools" role="group" aria-label="${title}操作"><button type="button" ${downloadAttribute} aria-label="下载${title}${table ? '表格' : '图片'}" title="${table ? '下载表格' : '下载图片'}">${icon(table ? 'download-table' : 'download-chart')}</button><button type="button" data-analysis-refresh="${scope(key)}" aria-label="刷新${title}" title="刷新">${icon('refresh')}</button></div></div>
    </div>`;
  }

  function valueCells(row, key, options) {
    const baseline = reference(options);
    const baselineValue = valueFor(row, baseline);
    return managerSlots(options).map(manager => {
      let content = '';
      if (manager?.visible) {
        const value = valueFor(row, manager);
        content = Number.isFinite(value) ? numeric(value, key === 'fund-types' ? 0 : 2) : missing;
        if (baseline && manager.id !== baseline.id && Number.isFinite(value) && key !== 'fund-types') {
          const difference = Number.isFinite(baselineValue) ? value - baselineValue : null;
          const delta = difference === null ? '—' : `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}pp`;
          content = `<span class="zc-allocation-value-pair">${content}<span class="zc-allocation-difference${difference < 0 ? ' is-negative' : ''}">${delta}</span></span>`;
        }
      }
      return `<td${cellClass(manager, options)}>${content}</td>`;
    }).join('');
  }

  function distribution(definition, options) {
    const { key, label } = definition;
    const rows = rowsFor(key, options);
    const charts = managerSlots(options).map(manager => {
      const available = rows.some(row => Number.isFinite(valueFor(row, manager)));
      const content = manager?.visible ? available ? `<div class="zc-allocation-chart" data-manager-allocation-chart="${key}" data-manager-id="${escape(manager.id)}" role="img" aria-label="${escape(manager.name)}${definition.title}"></div>` : '<span class="zc-allocation-empty">暂无数据</span>' : '';
      return `<td${cellClass(manager, options)}><div class="zc-allocation-chart-slot">${content}</div></td>`;
    }).join('');
    return `<div class="zc-allocation-table-frame"><table class="zc-allocation-table zc-allocation-chart-table" aria-label="${definition.title}图表">${colgroup}<tbody><tr><th scope="row">${label}</th>${charts}</tr></tbody></table>
      <div class="zc-manager-allocation-scroll${key === 'industries' ? ' is-industry' : ''}"${key === 'industries' ? ' tabindex="0" role="region" aria-label="经理前五大行业对比，可滚动"' : ''}><table class="zc-allocation-table" aria-label="${definition.title}明细">${colgroup}<tbody>${rows.map((row, index) => `<tr data-manager-allocation-row="${index}" data-manager-allocation-label="${escape(row[0])}"><th scope="row"><span class="zc-allocation-row-label"><i style="--category:${row[1]}" aria-hidden="true"></i><span>${row[0]}</span></span></th>${valueCells(row, key, options)}</tr>`).join('')}</tbody></table></div>
    </div>`;
  }

  function holdingsFor(key, manager) {
    return (key === 'stocks' ? stockHoldings : bondHoldings)[profile(manager)] || [];
  }

  function matchingHoldings(key, options) {
    const baseline = reference(options);
    if (!baseline) return new Map();
    const comparisonNames = new Set(selectedManagers(options).filter(manager => manager.id !== baseline.id).flatMap(manager => holdingsFor(key, manager).map(row => row[0])));
    return new Map(holdingsFor(key, baseline).filter(row => comparisonNames.has(row[0])).map(([name], index) => [name, colors[index % colors.length]]));
  }

  function holdings(definition, options) {
    const { key } = definition;
    const matches = matchingHoldings(key, options);
    const referenceSelected = Boolean(reference(options));
    const rowCount = key === 'stocks' ? 10 : Math.min(5, Math.max(0, ...selectedManagers(options).map(manager => holdingsFor(key, manager).length)));
    const body = Array.from({ length: rowCount }, (_, index) => `<tr><th scope="row"><span class="zc-allocation-number">${index + 1}</span></th>${managerSlots(options).map(manager => {
      const row = holdingsFor(key, manager)[index];
      let content = '';
      if (manager?.visible) {
        content = missing;
        if (row) {
          const [name, value] = row;
          const color = matches.get(name);
          const stripe = referenceSelected ? `<i class="zc-allocation-holding-stripe"${color ? ` style="--holding-color:${color}"` : ''} aria-hidden="true"></i>` : '';
          content = `<span class="zc-allocation-holding">${stripe}<span class="zc-allocation-holding-name"${color ? ` style="color:${color}"` : ''}>${escape(name)}</span>${numeric(value)}</span>`;
        }
      }
      return `<td${cellClass(manager, options)}>${content}</td>`;
    }).join('')}</tr>`).join('');
    const totals = managerSlots(options).map(manager => {
      const value = holdingTotals[key][profile(manager)];
      return `<td${cellClass(manager, options)}>${manager?.visible ? Number.isFinite(value) ? numeric(value) : missing : ''}</td>`;
    }).join('');
    return `<div class="zc-allocation-table-frame"><table class="zc-allocation-table" aria-label="经理综合${definition.title}">${colgroup}<tbody>${body}<tr class="zc-allocation-summary"><th scope="row">${key === 'stocks' ? '前十大合计' : '前五大合计'}</th>${totals}</tr></tbody></table></div>`;
  }

  function render(options) {
    return `<div class="zc-allocation-view zc-manager-allocation-view">${sections.map(definition => `<section class="zc-manager-allocation-section" data-manager-allocation-section="${definition.key}" data-analysis-section="${scope(definition.key)}">${toolbar(definition, options)}${definition.table ? holdings(definition, options) : distribution(definition, options)}</section>`).join('')}</div>`;
  }

  function saveImage(section, charts) {
    const visibleCharts = charts.filter(chart => section.contains(chart.getDom()));
    if (!visibleCharts.length) return;
    const images = visibleCharts.map(chart => chart.renderToCanvas({ pixelRatio: 2, backgroundColor: '#fff' }));
    const canvas = document.createElement('canvas');
    canvas.width = images.reduce((sum, image) => sum + image.width, 0);
    canvas.height = Math.max(...images.map(image => image.height));
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    let left = 0;
    images.forEach(image => { context.drawImage(image, left, 0); left += image.width; });
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${section.querySelector('h2').textContent}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }

  function mount(root, options) {
    const charts = [];
    root.querySelectorAll('[data-manager-allocation-chart]').forEach(element => {
      if (!window.echarts) return;
      const key = element.dataset.managerAllocationChart;
      const manager = selectedManagers(options).find(item => item.id === element.dataset.managerId);
      const rows = rowsFor(key, options);
      const data = rows.map((row, rowIndex) => ({ name: row[0], rowIndex, value: valueFor(row, manager), itemStyle: { color: row[1] } })).filter(item => Number.isFinite(item.value));
      const chart = window.echarts.init(element);
      charts.push(chart);
      chart.setOption({ animation: false, tooltip: { trigger: 'item', confine: true, backgroundColor: 'rgba(255,255,255,.96)', borderColor: '#eaeaea', textStyle: { color: '#333', fontSize: 14 }, formatter: params => `${escape(params.name)}<br>${numeric(Number(params.value), key === 'fund-types' ? 0 : 2)}` }, series: [{ type: 'pie', radius: ['64%', '100%'], center: ['50%', '50%'], stillShowZeroSum: true, label: { show: false }, labelLine: { show: false }, emphasis: { scale: false }, data }] });
      const section = element.closest('[data-manager-allocation-section]');
      chart.on('mouseover', params => section.querySelector(`[data-manager-allocation-row="${params.data.rowIndex}"]`)?.classList.add('is-chart-hovered'));
      chart.on('mouseout', () => section.querySelectorAll('.is-chart-hovered').forEach(row => row.classList.remove('is-chart-hovered')));
    });
    root.querySelectorAll('[data-manager-allocation-row]').forEach(row => {
      const section = row.closest('[data-manager-allocation-section]');
      row.onmouseenter = () => charts.filter(chart => section.contains(chart.getDom())).forEach(chart => chart.dispatchAction({ type: 'highlight', name: row.dataset.managerAllocationLabel }));
      row.onmouseleave = () => charts.filter(chart => section.contains(chart.getDom())).forEach(chart => chart.dispatchAction({ type: 'downplay' }));
    });
    root.querySelectorAll('[data-manager-allocation-image]').forEach(button => {
      button.onclick = () => saveImage(button.closest('[data-manager-allocation-section]'), charts);
    });
    return charts;
  }

  window.ManagerAllocationView = { render, mount };
})();
