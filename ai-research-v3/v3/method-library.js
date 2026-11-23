(() => {
  'use strict';

  const preferenceKey = 'zhice.research.methods.enabled.v1';
  const state = {
    page:'methods', scope:'全部', source:'全部', tag:'全部', status:'全部',
    category:'全部', methodQuery:'', toolQuery:''
  };
  let preferences = {};
  function loadPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) preferences = saved;
    } catch { /* Retain the session settings if storage is unavailable. */ }
  }
  function element(tag, cls, text) {
    const item = document.createElement(tag);
    if (cls) item.className = cls;
    if (text !== undefined) item.textContent = text;
    return item;
  }
  function action(label, cls, run) {
    const button = element('button', cls, label);
    button.type = 'button';
    button.addEventListener('click', run);
    return button;
  }
  const enabled = method => typeof preferences[method.id] === 'boolean' ? preferences[method.id] : Boolean(method.enabled);
  const normalize = text => text.normalize('NFKC').toLowerCase();
  function matches(query, parts) {
    const text = normalize(parts.join(' '));
    return normalize(query).trim().split(/\s+/).every(term => text.includes(term));
  }
  function choices(label, options, selected, select, cls) {
    const group = element('div', cls);
    group.setAttribute('role','group');
    group.setAttribute('aria-label',label);
    for (const option of options) {
      const control = action(option,'',() => select(option,control));
      control.setAttribute('aria-pressed',String(option === selected));
      group.append(control);
    }
    return group;
  }
  function mount(container) {
    const catalog = window.studyMethodCatalog;
    if (!catalog) return;
    loadPreferences();
    const {methods,tools,categories} = catalog;
    const headerSlot = container.closest('.rc-utility')?.querySelector('[data-method-tabs]');
    const tabs = element('div','ml-page-tabs');
    tabs.setAttribute('role','tablist');
    tabs.setAttribute('aria-label','研究方法和工具');
    const page = element('section','ml-page');
    page.id = 'ml-panel';
    page.setAttribute('role','tabpanel');
    container.replaceChildren();
    if (headerSlot) headerSlot.replaceChildren(tabs);
    else container.append(tabs);
    container.append(page);

    function renderPage() {
      const isMethod = state.page === 'methods';
      const queryKey = isMethod ? 'methodQuery' : 'toolQuery';
      for (const tab of tabs.children) {
        const active = tab.dataset.page === state.page;
        tab.setAttribute('aria-selected',String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active) page.setAttribute('aria-labelledby',tab.id);
      }
      const heading = element('header','ml-heading');
      const intro = element('div');
      intro.append(element('h2','',isMethod?'研究方法库':'MCP 工具库'),
        element('p','',isMethod?'管理投研任务中可使用的研究方法。':'按分类查看工具的说明和标识。'));
      const search = element('label','ml-search');
      search.innerHTML = '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg>';
      const field = element('input');
      field.type = 'search';
      field.placeholder = isMethod?'搜索方法名称、描述或代码':'搜索工具名称、描述或标识';
      field.setAttribute('aria-label',field.placeholder);
      field.value = state[queryKey];
      field.addEventListener('input',() => { state[queryKey] = field.value; renderResults(); });
      search.append(field);
      heading.append(intro,search);
      const scope = element('div','ml-scopes');
      const filters = element('div','ml-filters');
      const results = element('div','ml-results');
      page.replaceChildren(heading,scope,filters,results);

      function choose(key,value,button) {
        state[key] = value;
        for (const peer of button.parentElement.children) peer.setAttribute('aria-pressed',String(peer === button));
        if (key === 'scope') {
          state.status = '全部';
          renderFilters();
        }
        renderResults();
      }
      function renderFilters() {
        filters.replaceChildren();
        if (!isMethod) { filters.hidden = true; return; }
        const definitions = [
          ['source','来源',[...new Set(methods.map(method=>method.source))]],
          ['tag','标签',[...new Set(methods.flatMap(method=>method.tags))]]
        ];
        if (state.scope === '全部') definitions.push(['status','状态',['已启用','未启用']]);
        for (const [key,label,values] of definitions) {
          const row = element('div','ml-filter-row');
          row.append(element('span','ml-filter-name',label),
            choices(label,['全部',...values],state[key],(value,button)=>choose(key,value,button),'ml-filter-options'));
          filters.append(row);
        }
      }
      function methodCard(method) {
        const card = element('article','ml-card');
        const top = element('div','ml-card-top');
        const icon = element('span','ml-method-icon',method.title.slice(0,1));
        icon.setAttribute('aria-hidden','true');
        const title = element('h3','ml-card-title',method.title);
        title.title = method.title;
        top.append(icon,title);
        const toggle = action('','ml-switch',() => {
          loadPreferences();
          preferences[method.id] = !enabled(method);
          try { localStorage.setItem(preferenceKey,JSON.stringify(preferences)); } catch { /* Session preference still applies. */ }
          renderResults(method.id);
        });
        toggle.setAttribute('role','switch');
        toggle.setAttribute('aria-label',method.title);
        toggle.setAttribute('aria-checked',String(enabled(method)));
        toggle.dataset.method = method.id;
        top.append(toggle);
        const description = element('p','ml-description',method.description);
        description.title = method.description;
        const tags = element('div','ml-tags');
        for (const name of method.tags) tags.append(element('span','ml-tag',name));
        const meta = element('footer','ml-card-meta');
        meta.append(element('span','',method.source),element('span','',method.version));
        if (method.preset) meta.append(element('span','ml-preset','平台预置'));
        card.append(top,description,tags,meta);
        return card;
      }
      function toolCard(tool) {
        const card = element('article','ml-card ml-tool-card');
        const top = element('div','ml-card-top');
        const icon = element('span','ml-method-icon','M');
        icon.setAttribute('aria-hidden','true');
        const title = element('h4','ml-card-title',tool.title);
        title.title = tool.title;
        top.append(icon,title);
        const description = element('p','ml-description',tool.description);
        description.title = tool.description;
        const meta = element('footer','ml-tool-meta');
        const id = element('code','',tool.id);
        id.title = tool.id;
        meta.append(element('span','ml-example','示例'),id);
        card.append(top,description,meta);
        return card;
      }
      function renderResults(focusMethod) {
        const content = document.createDocumentFragment();
        const visible = isMethod ? methods.filter(method =>
          (state.scope === '全部' || enabled(method)) &&
          (state.source === '全部' || state.source === method.source) &&
          (state.tag === '全部' || method.tags.includes(state.tag)) &&
          (state.status === '全部' || enabled(method) === (state.status === '已启用')) &&
          matches(state.methodQuery,[method.title,method.description,method.id,...method.tags])
        ) : tools.filter(tool => (state.category === '全部' || state.category === tool.category) &&
          matches(state.toolQuery,[tool.title,tool.description,tool.id,tool.category]));
        const count = element('p','ml-count',isMethod?'共 '+visible.length+' 个方法':'共 '+visible.length+' 个工具');
        count.setAttribute('role','status');
        content.append(count);
        if (isMethod && visible.length) {
          const grid = element('div','ml-grid');
          for (const method of visible) grid.append(methodCard(method));
          content.append(grid);
        } else if (visible.length) {
          for (const category of categories) {
            const group = visible.filter(tool => tool.category === category);
            if (!group.length) continue;
            const section = element('section','ml-tool-section');
            const name = element('h3','ml-category',category);
            name.append(element('span','',String(group.length)));
            const grid = element('div','ml-grid');
            for (const tool of group) grid.append(toolCard(tool));
            section.append(name,grid); content.append(section);
          }
        } else {
          const message = isMethod && state.scope !== '全部' && !methods.some(enabled)?'暂无已启用的研究方法':isMethod?'未找到匹配的研究方法':state.toolQuery.trim()?'未找到匹配的工具':'暂无示例工具';
          content.append(element('p','ml-empty',message));
        }
        results.replaceChildren(content);
        if (focusMethod) {
          const toggles = Array.from(results.querySelectorAll('[role="switch"]'));
          (toggles.find(item=>item.dataset.method===focusMethod) || toggles[0] || field).focus({preventScroll:true});
        }
      }
      scope.append(isMethod
        ? choices('方法范围',['全部','我启用的'],state.scope,(value,button)=>choose('scope',value,button),'ml-section-tabs')
        : choices('工具分类',['全部',...categories],state.category,(value,button)=>choose('category',value,button),'ml-section-tabs'));
      renderFilters();
      renderResults();
    }
    for (const [id,label] of [['methods','研究方法库'],['tools','MCP 工具']]) {
      const tab = action(label,'',() => { state.page = id; renderPage(); });
      tab.id = 'ml-tab-'+id;
      tab.dataset.page = id;
      tab.setAttribute('role','tab');
      tab.setAttribute('aria-controls',page.id);
      tabs.append(tab);
    }
    tabs.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const [methodsTab,toolsTab] = tabs.children;
      const next = event.key === 'Home'?methodsTab:event.key === 'End'?toolsTab:event.target===methodsTab?toolsTab:methodsTab;
      next.focus(); next.click();
    });
    renderPage();
  }

  function enabledTitles() {
    loadPreferences();
    return (window.studyMethodCatalog?.methods || []).filter(enabled).map(method=>method.title);
  }
  window.studyMethodLibrary = {mount,enabledTitles};
})();
