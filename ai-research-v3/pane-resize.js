(function () {
  "use strict";

  const workspace = document.getElementById("workspace");
  const work = document.getElementById("work");
  const panes = {
    nav: {id:"primary-nav", property:"--nav-w", min:176, max:336, direction:1},
    function: {id:"rc-function-pane", property:"--function-w", min:320, max:1200, direction:-1}
  };
  const widthPrefix = document.documentElement.dataset.prototype==="v3" ? "zhice.navlab.v3.pane-width." : "zhice.navlab.pane-width.";
  const storageKey = name => widthPrefix + name;
  const clamp = (value,min,max) => Math.min(max, Math.max(min, Math.round(value)));
  let drag = null;

  function limits(name) {
    const pane = panes[name];
    let max = pane.max;
    if (name === "function") {
      max = Math.min(max, Math.floor(work.clientWidth / 2), work.clientWidth - 360);
    } else {
      const feature = document.getElementById(panes.function.id);
      if (feature && getComputedStyle(feature).position !== "absolute" && !workspace.classList.contains("rc-function-expanded")) {
        max = Math.min(max, workspace.clientWidth - Math.max(701, feature.offsetWidth + 360));
      }
    }
    return {min:pane.min, max:Math.max(pane.min, max)};
  }

  function sync() {
    for (const handle of workspace.querySelectorAll("[data-resize]")) {
      if (!handle.getClientRects().length) continue;
      const name = handle.dataset.resize;
      const {min,max} = limits(name);
      const width = document.getElementById(panes[name].id).offsetWidth;
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
      if (saved !== null && Number.isFinite(width) && width >= pane.min && width <= pane.max) {
        workspace.style.setProperty(pane.property, Math.round(width)+"px");
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
    const width = document.getElementById(panes[name].id).offsetWidth;
    drag = {handle,name,pointer:event.pointerId,startX:event.clientX,width,lastWidth:width,
      scale:workspace.offsetWidth/workspace.getBoundingClientRect().width,...limits(name)};
    event.preventDefault();
    handle.focus({preventScroll:true});
    handle.setPointerCapture(event.pointerId);
    handle.classList.add("is-resizing");
    workspace.classList.add("is-resizing");
  });

  function move(event) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const delta = (event.clientX-drag.startX) * drag.scale * panes[drag.name].direction;
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
    const {min,max} = limits(name);
    let next = document.getElementById(pane.id).offsetWidth;
    if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    else next += (event.key === "ArrowRight" ? 1 : -1) * pane.direction * 16;
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
  const observer = new ResizeObserver(sync);
  observer.observe(workspace);
  observer.observe(work);
  sync();
}());
