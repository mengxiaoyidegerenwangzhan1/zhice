import { companyMatchesQuery } from './company-list-data.js?v=20261125-company-abbreviation';
import { customRangeLabel, renderCustomRange, validateCustomRange } from './components/custom-range.js?v=20261126-range-placeholder';
import { fitFilterChips } from './components/filter-chips.js?v=20261125-fit-chips';
import { performanceValueConfig } from './manager-period-presets.js?v=20261126-period-conditions';

const esc = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const scopes = {representative: '代表基金', index: '基金经理指数'};
const periods = { '3m': '近3个月', '6m': '近6个月', '1y': '近1年', '3y': '近3年', '5y': '近5年' };
const periodOrder = Object.keys(periods);
const ranking = {
  label: '排名',
  unit: '%',
  presets: [20, 40, 60, 80].map(max => ({label: `前${max}%`, min: null, max})),
};
const groups = [
  {key: 'returns', label: '收益', metrics: {return: '区间收益率', cagr: '年化收益率', excessCagr: '超额年化收益率'}},
  {key: 'risk', label: '风险', metrics: {maxDrawdown: '最大回撤率', volatility: '年化波动率', downsideRisk: '下行风险'}},
  {key: 'adjusted', label: '调整', metrics: {sharpe: '夏普比率', informationRatio: '信息比率', calmar: '收益回撤比', sortino: '索提诺比率', treynor: '特雷诺比率'}},
];
const controls = [
  ['经理信息', ['company', 'tenure']],
  ['在管基金', ['type', 'scale', 'count']],
  ['代表基金画像', ['style', 'themes']],
];
const finite = value => typeof value === 'number' && Number.isFinite(value);
const range = (label, low, high) => ({label, matches: value => finite(value) && value >= low && value < high});
const filterOptions = values => values.map(label => ({label, matches: value => Array.isArray(value) ? value.includes(label) : value === label}));
const clearImage = '<img src="./assets/company-list/search-clear.png" width="14" height="14" alt="">';
const checkImage = '<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">';
const unrestricted = ['', '不限'];
const activePair = pair => pair.period && (pair.rank || pair.threshold);
const rangeChoices = config => [unrestricted, ...config.presets.map(({label}) => [label, label])];
const matchesBounds = (value, {min, max}) => finite(value) && (min === null || value >= min) && (max === null || value <= max);

function thresholdLabel({min, max}, unit) {
  const format = value => String(value).replace(/^-/, '−');
  if (min === null) return `≤${format(max)}${unit}`;
  if (max === null) return `≥${format(min)}${unit}`;
  return `${format(min)}${unit}～${format(max)}${unit}`;
}

function rankLabel({min, max}) {
  if (min === null) return `排名前${max}%`;
  if (max === null) return `排名≥${min}%`;
  return `排名${min}～${max}%`;
}

function buildFields(managers) {
  return {
    tenure: {
      label: '年限', summary: '管理年限', unit: '年', continuous: true,
      value: manager => manager.tenure ?? (finite(manager.tenureDays) ? manager.tenureDays / 365.25 : null),
      options: [range('少于1年', 0, 1), range('1–3年', 1, 3), range('3–5年', 3, 5), range('5年以上', 5, Infinity)],
    },
    type: {
      label: '类型', summary: '在管基金类型', value: manager => manager.type,
      options: filterOptions([...new Set(['偏股型', '偏债型', '货币型', 'QDII型', '指数型', '理财型', 'FOF型', 'REITs', ...managers.flatMap(manager => manager.type ?? [])])]),
    },
    scale: {
      label: '总规模', summary: '在管总规模', unit: '亿', continuous: true, value: manager => manager.scale,
      options: [range('1亿以下', 0, 1), range('1–5亿', 1, 5), range('5–10亿', 5, 10), range('10亿以上', 10, Infinity)],
    },
    count: {
      label: '基金数', summary: '在管基金数', unit: '只', value: manager => manager.fundCount,
      options: [range('1–10只', 1, 11), range('11–30只', 11, 31), range('31–100只', 31, 101), range('101只及以上', 101, Infinity)],
    },
    style: {
      label: '风格', summary: '代表基金风格', value: manager => manager.productStyle,
      options: filterOptions([...new Set([
        ...['大盘', '中盘', '小盘'].flatMap(size => ['价值型', '平衡型', '成长型'].map(style => `${size}-${style}`)),
        ...managers.flatMap(manager => manager.productStyle ?? []),
      ])]),
    },
    themes: {
      label: '主题', summary: '代表基金主题', value: manager => manager.productThemes,
      options: filterOptions([...new Set(['医药', '消费', '科技', '金融地产', '国防军工', '高端制造', '周期', '基建', '公用',
        ...managers.flatMap(manager => manager.productThemes ?? []),
      ])]),
    },
  };
}

function makeScope() {
  return Object.fromEntries(groups.map(({key, metrics}) => [key, {metric: Object.keys(metrics)[0], pairs: []}]));
}

export function mountManagerFilters(container, {companies, managers, onChange, signal}) {
  const fields = buildFields(managers);
  const companyById = new Map(companies.map(company => [company.id, company]));
  const selected = Object.fromEntries(Object.keys(fields).map(key => [key, new Set()]));
  const customRanges = new Map();
  const selections = {representative: makeScope(), index: makeScope()};
  const queries = {name: '', company: ''};
  let scope = 'representative';
  let baseOpen = null;
  let performanceOpen = null;
  let pairId = 0;

  function baseControl(key) {
    if (key === 'company') return `<div class="cl-search-field ml-company-search">
      <label class="cl-field-name" for="ml-company-name">公司</label>
      <input id="ml-company-name" type="search" aria-label="现任公司" placeholder="输入公司名称" autocomplete="off">
      <button type="button" class="cl-search-clear" data-ml-clear-query="company" aria-label="清除公司名称">${clearImage}</button>
    </div>`;
    const field = fields[key];
    return `<div class="cl-select" data-ml-dropdown data-ml-field="${key}">
      <div class="cl-control">
        <button type="button" class="cl-trigger" data-ml-toggle-field="${key}" aria-label="${field.summary}" aria-expanded="false" aria-controls="ml-filter-${key}"></button>
        <span class="cl-field-name">${field.label}</span>
        <span class="cl-trigger-value"><span class="cl-unlimited">不限</span></span>
        <span class="cl-chevron" aria-hidden="true"></span>
      </div>
      <div class="cl-menu" id="ml-filter-${key}" hidden>
        <div class="ml-base-menu-body">
          <div class="cl-options" role="group" aria-label="${field.summary}选项"></div>
          ${field.unit ? renderCustomRange(key, {...field, label: field.summary}) : ''}
        </div>
        <div class="ml-base-menu-footer">
          <button type="button" class="cl-clear" data-ml-clear-field="${key}" aria-label="清空${field.summary}" disabled></button>
        </div>
      </div>
    </div>`;
  }

  container.classList.add('ml-filters');
  container.innerHTML = `
    <h1 class="cl-page-heading" id="ml-title">经理筛选</h1>
    <div class="cl-filter-rows">
      <div class="cl-filter-row">
        <label class="cl-filter-label" for="ml-manager-name">基金经理姓名</label>
        <div class="ml-base-controls">
          <div class="cl-search-field"><input id="ml-manager-name" type="search" placeholder="输入基金经理姓名" autocomplete="off">
            <button type="button" class="cl-search-clear" data-ml-clear-query="name" aria-label="清除基金经理姓名">${clearImage}</button>
          </div>
        </div>
      </div>
      ${controls.map(([label, keys]) => `<div class="cl-filter-row">
        <span class="cl-filter-label">${label}</span>
        <div class="ml-base-controls">${keys.map(baseControl).join('')}</div>
      </div>`).join('')}
      <div class="cl-filter-row ml-performance" id="ml-performance" hidden></div>
    </div>
    <button type="button" class="ml-performance-toggle" aria-label="更多筛选" aria-controls="ml-performance" aria-expanded="false"></button>
    <div class="cl-summary" hidden></div>`;

  const searchInputs = {
    name: container.querySelector('#ml-manager-name'),
    company: container.querySelector('#ml-company-name'),
  };
  const summary = container.querySelector('.cl-summary');
  const performance = container.querySelector('.ml-performance');
  const toggle = container.querySelector('.ml-performance-toggle');
  function renderOptions(key) {
    const field = fields[key];
    const options = field.options.map((option, index) => {
      const label = esc(option.label);
      const checked = selected[key].has(index) ? ' checked' : '';
      return `<label class="cl-option">
        <input type="checkbox" class="cl-checkbox" data-ml-choice="${key}" value="${index}" aria-label="${label}"${checked}>
        <span>${label}</span>
      </label>`;
    }).join('');
    container.querySelector(`#ml-filter-${key} .cl-options`).innerHTML = options;
  }

  function fieldTrigger(key) {
    return container.querySelector(`[data-ml-toggle-field="${key}"]`);
  }

  function closeBaseMenu(restoreFocus = false) {
    if (!baseOpen) return;
    const trigger = fieldTrigger(baseOpen);
    trigger.setAttribute('aria-expanded', 'false');
    container.querySelector(`#ml-filter-${baseOpen}`).hidden = true;
    baseOpen = null;
    if (restoreFocus) trigger.focus({preventScroll: true});
  }

  function openBaseMenu(key, keyboard) {
    closePerformanceMenu();
    const previous = baseOpen;
    closeBaseMenu();
    if (previous === key) return;
    baseOpen = key;
    const menu = container.querySelector(`#ml-filter-${key}`);
    renderOptions(key);
    menu.hidden = false;
    menu.querySelector('.ml-base-menu-body').scrollTop = 0;
    fieldTrigger(key).setAttribute('aria-expanded', 'true');
    if (keyboard) menu.querySelector('.cl-checkbox')?.focus({preventScroll: true});
  }

  function chip(text, key, value, summaryChip = false) {
    const label = esc(text);
    const query = key === 'name' || key === 'company' ? ` class="cl-summary-query" title="${label}"` : '';
    const marker = summaryChip ? '' : ` data-cl-chip="${label}"`;
    return `<span class="${summaryChip ? 'cl-summary-value' : 'cl-selected-value'}"${marker}>
      <span${query}>${label}</span><button type="button" class="cl-value-remove" data-ml-remove-field="${key}" data-ml-remove-value="${value}" aria-label="移除${label}"></button>
    </span>`;
  }

  function fieldChips(key, summaryChip = false) {
    const {options, unit} = fields[key];
    const picked = [...selected[key]].sort((a, b) => a - b);
    const chips = picked.map(index => chip(options[index].label, key, index, summaryChip));
    const bounds = customRanges.get(key);
    if (bounds) chips.push(chip(customRangeLabel(bounds, unit), key, 'custom', summaryChip));
    return chips;
  }

  function renderBaseValue(key) {
    const chips = fieldChips(key);
    const control = fieldTrigger(key).closest('.cl-control');
    control.querySelector('.cl-trigger-value').innerHTML = chips.length
      ? chips.join('') + '<span class="cl-selected-value cl-overflow-count" hidden></span>'
      : '<span class="cl-unlimited">不限</span>';
    container.querySelector(`[data-ml-clear-field="${key}"]`).disabled = chips.length === 0;
    fitFilterChips(control);
  }

  function applyCustomRange(form, enabled, focusInvalid = false) {
    const key = form.dataset.clCustomForm;
    const current = customRanges.get(key);
    const bounds = validateCustomRange(form, enabled, current, focusInvalid);
    if (bounds === null || (bounds?.[0] === current?.[0] && bounds?.[1] === current?.[1])) return;
    if (bounds) customRanges.set(key, bounds);
    else customRanges.delete(key);
    renderBaseValue(key);
    apply();
  }

  function resetCustomForm(form) {
    form.reset();
    form.querySelector('.cl-form-error').textContent = '';
  }

  function clearBaseField(key) {
    selected[key].clear();
    customRanges.delete(key);
    const form = container.querySelector(`[data-cl-custom-form="${key}"]`);
    if (form) resetCustomForm(form);
    renderBaseValue(key);
    renderOptions(key);
    const body = container.querySelector(`#ml-filter-${key} .ml-base-menu-body`);
    body.scrollTop = 0;
    body.querySelector('.cl-checkbox')?.focus({preventScroll: true});
    apply();
  }

  function completePairs() {
    return groups.flatMap(group => {
      const {metric, pairs} = selections[scope][group.key];
      return pairs.filter(activePair).map(pair => ({...pair, group: group.key, metric, label: group.metrics[metric]}));
    });
  }

  function valueConfig(metric, period) {
    const types = [...selected.type].map(index => fields.type.options[index].label);
    return performanceValueConfig(metric, period, types);
  }

  function renderSummary() {
    const {name, company} = queries;
    const fieldsSelected = controls.map(([label, keys]) => {
      const values = keys.flatMap(key => {
        if (key === 'company') return company ? [chip(company, key, 0, true)] : [];
        return fieldChips(key, true);
      });
      return values.length ? `<div class="cl-summary-chip"><span class="cl-summary-label">${label}</span>${values.join('')}</div>` : '';
    }).join('');
    const conditions = completePairs();
    const performanceSummary = groups.map(({key}) => {
      const pairs = conditions.filter(pair => pair.group === key)
        .sort((first, second) => periodOrder.indexOf(first.period) - periodOrder.indexOf(second.period));
      if (!pairs.length) return '';
      return `<div class="cl-summary-chip ml-rank-summary"><span class="cl-summary-label">${scopes[scope]}｜${pairs[0].label}</span>
        ${pairs.map(({id, label, metric, period, rank, threshold}) => {
          const values = [periods[period]];
          if (rank) values.push(rankLabel(rank));
          if (threshold) values.push(thresholdLabel(threshold, valueConfig(metric, period).unit));
          return `<span class="cl-summary-value"><span>${values.join('｜')}</span>
            <button type="button" class="cl-value-remove" data-ml-remove-pair="${id}" data-ml-group="${key}" aria-label="移除${periods[period]}${label}条件"></button></span>`;
        }).join('')}</div>`;
    }).join('');
    const count = Number(Boolean(name)) + Number(Boolean(company)) + customRanges.size +
      Object.values(selected).reduce((total, values) => total + values.size, 0) + conditions.length;
    summary.hidden = count === 0;
    summary.innerHTML = count ? `<span class="cl-summary-count">已选 <strong>(${count})</strong></span>
      <div class="cl-summary-tags">${name ? `<div class="cl-summary-chip"><span class="cl-summary-label">基金经理姓名</span>${chip(name, 'name', 0, true)}</div>` : ''}${fieldsSelected}${performanceSummary}</div>
      <button type="button" class="cl-clear" data-ml-clear-filters aria-label="清空筛选"></button>` : '';
  }

  function apply() {
    renderSummary();
    const {name, company} = queries;
    const activeScope = scope;
    const conditions = completePairs();
    const filters = Object.entries(fields).flatMap(([key, field]) => {
      const bounds = customRanges.get(key);
      if (!bounds && !selected[key].size) return [];
      return [{value: field.value, options: [...selected[key]].map(index => field.options[index]), bounds}];
    });
    onChange(manager => {
      if (name && !companyMatchesQuery({name: manager.name, shortName: manager.name}, name)) return false;
      if (company) {
        const employer = companyById.get(manager.companyId);
        if (!employer || !companyMatchesQuery(employer, company)) return false;
      }
      if (!filters.every(({value, options, bounds}) => {
        const metric = value(manager);
        if (bounds && finite(metric)) {
          const [min, max] = bounds;
          if ((min === null || metric >= min) && (max === null || metric <= max)) return true;
        }
        return options.some(option => option.matches(metric));
      })) return false;
      return conditions.every(({metric, period, rank, threshold}) =>
        (!rank || matchesBounds(manager.performance?.[activeScope]?.[metric]?.[period], rank)) &&
        (!threshold || matchesBounds(manager.performanceValues?.[activeScope]?.[metric]?.[period], threshold))
      );
    }, name);
  }

  function renderPerformanceRange(group, kind, pair, id, label, unit, custom) {
    const errorId = `ml-error-${id}`;
    const isRank = kind === 'rank';
    const inputBounds = isRank ? ' min="0" max="100"' : group.key === 'risk' ? ' min="0"' : '';
    const [minimumLabel, maximumLabel] = isRank ? ['起始', '结束'] : ['最低', '最高'];
    const formLabel = isRank ? '自定义排名区间' : '自定义区间';
    const bound = (name, hint, value) => `<label class="ml-threshold-bound">
      <input type="number" step="any"${inputBounds} name="${name}" placeholder="${hint}"
        aria-label="${hint}${label}${unit ? `（${unit}）` : ''}" aria-describedby="${errorId}" value="${esc(value ?? '')}">
      ${unit ? `<span aria-hidden="true">${unit}</span>` : ''}</label>`;
    return `<form class="ml-threshold-form" data-ml-range-form="${kind}" data-ml-group="${group.key}" data-ml-pair="${pair.id}" novalidate>
      <div class="ml-threshold-custom-row" role="group" aria-label="${formLabel}${custom ? '（已选）' : ''}"${custom ? ' data-ml-custom-selected tabindex="-1"' : ''}>
        <div class="ml-threshold-range">
          ${bound('minimum', minimumLabel, custom?.min)}<span class="ml-threshold-dash" aria-hidden="true">–</span>${bound('maximum', maximumLabel, custom?.max)}
        </div>
        ${custom ? checkImage : ''}
      </div>
      <div class="ml-threshold-error" id="${errorId}" role="alert"></div>
      <div class="ml-threshold-actions" hidden><button type="button" data-ml-cancel-range>取消</button><button type="submit">确定</button></div>
    </form>`;
  }

  function dropdown(group, kind, pair, label, choices, value, config) {
    const id = `${group.key}-${kind}${pair ? `-${pair.id}` : ''}`;
    const expanded = performanceOpen === id;
    const selectedValue = config ? value?.custom ? null : value?.label ?? '' : value;
    const custom = config && value && !choices.some(([choice]) => choice === selectedValue) ? value : null;
    const list = expanded ? `<div class="cl-menu ml-single-menu${config ? ' ml-threshold-menu' : ''}" id="ml-menu-${id}">
      <div class="cl-options" role="listbox" aria-label="${label}选项">${choices.map(([choice, text]) => {
        const checked = choice === selectedValue;
        return `<button type="button" class="cl-option" role="option" aria-selected="${checked}" data-ml-perf-choice="${esc(choice)}"
          data-ml-group="${group.key}" data-ml-kind="${kind}" ${pair ? `data-ml-pair="${pair.id}"` : ''}>
          <span>${esc(text)}</span>${checked ? checkImage : ''}</button>`;
      }).join('')}</div>
      ${config ? renderPerformanceRange(group, kind, pair, id, label, config.unit, custom) : ''}
    </div>` : '';
    const selectedLabel = !value ? '' : kind === 'rank' ? rankLabel(value)
      : config ? thresholdLabel(value, config.unit) : choices.find(([choice]) => choice === value)?.[1];
    const title = selectedLabel || label;
    const disabled = config && !pair.period;
    const accessibleTitle = kind === 'metric' || (kind === 'threshold' && value) ? `${label} ${title}`
      : config && !value ? `${label}（不限）` : title;
    return `<div class="ml-perf-select ml-perf-${kind}" data-ml-dropdown>
      <button type="button" class="ml-perf-trigger" id="ml-trigger-${id}" data-ml-menu="${id}" aria-label="${esc(accessibleTitle)}"${config ? '' : ' aria-haspopup="listbox"'} aria-expanded="${expanded}"${expanded ? ` aria-controls="ml-menu-${id}"` : ''}${disabled ? ' disabled' : ''}>
        ${kind === 'metric' ? `<span class="ml-perf-placeholder">${label}</span>` : ''}
        <span class="${value ? 'ml-perf-value' : 'ml-perf-placeholder'}"${value ? ` title="${esc(title)}"` : ''}>${esc(title)}</span><span class="cl-chevron" aria-hidden="true"></span>
      </button>${list}
    </div>`;
  }

  function renderPerformance() {
    performance.innerHTML = `
      <div class="cl-scale-modes ml-filter-modes" role="group" aria-label="业绩筛选对象">
        ${Object.entries(scopes).map(([key, label]) => `<button type="button" data-ml-scope="${key}" aria-pressed="${scope === key}">${label}</button>`).join('')}
      </div>
      <div class="ml-metric-rows">${groups.map(group => {
        const {metric, pairs} = selections[scope][group.key];
        return `<div class="ml-metric-row">
          ${dropdown(group, 'metric', null, group.label, Object.entries(group.metrics), metric)}
          <div class="ml-perf-pairs">${pairs.map(pair => {
            const availablePeriods = Object.entries(periods).filter(([period]) =>
              !pairs.some(other => other !== pair && other.period === period));
            const config = valueConfig(metric, pair.period);
            return `<div class="ml-perf-pair"${pair.rank?.custom && pair.rank.min !== null ? ' data-ml-custom-rank' : ''}>
              <div class="ml-perf-segments">
                ${dropdown(group, 'period', pair, '时段', availablePeriods, pair.period)}
                ${dropdown(group, 'rank', pair, ranking.label, rangeChoices(ranking), pair.rank, ranking)}
                ${dropdown(group, 'threshold', pair, config.label, rangeChoices(config), pair.threshold, config)}
              </div>
              <button type="button" class="cl-value-remove" data-ml-remove-pair="${pair.id}" data-ml-group="${group.key}" aria-label="移除此组时段条件"></button>
            </div>`;
          }).join('')}
          ${pairs.length < periodOrder.length ? `<button type="button" class="ml-add-pair" data-ml-add-pair="${group.key}" data-ml-dropdown>添加时段条件</button>` : ''}</div>
        </div>`;
      }).join('')}</div>`;
  }

  function focusMenu(id) {
    const menu = container.querySelector(`#ml-menu-${id}`);
    (menu?.querySelector('[aria-selected="true"], [data-ml-custom-selected]') || menu?.querySelector('[role="option"]'))?.focus({preventScroll: true});
  }

  function openPerformanceMenu(id) {
    closeBaseMenu();
    const wasOpen = performanceOpen === id;
    performanceOpen = wasOpen ? null : id;
    renderPerformance();
    if (performanceOpen) focusMenu(id);
    else container.querySelector(`#ml-trigger-${id}`)?.focus({preventScroll: true});
  }

  function closePerformanceMenu(restoreFocus = false) {
    if (!performanceOpen) return;
    const id = performanceOpen;
    performanceOpen = null;
    renderPerformance();
    if (restoreFocus) container.querySelector(`#ml-trigger-${id}`)?.focus({preventScroll: true});
  }

  function choosePerformance(option) {
    const {mlPerfChoice: choice, mlGroup: group, mlKind: kind, mlPair} = option.dataset;
    const data = selections[scope][group];
    const pair = data.pairs.find(item => String(item.id) === mlPair);
    const wasActive = kind === 'metric' ? data.pairs.some(activePair) : activePair(pair);
    if (kind === 'metric' && data.metric !== choice) {
      data.metric = choice;
      data.pairs.forEach(item => { item.threshold = null; });
    } else if (kind === 'period') {
      pair.period = choice;
    } else if (kind === 'rank' || kind === 'threshold') {
      const {presets} = kind === 'rank' ? ranking : valueConfig(data.metric, pair.period);
      pair[kind] = presets.find(preset => preset.label === choice) ?? null;
    }
    closePerformanceMenu(true);
    if (wasActive || (pair && activePair(pair))) apply();
  }

  function choosePerformanceRange(form) {
    const {minimum, maximum} = form.elements;
    const {mlGroup, mlPair, mlRangeForm: kind} = form.dataset;
    const isRank = kind === 'rank';
    const min = minimum.value === '' ? null : minimum.valueAsNumber;
    const max = maximum.value === '' ? null : maximum.valueAsNumber;
    const error = form.querySelector('.ml-threshold-error');
    if (!minimum.validity.valid || !maximum.validity.valid) {
      const invalid = minimum.validity.valid ? maximum : minimum;
      if (isRank && (invalid.validity.rangeUnderflow || invalid.validity.rangeOverflow)) {
        error.textContent = '排名百分比须在 0%～100% 之间';
      } else {
        error.textContent = invalid.validity.rangeUnderflow ? '风险指标的数值须大于或等于 0' : '请输入有效数值';
      }
      invalid.focus();
      return;
    }
    if (min === null && max === null || min !== null && max !== null && min > max) {
      error.textContent = min === null && max === null ? '请至少填写一个值'
        : isRank ? '起始百分比不能大于结束百分比' : '最低值不能大于最高值';
      minimum.focus();
      return;
    }
    const pair = selections[scope][mlGroup].pairs.find(item => String(item.id) === mlPair);
    pair[kind] = {min, max, custom: true};
    closePerformanceMenu(true);
    apply();
  }

  function addPair(group) {
    const pair = {id: ++pairId, period: '', rank: null, threshold: null};
    selections[scope][group].pairs.push(pair);
    openPerformanceMenu(`${group}-period-${pair.id}`);
  }

  function removePair(group, id, fromSummary) {
    const data = selections[scope][group];
    const removed = data.pairs.find(pair => String(pair.id) === id);
    data.pairs = data.pairs.filter(pair => pair !== removed);
    performanceOpen = null;
    renderPerformance();
    if (removed && activePair(removed)) apply();
    const add = performance.querySelector(`[data-ml-add-pair="${group}"]`);
    (fromSummary ? summary.querySelector('button') || toggle : add)?.focus({preventScroll: true});
  }

  function clearFields() {
    for (const [key, input] of Object.entries(searchInputs)) {
      queries[key] = '';
      input.value = '';
    }
    customRanges.clear();
    container.querySelectorAll('[data-cl-custom-form]').forEach(resetCustomForm);
    for (const [key, values] of Object.entries(selected)) {
      values.clear();
      renderBaseValue(key);
      if (baseOpen === key) renderOptions(key);
    }
    selections.representative = makeScope();
    selections.index = makeScope();
    performanceOpen = null;
    renderPerformance();
    apply();
    searchInputs.name.focus({preventScroll: true});
  }

  function syncQuery(key) {
    const next = searchInputs[key].value.trim();
    if (next === queries[key]) return;
    queries[key] = next;
    apply();
  }

  for (const [key, input] of Object.entries(searchInputs)) {
    input.addEventListener('input', event => { if (!event.isComposing) syncQuery(key); }, {signal});
    input.addEventListener('compositionend', () => syncQuery(key), {signal});
  }

  toggle.addEventListener('click', () => {
    const expanded = performance.hidden;
    closeBaseMenu();
    closePerformanceMenu();
    performance.hidden = !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? '收起筛选' : '更多筛选');
  }, {signal});

  container.addEventListener('change', event => {
    const input = event.target;
    const form = input.form;
    if (form?.dataset.clCustomForm && input === form.elements.useCustom) {
      applyCustomRange(form, input.checked, true);
      return;
    }
    const key = input.dataset.mlChoice;
    if (!key) return;
    if (input.checked) selected[key].add(Number(input.value));
    else selected[key].delete(Number(input.value));
    renderBaseValue(key);
    apply();
  }, {signal});

  container.addEventListener('input', event => {
    const input = event.target;
    const form = input.form;
    if (form?.dataset.mlRangeForm) {
      form.querySelector('.ml-threshold-error').textContent = '';
      return;
    }
    if (input.type !== 'number' || !form?.dataset.clCustomForm) return;
    if (form.elements.useCustom.checked) applyCustomRange(form, true);
    else form.querySelector('.cl-form-error').textContent = '';
  }, {signal});

  container.addEventListener('focusin', event => {
    const form = event.target.form;
    if (event.target.matches('input') && form?.dataset.mlRangeForm) {
      form.querySelector('.ml-threshold-actions').hidden = false;
    }
  }, {signal});

  container.addEventListener('submit', event => {
    const form = event.target;
    const isPerformanceRange = form.dataset.mlRangeForm;
    if (!isPerformanceRange && !form.dataset.clCustomForm) return;
    event.preventDefault();
    if (isPerformanceRange) choosePerformanceRange(form);
    else applyCustomRange(form, true, true);
  }, {signal});

  container.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button === toggle) return;
    const data = button.dataset;
    const queryKey = data.mlClearQuery || data.mlRemoveField;
    if (data.mlToggleField) openBaseMenu(data.mlToggleField, event.detail === 0);
    else if (data.mlClearField) clearBaseField(data.mlClearField);
    else if (data.mlMenu) openPerformanceMenu(data.mlMenu);
    else if ('mlPerfChoice' in data) choosePerformance(button);
    else if ('mlCancelRange' in data) closePerformanceMenu(true);
    else if (data.mlAddPair) addPair(data.mlAddPair);
    else if (data.mlRemovePair) removePair(data.mlGroup, data.mlRemovePair, summary.contains(button));
    else if (data.mlScope && data.mlScope !== scope) {
      scope = data.mlScope;
      performanceOpen = null;
      renderPerformance();
      performance.querySelector(`[data-ml-scope="${scope}"]`).focus({preventScroll: true});
      apply();
    } else if (queryKey === 'name' || queryKey === 'company') {
      const input = searchInputs[queryKey];
      input.value = '';
      syncQuery(queryKey);
      input.focus({preventScroll: true});
    } else if (data.mlRemoveField) {
      const key = data.mlRemoveField;
      if (data.mlRemoveValue === 'custom') {
        customRanges.delete(key);
        resetCustomForm(container.querySelector(`[data-cl-custom-form="${key}"]`));
      } else {
        selected[key].delete(Number(data.mlRemoveValue));
      }
      renderBaseValue(key);
      if (baseOpen === key) renderOptions(key);
      apply();
      fieldTrigger(key).focus({preventScroll: true});
    } else if ('mlClearFilters' in data) clearFields();
  }, {signal});

  container.addEventListener('keydown', event => {
    if (event.key === 'Escape' && (baseOpen || performanceOpen)) {
      event.preventDefault();
      closeBaseMenu(true);
      closePerformanceMenu(true);
    } else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) && event.target.matches('[role="option"]')) {
      event.preventDefault();
      const options = [...event.target.closest('[role="listbox"]').querySelectorAll('[role="option"]')];
      const current = options.indexOf(event.target);
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[target].focus();
    }
  }, {signal});

  document.addEventListener('click', event => {
    const path = event.composedPath();
    if (path.includes(container) && path.some(node => node instanceof Element && node.hasAttribute('data-ml-dropdown'))) return;
    closeBaseMenu();
    closePerformanceMenu();
  }, {signal});

  const baseControls = [...container.querySelectorAll('.ml-base-controls .cl-control')];
  const fitBaseControls = () => baseControls.forEach(fitFilterChips);
  const resize = new ResizeObserver(fitBaseControls);
  baseControls.forEach(control => resize.observe(control));
  document.fonts.addEventListener('loadingdone', fitBaseControls, {signal});
  signal.addEventListener('abort', () => resize.disconnect(), {once: true});
  renderPerformance();
}
