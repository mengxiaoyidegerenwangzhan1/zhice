(() => {
  const assets = './assets/compare-allocation/';
  const definitions = [
    { key: 'asset', title: '大类资产分布', report: '2025-03-31', help: '按报告期展示基金直接持有的各类资产占总资产比例。' },
    { key: 'stock', title: '股票资产分布', report: '2026-06-30', help: '按所选行业分类展示股票资产占基金净资产比例。' },
    { key: 'holdings', title: '前十大重仓股票', report: '2026-09-30' },
    { key: 'bond', title: '债券资产分布', report: '2026-09-30', help: '按所选债券分类展示债券资产占基金净资产比例。' },
    { key: 'bond-holdings', title: '前五大重仓债券', report: '2026-09-30', help: '展示报告期披露的前五大重仓债券及其占净资产比例。' },
  ];
  const state = Object.fromEntries(definitions.map(item => [item.key, { report: item.report }]));
  state.stock.distribution = '行业分布 - 申万行业分类';
  state.bond.distribution = '债券种类';
  const reportDates = ['2026-09-30', '2026-06-30', '2026-03-31', '2025-12-31', '2025-09-30', '2025-06-30', '2025-03-31'];
  const stockDistributions = ['行业分布 - 申万行业分类', '行业分布 - 中信行业分类', '行业分布 - 中证行业分类', '行业分布 - 证监会行业分类', '板块分布'];
  const assetRows = [
    ['股票', '#889ffa', 88.72, null], ['基金', '#ceb2ee', null, 89.93],
    ['银行存款', '#f0a89d', 9.36, 4.14], ['固定收益', '#b0b5f7', 0.43, 5.81],
    ['可转换债券', '#74c0da', 0.11, null], ['其他资产', '#f4bd84', 1.38, 0.12],
  ];
  const industryRows = [
    ['电子', 16.90, '#ccbde6'], ['机械设备', 13.92, '#7ebaa2'], ['电力设备', 11.11, '#a6c8d3'],
    ['计算机', 8.27, '#bbb4dc'], ['基础化工', 5.64, '#aec9a0'], ['医药生物', 5.10, '#e3cc88'],
    ['汽车', 4.81, '#88c1b3'], ['通信', 4.51, '#a2a5d2'], ['国防军工', 4.18, '#91c7c2'],
    ['有色金属', 2.78, '#adc193'], ['建筑装饰', 2.70, '#aebd8d'], ['社会服务', 1.83, '#f2b293'],
    ['环保', 1.36, '#b1c9d9'], ['轻工制造', 1.26, '#f2c198'], ['家用电器', 1.23, '#f2858e'],
    ['传媒', 1.13, '#91a1c7'], ['农林牧渔', 1.00, '#f28f8a'], ['公用事业', 0.85, '#9ea1a6'],
    ['纺织服饰', 0.80, '#f2cf9d'], ['建筑材料', 0.78, '#aed4af'], ['交通运输', 0.62, '#b1d8b7'],
    ['石油石化', 0.59, '#afcda7'], ['商贸零售', 0.57, '#f2a18e'], ['非银金融', 0.56, '#e387a2'],
    ['钢铁', 0.49, '#aed0ab'], ['美容护理', 0.42, '#f2dca2'], ['食品饮料', 0.39, '#f28098'],
    ['房地产', 0.25, '#f2a2a1'], ['煤炭', 0.14, '#adc59a'],
  ];
  const comparisonIndustryValues = [18.35, 12.48, 9.76, 9.42, null, 4.66, 5.32, 3.92, 4.65, 3.14, 2.24, 1.67, 1.58, 1.10, 1.49, 1.32, 0.86, 0.93, 0.71, 0.66, 0.78, 0.45, 0.64, 0.48, 0.56, 0.35, 0.48, 0.22, 0.38];
  const stockHoldings = [
    [['快克智能', 6.24], ['海南高速', 5.68], ['华自科技', 4.93], ['移为通信', 4.27], ['新锐股份', 3.86], ['山东赫达', 3.42], ['鲁北化工', 3.15], ['纽威数控', 2.76], ['山高环能', 2.39], ['中材节能', 2.11]],
    [['宁德时代', 7.12], ['山东赫达', 6.45], ['中际旭创', 5.87], ['快克智能', 5.26], ['立讯精密', 4.78], ['阳光电源', 4.13], ['移为通信', 3.69], ['汇川技术', 3.24], ['纽威数控', 2.86], ['恒立液压', 2.31]],
  ];
  const bondHoldings = [
    [['25国债05', 8.36], ['25国开03', 7.24], ['25农发06', 6.18], ['25进出04', 5.72], ['24国债13', 4.65]],
    [['25国开03', 9.12], ['25国债11', 7.46], ['24国债13', 6.83], ['25国债05', 5.29], ['25农发09', 4.17]],
  ];
  const matchingColors = ['#7268ab', '#4f83a6', '#9b8148', '#9a6ba4'];
  const securityColors = {
    '快克智能': '#7268ab', '移为通信': '#4f83a6', '山东赫达': '#9b8148', '纽威数控': '#9a6ba4',
    '25国债05': '#7268ab', '25国开03': '#4f83a6', '24国债13': '#9b8148',
  };
  const classificationGroups = {
    '行业分布 - 中信行业分类': [
      ['电子', [0]], ['机械', [1]], ['电力设备及新能源', [2]], ['计算机', [3]],
      ['基础化工', [4]], ['医药', [5]], ['汽车', [6]], ['通信', [7]], ['国防军工', [8]],
      ['有色金属', [9]], ['建筑', [10]], ['消费者服务', [11]], ['环保及公用事业', [12, 17]],
      ['轻工制造', [13]], ['家电', [14]], ['传媒', [15]], ['农林牧渔', [16]],
      ['纺织服装', [18]], ['建材', [19]], ['交通运输', [20]], ['石油石化', [21]],
      ['商贸零售', [22]], ['非银行金融', [23]], ['钢铁', [24]], ['美容护理', [25]],
      ['食品饮料', [26]], ['房地产', [27]], ['煤炭', [28]],
    ],
    '行业分布 - 中证行业分类': [
      ['信息技术', [0, 3, 7]], ['工业', [1, 8, 10, 12, 20]], ['可选消费', [6, 11, 13, 14, 18, 22, 25]],
      ['原材料', [4, 9, 19, 24]], ['医药卫生', [5]], ['电信业务', [15]],
      ['主要消费', [16, 26]], ['公用事业', [2, 17]], ['能源', [21, 28]], ['金融地产', [23, 27]],
    ],
    '行业分布 - 证监会行业分类': [
      ['制造业', [0, 1, 2, 4, 5, 6, 8, 9, 13, 14, 18, 19, 24, 25, 26]],
      ['信息传输、软件和信息技术服务业', [3, 7]], ['建筑业', [10]], ['租赁和商务服务业', [11]],
      ['水利、环境和公共设施管理业', [12]], ['文化、体育和娱乐业', [15]], ['农、林、牧、渔业', [16]],
      ['电力、热力、燃气及水生产和供应业', [17]], ['交通运输、仓储和邮政业', [20]],
      ['采矿业', [21, 28]], ['批发和零售业', [22]], ['金融业', [23]], ['房地产业', [27]],
    ],
    '板块分布': [['主板', [1, 4, 5, 6, 9, 10, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]], ['创业板', [2, 3, 7, 11, 12, 15]], ['科创板', [0, 8]]],
  };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const icon = name => `<img src="${assets}${name}.svg" alt="">`;
  const slots = funds => Array.from({ length: 4 }, (_, index) => funds[index]);
  const hasData = fund => fund && fund.id !== 'c';
  const scopeFor = key => `allocation-${key}`;
  const numeric = value => `<span class="zc-allocation-number${value < 0 ? ' is-negative' : ''}">${value.toFixed(2)}%</span>`;
  const missing = '<span class="zc-allocation-dash">--</span>';
  const referenceFund = options => options.funds.find(fund => fund.id === options.referenceId);
  const referenceClass = (fund, options) => fund && fund.id === options.referenceId ? ' class="is-reference"' : '';

  function changeForReport(key) {
    const original = definitions.find(item => item.key === key).report;
    return (reportDates.indexOf(state[key].report) - reportDates.indexOf(original)) * 0.012;
  }

  function dataRows(key) {
    if (key === 'asset') return assetRows.map(([name, color, first, second]) => ({ name, color, values: [first, second] }));
    if (key === 'bond') return [{ name: '可转换债券', color: '#74c0da', values: [0.02, 0.15] }];
    const rows = industryRows.map(([name, value, color], index) => ({ name, color, values: [index === 3 ? null : value, comparisonIndustryValues[index]] }));
    const grouping = classificationGroups[state.stock.distribution];
    if (!grouping) return rows;
    return grouping.map(([name, indices]) => ({
      name,
      color: industryRows[indices[0]][2],
      values: [0, 1].map(column => {
        const values = indices.map(index => rows[index].values[column]).filter(Number.isFinite);
        return values.length ? values.reduce((sum, value) => sum + value, 0) : null;
      }),
    })).sort((first, second) => (second.values[0] ?? 0) - (first.values[0] ?? 0));
  }

  function amount(row, fund, key) {
    if (!hasData(fund)) return null;
    const value = row.values[fund.id === 'b' ? 1 : 0];
    return Number.isFinite(value) ? value * (1 - changeForReport(key)) : null;
  }

  function dropdown(key, property, label, options, width) {
    const value = state[key][property];
    const id = `zc-allocation-${key}-${property}`;
    return `<div class="zc-allocation-select" style="width:${width}px">
      <button type="button" class="zc-allocation-select-trigger" id="${id}" data-allocation-select="${key}" data-property="${property}" role="combobox" aria-label="${definitions.find(item => item.key === key).title}${label}" aria-expanded="false" aria-controls="${id}-menu" aria-haspopup="listbox">
        <span class="zc-allocation-select-label">${label}</span><span class="zc-allocation-select-value${property === 'report' ? ' zc-allocation-number' : ''}">${escape(value)}</span>${icon('chevron-down')}
      </button>
      <div class="zc-allocation-select-menu" id="${id}-menu" role="listbox" aria-labelledby="${id}" hidden>
        ${options.map(option => `<button type="button" role="option" aria-selected="${option === value}" data-allocation-choice="${key}" data-property="${property}" data-value="${escape(option)}"><span>${escape(option)}</span>${option === value ? icon('check') : ''}</button>`).join('')}
      </div>
    </div>`;
  }

  function heading(definition) {
    const { key, title, help } = definition;
    const distribution = key === 'stock' ? dropdown(key, 'distribution', '分布', stockDistributions, 252) : key === 'bond' ? dropdown(key, 'distribution', '分布', ['债券种类'], 176) : '';
    return `<div class="zc-section-head zc-allocation-head">
      <div class="zc-allocation-heading"><h2>${title}</h2>${help ? `<span class="zc-allocation-help"><button type="button" aria-label="${title}说明" aria-describedby="zc-${scopeFor(key)}-help">${icon('help')}</button><span id="zc-${scopeFor(key)}-help" role="tooltip">${help}</span></span>` : ''}</div>
      <div class="zc-allocation-actions">${distribution}${dropdown(key, 'report', '报告期', reportDates, 192)}
        <div class="zc-allocation-action-buttons"><button class="zc-text" type="button" data-analysis-download="${scopeFor(key)}" aria-label="下载${title}">${icon('download')}下载</button><button class="zc-text" type="button" data-analysis-refresh="${scopeFor(key)}" aria-label="刷新${title}">${icon('refresh')}刷新</button></div>
      </div>
    </div>`;
  }

  function columns() {
    return '<colgroup><col style="width:120px"><col><col><col><col></colgroup>';
  }

  function chartRow(key, options) {
    const { funds } = options;
    const labels = { asset: '大类资产类型<br>/<br>占总资产比', stock: state.stock.distribution === '板块分布' ? '板块分布<br>/<br>占净资产比' : '行业分布<br>/<br>占净资产比', bond: '债券类型 /<br>占净资产比' };
    return `<table class="zc-allocation-table zc-allocation-chart-table" aria-label="${definitions.find(item => item.key === key).title}图表">${columns()}<tbody><tr>
      <th scope="row">${labels[key]}</th>${slots(funds).map(fund => `<td${referenceClass(fund, options)}>${fund?.visible ? hasData(fund) ? `<div class="zc-allocation-chart" data-allocation-chart="${key}" data-fund-id="${escape(fund.id)}" role="img" aria-label="${escape(fund.name)}${definitions.find(item => item.key === key).title}"></div>` : '<span class="zc-allocation-empty">暂无数据</span>' : ''}</td>`).join('')}
    </tr></tbody></table>`;
  }

  function valueCells(row, options, key) {
    const reference = referenceFund(options);
    const baseline = amount(row, reference, key);
    return slots(options.funds).map(fund => {
      const value = amount(row, fund, key);
      let content = '';
      if (fund?.visible) {
        content = Number.isFinite(value) ? numeric(value) : missing;
        if (reference && fund.id !== reference.id && Number.isFinite(value)) {
          const difference = Number.isFinite(baseline) ? value - baseline : null;
          const delta = difference === null ? '--' : `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}pp`;
          content = `<span class="zc-allocation-value-pair">${content}<span class="zc-allocation-difference${difference < 0 ? ' is-negative' : ''}">${delta}</span></span>`;
        }
      }
      return `<td${referenceClass(fund, options)}>${content}</td>`;
    }).join('');
  }

  function distributionTable(key, options) {
    const rows = dataRows(key);
    return `<div class="zc-allocation-table-frame">${chartRow(key, options)}
      <div class="zc-allocation-data-scroll${rows.length > 10 ? ' is-long' : ''}"${rows.length > 10 ? ' tabindex="0" role="region" aria-label="股票资产分布明细，可滚动"' : ''}>
        <table class="zc-allocation-table" aria-label="${definitions.find(item => item.key === key).title}明细">${columns()}<tbody>${rows.map((row, index) => `<tr data-allocation-row="${index}" data-allocation-label="${escape(row.name)}"><th scope="row"><span class="zc-allocation-row-label"><i style="--category:${row.color}" aria-hidden="true"></i><span>${escape(row.name)}</span></span></th>${valueCells(row, options, key)}</tr>`).join('')}</tbody></table>
      </div>
    </div>`;
  }

  function holdingRows(key, fund) {
    if (!hasData(fund)) return [];
    return (key === 'holdings' ? stockHoldings : bondHoldings)[fund.id === 'b' ? 1 : 0];
  }

  function holdingMatches(key, options) {
    const reference = referenceFund(options);
    if (!reference) return new Map();
    const names = new Set(options.funds.filter(fund => fund.id !== reference.id).flatMap(fund => holdingRows(key, fund).map(row => row[0])));
    return new Map(holdingRows(key, reference).filter(row => names.has(row[0])).map(([name], index) => [name, securityColors[name] || matchingColors[index % matchingColors.length]]));
  }

  function holdingTable(key, options) {
    const { funds } = options;
    const hasReference = Boolean(referenceFund(options));
    const matches = holdingMatches(key, options);
    const rowCount = key === 'holdings' ? 10 : 5;
    const summaries = key === 'holdings' ? ['前十大合计', '集中度'] : ['前五大合计'];
    return `<div class="zc-allocation-table-frame"><table class="zc-allocation-table" aria-label="${definitions.find(item => item.key === key).title}">${columns()}<tbody>
      ${Array.from({ length: rowCount }, (_, index) => `<tr><th scope="row"><span class="zc-allocation-number">${index + 1}</span></th>${slots(funds).map(fund => {
        const row = holdingRows(key, fund)[index];
        let content = '';
        if (fund?.visible) {
          content = missing;
          if (row) {
            const [name, value] = row;
            const color = matches.get(name);
            const stripe = hasReference ? `<i class="zc-allocation-holding-stripe"${color ? ` style="--holding-color:${color}"` : ''} aria-hidden="true"></i>` : '';
            content = `<span class="zc-allocation-holding">${stripe}<span class="zc-allocation-holding-name"${color ? ` style="color:${color}"` : ''}>${escape(name)}</span>${numeric(value * (1 - changeForReport(key)))}</span>`;
          }
        }
        return `<td${referenceClass(fund, options)}>${content}</td>`;
      }).join('')}</tr>`).join('')}
      ${summaries.map(name => `<tr class="zc-allocation-summary"><th scope="row">${name}</th>${slots(funds).map(fund => {
        const rows = holdingRows(key, fund);
        const value = rows.reduce((sum, row) => sum + row[1], 0) * (1 - changeForReport(key));
        const content = fund?.visible ? rows.length && name !== '集中度' ? numeric(value) : missing : '';
        return `<td${referenceClass(fund, options)}>${content}</td>`;
      }).join('')}</tr>`).join('')}
    </tbody></table></div>`;
  }

  function section(definition, options) {
    const { key } = definition;
    return `<section class="zc-allocation-section" data-allocation-section="${key}" data-analysis-section="${scopeFor(key)}">${heading(definition)}${key.includes('holdings') ? holdingTable(key, options) : distributionTable(key, options)}</section>`;
  }

  function render(options) {
    return `<div class="zc-allocation-view">${definitions.map(definition => section(definition, options)).join('')}</div>`;
  }

  function mount(root, options) {
    const charts = [];

    function draw(sectionRoot) {
      sectionRoot.querySelectorAll('[data-allocation-chart]').forEach(element => {
        const key = element.dataset.allocationChart;
        const fund = options.funds.find(item => item.id === element.dataset.fundId);
        const rows = dataRows(key);
        const seriesData = rows.map((row, rowIndex) => ({ name: row.name, rowIndex, value: amount(row, fund, key), itemStyle: { color: row.color } })).filter(row => Number.isFinite(row.value) && row.value > 0);
        if (!window.echarts || !seriesData.length) return;
        const chart = window.echarts.init(element);
        charts.push(chart);
        chart.setOption({
          animation: false,
          tooltip: { trigger: 'item', confine: true, formatter: params => `${escape(params.name)}<br><strong class="zc-allocation-number">${Number(params.value).toFixed(2)}%</strong>`, backgroundColor: 'rgba(255,255,255,.96)', borderColor: '#eaeaea', textStyle: { color: '#333', fontSize: 14 } },
          series: [{ type: 'pie', radius: [64, 100], center: ['50%', '50%'], startAngle: 90, clockwise: true, label: { show: false }, labelLine: { show: false }, emphasis: { scale: false }, data: seriesData }],
        });
        chart.on('mouseover', params => {
          sectionRoot.querySelector(`[data-allocation-row="${params.data.rowIndex}"]`)?.classList.add('is-chart-hovered');
        });
        chart.on('mouseout', () => sectionRoot.querySelectorAll('.is-chart-hovered').forEach(row => row.classList.remove('is-chart-hovered')));
      });
    }

    function closeMenus(sectionRoot) {
      sectionRoot.querySelectorAll('.zc-allocation-select-menu').forEach(menu => { menu.hidden = true; });
      sectionRoot.querySelectorAll('[data-allocation-select]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    }

    function bind(sectionRoot) {
      sectionRoot.querySelectorAll('.zc-allocation-select').forEach(select => {
        select.onfocusout = event => {
          if (!select.contains(event.relatedTarget)) {
            select.querySelector('.zc-allocation-select-menu').hidden = true;
            select.querySelector('[data-allocation-select]').setAttribute('aria-expanded', 'false');
          }
        };
      });
      sectionRoot.querySelectorAll('[data-allocation-select]').forEach(button => {
        button.onclick = () => {
          const menu = button.nextElementSibling;
          const open = menu.hidden;
          closeMenus(root);
          menu.hidden = !open;
          button.setAttribute('aria-expanded', String(open));
        };
        button.onkeydown = event => {
          if (event.key === 'Escape') closeMenus(sectionRoot);
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            button.click();
            button.nextElementSibling.querySelector('[aria-selected="true"]')?.focus();
          }
        };
      });
      sectionRoot.querySelectorAll('[data-allocation-choice]').forEach(button => {
        button.onclick = () => {
          const key = button.dataset.allocationChoice;
          const property = button.dataset.property;
          state[key][property] = button.dataset.value;
          const oldSection = button.closest('[data-allocation-section]');
          oldSection.querySelectorAll('[data-allocation-chart]').forEach(element => {
            const chart = window.echarts?.getInstanceByDom(element);
            if (chart) {
              const index = charts.indexOf(chart);
              if (index >= 0) charts.splice(index, 1);
              chart.dispose();
            }
          });
          const template = document.createElement('template');
          template.innerHTML = section(definitions.find(item => item.key === key), options);
          const replacement = template.content.firstElementChild;
          oldSection.replaceWith(replacement);
          bind(replacement);
          draw(replacement);
          options.ui?.bind?.(replacement);
          replacement.querySelector(`[data-property="${property}"]`)?.focus({ preventScroll: true });
        };
        button.onkeydown = event => {
          const choices = [...button.parentElement.querySelectorAll('[role="option"]')];
          const index = choices.indexOf(button);
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            choices[(index + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length].focus();
          }
          if (event.key === 'Escape') {
            const trigger = button.closest('.zc-allocation-select').querySelector('[data-allocation-select]');
            closeMenus(sectionRoot);
            trigger.focus();
          }
        };
      });
      sectionRoot.querySelectorAll('[data-allocation-row]').forEach(row => {
        row.onmouseenter = () => {
          sectionRoot.querySelectorAll('[data-allocation-chart]').forEach(element => {
            window.echarts?.getInstanceByDom(element)?.dispatchAction({ type: 'highlight', name: row.dataset.allocationLabel });
          });
        };
        row.onmouseleave = () => {
          sectionRoot.querySelectorAll('[data-allocation-chart]').forEach(element => {
            window.echarts?.getInstanceByDom(element)?.dispatchAction({ type: 'downplay' });
          });
        };
      });
    }

    const sections = root.matches?.('[data-allocation-section]') ? [root] : [...root.querySelectorAll('[data-allocation-section]')];
    sections.forEach(element => { bind(element); draw(element); });
    return charts;
  }

  window.CompareAllocationView = { render, mount };
})();
