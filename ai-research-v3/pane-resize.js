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
  // Remember the preferred widths of the functional areas, never their
  // temporary rendered sizes. The conversation uses the remaining space.
  // CSS clamps these preferences on smaller screens without changing storage.
  const preferred = {nav:null, function:null};

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

  function renderWidth(name,value) {
    const property=panes[name].property;
    if(value===null)workspace.style.removeProperty(property);
    else workspace.style.setProperty(property,value+"px");
  }
  function notify() {
    sync();
    window.dispatchEvent(new Event("study-pane-resized"));
  }
  function setWidth(name,value) {
    renderWidth(name,value);
    notify();
  }
  function restoreSavedWidths() {
    for(const [name,pane] of Object.entries(panes)) {
      try {
        const stored=localStorage.getItem(storageKey(name));
        const value=Number(stored);
        preferred[name]=stored!==null && Number.isFinite(value) && value>0
          ? clamp(value,pane.min,pane.max) : null;
      } catch {
        // Storage can be unavailable in private or restricted environments.
        // Keep this session's last committed preferences in memory.
      }
      renderWidth(name,preferred[name]);
    }
    notify();
  }
  function commitWidth(name,value) {
    const pane=panes[name];
    preferred[name]=value===null?null:clamp(value,pane.min,pane.max);
    try {
      if(preferred[name]===null)localStorage.removeItem(storageKey(name));
      else localStorage.setItem(storageKey(name),String(preferred[name]));
    } catch {}
    setWidth(name,preferred[name]);
  }
  restoreSavedWidths();

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
    const bounds=limits(name,handle);
    if(bounds.max<=bounds.min)return;
    drag = {handle,name,pointer:event.pointerId,startX:event.clientX,width,lastWidth:width,
      originalPreference:preferred[name], direction:direction(name),
      scale:workspace.offsetWidth/workspace.getBoundingClientRect().width};
    event.preventDefault();
    handle.focus({preventScroll:true});
    handle.setPointerCapture(event.pointerId);
    handle.classList.add("is-resizing");
    workspace.classList.add("is-resizing");
  });

  function move(event) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const delta = (event.clientX-drag.startX) * drag.scale * drag.direction;
    const {min,max}=limits(drag.name,drag.handle);
    const next = clamp(drag.width+delta,min,max);
    if (next === drag.lastWidth) return;
    drag.lastWidth = next;
    setWidth(drag.name,next);
  }
  function finish(event) {
    if (!drag || (event.pointerId != null && event.pointerId !== drag.pointer)) return;
    const completed=event.type==="pointerup";
    if(completed)move(event);
    const {handle,name,pointer,width,lastWidth,originalPreference}=drag;
    const actual=paneElement(name,handle)?.offsetWidth;
    drag=null;
    if(handle.hasPointerCapture(pointer))handle.releasePointerCapture(pointer);
    handle.classList.remove("is-resizing");
    workspace.classList.remove("is-resizing");
    // Only a completed, effective user drag changes the saved preference.
    // Cancelled drags, clicks, or dragging back to the start restore the
    // original preference (which can be wider than a constrained viewport).
    if(completed && lastWidth!==width && Number.isFinite(actual) && actual!==width) {
      commitWidth(name,actual);
    } else {
      setWidth(name,originalPreference);
    }
  }
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", finish);
  document.addEventListener("pointercancel", finish);
  document.addEventListener("lostpointercapture", finish);
  window.addEventListener("blur", finish);
  window.addEventListener("resize", finish);

  workspace.addEventListener("keydown", event => {
    const handle = handleAt(event);
    if (!handle || !["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const name = handle.dataset.resize;
    const {min,max} = limits(name,handle);
    const current=paneElement(name,handle)?.offsetWidth;
    if(!Number.isFinite(current))return;
    let next=current;
    if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    else next += (event.key === "ArrowRight" ? 1 : -1) * direction(name) * 16;
    next=clamp(next,min,max);
    if(next===current)return;
    commitWidth(name,next);
  });
  workspace.addEventListener("dblclick", event => {
    const handle = handleAt(event);
    if (!handle) return;
    const name = handle.dataset.resize;
    if(drag)finish({type:"reset"});
    commitWidth(name,null);
  });

  window.studyPaneResize = {sync};
  window.addEventListener("study-layout-change", event => {
    finish(event);
    notify();
  });
  window.addEventListener("study-view",finish);
  window.addEventListener("pageshow",event=>{
    finish(event);
    restoreSavedWidths();
  });
  window.addEventListener("storage",event=>{
    if(event.key!==null && !Object.keys(panes).some(name=>event.key===storageKey(name)))return;
    finish(event);
    restoreSavedWidths();
  });
  const observer = new ResizeObserver(sync);
  observer.observe(workspace);
  observer.observe(work);
  for(const id of ["pane-tabs-panel","resource-panel","primary-nav"]){
    const panel=document.getElementById(id);if(panel)observer.observe(panel);
  }
  for(const event of ["study-pane-tabs-visibility","study-resources-visibility"])window.addEventListener(event,e=>{
    finish(e);
    queueMicrotask(sync);
  });
  sync();
}());
