(()=>{
const A='./assets/compare-figma/';const img=(n,w=14,h=w)=>`<img src="${A+n}.svg" width="${w}" height="${h}" alt="">`;
const fundColors=['#9693cc','#93b9cc','#ccbd93','#bc93cc'];
const seed=[{id:'a',name:'宝盈中证A500指数增强 A',code:'023514',type:'股票型',abbr:'byzza500zszqa'},{id:'b',name:'国寿安保安泽纯债39个月定期开放债券 A',code:'023514',type:'债券型',abbr:'gsabazcz39gydqkf zqa'},{id:'c',name:'易方达纳斯达克100ETF联接(QDII-LOF) A',code:'023514',type:'QDII',abbr:'yfdnsdk100etfljqdii'},{id:'d',name:'鹏华养老目标日期2040五年持有期混合',code:'012784',type:'FOF',abbr:'phylmbrq2040wncyqhh'}];
let funds=[],compared=false,pinned=null,sequence=0,noticeTimer=null,noticeUntil=0,tab=0,period='共同时段',start='2025-11-07',end='2026-11-06',charts=[],container;
function syncFundColors(){
  [...funds].sort((a,b)=>a.order-b.order).forEach((fund,index)=>{
    fund.color=fundColors[index];
  });
}
let riskView='chart',showDifferences=true;
const analysisRanges=new Map();
function riskOptions(section='overview'){
  const defaults={overview:{start:'2024-01-01',end:'2026-11-06'},forecast:{period:'近3年',holdingMonths:3},rolling:{period:'近1年'},metrics:{benchmark:'上证综指',frequency:'原始频率'}};
  return {funds,referenceId:pinned,...analysisRange(`risk-${section}`,defaults[section]),unit:analysisRange(`risk-${section}`).unit||'月'};
}
const riskChartOptions=()=>({...riskOptions(),sectionOptions:riskOptions});
const fmt=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const date=s=>new Date(s+'T12:00:00');
function download(name,body,type){const u=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),500)}
const refreshButton=t=>`<button class="zc-text" data-refresh="${t}"><span class="zc-action-icon zc-refresh-icon" aria-hidden="true"></span>刷新</button>`;
function heading(t,help=false,dl=false){return `<div class="zc-section-head"><h2>${t}${help?`<span title="展示所选基金在选定时间段内的模拟收益与动态回撤">${img('47-50886_imgFrame',16)}</span>`:''}</h2><div>${dl?`<button class="zc-text" data-download><span class="zc-action-icon zc-download-icon" aria-hidden="true"></span>下载</button>`:''}${refreshButton(t)}</div></div>`}
function fundCards(){
  const slots=Array.from({length:4},(_,i)=>{
    const f=funds[i];
    if(!f)return `<article class="zc-fund zc-search-slot">
      <label class="zc-search"><input data-search="${i}" autocomplete="off" placeholder="输入基金代码、名称或简拼" aria-label="搜索添加基金"><span class="zc-search-icon">${img('47-50726_imgFrame',20)}<img class="is-focus" src="./assets/compare-controls/search-focus.svg" width="20" height="20" alt=""></span></label>
      <div class="zc-search-results" data-results="${i}" hidden></div>
    </article>`;
    const reference=pinned===f.id;
    return `<article class="zc-fund ${f.visible?'':'is-hidden'} ${reference?'is-reference':''}" style="--series:${f.color}">
      ${reference?`<button class="zc-reference-badge" data-pin="${f.id}" aria-label="取消参照 ${f.name}" aria-pressed="true"><img src="./assets/compare-controls/reference-pin.svg" width="14" height="14" alt=""><span>参照</span></button>`:''}
      <div class="zc-card-tools"><div>
        ${reference?'':`<button aria-label="钉住参照 ${f.name}" aria-pressed="false" data-pin="${f.id}">${img('47-50726_imgProperty3')}</button>
        <button aria-label="${f.visible?'隐藏':'显示'} ${f.name}" aria-pressed="${f.visible}" data-eye="${f.id}"><img src="./assets/compare-controls/eye-${f.visible?'visible':'hidden'}.svg" width="14" height="14" alt=""><img class="zc-eye-hover" src="./assets/compare-controls/eye-${f.visible?'visible':'hidden'}-hover.svg" width="14" height="14" alt=""></button>`}
      </div><button aria-label="移除 ${f.name}" data-remove="${f.id}">${img('47-50726_imgFrame2036082637')}</button></div>
      <strong title="${f.name}">${f.name}</strong><div class="zc-fund-code">${f.code}<span>${f.type}</span></div>
    </article>`;
  }).join('');
  return `<div class="zc-fund-row"><div class="zc-pk" role="img" aria-label="基金 PK"><img class="zc-pk-logo" src="./assets/compare-sticky/fund-pk-logo.png" width="72" height="25" alt=""></div><div class="zc-fund-slots">${slots}</div></div>`;
}
function pill(labels,value,attr){return `<div class="zc-pill">${labels.map((l,i)=>`<button ${attr}="${i}" class="${i===value?'selected':''}">${l}</button>`).join('')}</div>`}
function controls(){
  return `<div class="zc-controls"><div class="zc-tabs" role="tablist">${['产品概览比较','收益与风险比较','资产配置比较','收益归因比较'].map((label,index)=>`<button role="tab" aria-selected="${index===tab}" data-tab="${index}" class="${index===tab?'active':''}">${label}</button>`).join('')}</div>${tab===3?`<button type="button" class="zc-reference-toggle ${showDifferences?'is-on':''}" role="switch" aria-checked="${showDifferences}" aria-label="参照差值" data-reference-toggle><img src="./assets/compare-controls/reference-toggle.svg" width="22" height="22" alt=""><span>参照差值</span></button>`:''}</div>`;
}
function table(rows,returns=false){
  const numericRows=['基金代码','成立日期','最新单位净值','最新规模','管理费率','托管费率'];
  return `<div class="zc-table-wrap"><table class="zc-table zc-overview-table ${returns?'zc-returns':''}"><colgroup><col style="width:120px">${'<col>'.repeat(4)}</colgroup><tbody>${rows.map(row=>`<tr><th scope="row">${row[0]}</th>${Array.from({length:4},(_,index)=>{
    const fund=funds[index];
    const classes=[!returns&&numericRows.includes(row[0])?'zc-number-cell':'',fund?.id===pinned?'is-reference':''].filter(Boolean).join(' ');
    const value=fund?.visible?(typeof row[1]==='function'?row[1](index):row[seed.findIndex(item=>item.id===fund.id)+1]??row[1]):'';
    return `<td class="${classes}">${value}</td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const intervalData={
  a:[[-6.82,526,941],[2.38,186,1082],[-3.76,438,1036],[5.42,267,997],null,null,null,null,[-4.95,412,941]],
  b:[[2.46,128,623],[.21,286,658],[.74,203,646],[1.56,156,635],null,null,null,null,[2.81,119,623]],
  c:[[-9.35,112,168],[3.16,42,183],[-6.48,128,177],[8.73,57,172],null,null,null,null,[-7.62,105,168]],
  d:[[1.25,192,583],[.69,211,607],[-1.85,309,601],[3.66,175,590],null,null,null,null,[1.84,201,583]],
};
function difference(value,reference,unit='pp'){
  if(!Number.isFinite(value)||!Number.isFinite(reference))return '--';
  const delta=+(value-reference).toFixed(2);
  return `${delta>0?'+':''}${delta.toFixed(2)}${unit}`;
}
function returnsTable(){
  return table(['今年以来','近1月','近3月','近6月','近1年','近2年','近3年','近5年','成立以来'].map((label,rowIndex)=>[label,index=>{
    const fund=funds[index];
    const entry=intervalData[fund.id]?.[rowIndex];
    if(!entry)return '<span class="zc-empty-value">--</span>';
    const [value,rank,total]=entry;
    const reference=intervalData[pinned]?.[rowIndex]?.[0];
    const delta=pinned&&fund.id!==pinned?`<em class="zc-reference-difference">${difference(value,reference,' pp')}</em>`:'';
    return `<div class="zc-return-value"><b class="${value<0?'zc-down-value':'zc-up'}">${value.toFixed(2)}%</b>${delta}</div><small>排名 <span>${rank}</span> / <span class="zc-rank-total">${total}</span></small>`;
  }]),true);
}
function stars(index) {
  const icons = index === 0
    ? ['filled', 'half', 'empty', 'empty', 'empty']
    : ['filled', 'empty', 'empty', 'empty', 'empty'];
  return icons.map(icon => `<img src="./assets/compare-rating/star-${icon}.svg" width="14.8" height="14.8" alt="">`).join('');
}
function basic(){return table([['基金代码',i=>funds[i].code],['基金简称',i=>`<a href="#/fund/${funds[i].code}">${funds[i].name}</a>`],['基金类型',i=>funds[i].type==='股票型'?'股票型 | 增强指数股票型':funds[i].type],['基金星级(综合)',i=>`<div class="zc-stars">${stars(seed.findIndex(f=>f.id===funds[i].id))}</div>`],['基金经理',i=>`<a href="#/fund/${funds[i].code}">${funds[i].id==='c'?'蔡丹':'蔡丹 | 阳之璇'}</a>`],['经理星级(综合)',i=>`<div class="zc-stars">${stars(seed.findIndex(f=>f.id===funds[i].id))}</div>`],['基金公司','宝盈基金管理有限公司','宝盈基金管理有限公司','易方达基金管理有限公司'],['成立日期','2025-12-09'],['最新单位净值','0.9019'],['最新规模','3864.22万','5528.64万','3864.22万'],['申购状态','可申购','终止','可申购'],['赎回状态','可赎回','终止','可赎回'],['管理费率','0.8%','--','0.8%'],['托管费率','0.15%','--','0.15%'],['业绩比较基准','中证A500指数收益率×95%+银行活期存款利率(税后)×5%']])}
function content(){if(!funds.length)return `<div class="zc-empty"><strong>添加基金，开始比较</strong><p>通过上方搜索框选择最多 4 只基金</p></div>`;if(tab===0)return `<section>${performanceHeading()}<div class="zc-charts"><article><h3>收益走势</h3><div id="zc-return-chart" class="zc-chart"></div>${chartLegend('return')}</article><article><h3>动态回撤</h3><div id="zc-drawdown-chart" class="zc-chart"></div>${chartLegend('drawdown')}</article></div></section><section>${heading('区间收益')}${returnsTable()}</section><section class="zc-basic-info">${heading('基本信息')}${basic()}</section>`;if(tab===1)return riskContent();return (tab===2?CompareAllocationView:CompareAttributionView).render(analysisOptions());}
function render(){
  setupHeader();
  setScale();
  charts.forEach(c=>{if(!c.isDisposed())c.dispose()});
  charts=[];
  const selector=`<section class="zc-selector">${fundCards()}<div class="zc-actions">
    <button class="zc-primary" id="zc-start" ${funds.length<2?'disabled':''}>开始比较</button>
    <button class="zc-secondary" id="zc-clear">清空</button>
    ${compared?'<button class="zc-secondary" id="zc-export">导出对比</button>':''}
  </div></section>`;
  const layout=compared
    ? `<div class="zc-sticky-region"><div class="zc-sticky-panel">${selector}${controls()}</div></div>
       <div class="zc-results-card"><div class="zc-content">${content()}</div></div>`
    : `${selector}${emptyState()}`;
  container.innerHTML=`<div class="zc-compare ${compared?'has-results':'is-empty'}${compared&&tab===1?' is-risk-tab':''}">${layout}</div>`;
  bind();
  if(compared)draw();
  showTypeNotice();
  requestAnimationFrame(syncControlsLayout);
}
function isChartVisible(f,kind){return f.visible&&f.chartVisible?.[kind]!==false}
function chartLegend(kind){return `<div class="zc-chart-legend" aria-label="${kind==='return'?'收益走势':'动态回撤'}曲线显隐">${funds.map(f=>{const active=isChartVisible(f,kind);return `<button type="button" data-chart-legend="${f.id}" data-chart-kind="${kind}" aria-pressed="${active}" aria-label="${active?'隐藏':'显示'} ${f.name} 曲线" class="${active?'':'is-hidden'} ${f.id===pinned?'is-reference':''}" ${f.visible?'':'disabled title="请先显示基金卡片"'}><i style="background:${active?f.color:'#999'}"></i><span>${f.name}</span></button>`}).join('')}</div>`}
const escapeTooltip=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function chartTooltip(params,kind,width,referenceValue){
  const allRows=(Array.isArray(params)?params:[params]).filter(p=>p&&p.value!=null&&Number.isFinite(Number(p.value)));
  const rows=allRows.filter(p=>funds.some(f=>f.name===p.seriesName&&isChartVisible(f,kind)));
  if(!rows.length)return '';
  const reference=allRows.find(p=>funds.find(f=>f.name===p.seriesName)?.id===pinned);
  return `<div class="zc-tip ${pinned?'has-reference':''}" style="width:${Math.min(pinned?350:292,Math.max(150,width-18))}px"><div class="zc-tip-date">${escapeTooltip(rows[0].axisValue)}</div><div class="zc-tip-rows">${rows.map(p=>{
    const fund=funds.find(f=>f.name===p.seriesName),value=Number(p.value);
    const delta=pinned&&fund.id!==pinned?difference(value,referenceValue??Number(reference?.value)) : '';
    return `<div class="zc-tip-row ${fund.id===pinned?'is-reference':''}"><i style="background:${fund.color}"></i><span class="zc-tip-name">${escapeTooltip(fund.name)}</span><span class="zc-tip-value">${value>0?'+':''}${value.toFixed(2)}%</span>${pinned?`<em class="zc-tip-difference">${delta}</em>`:''}</div>`;
  }).join('')}</div></div>`;
}

function draw(){
  if(!compared||!window.echarts)return;
  charts.forEach(c=>{if(!c.isDisposed())c.dispose()});charts=[];
  if(tab>=2){
    charts=(tab===2?CompareAllocationView:CompareAttributionView).mount(container,analysisOptions())||[];
    return;
  }
  if(tab===1){
    charts=CompareRiskCharts.mount(container,riskChartOptions());
    return;
  }
  const range=analysisRange('overview-performance');
  const first=date(range.start),last=date(range.end),day=86400000,days=Math.max(0,Math.round((last-first)/day)),count=Math.max(1,Math.min(320,days+1));
  const times=Array.from({length:count},(_,i)=>new Date(+first+(count===1?0:Math.round(days*i/(count-1))*day)));
  const dateLabels=times.map(fmt);
  const anchors=[['2022-01-01',0],['2022-10-01',-9],['2023-06-01',5],['2023-11-01',-4],['2024-05-01',7],['2024-10-01',3],['2025-05-01',1],['2025-11-01',-1],['2025-12-08',0],['2026-01-05',4],['2026-01-25',1],['2026-02-09',-3],['2026-03-10',8],['2026-04-01',12],['2026-04-21',7],['2026-05-08',16],['2026-06-04',3],['2026-06-28',9],['2026-07-16',5],['2026-08-10',8],['2026-09-05',5],['2026-10-14',-10],['2026-11-05',-7]].map(([d,v])=>[+date(d),v]);
  function level(when,k){
    const ms=+when,idx=Math.max(0,Math.min(anchors.length-2,anchors.findIndex((a,i)=>i<anchors.length-1&&ms>=a[0]&&ms<=anchors[i+1][0]))),a=anchors[idx],b=anchors[idx+1],t=Math.max(0,Math.min(1,(ms-a[0])/(b[0]-a[0]))),d=(ms-anchors[0][0])/day;
    const trend=a[1]+(b[1]-a[1])*t;
    const amplitude=[1,.78,.60,.88][k];
    return trend*amplitude+Math.sin(d*.43+k*.8)*.65+Math.sin(d*.19+k*.32)*.55+Math.cos(d*.89+k*.55)*.35;
  }
  const dataById=new Map(funds.map(f=>{
    const k=seed.findIndex(x=>x.id===f.id),base=level(first,k);
    const performance=times.map(t=>+(level(t,k)-base).toFixed(2));
    let peak=0;const drawdown=performance.map(v=>{peak=Math.max(peak,v);return +(v-peak).toFixed(2)});
    return [f.id,{performance,drawdown}];
  }));
  function make(id,isDrawdown){
    const el=document.getElementById(id);if(!el)return;
    const c=echarts.init(el);charts.push(c);
    const kind=isDrawdown?'drawdown':'return';
    const allValues=funds.filter(f=>isChartVisible(f,kind)).flatMap(f=>dataById.get(f.id)[isDrawdown?'drawdown':'performance']);
    const actualMin=Math.min(0,...allValues),actualMax=Math.max(0,...allValues);
    const yMin=days>=180?Math.min(isDrawdown?-25:-15,Math.floor(actualMin/5)*5):Math.floor((actualMin-.3)*2)/2;
    const yMax=isDrawdown?0:(days>=180?Math.max(20,Math.ceil(actualMax/5)*5):Math.ceil((actualMax+.3)*2)/2);
    c.setOption({
      animation:false,color:funds.map(f=>f.color),
      tooltip:{trigger:'axis',confine:true,backgroundColor:'rgba(255,255,255,0.96)',borderColor:'#d9d9d9',borderWidth:1,padding:0,extraCssText:'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.08);white-space:normal;',axisPointer:{type:'line',lineStyle:{color:'#b9b8d8',type:'solid',width:1}},formatter:params=>chartTooltip(params,kind,el.clientWidth,dataById.get(pinned)?.[isDrawdown?'drawdown':'performance']?.[params[0]?.dataIndex])},
      grid:{left:42,right:42,top:9,bottom:31},legend:{show:false},
      xAxis:{type:'category',boundaryGap:false,data:dateLabels,axisLine:{lineStyle:{color:'#eaeaea'}},axisTick:{show:false},axisLabel:{color:'#777',fontSize:12,hideOverlap:true,showMinLabel:true,showMaxLabel:true},axisPointer:{label:{show:true,margin:8,padding:[0,2],backgroundColor:'#fff',color:'#262626',fontSize:12,fontWeight:700,shadowBlur:0}}},
      yAxis:{type:'value',min:yMin,max:yMax,splitNumber:days>=180?(isDrawdown?5:7):5,axisLabel:{formatter:'{value}%',fontSize:12,color:'#777'},splitLine:{lineStyle:{color:'#eaeaea',type:'dashed'}}},
      series:funds.map(f=>({name:f.name,type:'line',showSymbol:false,symbol:'circle',symbolSize:6,connectNulls:false,silent:!isChartVisible(f,kind),itemStyle:{color:f.color},emphasis:{itemStyle:{color:'#fff',borderColor:f.color,borderWidth:1}},lineStyle:{color:f.color,width:1.3,opacity:isChartVisible(f,kind)?1:0},data:isChartVisible(f,kind)?dataById.get(f.id)[isDrawdown?'drawdown':'performance']:[]}))
    });
  }
  make('zc-return-chart',false);make('zc-drawdown-chart',true);
  container.querySelectorAll('[data-chart-legend]').forEach(b=>{b.onclick=()=>{const f=funds.find(x=>x.id===b.dataset.chartLegend),kind=b.dataset.chartKind;if(!f||!f.visible)return;f.chartVisible??={return:true,drawdown:true};f.chartVisible[kind]=!isChartVisible(f,kind);const active=isChartVisible(f,kind);b.classList.toggle('is-hidden',!active);b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',`${active?'隐藏':'显示'} ${f.name} 曲线`);b.querySelector('i').style.background=active?f.color:'#999';draw()}});

}
function refreshModule(button){
  if(button.classList.contains('is-refreshing'))return;
  const section=button.closest('section'),module=button.dataset.refresh;
  button.classList.add('is-refreshing');button.setAttribute('aria-busy','true');
  setTimeout(()=>{
    if(!button.isConnected)return;
    if(module==='业绩走势')draw();
    else if(module==='区间收益'||module==='基本信息'){
      const table=section?.querySelector('.zc-table-wrap');
      if(table)table.outerHTML=module==='区间收益'?returnsTable():basic();
    }
    button.classList.remove('is-refreshing');button.removeAttribute('aria-busy');
  },500);
}
function datesForPeriod(range, value) {
  const last = date(range.commonEnd);
  if (value === '共同时段') return {start:range.commonStart,end:range.commonEnd};
  if (value.includes('年度')) return {start:`${value.slice(0,4)}-01-01`,end:`${value.slice(0,4)}-12-31`};
  if (value === '今年以来') return {start:`${last.getFullYear()}-01-01`,end:range.commonEnd};
  const months = {'近1月':1,'近3月':3,'近6月':6,'近1年':12,'近3年':36,'近5年':60}[value];
  if (!months) return {start:range.start,end:range.end};
  const day = last.getDate();
  last.setDate(1);
  last.setMonth(last.getMonth()-months);
  last.setDate(Math.min(day,new Date(last.getFullYear(),last.getMonth()+1,0).getDate()));
  return {start:fmt(last),end:range.commonEnd};
}

function analysisRange(scope, initial = {}) {
  if (!analysisRanges.has(scope)) {
    const range = {start,end,period:'共同时段',unit:'月',holdingMonths:3,...initial};
    range.commonStart = range.start;
    range.commonEnd = range.end;
    Object.assign(range,datesForPeriod(range,range.period));
    analysisRanges.set(scope,range);
  }
  return analysisRanges.get(scope);
}

function analysisOptions() {
  return {funds,start,end,period,referenceId:pinned,showDifferences,ui:analysisUi};
}

function analysisTimeControls(scope, initial = {}) {
  const range = analysisRange(scope,initial);
  const common = ['共同时段','近1年','近3年'];
  const moreSelected = !common.includes(range.period);
  const moreLabel = moreSelected ? range.period : '更多';
  return `<div class="zc-analysis-time" data-analysis-time="${scope}">
    <div class="zc-quick-wrap">
      <div class="zc-pill zc-analysis-quick">${common.map(label=>`<button type="button" data-analysis-period="${label}" class="${range.period===label?'selected':''}" aria-pressed="${range.period===label}">${label}</button>`).join('')}
        <button type="button" data-analysis-more class="${moreSelected?'selected':''}" aria-pressed="${moreSelected}" aria-expanded="false">${moreLabel}<span class="zc-down"><img src="./assets/compare-controls/more.svg" width="10" height="10" alt=""></span></button>
      </div>
      <div class="zc-more-panel" hidden>
        <div><small>区间</small>${['近3月','近6月','近5年'].map(label=>`<button type="button" data-analysis-period="${label}" class="${range.period===label?'selected':''}" aria-pressed="${range.period===label}">${label}</button>`).join('')}</div>
        <div><small>年度</small>${['今年以来','2025年度','2024年度','2023年度'].map(label=>`<button type="button" data-analysis-period="${label}" class="${range.period===label?'selected':''}" aria-pressed="${range.period===label}">${label}</button>`).join('')}</div>
      </div>
    </div>
    ${initial.showDate===false?'':`<div class="zc-date-wrap"><button type="button" class="zc-date" data-analysis-date="${scope}" aria-label="当前日期范围 ${range.start} 至 ${range.end}" disabled>
      <span>${range.start}</span><small>至</small><span>${range.end}</span><img src="./assets/compare-controls/calendar-disabled.svg" width="12.6348" height="12.1194" alt="">
    </button></div>`}
  </div>`;
}

function analysisSetting(scope, field, label, options, initial) {
  const range = analysisRange(scope);
  if (range[field] === undefined) range[field] = initial;
  const choices = options.map(option=>typeof option==='object'?option:{value:option,label:option});
  const current = choices.find(option=>String(option.value)===String(range[field]));
  return `<details class="zc-analysis-select"><summary aria-label="${escapeTooltip(label)} ${escapeTooltip(current?.label??range[field])}" aria-haspopup="listbox"><span>${escapeTooltip(label)}</span><strong>${escapeTooltip(current?.label??range[field])}</strong><img src="./assets/compare-controls/more.svg" width="10" height="10" alt=""></summary>
    <div class="zc-analysis-menu" role="listbox" aria-label="${escapeTooltip(label)}">${choices.map(option=>`<button type="button" role="option" aria-selected="${String(option.value)===String(range[field])}" data-analysis-field="${field}" data-analysis-scope="${scope}" data-analysis-value="${escapeTooltip(option.value)}">${escapeTooltip(option.label)}</button>`).join('')}</div>
  </details>`;
}

function selectAnalysisPeriod(scope, value) {
  const range = analysisRange(scope);
  range.period = value;
  Object.assign(range,datesForPeriod(range,value));
  render();
  const toolbar = container.querySelector(`[data-analysis-time="${scope}"]`);
  const selected = toolbar.querySelector('.zc-analysis-quick .selected');
  selected?.focus({preventScroll:true});
}

function closeAnalysisMenu(toolbar) {
  toolbar.querySelector('.zc-more-panel').hidden=true;
  const more=toolbar.querySelector('[data-analysis-more]');
  more.setAttribute('aria-expanded','false');
  delete more.dataset.openByClick;
}

function performanceHeading() {
  return `<div class="zc-section-head zc-overview-head"><h2>业绩走势<span class="zc-overview-help"><button type="button" aria-label="业绩走势说明" aria-describedby="zc-overview-help"><img src="./assets/compare-controls/help.svg" width="16" height="16" alt=""></button><span role="tooltip" id="zc-overview-help">展示所选基金在选定时间段内的模拟收益与动态回撤。</span></span></h2><div class="zc-overview-actions">
    ${analysisTimeControls('overview-performance')}
    <div class="zc-overview-buttons"><button class="zc-text" data-download><img src="./assets/compare-controls/download.svg" width="14" height="14" alt="">下载</button><button class="zc-text" data-refresh="业绩走势"><img src="./assets/compare-controls/refresh.svg" width="14" height="14" alt="">刷新</button></div>
  </div></div>`;
}

function downloadAnalysisSection(button) {
  const section = button.closest('[data-analysis-section]');
  if (!section) return;
  const name = section.querySelector('h2')?.textContent.trim() || '基金比较';
  const tables = [...section.querySelectorAll('table')];
  if (!tables.length) {
    const sectionCharts = charts.filter(chart => section.contains(chart.getDom()));
    if (sectionCharts.length) saveChartImage(name, sectionCharts);
    return;
  }
  const csv = tables.map(table => [...table.rows].map(row => [...row.cells].map(cell => {
    const copy = cell.cloneNode(true);
    copy.querySelectorAll('button, [aria-hidden="true"]').forEach(item => item.remove());
    return `"${copy.textContent.trim().replaceAll('"', '""')}"`;
  }).join(',')).join('\r\n')).join('\r\n\r\n');
  download(`${name}.csv`, '\ufeff' + csv, 'text/csv;charset=utf-8');
}

function bindAnalysisUi(scope) {
  scope.querySelectorAll('[data-analysis-time]').forEach(toolbar=>{
    const key = toolbar.dataset.analysisTime;
    toolbar.querySelectorAll('[data-analysis-period]').forEach(button=>{
      button.onclick = ()=>selectAnalysisPeriod(key,button.dataset.analysisPeriod);
    });
    const more = toolbar.querySelector('[data-analysis-more]');
    const panel = toolbar.querySelector('.zc-more-panel');
    const wrap = more.closest('.zc-quick-wrap');
    const show = ()=>{panel.hidden=false;more.setAttribute('aria-expanded','true');};
    more.onclick=()=>{
      if(more.dataset.openByClick)closeAnalysisMenu(toolbar);
      else {more.dataset.openByClick='true';show();}
    };
    more.onmouseenter=show;
    wrap.onmouseleave=()=>{
      if(!more.dataset.openByClick&&!wrap.contains(document.activeElement))closeAnalysisMenu(toolbar);
    };
    wrap.onfocusout=event=>{
      if(!wrap.contains(event.relatedTarget))closeAnalysisMenu(toolbar);
    };
    wrap.onkeydown=event=>{
      if(event.key==='Escape'){
        event.preventDefault();
        closeAnalysisMenu(toolbar);
        more.focus({preventScroll:true});
      }
    };
  });
  scope.querySelectorAll('[data-analysis-field]').forEach(control=>{
    const update = ()=>{
      const key=control.dataset.analysisScope;
      analysisRange(key)[control.dataset.analysisField]=control.dataset.analysisValue??control.value;
      render();
      const replacement=container.querySelector(`[data-analysis-scope="${key}"][data-analysis-field="${control.dataset.analysisField}"]`);
      const focusTarget=replacement?.closest('details')?.querySelector('summary')||replacement;
      focusTarget?.focus({preventScroll:true});
    };
    if(control.tagName==='SELECT')control.onchange=update;
    else control.onclick=update;
  });
  scope.querySelectorAll('[data-analysis-download]').forEach(button=>{
    button.onclick=()=>downloadAnalysisSection(button);
  });
  scope.querySelectorAll('[data-analysis-refresh]').forEach(button=>{
    button.onclick=()=>{
      if(button.classList.contains('is-refreshing'))return;
      button.classList.add('is-refreshing');
      button.setAttribute('aria-busy','true');
      setTimeout(()=>{if(button.isConnected)render();},400);
    };
  });
}

const analysisUi = {
  timeControls: analysisTimeControls,
  range: analysisRange,
  setting: analysisSetting,
  bind: bindAnalysisUi,
};

function riskContent(){
  const options=riskOptions();
  const series=CompareRiskCharts.data(options);
  const seriesBySection=Object.fromEntries(['overview','interval','forecast','rolling','drawdown','metrics'].map(key=>[`risk-${key}`,CompareRiskCharts.data(riskOptions(key))]));
  return CompareRiskView.render({...options,ui:analysisUi,view:riskView,series,seriesBySection});
}
function renderWithFocus(selector,value){
  render();
  container.querySelector(`[${selector}="${value}"]`)?.focus({preventScroll:true});
}
function refreshRiskSection(button){
  if(button.classList.contains('is-refreshing'))return;
  const section=button.closest('[data-risk-section]');
  button.classList.add('is-refreshing');
  button.setAttribute('aria-busy','true');
  setTimeout(()=>{
    if(!button.isConnected)return;
    const template=document.createElement('template');
    template.innerHTML=riskContent();
    const replacement=template.content.querySelector(`[data-risk-section="${section.dataset.riskSection}"]`);
    const restoreFocus=document.activeElement===button;
    charts=charts.filter(chart=>{
      if(!section.contains(chart.getDom()))return true;
      chart.dispose();
      return false;
    });
    section.replaceWith(replacement);
    charts.push(...CompareRiskCharts.mount(replacement,riskChartOptions()));
    bindRiskActions(replacement);
    CompareRiskView.bind?.(replacement);
    analysisUi.bind(replacement);
    if(restoreFocus)replacement.querySelector('[data-risk-refresh]').focus({preventScroll:true});
  },500);
}
function saveChartImage(name,sectionCharts){
  const images=sectionCharts.map(chart=>chart.renderToCanvas({pixelRatio:2,backgroundColor:'#fff'}));
  let canvas=images[0];
  if(images.length>1){
    const gap=48;
    canvas=document.createElement('canvas');
    canvas.width=images.reduce((width,image)=>width+image.width,0)+gap*(images.length-1);
    canvas.height=Math.max(...images.map(image=>image.height));
    const context=canvas.getContext('2d');
    context.fillStyle='#fff';
    context.fillRect(0,0,canvas.width,canvas.height);
    let left=0;
    for(const image of images){
      context.drawImage(image,left,0);
      left+=image.width+gap;
    }
  }
  canvas.toBlob(blob=>{
    if(blob)download(`${name}.png`,blob,'image/png');
  },'image/png');
}
function exportComparison(){
  const rows=[['基金比较',container.querySelector('[role="tab"][aria-selected="true"]')?.textContent||''],['参照基金',funds.find(fund=>fund.id===pinned)?.name||''],[],['基金名称','基金代码','基金类型','显示状态']];
  funds.forEach(fund=>rows.push([fund.name,fund.code,fund.type,fund.visible?'显示':'隐藏']));
  container.querySelectorAll('.zc-content section').forEach(section=>{
    rows.push([], [section.querySelector('h2')?.childNodes[0]?.textContent.trim()||'']);
    section.querySelectorAll('[data-analysis-date]').forEach(control=>rows.push(['日期范围',control.textContent.trim()]));
    section.querySelectorAll('table').forEach(table=>{
      [...table.rows].filter(row=>!row.closest('[hidden]')).forEach(row=>rows.push([...row.cells].map(cell=>cell.textContent.trim())));
    });
    charts.filter(chart=>section.contains(chart.getDom())).forEach(chart=>{
      const option=chart.getOption();
      const labels=option.xAxis?.[0]?.data||[];
      const series=(option.series||[]).filter(item=>item.name);
      rows.push(['时间或区间',...series.map(item=>item.name)]);
      labels.forEach((label,index)=>rows.push([label,...series.map(item=>item.data?.[index]??'')]));
    });
  });
  const csv=rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n');
  download('基金对比.csv','\ufeff'+csv,'text/csv;charset=utf-8');
}
function downloadRiskSection(button){
  const section=button.closest('[data-risk-section]');
  const name=section.querySelector('h2').textContent.trim();
  const sectionCharts=charts.filter(chart=>section.contains(chart.getDom()));
  if(sectionCharts.length){
    saveChartImage(name,sectionCharts);
    return;
  }
  const tables=Array.from(section.querySelectorAll('table'));
  const csv=tables.map(table=>Array.from(table.rows,row=>
    Array.from(row.cells,cell=>`"${cell.textContent.trim().replaceAll('"','""')}"`).join(',')
  ).join('\r\n')).join('\r\n\r\n');
  if(csv)download(`${name}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');
}
function bindRiskActions(scope){
  scope.querySelectorAll('[data-risk-view]').forEach(button=>{
    button.onclick=()=>{
      if(riskView===button.dataset.riskView)return;
      riskView=button.dataset.riskView;
      renderWithFocus('data-risk-view',riskView);
    };
  });
  scope.querySelectorAll('[data-risk-refresh]').forEach(button=>{
    button.onclick=()=>refreshRiskSection(button);
  });
  scope.querySelectorAll('[data-risk-download]').forEach(button=>{
    button.onclick=()=>downloadRiskSection(button);
  });
}
function bind(){
  const differenceToggle=container.querySelector('[data-reference-toggle]');
  if(differenceToggle)differenceToggle.onclick=()=>{
    showDifferences=!showDifferences;
    render();
    container.querySelector('[data-reference-toggle]')?.focus({preventScroll:true});
  };
  container.querySelectorAll('[data-tab]').forEach(button=>{
    const next=Number(button.dataset.tab);
    button.onclick=()=>{
      if(tab===next)return;
      tab=next;
      renderWithFocus('data-tab',next);
    };
  });
  container.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{
    funds=funds.filter(f=>f.id!==b.dataset.remove);
    syncFundColors();
    if(pinned===b.dataset.remove){pinned=null;funds.sort((a,b)=>a.order-b.order)}
    if(funds.length<2){compared=false;tab=0}
    render();
    const next=container.querySelector('[data-search]')||container.querySelector('[data-remove]');
    next?.focus({preventScroll:true});
    closeSearchResults();
  });
  container.querySelectorAll('[data-eye]').forEach(b=>b.onclick=()=>{
    const f=funds.find(f=>f.id===b.dataset.eye);
    f.visible=!f.visible;
    if(f.visible){
      f.chartVisible={return:true,drawdown:true};
      CompareRiskCharts.resetFundVisibility(f);
    }
    renderWithFocus('data-eye',f.id);
  });
  container.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{
    pinned=pinned===b.dataset.pin?null:b.dataset.pin;
    funds.sort((a,b)=>a.order-b.order);
    if(pinned){const i=funds.findIndex(f=>f.id===pinned);funds.unshift(...funds.splice(i,1))}
    renderWithFocus('data-pin',b.dataset.pin);
  });
  container.querySelector('#zc-clear').onclick=()=>{
    funds=[];compared=false;tab=0;pinned=null;noticeUntil=0;render();
    container.querySelector('[data-search]')?.focus({preventScroll:true});
    closeSearchResults();
  };
  container.querySelector('#zc-start').onclick=()=>{compared=true;renderWithFocus('data-tab',tab)};
  const exportButton=container.querySelector('#zc-export');
  if(exportButton)exportButton.onclick=exportComparison;
  container.querySelectorAll('[data-refresh]').forEach(b=>b.onclick=()=>refreshModule(b));
  container.querySelectorAll('[data-download]').forEach(b=>b.onclick=()=>{
    if(charts.length)saveChartImage('基金收益走势',charts);
  });
  bindSearch();
  if(!compared)return;
  if(tab===1){bindRiskActions(container);CompareRiskView.bind?.(container);}
  analysisUi.bind(container);
}

function syncControlsLayout(){const control=container?.querySelector('.zc-controls'),tabs=control?.querySelector('.zc-tabs'),filters=control?.querySelector('.zc-filters');if(!tabs||!filters)return;control.classList.remove('is-wrapped');const t=tabs.getBoundingClientRect(),f=filters.getBoundingClientRect();control.classList.toggle('is-wrapped',f.top>=t.bottom-1)}
window.addEventListener('resize',()=>{setScale();requestAnimationFrame(syncControlsLayout);charts.forEach(c=>c.resize())});
document.addEventListener('click',e=>{
  container?.querySelectorAll('.zc-analysis-select[open]').forEach(menu=>{if(!menu.contains(e.target))menu.open=false;});
  container?.querySelectorAll('[data-analysis-time]').forEach(toolbar=>{
    if(!toolbar.querySelector('.zc-quick-wrap').contains(e.target))closeAnalysisMenu(toolbar);
  });
  if(!e.target.closest('.zc-search-slot'))closeSearchResults();
});

function setScale(){document.documentElement.style.setProperty('--zc-scale',document.documentElement.clientWidth>=1000?Math.min(1,document.documentElement.clientWidth/1440):1)}
const F='./assets/compare-final/';
const finalImg=(name,w,h=w)=>`<img src="${F+name}.svg" width="${w}" height="${h}" alt="">`;
function emptyState(){return `<div class="zc-design-empty"><div class="zc-illustration"><div class="zc-illustration-art">${['img','img1','img2','img3','img4','img5','img6'].map((name,i)=>`<span class="zc-art-layer layer-${i}">${finalImg('51-57569_'+name,...[[194.643,113.882],[196.574,17.418],[84.2461,73.9375],[82.1133,67.0059],[25.8981,47.9883],[26.0381,26.0381],[16.1738,14.9297]][i])}${i===5?'<span class="zc-badge-plus"><i></i><i></i></span>':''}</span>`).join('')}</div></div><p>请选择 <strong>2–4只</strong> 基金进行比较</p></div>`}
function showTypeNotice(restart=false){if(new Set(funds.map(f=>f.type)).size<2){noticeUntil=0;clearTimeout(noticeTimer);return}if(restart)noticeUntil=Date.now()+3000;const remaining=noticeUntil-Date.now();if(remaining<=0)return;clearTimeout(noticeTimer);document.querySelector('.zc-type-notice')?.remove();const n=document.createElement('div');n.className='zc-type-notice';n.setAttribute('role','status');n.innerHTML=`<span class="zc-warning">!</span><span>您选择了不同类型的基金，建议同类型基金对比更具有参考意义。</span><button aria-label="关闭提示">${img('47-50726_imgFrame2036082637')}</button>`;container.querySelector('.zc-selector').before(n);n.querySelector('button').onclick=()=>{noticeUntil=0;clearTimeout(noticeTimer);n.remove()};noticeTimer=setTimeout(()=>{noticeUntil=0;n.remove()},remaining)}
function closeSearchResults(){
  container?.querySelectorAll('.zc-search-results').forEach(result=>{result.hidden=true});
  container?.querySelectorAll('[data-search]').forEach(search=>{search.setAttribute('aria-expanded','false')});
}
function bindSearch(){
  container.querySelectorAll('[data-search]').forEach(search=>{
    const result=container.querySelector(`[data-results="${search.dataset.search}"]`);
    const slot=search.closest('.zc-search-slot');
    result.id=`zc-fund-results-${search.dataset.search}`;
    result.setAttribute('role','listbox');
    result.setAttribute('aria-label','基金搜索结果');
    search.setAttribute('role','combobox');
    search.setAttribute('aria-autocomplete','list');
    search.setAttribute('aria-haspopup','listbox');
    search.setAttribute('aria-controls',result.id);
    search.setAttribute('aria-expanded','false');
    function highlight(value,q){
      const fragment=document.createDocumentFragment();
      let pos=0,lower=value.toLowerCase(),at=q?lower.indexOf(q):-1;
      while(at!==-1){
        fragment.append(document.createTextNode(value.slice(pos,at)));
        const strong=document.createElement('strong');
        strong.textContent=value.slice(at,at+q.length);
        fragment.append(strong);
        pos=at+q.length;
        at=lower.indexOf(q,pos);
      }
      fragment.append(document.createTextNode(value.slice(pos)));
      return fragment;
    }
    function results(){
      closeSearchResults();
      const q=search.value.trim().toLowerCase();
      const matches=seed.filter(f=>!funds.some(x=>x.id===f.id)&&(!q||`${f.name}${f.code}${f.type}${f.abbr}`.toLowerCase().includes(q)));
      result.hidden=false;
      result.replaceChildren();
      search.setAttribute('aria-expanded','true');
      if(!matches.length){
        const empty=document.createElement('div');
        empty.className='zc-search-no-results';
        empty.textContent='暂无匹配基金';
        result.append(empty);
        return;
      }
      matches.forEach(f=>{
        const button=document.createElement('button');
        button.type='button';
        button.setAttribute('role','option');
        button.setAttribute('aria-selected','false');
        for(const [field,className] of [['code','code'],['name','name'],['type','type']]){
          const span=document.createElement('span');
          span.className=className;
          span.append(highlight(f[field],q));
          button.append(span);
        }
        button.onclick=event=>{
          event.stopPropagation();
          funds.push({...f,visible:true,order:sequence++});
          syncFundColors();
          render();
          const next=container.querySelector('[data-search]')||container.querySelector('#zc-start');
          next?.focus({preventScroll:true});
          closeSearchResults();
          showTypeNotice(true);
        };
        result.append(button);
      });
    }
    search.oninput=results;
    search.onfocus=results;
    search.onkeydown=event=>{
      if(event.isComposing)return;
      if(event.key==='Escape'){
        event.preventDefault();
        closeSearchResults();
      }else if(event.key==='Enter'&&!result.hidden){
        event.preventDefault();
        result.querySelector('button')?.click();
      }else if(event.key==='ArrowDown'||event.key==='ArrowUp'){
        event.preventDefault();
        if(result.hidden)results();
        const options=result.querySelectorAll('button');
        const target=event.key==='ArrowDown'?options[0]:options[options.length-1];
        target?.focus({preventScroll:true});
      }
    };
    result.onkeydown=event=>{
      const options=[...result.querySelectorAll('button')];
      const index=options.indexOf(event.target);
      if(index<0)return;
      if(event.key==='Escape'){
        event.preventDefault();
        search.focus({preventScroll:true});
        closeSearchResults();
      }else if(event.key==='ArrowDown'||event.key==='ArrowUp'){
        event.preventDefault();
        const next=index+(event.key==='ArrowDown'?1:-1);
        if(next<0)search.focus({preventScroll:true});
        else options[Math.min(next,options.length-1)]?.focus({preventScroll:true});
      }
    };
    slot.onfocusout=event=>{
      if(!slot.contains(event.relatedTarget))closeSearchResults();
    };
  });
}
function setupHeader(){let h=document.getElementById('zc-header');if(h)return;const original=document.querySelector('header.app-topbar');h=original.cloneNode(true);h.id='zc-header';h.classList.add('zc-header');h.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));const brand=h.querySelector('.app-brand');brand.innerHTML=`<span class="zc-brand-crop"><img src="${F}51-57380_imgImage5.png" alt="智君科技"></span>`;h.querySelectorAll('.app-nav .nav-caret').forEach(el=>{el.outerHTML=`<span class="zc-nav-arrow">${finalImg('51-57380_imgFrame2036082628',12)}</span>`});h.querySelector('.app-actions').innerHTML=`<button type="button" class="zc-global-search" aria-label="全局搜索">${finalImg('51-57380_imgFrame',20)}<span>搜索基金、组合或报告</span></button><div class="zc-header-icons"><a href="./visual-system.html" aria-label="视觉系统">${finalImg('51-57380_imgFrame1',20)}</a><button aria-label="设置">${finalImg('51-57380_imgFrame2',20)}</button><button aria-label="帮助">${finalImg('51-57380_imgFrame3',20)}</button></div><span class="zc-header-divider"></span><button class="zc-user" aria-label="个人中心">${finalImg('51-57380_imgFrame2036083101',32)}<span>孟豆豆</span>${finalImg('51-57380_imgDown',16)}</button>`;h.querySelectorAll('.app-nav .nav-link').forEach(e=>e.classList.toggle('is-active',e.dataset.routeNav==='fund-research'));h.querySelectorAll('[data-route-leaf]').forEach(e=>e.classList.toggle('is-active',e.dataset.routeLeaf==='compare'));h.querySelector('.zc-global-search').onclick=()=>container.querySelector('input[role="combobox"]')?.focus();original.after(h)}
window.CompareView={prepareHeader(el){container=el;setupHeader();setScale()},render(el){container=el;render()}};
})();
