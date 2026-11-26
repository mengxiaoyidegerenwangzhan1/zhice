(function installPeriodCondition() {
  const host = document.querySelector('#visual-panel-components .select-control-demo');
  if (!host) return;

  const name = '时段条件';
  const stylesheet = 'period-condition.css?v=20261126-period-condition';
  const sample = document.createElement('div');
  sample.className = 'individual-component-sample';
  const widget = document.createElement('div');
  widget.className = 'period-condition';
  sample.append(widget);
  host.append(sample);

  function mountPeriodCondition(widget, {
    metric = 'return', types = [], pairs = [{id: 1, period: '3m', rank: null, threshold: null}],
    open = 'rank-1', catalog = false,
  } = {}) {
    const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
    const periods = {'3m': '近3个月', '6m': '近6个月', '1y': '近1年', '3y': '近3年', '5y': '近5年'};
    const ranking = {
      label: '排名', unit: '%',
      presets: [20, 40, 60, 80].map(max => ({label: `前${max}%`, min: null, max})),
    };
    const choiceList = config => [['', '不限'], ...config.presets.map(({label}) => [label, label])];
    const valueConfig = period => performanceValueConfig(metric, period, types);
    const rankLabel = ({min, max}) => min === null ? `排名前${max}%` : max === null ? `排名≥${min}%` : `排名${min}～${max}%`;
    const format = number => String(number).replace(/^-/, '−');
    const thresholdLabel = ({min, max}, unit) => min === null ? `≤${format(max)}${unit}`
      : max === null ? `≥${format(min)}${unit}` : `${format(min)}${unit}～${format(max)}${unit}`;
    const checkImage = '<img src="assets/period-condition/check.svg" width="12" height="12" alt="">';
    const downIcon = 'assets/period-condition/dropdown-chevron.svg';
    const upIcon = 'assets/period-condition/filter-chevron-up.png';
    const removeIcon = '<svg class="ml-period-remove-icon" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8m0-8-8 8" fill="none" stroke="currentColor" stroke-linecap="round"/></svg>';
    const addIcon = '<svg class="ml-period-add-icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.32 7h11.36M7 1.32v11.36" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
    let nextId = Math.max(0, ...pairs.map(pair => pair.id));
    const rows = document.createElement('div');
    rows.className = 'ml-perf-pairs';
    widget.replaceChildren(rows);

    const activeMenu = () => open && rows.querySelector(`#period-menu-${open}`);
    const trigger = id => rows.querySelector(`#period-trigger-${id}`);
    const resize = catalog ? new ResizeObserver(() => {
      const menu = activeMenu();
      const clearance = menu ? Math.max(0, menu.getBoundingClientRect().bottom - rows.getBoundingClientRect().bottom) : 0;
      widget.style.setProperty('--period-menu-clearance', `${clearance}px`);
    }) : null;

    function renderRange(kind, id, label, unit, custom) {
      const errorId = `period-error-${id}`;
      const isRank = kind === 'rank';
      const inputBounds = isRank ? ' min="0" max="100"'
        : ['maxDrawdown', 'volatility', 'downsideRisk'].includes(metric) ? ' min="0"' : '';
      const [minimumLabel, maximumLabel] = isRank ? ['起始', '结束'] : ['最低', '最高'];
      const formLabel = isRank ? '自定义排名区间' : '自定义区间';
      const bound = (name, hint, value) => `<label class="ml-threshold-bound">
        <input type="number" step="any"${inputBounds} name="${name}" placeholder="${hint}"
          aria-label="${hint}${label}${unit ? `（${unit}）` : ''}" aria-describedby="${errorId}" value="${escape(value ?? '')}">
        ${unit ? `<span aria-hidden="true">${unit}</span>` : ''}</label>`;
      return `<form class="ml-threshold-form" data-period-range="${kind}" novalidate>
        <div class="ml-threshold-custom-row" role="group" aria-label="${formLabel}${custom ? '（已选）' : ''}"${custom ? ' data-ml-custom-selected tabindex="-1"' : ''}>
          <div class="ml-threshold-range">
            ${bound('minimum', minimumLabel, custom?.min)}<span class="ml-threshold-dash" aria-hidden="true">–</span>${bound('maximum', maximumLabel, custom?.max)}
          </div>
          ${custom ? checkImage : ''}
        </div>
        <div class="ml-threshold-error" id="${errorId}" role="alert"></div>
        <div class="ml-threshold-actions" hidden><button type="button" data-period-cancel>取消</button><button type="submit">确定</button></div>
      </form>`;
    }

    function dropdown(kind, pair, label, choices, config) {
      const id = `${kind}-${pair.id}`;
      const expanded = open === id;
      const value = pair[kind];
      const selectedValue = config ? value?.custom ? null : value?.label ?? '' : value;
      const custom = config && value && !choices.some(([choice]) => choice === selectedValue) ? value : null;
      const list = expanded ? `<div class="cl-menu ml-single-menu${config ? ' ml-threshold-menu' : ''}" id="period-menu-${id}">
        <div class="cl-options" role="listbox" aria-label="${label}选项">${choices.map(([choice, text]) => {
          const checked = choice === selectedValue;
          return `<button type="button" class="cl-option" role="option" aria-selected="${checked}" data-period-choice="${escape(choice)}">
            <span>${escape(text)}</span>${checked ? checkImage : ''}</button>`;
        }).join('')}</div>
        ${config ? renderRange(kind, id, label, config.unit, custom) : ''}
      </div>` : '';
      const selectedLabel = !value ? '' : kind === 'rank' ? rankLabel(value)
        : config ? thresholdLabel(value, config.unit) : periods[value];
      const title = selectedLabel || label;
      const accessibleTitle = kind === 'threshold' && value ? `${label} ${title}`
        : config && !value ? `${label}（不限）` : title;
      return `<div class="ml-perf-select ml-perf-${kind}" data-period-kind="${kind}" data-period-dropdown>
        <button type="button" class="ml-perf-trigger" id="period-trigger-${id}" data-period-menu="${id}" aria-label="${escape(accessibleTitle)}"${config ? '' : ' aria-haspopup="listbox"'} aria-expanded="${expanded}"${expanded ? ` aria-controls="period-menu-${id}"` : ''}${config && !pair.period ? ' disabled' : ''}>
          ${config ? '<span class="ml-period-divider" aria-hidden="true"></span>' : ''}
          <span class="${value ? 'ml-perf-value' : 'ml-perf-placeholder'}"${value ? ` title="${escape(title)}"` : ''}>${escape(title)}</span><img class="cl-chevron" src="${expanded ? upIcon : downIcon}" width="12" height="12" alt="">
        </button>${list}
      </div>`;
    }

    function render() {
      resize?.disconnect();
      rows.innerHTML = pairs.map(pair => {
        const choices = Object.entries(periods).filter(([period]) => !pairs.some(other => other !== pair && other.period === period));
        const config = valueConfig(pair.period);
        return `<div class="ml-perf-pair" data-period-id="${pair.id}"${pair.rank?.custom && pair.rank.min !== null ? ' data-ml-custom-rank' : ''}>
          <div class="ml-perf-segments">
            ${dropdown('period', pair, '时段', choices)}
            ${dropdown('rank', pair, ranking.label, choiceList(ranking), ranking)}
            ${dropdown('threshold', pair, config.label, choiceList(config), config)}
          </div>
          <button type="button" class="cl-value-remove" data-period-remove aria-label="移除此组时段条件">${removeIcon}</button>
        </div>`;
      }).join('') + (pairs.length < Object.keys(periods).length ?
        `<button type="button" class="ml-add-pair" data-period-add data-period-dropdown>${addIcon}添加时段条件</button>` : '');
      if (!resize) return;
      const menu = activeMenu();
      if (menu) {
        resize.observe(rows);
        resize.observe(menu);
      } else widget.style.removeProperty('--period-menu-clearance');
    }

    function setMenu(id, restoreFocus = false) {
      const previous = open;
      open = id === open ? null : id;
      render();
      if (open) {
        const menu = activeMenu();
        (menu.querySelector('[aria-selected="true"], [data-ml-custom-selected]') || menu.querySelector('[role="option"]'))?.focus({preventScroll: true});
      } else if (restoreFocus) trigger(previous)?.focus({preventScroll: true});
    }

    function findPair(element) {
      return pairs.find(pair => pair.id === Number(element.closest('[data-period-id]').dataset.periodId));
    }

    function chooseRange(form) {
      const {minimum, maximum} = form.elements;
      const kind = form.dataset.periodRange;
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
      findPair(form)[kind] = {min, max, custom: true};
      setMenu(null, true);
    }

    widget.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      const data = button.dataset;
      if (data.periodMenu) setMenu(data.periodMenu, true);
      else if ('periodChoice' in data) {
        const pair = findPair(button);
        const {periodKind: kind} = button.closest('[data-period-kind]').dataset;
        const choice = data.periodChoice;
        pair[kind] = kind === 'period' ? choice : (kind === 'rank' ? ranking : valueConfig(pair.period)).presets.find(({label}) => label === choice) ?? null;
        setMenu(null, true);
      } else if ('periodCancel' in data) setMenu(null, true);
      else if ('periodAdd' in data) {
        const id = ++nextId;
        pairs.push({id, period: '', rank: null, threshold: null});
        setMenu(`period-${id}`);
      } else if ('periodRemove' in data) {
        const removed = findPair(button);
        pairs = pairs.filter(pair => pair !== removed);
        setMenu(null);
        rows.querySelector('[data-period-add]')?.focus({preventScroll: true});
      }
    });
    widget.addEventListener('input', event => {
      const form = event.target.form;
      if (form?.dataset.periodRange) form.querySelector('.ml-threshold-error').textContent = '';
    });
    widget.addEventListener('focusin', event => {
      const form = event.target.form;
      if (event.target.matches('input') && form?.dataset.periodRange) form.querySelector('.ml-threshold-actions').hidden = false;
    });
    widget.addEventListener('submit', event => {
      if (!event.target.dataset.periodRange) return;
      event.preventDefault();
      chooseRange(event.target);
    });
    widget.addEventListener('keydown', event => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setMenu(null, true);
      } else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) && event.target.matches('[role="option"]')) {
        event.preventDefault();
        const options = [...event.target.closest('[role="listbox"]').querySelectorAll('[role="option"]')];
        const current = options.indexOf(event.target);
        const target = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
          : (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[target].focus();
      }
    });
    document.addEventListener('click', event => {
      if (!open || event.target.closest('#visual-tab-components') || !widget.getClientRects().length) return;
      const path = event.composedPath();
      if (!(path.includes(widget) && path.some(node => node instanceof Element && node.hasAttribute('data-period-dropdown')))) setMenu(null);
    });
    render();
    return () => ({metric, types, pairs, open});
  }

  function createPerformanceValueConfig() {
    const percent = '%';

    // Thresholds are ordered by manager type: general, equity, bond.
    const returnThresholds = {
      short: [[0, 1, 5, 10], [0, 3, 5, 10], [0, .5, 1, 2]],
      year: [[0, 3, 10, 20], [0, 5, 10, 20], [0, 1, 3, 5]],
      long: [[0, 5, 20, 40], [0, 10, 30, 50], [0, 3, 10, 20]],
    };
    const drawdownThresholds = {
      short: [[1, 5, 10, 20], [5, 10, 15, 20], [.5, 1, 3, 5]],
      long: [[3, 10, 20, 40], [10, 20, 30, 40], [1, 3, 5, 10]],
    };
    const ratioThresholds = [0, .5, 1, 2];

    const shortPeriod = period => period === '3m' || period === '6m';
    const returnPeriod = period => shortPeriod(period) ? 'short' : period === '1y' ? 'year' : 'long';
    const drawdownPeriod = period => shortPeriod(period) ? 'short' : 'long';

    const configurations = {
      return: {label: '收益率', unit: percent, thresholds: period => returnThresholds[returnPeriod(period)]},
      cagr: {label: '收益率', unit: percent, thresholds: () => returnThresholds.year},
      excessCagr: {label: '收益率', unit: percent, thresholds: () => [[0, 1, 3, 5], [0, 2, 5, 10], [0, .5, 1, 2]]},
      maxDrawdown: {label: '最大回撤率', unit: percent, upperBound: true, thresholds: period => drawdownThresholds[drawdownPeriod(period)]},
      volatility: {label: '年化波动率', unit: percent, upperBound: true, thresholds: () => [[3, 10, 20, 30], [10, 15, 20, 30], [1, 3, 5, 10]]},
      downsideRisk: {label: '下行风险', unit: percent, upperBound: true, thresholds: () => [[3, 5, 10, 20], [5, 10, 15, 20], [1, 2, 3, 5]]},
      sharpe: {label: '夏普比率', unit: '', fixed: ratioThresholds},
      informationRatio: {label: '信息比率', unit: '', fixed: [0, .25, .5, 1]},
      calmar: {label: '收益回撤比', unit: '', fixed: ratioThresholds},
      sortino: {label: '索提诺比率', unit: '', fixed: ratioThresholds},
      treynor: {label: '特雷诺比率', unit: percent, fixed: [0, 3, 5, 10]},
    };

    return function performanceValueConfig(metric, period, types) {
      const {label, unit, upperBound, thresholds, fixed} = configurations[metric];
      let typeIndex = 0;
      if (types.length === 1) {
        if (types[0] === '偏股型') typeIndex = 1;
        if (types[0] === '偏债型') typeIndex = 2;
      }
      const values = fixed ?? thresholds(period)[typeIndex];
      return {
        label,
        unit,
        presets: values.map(value => ({
          label: `${upperBound ? '≤' : '≥'}${value}${unit}`,
          min: upperBound ? null : value,
          max: upperBound ? value : null,
        })),
      };
    };
  }

  const performanceValueConfig = createPerformanceValueConfig();
  const getState = mountPeriodCondition(widget, {catalog: true});
  const spec = `<dl class="component-rule-list">
    <div><dt>选框</dt><dd>336 × 32px，圆角 20px。按可用宽度收缩或换行</dd></div>
    <div><dt>下拉菜单</dt><dd>距整组选框底边 8px，圆角 8px，选项行高 32px。时段贴左（92px），排名居中、指标值贴右（均为 220px）</dd></div>
    <div><dt>选择时段</dt><dd>可选近3个月、近6个月、近1年、近3年、近5年。同一指标下每个时段只能添加一次</dd></div>
    <div><dt>排名与指标值</dt><dd>选好时段后可分别打开，均为单选。可只填一项，也可同时设置。选择「不限」后恢复占位样式</dd></div>
    <div><dt>自定义</dt><dd>输入一端或两端，按 Enter 或点「确定」。排名使用 0%～100% 的百分比区间，指标值沿用对应指标的单位与档位</dd></div>
    <div><dt>示例状态</dt><dd>区间收益率，已选「近3个月」，展开排名菜单</dd></div>
  </dl>`;

  async function exportCode() {
    const response = await fetch(stylesheet);
    if (!response.ok) throw new Error('组件样式读取失败');
    const css = await response.text();
    let script = `const performanceValueConfig = (${createPerformanceValueConfig.toString()})();\n(${mountPeriodCondition.toString()})(document.querySelector('.period-condition'), ${JSON.stringify(getState())});`;
    const assets = new Set(script.match(/assets\/period-condition\/[\w-]+\.(?:svg|png)/g));
    const embedded = await Promise.all([...assets].map(async path => {
      const image = await fetch(path);
      if (!image.ok) throw new Error('组件素材读取失败');
      const bytes = new Uint8Array(await image.arrayBuffer());
      const mime = path.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
      return [path, `data:${mime};base64,${btoa(String.fromCharCode(...bytes))}`];
    }));
    for (const [path, data] of embedded) script = script.replaceAll(path, data);
    return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title>
<style>body{margin:24px;background:#fff}${css}</style></head><body>
<div class="period-condition"></div>
<script>${script}</script></body></html>`;
  }

  addIndividualActions(sample, name, spec, undefined, {
    exportCode,
    exportSvg: () => svgFor(widget.querySelector('.ml-perf-pair:has(.ml-single-menu)') || widget.querySelector('.ml-perf-pair, .ml-add-pair')),
  });
  sample.closest('.individual-component').id = 'component-period-condition';
  styleComponentActions();
})();
