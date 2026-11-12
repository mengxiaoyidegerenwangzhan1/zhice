(() => {
  const sections = ['interval', 'drawdown', 'rolling', 'metrics'];
  const profileIds = ['a', 'b', 'c', 'd'];
  const assets = './assets/manager-risk/';
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);

  function fundsFor(options) {
    return options.funds || options.managers || [];
  }

  function profileFor(fund, index, options) {
    const manager = options.managers?.find(item => item.id === fund.id);
    return profileIds[fund.profileIndex ?? manager?.profileIndex ?? index % profileIds.length];
  }

  function sampleFunds(options, includeHidden = false) {
    return fundsFor(options).map((fund, index) => ({
      ...fund, id: profileFor(fund, index, options), visible: includeHidden || fund.visible,
    }));
  }

  function rangeFor(options, section) {
    const initial = {
      start: section === 'rolling' ? '2025-11-06' : '2025-12-09',
      end: '2026-11-06', unit: '月', disabled: true,
      commonLabel: section === 'rolling' ? '共同任期' : '共同时段',
      period: section === 'rolling' ? '近1年' : '共同时段',
      ...(section === 'metrics' ? { benchmark: '上证综指', frequency: '原始频率' } : {}),
    };
    const range = options.ui?.range?.(`manager-risk-${section}`, initial) || initial;
    if (section === 'rolling') range.commonStart = '2025-12-09';
    return range;
  }

  function sectionOptions(options, section) {
    return { ...options, ...rangeFor(options, section), funds: fundsFor(options) };
  }

  function adaptedUi(options) {
    const scope = key => key.replace(/^risk-/, 'manager-risk-');
    return {
      range: (key, initial) => ({ ...initial, ...rangeFor(options, key.replace(/^risk-/, '')) }),
      setting: (key, ...args) => options.ui?.setting?.(scope(key), ...args) || '',
      timeControls: (key, initial) => options.ui?.timeControls?.(scope(key), {
        ...initial, ...rangeFor(options, key.replace(/^risk-/, '')), disabled: true,
      }) || '',
    };
  }

  function actions(section) {
    const button = (action, title, icon) => `<button type="button" class="zc-manager-risk-action"
      ${action === 'refresh' ? `data-analysis-refresh="manager-risk-${section}"` : `data-analysis-download="${action}"`}
      aria-label="${title}" title="${title}"><img src="${assets}${icon}.svg" width="18" height="18" alt=""></button>`;
    return `<div class="zc-manager-risk-actions">${button('image', '下载图片', 'image-download')}
      ${section === 'metrics' ? button('table', '下载表格', 'table-download') : ''}${button('refresh', '刷新', 'refresh')}</div>`;
  }

  function applyReference(table, options) {
    const funds = fundsFor(options);
    const referenceIndex = funds.findIndex(fund => fund.id === options.referenceId);
    for (const row of table.tBodies[0]?.rows || []) {
      const cells = [...row.cells].slice(1);
      const referenceValue = cells[referenceIndex]?.querySelector('.zc-risk-value')?.textContent;
      cells.forEach((cell, index) => {
        const fund = funds[index];
        cell.classList.toggle('is-reference', index === referenceIndex);
        if (!fund?.visible) {
          cell.replaceChildren();
          return;
        }
        const value = cell.querySelector('.zc-risk-value')?.textContent;
        if (referenceIndex < 0 || index === referenceIndex || !value || /^\d{4}-\d{2}-\d{2}$/.test(value)) return;
        const difference = Math.round((parseFloat(value) - parseFloat(referenceValue)) * 100) / 100;
        if (!Number.isFinite(difference)) return;
        const integer = /^-?\d+$/.test(value) && /^-?\d+$/.test(referenceValue);
        const delta = document.createElement('span');
        delta.className = 'zc-risk-difference';
        delta.textContent = `${difference > 0 ? '+' : ''}${integer ? difference : difference.toFixed(2)}${value.endsWith('%') ? 'pp' : ''}`;
        cell.querySelector('.zc-risk-value-pair').append(delta);
      });
    }
  }

  function benchmarkMenu(section, options) {
    const details = section.querySelector('.zc-risk-setting-benchmark details');
    if (!details) return;
    const current = rangeFor(options, 'metrics').benchmark;
    const groups = [
      ['A股指数', '债券指数', '基金指数', '商品指数', '港股指数'],
      ['规模指数', '行业指数', '风格指数'],
      ['上证规模指数', '深证规模指数', '中证规模指数'],
      ['上证综指', '上证180', '上证50', '上证380', '科创50'],
    ];
    const panel = details.querySelector('.zc-analysis-menu');
    panel.classList.add('zc-manager-benchmark-panel');
    panel.setAttribute('role', 'menu');
    panel.innerHTML = groups.map((items, level) => `<div class="zc-manager-benchmark-level" role="group" aria-label="第${level + 1}级基准分类">
      ${items.map((label, index) => {
        const terminal = level === groups.length - 1;
        const selected = terminal ? current === label : index === 0;
        const attributes = terminal
          ? `data-manager-field="benchmark" data-manager-scope="manager-risk-metrics" data-manager-value="${label}" role="menuitemradio" aria-checked="${selected}"`
          : `data-manager-benchmark-level="${level}" role="menuitem" aria-haspopup="menu" aria-expanded="${selected}"${index ? ' disabled aria-disabled="true" title="暂无可选指数"' : ''}`;
        return `<button type="button" ${attributes} class="${selected ? 'is-selected' : ''}"><span>${label}</span>
          ${terminal ? (selected ? `<img src="${assets}selected.svg" width="12" height="12" alt="">` : '') : '<img src="./assets/compare-controls/more.svg" width="10" height="10" alt="">'}</button>`;
      }).join('')}
    </div>`).join('');
  }

  function render(options) {
    const samples = sampleFunds(options, true);
    const template = document.createElement('template');
    template.innerHTML = window.CompareRiskView.render({
      ...sectionOptions(options, 'interval'), funds: samples, referenceId: null,
      view: 'chart', ui: adaptedUi(options),
      series: window.CompareRiskCharts.data({ ...sectionOptions(options, 'interval'), funds: samples }),
    });
    const view = document.createElement('div');
    view.className = 'zc-risk-view zc-manager-risk-view';
    for (const key of sections) {
      const section = template.content.querySelector(`[data-risk-section="${key}"]`);
      const range = rangeFor(options, key);
      section.dataset.managerRiskSection = key;
      section.querySelector('.zc-risk-actions-main').outerHTML = actions(key);
      if (key === 'interval' || key === 'drawdown') {
        const label = key === 'interval' ? '区间最小起始日期' : '共同起始日期';
        section.querySelector('.zc-risk-heading small').textContent = `${label}：${range.commonStart || '2025-12-09'}　 截止日期：${range.end}`;
      }
      if (key === 'rolling') {
        section.querySelector('h2').textContent = '年化动态波动率';
        section.querySelector('[data-risk-chart]').setAttribute('aria-label', '年化动态波动率');
      }
      section.querySelectorAll('[data-risk-legend]').forEach(legend => {
        [...legend.children].forEach((button, index) => {
          const fund = fundsFor(options)[index];
          button.dataset.riskFund = fund.id;
          button.classList.toggle('is-reference', fund.id === options.referenceId);
          button.classList.toggle('is-hidden', !fund.visible);
          button.disabled = !fund.visible;
          button.setAttribute('aria-pressed', String(fund.visible));
          button.setAttribute('aria-label', `${fund.visible ? '隐藏' : '显示'} ${fund.name}`);
        });
      });
      section.querySelectorAll('.zc-risk-table').forEach(table => applyReference(table, options));
      if (key === 'metrics') benchmarkMenu(section, options);
      view.append(section);
    }
    return view.outerHTML;
  }

  function datasetFor(options, section) {
    const funds = fundsFor(options);
    const data = window.CompareRiskCharts.data({ ...sectionOptions(options, section), funds: sampleFunds(options) });
    const dataset = data[section];
    const allSeries = dataset.allSeries.map((series, index) => ({ ...series, id: funds[index].id }));
    return { ...dataset, allSeries, series: allSeries.filter((series, index) => funds[index].visible) };
  }

  function tooltip(params, dataset, referenceId) {
    const rows = params.filter(item => typeof item.value === 'number');
    if (!rows.length) return '';
    const reference = dataset.allSeries.find(series => series.id === referenceId);
    const referenceValue = reference?.values[rows[0].dataIndex];
    const compare = Number.isFinite(referenceValue);
    return `<div class="zc-tip${compare ? ' has-reference' : ''}"><div class="zc-tip-date">${escape(rows[0].axisValueLabel)}</div>
      <div class="zc-tip-rows">${rows.map(row => {
        const series = dataset.series.find(series => series.name === row.seriesName);
        const selected = series?.id === referenceId;
        const delta = Math.round((row.value - referenceValue) * 100) / 100;
        return `<div class="zc-tip-row${selected ? ' is-reference' : ''}"><i style="background:${series?.color || '#999'}"></i>
          <span class="zc-tip-name">${escape(row.seriesName)}</span><span class="zc-tip-value">${row.value.toFixed(2)}%</span>
          ${compare ? `<span class="zc-tip-difference">${selected ? '' : `${delta > 0 ? '+' : ''}${delta.toFixed(2)}pp`}</span>` : ''}</div>`;
      }).join('')}</div></div>`;
  }

  function mount(root, options) {
    const view = root.matches?.('.zc-manager-risk-view') ? root : root.querySelector('.zc-manager-risk-view');
    if (!view) return [];
    const charts = window.CompareRiskCharts.mount(view, {
      ...sectionOptions(options, 'interval'), sectionOptions: key => sectionOptions(options, key),
    });
    for (const chart of charts) {
      const key = chart.getDom().dataset.riskChart;
      const dataset = datasetFor(options, key);
      chart.setOption({
        series: dataset.series.map(series => ({ name: series.name, data: series.values })),
        tooltip: { formatter: params => tooltip(params, dataset, options.referenceId) },
        xAxis: { axisLabel: { color: '#666' }, axisPointer: { label: {
          show: true, margin: 8, padding: [0, 2], backgroundColor: '#fff', color: '#333', fontSize: 12, fontWeight: 500,
        } } },
        yAxis: { axisLabel: { color: '#666' } },
      });
    }
    return charts;
  }

  function bind(root, options) {
    options.ui?.bind?.(root);
    root.querySelectorAll('.zc-manager-benchmark-panel').forEach(panel => {
      const details = panel.closest('details');
      const columns = [...panel.children];
      panel.querySelectorAll('[data-manager-benchmark-level]:not(:disabled)').forEach(button => {
        const next = () => columns[Number(button.dataset.managerBenchmarkLevel) + 1]?.querySelector('button:not(:disabled)')?.focus();
        button.onclick = next;
      });
      panel.onkeydown = event => {
        const button = event.target.closest('button');
        if (!button) return;
        const column = button.closest('.zc-manager-benchmark-level');
        const index = columns.indexOf(column);
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          columns[index + 1]?.querySelector('button:not(:disabled)')?.focus();
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          columns[index - 1]?.querySelector('button:not(:disabled)')?.focus();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          details.open = false;
          details.querySelector('summary').focus();
        }
      };
    });
  }

  window.ManagerRiskView = { render, mount, bind };
})();
