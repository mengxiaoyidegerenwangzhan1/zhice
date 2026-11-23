(() => {
  'use strict';

  const etfs = [
    ['510300','沪深300ETF','宽基','沪深300',3625.70,12.36,0.58,-9.31],
    ['510050','上证50ETF','宽基','上证50',1280.34,10.15,0.41,-8.12],
    ['510500','中证500ETF','宽基','中证500',973.21,15.72,0.76,-12.68],
    ['588000','科创50ETF','宽基','科创50',795.48,21.48,1.32,-18.22],
    ['512480','半导体ETF','行业主题','中证全指半导体',281.60,26.31,1.85,-23.46],
    ['510880','红利ETF','策略','上证红利',198.35,8.26,-0.33,-6.53],
    ['518880','黄金ETF','商品','黄金现货',369.02,17.44,-0.82,-10.39],
    ['511010','国债ETF','债券','上证5年期国债',93.85,2.83,0.05,-1.24],
    ['513100','纳指ETF','跨境','纳斯达克100',129.51,16.93,0.91,-15.80]
  ];
  const activeFunds = [
    ['023616','博时中证800指数增强A','股票型','中证800',2.51,11.87,0.43,-11.48],
    ['023617','博时中证800指数增强C','股票型','中证800',1.78,11.54,0.42,-11.51],
    ['023905','中欧上证科创板综合指数A','股票型','科创综指',3.15,18.21,1.29,-18.44],
    ['023968','博时创业板50指数增强A','股票型','创业板50',2.36,14.52,0.96,-16.28],
    ['600001','均衡精选混合','混合型','股债混合基准',12.80,8.26,0.26,-6.43],
    ['600002','稳健成长混合','混合型','股债混合基准',7.54,6.14,0.18,-4.18],
    ['600003','核心优选股票','股票型','中证800',23.63,10.52,-0.31,-9.67],
    ['600004','稳健纯债精选','债券型','中债综合财富',18.65,3.25,0.03,-1.30],
    ['600005','全球成长精选','QDII','全球股票基准',6.42,12.73,0.67,-13.81]
  ];
  const indices = [
    ['000300','沪深300','宽基','沪深300',3952.61,11.92,0.56,-9.12],
    ['000016','上证50','宽基','上证50',2712.13,9.81,0.40,-8.06],
    ['000905','中证500','宽基','中证500',5782.58,15.83,0.78,-12.53],
    ['000688','科创50','宽基','科创50',1083.22,21.56,1.34,-18.17],
    ['000015','上证红利','策略','上证红利',3196.32,8.73,-0.31,-6.23]
  ];
  const asRecords = rows => rows.map(([id,name,type,benchmark,size,performance,daily,drawdown])=>({id,name,type,benchmark,size,performance,daily,drawdown}));
  const etfRecords=asRecords(etfs), fundRecords=asRecords(activeFunds), indexRecords=asRecords(indices);
  const pages=new Map([
    ['ETF总览',etfRecords],['ETF筛选',etfRecords],['ETF排行榜',etfRecords],['指数行情',indexRecords],['基金筛选',fundRecords]
  ]);
  const states=new Map();
  function stateFor(page) {
    if(!states.has(page))states.set(page,{query:'',type:'全部',sort:page==='ETF排行榜'?'performance':'asSent',chosen:new Set(),filtersOpen:true,details:''});
    return states.get(page);
  }
  const esc=v=>String(v).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const pct=x=>(x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(2)+'%';
  const tone=x=>x>0?'fp-rise':x<0?'fp-fall':'';
  function filtered(page) {
    const state=stateFor(page),term=state.query.trim().toLowerCase();
    const rows=pages.get(page).filter(row=>(state.type==='全部'||row.type===state.type) &&
      [row.id,row.name,row.benchmark].some(value=>value.toLowerCase().includes(term)));
    if(state.sort!=='asSent')rows.sort((a,b)=>b[state.sort]-a[state.sort]);
    return rows;
  }
  function context(page) {
    const rows=pages.get(page)||[];
    const state=stateFor(page);
    const matches=rows.length?filtered(page):[];
    const funds=rows.filter(r=>state.chosen.has(r.id)).map(r=>({...r}));
    return {period:'近1年',funds,matched:matches.length,matchedRows:funds.length?[]:matches,filter:state.type,query:state.query.trim()};
  }
  const isFilter=page=>page==='基金筛选'||page==='ETF筛选';
  function filterPanel(page) {
    const s=stateFor(page), library=pages.get(page);
    const labels=['全部',...new Set(library.map(row=>row.type))];
    return '<aside class="fp-filters"'+(s.filtersOpen?'':' hidden')+'><div class="fp-section-title"><h3>筛选条件</h3><button type="button" data-fp="collapse" class="fp-iconbtn" aria-label="收起筛选条件" title="收起筛选条件">‹</button></div>'+
      '<label class="fp-search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="m12 12 5 5"/></svg><input aria-label="搜索基金" type="search" value="'+esc(s.query)+'" placeholder="基金代码、名称或跟踪指数"></label>'+
      '<div class="fp-filter-title">基础分类</div><span class="fp-muted">'+(page==='基金筛选'?'基金类型':'ETF 类型')+'</span><div class="fp-type-list">'+labels.map(type=>'<button type="button" data-fp="type" data-type="'+type+'" aria-pressed="'+(s.type===type)+'">'+type+'</button>').join('')+'</div><button type="button" data-fp="reset" class="fp-reset">重置条件</button></aside>';
  }
  function overview(page) {
    if(page!=='ETF总览'&&page!=='指数行情')return '';
    const rows=pages.get(page), up=rows.filter(r=>r.daily>0).length;
    let metrics=page==='ETF总览'?[['跟踪 ETF',rows.length,'只'],['合计规模',rows.reduce((s,r)=>s+r.size,0).toLocaleString('zh-CN',{maximumFractionDigits:2}),'亿元'],['今日上涨',up,'只']]:
      [['跟踪指数',rows.length,'个'],['上涨指数',up,'个'],['下跌指数',rows.filter(r=>r.daily<0).length,'个']];
    return '<div class="fp-metrics">'+metrics.map(([name,value,unit])=>'<div><span>'+name+'</span><b>'+value+'<small>'+unit+'</small></b></div>').join('')+'</div>';
  }
  function sortControl(page) {
    const s=stateFor(page), sortOptions=[['asSent','默认排序'],['performance','近1年收益'],['daily','日涨跌幅'],['drawdown','最大回撤（最小跌幅优先）']];
    if(page!=='指数行情')sortOptions.push(['size','基金规模']);
    return '<label class="fp-sort">排序<select aria-label="排序指标" data-fp-sort>'+sortOptions.map(([id,title])=>'<option value="'+id+'"'+(s.sort===id?' selected':'')+'>'+title+'</option>').join('')+'</select></label>';
  }
  function tableBlock(page) {
    const rows=filtered(page), s=stateFor(page), index=page==='指数行情', isRank=page==='ETF排行榜';
    const allSelected=rows.length>0&&rows.every(r=>s.chosen.has(r.id));
    const unit=index?'个':'只';
    const rowsHTML=rows.map((r,i)=>{
      const selected=s.chosen.has(r.id),expanded=s.details===r.id;
      return '<tr'+(selected?' class="fp-selected"':'')+'><td><input type="checkbox" data-fp-pick="'+r.id+'" aria-label="选择'+r.name+'"'+(selected?' checked':'')+'></td>'+
        (isRank?'<td class="fp-rank">'+(i+1)+'</td>':'')+
        '<th scope="row"><button type="button" class="fp-fund-name" data-fp="'+(index?'details':'open-fund')+'" data-id="'+r.id+'"'+(index?' aria-expanded="'+expanded+'"':'')+'>'+esc(r.name)+'</button><small>'+r.id+'</small></th>'+
        '<td>'+r.type+'</td><td class="fp-digit">'+r.size.toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})+'</td><td class="fp-digit '+tone(r.daily)+'">'+pct(r.daily)+'</td><td class="fp-digit '+tone(r.performance)+'">'+pct(r.performance)+'</td><td class="fp-digit fp-fall">'+pct(r.drawdown)+'</td></tr>'+
        (expanded?'<tr class="fp-detail"><td colspan="'+(isRank?8:7)+'">'+(index?'指数分类':'比较基准')+'　<strong>'+esc(index?r.type:r.benchmark)+'</strong></td></tr>':'');
    }).join('');
    return '<div class="fp-table-head"><div class="fp-results"><span>'+ (isFilter(page)?'筛选结果':isRank?'ETF 排行':index?'指数列表':'ETF 列表')+'</span><strong>'+rows.length+'</strong><span>'+unit+'</span></div><div class="fp-actions">'+sortControl(page)+'<button type="button" data-fp="analyze" class="fp-analyze" '+(!s.chosen.size?'disabled title="先勾选要分析的项目"':'')+'>AI 分析'+(s.chosen.size?' · '+s.chosen.size:'')+'</button></div></div>'+
      (s.chosen.size?'<div class="fp-selected-status">已选择 '+s.chosen.size+unit+
        (!index && s.chosen.size>=2?'<button type="button" class="fp-compare" data-fp="compare"'+(s.chosen.size>4?' disabled':'')+'>基金比较（'+s.chosen.size+'）</button>'+(s.chosen.size>4?'<span>最多可比较 4 只</span>':''):'')+
        '<button type="button" data-fp="clear">清除选择</button></div>':'')+
      '<div class="fp-scroll"><table><thead><tr><td><input type="checkbox" data-fp-select-all aria-label="全选筛选结果"'+(allSelected?' checked':'')+(!rows.length?' disabled':'')+'></td>'+
      (isRank?'<th>排名</th>':'')+'<th>'+(index?'指数名称':'基金简称')+'</th><th>类型</th><th class="fp-digit">'+(index?'最新点位':'规模（亿元）')+'</th><th class="fp-digit">日涨跌幅</th><th class="fp-digit">近1年收益</th><th class="fp-digit">近1年最大回撤</th></tr></thead><tbody>'+rowsHTML+'</tbody></table></div>'+
      (!rows.length?'<div class="fp-empty">暂无匹配结果<button type="button" data-fp="reset">重置条件</button></div>':'');
  }
  function render(page) {
    const s=stateFor(page);
    if(!pages.has(page))return '';
    return '<div class="fund-pages" data-fund-page="'+esc(page)+'"><div class="fp-content">'+(isFilter(page)?filterPanel(page):'')+'<div class="fp-main">'+
      (isFilter(page)&&!s.filtersOpen?'<button type="button" class="fp-filter-opener" data-fp="expand">筛选条件'+(s.type!=='全部'?' · '+s.type:'')+'</button>':'')+
      overview(page)+'<section class="fp-table-box" aria-label="数据列表">'+tableBlock(page)+'</section><div class="fp-footnote">交互示例数据</div></div></div></div>';
  }
  function bind(host,page,onChange) {
    if(!pages.has(page))return;
    const root=host.matches?.('.fund-pages')?host:host.querySelector('.fund-pages');
    if(!root)return;
    const s=stateFor(page);
    const selectedInView=filtered(page).filter(r=>s.chosen.has(r.id)).length;
    const selectAll=root.querySelector('[data-fp-select-all]');
    if(selectAll)selectAll.indeterminate=selectedInView>0&&!selectAll.checked;
    function notify(){if(typeof onChange==='function')onChange(context(page));}
    function refresh() {
      root.querySelector('.fp-table-box').innerHTML=tableBlock(page);
      root.querySelectorAll('[data-fp="type"]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.type===s.type)));
      const selectAll=root.querySelector('[data-fp-select-all]');
      if(selectAll){const n=filtered(page).filter(r=>s.chosen.has(r.id)).length;selectAll.indeterminate=n>0&&n<filtered(page).length;}
      notify();
    }
    root.oninput=event=>{
      if(event.target.matches('input[type="search"]')){s.query=event.target.value;refresh();}
    };
    root.onchange=event=>{
      const el=event.target;
      if(el.matches('[data-fp-sort]'))s.sort=el.value;
      else if(el.matches('[data-fp-pick]')){
        if(el.checked)s.chosen.add(el.dataset.fpPick);else s.chosen.delete(el.dataset.fpPick);
      }else if(el.hasAttribute('data-fp-select-all')){
        filtered(page).forEach(r=>{if(el.checked)s.chosen.add(r.id);else s.chosen.delete(r.id);});
      }else return;
      const selector=el.matches('[data-fp-sort]')?'[data-fp-sort]':el.hasAttribute('data-fp-select-all')?'[data-fp-select-all]':'[data-fp-pick="'+el.dataset.fpPick+'"]';
      refresh();root.querySelector(selector)?.focus({preventScroll:true});
    };
    root.onclick=event=>{
      const button=event.target.closest('button[data-fp]');if(!button)return;
      const action=button.dataset.fp;
      if(action==='open-fund'){
        const fund=pages.get(page).find(r=>r.id===button.dataset.id);
        if(fund)window.dispatchEvent(new CustomEvent('study-open-fund',{detail:{...fund,period:'近1年'}}));
        return;
      }
      if(action==='compare'){
        const funds=context(page).funds;
        if(funds.length>=2&&funds.length<=4)window.dispatchEvent(new CustomEvent('study-compare-funds',{detail:{funds}}));
        return;
      }
      if(action==='analyze'){window.dispatchEvent(new CustomEvent('study-request-analysis',{detail:{page,...context(page)}}));return;}
      if(action==='collapse'||action==='expand'){
        s.filtersOpen=action==='expand';
        const parent=root.parentElement;root.outerHTML=render(page);bind(parent,page,onChange);
        parent.querySelector('[data-fp="'+(s.filtersOpen?'collapse':'expand')+'"]')?.focus({preventScroll:true});return;
      }
      if(action==='type')s.type=button.dataset.type;
      if(action==='reset'){s.type='全部';s.query='';const field=root.querySelector('input[type="search"]');if(field)field.value='';}
      if(action==='clear')s.chosen.clear();
      if(action==='details')s.details=s.details===button.dataset.id?'':button.dataset.id;
      refresh();
      if(action==='details')root.querySelector('[data-fp="details"][data-id="'+button.dataset.id+'"]')?.focus({preventScroll:true});
    };
  }
  function mentionedFunds(text){
    const codes=new Set(text.match(/\d{6,}/g) || []);
    return [...fundRecords,...etfRecords].filter(f=>codes.has(f.id) || text.includes(f.name));
  }
  window.studyFundsPages={supports:page=>pages.has(page),render,bind,context,mentionedFunds};
})();
