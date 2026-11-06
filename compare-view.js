(()=>{
const A='./assets/compare-figma/';const img=(n,w=14,h=w)=>`<img src="${A+n}.svg" width="${w}" height="${h}" alt="">`;
const seed=[{id:'a',name:'宝盈中证A500指数增强 A',code:'023514',type:'股票型',color:'#8695dd',abbr:'byzza500zszqa'},{id:'b',name:'国寿安保安泽纯债39个月定期开放债券 A',code:'023514',type:'债券型',color:'#e89c71',abbr:'gsabazcz39gydqkf zqa'},{id:'c',name:'易方达纳斯达克100ETF联接(QDII-LOF) A',code:'023514',type:'QDII',color:'#7ec3d8',abbr:'yfdnsdk100etfljqdii'},{id:'d',name:'宝盈中证A500指数增强 C',code:'023515',type:'股票型',color:'#e8b871',abbr:'byzza500zszqc'}];
let funds=[],compared=false,pinned=null,sequence=0,noticeTimer=null,noticeUntil=0,tab=0,mode=0,period='共同时段',start='2025-05-02',end='2026-05-01',cal=false,anchor=null,hover=null,months=[],units=['月','月'],calendarMenu=null,charts=[],container;
const riskUnits=['月','季','年'];
let riskUnit='月',riskView='chart';
const riskOptions=()=>({funds,start,end,unit:riskUnit});
const fmt=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const date=s=>new Date(s+'T12:00:00');const today=fmt(new Date());const min='2022-01-01';
function download(name,body,type){const u=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),500)}
const refreshButton=t=>`<button class="zc-text" data-refresh="${t}"><span class="zc-action-icon zc-refresh-icon" aria-hidden="true"></span>刷新</button>`;
function heading(t,help=false,dl=false){return `<div class="zc-section-head"><h2>${t}${help?`<span title="展示所选基金在选定时间段内的模拟收益与动态回撤">${img('47-50886_imgFrame',16)}</span>`:''}</h2><div>${dl?`<button class="zc-text" data-download><span class="zc-action-icon zc-download-icon" aria-hidden="true"></span>下载</button>`:''}${refreshButton(t)}</div></div>`}
function fundCards(){
  const slots=Array.from({length:4},(_,i)=>{
    const f=funds[i];
    if(!f)return `<article class="zc-fund zc-search-slot">
      <label class="zc-search"><input data-search="${i}" autocomplete="off" placeholder="输入基金代码、名称或简拼" aria-label="搜索添加基金">${img('47-50726_imgFrame',20)}</label>
      <div class="zc-search-results" data-results="${i}" hidden></div>
    </article>`;
    return `<article class="zc-fund ${f.visible?'':'is-hidden'}" style="--series:${f.color}">
      <div class="zc-card-tools"><div>
        <button aria-label="${pinned===f.id?'取消置前':'置前'} ${f.name}" aria-pressed="${pinned===f.id}" data-pin="${f.id}">${img(pinned===f.id?'47-50726_imgProperty2':'47-50726_imgProperty3')}</button>
        <button aria-label="${f.visible?'隐藏':'显示'} ${f.name}" aria-pressed="${f.visible}" data-eye="${f.id}">${img(f.visible?'47-50726_imgProperty1':'eye-hidden')}</button>
      </div><button aria-label="移除 ${f.name}" data-remove="${f.id}">${img('47-50726_imgFrame2036082637')}</button></div>
      <strong title="${f.name}">${f.name}</strong><div class="zc-fund-code">${f.code}<span>${f.type}</span></div>
    </article>`;
  }).join('');
  return `<div class="zc-fund-row"><div class="zc-pk" role="img" aria-label="基金 PK"></div><div class="zc-fund-slots">${slots}</div></div>`;
}
function pill(labels,value,attr){return `<div class="zc-pill">${labels.map((l,i)=>`<button ${attr}="${i}" class="${i===value?'selected':''}">${l}</button>`).join('')}</div>`}
function riskFrequency(){
  return `<div class="zc-risk-frequency" role="group" aria-label="收益统计频率">${pill(riskUnits,riskUnits.indexOf(riskUnit),'data-risk-unit')}</div>`;
}
function dateIcon(open){
  if(open)return `${A}100-4801_imgFrame2036082748.svg`;
  return tab===1?'./assets/compare-risk/calendar.svg':`${A}117-5531_imgFrame2036082748.svg`;
}
function controls(){return `<div class="zc-controls"><div class="zc-tabs" role="tablist">${['产品概览比较','收益与风险比较','资产配置比较','收益归因比较'].map((x,i)=>`<button role="tab" aria-selected="${i===tab}" data-tab="${i}" class="${i===tab?'active':''}">${x}</button>`).join('')}</div><div class="zc-filters${tab===1?' zc-risk-filters':''}">${tab===1?riskFrequency():pill(['基金间比较','相对自身基准'],mode,'data-mode')}<div class="zc-quick-wrap"><div class="zc-pill zc-quick">${['共同时段','近1年','近3年'].map(x=>`<button data-period="${x}" class="${period===x?'selected':''}">${x}</button>`).join('')}<button id="zc-more" class="${!['共同时段','近1年','近3年','自定义'].includes(period)?'selected':''}" aria-expanded="false">${['共同时段','近1年','近3年','自定义'].includes(period)?'更多':period}<span class="zc-down">${img('117-5531_imgFrame2036082628',10)}</span></button></div><div class="zc-more-panel" hidden><div><small>区间</small>${['近1月','近3月','近6月'].map(x=>`<button data-period="${x}">${x}</button>`).join('')}</div><div><small>年度</small>${['今年以来','2025年度','2024年度','2023年度'].map(x=>`<button data-period="${x}">${x}</button>`).join('')}</div></div></div><div class="zc-date-wrap"><button id="zc-date" class="zc-date ${cal?'open':''}" aria-expanded="${cal}" aria-label="选择日期范围"><span>${start}</span><small>至</small><span>${end}</span><img src="${dateIcon(cal)}" width="12.6348" height="12.1194" alt=""></button><div id="zc-calendar" ${cal?'':'hidden'}></div></div></div></div>`}
function table(rows,returns=false){return `<div class="zc-table-wrap"><table class="zc-table ${returns?'zc-returns':''}"><colgroup><col style="width:120px">${'<col>'.repeat(4)}</colgroup><tbody>${rows.map((r,ri)=>`<tr><th scope="row">${r[0]}</th>${Array.from({length:4},(_,i)=>`<td class="${returns&&funds[i]?.visible&&funds[i]?.id==='a'&&![4,5,6,7].includes(ri)?'best':''}">${funds[i]?.visible?(typeof r[1]==='function'?r[1](i):r[seed.findIndex(f=>f.id===funds[i].id)+1]??r[1]):''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function returnsTable(){return table(['今年以来','近1月','近3月','近6月','近1年','近2年','近3年','近5年','成立以来'].map((x,i)=>[x,j=>[4,5,6,7].includes(i)?'--':`<b class="${i===3&&funds[j].id==='a'?'zc-up':'zc-down-value'}">${i===3&&funds[j].id==='a'?'':'-'}10.47%</b><small>排名 515 / 941</small>`]),true)}
function stars(i){return Array.from({length:5},(_,j)=>img(j<(i===0?2:1)?'47-51123_imgProperty1':'47-51123_imgProperty2',14.8)).join('')}
function basic(){return table([['基金代码',i=>funds[i].code],['基金简称',i=>`<a href="#/fund/${funds[i].code}">${funds[i].name}</a>`],['基金类型',i=>funds[i].type==='股票型'?'股票型 | 增强指数股票型':funds[i].type],['基金星级(综合)',i=>`<div class="zc-stars">${stars(seed.findIndex(f=>f.id===funds[i].id))}</div>`],['基金经理',i=>`<a href="#/fund/${funds[i].code}">${funds[i].id==='c'?'蔡丹':'蔡丹 | 阳之璇'}</a>`],['经理星级(综合)',i=>`<div class="zc-stars">${stars(seed.findIndex(f=>f.id===funds[i].id))}</div>`],['基金公司','宝盈基金管理有限公司','宝盈基金管理有限公司','易方达基金管理有限公司'],['成立日期','2025-12-09'],['最新单位净值','0.9019'],['最新规模','3864.22万','5528.64万','3864.22万'],['申购状态','可申购','终止','可申购'],['赎回状态','可赎回','终止','可赎回'],['管理费率','0.8%','--','0.8%'],['托管费率','0.15%','--','0.15%'],['业绩比较基准','中证A500指数收益率×95%+银行活期存款利率(税后)×5%']])}
function content(){if(!funds.length)return `<div class="zc-empty"><strong>添加基金，开始比较</strong><p>通过上方搜索框选择最多 4 只基金</p></div>`;if(tab===0)return `<section>${heading('业绩走势',true,true)}<div class="zc-charts"><article><h3>收益走势</h3><div id="zc-return-chart" class="zc-chart"></div>${chartLegend('return')}</article><article><h3>动态回撤</h3><div id="zc-drawdown-chart" class="zc-chart"></div>${chartLegend('drawdown')}</article></div></section><section>${heading('区间收益')}${returnsTable()}</section><section>${heading('基本信息')}${basic()}</section>`;if(tab===1)return riskContent();return `<section>${heading(tab===2?'资产配置比较':'收益归因比较',true,true)}<div id="zc-bar-chart" class="zc-chart zc-bar"></div></section><section>${heading(tab===2?'资产配置明细':'收益来源明细')}${table(tab===2?[['股票','82.5%','0.0%','95.2%'],['债券','10.2%','94.6%','0.0%'],['现金','6.3%','4.4%','3.8%'],['其他','1.0%','1.0%','1.0%']]:[['市场收益','6.32%','2.41%','8.62%'],['行业配置','1.42%','0.32%','2.16%'],['个股选择','0.56%','0.21%','1.32%'],['其他','0.22%','0.22%','0.54%']])}</section>`}
function render(){
  setupHeader();
  setScale();
  charts.forEach(c=>c.dispose());
  charts=[];
  const selector=`<section class="zc-selector">${fundCards()}<div class="zc-actions">
    <button class="zc-primary" id="zc-start" ${funds.length<2?'disabled':''}>开始比较</button>
    <button class="zc-secondary" id="zc-clear">清空</button>
    ${compared?'<button class="zc-secondary" id="zc-export">导出对比</button>':''}
  </div></section>`;
  const layout=compared
    ? `<div class="zc-sticky-region"><div class="zc-sticky-panel">${selector}${controls()}</div></div>
       <div class="zc-results-card"><div class="zc-content">${content()}</div></div>`
    : `<nav class="zc-breadcrumb">公募基金 <span>›</span> 基金分析 <span>›</span> <b>基金比较</b></nav>${selector}${emptyState()}`;
  container.innerHTML=`<div class="zc-compare ${compared?'has-results':'is-empty'}${compared&&tab===1?' is-risk-tab':''}">${layout}</div>`;
  bind();
  if(compared)draw();
  if(cal&&compared)calendar();
  showTypeNotice();
  requestAnimationFrame(syncControlsLayout);
}
function isChartVisible(f,kind){return f.visible&&f.chartVisible?.[kind]!==false}
function chartLegend(kind){return `<div class="zc-chart-legend" aria-label="${kind==='return'?'收益走势':'动态回撤'}曲线显隐">${funds.map(f=>{const active=isChartVisible(f,kind);return `<button type="button" data-chart-legend="${f.id}" data-chart-kind="${kind}" aria-pressed="${active}" aria-label="${active?'隐藏':'显示'} ${f.name} 曲线" class="${active?'':'is-hidden'}" ${f.visible?'':'disabled title="请先显示基金卡片"'}><i style="background:${active?f.color:'#bdbdbd'}"></i><span>${f.name}</span></button>`}).join('')}</div>`}
const escapeTooltip=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function chartTooltip(params,kind,width){
  const rows=(Array.isArray(params)?params:[params]).filter(p=>p&&p.value!=null&&Number.isFinite(Number(p.value))&&funds.some(f=>f.name===p.seriesName&&isChartVisible(f,kind)));
  if(!rows.length)return '';
  return `<div class="zc-tip" style="width:${Math.min(283,Math.max(150,width-18))}px"><div class="zc-tip-date">${escapeTooltip(rows[0].axisValue)}</div><div class="zc-tip-rows">${rows.map(p=>{const f=funds.find(x=>x.name===p.seriesName),value=Number(p.value).toFixed(2);return `<div class="zc-tip-row"><i style="background:${f.color}"></i><span class="zc-tip-name">${escapeTooltip(f.name)}</span><span class="zc-tip-value" style="color:${f.color}">${value}</span></div>`}).join('')}</div></div>`;
}

function draw(){
  if(!compared||!window.echarts)return;
  charts.forEach(c=>c.dispose());charts=[];
  if(tab===1){
    charts=CompareRiskCharts.mount(container,riskOptions());
    return;
  }
  const first=date(start),last=date(end),day=86400000,days=Math.max(0,Math.round((last-first)/day)),count=Math.max(1,Math.min(320,days+1));
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
    const performance=times.map(t=>+(level(t,k)-base-(mode?Math.sin((+t-+first)/day*.008)*.8:0)).toFixed(2));
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
      tooltip:{trigger:'axis',confine:true,backgroundColor:'rgba(255,255,255,0.96)',borderColor:'#d9d9d9',borderWidth:1,padding:0,extraCssText:'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.08);white-space:normal;',axisPointer:{type:'line',lineStyle:{color:'#b9b8d8',type:'solid',width:1}},formatter:params=>chartTooltip(params,kind,el.clientWidth)},
      grid:{left:42,right:42,top:9,bottom:31},legend:{show:false},
      xAxis:{type:'category',boundaryGap:false,data:dateLabels,axisLine:{lineStyle:{color:'#eaeaea'}},axisTick:{show:false},axisLabel:{color:'#777',fontSize:12,hideOverlap:true,showMinLabel:true,showMaxLabel:true}},
      yAxis:{type:'value',min:yMin,max:yMax,splitNumber:days>=180?(isDrawdown?5:7):5,axisLabel:{formatter:'{value}%',fontSize:12,color:'#777'},splitLine:{lineStyle:{color:'#eaeaea',type:'dashed'}}},
      series:funds.map(f=>({name:f.name,type:'line',showSymbol:false,symbol:'circle',symbolSize:6,connectNulls:false,silent:!isChartVisible(f,kind),itemStyle:{color:f.color},emphasis:{itemStyle:{color:'#fff',borderColor:f.color,borderWidth:1}},lineStyle:{color:f.color,width:1.3,opacity:isChartVisible(f,kind)?1:0},data:isChartVisible(f,kind)?dataById.get(f.id)[isDrawdown?'drawdown':'performance']:[]}))
    });
  }
  make('zc-return-chart',false);make('zc-drawdown-chart',true);
  container.querySelectorAll('[data-chart-legend]').forEach(b=>{b.onclick=()=>{const f=funds.find(x=>x.id===b.dataset.chartLegend),kind=b.dataset.chartKind;if(!f||!f.visible)return;f.chartVisible??={return:true,drawdown:true};f.chartVisible[kind]=!isChartVisible(f,kind);const active=isChartVisible(f,kind);b.classList.toggle('is-hidden',!active);b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',`${active?'隐藏':'显示'} ${f.name} 曲线`);b.querySelector('i').style.background=active?f.color:'#bdbdbd';draw()}});
  const el=document.getElementById('zc-bar-chart');if(el){const c=echarts.init(el);charts.push(c);c.setOption({color:funds.map(f=>f.color),tooltip:{trigger:'axis'},legend:{bottom:0},grid:{left:50,right:20,bottom:65},xAxis:{type:'category',data:tab===2?['股票','债券','现金','其他']:['市场收益','行业配置','个股选择','其他']},yAxis:{type:'value',axisLabel:{formatter:'{value}%'}},series:funds.map(f=>{const i=seed.findIndex(x=>x.id===f.id);return {name:f.name,type:'bar',itemStyle:{color:f.color},data:tab===2?[[82.5,10.2,6.3,1],[0,94.6,4.4,1],[95.2,0,3.8,1],[80,12,7,1]][i]:[[6.32,1.42,.56,.22],[2.41,.32,.21,.22],[8.62,2.16,1.32,.54],[5,1,.8,.3]][i]}})})}
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
function riskContent(){
  const options=riskOptions();
  const series=CompareRiskCharts.data(options);
  return CompareRiskView.render({...options,view:riskView,series});
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
    charts.push(...CompareRiskCharts.mount(replacement,riskOptions()));
    bindRiskActions(replacement);
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
function setPeriod(v){period=v;end='2026-05-01';if(v==='共同时段')start='2025-05-02';else if(v.includes('年度')){start=v.slice(0,4)+'-01-01';end=v.slice(0,4)+'-12-31'}else if(v==='今年以来')start='2026-01-01';else {const d=date(end);d.setMonth(d.getMonth()-({'近1年':12,'近3年':36,'近1月':1,'近3月':3,'近6月':6}[v]||12));start=fmt(d)}cal=false;render()}
function bind(){
  container.querySelectorAll('[data-tab]').forEach(button=>{
    const next=Number(button.dataset.tab);
    if(next>1){
      button.setAttribute('aria-disabled','true');
      return;
    }
    button.onclick=()=>{
      if(tab===next)return;
      tab=next;
      cal=false;
      renderWithFocus('data-tab',next);
    };
  });
  container.querySelectorAll('[data-risk-unit]').forEach(button=>{
    const next=riskUnits[Number(button.dataset.riskUnit)];
    button.setAttribute('aria-pressed',String(riskUnit===next));
    button.onclick=()=>{
      if(riskUnit===next)return;
      riskUnit=next;
      cal=false;
      renderWithFocus('data-risk-unit',button.dataset.riskUnit);
    };
  });
  container.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=+b.dataset.mode;render()});
  container.querySelectorAll('[data-period]').forEach(b=>b.onclick=()=>setPeriod(b.dataset.period));
  container.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{
    funds=funds.filter(f=>f.id!==b.dataset.remove);
    if(pinned===b.dataset.remove){pinned=null;funds.sort((a,b)=>a.order-b.order)}
    if(funds.length<2){compared=false;tab=0}
    render();
  });
  container.querySelectorAll('[data-eye]').forEach(b=>b.onclick=()=>{
    const f=funds.find(f=>f.id===b.dataset.eye);
    f.visible=!f.visible;
    if(f.visible)f.chartVisible={return:true,drawdown:true};
    render();
  });
  container.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{
    pinned=pinned===b.dataset.pin?null:b.dataset.pin;
    funds.sort((a,b)=>a.order-b.order);
    if(pinned){const i=funds.findIndex(f=>f.id===pinned);funds.unshift(...funds.splice(i,1))}
    render();
  });
  container.querySelector('#zc-clear').onclick=()=>{
    funds=[];compared=false;tab=0;pinned=null;noticeUntil=0;cal=false;render();
  };
  container.querySelector('#zc-start').onclick=()=>{compared=true;cal=false;render()};
  const exportButton=container.querySelector('#zc-export');
  if(exportButton)exportButton.onclick=()=>download('基金对比.csv','\ufeff基金名称,基金代码,基金类型,起始日期,结束日期\n'+funds.map(f=>[f.name,f.code,f.type,start,end].join(',')).join('\n'),'text/csv;charset=utf-8');
  container.querySelectorAll('[data-refresh]').forEach(b=>b.onclick=()=>refreshModule(b));
  container.querySelectorAll('[data-download]').forEach(b=>b.onclick=()=>{
    if(charts[0])saveChartImage('基金收益走势',[charts[0]]);
  });
  bindSearch();
  if(!compared)return;
  if(tab===1)bindRiskActions(container);
  const more=container.querySelector('.zc-quick-wrap');
  const panel=more.querySelector('.zc-more-panel');
  const trigger=more.querySelector('#zc-more');
  const showMore=()=>{panel.hidden=false;trigger.setAttribute('aria-expanded','true')};
  trigger.onmouseenter=showMore;
  trigger.onclick=showMore;
  more.onmouseleave=()=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false')};
  container.querySelector('#zc-date').onclick=()=>{
    cal=!cal;anchor=null;hover=null;calendarMenu=null;months=[];render();
  };
}

function calendar(){
  const el=container.querySelector('#zc-calendar');
  if(!el)return;
  el.onclick=e=>e.stopPropagation();
  const monthNumber=d=>d.getFullYear()*12+d.getMonth();
  const fromMonth=n=>new Date(Math.floor(n/12),n%12,1,12);
  const lower=monthNumber(date(min)), upper=monthNumber(date(today));
  const clampLeft=n=>Math.max(lower,Math.min(Math.max(lower,upper-1),n));
  const showPair=n=>{const left=clampLeft(n);months=[fromMonth(left),fromMonth(left+1)];};
  if(!months.length)showPair(monthNumber(date(start)));
  else showPair(monthNumber(months[0]));
  const selectedStart=anchor||start,selectedEnd=anchor?(hover||anchor):end;
  const lo=selectedStart<selectedEnd?selectedStart:selectedEnd,hi=selectedStart<selectedEnd?selectedEnd:selectedStart;
  const arrow=(name)=>`<img src="./assets/compare-figma/${name}.svg" width="14" height="14" alt="">`;
  const pane=(d,i)=>{
    const y=d.getFullYear(),m=d.getMonth(),index=monthNumber(d),offset=(new Date(y,m,1).getDay()+6)%7;
    const years=Array.from({length:date(today).getFullYear()-date(min).getFullYear()+1},(_,j)=>date(min).getFullYear()+j);
    const isMenu=(type)=>calendarMenu?.side===i&&calendarMenu.type===type;
    const popup=(type)=>{
      if(!isMenu(type))return '';
      const items=type==='year'?years:Array.from({length:12},(_,j)=>j);
      return `<div class="zc-calendar-options ${type==='year'?'zc-year-options':'zc-month-options'}" role="listbox" aria-label="选择${type==='year'?'年份':'月份'}">${items.map(v=>{
        const chosen=type==='year'?v===y:v===m;
        const candidate=type==='year'?v*12+m:y*12+v;
        const allowed=type==='year'?(v*12+11>=lower+i&&v*12<=upper-(1-i)):(candidate>=lower+i&&candidate<=upper-(1-i));
        return `<button type="button" role="option" aria-selected="${chosen}" data-select-${type}="${i},${v}" ${allowed?'':'disabled'}>${type==='year'?v:(v+1)+'月'}</button>`;
      }).join('')}</div>`;
    };
    const days=Array.from({length:42},(_,j)=>{
      const dt=new Date(y,m,1-offset+j,12),s=fmt(dt),own=dt.getMonth()===m;
      const disabled=!own||s<min||s>today;
      const inRange=!disabled&&s>=lo&&s<=hi;
      const endpoint=!disabled&&(s===selectedStart||(!anchor&&s===selectedEnd));
      const startRange=inRange&&(s===lo||j%7===0||dt.getDate()===1);
      const endRange=inRange&&(s===hi||j%7===6||dt.getDate()===new Date(y,m+1,0).getDate());
      return `<button type="button" data-day="${s}" ${disabled?'disabled':''} class="${inRange?'in-range ':''}${endpoint?'endpoint ':''}${s===today?'today ':''}${startRange?'range-start ':''}${endRange?'range-end ':''}" aria-label="${s}" aria-pressed="${endpoint}"><span>${dt.getDate()}</span></button>`;
    }).join('');
    return `<div class="zc-month"><div class="zc-month-head"><div class="zc-calendar-select"><button type="button" class="zc-calendar-trigger ${isMenu('year')?'open':''}" aria-label="${i?'右':'左'}侧年份" aria-haspopup="listbox" aria-expanded="${isMenu('year')}" data-open-calendar="${i},year">${y}<span class="zc-calendar-chevron"></span></button>${popup('year')}</div><div class="zc-calendar-select"><button type="button" class="zc-calendar-trigger ${isMenu('month')?'open':''}" aria-label="${i?'右':'左'}侧月份" aria-haspopup="listbox" aria-expanded="${isMenu('month')}" data-open-calendar="${i},month">${m+1}月<span class="zc-calendar-chevron"></span></button>${popup('month')}</div><div class="zc-calendar-nav"><button type="button" aria-label="上${units[i]}" data-nav="${i},-1" ${monthNumber(months[0])<=lower?'disabled':''}>${arrow('100-4801_img')}</button><button type="button" class="zc-calendar-unit" aria-label="切换导航单位，当前按${units[i]}" data-unit="${i}">${units[i]}</button><button type="button" aria-label="下${units[i]}" data-nav="${i},1" ${monthNumber(months[1])>=upper?'disabled':''}>${arrow('100-4801_img1')}</button></div></div><div class="zc-week">${['一','二','三','四','五','六','日'].map(x=>`<span>${x}</span>`).join('')}</div><div class="zc-days">${days}</div></div>`;
  };
  el.innerHTML=months.map(pane).join('');
  el.querySelectorAll('[data-open-calendar]').forEach(b=>b.onclick=()=>{const [side,type]=b.dataset.openCalendar.split(',');calendarMenu=calendarMenu?.side===+side&&calendarMenu.type===type?null:{side:+side,type};calendar();});
  el.querySelectorAll('[data-select-year],[data-select-month]').forEach(b=>b.onclick=()=>{
    const isYear=b.hasAttribute('data-select-year'),[i,value]=(isYear?b.dataset.selectYear:b.dataset.selectMonth).split(',').map(Number);
    const d=months[i],n=isYear?value*12+d.getMonth():d.getFullYear()*12+value;
    showPair(n-i);calendarMenu=null;calendar();
  });
  el.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{const i=+b.dataset.unit;units[i]=units[i]==='月'?'年':'月';calendarMenu=null;calendar();});
  el.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const [i,n]=b.dataset.nav.split(',').map(Number);showPair(monthNumber(months[0])+n*(units[i]==='年'?12:1));calendarMenu=null;calendar();});
  el.querySelectorAll('[data-day]:not([disabled])').forEach(b=>{
    b.onclick=()=>{if(!anchor){anchor=b.dataset.day;hover=null;calendarMenu=null;calendar();}else{start=anchor<b.dataset.day?anchor:b.dataset.day;end=anchor<b.dataset.day?b.dataset.day:anchor;anchor=null;hover=null;cal=false;calendarMenu=null;period='自定义';render();}};
    b.onmouseenter=()=>{if(!anchor)return;hover=b.dataset.day;const a=anchor<hover?anchor:hover,z=anchor<hover?hover:anchor;el.querySelectorAll('[data-day]:not([disabled])').forEach(x=>{const v=x.dataset.day,d=date(v),idx=(d.getDay()+6)%7,inRange=v>=a&&v<=z;x.classList.toggle('in-range',inRange);x.classList.toggle('range-start',inRange&&(v===a||idx===0||d.getDate()===1));x.classList.toggle('range-end',inRange&&(v===z||idx===6||d.getDate()===new Date(d.getFullYear(),d.getMonth()+1,0).getDate()));});};
  });
  const menu=el.querySelector('.zc-calendar-options');if(menu){const item=menu.querySelector('[aria-selected="true"]');if(item)menu.scrollTop=Math.max(0,item.offsetTop-2*item.offsetHeight);}
}
function syncControlsLayout(){const control=container?.querySelector('.zc-controls'),tabs=control?.querySelector('.zc-tabs'),filters=control?.querySelector('.zc-filters');if(!tabs||!filters)return;control.classList.remove('is-wrapped');const t=tabs.getBoundingClientRect(),f=filters.getBoundingClientRect();control.classList.toggle('is-wrapped',f.top>=t.bottom-1)}
window.addEventListener('resize',()=>{setScale();requestAnimationFrame(syncControlsLayout);charts.forEach(c=>c.resize())});
document.addEventListener('click',e=>{
  if(cal&&container?.isConnected&&!e.target.closest('.zc-date-wrap')){
    cal=false;
    anchor=null;
    // Keep the focused fund search field mounted when the date panel is dismissed.
    const button=container.querySelector('#zc-date');
    const panel=container.querySelector('#zc-calendar');
    if(button&&panel){
      panel.hidden=true;
      button.classList.remove('open');
      button.setAttribute('aria-expanded','false');
      button.querySelector('img').src=dateIcon(false);
    }
  }
  if(!e.target.closest('.zc-search-slot'))container?.querySelectorAll('.zc-search-results').forEach(r=>r.hidden=true);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cal){cal=false;render()}});
function setScale(){document.documentElement.style.setProperty('--zc-scale',document.documentElement.clientWidth>=1000?Math.min(1,document.documentElement.clientWidth/1440):1)}
const F='./assets/compare-final/';
const finalImg=(name,w,h=w)=>`<img src="${F+name}.svg" width="${w}" height="${h}" alt="">`;
function emptyState(){return `<div class="zc-design-empty"><div class="zc-illustration"><div class="zc-illustration-art">${['img','img1','img2','img3','img4','img5','img6'].map((name,i)=>`<span class="zc-art-layer layer-${i}">${finalImg('51-57569_'+name,...[[194.643,113.882],[196.574,17.418],[84.2461,73.9375],[82.1133,67.0059],[25.8981,47.9883],[26.0381,26.0381],[16.1738,14.9297]][i])}${i===5?'<span class="zc-badge-plus"><i></i><i></i></span>':''}</span>`).join('')}</div></div><p>请选择 <strong>2–4只</strong> 基金进行比较</p></div>`}
function showTypeNotice(restart=false){if(new Set(funds.map(f=>f.type)).size<2){noticeUntil=0;clearTimeout(noticeTimer);return}if(restart)noticeUntil=Date.now()+3000;const remaining=noticeUntil-Date.now();if(remaining<=0)return;clearTimeout(noticeTimer);document.querySelector('.zc-type-notice')?.remove();const n=document.createElement('div');n.className='zc-type-notice';n.setAttribute('role','status');n.innerHTML=`<span class="zc-warning">!</span><span>您选择了不同类型的基金，建议同类型基金对比更具有参考意义。</span><button aria-label="关闭提示">${img('47-50726_imgFrame2036082637')}</button>`;container.querySelector('.zc-selector').before(n);n.querySelector('button').onclick=()=>{noticeUntil=0;clearTimeout(noticeTimer);n.remove()};noticeTimer=setTimeout(()=>{noticeUntil=0;n.remove()},remaining)}
function bindSearch(){container.querySelectorAll('[data-search]').forEach(search=>{const result=container.querySelector(`[data-results="${search.dataset.search}"]`);function highlight(value,q){const fragment=document.createDocumentFragment();let pos=0,lower=value.toLowerCase(),at=q?lower.indexOf(q):-1;while(at!==-1){fragment.append(document.createTextNode(value.slice(pos,at)));const strong=document.createElement('strong');strong.textContent=value.slice(at,at+q.length);fragment.append(strong);pos=at+q.length;at=lower.indexOf(q,pos)}fragment.append(document.createTextNode(value.slice(pos)));return fragment}function results(){container.querySelectorAll('.zc-search-results').forEach(r=>r.hidden=true);const q=search.value.trim().toLowerCase();const matches=seed.filter(f=>!funds.some(x=>x.id===f.id)&&(!q||`${f.name}${f.code}${f.type}${f.abbr}`.toLowerCase().includes(q)));result.hidden=false;result.replaceChildren();search.setAttribute('aria-expanded','true');if(!matches.length){const empty=document.createElement('div');empty.className='zc-search-no-results';empty.textContent='暂无匹配基金';result.append(empty);return}matches.forEach(f=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','option');for(const [field,cl]of [['code','code'],['name','name'],['type','type']]){const span=document.createElement('span');span.className=cl;span.append(highlight(f[field],q));b.append(span)}b.onclick=e=>{e.stopPropagation();funds.push({...f,visible:true,order:sequence++});render();showTypeNotice(true)};result.append(b)})}search.setAttribute('aria-haspopup','listbox');result.setAttribute('role','listbox');search.oninput=results;search.onfocus=results;search.onkeydown=e=>{if(e.key==='Escape'){result.hidden=true;search.setAttribute('aria-expanded','false')}if(e.key==='Enter')result.querySelector('button')?.click();if(e.key==='ArrowDown'){e.preventDefault();result.querySelector('button')?.focus()}}})}
function setupHeader(){let h=document.getElementById('zc-header');if(h)return;const original=document.querySelector('header.app-topbar');h=original.cloneNode(true);h.id='zc-header';h.classList.add('zc-header');h.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));const brand=h.querySelector('.app-brand');brand.innerHTML=`<span class="zc-brand-crop"><img src="${F}51-57380_imgImage5.png" alt="智君科技"></span>`;h.querySelectorAll('.app-nav .nav-caret').forEach(el=>{el.outerHTML=`<span class="zc-nav-arrow">${finalImg('51-57380_imgFrame2036082628',12)}</span>`});h.querySelector('.app-actions').innerHTML=`<button type="button" class="zc-global-search" aria-label="全局搜索">${finalImg('51-57380_imgFrame',20)}<span>搜索基金、组合或报告</span></button><div class="zc-header-icons"><a href="./visual-system.html" aria-label="视觉系统">${finalImg('51-57380_imgFrame1',20)}</a><button aria-label="设置">${finalImg('51-57380_imgFrame2',20)}</button><button aria-label="帮助">${finalImg('51-57380_imgFrame3',20)}</button></div><span class="zc-header-divider"></span><button class="zc-user" aria-label="个人中心">${finalImg('51-57380_imgFrame2036083101',32)}<span>孟豆豆</span>${finalImg('51-57380_imgDown',16)}</button>`;h.querySelectorAll('.app-nav .nav-link').forEach(e=>e.classList.toggle('is-active',e.dataset.routeNav==='fund-research'));h.querySelectorAll('[data-route-leaf]').forEach(e=>e.classList.toggle('is-active',e.dataset.routeLeaf==='compare'));h.querySelector('.zc-global-search').onclick=()=>container.querySelector('[data-search]')?.focus();original.after(h)}
window.CompareView={render(el){container=el;render()}};
})();
