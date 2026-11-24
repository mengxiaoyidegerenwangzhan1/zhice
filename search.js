(() => {
  'use strict';

  const dialog = document.createElement('dialog');
  dialog.id = 'study-search';
  const isV3 = document.documentElement.dataset.prototype === 'v3';
  const searchLabel = isV3 ? '搜索聊天记录、功能和文件' : '搜索聊天记录和功能导航';
  dialog.setAttribute('aria-label', searchLabel);
  const searchField = `<input class="search-field${isV3 ? ' zc-modal-control' : ''}" type="text" role="combobox" aria-label="${searchLabel}" aria-controls="study-search-results" aria-expanded="true" aria-autocomplete="list" placeholder="${searchLabel}…" autocomplete="off" spellcheck="false">`;
  let top;
  if (isV3) {
    dialog.classList.add('zc-modal');
    dialog.setAttribute('aria-labelledby','study-search-title');
    top = `<header class="zc-modal-header"><h2 class="zc-modal-title" id="study-search-title">搜索</h2>
      <button type="button" class="search-close zc-modal-close" aria-label="关闭搜索" title="关闭搜索"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg></button></header>
      <div class="zc-modal-body search-content"><div class="search-bar">${searchField}</div>`;
  } else {
    top = `<div class="search-bar">${searchField}
      <button type="button" class="search-close" aria-label="关闭搜索" title="关闭搜索">
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="m5 5 10 10M15 5 5 15"/></svg>
      </button></div>`;
  }
  dialog.innerHTML = top + `
    <div class="search-filters" role="group" aria-label="搜索范围">
      <button type="button" data-search-scope="all">全部</button>
      <button type="button" data-search-scope="chat">聊天记录</button>
      <button type="button" data-search-scope="nav">功能导航</button>
      ${isV3 ? '<button type="button" data-search-files>搜索文件</button>' : ''}
    </div>
    <div id="study-search-results" role="listbox" aria-label="搜索结果"></div>
    <p class="search-status" role="status" aria-live="polite"></p>${isV3 ? '</div>' : ''}`;
  document.body.append(dialog);

  const field = dialog.querySelector('input');
  const list = dialog.querySelector('[role="listbox"]');
  const status = dialog.querySelector('[role="status"]');
  const filters = Array.from(dialog.querySelectorAll('[data-search-scope]'));
  const placeholders = {all:searchLabel+'…', chat:'搜索聊天记录…', nav:'搜索功能导航…'};
  const icons = {
    file:'<path d="M4.5 2.5h7l4 4v11h-11zM11.5 2.5v4h4" stroke-linecap="round"/>',
    chat:'<path d="M17 12.8a6.2 6.2 0 0 0 .6-2.8 7.4 7.4 0 1 0-14.8 0c0 1.2.3 2.4.9 3.4l-.6 3.2 3.2-.7a7.4 7.4 0 0 0 3.9 1.1 7.5 7.5 0 0 0 6.8-4.2Z"/>',
    nav:'<rect x="2.5" y="2.5" width="6" height="6" rx="1.3"/><rect x="11.5" y="2.5" width="6" height="6" rx="1.3"/><rect x="2.5" y="11.5" width="6" height="6" rx="1.3"/><rect x="11.5" y="11.5" width="6" height="6" rx="1.3"/>'
  };
  let source = {chats:() => [], nav:() => []};
  let scope = 'all';
  let results = [];
  let active = -1;
  let previousFocus = null;

  function normalize(value) {
    return String(value ?? '').normalize('NFKC').toLowerCase().trim();
  }

  function findResults(items, type, query) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    const found = [];
    for (const item of items) {
      const name = type === 'file' ? item.name : item.title;
      const title = normalize(name);
      const path = type === 'file' ? [item.threadTitle, item.kind === 'upload' ? '我的上传' : '对话产出'].filter(Boolean).join(' · ')
        : Array.isArray(item.path) ? item.path.join(' › ') : String(item.path || '');
      const body = String(item.text || '');
      const keywords = normalize([name, path, body, item.keywords || '', item.aliases || ''].join(' '));
      if (!tokens.every(word => keywords.includes(word))) continue;
      let detail = type === 'chat' ? '' : path;
      const firstBodyMatch = tokens.reduce((pos, word) => {
        const offset = normalize(body).indexOf(word);
        return offset < 0 ? pos : Math.min(pos, offset);
      }, Infinity);
      if (type === 'chat' && firstBodyMatch !== Infinity && !tokens.every(word => title.includes(word))) {
        const start = Math.max(0, firstBodyMatch - 16);
        detail = (start ? '…' : '') + body.slice(start, start + 96).replace(/\s+/g, ' ');
      }
      const rank = !tokens.length ? 0 : title === normalize(query) ? 3 : title.startsWith(tokens[0]) ? 2 : tokens.every(word => title.includes(word)) ? 1 : 0;
      found.push({item, name, type, detail, rank});
    }
    return found.sort((a,b) => b.rank-a.rank);
  }

  function setActive(index, reveal = false) {
    if (active >= 0) list.querySelector(`[data-index="${active}"]`)?.setAttribute('aria-selected', 'false');
    active = index;
    const row = index >= 0 && list.querySelector(`[data-index="${index}"]`);
    if (!row) {
      field.removeAttribute('aria-activedescendant');
      return;
    }
    row.setAttribute('aria-selected', 'true');
    field.setAttribute('aria-activedescendant', row.id);
    if (reveal) row.scrollIntoView({block:'nearest'});
  }

  function makeGroup(groupName, rows) {
    const group = document.createElement('div');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', groupName);
    const heading = document.createElement('div');
    heading.className = 'search-group-title';
    heading.setAttribute('aria-hidden', 'true');
    heading.textContent = groupName;
    group.append(heading);
    for (const entry of rows) {
      const index = results.push(entry)-1;
      const option = document.createElement('div');
      option.id = `study-search-option-${index}`;
      option.dataset.index = index;
      option.className = 'search-option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.innerHTML = `<svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round" aria-hidden="true">${icons[entry.type]}</svg>`;
      const copy = document.createElement('div');
      copy.className = 'search-option-copy';
      const title = document.createElement('span');
      title.textContent = entry.name;
      copy.append(title);
      if (entry.detail) {
        const detail = document.createElement('small');
        detail.textContent = entry.detail;
        copy.append(detail);
      }
      option.append(copy);
      group.append(option);
    }
    return group;
  }

  function render() {
    const query = field.value.trim();
    const fragment = document.createDocumentFragment();
    active = -1;
    results = [];
    field.removeAttribute('aria-activedescendant');
    field.placeholder = placeholders[scope];
    for (const filter of filters) filter.setAttribute('aria-pressed', String(filter.dataset.searchScope === scope));
    if (scope !== 'nav') {
      const chats = findResults(source.chats(), 'chat', query);
      if (chats.length) fragment.append(makeGroup(query ? '聊天记录' : '最近聊天', !query && scope === 'all' ? chats.slice(0,4) : chats));
    }
    if (scope !== 'chat') {
      const pages = findResults(source.nav(), 'nav', query);
      if (pages.length) fragment.append(makeGroup('功能导航', !query && scope === 'all' ? pages.slice(0,4) : pages));
    }
    if (isV3 && scope === 'all') {
      const files = findResults(window.researchCanvas.resourceContext().files, 'file', query);
      if (files.length) fragment.append(makeGroup('文件', query ? files : files.slice(0,4)));
    }
    list.replaceChildren(fragment);
    list.scrollTop = 0;
    if (results.length) {
      status.textContent = `共 ${results.length} 个结果`;
      status.classList.remove('search-status-visible');
    } else {
      status.textContent = query ? '没有找到匹配结果，试试其他关键词。' : (scope === 'chat' ? '暂无聊天记录' : '暂无可搜索内容');
      status.classList.add('search-status-visible');
    }
  }

  function open(nextScope = 'all', opener) {
    if (!dialog.open) {
      previousFocus = opener instanceof HTMLElement ? opener : document.activeElement;
      field.value = '';
      dialog.showModal();
    }
    scope = ({chats:'chat', navigation:'nav'})[nextScope] || (Object.hasOwn(placeholders,nextScope) ? nextScope : 'all');
    render();
    field.focus({preventScroll:true});
  }

  function close() {
    if (!dialog.open) return;
    dialog.close();
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
    previousFocus = null;
  }

  function select(index) {
    const entry = results[index];
    if (!entry) return;
    close();
    if (entry.type === 'chat') source.openChat?.(entry.item);
    else if (entry.type === 'file') window.studyPaneTabs.openFile(entry.item);
    else source.openNav?.(entry.item);
  }

  field.addEventListener('input', render);
  window.addEventListener('study-projects-changed', () => {
    if (dialog.open && scope !== 'nav') render();
  });
  for (const filter of filters) filter.addEventListener('click', () => open(filter.dataset.searchScope));
  dialog.querySelector('[data-search-files]')?.addEventListener('click', () => {
    const query = field.value.trim();
    close();
    window.studyPaneTabs.showFiles(query);
  });
  dialog.querySelector('.search-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => {event.preventDefault();close();});
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      return;
    }
    const row = event.target.closest('[data-index]');
    if (row) select(Number(row.dataset.index));
  });
  dialog.addEventListener('keydown', event => {
    if (event.isComposing || event.keyCode === 229) {event.stopPropagation();return;}
    if (event.key === 'Escape') {
      event.preventDefault();event.stopPropagation();close();return;
    }
    if (event.target !== field || !results.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const next = active < 0 ? (direction === 1 ? 0 : results.length-1) : (active+direction+results.length)%results.length;
      setActive(next,true);
    } else if (event.key === 'Enter') {
      event.preventDefault();select(active < 0 ? 0 : active);
    }
  });
  window.addEventListener('study-open-chat-search', () => open('chat'));
  window.studySearch = {open, close, setSource(next) {source=next; if (dialog.open) render();}};
})();
