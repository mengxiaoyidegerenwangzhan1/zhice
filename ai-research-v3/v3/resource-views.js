(() => {
  'use strict';

  const paths = {
    document:['M13 2.8H6.5A1.5 1.5 0 0 0 5 4.3v15.4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V8.8L13 2.8Z','M13 3v6h6M8.5 13h7M8.5 16.5h5'],
    file:['M13 2.8H6.5A1.5 1.5 0 0 0 5 4.3v15.4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V8.8L13 2.8Z','M13 3v6h6'],
    image:['M5 4h14a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5 4Z','M4 17l5.5-5 3.2 2.8 2.8-3 4.5 4.2M15 8.2a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z'],
    table:['M4.5 4.5h15v15h-15zM4.5 9.5h15M4.5 14.5h15M10 9.5v10'],
    folder:['M3.5 6a1.5 1.5 0 0 1 1.5-1.5h5l2 2.5h7A1.5 1.5 0 0 1 20.5 8.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5Z'],
    search:['M16.2 10.2a6 6 0 1 1-12 0 6 6 0 1 1 12 0Z','m14.7 14.7 5.1 5.1'],
    next:['m9 6 6 6-6 6'], back:['m14.5 5.5-6.5 6.5 6.5 6.5'],
    close:['m6 6 12 12M18 6 6 18'],
    maximize:['M4 10V4h6M20 14v6h-6'],
    restore:['M8 4h12v12h-4M16 8H4v12h12Z']
  };
  const types = {output:'对话产出', upload:'我的上传'};
  const svgNS = 'http://www.w3.org/2000/svg';
  const dateFormat = new Intl.DateTimeFormat('zh-CN',{
    year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'Asia/Shanghai'
  });

  function node(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function icon(type) {
    const svg = document.createElementNS(svgNS,'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('width','16'); svg.setAttribute('height','16');
    svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','1.6');
    svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true');
    for (const d of paths[type]) {
      const path = document.createElementNS(svgNS,'path');
      path.setAttribute('d',d); svg.append(path);
    }
    return svg;
  }
  function button(cls, label, activate) {
    const item = node('button',cls);
    item.type = 'button';
    item.title = label;
    item.setAttribute('aria-label',label);
    item.addEventListener('click',activate);
    return item;
  }
  function tool(type,label,activate,cls=type) {
    const item = button('rv-tool rv-'+cls,label,activate);
    item.dataset.rvFocus = cls;
    item.append(icon(type));
    return item;
  }
  function fileButton(file, options) {
    const item = button('rv-file',file.name,()=>options.onOpenFile(file));
    item.dataset.rvFocus = 'file-'+file.threadId+'-'+file.id;
    const type = ['document','table','image'].includes(file.icon) ? file.icon : 'file';
    const graphic = node('i','rv-icon rv-icon-'+type);
    graphic.append(icon(type));
    item.append(graphic,node('span','rv-name',file.name));
    return item;
  }
  function header(options) {
    const all = options.view==='all';
    const bar = node('header','rv-header');
    if (all && options.onBack) bar.append(tool('back','返回对话资料',options.onBack));
    const title = node('h2','rv-title',all?'全部文件':'资料');
    const tools = node('div','rv-tools');
    if (all) {
      const tab = node('div','rv-tab');
      tab.append(icon('folder'),title);
      bar.append(tab);
      if (options.onMaximize) tools.append(tool(options.maximized?'restore':'maximize',
        options.maximized?'还原文件区':'最大化文件区',options.onMaximize,'maximize'));
    } else bar.append(title);
    tools.append(tool('close',all?'关闭全部文件':'关闭资料栏',options.onClose));
    bar.append(tools);
    return bar;
  }

  function sections(view, files, options) {
    const group = node('div','rv-sections');
    const threadFiles = files.filter(file=>file.threadId===options.threadId);
    let truncated = false;
    for (const [kind,label] of Object.entries(types)) {
      const subset = threadFiles.filter(file=>file.kind===kind);
      const section = node('section','rv-section');
      section.append(node('h3','rv-heading',label));
      if (subset.length) {
        const list = node('div','rv-file-list');
        const visible = options.view==='preview' ? subset.slice(0,3) : subset;
        if (visible.length<subset.length) truncated = true;
        for (const file of visible) list.append(fileButton(file,options));
        section.append(list);
      } else section.append(node('p','rv-empty',kind==='output'?'暂无对话产出':'暂无上传文件'));
      group.append(section);
    }
    view.append(group);
    if ((options.view==='rail' && threadFiles.length>0) || truncated) {
      const footer = node('footer','rv-footer');
      const showAll = button('rv-show-all','查看全部',options.onShowAll);
      showAll.dataset.rvFocus = 'show-all';
      showAll.textContent = '查看全部';
      footer.append(showAll); view.append(footer);
    }
  }

  function fileSearch(view, options) {
    let search = view.querySelector('.rv-file-search');
    if (!search) {
      search = node('div','rv-file-search');
      search.setAttribute('role','search');
      search.setAttribute('aria-label','文件搜索');
      const field = node('input','rv-file-query');
      field.type = 'search';
      field.autocomplete = 'off';
      field.setAttribute('aria-label','搜索文件');
      field.placeholder = '搜索文件';
      const clear = button('rv-clear-query','清除搜索',()=>{
        field.value = '';
        field.dispatchEvent(new Event('input'));
        field.focus();
      });
      clear.append(icon('close'));
      search.append(icon('search'),field,clear);
      view.append(search);
    }
    const field = search.querySelector('input');
    const query = options.fileQuery || '';
    const changed = field.dataset.query !== query;
    if (field.value !== query) field.value = query;
    field.dataset.query = query;
    field.oninput = () => options.onFileQueryChange(field.value);
    search.querySelector('button').hidden = !field.value;
    return changed;
  }

  function library(view, files, options) {
    const library = node('div','rv-library');
    const table = node('table','rv-table');
    table.setAttribute('aria-label','全部文件');
    const heading = table.createTHead().insertRow();
    for (const [cls,label] of [['name','名称'],['source','来源'],['activity','最近聊天时间']]) {
      const cell = node('th','rv-col-'+cls,label);
      cell.scope='col'; heading.append(cell);
    }
    const terms = (options.fileQuery || '').normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
    const groups = new Map();
    for (const file of files) {
      const text = [file.name,file.threadTitle,types[file.kind]].join(' ').normalize('NFKC').toLowerCase();
      if (!terms.every(term=>text.includes(term))) continue;
      if (!groups.has(file.threadId)) groups.set(file.threadId,[]);
      groups.get(file.threadId).push(file);
    }
    const expanded = options.expandedGroups == null ? null : new Set(options.expandedGroups);
    const orderedGroups = [...groups].sort(([idA, rowsA], [idB, rowsB]) =>
      (rowsB[0].threadActivityAt || 0) - (rowsA[0].threadActivityAt || 0) ||
      String(idA).localeCompare(String(idB))
    );
    for (const [id, rows] of orderedGroups) {
      const body = node('tbody','rv-thread');
      const groupRow = node('tr','rv-group');
      const cell = node('th');
      cell.colSpan=3; cell.scope='rowgroup';
      const title = rows[0].threadTitle || '未命名会话';
      const toggle = button('rv-group-toggle',title,()=>options.onToggleGroup(id));
      toggle.dataset.rvFocus = 'group-'+id;
      const open = !expanded || expanded.has(id);
      toggle.setAttribute('aria-expanded',String(open));
      const chevron = node('i','rv-chevron');
      chevron.append(icon('next'));
      toggle.append(chevron,node('span','rv-group-name',title));
      cell.append(toggle); groupRow.append(cell); body.append(groupRow);
      if (open) {
        for (const file of rows) {
          const row = node('tr','rv-entry');
          const name = node('td','rv-col-name');
          name.append(fileButton(file,options));
          const source = node('td','rv-col-source');
          source.append(node('span','rv-source',types[file.kind]));
          const activity = node('td','rv-col-activity');
          const stamp = file.threadActivityAt > 0 ? new Date(file.threadActivityAt) : null;
          if (stamp && Number.isFinite(stamp.getTime())) {
            const time = node('time','rv-time',dateFormat.format(stamp));
            time.dateTime = stamp.toISOString();
            activity.append(time);
          } else activity.append(node('span','rv-time','—'));
          row.append(name,source,activity); body.append(row);
        }
      }
      table.append(body);
    }
    library.append(table);
    if (!groups.size) {
      const empty = node('p','rv-empty',terms.length ? '未找到匹配的文件' : '暂无文件');
      empty.setAttribute('role','status');
      library.append(empty);
    }
    const previous = view.querySelector('.rv-library');
    if (previous) previous.replaceWith(library);
    else view.append(library);
  }
  function render(host, options) {
    const focused = host.contains(document.activeElement) && document.activeElement.closest('[data-rv-focus]')?.dataset.rvFocus;
    const oldView = host.firstElementChild;
    const reuse = options.view==='all' && oldView?.classList.contains('rv-all');
    const view = reuse ? oldView : node('section','rv-view rv-'+options.view);
    const previousScroll = view.querySelector('.rv-library') || host.querySelector('.rv-'+options.view+' > .rv-sections');
    const top = previousScroll?.scrollTop || 0, left = previousScroll?.scrollLeft || 0;
    view.setAttribute('aria-label',options.view==='all'?'全部文件':options.view==='rail'?'对话资料':'对话资料预览');
    const files = [...options.files].sort((a,b)=>
      (b.timestamp || 0) - (a.timestamp || 0) ||
      (b.messageIndex ?? -1) - (a.messageIndex ?? -1) ||
      (b.slot ?? -1) - (a.slot ?? -1)
    );
    const oldHeader = view.querySelector('.rv-header');
    if (options.view!=='preview' && options.showHeader!==false) {
      if (oldHeader) oldHeader.replaceWith(header(options));
      else view.prepend(header(options));
    } else oldHeader?.remove();
    let queryChanged = false;
    if (options.view==='all') {
      queryChanged = fileSearch(view,options);
      library(view,files,options);
    } else sections(view,files,options);
    if (!reuse) host.replaceChildren(view);
    if (!queryChanged && (top || left)) view.querySelector('.rv-library,.rv-sections').scrollTo(left,top);
    if (focused) {
      const target = [...view.querySelectorAll('[data-rv-focus]')].find(item=>item.dataset.rvFocus===focused);
      target?.focus({preventScroll:true});
    }
  }
  window.researchResourceViews = {render};
})();
