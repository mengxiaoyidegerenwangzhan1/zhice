const C = { ink: "#1E1E1E", muted: "#5E5E5E", quiet: "#808080", line: "#CCCCCC", soft: "#E5E5E5", blue: "#6865A7", blue2: "#7774B3", blue3: "#B9B8D8", orange: "#FFC069", green: "#48CB95", rise: "#F26173", fall: "#36B397", accent: "#BF3A61", warm: "#F7F5F2", pale: "#F2F2FA" };
const fund = snapshot.fund;
const view = document.getElementById("route-view");
const charts = [];
const storageKey = "zhice-prototype-v2";
const defaults = {
  research: { period: "3y", benchmark: "fit", peer: "偏股混合型", industry: "sw1", lookThrough: false },
  screener: { query: "", criteria: {}, activeFundType: null, fundTypePopover: null, activeCompany: null, companyPopover: null, activeTagRoot: {}, tagPopover: {}, tagCascadePath: {}, perfModePopover: null, perfCondPopover: null, view: "overview", sort: "r1y", collapsed: false, selected: [], mainOnly: false, openGroups: { "基础分类": true } },
  compare: { mode: "funds", period: "3y", visible: snapshot.comparison.funds.map((item) => item.code) },
  index: { query: "", tag: "全部", view: "cards", relation: "all" }
};
let state = loadState();
let sectionObserver;
let routeScrollHandler;

function loadState() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    if (!stored) return structuredClone(defaults);
    const s = { research: { ...defaults.research, ...stored.research }, screener: { ...defaults.screener, ...stored.screener, openGroups: { ...defaults.screener.openGroups, ...(stored.screener.openGroups||{}) }, activeTagRoot: { ...defaults.screener.activeTagRoot, ...(stored.screener.activeTagRoot||{}) }, tagPopover: { ...defaults.screener.tagPopover, ...(stored.screener.tagPopover||{}) }, tagCascadePath: { ...defaults.screener.tagCascadePath, ...(stored.screener.tagCascadePath||{}) } }, compare: { ...defaults.compare, ...stored.compare }, index: { ...defaults.index, ...stored.index } };
    // 兼容旧状态：基金类型统一为多选数组；当前查看类型缺省时取第一个
    const ft = s.screener.criteria.fundType;
    if (typeof ft === "string") s.screener.criteria.fundType = ft === "全部" ? [] : [ft];
    if (s.screener.activeFundType == null) s.screener.activeFundType = (s.screener.criteria.fundType && s.screener.criteria.fundType[0]) || null;
    return s;
  } catch { return structuredClone(defaults); }
}
function saveState() { sessionStorage.setItem(storageKey, JSON.stringify(state)); }
function signed(value, digits = 2, unit = "%") { return `${value > 0 ? "+" : ""}${Number(value).toFixed(digits)}${unit}`; }
function tone(value) { return value > 0 ? "is-rise" : value < 0 ? "is-fall" : ""; }
function icon(name) { return `<i data-lucide="${name}" aria-hidden="true"></i>`; }
function periodLabel(value) { return ({ "1y": "近1年", "3y": "近3年", "5y": "近5年", all: "成立以来" })[value] || "近3年"; }
function parseRoute() {
  const raw = location.hash.startsWith("#/") ? location.hash.slice(2) : "home";
  const [path, query = ""] = raw.split("?");
  return { segments: path.split("/").filter(Boolean), params: new URLSearchParams(query) };
}
function currentPath() { return parseRoute().segments.join("/") || "home"; }
function setParams(values, replace = true) {
  const { params } = parseRoute();
  Object.entries(values).forEach(([key, value]) => value == null || value === "" ? params.delete(key) : params.set(key, String(value)));
  const next = `#/${currentPath()}${params.size ? `?${params}` : ""}`;
  if (replace) history.replaceState(null, "", next); else location.hash = next;
}
function absorbParams(route) {
  const p = route.params;
  if (route.segments[0] === "fund") {
    state.research.period = p.get("period") || state.research.period;
    state.research.benchmark = p.get("benchmark") || state.research.benchmark;
    state.research.industry = p.get("industry") || state.research.industry;
  }
  if (route.segments[0] === "screener") {
    if (p.has("q")) state.screener.query = p.get("q");
    if (p.has("view")) state.screener.view = p.get("view");
    if (p.has("sort")) state.screener.sort = p.get("sort");
    if (p.has("filters")) state.screener.filters = p.get("filters").split("|").filter(Boolean);
  }
  if (route.segments[0] === "compare") {
    state.compare.mode = p.get("mode") || state.compare.mode;
    state.compare.period = p.get("period") || state.compare.period;
  }
  if (route.segments[0] === "index" && route.segments.length === 1) {
    if (p.has("q")) state.index.query = p.get("q");
    if (p.has("tag")) state.index.tag = p.get("tag");
    if (p.has("view")) state.index.view = p.get("view");
  }
  if (route.segments[0] === "index" && route.segments.length > 1 && p.has("relation")) {
    state.index.relation = p.get("relation");
  }
  saveState();
}
function syncIcons() { window.lucide?.createIcons({ attrs: { "stroke-width": 1.7 } }); }
function toast(message) {
  const el = document.getElementById("app-toast"); el.textContent = message; el.classList.add("is-visible");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("is-visible"), 1800);
}
function disposeCharts() {
  charts.splice(0).forEach((chart) => chart.dispose());
  sectionObserver?.disconnect();
  if (routeScrollHandler) window.removeEventListener("scroll", routeScrollHandler);
  routeScrollHandler = null;
}
function chart(id, option) {
  const el = document.getElementById(id); if (!el) return null;
  const instance = echarts.init(el, null, { renderer: "canvas" }); instance.setOption(option); charts.push(instance); return instance;
}
function baseOption() {
  return { animationDuration: 260, textStyle: { fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif', color: C.ink }, tooltip: { trigger: "axis", backgroundColor: "rgba(30,30,30,.94)", borderWidth: 0, padding: [8, 10], textStyle: { color: "#fff", fontSize: 12 } }, grid: { left: 48, right: 22, top: 34, bottom: 40 }, xAxis: { axisLine: { lineStyle: { color: C.line } }, axisTick: { show: false }, axisLabel: { color: C.muted, fontSize: 10 } }, yAxis: { axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: C.muted, fontSize: 10 }, splitLine: { lineStyle: { color: C.soft } } } };
}
function pageHeader(kicker, title, description, trail = "") {
  return `<header class="route-heading"><div><p>${kicker}</p><h1>${title}</h1><span>${description}</span></div>${trail ? `<div class="route-trail">${trail}</div>` : ""}</header>`;
}
function segmented(id, options, current) {
  return `<div class="app-segmented" id="${id}">${options.map(([value, label]) => `<button type="button" data-value="${value}" aria-pressed="${value === current}">${label}</button>`).join("")}</div>`;
}

function researchToolsTemplate() {
  const group = (title, description, items) => `<section class="tool-group"><div class="tool-group-head"><div><h2>${title}</h2><span>${description}</span></div></div><div class="tool-list">${items.map((item) => `<a href="#/research-tools" data-tool="${item.name}"><strong>${item.name}</strong><span>${item.description}</span><i>${icon("arrow-right")}</i></a>`).join("")}</div></section>`;
  return `<div class="app-page research-tools-page">${pageHeader("RESEARCH TOOLS", "研究工具", "面向基金研究与组合研究的评价、因子、数据和指数工具。")}
    <div class="tools-grid">
      ${group("基金评价", "把研究标准沉淀为可复用的评价框架。", [
        { name: "基金打分", description: "按统一指标评价基金表现、风险和能力。" },
        { name: "打分模板", description: "管理不同研究主题和投资风格的评分模板。" }
      ])}
      ${group("因子研究", "从因子定义到回测验证，支持研究结论复用。", [
        { name: "基金因子", description: "查看基金的风格、风险和持仓因子暴露。" },
        { name: "因子库", description: "统一管理已发布和正在研究的因子。" },
        { name: "因子算法", description: "配置因子计算口径和组合应用方式。" },
        { name: "因子回测", description: "检验因子在历史区间内的有效性和稳定性。" }
      ])}
      ${group("数据与指数", "管理研究数据口径，并构建可用于比较的指数。", [
        { name: "基金数据管理", description: "维护基金基础信息、净值和持仓数据。" },
        { name: "自定义指数", description: "按研究需求创建指数、基准和跟踪口径。" }
      ])}
    </div>
  </div>`;
}

function homeTemplate() {
  const market = snapshot.market.indices.map((item) => `<article class="market-quote"><div><span>${item.name}</span><small>交易中 · 13:34</small></div><strong>${item.value.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</strong><em class="${tone(item.change)}">${item.delta > 0 ? "▲" : "▼"} ${item.delta.toFixed(2)} · ${signed(item.change)}</em><div class="spark-bars" aria-hidden="true">${[32,46,39,65,54,77,70].map((h) => `<i style="height:${h}%"></i>`).join("")}</div></article>`).join("");
  const etfs = snapshot.market.etf.slice(0, 5).map((item, i) => `<tr><td><a href="#/index/000300">${item.name}</a><small>${item.group}</small></td><td class="num ${tone([8.42,6.18,5.73,-2.14,4.91][i])}">${signed([8.42,6.18,5.73,-2.14,4.91][i],2," 亿")}</td><td class="num">${[69.52,40.60,25.48,18.26,15.72][i].toFixed(2)} 亿</td><td class="num ${tone(item.change)}">${signed(item.change)}</td></tr>`).join("");
  return `<div class="app-page home-page"><section class="route-section"><div class="section-line"><div><h2>市场概览</h2><span>实时行情</span></div>${segmented("home-market-mode", [["index","指数"],["flow","资金"],["valuation","估值"]], "index")}</div><div class="market-quotes">${market}</div></section>
    <div class="home-grid"><section class="route-section"><div class="section-line"><div><h2>ETF 资金榜</h2><span>上一交易日 · 单位：亿元</span></div><a class="text-link" href="#/index">查看全部 ${icon("arrow-right")}</a></div><div class="app-table-wrap"><table class="app-table"><thead><tr><th>基金</th><th class="num">近1日资金流</th><th class="num">规模</th><th class="num">涨跌</th></tr></thead><tbody>${etfs}</tbody></table></div></section>
    <section class="route-section signal-panel"><div class="section-line"><div><h2>自选与跟踪</h2><span>4 项发生显著变化</span></div><button class="bare-icon" aria-label="更多">${icon("ellipsis")}</button></div><ul class="signal-feed"><li><i>${icon("trending-down")}</i><div><strong>中证科技估值分位回落</strong><span>当前 64%，近一周 -5pct</span></div><time>12:40</time></li><li><i>${icon("circle-dollar-sign")}</i><div><strong>沪深300 ETF 连续净流入</strong><span>近5日累计 38.6亿元</span></div><time>11:10</time></li><li><i>${icon("shield-check")}</i><div><strong>组合波动回到目标区间</strong><span>近20日年化波动 18.2%</span></div><time>09:45</time></li></ul></section></div>
    <div class="home-grid lower"><section class="route-section"><div class="section-line"><div><h2>基金研究要闻</h2><span>编辑精选 · 2026-09-04</span></div></div><div class="news-list"><a href="#/fund/000001"><strong>主动权益基金风格重新向大盘成长集中</strong><span>样本组合的科技与通信行业权重连续两个季度上升。</span><time>13:05</time></a><a href="#/compare"><strong>四只权益基金近三年收益来源差异</strong><span>区分市场收益、风格暴露与真正超额。</span><time>10:20</time></a><a href="#/index/000300"><strong>沪深300增强产品跟踪误差分化</strong><span>用统一基准比较收益与约束。</span><time>09:30</time></a></div></section>
    <section class="route-section"><div class="section-line"><div><h2>关注基金池</h2><span>收盘数据 · 2026-09-03</span></div></div><div class="pool-list">${snapshot.market.portfolios.map((p,i)=>`<a href="${i===0?'#/fund/000001':'#/screener'}"><span>${p.name}</span><b class="${tone(p.annual)}">${signed(p.annual)}</b><small>最大回撤 ${signed(p.drawdown)}</small></a>`).join("")}</div></section></div></div>`;
}

// 筛选条件结构：分组 → 字段。drill 字段点击打开下钻浮层，chips 字段在组内直接选。
const screenerSchema = [
  { group: "基础分类", fields: [
    { id: "fundType", label: "基金类型", type: "chips", popover: "subType", options: ["全部","股票型","混合型","债券型","货币型","QDII","FOF","另类投资型"] },
    { id: "subType", label: "二级分类", hidden: true },
    { id: "operate", label: "运作方式", type: "chips", options: ["全部","封闭式","定期开放","开放式","LOF","ETF","ETF联接"] },
    { id: "company", label: "基金公司", type: "chips", popover: "company", options: ["全部","A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","W","X","Y","Z"] },
  ]},
  { group: "基本概况", fields: [
    { id: "age", label: "存续时间", type: "chips", select: "single", options: ["全部","少于1年","1-3年","3-5年","5年以上","自定义"] },
    { id: "scale", label: "基金规模", type: "chips", select: "single", options: ["全部","0-1亿","1-5亿","5-10亿","10亿以上","自定义"] },
    { id: "managerCount", label: "基金经理人数", type: "chips", select: "single", options: ["全部","1个基金经理","2个基金经理","多个基金经理"] },
    { id: "managerChange", label: "基金经理变动", type: "chips", select: "single", options: ["全部","变更过基金经理","未变更过基金经理"] },
  ]},
  { group: "风格与标签", fields: [
    { id: "activeTag", label: "主动基金标签", type: "chips", popover: "tag", tagKind: "主动", options: ["全部","中国股票","香港股票","全球股票","债券"] },
    { id: "passiveTag", label: "被动基金标签", type: "chips", popover: "tag", tagKind: "被动", options: ["全部","中国股票","香港股票","全球股票","债券","商品","货币"] },
    { id: "stockStyle", label: "股票风格", type: "chips", select: "single", options: ["全部","大盘-价值型","大盘-平衡型","大盘-成长型","中盘-价值型","中盘-平衡型","中盘-成长型","小盘-价值型","小盘-平衡型","小盘-成长型"] },
    { id: "investStyle", label: "投资风格", type: "chips", options: ["全部","当前行业漂移","持股集中度","调仓频率","重仓股变更频率","行业集中度"] },
  ]},
  { group: "持仓结构", fields: [
    { id: "instHold", label: "机构持仓比例", type: "chips", select: "single", options: ["全部","0%-20%","20%-40%","40%-60%","60%-80%","80%-100%","自定义"] },
    { id: "stockHold", label: "股票持仓比例", type: "chips", select: "single", options: ["全部","0%-20%","20%-40%","40%-60%","60%-80%","80%-100%","自定义"] },
    { id: "bondHold", label: "债券持仓比例", type: "chips", select: "single", options: ["全部","0%-20%","20%-40%","40%-60%","60%-80%","80%-100%","自定义"] },
  ]},
  { group: "业绩与风险", fields: [
    { id: "return", label: "区间收益率", type: "performance", modes: ["区间收益率", "年化收益率", "超额年化收益率"], options: ["3个月","6个月","12个月","36个月","60个月"] },
    { id: "drawdown", label: "最大回撤率", type: "performance", modes: ["最大回撤率", "年化波动率", "下行风险"], options: ["3个月","6个月","12个月","36个月","60个月"] },
    { id: "sharpe", label: "夏普比率", type: "performance", modes: ["夏普比率", "信息比率", "收益回撤比", "索提诺比率", "特雷诺比率"], options: ["3个月","6个月","12个月","36个月","60个月"] },
  ]},
  { group: "评级与能力", fields: [
    { id: "star", label: "基金星级", type: "chips", options: ["全部","3年","5年","综合"] },
    { id: "managerStar", label: "基金经理星级", type: "chips", options: ["全部","3年","5年","综合"] },
    { id: "attack", label: "进攻能力", type: "chips", options: ["全部","3年","5年"] },
    { id: "defense", label: "防御能力", type: "chips", options: ["全部","3年","5年"] },
    { id: "timing", label: "择时能力", type: "chips", options: ["全部","3年","5年"] },
  ]},
];

// 下钻浮层的数据
const drillData = {
  subType: {
    "全部": ["全部"],
    "股票型": ["全部","普通股票型","行业股票型-科技","行业股票型-消费","行业股票型-医药卫生","行业股票型-制造","行业股票型-其他","被动指数股票型","增强指数股票型"],
    "混合型": ["全部","偏股混合型","标准混合型","偏债混合型","行业混合型-科技","行业混合型-消费","行业混合型-医药卫生","行业混合型-制造","行业混合型-其他"],
    "债券型": ["全部","纯债型","进取债型","可转债型","被动指数债券型","被动指数可转债型","增强指数债券型"],
  },
  company: {
    letters: "ABCDEFGHJKLMNPQRSTWXYZ".split(""),
    list: {
      A: ["安信基金","安联基金","艾方基金"],
      B: ["博时基金","宝盈基金","博时基金国际","京管泰富基金","渤海汇金","博道基金","博远基金","贝莱德基金","百嘉基金"],
      C: ["长城基金","长盛基金","财通基金","创金合信基金"],
      D: ["大成基金","德邦基金","东海基金"],
      E: ["易方达基金"],
      F: ["富国基金","方正富邦基金"],
      G: ["广发基金","工银瑞信基金","国投瑞银基金","光大保德信基金"],
      H: ["华夏基金","华安基金","华宝基金","华泰柏瑞基金","汇添富基金","海富通基金"],
      J: ["嘉实基金","建信基金","金鹰基金","景顺长城基金"],
      L: ["南方基金","蓝算基金","国联安基金"],
      M: ["摩根基金","民生加银基金"],
      N: ["诺安基金","农银汇理基金","南华基金"],
      P: ["鹏华基金","平安基金","鹏扬基金"],
      Q: ["前海开源基金","泉果基金"],
      R: ["融通基金","瑞达基金"],
      S: ["申万菱信基金","上投摩根基金","上银基金"],
      T: ["天弘基金","太平基金","泰信基金"],
      W: ["万家基金","五矿信托"],
      X: ["鑫元基金","西部利得基金","兴证全球基金"],
      Y: ["银华基金","永赢基金","银河基金"],
      Z: ["招商基金","中欧基金","中银基金","中信保诚基金"],
    },
  },
  tagTree: {
    "主动": {
      children: [
        { name: "中国股票", children: [
          { name: "宽基" },
          { name: "宽基指数增强" },
          { name: "行业", children: [
            { name: "能源" },
            { name: "原材料" },
            { name: "工业", children: [
              { name: "交通运输" },
              { name: "国防军工" },
              { name: "电力设备" },
            ]},
            { name: "可选消费" },
            { name: "主要消费" },
            { name: "医药卫生" },
            { name: "金融" },
            { name: "信息技术" },
            { name: "通信服务" },
            { name: "公用事业" },
            { name: "复合行业" },
          ]},
          { name: "主题" },
          { name: "策略" },
          { name: "风格" },
        ]},
        { name: "香港股票", children: [
          { name: "香港", children: [
            { name: "宽基" },
            { name: "宽基指数增强" },
            { name: "行业", children: [
              { name: "大科技" },
              { name: "大消费" },
              { name: "智能概念" },
            ]},
            { name: "主题" },
            { name: "策略" },
            { name: "风格" },
          ]},
          { name: "沪港深" },
        ]},
        { name: "全球股票", children: [
          { name: "美国", children: [
            { name: "宽基指数增强", children: [
              { name: "全市场" },
            ]},
            { name: "风格" },
          ]},
          { name: "中概" },
          { name: "全球" },
          { name: "单地域" },
          { name: "跨地域" },
        ]},
        { name: "债券", children: [
          { name: "其他债券", children: [
            { name: "综合" },
          ]},
        ]},
      ],
    },
    "被动": {
      children: ["中国股票","香港股票","全球股票","债券","商品","货币"].map(name => ({ name })),
    },
  },
};

function flatScreenerFields() { return screenerSchema.flatMap(g => g.fields); }
function getField(id) { return flatScreenerFields().find(f => f.id === id); }
// 某字段当前是否有效选中
function isFieldActive(f) {
  const v = state.screener.criteria[f.id];
  if (v == null) return false;
  if (f.type === "performance") return !!(v.period && v.condition && v.value && v.value !== "全部");
  if (Array.isArray(v)) return v.length > 0 && !(v.length === 1 && v[0] === "全部");
  return v !== "" && v !== "全部";
}
function performanceSummary(value) {
  if (!value?.period || !value?.condition || !value?.value || value.value === "全部") return "";
  return `${value.period} · ${value.value}`;
}
// 某字段的选择摘要文本
function fieldSummary(f) {
  const v = state.screener.criteria[f.id];
  if (!isFieldActive(f)) return "全部";
  if (f.type === "performance") return performanceSummary(v);
  if (f.popover === "tag") return Array.isArray(v) ? v.map(tagLabel).join(" · ") : tagLabel(v);
  return Array.isArray(v) ? v.filter(x => x !== "全部").join(" · ") : v;
}
// 基金类型的已选值序列化：类型_二级分类+二级分类；多个类型再用 + 相连
function fundTypeValue() {
  const c = state.screener.criteria;
  const types = Array.isArray(c.fundType) ? c.fundType : [];
  const subs = Array.isArray(c.subType) ? c.subType.filter(x => x !== "全部") : [];
  const f = getField("fundType");
  const order = f ? f.options.filter(o => o !== "全部") : [];
  const segs = [...order, ...types].filter(t => types.includes(t)).filter((t,i,a)=>a.indexOf(t)===i).map(t=>{
    const own = (drillData.subType[t] || []).filter(x => x !== "全部" && subs.includes(x));
    return own.length ? `${t}_${own.join("+")}` : t;
  });
  return segs.join("+");
}
// 全局面上的已选条件（标签字符串数组）：格式 标签: 值，多值用 + 连接
function activeFilterLabels() {
  const c = state.screener.criteria;
  const out = [];
  flatScreenerFields().filter(f => !f.hidden && isFieldActive(f)).forEach(f=>{
    let val;
    if (f.id === "fundType") val = fundTypeValue();
    else {
      const v = c[f.id];
      val = f.type === "performance"
        ? performanceSummary(v)
        : f.popover === "tag"
          ? (Array.isArray(v) ? v.map(tagLabel).join("+") : tagLabel(v))
          : (Array.isArray(v) ? v.filter(x => x !== "全部").join("+") : v);
    }
    const name = f.type === "performance" ? (c[f.id]?.mode || f.label) : f.label;
    if (val) out.push(`${name}: ${val}`);
  });
  return out;
}
function activeFilterCount() { return flatScreenerFields().filter(f => !f.hidden && isFieldActive(f)).length; }
function filteredFunds() {
  const q = state.screener.query.toLowerCase();
  return snapshot.screener.rows
    .filter((r) => `${r.name}${r.code}${r.manager}`.toLowerCase().includes(q))
    .filter((r) => !state.screener.mainOnly || !/[B-Z]$/.test(r.name));
}
// 列表列结构固定，与截图一致
const SCREENER_COLS = ["序号", "基金简称", "基金代码", "基金规模(亿)", "基金星级(综合)", "申购时间", "申购状态", "赎回状态", "一级基金类型(官网分类)", "二级基金类型(智君分类)", "跟踪指数", "基金标签", "基金经理", "近1月收益", "排名", "近1年收益", "排名"];
function screenerTable() {
  const rows = filteredFunds();
  const body = rows.map((r, i) => `<tr><td class="num">${i + 1}</td><td class="fund-name"><a href="#/fund/000001" title="${r.name}">${r.name}</a></td><td>${r.code}</td><td class="num">${r.size}</td><td class="star" aria-label="${r.star}星">${"★".repeat(r.star)}${"☆".repeat(5 - r.star)}</td><td>${r.hold}</td><td>${r.subscribe}</td><td>${r.redeem}</td><td>${r.category}</td><td>${r.category2}</td><td>${r.tracking}</td><td>${r.tags}</td><td>${r.manager}</td><td class="num ${tone(r.m1)}">${signed(r.m1)}</td><td class="num">${r.m1Rank.toFixed(2)}%</td><td class="num ${tone(r.y1)}">${signed(r.y1)}</td><td class="num">${r.y1Rank.toFixed(2)}%</td></tr>`).join("");
  return `<table class="app-table result-table"><thead><tr>${SCREENER_COLS.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table>`;
}
function isSingleField(f) { return f.select === "single"; }
// 二级分类的可选项：跟随当前查看的基金类型联动
function linkedOptions(f) {
  const t = state.screener.activeFundType;
  return t ? (drillData.subType[t] || ["全部"]) : ["全部"];
}
// 某基金类型下已选中的二级分类个数
function subTypeCount(type) {
  const sub = state.screener.criteria.subType;
  const arr = Array.isArray(sub) ? sub : [];
  return (drillData.subType[type] || []).filter(x => x !== "全部" && arr.includes(x)).length;
}
// 某字母下已选中的公司个数
function companyCount(letter) {
  const com = state.screener.criteria.company;
  const arr = Array.isArray(com) ? com : [];
  return (drillData.company.list[letter] || []).filter(x => arr.includes(x)).length;
}
// 某根标签（如中国股票）下已选中的标签个数
function tagRootCount(f, root) {
  const arr = Array.isArray(state.screener.criteria[f.id]) ? state.screener.criteria[f.id] : [];
  const prefix = `${root}/`;
  const direct = root; // 无根节点自身被选中的场景，按子路径统计
  return arr.filter(v => v.startsWith(prefix)).length + (arr.includes(direct) ? 1 : 0);
}
// 业绩筛选：时间区间胶囊；点击标题选择指标、点击月份弹出条件浮层
function renderPerformanceField(f) {
  const value = state.screener.criteria[f.id] || {};
  const period = value.period || "";
  return `<div class="performance-filter" data-performance-field="${f.id}">
    <div class="field-chips">${f.options.map(item => `<button type="button" class="mini-chip ${period === item ? "is-active" : ""}" data-performance-period="${item}">${item}</button>`).join("")}</div>
  </div>`;
}
// 业绩类字段的可选指标按字段配置（schema.modes），默认选中首项
function perfModes(fid) {
  const f = getField(fid);
  return f && f.modes ? f.modes : [];
}
function perfDefaultMode(fid) {
  return perfModes(fid)[0] || "";
}
const PERF_RANKS = ["前20%", "前40%", "前60%", "前80%", "全部"];
// 业绩指标选择浮层：单选圈列表，同月份条件浮层
function renderPerfModePopover(fid) {
  const value = state.screener.criteria[fid] || {};
  const mode = value.mode || perfDefaultMode(fid);
  return `<div class="fund-type-popover" data-perf-mode-popover="${fid}">
    <div class="fund-popover-list">
      ${perfModes(fid).map(o => `<button type="button" class="pop-item perf-radio-item ${mode === o ? "is-checked" : ""}" data-perf-mode-pick="${o}"><span class="perf-radio">${mode === o ? "<i></i>" : ""}</span><span>${o}</span></button>`).join("")}
    </div>
  </div>`;
}
// 月份条件浮层：排名单选圈列表 + 自定义数值输入
function renderPerfCondPopover(fid) {
  const value = state.screener.criteria[fid] || {};
  const mode = value.mode || perfDefaultMode(fid);
  const isCustom = value.condition === "数值" && !!value.value;
  const customNum = isCustom ? String(value.value).replace(/[≥>\s%]/g, "") : "";
  return `<div class="fund-type-popover perf-cond-popover" data-perf-cond-popover="${fid}">
    <div class="perf-pop-title">排名</div>
    <div class="fund-popover-list">
      ${PERF_RANKS.map(o => {
        const on = o === "全部" ? !value.value : (value.condition !== "数值" && value.value === o);
        return `<button type="button" class="pop-item perf-radio-item ${on ? "is-checked" : ""}" data-perf-rank="${o}"><span class="perf-radio">${on ? "<i></i>" : ""}</span><span>${o}</span></button>`;
      }).join("")}
    </div>
    <div class="perf-pop-divider"></div>
    <div class="perf-pop-title">${mode}</div>
    <div class="perf-custom-row">
      <button type="button" class="pop-item perf-radio-item ${isCustom ? "is-checked" : ""}" data-perf-custom-radio><span class="perf-radio">${isCustom ? "<i></i>" : ""}</span><span>自定义</span></button>
      <span class="perf-custom-input"><input type="number" min="0" step="1" value="${customNum}" placeholder="0" data-perf-custom-input><em>%</em></span>
      <button type="button" class="perf-custom-ok" data-perf-custom-ok>确定</button>
    </div>
  </div>`;
}
function renderChipsField(f) {
  const cur = state.screener.criteria[f.id];
  const options = f.options;
  const single = isSingleField(f);
  // 一级筛选的默认未选状态即代表“全部”，不重复显示“全部”入口。
  const chips = `<div class="field-chips" data-chips-field="${f.id}">${options.filter(o => o !== "全部").map(o=>{
    let active, count = 0;
    if (f.id === "fundType") {
      active = o === "全部" ? state.screener.activeFundType == null : state.screener.activeFundType === o;
      if (o !== "全部") count = subTypeCount(o);
    } else if (f.id === "company") {
      active = o === "全部" ? state.screener.activeCompany == null : state.screener.activeCompany === o;
      if (o !== "全部") count = companyCount(o);
    } else if (f.popover === "tag") {
      active = o === "全部" ? state.screener.activeTagRoot[f.id] == null : state.screener.activeTagRoot[f.id] === o;
      if (o !== "全部") count = tagRootCount(f, o);
    } else active = single ? cur === o : Array.isArray(cur) && cur.includes(o);
    return `<button type="button" class="mini-chip ${active?"is-active":""}" data-chip="${o}">${o}${count?`<i class="chip-count">${count}</i>`:""}</button>`;
  }).join("")}</div>`;
  return chips;
}
// 选择器浮层：基金类型（键=类型，值=二级分类）/ 基金公司（键=字母，值=公司）
// 首项"全部"为该键下的全选开关；选中项文本前打勾，无背景色、无底部操作条
function selectorPopoverConfig(kind, key) {
  if (kind === "fundType") return { field: "subType", options: (drillData.subType[key] || []).filter(x => x !== "全部") };
  return { field: "company", options: drillData.company.list[key] || [] };
}
function renderSelectorPopover(kind, key) {
  const { field, options } = selectorPopoverConfig(kind, key);
  const arr = Array.isArray(state.screener.criteria[field]) ? state.screener.criteria[field] : [];
  const allOn = options.length > 0 && options.every(o => arr.includes(o));
  return `<div class="fund-type-popover" data-selector-kind="${kind}" data-selector-key="${key}">
    <div class="fund-popover-list">
      ${["全部", ...options].map(o=>{
        const on = o === "全部" ? allOn : arr.includes(o);
        return `<button type="button" class="pop-item ${on?"is-checked":""}" data-pop-pick="${o}"><span class="pop-checkbox">${on?icon("check"):""}</span><span>${o}</span></button>`;
      }).join("")}
    </div>
  </div>`;
}
// 内联面板里的选项行（复用 mini-chip 样式，导航项带 is-nav）
function inlineChipRow(items, fieldId, active, nav) {
  return `<div class="field-chips" data-inline-row="${fieldId}">${items.map(o=>{
    const key = typeof o === "object" ? o.value : o;
    const label = typeof o === "object" ? o.label : o;
    const on = nav ? false : Array.isArray(active) && active.includes(key);
    return `<button type="button" class="mini-chip ${nav?"is-nav":""} ${on?"is-active":""}" data-inline-${nav?"nav":"pick"}="${key}">${label}${nav?icon("chevron-right"):""}</button>`;
  }).join("")}</div>`;
}
function renderField(f) {
  if (f.type === "performance") {
    const value = state.screener.criteria[f.id] || {};
    const label = value.mode || f.label;
    return `<div class="field-block performance-block"><button type="button" class="field-name perf-mode-toggle ${state.screener.perfModePopover === f.id ? "is-open" : ""}" data-perf-mode-toggle="${f.id}"><span>${label}</span>${icon("chevron-down")}</button>${renderPerformanceField(f)}</div>`;
  }
  if (f.type === "inline") {
    const open = !!state.screener.openInline[f.id];
    return `<div class="inline-field ${open?"is-open":""}">
      <button type="button" class="inline-field-head" data-inline-toggle="${f.id}">
        <span class="field-name">${f.label}</span>
        <span class="inline-field-summary ${isFieldActive(f)?"is-active":""}">${fieldSummary(f)}</span>${icon("chevron-down")}
      </button>
      <div class="inline-field-body" data-inline-body="${f.id}">${open ? renderInlinePanel(f) : ""}</div>
    </div>`;
  }
  return `<div class="field-block"><span class="field-name">${f.label}</span>${renderChipsField(f)}</div>`;
}
// 某组的已选计数：基础分类按二级分类跨类型累计选中个数，其余组按激活字段数
function groupCount(g) {
  if (g.group === "基础分类") {
    const sub = state.screener.criteria.subType;
    return Array.isArray(sub) ? sub.length : 0;
  }
  return g.fields.filter(isFieldActive).length;
}
function renderRailGroup(g, gi) {
  const open = state.screener.openGroups[g.group];
  const count = groupCount(g);
  return `<div class="rail-group ${open?"is-open":""}">
    <button type="button" class="rail-group-head" data-group-toggle="${g.group}">
      <span class="rail-group-title">${g.group}</span>
      ${count ? `<span class="group-badge">${count}</span>` : ""}${icon("chevron-down")}
    </button>
    <div class="rail-group-body">${g.fields.filter(f=>!f.hidden).map(renderField).join("")}</div>
  </div>`;
}
function inlineState(f) {
  if (!state.screener.openInline[f.id]) {
    state.screener.openInline[f.id] = { path: [] };
  }
  return state.screener.openInline[f.id];
}
function renderInlinePanel(f) {
  if (f.inline === "company") return renderCompanyPanel(f);
  if (f.inline === "tag") return renderTagPanel(f);
  return "";
}
function renderCompanyPanel(f) {
  const d = inlineState(f);
  const active = state.screener.criteria[f.id] ?? [];
  const letter = d.path[0];
  if (!letter) {
    return `<div class="inline-search-wrap"><label class="app-search">${icon("search")}<input data-company-search="${f.id}" placeholder="搜索基金公司"></label><div class="inline-search-result" data-company-result="${f.id}"></div></div>
      ${inlineChipRow(drillData.company.letters, f.id, d.path, true)}`;
  }
  return `<div class="field-chips" data-inline-row="${f.id}"><button type="button" class="mini-chip is-back" data-inline-back="1">${icon("arrow-left")}全部字母</button></div>`
    + inlineChipRow(["全部", ...(drillData.company.list[letter] || [])], f.id, active);
}
// 沿树路径取节点数组：path=[] 取根层
function tagLevel(kind, path) {
  let list = drillData.tagTree[kind].children;
  for (let i = 0; i < path.length; i++) {
    const node = list.find(n => n.name === path[i]);
    if (!node || !node.children) return [];
    list = node.children;
  }
  return list;
}
// 路径转内部值/还原
function tagValue(pathArr) { return pathArr.join("/"); }
function tagPath(value) { return value.split("/"); }
// 已选标签的显示文本：用叶子名
function tagLabel(value) { const p = tagPath(value); return p[p.length - 1]; }
// 返回节点自身及全部后代路径，用于父级标签的整支全选/取消。
function tagBranchValues(path, node) {
  const value = tagValue(path);
  return [value, ...(node.children || []).flatMap(child => tagBranchValues([...path, child.name], child))];
}
// 多列级联选择器：一级一列并排，checkbox 多选，有子级右侧箭头展开下一列
// activePath 为与 path 同基准的"完整浏览路径"；用节点名在该列的位置判断展开
function renderCascaderCol(f, path, selectedValues, activePath) {
  const nodes = tagLevel(f.tagKind, path);
  return `<div class="cascader-col" data-cascader-col="${tagValue(path)}">
    ${nodes.map(n=>{
      const childPath = [...path, n.name];
      const val = tagValue(childPath);
      const on = selectedValues.includes(val);
      const hasChild = !!n.children && n.children.length > 0;
      const showArrow = hasChild || path.length <= 2;
      const colOpen = hasChild && activePath[path.length] === n.name;
      return `<div class="cascader-item ${on?"is-checked":""} ${colOpen?"is-open":""}">
        <button type="button" class="cascader-check" data-cascader-pick="${val}" aria-label="选择${n.name}">${icon("check")}</button>
        ${hasChild
          ? `<button type="button" class="cascader-expand" data-cascader-expand="${val}" aria-label="展开${n.name}"><span class="cascader-label">${n.name}</span><span class="cascader-arrow">${icon("chevron-right")}</span></button>`
          : `<span class="cascader-label">${n.name}</span>${showArrow ? `<span class="cascader-arrow" aria-hidden="true">${icon("chevron-right")}</span>` : ""}`}
      </div>`;
    }).join("")}</div>`;
}
function renderTagPanel(f) {
  const d = inlineState(f);
  const activePath = Array.isArray(d.path) ? d.path : [];
  const selectedValues = Array.isArray(state.screener.criteria[f.id]) ? state.screener.criteria[f.id] : [];
  let cols = "";
  for (let i = 0; i <= activePath.length; i++) {
    cols += renderCascaderCol(f, activePath.slice(0, i), selectedValues, activePath);
  }
  return `<div class="cascader" data-cascader="${f.id}">
    <div class="cascader-cols">${cols}</div>
    <div class="cascader-foot">
      <button type="button" class="cascader-clear" data-cascader-clear="1">清空</button>
      <span class="cascader-count">已选 ${selectedValues.length} 项</span>
      <button type="button" class="cascader-done" data-cascader-done="1">完成</button>
    </div>
  </div>`;
}
// 标签浮层：多列级联（最多 4 列），无底部操作条
// 列路径以根标签为起点（path[0]=根），cascader 从 path 起点的下一层开始
function renderTagCascaderPopover(f, root) {
  const selectedValues = Array.isArray(state.screener.criteria[f.id]) ? state.screener.criteria[f.id] : [];
  // 浮层内浏览路径：存于 tagCascadePath[fid]，形如 ["宽基"]（相对根的后续层级）
  const relPath = Array.isArray(state.screener.tagCascadePath[f.id]) ? state.screener.tagCascadePath[f.id] : [];
  // 渲染列：第 1 列 = 根的直接子节点；之后逐级
  const basePath = [root];
  const fullActivePath = [...basePath, ...relPath];
  let cols = "";
  const totalDepth = 1 + relPath.length;
  for (let i = 0; i < totalDepth; i++) {
    const path = [...basePath, ...relPath.slice(0, i)];
    cols += renderCascaderCol(f, path, selectedValues, fullActivePath);
  }
  // 根无子节点（如被动标签）：只显示"全部"作为该根的全选开关
  const rootChildren = tagLevel(f.tagKind, basePath);
  if (!rootChildren.length) {
    const allVals = [root];
    const on = selectedValues.includes(root);
    cols = `<div class="cascader-col" data-cascader-col="${root}">
      <div class="cascader-item ${on?"is-checked":""}">
        <button type="button" class="cascader-check" data-cascader-pick="${root}" aria-label="选择全部">${icon("check")}</button><span class="cascader-label">全部</span>
      </div></div>`;
    void allVals;
  }
  return `<div class="fund-type-popover tag-cascader-popover" data-tag-popover="${f.id}" data-tag-root="${root}">
    <div class="cascader-cols">${cols}</div>
  </div>`;
}
function screenerTemplate() {
  const s = state.screener;
  const labels = activeFilterLabels();
  return `<div class="app-page screener-page"><div class="screener-workbench ${s.collapsed?"is-collapsed":""}">
    <aside class="filter-rail">
      <div class="rail-head"><div><h2>筛选条件</h2></div><div class="rail-head-tools"><button id="collapse-rail" class="bare-icon" aria-label="折叠筛选栏">${icon("panel-left-close")}</button></div></div>
      <label class="app-search">${icon("search")}<input id="fund-query" value="${s.query}" placeholder="基金代码、名称、简拼或经理"></label>
      <div class="template-row"><span>模板</span>${snapshot.screener.templates.map((t,i)=>`<button data-template="${i}">${t}</button>`).join("")}</div>
      <div class="rail-groups">${screenerSchema.map(renderRailGroup).join("")}</div>
    </aside>
    <section class="result-surface">
      <div class="result-tools"><div class="result-filter-row"><button id="expand-rail" class="expand-rail">${icon("panel-left-open")}筛选条件</button><div id="filter-chips" class="filter-chips">${labels.map(l=>`<button data-clear-label="${l}"><span class="chip-text">${l}</span>${icon("x")}</button>`).join("")}${labels.length ? `<button id="clear-filters" class="rail-clear">清空</button>` : ""}</div></div><div class="result-meta-row"><div class="meta-left"><span class="result-count">（筛选结果${snapshot.screener.total.toLocaleString()}只）</span><label class="main-only"><input type="checkbox" id="main-only"${s.mainOnly ? " checked" : ""}><span>仅展示主代码基金</span></label></div><div class="meta-actions"><button type="button" class="btn-primary">设置指标</button><div class="meta-pill-group"><button type="button" class="btn-outline">分析${icon("chevron-down")}</button><button type="button" class="btn-outline">加入基金池${icon("chevron-down")}</button><button type="button" class="btn-outline">导出${icon("chevron-down")}</button></div></div></div></div>
      <div id="screener-table" class="app-table-wrap">${screenerTable()}</div>
      <div class="result-pager"><span class="pager-total">共${snapshot.screener.total.toLocaleString()}条</span><div class="pager-right"><button class="pager-size" type="button">10条/页</button><div class="pager-pages"><button class="is-active" type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><button type="button">5</button><span>…</span><button type="button">682</button></div><label class="pager-jump">前往 <input value="1" aria-label="跳转页码"> 页</label></div></div>
    </section>${s.fundTypePopover ? renderSelectorPopover("fundType", s.fundTypePopover) : ""}${s.companyPopover ? renderSelectorPopover("company", s.companyPopover) : ""}${Object.keys(s.tagPopover||{}).map(fid=>s.tagPopover[fid] ? renderTagCascaderPopover(getField(fid), s.tagPopover[fid]) : "").join("")}${s.perfModePopover ? renderPerfModePopover(s.perfModePopover) : ""}${s.perfCondPopover ? renderPerfCondPopover(s.perfCondPopover) : ""}</div></div>`;
}

function fundTemplate() {
  const view = parseRoute().params.get("view") || "overview";
  return window.FundAnalysisView.template(view);
}

function comparisonTemplate() {
  const c = state.compare;
  return `<div class="app-page compare-page">${pageHeader("FUND COMPARISON", "基金比较", "身份色只绑定基金；风险、资产与涨跌使用独立语义。", "4 只基金 · 数据日期 2026-09-03")}
    <div class="compare-sticky-sentinel" aria-hidden="true"></div><div class="compare-sticky" id="compare-sticky"><section class="compare-identities">${snapshot.comparison.funds.map((f,i)=>`<button style="--identity:${f.color}" data-toggle-series="${f.code}" aria-pressed="${c.visible.includes(f.code)}"><i>0${i+1}</i><span><strong>${f.name}</strong><small>${f.code} · ${f.size.toFixed(2)}亿</small></span>${icon(c.visible.includes(f.code)?"eye":"eye-off")}</button>`).join("")}</section><div class="compare-controls"><nav class="compare-anchor-nav" aria-label="基金比较维度">${[["compare-performance","收益"],["compare-ranking","排名"],["compare-structure","结构"],["compare-holdings","共同持仓"]].map(([id,label])=>`<button data-compare-anchor="${id}">${label}</button>`).join("")}</nav><div class="compare-mode-controls">${segmented("compare-mode", [["funds","基金间比较"],["relative","相对自身基准"]],c.mode)}${segmented("compare-period", [["1y","近1年"],["3y","近3年"],["5y","近5年"]],c.period)}</div></div></div>
    <section class="route-section compare-section" id="compare-performance"><div class="section-line"><div><h2>${c.mode==='funds'?'累计收益比较':'相对有效基准'}</h2><span>${c.mode==='funds'?'点击基金身份条可聚焦系列':'每只基金使用自身有效基准'}</span></div></div>${c.mode==='funds'?`<div id="compare-main-chart" class="compare-main-chart" role="img" aria-label="四只基金累计收益比较图"></div>`:`<div class="small-multiple-grid">${snapshot.comparison.funds.map((f,i)=>`<article><div><strong>${f.name}</strong><span class="${tone([7.2,-3.8,11.6,-6.4][i])}">${signed([7.2,-3.8,11.6,-6.4][i])}</span></div><div id="relative-${i}" class="mini-chart-v2" role="img" aria-label="${f.name}相对自身有效基准的收益图"></div><small>${f.benchmark}</small></article>`).join("")}</div>`}</section>
    <section class="route-section compare-section" id="compare-ranking"><div class="section-line"><div><h2>区间收益与同类排名</h2><span>同类百分位越小越优</span></div></div><div class="return-matrix"><div></div>${snapshot.comparison.funds.map(f=>`<strong style="--identity:${f.color}">${f.code}</strong>`).join("")}${[["年初至今","ytd"],["近1月","m1"],["近3月","m3"],["近1年","y1"],["近3年","y3"]].map(([label,key],ri)=>`<span>${label}</span>${snapshot.comparison.funds.map((f,i)=>`<div><b class="${tone(f[key])}">${signed(f[key])}</b><small>同类前 ${18+i*13+ri*4}%</small></div>`).join("")}`).join("")}</div></section>
    <div class="two-chart-grid compare-lower compare-section" id="compare-structure"><section class="route-section"><div class="section-line"><div><h2>资产结构比较</h2><span>最新季报</span></div></div><div id="compare-asset-chart" class="chart-v2" role="img" aria-label="四只基金大类资产结构比较图"></div></section><section class="route-section"><div class="section-line"><div><h2>行业 Top 10</h2><span>仅股票归一化</span></div></div><div id="compare-industry-chart" class="chart-v2" role="img" aria-label="四只基金行业持仓比较图"></div></section></div>
    <section class="route-section compare-section" id="compare-holdings"><div class="section-line"><div><h2>共同持仓</h2><span>至少两只基金持有</span></div></div><table class="app-table"><thead><tr><th>证券</th><th>持有基金</th><th class="num">平均权重</th><th class="num">最高权重</th><th>行业</th></tr></thead><tbody><tr><td><strong>中际旭创</strong><small>300308.SZ</small></td><td>3 / 4</td><td class="num">4.82%</td><td class="num">6.42%</td><td>通信</td></tr><tr><td><strong>宁德时代</strong><small>300750.SZ</small></td><td>3 / 4</td><td class="num">3.76%</td><td class="num">5.18%</td><td>电力设备</td></tr><tr><td><strong>腾讯控股</strong><small>00700.HK</small></td><td>2 / 4</td><td class="num">3.12%</td><td class="num">4.64%</td><td>传媒</td></tr></tbody></table></section></div>`;
}

function indexRows() { const q=state.index.query.toLowerCase(); return snapshot.indices.rows.filter(i=>(state.index.tag==='全部'||i.tags.includes(state.index.tag)||(state.index.tag==='行业主题'&&i.tags.some(t=>['科技','红利'].includes(t))))&&`${i.name}${i.code}`.toLowerCase().includes(q)); }
function indexBrowseTemplate() {
  const tags=["全部","宽基","大盘","成长","科技","红利","行业主题"];
  return `<div class="app-page index-page">${pageHeader("INDEX TO FUND", "指数选基", "先确定指数，再比较直接跟踪、联接、增强与基准产品。", "指数数据 2026-09-03")}<section class="index-search-panel"><label class="app-search large">${icon("search")}<input id="index-query" value="${state.index.query}" placeholder="输入指数名称或代码"></label><div class="view-buttons"><button data-index-view="cards" aria-pressed="${state.index.view==='cards'}">${icon("layout-grid")}</button><button data-index-view="list" aria-pressed="${state.index.view==='list'}">${icon("list")}</button></div></section><div class="index-tags"><strong>标签</strong>${tags.map(t=>`<button data-index-tag="${t}" aria-pressed="${state.index.tag===t}">${t}</button>`).join("")}</div><section id="index-results" class="index-results ${state.index.view==='list'?'is-list':''}">${indexCards()}</section></div>`;
}
function indexCards() { const rows=indexRows(); if(!rows.length)return `<div class="empty-result">${icon("search-x")}<strong>暂无匹配指数</strong><span>调整标签或搜索词后重试</span></div>`; return rows.map(i=>`<a class="index-record" href="#/index/${i.code}"><div><h2>${i.name}<small>${i.code}</small></h2><b class="${tone(i.change)}">${signed(i.change)}</b></div><p>${i.tags.map(t=>`<span>${t}</span>`).join("")}</p><dl><div><dt>跟踪ETF</dt><dd>${i.etfCount}只</dd></div><div><dt>相关产品</dt><dd>${i.relatedCount}只</dd></div><div><dt>规模</dt><dd>${i.size.toLocaleString()}亿</dd></div><div><dt>近3月资金流</dt><dd class="${tone(i.flow)}">${signed(i.flow,1,"亿")}</dd></div></dl></a>`).join(""); }
function indexDetailTemplate() {
  const relation=state.index.relation; const rows=snapshot.indices.etfs.filter(i=>relation==='all'||i.relation===relation);
  return `<div class="app-page index-detail-page"><a class="back-link" href="#/index">${icon("arrow-left")}返回指数列表</a>${pageHeader("INDEX PROFILE", "沪深300（000300）", "代表沪深市场规模大、流动性好的300只证券。", "收盘数据 · 2026-09-03")}<section class="index-hero"><div><span>近1年收益</span><strong class="is-rise">+11.03%</strong><small>同类宽基前 42%</small></div><div><span>指数规模</span><strong>4,218 亿</strong><small>相关ETF合计</small></div><div><span>跟踪产品</span><strong>48 只</strong><small>场内ETF</small></div><div><span>估值分位</span><strong>57%</strong><small>近10年</small></div></section><section class="route-section"><div class="section-line"><div><h2>指数走势与估值</h2><span>收盘数据 · 不做视觉平滑</span></div>${segmented("index-period", [["1y","近1年"],["3y","近3年"],["5y","近5年"]],"3y")}</div><div id="index-trend-chart" class="compare-main-chart" role="img" aria-label="沪深300指数走势与估值分位图"></div></section><section class="route-section"><div class="section-line"><div><h2>产品关系</h2><span>指数 → 场内ETF / 联接 / 增强 / 基准产品</span></div></div><div class="relation-flow"><strong>沪深300</strong><i></i><span>直接跟踪 ETF</span><span>ETF 联接</span><span>指数增强</span><span>业绩基准</span></div><div class="relation-tabs">${[["all","全部"],["场内ETF","场内ETF"],["联接基金","联接"],["指数增强","增强"]].map(([v,l])=>`<button data-relation="${v}" aria-pressed="${relation===v}">${l}</button>`).join("")}</div><div id="relation-table"><table class="app-table"><thead><tr><th>产品</th><th>关系</th><th>代码</th><th class="num">规模</th><th class="num">近1年</th><th class="num">跟踪误差</th></tr></thead><tbody>${rows.map(i=>`<tr><td><strong>${i.name}</strong></td><td><span class="relation-badge">${i.relation}</span></td><td>${i.code}</td><td class="num">${i.size.toFixed(1)}亿</td><td class="num is-rise">${signed(11.03+i.excess)}</td><td class="num">${i.tracking.toFixed(2)}%</td></tr>`).join("")}</tbody></table></div></section></div>`;
}

function renderHome() { view.innerHTML=homeTemplate(); bindSegmented("home-market-mode",()=>toast("市场视角已切换（效果交互）")); }
function renderResearchTools() {
  view.innerHTML = researchToolsTemplate();
  document.querySelectorAll("[data-tool]").forEach((item) => item.addEventListener("click", (event) => {
    event.preventDefault();
    toast(`${item.dataset.tool}工具将在此处打开`);
  }));
  syncIcons();
}
function bindSegmented(id, callback) {
  const group = document.getElementById(id); if (!group) return;
  group.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    group.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    callback(button.dataset.value, button);
  }));
}
function updateScreenerUrl() { setParams({ q:state.screener.query, view:state.screener.view, sort:state.screener.sort }); saveState(); }
function screenerCount() {
  const n = activeFilterCount();
  const base = Math.max(18, snapshot.screener.total - n * 8714);
  return Math.round(base * (state.screener.query ? .11 : 1));
}
function refreshScreenerResults() {
  const table = document.getElementById("screener-table");
  if (table) table.innerHTML = screenerTable();
  const resultNumber = document.querySelector(".result-tools strong span");
  if (resultNumber) resultNumber.textContent = screenerCount().toLocaleString();
  const applyBtn = document.getElementById("apply-filters");
  if (applyBtn) applyBtn.textContent = `查看结果（${screenerCount().toLocaleString()} 只）`;
  const chips = document.getElementById("filter-chips");
  if (chips) { const labels = activeFilterLabels(); chips.innerHTML = labels.map(l=>`<button data-clear-label="${l}"><span class="chip-text">${l}</span>${icon("x")}</button>`).join("") + (labels.length ? `<button id="clear-filters" class="rail-clear">清空</button>` : ""); }
  bindScreenerSelection();
  bindChipRemoval();
  syncIcons();
}
function bindChipRemoval() {
  document.querySelectorAll("[data-clear-label]").forEach(b=>b.onclick=()=>{
    const label = b.dataset.clearLabel.split(":")[0];
    // 业绩筛选的胶囊标签显示的是当前指标名（区间收益率/年化收益率/超额年化收益率）
    const f = flatScreenerFields().find(x=>x.label===label)
      || flatScreenerFields().find(x=>x.type==="performance" && ((state.screener.criteria[x.id]||{}).mode || x.label)===label);
    if (f) {
      delete state.screener.criteria[f.id];
      if (f.id === "fundType") {
        delete state.screener.criteria.subType;
        state.screener.activeFundType = null;
        state.screener.fundTypePopover = null;
      }
      if (f.id === "company") {
        state.screener.activeCompany = null;
        state.screener.companyPopover = null;
      }
      if (f.popover === "tag") {
        state.screener.activeTagRoot[f.id] = null;
        state.screener.tagPopover[f.id] = null;
        delete state.screener.tagCascadePath[f.id];
      }
      updateScreenerUrl(); renderScreener();
    }
  });
}
function bindScreenerSelection() {
  document.querySelectorAll("[data-select-fund]").forEach(input=>input.onchange=()=>{state.screener.selected=input.checked?[...new Set([...state.screener.selected,input.dataset.selectFund])]:state.screener.selected.filter(c=>c!==input.dataset.selectFund);saveState();renderScreener()});
  const all = document.getElementById("select-all");
  if (all) all.onchange=()=>{const codes=filteredFunds().map(row=>row.code);state.screener.selected=all.checked?[...new Set([...state.screener.selected,...codes])]:state.screener.selected.filter(code=>!codes.includes(code));saveState();renderScreener()};
}
// 把选择器浮层定位到当前 chip 的下方，自动避免超出视口
// 基金类型锚点：fundType chips；基金公司锚点：company chips
function positionSelectorPopover(pop) {
  const kind = pop.dataset.selectorKind;
  const key = pop.dataset.selectorKey;
  const fid = kind === "fundType" ? "fundType" : "company";
  const chip = document.querySelector(`[data-chips-field='${fid}'] [data-chip='${CSS.escape(key)}']`);
  if (!chip) return;
  const r = chip.getBoundingClientRect();
  pop.style.left = `${r.left}px`;
  pop.style.top = `${r.bottom + 6}px`;
  pop.style.minWidth = `${Math.max(168, r.width)}px`;
  // 若右/下超出视口，则翻转或收进
  const pr = pop.getBoundingClientRect();
  if (pr.right > window.innerWidth - 8) pop.style.left = `${Math.max(8, window.innerWidth - pr.width - 8)}px`;
  if (pr.bottom > window.innerHeight - 8) pop.style.top = `${Math.max(8, r.top - pr.height - 6)}px`;
}
// 点击选择器浮层外部时收起（浮层和对应 chips 内部点击不处理）
function bindPopoverOutside() {
  const hasTagPopover = Object.values(state.screener.tagPopover||{}).some(Boolean);
  if (!state.screener.fundTypePopover && !state.screener.companyPopover && !hasTagPopover && !state.screener.perfModePopover && !state.screener.perfCondPopover) return;
  setTimeout(()=>{
    document.addEventListener("pointerdown", function h(ev){
      // chips 内部点击交给各自的 chip 绑定处理（可一步切换到另一选择器）
      if (ev.target.closest("[data-chips-field]")) return;
      // 业绩筛选的标题选择器和月份胶囊内部点击交给各自绑定处理
      if (ev.target.closest("[data-perf-mode-toggle], [data-performance-field]")) return;
      const inFundPop = ev.target.closest(`[data-selector-kind="fundType"]`);
      const inComPop = ev.target.closest(`[data-selector-kind="company"]`);
      const inTagPop = ev.target.closest(`[data-tag-popover]`);
      const inPerfModePop = ev.target.closest(`[data-perf-mode-popover]`);
      const inPerfCondPop = ev.target.closest(`[data-perf-cond-popover]`);
      if (inFundPop || inComPop || inTagPop || inPerfModePop || inPerfCondPop) return;
      state.screener.fundTypePopover = null;
      state.screener.companyPopover = null;
      state.screener.tagPopover = {};
      state.screener.tagCascadePath = {};
      state.screener.perfModePopover = null;
      state.screener.perfCondPopover = null;
      saveState(); renderScreener();
      document.removeEventListener("pointerdown", h);
    });
  }, 0);
}
// 定位业绩筛选浮层：指标浮层锚定标题选择器，条件浮层锚定当前月份胶囊
function positionPerfPopovers() {
  const clampPop = (pop, r) => {
    pop.style.left = `${r.left}px`;
    pop.style.top = `${r.bottom + 6}px`;
    const pr = pop.getBoundingClientRect();
    if (pr.right > window.innerWidth - 8) pop.style.left = `${Math.max(8, window.innerWidth - pr.width - 8)}px`;
    if (pr.bottom > window.innerHeight - 8) pop.style.top = `${Math.max(8, r.top - pr.height - 6)}px`;
  };
  const modePop = document.querySelector("[data-perf-mode-popover]");
  if (modePop) {
    const t = document.querySelector(`[data-perf-mode-toggle='${modePop.dataset.perfModePopover}']`);
    if (t) clampPop(modePop, t.getBoundingClientRect());
  }
  const condPop = document.querySelector("[data-perf-cond-popover]");
  if (condPop) {
    const fid = condPop.dataset.perfCondPopover;
    const period = (state.screener.criteria[fid] || {}).period;
    const chip = period && document.querySelector(`[data-performance-field='${fid}'] [data-performance-period='${CSS.escape(period)}']`);
    const anchor = chip || document.querySelector(`[data-performance-field='${fid}']`);
    if (anchor) clampPop(condPop, anchor.getBoundingClientRect());
  }
}
// 标签浮层内的节点点击：勾选切换 + 有子级时展开/切换下一列
function bindTagPopoverClicks() {
  document.querySelectorAll("[data-tag-popover]").forEach(pop=>{
    const fid = pop.dataset.tagPopover;
    const f = getField(fid);
    const root = pop.dataset.tagRoot;
    const c = state.screener.criteria;
    pop.querySelectorAll("[data-cascader-pick]").forEach(btn=>{
      btn.onclick=()=>{
        const val = btn.dataset.cascaderPick;
        const parts = tagPath(val);
        const nodeName = parts[parts.length - 1];
        const rootChildren = tagLevel(f.tagKind, [root]);
        if (!rootChildren.length) {
          const arr = Array.isArray(c[fid]) ? c[fid] : [];
          if (arr.includes(root)) delete c[fid]; else c[fid] = [root];
          updateScreenerUrl(); renderScreener(); return;
        }
        const arr = Array.isArray(c[fid]) ? c[fid] : [];
        const nodeObj = tagLevel(f.tagKind, parts.slice(0, -1)).find(n => n.name === nodeName);
        const branch = tagBranchValues(parts, nodeObj);
        const branchAllOn = branch.every(x => arr.includes(x));
        const next = branchAllOn
          ? arr.filter(x => !branch.includes(x))
          : [...new Set([...arr, ...branch])];
        if (next.length) c[fid] = next; else delete c[fid];
        updateScreenerUrl(); renderScreener();
      };
    });
    pop.querySelectorAll("[data-cascader-expand]").forEach(btn=>{
      btn.onclick=()=>{
        const parts = tagPath(btn.dataset.cascaderExpand);
        const depthFromRoot = parts.length - 1;
        const relPath = Array.isArray(state.screener.tagCascadePath[fid]) ? state.screener.tagCascadePath[fid] : [];
        state.screener.tagCascadePath[fid] = [...relPath.slice(0, depthFromRoot - 1), parts[parts.length - 1]];
        renderScreener();
      };
    });
  });
}
// 标签浮层定位到当前根 chip 的下方
function positionTagPopover() {
  document.querySelectorAll("[data-tag-popover]").forEach(pop=>{
    const fid = pop.dataset.tagPopover;
    const root = pop.dataset.tagRoot;
    const chip = document.querySelector(`[data-chips-field='${fid}'] [data-chip='${CSS.escape(root)}']`);
    if (!chip) return;
    const r = chip.getBoundingClientRect();
    pop.style.top = `${r.bottom + 6}px`;
    pop.style.minWidth = `264px`;
    pop.style.left = `${r.left}px`;
    const pr = pop.getBoundingClientRect();
    if (pr.right > window.innerWidth - 8) pop.style.left = `${Math.max(8, window.innerWidth - pr.width - 8)}px`;
    if (pr.bottom > window.innerHeight - 8) pop.style.top = `${Math.max(8, r.top - pr.height - 6)}px`;
  });
}
function renderScreener() {
  // 重新渲染筛选条件时保留左侧滚动位置，避免点击标签后筛选页跳回顶部。
  const railGroups = document.querySelector(".screener-page .rail-groups");
  const railScrollTop = railGroups ? railGroups.scrollTop : 0;
  const resultTable = document.querySelector(".screener-page .app-table-wrap");
  const resultScrollTop = resultTable ? resultTable.scrollTop : 0;
  view.innerHTML=screenerTemplate();
  const nextRailGroups = document.querySelector(".screener-page .rail-groups");
  if (nextRailGroups) nextRailGroups.scrollTop = railScrollTop;
  const nextResultTable = document.querySelector(".screener-page .app-table-wrap");
  if (nextResultTable) nextResultTable.scrollTop = resultScrollTop;
  document.getElementById("collapse-rail").onclick=()=>{state.screener.collapsed=true;saveState();document.querySelector(".screener-workbench").classList.add("is-collapsed")};
  document.getElementById("expand-rail").onclick=()=>{state.screener.collapsed=false;saveState();document.querySelector(".screener-workbench").classList.remove("is-collapsed")};
  document.getElementById("fund-query").oninput=(e)=>{state.screener.query=e.target.value;updateScreenerUrl();refreshScreenerResults()};
  // 折叠组
  document.querySelectorAll("[data-group-toggle]").forEach(b=>b.onclick=()=>{
    const name = b.dataset.groupToggle;
    state.screener.openGroups[name] = !state.screener.openGroups[name];
    saveState(); b.parentElement.classList.toggle("is-open");
  });
  // 组内 chips（按字段配置单选/多选）
  document.querySelectorAll("[data-chips-field]").forEach(box=>box.onclick=(e)=>{
    const btn = e.target.closest("[data-chip]"); if(!btn) return;
    const fid = box.dataset.chipsField; const val = btn.dataset.chip;
    const fld = getField(fid); const c = state.screener.criteria;
    if (fid === "fundType") {
      if (val === "全部") {
        state.screener.activeFundType = null;
        state.screener.fundTypePopover = null;
        delete c.fundType; delete c.subType;
      } else {
        state.screener.activeFundType = val;
        c.fundType = [...new Set([...(Array.isArray(c.fundType) ? c.fundType : []), val])];
        // 选择器互切：关掉其他浮层，避免重叠
        state.screener.companyPopover = null;
        state.screener.perfModePopover = null; state.screener.perfCondPopover = null;
        // 再次点击同一类型则收起浮层，否则浮层展示该类型的二级分类
        state.screener.fundTypePopover = state.screener.fundTypePopover === val ? null : val;
      }
      updateScreenerUrl(); renderScreener(); return;
    }
    if (fid === "company") {
      if (val === "全部") {
        state.screener.activeCompany = null;
        state.screener.companyPopover = null;
        delete c.company;
      } else {
        state.screener.activeCompany = val;
        // 选择器互切：关掉其他浮层，避免重叠
        state.screener.fundTypePopover = null;
        state.screener.perfModePopover = null; state.screener.perfCondPopover = null;
        // 再次点击同一字母则收起浮层，否则浮层展示该字母下的公司
        state.screener.companyPopover = state.screener.companyPopover === val ? null : val;
      }
      updateScreenerUrl(); renderScreener(); return;
    }
    if (fld && fld.popover === "tag") {
      if (val === "全部") {
        state.screener.activeTagRoot[fid] = null;
        state.screener.tagPopover[fid] = null;
        delete state.screener.tagCascadePath[fid];
        delete c[fid];
      } else {
        // 互切：关掉其他浮层，避免重叠
        state.screener.fundTypePopover = null;
        state.screener.companyPopover = null;
        state.screener.perfModePopover = null; state.screener.perfCondPopover = null;
        Object.keys(state.screener.tagPopover).forEach(k=>{ if (k !== fid) state.screener.tagPopover[k] = null; });
        state.screener.activeTagRoot[fid] = val;
        // 再次点击同一根则收起浮层，否则浮层展示该根的级联选择
        state.screener.tagPopover[fid] = state.screener.tagPopover[fid] === val ? null : val;
        // 切换根时重置浮层内浏览路径
        if (state.screener.tagPopover[fid]) state.screener.tagCascadePath[fid] = [];
        else delete state.screener.tagCascadePath[fid];
      }
      updateScreenerUrl(); renderScreener(); return;
    }
    if (isSingleField(fld)) {
      if (val === "全部") delete c[fid]; else c[fid] = val;
    } else {
      const arr = Array.isArray(c[fid]) ? c[fid] : [];
      if (val === "全部") delete c[fid];
      else if (arr.includes(val)) {
        const next = arr.filter(x => x !== val);
        if (next.length) c[fid] = next; else delete c[fid];
      } else c[fid] = [...arr, val];
    }
    updateScreenerUrl(); renderScreener();
  });
  // 业绩筛选：点击标题展开指标选择浮层
  document.querySelectorAll("[data-perf-mode-toggle]").forEach(b=>b.onclick=()=>{
    const fid = b.dataset.perfModeToggle;
    state.screener.perfModePopover = state.screener.perfModePopover === fid ? null : fid;
    // 互切：关掉其他浮层，避免重叠
    state.screener.perfCondPopover = null;
    state.screener.fundTypePopover = null; state.screener.companyPopover = null;
    state.screener.tagPopover = {}; state.screener.tagCascadePath = {};
    saveState(); renderScreener();
  });
  // 业绩筛选：点击月份选中并展开条件浮层，再次点击同一月份收起
  document.querySelectorAll("[data-performance-field]").forEach(box=>box.onclick=(e)=>{
    const control = e.target.closest("[data-performance-period]");
    if (!control) return;
    const fid = box.dataset.performanceField;
    const period = control.dataset.performancePeriod;
    const current = state.screener.criteria[fid] || {};
    if (current.period === period) {
      state.screener.perfCondPopover = state.screener.perfCondPopover === fid ? null : fid;
    } else {
      state.screener.criteria[fid] = { mode: current.mode || perfDefaultMode(fid), period, condition: current.condition || "排名", value: current.value || "" };
      state.screener.perfCondPopover = fid;
    }
    // 互切：关掉其他浮层，避免重叠
    state.screener.perfModePopover = null;
    state.screener.fundTypePopover = null; state.screener.companyPopover = null;
    state.screener.tagPopover = {}; state.screener.tagCascadePath = {};
    updateScreenerUrl(); renderScreener();
  });
  // 指标浮层：选择业绩指标后收起
  document.querySelectorAll("[data-perf-mode-popover]").forEach(pop=>{
    const fid = pop.dataset.perfModePopover;
    pop.querySelectorAll("[data-perf-mode-pick]").forEach(btn=>btn.onclick=()=>{
      const current = state.screener.criteria[fid] || {};
      state.screener.criteria[fid] = { mode: btn.dataset.perfModePick, period: current.period || "", condition: current.condition || "排名", value: current.value || "" };
      state.screener.perfModePopover = null;
      updateScreenerUrl(); renderScreener();
    });
  });
  // 条件浮层：排名单选 / 全部不限制 / 自定义数值
  document.querySelectorAll("[data-perf-cond-popover]").forEach(pop=>{
    const fid = pop.dataset.perfCondPopover;
    const base = ()=>{
      const current = state.screener.criteria[fid] || {};
      return { mode: current.mode || perfDefaultMode(fid), period: current.period || "" };
    };
    pop.querySelectorAll("[data-perf-rank]").forEach(btn=>btn.onclick=()=>{
      const pick = btn.dataset.perfRank;
      state.screener.criteria[fid] = pick === "全部"
        ? { ...base(), condition: "排名", value: "" }
        : { ...base(), condition: "排名", value: pick };
      state.screener.perfCondPopover = null;
      updateScreenerUrl(); renderScreener();
    });
    const input = pop.querySelector("[data-perf-custom-input]");
    const applyCustom = ()=>{
      const n = parseFloat(input.value);
      if (isNaN(n)) { input.focus(); return; }
      state.screener.criteria[fid] = { ...base(), condition: "数值", value: `≥${n}%` };
      state.screener.perfCondPopover = null;
      updateScreenerUrl(); renderScreener();
    };
    const ok = pop.querySelector("[data-perf-custom-ok]");
    if (ok) ok.onclick = applyCustom;
    if (input) input.onkeydown = (e)=>{ if (e.key === "Enter") applyCustom(); };
    const customRadio = pop.querySelector("[data-perf-custom-radio]");
    if (customRadio) customRadio.onclick = ()=>{ if (input) input.focus(); };
  });
  // 内联字段：展开/收起
  document.querySelectorAll("[data-inline-toggle]").forEach(b=>b.onclick=()=>{
    const fid = b.dataset.inlineToggle;
    const f = getField(fid);
    if (state.screener.openInline[fid]) delete state.screener.openInline[fid];
    else { state.screener.openInline[fid] = { path: [] }; }
    saveState(); renderScreener();
  });
  // 内联面板：选项（多选）
  document.querySelectorAll("[data-inline-row]").forEach(box=>{
    const fid = box.dataset.inlineRow; const f = getField(fid); const c = state.screener.criteria;
    box.querySelectorAll("[data-inline-back]").forEach(btn=>{
      btn.onclick=()=>{
        const d = state.screener.openInline[fid];
        if (d) d.path = [];
        saveState(); renderScreener();
      };
    });
    box.querySelectorAll("[data-inline-pick]").forEach(btn=>{
      btn.onclick=()=>{
        const val = btn.dataset.inlinePick;
        if (f.inline === "company" && state.screener.openInline[fid]?.path[0]) {
          const arr = Array.isArray(c[fid]) ? c[fid] : [];
          if (val === "全部") delete c[fid];
          else if (arr.includes(val)) {
            const next = arr.filter(x => x !== val);
            if (next.length) c[fid] = next; else delete c[fid];
          } else c[fid] = [...arr, val];
        } else {
          const arr = Array.isArray(c[fid]) ? c[fid] : [];
          if (val === "全部") delete c[fid];
          else if (arr.includes(val)) {
            const next = arr.filter(x => x !== val);
            if (next.length) c[fid] = next; else delete c[fid];
          } else c[fid] = [...arr, val];
        }
        saveState(); renderScreener();
      };
    });
    // 内联面板：导航（公司字母 / 标签层级）
    box.querySelectorAll("[data-inline-nav]").forEach(btn=>{
      btn.onclick=()=>{
        const val = btn.dataset.inlineNav; const d = state.screener.openInline[fid];
        if (f.inline === "company") d.path = [val];
        else if (f.inline === "tag") {
          const p = d.path;
          if (p.length === 0 && val === "中国股票") d.path = ["中国股票"];
          else if (p[0] === "中国股票" && p.length === 1 && val === "行业") d.path = ["中国股票","行业"];
          else if (p[0] === "中国股票" && p[1] === "行业" && val === "工业") d.path = ["中国股票","行业","工业"];
        }
        saveState(); renderScreener();
      };
    });
  });
  // 标签多列级联选择器：checkbox 多选 + 右侧展开下一列
  document.querySelectorAll("[data-cascader]").forEach(wrap=>{
    const fid = wrap.dataset.cascader;
    const c = state.screener.criteria;
    wrap.querySelectorAll("[data-cascader-node]").forEach(btn=>{
      btn.onclick=()=>{
        const val = btn.dataset.cascaderNode;
        const nodePath = tagPath(val);
        const d = state.screener.openInline[fid];
        const arr = Array.isArray(c[fid]) ? c[fid] : [];
        if (arr.includes(val)) {
          const next = arr.filter(x => x !== val);
          if (next.length) c[fid] = next; else delete c[fid];
        } else c[fid] = [...arr, val];
        // 有子级则把展开路径定位到该节点（其右侧长出下一列），切换兄弟节点一步到位
        const nodes = tagLevel(getField(fid).tagKind, nodePath);
        d.path = nodes.length ? nodePath : nodePath.slice(0, -1);
        saveState(); renderScreener();
      };
    });
    wrap.querySelectorAll("[data-cascader-clear]").forEach(btn=>{
      btn.onclick=()=>{ delete c[fid]; saveState(); renderScreener(); };
    });
    wrap.querySelectorAll("[data-cascader-done]").forEach(btn=>{
      btn.onclick=()=>{ delete state.screener.openInline[fid]; saveState(); renderScreener(); };
    });
  });
  // 公司搜索
  document.querySelectorAll("[data-company-search]").forEach(inp=>{
    inp.oninput=(e)=>{
      const fid = inp.dataset.companySearch;
      const box = document.querySelector(`[data-company-result="${fid}"]`);
      if (!box) return;
      const q = e.target.value.trim();
      if (!q) { box.innerHTML = ""; return; }
      const all = Object.values(drillData.company.list).flat();
      const matched = [...new Set(all)].filter(x=>x.includes(q));
      box.innerHTML = matched.length ? inlineChipRow(matched, fid, state.screener.criteria[fid] ?? []) : "<p class='inline-hint'>无匹配公司</p>";
      bindInlineResult(fid, box);
    };
  });
  // 选择器浮层：选项多选（基金类型→二级分类；基金公司→公司）
  document.querySelectorAll(".fund-type-popover").forEach(pop=>{
    const kind = pop.dataset.selectorKind;
    const key = pop.dataset.selectorKey;
    const { field, options: allOpts } = selectorPopoverConfig(kind, key);
    const c = state.screener.criteria;
    pop.querySelectorAll("[data-pop-pick]").forEach(btn=>{
      btn.onclick=()=>{
        const val = btn.dataset.popPick;
        const fullArr = Array.isArray(c[field]) ? c[field] : [];
        if (val === "全部") {
          // 全选开关：未全选时把该键下选项全部加入，已全选时移除
          // 基金公司为跨字母累计字段，仅按当前字母的选项判断；二级分类同理按当前类型
          const allOn = allOpts.length > 0 && allOpts.every(o => fullArr.includes(o));
          if (allOn) {
            const next = fullArr.filter(x => !allOpts.includes(x));
            if (next.length) c[field] = next; else delete c[field];
          } else c[field] = [...new Set([...fullArr, ...allOpts])];
          updateScreenerUrl(); renderScreener(); return;
        }
        if (fullArr.includes(val)) {
          const next = fullArr.filter(x => x !== val);
          if (next.length) c[field] = next; else delete c[field];
        } else c[field] = [...fullArr, val];
        updateScreenerUrl(); renderScreener();
      };
    });
  });
  // 点击浮层外部收起
  bindPopoverOutside();
  document.querySelectorAll(".fund-type-popover:not(.tag-cascader-popover):not([data-perf-mode-popover]):not([data-perf-cond-popover])").forEach(positionSelectorPopover);
  bindTagPopoverClicks();
  positionTagPopover();
  positionPerfPopovers();
  const clearFilters = document.getElementById("clear-filters");
  if (clearFilters) clearFilters.onclick=()=>{state.screener.criteria={};state.screener.activeFundType=null;state.screener.fundTypePopover=null;state.screener.activeCompany=null;state.screener.companyPopover=null;state.screener.activeTagRoot={};state.screener.tagPopover={};state.screener.tagCascadePath={};state.screener.perfModePopover=null;state.screener.perfCondPopover=null;updateScreenerUrl();renderScreener()};
  const mainOnly = document.getElementById("main-only");
  if (mainOnly) mainOnly.onchange=()=>{state.screener.mainOnly=mainOnly.checked;saveState();renderScreener()};
  bindScreenerSelection();
  bindChipRemoval();
  document.querySelectorAll("[data-template]").forEach(b=>b.onclick=()=>{
    state.screener.criteria={fundType:["混合型"],scale:"10亿以上"};
    state.screener.activeFundType = "混合型";
    updateScreenerUrl();renderScreener();toast("筛选模板已应用");
  });
  syncIcons();
}
function bindInlineResult(fid, box) {
  box.querySelectorAll("[data-inline-pick]").forEach(btn=>{
    btn.onclick=()=>{
      const val = btn.dataset.inlinePick; const c = state.screener.criteria;
      const arr = Array.isArray(c[fid]) ? c[fid] : [];
      if (arr.includes(val)) {
        const next = arr.filter(x => x !== val);
        if (next.length) c[fid] = next; else delete c[fid];
      } else c[fid] = [...arr, val];
      saveState(); renderScreener();
    };
  });
}

function renderFund() {
  view.innerHTML = fundTemplate();
  window.FundAnalysisView.renderCharts();
}
let fundScrollCleanup=null;

function compareSeries(period) {
  const n=period==='1y'?12:period==='5y'?30:20;
  const targets=period==='1y'?snapshot.comparison.funds.map(f=>f.y1):period==='5y'?[54,46,83,51]:snapshot.comparison.funds.map(f=>f.y3);
  return {
    labels:Array.from({length:n},(_,i)=>`${2024+Math.floor((i+8)/12)}-${String((i+8)%12+1).padStart(2,'0')}`),
    series:snapshot.comparison.funds.filter(f=>state.compare.visible.includes(f.code)).map((f)=>{
      const sourceIndex=snapshot.comparison.funds.findIndex(item=>item.code===f.code);
      return {name:f.name,type:'line',showSymbol:false,data:Array.from({length:n},(_,i)=>+(targets[sourceIndex]*i/(n-1)+Math.sin(i*1.1+sourceIndex)*2*Math.sin(i/(n-1)*Math.PI)).toFixed(1)),lineStyle:{color:f.color,width:2}};
    })
  };
}
function renderCompareCharts() {
  if(state.compare.mode==='funds'){const d=compareSeries(state.compare.period),o=baseOption();chart("compare-main-chart",{...o,legend:{top:0,left:8,type:"scroll",itemWidth:18,itemHeight:3,textStyle:{fontSize:10}},xAxis:{type:'category',boundaryGap:false,data:d.labels,axisLabel:{fontSize:9,interval:Math.max(1,Math.floor(d.labels.length/6))}},yAxis:{type:'value',axisLabel:{formatter:'{value}%',fontSize:9},splitLine:{lineStyle:{color:C.soft}}},series:d.series});}else snapshot.comparison.funds.forEach((f,i)=>{const o=baseOption(),t=[7.2,-3.8,11.6,-6.4][i],d=Array.from({length:16},(_,j)=>+(t*j/15+Math.sin(j*.9+i)*1.5*Math.sin(j/15*Math.PI)).toFixed(1));chart(`relative-${i}`,{...o,grid:{left:34,right:10,top:10,bottom:22},xAxis:{type:'category',data:d.map((_,j)=>j),axisLabel:{show:false},axisTick:{show:false}},yAxis:{type:'value',axisLabel:{formatter:'{value}%',fontSize:8},splitLine:{lineStyle:{color:C.soft}}},series:[{type:'line',showSymbol:false,data:d,lineStyle:{color:f.color,width:2},areaStyle:{color:`${f.color}18`},markLine:{silent:true,symbol:'none',label:{show:false},data:[{yAxis:0}],lineStyle:{color:C.line}}}]})});
  let o=baseOption(); chart("compare-asset-chart",{...o,grid:{left:48,right:14,top:34,bottom:30},legend:{top:0,itemWidth:10,itemHeight:8,textStyle:{fontSize:8}},xAxis:{type:'category',data:['股票','债券','现金','其他'],axisLabel:{fontSize:9}},yAxis:{type:'value',max:100,axisLabel:{formatter:'{value}%',fontSize:8},splitLine:{lineStyle:{color:C.soft}}},series:snapshot.comparison.funds.map((f,i)=>({name:f.code,type:'bar',barGap:0,data:[[82,12,5,1],[78,16,4,2],[91,3,5,1],[74,8,16,2]][i],itemStyle:{color:f.color}}))});
  o=baseOption(); chart("compare-industry-chart",{...o,grid:{left:62,right:12,top:20,bottom:28},xAxis:{type:'value',axisLabel:{formatter:'{value}%',fontSize:8},splitLine:{lineStyle:{color:C.soft}}},yAxis:{type:'category',inverse:true,data:['通信','电子','电力设备','医药','传媒','非银'],axisLabel:{fontSize:9}},series:[{type:'bar',barWidth:11,data:[16.2,14.1,8.6,9.7,6.8,6.2],itemStyle:{color:C.blue},label:{show:true,position:'right',formatter:'{c}%',fontSize:8}}]});
}
function renderCompare() {
  if(window.CompareView){window.CompareView.render(view);return;}
  view.innerHTML=comparisonTemplate(); renderCompareCharts();
  document.querySelectorAll('[data-toggle-series]').forEach(b=>b.onclick=()=>{const code=b.dataset.toggleSeries;if(state.compare.visible.includes(code)&&state.compare.visible.length===1){toast('至少保留一只基金用于比较');return}state.compare.visible=state.compare.visible.includes(code)?state.compare.visible.filter(c=>c!==code):[...state.compare.visible,code];saveState();renderRoute(true)});
  bindSegmented('compare-mode',v=>{state.compare.mode=v;saveState();setParams({mode:v});renderRoute(true)});
  bindSegmented('compare-period',v=>{state.compare.period=v;saveState();setParams({period:v});renderRoute(true)});
  const sections=[...document.querySelectorAll('.compare-section')];
  document.querySelectorAll('[data-compare-anchor]').forEach(button=>button.onclick=()=>{
    document.querySelectorAll('[data-compare-anchor]').forEach(item=>item.classList.toggle('is-active',item===button));
    document.getElementById(button.dataset.compareAnchor)?.scrollIntoView({behavior:'smooth'});
  });
  const sticky=document.getElementById('compare-sticky'); const sentinel=document.querySelector('.compare-sticky-sentinel'); const compactAt=sentinel.offsetTop+24;
  routeScrollHandler=()=>{
    sticky.classList.toggle('is-compact',scrollY>compactAt);
    const atBottom=innerHeight+scrollY>=document.documentElement.scrollHeight-4;
    const active=atBottom?sections.at(-1):[...sections].reverse().find(section=>section.getBoundingClientRect().top<=132)||sections[0];
    document.querySelectorAll('[data-compare-anchor]').forEach(button=>button.classList.toggle('is-active',button.dataset.compareAnchor===active.id));
  };
  window.addEventListener('scroll',routeScrollHandler,{passive:true}); routeScrollHandler();
}
function renderIndexBrowse() { view.innerHTML=indexBrowseTemplate();document.getElementById('index-query').oninput=e=>{state.index.query=e.target.value;saveState();setParams({q:e.target.value});document.getElementById('index-results').innerHTML=indexCards();syncIcons()};document.querySelectorAll('[data-index-tag]').forEach(b=>b.onclick=()=>{state.index.tag=b.dataset.indexTag;saveState();setParams({tag:state.index.tag});renderIndexBrowse();syncIcons()});document.querySelectorAll('[data-index-view]').forEach(b=>b.onclick=()=>{state.index.view=b.dataset.indexView;saveState();setParams({view:state.index.view});renderIndexBrowse();syncIcons()});}
function renderIndexDetail() { view.innerHTML=indexDetailTemplate();let o=baseOption(),labels=Array.from({length:20},(_,i)=>`${2025+Math.floor((i+2)/12)}-${String((i+2)%12+1).padStart(2,'0')}`),line=labels.map((_,i)=>+(7+i*.5+Math.sin(i*.8)*2.3).toFixed(1));chart('index-trend-chart',{...o,legend:{top:0,left:0,itemWidth:18,itemHeight:3,textStyle:{fontSize:10}},xAxis:{type:'category',boundaryGap:false,data:labels,axisLabel:{fontSize:9,interval:3}},yAxis:{type:'value',axisLabel:{formatter:'{value}%',fontSize:9},splitLine:{lineStyle:{color:C.soft}}},series:[{name:'沪深300',type:'line',showSymbol:false,data:line,lineStyle:{color:C.blue,width:2}},{name:'估值分位',type:'line',showSymbol:false,data:line.map((v,i)=>+(45+Math.sin(i*.45)*14).toFixed(1)),lineStyle:{color:C.orange,width:1.4,type:'dashed'}}]});document.querySelectorAll('[data-relation]').forEach(b=>b.onclick=()=>{state.index.relation=b.dataset.relation;saveState();setParams({relation:state.index.relation});renderIndexDetail();syncIcons()});bindSegmented('index-period',()=>toast('指数周期已切换（效果交互）'));}

function updateNav(module) {
  const navKey = ({ screener: "fund-research", fund: "fund-research", compare: "fund-research", "manager-compare": "fund-research", index: "fund-research" })[module] || module;
  document.querySelectorAll('[data-route-nav]').forEach(a=>{const active=a.dataset.routeNav===navKey;a.classList.toggle('is-active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.querySelectorAll('[data-route-leaf]').forEach(a=>a.classList.toggle('is-active',a.dataset.routeLeaf===module));
}
function renderRoute(preserveScroll=false) {
  window.ManagerCompareView?.dispose();
  document.body.classList.remove("fund-sketch-mode");
  if(fundScrollCleanup){ document.removeEventListener("scroll", fundScrollCleanup); fundScrollCleanup=null; }
  const y=preserveScroll?scrollY:0; disposeCharts(); const route=parseRoute(); absorbParams(route); const module=route.segments[0]||'home'; updateNav(module); document.getElementById('route-progress').classList.add('is-running');
  document.body.classList.toggle('zc-compare-mode',module==='compare'||module==='manager-compare');
  document.body.classList.toggle('zc-manager-mode',module==='manager-compare');
  if(module==='home')renderHome(); else if(module==='screener')renderScreener(); else if(module==='fund')renderFund(); else if(module==='compare')renderCompare(); else if(module==='manager-compare')window.ManagerCompareView.render(view); else if(module==='index'&&route.segments[1])renderIndexDetail(); else if(module==='index')renderIndexBrowse(); else if(module==='research-tools')renderResearchTools(); else { location.hash='#/home'; return; }
  syncIcons(); document.title=`${({home:'首页',screener:'基金筛选',fund:'基金分析',compare:'基金比较','manager-compare':'经理比较',index:'指数选基'})[module]} - 智策研究工作台`; requestAnimationFrame(()=>{if(preserveScroll)scrollTo(0,y);else if(!(module==='fund'&&route.params.get('anchor')))scrollTo(0,0);document.getElementById('route-progress').classList.remove('is-running')});
}
window.addEventListener('hashchange',()=>renderRoute()); window.addEventListener('resize',()=>charts.forEach(c=>c.resize()));
document.querySelectorAll('[data-soon]').forEach(btn=>btn.addEventListener('click',()=>toast(`「${btn.dataset.soon}」功能规划中，敬请期待`)));
if(!location.hash)location.replace('#/home'); else renderRoute();
