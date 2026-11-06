(function () {
  const views = [
    { id: "overview", label: "产品概览", file: "A804FD9E-C5D9-4338-9CB6-4BE6A3E729F1.svg", width: 1920, height: 3984 },
    { id: "returns", label: "收益", file: "D103D659-58B6-4FD4-8AF0-E2D19E15BE33.svg", width: 1940, height: 2453, contentX: 10, contentY: 6, contentWidth: 1920, contentHeight: 2447 },
    { id: "risk", label: "风险", file: "C1A39EB2-B171-4207-B628-9F21C10957D2.svg", width: 1920, height: 3079 },
    { id: "holdings", label: "持仓分析", file: "035CEF79-654D-40E1-B421-416137A68FAC.svg", width: 1920, height: 7094 },
    { id: "attribution", label: "收益归因", file: "24FF1A25-C513-4D2B-8B69-3BD1C17FC510.svg", width: 1920, height: 2833 },
    { id: "manager", label: "基金经理", file: "91D4B3BC-A677-435E-9667-464E2ED1E95B.svg", width: 1920, height: 1640 },
    { id: "company", label: "基金公司", file: "DD883841-EEA7-41E9-8C53-DB385AC58DF4.svg", width: 1920, height: 1640 },
    { id: "basics", label: "基本信息", file: "4EC10721-A9A4-4168-823A-B78D26DBB8C0.svg", width: 1920, height: 2422 }
  ];

  const byId = Object.fromEntries(views.map((item) => [item.id, item]));
  // 画板设计坐标：与 8 个 SVG 中 tab 文字真实位置对齐（文字 14px，4 字宽 56、2 字宽 28，两侧各留 8px 命中余量）
  const tabLayout = {
    overview: { left: 322, width: 72 },
    returns: { left: 410, width: 44 },
    risk: { left: 470, width: 44 },
    holdings: { left: 530, width: 72 },
    attribution: { left: 618, width: 72 },
    manager: { left: 706, width: 72 },
    company: { left: 794, width: 72 },
    basics: { left: 882, width: 72 }
  };
  const tabTop = 220; // 设计坐标 y：覆盖文字（基线约 239）与选中下划线（约 248）
  const tabHeight = 34;

  function template(view) {
    const active = byId[view] ? view : "overview";
    document.body.classList.add("fund-sketch-mode");
    return `<div class="fund-sketch-page" data-fund-view="${active}">
      <main class="fund-sketch-stage" aria-label="基金分析 · ${byId[active].label}">
        <div class="fund-sketch-loading" role="status">正在载入 Sketch 画板...</div>
      </main>
    </div>`;
  }

  const sketchHeaderHeight = 56;

  function getFrame(item) {
    const headerHeight = item.headerHeight || sketchHeaderHeight;
    const contentHeight = item.contentHeight || item.height;
    return {
      width: item.contentWidth || item.width,
      height: contentHeight - headerHeight,
      headerHeight,
      contentX: item.contentX || 0,
      contentY: item.contentY || 0
    };
  }

  function renderLocalSvg(stage, active, item) {
    const frame = getFrame(item);
    const object = document.createElement("object");
    object.className = "fund-sketch-object";
    object.type = "image/svg+xml";
    object.data = `./assets/fund-sketch/${item.file}?v=16`;
    object.setAttribute("aria-label", `基金分析 · ${item.label}`);
    object.style.width = `${item.width / frame.width * 100}%`;
    object.style.height = `${item.height / frame.height * 100}%`;
    object.style.left = `${-frame.contentX / frame.width * 100}%`;
    object.style.top = `${-(frame.contentY + frame.headerHeight) / frame.height * 100}%`;
    stage.style.aspectRatio = `${frame.width} / ${frame.height}`;
    stage.replaceChildren(object);
    createHotspots(stage, active, frame, item);
  }

  function createHotspots(stage, active, frame, currentView) {
    const layer = document.createElement("nav");
    layer.className = "fund-sketch-hotspots";
    layer.setAttribute("aria-label", "基金分析页面");

    views.forEach((item) => {
      const layout = tabLayout[item.id];
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", item.label);
      if (item.id === active) button.setAttribute("aria-current", "page");
      button.style.left = `${(layout.left - frame.contentX) / frame.width * 100}%`;
      button.style.top = `${(tabTop - frame.contentY - frame.headerHeight) / frame.height * 100}%`;
      button.style.width = `${layout.width / frame.width * 100}%`;
      button.style.height = `${tabHeight / frame.height * 100}%`;
      button.onclick = () => {
        if (item.id !== active) location.hash = `#/fund/000001?view=${item.id}`;
      };
      layer.appendChild(button);
    });

    stage.appendChild(layer);
  }

  async function renderCharts() {
    const page = document.querySelector(".fund-sketch-page");
    const stage = page?.querySelector(".fund-sketch-stage");
    if (!page || !stage) return;

    const active = page.dataset.fundView;
    const item = byId[active] || byId.overview;

    if (location.protocol === "file:") {
      renderLocalSvg(stage, active, item);
      return;
    }

    try {
      const response = await fetch(`./assets/fund-sketch/${item.file}?v=16`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
      const svg = parsed.documentElement;
      if (svg.nodeName.toLowerCase() !== "svg" || parsed.querySelector("parsererror")) throw new Error("SVG parse failed");
      if (!stage.isConnected || page.dataset.fundView !== active) return;

      parsed.querySelectorAll('[id="PageHeader基金分析"]').forEach((header) => header.remove());
      const viewBox = (svg.getAttribute("viewBox") || `0 0 1920 ${item.height}`).split(/\s+/).map(Number);
      const [x, y] = viewBox;
      const frame = getFrame(item);
      svg.setAttribute("viewBox", `${x + frame.contentX} ${y + frame.contentY + frame.headerHeight} ${frame.width} ${frame.height}`);
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.classList.add("fund-sketch-artboard");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", `基金分析 · ${item.label}`);
      stage.replaceChildren(document.importNode(svg, true));
      createHotspots(stage, active, frame, item);
    } catch (error) {
      stage.innerHTML = `<div class="fund-sketch-error"><strong>Sketch 画板载入失败</strong><span>${String(error.message || error)}</span></div>`;
    }
  }

  window.FundAnalysisView = { template, renderCharts, views: views.map(({ id, label }) => [id, label]) };
})();
