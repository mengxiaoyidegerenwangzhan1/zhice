(() => {
  const catalog = [
    {
      id: 'a', name: '张志梅', company: '尚正基金管理有限公司', type: '偏股型', search: 'zzm zhangzhimei', colorIndex: 1,
      products: [
        { code: '013486', name: '尚正竞争优势混合C', type: '混合型', tenureReturn: 15.75 },
        { code: '013485', name: '尚正竞争优势混合A', type: '混合型', tenureReturn: 16.82 },
      ],
    },
    {
      id: 'b', name: '黄欣', company: '国联安基金管理有限公司', type: '指数型', search: 'hx huangxin', colorIndex: 2,
      products: [
        { code: '020011', name: '国联安中证100指数(LOF)', type: '指数型', tenureReturn: 12.28 },
        { code: '020021', name: '国泰上证180金融ETF联接A', type: '指数型', tenureReturn: 9.13 },
      ],
    },
    {
      id: 'c', name: '孟棋', company: '景顺长城基金管理有限公司', type: '偏股型', search: 'mq mengqi', colorIndex: 3,
      products: [
        { code: '002244', name: '景顺长城低碳科技主题灵活配置混合A', type: '混合型', tenureReturn: 15.75 },
        { code: '000059', name: '景顺长城优信增利债券A', type: '债券型', tenureReturn: 6.32 },
      ],
    },
    {
      id: 'e', name: '孟晨波', company: '摩根基金', type: '指数型', search: 'mcb mengchenbo', colorIndex: 2,
      products: [{ code: '017341', name: '摩根中证创新药产业ETF联接A', type: '指数型', tenureReturn: 8.15 }],
    },
    {
      id: 'f', name: '汪孟海', company: '富国基金管理有限公司', type: '混合型', search: 'wmh wangmenghai', colorIndex: 3,
      products: [{ code: '004585', name: '富国港股通量化精选股票A', type: '股票型', tenureReturn: -3.26 }],
    },
    {
      id: 'd', name: '李笑薇', company: '富国基金管理有限公司', type: '指数型', search: 'lxw lixiaowei', colorIndex: 1,
      products: [
        { code: '100038', name: '富国沪深300增强A', type: '指数型', tenureReturn: 13.08 },
        { code: '100032', name: '富国中证红利指数增强A', type: '指数型', tenureReturn: 10.68 },
      ],
    },
  ];
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

  function boot() {
    const root = document.getElementById('manager-demo');
    if (!root || root.dataset.interactionReady) return;
    root.dataset.interactionReady = 'true';
    const assets = window.MANAGER_ASSETS || {};
    const viewport = document.getElementById('previewViewport');
    const selector = document.getElementById('managerSelector');
    const slots = document.getElementById('managerSlots');
    const startButton = document.getElementById('startCompare');
    const clearButton = document.getElementById('clearManagers');
    const exportButton = document.getElementById('exportCompare');
    const status = document.getElementById('demoStatus');
    const resultBody = document.getElementById('comparisonBody');
    const summary = document.getElementById('comparisonSummary');
    const productChoices = new Map();
    const composingInputs = new WeakSet();
    let managers = catalog.slice(0, 3).map((manager, order) => ({ ...manager, order, visible: true, productCode: manager.products[0].code }));
    let nextOrder = managers.length;
    let mode = 'comprehensive';
    let referenceId = null;
    let compact = false;
    let compared = false;
    let programmaticFocus = false;
    let ignoreLayoutScroll = false;
    let lastScrollTop = viewport.scrollTop;

    const selectedProduct = manager => manager.products.find(product => product.code === manager.productCode) || manager.products[0];
    const modeLabel = () => mode === 'representative' ? '代表产品比较' : '综合比较';
    const assetSource = (key, fallback = key) => assets.states?.[`${mode}-${compact ? 'compact' : 'expanded'}`]?.[key] || assets[key] || assets[fallback];
    const image = (key, className = '') => assetSource(key) ? `<img src="${escape(assetSource(key))}"${className ? ` class="${className}"` : ''} alt="">` : '';
    const announce = message => { status.textContent = message; };

    function closeMenus() {
      slots.querySelectorAll('.search-results').forEach(menu => { menu.hidden = true; });
      slots.querySelectorAll('.manager-search input').forEach(input => input.setAttribute('aria-expanded', 'false'));
      slots.querySelectorAll('.manager-product[open]').forEach(details => { details.open = false; });
    }

    function updateAppearance() {
      selector.classList.toggle('is-compact', compact);
      root.dataset.mode = mode;
      const backgroundKey = compact ? 'backgroundCompact' : mode === 'representative' ? 'backgroundRepresentative' : 'backgroundExpanded';
      const background = document.getElementById('managerPkBackground');
      const logo = document.getElementById('managerPkLogo');
      if (assetSource('background', backgroundKey)) background.src = assetSource('background', backgroundKey);
      if (assetSource('pk')) logo.src = assetSource('pk');
      slots.querySelectorAll('.manager-card').forEach(card => {
        const manager = managers.find(item => item.id === card.dataset.managerId);
        const product = selectedProduct(manager);
        const name = compact && mode === 'representative' ? product.name : manager.name;
        card.querySelector('.manager-name').textContent = name;
        card.querySelector('.manager-name').title = name;
        const marker = card.querySelector('.series-marker img');
        const markerKey = `marker${manager.colorIndex}`;
        if (marker && assetSource(markerKey)) marker.src = assetSource(markerKey);
        const sources = { pin: referenceId === manager.id ? 'pinActive' : 'pin', visibility: 'eye', remove: 'close' };
        Object.entries(sources).forEach(([action, key]) => {
          const actionIcon = card.querySelector(`.manager-tools [data-action="${action}"] img`);
          if (actionIcon && assetSource(key)) actionIcon.src = assetSource(key);
        });
        const badgeIcon = card.querySelector('.reference-badge img');
        if (badgeIcon && assetSource('pinBadge')) badgeIcon.src = assetSource('pinBadge');
      });
      slots.querySelectorAll('.manager-search > img').forEach(icon => {
        const key = compact ? 'searchCompact' : 'search';
        if (assetSource('search', key)) icon.src = assetSource('search', key);
      });
      root.querySelectorAll('button[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    }

    function setCompact(value) {
      if (compact === value) return;
      compact = value;
      ignoreLayoutScroll = true;
      if (compact) closeMenus();
      updateAppearance();
      requestAnimationFrame(() => {
        lastScrollTop = viewport.scrollTop;
        ignoreLayoutScroll = false;
      });
    }

    function productDetails(manager) {
      const product = selectedProduct(manager);
      return `<details class="manager-product"><summary aria-label="${escape(manager.name)}的代表基金" aria-haspopup="listbox" aria-expanded="false"><span class="product-title"><span>${escape(product.name)}</span>${image('productDown')}</span><span class="product-meta"><span>${product.code} <em>${product.type}</em></span><span>任期回报 <b class="${product.tenureReturn < 0 ? 'negative' : 'positive'}">${product.tenureReturn.toFixed(2)}%</b></span></span></summary>
        <div class="product-menu" role="listbox" aria-label="${escape(manager.name)}的代表基金选项">${manager.products.map(item => `<button type="button" role="option" aria-selected="${item.code === product.code}" data-action="product" data-product-code="${item.code}"><span>${escape(item.name)}</span><small>${item.code} ${item.type} · 任期回报 ${item.tenureReturn.toFixed(2)}%</small></button>`).join('')}</div></details>`;
    }

    function managerCard(manager) {
      return `<article class="manager-card${manager.visible ? '' : ' is-hidden'}${referenceId === manager.id ? ' is-reference is-pinned' : ''}" data-manager-id="${manager.id}" data-color-index="${manager.colorIndex}">
        ${referenceId === manager.id ? `<button type="button" class="reference-badge" data-action="pin" aria-label="取消置前 ${escape(manager.name)}" title="取消置前">${image('pinBadge')}参照</button>` : ''}
        <div class="manager-tools"><div class="tool-start"><button type="button" data-action="pin" aria-label="${referenceId === manager.id ? '取消置前' : '置前'} ${escape(manager.name)}" aria-pressed="${referenceId === manager.id}" title="${referenceId === manager.id ? '取消置前' : '置前并设为参照'}">${image(referenceId === manager.id ? 'pinActive' : 'pin')}</button><button type="button" data-action="visibility" aria-label="${manager.visible ? '隐藏' : '显示'} ${escape(manager.name)}" aria-pressed="${manager.visible}" title="${manager.visible ? '隐藏' : '显示'}">${image('eye')}</button></div><button type="button" class="remove-tool" data-action="remove" aria-label="移除 ${escape(manager.name)}" title="移除">${image('close')}</button></div>
        <div class="manager-main"><span class="series-marker">${image(`marker${manager.colorIndex}`)}</span><strong class="manager-name" title="${escape(manager.name)}">${escape(manager.name)}</strong><span class="manager-type">${manager.type}</span></div>
        ${mode === 'representative' ? productDetails(manager) : ''}
      </article>`;
    }

    function searchCard(index) {
      return `<div class="search-card"><label class="manager-search"><input type="text" data-search-slot="${index}" aria-label="搜索添加基金经理" aria-controls="manager-search-results-${index}" aria-autocomplete="list" aria-expanded="false" autocomplete="off" placeholder="输入基金经理姓名">${image('search')}</label><div class="search-results" id="manager-search-results-${index}" role="listbox" aria-label="基金经理搜索结果" hidden></div></div>`;
    }

    function renderResult() {
      summary.textContent = `${compared ? modeLabel() : '当前选择'} · ${managers.length} 位经理`;
      resultBody.innerHTML = managers.length ? managers.map(manager => {
        const product = selectedProduct(manager);
        const hiddenClass = manager.visible ? '' : ' class="is-muted"';
        return `<tr><td${hiddenClass}>${escape(manager.name)}${referenceId === manager.id ? '（参照）' : ''}</td><td${hiddenClass}>${manager.visible ? escape(manager.company) : '—'}</td><td${hiddenClass}>${manager.visible ? escape(product.name) : '—'}</td><td${hiddenClass}>${manager.visible ? '显示中' : '已隐藏'}</td></tr>`;
      }).join('') : '<tr><td colspan="4">尚未选择基金经理</td></tr>';
      startButton.disabled = managers.length < 2;
      clearButton.disabled = managers.length === 0;
      exportButton.disabled = managers.length === 0;
    }

    function render() {
      slots.innerHTML = Array.from({ length: 4 }, (_, index) => managers[index] ? managerCard(managers[index]) : searchCard(index)).join('');
      updateAppearance();
      renderResult();
      lastScrollTop = viewport.scrollTop;
    }

    function focusWithoutSearch(element) {
      if (!element) return;
      programmaticFocus = true;
      element.focus({ preventScroll: true });
      programmaticFocus = false;
    }

    function focusNextEmpty() {
      focusWithoutSearch(slots.querySelector('.manager-search input') || startButton);
    }

    function sortManagers() {
      managers.sort((first, second) => first.order - second.order);
      const index = managers.findIndex(manager => manager.id === referenceId);
      if (index > 0) managers.unshift(...managers.splice(index, 1));
    }

    function highlighted(value, query) {
      if (!query) return escape(value);
      const lower = value.toLowerCase();
      let start = 0;
      let index = lower.indexOf(query);
      let html = '';
      while (index !== -1) {
        html += `${escape(value.slice(start, index))}<strong>${escape(value.slice(index, index + query.length))}</strong>`;
        start = index + query.length;
        index = lower.indexOf(query, start);
      }
      return html + escape(value.slice(start));
    }

    function showSearch(input) {
      const query = input.value.trim().toLowerCase();
      const menu = input.closest('.search-card').querySelector('.search-results');
      const matches = catalog.filter(manager => !managers.some(selected => selected.id === manager.id) && `${manager.name} ${manager.company} ${manager.type} ${manager.search}`.toLowerCase().includes(query));
      closeMenus();
      menu.innerHTML = matches.length ? matches.map(manager => `<button type="button" role="option" data-action="add" data-manager-id="${manager.id}"><span>${highlighted(manager.name, query)}</span><span>${highlighted(manager.company, query)}</span><small>${highlighted(manager.type, query)}</small></button>`).join('') : '<p>暂无匹配的基金经理</p>';
      menu.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    slots.addEventListener('focusin', event => {
      const input = event.target.closest('.manager-search input');
      if (!input) return;
      setCompact(false);
      if (!programmaticFocus) showSearch(input);
    });
    slots.addEventListener('pointerdown', event => {
      if (event.target.closest('.manager-search, .manager-main')) setCompact(false);
    });
    slots.addEventListener('click', event => {
      const input = event.target.closest('.manager-search input');
      if (input) { setCompact(false); showSearch(input); return; }
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'add') {
        if (managers.length >= 4 || managers.some(manager => manager.id === button.dataset.managerId)) return;
        const manager = catalog.find(item => item.id === button.dataset.managerId);
        const usedColors = new Set(managers.map(item => item.colorIndex));
        const colorIndex = [1, 2, 3, 4].find(index => !usedColors.has(index));
        managers.push({ ...manager, colorIndex, order: nextOrder++, visible: true, productCode: productChoices.get(manager.id) || manager.products[0].code });
        sortManagers();
        render();
        focusNextEmpty();
        announce(`已添加${manager.name}，当前共${managers.length}位经理。`);
        return;
      }
      const id = button.closest('.manager-card').dataset.managerId;
      const manager = managers.find(item => item.id === id);
      if (action === 'pin') {
        referenceId = referenceId === id ? null : id;
        sortManagers();
        announce(referenceId ? `已将${manager.name}置于首列并设为参照。` : `已取消${manager.name}置前，恢复加入顺序。`);
      } else if (action === 'visibility') {
        manager.visible = !manager.visible;
        announce(`已${manager.visible ? '显示' : '隐藏'}${manager.name}。`);
      } else if (action === 'remove') {
        managers = managers.filter(item => item.id !== id);
        if (referenceId === id) referenceId = null;
        sortManagers();
        if (managers.length < 2) compared = false;
        announce(`已移除${manager.name}。`);
      } else if (action === 'product') {
        manager.productCode = button.dataset.productCode;
        productChoices.set(id, manager.productCode);
        announce(`${manager.name}的代表基金已切换为${selectedProduct(manager).name}。`);
      }
      render();
      if (action === 'remove') focusNextEmpty();
      else if (action === 'product') focusWithoutSearch(slots.querySelector(`[data-manager-id="${id}"] summary`));
      else focusWithoutSearch(slots.querySelector(`[data-manager-id="${id}"] [data-action="${action}"]`));
    });
    slots.addEventListener('input', event => {
      if (!event.target.matches('.manager-search input')) return;
      setCompact(false);
      showSearch(event.target);
    });
    slots.addEventListener('compositionstart', event => composingInputs.add(event.target));
    slots.addEventListener('compositionend', event => {
      composingInputs.delete(event.target);
      if (event.target.matches('.manager-search input')) showSearch(event.target);
    });
    slots.addEventListener('keydown', event => {
      if (event.isComposing || composingInputs.has(event.target) || event.keyCode === 229) return;
      const search = event.target.closest('.search-card');
      const details = event.target.closest('.manager-product');
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenus();
        focusWithoutSearch(search?.querySelector('input') || details?.querySelector('summary'));
        return;
      }
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
      if (!search && !details) return;
      if (details && event.target.closest('summary') && event.key === 'Enter') return;
      if (search && search.querySelector('.search-results').hidden) showSearch(search.querySelector('input'));
      if (details && !details.open) details.open = true;
      const menu = search?.querySelector('.search-results') || details.querySelector('.product-menu');
      const options = [...menu.querySelectorAll('button[role="option"]')];
      if (!options.length) return;
      const current = options.indexOf(document.activeElement);
      event.preventDefault();
      if (event.key === 'Enter') {
        options[current < 0 ? 0 : current].click();
      } else {
        const next = current < 0 ? (event.key === 'ArrowDown' ? 0 : options.length - 1) : (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[next].focus({ preventScroll: true });
      }
    });
    slots.addEventListener('toggle', event => {
      const details = event.target;
      if (!details.matches('.manager-product')) return;
      details.querySelector('summary').setAttribute('aria-expanded', String(details.open));
      const icon = details.querySelector('.product-title img');
      const key = details.open ? 'productUp' : 'productDown';
      if (icon && assetSource(key)) icon.src = assetSource(key);
      if (details.open) slots.querySelectorAll('.manager-product[open]').forEach(other => { if (other !== details) other.open = false; });
    }, true);

    document.addEventListener('click', event => {
      if (!event.target.closest('.search-card, .manager-product')) closeMenus();
    });
    viewport.addEventListener('scroll', () => {
      const current = viewport.scrollTop;
      const delta = current - lastScrollTop;
      lastScrollTop = current;
      if (ignoreLayoutScroll) return;
      if (current > 120 && delta > 0) setCompact(true);
      else if (delta < 0 || current <= 120) setCompact(false);
    }, { passive: true });

    root.querySelectorAll('button[data-mode]').forEach(button => {
      button.addEventListener('click', () => {
        if (mode === button.dataset.mode) return;
        mode = button.dataset.mode;
        render();
        announce(`已切换为${modeLabel()}。`);
      });
    });
    startButton.addEventListener('click', () => {
      if (managers.length < 2) return;
      compared = true;
      renderResult();
      closeMenus();
      announce(`已开始${modeLabel()}，共${managers.length}位经理，其中${managers.filter(manager => manager.visible).length}位显示。`);
    });
    clearButton.addEventListener('click', () => {
      managers = [];
      referenceId = null;
      compared = false;
      nextOrder = 0;
      productChoices.clear();
      setCompact(false);
      render();
      focusNextEmpty();
      announce('已清空全部经理，可重新搜索添加。');
    });
    exportButton.addEventListener('click', () => {
      if (!managers.length) return;
      const rows = [['比较模式', '基金经理', '基金公司', '代表基金', '基金代码', '显示状态', '参照']];
      managers.forEach(manager => {
        const product = selectedProduct(manager);
        rows.push([modeLabel(), manager.name, manager.company, product.name, product.code, manager.visible ? '显示中' : '已隐藏', referenceId === manager.id ? '是' : '否']);
      });
      const csv = '\ufeff' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `经理比较-${modeLabel()}.csv`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce('已导出当前选择的CSV文件。');
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
