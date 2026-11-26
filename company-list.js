import { companyList, companyMatchesQuery, companyNameParts } from './company-list-data.js?v=20261125-company-abbreviation';
import { mountPagination } from './components/pagination.js?v=20261125-units';
import { fitFilterChips } from './components/filter-chips.js?v=20261125-fit-chips';
import { customRangeLabel, renderCustomRange, validateCustomRange } from './components/custom-range.js?v=20261126-range-placeholder';

const money = new Intl.NumberFormat('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const capital = new Intl.NumberFormat('zh-CN', {minimumFractionDigits: 4, maximumFractionDigits: 4});
const integer = new Intl.NumberFormat('zh-CN');
const types = ['股票型', '混合型', '债券型', 'QDII', '指数型', '货币型', 'ETF联接', '理财型', 'FOF'];
const modes = {total: '总规模', nonMoney: '非货规模'};
const sampleDate = '2026-11-24';

const amounts = [
  ['100亿以下', 0, 100], ['100–500亿', 100, 500], ['500–1,000亿', 500, 1000],
  ['1,000–3,000亿', 1000, 3000], ['3,000亿以上', 3000, null],
];
const ranks = [
  ['1–10名', 1, 10], ['11–20名', 11, 20], ['21–50名', 21, 50],
  ['51–100名', 51, 100], ['101名以上', 101, null],
];
const fields = {
  amount: {label: '金额', options: amounts, unit: '亿', continuous: true},
  rank: {label: '排名', options: ranks, unit: '名'},
  aggregateTypes: {label: '计入基金类型', name: '类型', options: types},
  aggregateAmount: {label: '合计金额', name: '金额', options: amounts, unit: '亿', continuous: true},
  aggregateRank: {label: '合计排名', name: '排名', options: ranks, unit: '名'},
  ownedTypes: {label: '旗下基金类型', name: '类型', options: types},
  fundCount: {label: '旗下基金数', name: '总数', unit: '只', options: [
    ['1–10只', 1, 10], ['11–30只', 11, 30], ['31–100只', 31, 100], ['101–300只', 101, 300], ['300只以上', 301, null],
  ]},
  age: {label: '成立年限', name: '年限', unit: '年', options: [
    ['5年以下', 0, 4], ['5–10年', 5, 9], ['10–15年', 10, 14], ['15–20年', 15, 19], ['20年以上', 20, null],
  ]},
};
const columns = [
  ['sequence', '序号', 52], ['name', '公司名称', 244],
  ['totalScale', '总规模｜排名', 160], ['nonMoneyScale', '非货规模｜排名', 160],
  ['fundCount', '基金总数｜排名', 160], ['managerCount', '基金经理数｜排名', 160],
  ['capital', '注册资本', 110], ['founded', '成立时间', 110],
];
const sortKeys = new Set(['name', 'totalScale', 'nonMoneyScale', 'aggregateScale', 'fundCount', 'managerCount', 'capital', 'founded']);
const defaultSort = {key: 'totalScale', direction: -1};
const state = {
  query: '', scale: 'total', scales: {total: {}, nonMoney: {}},
  criteria: {}, sort: defaultSort, page: 1, pageSize: 10,
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const unitText = unit => `<span class="cl-unit">${unit}</span>`;
const rangeLabel = (key, label) => {
  const unit = fields[key].unit;
  const text = escapeHtml(label);
  return `<span>${unit ? text.replace(unit, unitText(unit)) : text}</span>`;
};
const chevron = '<span class="cl-chevron" aria-hidden="true"></span>';
const sortIndicator = `<svg class="cl-sort-arrow" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path class="cl-sort-up" d="M6 1 10 5H2Z"/><path class="cl-sort-down" d="m6 11-4-4h8Z"/></svg>`;

function ageAt(founded) {
  const years = Number(sampleDate.slice(0, 4)) - Number(founded.slice(0, 4));
  return years - Number(sampleDate.slice(5) < founded.slice(5));
}

function companyNameMarkup(company, query) {
  return companyNameParts(company, query).map(({text, matched}) => {
    const escaped = escapeHtml(text);
    return matched ? `<span class="cl-company-match">${escaped}</span>` : escaped;
  }).join('');
}

function rankBy(getValue, include = () => true) {
  const ordered = companyList.filter(include).sort((a, b) => getValue(b) - getValue(a));
  let position = 0;
  return new Map(ordered.map((company, i) => {
    if (!i || getValue(company) !== getValue(ordered[i - 1])) position = i + 1;
    return [company.id, {position, total: ordered.length}];
  }));
}

const baseRanks = Object.fromEntries(['totalScale', 'nonMoneyScale', 'fundCount', 'managerCount']
  .map(key => [key, rankBy(company => company[key])]));

function selection(key) {
  return (key === 'amount' || key === 'rank' ? state.scales[state.scale] : state.criteria)[key];
}

function setSelection(key, {choices = [], custom} = {}) {
  const group = key === 'amount' || key === 'rank' ? state.scales[state.scale] : state.criteria;
  if (choices.length || custom) group[key] = {choices, custom};
  else delete group[key];
  if (key === 'aggregateTypes' && !choices.length) {
    delete state.criteria.aggregateAmount;
    delete state.criteria.aggregateRank;
  }
}

function choiceLabels(key) {
  const current = selection(key);
  if (!current) return [];
  const {options, unit} = fields[key];
  const labels = current.choices.map(index => ({id: index, label: unit ? options[index][0] : options[index]}));
  if (current.custom) labels.push({id: 'custom', label: customRangeLabel(current.custom, unit)});
  return labels;
}

function meetsRange(key, value) {
  const current = selection(key);
  if (!current) return true;
  if (value == null) return false;
  if (current.custom) {
    const [min, max] = current.custom;
    if ((min == null || value >= min) && (max == null || value <= max)) return true;
  }
  const {options, continuous} = fields[key];
  return current.choices.some(index => {
    const [, min, max] = options[index];
    return value >= min && (max == null || (continuous ? value < max : value <= max));
  });
}

function getResults() {
  const aggregateTypes = choiceLabels('aggregateTypes').map(({label}) => label);
  const ownedTypes = choiceLabels('ownedTypes').map(({label}) => label);
  const aggregateActive = Boolean(aggregateTypes.length && (selection('aggregateAmount') || selection('aggregateRank')));
  if (!aggregateActive && state.sort.key === 'aggregateScale') state.sort = defaultSort;
  const aggregateScale = company => Math.round(aggregateTypes.reduce((total, type) => total + (company.scaleByType[type] || 0), 0) * 100) / 100;
  const aggregateRanks = aggregateActive ? rankBy(aggregateScale, company => aggregateScale(company) > 0) : new Map();
  const scaleKey = state.scale === 'total' ? 'totalScale' : 'nonMoneyScale';
  const records = companyList.filter(company => {
    return companyMatchesQuery(company, state.query)
      && meetsRange('amount', company[scaleKey])
      && meetsRange('rank', baseRanks[scaleKey].get(company.id).position)
      && meetsRange('fundCount', company.fundCount)
      && meetsRange('age', ageAt(company.founded))
      && ownedTypes.every(type => company.types.includes(type))
      && (!aggregateActive || (aggregateRanks.has(company.id) && meetsRange('aggregateAmount', aggregateScale(company))
        && meetsRange('aggregateRank', aggregateRanks.get(company.id).position)));
  });
  const {key, direction} = state.sort;
  records.sort((a, b) => {
    const first = key === 'aggregateScale' ? aggregateScale(a) : a[key];
    const second = key === 'aggregateScale' ? aggregateScale(b) : b[key];
    return direction * (typeof first === 'string' ? first.localeCompare(second, 'zh-CN') : first - second);
  });
  return {records, aggregateTypes, aggregateActive, aggregateScale, aggregateRanks};
}

function metric(value, unit, rank) {
  return `<span class="cl-metric"><span class="cl-metric-value">${value}${unitText(unit)}</span>
    ${rank ? `<span class="cl-rank" aria-label="第 ${rank.position} 名，共 ${rank.total} 家">${rank.position}<span class="cl-rank-total"> / ${rank.total}</span></span>` : ''}</span>`;
}

export function mountCompanyList(container) {
  const controller = new AbortController();
  const {signal} = controller;
  let open = null;
  let unmountPagination;
  let result;
  let resultsMessageTimeout;
  let resultsMessageTrigger;
  container.innerHTML = `<div class="cl-page cl-company-page">
    <section class="cl-card cl-filters" aria-labelledby="cl-title">
      <h1 class="cl-page-heading" id="cl-title">公司筛选</h1>
      <form class="cl-filter-row cl-search-row" role="search" aria-label="搜索公司">
        <label class="cl-filter-label" for="cl-company-query">公司名称</label>
        <div class="cl-filter-controls">
          <div class="cl-search-field">
            <input id="cl-company-query" type="search" autocomplete="off" placeholder="输入公司名称" value="${escapeHtml(state.query)}">
            <button class="cl-search-clear" type="button" data-cl-clear-query aria-label="清除公司名称" title="清除公司名称">
              <img src="./assets/company-list/search-clear.png" width="14" height="14" alt="">
            </button>
          </div>
        </div>
      </form>
      <div class="cl-filter-rows"></div><div class="cl-summary" hidden></div>
    </section>
    <section class="cl-card cl-results" aria-label="公司列表">
      <div class="cl-results-toolbar">
        <p class="cl-result-count" role="status"><span>为您找到</span> <strong>0</strong> <span>家公司</span></p>
        <div class="zc-module-actions" role="group" aria-label="公司列表操作">
          <button class="zc-module-icon" type="button" data-cl-export-toggle aria-label="导出公司列表" title="导出公司列表"
            aria-expanded="false" aria-haspopup="menu" aria-controls="cl-export-menu">
            <img src="./design-system/assets/module-actions/table-download.png" width="28" height="28" alt="">
          </button>
          <button class="zc-module-icon" type="button" data-cl-refresh aria-label="刷新列表" title="刷新列表">
            <img src="./design-system/assets/module-actions/refresh.png" width="28" height="28" alt="">
          </button>
          <div class="cl-menu cl-export-menu" id="cl-export-menu" role="menu" aria-label="导出范围" hidden>
            <div class="cl-options" role="none">
              <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-cl-export="page">
                导出当前页<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
              </button>
              <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-cl-export="all">
                导出全部结果<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="cl-table-scroll" role="region" aria-label="公司筛选结果" tabindex="0">
        <table class="cl-table"><colgroup></colgroup><thead></thead><tbody></tbody></table>
      </div>
      <div class="cl-pagination zc-pagination" data-pg-kind="page" role="navigation" aria-label="公司列表分页"></div>
    </section>
    <div class="zhice-message cl-results-message" data-type="success" role="status" popover="manual">
      <img class="zhice-message-icon" width="12" height="12" src="./design-system/assets/messages/success.png" alt="">
      <span class="zhice-message-text"></span>
      <button class="zhice-message-close" type="button" aria-label="关闭提示">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.1"/><path d="m4.7 4.7 4.6 4.6m0-4.6L4.7 9.3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>`;
  const root = container.querySelector('.cl-page');
  const rows = root.querySelector('.cl-filter-rows');
  const summary = root.querySelector('.cl-summary');
  const searchForm = root.querySelector('.cl-search-row');
  const input = searchForm.querySelector('input');
  const pagination = root.querySelector('.cl-pagination');
  const tableScroll = root.querySelector('.cl-table-scroll');
  const resultCount = root.querySelector('.cl-result-count strong');
  const toolbar = root.querySelector('.cl-results-toolbar');
  const exportToggle = toolbar.querySelector('[data-cl-export-toggle]');
  const refreshButton = toolbar.querySelector('[data-cl-refresh]');
  const exportMenu = toolbar.querySelector('.cl-export-menu');
  const exportOptions = [...exportMenu.querySelectorAll('[data-cl-export]')];
  const resultsMessage = root.querySelector('.cl-results-message');

  function controlContents(key) {
    const field = fields[key];
    const selected = choiceLabels(key);
    return `<button class="cl-trigger" type="button" data-cl-toggle="${key}" aria-expanded="${open === key}"
          aria-controls="cl-menu-${key}" aria-label="${escapeHtml(`${field.label}，${selected.map(item => item.label).join('、') || '不限'}`)}"></button>
        <span class="cl-field-name">${field.name || field.label}</span>
        <span class="cl-trigger-value">${selected.length ? selected.map(({id, label}) =>
          `<span class="cl-selected-value" data-cl-chip="${escapeHtml(label)}">${rangeLabel(key, label)}<button type="button" class="cl-value-remove"
            data-cl-remove="${key}" data-choice="${id}" aria-label="移除${escapeHtml(label)}"></button></span>`).join('') : '<span class="cl-unlimited">不限</span>'}
          ${selected.length ? '<span class="cl-selected-value cl-overflow-count" hidden></span>' : ''}
        </span>${chevron}`;
  }

  function fitFilterControls() {
    rows.querySelectorAll('.cl-control').forEach(fitFilterChips);
  }

  function rangeForm(key, field, current) {
    const existing = rows.querySelector(`[data-cl-custom-form="${key}"]`);
    const bounds = existing
      ? [existing.elements.minimum.value, existing.elements.maximum.value]
      : current?.custom ?? [];
    return renderCustomRange(key, field, bounds, Boolean(current?.custom));
  }

  function selectControl(key) {
    const field = fields[key];
    const current = selection(key);
    const expanded = open === key;
    return `<div class="cl-select">
      <div class="cl-control">${controlContents(key)}</div>
      <div class="cl-menu" id="cl-menu-${key}" role="group" aria-label="${field.label}选项"${expanded ? '' : ' hidden'}>
        ${expanded ? `<div class="cl-multiselect-body">
          <div class="cl-options">${field.options.map((item, i) => `<label class="cl-option">
            <input type="checkbox" class="cl-checkbox" data-cl-choice="${key}" value="${i}"${current?.choices.includes(i) ? ' checked' : ''}>
            ${rangeLabel(key, field.unit ? item[0] : item)}</label>`).join('')}</div>
          ${field.unit ? rangeForm(key, field, current) : ''}
        </div>
        <div class="cl-multiselect-footer">
          <button class="cl-clear" type="button" data-cl-clear-field="${key}" aria-label="清空${field.label}"${current ? '' : ' disabled'}></button>
        </div>` : ''}
      </div>
    </div>`;
  }

  function renderFilters(focus) {
    const scrollTop = rows.querySelector(`#cl-menu-${open} .cl-multiselect-body`)?.scrollTop;
    const aggregateSelected = choiceLabels('aggregateTypes').length > 0;
    rows.innerHTML = `<div class="cl-filter-row">
      <div class="cl-filter-label cl-scale-modes" role="radiogroup" aria-label="规模口径">${Object.entries(modes).map(([key, label]) => {
        const selected = state.scale === key;
        return `<button type="button" role="radio" data-cl-scale="${key}" aria-checked="${selected}" tabindex="${selected ? 0 : -1}">${label}</button>`;
      }).join('')}</div>
      <div class="cl-filter-controls">${selectControl('amount')}${selectControl('rank')}</div>
    </div><div class="cl-filter-row"><div class="cl-filter-label">基金类型规模</div>
      <div class="cl-filter-controls">${selectControl('aggregateTypes')}${aggregateSelected ? selectControl('aggregateAmount') + selectControl('aggregateRank') : ''}</div>
    </div><div class="cl-filter-row"><div class="cl-filter-label">旗下基金</div>
      <div class="cl-filter-controls">${selectControl('ownedTypes')}${selectControl('fundCount')}</div>
    </div><div class="cl-filter-row"><div class="cl-filter-label">成立年限</div>
      <div class="cl-filter-controls">${selectControl('age')}</div></div>`;
    if (scrollTop) rows.querySelector(`#cl-menu-${open} .cl-multiselect-body`).scrollTop = scrollTop;
    fitFilterControls();
    renderSummary();
    if (focus) root.querySelector(focus)?.focus({preventScroll: true});
  }

  function renderSummary() {
    const groups = [
      [modes[state.scale], ['amount', 'rank']],
      ['基金类型规模', ['aggregateTypes', 'aggregateAmount', 'aggregateRank']],
      ['旗下基金', ['ownedTypes', 'fundCount']], ['成立年限', ['age']],
    ].map(([label, keys]) => ({label, items: keys.flatMap(key => choiceLabels(key).map(item => ({...item, key})))}))
      .filter(group => group.items.length);
    if (state.query) {
      groups.unshift({label: '公司名称', items: [{key: 'query', id: 'query', label: state.query}]});
    }
    const count = groups.reduce((total, group) => total + group.items.length, 0);
    summary.hidden = !count;
    summary.innerHTML = count ? `<span class="cl-summary-count">已选 <strong>(${count})</strong></span>
      <div class="cl-summary-tags">${groups.map(({label, items}) =>
        `<div class="cl-summary-chip"><span class="cl-summary-label">${label}</span>${items.map(({key, id, label}) => {
          const text = escapeHtml(label);
          const value = key === 'query' ? `<span class="cl-summary-query" title="${text}">${text}</span>` : rangeLabel(key, label);
          return `<span class="cl-summary-value">${value}<button type="button" class="cl-value-remove"
             data-cl-remove="${key}" data-choice="${id}" aria-label="移除${key === 'query' ? '公司名称搜索：' : ''}${text}"></button></span>`;
        }).join('')}</div>`).join('')}</div>
      <button class="cl-clear" type="button" data-cl-clear aria-label="清空"></button>` : '';
  }

  function renderTable() {
    const {records, aggregateTypes, aggregateActive, aggregateScale, aggregateRanks} = result;
    const items = records.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    const visibleColumns = [...columns];
    if (aggregateActive) visibleColumns.splice(4, 0, ['aggregateScale', '所选类型合计规模｜排名', 190]);
    const totalWidth = visibleColumns.reduce((total, [, , width]) => total + width, 0);
    root.querySelector('colgroup').innerHTML = visibleColumns.map(([key, , width]) =>
      `<col${key === 'aggregateScale' ? ' class="cl-aggregate-column"' : ''} style="width:${width / totalWidth * 100}%">`).join('');
    const header = root.querySelector('thead');
    header.innerHTML = `<tr>${visibleColumns.map(([key, label]) => {
      const sort = state.sort.key === key ? (state.sort.direction === 1 ? 'ascending' : 'descending') : null;
      const sortable = sortKeys.has(key);
      const numeric = !['name', 'founded'].includes(key);
      return `<th scope="col" class="${numeric ? 'cl-number' : ''}"${sort ? ` aria-sort="${sort}"` : ''}>
        ${sortable ? `<button type="button" class="cl-sort" data-cl-sort="${key}"${key === 'aggregateScale' ? ` title="${escapeHtml(aggregateTypes.join('＋'))}"` : ''}>${label}${sortIndicator}</button>` : label}</th>`;
    }).join('')}</tr>`;
    root.querySelector('tbody').innerHTML = items.length ? items.map((company, index) => {
      const ranked = (key, value, unit) => metric(value, unit, baseRanks[key].get(company.id));
      const companyName = escapeHtml(company.name);
      const cells = {
        sequence: (state.page - 1) * state.pageSize + index + 1,
        name: `<a class="cl-company-link" href="#/company/${company.id}" title="${companyName}">${companyNameMarkup(company, state.query)}</a>`,
        totalScale: ranked('totalScale', money.format(company.totalScale), '亿'),
        nonMoneyScale: ranked('nonMoneyScale', money.format(company.nonMoneyScale), '亿'),
        aggregateScale: aggregateActive ? metric(money.format(aggregateScale(company)), '亿', aggregateRanks.get(company.id)) : '',
        fundCount: ranked('fundCount', integer.format(company.fundCount), '只'),
        managerCount: ranked('managerCount', integer.format(company.managerCount), '人'),
        capital: metric(capital.format(company.capital), '亿'),
        founded: `<span class="cl-metric"><time datetime="${company.founded}">${company.founded}</time><span class="cl-rank">${ageAt(company.founded)}${unitText('年')}</span></span>`,
      };
      return `<tr>${visibleColumns.map(([key]) =>
        `<td class="${['name', 'founded'].includes(key) ? '' : 'cl-number'}"${key === 'name' ? ` title="${companyName}"` : ''}>${cells[key]}</td>`).join('')}</tr>`;
    }).join('') : `<tr><td colspan="${visibleColumns.length}" class="cl-empty">未找到符合条件的公司</td></tr>`;
    updateTableOverflow();
  }

  function updateTableOverflow() {
    tableScroll.classList.toggle('has-horizontal-overflow', tableScroll.scrollWidth > tableScroll.clientWidth);
  }

  function renderResults() {
    result = getResults();
    resultCount.textContent = integer.format(result.records.length);
    exportToggle.disabled = result.records.length === 0;
    state.page = Math.min(state.page, Math.max(1, Math.ceil(result.records.length / state.pageSize)));
    renderTable();
    unmountPagination?.();
    Object.assign(pagination.dataset, {pgTotal: result.records.length, pgCurrent: state.page, pgSize: state.pageSize});
    delete pagination.dataset.pgPageCount;
    unmountPagination = mountPagination(pagination);
  }

  function setExportMenu(visible) {
    exportMenu.hidden = !visible;
    exportToggle.setAttribute('aria-expanded', String(visible));
    if (visible) (exportMenu.querySelector('[aria-checked="true"]') ?? exportOptions[0]).focus({preventScroll: true});
  }

  function hideResultsMessage() {
    clearTimeout(resultsMessageTimeout);
    if (resultsMessage.contains(document.activeElement)) {
      const trigger = resultsMessageTrigger.disabled ? refreshButton : resultsMessageTrigger;
      trigger.focus({preventScroll: true});
    }
    resultsMessage.hidePopover();
  }

  function showResultsMessage(message, trigger) {
    clearTimeout(resultsMessageTimeout);
    resultsMessageTrigger = trigger;
    if (!resultsMessage.matches(':popover-open')) resultsMessage.showPopover();
    resultsMessage.querySelector('.zhice-message-text').textContent = message;
    resultsMessageTimeout = window.setTimeout(hideResultsMessage, 3000);
  }

  function exportCompanies(scope) {
    const onPage = scope === 'page';
    const start = onPage ? (state.page - 1) * state.pageSize : 0;
    const records = onPage ? result.records.slice(start, start + state.pageSize) : result.records;
    const {aggregateActive, aggregateScale, aggregateRanks} = result;
    const ranking = ({position, total}) => `第${position}名 / 共${total}家`;
    const headers = [
      '序号', '公司名称', '基金类型', '总规模（亿）', '总规模排名', '非货规模（亿）', '非货规模排名',
      ...(aggregateActive ? ['所选类型合计规模（亿）', '所选类型合计规模排名'] : []),
      '基金总数（只）', '基金总数排名', '基金经理数（人）', '基金经理数排名', '注册资本（亿）', '成立时间', '成立年限（年）',
    ];
    const data = records.map((company, index) => [
      start + index + 1, company.name, company.types.join('、'),
      company.totalScale, ranking(baseRanks.totalScale.get(company.id)),
      company.nonMoneyScale, ranking(baseRanks.nonMoneyScale.get(company.id)),
      ...(aggregateActive ? [aggregateScale(company), ranking(aggregateRanks.get(company.id))] : []),
      company.fundCount, ranking(baseRanks.fundCount.get(company.id)),
      company.managerCount, ranking(baseRanks.managerCount.get(company.id)),
      company.capital.toFixed(4), company.founded, ageAt(company.founded),
    ]);
    const csv = [headers, ...data].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], {type: 'text/csv;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = onPage ? '公司列表-当前页.csv' : '公司列表-全部结果.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showResultsMessage(onPage ? '当前页导出成功' : '全部结果导出成功', exportToggle);
  }

  function changeFilters(focus) {
    state.page = 1;
    renderFilters(focus);
    renderResults();
  }

  function applyCompanyQuery() {
    const query = input.value.trim();
    if (query === state.query) return;
    state.query = query;
    open = null;
    changeFilters();
  }

  function closeMenu(focus = false) {
    const last = open;
    open = null;
    renderFilters(focus ? `[data-cl-toggle="${last}"]` : undefined);
  }

  function applyCustomRange(form, enabled, focusInvalid = false) {
    const key = form.dataset.clCustomForm;
    const current = selection(key);
    const custom = validateCustomRange(form, enabled, current?.custom, focusInvalid);
    if (custom === null) return;
    if (custom?.[0] === current?.custom?.[0] && custom?.[1] === current?.custom?.[1]) return;
    setSelection(key, {...current, custom});
    state.page = 1;
    const select = form.closest('.cl-select');
    const control = select.querySelector('.cl-control');
    control.innerHTML = controlContents(key);
    select.querySelector('[data-cl-clear-field]').disabled = !selection(key);
    fitFilterChips(control);
    renderSummary();
    renderResults();
  }

  exportToggle.addEventListener('click', () => setExportMenu(exportMenu.hidden), {signal});
  exportMenu.addEventListener('click', event => {
    const selected = event.target.closest('[data-cl-export]');
    if (!selected) return;
    exportOptions.forEach(option => option.setAttribute('aria-checked', String(option === selected)));
    setExportMenu(false);
    exportToggle.focus({preventScroll: true});
    exportCompanies(selected.dataset.clExport);
  }, {signal});
  refreshButton.addEventListener('click', () => {
    setExportMenu(false);
    renderResults();
    showResultsMessage('已刷新', refreshButton);
  }, {signal});
  toolbar.addEventListener('keydown', event => {
    if (exportMenu.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setExportMenu(false);
      exportToggle.focus({preventScroll: true});
    } else if (exportMenu.contains(event.target) && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const current = exportOptions.indexOf(event.target);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? exportOptions.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + exportOptions.length) % exportOptions.length;
      exportOptions[next].focus({preventScroll: true});
    }
  }, {signal});
  resultsMessage.querySelector('.zhice-message-close').addEventListener('click', hideResultsMessage, {signal});
  toolbar.addEventListener('focusout', event => {
    if (event.relatedTarget && !toolbar.contains(event.relatedTarget)) setExportMenu(false);
  }, {signal});

  root.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    const {clToggle, clRemove, clScale, clSort, clClearField, choice} = target.dataset;
    if (clToggle) {
      if (open === clToggle) closeMenu(true);
      else {
        open = clToggle;
        renderFilters(`[data-cl-toggle="${clToggle}"]`);
      }
    } else if (clRemove === 'query' || target.hasAttribute('data-cl-clear-query')) {
      open = null;
      state.query = '';
      input.value = '';
      changeFilters('#cl-company-query');
    } else if (clRemove) {
      open = null;
      const current = selection(clRemove);
      setSelection(clRemove, choice === 'custom'
        ? {choices: current.choices}
        : {...current, choices: current.choices.filter(index => index !== Number(choice))});
      const field = !selection('aggregateTypes') && ['aggregateAmount', 'aggregateRank'].includes(clRemove) ? 'aggregateTypes' : clRemove;
      changeFilters(`[data-cl-toggle="${field}"]`);
    } else if (clScale && clScale !== state.scale) {
      open = null;
      state.scale = clScale;
      changeFilters(`[data-cl-scale="${clScale}"]`);
    } else if (clClearField) {
      setSelection(clClearField);
      const body = target.closest('.cl-menu').querySelector('.cl-multiselect-body');
      body.querySelector('[data-cl-custom-form]')?.remove();
      body.scrollTop = 0;
      changeFilters(`[data-cl-choice="${clClearField}"]`);
    } else if (target.hasAttribute('data-cl-clear')) {
      open = null;
      state.query = '';
      input.value = '';
      state.scales = {total: {}, nonMoney: {}};
      state.criteria = {};
      changeFilters('[data-cl-toggle="amount"]');
    } else if (clSort && sortKeys.has(clSort)) {
      const firstDirection = ['name', 'founded'].includes(clSort) ? 1 : -1;
      if (state.sort.key !== clSort) {
        state.sort = {key: clSort, direction: firstDirection};
      } else if (state.sort.direction === firstDirection) {
        state.sort = {key: clSort, direction: -firstDirection};
      } else {
        state.sort = defaultSort;
      }
      state.page = 1;
      renderResults();
      root.querySelector(`[data-cl-sort="${clSort}"]`)?.focus({preventScroll: true});
    }
  }, {signal});

  root.addEventListener('change', event => {
    const target = event.target;
    const form = target.form;
    if (form?.dataset.clCustomForm && target === form.elements.useCustom) {
      applyCustomRange(form, target.checked, true);
      return;
    }
    const key = target.dataset.clChoice;
    if (!key) return;
    const index = Number(target.value);
    const current = selection(key);
    const previous = current?.choices || [];
    const picked = target.checked ? [...previous, index].sort((a, b) => a - b) : previous.filter(item => item !== index);
    setSelection(key, {...current, choices: picked});
    changeFilters(`[data-cl-choice="${key}"][value="${index}"]`);
  }, {signal});

  rows.addEventListener('input', event => {
    const target = event.target;
    const form = target.form;
    if (target.type !== 'number' || !form?.dataset.clCustomForm) return;
    if (form.elements.useCustom.checked) applyCustomRange(form, true);
    else form.querySelector('.cl-form-error').textContent = '';
  }, {signal});

  input.addEventListener('input', event => {
    if (!event.isComposing) applyCompanyQuery();
  }, {signal});
  input.addEventListener('compositionend', applyCompanyQuery, {signal});

  root.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target === searchForm) {
      input.value = input.value.trim();
      applyCompanyQuery();
      return;
    }
    if (event.target.dataset.clCustomForm) applyCustomRange(event.target, true, true);
  }, {signal});

  pagination.addEventListener('paginationchange', ({detail}) => {
    state.page = detail.page;
    state.pageSize = detail.pageSize;
    renderTable();
    tableScroll.scrollTop = 0;
  }, {signal});

  document.addEventListener('click', event => {
    if (open && !event.target.closest('.cl-select')) closeMenu();
    if (!exportMenu.hidden && !toolbar.contains(event.target)) setExportMenu(false);
  }, {signal});
  root.addEventListener('keydown', event => {
    const scale = event.target.dataset.clScale;
    if (scale && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const otherScale = scale === 'total' ? 'nonMoney' : 'total';
      root.querySelector(`[data-cl-scale="${otherScale}"]`).click();
    } else if (open && event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'ArrowDown' && event.target.dataset.clToggle) {
      event.preventDefault();
      const key = event.target.dataset.clToggle;
      open = key;
      renderFilters(`[data-cl-choice="${key}"]`);
    }
  }, {signal});
  window.addEventListener('resize', updateTableOverflow, {signal});
  document.fonts.addEventListener('loadingdone', fitFilterControls, {signal});

  renderFilters();
  renderResults();
  const filterResize = new ResizeObserver(fitFilterControls);
  filterResize.observe(rows);
  return () => {
    controller.abort();
    clearTimeout(resultsMessageTimeout);
    filterResize.disconnect();
    unmountPagination?.();
  };
}
