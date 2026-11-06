import { snapshot } from "./data/snapshot.js";

const colors = {
  ink: "#1E1E1E",
  muted: "#5E5E5E",
  quiet: "#808080",
  line: "#CCCCCC",
  soft: "#E5E5E5",
  blue: "#1F55AF",
  blue2: "#7092CC",
  blue3: "#B7C9E5",
  orange: "#EF7622",
  green: "#518428",
  financeGreen: "#518428",
  red: "#A50032",
  burgundy: "#A50032",
  warm: "#F7F5F2",
  paleBlue: "#F4F9FF"
};

const charts = [];

function signed(value, digits = 2) {
  if (value == null) return "—";
  return `${value > 0 ? "+" : ""}${Number(value).toFixed(digits)}%`;
}

function signedNumber(value, digits = 2) {
  if (value == null) return "—";
  return `${value > 0 ? "+" : ""}${Number(value).toFixed(digits)}`;
}

function valueClass(value) {
  return value > 0 ? "positive" : value < 0 ? "negative" : "";
}

function setGroupActive(container, button) {
  container.querySelectorAll("button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
}

function initializeGroup(container) {
  container.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
  });
}

function initSimpleControls() {
  document.querySelectorAll(".segmented").forEach((group) => {
    if (["risk-period", "compare-mode", "compare-period", "result-view"].includes(group.id)) return;
    initializeGroup(group);
    group.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => setGroupActive(group, button));
    });
  });
}

function initNavigation() {
  const buttons = [...document.querySelectorAll("[data-target]")];
  const sections = [...document.querySelectorAll("[data-spy-section]")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    document.querySelectorAll(".main-nav .nav-item").forEach((item) => {
      const active = item.dataset.target === visible.target.id;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }, { rootMargin: "-20% 0px -68% 0px", threshold: [0, 0.2, 0.5] });
  sections.forEach((section) => observer.observe(section));
}

function renderFoundation() {
  const swatches = [
    ["主研究", colors.blue], ["股票", colors.blue], ["债券", colors.orange],
    ["现金", colors.green], ["商品", colors.burgundy], ["上涨", colors.red],
    ["下跌", colors.financeGreen], ["弱底", colors.warm], ["当前列", colors.paleBlue]
  ];
  document.getElementById("swatch-list").innerHTML = swatches.map(([name, color]) => `
    <div class="swatch"><span class="swatch-color" style="background:${color}"></span><span><b>${name}</b><small>${color}</small></span></div>
  `).join("");
}

function renderHome() {
  document.getElementById("market-strip").innerHTML = snapshot.market.indices.map((item) => `
    <article class="market-item">
      <span>${item.name}</span>
      <strong>${item.value.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</strong>
      <em class="${valueClass(item.change)}">${item.delta > 0 ? "+" : ""}${item.delta.toFixed(2)} · ${signed(item.change)}</em>
      <div class="micro-bars" aria-hidden="true"><i style="height:34%"></i><i style="height:48%"></i><i style="height:42%"></i><i style="height:67%"></i><i style="height:58%"></i><i style="height:78%"></i><i style="height:72%"></i></div>
    </article>
  `).join("");

  const flows = [8.42, 6.18, 5.73, -2.14, 4.91, 3.86];
  const sizes = [69.52, 40.60, 25.48, 18.26, 15.72, 12.38];
  document.querySelector("#etf-ranking-table tbody").innerHTML = snapshot.market.etf.slice(0, 5).map((item, index) => `
    <tr><td><button class="table-link" type="button">${item.name}</button></td><td>${item.group}</td><td class="number ${valueClass(flows[index])}">${signedNumber(flows[index])}</td><td class="number">${sizes[index].toFixed(2)} 亿</td></tr>
  `).join("");
}

function renderFundIdentity() {
  const fund = snapshot.fund;
  document.getElementById("fund-identity").innerHTML = `
    <div><div class="fund-name-line"><h3>${fund.name}</h3><span>${fund.code}</span><button class="icon-button light" type="button" aria-label="加入自选"><i data-lucide="heart"></i></button></div><p>${fund.category} · ${fund.style} · 成立于 ${fund.inception}</p><div class="fund-tags"><span>中国股票</span><span>主动权益</span><span>大盘成长</span></div></div>
    <dl><div><dt>基金公司</dt><dd>${fund.company}</dd></div><div><dt>法定基准</dt><dd>${fund.benchmark}</dd></div></dl>
  `;
}

function renderBenchmarks() {
  document.getElementById("benchmark-grid").innerHTML = snapshot.fund.benchmarks.map((item, index) => `
    <article class="benchmark-col ${index === 0 ? "is-selected" : ""}" tabindex="0">
      <div class="benchmark-type">${item.type}${index === 0 ? " · 推荐" : ""}</div>
      <div class="benchmark-name">${item.name}</div>
      <div class="benchmark-metrics">
        <span>拟合优度 R²<strong>${item.r2 == null ? "—" : item.r2.toFixed(2)}</strong></span>
        <span>Beta<strong>${item.beta == null ? "—" : item.beta.toFixed(2)}</strong></span>
        <span>Alpha<strong class="${valueClass(item.alpha)}">${item.alpha == null ? "—" : signed(item.alpha)}</strong></span>
        <span>年化超额<strong class="${valueClass(item.excess)}">${item.excess == null ? "—" : signed(item.excess)}</strong></span>
      </div>
    </article>
  `).join("");
  document.querySelectorAll(".benchmark-col").forEach((column) => column.addEventListener("click", () => {
    document.querySelectorAll(".benchmark-col").forEach((item) => item.classList.toggle("is-selected", item === column));
  }));
}

function baseChartOption() {
  return {
    animationDuration: 320,
    textStyle: { fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif', color: colors.ink },
    tooltip: { trigger: "axis", backgroundColor: "rgba(30,30,30,.94)", borderWidth: 0, textStyle: { color: "#fff", fontSize: 12 }, padding: [8, 10] },
    grid: { left: 46, right: 20, top: 32, bottom: 42, containLabel: false },
    xAxis: { axisLine: { lineStyle: { color: colors.line } }, axisTick: { show: false }, axisLabel: { color: colors.muted, fontSize: 11 }, splitLine: { show: false } },
    yAxis: { axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: colors.muted, fontSize: 11 }, splitLine: { lineStyle: { color: colors.soft } } }
  };
}

function buildPeerPoints() {
  return Array.from({ length: 148 }, (_, index) => {
    const phase = index * 2.399963;
    const radius = Math.sqrt((index + 4) / 152);
    const x = 21.1 + Math.cos(phase) * 10.4 * radius + Math.sin(index * .37) * .9;
    const y = 17.2 + (x - 21.1) * .52 + Math.sin(phase) * 11.8 * radius + Math.cos(index * .29) * .7;
    return [Number(Math.max(10.4, Math.min(34.2, x)).toFixed(1)), Number(Math.max(-3.2, Math.min(34.8, y)).toFixed(1))];
  });
}

function renderRiskScatter(period = "近3年") {
  const multipliers = { "近1年": 0.72, "近3年": 1, "近5年": 1.16 };
  const mult = multipliers[period];
  const option = baseChartOption();
  Object.assign(option, {
    tooltip: { trigger: "item", formatter: (params) => `${params.seriesName}<br/>年化波动 ${params.value[0]}%<br/>年化回报 ${params.value[1]}%`, backgroundColor: "rgba(30,30,30,.94)", borderWidth: 0, textStyle: { color: "#fff" } },
    grid: { left: 50, right: 34, top: 14, bottom: 48 },
    xAxis: { ...option.xAxis, name: "年化波动 %", min: 10, max: 35, interval: 5, nameLocation: "middle", nameGap: 30, splitLine: { show: true, lineStyle: { color: colors.soft } } },
    yAxis: { ...option.yAxis, name: "年化回报 %", min: -5, max: 35, interval: 10, nameGap: 12 },
    legend: { show: false },
    series: [
      { name: "同类样本", type: "scatter", symbolSize: 4, silent: true, data: buildPeerPoints().map(([x, y]) => [x, Number((y * mult).toFixed(1))]), itemStyle: { color: "rgba(128,128,128,.23)" }, emphasis: { disabled: true } },
      { name: "同类平均", type: "scatter", symbol: "diamond", symbolSize: 13, data: [[21.1, Number((17.2 * mult).toFixed(1))]], itemStyle: { color: "#D9A72D", borderColor: "#fff", borderWidth: 1.5 }, label: { show: true, formatter: "同类平均", position: "bottom", distance: 8, color: colors.muted, fontSize: 10 }, z: 5, markLine: { silent: true, symbol: "none", label: { show: false }, lineStyle: { color: colors.line, type: "dashed" }, data: [{ xAxis: 21.1 }, { yAxis: Number((17.2 * mult).toFixed(1)) }] } },
      { name: snapshot.fund.name, type: "scatter", symbolSize: 16, data: [[22.4, Number((18.7 * mult).toFixed(1))]], itemStyle: { color: colors.blue, borderColor: "#fff", borderWidth: 2 }, label: { show: true, formatter: "本基金", position: "top", distance: 8, color: colors.blue, fontSize: 10, fontWeight: 600 }, z: 6 },
      { name: "沪深300", type: "scatter", symbolSize: 14, data: [[17.9, Number((15.4 * mult).toFixed(1))]], itemStyle: { color: "#fff", borderColor: colors.burgundy, borderWidth: 2 }, label: { show: true, formatter: "沪深300", position: "left", distance: 8, color: colors.burgundy, fontSize: 10 }, z: 5 }
    ]
  });
  setChart("risk-scatter", option);
}

function timelineData(mult = 1) {
  const dates = ["2023-09", "2023-12", "2024-03", "2024-06", "2024-09", "2024-12", "2025-03", "2025-06", "2025-09", "2025-12", "2026-03", "2026-06"];
  return {
    dates,
    volatility: [24, 27, 25, 29, 31, 28, 26, 24, 28, 33, 30, 27].map((v) => +(v * mult).toFixed(1)),
    peerVolatility: [21, 22, 21, 23, 24, 23, 22, 21, 22, 24, 23, 22].map((v) => +(v * mult).toFixed(1)),
    drawdown: [-5, -9, -14, -12, -18, -21, -16, -23, -19, -27, -22, -17].map((v) => +(v * mult).toFixed(1)),
    benchmarkDrawdown: [-4, -7, -11, -9, -14, -16, -12, -18, -15, -22, -18, -13].map((v) => +(v * mult).toFixed(1))
  };
}

function renderRiskTimeline(period = "近3年") {
  const mult = { "近1年": 0.78, "近3年": 1, "近5年": 1.12 }[period];
  const data = timelineData(mult);
  const currentVol = data.volatility.at(-1);
  const maxDrawdown = Math.min(...data.drawdown);
  document.getElementById("risk-metric-strip").innerHTML = `
    <div><span>当前年化波动</span><strong>${currentVol.toFixed(1)}%</strong><small>同类 22.0%</small></div>
    <div><span>波动同类分位</span><strong>67%</strong><small>数值越低越稳</small></div>
    <div><span>区间最大回撤</span><strong class="negative">${maxDrawdown.toFixed(1)}%</strong><small>沪深300 -22.0%</small></div>
    <div><span>最长修复期</span><strong>184 天</strong><small>效果数据</small></div>`;
  const option = baseChartOption();
  Object.assign(option, {
    tooltip: { ...option.tooltip, trigger: "axis", axisPointer: { type: "line", lineStyle: { color: colors.line } } },
    grid: [{ left: 50, right: 20, top: 38, height: "31%" }, { left: 50, right: 20, top: "63%", height: "23%" }],
    legend: { top: 0, right: 12, itemWidth: 18, itemHeight: 3, textStyle: { fontSize: 10, color: colors.muted } },
    xAxis: [
      { type: "category", data: data.dates, gridIndex: 0, boundaryGap: false, axisLabel: { show: false }, axisTick: { show: false }, axisLine: { lineStyle: { color: colors.line } } },
      { type: "category", data: data.dates, gridIndex: 1, boundaryGap: false, axisLabel: { color: colors.muted, fontSize: 10, interval: 2 }, axisTick: { show: false }, axisLine: { lineStyle: { color: colors.line } } }
    ],
    yAxis: [
      { type: "value", gridIndex: 0, name: "波动率", axisLabel: { formatter: "{value}%", color: colors.muted, fontSize: 10 }, splitLine: { lineStyle: { color: colors.soft } } },
      { type: "value", gridIndex: 1, name: "回撤", max: 0, axisLabel: { formatter: "{value}%", color: colors.muted, fontSize: 10 }, splitLine: { lineStyle: { color: colors.soft } } }
    ],
    series: [
      { name: "本基金波动", type: "line", data: data.volatility, xAxisIndex: 0, yAxisIndex: 0, showSymbol: false, lineStyle: { width: 2, color: colors.blue }, itemStyle: { color: colors.blue }, markPoint: { symbolSize: 34, data: [{ coord: [data.dates.at(-1), currentVol], value: `${currentVol}%` }], label: { color: "#fff", fontSize: 9 }, itemStyle: { color: colors.blue } } },
      { name: "同类波动", type: "line", data: data.peerVolatility, xAxisIndex: 0, yAxisIndex: 0, showSymbol: false, lineStyle: { width: 1.4, color: colors.quiet, type: "dashed" }, itemStyle: { color: colors.quiet } },
      { name: "本基金回撤", type: "line", data: data.drawdown, xAxisIndex: 1, yAxisIndex: 1, showSymbol: false, lineStyle: { width: 1.8, color: colors.burgundy }, areaStyle: { color: "rgba(165,0,50,.10)" }, itemStyle: { color: colors.burgundy }, markPoint: { symbolSize: 36, data: [{ coord: [data.dates[data.drawdown.indexOf(maxDrawdown)], maxDrawdown], value: `${maxDrawdown}%` }], label: { color: "#fff", fontSize: 9 }, itemStyle: { color: colors.burgundy } } },
      { name: "沪深300回撤", type: "line", data: data.benchmarkDrawdown, xAxisIndex: 1, yAxisIndex: 1, showSymbol: false, lineStyle: { width: 1.3, color: colors.orange, type: "dashed" }, itemStyle: { color: colors.orange } }
    ]
  });
  setChart("risk-timeline", option);
}

function renderAssetBars() {
  document.getElementById("asset-bars").innerHTML = `
    <div class="asset-head"><span>资产</span><span class="asset-scale"><i>0</i><i>50%</i><i>100%</i></span><b>本基金</b><b>同类</b><b>相差</b></div>
    ${snapshot.fund.assets.map((item) => `
      <div class="asset-row"><strong>${item.name}</strong><div class="asset-track"><span class="asset-fill ${item.color}" style="width:${Math.min(item.fund, 100)}%"></span><span class="asset-peer-bar" style="width:${Math.min(item.peer, 100)}%"></span></div><span class="number">${item.fund.toFixed(2)}%</span><span class="number muted">${item.peer.toFixed(2)}%</span><span class="number ${valueClass(item.fund - item.peer)}">${signed(item.fund - item.peer, 2).replace('%', 'pt')}</span></div>
    `).join("")}
    <p class="asset-note"><i></i>彩色粗条为本基金，灰色细条为同类平均；二者均使用同一 0-100% 坐标。</p>
  `;
}

function renderIndustryChart() {
  const rows = snapshot.fund.industries.map((item) => ({ ...item, deviation: +(item.fund - item.benchmark).toFixed(1) })).sort((a, b) => b.deviation - a.deviation);
  document.getElementById("industry-values").innerHTML = rows.map((item) => `<div><span>${item.fund.toFixed(1)}%</span><span>${item.benchmark.toFixed(1)}%</span><strong class="${valueClass(item.deviation)}">${signed(item.deviation, 1).replace('%', 'pt')}</strong></div>`).join("");
  const option = baseChartOption();
  Object.assign(option, {
    grid: { left: 74, right: 12, top: 8, bottom: 28 },
    tooltip: { trigger: "item", formatter: (p) => `${rows[p.dataIndex].name}<br/>本基金 ${rows[p.dataIndex].fund}%<br/>同类 ${rows[p.dataIndex].benchmark}%<br/>偏离 ${signed(p.value, 1)}`, backgroundColor: "rgba(30,30,30,.94)", borderWidth: 0, textStyle: { color: "#fff" } },
    xAxis: { type: "value", axisLabel: { formatter: "{value}pt", color: colors.muted, fontSize: 10 }, splitLine: { lineStyle: { color: colors.soft } } },
    yAxis: { type: "category", inverse: true, data: rows.map((item) => item.name), axisLabel: { color: colors.ink, fontSize: 11 }, axisTick: { show: false }, axisLine: { show: false } },
    series: [{ type: "bar", data: rows.map((item) => ({ value: item.deviation, itemStyle: { color: item.deviation >= 0 ? colors.blue : colors.orange, borderRadius: item.deviation >= 0 ? [0, 2, 2, 0] : [2, 0, 0, 2] } })), barWidth: 12, label: { show: false }, markLine: { silent: true, symbol: "none", lineStyle: { color: colors.line }, data: [{ xAxis: 0 }] } }]
  });
  setChart("industry-chart", option);
}

function scaleFactor(value) {
  return Math.max(0, Math.min(100, ((value + 1) / 2) * 100));
}

function renderFactors() {
  document.getElementById("factor-ranges").innerHTML = snapshot.fund.factors.map((factor) => `
    <div class="factor-row">
      <strong>${factor.name}</strong>
      <div class="factor-track" aria-label="${factor.name} 当前 ${factor.current}，历史 ${factor.min} 到 ${factor.max}，同类 ${factor.peer}">
        <i class="factor-zero"></i>
        <i class="factor-range" style="left:${scaleFactor(factor.min)}%;width:${scaleFactor(factor.max) - scaleFactor(factor.min)}%"><b></b><b></b></i>
        <i class="factor-peer" style="left:${scaleFactor(factor.peer)}%"></i>
        <i class="factor-current" style="left:${scaleFactor(factor.current)}%"></i>
      </div>
      <span class="factor-value">${factor.current.toFixed(2)}</span><span class="factor-peer-value">${factor.peer.toFixed(2)}</span><span class="factor-range-value">${factor.min.toFixed(2)} - ${factor.max.toFixed(2)}</span>
    </div>
  `).join("");
}

function initFundInteractions() {
  const group = document.getElementById("risk-period");
  initializeGroup(group);
  group.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    setGroupActive(group, button);
    renderRiskScatter(button.textContent.trim());
    renderRiskTimeline(button.textContent.trim());
  }));
  document.querySelectorAll(".anchor-nav [data-anchor]").forEach((button) => button.addEventListener("click", () => {
    document.getElementById(button.dataset.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  const fundSections = ["fund-summary", "performance-block", "risk-block", "holding-block", "attribution-block"].map((id) => document.getElementById(id));
  const observer = new IntersectionObserver((entries) => {
    const target = entries.find((entry) => entry.isIntersecting)?.target;
    if (!target) return;
    document.querySelectorAll(".anchor-nav [data-anchor]").forEach((button) => {
      const active = button.dataset.anchor === target.id;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "location");
      else button.removeAttribute("aria-current");
    });
  }, { rootMargin: "-130px 0px -70%", threshold: 0 });
  fundSections.forEach((section) => observer.observe(section));
}

function renderScreenerTable(rows = snapshot.screener.rows) {
  document.querySelector("#screener-table tbody").innerHTML = rows.map((row) => `
    <tr><td><input type="checkbox" aria-label="选择 ${row.name}" /></td><td><button class="table-link" type="button"><strong>${row.name}</strong><small>${row.code} · ${row.manager}</small></button></td><td>${row.category}</td><td class="number ${valueClass(row.r1y)}">${signed(row.r1y)}</td><td class="number ${valueClass(row.r3m)}">${signed(row.r3m)}</td><td class="number">${row.size.toFixed(2)} 亿</td><td><button class="icon-button light" type="button" aria-label="查看 ${row.name}"><i data-lucide="arrow-up-right"></i></button></td></tr>
  `).join("");
  window.lucide?.createIcons();
}

function selectedFilters() {
  return [...document.querySelectorAll(".filter-sidebar input[type=checkbox]:checked")].map((input) => input.value);
}

function updateFilters() {
  const selected = selectedFilters();
  const query = document.getElementById("fund-search").value.trim().toLowerCase();
  const rows = snapshot.screener.rows.filter((row) => `${row.name}${row.code}`.toLowerCase().includes(query));
  document.getElementById("condition-count").textContent = `${selected.length} 项已选`;
  document.getElementById("condition-chips").innerHTML = selected.map((name) => `<button type="button" data-filter-name="${name}">${name}<i data-lucide="x"></i></button>`).join("");
  const baseCount = selected.length ? Math.max(18, 27429 - selected.length * 8714) : snapshot.screener.total;
  document.getElementById("result-count").textContent = Math.round(baseCount * (query ? 0.11 : 1)).toLocaleString("zh-CN");
  renderScreenerTable(rows);
  document.querySelectorAll("[data-filter-name]").forEach((chip) => chip.addEventListener("click", () => {
    const input = [...document.querySelectorAll(".filter-sidebar input[type=checkbox]")].find((item) => item.value === chip.dataset.filterName);
    if (input) input.checked = false;
    updateFilters();
  }));
}

function initScreener() {
  renderScreenerTable();
  document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach((input) => input.addEventListener("change", updateFilters));
  document.getElementById("fund-search").addEventListener("input", updateFilters);
  document.getElementById("clear-filters").addEventListener("click", () => {
    document.querySelectorAll(".filter-sidebar input[type=checkbox]").forEach((input) => { input.checked = false; });
    updateFilters();
  });
  const shell = document.querySelector(".screener-shell");
  document.getElementById("collapse-filter").addEventListener("click", () => shell.classList.add("is-collapsed"));
  document.getElementById("expand-filter").addEventListener("click", () => shell.classList.remove("is-collapsed"));
  const view = document.getElementById("result-view");
  initializeGroup(view);
  view.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setGroupActive(view, button)));
  updateFilters();
}

function renderComparisonIdentities() {
  document.getElementById("identity-grid").innerHTML = snapshot.comparison.funds.map((fund, index) => `
    <button class="identity-item" type="button" style="--fund-color:${fund.color}" data-series="${fund.name}" aria-pressed="true">
      <span class="identity-number">0${index + 1}</span><span><strong>${fund.name}</strong><small>${fund.code} · ${fund.size.toFixed(2)} 亿</small></span><i data-lucide="eye"></i>
    </button>
  `).join("");
}

function comparisonSeries(period = "近3年") {
  const pointCount = period === "近1年" ? 12 : period === "近5年" ? 30 : 20;
  const labels = Array.from({ length: pointCount }, (_, index) => {
    const month = ((index + 8) % 12) + 1;
    const year = 2024 + Math.floor((index + 8) / 12);
    return `${year}-${String(month).padStart(2, "0")}`;
  });
  const targets = period === "近1年" ? snapshot.comparison.funds.map((f) => f.y1) : period === "近5年" ? [54, 46, 83, 51] : snapshot.comparison.funds.map((f) => f.y3);
  return { labels, series: snapshot.comparison.funds.map((fund, fundIndex) => ({
    name: fund.name,
    type: "line",
    showSymbol: false,
    symbol: "circle",
    data: Array.from({ length: pointCount }, (_, index) => {
      const progress = index / (pointCount - 1);
      const wave = Math.sin(index * 1.17 + fundIndex) * (2.5 + fundIndex * 0.8) + Math.cos(index * 0.53 + fundIndex) * 1.4;
      return +(targets[fundIndex] * progress + wave * Math.sin(progress * Math.PI)).toFixed(2);
    }),
    lineStyle: { width: 2, color: fund.color },
    itemStyle: { color: fund.color },
    emphasis: { focus: "series", lineStyle: { width: 3 } }
  })) };
}

function renderComparisonChart(period = "近3年") {
  const data = comparisonSeries(period);
  const option = baseChartOption();
  Object.assign(option, {
    legend: { top: 0, left: 8, type: "scroll", itemWidth: 18, itemHeight: 3, textStyle: { color: colors.muted, fontSize: 11 } },
    grid: { left: 48, right: 22, top: 42, bottom: 38 },
    xAxis: { type: "category", boundaryGap: false, data: data.labels, axisLabel: { color: colors.muted, fontSize: 10, interval: Math.max(1, Math.floor(data.labels.length / 7)) }, axisLine: { lineStyle: { color: colors.line } }, axisTick: { show: false } },
    yAxis: { type: "value", axisLabel: { formatter: "{value}%", color: colors.muted, fontSize: 10 }, splitLine: { lineStyle: { color: colors.soft } } },
    series: data.series
  });
  setChart("comparison-chart", option);
}

function renderReturnGrid() {
  const periods = [["年初至今", "ytd"], ["近1月", "m1"], ["近3月", "m3"], ["近1年", "y1"], ["近3年", "y3"]];
  const header = `<div class="return-cell header"></div>${snapshot.comparison.funds.map((fund) => `<div class="return-cell header" style="--fund-color:${fund.color}"><i></i>${fund.code}</div>`).join("")}`;
  const rows = periods.map(([label, key]) => `<div class="return-cell label">${label}</div>${snapshot.comparison.funds.map((fund, index) => `<div class="return-cell"><strong class="${valueClass(fund[key])}">${signed(fund[key])}</strong><span class="rank">同类 ${Math.min(94, 18 + index * 13 + periods.findIndex((item) => item[1] === key) * 4)}%</span></div>`).join("")}`).join("");
  document.getElementById("return-grid").innerHTML = header + rows;
}

function renderSmallMultiples() {
  const root = document.getElementById("small-multiples");
  if (!root.children.length) {
    root.innerHTML = snapshot.comparison.funds.map((fund, index) => `<div class="mini-chart-block"><div><strong>${fund.name}</strong><span style="color:${fund.color}">${signed([7.2, -3.8, 11.6, -6.4][index])} 超额</span></div><div id="relative-chart-${index}" class="mini-chart" role="img" aria-label="${fund.name}相对自身基准表现"></div><small>${fund.benchmark}</small></div>`).join("");
  }
  snapshot.comparison.funds.forEach((fund, index) => {
    const target = [7.2, -3.8, 11.6, -6.4][index];
    const data = Array.from({ length: 16 }, (_, point) => +(target * point / 15 + Math.sin(point * 0.9 + index) * 1.7 * Math.sin(point / 15 * Math.PI)).toFixed(2));
    const option = baseChartOption();
    Object.assign(option, {
      grid: { left: 36, right: 12, top: 10, bottom: 24 },
      tooltip: { ...option.tooltip, formatter: ({ value }) => `区间超额 ${signed(value)}` },
      xAxis: { type: "category", boundaryGap: false, data: data.map((_, i) => i), axisLabel: { show: false }, axisTick: { show: false }, axisLine: { lineStyle: { color: colors.line } } },
      yAxis: { type: "value", axisLabel: { formatter: "{value}%", color: colors.quiet, fontSize: 9 }, splitLine: { lineStyle: { color: colors.soft } } },
      series: [{ type: "line", data, showSymbol: false, lineStyle: { color: fund.color, width: 2 }, areaStyle: { color: `${fund.color}18` }, markLine: { silent: true, symbol: "none", label: { show: false }, lineStyle: { color: colors.line }, data: [{ yAxis: 0 }] } }]
    });
    setChart(`relative-chart-${index}`, option);
  });
}

function initComparison() {
  renderComparisonIdentities();
  renderReturnGrid();
  renderComparisonChart();
  const chart = () => echarts.getInstanceByDom(document.getElementById("comparison-chart"));
  document.querySelectorAll(".identity-item").forEach((button) => button.addEventListener("click", () => {
    const pressed = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(pressed));
    button.querySelector("svg")?.setAttribute("data-lucide", pressed ? "eye" : "eye-off");
    chart()?.dispatchAction({ type: pressed ? "legendSelect" : "legendUnSelect", name: button.dataset.series });
    window.lucide?.createIcons();
  }));
  const period = document.getElementById("compare-period");
  initializeGroup(period);
  period.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { setGroupActive(period, button); renderComparisonChart(button.textContent.trim()); }));
  const mode = document.getElementById("compare-mode");
  initializeGroup(mode);
  mode.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    setGroupActive(mode, button);
    const relative = button.dataset.mode === "relative";
    document.getElementById("funds-compare-view").hidden = relative;
    document.getElementById("relative-view").hidden = !relative;
    if (relative) requestAnimationFrame(renderSmallMultiples);
  }));
}

function filterIndexRecords() {
  const query = document.getElementById("index-search").value.trim().toLowerCase();
  const active = document.querySelector("#index-tags button.is-active")?.dataset.filter || "all";
  const matchesTag = (item) => active === "all" || item.tags.includes(active) || (active === "行业主题" && item.tags.some((tag) => ["科技", "红利"].includes(tag)));
  return snapshot.indices.rows.filter((item) => matchesTag(item) && `${item.name}${item.code}`.toLowerCase().includes(query));
}

function renderIndexRecords() {
  const container = document.getElementById("index-records");
  const rows = filterIndexRecords();
  const listMode = container.classList.contains("is-list");
  if (!rows.length) {
    container.innerHTML = `<div class="empty-state"><i data-lucide="search-x"></i><strong>暂无匹配指数</strong><span>调整标签或搜索词后重试</span></div>`;
  } else {
    container.innerHTML = rows.map((item) => `
      <button class="index-card" type="button" data-index-code="${item.code}">
        <div class="index-card-top"><h3>${item.name}<span class="index-code">${item.code}</span></h3><strong class="${valueClass(item.change)}">${signed(item.change)}</strong></div>
        <div class="index-tags-inline">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="index-card-meta"><div><span>跟踪 ETF</span><strong>${item.etfCount} 只</strong></div><div><span>相关产品</span><strong>${item.relatedCount} 只</strong></div><div><span>规模</span><strong>${item.size.toLocaleString()} 亿</strong></div><div class="list-only"><span>近3月资金流</span><strong class="${valueClass(item.flow)}">${signed(item.flow, 1).replace("%", " 亿")}</strong></div></div>
      </button>
    `).join("");
  }
  container.classList.toggle("has-list-layout", listMode);
  container.querySelectorAll("[data-index-code]").forEach((button) => button.addEventListener("click", () => {
    document.getElementById("index-relations").classList.add("is-highlighted");
    document.getElementById("index-relations").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.getElementById("index-relations").classList.remove("is-highlighted"), 900);
  }));
  window.lucide?.createIcons();
}

function renderRelationTable(relation = "all") {
  const rows = snapshot.indices.etfs.filter((item) => relation === "all" || item.relation.includes(relation));
  document.querySelector("#relation-table tbody").innerHTML = rows.map((item) => `
    <tr><td><button class="table-link" type="button"><strong>${item.name}</strong></button></td><td><span class="relation-badge">${item.relation}</span></td><td class="number">${item.code}</td><td class="number">${item.size.toFixed(1)} 亿</td><td class="number ${valueClass(item.excess)}">${signed(11.03 + item.excess)}</td><td class="number">${item.tracking.toFixed(2)}%</td></tr>
  `).join("");
}

function initIndex() {
  renderIndexRecords();
  renderRelationTable();
  const tags = document.getElementById("index-tags");
  initializeGroup(tags);
  tags.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { setGroupActive(tags, button); renderIndexRecords(); }));
  document.getElementById("index-search").addEventListener("input", renderIndexRecords);
  const view = document.getElementById("index-view");
  initializeGroup(view);
  view.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    setGroupActive(view, button);
    document.getElementById("index-records").classList.toggle("is-list", button.dataset.view === "list");
    renderIndexRecords();
  }));
  const tabs = document.getElementById("relation-tabs");
  initializeGroup(tabs);
  tabs.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { setGroupActive(tabs, button); renderRelationTable(button.dataset.relation); }));
  document.getElementById("back-to-indices").addEventListener("click", () => document.querySelector(".index-toolbar").scrollIntoView({ behavior: "smooth", block: "center" }));
}

function setChart(id, option) {
  const element = document.getElementById(id);
  if (!element) return;
  let chart = echarts.getInstanceByDom(element);
  if (!chart) {
    chart = echarts.init(element, null, { renderer: "canvas" });
    charts.push(chart);
  }
  chart.setOption(option, true);
}

function initResize() {
  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => charts.forEach((chart) => chart.resize()), 80);
  });
}

function init() {
  renderFoundation();
  renderHome();
  renderFundIdentity();
  renderBenchmarks();
  renderRiskScatter();
  renderRiskTimeline();
  renderAssetBars();
  renderIndustryChart();
  renderFactors();
  initScreener();
  initComparison();
  initIndex();
  initSimpleControls();
  initFundInteractions();
  initNavigation();
  initResize();
  window.lucide?.createIcons({ attrs: { "stroke-width": 1.7 } });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
