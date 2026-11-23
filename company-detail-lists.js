import { fundCategories, fundListExamples } from './company-detail-data.js?v=20261123-affiliated-funds';

const EMPTY = '—';

function escapeText(value) {
  return String(value ?? EMPTY).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function valueWithUnit(value, unit, digits) {
  if (value == null || value === '') return EMPTY;
  if (typeof value !== 'number') return value;
  return `${digits === undefined ? value : value.toFixed(digits)}${unit}`;
}

function returnCell(value) {
  if (value == null || value === '') return '<td class="num">—</td>';
  const number = Number(String(value).replace(/^−/, '-').replace(/[%+,]/g, ''));
  const className = number > 0 ? ' is-rise' : number < 0 ? ' is-fall' : '';
  return `<td class="num${className}">${escapeText(valueWithUnit(value, '%', 2))}</td>`;
}

function ratingCell(value) {
  if (value == null || value === '') return '<td>—</td>';
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return '<td>—</td>';
  return `<td><span class="company-stars" role="img" aria-label="${rating} 星"><span aria-hidden="true">${'★'.repeat(rating)}<span class="company-stars-muted">${'★'.repeat(5 - rating)}</span></span></span></td>`;
}

const fundColumns = [
  ['name', '基金名称/代码'], ['type', '基金类型'], ['manager', '基金经理'], ['founded', '成立日期'],
  ['rating3', '3年评级'], ['rating5', '5年评级'], ['navDate', '最新净值日期'],
  ['returns', '近6月收益'], ['rank', '近6月排名'],
];
const managerColumns = [
  ['name', '基金经理'], ['type', '投资类型'], ['scale', '在管规模'], ['tenure', '管理年限'],
  ['experience', '从业经验'], ['count', '在管产品数量'], ['product', '代表产品'],
  ['annual', '代表产品年化回报'], ['returns', '近一年收益率'],
];
const fundStatuses = [['running', '运行中'], ['liquidated', '已清算'], ['all', '全部']];
export const fundTypeOptions = fundCategories.flatMap(([, types]) => types);
export const fundListDefaults = {
  fundStatus: 'running', fundTypes: fundTypeOptions, fundBranch: fundCategories[0][0],
  fundMenuOpen: false, masterOnly: false, fundPage: 1, fundPageSize: 10,
  fundSort: 'rating3', fundSortDirection: 'desc',
};
export const managerListDefaults = {
  managerFilter: 'all', managerPage: 1, managerPageSize: 10, managerSort: '', managerSortDirection: 'asc',
};

export function sortListRows(a, b, key, direction) {
  const left = a[key];
  const right = b[key];
  if (left == null || right == null) return Number(left == null) - Number(right == null);
  const comparison = key === 'rank' ? Number(left.split('/')[0]) - Number(right.split('/')[0])
    : typeof left === 'number' ? left - right : left.localeCompare(right, 'zh-CN', { numeric: true });
  return direction === 'asc' ? comparison : -comparison;
}

export function listPage(length, requestedPage, pageSize) {
  const pageCount = Math.max(1, Math.ceil(length / pageSize));
  const page = Math.min(pageCount, Math.max(1, requestedPage));
  return { pageCount, page, start: (page - 1) * pageSize };
}

export function fundListSnapshot(state) {
  const types = new Set(state.fundTypes);
  const matching = fundListExamples.filter(fund => types.has(fund.subtype) && (!state.masterOnly || fund.isMaster));
  const running = matching.filter(fund => fund.status === 'running').length;
  const counts = { running, liquidated: matching.length - running, all: matching.length };
  const records = (state.fundStatus === 'all' ? matching : matching.filter(fund => fund.status === state.fundStatus))
    .sort((a, b) => sortListRows(a, b, state.fundSort, state.fundSortDirection));
  return { records, counts, ...listPage(records.length, state.fundPage, state.fundPageSize) };
}

export function managerListSnapshot(managers, state) {
  const records = managers.filter(manager => state.managerFilter === 'all' || manager.type === state.managerFilter);
  if (state.managerSort) records.sort((a, b) => sortListRows(a, b, state.managerSort, state.managerSortDirection));
  return { records, ...listPage(records.length, state.managerPage, state.managerPageSize) };
}

export function fundListCsv(state) {
  return [
    ['序号', '基金名称', '基金代码', ...fundColumns.slice(1).map(([, label]) => label)],
    ...fundListSnapshot(state).records.map((fund, index) => [
      index + 1, fund.name, fund.code, fund.type, fund.manager, fund.founded,
      fund.rating3, fund.rating5, fund.navDate, valueWithUnit(fund.returns, '%'), fund.rank,
    ]),
  ];
}

function fundChevron() {
  return '<svg class="company-fund-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function fundOptionCheck(kind, key, label, checked, mixed) {
  const name = `${kind === 'branch' ? '选择' : ''}${label}`;
  return `<label class="company-fund-option-check">
    <input type="checkbox" data-fund-check="${kind}" value="${escapeText(key)}" aria-label="${escapeText(name)}"${checked ? ' checked' : ''}${mixed ? ' data-indeterminate aria-checked="mixed"' : ''}>
    ${kind === 'branch' ? '' : `<span>${escapeText(label)}</span>`}
  </label>`;
}

function fundCascade(state) {
  const selected = new Set(state.fundTypes);
  const all = selected.size === fundTypeOptions.length;
  const first = fundTypeOptions.find(key => selected.has(key));
  const firstCategory = fundCategories.find(([, keys]) => keys.includes(first))?.[0];
  const label = all ? '全部' : first ? `${firstCategory} / ${first}` : '请选择';
  const removeLabel = all ? '取消全选' : '移除首个已选项';
  const extra = Math.max(0, selected.size - 1);
  const branchRows = fundCategories.map(([parent, keys]) => {
    const count = keys.filter(key => selected.has(key)).length;
    const active = parent === state.fundBranch;
    return `<div class="company-fund-option${active ? ' is-active' : ''}${count === keys.length ? ' is-checked' : ''}">
      ${fundOptionCheck('branch', parent, parent, count === keys.length, count > 0 && count < keys.length)}
      <button class="company-fund-branch" type="button" data-fund-branch="${escapeText(parent)}" aria-pressed="${active}"><span>${escapeText(parent)}</span>${fundChevron()}</button>
    </div>`;
  }).join('');
  const activeTypes = fundCategories.find(([parent]) => parent === state.fundBranch)?.[1] ?? [];
  return `<div class="company-fund-cascade"${extra ? ' data-extra' : ''}>
    <button type="button" class="company-fund-trigger" data-fund-menu aria-label="基金类型 ${escapeText(label)}${extra ? `，另有 ${extra} 项` : ''}"
      aria-expanded="${state.fundMenuOpen}" aria-controls="company-fund-menu">
      <span class="company-fund-filter-label">基金类型</span><span class="company-fund-chip">${escapeText(label)}</span>
      ${extra ? `<span class="company-fund-chip company-fund-chip--count">+${extra}</span>` : ''}${fundChevron()}
    </button>
    ${first ? `<button type="button" class="company-fund-clear" data-fund-clear aria-label="${removeLabel}" title="${removeLabel}"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m3.5 3.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg></button>` : ''}
    <div class="company-fund-menu" id="company-fund-menu" role="group" aria-label="基金类型级联多选"${state.fundMenuOpen ? '' : ' hidden'}>
      <div class="company-fund-column" role="group" aria-label="一级分类">
        <div class="company-fund-option${all ? ' is-checked' : ''}">${fundOptionCheck('all', '', '全部', all, !all && selected.size > 0)}</div>
        ${branchRows}
      </div>
      <div class="company-fund-column" role="group" aria-label="${escapeText(state.fundBranch)}子类">
        ${activeTypes.map(key => `<div class="company-fund-option${selected.has(key) ? ' is-checked' : ''}">${fundOptionCheck('leaf', key, key, selected.has(key), false)}</div>`).join('')}
      </div>
    </div>
  </div>`;
}

function listPageNumbers(page, last) {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, null, last];
  if (page >= last - 3) return [1, null, last - 4, last - 3, last - 2, last - 1, last];
  return [1, null, page - 1, page, page + 1, null, last];
}

export function listPagination(title, page, last, total, pageSize, pageSizeControl) {
  return `<nav class="company-fund-pagination" aria-label="${title}分页">
    <div class="company-fund-total" aria-live="polite">共 <b>${total}</b> 条</div>
    <div class="company-fund-page-controls">
      <div class="company-fund-pages">
        <button type="button" class="company-fund-page" data-company-list-page="${page - 1}" data-company-list-page-step="prev" aria-label="上一页"${page === 1 ? ' disabled' : ''}>${fundChevron()}</button>
        ${listPageNumbers(page, last).map(number => number == null
          ? '<span class="company-fund-page" aria-hidden="true">…</span>'
          : `<button type="button" class="company-fund-page" data-company-list-page="${number}" aria-label="第 ${number} 页"${number === page ? ' aria-current="page"' : ''}>${number}</button>`).join('')}
        <button type="button" class="company-fund-page" data-company-list-page="${page + 1}" data-company-list-page-step="next" aria-label="下一页"${page === last ? ' disabled' : ''}>${fundChevron()}</button>
      </div>
      <label class="company-fund-page-size"><select data-company-control="${pageSizeControl}" aria-label="每页条数">${[5, 10, 20, 50].map(size => `<option value="${size}"${size === pageSize ? ' selected' : ''}>${size}条/页</option>`).join('')}</select></label>
      <form class="company-fund-jump" data-company-list-jump><label for="company-list-page-input">跳至</label>
        <input id="company-list-page-input" type="number" inputmode="numeric" min="1" max="${last}" step="1" required aria-label="跳至页码"> 页
      </form>
    </div>
  </nav>`;
}

export function listTable({ title, tableClass, columns, sort, sortDirection, rows, empty }) {
  return `<div class="company-table-scroll" tabindex="0" role="region" aria-label="${title}数据表">
    <table class="company-table company-table--wide company-list-table ${tableClass}">
      <thead><tr><th scope="col" class="company-fund-seq">序号</th>
        ${columns.map(([key, label]) => {
          const direction = key === sort ? sortDirection : '';
          return `<th scope="col"${direction ? ` aria-sort="${direction === 'asc' ? 'ascending' : 'descending'}"` : ''}>
            <button type="button" class="company-fund-sort" data-company-list-sort="${key}">${label}<span class="company-fund-sort-icon${direction ? ` is-${direction}` : ''}" aria-hidden="true"></span></button>
          </th>`;
        }).join('')}
      </tr></thead>
      <tbody>${rows || `<tr><td colspan="${columns.length + 1}" class="company-empty">${empty}</td></tr>`}</tbody>
    </table>
  </div>`;
}

export function renderFundTable(state, snapshot = fundListSnapshot(state)) {
  const { records, start } = snapshot;
  const rows = records.slice(start, start + state.fundPageSize).map((fund, index) => {
    const [position, total] = fund.rank.split('/');
    const managers = String(fund.manager ?? '').split(/[｜|]/).map(name => name.trim()).filter(Boolean);
    const managerNames = (managers.length ? managers : [EMPTY])
      .map(name => `<span class="company-list-name">${escapeText(name)}</span>`).join(' ');
    return `<tr>
      <td class="company-fund-seq">${start + index + 1}</td>
      <td><span class="company-list-name">${escapeText(fund.name)}</span><small class="company-list-code">${escapeText(fund.code)}</small></td>
      <td>${escapeText(fund.type)}</td><td><div class="company-fund-manager-names">${managerNames}</div></td>
      <td>${escapeText(fund.founded)}</td>${ratingCell(fund.rating3)}${ratingCell(fund.rating5)}
      <td>${escapeText(fund.navDate)}</td>${returnCell(fund.returns)}
      <td class="num">${escapeText(position)} <span class="company-quiet">/ ${escapeText(total)}</span></td>
    </tr>`;
  }).join('');
  return listTable({ title: '旗下基金', tableClass: 'company-fund-table', columns: fundColumns,
    sort: state.fundSort, sortDirection: state.fundSortDirection, rows, empty: '当前筛选条件下暂无基金。' });
}

function fundList(state, actions) {
  const snapshot = fundListSnapshot(state);
  const { records, counts, page } = snapshot;
  return `<section class="company-panel company-fund-panel" aria-label="旗下基金">
    <div class="company-fund-toolbar">
      <div class="company-fund-statuses" role="group" aria-label="基金状态">
        ${fundStatuses.map(([key, label]) => `<button type="button" class="company-fund-status" data-fund-status="${key}" aria-pressed="${key === state.fundStatus}">${label} <b>${counts[key]}</b></button>`).join('')}
      </div>
      <div class="company-fund-toolbar-controls">
        <label class="company-fund-master"><input type="checkbox" role="switch" data-company-control="masterOnly"${state.masterOnly ? ' checked' : ''}><span class="company-fund-switch" aria-hidden="true"></span><span>仅显示主代码基金</span></label>
        ${fundCascade(state)}${actions}
      </div>
    </div>
    ${renderFundTable(state, snapshot)}
    <nav class="zc-pagination" aria-label="旗下基金分页" data-pg-kind="page"
      data-pg-total="${records.length}" data-pg-current="${page}" data-pg-size="${state.fundPageSize}"></nav>
  </section>`;
}

function managerValues(manager) {
  return [
    manager.name, manager.type,
    valueWithUnit(manager.scale, '亿', 2), valueWithUnit(manager.tenure, '年', 1),
    valueWithUnit(manager.experience, '年'), valueWithUnit(manager.count, '只'),
    manager.product, manager.annual, manager.returns,
  ];
}

export function managerListCsv(managers, state) {
  const { records } = managerListSnapshot(managers, state);
  return [
    ['序号', ...managerColumns.map(([, label]) => label)],
    ...records.map((manager, index) => {
      const [name, type, scale, tenure, experience, count, product, annual, returns] = managerValues(manager);
      return [index + 1, name, type, scale, tenure, experience, count, product, valueWithUnit(annual, '%', 2), valueWithUnit(returns, '%', 2)];
    }),
  ];
}

function managerList(managers, state, { actions, filter }) {
  const { records, page, pageCount, start } = managerListSnapshot(managers, state);
  const rows = records.slice(start, start + state.managerPageSize).map((manager, index) => {
    const [name, type, scale, tenure, experience, count, product, annual, returns] = managerValues(manager);
    return `<tr>
      <td class="company-fund-seq">${start + index + 1}</td>
      <td class="company-list-name">${escapeText(name)}</td>
      <td>${escapeText(type)}</td>
      <td class="num">${escapeText(scale)}</td><td class="num">${escapeText(tenure)}</td>
      <td class="num">${escapeText(experience)}</td><td class="num">${escapeText(count)}</td>
      <td><span class="company-list-name" title="${escapeText(product)}">${escapeText(product)}</span></td>
      ${returnCell(annual)}${returnCell(returns)}
    </tr>`;
  }).join('');
  return `<section class="company-panel company-manager-panel" aria-label="在职经理">
    <div class="company-fund-toolbar">
      <h2>在职经理</h2>
      <div class="company-fund-toolbar-controls">${filter}${actions}</div>
    </div>
    ${listTable({ title: '在职经理', tableClass: 'company-manager-table', columns: managerColumns,
      sort: state.managerSort, sortDirection: state.managerSortDirection, rows, empty: '当前投资类型暂无基金经理。' })}
    ${listPagination('在职经理', page, pageCount, records.length, state.managerPageSize, 'managerPageSize')}
  </section>`;
}

export function renderCompanyList(tab, data, state = {}, { actions = '', filter = '' } = {}) {
  if (tab === 'funds') return fundList({ ...fundListDefaults, ...state }, actions);
  if (tab === 'managers') return managerList(data.managers ?? [], { ...managerListDefaults, ...state }, { actions, filter });
  return '';
}
