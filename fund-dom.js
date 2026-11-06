(function () {
  const views = [
    ["overview", "产品概览"], ["returns", "收益"], ["holdings", "持仓分析"], ["attribution", "收益归因"],
    ["manager", "基金经理"], ["company", "基金公司"], ["risk", "风险"], ["basics", "基本信息"]
  ];
  const viewMap = Object.fromEntries(views);
  const labels = Array.from({ length: 20 }, (_, i) => `${2018 + Math.floor(i / 12)}/${String(i % 12 + 1).padStart(2, "0")}`);
  const fundLine = labels.map((_, i) => +(30 + i * 1.1 + Math.sin(i * .72) * 7).toFixed(2));
  const peerLine = labels.map((_, i) => +(29 + i * .35 + Math.sin(i * .58 + 1) * 2.2).toFixed(2));
  const benchmarkLine = labels.map((_, i) => +(30 - i * .8 + Math.sin(i * .8) * 6).toFixed(2));

  const select = (label, wide = false) => `<label class="fund-select${wide ? " is-wide" : ""}"><span class="sr-only">${label}</span><select><option>${label}</option></select></label>`;
  const iconButton = (name, label) => `<button class="fund-action-button" type="button" aria-label="${label}" title="${label}"><i data-lucide="${name}"></i><span>${label}</span></button>`;
  const toolButton = (name, label, on = false) => `<button class="fund-tool-btn${on ? " is-on" : ""}" type="button" aria-label="${label}" title="${label}"><i data-lucide="${name}"></i></button>`;
  const chartBox = (id, title, className = "") => `<section class="fund-chart-block ${className}"><h3>${title}</h3><div id="${id}" class="fund-chart" role="img" aria-label="${title}"></div></section>`;

  function tabs(active) {
    return `<nav class="fund-tabs" aria-label="基金分析页面">${views.map(([id, label]) => `<button type="button" data-fund-tab="${id}"${id === active ? ' class="is-active" aria-current="page"' : ""}>${label}</button>`).join("")}</nav>`;
  }

  function header(active) {
    return `<header class="fund-identity-panel">
      <div class="fund-identity-main">
        <div class="fund-title-row"><h1>交银定期支付双息平衡混合(516732)</h1><span class="fund-stars" aria-label="4星">★★★★<span>★</span></span></div>
        <p>偏股混合型 · 大盘-成长型 · 华夏基金管理有限公司 · 基金经理 郑晓辉 / 刘睿聪</p>
        <div class="fund-tags"><span>中国股票</span><span>风格</span><span>大盘-成长型</span><span>大盘 成长型</span><span>成立时间：2001-12-18</span></div>
      </div>
      <div class="fund-identity-actions">${iconButton("plus-circle", "切换")}${iconButton("heart", "收藏")}${iconButton("layers", "对比")}</div>
      <dl class="fund-identity-metrics">
        <div><dt>单位净值</dt><dd>1.3371<em>+0.58%</em></dd><small>2026-09-23</small></div>
        <div><dt>累计净值</dt><dd>1.3371</dd><small>成立以来 +731.82%</small></div>
        <div><dt>最新规模</dt><dd>39.38 <b>亿</b></dd><small>2026-06-30</small></div>
        <div><dt>综合费率</dt><dd>1.70%</dd><small>同类平均 2.31%</small></div>
      </dl>${tabs(active)}
    </header>`;
  }

  function panel(kicker, title, content, controls = "", className = "") {
    return `<section class="fund-panel ${className}"><header class="fund-panel-head"><div>${kicker ? `<span>${kicker}</span>` : ""}${title ? `<h2>${title}</h2>` : ""}</div>${controls ? `<div class="fund-panel-controls">${controls}</div>` : ""}</header>${content}</section>`;
  }

  function dataTable(headers, rows, numeric = []) {
    const nums = new Set(numeric);
    return `<div class="fund-table-wrap"><table class="fund-table"><thead><tr>${headers.map((v, i) => `<th${nums.has(i) ? ' class="is-num"' : ""}>${v}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((v, i) => `<td${nums.has(i) ? ' class="is-num"' : ""}>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  const stars = n => `<span class="fund-mini-stars" aria-label="${n}星">${"★".repeat(n)}<i>${"★".repeat(5 - n)}</i></span>`;
  const pct = v => v.startsWith("-") ? `<span class="is-fall">${v}%</span>` : `<span class="is-rise">${v}%</span>`;

  function analysisCards() {
    const cards = [
      ["绩效分析", "近3年，与同类基金相比，该基金收益较高、风险较高。\n近3年，年化收益率为12.96%，好于沪深300指数；最大回撤为27.28%，差于沪深300指数；年化收益率高于69%的混合型基金，最大回撤小于45%的混合型基金。\n该基金自成立以来在股票牛市中收益表现和市场相当，股票熊市中风控表现总体跑赢市场。"],
      ["投资风格", "该基金属于灵活配置型基金，最新规模为39.38亿元。\n投资偏重股票，整体风格为大盘-成长型，持股比例为78.76%，持股比例中等。\n股票行业偏好集中，主要为电子。重仓股票持有时间短。行业轮动。债券投资中偏好的券种为国债。"],
      ["基金经理", "基金经理一共1名。\n郑晓辉, 管理公募基金14.75年，目前在管基金4只，在管规模116.55亿元。\n近5年，该经理的综合指数年化收益率为0.87%，好于沪深300。最大回撤为-52.84%，差于沪深300。博取收益能力较同期同类型基金经理中等，控制风险能力较同期同类型基金经理弱。\n郑晓辉投资偏重股票，整体风格为大盘-成长型。\n股票行业偏好集中，主要为电子。重仓股票持有时间长。行业分布多变。\n债券投资中偏好的券种为金融债券、国债、政策性金融债券。"],
      ["基金经理", "华夏基金管理有限公司成立于1998年，当前管理规模为21111亿元，规模巨大。\n旗下管理基金一共577只，以权益类为主。\n旗下基金经理共138名，团队庞大。"]
    ];
    return `<div class="fund-analysis-list">${cards.map(([title, body]) => `<article class="fund-analysis-card"><header>${title}</header><div class="fund-analysis-body">${body.split("\n").map(p => `<p>${p}</p>`).join("")}</div></article>`).join("")}<button class="fund-collapse-btn" type="button">收起 <i data-lucide="chevron-up"></i></button></div>`;
  }

  function quartileCell(rating) {
    const lit = { "优秀": 4, "高": 4, "较高": 3, "一般": 2, "较低": 1, "不佳": 1 }[rating] || 0;
    const colors = ["#8280B6", "#9D9ACC", "#B1AED9", "#D0CFE6"];
    return `<span class="fund-quartile" aria-label="${rating}">${[0, 1, 2, 3].map(i => `<i style="background:${i >= 4 - lit ? colors[i] : "#fff"}"></i>`).join("")}</span>`;
  }

  function ratingSlider(active, tone, inner = "") {
    return `<span class="fund-rating-slider">${[0, 1, 2, 3, 4].map(i => `<i class="${i === active ? `is-on ${tone}` : ""}">${i === active ? inner : ""}</i>`).join("")}</span>`;
  }

  function overview() {
    const summary = `<div class="fund-summary-grid">
      <div><span>收益能力</span><strong>前 24%</strong><small>近一年回报 22.64%，高于同类平均。</small></div>
      <div><span>风险控制</span><strong>前 47%</strong><small>最大回撤 -27.00%，修复期 184 天。</small></div>
      <div><span>风格稳定性</span><strong>中等</strong><small>大盘成长暴露增强，通信行业超配明显。</small></div>
      <div><span>有效基准</span><strong>适配基准</strong><small>科技传媒通信150×65% + 中证综合债×35%。</small></div>
    </div>`;

    const holdings = [
      ["600887", "南极电商", "7.44%", "-3.54"], ["000333", "保利地产", "7.32%", "4.60"], ["300026", "东方雨虹", "6.23%", "-0.74"],
      ["603589", "万润股份", "6.08%", "1.01"], ["600519", "五粮液", "5.45%", "0.55"], ["002415", "上海钢联", "5.28%", "-0.25"],
      ["600066", "航天发展", "5.21%", "1.89"], ["002328", "安车检测", "4.94%", "-3.00"], ["000651", "药明康德", "4.84%", "-1.30"], ["601166", "福斯特", "4.10%", "-0.86"]
    ];
    const holdingRows = holdings.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="is-num">${r[2]}</td><td class="is-num">${pct(r[3])}</td></tr>`).join("");
    const holdingsTable = `<div class="fund-table-wrap"><table class="fund-table fund-table--compact"><thead><tr><th>股票代码/名称</th><th></th><th class="is-num">持仓占比</th><th class="is-num">涨跌幅</th></tr></thead><tbody>${holdingRows}</tbody></table><div class="fund-table-total"><span>前十大持仓占比合计</span><strong>56.89%</strong></div></div>`;

    const periods = ["近1周", "近1月", "近3月", "近6月", "今年以来", "近1年", "近3年"];
    const stageRows = [
      ["阶段涨幅", ["2.34", "5.47", "28.00", "29.29", "- -", "- -", "- -"]],
      ["同类平均", ["1.68", "5.51", "21.31", "21.80", "35.53", "44.70", "57.13"]],
      ["沪深300", ["2.80", "5.90", "22.68", "18.62", "17.48", "29.71", "29.21"]]
    ];
    const ranks = ["1095|3579", "1598|3588", "1246|3476", "1042|3264", "--|3192", "--|3027", "--|2174"];
    const ratings = ["优秀", "一般", "不佳", "一般", "- -", "- -", "- -"];
    const stageCell = v => {
      if (v === "- -") return `<td>${v}</td>`;
      const cls = v.startsWith("-") ? "is-fall" : "is-rise";
      return `<td class="${cls}">${v}%</td>`;
    };
    const stageTable = `<table class="fund-stage-table"><thead><tr><th></th>${periods.map(v => `<th>${v}</th>`).join("")}</tr></thead><tbody>
      ${stageRows.map(([label, vals]) => `<tr><th>${label}</th>${vals.map(stageCell).join("")}</tr>`).join("")}
      <tr class="is-rank"><th>同类排名</th>${ranks.map(v => `<td>${v}</td>`).join("")}</tr>
      <tr class="is-quartile"><th>四分位排名</th>${ratings.map(v => `<td>${quartileCell(v)}</td>`).join("")}</tr>
      <tr class="is-rating"><th></th>${ratings.map(v => `<td>${v}</td>`).join("")}</tr>
    </tbody></table>`;

    const riskReturn = `<div class="fund-rating-block">
      <section class="fund-rating-group"><p class="fund-rating-title">与全市场比较</p><div class="fund-rating-pair">
        <div class="fund-rating-line"><span class="fund-rating-label">收益</span>${ratingSlider(0, "is-rise")}<small>低</small></div>
        <div class="fund-rating-line"><span class="fund-rating-label">风险</span>${ratingSlider(3, "is-fall")}<small>平均</small></div>
      </div></section>
      <section class="fund-rating-group"><p class="fund-rating-title">与混合型比较</p><div class="fund-rating-pair">
        <div class="fund-rating-line"><span class="fund-rating-label">收益</span>${ratingSlider(4, "is-rise", "高")}</div>
        <div class="fund-rating-line"><span class="fund-rating-label">风险</span>${ratingSlider(3, "is-fall")}<small>较高</small></div>
      </div></section>
    </div>`;

    const assetRows = [["股票", "79.98%", true], ["工业", "19.04%"], ["信息技术", "17.23%"], ["原材料", "14.85%"], ["金融地产", "9.90%"], ["医药卫生", "9.75%"], ["可选消费", "9.38%"], ["主要消费", "3.81%"], ["能源", "3.02%"], ["其他", "21.22%"]];
    const assetTable = `<table class="fund-table fund-table--compact"><thead><tr><th>资产</th><th class="is-num">占比</th></tr></thead><tbody>${assetRows.map(([n, v, bold]) => `<tr${bold ? ' class="is-total-row"' : ""}><td>${n}</td><td class="is-num">${v}</td></tr>`).join("")}</tbody></table>`;

    const matrix = [[2, 27, 59], [0, 2, 6], [0, 0, 15]];
    const rowNames = ["大盘", "中盘", "小盘"];
    const colNames = ["价值", "平衡", "成长"];
    const cellColor = v => v >= 50 ? ["#6865A7", true] : v >= 25 ? ["#7F7CB2", true] : v >= 10 ? ["#B9B8E6", false] : v >= 1 ? ["#E6E5FF", false] : ["#F5F5F5", false];
    const styleBox = `<div class="fund-style-box">
      <div class="fund-style-matrix"><span class="fund-style-corner"></span>${colNames.map(n => `<span class="fund-style-colname">${n}</span>`).join("")}${matrix.map((row, ri) => `<span class="fund-style-rowname">${rowNames[ri]}</span>${row.map(v => { const [bg, white] = cellColor(v); return `<i style="background:${bg};color:${white ? "#fff" : "#333"}">${v}</i>`; }).join("")}`).join("")}</div>
      <div class="fund-style-legend">${[["50+", "#6865A7"], ["25-49", "#7F7CB2"], ["10-24", "#B9B8E6"], ["1-9", "#E6E5FF"], ["0", "#F5F5F5"]].map(([t, c]) => `<span><i style="background:${c}"></i>${t}</span>`).join("")}</div>
    </div>`;
    const styleHistory = `<table class="fund-table fund-table--compact fund-style-history"><thead><tr><th>报告时间</th><th>股票风格</th></tr></thead><tbody>${Array.from({ length: 8 }, () => `<tr><td>2020年第二季度</td><td>大盘成长</td></tr>`).join("")}</tbody></table>`;

    const managerMini = `<div class="fund-manager-mini">
      <div class="fund-manager-mini-head"><span class="fund-mini-avatar"></span><div><div class="fund-manager-name"><strong>杨浩</strong>${stars(5)}</div><p class="fund-manager-mini-meta"><span>任职开始时间：</span>2018-08-12<span>任职时长：</span>400天<span>任期回报：</span>200%</p></div></div>
      <div id="fund-overview-manager-index" class="fund-chart" role="img" aria-label="基金经理指数"></div>
    </div>`;

    const awards = ["金基奖", "金牛奖", "金麒麟奖", "明星基金奖", "英华奖"];
    const awardsList = `<ul class="fund-awards">${awards.map(name => `<li><span>${name}</span><span class="fund-award-years"><span><i data-lucide="award"></i>2022</span><span><i data-lucide="award"></i>2023</span></span></li>`).join("")}</ul>`;

    const fundRows = [
      ["嘉实农业产业股票", 5, "5.47", "28.00", "29.29", "可申购 | 可赎回"],
      ["创金合信医疗保健股票C", 4, "5.51", "21.31", "21.80", "限大额 | 可赎回"],
      ["前海开源中证大农业指数增强", 4, "5.90", "22.68", "18.62", "可申购 | 可赎回"],
      ["宝盈品牌消费股票A", 4, "5.51", "21.31", "21.80", "限大额 | 可赎回"],
      ["汇添富中证生物科技指数A", 4, "5.90", "22.68", "18.62", "可申购 | 可赎回"]
    ];
    const fundTable = `<table class="fund-table fund-table--compact"><thead><tr><th>基金名称</th><th>基金星级</th><th class="is-num">年化收益率</th><th class="is-num">年化波动率</th><th class="is-num">最大回撤</th><th>申赎状态</th></tr></thead><tbody>${fundRows.map(([n, s, r, v, d, st]) => `<tr><td><a class="fund-link" href="javascript:void(0)">${n}</a></td><td>${stars(s)}</td><td class="is-num"><span class="is-rise">${r}%</span></td><td class="is-num">${v}%</td><td class="is-num">${d}%</td><td>${st}</td></tr>`).join("")}</tbody></table>`;

    const dotPill = `<span class="fund-dot-pill"><i></i><i></i></span>`;
    return `${panel("SUMMARY", "核心总结", `${summary}${analysisCards()}`, "", "fund-overview-summary")}
      ${panel("", "", `<div class="fund-two-charts">${chartBox("fund-overview-return", "收益表现", "is-lg")}${chartBox("fund-overview-risk", "风险表现", "is-lg")}</div>`, `${select("同类:偏股混合型", true)}${select("近1年")}${select("沪深300")}${select("申万一级行业", true)}${dotPill}`, "fund-overview-performance")}
      ${panel("", "", `<div class="fund-split-content"><section><h3>前十大持仓股票</h3>${holdingsTable}</section><section><div class="fund-split-head"><h3>持仓盘中趋势</h3><span class="fund-trend-tag">趋势：向上</span></div><div id="fund-holding-trend" class="fund-chart" role="img" aria-label="持仓盘中趋势"></div></section></div>`, "", "fund-panel-plain fund-overview-holdings")}
      <div class="fund-two-panels">
        ${panel("SUMMARY", "阶段涨幅", stageTable, `<span class="fund-text-toggle"><button type="button" class="is-on">比较</button><button type="button">指标</button></span>`, "fund-overview-stage")}
        ${panel("SUMMARY", "风险收益", riskReturn, "", "fund-overview-rating")}
      </div>
      <div class="fund-two-panels">
        ${panel("SUMMARY", "资产分布", `<div class="fund-asset-layout"><div id="fund-asset-donut" class="fund-chart" role="img" aria-label="资产分布"></div>${assetTable}</div>`, dotPill, "fund-overview-assets")}
        ${panel("SUMMARY", "风格分布", `<div class="fund-style-layout">${styleBox}${styleHistory}</div>`, `<div class="fund-style-segments"><span class="is-on">股票风格箱</span><span>债券风格箱</span></div>${dotPill}`, "fund-overview-style")}
      </div>
      <div class="fund-two-panels">
        ${panel("SUMMARY", "基金经理", managerMini, `<div class="fund-style-segments fund-manager-switch"><span class="is-on">杨浩</span><span>杨金金</span></div>${dotPill}`, "fund-overview-manager")}
        ${panel("SUMMARY", "获奖情况", awardsList, dotPill, "fund-overview-awards")}
      </div>
      <div class="fund-two-panels">
        ${panel("SUMMARY", "相似基金", fundTable, "", "fund-overview-related")}
        ${panel("SUMMARY", "同公司基金", fundTable, "", "fund-overview-related")}
      </div>`;
  }

  function returnsView() {
    const periods = ["近1周", "近1月", "近3月", "近6月", "今年以来", "近1年", "近3年"];
    const rollingHead = `<tr><th>年份</th><th>时段</th>${periods.map(v => `<th>${v}</th>`).join("")}</tr>`;
    const rollingTable = `<table class="fund-rolling-table"><thead>${rollingHead}</thead><tbody>
      <tr><th>本基金</th><td></td>${periods.map(() => `<td><span class="is-rise">2.34%</span></td>`).join("")}</tr>
      <tr><th>基准</th><td></td>${periods.map(() => `<td><span class="is-rise">1.68%</span></td>`).join("")}</tr>
    </tbody></table>`;
    const rolling = `<div class="fund-rolling"><div class="fund-rolling-head"><h3>基金滚动回报</h3><span class="fund-text-toggle"><button type="button" class="is-on">年度回报</button><button type="button">季度回报</button></span></div>${rollingTable}</div>`;

    const quartLabels = ["高", "较低", "高", "较低", "较高", "较低", "较高"];
    const rangeHead = `<tr><th></th><th>时段</th>${periods.map(v => `<th>${v}</th>`).join("")}</tr>`;
    const redCell = `<span class="is-rise">2.34%</span>`;
    const rangeTable = `<table class="fund-rolling-table"><thead>${rangeHead}</thead><tbody>
      <tr><th class="is-stack-4">该基金<br>同类平均（债券型）<br>中证全债<br>同类排名</th><td></td>${periods.map(() => `<td class="is-stack-3">${redCell}<em class="is-rise">1.68%</em><em class="is-rise">2.80%</em></td>`).join("")}</tr>
      <tr class="is-rank-row"><th>同类排名</th><td></td>${periods.map(() => `<td>1095|3579</td>`).join("")}</tr>
      <tr class="is-quartile-row"><th>四分位排名</th><td></td>${quartLabels.map(v => `<td><span class="fund-quartile-cell">${quartileCell(v)}<small>${v}</small></span></td>`).join("")}</tr>
    </tbody></table>`;

    const probRows = [
      ["收益＞10%", "87.16%", "88%"], ["收益＞5%", "54.81%", "2%"], ["收益＞0", "53.56%", "2%"],
      ["收益＜-5%", "3.01%", "4%"], ["收益＜-10", "1.47%", "4%"]
    ];
    const probTable = `<table class="fund-table fund-prob-table"><thead><tr><th>收益区间</th><th>交银定期支付双息混合</th><th>沪深300</th></tr></thead><tbody>${probRows.map(r => `<tr>${r.map((v, i) => `<td${i ? " class=is-num" : ""}>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

    return `${panel("SUMMARY", "业绩与投资者回报", `<div class="fund-return-layout">${chartBox("fund-cumulative-return", "累计收益")}${chartBox("fund-investor-gap", "投资者回报差异")}</div>${rolling}`, `${select("同类:偏股混合型", true)}${toolButton("bar-chart-3", "柱状图", true)}${toolButton("maximize", "全屏")}`)}
      ${panel("SUMMARY", "业绩与投资者回报", `<div class="fund-two-charts">${chartBox("fund-monthly-return", "月度收益")}${chartBox("fund-return-distribution", "月度收益分布")}</div>`, `${select("月度")}${toolButton("bar-chart-3", "柱状图", true)}${toolButton("line-chart", "折线图")}${toolButton("maximize", "全屏")}${toolButton("git-compare", "对比")}`)}
      ${panel("SUMMARY", "区间收益", `<div class="fund-table-wrap">${rangeTable}</div>`, `${toolButton("maximize", "全屏")}${toolButton("git-compare", "对比")}`)}
      ${panel("SUMMARY", "收益预测", `<div class="fund-two-charts fund-forecast-layout"><div id="fund-return-forecast" class="fund-chart" role="img" aria-label="收益预测概率分布"></div><div class="fund-table-wrap">${probTable}</div></div>`, `${select("持有三个月")}${toolButton("maximize", "全屏")}${toolButton("git-compare", "对比")}`)}`;
  }

  function riskView() {
    const dateRange = `<span class="fund-date-range"><input type="text" value="2025-10-21" aria-label="开始日期"><em>至</em><input type="text" value="2025-10-21" aria-label="结束日期"></span>`;
    const items = [
      ["分类基准", "偏股混合型基金指数", false],
      ["自定义基准", "科技传媒通信150全收益×65% + 中证综合债×35%", true],
      ["法定基准", "中证800成长×70% + 中债综合全价×30%", false]
    ];
    const benchmarks = `<div class="fund-benchmark-grid">${items.map(([type, name, caret], i) => `<div${i === 0 ? ' class="is-selected"' : ""}><span>${type}</span><strong>${caret ? `<em class="fund-benchmark-name">${name}</em><label class="fund-benchmark-select"><select aria-label="选择基准"><option></option></select></label>` : name}</strong><dl><div><dt>R²</dt><dd>0.9</dd></div><div><dt>Beta</dt><dd>1.01</dd></div><div><dt>Alpha</dt><dd class="is-fall">-10.36%</dd></div><div><dt>年化超额</dt><dd class="is-fall">-12.56%</dd></div></dl></div>`).join("")}</div>`;
    const volMetrics = `<div class="fund-vol-metrics"><div><span>当前波动</span><strong>1.01</strong></div><div><span>同类分位</span><strong>1.01</strong></div><div><span>最大回撤</span><strong>1.01</strong></div><div><span>修复期</span><strong>1.01</strong></div></div>`;
    const volBox = `<section class="fund-chart-block fund-vol-block"><div class="fund-vol-head"><h3>波动与回撤</h3>${volMetrics}</div><div id="fund-vol-drawdown" class="fund-chart" role="img" aria-label="波动与回撤"></div></section>`;
    const riskPanelBody = `${benchmarks}<div class="fund-two-charts">${chartBox("fund-risk-return", "风险收益坐标")}${volBox}</div>`;

    const drawdown = chartBox("fund-drawdown-bars", "滚动最大回撤", "is-tall");

    const returnHeads = ["收益指标", "组合", "沪深300"];
    const returnRows = [
      ["区间收益(%)", "2026-09-14", "000015"], ["年化收益(%)", "2026-09-14", "519704"],
      ["阿尔法(%)", "2026-09-14", "519704"], ["夏普比率", "2026-09-14", ""],
      ["信息比率", "", ""], ["索提诺比率", "", ""], ["特雷诺比率", "", ""],
      ["詹森指数(%)", "", ""], ["M2(%)", "", ""], ["胜率(%)", "", ""],
      ["Stutzer指数", "", ""], ["超额收益能力稳定性（%）", "", ""]
    ];
    const riskHeads = ["风险指标", "组合", "沪深300"];
    const riskRows = [
      ["最大回撤(%)", "无", "5.919"], ["最大回撤区间月份数", "", "5.1353"],
      ["最大回撤修复日期", "", "5.919"], ["最大回撤修复月份数", "", ""],
      ["年化标准差(%)", "", ""], ["贝塔", "", ""], ["下行风险(%)", "", ""],
      ["跟踪误差(%)", "", ""], ["历史VaR(%)", "", ""], ["历史CVaR(%)", "", ""], ["风格稳定性", "", ""]
    ];
    const indicatorTable = (heads, rows) => `<table class="fund-risk-table"><thead><tr>${heads.map(v => `<th>${v}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    const indicators = `<div class="fund-risk-indicators">${indicatorTable(returnHeads, returnRows)}${indicatorTable(riskHeads, riskRows)}</div>`;

    const eventLegend = `<ul class="fund-event-legend"><li><i style="background:#5B8FF9"></i>交银定期支付双息混合</li><li><i style="background:#D98257"></i>沪深300</li><li><i style="background:#B5E8D5"></i>全球新冠疫情</li><li><i style="background:#C9E7B8"></i>佩洛西引发台海危机</li><li><i style="background:#F6D07A"></i>俄乌冲突爆发</li><li><i style="background:#F2A8A8"></i>美联储进入加息周期</li><li><i style="background:#D9C9F0"></i>中概股风波</li></ul>`;
    const scenarioBody = `<div id="fund-scenario" class="fund-chart fund-scenario-chart" role="img" aria-label="情景分析"></div>${eventLegend}<div class="fund-table-wrap"><table class="fund-table fund-event-table"><thead><tr><th>事件</th><th>起止日期</th><th class="is-num">易方达科汇灵活配置混合</th><th class="is-num">沪深300</th></tr></thead><tbody>
      <tr><td>成长行情</td><td>2016-10-01 - 2016-11-28</td><td class="is-num is-rise">0.10%</td><td class="is-num is-rise">25.10%</td></tr>
      <tr><td>价值行情</td><td>2016-12-03 - 2017-01-16</td><td class="is-num is-rise">1.07%</td><td class="is-num is-rise">3.28%</td></tr>
      <tr><td>成长行情</td><td>2017-04-05 - 2017-04-11</td><td class="is-num is-rise">0.09%</td><td class="is-num is-fall">-3.28%</td></tr>
      <tr><td>价值行情</td><td>2017-05-05 - 2017-06-12</td><td class="is-num is-rise">0.76%</td><td class="is-num is-fall">-0.05%</td></tr>
      <tr><td>成长行情</td><td>2017-07-10 - 2017-07-17</td><td class="is-num is-rise">0.37%</td><td class="is-num is-rise">3.04%</td></tr>
    </tbody></table></div>`;

    return `${panel("RISK & BENCHMARK", "风险、波动与有效基准", riskPanelBody, `${select("同类:偏股混合型", true)}${select("近1年")}${dateRange}${toolButton("maximize", "全屏")}${toolButton("git-compare", "对比")}`)}
      ${panel("RISK & BENCHMARK", "区间最大回撤", drawdown, "", "fund-drawdown-panel")}
      ${panel("RISK & BENCHMARK", "收益风险指标", indicators, `<label class="fund-select"><span class="sr-only">频率</span><select><option>频率:原始频率</option></select></label>${select("近1年")}${dateRange}`)}
      ${panel("Scenario Analysis", "情景分析", scenarioBody, `${select("选择基金", true)}${select("大小盘", true)}${select("近1年")}${dateRange}${toolButton("maximize", "全屏")}${toolButton("git-compare", "对比")}`)}`;
  }

  // ---- 持仓页组件 ----
  const scopePills = () => `<div class="fund-scope-pills" role="group" aria-label="持仓范围"><button type="button" class="is-on">前十大重仓</button><button type="button">全部持仓</button></div>`;
  const whiteSelect = (label) => `<label class="fund-white-select"><span class="sr-only">${label}</span><select><option>${label}</option></select></label>`;
  const floatDate = () => `<label class="fund-float-date"><span class="sr-only">报告期</span><select><option>2026-09-30</option></select></label>`;
  const panelTools = () => `${toolButton("sliders-horizontal", "设置")}${toolButton("refresh-cw", "刷新")}`;
  const hlegend = items => `<div class="fund-chart-legend">${items.map(it => `<span><i style="background:${it[1]}"></i>${it[0]}</span>`).join("")}</div>`;
  const assetLegend = hlegend([["股票", "#F26173"], ["债券", "#4A6FCF"], ["基金", "#38BDF8"], ["现金", "#F6A06F"], ["权证", "#C69A6E"], ["其他资产", "#9A94CB"]]);
  const boardLegend = hlegend([["主板", "#F26173"], ["创业板", "#4A6FCF"], ["科创板", "#38BDF8"], ["北交所", "#F6A06F"]]);

  const vbars = items => `<div class="fund-vbars">${items.map(it => `<div class="fund-vbar" style="flex-grow:${it.w};background:${it.c}"></div>`).join("")}</div><div class="fund-hlegend">${items.map((it, i) => `<span><i style="background:${it.lc || ["#F26173","#4A6FCF","#38BDF8","#F6A06F"][i]}"></i>${it.n}</span>`).join("")}</div>`;
  const boardBars = () => vbars([{ n: "主板", w: 58, c: "#9A96C8" }, { n: "创业板", w: 23, c: "#66C3AB" }, { n: "科创板", w: 12, c: "#F7B591" }, { n: "北交所", w: 7, c: "#CE6689" }]);

  function worldMap() {
    const land = "#B7BBCB";
    const shapes = [
      ["M60,92 L150,58 L258,72 L302,118 L282,176 L224,202 L182,238 L142,228 L122,182 L82,162 Z"],
      ["M302,40 L362,52 L352,108 L312,100 Z"],
      ["M198,258 L262,250 L292,302 L272,398 L232,432 L212,382 L192,312 Z"],
      ["M458,92 L522,80 L542,128 L502,162 L462,150 Z"],
      ["M468,178 L562,170 L602,232 L582,328 L532,380 L502,332 L472,252 Z"],
      ["M542,78 L702,58 L832,78 L872,138 L822,198 L762,178 L702,202 L642,182 L602,212 L562,178 L542,128 Z"],
      ["M562,182 L602,212 L622,278 L602,302 L582,252 Z"],
      ["M782,328 L862,318 L882,368 L822,392 L782,368 Z"]
    ];
    const tri = "#1F2E7A";
    const tris = [
      "M852,178 L880,168 L872,214 Z",
      "M802,214 L818,208 L812,238 Z",
      "M824,162 L838,156 L832,186 Z",
      "M788,240 L802,232 L798,260 Z",
      "M760,232 L772,226 L768,250 Z"
    ];
    return `<svg class="fund-world-map" viewBox="0 0 940 450" role="img" aria-label="世界地区分布地图">${shapes.map(d => `<path d="${d}" fill="${land}"/>`).join("")}<path d="M648,118 L742,104 L784,138 L762,202 L702,218 L662,192 L638,150 Z" fill="#6865A7"/>${tris.map(d => `<path d="${d}" fill="${tri}"/>`).join("")}</svg>`;
  }

  function industryList() {
    const group = (name, val, subs, color) => `<div class="fund-ind-group"><span class="fund-ind-name"><i style="background:${color}"></i>${name}<i data-lucide="chevron-down" class="fund-ind-caret"></i></span><span class="fund-ind-val">${val}%</span></div>
      <div class="fund-ind-subs">${subs.map(([n, v]) => `<div><span>${n}</span><span>${v}%</span></div>`).join("")}</div>`;
    return `<div class="fund-ind-list"><div class="fund-ind-head"><span>资产</span><span>占比</span></div>
      ${group("TMT", "79.98", [["电子", "19.04"], ["计算机", "17.23"], ["通信", "14.85"], ["传媒", "9.90"]], "#7C78BC")}
      ${group("周期", "21.22", [["石油石化", "9.75"], ["煤炭", "9.38"], ["基础化工", "3.81"], ["有色金属", "3.02"], ["钢铁", ""]], "#B4B1E0")}
    </div>`;
  }

  function styleBox() {
    const tone = ["is-ll", "is-md", "is-dark", "is-zero", "is-pale", "is-pale", "is-zero", "is-zero", "is-zero"];
    const vals = ["2", "27", "59", "0", "2", "6", "0", "0", "0"];
    return `<div class="fund-style-box"><div class="fund-style-cols"><span></span><span>价值</span><span>平衡</span><span>成长</span></div>
      ${["大盘", "中盘", "小盘"].map((row, r) => `<div class="fund-style-row"><span class="fund-style-rowname">${row}</span>${[0, 1, 2].map(c => { const i = r * 3 + c; return `<div class="fund-style-cell ${tone[i]}">${vals[i]}</div>`; }).join("")}</div>`).join("")}
    </div>
    <div class="fund-style-legend"><span><i style="background:#4F6BD5"></i>50+</span><span><i style="background:#6E86E0"></i>25-49</span><span><i style="background:#8AA6F2"></i>10-24</span><span><i style="background:#D5DFFB"></i>1-9</span><span><i style="background:#F2F2F2"></i>0</span></div>`;
  }

  function styleHistoryTable() {
    return `<table class="fund-table fund-style-history"><thead><tr><th>报告时间</th><th>股票风格</th></tr></thead><tbody>${Array.from({ length: 8 }, () => `<tr><td>2020年第二季度</td><td>大盘成长</td></tr>`).join("")}</tbody></table>`;
  }

  function factorExposure() {
    const pct = v => ((v + 1) / 2 * 100).toFixed(1);
    const rows = [
      ["贝塔", 0.64, 0.58, -0.54, 0.81],
      ["动量", 0.52, 0.35, -0.53, 0.65],
      ["规模", 0.25, 0.03, -0.22, 0.29],
      ["盈利", -0.15, -0.12, -0.48, 0.00],
      ["波动", 0.21, 0.15, -0.12, 0.46],
      ["价值", -0.38, -0.34, -0.71, 0.00]
    ];
    const f2 = v => (v.toFixed(2) === "-0.00" ? "0.00" : v.toFixed(2));
    return `<div class="fund-factor">
      <div class="fund-factor-head"><span></span><span class="fund-factor-low">-1 低暴露</span><span class="fund-factor-high">+1 高暴露</span><span>当前</span><span>同类</span><span>历史范围</span></div>
      ${rows.map(([name, cur, peer, lo, hi]) => `<div class="fund-factor-row">
        <span class="fund-factor-name">${name}</span>
        <span class="fund-factor-track"><i class="fund-factor-range" style="left:${pct(lo)}%;width:${pct(hi) - pct(lo)}%"></i><i class="fund-factor-zero"></i><i class="fund-factor-cur" style="left:${pct(cur)}%"></i><i class="fund-factor-peer" style="left:${pct(peer)}%"></i></span>
        <span class="fund-factor-v">${f2(cur)}</span><span class="fund-factor-v">${f2(peer)}</span><span class="fund-factor-v">${f2(lo)}～${f2(hi)}</span>
      </div>`).join("")}
    </div>
    <div class="fund-chart-legend"><span><i class="is-dot" style="background:#5B8FF9"></i>当前</span><span><i class="is-dot" style="background:#D5DFFB"></i>历史范围</span><span><i class="is-diamond"></i>同类平均</span></div>`;
  }

  const changeCell = v => v === "减持" ? `<span class="is-fall">${v} ↓</span>` : `<span class="is-rise">${v} ↑</span>`;

  function topTenTable() {
    const data = [
      ["600887", "南极电商", "12.00%", "增持", "12.00%", "- -"],
      ["000333", "保利地产", "11.95%", "新进", "11.95%", "11.95%"],
      ["300026", "东方雨虹", "10.40%", "增持", "10.40%", "10.40%"],
      ["603589", "万润股份", "10.36%", "增持", "10.36%", "10.36%"],
      ["600519", "五粮液", "9.09%", "增持", "- -", "9.09%"],
      ["002415", "上海钢联", "8.01%", "减持", "8.01%", "8.01%"],
      ["600066", "航天发展", "7.77%", "新进", "7.77%", "7.77%"],
      ["002328", "安车检测", "7.72%", "增持", "7.72%", "7.72%"],
      ["000651", "药明康德", "7.58%", "增持", "7.58%", "7.58%"],
      ["601166", "福斯特", "7.18%", "增持", "7.18%", "- -"]
    ];
    return `<table class="fund-table fund-hold-table"><thead><tr><th>序号</th><th>证券代码</th><th>证券名称</th><th>持仓占比</th><th>较上期变化</th><th>近一年涨跌幅</th><th>PE</th><th>行业</th></tr></thead><tbody>
      ${data.map((r, i) => `<tr><td>${i + 1}</td><td>${r[0]}</td><td class="is-name">${r[1]}</td><td>${r[2]}</td><td>${changeCell(r[3])}</td><td>${r[4]}</td><td>${r[5]}</td><td>行业名称</td></tr>`).join("")}
      <tr class="is-total-row"><td colspan="3">集中度</td><td>88.66%</td><td><span class="is-rise">上升 ↑</span></td><td colspan="3"></td></tr>
    </tbody></table>`;
  }

  function weightMatrix() {
    const cols = ["2020-06-30", "2020-03-31", "2019-12-31", "2019-09-30", "2019-06-30", "2019-03-31", "2018-12-31", "2018-09-30", "2018-06-30"];
    const rows = [
      ["600887", "南极电商", [5.81, 5.28, 7.16, 7.42, 8.49, 8.95, 8.06, 4.20, 5.37], 11],
      ["000333", "保利地产", [5.48, 4.40, null, null, null, null, null, null, null], 3],
      ["300026", "东方雨虹", [4.87, null, null, null, null, null, null, null, null], 4],
      ["603589", "万润股份", [4.34, 4.64, null, 5.55, null, null, null, null, null], 5],
      ["600519", "五粮液", [3.87, 3.68, null, 5.00, null, null, null, null, null], 2],
      ["002415", "上海钢联", [3.76, 2.80, 3.29, null, null, null, null, null, null], 7],
      ["600066", "航天发展", [3.68, null, 2.80, 6.03, 4.68, null, null, null, null], 6],
      ["02328", "安车检测", [3.37, 5.60, 5.60, 7.72, 8.73, 6.68, null, null, null], 4],
      ["000651", "药明康德", [3.30, 4.06, null, 2.68, 4.77, 4.32, null, null, null], 3],
      ["601166", "福斯特", [3.16, 2.94, null, 1.78, null, null, null, null, null], 2]
    ];
    const tone = v => v === null ? "" : (v >= 5 ? "w-deep" : v >= 2 ? "w-mid" : v === 1.78 ? "w-tiny" : "w-low");
    return `<div class="fund-matrix-wrap"><table class="fund-table fund-weight-matrix"><thead><tr><th>序号</th><th>证券代码</th><th>证券名称</th>${cols.map(c => `<th>${c}</th>`).join("")}<th>持有季度</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r[0]}</td><td class="is-name">${r[1]}</td>${r[2].map(v => `<td>${v === null ? "- -" : `<span class="fund-w-cell ${tone(v)}">${v.toFixed(2)}%</span>`}</td>`).join("")}<td>${r[3]}</td></tr>`).join("")}
    </tbody></table>
    <div class="fund-matrix-legend"><span><i style="background:#C9C6EC"></i>＜1%</span><span><i style="background:#F2CDD6"></i>1%–2%</span><span><i style="background:#E8A3B5"></i>2%-5%</span><span><i style="background:#D96188"></i>≥5%</span></div></div>`;
  }

  function sparkline(seed) {
    const p = [26 - seed, 22, 19 - (seed % 2), 13, 6 + (seed % 3)];
    const xs = [2, 31, 60, 89, 118];
    const line = xs.map((x, i) => `${x},${p[i]}`).join(" ");
    return `<svg class="fund-spark" viewBox="0 0 120 32" preserveAspectRatio="none"><polygon points="${line} 118,30 2,30" fill="#DDE6FA"/><polyline points="${line}" fill="none" stroke="#6E83D4" stroke-width="2" stroke-linejoin="round"/></svg>`;
  }

  function topBondTable() {
    const data = [
      ["600887", "南极电商", "12.00%", "减持"],
      ["000333", "保利地产", "11.95%", "新进"],
      ["300026", "东方雨虹", "10.40%", "增持"],
      ["603589", "万润股份", "10.36%", "增持"],
      ["600519", "五粮液", "9.09%", "增持"]
    ];
    return `<table class="fund-table fund-bond-table"><thead><tr><th>债券代码</th><th>债券名称</th><th>持仓占比</th><th>较上期变化</th><th>近4期变化</th></tr></thead><tbody>
      ${data.map((r, i) => `<tr><td>${r[0]}</td><td class="is-name">${r[1]}</td><td>${r[2]}</td><td>${changeCell(r[3])}</td><td class="is-spark">${sparkline(i)}</td></tr>`).join("")}
      <tr class="is-total-row"><td colspan="2">集中度</td><td>88.66%</td><td><span class="is-rise">上升 ↑</span></td><td></td></tr>
    </tbody></table>`;
  }

  function holdingsView() {
    const assetRows = [
      ["股票", "87.16%", "88%", "88%", "#6865A7", "#C9C6EC", 73, 70, true],
      ["固定收益", "54.81%", "2%", "2%", "#F6A06F", "#FAD3B8", 47, 28, true],
      ["银行存款", "53.56%", "2%", "2%", "#F26173", "#FABFC7", 45, 27, true],
      ["买入返售金融资产", "3.01%", "4%", "4%", "", "", 0, 0, false],
      ["其他资产", "1.47%", "4%", "4%", "", "", 0, 0, false]
    ];
    const assetTable = `<table class="fund-table fund-bar-table"><thead><tr><th>资产</th><th></th><th>本基金</th><th>同类</th><th>相差</th></tr></thead><tbody>
      ${assetRows.map(r => `<tr><td class="is-name">${r[0]}</td><td>${r[8] ? `<div class="fund-track"><i class="fund-bar-peer" style="width:${r[7]}%;background:${r[5]}"></i><i class="fund-bar-self" style="width:${r[6]}%;background:${r[4]}"></i></div>` : ""}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("")}
    </tbody></table>`;
    const regionTable = `<table class="fund-table fund-region-table"><thead><tr><th>资产</th><th>本基金</th></tr></thead><tbody>
      ${[["中国内地", "62.48%"], ["美国", "12.36%"], ["中国香港", "9.82%"], ["日本", "4.18%"], ["英国", "3.72%"], ["德国", "2.85%"], ["其他市场", ""]].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}
    </tbody></table>`;
    const pureBondTable = `<table class="fund-table fund-region-table"><thead><tr><th>资产</th><th>占纯债市值比</th></tr></thead><tbody>
      <tr><td><span class="fund-dot-pill"><i style="background:#F6A06F"></i>信用债</span></td><td>48.72%</td></tr>
      <tr><td><span class="fund-dot-pill"><i style="background:#6E83D4"></i>利率债</span></td><td>8.57%</td></tr>
    </tbody></table>`;
    const histCats = ["2018/05", "2018/09", "2018/11", "2019/01", "2019/03", "2019/05"];
    return `${panel("SUMMARY", "资产配置与变化", `<div class="fund-two-charts">
        <section class="fund-chart-block"><h3>大类资产比较</h3>${assetTable}</section>
        <section class="fund-chart-block"><h3>资配分布历史</h3><div id="fund-asset-history" class="fund-chart"></div>${assetLegend}</section>
      </div>`, panelTools())}
      ${panel("SUMMARY", "上市板块分布", `<div class="fund-two-charts fund-date-row">
        <section class="fund-chart-block"><h3>板块分布</h3>${boardBars()}</section>
        <section class="fund-chart-block"><h3>板块分布历史</h3><div id="fund-board-history" class="fund-chart"></div>${boardLegend}</section>
        ${floatDate()}
      </div>`, `${scopePills()}${panelTools()}`)}
      ${panel("SUMMARY", "上市地区分布", `<div class="fund-two-charts fund-date-row">
        <section class="fund-chart-block"><h3>地区分布</h3><div class="fund-region-layout">${worldMap()}${regionTable}</div></section>
        <section class="fund-chart-block"><h3>地区分布历史</h3><div id="fund-region-history" class="fund-chart"></div>${assetLegend}</section>
        ${floatDate()}
      </div>`, `${scopePills()}${panelTools()}`)}
      ${panel("SUMMARY", "股票行业分布", `<div class="fund-two-charts">
        <section class="fund-chart-block"><h3></h3><div class="fund-industry-layout"><div id="fund-industry-donut" class="fund-donut-chart"></div>${industryList()}</div></section>
        <section class="fund-chart-block"><h3>行业分布历史</h3><div id="fund-industry-history" class="fund-chart"></div>${assetLegend}</section>
      </div>`, `${scopePills()}${whiteSelect("申万一级行业")}${panelTools()}`)}
      ${panel("SUMMARY", `风格行业漂移分析 <span class="fund-panel-subtitle">｜过往披露持仓配置稳定，当期存在漂移</span>`, `<div class="fund-two-charts">
        <section class="fund-chart-block"><h3>配置漂移图</h3><div id="fund-drift-area" class="fund-chart is-tall2"></div>
          <div class="fund-chart-legend"><span><i style="background:#DFF58E"></i>食品饮料</span><span><i style="background:#5BAEF5"></i>电子</span><span><i style="background:#6FD7D2"></i>医药卫生</span><span><i style="background:#F284D8"></i>美容护肤</span><span><i style="background:#EAFB7C"></i>纺织服饰</span><span><i style="background:#FDB58C"></i>社会服务</span><span><i style="background:#FFE27A"></i>汽车</span></div>
          <div class="fund-chart-legend"><span><i style="background:#FFD966"></i>家用电器</span><span><i style="background:#9CCBF4"></i>计算机*</span><span><i style="background:#FDA877"></i>传媒*</span><span class="fund-drift-pin"><i></i>漂移预警开始</span></div>
          <p class="fund-chart-note">注：行业依据报告日期持仓由大到小自下而上排序，*表示报告日期无持仓行业。</p>
        </section>
        <section class="fund-chart-block"><h3>漂移对比图 <i data-lucide="info" class="fund-info-icon" aria-label="说明"></i></h3><div id="fund-drift-bars" class="fund-chart is-tall2"></div>
          <div class="fund-chart-legend"><span><i style="background:#B39DDB"></i>公布持仓</span><span><i style="background:#5C6BC0"></i>回归分析</span></div>
          <p class="fund-chart-note">注：()内为p值。数值大于0.1时为红色，统计上不显著，表示该行业回归系数误差可能较大，或系数可能过小。</p>
        </section>
      </div>`, `${scopePills()}${whiteSelect("申万一级行业")}${panelTools()}`)}
      ${panel("SUMMARY", "股票风格", `<div class="fund-two-charts">
        <section class="fund-chart-block"><h3>股票风格箱</h3><div class="fund-style-layout"><div>${styleBox()}</div>${styleHistoryTable()}</div></section>
        <section class="fund-chart-block"><h3>因子暴露区间</h3>${factorExposure()}</section>
      </div>`, `${scopePills()}${panelTools()}`)}
      ${panel("SUMMARY", "股票持仓详情", `<h4 class="fund-section-title">前十大重仓股票</h4>${topTenTable()}
        <h4 class="fund-section-title">前十大重仓股票权重变化</h4>${weightMatrix()}`, `${scopePills()}${panelTools()}`)}
      ${panel("SUMMARY", "股票估值水平", `<section class="fund-chart-block is-lg"><div id="fund-valuation" class="fund-chart" role="img" aria-label="股票估值水平"></div><div class="fund-chart-legend fund-valuation-legend"><span><i class="is-dot" style="background:#5B63C8"></i>交银定期支付双息混合</span><span><i class="is-dot" style="background:#5B8FF9"></i>同类平均</span><span><i class="is-line is-orange"></i>沪深300</span><span><i class="is-line" style="color:#E58FB0"></i>重仓行业</span></div></section>`, `${scopePills()}${whiteSelect("PE")}${panelTools()}`)}
      ${panel("SUMMARY", "股票流动性", `<div class="fund-two-charts">
        <section class="fund-chart-block"><h3>股票换手率</h3><div id="fund-turnover" class="fund-chart"></div>
          <div class="fund-chart-legend"><span><i style="background:#6B68B3"></i>换手率</span><span><i class="is-line is-blue"></i>同类基金中位数</span><span><i class="is-line is-orange"></i>同类排名</span></div></section>
        <section class="fund-chart-block"><h3>留存度与拥挤度</h3><div id="fund-crowding" class="fund-chart"></div>
          <div class="fund-chart-legend"><span><i style="background:#6B68B3"></i>拥挤度</span><span><i class="is-line is-purple"></i>集中度(右坐标)</span><span><i class="is-line is-cyan"></i>留存度(右坐标)</span></div></section>
      </div>`, `<div class="fund-scope-pills" role="group" aria-label="换手率频率"><button type="button" class="is-on">年度换手率</button><button type="button">半年度换手率</button></div>${toolButton("bar-chart-3", "柱状图", true)}${toolButton("grid-2x2", "表格")}${panelTools()}`)}
      ${panel("SUMMARY", "债券资产分布", `<div class="fund-two-charts fund-date-row">
        <section class="fund-chart-block"><h3>债券资产分布</h3>${vbars([{ n: "国债", w: 58, c: "#9A96C8" }, { n: "金融债券", w: 23, c: "#66C3AB" }, { n: "可转换债券", w: 12, c: "#F7B591" }, { n: "中期票据", w: 7, c: "#CE6689" }])}</section>
        <section class="fund-chart-block"><h3>板块分布变化</h3><div id="fund-bond-change" class="fund-chart"></div>${hlegend([["TMT", "#A9CDF0"], ["中游制造", "#8DA9FF"], ["医药", "#7FD3D0"], ["周期", "#89E894"], ["消费", "#FFB27D"], ["金融地产", "#FFADB8"]])}</section>
        ${floatDate()}
      </div>`, `${scopePills()}${panelTools()}`)}
      ${panel("SUMMARY", "纯债资产", `<div class="fund-two-charts fund-date-row">
        <section class="fund-chart-block"><h3></h3><div class="fund-bond-layout"><div id="fund-bond-donut" class="fund-donut-chart"></div>${pureBondTable}</div>${floatDate()}</section>
        <section class="fund-chart-block"><h3>纯债资产历史分布</h3><div id="fund-bond-pure-history" class="fund-chart"></div>${assetLegend}</section>
      </div>`, `${scopePills()}${panelTools()}`)}
      <div class="fund-holdings-duo">
        ${panel("SUMMARY", "前五大重仓债券", topBondTable(), panelTools())}
        ${panel("SUMMARY", "债券风格箱", `<div class="fund-style-layout">${styleBox()}${styleHistoryTable()}</div>`, panelTools())}
      </div>`;
  }

  function attributionView() {
    return `${panel("RETURN ATTRIBUTION", "收益贡献", `<div class="fund-two-charts">${chartBox("fund-allocation-attribution", "资产配置贡献")}${chartBox("fund-industry-attribution", "行业配置贡献")}</div>`, `${select("申购情况", true)}${select("规模变化", true)}`)}
      ${panel("RETURN ATTRIBUTION", "股票选择与交易贡献", `<div class="fund-two-charts">${chartBox("fund-stock-selection", "个股选择效应")}${chartBox("fund-trading-attribution", "交易贡献")}</div>`)}
      ${panel("RETURN ATTRIBUTION", "风格因子归因", `<div class="fund-two-charts">${chartBox("fund-factor-attribution", "因子收益贡献")}${dataTable(["因子","暴露","因子收益","贡献"], [["规模","0.25","3.41%","0.85%"],["成长","0.42","4.16%","1.75%"],["价值","-0.38","-1.22%","0.46%"],["动量","0.52","2.75%","1.43%"]], [1,2,3])}</div>`)}`;
  }

  function managerView() {
    const profile = `<div class="fund-manager-profile"><img src="./assets/fund-manager-avatar.png" alt="基金经理郑晓辉"><div><span>基金经理</span><h2>郑晓辉</h2><p>从业 12.4 年 · 管理规模 186.32 亿 · 在管基金 6 只</p><div class="fund-tags"><span>大盘成长</span><span>科技制造</span><span>中低换手</span></div></div></div>`;
    return `${panel("FUND MANAGER", "基金经理画像", profile)}
      ${panel("PERFORMANCE", "任职业绩", `<div class="fund-two-charts">${chartBox("fund-manager-performance", "任职累计收益")}${chartBox("fund-manager-ranking", "同类排名变化")}</div>`)}
      ${panel("CAREER", "管理产品", dataTable(["基金名称","任职日期","任职回报","同类排名","管理规模"], [["交银定期支付双息平衡混合","2018-06-15","78.62%","128 / 860","39.38亿"],["交银成长动力混合","2020-02-21","46.31%","216 / 1042","28.16亿"],["交银优势行业混合","2021-09-03","21.08%","342 / 1180","17.44亿"]], [2,3,4]))}`;
  }

  function companyView() {
    const stats = `<div class="fund-company-stats"><div><span>公募管理规模</span><strong>6,842.31亿</strong></div><div><span>行业排名</span><strong>12 / 156</strong></div><div><span>旗下基金</span><strong>286只</strong></div><div><span>基金经理</span><strong>72人</strong></div></div>`;
    return `${panel("FUND COMPANY", "华夏基金管理有限公司", stats)}
      ${panel("SUMMARY", "产品结构", `<div class="fund-two-charts">${chartBox("fund-company-products", "产品类型分布")}${chartBox("fund-company-scale", "管理规模变化")}</div>`)}
      ${panel("PRODUCTS", "代表产品", dataTable(["基金名称","类型","基金经理","规模","近1年收益"], [["华夏成长混合","偏股混合型","郑晓辉","39.38亿","22.64%"],["华夏上证50ETF","被动指数型","张弘弢","618.72亿","18.42%"],["华夏中证500ETF","被动指数型","荣膺","482.16亿","16.73%"]], [3,4]))}`;
  }

  function basicsView() {
    return `${panel("BASIC INFORMATION", "基金基本信息", dataTable(["字段","内容","字段","内容"], [["基金全称","交银定期支付双息平衡混合","基金代码","516732"],["基金类型","偏股混合型","成立日期","2001-12-18"],["基金公司","华夏基金管理有限公司","基金经理","郑晓辉 / 刘睿聪"],["托管银行","中国建设银行","最新规模","39.38亿"]]))}
      ${panel("TRANSACTION", "申购与赎回", `<div class="fund-two-tables">${dataTable(["申购金额","费率"], [["50万元以下","1.50%"],["50万元至100万元","1.20%"],["100万元至500万元","0.80%"],["500万元以上","每笔1000元"]], [1])}${dataTable(["持有期限","赎回费率"], [["7日以内","1.50%"],["7日至365日","0.50%"],["365日至730日","0.20%"],["730日以上","0"]], [1])}</div>`)}
      ${panel("FEES", "运作费用", dataTable(["费率种类","本基金费率","同类平均","变更时间"], [["管理费率","1.50%","1.50%","2024-10-10"],["托管费率","0.50%","0.50%","2024-10-10"],["销售服务费","--","--","2024-10-10"]], [1,2]))}`;
  }

  const renderers = { overview, returns: returnsView, risk: riskView, holdings: holdingsView, attribution: attributionView, manager: managerView, company: companyView, basics: basicsView };

  function template(view) {
    const active = viewMap[view] ? view : "overview";
    document.body.classList.add("fund-sketch-mode");
    return `<div class="fund-page" data-fund-view="${active}">${header(active)}<main class="fund-content">${renderers[active]()}</main></div>`;
  }

  function axisOption() {
    const option = baseOption();
    return { ...option, animation: false, grid: { left: 42, right: 14, top: 20, bottom: 34 }, legend: { bottom: 0, itemWidth: 16, itemHeight: 3, textStyle: { color: "#666", fontSize: 10 } }, xAxis: { type: "category", boundaryGap: false, data: labels, axisTick: { show: false }, axisLabel: { color: "#999", fontSize: 9, interval: 3 }, axisLine: { lineStyle: { color: "#ccc" } } }, yAxis: { type: "value", axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#999", fontSize: 9 }, splitLine: { lineStyle: { color: "#eaeaea" } } } };
  }
  function lineChart(id, series, extra = {}) { if (document.getElementById(id)) chart(id, { ...axisOption(), ...extra, series: series.map(v => ({ type: "line", showSymbol: false, symbol: "none", ...v })) }); }
  function barChart(id, categories, series, extra = {}) { if (!document.getElementById(id)) return; const o = axisOption(); chart(id, { ...o, ...extra, xAxis: { ...o.xAxis, boundaryGap: true, data: categories, axisLabel: { color: "#999", fontSize: 9 } }, series: series.map(v => ({ type: "bar", barMaxWidth: 20, ...v })) }); }
  function pieChart(id, data) { if (document.getElementById(id)) chart(id, { animation: false, color: ["#7774b3","#f3a179","#67c5ba","#d96e8d","#b9b8d8"], tooltip: { trigger: "item" }, legend: { orient: "vertical", right: 12, top: "middle", textStyle: { color: "#666", fontSize: 10 } }, series: [{ type: "pie", radius: ["46%","70%"], center: ["38%","50%"], label: { show: false }, data }] }); }

  // 收益页：百分比分组柱图
  function barPercent(id, cats, series, min, max, interval, xName, yName = "", xFont = 12) {
    const el = document.getElementById(id);
    if (!el) return;
    const yAxis = { type: "value", min, max, interval, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#666", fontSize: 12, formatter: "{value}%" }, splitLine: { lineStyle: { color: "#eaeaea" } } };
    if (yName) yAxis.name = yName;
    const hasLegend = series.some(v => v.name);
    const xAxis = { type: "category", data: cats, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#666", fontSize: xFont, interval: 0 } };
    if (xName) { xAxis.name = xName; xAxis.nameLocation = "middle"; xAxis.nameGap = 30; xAxis.nameTextStyle = { color: "#666", fontSize: 12 }; }
    chart(id, {
      animation: false,
      color: ["#6865A7", "#D98257"],
      grid: { left: 52, right: 16, top: 24, bottom: hasLegend ? (xName ? 74 : 56) : 32 },
      legend: hasLegend ? { bottom: 0, itemWidth: 12, itemHeight: 8, itemGap: 16, textStyle: { color: "#555", fontSize: 12 } } : { show: false },
      tooltip: { trigger: "axis", valueFormatter: v => v + "%" },
      xAxis,
      yAxis,
      series: series.map(v => ({ type: "bar", ...v }))
    });
  }

  // 产品概览：收益/风险走势（5 项图例，含更换基金经理、分红事件点）
  function overviewTrend(id, min, max, seriesData) {
    const el = document.getElementById(id);
    if (!el) return;
    const base = baseOption();
    chart(id, {
      animation: false,
      color: ["#6865A7", "#E88AB3", "#D98257", "#F26173", "#39C6C9"],
      grid: { left: 48, right: 20, top: 24, bottom: 56 },
      legend: { bottom: 0, itemWidth: 16, itemHeight: 3, itemGap: 14, textStyle: { color: "#555", fontSize: 12 } },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", boundaryGap: false, data: labels, axisTick: { show: false }, axisLine: { lineStyle: { color: "#ccc" } }, axisLabel: { color: "#999", fontSize: 10, interval: 2 } },
      yAxis: { type: "value", min, max, interval: (max - min) / 4, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#666", fontSize: 12 }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      series: seriesData
    });
  }

  // 产品概览：持仓盘中趋势（9 点，正红负绿，右侧涨跌幅轴）
  function holdingTrend() {
    const el = document.getElementById("fund-holding-trend");
    if (!el) return;
    const nav = [1.7688, 1.7621, 1.7554, 1.7486, 1.7419, 1.7352, 1.7284, 1.7217, 1.7150];
    const pivot = 1.7419;
    const time = ["9：30", "10：30", "11：30/13：00", "", "14：00", "15：00"];
    const cats = ["9：30", "10：30", "11：30", "13：00", "14：00", "14：30", "15：00", "", ""];
    // 按相对中轴正负把折线切成红/绿分段（相邻段共享端点）
    const segs = [];
    let cur = [{ value: [0, nav[0]] }];
    let sign = nav[0] >= pivot ? 1 : -1;
    for (let i = 1; i < nav.length; i++) {
      const s = nav[i] > pivot ? 1 : nav[i] < pivot ? -1 : sign;
      if (s !== sign) {
        cur.push({ value: [i, nav[i]] });
        segs.push({ sign, pts: cur });
        cur = [{ value: [i - 1, nav[i - 1]] }];
        sign = s;
      }
      cur.push({ value: [i, nav[i]] });
    }
    segs.push({ sign, pts: cur });
    chart("fund-holding-trend", {
      animation: false,
      grid: { left: 56, right: 56, top: 30, bottom: 30 },
      tooltip: { show: false },
      xAxis: { type: "category", boundaryGap: false, data: cats, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#666", fontSize: 12, interval: 0, formatter: (v, i) => time[i] || "" } },
      yAxis: [
        { type: "value", min: 1.71, max: 1.78, interval: 0.0175, position: "left", axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: v => (v - pivot > 0.0005 ? "#BF3A61" : v - pivot < -0.0005 ? "#36B397" : "#666"), fontSize: 12, formatter: v => v.toFixed(4) }, splitLine: { lineStyle: { color: "#eaeaea" } } },
        { type: "value", min: -1.55, max: 1.55, interval: 0.775, position: "right", axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: v => (v > 0 ? "#BF3A61" : v < 0 ? "#36B397" : "#666"), fontSize: 12, formatter: v => (v > 0 ? "+" : "") + v.toFixed(2).replace(".00", "") + "%" }, splitLine: { show: false } }
      ],
      series: segs.map((g, gi) => ({
        type: "line", showSymbol: false, data: g.pts,
        lineStyle: { color: g.sign > 0 ? "#BF3A61" : "#36B397", width: 2 },
        markLine: gi === 0 ? { symbol: "none", silent: true, label: { show: false }, lineStyle: { color: "#666", type: "dashed" }, data: [{ yAxis: pivot }] } : undefined
      }))
    });
  }

  // 产品概览：资产分布环形（中心“其他”）
  function assetDonut() {
    const el = document.getElementById("fund-asset-donut");
    if (!el) return;
    const data = [
      { name: "工业", value: 19.04 }, { name: "信息技术", value: 17.23 }, { name: "原材料", value: 14.85 },
      { name: "金融地产", value: 9.90 }, { name: "医药卫生", value: 9.75 }, { name: "可选消费", value: 9.38 },
      { name: "主要消费", value: 3.81 }, { name: "能源", value: 3.02 }, { name: "其他", value: 21.22 }
    ];
    chart("fund-asset-donut", {
      animation: false,
      color: ["#8FAEFE", "#54D8C1", "#F9AECD", "#87E491", "#FCDDAE", "#E2F7A2", "#FFB4B4", "#7FD8DC", "#D7B3F4", "#B8D8E9"],
      tooltip: { trigger: "item" },
      title: { text: "其他", left: "center", top: "44%", textStyle: { color: "#333", fontSize: 14, fontWeight: 400 } },
      series: [{ type: "pie", radius: ["52%", "72%"], center: ["50%", "50%"], avoidLabelOverlap: false, label: { show: false }, labelLine: { show: false }, data }]
    });
  }

  // 产品概览：基金经理指数
  function managerIndex() {
    if (!document.getElementById("fund-overview-manager-index")) return;
    chart("fund-overview-manager-index", {
      animation: false,
      color: ["#6865A7", "#D98257"],
      grid: { left: 44, right: 16, top: 24, bottom: 40 },
      legend: { bottom: 0, itemWidth: 16, itemHeight: 3, textStyle: { color: "#555", fontSize: 12 } },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", boundaryGap: false, data: labels, axisTick: { show: false }, axisLine: { lineStyle: { color: "#ccc" } }, axisLabel: { color: "#666", fontSize: 10, interval: 2 } },
      yAxis: { type: "value", min: -20, max: 60, interval: 20, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#666", fontSize: 12 }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      series: [
        { name: "杨浩", type: "line", showSymbol: false, data: labels.map((_, i) => +(-8 + i * 2.2 + Math.sin(i * .7) * 9).toFixed(2)), lineStyle: { color: "#6865A7", width: 2 } },
        { name: "沪深300", type: "line", showSymbol: false, data: labels.map((_, i) => +(-6 + i * 1.1 + Math.sin(i * .6) * 6).toFixed(2)), lineStyle: { color: "#D98257", width: 1.5 } }
      ]
    });
  }

  function renderCharts() {
    document.querySelectorAll("[data-fund-tab]").forEach(button => { button.onclick = () => { if (button.dataset.fundTab !== document.querySelector(".fund-page")?.dataset.fundView) location.hash = `#/fund/000001?view=${button.dataset.fundTab}`; }; });
    const primary = { name: "本基金", data: fundLine, lineStyle: { color: "#6865a7", width: 2 } };
    const peer = { name: "同类平均", data: peerLine, lineStyle: { color: "#bf3a61", width: 1.5, type: "dashed" } };
    const benchmark = { name: "沪深300", data: benchmarkLine, lineStyle: { color: "#d98257", width: 1.5 } };

    // 产品概览：收益与风险走势（5 项图例）
    const trendSeries = (scale, offset, risk) => [
      { name: "交银定期支付双息混合", type: "line", showSymbol: false, data: labels.map((_, i) => +(offset + i * scale + Math.sin(i * .72) * 7 * scale).toFixed(2)), lineStyle: { width: 2 } },
      { name: "同类平均", type: "line", showSymbol: false, data: labels.map((_, i) => +(offset + i * scale * .32 + Math.sin(i * .58 + 1) * 2.2 * scale).toFixed(2)), lineStyle: { width: 1.5, type: "dashed" } },
      { name: "沪深300", type: "line", showSymbol: false, data: labels.map((_, i) => +(offset - i * scale * .72 + Math.sin(i * .8) * 6 * scale).toFixed(2)), lineStyle: { width: 1.5 } },
      { name: "更换基金经理", type: "scatter", symbolSize: 6, data: [[risk ? 9 : 7, risk ? -8 : 42]] },
      { name: "分红", type: "scatter", symbolSize: 6, data: [[risk ? 14 : 12, risk ? -11 : 28]] }
    ];
    overviewTrend("fund-overview-return", -20, 60, trendSeries(1.1, 30, false));
    overviewTrend("fund-overview-risk", -20, 0, trendSeries(.18, -5, true));
    overviewTrend("fund-cumulative-return", -20, 60, trendSeries(1.1, 30, false));
    holdingTrend();
    assetDonut();
    managerIndex();
    lineChart("fund-manager-performance", [primary, peer, benchmark]);
    scatter("fund-risk-scatter");
    // 收益页：投资者回报差异（橙/绿/紫单组柱）
    barPercent("fund-investor-gap", ["投资者回报", "相差", "基金回报"], [{ data: [29, -11, 47], barMaxWidth: 26, itemStyle: { color: p => ["#D98257", "#36b397", "#6865A7"][p.dataIndex] } }], -20, 60, 20, "", "", 11);
    // 收益页：月度收益（交银紫 / 沪深300橙）
    const monthCats = ["2018/01", "2018/03", "2018/05", "2018/09", "2018/07", "2018/11", "2019/01", "2019/03", "2019/05"];
    barPercent("fund-monthly-return", monthCats, [
      { name: "交银定期支付双息混合", data: [24, 6, -8, 24, -12, 9, 7, 5, -9], barMaxWidth: 10 },
      { name: "沪深300", data: [30, 10, -5, 14, -6, 6, 4, 13, -7], barMaxWidth: 10 }
    ], -20, 60, 20);
    // 收益页：月度收益分布
    barPercent("fund-return-distribution", ["-15", "-10", "-5", "0", "5", "10", "15", "20"], [
      { name: "交银定期支付双息混合", data: [3, 4, 12, 21, 10, 15, 5, 3], barMaxWidth: 10 },
      { name: "沪深300", data: [4, 6, 17, 18, 9, 7, 2, 2], barMaxWidth: 10 }
    ], 0, 25, 5);
    // 收益页：收益预测概率分布
    barPercent("fund-return-forecast", ["＜-10%", "-10%~-5%", "-5%~-2%", "-2%~0%", "0%~2%", "2%~5%", "5%~10%", "＞10%"], [
      { name: "交银定期支付双息混合", data: [12, 5, 18, 18, 72, 60, 32, 10], barMaxWidth: 12 },
      { name: "沪深300", data: [28, 10, 20, 17, 58, 46, 8, 8], barMaxWidth: 12 }
    ], 0, 100, 20, "收益率", "概率", 10);
    riskReturnScatter();
    volDrawdown();
    drawdownBars();
    scenarioChart();
    holdingsStacks();
    industryDonut();
    driftArea();
    driftBars();
    valuationChart();
    turnoverChart();
    crowdingChart();
    bondChangeArea();
    bondDonut();
    barChart("fund-allocation-attribution", ["股票","债券","现金","其他"], [{data:[4.2,.8,.3,-.2],itemStyle:{color:"#7774b3"}}], {legend:{show:false}});
    barChart("fund-industry-attribution", ["通信","电子","消费","医药","非银"], [{name:"配置",data:[2.4,1.8,-.6,.9,-.4],itemStyle:{color:"#f3a179"}},{name:"选股",data:[1.2,.8,.3,-.2,.4],itemStyle:{color:"#7774b3"}}]);
    barChart("fund-stock-selection", ["前十大","其他重仓","新增持仓","减持股票"], [{data:[3.2,1.8,2.4,-.9],itemStyle:{color:p=>p.value>=0?"#f26173":"#36b397"}}], {legend:{show:false}});
    lineChart("fund-trading-attribution", [primary, peer]);
    barChart("fund-factor-attribution", ["规模","成长","价值","动量","波动","盈利"], [{data:[.85,1.75,.46,1.43,-.22,.64],itemStyle:{color:"#7774b3"}}], {legend:{show:false}});
    lineChart("fund-manager-ranking", [{name:"同类百分位",data:fundLine.map((v,i)=>60-i*1.3+Math.sin(i*.8)*8),lineStyle:{color:"#7774b3"}}]);
    pieChart("fund-company-products", [{name:"股票型",value:31},{name:"混合型",value:28},{name:"债券型",value:24},{name:"指数型",value:17}]);
    lineChart("fund-company-scale", [{name:"管理规模",data:fundLine.map((v,i)=>4200+i*145+Math.sin(i*.5)*220),lineStyle:{color:"#7774b3",width:2},areaStyle:{color:"#7774b322"}}]);
  }

  function scatter(id) {
    if (!document.getElementById(id)) return;
    chart(id, { animation:false, grid:{left:46,right:16,top:20,bottom:34}, xAxis:{type:"value",name:"年化波动率",splitLine:{lineStyle:{color:"#eaeaea"}}}, yAxis:{type:"value",name:"收益率",splitLine:{lineStyle:{color:"#eaeaea"}}}, series:[{type:"scatter",data:[[11,31],[14,36],[16,24],[18,27],[13,22],[15,25]],symbolSize:(v,p)=>p.dataIndex<2?18:7,itemStyle:{color:p=>p.dataIndex===0?"#f3a179":"#7774b3"}}] });
  }

  // 风险页：风险收益坐标（双大圆点 + 同类平均/同类样本灰点）
  function riskReturnScatter() {
    if (!document.getElementById("fund-risk-return")) return;
    const majorY = new Set([8, 24, 30, 36]);
    const splitColors = Array.from({ length: 15 }, (_, i) => majorY.has(8 + i * 2) ? "#eaeaea" : "transparent");
    const samples = [[13.4,24.6],[13.9,25.8],[14.3,24.1],[14.8,25.2],[15.2,24.8],[15.6,26.1],[15.9,24.3],[16.2,25.6],[16.5,23.9],[16.9,25.1],[17.2,24.5],[17.5,26.4],[17.9,24.9],[18.2,25.7],[18.6,24.2],[19.1,25.3],[14.6,26.4],[15.4,23.6],[16.8,26.8],[17.7,23.7],[18.9,26.2],[19.6,24.7],[13.6,25.3],[19.9,25.9]];
    chart("fund-risk-return", {
      animation: false,
      grid: { left: 48, right: 16, top: 24, bottom: 58 },
      legend: { bottom: 0, itemWidth: 10, itemHeight: 10, itemGap: 14, textStyle: { color: "#555", fontSize: 12 } },
      tooltip: { trigger: "item" },
      xAxis: { type: "value", name: "收益率", nameLocation: "middle", nameGap: 32, min: 11, max: 23, interval: 2, nameTextStyle: { color: "#666", fontSize: 12 }, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#666", fontSize: 12 }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      yAxis: { type: "value", name: "年化波动率", nameLocation: "start", nameGap: 10, min: 8, max: 36, interval: 2, nameTextStyle: { color: "#666", fontSize: 12, align: "left" }, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#666", fontSize: 12, formatter: v => majorY.has(v) ? v : "" }, splitLine: { lineStyle: { color: splitColors } } },
      series: [
        { name: "交银定期支付双息混合", type: "scatter", symbolSize: 16, data: [[14.2, 34]], itemStyle: { color: "#6865A7" }, z: 5 },
        { name: "沪深300", type: "scatter", symbolSize: 14, data: [[12.3, 32]], itemStyle: { color: "#D98257" }, z: 5,
          markLine: { symbol: "none", silent: true, label: { show: false }, lineStyle: { color: "#bbb" }, data: [{ xAxis: 17 }, { yAxis: 24 }] } },
        { name: "同类平均", type: "scatter", symbolSize: 7, data: [[15.8, 26.6]], itemStyle: { color: "#c9c9c9" } },
        { name: "同类样本", type: "scatter", symbolSize: 6, data: samples, itemStyle: { color: "#dddddd" } }
      ]
    });
  }

  // 风险页：波动与回撤（上下双区折线）
  function volDrawdown() {
    if (!document.getElementById("fund-vol-drawdown")) return;
    const n = 40;
    const wave = (base, amp, drift, phase, k) => Array.from({ length: n }, (_, i) => +(base + i * drift + Math.sin(i * k + phase) * amp + Math.sin(i * .31 + phase) * amp * .4).toFixed(2));
    const top = [
      { name: "交银定期支付双息混合", type: "line", showSymbol: false, symbol: "none", xAxisIndex: 0, yAxisIndex: 0, data: wave(9, 2.2, .12, .5, .5), lineStyle: { color: "#6865A7", width: 2 } },
      { name: "同类平均", type: "line", showSymbol: false, symbol: "none", xAxisIndex: 0, yAxisIndex: 0, data: wave(7, 1.2, .06, 1.2, .44), lineStyle: { color: "#BF3A61", width: 1.4, type: "dashed" } },
      { name: "沪深300", type: "line", showSymbol: false, symbol: "none", xAxisIndex: 0, yAxisIndex: 0, data: wave(8, 2.6, .05, 2, .6), lineStyle: { color: "#D98257", width: 1.5 } }
    ];
    const bottom = [
      { name: "交银定期支付双息混合", type: "line", showSymbol: false, symbol: "none", xAxisIndex: 1, yAxisIndex: 1, data: wave(-10, 5, -.12, 2.4, .5).map(v => Math.min(0, v)), lineStyle: { color: "#6865A7", width: 2 } },
      { name: "同类平均", type: "line", showSymbol: false, symbol: "none", xAxisIndex: 1, yAxisIndex: 1, data: wave(-8, 3, -.05, 0.6, .44).map(v => Math.min(0, v)), lineStyle: { color: "#BF3A61", width: 1.4, type: "dashed" } },
      { name: "沪深300", type: "line", showSymbol: false, symbol: "none", xAxisIndex: 1, yAxisIndex: 1, data: wave(-12, 4.5, -.08, 1.1, .6).map(v => Math.min(0, v)), lineStyle: { color: "#D98257", width: 1.5 } }
    ];
    const cats = Array.from({ length: n }, (_, i) => i);
    const axisTick = { show: false };
    chart("fund-vol-drawdown", {
      animation: false,
      legend: { bottom: 0, itemWidth: 16, itemHeight: 3, itemGap: 18, textStyle: { color: "#555", fontSize: 12 } },
      tooltip: { trigger: "axis" },
      axisPointer: { link: [{ xAxisIndex: "all" }] },
      grid: [{ left: 48, right: 20, top: 30, height: 92 }, { left: 48, right: 20, top: 142, height: 92 }],
      xAxis: [
        { type: "category", gridIndex: 0, data: cats, axisTick, axisLabel: { show: false }, axisLine: { lineStyle: { color: "#666" } } },
        { type: "category", gridIndex: 1, data: cats, axisTick, axisLabel: { show: false }, axisLine: { lineStyle: { color: "#666" } } }
      ],
      yAxis: [
        { type: "value", gridIndex: 0, min: 0, max: 20, interval: 5, axisTick, axisLine: { show: false }, axisLabel: { color: "#666", fontSize: 12 }, splitLine: { lineStyle: { color: "#eaeaea" } } },
        { type: "value", gridIndex: 1, min: -20, max: 0, interval: 5, axisTick, axisLine: { show: false }, axisLabel: { color: "#666", fontSize: 12 }, splitLine: { lineStyle: { color: "#eaeaea" } } }
      ],
      graphic: [
        { type: "text", left: 54, top: 12, style: { text: "波动", fill: "#333", fontSize: 14 } },
        { type: "text", left: 54, top: 128, style: { text: "回撤", fill: "#333", fontSize: 14 } }
      ],
      series: top.concat(bottom)
    });
  }

  // 风险页：滚动最大回撤（三系列负柱，y 轴双 -20% 刻度）
  function drawdownBars() {
    if (!document.getElementById("fund-drawdown-bars")) return;
    const labels2 = { 0: "0%", "-10": "-20%", "-20": "-20%", "-30": "-30%", "-40": "-40%" };
    chart("fund-drawdown-bars", {
      animation: false,
      color: ["#6865A7", "#D98257", "#d96e8d"],
      grid: { left: 56, right: 24, top: 36, bottom: 30 },
      legend: { bottom: 0, itemWidth: 12, itemHeight: 8, itemGap: 18, textStyle: { color: "#555", fontSize: 12 } },
      tooltip: { trigger: "axis", valueFormatter: v => v + "%" },
      xAxis: { type: "category", position: "top", data: ["今年以来", "近1月", "近3月", "近6月", "近1年", "近3年", "近5年"], axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#777", fontSize: 14, interval: 0, margin: 6 } },
      yAxis: { type: "value", min: -40, max: 0, interval: 10, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#808080", fontSize: 12, formatter: v => labels2[v] ?? "" }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      series: [
        { name: "交银定期支付双息混合", type: "bar", barMaxWidth: 12, data: [-7, -5, -7, -20, -18, -12, -33] },
        { name: "沪深300", type: "bar", barMaxWidth: 12, data: [-6, -4, -8, -22, -14, -10, -37] },
        { name: "同类平均", type: "bar", barMaxWidth: 12, data: [-4, -3, -5, -18, -13, -9, -35] }
      ]
    });
  }

  // 风险页：情景分析（事件色带折线 + dataZoom）
  function scenarioChart() {
    if (!document.getElementById("fund-scenario")) return;
    const n = 44;
    const seg = (ranges) => {
      const out = [];
      ranges.forEach(([from, to, base, amp, drift, phase]) => {
        for (let i = from; i < to && i < n; i++) out[i] = +(base + (i - from) * drift + Math.sin(i * .9 + phase) * amp + Math.sin(i * .33) * amp * .5).toFixed(2);
      });
      return out;
    };
    const fundData = seg([[0, 7, 0, 4, 3, .5], [7, 15, -4, 4, -.2, 2], [15, 24, 2, 5, 2.4, 1], [24, 32, -8, 4, -.5, .8], [32, 37, -14, 2, 1.2, 2.4], [37, 44, -6, 4, 1.8, 1.3]]);
    const hsData = seg([[0, 7, 10, 2.5, 1.1, 2], [7, 15, 8, 3, -1.2, .6], [15, 24, 3, 4, 2, 1.6], [24, 32, 2, 3, 1, .3], [32, 37, 6, 2, -1, 2.1], [37, 44, 2, 3, 1.2, .9]]);
    const band = (i, color) => ({ xAxis: i, itemStyle: { color }, areaStyle: { color }, emphasis: { disabled: true } });
    chart("fund-scenario", {
      animation: false,
      grid: { left: 80, right: 20, top: 20, bottom: 56 },
      tooltip: { trigger: "axis", valueFormatter: v => v + "%" },
      xAxis: { type: "category", boundaryGap: false, data: Array.from({ length: n }, (_, i) => i), axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12, interval: 3, hideOverlap: true, formatter: () => "2018-01-10" } },
      yAxis: { type: "value", min: -20, max: 60, interval: 20, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#8F8686", fontSize: 12, formatter: "{value}%" }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      dataZoom: [{ type: "slider", height: 14, bottom: 26, borderColor: "#eaeaea", fillerColor: "rgba(104,101,167,.12)", handleStyle: { color: "#6865A7" }, textStyle: { color: "#999", fontSize: 10 }, start: 0, end: 100 }],
      series: [
        { name: "交银定期支付双息混合", type: "line", showSymbol: false, symbol: "none", data: fundData, lineStyle: { color: "#5B8FF9", width: 1.6 },
          markArea: { silent: true, data: [[band(0, "rgba(243,201,209,.55)"), band(7, "rgba(243,201,209,.55)")], [band(7, "rgba(188,232,216,.65)"), band(15, "rgba(188,232,216,.65)")], [band(15, "rgba(243,201,209,.55)"), band(24, "rgba(243,201,209,.55)")], [band(24, "rgba(198,235,221,.6)"), band(32, "rgba(198,235,221,.6)")], [band(32, "rgba(215,242,230,.7)"), band(37, "rgba(215,242,230,.7)")], [band(37, "rgba(243,201,209,.55)"), band(43, "rgba(243,201,209,.55)")]] } },
        { name: "沪深300", type: "line", showSymbol: false, symbol: "none", data: hsData, lineStyle: { color: "#D98257", width: 1.4 } }
      ]
    });
  }

  // ---------- 持仓页图表 ----------
  const hCats = ["2018/05", "2018/09", "2018/11", "2019/01", "2019/03", "2019/05"];
  // 100% 堆叠面积：layers 自下而上 [{name,color,data:[百分比…]}]
  function stackArea(id, cats, layers, opts = {}) {
    if (!document.getElementById(id)) return;
    chart(id, {
      animation: false,
      grid: { left: 44, right: 16, top: opts.top || 16, bottom: 28 },
      tooltip: { trigger: "axis", backgroundColor: "rgba(30,30,30,.94)", borderWidth: 0, textStyle: { color: "#fff", fontSize: 12 } },
      xAxis: { type: "category", boundaryGap: false, data: cats, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12 } },
      yAxis: { type: "value", min: 0, max: 100, interval: 20, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#8F8686", fontSize: 12, formatter: opts.noPct ? "{value}" : "{value}%" }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      series: layers.map(l => ({ name: l.name, type: "line", stack: "total", data: l.data, showSymbol: false, symbol: "none", lineStyle: { width: .8, color: l.color }, itemStyle: { color: l.color }, areaStyle: { color: l.color }, emphasis: { disabled: true } }))
    });
  }

  // 资产/板块/地区/行业/纯债历史：同一套堆叠数据
  function holdingsStacks() {
    const layers = [
      { name: "其他资产", color: "#9A94CB", data: [57, 52, 65, 60, 55, 69] },
      { name: "现金", color: "#F6B896", data: [22, 25, 16, 18, 23, 14] },
      { name: "基金", color: "#93D8D3", data: [8, 6, 8, 12, 10, 10] },
      { name: "股票", color: "#E885A3", data: [9, 9, 6, 4, 7, 4] },
      { name: "权证", color: "#C69A6E", data: [2, 5, 3, 3, 2, 2] },
      { name: "债券", color: "#4A6FCF", data: [2, 3, 2, 3, 3, 1] }
    ];
    stackArea("fund-asset-history", hCats, layers);
    stackArea("fund-board-history", hCats, layers);
    stackArea("fund-region-history", hCats, layers);
    stackArea("fund-industry-history", hCats, layers);
    stackArea("fund-bond-pure-history", hCats, layers);
  }

  // 股票行业分布：双环（内环 TMT/周期，外环一级行业多彩）
  function industryDonut() {
    if (!document.getElementById("fund-industry-donut")) return;
    chart("fund-industry-donut", {
      animation: false,
      tooltip: { trigger: "item" },
      series: [
        { type: "pie", radius: ["0%", "34%"], center: ["50%", "50%"], label: { show: false }, labelLine: { show: false }, data: [{ name: "TMT", value: 79, itemStyle: { color: "#7C78BC" } }, { name: "周期", value: 21, itemStyle: { color: "#B4B1E0" } }] },
        { type: "pie", radius: ["46%", "70%"], center: ["50%", "50%"], label: { show: false }, labelLine: { show: false }, data: [[19, "#86A7F5"], [17, "#B3D4F0"], [15, "#C8A2F5"], [13, "#F6A8B5"], [11, "#7FD8D0"], [10, "#FCD5A0"], [8, "#7BE0A3"], [7, "#E4F59B"]].map(([v, c]) => ({ value: v, itemStyle: { color: c } })) }
      ]
    });
  }

  // 风格行业漂移：配置漂移图（100% 堆叠面积 + 漂移预警针）
  function driftArea() {
    if (!document.getElementById("fund-drift-area")) return;
    const cats = ["2022-12-31", "2023-02-30", "2023-03-31", "2023-04-30", "2023-05-31", "2023-06-30"];
    const layers = [
      ["电子", "#5BAEF5", [12, 12, 12, 6, 6, 7]],
      ["食品饮料", "#DFF58E", [13, 4, 18, 4, 4, 3]],
      ["医药卫生", "#6FD7D2", [9, 10, 17, 14, 7, 8]],
      ["美容护肤", "#F284D8", [12, 9, 14, 20, 16, 7]],
      ["纺织服饰", "#EAFB7C", [5, 12, 8, 12, 13, 20]],
      ["社会服务", "#FDB58C", [7, 10, 5, 8, 10, 12]],
      ["汽车", "#FFE27A", [12, 10, 9, 12, 10, 13]],
      ["家用电器", "#FFD966", [8, 12, 6, 8, 9, 10]],
      ["计算机*", "#9CCBF4", [10, 9, 8, 7, 9, 8]],
      ["传媒*", "#FDA877", [12, 12, 3, 9, 16, 12]]
    ];
    chart("fund-drift-area", {
      animation: false,
      grid: { left: 44, right: 16, top: 30, bottom: 28 },
      tooltip: { trigger: "axis", backgroundColor: "rgba(30,30,30,.94)", borderWidth: 0, textStyle: { color: "#fff", fontSize: 12 } },
      xAxis: { type: "category", boundaryGap: false, data: cats, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12 } },
      yAxis: { type: "value", min: 0, max: 100, interval: 20, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#8F8686", fontSize: 12, formatter: "{value}%" }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      graphic: [{ type: "text", right: 20, top: 6, style: { text: "回归R方均值：0.76", fill: "#999", fontSize: 12 } }],
      series: layers.map(([name, color, data], i) => ({
        name, type: "line", stack: "total", data, showSymbol: false, symbol: "none",
        lineStyle: { width: .8, color }, itemStyle: { color }, areaStyle: { color }, emphasis: { disabled: true },
        markPoint: i === 0 ? { symbol: "pin", symbolSize: 24, itemStyle: { color: "#FD484C" }, label: { show: false }, data: [{ coord: [2, 2] }] } : undefined
      }))
    });
  }

  // 漂移对比图：横向双条（公布持仓/回归分析）+ p 值
  function driftBars() {
    if (!document.getElementById("fund-drift-bars")) return;
    const rows = [
      ["纺织服饰", 10, 25, true], ["社会服务", 4, 25, true], ["金融地产", 4, 23, true], ["美容护肤", 13, 17, true],
      ["电子", .5, 24, false], ["汽车", 3, 12, false], ["食品饮料", 6, 17, false], ["医药卫生", 4, 16, false],
      ["家用电器", 1.5, 4, false], ["计算机", 1, 2, false]
    ];
    chart("fund-drift-bars", {
      animation: false,
      grid: { left: 76, right: 26, top: 36, bottom: 28 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "value", min: 0, max: 30, interval: 5, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12, formatter: "{value}%" }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      yAxis: {
        type: "category", inverse: true, data: rows.map(r => r[0]), axisTick: { show: false }, axisLine: { lineStyle: { color: "#eaeaea" } },
        axisLabel: { width: 70, overflow: "truncate", color: "#666", fontSize: 12, formatter: (v) => { const r = rows.find(x => x[0] === v); return `{a|${v}}\n{${r[3] ? "r1" : "r0"}|(0.${r[3] ? "23" : "01"})}`; }, rich: { a: { color: "#666", fontSize: 12, lineHeight: 15 }, r1: { color: "#FD484C", fontSize: 10, lineHeight: 13 }, r0: { color: "#999", fontSize: 10, lineHeight: 13 } } }
      },
      dataZoom: [{ type: "slider", yAxisIndex: 0, right: 2, width: 8, start: 0, end: 100, borderColor: "#ddd", fillerColor: "rgba(104,101,167,.18)", handleSize: "60%", showDetail: false }],
      graphic: [{ type: "text", right: 30, top: 6, style: { text: "日期：2023-06-26   调整R方：0.76   Prob (F-statistic)：0.01", fill: "#999", fontSize: 12 } }],
      series: [
        { name: "公布持仓", type: "bar", barWidth: 7, data: rows.map(r => r[1]), itemStyle: { color: "#B39DDB" } },
        { name: "回归分析", type: "bar", barWidth: 7, data: rows.map(r => r[2]), itemStyle: { color: "#5C6BC0" } }
      ]
    });
  }

  // 股票估值水平（交银紫线 / 同类浅紫空心 / 沪深300橙横划 / 重仓行业粉横划）
  function valuationChart() {
    if (!document.getElementById("fund-valuation")) return;
    const n = 9;
    const cats = Array.from({ length: n }, () => "2019-06-30");
    const labelMap = { "-20": "-20", "-7": "0", "7": "20", "20": "40", "33": "40", "47": "40", "60": "60" };
    const yAxis = {
      type: "value", min: -20, max: 60, interval: 40 / 3, name: "PE", nameTextStyle: { color: "#666", fontSize: 12 }, nameGap: 18,
      axisTick: { show: false }, axisLine: { show: false },
      axisLabel: { color: "#8F8686", fontSize: 12, formatter: v => labelMap[String(Math.round(v))] ?? "" },
      splitLine: { lineStyle: { color: "#eaeaea" } }
    };
    chart("fund-valuation", {
      animation: false,
      grid: { left: 56, right: 24, top: 24, bottom: 64 },
      legend: { bottom: 2, itemWidth: 14, itemHeight: 8, itemGap: 20, textStyle: { color: "#555", fontSize: 12 } },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", boundaryGap: false, data: cats, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12, interval: 1 } },
      yAxis,
      dataZoom: [{ type: "slider", height: 14, bottom: 30, borderColor: "#eaeaea", fillerColor: "rgba(104,101,167,.12)", handleStyle: { color: "#6865A7" }, textStyle: { color: "#999", fontSize: 10 }, start: 0, end: 100 }],
      series: [
        { name: "交银定期支付双息混合", type: "line", data: [24, 29, 26, 12, 24, 36, 28, 24, 39], symbol: "circle", symbolSize: 7, itemStyle: { color: "#5B63C8" }, lineStyle: { color: "#5B63C8", width: 1.6 } },
        { name: "同类平均", type: "line", data: [28, 26, 35, 15, 25, 42, 27, 19, 48], symbol: "circle", symbolSize: 6, itemStyle: { color: "#fff", borderColor: "#B79CE0", borderWidth: 1.6 }, lineStyle: { color: "#B79CE0", width: 1.4 } },
        { name: "沪深300", type: "scatter", symbol: "rect", symbolSize: [16, 3], data: [null, 34, 30, 5, 18, 48, 40, 32, 44], itemStyle: { color: "#FFB038" } },
        { name: "重仓行业", type: "scatter", symbol: "rect", symbolSize: [16, 3], data: [null, 26, 36, 32, 42, 30, 22, 14, 42], itemStyle: { color: "#FF9B9B" } }
      ]
    });
  }

  // 双 y 轴 -20~60（左右均重复 40 刻度，仿标注）
  function fakePeAxis(extra = {}) {
    const labelMap = { "-20": "-20", "-7": "0", "7": "20", "20": "40", "33": "40", "47": "40", "60": "60" };
    return { type: "value", min: -20, max: 60, interval: 40 / 3, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#8F8686", fontSize: 12, formatter: v => labelMap[String(Math.round(v))] ?? "" }, splitLine: { lineStyle: { color: "#eaeaea" } }, ...extra };
  }

  // 股票换手率
  function turnoverChart() {
    if (!document.getElementById("fund-turnover")) return;
    const cats = Array.from({ length: 9 }, () => "2019-06-30");
    chart("fund-turnover", {
      animation: false,
      grid: { left: 48, right: 44, top: 20, bottom: 60 },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: cats, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12, interval: 1 } },
      yAxis: [fakePeAxis({ position: "left" }), fakePeAxis({ position: "right", splitLine: { show: false } })],
      dataZoom: [{ type: "slider", height: 14, bottom: 28, borderColor: "#eaeaea", fillerColor: "rgba(104,101,167,.12)", handleStyle: { color: "#6865A7" }, textStyle: { color: "#999", fontSize: 10 }, start: 0, end: 100 }],
      series: [
        { name: "换手率", type: "bar", barWidth: 13, data: [35, 35, 33, 35, 36, 35, 36, 36, 36], itemStyle: { color: "#6B68B3" } },
        { name: "同类基金中位数", type: "line", data: [30, 29, 39, 33, 40, 27, 42, 36, 50], symbol: "circle", symbolSize: 6, itemStyle: { color: "#fff", borderColor: "#38BDF8", borderWidth: 1.6 }, lineStyle: { color: "#38BDF8", width: 1.6 } },
        { name: "同类排名", type: "line", data: [30, 37, 34, 28, 30, 30, 35, 42, 32], symbol: "circle", symbolSize: 6, itemStyle: { color: "#F6A06F" }, lineStyle: { color: "#F6A06F", width: 1.6 } }
      ]
    });
  }

  // 留存度与拥挤度
  function crowdingChart() {
    if (!document.getElementById("fund-crowding")) return;
    const cats = Array.from({ length: 9 }, () => "2019-06-30");
    chart("fund-crowding", {
      animation: false,
      grid: { left: 48, right: 44, top: 20, bottom: 60 },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: cats, axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12, interval: 1 } },
      yAxis: [fakePeAxis({ position: "left" }), fakePeAxis({ position: "right", splitLine: { show: false } })],
      dataZoom: [{ type: "slider", height: 14, bottom: 28, borderColor: "#eaeaea", fillerColor: "rgba(104,101,167,.12)", handleStyle: { color: "#6865A7" }, textStyle: { color: "#999", fontSize: 10 }, start: 0, end: 100 }],
      series: [
        { name: "拥挤度", type: "bar", barWidth: 13, data: [35, 35, 33, 35, 35, 35, 35, 35, 36], itemStyle: { color: "#6B68B3" } },
        { name: "集中度", type: "line", yAxisIndex: 1, data: [30, 37, 34, 28, 30, 30, 35, 42, 32], symbol: "circle", symbolSize: 6, itemStyle: { color: "#B16BE0" }, lineStyle: { color: "#B16BE0", width: 1.6 } },
        { name: "留存度", type: "line", yAxisIndex: 1, data: [29, 27, 39, 33, 40, 26, 42, 36, 51], symbol: "circle", symbolSize: 6, itemStyle: { color: "#fff", borderColor: "#5ED0CB", borderWidth: 1.6 }, lineStyle: { color: "#5ED0CB", width: 1.6 } }
      ]
    });
  }

  // 债券板块分布变化（非 100% 堆叠，两点）
  function bondChangeArea() {
    if (!document.getElementById("fund-bond-change")) return;
    const layers = [
      ["TMT", "#A9CDF0", [17, 8]], ["中游制造", "#8DA9FF", [9, 5]], ["医药", "#7FD3D0", [5, 3]],
      ["周期", "#89E894", [3, 8]], ["消费", "#FFB27D", [14, 27]], ["金融地产", "#FFADB8", [6, 8]]
    ];
    chart("fund-bond-change", {
      animation: false,
      grid: { left: 44, right: 16, top: 16, bottom: 28 },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", boundaryGap: false, data: ["2023-06-30", "2023-12-31"], axisTick: { show: false }, axisLine: { lineStyle: { color: "#666" } }, axisLabel: { color: "#8F8686", fontSize: 12 } },
      yAxis: { type: "value", min: 0, max: 100, interval: 20, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: "#8F8686", fontSize: 12 }, splitLine: { lineStyle: { color: "#eaeaea" } } },
      series: layers.map(([name, color, data]) => ({ name, type: "line", stack: "total", data, showSymbol: false, symbol: "none", lineStyle: { width: .8, color }, itemStyle: { color }, areaStyle: { color }, emphasis: { disabled: true } }))
    });
  }

  // 纯债资产环形
  function bondDonut() {
    if (!document.getElementById("fund-bond-donut")) return;
    chart("fund-bond-donut", {
      animation: false,
      tooltip: { trigger: "item" },
      series: [{
        type: "pie", radius: ["52%", "74%"], center: ["50%", "50%"], label: { show: false }, labelLine: { show: false },
        data: [
          { name: "信用债", value: 48.72, itemStyle: { color: "#F6A06F" } },
          { name: "利率债", value: 8.57, itemStyle: { color: "#6E83D4" } },
          { value: 15, itemStyle: { color: "#7FD3D0" } }, { value: 12, itemStyle: { color: "#E892A2" } }, { value: 15.71, itemStyle: { color: "#C9C6EC" } }
        ]
      }]
    });
  }

  window.FundAnalysisView = { template, renderCharts, views };
})();
