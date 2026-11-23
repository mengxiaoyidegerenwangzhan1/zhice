(function () {
  "use strict";

  const work = document.getElementById("work");
  const panel = document.getElementById("resource-panel");
  const preview = document.getElementById("resource-preview");
  const workspace = document.getElementById("workspace");
  const triggerSelector = "[data-resource-trigger]";
  const collapsedGroups = new Set();
  const collapsedMatches = new Set();
  const defaultFileTab = {query:""};
  let lastFileQuery = "";
  let view = null;
  let maximized = false;
  let opener = null;
  let showTimer;
  let hideTimer;

  function trigger() {
    return opener?.isConnected ? opener : work.querySelector(triggerSelector);
  }
  function syncControls() {
    for (const button of work.querySelectorAll(triggerSelector)) {
      button.setAttribute("aria-expanded", String(Boolean(view)));
    }
  }
  function positionPreview() {
    if (preview.hidden) return;
    const button = trigger();
    if (!button || !button.getClientRects().length) {
      hidePreview();
      return;
    }
    const rect = button.getBoundingClientRect();
    const width = preview.offsetWidth;
    const height = preview.offsetHeight;
    const below = rect.bottom + 6;
    const top = below + height <= window.innerHeight - 8 ? below : Math.max(8, rect.top - height - 6);
    preview.style.top = top + "px";
    preview.style.left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)) + "px";
  }
  function hidePreview() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    preview.hidden = true;
  }
  function closePanel(restoreFocus = false, restoreTabs = false) {
    const wasOpen = Boolean(view);
    hidePreview();
    view = null;
    maximized = false;
    panel.hidden = true;
    panel.dataset.maximized = "false";
    workspace.classList.remove("resources-open");
    syncControls();
    if (restoreFocus) trigger()?.focus({preventScroll:true});
    if (wasOpen) {
      window.studyPaneTabs?.resourcesClosed(restoreTabs);
      window.dispatchEvent(new Event("study-resources-visibility"));
    }
  }
  function openFile(file) {
    closePanel();
    window.studyPaneTabs?.showSource();
    window.researchCanvas.openResource(file);
  }
  function render(host, type, showHeader = true, fileTab = defaultFileTab) {
    const query = fileTab.query || "";
    if (type === "all" && query !== lastFileQuery) {
      lastFileQuery = query;
      collapsedMatches.clear();
    }
    const collapsed = type === "all" && query.trim() ? collapsedMatches : collapsedGroups;
    const {files, threadId} = window.researchCanvas.resourceContext();
    window.researchResourceViews.render(host, {
      view:type, threadId, maximized, showHeader,
      files,
      fileQuery:query,
      onFileQueryChange(value) {
        fileTab.query = value;
        render(host, type, showHeader, fileTab);
      },
      expandedGroups:new Set(files.map(file => file.threadId).filter(id => !collapsed.has(id))),
      onToggleGroup(id) {
        if (collapsed.has(id)) collapsed.delete(id);
        else collapsed.add(id);
        render(host, type, showHeader, fileTab);
      },
      onMaximize() {
        maximized = !maximized;
        panel.dataset.maximized = String(maximized);
        render(panel, view);
      },
      onOpenFile:type === "all" && window.studyPaneTabs?.openFile ? window.studyPaneTabs.openFile : openFile,
      onClose:() => closePanel(true, true),
      onBack:() => openPanel("rail"),
      onShowAll:() => openPanel("all")
    });
  }
  function openPanel(type) {
    hidePreview();
    if (type === "all" && window.studyPaneTabs) {
      window.studyPaneTabs.showFiles();
      return;
    }
    const wasOpen = Boolean(view);
    if (!wasOpen) window.studyPaneTabs?.beforeResources();
    view = type;
    maximized = false;
    panel.dataset.view = type;
    panel.dataset.maximized = "false";
    panel.hidden = false;
    workspace.classList.add("resources-open");
    if (!wasOpen) window.dispatchEvent(new Event("study-resources-visibility"));
    syncControls();
    render(panel, type);
    panel.focus({preventScroll:true});
  }
  function showPreview(button) {
    hidePreview();
    if (view || !button.isConnected) return;
    opener = button;
    render(preview, "preview");
    preview.hidden = false;
    positionPreview();
  }
  function dismissSoon() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!preview.contains(document.activeElement)) hidePreview();
    }, 190);
  }
  work.addEventListener("pointerover", event => {
    const button = event.target.closest(triggerSelector);
    if (!button || view || event.pointerType === "touch" || button.contains(event.relatedTarget)) return;
    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    showTimer = setTimeout(() => showPreview(button), 140);
  });
  work.addEventListener("pointerout", event => {
    const button = event.target.closest(triggerSelector);
    if (button && !button.contains(event.relatedTarget) && !preview.contains(event.relatedTarget)) dismissSoon();
  });
  preview.addEventListener("pointerenter", () => clearTimeout(hideTimer));
  preview.addEventListener("pointerleave", event => {
    if (!trigger()?.contains(event.relatedTarget)) dismissSoon();
  });
  preview.addEventListener("focusout", event => {
    if (!preview.contains(event.relatedTarget)) dismissSoon();
  });
  document.addEventListener("pointerdown", event => {
    if (!preview.hidden && !preview.contains(event.target) && !event.target.closest(triggerSelector)) hidePreview();
  });
  work.addEventListener("click", event => {
    const button = event.target.closest(triggerSelector);
    if (!button) return;
    opener = button;
    if (view) closePanel(false, true);
    else openPanel("rail");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && (!preview.hidden || view && (panel.contains(event.target) || event.target.closest(triggerSelector)))) {
      event.preventDefault();
      event.stopPropagation();
      closePanel(true, true);
    }
  }, true);
  function refresh() {
    syncControls();
    if (view) render(panel, view);
    if (!preview.hidden) {
      if (!opener?.isConnected) hidePreview();
      else {
        render(preview, "preview");
        positionPreview();
      }
    }
  }
  window.addEventListener("resize", positionPreview);
  window.addEventListener("study-resources-updated", refresh);
  window.studyResources = {close:closePanel, openFile, renderFiles:(host, fileTab) => render(host, "all", false, fileTab)};
})();
