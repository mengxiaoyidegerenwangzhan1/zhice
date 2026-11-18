(() => {
  const selections = {
    '共同时段': 'common',
    '共同任期': 'common',
    '近1月': 'month',
    '近3月': 'three-months',
    '近6月': 'six-months',
    '近1年': 'year',
    '近3年': 'three-years',
    '近5年': 'five-years',
    '今年以来': 'year-to-date',
  };
  const labels = Object.fromEntries(Object.entries(selections).map(([label, key]) => [key, label]));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );
  const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

  function managerRanges(tenures, minimum, maximum) {
    const entries = new Map();
    tenures.forEach(({ name, start, end }) => {
      const last = end === null ? maximum : end;
      if (!name || !validDate(start) || !validDate(last) || start > last || start > maximum || last < minimum) return;
      const key = `${name}:${start}:${last}`;
      entries.set(key, { key, name, start, end: last, endLabel: end === null ? '至今' : end });
    });
    return [...entries.values()];
  }

  function markup(scope, range, { showDate = true } = {}) {
    const commonLabel = range.commonLabel || '共同时段';
    const selected = range.timeSelection ?? selections[range.period] ??
      (/^\d{4}年度$/.test(range.period) ? `annual-${range.period.slice(0, 4)}` : '');
    const shortcutBar = ['common', 'year', 'three-years'];
    const selectedLabel = selected === 'common' ? commonLabel : range.period;
    const moreLabel = selected && !shortcutBar.includes(selected) ? selectedLabel : '更多';
    const defaultPeriod = range.defaultPeriod || '共同时段';
    const defaultShortcut = selections[defaultPeriod] ||
      (/^\d{4}年度$/.test(defaultPeriod) ? `annual-${defaultPeriod.slice(0, 4)}` : 'common');
    return `<div class="zc-analysis-time zc-comparison-time linked-time-widget" data-linked-time data-comparison-time="${escape(scope)}"
      data-lt-state="committed" data-lt-start="${range.timeCleared ? '' : escape(range.start)}" data-lt-end="${range.timeCleared ? '' : escape(range.end)}"
      data-lt-selection="${range.timeCleared ? '' : escape(selected)}" data-lt-label="${range.timeCleared ? '更多' : escape(moreLabel)}"
      data-default-shortcut="${escape(defaultShortcut)}" data-show-date="${showDate}"></div>`;
  }

  function bind(root, getRange, render, { tenures = [] } = {}) {
    const targets = root.querySelectorAll('[data-comparison-time]');
    if (!targets.length) return;
    window.ZhiceLinkedTime.mount(root, widget => {
      const range = getRange(widget.dataset.comparisonTime);
      const commonLabel = range.commonLabel || '共同时段';
      const anchor = range.commonEnd || range.end;
      const [year, month, day] = anchor.split('-').map(Number);
      const oldestDay = Math.min(day, new Date(Date.UTC(year - 5, month, 0)).getUTCDate());
      const oldestShortcut = `${year - 5}-${String(month).padStart(2, '0')}-${String(oldestDay).padStart(2, '0')}`;
      const minimum = [range.start, range.commonStart, oldestShortcut].filter(validDate).sort()[0];
      return {
        end: anchor,
        min: minimum,
        max: anchor,
        inception: '',
        common: { start: range.commonStart, end: anchor },
        commonLabel,
        firstShortcut: { key: 'common', label: commonLabel },
        showDate: widget.dataset.showDate !== 'false',
        managers: managerRanges(tenures, minimum, anchor),
      };
    });
    targets.forEach(widget => {
      widget.addEventListener('timerangechange', ({ detail }) => {
        const { comparisonTime: scope } = widget.dataset;
        const range = getRange(scope);
        range.timeCleared = detail.source === 'clear';
        range.timeSelection = detail.selection || '';
        if (!range.timeCleared) {
          range.start = detail.start;
          range.end = detail.end;
          range.period = detail.source === 'manual' ? '自定义'
            : detail.selection === 'common' ? (range.commonLabel || '共同时段')
            : labels[detail.selection] || detail.label;
        }
        render();
        if (detail.source !== 'shortcut') return;
        const replacement = [...root.querySelectorAll('[data-comparison-time]')].find(item => item.dataset.comparisonTime === scope);
        replacement?.querySelector('.lt-bar > .is-selected')?.focus({ preventScroll: true });
      });
    });
  }

  window.ZhiceComparisonTime = { markup, bind };
})();
