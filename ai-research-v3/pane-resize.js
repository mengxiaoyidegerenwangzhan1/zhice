(function () {
  "use strict";

  const workspace = document.getElementById("workspace");
  const work = document.getElementById("work");
  const panes = {
    nav: {id:"primary-nav", property:"--nav-w", min:176, max:336, direction:1},
    function: {id:"rc-function-pane", property:"--function-w", min:480, max:Number.MAX_SAFE_INTEGER, direction:-1}
  };
  const externalDivider=document.createElement("div");
  externalDivider.className="pane-divider external-content-divider";
  externalDivider.dataset.resize="function";
  externalDivider.setAttribute("role","separator");
  externalDivider.setAttribute("aria-orientation","vertical");
  externalDivider.setAttribute("aria-label","调整内容区宽度");
  externalDivider.title="拖动调整内容区宽度，双击恢复默认";
  externalDivider.tabIndex=0;
  externalDivider.hidden=true;
  workspace.append(externalDivider);
  function externalContent(){
    if(workspace.classList.contains("pane-tabs-open"))return document.getElementById("pane-tabs-panel");
    if(workspace.classList.contains("resources-open")){
      const panel=document.getElementById("resource-panel");
      if(panel?.dataset.view==="all")return panel;
    }
    return null;
  }
  const paneElement=(name,handle)=>document.getElementById(handle?.getAttribute("aria-controls") || panes[name].id);
  function availableWidth(){
    return workspace.clientWidth-(workspace.classList.contains("nav-collapsed")?0:document.getElementById("primary-nav").offsetWidth);
  }
  function syncExternalDivider(){
    const target=externalContent();
    const visible=target && !target.hidden && target.dataset.maximized!=="true" && availableWidth()>=760 && getComputedStyle(target).position!=="absolute";
    externalDivider.hidden=!visible;
    if(!visible)return;
    externalDivider.setAttribute("aria-controls",target.id);
    const edge=target.offsetLeft+(workspace.dataset.conversationPosition==="right"?target.offsetWidth:0);
    externalDivider.style.left=(edge-4.5)+"px";
  }
  const widthPrefix = document.documentElement.dataset.prototype==="v3" ? "zhice.navlab.v3.pane-width." : "zhice.navlab.pane-width.";
  const storageKey = name => widthPrefix + name;
  const clamp = (value,min,max) => Math.min(max, Math.max(min, Math.round(value)));
  let drag = null;

  function direction(name) {
    return name === "function" && workspace.dataset.conversationPosition === "right" ? 1 : panes[name].direction;
  }

  function limits(name,handle) {
    const pane = panes[name];
    let max = pane.max;
    if (name === "function") {
      max = (handle===externalDivider?availableWidth():work.clientWidth)-280;
    } else if (workspace.classList.contains("has-main-split")) {
      max = Math.min(max,workspace.clientWidth-760);
    }
    return {min:pane.min, max:Math.max(pane.min, max)};
  }

  function sync() {
    syncExternalDivider();
    for (const handle of workspace.querySelectorAll("[data-resize]")) {
      if (!handle.getClientRects().length) continue;
      const name = handle.dataset.resize;
      const {min,max} = limits(name,handle);
      const target=paneElement(name,handle);
      if(!target)continue;
      const width = target.offsetWidth;
      handle.setAttribute("aria-valuemin", String(min));
      handle.setAttribute("aria-valuemax", String(max));
      handle.setAttribute("aria-valuenow", String(clamp(width,min,max)));
      handle.setAttribute("aria-valuetext", width + " 像素");
    }
  }

  function setWidth(name, value) {
    workspace.style.setProperty(panes[name].property, value+"px");
    sync();
    window.dispatchEvent(new Event("study-pane-resized"));
  }
  function save(name) {
    const value = parseInt(workspace.style.getPropertyValue(panes[name].property), 10);
    if (Number.isFinite(value)) {
      try { localStorage.setItem(storageKey(name), String(value)); } catch {}
    }
  }
  for (const [name,pane] of Object.entries(panes)) {
    try {
      const saved = localStorage.getItem(storageKey(name));
      const width = Number(saved);
      if (saved !== null && Number.isFinite(width) && width > 0) {
        workspace.style.setProperty(pane.property, clamp(width,pane.min,pane.max)+"px");
      }
    } catch {}
  }

  function handleAt(event) {
    return event.target.closest?.("[data-resize]");
  }
  workspace.addEventListener("pointerdown", event => {
    const handle = handleAt(event);
    if (!handle || drag || !event.isPrimary || event.button !== 0) return;
    const name = handle.dataset.resize;
    const target=paneElement(name,handle);
    if(!target)return;
    const width = target.offsetWidth;
    drag = {handle,name,pointer:event.pointerId,startX:event.clientX,width,lastWidth:width,
      scale:workspace.offsetWidth/workspace.getBoundingClientRect().width,...limits(name,handle)};
    event.preventDefault();
    handle.focus({preventScroll:true});
    handle.setPointerCapture(event.pointerId);
    handle.classList.add("is-resizing");
    workspace.classList.add("is-resizing");
  });

  function move(event) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const delta = (event.clientX-drag.startX) * drag.scale * direction(drag.name);
    const next = clamp(drag.width+delta, drag.min, drag.max);
    if (next === drag.lastWidth) return;
    drag.lastWidth = next;
    setWidth(drag.name,next);
  }
  function finish(event) {
    if (!drag || (event.pointerId != null && event.pointerId !== drag.pointer)) return;
    if (event.type === "pointerup") move(event);
    const {handle,name,pointer,width,lastWidth} = drag;
    drag = null;
    if (handle.hasPointerCapture(pointer)) handle.releasePointerCapture(pointer);
    handle.classList.remove("is-resizing");
    workspace.classList.remove("is-resizing");
    if (lastWidth !== width) save(name);
  }
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish);
  document.addEventListener("pointercancel", finish);
  document.addEventListener("lostpointercapture", finish);
  window.addEventListener("blur", finish);

  workspace.addEventListener("keydown", event => {
    const handle = handleAt(event);
    if (!handle || !["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const name = handle.dataset.resize;
    const pane = panes[name];
    const {min,max} = limits(name,handle);
    let next = paneElement(name,handle).offsetWidth;
    if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    else next += (event.key === "ArrowRight" ? 1 : -1) * direction(name) * 16;
    setWidth(name,clamp(next,min,max));
    save(name);
  });
  workspace.addEventListener("dblclick", event => {
    const handle = handleAt(event);
    if (!handle) return;
    const name = handle.dataset.resize;
    workspace.style.removeProperty(panes[name].property);
    try { localStorage.removeItem(storageKey(name)); } catch {}
    sync();
    window.dispatchEvent(new Event("study-pane-resized"));
  });

  window.studyPaneResize = {sync};
  window.addEventListener("study-layout-change", event => {
    finish(event);
    sync();
    window.dispatchEvent(new Event("study-pane-resized"));
  });
  const observer = new ResizeObserver(sync);
  observer.observe(workspace);
  observer.observe(work);
  for(const id of ["pane-tabs-panel","resource-panel","primary-nav"]){
    const panel=document.getElementById(id);if(panel)observer.observe(panel);
  }
  for(const event of ["study-pane-tabs-visibility","study-resources-visibility"])window.addEventListener(event,()=>queueMicrotask(sync));
  sync();
}());
