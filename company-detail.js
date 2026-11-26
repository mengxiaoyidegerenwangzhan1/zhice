import { companyData as company, fundCategories, managerRatingExamples } from './company-detail-data.js?v=20261123-affiliated-funds';
import { companyList } from './company-list-data.js?v=20261125-company-abbreviation';
import { getManagerListData } from './manager-list-data.js?v=20261126-period-conditions';
import { mountCompanyCharts, ratingChartImage } from './company-charts.js?v=20261123-rating-counts';
import {
  fundListCsv, fundListDefaults, fundListSnapshot, fundTypeOptions,
  managerListCsv, managerListDefaults, managerListSnapshot, renderCompanyList, renderFundTable,
} from './company-detail-lists.js?v=20261123-fund-pagination';
import { mountPagination } from './components/pagination.js?v=20261123';
import {
  holdingChartData, holdingDefaults, holdingListCsv, holdingListSnapshot, holdingRangeControl, holdingTimeOptions, renderCompanyHoldings, renderHoldingStock,
} from './company-holdings.js?v=20261124-asset-years';
import { mountHoldingCharts } from './company-holdings-charts.js?v=20261123-holdings-axis';

const tabs = [
  ['overview', '公司概览'], ['funds', '旗下基金'], ['managers', '在职经理'], ['holdings', '持仓分析'],
];
const scaleEnd = company.scale.at(-1).date;
const scaleYear = Number(scaleEnd.slice(0, 4));
const scaleShortcuts = [3, 5, 10].map(years => ({
  key: String(years), label: `近${years}年`, start: `${scaleYear - years + 1}-01-01`, end: scaleEnd,
}));
const formatter = new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const assetRoot = './assets/company-detail/';
const stars = Array.from({ length: 5 }, (_, index) => index);
const ratedFundHeaders = ['基金名称','基金星级','近3年年化收益','近3年收益','近3年最大回撤','申赎状态'];
const ratedManagerHeaders = ['经理名称','代表基金','经理星级','近1年收益率','近3年收益率','任期最大回报率','任期最大回撤率'];
const managerMetricKeys = ['return1y', 'return3y', 'maxReturn', 'drawdown'];
const defaults = {
  ...fundListDefaults,
  ...managerListDefaults,
  ...holdingDefaults,
  scaleType: 'all', scaleYears: '5',
  ratingMode: 'fund', ratingType: 'all', rating: '5',
};
const listTypes = { funds:'fund', managers:'manager', holdings:'holding' };
const holdingChartTitles = { 'holdings-assets':'大类资产分布', 'holdings-industry':'股票行业分布' };

function escapeHtml(value) {
  return String(value ?? '—').replace(/[&<>"']/g, char => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function icon(name) {
  return `<img class="company-icon" src="${assetRoot}${name}.svg" alt="" aria-hidden="true">`;
}

function amount(value) {
  return typeof value === 'number' ? formatter.format(value) : (value ?? '—');
}

function percent(value) {
  return typeof value === 'number' ? `${value.toFixed(2)}%` : (value ?? '—');
}

function signClass(value) {
  const numeric = Number(String(value).replace(/[%,]/g, '').replace('−', '-'));
  return numeric > 0 ? 'is-rise' : numeric < 0 ? 'is-fall' : '';
}

function ratingKey(rating) {
  return rating == null ? 'unrated' : String(rating);
}

function ratingGrade(key) {
  return key === 'unrated' ? '暂无星级' : `${key}星`;
}

function ratingLabel(state) {
  const grade = state.rating === 'all' ? '全部' : ratingGrade(state.rating);
  return state.ratingMode === 'manager' ? `${grade}基金经理` : `${grade}基金`;
}

function ratingDistribution(state) {
  if (state.ratingMode !== 'manager') return company.ratings;
  if (state.ratingType === 'all') return company.managerRatings;
  const managers = managerRatingExamples.filter(manager => manager.fundType === state.ratingType);
  return company.managerRatings.map(({rating}) => {
    const exampleCount = managers.filter(manager => manager.rating === rating).length;
    return {rating, exampleCount, percent: managers.length ? Math.round(exampleCount * 100 / managers.length) : 0};
  });
}

function readFavorite(favoriteKey) {
  try { return localStorage.getItem(favoriteKey) === '1'; } catch { return false; }
}

function rank(value) {
  const [position, total] = String(value ?? '').split('/').map(part => part.trim());
  return total ? `${escapeHtml(position)} <span class="company-quiet">/ ${escapeHtml(total)}</span>` : escapeHtml(value);
}

function dropdown(key, selected, choices, {label, asHeading = false, value = choices.find(([id]) => id === selected)?.[1]}) {
  const menuId = `company-${key}-menu`;
  return `<div class="company-dropdown zc-allocation-select${asHeading ? ' company-dropdown--heading' : ''}">
    <button type="button" class="zc-allocation-select-trigger" data-company-dropdown="${key}" aria-label="${escapeHtml(`${label} ${value}`)}"
      aria-controls="${menuId}" aria-expanded="false" aria-haspopup="listbox">
      ${asHeading ? '' : `<span class="zc-allocation-select-label">${escapeHtml(label)}</span>`}
      <span class="zc-allocation-select-value">${escapeHtml(value)}</span>${icon(asHeading ? 'rating-chevron' : 'chevron')}
    </button>
    <div class="zc-allocation-select-menu" id="${menuId}" role="listbox" aria-label="${escapeHtml(label)}" hidden>
      ${choices.map(([id, name]) => `<button type="button" role="option" tabindex="-1" data-company-choice="${key}"
        data-value="${escapeHtml(id)}" aria-selected="${id === selected}"><span>${escapeHtml(name)}</span>${id === selected ? icon('check') : ''}</button>`).join('')}
    </div>
  </div>`;
}

function typeControl(key, selected) {
  return dropdown(key, selected, [['all', '全部'], ...company.products.map(({label}) => [label, label])], {label:'基金类型'});
}

function actions(module) {
  const controls = [['image-download', '下载图片'], ['table-download', '下载表格'], ['refresh', '刷新']];
  const list = ['funds', 'managers', 'holdings-stock'].includes(module);
  const visible = controls.filter(([name]) => !(list && name === 'image-download') && !(holdingChartTitles[module] && name === 'table-download'));
  return `<div class="company-actions" role="group" aria-label="模块操作">${visible.map(([name, label]) =>
    `<button type="button" data-company-action="${name}" data-module="${module}" title="${label}" aria-label="${label}">${icon(name)}</button>`
  ).join('')}</div>`;
}

function getCompanyProfile(companyId) {
  if (companyId === 'essence') return company;
  const entry = companyList.find(item => item.id === companyId);
  if (!entry) {
    const { companies, managers } = getManagerListData();
    const employer = companies.find(item => item.id === companyId);
    if (!employer) return null;
    return {
      name: employer.name,
      listedManagers: managers.filter(manager => manager.companyId === companyId),
    };
  }

  const metrics = [
    ['totalScale', '总规模', '亿'],
    ['nonMoneyScale', '非货币理财规模', '亿'],
    ['fundCount', '旗下基金数', '只'],
    ['managerCount', '旗下基金经理数', '人'],
  ].map(([key, label, unit]) => ({
    label, unit, value: entry[key],
    rank: companyList.filter(item => item[key] > entry[key]).length + 1,
    total: companyList.length,
  }));
  return {
    name: entry.name,
    founded: entry.founded,
    capital: entry.capital.toFixed(4),
    legalRepresentative: entry.legalRepresentative || null,
    metrics,
  };
}

function emptyAnalysis(tab) {
  const labels = tab === 'overview'
    ? ['规模变化', '旗下产品结构', '基金星级分布']
    : [tabs.find(([key]) => key === tab)[1]];
  return labels.map(label => `<section class="company-panel" aria-label="${label}">
    <div class="company-panel-head"><h2>${label}</h2></div>
    <p class="company-empty" role="status">暂无${label}数据</p>
  </section>`).join('');
}

function header(profile) {
  const website = escapeHtml(profile.url);
  return `<div class="company-header-slot">
    <header class="company-header" aria-label="公司详情页头">
      <div class="company-header-top">
        <div class="company-identity">
          <h1>${escapeHtml(profile.name)}</h1>
          ${profile.metrics ? `<div class="company-chips">
            <span>成立日期：<b>${escapeHtml(profile.founded)}</b></span>
            <span>注册资本：<b>${escapeHtml(profile.capital)}</b> 亿</span>
          </div>` : ''}
        </div>
        <div class="company-header-actions">
          <button type="button" data-company-action="switch" title="切换公司" aria-label="切换公司">${icon('switch')}<span>切换</span></button>
          <button type="button" data-company-action="favorite" aria-label="收藏公司" aria-pressed="false">${icon('favorite')}<span>收藏</span></button>
        </div>
      </div>
      ${profile.metrics ? `<div class="company-facts-wrap">
        <div class="company-facts">
          <div class="company-facts-left">
            <div><span>法人代表：<b>${escapeHtml(profile.legalRepresentative)}</b></span><span>总经理：<b>${escapeHtml(profile.generalManager)}</b></span></div>
            <div>官网：<span class="company-website-address">${website}</span></div>
          </div>
          <dl class="company-metrics">
            ${profile.metrics.map(metric => `<div><dt>${escapeHtml(metric.label)}</dt>
              <dd class="company-metric-readout">
                <span class="company-metric-value">
                  <span class="company-metric-number">${escapeHtml(metric.unit === '亿' ? amount(metric.value) : metric.value)}</span>
                  <span class="company-metric-unit">${escapeHtml(metric.unit)}</span>
                </span>
                <span class="company-rank">
                  <span>排名</span>
                  <span class="company-rank-numbers"><span>${escapeHtml(metric.rank)}</span><span>/</span><span>${escapeHtml(metric.total)}</span></span>
                </span>
              </dd>
            </div>`).join('')}
          </dl>
        </div>
      </div>` : ''}
      <div class="company-tabs" role="tablist" aria-label="公司详情">
        ${tabs.map(([key, label]) => `<button type="button" id="company-tab-${key}" role="tab" aria-controls="company-tab-panel" data-company-tab="${key}">${label}</button>`).join('')}
      </div>
    </header>
  </div>`;
}

function switchDialog(profile) {
  return `<dialog class="company-dialog zc-dialog" aria-labelledby="company-switch-title">
    <form method="dialog" class="zc-dialog-head">
      <h2 id="company-switch-title" class="zc-dialog-title">切换公司</h2>
      <button type="submit" class="zc-dialog-close" aria-label="关闭切换公司">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg>
      </button>
    </form>
    <div class="zc-dialog-body">
      <input class="zc-dialog-control" type="search" aria-label="搜索基金公司" placeholder="输入公司名称" data-company-search>
      <button type="button" class="company-dialog-result" data-company-action="select-company">${escapeHtml(profile.name)}${icon('check')}</button>
      <p class="company-dialog-empty" hidden>暂无匹配公司</p>
    </div>
  </dialog>`;
}

function dataTable(headers, rows, { numeric = [], label, ratingMode, productKeys = [] } = {}) {
  if (!rows.length) return `<p class="company-empty" role="status">暂无${escapeHtml(label)}数据</p>`;
  const cell = (value, type) => `<${type}${type === 'th' ? ' scope="col"' : ''} class="${value.numeric ? 'num' : ''}${value.className ? ' ' + value.className : ''}">${value.html ?? escapeHtml(value.value)}</${type}>`;
  return `<div class="company-table-scroll" tabindex="0" role="region" aria-label="${escapeHtml(label)}">
    <table class="company-table${ratingMode ? ' company-table--rating' : ''}${ratingMode === 'manager' ? ' company-table--manager-rating' : ''}">
      <thead><tr>${headers.map((value, i) => cell({value, numeric:numeric.includes(i)}, 'th')).join('')}</tr></thead>
      <tbody>${rows.map((line, index) => `<tr${productKeys[index] ? ` data-company-product="${escapeHtml(productKeys[index])}"` : ''}>${line.map((value, i) => cell({
        ...(typeof value === 'object' && value !== null ? value : {value}), numeric:numeric.includes(i),
      }, 'td')).join('')}</tr>`).join('')}</tbody>
    </table>
  </div>`;
}

function listedManagersPanel(managers) {
  const label = '经理筛选收录的在职经理';
  const rows = managers.map(manager => {
    const name = escapeHtml(manager.name);
    const sample = manager.isDemo && !manager.name.startsWith('示例') ? ' <small class="company-quiet">示例</small>' : '';
    return [
      { html: `<a class="company-list-name" href="#/manager/${encodeURIComponent(manager.id)}">${name}</a>${sample}` },
      manager.product,
    ];
  });
  return `<section class="company-panel" aria-label="${label}">
    <div class="company-panel-head"><h2>${label}</h2></div>
    ${dataTable(['经理名称', '代表基金'], rows, { label })}
  </section>`;
}

function scaleRows(state) {
  if (state.scaleType !== 'all') return [];
  return company.scaleAnnual.slice(0, Number(state.scaleYears));
}

function ratedRows(state) {
  return company.ratedFunds.filter(item => (
    (state.ratingType === 'all' || item.type === state.ratingType) &&
    (state.rating === 'all' || ratingKey(item.rating) === state.rating)
  )).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

function managerRatingRows(state) {
  return managerRatingExamples.filter(manager => (
    (state.ratingType === 'all' || manager.fundType === state.ratingType) &&
    (state.rating === 'all' || ratingKey(manager.rating) === state.rating)
  ));
}

function scalePanel(state) {
  const period = scaleShortcuts.find(({key}) => key === state.scaleYears);
  const rows = scaleRows(state).map(row => [
    `${row.year}年`, amount(row.total), {value:amount(row.change),className:signClass(row.change)},
    {html:rank(row.rank)}, row.fundCount,
  ]);
  return `<section class="company-panel" aria-labelledby="company-scale-title">
    <div class="company-panel-head company-panel-head--scale"><h2 id="company-scale-title">规模变化</h2>
      <div class="company-panel-controls">${typeControl('scaleType', state.scaleType)}
      <div class="linked-time-widget company-scale-time" data-linked-time data-company-scale-range
        data-lt-state="committed" data-lt-start="${period.start}" data-lt-end="${period.end}"
        data-lt-selection="${period.key}"></div></div>
      ${actions('scale')}
    </div>
    <div class="company-block company-scale">
      <div class="company-chart" data-company-chart="scale" role="img" aria-label="总规模及规模变化趋势图"></div>
      ${dataTable(['时间', '总规模（亿）', '规模变化（亿）', '规模排名', '基金数'], rows, {numeric:[1,2,3,4],label:'规模变化'})}
    </div>
  </section>`;
}

function productsPanel() {
  const products = company.products;
  const rows = products.map(item => [
    {html:`<span class="company-type-dot" style="--company-type-color:${escapeHtml(item.color)}"></span>${escapeHtml(item.label)}`},
    percent(item.percent), item.count, {html:rank(item.countRank)}, amount(item.total), {html:rank(item.scaleRank)},
  ]);
  return `<section class="company-panel" aria-labelledby="company-products-title">
    <div class="company-panel-head"><h2 id="company-products-title">旗下产品结构</h2>
      ${actions('products')}
    </div>
    <div class="company-block company-products">
      <div class="company-chart" data-company-chart="products" data-company-chart-legend="external" role="img" aria-label="旗下产品管理规模占比环形图"></div>
      ${dataTable(['基金类型', '占比', '基金数量', '基金个数排名', '规模合计（亿元）', '规模排名'], rows, {numeric:[1,2,3,4,5],label:'旗下产品结构',productKeys:products.map(item => item.label)})}
    </div>
  </section>`;
}

function ratingBars(state) {
  const managerMode = state.ratingMode === 'manager';
  const unit = managerMode ? '人' : '只';
  const distribution = ratingDistribution(state);
  const axisMax = managerMode ? Math.max(1, ...distribution.map(item => item.percent)) : 50;
  const empty = !managerMode && state.ratingType !== 'all';
  return `<div class="company-distribution">
    <h3>${managerMode ? '智君基金经理星级占比' : '智君基金星级占比'}</h3>
    ${empty ? '<p class="company-empty" role="status">暂无该类型的规模占比数据</p>' : `<div class="company-ratings">
      <div class="company-rating-plot">
        <div class="company-rating-guides" aria-hidden="true"><span></span><span></span><span></span></div>
        ${distribution.map(item => {
          const key = ratingKey(item.rating);
          const label = ratingGrade(key);
          const count = item.count ?? item.exampleCount;
          const countLabel = count == null ? '暂无数量数据' : `${item.count == null ? '示例数量' : '数量'} ${count} ${unit}`;
          return `<button type="button" class="company-rating-row" data-company-choice="rating" data-value="${key}" aria-pressed="${key === state.rating}"
            aria-label="${label}，占比 ${item.percent}%，${countLabel}">
            <span>${label}</span>
            <span class="company-bar-track" aria-hidden="true"><span class="company-bar${key === 'unrated' ? ' is-unrated' : ''}" style="--company-bar-size:${item.percent / axisMax * 100}%"></span></span>
            <span class="num">${item.percent}%</span>
            <span class="company-rating-quantity" title="${countLabel}"><span class="num">${count ?? '—'}</span>${count == null ? '' : `<span class="company-rating-unit">${unit}</span>`}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="company-rating-axis" aria-hidden="true"><span>0%</span><span>${Math.round(axisMax / 2)}%</span><span>${axisMax}%</span></div>
    </div>`}
  </div>`;
}

function ratingDropdown(state) {
  const label = state.ratingMode === 'manager' ? '基金经理星级' : '基金星级';
  const grades = ratingDistribution(state).map(row => ratingKey(row.rating));
  const choices = [['all', '全部'], ...grades.map(key => [key, ratingGrade(key)])];
  return dropdown('rating', state.rating, choices, {label,asHeading:true,value:ratingLabel(state)});
}

function rowStars(rating) {
  if (rating == null) return '暂无星级';
  return `<span class="company-stars" role="img" aria-label="${rating} 星">${stars.map(i =>
    `<span${i >= rating ? ' class="company-stars-muted"' : ''}>${icon('star')}</span>`
  ).join('')}</span>`;
}

function ratingsPanel(state) {
  const modes = [['fund', '基金星级分布'], ['manager', '基金经理星级分布']];
  const managerMode = state.ratingMode === 'manager';
  const rows = managerMode ? managerRatingRows(state).map(manager => [
    {html:`<span class="company-list-name" title="${escapeHtml(manager.name)}">${escapeHtml(manager.name)}</span>`},
    {html:`<span class="company-list-name" title="${escapeHtml(manager.product)}">${escapeHtml(manager.product)}</span>`},
    {html:rowStars(manager.rating)},
    ...managerMetricKeys.map((key, index) => ({
      value:percent(manager[key]), className:index < 2 ? signClass(manager[key]) : '',
    })),
  ]) : ratedRows(state).map(item => [
    {html:`<span class="company-list-name">${escapeHtml(item.name)}</span>`}, {html:rowStars(item.rating)},
    {value:percent(item.annual),className:signClass(item.annual)}, percent(item.returns), percent(item.drawdown), item.status,
  ]);
  return `<section class="company-panel company-rating-panel" aria-label="星级分布">
    <div class="company-panel-head">
      <div class="company-rating-modes" aria-label="评级维度" role="group">
        ${modes.map(([value, label]) => `<button type="button" data-company-choice="ratingMode" data-value="${value}" aria-pressed="${value === state.ratingMode}">${label}</button>`).join('')}
      </div>
      <div class="company-panel-controls">${typeControl('ratingType', state.ratingType)}${actions('rating')}</div>
    </div>
    <div class="company-block company-ratings-block">
      ${ratingBars(state)}
      <div class="company-rating-detail">
        <div class="company-rating-detail-head">
          ${ratingDropdown(state)}
        </div>
        ${dataTable(managerMode ? ratedManagerHeaders : ratedFundHeaders, rows, {
          numeric:managerMode ? [3,4,5,6] : [2,3,4], label:ratingLabel(state), ratingMode:state.ratingMode,
        })}
      </div>
    </div>
  </section>`;
}

function chartData(state) {
  const lastYear = company.scaleAnnual[0]?.year ?? 2026;
  return {
    scale: state.scaleType === 'all' ? company.scale.filter(point => Number(point.date.slice(0, 4)) > lastYear - Number(state.scaleYears)) : [],
    scaleApproximate: true,
    products: company.products,
  };
}

function csvRows(module, state) {
  if (module === 'funds') return fundListCsv(state);
  if (module === 'managers') return managerListCsv(company.managers, state);
  if (module === 'holdings-stock') return holdingListCsv(state);
  if (module === 'scale') return [
    ['时间','总规模（亿）','规模变化（亿）','规模排名','基金数'],
    ...scaleRows(state).map(row => [row.year,row.total,row.change,row.rank,row.fundCount]),
  ];
  if (module === 'products') return [
    ['基金类型','占比','基金数量','基金个数排名','规模合计（亿元）','规模排名'],
    ...company.products.map(row => [row.label,percent(row.percent),row.count,row.countRank,row.total,row.scaleRank]),
  ];
  if (state.ratingMode === 'manager') return [
    ratedManagerHeaders,
    ...managerRatingRows(state).map(manager => [
      manager.name, manager.product, manager.rating ?? '暂无星级',
      ...managerMetricKeys.map(key => percent(manager[key])),
    ]),
  ];
  return [
    ratedFundHeaders,
    ...ratedRows(state).map(row => [row.name,row.rating ?? '暂无星级',percent(row.annual),percent(row.returns),percent(row.drawdown),row.status]),
  ];
}

function download(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

function limitRatingTable(content) {
  const table = content.querySelector('.company-table--rating');
  const sixthRow = table?.tBodies[0]?.rows[5];
  if (!sixthRow) return null;
  const viewport = table.parentElement;
  viewport.classList.add('company-rating-scroll');

  function updateHeight() {
    const row = sixthRow.getBoundingClientRect();
    const visibleHeight = row.top - table.getBoundingClientRect().top + row.height / 2;
    const horizontalScrollbar = viewport.offsetHeight - viewport.clientHeight;
    const maxHeight = `${visibleHeight + horizontalScrollbar}px`;
    if (viewport.style.maxHeight !== maxHeight) viewport.style.maxHeight = maxHeight;
  }

  updateHeight();
  const observer = new ResizeObserver(updateHeight);
  observer.observe(table);
  observer.observe(viewport);
  return observer;
}

function highlightProductRows(content) {
  const rows = new Map([...content.querySelectorAll('[data-company-product]')].map(row => [row.dataset.companyProduct, row]));
  let active;
  return label => {
    const next = rows.get(label);
    if (next === active) return;
    active?.classList.remove('is-chart-hovered');
    next?.classList.add('is-chart-hovered');
    active = next;
  };
}

function attachHeaderScroll(root) {
  const slot = root.querySelector('.company-header-slot');
  const header = root.querySelector('.company-header');
  const facts = root.querySelector('.company-facts-wrap');
  const title = header.querySelector('h1');
  const switchCompany = header.querySelector('[data-company-action="switch"]');
  const topbar = document.querySelector('.app-topbar');
  let compact = false;
  let pinned = false;
  let previousY = 0;
  let accumulated = 0;
  let frame = 0;
  let top = 52;
  let anchor = 0;

  function fitCompactMetadata() {
    header.classList.remove('is-metadata-hidden');
    const fits = title.scrollWidth <= title.clientWidth;
    header.classList.toggle('is-metadata-hidden', !fits);
  }

  function measure() {
    top = topbar?.offsetHeight ?? 0;
    root.style.setProperty('--company-sticky-top', `${top}px`);
    anchor = slot.getBoundingClientRect().top + window.scrollY - top;
    header.classList.add('company-no-transition');
    header.classList.remove('is-compact');
    slot.style.height = `${header.offsetHeight}px`;
    header.classList.toggle('is-compact', compact);
    if (compact) fitCompactMetadata();
    void header.offsetHeight;
    header.classList.remove('company-no-transition');
  }

  function draw(nextCompact, nextPinned) {
    if (pinned !== nextPinned) {
      pinned = nextPinned;
      header.classList.toggle('is-pinned', pinned);
    }
    if (compact !== nextCompact) {
      compact = nextCompact;
      const movingFocus = compact && facts?.contains(document.activeElement);
      header.classList.toggle('is-compact', compact);
      if (compact) fitCompactMetadata();
      if (facts) {
        facts.inert = compact;
        facts.setAttribute('aria-hidden', String(compact));
      }
      if (movingFocus) switchCompany.focus({preventScroll:true});
    }
  }

  function tick() {
    frame = 0;
    if (!root.isConnected) return;
    const y = Math.max(0, window.scrollY);
    const delta = y - previousY;
    previousY = y;
    if (delta !== 0) accumulated = Math.sign(delta) === Math.sign(accumulated) ? accumulated + delta : delta;
    const atAnchor = y <= Math.max(0, anchor + 2);
    const nextPinned = !atAnchor;
    let nextCompact = compact;
    if (atAnchor || accumulated <= -28) nextCompact = false;
    else if (y >= anchor + 48 && accumulated >= 14) nextCompact = true;
    draw(nextCompact, nextPinned);
  }

  function onScroll() {
    if (frame) return;
    frame = requestAnimationFrame(tick);
  }

  function onResize() {
    if (!root.isConnected) return;
    measure();
    onScroll();
  }

  measure();
  tick();
  function resetDirection() {
    previousY = Math.max(0, window.scrollY);
    accumulated = 0;
    onScroll();
  }
  root.addEventListener('company-tab-scroll', resetDirection);
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onResize, { passive:true });
  document.fonts?.ready.then(onResize);
  return () => {
    root.removeEventListener('company-tab-scroll', resetDirection);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (frame) cancelAnimationFrame(frame);
  };
}

export function mountCompanyDetail(container, { companyId = 'essence', initialTab = 'overview', onTabChange = () => {}, toast = () => {} } = {}) {
  const profile = getCompanyProfile(companyId);
  if (!profile) {
    container.innerHTML = '<div class="company-detail"><section class="company-panel"><p class="company-empty" role="status">没有找到这家公司。</p></section></div>';
    return;
  }
  const favoriteKey = `zhice-company-favorite-${companyId}`;
  const state = { ...defaults, tab: tabs.some(([key]) => key === initialTab) ? initialTab : 'overview', favorite: readFavorite(favoriteKey) };
  container.innerHTML = `<div class="company-detail">${header(profile)}<div class="company-content" id="company-tab-panel" role="tabpanel" tabindex="0"></div>${switchDialog(profile)}</div>`;
  const root = container.firstElementChild;
  const content = root.querySelector('.company-content');
  const dialog = root.querySelector('.company-dialog');
  const search = root.querySelector('[data-company-search]');
  const result = dialog.querySelector('.company-dialog-result');
  const favorite = root.querySelector('[data-company-action="favorite"]');
  let disposeCharts = () => {};
  let disposeFundPagination = () => {};
  let ratingTableObserver;
  let dialogTrigger;
  let activeDropdown;

  function updateFavorite() {
    favorite.setAttribute('aria-pressed', String(state.favorite));
    favorite.setAttribute('aria-label', state.favorite ? '取消收藏公司' : '收藏公司');
    favorite.querySelector('span').textContent = state.favorite ? '已收藏' : '收藏';
  }

  function renderContent(focus) {
    closeDropdown();
    disposeCharts();
    disposeFundPagination();
    ratingTableObserver?.disconnect();
    content.setAttribute('aria-labelledby', `company-tab-${state.tab}`);
    root.querySelectorAll('[data-company-tab]').forEach(button => {
      const active = button.dataset.companyTab === state.tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    if (companyId !== 'essence') {
      content.innerHTML = profile.listedManagers && (state.tab === 'overview' || state.tab === 'managers')
        ? listedManagersPanel(profile.listedManagers)
        : emptyAnalysis(state.tab);
      return;
    }
    const isManagerList = state.tab === 'managers';
    const holdings = state.tab === 'holdings' ? holdingChartData(state) : null;
    const managerTypes = isManagerList ? [...new Set(company.managers.map(manager => manager.type).filter(Boolean))] : [];
    content.innerHTML = state.tab === 'overview'
      ? scalePanel(state) + productsPanel() + ratingsPanel(state)
      : holdings ? renderCompanyHoldings(state, holdings, {dropdown, actions})
        : renderCompanyList(state.tab, company, state, {
        actions: state.tab === 'funds' || isManagerList ? actions(state.tab) : '',
        filter: isManagerList ? dropdown('managerFilter', state.managerFilter,
          [['all', '全部'], ...managerTypes.map(type => [type, type])], {label:'投资类型'}) : '',
      });
    if (state.tab === 'funds') {
      disposeFundPagination = mountPagination(content.querySelector('.company-fund-panel > .zc-pagination'));
      content.querySelectorAll('[data-indeterminate]').forEach(input => { input.indeterminate = true; });
      if (state.fundMenuOpen) positionFundMenu();
    }
    disposeCharts = state.tab === 'overview' ? mountCompanyCharts(content, {
      ...chartData(state),
      onProductHover: highlightProductRows(content),
    }) : () => {};
    if (holdings) {
      const rows = new Map();
      content.querySelectorAll('[data-holdings-row]').forEach(row => {
        const { holdingsRow, holdingsIndex } = row.dataset;
        rows.set(`${holdingsRow}-${holdingsIndex}`, row);
      });
      const hovered = {};
      disposeCharts = mountHoldingCharts(content, { ...holdings, onHover(key, index) {
        hovered[key]?.classList.remove('is-chart-hovered');
        hovered[key] = rows.get(`${key}-${index}`);
        hovered[key]?.classList.add('is-chart-hovered');
      } });
      window.ZhiceLinkedTime?.mount(content, host => holdingTimeOptions(host.dataset.holdingsRange));
    } else if (state.tab === 'overview') {
      window.ZhiceLinkedTime?.mount(content, () => ({ shortcuts: scaleShortcuts, showDate: false,
        min: scaleShortcuts.at(-1).start, max: scaleEnd, end: scaleEnd, defaultShortcut: defaults.scaleYears }));
    }
    ratingTableObserver = limitRatingTable(content);
    if (focus) {
      const target = typeof focus === 'string' ? root.querySelector(focus) : focus();
      target?.focus({preventScroll:true});
    }
  }

  function setTab(tab) {
    if (tab === state.tab) return;
    state.fundMenuOpen = false;
    state.tab = tab;
    onTabChange(tab);
    renderContent();
    const header = root.querySelector('.company-header');
    if (header.classList.contains('is-pinned') && content.getBoundingClientRect().top < header.getBoundingClientRect().bottom) {
      const y = window.scrollY + content.getBoundingClientRect().top - header.getBoundingClientRect().bottom - 10;
      window.scrollTo({top:Math.max(0, y), behavior:'instant'});
    }
    root.dispatchEvent(new Event('company-tab-scroll'));
  }

  function setControl(key, value, focus) {
    if (!Object.hasOwn(defaults, key)) return;
    state[key] = key.endsWith('PageSize') ? Number(value) : value;
    if (key === 'ratingMode') state.rating = value === 'manager' ? '5' : 'all';
    if (key === 'holdingAssetPeriod') state.holdingAssetRange = null;
    if (key === 'holdingIndustryPeriod') state.holdingIndustryRange = null;
    if (key === 'masterOnly' || key === 'fundPageSize') {
      state.fundPage = 1;
      state.fundMenuOpen = false;
      renderList(focus);
    } else if (key === 'managerFilter' || key === 'managerPageSize') {
      state.managerPage = 1;
      renderList(focus);
    } else if (key === 'holdingStockDate' || key === 'holdingPageSize') {
      state.holdingPage = 1;
      renderList(focus);
    } else renderContent(focus);
  }

  function positionFundMenu() {
    const trigger = content.querySelector('[data-fund-menu]');
    const menu = content.querySelector('#company-fund-menu');
    if (!trigger || !menu || menu.hidden) return;
    const {left, top, bottom} = trigger.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const toolbar = trigger.closest('.company-fund-toolbar');
    const {left: toolbarLeft, right: toolbarRight} = toolbar.getBoundingClientRect();
    const edge = Math.min(viewportWidth - 8, toolbarRight);
    const menuLeft = Math.max(toolbarLeft, Math.min(left, edge - menu.offsetWidth));
    menu.style.insetInlineStart = `${menuLeft - left}px`;
    const headerBottom = root.querySelector('.company-header.is-pinned')?.getBoundingClientRect().bottom ?? 52;
    menu.classList.toggle('opens-up', window.innerHeight - bottom < menu.offsetHeight + 16 && top - headerBottom > window.innerHeight - bottom);
  }

  function renderList(focus, resetChildScroll = false) {
    const columns = [...content.querySelectorAll('.company-fund-column')];
    const scrollPositions = columns.map(column => column.scrollTop);
    const tableScroll = content.querySelector('.company-table-scroll')?.scrollLeft ?? 0;
    if (state.tab === 'holdings') {
      closeDropdown();
      content.querySelector('.company-holdings-stock').outerHTML = renderHoldingStock(state, {dropdown, actions});
    } else renderContent();
    content.querySelector('.company-table-scroll').scrollLeft = tableScroll;
    [...content.querySelectorAll('.company-fund-column')].forEach((column, index) => {
      column.scrollTop = index === 1 && resetChildScroll ? 0 : (scrollPositions[index] ?? 0);
    });
    if (focus) content.querySelector(focus)?.focus({preventScroll:true});
  }

  function changeListPage(value, focus) {
    const type = listTypes[state.tab];
    const { pageCount } = type === 'fund' ? fundListSnapshot(state) :
      type === 'manager' ? managerListSnapshot(company.managers, state) : holdingListSnapshot(state);
    if (!Number.isInteger(value) || value < 1 || value > pageCount) return;
    state.fundMenuOpen = false;
    state[`${type}Page`] = value;
    const nextFocus = focus && !((focus.includes('prev') && value === 1) || (focus.includes('next') && value === pageCount))
      ? focus : '[aria-current="page"]';
    renderList(nextFocus);
    scrollToListStart();
  }

  function scrollToListStart() {
    const toolbar = content.querySelector('.company-fund-toolbar, .company-holdings-stock .company-panel-head');
    const headerBottom = root.querySelector('.company-header.is-pinned')?.getBoundingClientRect().bottom ?? 52;
    const top = toolbar.getBoundingClientRect().top;
    if (top < headerBottom) window.scrollBy({top:top - headerBottom - 12, behavior:'instant'});
  }

  function onFundPagination(event) {
    if (state.tab !== 'funds' || !event.target.matches('.company-fund-panel > .zc-pagination')) return;
    const { page, pageSize } = event.detail;
    if (page === state.fundPage && pageSize === state.fundPageSize) return;
    state.fundPage = page;
    state.fundPageSize = pageSize;
    const table = content.querySelector('.company-fund-panel .company-table-scroll');
    const scrollLeft = table.scrollLeft;
    table.outerHTML = renderFundTable(state);
    content.querySelector('.company-fund-panel .company-table-scroll').scrollLeft = scrollLeft;
    scrollToListStart();
  }

  function changeFundTypes(input) {
    const { fundCheck: kind } = input.dataset;
    const key = input.value;
    const keys = kind === 'all' ? fundTypeOptions
      : kind === 'branch' ? fundCategories.find(([parent]) => parent === key)[1] : [key];
    const selected = new Set(state.fundTypes);
    for (const type of keys) {
      if (input.checked) selected.add(type);
      else selected.delete(type);
    }
    const nextBranch = kind === 'branch' && state.fundBranch !== key;
    if (kind === 'branch') state.fundBranch = key;
    state.fundTypes = [...selected];
    state.fundPage = 1;
    renderList(`[data-fund-check="${kind}"][value="${CSS.escape(key)}"]`, nextBranch);
  }

  function onChange(event) {
    const fundCheck = event.target.closest('[data-fund-check]');
    if (fundCheck) { changeFundTypes(fundCheck); return; }
    const field = event.target.closest('[data-company-control]');
    if (field) setControl(field.dataset.companyControl, field.type === 'checkbox' ? field.checked : field.value, `[data-company-control="${field.dataset.companyControl}"]`);
  }

  function onSubmit(event) {
    if (!event.target.matches('[data-company-list-jump]')) return;
    event.preventDefault();
    changeListPage(event.target.querySelector('input').valueAsNumber);
  }

  function onTimeRange(event) {
    const { target, detail } = event;
    if (target.hasAttribute('data-company-scale-range')) {
      if (state.tab === 'overview' && state.scaleYears !== detail.selection) {
        state.scaleYears = detail.selection;
        queueMicrotask(() => {
          if (root.isConnected && state.tab === 'overview') renderContent('[data-company-scale-range] .lt-bar > .is-selected');
        });
      }
      return;
    }
    const key = target.dataset.holdingsRange;
    if (!key || state.tab !== 'holdings') return;
    const {periodKey, rangeKey, period, range} = holdingRangeControl(key, detail);
    if (state[periodKey] === period && state[rangeKey]?.start === range?.start && state[rangeKey]?.end === range?.end) return;
    state[periodKey] = period;
    state[rangeKey] = range;
    queueMicrotask(() => {
      if (root.isConnected && state.tab === 'holdings') renderContent();
    });
  }

  function changeListSort(key) {
    const type = listTypes[state.tab];
    const sort = `${type}Sort`;
    const direction = `${type}SortDirection`;
    const descending = ['rating3', 'rating5', 'returns', 'scale', 'tenure', 'experience', 'count', 'annual', 'value', 'weight', 'return1y'].includes(key);
    state[direction] = state[sort] === key ? (state[direction] === 'asc' ? 'desc' : 'asc') : descending ? 'desc' : 'asc';
    state[sort] = key;
    state[`${type}Page`] = 1;
    state.fundMenuOpen = false;
    renderList(`[data-company-list-sort="${key}"]`);
  }

  function onFundClick(button) {
    const { fundMenu, fundClear, fundBranch, fundStatus } = button.dataset;
    if (fundMenu !== undefined) {
      state.fundMenuOpen = !state.fundMenuOpen;
      renderList('[data-fund-menu]');
    } else if (fundClear !== undefined) {
      const first = fundTypeOptions.find(type => state.fundTypes.includes(type));
      state.fundTypes = state.fundTypes.length === fundTypeOptions.length ? [] : state.fundTypes.filter(type => type !== first);
      state.fundPage = 1;
      renderList('[data-fund-menu]');
    } else if (fundBranch !== undefined) {
      if (state.fundBranch !== fundBranch) {
        state.fundBranch = fundBranch;
        renderList(`[data-fund-branch="${CSS.escape(fundBranch)}"]`, true);
      }
    } else if (fundStatus !== undefined) {
      state.fundMenuOpen = false;
      state.fundPage = 1;
      state.fundStatus = fundStatus;
      renderList(`[data-fund-status="${fundStatus}"]`);
    } else return false;
    return true;
  }

  function closeDropdown(restoreFocus = false) {
    if (!activeDropdown) return;
    const dropdown = activeDropdown;
    activeDropdown = null;
    const trigger = dropdown.querySelector('[data-company-dropdown]');
    const menu = trigger.nextElementSibling;
    menu.hidden = true;
    menu.style.removeProperty('max-height');
    dropdown.classList.remove('opens-up');
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({preventScroll:true});
  }

  function openDropdown(trigger) {
    closeDropdown();
    activeDropdown = trigger.closest('.company-dropdown');
    const menu = trigger.nextElementSibling;
    trigger.setAttribute('aria-expanded', 'true');
    menu.hidden = false;

    const {top, bottom} = trigger.getBoundingClientRect();
    const headerBottom = root.querySelector('.company-header.is-pinned')?.getBoundingClientRect().bottom ?? 52;
    const spaceBelow = window.innerHeight - bottom - 16;
    const spaceAbove = top - headerBottom - 16;
    const opensUp = spaceBelow < menu.offsetHeight && spaceAbove > spaceBelow;
    activeDropdown.classList.toggle('opens-up', opensUp);
    menu.style.maxHeight = `${Math.min(menu.offsetHeight, Math.max(64, opensUp ? spaceAbove : spaceBelow))}px`;
    (menu.querySelector('[aria-selected="true"]') ?? menu.firstElementChild)?.focus();
  }

  function onClick(event) {
    const button = event.target.closest('button');
    if (!button) return;
    if (state.tab === 'funds' && onFundClick(button)) return;
    const { companyTab, companyDropdown, companyChoice, value, companyAction, module,
      companyListPage, companyListPageStep, companyListSort } = button.dataset;
    if (companyListSort !== undefined) { changeListSort(companyListSort); return; }
    if (companyListPage !== undefined) {
      changeListPage(Number(companyListPage), companyListPageStep && `[data-company-list-page-step="${companyListPageStep}"]`);
      return;
    }
    if (companyTab) { setTab(companyTab); return; }
    if (companyDropdown) {
      if (button.getAttribute('aria-expanded') === 'true') closeDropdown(true);
      else openDropdown(button);
      return;
    }
    if (companyChoice) {
      const fromMenu = button.getAttribute('role') === 'option';
      const choice = companyChoice === 'rating' && !fromMenu && value === state.rating ? 'all' : value;
      const focus = fromMenu ? `[data-company-dropdown="${companyChoice}"]` : `[data-company-choice="${companyChoice}"][data-value="${value}"]`;
      if (fromMenu && choice === state[companyChoice]) closeDropdown(true);
      else setControl(companyChoice, choice, focus);
      return;
    }
    if (!companyAction) return;
    if (companyAction === 'favorite') {
      state.favorite = !state.favorite;
      try { localStorage.setItem(favoriteKey, state.favorite ? '1' : '0'); } catch {}
      updateFavorite();
      toast(state.favorite ? '已收藏公司' : '已取消收藏');
    } else if (companyAction === 'switch') {
      dialogTrigger = button;
      search.value = '';
      filterCompanies();
      dialog.showModal();
      search.focus();
    } else if (companyAction === 'select-company') {
      dialog.close();
      setTab('overview');
      window.scrollTo({top:0,behavior:'instant'});
    } else if (companyAction === 'refresh') {
      if (module === 'funds') state.fundMenuOpen = false;
      const focus = `[data-company-action="refresh"][data-module="${module}"]`;
      if (module === 'holdings-stock') renderList(focus);
      else renderContent(focus);
      toast('已刷新当前模块');
    } else if (companyAction === 'table-download') {
      const rows = csvRows(module, state);
      if (rows.length < 2) { toast('暂无可下载的数据'); return; }
      const csv = rows.map(row => row.map(value => '"' + String(value ?? '').replaceAll('"','""') + '"').join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob(['\ufeff', csv], {type:'text/csv;charset=utf-8'}));
      const ratingTitle = state.ratingMode === 'manager' ? '基金经理星级-示例数据' : '基金星级';
      const tableTitles = { scale:'规模变化', products:'旗下产品结构', rating:ratingTitle, funds:'旗下基金-示例数据',
        managers:'在职经理', 'holdings-stock':`股票持仓详情-${state.holdingStockDate}-示例数据` };
      download(url, `安信基金-${tableTitles[module]}.csv`);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else if (companyAction === 'image-download') {
      if (module === 'rating') {
        const image = ratingChartImage(content.querySelector('.company-distribution'));
        const title = state.ratingMode === 'manager' ? '基金经理星级分布' : '基金星级分布';
        if (image) download(image, `安信基金-${title}.png`);
        else toast('暂无可下载的图表');
        return;
      }
      if (holdingChartTitles[module]) {
        const key = module.slice('holdings-'.length);
        const nodes = content.querySelectorAll(`[data-holdings-chart^="${key}-"]`);
        const charts = [...nodes].map(node => window.echarts?.getInstanceByDom(node)).filter(Boolean);
        if (!charts.length) { toast('暂无可下载的图表'); return; }
        if (charts.length === 1) {
          download(charts[0].getDataURL({type:'png',pixelRatio:2,backgroundColor:'#fff'}), `安信基金-${holdingChartTitles[module]}.png`);
          return;
        }
        const group = window.echarts.connect(charts);
        try {
          download(charts[0].getConnectedDataURL({type:'png',pixelRatio:2,backgroundColor:'#fff',connectedBackgroundColor:'#fff'}),
            `安信基金-${holdingChartTitles[module]}.png`);
        } finally {
          window.echarts.disconnect(group);
        }
        return;
      }
      const node = content.querySelector(`[data-company-chart="${module}"]`);
      const chart = node && window.echarts?.getInstanceByDom(node);
      if (!chart || (module === 'scale' && !chartData(state).scale.length)) { toast('暂无可下载的图表'); return; }
      download(chart.getDataURL({type:'png',pixelRatio:2,backgroundColor:'#fff'}), `安信基金-${module === 'scale' ? '规模变化' : '旗下产品结构'}.png`);
    }
  }

  function onKeydown(event) {
    const fundCascade = event.target.closest('.company-fund-cascade');
    if (fundCascade && state.fundMenuOpen && event.key === 'Escape') {
      event.preventDefault();
      state.fundMenuOpen = false;
      renderList('[data-fund-menu]');
      return;
    }
    if (event.target.matches('[data-fund-menu]') && event.key === 'ArrowDown') {
      event.preventDefault();
      state.fundMenuOpen = true;
      renderList('[data-fund-check="all"]');
      return;
    }
    const button = event.target.closest('[data-company-tab]');
    if (button && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      const current = tabs.findIndex(([key]) => key === button.dataset.companyTab);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
        (current + (event.key === 'ArrowLeft' ? -1 : 1) + tabs.length) % tabs.length;
      setTab(tabs[next][0]);
      root.querySelector(`[data-company-tab="${tabs[next][0]}"]`).focus();
    }
    const trigger = event.target.closest('[data-company-dropdown]');
    if (trigger && ['ArrowDown','ArrowUp'].includes(event.key)) {
      event.preventDefault();
      openDropdown(trigger);
    } else if (activeDropdown?.contains(event.target)) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDropdown(true);
      } else if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        const options = [...activeDropdown.querySelectorAll('[role="option"]')];
        const index = options.indexOf(event.target);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 :
          (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[next]?.focus();
      }
    }
  }

  function onOutsideClick(event) {
    if (activeDropdown && !activeDropdown.contains(event.target)) closeDropdown();
    if (state.tab === 'funds' && state.fundMenuOpen && !event.composedPath().some(part => part.classList?.contains('company-fund-cascade'))) {
      state.fundMenuOpen = false;
      const trigger = content.querySelector('[data-fund-menu]');
      const menu = content.querySelector('#company-fund-menu');
      if (menu.contains(document.activeElement)) trigger.focus({preventScroll:true});
      trigger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }
  }

  function onFocusOut(event) {
    if (activeDropdown?.contains(event.target) && !activeDropdown.contains(event.relatedTarget)) closeDropdown();
  }

  function filterCompanies() {
    result.hidden = !profile.name.includes(search.value.trim());
    dialog.querySelector('.company-dialog-empty').hidden = !result.hidden;
  }

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  root.addEventListener('submit', onSubmit);
  root.addEventListener('paginationchange', onFundPagination);
  root.addEventListener('timerangechange', onTimeRange);
  root.addEventListener('keydown', onKeydown);
  root.addEventListener('focusout', onFocusOut);
  search.addEventListener('input', filterCompanies);
  dialog.addEventListener('close', () => dialogTrigger?.focus({preventScroll:true}));
  document.addEventListener('click', onOutsideClick);
  window.addEventListener('resize', positionFundMenu);
  updateFavorite();
  renderContent();
  const disposeScroll = attachHeaderScroll(root);
  return () => {
    disposeScroll();
    disposeCharts();
    disposeFundPagination();
    ratingTableObserver?.disconnect();
    document.removeEventListener('click', onOutsideClick);
    window.removeEventListener('resize', positionFundMenu);
    if (dialog.open) dialog.close();
    root.remove();
  };
}
