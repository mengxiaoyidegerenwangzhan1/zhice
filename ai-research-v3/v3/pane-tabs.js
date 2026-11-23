(function () {
  "use strict";
  const workspace = document.getElementById("workspace");
  const panel = document.getElementById("pane-tabs-panel");
  const body = panel.querySelector(".pt-body");
  const stripHeader = document.createElement("header");
  stripHeader.className = "pt-bar";
  panel.prepend(stripHeader);
  const tabs = new Map();
  let sequence = 0;
  let visible = false;
  let selected = "";
  let maximized = false;
  let resumeAfterResources = null;
  let barSignature = "";
  const paths = {
    new:"M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6.4 0a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 1 1 5.2 0Zm-.8-1.9 2-2",
    search:"M18 18l-4-4m2-5a6 6 0 1 1-12 0 6 6 0 1 1 12 0",
    url:"M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0m0 0h16m-8-8c-4 4-4 12 0 16 4-4 4-12 0-16",
    files:"M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    file:"M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h5",
    add:"M12 4v16M4 12h16", close:"m6 6 12 12m0-12L6 18"
  };
  function svg(key) {
    const node = document.createElementNS("http://www.w3.org/2000/svg","svg");
    node.setAttribute("viewBox","0 0 24 24");
    node.setAttribute("aria-hidden","true");
    node.innerHTML = '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="'+paths[key]+'"/>';
    return node;
  }
  function button(cls, name, icon, run) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = cls;
    el.title = name;
    el.setAttribute("aria-label", name);
    if (icon) el.append(svg(icon));
    el.addEventListener("click",run);
    return el;
  }
  function createBlank() {
    const entry = {id:"worktab-"+(++sequence),kind:"new",label:"新标签页"};
    tabs.set(entry.id,entry);
    return entry;
  }
  function updateButtons(count) {
    for (const el of workspace.querySelectorAll("[data-pane-tabs-trigger]")) {
      const number = el.querySelector("[data-pane-tabs-count]");
      number.textContent = count===0 ? "+" : String(count);
      number.toggleAttribute("data-empty",count===0);
      number.dataset.digits = String(Math.min(3,String(count).length));
      el.dataset.paneTabsTip = count===0 ? "新建标签页" : "打开标签页";
      el.setAttribute("aria-label",el.dataset.paneTabsTip);
      el.setAttribute("aria-description","当前共 "+count+" 个标签页");
      el.setAttribute("aria-expanded",String(visible));
    }
  }
  function sync() {
    const visibilityChanged = workspace.classList.contains("pane-tabs-open") !== visible;
    panel.hidden = !visible;
    panel.dataset.maximized = String(visible && maximized);
    workspace.classList.toggle("pane-tabs-open",visible);
    updateButtons(tabs.size);
    if (visibilityChanged) window.dispatchEvent(new Event("study-pane-tabs-visibility"));
    if (!visible) return;
    const list = [...tabs.values()];
    const signature = JSON.stringify([selected,maximized,list.map(t=>[t.id,t.label,t.kind])]);
    if (signature!==barSignature) {
      const focused = stripHeader.contains(document.activeElement) ? document.activeElement.dataset.focus : null;
      const strip = document.createElement("div");
      strip.className = "pt-strip";
      strip.setAttribute("role","tablist");
      strip.setAttribute("aria-label","已打开的标签页");
      for (const tab of list) {
        const item = document.createElement("div");
        item.className = "pt-tab";
        if (tab.id===selected) item.setAttribute("aria-current","page");
        const select = button("pt-select",tab.label,tab.kind,()=>activate(tab.id));
        select.setAttribute("role","tab");
        select.setAttribute("aria-selected",String(tab.id===selected));
        select.tabIndex = tab.id===selected ? 0 : -1;
        select.dataset.id = tab.id;
        select.dataset.focus = "select"+tab.id;
        const title = document.createElement("span");
        title.className = "pt-name";
        title.textContent = tab.label;
        select.append(title);
        const close = button("pt-close","关闭"+tab.label,"close",()=>closeTab(tab.id));
        close.dataset.focus = "close"+tab.id;
        item.append(select,close);
        strip.append(item);
      }
      const add = button("pt-tool pt-add","新建标签页","add",()=>activate(createBlank().id));
      const expand = button("pt-tool pt-max",maximized?"还原标签页":"最大化标签页",null,()=>{
        maximized = !maximized;
        sync();
      });
      expand.innerHTML = window.researchCanvas.paneSizeIcon(maximized);
      expand.dataset.focus = "maximize";
      const collapse = button("pt-tool pt-dismiss","收起标签页","close",()=>dismiss());
      stripHeader.replaceChildren(strip,add,expand,collapse);
      barSignature = signature;
      if (focused) [...stripHeader.querySelectorAll("[data-focus]")].find(el=>el.dataset.focus===focused)?.focus({preventScroll:true});
    }
    const current = stripHeader.querySelector('[aria-selected="true"]');
    if (current) {
      const item = current.parentElement, strip = item.parentElement;
      const x = item.getBoundingClientRect(), bounds = strip.getBoundingClientRect();
      const inset = parseFloat(getComputedStyle(strip).paddingInlineStart);
      if (x.right>bounds.right-inset) strip.scrollLeft += x.right-(bounds.right-inset);
      else if (x.left<bounds.left+inset) strip.scrollLeft += x.left-(bounds.left+inset);
    }
  }
  function pageOptions(entry) {
    return {
      entry,
      tools:window.studyNavigation.searchableRoutes().filter(r=>r.action==="leaf"||r.action==="page"),
      get files() {return window.researchCanvas.resourceContext().files;},
      onOpenFiles:showFiles,
      onVisitTool:tool=>window.studyNavigation.openPage(tool.title),
      onVisitFile:openFile,
      onVisitUrl:url=>replaceEntry({kind:"url",url,label:new URL(url).hostname}),
      onSearch:query=>replaceEntry({kind:"search",query,label:"搜索「"+query+"」"})
    };
  }
  function draw(entry) {
    if (entry.kind==="files") {
      window.studyResources.renderFiles(body,entry);
      return;
    }
    if (entry.kind==="file") {
      window.researchCanvas.renderResourceFile(body,entry.fileId);
      return;
    }
    window.studyNewTabPage.render(body,pageOptions(entry));
    if (entry.draft!==undefined) body.querySelector("input").value = entry.draft;
  }
  function replaceEntry(props) {
    const entry = tabs.get(selected);
    if (!entry) return;
    delete entry.draft;
    delete entry.url;
    delete entry.query;
    Object.assign(entry,props);
    draw(entry);
    sync();
  }
  body.addEventListener("input",event=>{
    if (event.target.matches(".pt-search input") && tabs.has(selected)) tabs.get(selected).draft=event.target.value;
  });
  function activate(id) {
    const entry = tabs.get(id);
    if (!entry) return;
    resumeAfterResources = null;
    window.studyResources.close();
    if (workspace.classList.contains("rc-function-expanded")) window.researchCanvas.restoreFunction();
    const changed = selected!==id;
    selected = id;
    visible = true;
    sync();
    if (changed || entry.kind==="files" || entry.kind==="file") draw(entry);
    panel.focus({preventScroll:true});
  }
  function showFiles(query) {
    const id = "worktab-files";
    if (!tabs.has(id)) tabs.set(id,{id,kind:"files",label:"所有文件",query:""});
    if (typeof query==="string") tabs.get(id).query=query;
    activate(id);
    if (typeof query==="string") body.querySelector(".rv-file-query")?.focus({preventScroll:true});
  }
  function openFile(file) {
    const current = window.researchCanvas.resourceContext().files.find(item=>item.id===file.id);
    if (!current) return;
    const id = "worktab-file:"+current.id;
    if (!tabs.has(id)) tabs.set(id,{id,kind:"file",label:current.name,fileId:current.id});
    activate(id);
  }
  function closeTab(id) {
    const positions = [...tabs.keys()];
    if (!tabs.delete(id)) return;
    if (selected!==id) {sync(); return;}
    const remaining = [...tabs.keys()];
    const next = remaining[Math.min(positions.indexOf(id),remaining.length-1)];
    if (next && visible) {activate(next); return;}
    selected = next || "";
    if (next) draw(tabs.get(next));
    else body.replaceChildren();
    if (visible) dismiss();
    else sync();
  }
  function dismiss(restoreFocus=true) {
    visible = false;
    maximized = false;
    sync();
    if (restoreFocus) workspace.querySelector("[data-pane-tabs-trigger]")?.focus({preventScroll:true});
  }
  function openDefault() {
    if (visible) {dismiss(); return;}
    activate(selected || createBlank().id);
  }
  workspace.addEventListener("click",event=>{
    if (event.target.closest("[data-pane-tabs-trigger]")) openDefault();
  });
  stripHeader.addEventListener("keydown",event=>{
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const tab=event.target.closest(".pt-select[role=tab]");
    if (!tab) return;
    const list=[...tabs.values()], i=list.findIndex(item=>item.id===tab.dataset.id);
    const indices={ArrowLeft:(i+list.length-1)%list.length,ArrowRight:(i+1)%list.length,Home:0,End:list.length-1};
    if (!Object.hasOwn(indices,event.key)) return;
    event.preventDefault();
    activate(list[indices[event.key]].id);
    stripHeader.querySelector('[aria-selected="true"]')?.focus({preventScroll:true});
  });
  window.addEventListener("study-resources-updated",()=>{
    const entries = [...tabs.values()].filter(entry=>entry.kind==="file");
    if (entries.length) {
      const files = new Map(window.researchCanvas.resourceContext().files.map(file=>[file.id,file]));
      for (const entry of entries) {
        const file = files.get(entry.fileId);
        if (file) entry.label = file.name;
        else closeTab(entry.id);
      }
    }
    sync();
    const entry = tabs.get(selected);
    if (visible && (entry?.kind==="files" || entry?.kind==="file")) draw(entry);
    if (entry?.kind==="search") {
      body.querySelector(".pt-results")?.replaceWith(window.studyNewTabPage.results(pageOptions(entry)));
    }
  });
  window.studyPaneTabs = {
    showFiles,openFile,
    revealApplication() {
      resumeAfterResources = null;
      dismiss(false);
    },
    beforeResources() {
      resumeAfterResources = visible ? {selected,maximized} : null;
      dismiss(false);
    },
    resourcesClosed(restore) {
      const previous = resumeAfterResources;
      resumeAfterResources = null;
      if (restore && previous && tabs.has(previous.selected)) {
        maximized = previous.maximized;
        activate(previous.selected);
      }
    },
    showSource() {resumeAfterResources=null;dismiss(false);}
  };
})();
