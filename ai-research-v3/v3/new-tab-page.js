(function () {
  "use strict";

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  const paths = {
    search: "M14.7 14.7 20 20 M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z",
    folder: "M3 8V6a1.5 1.5 0 0 1 1.5-1.5h4.3L11 7h7.5A1.5 1.5 0 0 1 20 8.5V10 M4.5 9.5h15A1.5 1.5 0 0 1 21 11.3l-1 6.2a2 2 0 0 1-2 1.7H5a2 2 0 0 1-2-2V11a1.5 1.5 0 0 1 1.5-1.5Z"
  };
  function icon(type) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [key, value] of Object.entries({
      viewBox:"0 0 24 24", width:"20", height:"20", fill:"none", stroke:"currentColor",
      "stroke-width":"1.8", "stroke-linecap":"round", "stroke-linejoin":"round", "aria-hidden":"true"
    })) svg.setAttribute(key, value);
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", paths[type]);
    svg.append(path);
    return svg;
  }

  function address(value) {
    if (!value || /[\s\\]/.test(value)) return null;
    const explicit = /^https?:\/\//i.test(value);
    if (!explicit && !/^(?:\[[a-f0-9:]+\]|(?:[\p{L}\p{N}-]+\.)+[\p{L}\p{N}-]+|localhost)(?::\d+)?(?:[/?#]|$)/iu.test(value)) return null;
    try {
      const url = new URL(explicit ? value : "https://" + value);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
      return url;
    } catch {
      return null;
    }
  }

  function searchForm(options) {
    const form = element("form", "pt-search");
    form.setAttribute("role", "search");
    form.setAttribute("aria-label", "搜索或输入网址");
    const submit = element("button", "pt-search-submit");
    submit.type = "submit";
    submit.setAttribute("aria-label", "搜索或打开网址");
    submit.append(icon("search"));
    const input = element("input");
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "搜索或输入网址";
    input.setAttribute("aria-label", input.placeholder);
    input.enterKeyHint = "go";
    input.value = options.entry.query || options.entry.url || "";
    form.addEventListener("submit", event => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) {
        input.focus();
        return;
      }
      const isFilename = options.files.some(file => normalize(file.name) === normalize(value));
      const url = isFilename ? null : address(value);
      if (url) options.onVisitUrl(url.href);
      else options.onSearch(value);
    });
    form.append(submit, input);
    return form;
  }

  function normalize(value) {
    return String(value || "").normalize("NFKC").toLowerCase().trim();
  }
  function results(options) {
    const list = element("div", "pt-results");
    const terms = normalize(options.entry.query).split(/\s+/).filter(Boolean);
    function appendGroup(heading, items, name, detail, keywords, activate) {
      const section = element("section", "pt-result-group");
      section.append(element("h3", "pt-result-heading", heading));
      for (const item of items) {
        const haystack = normalize(keywords(item));
        if (!terms.every(term => haystack.includes(term))) continue;
        const button = element("button", "pt-result");
        button.type = "button";
        button.append(element("span", "pt-result-name", name(item)), element("small", "pt-result-detail", detail(item)));
        button.addEventListener("click", () => activate(item));
        section.append(button);
      }
      if (section.childElementCount > 1) list.append(section);
    }
    appendGroup("投研应用", options.tools, tool => tool.title, tool => tool.path,
      tool => [tool.title, tool.path, tool.aliases].filter(Boolean).join(" "), options.onVisitTool);
    appendGroup("文件", options.files, file => file.name, file => file.threadTitle,
      file => file.name, options.onVisitFile);
    if (!list.childElementCount) list.append(element("p", "pt-search-empty", "没有找到匹配的投研应用或文件"));
    return list;
  }

  function render(host, options) {
    const {entry} = options;
    const isNew = entry.kind === "new";
    const page = element("section", isNew ? "pt-new-page" : "pt-search-page");
    page.setAttribute("aria-label", isNew ? "新标签页" : entry.kind === "search" ? "搜索结果" : "网址");
    const actions = element("div", "pt-new-actions");
    actions.append(searchForm(options));
    if (isNew) {
      const files = element("button", "pt-files");
      files.type = "button";
      files.append(icon("folder"), element("span", "", "所有文件"));
      files.addEventListener("click", options.onOpenFiles);
      actions.append(files);
    }
    page.append(actions);
    if (entry.kind === "search") page.append(results(options));
    if (entry.kind === "url") {
      const url = address(entry.url);
      if (url) {
        const card = element("div", "pt-address");
        const link = element("a", "pt-address-link", "在浏览器打开");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        card.append(element("span", "pt-address-url", url.href), link);
        page.append(card);
      }
    }
    host.replaceChildren(page);
  }

  window.studyNewTabPage = {render,results};
})();
