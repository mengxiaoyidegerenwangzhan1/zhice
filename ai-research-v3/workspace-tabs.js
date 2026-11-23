(function () {
  "use strict";

  function escape(value) {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value).replace(/[&<>"']/g, char => entities[char]);
  }

  // Keep share classes distinguishable even when long fund names are truncated.
  function caption(label) {
    const parts = label.match(/^(.*[\u3400-\u9fff\d）)])([A-Z])$/u);
    const name = escape(parts ? parts[1] : label);
    const suffix = parts ? '<span class="rc-tab-suffix">' + parts[2] + '</span>' : "";
    return '<span class="rc-tab-caption"><span class="rc-tab-stem">' + name + '</span>' + suffix + '</span>';
  }

  function tabButton(id, label, selected, css, content) {
    return '<button type="button" class="' + css + '" data-workspace-tab="' + escape(id) +
      '" role="tab" aria-selected="' + selected + '" aria-controls="rc-feature-panel" tabindex="' +
      (selected ? "0" : "-1") + '" aria-label="' + escape(label) + '" title="' + escape(label) + '">' + content + '</button>';
  }

  function header(title, tabs, activeId) {
    if (!tabs.length) return '<h1 class="rc-parent-title" tabindex="-1" title="' + escape(title) + '">' + escape(title) + '</h1>';
    const items = tabs.map(tab => {
      const selected = tab.id === activeId;
      const open = tabButton(tab.id, tab.label, selected, "rc-workspace-open", caption(tab.label));
      const close = '<button type="button" class="rc-workspace-close" data-workspace-close="' + escape(tab.id) +
        '" aria-label="关闭' + escape(tab.label) + '" title="关闭标签页" tabindex="' + (selected ? '0' : '-1') +
        '"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>';
      return '<span class="rc-workspace-item' + (selected ? ' is-active' : '') + '">' + open + close + '</span>';
    }).join("");
    return '<div class="rc-workspace-pages" role="tablist" aria-label="' + escape(title) + '页面">' +
      '<h1 class="rc-parent-title">' + tabButton("", title, !activeId, "rc-workspace-home", caption(title)) + '</h1>' +
      '<div class="rc-workspace-strip">' + items + '</div></div>';
  }

  function sync(headerElement, focus = false) {
    if (!headerElement) return;
    const active = headerElement.querySelector('[data-workspace-tab][aria-selected="true"]');
    if (!active) {
      if (focus) headerElement.querySelector(".rc-parent-title")?.focus({ preventScroll: true });
      return;
    }
    if (focus) active.focus({ preventScroll: true });
    const item = active.closest(".rc-workspace-item");
    if (!item) return;
    const strip = item.parentElement;
    const bounds = item.getBoundingClientRect();
    const viewport = strip.getBoundingClientRect();
    if (bounds.right > viewport.right - 8) strip.scrollLeft += bounds.right - viewport.right + 8;
    else if (bounds.left < viewport.left + 8) strip.scrollLeft += bounds.left - viewport.left - 8;
  }

  document.addEventListener("keydown", event => {
    const tab = event.target.closest?.("[data-workspace-tab]");
    if (!tab || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const group = tab.closest(".rc-workspace-pages");
    if (!group) return;
    const tabs = Array.from(group.querySelectorAll("[data-workspace-tab]"));
    const index = tabs.indexOf(tab);
    let target;
    switch (event.key) {
      case "ArrowRight": target = tabs[(index + 1) % tabs.length]; break;
      case "ArrowLeft": target = tabs[(index + tabs.length - 1) % tabs.length]; break;
      case "Home": target = tabs[0]; break;
      case "End": target = tabs[tabs.length - 1]; break;
      default: return;
    }
    event.preventDefault();
    target.click();
    sync(document.querySelector(".rc-function-head"), true);
  });

  window.studyWorkspaceTabs = { header, sync };
})();
