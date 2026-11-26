import { getManagerListData } from './manager-list-data.js?v=20261126-period-conditions';
import { companyNameParts } from './company-list-data.js?v=20261125-company-abbreviation';
import { mountManagerFilters } from './manager-list-filters.js?v=20261126-range-placeholder';
import { mountPagination } from './components/pagination.js?v=20261125-units';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const money = new Intl.NumberFormat('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const integer = new Intl.NumberFormat('zh-CN');
const nameOrder = new Intl.Collator('zh-Hans-CN-u-co-pinyin');
const comparisonLimit = 4;
const defaultSort = {key: 'scale', direction: -1};
const emptyCell = '--';
const columns = [
  {key: 'select', label: '选择', width: 38},
  {key: 'sequence', label: '序号', width: 52},
  {key: 'name', label: '基金经理', width: 96, sort: 1},
  {key: 'type', label: '经理类型', width: 80},
  {key: 'rating', label: '基金经理星级', title: '基金经理星级（综合）', width: 124, sort: -1},
  {key: 'company', label: '现任公司', width: 120},
  {key: 'careerYears', label: '从业年限', width: 96, sort: -1, numeric: true},
  {key: 'tenureDays', label: '管理年限', width: 96, sort: -1, numeric: true},
  {key: 'scale', label: '在管规模', width: 96, sort: -1, numeric: true},
  {key: 'product', label: '代表基金', width: 120},
  {key: 'productType', label: '基金类型', width: 112},
  {key: 'representativeAnnualized', label: '代表基金年化回报', width: 152, sort: -1, numeric: true, percent: true},
  {key: 'indexTotal', label: '基金经理指数', title: '经理指数总回报', width: 126, sort: -1, numeric: true, percent: true},
  {key: 'index3m', label: '经理指数近3月', width: 133, sort: -1, numeric: true, percent: true},
  {key: 'index1y', label: '经理指数近1年', width: 130, sort: -1, numeric: true, percent: true},
  {key: 'index3y', label: '经理指数近3年', width: 133, sort: -1, numeric: true, percent: true},
];
const sortIndicator = '<svg class="cl-sort-arrow" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path class="cl-sort-up" d="M6 1 10 5H2Z"/><path class="cl-sort-down" d="m6 11-4-4h8Z"/></svg>';

function sortValue(manager, key) {
  if (key === 'tenureDays' && manager.tenureDays == null) {
    return Number.isFinite(manager.tenure) ? manager.tenure * 365 : null;
  }
  return manager[key];
}

function compareRows(left, right, {key, direction}) {
  const a = sortValue(left, key);
  const b = sortValue(right, key);
  const aMissing = a == null || (key !== 'name' && !Number.isFinite(a));
  const bMissing = b == null || (key !== 'name' && !Number.isFinite(b));
  if (aMissing !== bMissing) return aMissing ? 1 : -1;
  if (!aMissing) {
    const order = key === 'name' ? nameOrder.compare(a, b) : a - b;
    if (order) return order * direction;
  }
  return nameOrder.compare(left.name, right.name) || left.id.localeCompare(right.id);
}

function plainTenure(manager) {
  if (manager.tenureLabel) return manager.tenureLabel;
  if (Number.isFinite(manager.tenure)) return `${manager.tenure}年`;
  if (!Number.isFinite(manager.tenureDays)) return null;
  const years = Math.floor(manager.tenureDays / 365);
  const remainder = manager.tenureDays % 365;
  return `${years}年${remainder ? `${remainder}天` : ''}`;
}

function units(text) {
  return escapeHtml(text).replace(/[年天亿]/g, character => `<span class="cl-unit">${character}</span>`);
}

function badge(text) {
  return text ? `<span class="cl-type-tag" title="${escapeHtml(text)}">${escapeHtml(text)}</span>` : emptyCell;
}

function ratingCell(value) {
  if (!Number.isInteger(value) || value < 1 || value > 5) return emptyCell;
  const filled = '<img src="./assets/manager-list/rating-filled.png" width="29" height="27" alt="">';
  const empty = '<img src="./assets/manager-list/rating-empty.png" width="29" height="27" alt="">';
  return `<span class="ml-stars" role="img" aria-label="综合评级 ${value} 星">${filled.repeat(value)}${empty.repeat(5 - value)}</span>`;
}

function percentage(value) {
  if (!Number.isFinite(value)) return emptyCell;
  const tone = value > 0 ? 'ml-return-up' : value < 0 ? 'ml-return-down' : '';
  return `<span class="${tone}">${money.format(value)}%</span>`;
}

function companyCell(company) {
  if (!company) return emptyCell;
  const label = escapeHtml(company.shortName || company.name);
  const title = escapeHtml(company.name);
  return `<a class="cl-company-link ml-ellipsize" href="#/company/${encodeURIComponent(company.id)}" title="${title}">${label}</a>`;
}

function makeCell(column, manager, company, sequence, nameQuery) {
  const {key} = column;
  if (column.percent) return percentage(manager[key]);
  switch (key) {
    case 'select': return `<input class="cl-checkbox" type="checkbox" data-ml-manager="${escapeHtml(manager.id)}" aria-label="选择${escapeHtml(manager.name)}进行比较">`;
    case 'sequence': return sequence;
    case 'name': {
      const sample = manager.isDemo && !manager.name.startsWith('示例');
      const label = companyNameParts({name: manager.name, shortName: manager.name}, nameQuery).map(({text, matched}) => {
        const escaped = escapeHtml(text);
        return matched ? `<strong class="cl-company-match">${escaped}</strong>` : escaped;
      }).join('');
      return `<a class="cl-company-link ml-manager-name" href="#/manager/${encodeURIComponent(manager.id)}" title="${escapeHtml(manager.name)}">${label}</a>${sample ? ' <span class="ml-demo-label" title="示例数据">示例</span>' : ''}`;
    }
    case 'type': return badge(manager.type);
    case 'rating': return ratingCell(manager.rating);
    case 'company': return companyCell(company);
    case 'careerYears': return Number.isFinite(manager.careerYears) ? units(`${manager.careerYears}年`) : emptyCell;
    case 'tenureDays': {
      const tenure = plainTenure(manager);
      return tenure ? units(tenure) : emptyCell;
    }
    case 'scale': return Number.isFinite(manager.scale) ? units(`${money.format(manager.scale)}亿`) : emptyCell;
    case 'product': return manager.product ? `<span class="ml-ellipsize" title="${escapeHtml(manager.product)}">${escapeHtml(manager.product)}</span>` : emptyCell;
    case 'productType': return badge(manager.productType);
  }
}

function csvRow(manager, company, sequence) {
  return [
    sequence, manager.name, manager.type, manager.rating, company?.name,
    manager.careerYears, plainTenure(manager), manager.scale,
    manager.product, manager.productType,
    ...columns.filter(column => column.percent).map(({key}) => Number.isFinite(manager[key]) ? `${manager[key]}%` : ''),
    manager.isDemo ? '示例' : '',
  ];
}

function downloadCsv(rows, filename) {
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], {type: 'text/csv;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function mountManagerList(root) {
  const {companies, managers} = getManagerListData();
  const companyById = new Map(companies.map(company => [company.id, company]));
  const comparedManagers = new Set();
  const events = new AbortController();
  const {signal} = events;
  let filterRecords = () => true;
  let nameQuery = '';
  let records = [];
  let sort = defaultSort;
  let page = 1;
  let pageSize = 10;
  let unmountPagination;
  let noticeTimeout;
  let noticeTrigger;

  root.innerHTML = `
    <div class="cl-page ml-page">
      <section class="cl-card cl-filters" aria-labelledby="ml-title"></section>
      <section class="cl-card cl-results" aria-label="经理列表">
        <div class="cl-results-toolbar ml-results-toolbar">
          <p class="cl-result-count" role="status"><span>为您找到</span> <strong>0</strong> <span>位基金经理</span></p>
          <div class="ml-results-actions">
            <button class="ml-compare-button" type="button" aria-label="经理 PK" aria-disabled="true" aria-describedby="ml-compare-tip"></button>
            <span class="zc-title-help-panel ml-compare-tip" id="ml-compare-tip" role="tooltip">请选择至少 2 位基金经理进行比较。</span>
            <div class="zc-module-actions" role="group" aria-label="经理列表操作">
              <button class="zc-module-icon" type="button" data-ml-export-toggle aria-label="导出经理列表" title="导出经理列表"
                aria-expanded="false" aria-haspopup="menu" aria-controls="ml-export-menu">
                <img src="./design-system/assets/module-actions/table-download.png" width="28" height="28" alt="">
              </button>
              <button class="zc-module-icon" type="button" data-ml-refresh aria-label="刷新列表" title="刷新列表">
                <img src="./design-system/assets/module-actions/refresh.png" width="28" height="28" alt="">
              </button>
              <div class="cl-menu cl-export-menu" id="ml-export-menu" role="menu" aria-label="导出范围" hidden>
                <div class="cl-options" role="none">
                  <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-ml-export="page">
                    导出当前页<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
                  </button>
                  <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-ml-export="all">
                    导出全部结果<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cl-table-scroll" role="region" aria-label="经理筛选结果" tabindex="0">
          <table class="cl-table ml-table" aria-label="经理筛选结果">
            <colgroup>${columns.map(({width}) => `<col style="width:${width}px">`).join('')}</colgroup>
            <thead></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="cl-pagination zc-pagination" data-pg-kind="page" role="navigation" aria-label="经理列表分页"></div>
      </section>
      <div class="zhice-message cl-results-message" data-type="success" role="status" popover="manual">
        <img class="zhice-message-icon" width="12" height="12" src="./design-system/assets/messages/success.png" alt="">
        <span class="zhice-message-text"></span>
        <button class="zhice-message-close" type="button" aria-label="关闭提示">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.1"/><path d="m4.7 4.7 4.6 4.6m0-4.6L4.7 9.3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>`;

  const toolbar = root.querySelector('.ml-results-toolbar');
  const resultCount = toolbar.querySelector('.cl-result-count strong');
  const compareButton = toolbar.querySelector('.ml-compare-button');
  const moduleActions = toolbar.querySelector('.zc-module-actions');
  const exportToggle = moduleActions.querySelector('[data-ml-export-toggle]');
  const refreshButton = moduleActions.querySelector('[data-ml-refresh]');
  const exportMenu = moduleActions.querySelector('.cl-export-menu');
  const exportOptions = [...exportMenu.querySelectorAll('[data-ml-export]')];
  const resultsMessage = root.querySelector('.cl-results-message');
  const noticeIcon = resultsMessage.querySelector('.zhice-message-icon');
  const tableScroll = root.querySelector('.cl-table-scroll');
  const thead = tableScroll.querySelector('thead');
  const tbody = tableScroll.querySelector('tbody');
  const pagination = root.querySelector('.cl-pagination');

  function columnClass(key, numeric) {
    return `ml-cell-${key}${numeric ? ' cl-number' : ''}`;
  }

  function renderHeader() {
    thead.innerHTML = `<tr>${columns.map(({key, label, title, sort: sortable, numeric}) => {
      const direction = sort.key === key ? (sort.direction === 1 ? 'ascending' : 'descending') : null;
      const content = key === 'select' ? '<input class="cl-checkbox" type="checkbox" data-ml-select-page aria-label="全选当前页经理" title="全选当前页经理">'
        : sortable ? `<button type="button" class="cl-sort" data-ml-sort="${key}"${title ? ` title="${title}" aria-label="${title}"` : ''}>${label}${sortIndicator}</button>` : label;
      return `<th scope="col" class="${columnClass(key, numeric)}"${direction ? ` aria-sort="${direction}"` : ''}>${content}</th>`;
    }).join('')}</tr>`;
  }

  function updateOverflow() {
    tableScroll.classList.toggle('has-horizontal-overflow', tableScroll.scrollWidth > tableScroll.clientWidth);
  }

  function renderRows() {
    const start = (page - 1) * pageSize;
    const visible = records.slice(start, start + pageSize);
    tbody.innerHTML = visible.length ? visible.map((manager, index) => {
      const company = companyById.get(manager.companyId);
      return `<tr>${columns.map(column => `<td class="${columnClass(column.key, column.numeric)}">${makeCell(column, manager, company, start + index + 1, nameQuery)}</td>`).join('')}</tr>`;
    }).join('') : `<tr><td class="cl-empty" colspan="${columns.length}">未找到符合条件的经理</td></tr>`;
    syncCompareCheckboxes();
    updateOverflow();
  }

  function syncCompareCheckboxes() {
    const boxes = tbody.querySelectorAll('[data-ml-manager]');
    let checked = 0;
    for (const box of boxes) {
      box.checked = comparedManagers.has(box.dataset.mlManager);
      if (box.checked) checked++;
      box.closest('tr').classList.toggle('ml-selected-row', box.checked);
    }
    const selectPage = thead.querySelector('[data-ml-select-page]');
    selectPage.disabled = boxes.length === 0;
    selectPage.checked = !selectPage.disabled && checked === boxes.length;
    selectPage.indeterminate = checked > 0 && !selectPage.checked;
  }

  function renderComparedManagers() {
    const disabled = comparedManagers.size < 2;
    compareButton.setAttribute('aria-disabled', String(disabled));
    if (disabled) compareButton.setAttribute('aria-describedby', 'ml-compare-tip');
    else compareButton.removeAttribute('aria-describedby');
    syncCompareCheckboxes();
  }

  function renderResults() {
    records = managers.filter(filterRecords).sort((left, right) => compareRows(left, right, sort));
    page = Math.min(page, Math.max(1, Math.ceil(records.length / pageSize)));
    resultCount.textContent = integer.format(records.length);
    exportToggle.disabled = records.length === 0;
    if (exportToggle.disabled) setExportMenu(false);
    renderHeader();
    renderRows();
    unmountPagination?.();
    Object.assign(pagination.dataset, {pgTotal: records.length, pgCurrent: page, pgSize: pageSize});
    unmountPagination = mountPagination(pagination);
    tableScroll.scrollTop = 0;
  }

  function setExportMenu(open) {
    exportMenu.hidden = !open;
    exportToggle.setAttribute('aria-expanded', String(open));
    if (open) (exportMenu.querySelector('[aria-checked="true"]') ?? exportOptions[0]).focus({preventScroll: true});
  }

  function hideNotice() {
    clearTimeout(noticeTimeout);
    if (resultsMessage.contains(document.activeElement)) {
      const trigger = noticeTrigger?.isConnected && !noticeTrigger.disabled ? noticeTrigger : refreshButton;
      trigger.focus({preventScroll: true});
    }
    resultsMessage.hidePopover();
  }

  function showNotice(text, trigger, type = 'success') {
    clearTimeout(noticeTimeout);
    noticeTrigger = trigger;
    resultsMessage.dataset.type = type;
    noticeIcon.src = `./design-system/assets/messages/${type}.png`;
    if (!resultsMessage.matches(':popover-open')) resultsMessage.showPopover();
    resultsMessage.querySelector('.zhice-message-text').textContent = text;
    noticeTimeout = window.setTimeout(hideNotice, 3000);
  }

  function exportManagers(scope) {
    const currentPage = scope === 'page';
    const start = currentPage ? (page - 1) * pageSize : 0;
    const entries = currentPage ? records.slice(start, start + pageSize) : records;
    const headings = columns.slice(1).map(({key, label, title}) => {
      if (key === 'scale') return `${label}（亿）`;
      if (key === 'careerYears') return `${label}（年）`;
      return title || label;
    });
    const data = entries.map((manager, index) => csvRow(manager, companyById.get(manager.companyId), start + index + 1));
    downloadCsv([[...headings, '数据标记'], ...data], currentPage ? '经理列表-当前页.csv' : '经理列表-全部结果.csv');
    showNotice(currentPage ? '当前页导出成功' : '全部结果导出成功', exportToggle);
  }

  mountManagerFilters(root.querySelector('.cl-filters'), {
    companies, managers, signal,
    onChange(predicate, query) {
      filterRecords = predicate;
      nameQuery = query;
      page = 1;
      renderResults();
    },
  });

  thead.addEventListener('click', event => {
    const button = event.target.closest('[data-ml-sort]');
    if (!button) return;
    const column = columns.find(({key}) => key === button.dataset.mlSort);
    if (sort.key !== column.key) sort = {key: column.key, direction: column.sort};
    else if (sort.direction === column.sort) sort = {key: column.key, direction: -column.sort};
    else sort = defaultSort;
    page = 1;
    renderResults();
    thead.querySelector(`[data-ml-sort="${column.key}"]`).focus({preventScroll: true});
  }, {signal});
  thead.addEventListener('change', event => {
    const selectPage = event.target;
    if (!selectPage.hasAttribute('data-ml-select-page')) return;
    for (const {dataset: {mlManager}} of tbody.querySelectorAll('[data-ml-manager]')) {
      if (selectPage.checked) comparedManagers.add(mlManager);
      else comparedManagers.delete(mlManager);
    }
    renderComparedManagers();
  }, {signal});
  pagination.addEventListener('paginationchange', ({detail}) => {
    page = detail.page;
    pageSize = detail.pageSize;
    renderRows();
    tableScroll.scrollTop = 0;
  }, {signal});
  tbody.addEventListener('change', event => {
    const box = event.target;
    const id = box.dataset.mlManager;
    if (!id) return;
    if (box.checked) comparedManagers.add(id);
    else comparedManagers.delete(id);
    renderComparedManagers();
  }, {signal});
  compareButton.addEventListener('click', () => {
    if (comparedManagers.size < 2) return;
    if (comparedManagers.size > comparisonLimit) {
      showNotice(`最多选择 ${comparisonLimit} 位基金经理进行比较。`, compareButton, 'warning');
      return;
    }
    const params = new URLSearchParams([...comparedManagers].map(id => ['manager', id]));
    location.hash = `#/manager-compare?${params}`;
  }, {signal});
  exportToggle.addEventListener('click', () => setExportMenu(exportMenu.hidden), {signal});
  exportMenu.addEventListener('click', event => {
    const selected = event.target.closest('[data-ml-export]');
    if (!selected) return;
    exportOptions.forEach(option => option.setAttribute('aria-checked', String(option === selected)));
    setExportMenu(false);
    exportToggle.focus({preventScroll: true});
    exportManagers(selected.dataset.mlExport);
  }, {signal});
  moduleActions.addEventListener('keydown', event => {
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
  moduleActions.addEventListener('focusout', event => {
    if (event.relatedTarget && !moduleActions.contains(event.relatedTarget)) setExportMenu(false);
  }, {signal});
  refreshButton.addEventListener('click', () => {
    setExportMenu(false);
    renderResults();
    showNotice('已刷新', refreshButton);
  }, {signal});
  resultsMessage.querySelector('.zhice-message-close').addEventListener('click', hideNotice, {signal});
  document.addEventListener('click', event => {
    if (!moduleActions.contains(event.target)) setExportMenu(false);
  }, {signal});

  const resize = new ResizeObserver(updateOverflow);
  resize.observe(tableScroll);
  renderResults();
  renderComparedManagers();
  return () => {
    events.abort();
    unmountPagination?.();
    resize.disconnect();
    clearTimeout(noticeTimeout);
  };
}
