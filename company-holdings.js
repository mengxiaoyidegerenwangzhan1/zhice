import { listPage, listPagination, listTable, sortListRows } from './company-detail-lists.js?v=20261123-holdings';
import { assetCategories, assetHistory, industryCategories, industryHistory, getStockHoldings, stockReportDates } from './company-holdings-data.js?v=20261123-holdings';

const companyOnlyAssetColors = { 买入返售金融资产: '#63A6A6', 资产支持证券: '#A69B63' };
const industryColors = {
  银行: '#D36FAA', 非银金融: '#E387A2', 房地产: '#F2A2A1', 食品饮料: '#F28098',
  家用电器: '#F2858E', 农林牧渔: '#F28F8A', 商贸零售: '#F2A18E', 社会服务: '#F2B293',
  轻工制造: '#F2C198', 纺织服饰: '#F2CF9D', 美容护理: '#F2DCA2', 医药生物: '#E3CC88',
  公用事业: '#AFB987', 建筑装饰: '#AEBD8D', 有色金属: '#ADC193', 煤炭: '#ADC59A',
  基础化工: '#AEC9A0', 石油石化: '#AFCDA7', 钢铁: '#AED0AB', 建筑材料: '#AED4AF',
  交通运输: '#B1D8B7', 机械设备: '#7EBAA2', 汽车: '#88C1B3', 国防军工: '#91C7C2',
  综合: '#9CC9CD', 电力设备: '#A6C8D3', 环保: '#B1C9D9', 传媒: '#91A1C7',
  通信: '#A2A5D2', 计算机: '#BBB4DC', 电子: '#CCBDE6',
};
const breakdowns = {
  assets: {
    title: '大类资产分布', categoryLabel: '资产', history: assetHistory,
    periods: [1, 2, 3, 5].map(years => [String(years), `近${years}年`, 12 * years]),
    dateKey: 'holdingAssetDate', periodKey: 'holdingAssetPeriod', rangeKey: 'holdingAssetRange',
    defaultPeriod: '1',
  },
  industry: {
    title: '股票行业分布', categoryLabel: '申万一级行业', history: industryHistory,
    periods: [2, 3, 5].map(years => [String(years), `近${years}年`, 12 * years]),
    dateKey: 'holdingIndustryDate', periodKey: 'holdingIndustryPeriod', rangeKey: 'holdingIndustryRange',
    defaultPeriod: '3',
  },
};
const stockTitle = '股票持仓详情';
const stockColumns = [
  ['code', '股票代码'], ['name', '股票名称'], ['value', '持仓市值'], ['weight', '持仓占比'],
  ['change', '较上期变化'], ['return1y', '近1年涨跌幅'], ['pe', 'PE'], ['industry', '行业'],
];

export const holdingDefaults = {
  holdingAssetDate: assetHistory.at(-1).date, holdingAssetPeriod: breakdowns.assets.defaultPeriod, holdingAssetRange: null,
  holdingIndustryDate: industryHistory.at(-1).date, holdingIndustryPeriod: '3', holdingIndustryRange: null,
  holdingIndustryScope: 'all', holdingStockDate: stockReportDates[0],
  holdingPage: 1, holdingPageSize: 10, holdingSort: '', holdingSortDirection: 'asc',
};

function presetRange({ history, periods, defaultPeriod }, period) {
  const end = history.at(-1).date;
  const [year, month] = end.split('-').map(Number);
  const [, , months] = periods.find(([key]) => key === period) ?? periods.find(([key]) => key === defaultPeriod);
  const start = new Date(Date.UTC(year, month - months, 0)).toISOString().slice(0, 10);
  return { start, end };
}

function breakdownRange(state, breakdown) {
  const { periodKey, rangeKey } = breakdown;
  const period = state[periodKey];
  if (period === 'custom' && state[rangeKey]) return state[rangeKey];
  return presetRange(breakdown, period);
}

export function holdingTimeOptions(key) {
  const { history } = breakdowns[key];
  const end = history.at(-1).date;
  return { min: history[0].date, max: end, end };
}

export function holdingRangeControl(key, { start, end }) {
  const { periodKey, rangeKey, defaultPeriod } = breakdowns[key];
  const manual = start && end;
  return {
    periodKey,
    rangeKey,
    period: manual ? 'custom' : defaultPeriod,
    range: manual ? { start, end } : null,
  };
}

function assetConfig(state) {
  const index = assetHistory.findIndex(point => point.date === state.holdingAssetDate);
  const current = assetHistory[index];
  const previous = assetHistory[index - 1];
  const range = breakdownRange(state, breakdowns.assets);
  const { assetColors } = window.CompareAllocationView;
  const colors = assetCategories.map(category => assetColors[category === '债券' ? '固定收益' : category] ?? companyOnlyAssetColors[category]);
  return {
    date: current.date, categories: assetCategories, colors, values: current.values,
    changes: current.values.map((value, i) => previous ? value - previous.values[i] : null),
    history: assetHistory.filter(point => point.date >= range.start && point.date <= range.end),
    range,
  };
}

function industryConfig(state) {
  const current = industryHistory.find(point => point.date === state.holdingIndustryDate);
  const ranking = current.values.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value);
  const selected = state.holdingIndustryScope === 'top10' ? ranking.slice(0, 10) : ranking;
  const categories = selected.map(({ index }) => industryCategories[index]);
  const range = breakdownRange(state, breakdowns.industry);
  const history = industryHistory.filter(point => point.date >= range.start && point.date <= range.end)
    .map(point => ({ date: point.date, values: selected.map(({ index }) => point.values[index]) }));
  return { date: current.date, categories, colors: categories.map(category => industryColors[category]),
    values: selected.map(({ value }) => value), history, range };
}

export function holdingChartData(state) {
  return { assets: assetConfig(state), industry: industryConfig(state) };
}

function escapeText(text) {
  return String(text ?? '—').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function decimal(value, unit = '') {
  return value == null ? '—' : value.toFixed(2) + unit;
}

function directionClass(value) {
  const displayed = value == null ? 0 : Number(value.toFixed(2));
  return displayed > 0 ? ' is-rise' : displayed < 0 ? ' is-fall' : '';
}

function assetTitle() {
  return `<span class="company-holdings-info zc-title-help">
    <span class="zc-title-help-label">大类资产分布</span>
    <button class="zc-title-help-trigger" type="button" aria-label="大类资产分布说明" aria-describedby="company-holding-asset-help">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor"/><path d="M5.9 5.8a2.1 2.1 0 0 1 4.2 0c0 1.4-2.1 1.5-2.1 3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11.5" r=".7" fill="currentColor"/></svg>
    </button>
    <span class="zc-title-help-panel" role="tooltip" id="company-holding-asset-help">按报告期展示旗下基金的大类资产占比及较上一报告期的变化。</span>
  </span>`;
}

function distributionTable(key, label, { categories, colors, values, changes }) {
  return `<div class="company-holdings-breakdown" tabindex="0" role="region" aria-label="${label}占比明细">
    <table class="company-table company-holdings-breakdown-table">
      <thead><tr><th scope="col">${label}</th><th scope="col" class="num">${changes ? '占总资产比' : '占比'}</th>
        ${changes ? '<th scope="col" class="num">变动比例</th>' : ''}</tr></thead>
      <tbody>${categories.map((category, index) => `<tr data-holdings-row="${key}" data-holdings-index="${index}">
        <td title="${category}"><span class="company-type-dot" style="--company-type-color:${colors[index]}"></span>${category}</td>
        <td class="num">${decimal(values[index], '%')}</td>${changes ? `<td class="num${directionClass(changes[index])}">${decimal(changes[index], '%')}</td>` : ''}
      </tr>`).join('')}</tbody>
    </table>
  </div>`;
}

function holdingBreakdown(key, state, config, { dropdown, actions }) {
  const { title, categoryLabel, history, periods, dateKey, periodKey } = breakdowns[key];
  const assets = key === 'assets';
  const dates = history.map(({ date }) => [date, date]).reverse();
  const scope = assets ? '' : dropdown('holdingIndustryScope', state.holdingIndustryScope,
    [['all', '申万一级行业'], ['top10', '前十大行业']], { label: '分布' });
  const period = state[periodKey];
  return `<section class="company-panel company-holdings-panel ${assets ? 'company-holdings-asset' : 'company-holdings-industry'}" aria-label="${title}">
    <div class="company-panel-head company-holdings-head">
      <h2>${assets ? assetTitle() : title}</h2>
      <div class="company-holdings-controls">${scope}${actions(`holdings-${key}`)}</div>
    </div>
    <div class="company-holdings-split">
      <div class="company-holdings-summary">
        <div class="company-holdings-subhead">
          <h3>${assets ? title : categoryLabel + '分布'}</h3>
          ${dropdown(dateKey, state[dateKey], dates, { label: '截止时间' })}
        </div>
        <div class="company-holdings-snapshot">
          <div class="company-holdings-donut" data-holdings-chart="${key}-current" role="img" aria-label="${title}环形图"></div>
          ${distributionTable(key, categoryLabel, config)}
        </div>
      </div>
      <div class="company-holdings-trend">
        <div class="company-holdings-subhead">
          <h3>${assets ? title + '变化' : categoryLabel + '分布变化'}</h3>
          <div class="company-holdings-controls company-holdings-period-controls">
            <div class="linked-time-widget lt-bar company-holdings-shortcuts" role="group" aria-label="快捷时段">
              ${periods.map(([value, label]) => `<button type="button" data-company-choice="${periodKey}" data-value="${value}"
                aria-pressed="${value === period}"${value === period ? ' class="is-selected"' : ''}>${label}</button>`).join('')}
            </div>
            <div class="linked-time-widget company-holdings-dates" data-linked-time data-holdings-range="${key}"
              data-shortcuts="false" data-lt-state="committed" data-lt-start="${config.range.start}" data-lt-end="${config.range.end}"></div>
          </div>
        </div>
        <div class="company-holdings-area" data-holdings-chart="${key}-trend" role="img" aria-label="${title}变化堆叠面积图"></div>
      </div>
    </div>
  </section>`;
}

export function holdingListSnapshot(state) {
  const records = getStockHoldings(state.holdingStockDate);
  if (state.holdingSort) records.sort((a, b) => sortListRows(a, b, state.holdingSort, state.holdingSortDirection));
  return { records, ...listPage(records.length, state.holdingPage, state.holdingPageSize) };
}

export function holdingListCsv(state) {
  return [
    ['序号', ...stockColumns.map(([, label]) => label)],
    ...holdingListSnapshot(state).records.map((row, i) => [
      i + 1, row.code, row.name, decimal(row.value, '万'), decimal(row.weight, '%'), row.change,
      decimal(row.return1y, '%'), decimal(row.pe), row.industry,
    ]),
  ];
}

export function renderHoldingStock(state, { dropdown, actions }) {
  const { records, start, page, pageCount } = holdingListSnapshot(state);
  const rows = records.slice(start, start + state.holdingPageSize).map((row, index) => `<tr>
    <td class="company-fund-seq">${start + index + 1}</td><td class="num">${escapeText(row.code)}</td><td>${escapeText(row.name)}</td>
    <td class="num">${decimal(row.value, '万')}</td><td class="num">${decimal(row.weight, '%')}</td>
    <td class="${row.change === '减持' ? 'is-fall' : ['增持', '新进'].includes(row.change) ? 'is-rise' : ''}">${escapeText(row.change)}</td>
    <td class="num${directionClass(row.return1y)}">${decimal(row.return1y, '%')}</td><td class="num">${decimal(row.pe)}</td><td>${escapeText(row.industry)}</td>
  </tr>`).join('');
  return `<section class="company-panel company-holdings-panel company-holdings-stock" aria-label="${stockTitle}">
    <div class="company-panel-head company-holdings-head">
      <h2>${stockTitle}</h2>
      <div class="company-holdings-controls">${dropdown('holdingStockDate', state.holdingStockDate,
        stockReportDates.map(date => [date, date]), { label: '报告期' })}${actions('holdings-stock')}</div>
    </div>
    ${listTable({ title: stockTitle, tableClass: 'company-holdings-table', columns: stockColumns, sort: state.holdingSort,
      sortDirection: state.holdingSortDirection, rows, empty: '当前报告期暂无股票持仓。' })}
    ${listPagination(stockTitle, page, pageCount, records.length, state.holdingPageSize, 'holdingPageSize')}
  </section>`;
}

export function renderCompanyHoldings(state, data, components) {
  return holdingBreakdown('assets', state, data.assets, components)
    + holdingBreakdown('industry', state, data.industry, components) + renderHoldingStock(state, components);
}
