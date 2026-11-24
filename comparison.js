window.fundComparison = (function createComparison(initialFunds, reference) {
  "use strict";

  const day = 86400000;
  const firstDay = Date.parse("2023-11-07T00:00:00Z");
  const commonDay = Date.parse("2025-11-06T00:00:00Z");
  const lastDay = Date.parse("2026-11-07T00:00:00Z");
  const dayCount = Math.round((lastDay - firstDay) / day);
  const commonIndex = Math.round((commonDay - firstDay) / day);
  const dateAt = index => new Date(firstDay + index * day).toISOString().slice(0, 10);
  const indexOfDate = date => Math.round((Date.parse(date + "T00:00:00Z") - firstDay) / day);
  const rangeDays={"近1个月":30,"近3个月":91,"近6个月":182,"近1年":365,"近3年":dayCount};
  const referenceStart=indexOfDate(reference?.start),referenceEnd=indexOfDate(reference?.end);
  const dated=Number.isInteger(referenceStart) && Number.isInteger(referenceEnd) &&
    referenceStart>=0 && referenceEnd>=referenceStart && referenceEnd<=dayCount;
  const period=Object.hasOwn(rangeDays,reference?.period) || (dated && reference.period==="自定义")
    ? reference.period : "共同任期";
  const snapshotEnd=dated ? referenceEnd : dayCount;
  const snapshotStart=dated ? referenceStart : Math.max(0,snapshotEnd-(rangeDays[period] ?? (dayCount-commonIndex)));
  const tabs = ["产品概览比较", "收益与风险比较", "资产配置比较", "收益归因比较"];
  const assets = ["股票", "债券", "现金及其他"];
  const classes = ["权益资产", "固定收益", "现金及其他"];
  const funds = [
    {id:"a500", code:"023514", name:"宝盈中证A500指数增强A", full:"宝盈中证A500指数增强A", color:"#9693cc", type:"指数增强", risk:9.8, gain:8.6, weights:[92,2,6], anchors:[0,4,-1,2,-3,6,7,14,11,16,9,7,11,6,8.6]},
    {id:"bond", code:"007970", name:"国寿安保安泽纯债", full:"国寿安保安泽纯债39个月定期开放债券", color:"#90b9cc", type:"纯债型", risk:1.6, gain:4.1, weights:[0,96,4], anchors:[0,.8,.6,1.3,1,1.8,2.3,2,2.8,3.1,2.4,3.6,3.5,3.9,4.1]},
    {id:"nasdaq", code:"161130", name:"易方达纳斯达克100ETF联接", full:"易方达纳斯达克100ETF联接（QDII-LOF）", color:"#d3bd84", type:"QDII 指数型", risk:12.4, gain:5.2, weights:[95,0,5], anchors:[0,2,-1,0,-4,1,-2,6,3,7,0,4,1,8,5.2]},
    {id:"hs300", code:"510300", name:"华泰柏瑞沪深300ETF", full:"华泰柏瑞沪深300ETF", color:"#cd9cad", type:"宽基 ETF", risk:11.3, gain:6.7, weights:[97,0,3], anchors:[0,3,2,-2,1,4,7,4,8,10,9,5,3,8,6.7]},
    {id:"dividend", code:"510880", name:"华泰柏瑞红利ETF", full:"华泰柏瑞上证红利ETF", color:"#8bad94", type:"红利 ETF", risk:6.8, gain:7.5, weights:[96,0,4], anchors:[0,1,.6,2,3,4,2,4,6,3,5,4,6,7,7.5]}
  ];
  const defaultIds=funds.slice(0,3).map(f=>f.id);
  const selectedIds=[];
  const colors=funds.map(f=>f.color);
  for(const record of initialFunds || []){
    if(selectedIds.length===4 || selectedIds.includes(record.id))continue;
    const {id,name,type,performance:gain,drawdown}=record;
    if(!/^\d{6}$/.test(id) || !name || !Number.isFinite(gain) || !Number.isFinite(drawdown))continue;
    const nativeIndex=funds.findIndex(f=>f.code===id);
    const original=funds[nativeIndex];
    const fund={
      id,code:id,name,full:original?.full||name,type,risk:Math.abs(drawdown),gain,
      color:colors[selectedIds.length],weights:original?.weights,record,
      anchors:[0,.18,.23,.14,.32,.43,.38,.57,.61,.75,.68,.8,.89,.95,1].map(fraction=>fraction*gain)
    };
    if(original)funds[nativeIndex]=fund;
    else funds.push(fund);
    selectedIds.push(id);
  }
  const byId = new Map(funds.map(f => [f.id, f]));

  // Anchor paths produce repeatable sample NAVs. Charts, extrema and the AI context share these NAVs.
  function samplePrices(fund, seed) {
    const prices = [];
    let high = 100;
    const sampleStart=fund.record ? snapshotStart : commonIndex;
    const sampleEnd=fund.record ? snapshotEnd : dayCount;
    const duration=sampleEnd-sampleStart;
    const stressAt=sampleStart+Math.round(duration*[.72,.51,.74,.58,.69][seed%5]);
    const stressRadius=Math.max(1,Math.min(15,stressAt-sampleStart,sampleEnd-stressAt));
    for (let i = 0; i < sampleStart; i++) {
      const x = i / sampleStart;
      const wave = Math.sin(x * 22 + seed) + Math.sin(x * 39 + seed) * .45 + Math.sin(x * 150) * .2;
      prices.push(100 * (1 + (x - 1) * fund.gain / 110 + Math.sin(Math.PI*x) * wave * fund.risk / 215));
    }
    for (let i = sampleStart; i <= sampleEnd; i++) {
      const t = (i - sampleStart) / Math.max(1,duration) * (fund.anchors.length - 1);
      const segment = Math.min(fund.anchors.length - 2, Math.floor(t));
      const part = t - segment;
      const noise = Math.sin(i * .59 + seed) * .52 + Math.sin(i * .19 + seed * 2) + Math.sin(i * 1.79 + seed) * .29;
      let price = 100 + fund.anchors[segment] * (1-part) + fund.anchors[segment+1] * part +
        noise * Math.sin(Math.PI * part) * fund.risk * .12;
      if(!fund.record)high = Math.max(high, price);
      const bottom = high * (1 - fund.risk / 100);
      const weight = duration<2 ? 0 : Math.max(0, 1 - Math.abs(i - stressAt) / stressRadius);
      price = Math.max(bottom, price * (1 - weight) + bottom * weight);
      high = Math.max(high, price);
      prices.push(price);
    }
    if(sampleEnd<dayCount){
      const close=prices[sampleEnd];
      for(let i=sampleEnd+1;i<=dayCount;i++){
        const span=(i-sampleEnd)/365;
        prices.push(close*(1+(span*fund.gain+Math.sin(span*10)*fund.risk*.2)/100));
      }
    }
    return prices;
  }
  funds.forEach((fund, index) => { fund.prices = samplePrices(fund, fund.record?Math.floor(Number(fund.code)/10)%5:index); });

  const state = {
    selected:selectedIds.length?selectedIds:defaultIds, pinned:selectedIds[0]||defaultIds[0], hidden:new Set(), tab:tabs[0],
    period,start:dateAt(snapshotStart),end:dateAt(snapshotEnd),picker:false
  };
  const escape = value => String(value).replace(/[&<>"']/g, char =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  const num = value => Number(value.toFixed(2));
  const pct = value => (value>0?"+":value<0?"−":"")+Math.abs(value).toFixed(2)+"%";
  const assetsByIcon = {
    eye:"eye", pin:"pin", pinned:"pinned", calendar:"calendar",
    refresh:"refresh", download:"download-chart", table:"download-table"
  };
  const paths = {
    hidden:'<path d="m3 3 18 18M9 6.4c6.4-1.5 11.9 5.6 11.9 5.6a20 20 0 0 1-3.5 3.8M6.2 7.5C4.1 9 2.2 12 2.2 12s3.3 6 9.8 6a12 12 0 0 0 3-.5"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>', chevron:'<path d="m6 9 6 6 6-6"/>'
  };
  const icon = name => assetsByIcon[name] ?
    '<img class="fc-icon" src="./icons/compare-'+assetsByIcon[name]+'.svg" alt="">' :
    '<svg class="fc-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">'+paths[name]+'</svg>';
  function series(fund) {
    const start = indexOfDate(state.start), end = indexOfDate(state.end);
    const prices = fund.prices.slice(start,end+1);
    let peak = prices[0], peakIndex=0, worstPeak=0, worstTrough=0;
    let maximumDrawdown=0, variance=0, mean=0;
    const performance=[], drawdowns=[];
    prices.forEach((price,index)=>{
      if(price>=peak){peak=price;peakIndex=index;}
      performance.push((price/prices[0]-1)*100);
      const loss=(price/peak-1)*100;
      drawdowns.push(loss);
      if(loss<maximumDrawdown){maximumDrawdown=loss;worstPeak=peakIndex;worstTrough=index;}
      if(index){
        const change=price/prices[index-1]-1;
        const delta=change-mean;
        mean+=delta/index; variance+=delta*(change-mean);
      }
    });
    return {performance,drawdowns,maximumDrawdown:num(maximumDrawdown),gain:num(performance.at(-1)),
      peakDate:dateAt(start+worstPeak),troughDate:dateAt(start+worstTrough),
      volatility:num(Math.sqrt(variance/Math.max(1,prices.length-2))*Math.sqrt(252)*100)};
  }
  function context() {
    return {period:state.period,start:state.start,end:state.end,funds:state.selected.map(id=>{
      const fund=byId.get(id), s=series(fund);
      return {id,name:fund.name,color:fund.color,drawdown:s.maximumDrawdown,performance:s.gain,peakDate:s.peakDate,troughDate:s.troughDate,volatility:s.volatility,hidden:state.hidden.has(id)};
    })};
  }
  // Resolve identities from the catalogue, independently of the user's current chart settings.
  function catalogueRecord(fund){
    return {...fund.record,id:fund.code,name:fund.name,type:fund.type,performance:fund.gain,drawdown:-fund.risk};
  }
  function findFund(value){
    const fund=funds.find(f=>f.code===value || f.id===value || f.name===value || f.full===value);
    return fund ? catalogueRecord(fund) : undefined;
  }
  function mentionedFunds(text){
    const codes=new Set(text.match(/\d{6,}/g) || []);
    return funds.filter(f=>codes.has(f.code) || text.includes(f.name) || text.includes(f.full)).map(catalogueRecord);
  }
  function openFund(id){
    const fund=byId.get(id), stats=series(fund);
    const detail={...fund.record,id:fund.code,name:fund.name,type:fund.type,period:state.period,
      start:state.start,end:state.end,performance:stats.gain,drawdown:stats.maximumDrawdown};
    window.dispatchEvent(new CustomEvent('study-open-fund',{detail}));
  }
  function iconButton(action, id, title, glyph, selected=false){
    return '<button type="button" class="fc-icon-button'+(selected?' is-active':'')+'" data-fc="'+action+'" data-id="'+id+'" title="'+escape(title)+'" aria-label="'+escape(title)+'">'+icon(glyph)+'</button>';
  }
  function fundPicker(){
    const v3=document.documentElement.dataset.prototype==="v3";
    const count='<small>'+state.selected.length+'/4</small>';
    const header=v3 ? '<header class="zc-modal-header"><h3 class="zc-modal-title">比较基金 '+count+'</h3>'+
      '<button type="button" class="zc-modal-close" data-fc="close-picker" aria-label="关闭基金选择" title="关闭基金选择"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg></button></header>' : '<h3>比较基金 '+count+'</h3>';
    const content='<label class="fc-search-field">'+icon("search")+'<input type="search" data-fc-query aria-label="搜索基金名称或代码" placeholder="搜索基金名称或代码" autocomplete="off"></label>'+
      '<div data-fc-results>'+fundOptions("")+'</div>';
    return '<div class="fc-picker'+(v3?' zc-modal':'')+'" role="dialog" aria-label="比较基金管理">'+header+
      (v3?'<div class="zc-modal-body">'+content+'</div>':content)+'</div>';
  }
  function fundStrip(){
    const cards=state.selected.map(id=>{
      const f=byId.get(id), pin=state.pinned===id, hide=state.hidden.has(id);
      return '<div class="fc-fund'+(pin?' fc-reference':'')+'" style="--series:'+f.color+'">'+
        '<i class="fc-mark"></i><button type="button" class="fc-fund-name" data-fc="open-fund" data-id="'+id+'" title="'+escape(f.full)+'">'+escape(f.name)+'</button>'+
        '<span class="fc-fund-actions">'+iconButton("pin",id,pin?'取消参照：'+f.name:'钉为参照：'+f.name,pin?"pinned":"pin",pin)+
        iconButton("hide",id,(hide?'显示':'隐藏')+'曲线：'+f.name,hide?'hidden':'eye',!hide)+'</span></div>';
    }).join('');
    return '<div class="fc-strip"><b class="fc-logo">基金 <img src="./icons/compare-pk.svg" alt="PK"></b>'+cards+
      '<div class="fc-add-wrap"><button type="button" class="fc-add" data-fc="picker" aria-label="添加基金" title="添加基金" aria-haspopup="dialog" aria-expanded="'+state.picker+'"><span>请输入</span>'+icon("search")+'</button>'+
      (state.picker?fundPicker():'')+'</div></div>';
  }
  function fundOptions(query){
    const term=query.trim().toLowerCase();
    const matches=funds.filter(f=>(f.name+f.full+f.code).toLowerCase().includes(term));
    return matches.map(f=>{
      const included=state.selected.includes(f.id), disabled=included?state.selected.length===1:state.selected.length>=4;
      return '<button type="button" data-fc="select-fund" data-id="'+f.id+'" aria-pressed="'+included+'"'+(disabled?' disabled':'')+'>'+
        '<i class="fc-check">'+(included?'✓':'')+'</i><span>'+escape(f.name)+'</span><small>'+f.code+'</small></button>';
    }).join('') || '<div class="fc-no-results">未找到匹配的基金</div>';
  }
  function dateInput(side){
    const first=side==="start";
    return '<label class="fc-date-field"><span aria-hidden="true">'+state[side]+'</span><input aria-label="比较'+(first?'开始':'结束')+'日期" type="date" data-fc-date="'+side+'" min="'+(first?dateAt(0):state.start)+'" max="'+(first?state.end:dateAt(dayCount))+'" value="'+state[side]+'"></label>';
  }
  function periodControls(){
    return '<div class="fc-controls"><div class="fc-periods">'+["共同任期","近1年","近3年"].map(p=>
      '<button type="button" data-fc="period" data-period="'+p+'" aria-pressed="'+(state.period===p)+'">'+p+'</button>').join('')+
      '<label class="fc-more-range">'+(["近1个月","近3个月","近6个月","自定义"].includes(state.period)?state.period:'更多')+icon('chevron')+
      '<select data-fc-range aria-label="更多比较时段"><option value="">选择时段</option><option>近1个月</option><option>近3个月</option><option>近6个月</option><option>自定义</option></select></label></div>'+
      '<div class="fc-date-range">'+icon('calendar')+dateInput("start")+'<span>至</span>'+dateInput("end")+'</div></div>';
  }

  function plotData(type){
    const sets=state.selected.filter(id=>!state.hidden.has(id)).map(id=>{
      const f=byId.get(id), s=series(f);
      return {id,name:f.name,color:f.color,values:type==='drawdown'?s.drawdowns:s.performance};
    });
    const values = sets.flatMap(f=>f.values);
    const min=Math.min(0,...values), max=Math.max(0,...values);
    const raw=(max-min)/4;
    const mag=10**Math.floor(Math.log10(raw||1));
    const step=([1,2,2.5,5,10].find(x=>x>=raw/mag)||10)*mag;
    const low=Math.min(-step,Math.floor(min/step)*step);
    const high=type==='drawdown'?0:Math.max(step,Math.ceil(max/step)*step);
    return {sets,low,high,step};
  }
  const graphWidth=900, graphHeight=220;
  const xFor=(i,n)=>i*graphWidth/Math.max(1,n-1);
  const yFor=(value,scale)=>(scale.high-value)*graphHeight/(scale.high-scale.low);
  function linePath(values,scale){
    return values.map((v,i)=>(i?'L':'M')+xFor(i,values.length).toFixed(1)+' '+yFor(v,scale).toFixed(1)).join('');
  }
  function chart(type){
    const data=plotData(type), title=type==='drawdown'?'动态回撤':'收益走势';
    const levels=[], axes=[];
    const count=Math.round((data.high-data.low)/data.step);
    for(let i=0;i<=count;i++){
      const value=data.high-i*data.step, pos=i*100/count;
      levels.push('<line vector-effect="non-scaling-stroke" x1="0" x2="'+graphWidth+'" y1="'+(pos*2.2)+'" y2="'+(pos*2.2)+'" class="fc-gridline'+(Math.abs(value)<.0001?' fc-zero':'')+'"/>');
      axes.push('<span style="top:'+pos+'%">'+num(value)+'%</span>');
    }
    const plots=data.sets.map(f=>'<path vector-effect="non-scaling-stroke" stroke="'+f.color+'" d="'+linePath(f.values,data)+'" fill="none" stroke-width="'+(f.id===state.pinned?1.7:1.35)+'"/>').join('');
    const dates=Array.from({length:6},(_,i)=>dateAt(indexOfDate(state.start)+Math.round((indexOfDate(state.end)-indexOfDate(state.start))*i/5)));
    return '<section class="fc-chart" data-chart="'+type+'"><h4>'+title+'</h4><div class="fc-graph-frame"><div class="fc-axis-y">'+axes.join('')+'</div>'+
      '<div class="fc-plot" aria-label="'+title+'"><svg viewBox="0 0 '+graphWidth+' '+graphHeight+'" preserveAspectRatio="none" role="img" aria-label="'+title+'图">'+levels.join('')+plots+'</svg>'+
      (!data.sets.length?'<div class="fc-no-lines">点击下方基金名称显示曲线</div>':'')+
      '<div class="fc-guide" hidden></div></div></div><div class="fc-axis-x">'+dates.map(d=>'<span>'+d+'</span>').join('')+'</div>'+
      '<div class="fc-legend">'+state.selected.map(id=>{const f=byId.get(id);return '<button type="button" data-fc="hide" data-id="'+id+'" aria-pressed="'+!state.hidden.has(id)+'" title="'+escape(f.full)+'">'+
        '<i style="background:'+f.color+'"></i>'+escape(f.name)+'</button>';}).join('')+'</div><div class="fc-tip" hidden></div></section>';
  }
  function comparisonTable(headers,rows){
    return '<div class="fc-table-wrap"><table><thead><tr>'+headers.map(h=>'<th scope="col">'+h+'</th>').join('')+'</tr></thead><tbody>'+
      rows.map(cells=>'<tr>'+cells.map((v,i)=>i?'<td>'+v+'</td>':'<th scope="row">'+v+'</th>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const fundLabel=f=>'<button type="button" data-fc="open-fund" data-id="'+f.id+'" class="fc-table-fund" title="'+escape(f.full)+'"><i style="background:'+f.color+'"></i>'+escape(f.name)+'</button>';
  function riskTable(){
    return comparisonTable(["基金简称","区间收益","最大回撤","年化波动率"],state.selected.map(id=>{
      const f=byId.get(id),s=series(f);return [fundLabel(f),pct(s.gain),pct(s.maximumDrawdown),s.volatility.toFixed(2)+"%"];
    }));
  }
  function assetTable(){
    return comparisonTable(["基金简称",...assets],state.selected.map(id=>{
      const f=byId.get(id);return [fundLabel(f),...(f.weights?f.weights.map(w=>w.toFixed(1)+'%'):['—','—','—'])];
    }));
  }
  function attributionTable(){
    return comparisonTable(["基金简称",...classes,"区间收益"],state.selected.map(id=>{
      const f=byId.get(id), gain=series(f).gain;
      if(!f.weights)return [fundLabel(f),'—','—','—',pct(gain)];
      const bond=f.weights[1]===0?0:num(gain*(f.weights[1]/100)), cash=num(gain*f.weights[2]/100);
      const equity=num(gain-bond-cash);
      return [fundLabel(f),pct(equity),pct(bond),pct(cash),pct(gain)];
    }));
  }
  function sectionBody(){
    if(state.tab===tabs[0])return chart("returns")+chart("drawdown");
    if(state.tab===tabs[1])return riskTable()+chart("drawdown");
    if(state.tab===tabs[2])return '<div class="fc-bars">'+state.selected.map(id=>{
      const f=byId.get(id);
      if(!f.weights)return '<div><span>'+escape(f.name)+'</span><small>暂无资产分布数据</small></div>';
      return '<div><span>'+escape(f.name)+'</span><div class="fc-bar">'+f.weights.map((w,i)=>'<i style="width:'+w+'%;background:'+['#9a95ce','#9ebace','#d4c8a8'][i]+'" title="'+assets[i]+' '+w+'%"></i>').join('')+'</div></div>';
    }).join('')+'</div>'+assetTable();
    return attributionTable();
  }
  function render(){
    const sectionTitles=["业绩走势","收益与风险指标","资产分布","资产收益贡献"];
    return '<div class="fc-root">'+fundStrip()+'<div class="fc-tabs" role="tablist" aria-label="基金比较维度">'+tabs.map(t=>
      '<button type="button" role="tab" data-fc="tab" data-tab="'+t+'" aria-selected="'+(state.tab===t)+'">'+t+'</button>').join('')+'</div>'+
      '<section class="fc-body" role="tabpanel"><div class="fc-heading"><h3>'+sectionTitles[tabs.indexOf(state.tab)]+'</h3>'+
      '<span class="fc-help" tabindex="0" aria-label="比较数据说明">?<span>按所选基金与区间展示交互示例数据。</span></span>'+
      '<span class="fc-tools">'+iconButton("export","","下载当前图表或表格",state.tab===tabs[0]?"download":"table")+iconButton("refresh","","刷新比较","refresh")+'</span></div>'+
      (state.tab===tabs[2]?'<div class="fc-snapshot">资产分布 · 示例报告期 2026 年三季度</div>':periodControls())+
      sectionBody()+'<p class="fc-footnote">交互示例数据</p><span class="fc-notice" aria-live="polite"></span></section></div>';
  }
  function chooseRange(period){
    if(period==="自定义") return;
    state.period=period;
    state.end=dateAt(dayCount);
    state.start=period==="共同任期"?dateAt(commonIndex):dateAt(Math.max(0,dayCount-rangeDays[period]));
  }
  function showPoint(node,data,clientX){
    const plot=node.querySelector(".fc-plot"), tip=node.querySelector(".fc-tip"), guide=node.querySelector(".fc-guide");
    if(!data.sets.length)return;
    const bounds=plot.getBoundingClientRect(), frame=node.getBoundingClientRect();
    const total=data.sets[0].values.length;
    const i=Math.max(0,Math.min(total-1,Math.round((clientX-bounds.left)/Math.max(1,bounds.width)*(total-1))));
    const left=i/Math.max(1,total-1)*bounds.width;
    guide.hidden=false;guide.style.left=left+'px';
    guide.innerHTML=data.sets.map(set=>'<i style="top:'+yFor(set.values[i],data)/graphHeight*100+'%;border-color:'+set.color+'"></i>').join('');
    tip.hidden=false;
    tip.innerHTML='<strong>'+dateAt(indexOfDate(state.start)+i)+'</strong>'+data.sets.map(set=>'<div><i style="background:'+set.color+'"></i><span>'+escape(set.name)+'</span><b>'+pct(set.values[i])+'</b></div>').join('');
    const desired=bounds.left-frame.left+left+12;
    tip.style.left=Math.max(0,desired+tip.offsetWidth<frame.width?desired:bounds.left-frame.left+left-tip.offsetWidth-12)+'px';
    tip.style.top=Math.min(bounds.top-frame.top+15,Math.max(15,node.clientHeight-tip.offsetHeight-20))+'px';
  }
  function bindPlots(node){
    node.querySelectorAll('[data-chart]').forEach(chartEl=>{
      const plot=chartEl.querySelector(".fc-plot"), data=plotData(chartEl.dataset.chart);
      const clear=()=>{chartEl.querySelector(".fc-tip").hidden=true;chartEl.querySelector(".fc-guide").hidden=true;};
      plot.onpointermove=e=>showPoint(chartEl,data,e.clientX);
      plot.onpointerleave=clear;
    });
  }
  function download(node){
    let output,type,ext;
    if(state.tab===tabs[0]){
      const plot=node.querySelector('.fc-plot svg').cloneNode(true);
      plot.setAttribute('xmlns','http://www.w3.org/2000/svg');plot.setAttribute('width','900');plot.setAttribute('height','220');
      plot.querySelectorAll('line').forEach(line=>line.setAttribute('stroke','#e5e7eb'));
      plot.querySelectorAll('path,line').forEach(sh=>sh.removeAttribute('vector-effect'));
      const visible=state.selected.filter(id=>!state.hidden.has(id)).map(id=>byId.get(id));
      const caption=visible.map((f,i)=>'<text x="16" y="'+(283+i*19)+'" fill="'+f.color+'">'+escape(f.name)+'</text>').join('');
      output='<svg xmlns="http://www.w3.org/2000/svg" width="932" height="'+(295+visible.length*19)+'" font-family="sans-serif" font-size="12"><rect width="100%" height="100%" fill="white"/><text x="16" y="22">收益走势 · '+state.start+' 至 '+state.end+'</text><g transform="translate(16 38)">'+plot.outerHTML+'</g>'+caption+'</svg>';
      type="image/svg+xml;charset=utf-8";ext="svg";
    }else{
      const table=node.querySelector("table");
      output="\uFEFF"+[...table.rows].map(row=>[...row.cells].map(cell=>'"'+cell.textContent.replaceAll('"','""')+'"').join(",")).join("\r\n");
      type="text/csv;charset=utf-8";ext="csv";
    }
    const a=document.createElement("a"),url=URL.createObjectURL(new Blob([output],{type}));
    a.href=url;a.download="基金比较-"+state.tab+"."+ext;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function bind(host,onChange){
    if(!host)return;
    let node=host.matches('.fc-root')?host:host.querySelector(".fc-root");
    if(!node)return;
    const exitPicker=()=>{
      if(!state.picker)return;
      state.picker=false;
      node.querySelector('.fc-picker')?.remove();
      node.querySelector('[data-fc="picker"]')?.setAttribute('aria-expanded','false');
    };
    // A click or Tab leaving the add-fund menu closes it without losing the chart's scroll position.
    node.onfocusout=e=>{
      if(e.target.closest('.fc-add-wrap') && !e.relatedTarget?.closest?.('.fc-add-wrap')) exitPicker();
    };
    const refresh=(focusSelector, notify = true)=>{
      const temp=document.createElement('template');
      temp.innerHTML=render();
      const next=temp.content.firstElementChild;
      node.onfocusout=null;
      node.replaceWith(next); node=next;
      bind(node,onChange);
      if(focusSelector)node.querySelector(focusSelector)?.focus({preventScroll:true});
      if(notify && typeof onChange==="function")onChange(context());
    };
    node.onclick=e=>{
      const b=e.target.closest('button[data-fc]');
      if(!b){
        if(!e.target.closest('.fc-add-wrap'))exitPicker();
        if(e.target.hasAttribute("data-fc-date")){try{e.target.showPicker();}catch{}}
        return;
      }
      const action=b.dataset.fc, id=b.dataset.id;
      if(action==="close-picker"){
        exitPicker();
        node.querySelector('[data-fc="picker"]')?.focus({preventScroll:true});
        return;
      }
      if(action!=="picker" && action!=="select-fund")exitPicker();
      if(action==="open-fund"){openFund(id);return;}
      if(action==="picker"){
        state.picker=!state.picker;
        refresh(state.picker?'[data-fc-query]':'[data-fc="picker"]',false);
        return;
      }
      if(action==="select-fund"){
        if(state.selected.includes(id)){
          if(state.selected.length===1)return;
          state.selected=state.selected.filter(k=>k!==id); state.hidden.delete(id);
          if(state.pinned===id)state.pinned=state.selected[0];
        }else if(state.selected.length<4 && byId.has(id)){
          const entry=byId.get(id);
          const used=new Set(state.selected.map(key=>byId.get(key).color));
          if(used.has(entry.color))entry.color=colors.find(color=>!used.has(color));
          state.selected.push(id);
        }
        state.picker=false; refresh('[data-fc="picker"]');return;
      }
      if(action==="pin"){
        if(state.pinned===id)state.pinned="";
        else{state.pinned=id;state.selected=[id,...state.selected.filter(k=>k!==id)];}
        refresh('[data-fc="pin"][data-id="'+id+'"]');return;
      }
      if(action==="hide"){
        if(state.hidden.has(id))state.hidden.delete(id);else state.hidden.add(id);
        refresh();return;
      }
      if(action==="tab"){state.tab=b.dataset.tab;refresh('[data-tab="'+state.tab+'"]',false);return;}
      if(action==="period"){chooseRange(b.dataset.period);refresh('[data-period="'+state.period+'"]');return;}
      if(action==="export"){download(node);return;}
      if(action==="refresh"){
        refresh();node.querySelector('.fc-notice').textContent='已刷新';setTimeout(()=>{const notice=node.querySelector('.fc-notice');if(notice)notice.textContent='';},1600);
      }
    };
    node.onkeydown=e=>{
      if(e.key==='Escape' && state.picker){
        e.preventDefault();e.stopPropagation();exitPicker();node.querySelector('[data-fc="picker"]')?.focus();
      }
    };
    node.oninput=e=>{
      if(e.target.hasAttribute("data-fc-query"))node.querySelector("[data-fc-results]").innerHTML=fundOptions(e.target.value);
    };
    node.onchange=e=>{
      if(e.target.hasAttribute("data-fc-range")){
        const next=e.target.value;
        if(next==="自定义"){const input=node.querySelector('[data-fc-date="start"]');input.focus();try{input.showPicker();}catch{}return;}
        if(next){chooseRange(next);refresh('[data-fc-range]');}
      }
      if(e.target.hasAttribute("data-fc-date")){
        const side=e.target.dataset.fcDate,v=e.target.value;
        if(!v||!e.target.validity.valid){e.target.value=state[side];return;}
        state[side]=v;state.period="自定义";refresh('[data-fc-date="'+side+'"]');
      }
    };
    bindPlots(node);
  }
  return {render,bind,context,findFund,mentionedFunds,create:createComparison};
})();
