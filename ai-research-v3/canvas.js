(function () {
  "use strict";

  const records = [
    {name:"均衡精选混合",type:"混合型",year:"8.26%",three:"15.82%",risk:"−6.43%"},
    {name:"稳健成长混合",type:"混合型",year:"6.14%",three:"11.56%",risk:"−4.18%"},
    {name:"核心优选股票",type:"股票型",year:"10.52%",three:"18.09%",risk:"−9.67%"}
  ];
  const storageVersion = document.documentElement.dataset.prototype || "v1";
  const storageKey = "zhice.navlab.conversations."+storageVersion;
  const hasResourcePanel = storageVersion==="v3";
  const allocation = {
    question: "结合当前市场环境，为我形成一套可执行的资产配置建议",
    title: "可执行的资产配置建议",
    marketTitle: "一、当前市场环境（行情、估值、结构数据日期 2026-11-20；资金数据日期 2026-11-19）",
    marketText: "这是一个“全球风险偏好收缩 + A股趋势走弱 + 防御风格占优”的环境，并非普通的震荡行情。",
    bridge: "在这个情景下，先留足近期要用的钱，再决定有多少资金可以承受股市波动。",
    allocationTitle: "二、参考配置：100 万元怎么分",
    assumption: "假设这笔资金的投资期限为 3 年，其中 15 万元在未来一年有明确用途。下面用一组示例权重说明分配方法。",
    headers: ["资产类别", "目标占比", "参考金额", "配置思路"],
    rows: [
      ["债券", "50%", "50 万元", "以中短久期、高信用等级债券为主，控制利率和信用风险。"],
      ["权益", "30%", "30 万元", "宽基 20 万元、红利低波 10 万元；合并检查两者的行业集中度。"],
      ["现金及等价物", "15%", "15 万元", "对应未来一年的计划支出，按用款日核对可用额度和到账时间。"],
      ["黄金", "5%", "5 万元", "分散股债以外的风险，控制单一资产价格波动对组合的影响。"]
    ],
    executionTitle: "三、从现有持仓调到目标",
    execution: [
      "先算差额。若当前权益市值为 40 万元，占比 40%，与 30% 的目标相差 10 个百分点，对应 10 万元。",
      "再定顺序。如果现金储备尚缺 5 万元，先补足这部分，再把其余 5 万元调往低配资产。执行前核对赎回费和到账日。"
    ],
    reviewTitle: "四、何时重新评估",
    review: "每月末核对一次。以权益为例，若占比低于 25% 或高于 35%，先用新增或到期资金调整；若用款时间提前，优先重算现金需求。",
    note: "投研情景示例 · 市场描述沿用设计稿设定，比例、金额与复核阈值用于演示。"
  };
  const allocationKind = "allocation-example-v1";
  const comparisonExample = "在近一年的示例数据中，核心优选股票收益为 10.52%，均衡精选混合为 8.26%，稳健成长混合为 6.14%。";
  const oldComparisonExample = comparisonExample+"打开「基金比较」可以并排查看收益与回撤。";
  const fixtures = [
    ["最近聊天1", "比较基金近一年的收益表现。", ""],
    ["最近聊天2", "整理本周资金流向和行业轮动。", ""],
    ["最近聊天3", "回顾组合持仓和上一季度的收益贡献。", ""],
    ["项目聊天1", "分析这只基金的近一年回撤和波动。", "项目名称1"],
    ["项目聊天2", "梳理基金配置与前十大重仓股。", "项目名称1"],
    ["项目2聊天1", "比较同类基金的风险与收益。", "项目名称2"],
    ["项目3聊天1", "研究近期行业轮动与市场变化。", "项目名称3"]
  ];
  function loadConversations(projectList=projects) {
    const projectIds=new Set(projectList.map(project=>project.id));
    const all = new Map(fixtures.map(([title, question, project]) => [title, {
      id:title, title, project:projectIds.has(project) ? project : "", updatedAt: 0,
      messages: [{role:"user", text:question}, {role:"ai", text:sampleReply(question)}]
    }]));
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      // Old saves contained overrides for sample chats. New saves include the complete list.
      const entries=Array.isArray(saved) ? saved : saved?.items;
      if (Array.isArray(entries)) {
        if (!Array.isArray(saved)) all.clear();
        const legacyPins=[];
        for (const entry of entries) {
          if (!entry || typeof entry.title !== "string" || !Array.isArray(entry.messages)) continue;
          if (!entry.messages.every(m => m && typeof m.text === "string" && ["user","ai"].includes(m.role))) continue;
          const project=projectIds.has(entry.project) ? entry.project : "";
          const thread={id:entry.id || entry.title,title:entry.title,messages:entry.messages,
            folderPin:project && Number.isSafeInteger(entry.folderPin) ? Math.max(0,entry.folderPin) : 0,
            recentPin:Number.isSafeInteger(entry.recentPin) ? Math.max(0,entry.recentPin) : 0,
            inRecent:entry.inRecent===true || Number.isFinite(entry.recentOrder),
            page:typeof entry.page==="string"?entry.page:"",
            project,updatedAt:Number(entry.updatedAt) || 0};
          if (typeof entry.taskTitle==="string") {
            thread.taskTitle=entry.taskTitle;
            thread.taskProjectId=entry.taskProjectId || "";
          }
          if (project && entry.pinned===true && !Number.isSafeInteger(entry.folderPin)) {
            legacyPins.push({thread,order:Number.isFinite(entry.folderOrder)?entry.folderOrder:-thread.updatedAt});
          }
          all.set(thread.title,thread);
        }
        // Preserve the relative order of existing folder pins on the first read of an older save.
        legacyPins.sort((a,b)=>a.order-b.order).forEach(({thread},i)=>{thread.folderPin=legacyPins.length-i;});
      }
    } catch {}
    return all;
  }
  const projectStorage = "zhice.navlab.projects."+storageVersion;
  const starterProjects = ["项目名称1","项目名称2","项目名称3"];
  // Legacy conversation.project values used the original folder name as their ID.
  function loadProjects() {
    let names = starterProjects;
    try {
      const saved = JSON.parse(localStorage.getItem(projectStorage));
      if (Array.isArray(saved?.items)) {
        return saved.items.filter(item=>item && typeof item.id==="string" && typeof item.name==="string" && item.name.trim())
          .map(item=>({id:item.id,name:item.name,pinOrder:Number(item.pinOrder)||0}));
      }
      if (Array.isArray(saved)) names=[...new Set([...names,...saved.filter(name=>typeof name==="string" && name.trim())])];
    } catch {}
    return names.map(name=>({id:name,name,pinOrder:0}));
  }
  let projects = loadProjects();
  const projectId = name => projects.find(item=>item.name===name)?.id || "";
  const projectName = id => projects.find(item=>item.id===id)?.name || "";
  function sortedProjects() {
    return [...projects].sort((a,b)=>b.pinOrder-a.pinOrder).map(({id,name})=>({id,name}));
  }
  const projectNames = () => sortedProjects().map(item=>item.name);
  function saveItems(key, items) {
    try {
      localStorage.setItem(key, JSON.stringify({items:[...items]}));
      return true;
    } catch { return false; }
  }
  function saveProjects() {
    return saveItems(projectStorage,projects);
  }
  let threads = loadConversations();
  let current = {mode:"home"};
  let welcomeEntry = 0;
  const spaces = window.featureWorkspaces;
  let renderedDocument = null;
  const newDraft = () => ({topic:"资产配置", text:"", task:"", project:"", attachments:[]});
  let draft = newDraft();
  const followDrafts = new Map();
  const chatScroll = new Map();
  const followKey = () => "chat:"+threads.get(current.thread)?.id;
  function activeDraft() {
    if (!current.thread) return draft;
    const key = followKey();
    if (!followDrafts.has(key)) followDrafts.set(key, {text:"", attachments:[]});
    return followDrafts.get(key);
  }
  const tasks = ["基金深度分析报告", "收盘复盘", "早盘梳理", "行业深度分析"];
  const taskPrompt = task => "请基于「"+task+"」帮我分析：";
  const questions = {
    "资产配置":["我的组合在股票、债券和现金之间是如何配置的？",allocation.question,"组合在哪些行业配置过重，可能承担哪些风险？"],
    "基金诊断":["这只基金近一年的收益主要来自哪里？","和同类基金相比，它的最大回撤表现如何？","最近两个季度，它的行业配置发生了哪些变化？"],
    "行业轮动":["最近一个月哪些行业表现领先？","本轮行业轮动与上个季度有什么不同？","哪些行业的景气度和盈利预期同时改善？"],
    "资金流向":["请使用「资金流向研判」能力，梳理近期北向与主力资金行业流向","近一周主力资金持续净流入的行业与个股有哪些？","分析北向资金近期调仓方向，对应哪些风格与行业变化"],
    "研报检索":["最近有哪些研报讨论基金配置策略？","查找近一个月关于半导体行业的研究报告。","不同机构对当前市场的判断有哪些分歧？"]
  };
  const icons = {
    spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
    send:'<path d="M12 19V5m-6 6 6-6 6 6"/>',
    pencil:'<path d="M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6M16 4l4 4m-9 6 1-4 7-7 3 3-7 7z"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    fold:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/>',
    chart:'<path d="M4 18V7m0 11h16M7 14l4-4 3 2 5-6"/>',
    right:'<path d="m9 6 6 6-6 6"/>',
    search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 5.5 5.5"/>',
    branch:'<circle cx="6" cy="5" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v7a5 5 0 0 0 5 5h5M6 12c0-2 2-3 4-3h6"/>',
    filter:'<path d="M3 5h18l-7 8v5l-4 2v-7z"/>',
    stack:'<path d="m12 4 9 5-9 5-9-5 9-5Zm-8 9 8 4 8-4M4 17l8 4 8-4"/>',
    document:'<path d="M6 3.5h8l4 4v13H6zM14 3.5v5h4M9 12h6M9 15.5h5"/>',
    table:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M4 10h16M10 10v9"/>',
    clip:'<path d="m8 12 6-6a3 3 0 0 1 4.2 4.2l-8 8a4.5 4.5 0 0 1-6.4-6.4l7.4-7.4m-4.3 9.6 7.7-7.7"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    restore:'<path d="M9 4v5H4m11-5v5h5M4 15h5v5m11-5h-5v5"/>'
  };
  const icon = (key) => '<svg class="rc-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+icons[key]+'</svg>';
  const esc = (value) => String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const root = () => document.getElementById("work");
  const asset = (name) => '<img src="./icons/'+name+'" alt="" draggable="false">';
  const paneSizeIcon = expanded => expanded ? icon("restore") : asset("work-maximize.svg");
  function fileControl() {
    const mark = hasResourcePanel ? '<img src="./icons/ai-attach-file.png" width="18" height="18" alt="" draggable="false">' : '<i aria-hidden="true"></i>';
    return '<button class="rc-plus" type="button" data-action="attach" aria-label="添加附件" title="添加附件">'+mark+'</button><input class="rc-file-input" type="file" multiple hidden>';
  }
  function fileNames(attachments) {
    return attachments.map((name,i)=>'<button type="button" class="rc-tag" data-remove-file="'+i+'" aria-label="移除文件 '+esc(name)+'">'+esc(name)+' ×</button>').join("");
  }
  function fileTags(attachments) {
    return '<div class="rc-file-tags"'+(attachments.length?'':' hidden')+'>'+fileNames(attachments)+'</div>';
  }
  function taskChip() {
    return '<span class="rc-inline-task" hidden><span class="rc-task-name"></span><button type="button" data-action="remove-task" aria-label="移除快捷分析">×</button></span>';
  }
  function shortcutButton(task, selected) {
    return '<button type="button" data-task="'+esc(task)+'" aria-pressed="'+(selected===task)+'">'+asset("71dcf.svg")+esc(task)+'</button>';
  }
  function quickReferences(selected) {
    const labels = window.studyMethodLibrary?.enabledTitles() || tasks;
    if (!labels.length) return "";
    const buttons = labels.map(task=>shortcutButton(task,selected)).join("");
    return '<span class="rc-quick" data-layout="more"><span class="rc-quick-measure"><span class="rc-quick-list">'+buttons+
      '</span></span><span class="rc-quick-overflow"><button type="button" data-action="extra-tasks" aria-expanded="false" aria-label="更多快捷引用">更多 '+asset("58d60.svg")+
      '</button><span class="rc-tasks-menu" role="group" aria-label="快捷引用" hidden>'+buttons+'</span></span></span>';
  }
  function composer() {
    const pending = activeDraft();
    const shortcuts = quickReferences(pending.task);
    return '<form class="rc-composer rc-follow-composer">'+fileTags(pending.attachments)+
      '<div class="rc-home-editor"><textarea aria-label="继续追问" placeholder="继续追问…" rows="2" maxlength="4000">'+esc(pending.text)+'</textarea>'+taskChip()+'</div>'+
      '<div class="rc-composer-tools"><div class="rc-entry-tools">'+fileControl()+(shortcuts?'<span class="rc-tool-divider"></span>'+shortcuts:'')+'</div>'+
      '<button class="rc-send" type="submit" aria-label="发送问题" title="发送问题"'+(pending.text.trim()?'':' disabled')+'>'+icon("send")+'</button></div></form>';
  }
  function followupQuestions(messages) {
    const userMessages = messages.filter(m=>m.role==="user").map(m=>m.text);
    const last = userMessages.at(-1) || "";
    const topics = [
      [/早盘|隔夜|开盘/, ["今天开盘前有哪些关键事件值得关注？","哪些指标可以用来跟踪今天的市场风险？"]],
      [/收盘|复盘/, ["哪些因素对本期收益影响最大？","下次复盘应重点跟踪哪些变化？"]],
      [/持仓|行业|配置|重仓/, ["哪些行业的配置最集中？","这次持仓变化会怎样影响组合风险？"]],
      [/回撤|风险|波动/, ["最大回撤发生在哪个时段？","和同类基金相比，波动水平如何？"]],
      [/基金深度分析|收益|基金表现/, ["收益主要来自哪些持仓？","把时间拉长到三年，表现有什么变化？"]]
    ];
    const choices = topics.find(([rule])=>rule.test(last))?.[1] || [];
    const available = choices.filter(q=>!userMessages.some(m=>m.includes(q)));
    return available.length ? '<div class="rc-followups" aria-label="继续追问">'+available.map(q=>'<button type="button" data-follow="'+esc(q)+'">'+esc(q)+'</button>').join("")+'</div>' : "";
  }
  function namedFunds(text) {
    const funds = [...window.studyFundsPages.mentionedFunds(text), ...window.fundComparison.mentionedFunds(text)];
    const unique = new Map();
    for (const fund of funds) {
      const code=fund.code || fund.id;
      if (!unique.has(code)) unique.set(code,fund);
    }
    return [...unique.values()];
  }
  function answerTool(message) {
    if (message?.role!=="ai") return null;
    const context = message.context;
    if (context?.page==="指数行情") return null;
    // Older example conversations store only the written answer.
    const example=message.text===comparisonExample || message.text===oldComparisonExample;
    const funds = context?.funds || (example ? namedFunds(comparisonExample) : []);
    if (!funds.length || funds.length>4) return null;
    return {page:funds.length===1?"基金分析":"基金比较", funds,
      period:context?.period || "近1年", start:context?.start, end:context?.end};
  }
  function answerToolButton(message,index) {
    const target = answerTool(message);
    if (!target) return "";
    return '<button type="button" class="rc-answer-tool" data-answer-tool="'+index+'">'+icon("chart")+'查看'+esc(target.page)+icon("right")+'</button>';
  }
  function history(title) {
    const all = threads.get(title)?.messages || [];
    return all.map((message,index)=>{
      if (message.role==="user") {
        const run=message.taskSlot ? '<small class="rc-task-run-time">'+(message.taskSlot.startsWith("manual:")?'试运行':'定时执行')+' · '+esc(taskRunDate.format(message.timestamp))+'</small>' : "";
        return run+'<div class="rc-question" id="summary-message-'+index+'" tabindex="-1">'+esc(message.text)+'</div>';
      }
      if (message.kind===allocationKind) return allocationArticle(index);
      const toolButton=answerToolButton(message,index);
      if (message.kind==="fund-metric") return metricArticle(message,index,toolButton);
      const text=message.text===oldComparisonExample ? comparisonExample : message.text;
      return '<article class="rc-answer" id="summary-answer-'+index+'" tabindex="-1"><div class="rc-answer-name">'+icon("spark")+'智策 AI<span>示例回复</span></div><p>'+esc(text)+'</p>'+toolButton+'</article>';
    }).join("") + (all.at(-1)?.role==="ai" && all.at(-1).kind!==allocationKind ? followupQuestions(all) : "");
  }
  function isAllocationQuestion(text) {
    const prompt = text.split(" 附件：")[0].replace(/\s+/g, "").replace(/[。．.!！?？]+$/, "");
    return prompt === allocation.question;
  }
  function allocationPlainText() {
    return [
      allocation.marketTitle, allocation.marketText, allocation.bridge,
      allocation.allocationTitle, allocation.assumption, allocation.headers.join(" · "),
      ...allocation.rows.map(row=>row.join(" · ")), allocation.executionTitle, ...allocation.execution,
      allocation.reviewTitle, allocation.review, allocation.note
    ].join("\n");
  }
  function allocationArticle(index) {
    const paragraph = value=>'<p>'+esc(value)+'</p>';
    const section = (heading, content)=>'<section><h2>'+esc(heading)+'</h2>'+content+'</section>';
    const header = allocation.headers.map(value=>'<th scope="col">'+esc(value)+'</th>').join("");
    const tableRows = allocation.rows.map(([name,...values])=>
      '<tr><th scope="row">'+esc(name)+'</th>'+values.map(value=>'<td>'+esc(value)+'</td>').join("")+'</tr>').join("");
    const table = '<div class="rc-allocation-table" id="summary-table-'+index+'" tabindex="-1"><table aria-label="100 万元示例资产配置"><thead><tr>'+header+
      '</tr></thead><tbody>'+tableRows+'</tbody></table></div>';
    return '<article class="rc-allocation-report" id="summary-report-'+index+'" tabindex="-1" aria-label="智策 AI 资产配置示例回复">'+
      section(allocation.marketTitle,paragraph(allocation.marketText)+paragraph(allocation.bridge))+
      section(allocation.allocationTitle,paragraph(allocation.assumption)+table)+
      section(allocation.executionTitle,allocation.execution.map(paragraph).join(""))+
      section(allocation.reviewTitle,paragraph(allocation.review))+
      '<p class="rc-allocation-note">'+esc(allocation.note)+'</p></article>';
  }
  function sampleReply(query) {
    if (/早盘|隔夜|开盘/.test(query)) return "早盘梳理可以先看隔夜市场，再列出当天将公布的重要数据与事件，最后整理需要跟踪的行业和风险指标。";
    if (/收盘|复盘/.test(query)) return "复盘时，可以先对照基准检查收益，再按持仓与行业拆解贡献，记录下一次需要观察的变化。";
    if (/持仓|行业/.test(query)) return "可以先看股票和债券占比，再比较前十大重仓股与行业分布。打开「基金分析」，可以继续查看基金概览。";
    if (/风险|回撤|波动|筛选/.test(query)) return "以近一年示例数据为例，稳健成长混合的最大回撤为 −4.18%，是三只示例基金中回撤幅度最小的一只。你可以在「基金筛选」里按基金类型缩小范围。";
    if (/基金/.test(query) && /比|收益|表现/.test(query)) return comparisonExample;
    return "可以从基金收益、最大回撤和持仓结构三个角度展开。你可以继续问“比较基金表现”，或从「投研网站」打开相应功能查看示例。";
  }
  function pageStarters(ctx) {
    return window.fundStarters.forContext(ctx) || window.researchPrompts.forPage(ctx.page);
  }
  const metricLabels = {drawdown:"最大回撤",performance:"区间收益",volatility:"年化波动率"};
  function formatMetric(value,metric) {
    const number=Math.abs(value).toFixed(2).replace(/0$/,"").replace(/\.0$/,"");
    return (value<0?"−":metric==="performance" && value>0?"+":"")+number+"%";
  }
  function contextualAnswer(query,ctx) {
    const textOnly = query.split(" 附件：")[0];
    const starters=pageStarters(ctx);
    const suggested=starters.find(item=>item.question===textOnly.trim());
    if(suggested?.answer) return {role:"ai",text:suggested.answer,context:ctx};
    if((/发生在|哪段时间|哪个时段|何时|峰值|低点日期/.test(textOnly)) && ctx.funds?.length){
      const fund=ctx.funds.find(f=>textOnly.includes(f.name)) || ctx.funds.filter(f=>Number.isFinite(f.drawdown)).sort((a,b)=>b.drawdown-a.drawdown)[0];
      if(fund?.peakDate && fund.troughDate) return {role:"ai",context:ctx,text:fund.name+"在所选区间内的最大回撤为 "+formatMetric(fund.drawdown,"drawdown")+"，从 "+fund.peakDate+" 的阶段高点到 "+fund.troughDate+" 的低点。以上为当前图表的交互示例数据。"};
    }
    const metric=/波动|波幅/.test(textOnly) ? "volatility" : /回撤|跌幅|风险/.test(textOnly) ? "drawdown" : /收益|表现|收益率|涨幅|对比|比较|分析|复盘/.test(textOnly) ? "performance" : "";
    if(metric && ctx.funds?.length) {
      const rows=ctx.funds.filter(f=>Number.isFinite(f[metric])).map(f=>({name:f.name,value:f[metric],color:/^#[0-9a-f]{3,8}$/i.test(f.color||"")?f.color:""}));
      if(rows.length){
        const ascending=metric==="drawdown"?/回撤最大|跌幅最大/.test(textOnly):metric==="volatility"?!/最高|最大/.test(textOnly):/最低|最小|最差/.test(textOnly);
        const best=rows.reduce((a,b)=>(ascending?b.value<a.value:b.value>a.value)?b:a);
        const superlative=metric==="drawdown"?(ascending?"最大":"最小"):(ascending?"最低":"最高");
        const heading=rows.length===1?best.name+"的"+metricLabels[metric]+"为 "+formatMetric(best.value,metric):best.name+"的"+metricLabels[metric]+superlative;
        const detail=metric==="drawdown"?"在当前比较区间，"+best.name+"从阶段高点到随后低点的最大跌幅为 "+formatMetric(Math.abs(best.value),"drawdown")+"。":"在当前比较区间，"+best.name+(metric==="volatility"?"的年化波动率为 ":"的累计收益为 ")+formatMetric(best.value,metric)+"。";
        const note=metric==="drawdown"?"交互示例数据，实际数值以净值序列计算为准。":"交互示例数据，按当前所选基金与区间比较。";
        return {role:"ai",kind:"fund-metric",metric,heading,detail,rows,note,context:ctx,text:[heading,detail,...rows.map(r=>r.name+" "+formatMetric(r.value,metric)),note].join("\n")};
      }
    }
    const text=ctx.funds?.length
      ? "当前关联"+ctx.funds.length+"只基金"+(ctx.period?"，区间为"+ctx.period:"")+"。可以继续问「哪只基金的最大回撤最小？」或「哪只基金的区间收益最高？」。"
      : starters.length ? "在「"+ctx.page+"」中，可以从这个问题开始："+starters[0].question
      : "可以补充想分析的对象、区间和指标。";
    return {role:"ai",text,context:ctx};
  }
  function metricArticle(message,index,toolButton) {
    const rows=message.rows.map(row=>'<tr><td><span class="rc-fund-dot" style="background:'+(/^#[0-9a-f]{3,8}$/i.test(row.color)?row.color:"#aaa")+'"></span>'+esc(row.name)+'</td><td>'+formatMetric(row.value,message.metric)+'</td></tr>').join("");
    const label=metricLabels[message.metric];
    return '<article class="rc-metric-answer" id="summary-report-'+index+'" tabindex="-1"><h2>'+esc(message.heading)+'</h2><p>'+esc(message.detail)+'</p><div class="rc-metric-table" id="summary-table-'+index+'" tabindex="-1"><table aria-label="'+esc(label)+'对比表"><thead><tr><th>基金简称</th><th>'+esc(label)+'</th></tr></thead><tbody>'+rows+'</tbody></table></div><small>'+esc(message.note)+'</small>'+toolButton+'</article>';
  }
  function uniqueTitle(base,records=threads) {
    let title=base;
    for(let n=2;records.has(title);n++) title=base+" · "+n;
    return title;
  }
  function saveConversations() {
    return saveItems(storageKey,threads.values());
  }
  function showSavedConversation(record) {
    if (current.mode==="page") {
      current.thread=record.title;
      window.dispatchEvent(new Event("study-projects-changed"));
      refreshPanel();
    } else {
      current={mode:"chat",thread:record.title};
      window.onStudyCreated?.(record.title,projectName(record.project));
      render();
    }
  }
  function continueInNewConversation() {
    const source=threads.get(current.thread);
    if (!source?.messages.length) return;
    const title=uniqueTitle(source.title+" · 续聊");
    const record={id:newRecordId(),title,page:"",project:source.project,updatedAt:Date.now(),
      messages:structuredClone(source.messages)};
    threads.set(title,record);
    saveConversations();
    showSavedConversation(record);
    const area=root().querySelector(".rc-messages");
    if (area) area.scrollTop=area.scrollHeight;
    root().querySelector(".rc-follow-composer textarea")?.focus({preventScroll:true});
  }
  function followupContext(query,record) {
    const context=record.messages.at(-1)?.context;
    if(!context)return null;
    const names=context.funds || [];
    if(names.some(f=>query.includes(f.name) || (f.id && query.includes(f.id))))return context;
    if(/这只|这些|这几只|这两只|这三只|这组|已选|它们|它的|刚才那/.test(query))return context;
    return /^(那|那么|再看|再看看|请问)?(近一年|近1年|同期|区间|年化)?(最大回撤|回撤|收益率?|波动率?)(呢|是多少|有多少|有多大|如何|怎么样|怎么比较|发生在哪个时段)?[？?。！!]*$/.test(query.trim()) ? context : null;
  }
  function researchAnswer(query,record,sharedContext) {
    if(isAllocationQuestion(query))return {role:"ai",kind:allocationKind,text:allocationPlainText()};
    const last=record.messages.at(-1);
    const named=namedFunds(query);
    const plural=/[两二三四几多2-4]\s*[只支个款]\s*(基金|ETF)|这[两三四几2-4]\s*[只支]/i.test(query);
    const codes=query.match(/\d{6,}/g) || [];
    const wantsComparison=(plural || codes.length>=2) && /比|谁|哪|差|风险|回撤|收益|表现/.test(query);
    const pending=last?.kind==="clarify-compare" ? last : null;
    const previous=followupContext(query,record);
    const selected=named.length && pending && named.length===1
      ? [...new Map([...(pending.funds || []),...named].map(f=>[f.id,f])).values()] : named;
    const missing=codes.filter(code=>!named.some(fund=>(fund.code || fund.id)===code));
    if(!sharedContext && missing.length && (wantsComparison || pending)){
      return {role:"ai",kind:"clarify-compare",question:pending?.question || query,funds:selected.length?selected:pending?.funds || [],
        text:"当前示例中未收录 "+[...new Set(missing)].join("、")+"。请核对基金代码，或补充想比较的基金名称。"};
    }
    if (!sharedContext && (wantsComparison || (pending && named.length)) && selected.length<2 && !(previous?.funds?.length>=2 && !named.length)){
      const funds=selected;
      const text=funds.length ? "已找到"+funds[0].name+"。另一只想比较的基金叫什么？也可以输入基金代码。"
        : "你想比较哪几只基金？可以发基金名称或代码，例如 023616 和 023617。";
      return {role:"ai",kind:"clarify-compare",question:pending?.question || query,funds,text};
    }
    const reference=sharedContext || (selected.length ? {page:"基金研究",period:"近1年",funds:selected} : null);
    if(reference){
      const originalQuestion=last?.kind==="clarify-fund" || pending ? last.question : "";
      const hasNewMetric=/收益|回撤|波动|风险|表现/.test(query);
      return contextualAnswer(!hasNewMetric && originalQuestion ? originalQuestion : query,reference);
    }
    if(/\b\d{6}\b/.test(query) && (last?.kind==="clarify-fund" || /基金|收益|回撤/.test(query))){
      return {role:"ai",text:"当前原型的示例数据里没有这个基金代码。可以在基金筛选中勾选已收录的基金，点「AI 分析」继续。"};
    }
    if(previous)return contextualAnswer(query,previous);
    if(/这(只|支)基金|这只\s*ETF|该基金|它的(收益|回撤|波动)/i.test(query)){
      return {role:"ai",kind:"clarify-fund",question:query,text:"你想了解哪只基金？输入基金名称或代码就可以，也可以在「基金筛选」中选中基金，点击「AI 分析」。"};
    }
    return {role:"ai",text:sampleReply(query)};
  }
  function respond(q, attachments, task, sharedContext=null) {
    const query = q.trim();
    if (!query) return;
    const allocationRequested = isAllocationQuestion(query);
    let title = current.thread;

    if (!title) {
      const base = allocationRequested ? allocation.title : Array.from(query).slice(0,18).join("");
      title = uniqueTitle(base);
    }
    const record = threads.get(title) || {id:newRecordId(),title, page:"", project:draft.project, messages:[]};
    const answer = researchAnswer(query,record,sharedContext);
    record.updatedAt = Date.now();
    record.messages.push({role:"user",text:query,attachments,task,timestamp:record.updatedAt},
      {...answer,timestamp:record.updatedAt});
    threads.set(title, record);
    saveConversations();
    if (sharedContext && !current.thread && (draft.text || draft.attachments.length)) {
      followDrafts.set("chat:"+record.id,{text:draft.text,task:draft.task,attachments:draft.attachments});
    }
    draft = newDraft();
    showSavedConversation(record);
    const messages = root().querySelector(".rc-messages");
    if (messages) {
      const sentQuestion = allocationRequested && [...messages.querySelectorAll(".rc-question")].at(-1);
      if (sentQuestion) {
        const topPadding = parseFloat(getComputedStyle(messages).paddingTop);
        messages.scrollTop += sentQuestion.getBoundingClientRect().top - messages.getBoundingClientRect().top - topPadding;
      } else messages.scrollTop = messages.scrollHeight;
    }
    const input = root().querySelector("textarea");
    if (input) input.focus({preventScroll:true});
  }
  function portalButton(){
    if(document.documentElement.dataset.prototype==="v3")return "";
    const expanded=window.studyNavigation?.isPortalOpen() || false;
    return '<button type="button" class="portal-toggle" data-portal-toggle aria-controls="portal-catalog" aria-expanded="'+expanded+'">投研网站<i aria-hidden="true"></i></button>';
  }
  function sidebarToggle() {
    if (hasResourcePanel) return '<span class="rc-nav-spacer" aria-hidden="true"></span>';
    return '<button type="button" class="rc-thread-nav" data-action="nav" aria-label="切换侧边栏" title="切换侧边栏">'+asset("ai-sidebar-open.png")+'</button>';
  }
  function compactSwitch(target) {
    if (!hasResourcePanel || current.mode!=="page") return "";
    const isChat=target==="chat";
    return '<button type="button" class="rc-compact-switch" data-action="compact-'+target+'" aria-label="'+(isChat?"切换到AI对话":"切换到投研内容")+'">'+(isChat?"对话":"内容")+'</button>';
  }
  function researchHeaderTools() {
    return sidebarToggle()+
      (current.thread ? '<button type="button" data-action="compose" aria-label="发起新研究" title="发起新研究">'+asset("ai-compose.png")+'</button>' : "")+compactSwitch("content");
  }
  function resourceTrigger() {
    return '<button type="button" class="rc-resource-trigger" data-resource-trigger aria-label="资料" aria-controls="resource-panel" aria-expanded="false"><img width="18" height="18" src="./icons/ai-resources.png" alt="" draggable="false"></button>';
  }
  function paneTabsTrigger() {
    return '<button type="button" data-pane-tabs-trigger aria-label="新建标签页" aria-controls="pane-tabs-panel" aria-expanded="false"><span class="pane-tabs-icon" aria-hidden="true"><span data-pane-tabs-count data-empty>+</span></span></button>';
  }
  function toolbar() {
    return '<header class="rc-toolbar"><div class="rc-tool-start">'+researchHeaderTools()+'</div><strong class="rc-view-title">发起研究</strong><div class="rc-tool-end">'+(hasResourcePanel?resourceTrigger()+paneTabsTrigger():"")+portalButton()+'</div></header>';
  }
  function attachmentNames(message) {
    if (Array.isArray(message.attachments)) return message.attachments.filter(name=>typeof name==="string" && name.trim());
    // Early saves appended the file picker selection to the question itself.
    const marker=message.text.lastIndexOf(" 附件：");
    return marker<0 ? [] : message.text.slice(marker+4).split("、").map(name=>name.trim()).filter(Boolean);
  }
  function uploadIcon(name) {
    const ext=name.toLowerCase().split(".").at(-1);
    if (/^(png|jpe?g|gif|webp|avif|svg|heic|heif|bmp|tiff?)$/.test(ext)) return "image";
    if (/^(xlsx?|xlsm|csv|tsv|ods)$/.test(ext)) return "table";
    if (/^(pdf|docx?|rtf|txt|md|odt|pptx?)$/.test(ext)) return "document";
    return "file";
  }
  function resourceContext() {
    const files=[];
    for (const thread of threads.values()) {
      // The thread timestamp can date a legacy conversation, but never an individual file.
      const messageTimes=thread.messages.map(message=>{
        const time=Number(message.timestamp);
        return Number.isFinite(time) && time>0 ? time : 0;
      });
      const legacyActivityAt=Number.isFinite(thread.updatedAt) && thread.updatedAt>0 ? thread.updatedAt : 0;
      const threadActivityAt=messageTimes.reduce((latest,time)=>Math.max(latest,time),0) || legacyActivityAt;
      let question="";
      thread.messages.forEach((message,index)=>{
        const add=(kind,name,icon,anchor,slot=0)=>{
          const target="summary-"+anchor+"-"+index;
          files.push({id:JSON.stringify([thread.id,target,slot]),threadId:thread.id,threadTitle:thread.title,
            kind,name,icon,target,slot,messageIndex:index,timestamp:messageTimes[index],threadActivityAt});
        };
        if (message.role==="user") {
          question=message.text.split(" 附件：")[0].trim().replace(/[。？！?!]+$/,"");
          attachmentNames(message).forEach((name,i)=>add("upload",name,uploadIcon(name),"message",i));
        } else if (message.kind===allocationKind) {
          add("output",allocation.title,"document","report");
          add("output","100 万元资产配置表","table","table");
        } else if (message.kind==="fund-metric") {
          add("output",message.heading,"document","report");
          add("output",(metricLabels[message.metric] || "基金指标")+"对比表","table","table");
        } else if (message.text.trim() && !message.kind?.startsWith("clarify-") &&
          message.text!==sampleReply("") && !/^(当前原型的示例数据里没有|当前关联|在「.+」中，可以从这个问题开始|可以补充想分析的对象)/.test(message.text)) {
          const name=question || message.text.split(/[。\n]/)[0];
          add("output",name,"document","answer");
        }
      });
    }
    const thread=threads.get(current.thread);
    return {threadId:thread?.id || "",threadTitle:thread?.title || "",mode:current.mode,files};
  }
  function revealResource(target) {
    if (!target) return false;
    target.focus({preventScroll:true});
    target.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"});
    target.classList.remove("rc-summary-highlight");
    void target.offsetWidth;
    target.classList.add("rc-summary-highlight");
    return true;
  }
  function findResource(value) {
    const id=typeof value==="string" ? value : value?.id;
    return resourceContext().files.find(entry=>entry.id===id);
  }
  function renderResourceFile(host,value) {
    const file=findResource(value);
    if (!file) {
      host.replaceChildren();
      return false;
    }
    const message=threads.get(file.threadTitle).messages[file.messageIndex];
    const page=document.createElement("section");
    page.className="pt-file-detail";
    const heading=document.createElement("h1");
    heading.textContent=file.name;
    const source=document.createElement("header");
    const origin=document.createElement("span");
    origin.textContent=(file.kind==="upload" ? "我的上传" : "对话产出")+" · "+file.threadTitle;
    const open=document.createElement("button");
    open.type="button";
    open.textContent="查看来源对话";
    open.addEventListener("click",()=>window.studyResources.openFile(file));
    source.append(origin,open);
    page.append(heading,source);

    const isAllocation=message.kind===allocationKind;
    const isMetric=message.kind==="fund-metric" && Array.isArray(message.rows);
    if (isAllocation || isMetric) {
      const template=document.createElement("template");
      template.innerHTML=isAllocation ? allocationArticle(file.messageIndex) : metricArticle(message,file.messageIndex,"");
      // Source-chat anchors belong only to the conversation, including when both panes are visible.
      for (const anchor of template.content.querySelectorAll("[id]")) {
        anchor.removeAttribute("id");
        anchor.removeAttribute("tabindex");
      }
      if (file.icon==="table") {
        page.append(template.content.querySelector("table").parentElement);
        const note=document.createElement("small");
        note.textContent=isAllocation ? allocation.note : message.note;
        page.append(note);
      } else {
        if (isMetric) template.content.querySelector("h2").remove();
        page.append(template.content);
      }
    } else {
      if (file.kind==="upload") {
        const context=document.createElement("h2");
        context.textContent="上传时的对话";
        const note=document.createElement("p");
        note.className="pt-file-note";
        note.textContent="这条上传记录仅保存了文件名。";
        page.append(note,context);
      }
      const text=document.createElement("p");
      text.className="pt-file-text";
      text.textContent=file.kind==="output" && message.text===oldComparisonExample ? comparisonExample : message.text;
      page.append(text);
    }
    host.replaceChildren(page);
    return true;
  }
  function openResource(value) {
    const file=findResource(value);
    if (!file) return false;
    if (current.mode==="page") {
      document.getElementById("workspace").dataset.compactView="chat";
      if (current.thread!==file.threadTitle || current.maximized) {
        current.thread=file.threadTitle;
        current.maximized=false;
        syncMaximize();
        refreshPanel();
      }
    } else if (current.mode!=="chat" || current.thread!==file.threadTitle) {
      current={mode:"chat",thread:file.threadTitle};
      render();
      window.onStudyCreated?.(file.threadTitle,projectName(threads.get(file.threadTitle).project));
    }
    return revealResource(document.getElementById(file.target));
  }
  let resourceUpdateQueued=false;
  function resourcesChanged() {
    if (!hasResourcePanel || resourceUpdateQueued) return;
    resourceUpdateQueued=true;
    queueMicrotask(()=>{
      resourceUpdateQueued=false;
      window.dispatchEvent(new Event("study-resources-updated"));
    });
  }
  function summaryGroups(title) {
    const products = [], resources = [], skills = new Map();
    const messages = threads.get(title)?.messages || [];
    messages.forEach((message,index)=>{
      if (message.role==="ai" && message.kind===allocationKind) {
        products.push({name:allocation.title,icon:"document",target:"report-"+index},
          {name:"100 万元资产配置表",icon:"table",target:"table-"+index});
      }
      if (message.kind==="fund-metric") {
        products.push({name:metricLabels[message.metric]+"对比表",icon:"table",target:"table-"+index});
        const context=message.context;
        if (context && !resources.some(r=>r.name===context.page+" · "+context.period)) resources.push({name:context.page+" · "+context.period,icon:"source",target:"report-"+index});
      }
      if (message.role!=="user") return;
      attachmentNames(message).forEach(name=>
        resources.push({name,icon:"clip",target:"message-"+index}));
      const skill = message.task ?? tasks.find(task=>message.text.startsWith(taskPrompt(task)));
      if (tasks.includes(skill) && !skills.has(skill)) skills.set(skill,{name:skill,icon:"stack",target:"message-"+index});
    });
    return [
      {label:"对话产物",empty:"暂无对话产物",items:products},
      {label:"对话资源",empty:"暂无对话资源",items:resources},
      {label:"技能",empty:"暂未使用技能",items:[...skills.values()]}
    ];
  }
  function summaryControl(title) {
    if (!threads.get(title)?.messages.length) return "";
    const sections = summaryGroups(title).map(({label,empty,items})=>{
      const rows = items.map(({name,icon:glyph,target},i)=>
        '<button type="button" class="rc-summary-item" data-summary-target="'+target+'" title="'+esc(name)+'"'+(i>=5?' data-extra hidden':'')+'>'+
        icon(glyph)+'<span>'+esc(name)+'</span></button>').join("");
      const more = items.length>5 ? '<button type="button" class="rc-summary-more" data-action="summary-expand" aria-expanded="false">查看更多</button>' : '';
      return '<section><h3>'+label+'</h3>'+(rows || '<p>'+empty+'</p>')+more+'</section>';
    }).join("");
    return '<div class="rc-summary-wrap"><button type="button" data-action="summary" aria-label="对话摘要" title="对话摘要" aria-haspopup="dialog" aria-expanded="false" aria-controls="rc-summary">'+asset("ai-resources.png")+'</button>'+
      '<div class="rc-summary-panel" id="rc-summary" role="dialog" aria-labelledby="rc-summary-title" hidden><div class="rc-summary-head"><h2 id="rc-summary-title">对话摘要</h2><button type="button" data-action="summary-close" aria-label="关闭对话摘要">'+icon("close")+'</button></div><div class="rc-summary-body">'+sections+'</div></div></div>';
  }
  function closePopup(panel, restoreFocus) {
    panel.hidden=true;
    const trigger=panel.previousElementSibling;
    trigger.setAttribute("aria-expanded","false");
    if (restoreFocus) trigger.focus({preventScroll:true});
  }
  const openPopups = ".rc-tasks-menu:not([hidden]),.rc-summary-panel:not([hidden]),.rc-project-menu:not([hidden])";
  function dismissOutside(target) {
    root()?.querySelectorAll(openPopups).forEach(panel=>{
      if (!panel.contains(target) && !panel.previousElementSibling.contains(target)) closePopup(panel,false);
    });
  }
  function topicQuestions(topic) {
    return questions[topic].map(q => '<button type="button" data-fill="'+esc(q)+'">'+asset("5a035.svg")+'<span>'+esc(q)+'</span></button>').join("");
  }
  function guidance() {
    const categories = Object.keys(questions).map(topic=>'<button type="button" data-topic="'+esc(topic)+'" aria-pressed="'+(draft.topic===topic)+'">'+esc(topic)+'</button>').join("");
    return '<section class="rc-guidance" aria-label="试试这样问"><div class="rc-guidance-title">'+asset("540c7.svg")+'试试这样问</div><div class="rc-topics" aria-label="问题分类">'+categories+'</div><div class="rc-questions">'+topicQuestions(draft.topic)+'</div></section>';
  }
  function projectOptions() {
    const selected = projectName(current.thread ? threads.get(current.thread)?.project : draft.project);
    const choices = ["", ...projectNames()];
    return choices.map(name=>'<button type="button" data-project="'+esc(name)+'" aria-pressed="'+(selected===name)+'">'+esc(name || "独立会话")+'</button>').join("");
  }
  function projectPicker(menu) {
    menu.innerHTML = '<span class="rc-project-results">'+projectOptions()+'</span><button type="button" data-action="create-project">＋ 新建项目</button>';
    menu.hidden=false;
    menu.previousElementSibling.setAttribute("aria-expanded","true");
    menu.querySelector('[data-project][aria-pressed="true"]')?.focus({preventScroll:true});
  }
  function chooseProject(name) {
    const project=projectId(name);
    if (current.thread) {
      const entry = threads.get(current.thread);
      if (entry) {
        changeThreadProject(entry,project);
        saveConversations();
      }
    } else draft.project = project;
    window.dispatchEvent(new Event("study-projects-changed"));
    render();
    root().querySelector(current.thread ? '[data-action="chat-more"]' : ".rc-project-toggle")?.focus({preventScroll:true});
  }
  function createProject(menu) {
    if (hasResourcePanel && window.openNavNameDialog) {
      const opener=menu.previousElementSibling;
      closePopup(menu,false);
      window.openNavNameDialog(opener,{
        title:"新增项目",submitLabel:"创建",
        save:addProject,onSaved:chooseProject
      });
      return;
    }
    menu.innerHTML='<label class="rc-project-field">项目名称<input class="rc-project-name" aria-label="项目名称" type="text" maxlength="40" placeholder="输入项目名称"></label><span class="rc-project-error" role="status" hidden></span><span class="rc-project-actions"><button type="button" data-action="project-back">返回</button><button type="button" data-action="confirm-project">创建</button></span>';
    menu.querySelector("input").focus();
  }
  function validateProjectName(name) {
    if (!name) return "请输入项目名称";
    if (name.length>40) return "项目名称最多可输入 40 个字";
    if (projectId(name) || name==="独立会话") return "这个名称已被使用";
    return "";
  }
  function newRecordId() {
    return Array.from(crypto.getRandomValues(new Uint32Array(4))).join("-");
  }
  function addProject(name) {
    const error=validateProjectName(name);
    if (error) return error;
    projects.push({id:newRecordId(),name,pinOrder:0});
    saveProjects();
    return "";
  }
  function notifyProjectChanges(detail) {
    const host=root();
    const draftLabel=host?.querySelector(".rc-project-toggle span");
    if (draftLabel) draftLabel.textContent=projectName(draft.project) || "项目";
    const results=host?.querySelector(".rc-project-results");
    if (results) results.innerHTML=projectOptions();
    window.dispatchEvent(new CustomEvent("study-projects-changed",{detail}));
  }
  function confirmProject(menu) {
    const input=menu.querySelector(".rc-project-name");
    const name=input.value.trim();
    const error=menu.querySelector(".rc-project-error");
    const message=addProject(name);
    if (message) {
      error.textContent = message;
      error.hidden=false;
      input.focus();
      return;
    }
    chooseProject(name);
  }
  function chatMenuItems() {
    const pinned=window.studyChatActions.isPinned(current.thread);
    const items=[
      ["pin",pinned ? "取消置顶" : "置顶",asset("folder-pin.svg")],
      ["rename","重命名",asset("chat-rename.svg")],
      ["find","查找对话内容",icon("search")],
      ["move","移动到项目",asset("chat-move.svg")],
      ["continue","在新对话中继续",icon("branch")],
      ["delete","删除",asset("folder-delete.svg")]
    ];
    return items.map(([action,label,glyph])=>
      '<button type="button" data-chat-action="'+action+'">'+glyph+label+'</button>'
    ).join("");
  }
  function chatMore() {
    return '<span class="rc-project-wrap rc-chat-more"><button type="button" data-action="chat-more" aria-label="会话更多操作" title="更多操作" aria-expanded="false" aria-controls="rc-chat-actions">'+asset("ai-more.png")+'</button><span class="rc-project-menu" id="rc-chat-actions" role="group" aria-label="会话操作" hidden></span></span>';
  }
  function homeComposer() {
    const shortcuts = quickReferences(draft.task);
    const tag = taskChip();
    const editor = '<div class="rc-home-editor"><textarea aria-label="输入投研任务" placeholder="输入投研任务，或直接描述你想调用的技能..." maxlength="4000">'+esc(draft.text)+'</textarea>'+tag+'</div>';
    return '<form class="rc-composer rc-home-composer">'+fileTags(draft.attachments)+editor+'<div class="rc-home-tools"><div class="rc-entry-tools">'+fileControl()+'<span class="rc-tool-divider" aria-hidden="true">'+asset("9819c.svg")+'</span><span class="rc-project-wrap"><button class="rc-project-toggle" type="button" data-action="projects" aria-expanded="false">'+asset("4b790.svg")+'<span>'+esc(projectName(draft.project) || "项目")+'</span>'+asset("58d60.svg")+'</button><span class="rc-project-menu" hidden></span></span>'+shortcuts+'</div><button class="rc-send" type="submit" aria-label="发送问题" title="发送问题"'+(draft.text.trim()?'':' disabled')+'>'+asset("3a57d.svg")+icon("send")+'</button></div></form>';
  }
  function syncTaskChip(field) {
    const chip = field.parentElement.querySelector(".rc-inline-task");
    const task = activeDraft().task || "";
    chip.hidden = !task;
    chip.querySelector(".rc-task-name").textContent = task;
    chip.querySelector("button").setAttribute("aria-label", "移除"+task+"快捷分析");
    field.style.textIndent = task ? (chip.offsetWidth + 5)+"px" : "";
    chip.style.transform = "translateY("+(-field.scrollTop)+"px)";
  }
  function homeContent() {
    return toolbar()+'<div class="rc-welcome"><div class="rc-welcome-inner"><header class="rc-greeting"><img class="rc-research-sail" src="./icons/research-sail.svg?entry='+welcomeEntry+'" alt="" draggable="false" width="1600" height="400"><h1>开始你的投资研究～</h1><p class="rc-intro">- 可以比较基金表现、分析组合持仓，或聊聊你关注的市场变化。 -</p></header>'+homeComposer()+guidance()+'</div></div>';
  }
  function chatContent(title) {
    const conversation=threads.get(title);
    const hasAllocation=conversation?.messages.some(message=>message.kind===allocationKind);
    const actions=(hasResourcePanel ? chatMore()+resourceTrigger()+paneTabsTrigger() : summaryControl(title)+chatMore())+portalButton();
    const header='<header class="rc-thread-head"><div class="rc-content-head">'+researchHeaderTools()+'</div><strong class="rc-view-title" title="'+esc(title)+'">'+esc(title)+'</strong><div class="rc-thread-actions">'+actions+'</div></header>';
    const messages=history(title);
    return '<div class="rc-thread'+(hasAllocation?' rc-thread-allocation':'')+'">'+header+'<div class="rc-messages">'+messages+'</div><div class="rc-compose-foot">'+composer()+'</div></div>';
  }
  function researchContent() {
    return current.thread ? chatContent(current.thread) : homeContent();
  }
  function rows(funds, range) {
    return funds.map(f=>'<tr><td>'+esc(f.name)+'</td><td>'+esc(f.type)+'</td><td class="rc-num rc-positive">'+f[range]+'</td><td class="rc-num rc-negative">'+f.risk+'</td></tr>').join("");
  }
  function fundTable(kind) {
    const compare=kind==="基金比较", filter=kind==="基金筛选";
    const filters = filter ? '<div class="rc-filters"><label>基金类型 <select data-control="type"><option>全部类型</option><option>混合型</option><option>股票型</option></select></label></div>':'';
    const controls = compare?'<select data-control="range" aria-label="收益区间"><option value="year">近1年</option><option value="three">近3年</option></select>':'';
    return '<section class="rc-data-box">'+filters+'<div class="rc-box-head"><h3>'+(compare?'收益与风险比较':'筛选结果')+'</h3>'+controls+'</div><div class="rc-table-wrap"><table><thead><tr><th>基金名称</th><th>类型</th><th class="rc-num" data-return>近1年收益</th><th class="rc-num">近1年最大回撤</th></tr></thead><tbody>'+rows(records,"year")+'</tbody></table></div></section>';
  }
  function detail() {
    return '<section class="rc-data-box"><div class="rc-box-head"><h3>均衡精选混合</h3><span class="rc-meta">混合型</span></div><div class="rc-metrics"><div><span>近1年收益</span><b class="rc-positive">8.26%</b></div><div><span>近1年最大回撤</span><b class="rc-negative">−6.43%</b></div><div><span>基金规模</span><b>12.80<small> 亿元</small></b></div></div></section>';
  }
  function secondaryContent(page) {
    if (page==="基金比较" || page==="基金筛选") return fundTable(page);
    if (page==="基金分析") return detail();
    if (/基金池/.test(page)) return '<section class="rc-data-box"><div class="rc-box-head"><h3>池内基金</h3><span class="rc-meta">3 只</span></div><div class="rc-table-wrap"><table><thead><tr><th>基金名称</th><th>类型</th><th class="rc-num">近1年收益</th><th class="rc-num">近1年最大回撤</th></tr></thead><tbody>'+rows(records,"year")+'</tbody></table></div></section>';
    const summaries={"研究方法库":["收益与风险分析","基金持仓分析","同类基金比较"],"定时任务":["每周基金表现回顾","月度持仓复盘"]};
    if (summaries[page]) return '<section class="rc-data-box"><div class="rc-box-head"><h3>'+(page==="研究方法库"?'研究方法':'任务清单')+'</h3></div>'+summaries[page].map(x=>'<div class="rc-list-row">'+esc(x)+'</div>').join("")+'</section>';
    return '<section class="rc-placeholder"><div>'+icon("chart")+'</div><h3>'+esc(page)+'</h3><p>已打开此功能的原型页面。</p></section>';
  }
  function businessContent() {
    const doc=spaces.get(current.page).active;
    if (doc.fund) return fundOverview(doc.fund);
    if (doc.comparison) return doc.comparison.render();
    if(current.page==="基金比较" && window.fundComparison) return window.fundComparison.render();
    if(window.studyFundsPages?.supports(current.page)) return window.studyFundsPages.render(current.page);
    return '<div class="rc-generic-page"><div class="rc-meta rc-demo">示例数据</div>'+secondaryContent(current.page)+'</div>';
  }
  function utilityContent() {
    const title=esc(current.page);
    const scheduled=current.page==="定时任务";
    const back='<button type="button" class="rc-return-research" data-action="return-research">返回'+(current.thread?'对话':'研究')+'</button>';
    const heading=scheduled ? '<h1 class="rc-view-title">'+title+'</h1>' : '<div data-method-tabs></div>';
    const action=scheduled ? '<button type="button" class="rc-task-new" data-action="create-scheduled-task"><span aria-hidden="true">＋</span> 新建</button>' : back;
    return '<section class="rc-utility" aria-label="'+title+'"><header class="rc-toolbar">'+
      '<div class="rc-tool-start">'+sidebarToggle()+(scheduled?back:'')+'</div>'+heading+action+'</header>'+
      '<div class="rc-business-body"></div></section>';
  }
  function pageContent() {
    const space = spaces.get(current.page);
    const tabs = window.studyWorkspaceTabs.header(current.page,space.tabs,space.active.id);
    const panel = space.tabs.length ? ' role="tabpanel" aria-label="'+esc(space.active.label)+'"' : '';
    const close='<button type="button" class="rc-feature-close" data-action="close-feature" aria-label="关闭功能页" title="关闭功能页">'+icon("close")+'</button>';
    const maximize='<button type="button" data-action="maximize" aria-label="放大功能页" title="放大功能页">'+paneSizeIcon(false)+'</button>';
    return '<div class="rc-business"><aside id="rc-page-assistant" class="rc-business-assistant" aria-label="AI 对话"></aside>'+
      '<section id="rc-function-pane" class="rc-business-page" aria-label="'+esc(current.page)+'功能页"><header class="rc-function-head">'+tabs+'<div class="rc-function-actions">'+portalButton()+compactSwitch("chat")+maximize+close+'</div></header>'+
      '<div class="rc-business-body" id="rc-feature-panel"'+panel+'>'+businessContent()+'</div></section>'+
      '<div class="pane-divider" data-resize="function" role="separator" tabindex="0" aria-orientation="vertical" aria-controls="rc-function-pane" aria-label="调整功能页宽度" aria-valuemin="480" aria-valuemax="944" aria-valuenow="584" title="拖动调整功能页宽度，双击恢复默认"></div></div>';
  }
  function fundOverview(fund) {
    const period = fund.period || "近1年";
    const stats = [["区间收益",fund.performance],["区间最大回撤",fund.drawdown],["日涨跌幅",fund.daily],["年化波动率",fund.volatility]];
    const metrics = stats.filter(([,v])=>Number.isFinite(v)).map(([name,value])=>{
      const sign=value>0?"+":value<0?"−":"";
      const cls = name==="年化波动率" ? "" : value>0?"rc-positive":value<0?"rc-negative":"";
      return '<div><span>'+name+'</span><b class="'+cls+'">'+(name==="年化波动率"?"":sign)+Math.abs(value).toFixed(2)+'%</b></div>';
    });
    const info=[["基金代码",fund.id],["基金类型",fund.type],["比较基准",fund.benchmark],["基金规模",Number.isFinite(fund.size)?fund.size.toFixed(2)+" 亿元":""]];
    const rows=info.filter(([,v])=>v).map(([k,v])=>'<tr><th scope="row">'+k+'</th><td>'+esc(v)+'</td></tr>').join("");
    const interval=fund.start&&fund.end?fund.start+" 至 "+fund.end:period;
    return '<article class="rc-generic-page rc-fund-detail"><header><h2>'+esc(fund.name)+'</h2><span class="rc-meta">'+esc(fund.id)+'　'+esc(fund.type||"")+'</span></header>'+
      '<section class="rc-data-box"><div class="rc-box-head"><h3>收益与风险</h3><span class="rc-meta">'+esc(interval)+'</span></div><div class="rc-metrics">'+metrics.join("")+'</div></section>'+
      '<section class="rc-data-box"><div class="rc-box-head"><h3>基本信息</h3></div><table><tbody>'+rows+'</tbody></table></section><small class="rc-meta">交互示例数据</small></article>';
  }
  const shortcutObserver = new ResizeObserver(entries=>{
    const refs=entries[0]?.target.closest("form")?.querySelector(".rc-quick");
    if (refs?.isConnected) fitQuickReferences(refs);
  });
  function fitQuickReferences(refs) {
    const form=refs.closest("form");
    const list=refs.querySelector(".rc-quick-list");
    const available=refs.getBoundingClientRect().width;
    let layout="inline";
    const paneWidth=form.closest("#rc-page-assistant")?.clientWidth || root().clientWidth;
    if(paneWidth<400 || available<50) layout="hidden";
    else if(paneWidth<600 || list.getBoundingClientRect().width>available) layout="more";
    if(refs.dataset.layout===layout) return;
    const hadFocus=refs.contains(document.activeElement);
    const menu=refs.querySelector(".rc-tasks-menu");
    if(!menu.hidden) closePopup(menu,false);
    refs.dataset.layout=layout;
    if(hadFocus){
      const next=layout==="inline" ? list.querySelector("button") :
        layout==="more" ? menu.previousElementSibling : form.querySelector("textarea");
      next.focus({preventScroll:true});
    }
  }
  function initEditors(host) {
    shortcutObserver.disconnect();
    const refs=host.querySelector(".rc-quick");
    if(refs){
      fitQuickReferences(refs);
      shortcutObserver.observe(refs);
      shortcutObserver.observe(refs.querySelector(".rc-quick-list"));
      shortcutObserver.observe(refs.closest("form"));
    }
    host.querySelectorAll(".rc-home-editor textarea").forEach(field=>{
      syncTaskChip(field);
      const chip=field.nextElementSibling;
      field.onscroll=()=>{chip.style.transform="translateY("+(-field.scrollTop)+"px)";};
    });
  }
  function openConversationSearch() {
    const thread = root().querySelector(".rc-thread");
    const messages = thread?.querySelector(".rc-messages");
    if (!messages) return;
    const existing = thread.querySelector(".rc-conversation-search input");
    if (existing) {
      existing.focus();
      return;
    }

    const bar = document.createElement("div");
    bar.className = "rc-conversation-search";
    bar.setAttribute("role", "search");
    bar.setAttribute("aria-label", "查找对话内容");
    bar.innerHTML = '<input type="search" aria-label="查找对话内容" placeholder="查找对话内容"><span role="status"></span>' +
      '<button type="button" data-find="previous" aria-label="上一个匹配" disabled>'+icon("right")+'</button>' +
      '<button type="button" data-find="next" aria-label="下一个匹配" disabled>'+icon("right")+'</button>' +
      '<button type="button" data-find="close" aria-label="关闭查找">'+icon("close")+'</button>';
    messages.before(bar);

    const field = bar.querySelector("input");
    const status = bar.querySelector('[role="status"]');
    let matches = [];
    let active = 0;
    function clearMatches() {
      for (const mark of matches) {
        const parent = mark.parentNode;
        mark.replaceWith(document.createTextNode(mark.textContent));
        parent.normalize();
      }
      matches = [];
      active = 0;
    }
    function showMatch(index) {
      if (matches.length) {
        matches[active].removeAttribute("aria-current");
        active = (index + matches.length) % matches.length;
        matches[active].setAttribute("aria-current", "true");
        matches[active].scrollIntoView({block:"nearest", inline:"nearest"});
        status.textContent = (active + 1) + " / " + matches.length;
      } else {
        status.textContent = field.value.trim() ? "未找到匹配" : "";
      }
      for (const button of bar.querySelectorAll('[data-find="previous"],[data-find="next"]')) {
        button.disabled = matches.length < 2;
      }
    }
    field.oninput = () => {
      clearMatches();
      const query = field.value.trim();
      if (query) {
        const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu");
        const walker = document.createTreeWalker(messages, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (node.parentElement.closest(".rc-question, article") && !node.parentElement.closest("button,.rc-answer-name")) textNodes.push(node);
        }
        for (const node of textNodes) {
          const fragment = document.createDocumentFragment();
          let offset = 0;
          for (const hit of node.data.matchAll(pattern)) {
            const mark = document.createElement("mark");
            mark.className = "rc-find-match";
            mark.textContent = hit[0];
            fragment.append(node.data.slice(offset, hit.index), mark);
            matches.push(mark);
            offset = hit.index + hit[0].length;
          }
          if (offset) {
            fragment.append(node.data.slice(offset));
            node.replaceWith(fragment);
          }
        }
      }
      showMatch(0);
    };
    bar.onclick = event => {
      const action = event.target.closest("button")?.dataset.find;
      if (action === "previous") showMatch(active - 1);
      if (action === "next") showMatch(active + 1);
      if (action === "close") {
        clearMatches();
        bar.remove();
        thread.querySelector('[data-action="chat-more"]')?.focus({preventScroll:true});
      }
    };
    field.focus();
  }
  function initResearchView(view) {
    initEditors(view);
    const area=view.querySelector(".rc-messages");
    if(area && current.thread){
      const key=threads.get(current.thread)?.id;
      area.scrollTop=chatScroll.get(key)||0;
      area.onscroll=()=>chatScroll.set(key,area.scrollTop);
    }
  }
  function refreshPanel() {
    const panel=root().querySelector("#rc-page-assistant");
    if(!panel)return;
    panel.hidden=!!current.maximized;
    panel.dataset.thread=current.thread || "";
    panel.innerHTML=panel.hidden ? "" : researchContent();
    if(!panel.hidden)initResearchView(panel);
    window.studyPaneResize?.sync();
    window.studyNavigation?.syncPortal();
    resourcesChanged();
  }
  function openAssistant() {
    if(current.mode!=="page")return;
    current.maximized=false;
    syncMaximize();refreshPanel();
    root().querySelector('#rc-page-assistant textarea')?.focus({preventScroll:true});
  }
  function syncMaximize() {
    const active=current.mode==="page" && !!current.maximized;
    window.studyNavigation.setFunctionExpanded(active);
    const btn=root().querySelector('.rc-function-head [data-action="maximize"]');
    if(!btn) return;
    btn.setAttribute("aria-pressed",String(active));
    btn.title=active?"还原功能页":"放大功能页";
    btn.setAttribute("aria-label",btn.title);
    btn.innerHTML=paneSizeIcon(active);
  }
  function restoreFunction(){
    if(current.mode!=="page" || !current.maximized)return;
    current.maximized=false;
    syncMaximize();
    refreshPanel();
    root().querySelector('.rc-function-head [data-action="maximize"]')?.focus({preventScroll:true});
  }
  function render() {
    const host = root();
    if (!host) return;
    spaces.saveScroll(renderedDocument,host.querySelector(".rc-business-body"));
    const nextDocument=current.mode==="page" ? spaces.get(current.page).active : null;
    const previousPanel=host.querySelector("#rc-page-assistant");
    // Navigating between tools or documents should leave the user's working draft in place.
    const keepResearch=previousPanel && !previousPanel.hidden && nextDocument && nextDocument!==renderedDocument &&
      previousPanel.dataset.thread===(current.thread || "") && !current.maximized;
    renderedDocument=nextDocument;
    window.dispatchEvent(new CustomEvent("study-view", {detail:current.mode+":"+(current.page || current.thread || "")}));
    host.innerHTML=nextDocument ? pageContent() : current.mode==="utility" ? utilityContent() : researchContent();
    syncMaximize();
    if(nextDocument){
      const body=host.querySelector(".rc-business-body");
      if(renderedDocument.comparison) renderedDocument.comparison.bind(body);
      else if(!renderedDocument.fund){
        if(current.page==="基金比较") window.fundComparison?.bind(body);
        else if(window.studyFundsPages?.supports(current.page)) window.studyFundsPages.bind(body,current.page);
      }
      if(keepResearch){
        host.querySelector("#rc-page-assistant").replaceWith(previousPanel);
        initEditors(previousPanel);
        window.studyPaneResize?.sync();
      } else refreshPanel();
      spaces.restoreScroll(renderedDocument,body);
      window.studyWorkspaceTabs.sync(host.querySelector(".rc-function-head"));
    } else if(current.mode==="utility") {
      const page=current.page==="定时任务" ? window.studyScheduledTasks : window.studyMethodLibrary;
      page.mount(host.querySelector(".rc-business-body"));
    } else initResearchView(host);
    window.studyNavigation?.syncPortal();
    resourcesChanged();
    host.onclick = (event)=>{
      const el = event.target.closest("button");
      if (!el || el.closest(".rc-business-body")) return;
      const action = el.dataset.action;
      if(el.hasAttribute("data-answer-tool")){
        const answer=threads.get(current.thread)?.messages[Number(el.dataset.answerTool)];
        const target=answerTool(answer);
        if(target)window.studyNavigation.openResearchTool(target);
        return;
      }
      if(el.hasAttribute("data-workspace-tab") || el.hasAttribute("data-workspace-close")){
        const space=spaces.get(current.page);
        const changed=el.hasAttribute("data-workspace-close") ? spaces.close(space,el.dataset.workspaceClose) : spaces.activate(space,el.dataset.workspaceTab);
        if(changed) showWorkspaceDocument();
        return;
      }
      if(action==="close-feature")return window.studyNavigation.closeFeature();
      if(action==="create-scheduled-task")return window.studyScheduledTasks.create(el);
      if(action==="return-research"){
        window.studyNavigation.closeFeature({background:true});
        host.focus({preventScroll:true});
        return;
      }
      if(action==="compact-chat" || action==="compact-content"){
        const workspace=document.getElementById("workspace");
        workspace.dataset.compactView=action==="compact-chat"?"chat":"content";
        window.studyPaneResize?.sync();
        const focusTarget=workspace.querySelector(action==="compact-chat"?"#rc-page-assistant textarea":"#rc-function-pane [data-action='compact-chat']");
        focusTarget?.focus({preventScroll:true});
        return;
      }
      if(action==="maximize"){current.maximized=!current.maximized;document.getElementById("workspace").dataset.compactView="content";syncMaximize();refreshPanel();return;}
      if(action==="extra-tasks"){
        const menu=el.nextElementSibling;
        if(!menu.hidden) closePopup(menu,true);
        else {
          dismissOutside(el);
          menu.hidden=false;
          el.setAttribute("aria-expanded","true");
          const anchor=el.getBoundingClientRect(), box=el.closest("form").getBoundingClientRect();
          menu.style.left=Math.min(0,box.right-8-anchor.left-menu.offsetWidth)+"px";
          menu.toggleAttribute("data-below",anchor.top-8<menu.offsetHeight && innerHeight-anchor.bottom>anchor.top);
          (menu.querySelector('[aria-pressed="true"]') || menu.querySelector("button")).focus({preventScroll:true});
        }
        return;
      }
      if (action==="nav") window.dispatchEvent(new Event("study-toggle-navigation"));
      if (action==="summary") {
        dismissOutside(el);
        const panel=el.nextElementSibling;
        if (!panel.hidden) closePopup(panel,true);
        else {
          panel.hidden=false;
          el.setAttribute("aria-expanded","true");
          panel.querySelector('[data-action="summary-close"]').focus({preventScroll:true});
        }
      }
      if (action==="summary-close") closePopup(el.closest(".rc-summary-panel"),true);
      if (action==="summary-expand") {
        const expanded=el.getAttribute("aria-expanded")==="true";
        el.parentElement.querySelectorAll("[data-extra]").forEach(row=>row.hidden=expanded);
        el.setAttribute("aria-expanded",String(!expanded));
        el.textContent=expanded?"查看更多":"收起";
      }
      if (el.dataset.summaryTarget) {
        const target=document.getElementById("summary-"+el.dataset.summaryTarget);
        closePopup(el.closest(".rc-summary-panel"),!target);
        revealResource(target);
      }
      if(action==="compose"){
        if(current.mode!=="page")return window.studyNavigation.newStudy();
        current.thread="";
        welcomeEntry++;
        draft=newDraft();
        refreshPanel();
        host.querySelector("#rc-page-assistant textarea")?.focus({preventScroll:true});
        return;
      }
      if (action==="projects" || action==="chat-more") {
        const menu=el.nextElementSibling;
        if (!menu.hidden) closePopup(menu,true);
        else if (action==="projects") projectPicker(menu);
        else {
          dismissOutside(el);
          menu.innerHTML=chatMenuItems();
          menu.hidden=false;
          el.setAttribute("aria-expanded","true");
          menu.querySelector("button").focus({preventScroll:true});
        }
        return;
      }
      if (el.dataset.chatAction) {
        const menu=el.closest(".rc-project-menu");
        const command=el.dataset.chatAction;
        if (command==="move") return projectPicker(menu);
        const trigger=menu.previousElementSibling;
        closePopup(menu,true);
        if (command==="find") return openConversationSearch();
        if (command==="continue") return continueInNewConversation();
        return window.studyChatActions.run(command,current.thread,trigger);
      }
      if (action==="project-back") projectPicker(el.closest(".rc-project-menu"));
      if (action==="create-project") createProject(el.closest(".rc-project-menu"));
      if (action==="confirm-project") confirmProject(el.closest(".rc-project-menu"));
      if (action==="attach") el.closest("form").querySelector(".rc-file-input").click();
      if (el.hasAttribute("data-project")) chooseProject(el.dataset.project);
      if (el.hasAttribute("data-remove-file")) {
        activeDraft().attachments.splice(Number(el.dataset.removeFile),1);
        refreshFiles(el.closest("form"));
      }
      if (el.dataset.topic) {
        draft.topic = el.dataset.topic;
        host.querySelectorAll("[data-topic]").forEach(tab=>tab.setAttribute("aria-pressed",String(tab===el)));
        host.querySelector(".rc-questions").innerHTML = topicQuestions(draft.topic);
      }
      if (el.dataset.fill || el.dataset.task || action==="remove-task") {
        const field = el.closest("form")?.querySelector("textarea")||host.querySelector(".rc-composer textarea");
        const state=activeDraft();
        const menu=el.closest(".rc-tasks-menu");
        if(menu) closePopup(menu,false);
        if (action==="remove-task") {
          const prefix = taskPrompt(state.task);
          if (field.value.startsWith(prefix)) field.value = field.value.slice(prefix.length);
        } else {
          field.value = el.dataset.fill || taskPrompt(el.dataset.task);
        }
        state.task = el.dataset.task || "";
        field.scrollTop = 0;
        syncTaskChip(field);
        field.dispatchEvent(new Event("input", {bubbles:true}));
        field.focus({preventScroll:true});
        field.setSelectionRange(field.value.length, field.value.length);
      }
      if (el.dataset.follow) {
        const field = host.querySelector(".rc-follow-composer textarea");
        const suggestion = el.dataset.follow;
        if (!field.value.includes(suggestion)) field.value = [field.value.trimEnd(),suggestion].filter(Boolean).join("\n");
        field.dispatchEvent(new Event("input",{bubbles:true}));
        field.focus();
        field.setSelectionRange(field.value.length,field.value.length);
      }
    };
    host.onsubmit = (event)=>{
      const form = event.target.closest(".rc-composer");
      if (!form) return;
      event.preventDefault();
      submitQuestion(form);
    };
    host.onkeydown=(event)=>{
      if (event.key==="Enter" && event.target.matches("input.rc-project-name") && !event.isComposing && event.keyCode!==229) {
        event.preventDefault();
        const menu=event.target.closest(".rc-project-menu");
        confirmProject(menu);
        return;
      }
      if (event.key==="Escape") {
        const menu = host.querySelector(openPopups);
        if (menu) {
          closePopup(menu,true);
          event.preventDefault();event.stopPropagation();return;
        }
      }
    };
    host.oninput=(event)=>{
      if (!event.target.matches(".rc-composer textarea")) return;
      const field = event.target;
      field.form.querySelector(".rc-send").disabled=!field.value.trim();
      activeDraft().text = field.value;
      const state=activeDraft();
      if (!field.value.trim() && state.task) {
        state.task = "";
        syncTaskChip(field);
      }
      for (const button of field.form.querySelectorAll("[data-task]")) {
        button.setAttribute("aria-pressed", String(button.dataset.task === state.task));
      }
    };
    host.onchange=(event)=>{
      if (event.target.matches(".rc-file-input")) {
        const pending = activeDraft();
        pending.attachments = [...new Set([...pending.attachments, ...Array.from(event.target.files,f=>f.name)])];
        event.target.value = "";
        refreshFiles(event.target.form);
        return;
      }
      const box=event.target.closest(".rc-business-body .rc-data-box");
      const mode=event.target.dataset.control;
      if(!box || !mode)return;
      const value=event.target.value;
      if(mode==="range"){
        box.querySelector("[data-return]").textContent=value==="three"?"近3年收益":"近1年收益";
        box.querySelector("tbody").innerHTML=rows(records,value);
      } else if(mode==="type")box.querySelector("tbody").innerHTML=rows(records.filter(f=>value==="全部类型"||f.type===value),"year");
    };
  }
  function refreshFiles(form) {
    const {attachments} = activeDraft();
    const tags = form.querySelector(".rc-file-tags");
    tags.innerHTML = fileNames(attachments);
    tags.hidden = !attachments.length;
    form.querySelector("textarea").focus();
  }
  function submitQuestion(form) {
    const text = form.querySelector("textarea").value.trim();
    if (!text) return;
    const {attachments,task=""} = activeDraft();
    const parts = [text, attachments.length && "附件："+attachments.join("、")];
    if (current.thread) followDrafts.delete(followKey());
    respond(parts.filter(Boolean).join(" "),attachments,task);
  }
  document.addEventListener("pointerdown", event=>dismissOutside(event.target));
  document.addEventListener("focusin", event=>{
    const panel=root()?.querySelector(".rc-summary-panel:not([hidden])");
    if (panel && !panel.parentElement.contains(event.target)) closePopup(panel,false);
  });
  function showWorkspaceDocument(){
    render();
    window.studyWorkspaceTabs.sync(root().querySelector(".rc-function-head"),true);
  }
  window.addEventListener("study-open-fund",event=>{
    if(current.mode==="page" && spaces.openFund(spaces.get(current.page),event.detail)) showWorkspaceDocument();
  });
  window.addEventListener("study-compare-funds",event=>{
    if(current.mode==="page" && spaces.compare(spaces.get(current.page),event.detail?.funds)) showWorkspaceDocument();
  });
  window.addEventListener("study-request-analysis",event=>{
    const ctx=event.detail;
    if(current.mode!=="page" || ctx?.page!==current.page || !ctx.funds?.length) return;
    openAssistant();
    const subject=ctx.funds.length===1?ctx.funds[0].name:"所选的 "+ctx.funds.length+(ctx.page==="指数行情"?" 个指数":" 只基金");
    respond("分析"+subject+"的区间收益。",[],"",ctx);
    // On small screens the feature fills the workspace; bring the answer into view.
    if(root().clientWidth<760)document.getElementById("workspace").dataset.compactView="chat";
  });
  function changeThreadProject(thread,id) {
    if (thread.project===id) return;
    if (!projectName(thread.project)) thread.inRecent=true;
    thread.project=id;
    thread.folderPin=0;
  }
  const inRecent = thread => !!(thread.updatedAt || thread.inRecent || !projectName(thread.project));
  function sortedChatTitles(items,key) {
    return items.sort((a,b)=>(b[key] || 0)-(a[key] || 0) || b.updatedAt-a.updatedAt).map(thread=>thread.title);
  }
  function updateActiveThread(oldTitle,newTitle) {
    if (!oldTitle || current.thread!==oldTitle || oldTitle===newTitle) return;
    current.thread=newTitle;
    if (!newTitle) {
      draft=newDraft();
      if (current.mode==="chat") current={mode:"home"};
    }
    if (current.mode==="page") refreshPanel();
    else render();
  }
  function clearChatState(thread) {
    followDrafts.delete("chat:"+thread.id);
    chatScroll.delete(thread.id);
  }
  function refreshThreadViews(detail) {
    if (detail) updateActiveThread(detail.oldTitle,detail.newTitle);
    notifyProjectChanges(detail);
    resourcesChanged();
  }
  function commitThreadChange(detail) {
    saveConversations();
    refreshThreadViews(detail);
    return "";
  }
  function applyConversations(next) {
    const previous=threads;
    const active=previous.get(current.thread);
    threads=next;
    const titlesById=new Map([...threads.values()].map(thread=>[thread.id,thread.title]));
    for (const thread of previous.values()) {
      if (!titlesById.has(thread.id)) clearChatState(thread);
    }
    const title=active && titlesById.get(active.id) || "";
    refreshThreadViews(active && active.title!==title ? {oldTitle:active.title,newTitle:title} : undefined);
  }
  const taskRunDate = new Intl.DateTimeFormat("zh-CN",{timeZone:"Asia/Shanghai",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
  const taskThreadId = id => "scheduled-task:"+id;
  function taskChatTitle(id) {
    return [...threads.values()].find(thread=>thread.id===taskThreadId(id))?.title || "";
  }
  function runScheduledTask(task,{slot,at}) {
    const projectList=loadProjects();
    const next=loadConversations(projectList);
    let record=[...next.values()].find(thread=>thread.id===taskThreadId(task.id));
    if (record?.messages.some(message=>message.taskSlot===slot)) return "";
    const base="定时任务："+task.title;
    const projectExists=!task.projectId || projectList.some(project=>project.id===task.projectId);
    if (!projectExists) return "所属项目已删除，请编辑任务并重新选择项目";
    if (!record) {
      record={id:taskThreadId(task.id),title:uniqueTitle(base,next),page:"",messages:[],inRecent:true,folderPin:0,recentPin:0,project:task.projectId || ""};
      record.taskTitle=task.title;
      record.taskProjectId=record.project;
      next.set(record.title,record);
    } else {
      if (record.taskTitle && record.taskTitle!==task.title && record.title==="定时任务："+record.taskTitle) {
        next.delete(record.title);
        record.title=uniqueTitle(base,next);
        next.set(record.title,record);
      }
      if (record.taskProjectId!==undefined && record.taskProjectId!==task.projectId) {
        record.project=task.projectId || "";
        record.folderPin=0;
      }
      record.taskTitle=task.title;
      record.taskProjectId=task.projectId || "";
    }
    const answer=researchAnswer(task.instruction,record);
    record.updatedAt=at;
    record.messages.push({role:"user",text:task.instruction,taskSlot:slot,timestamp:at},{...answer,timestamp:at});
    if (!saveItems(storageKey,next.values())) return "执行记录保存失败，请重试";
    projects=projectList;
    applyConversations(next);
    if (record.title===current.thread) {
      if (current.mode==="chat") render();
      else if (current.mode==="page") refreshPanel();
    }
    return "";
  }
  window.addEventListener("storage", event => {
    if (event.key!==projectStorage && event.key!==storageKey) return;
    projects=loadProjects();
    if (draft.project && !projectName(draft.project)) draft.project="";
    if (event.key===storageKey) applyConversations(loadConversations());
    else notifyProjectChanges();
  });
  window.researchCanvas={
    paneSizeIcon,
    resourceContext,
    renderResourceFile,
    openResource,
    restoreFunction,
    openAssistant,
    openAllocationExample(){
      const found=[...threads.values()].find(t=>!t.page && t.messages[0]?.text===allocation.question && t.messages[1]?.kind===allocationKind);
      if(found){
        current={mode:"chat",thread:found.title};render();
        window.onStudyCreated?.(found.title,projectName(found.project));
        return found.title;
      }
      current={mode:"compose"};draft=newDraft();respond(allocation.question,[],"");
      return current.thread;
    },
    projectChatTitles(name) {
      const id=projectId(name);
      return id ? sortedChatTitles([...threads.values()].filter(item=>item.project===id),"folderPin") : [];
    },
    isChatPinned(title,recent=false) {
      const thread=threads.get(title);
      if (!thread) return false;
      return recent ? !!thread.recentPin : !!thread.folderPin && !!projectName(thread.project);
    },
    toggleChatPin(title,recent=false) {
      const entry=threads.get(title);
      if (!entry) return "聊天不存在";
      if (recent && !inRecent(entry)) return "聊天不在最近列表中";
      if (!recent && !projectName(entry.project)) return "聊天不在项目中";
      const key=recent ? "recentPin" : "folderPin";
      const latest=[...threads.values()].reduce((max,thread)=>Math.max(max,thread[key] || 0),0);
      entry[key]=entry[key] ? 0 : latest+1;
      return commitThreadChange();
    },
    renameChat(oldTitle,value) {
      const entry=threads.get(oldTitle);
      if (!entry) return "聊天不存在";
      const newTitle=value.trim();
      if (!newTitle) return "请输入聊天名称";
      if (newTitle===oldTitle) return "";
      if (newTitle.length>80) return "聊天名称最多可输入 80 个字";
      if (threads.has(newTitle)) return "这个名称已被使用";
      entry.title=newTitle;
      threads=new Map([...threads.values()].map(item=>[item.title,item]));
      return commitThreadChange({oldTitle,newTitle});
    },
    moveChatToProject(title,name) {
      const entry=threads.get(title);
      if (!entry) return "聊天不存在";
      const id=projectId(name);
      if (name && !id) return "项目不存在";
      if (entry.project===id) return "";
      changeThreadProject(entry,id);
      return commitThreadChange();
    },
    deleteChat(title) {
      const entry=threads.get(title);
      if (!entry) return "聊天不存在";
      threads.delete(title);
      clearChatState(entry);
      return commitThreadChange({oldTitle:title,newTitle:""});
    },
    projectNames,
    isProjectPinned(name) {return !!projects.find(item=>item.name===name)?.pinOrder;},
    toggleProjectPin(name) {
      const item=projects.find(project=>project.name===name);
      if (!item) return;
      item.pinOrder=item.pinOrder ? 0 : Math.max(0,...projects.map(project=>project.pinOrder))+1;
      saveProjects();
      notifyProjectChanges();
    },
    renameProject(oldName,newName) {
      const item=projects.find(project=>project.name===oldName);
      if (!item) return "项目不存在";
      const name=newName.trim();
      if (name===oldName) return "";
      const error=validateProjectName(name);
      if (error) return error;
      item.name=name;
      saveProjects();
      notifyProjectChanges();
      return "";
    },
    deleteProject(name) {
      const id=projectId(name);
      // Confirm against current membership: a different tab may have moved a
      // chat while the confirmation dialog was open.
      const savedProjects=loadProjects();
      if (!id || !savedProjects.some(project=>project.id===id && project.name===name)) return "项目不存在";
      const savedThreads=loadConversations(savedProjects);
      const remainingProjects=savedProjects.filter(project=>project.id!==id);
      const remainingThreads=new Map([...savedThreads].filter(([,thread])=>thread.project!==id));

      // Save the full chat snapshot before removing the project: legacy readers
      // otherwise interpret records with a missing project as standalone chats.
      const storageError="删除失败，请重试。";
      if (!saveItems(storageKey,remainingThreads.values())) return storageError;
      if (!saveItems(projectStorage,remainingProjects)) {
        saveItems(storageKey,savedThreads.values());
        return storageError;
      }
      projects=remainingProjects;
      if (draft.project && !projectName(draft.project)) draft.project="";
      applyConversations(remainingThreads);
      return "";
    },
    createSidebarProject(name) {
      const message=addProject(name.trim());
      if (!message) notifyProjectChanges();
      return message;
    },
    recentTitles() {return sortedChatTitles([...threads.values()].filter(inRecent),"recentPin");},
    projectOptions:sortedProjects,taskChatTitle,runScheduledTask,
    searchThreads() {return [...threads.values()].sort((a,b)=>b.updatedAt-a.updatedAt).map(t=>({
      title:t.title, project:projectName(t.project), updatedAt:t.updatedAt, text:t.messages.map(m=>m.text).join("\n")
    }));},
    home() {draft=newDraft();current={mode:"home"};render();},
    compose(project="") {
      welcomeEntry++;draft=newDraft();draft.project=projectId(project);
      current={mode:"compose"};render();root().querySelector("textarea").focus();
    },
    threadProject(title) {return projectName(threads.get(title)?.project);},
    openThreadProjects() {
      const menu=root().querySelector(".rc-chat-more .rc-project-menu");
      if(menu)projectPicker(menu);
    },
    navigate(label,section,answerTarget) {
      const mode=hasResourcePanel && (label==="研究方法库" || label==="定时任务") ? "utility" : "page";
      if (answerTarget && mode==="page") spaces.showAnswerTarget(spaces.get(label),label,answerTarget);
      else if (current.mode===mode && current.page===label) return;
      document.getElementById("workspace").dataset.compactView="content";
      current={mode,page:String(label),section:String(section || ""),thread:current.thread || "",maximized:false};
      render();
    },
    closeFeature() {
      if(current.mode!=="page" && current.mode!=="utility")return;
      current=current.thread ? {mode:"chat",thread:current.thread} : {mode:"home"};
      render();
      return current;
    },
    chat(title) {if (threads.has(title)) {current={mode:"chat",thread:title};render();}}
  };
}());
