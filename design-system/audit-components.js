// Components reconciled against the Figma component specification page.
function auditSelectMarkup(cascade = false, titlePosition = '') {
  const label = cascade ? '基准' : '分布';
  const value = cascade ? 'A股指数 / 规模指数 / 上证规模指数 / 上证综指' : '行业分布 - 申万行业分类';
  const tree = cascade ? [
    {label:'A股指数',children:[
      {label:'规模指数',children:[{label:'上证规模指数',children:['上证综指','上证180','上证50','上证380','科创50']},{label:'深证规模指数',children:['深证成指','深证100']},{label:'中证规模指数',children:['沪深300','中证500','中证1000']}]},
      {label:'行业指数',children:['申万行业指数','中证行业指数']},{label:'风格指数',children:['成长指数','价值指数']}]},
    {label:'债券指数',children:['中债综合指数','中证全债指数']},{label:'基金指数',children:['股票基金指数','混合基金指数']},{label:'商品指数',children:['商品综合指数']},{label:'港股指数',children:['恒生指数','恒生科技指数']}
  ] : ['行业分布 - 申万行业分类','行业分布 - 中信行业分类','行业分布 - 中证行业分类','行业分布 - 证监会行业分类','板块分布'];
  return '<div class="audit-select-row">'+(titlePosition==='outside'?'<span class="audit-field-label">'+label+'</span>':'')+'<div class="audit-select" data-tree="'+esc(JSON.stringify(tree))+'" data-selection="'+(cascade?'0,0,0,0':'0')+'"><button type="button" class="audit-select-trigger" aria-haspopup="listbox" aria-expanded="false" style="width:'+(cascade?(titlePosition==='inside'?416:343):(titlePosition==='inside'?320:280))+'px">'+(titlePosition==='inside'?'<span class="audit-field-label">'+label+'</span>':'')+'<span class="audit-select-value">'+value+'</span><img src="assets/audit/20df2.svg" width="12" height="12" alt=""></button></div></div>';
}

function auditTableMarkup(levels) {
  const value = values => values.map(v=>'<td class="audit-number'+(/^[−-]\d/.test(v)?' negative':'')+'">'+v+'</td>').join('');
  const row = (label, values, options = {}) => {
    const {id='',parent='',level=0,open=false,total=false}=options;
    return '<tr class="audit-level-'+level+(total?' audit-total':'')+'"'+(parent?' data-parent="'+parent+'"':'')+(id?' data-node="'+id+'"':'')+'><td>'+(id?'<button type="button" data-row-toggle="'+id+'" aria-expanded="'+open+'"><img src="assets/audit/2a444.svg" width="14" height="14" alt=""><span class="audit-row-label">'+label+'</span></button>':label)+'</td>'+value(values)+'</tr>';
  };
  let rows = '';
  if (levels === 2) {
    rows += row('2026年 · 今年以来',['0.72%','0.72%','0.72%','0.72%'],{id:'year26',total:true});
    rows += row('1月',['0.72%','0.72%','0.72%','0.72%'],{parent:'year26',level:1});
    rows += row('2025年 · 年度收益',['0.72%','0.72%','0.72%','0.72%'],{id:'year25',total:true});
    rows += row('12月',['…','…','…','…'],{parent:'year25',level:1});
  } else {
    rows += row('总收益',['6.63%','6.63%','--',''],{id:'total',open:true,total:true});
    rows += row('全A因子',['5.07%','5.07%','--',''],{parent:'total',level:1});
    rows += row('风格因子',['3.46%','3.46%','--',''],{id:'style',parent:'total',level:1,open:true});
    [['贝塔','2.54%'],['动量','−0.55%'],['规模','2.64%'],['盈利','−0.82%'],['波动','−0.39%'],['成长','0.06%'],['价值','0.33%'],['杠杆','−0.02%'],['流动性','−0.38%'],['中盘','0.06%']].forEach(([label,v])=>{rows+=row(label,[v,v,'--',''],{parent:'style',level:2});});
    rows += row('行业因子',['0.24%','0.24%','--',''],{id:'industry',parent:'total',level:1});
    rows += row('行业明细',['…','…','--',''],{parent:'industry',level:2});
    rows += row('个股选择',['−2.13%','−2.13%','--',''],{parent:'total',level:1});
    rows += row('主动性收益',['6.26%','6.26%','--',''],{id:'active',open:true,total:true});
    rows += row('全A因子',['0%','0%','--',''],{parent:'active',level:1});
    rows += row('风格因子',['4.87%','4.87%','--',''],{id:'active-style',parent:'active',level:1});
    rows += row('风格明细',['…','…','--',''],{parent:'active-style',level:2});
    rows += row('行业因子',['1.52%','1.52%','--',''],{id:'active-industry',parent:'active',level:1});
    rows += row('行业明细',['…','…','--',''],{parent:'active-industry',level:2});
    rows += row('个股选择',['−0.12%','−0.12%','--',''],{parent:'active',level:1});
  }
  return '<div class="audit-table-scroll"><table class="audit-table"><thead><tr><th>'+(levels===2?'时间':'收益因子')+'</th><th>嘉实中证1000指数增强A</th><th>嘉实养老目标日期2030三年持有期混合(FOF)A</th><th>基金三 · 完整名称示例</th><th>名称较长的基金四 · 自动折行完整展示示例</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

function auditRangeMarkup() {
  return '<div class="audit-range" data-start="0" data-end="100"><div class="audit-range-track"><img src="assets/audit/eec75.svg" alt="图表缩略趋势" width="640" height="260"><div class="audit-range-selection"><button type="button" class="audit-range-handle start" role="slider" aria-label="区间起点" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></button><button type="button" class="audit-range-handle end" role="slider" aria-label="区间终点" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><span></span></button></div></div></div>';
}

function auditRuntime(root = document) {
  function closeMenus() {
    root.querySelectorAll('.audit-menu').forEach(menu=>menu.remove());
    root.querySelectorAll('.audit-select-trigger').forEach(button=>{button.setAttribute('aria-expanded','false');button.querySelector('img').src='assets/audit/20df2.svg';});
  }
  function drawMenu(select, path) {
    select.querySelector('.audit-menu')?.remove();
    const menu=document.createElement('div');
    menu.className='audit-menu';
    menu.setAttribute('role','group');
    menu.setAttribute('aria-label','选择选项');
    let items=JSON.parse(select.dataset.tree),depth=0;
    while (items) {
      const column=document.createElement('div');column.className='audit-menu-column';
      column.setAttribute('role','listbox');column.setAttribute('aria-label','第'+(depth+1)+'级');
      items.forEach((item,index)=>{
        const label=typeof item==='string'?item:item.label;
        const selected=path[depth]===index;
        const button=document.createElement('button');button.type='button';button.className='audit-menu-option';
        button.setAttribute('role','option');button.setAttribute('aria-selected',String(selected));
        button.dataset.depth=depth;button.dataset.index=index;
        button.innerHTML='<span>'+label+'</span>'+(typeof item==='object'?'<img width="12" height="12" src="assets/audit/06b99.svg" alt="">':selected?'<img width="12" height="12" src="assets/audit/2b0ea.svg" alt="">':'');
        column.append(button);
      });
      menu.append(column);
      const selected=items[path[depth]];
      items=selected&&typeof selected==='object'?selected.children:null;
      depth++;
    }
    select.append(menu);
    select.dataset.browse=path.join(',');
    const trigger=select.querySelector('.audit-select-trigger');
    trigger.setAttribute('aria-expanded','true');trigger.querySelector('img').src='assets/audit/dc355.svg';
    const box=trigger.getBoundingClientRect();
    if (window.innerHeight-box.bottom<menu.offsetHeight+12 && box.top>menu.offsetHeight+12) menu.classList.add('above');
    const overflow=menu.getBoundingClientRect().right-window.innerWidth+16;
    if(overflow>0)menu.style.left=Math.max(-box.left+16,-overflow)+'px';
  }
  function updateRows(table) {
    const all=Array.from(table.querySelectorAll('tbody tr'));
    const byId=new Map(all.filter(row=>row.dataset.node).map(row=>[row.dataset.node,row]));
    all.forEach(row=>{
      let parent=byId.get(row.dataset.parent),visible=true;
      while(parent){if(parent.querySelector('[data-row-toggle]').getAttribute('aria-expanded')!=='true')visible=false;parent=byId.get(parent.dataset.parent);}
      row.hidden=!visible;
    });
  }
  function updateRange(range) {
    const start=Number(range.dataset.start),end=Number(range.dataset.end);
    const selection=range.querySelector('.audit-range-selection');
    selection.style.left=start+'%';selection.style.right=(100-end)+'%';
    range.querySelector('.start').setAttribute('aria-valuenow',start);
    range.querySelector('.end').setAttribute('aria-valuenow',end);
    range.querySelector('.start').setAttribute('aria-valuemax',end-1);
    range.querySelector('.end').setAttribute('aria-valuemin',start+1);
  }
  root.querySelectorAll('.audit-table').forEach(updateRows);
  root.querySelectorAll('.audit-range').forEach(updateRange);
  root.addEventListener('click',event=>{
    const trigger=event.target.closest('.audit-select-trigger');
    const option=event.target.closest('.audit-menu-option');
    if(trigger&&!trigger.disabled){const select=trigger.closest('.audit-select'),open=trigger.getAttribute('aria-expanded')==='true';closeMenus();if(!open)drawMenu(select,select.dataset.selection.split(',').map(Number));}
    else if(option){
      const select=option.closest('.audit-select'),depth=Number(option.dataset.depth),index=Number(option.dataset.index);
      const path=select.dataset.browse.split(',').filter(Boolean).map(Number).slice(0,depth);path.push(index);
      let items=JSON.parse(select.dataset.tree),item,labels=[];
      path.forEach(i=>{item=items[i];labels.push(typeof item==='string'?item:item.label);items=typeof item==='object'?item.children:null;});
      if(items)drawMenu(select,path);
      else{select.dataset.selection=path.join(',');const text=labels.join(' / ');select.querySelector('.audit-select-value').textContent=text;select.querySelector('.audit-select-trigger').title=text;closeMenus();select.dispatchEvent(new CustomEvent('change',{bubbles:true,detail:{value:labels}}));}
    } else if(!event.target.closest('.audit-select,.actions'))closeMenus();
    const toggle=event.target.closest('tr[data-node]')?.querySelector('[data-row-toggle]');
    if(toggle){toggle.setAttribute('aria-expanded',String(toggle.getAttribute('aria-expanded')!=='true'));updateRows(toggle.closest('table'));}
  });
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape'){const active=root.querySelector('.audit-select-trigger[aria-expanded="true"]');closeMenus();active?.focus();}
    const trigger=event.target.closest('.audit-select-trigger');
    if(trigger&&event.key==='ArrowDown'){event.preventDefault();closeMenus();drawMenu(trigger.closest('.audit-select'),trigger.closest('.audit-select').dataset.selection.split(',').map(Number));trigger.closest('.audit-select').querySelector('.audit-menu-option')?.focus();}
    const option=event.target.closest('.audit-menu-option');
    if(option&&['ArrowDown','ArrowUp','Home','End','ArrowRight'].includes(event.key)){
      event.preventDefault();const options=Array.from(option.parentElement.children);let index=options.indexOf(option);
      if(event.key==='ArrowRight'){const select=option.closest('.audit-select');option.click();select.querySelector('.audit-menu-column:last-child button')?.focus();return;}
      index=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[index].focus();
    }
    const handle=event.target.closest('.audit-range-handle');
    if(handle&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();const range=handle.closest('.audit-range'),side=handle.classList.contains('start')?'start':'end';
      let v=Number(range.dataset[side]);v=event.key==='Home'?0:event.key==='End'?100:v+(event.key==='ArrowRight'?1:-1);
      range.dataset[side]=Math.max(side==='start'?0:Number(range.dataset.start)+1,Math.min(side==='start'?Number(range.dataset.end)-1:100,v));updateRange(range);
    }
  });
  root.querySelectorAll('.audit-range-handle').forEach(handle=>{
    handle.addEventListener('pointerdown',event=>{
      if(handle.disabled)return;event.preventDefault();handle.setPointerCapture(event.pointerId);
      const range=handle.closest('.audit-range'),side=handle.classList.contains('start')?'start':'end';
      const move=e=>{const box=range.querySelector('.audit-range-track').getBoundingClientRect();let v=Math.round((e.clientX-box.left)/box.width*100);range.dataset[side]=Math.max(side==='start'?0:Number(range.dataset.start)+1,Math.min(side==='start'?Number(range.dataset.end)-1:100,v));updateRange(range);};
      const stop=()=>{handle.removeEventListener('pointermove',move);range.dispatchEvent(new CustomEvent('change',{bubbles:true,detail:{start:Number(range.dataset.start),end:Number(range.dataset.end)}}));};
      handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',stop,{once:true});handle.addEventListener('pointercancel',stop,{once:true});
    });
  });
}

function installAuditedComponents() {
  const spec=(rows,note,node)=>'<dl class="component-rule-list">'+rows.map(row=>'<div><dt>'+row[0]+'</dt><dd>'+row[1]+'</dd></div>').join('')+'</dl><p class="component-rule-note">'+note+'</p><a target="_blank" rel="noreferrer" href="'+base+node+'">查看 Figma 源组件 ↗</a>';
  function add(container,name,html,documentation) {
    const sample=document.createElement('div');sample.className='individual-component-sample';sample.innerHTML=html;container.append(sample);addIndividualActions(sample,name,documentation);
  }
  const selectStack=document.querySelector('.select-control-demo');selectStack.replaceChildren();
  const selectSpec=spec([['触发器','高32px / 圆角20px'],['宽度','普通154px起；级联188px起'],['内边距','左右12px'],['菜单','圆角8px / 内边距8px / 行高32px'],['选中','浅紫底 #F5F5FF / #6865A7'],['字体','14px 苹方 Regular']],'普通菜单选择后回填并收起。级联父级仅浏览，末级确认；重开恢复路径。下方空间不足时向上展开，Esc或点击外部关闭且保留原值。','206-9185');
  for(const cascade of [false,true])for(const position of ['', 'inside'])add(selectStack,(cascade?'级联选择器':'普通下拉')+(position==='inside'?' · 内置标题':position==='outside'?' · 前置标题':''),auditSelectMarkup(cascade,position),selectSpec);
  const tableSection=document.querySelector('.table-spec');
  tableSection.replaceChildren();const heading=document.createElement('div');heading.className='original-spec-heading';heading.innerHTML='<h3>表格</h3>';tableSection.append(heading);
  const tables=document.createElement('div');tables.className='audit-table-examples';tableSection.append(tables);
  const tableSpec=spec([['首列宽度','120px'],['行高','最小45px，内容完整折行'],['内边距','左右12px / 上下10px / 内间距6px'],['字体','普通14px Regular；汇总14px Medium；三级12px Regular'],['缩进','一级12px / 二级32px / 三级52px'],['背景','首列及汇总 #F7F8FA；三级 #F4F4FC'],['对齐','文字左对齐 / 数值右对齐'],['数值','Roboto；负数 #36B397']],'点击汇总行展开或收起，各组独立；表头固定，表体最大420px滚动。示例数值沿用Figma；未提供的明细显示“…”。','285-10025');
  const ordinary='<div class="audit-table-scroll"><table class="audit-table"><thead><tr><th>指标</th><th>本基金</th><th>同类平均</th><th>排名</th></tr></thead><tbody><tr><td>标准差</td><td class="audit-number">44.19%</td><td class="audit-number">30.67%</td><td class="audit-number">128 / 860</td></tr><tr><td>最大回撤</td><td class="audit-number negative">-27.00%</td><td class="audit-number negative">-19.88%</td><td class="audit-number">316 / 860</td></tr><tr><td>夏普比率</td><td class="audit-number">1.3371</td><td class="audit-number">1.1086</td><td class="audit-number">92 / 860</td></tr></tbody></table></div>';
  add(tables,'普通表格',ordinary,tableSpec);
  add(tables,'二级层级表格',auditTableMarkup(2),tableSpec);
  add(tables,'三级层级表格',auditTableMarkup(3),tableSpec);
  const distribution = '<div class="audit-table-scroll"><table class="audit-table"><thead><tr><th>统计项 / 收益率区间</th><th>嘉实中证1000指数增强A</th><th>嘉实养老目标日期2030三年持有期混合(FOF)A</th></tr></thead><tbody>' +
    '<tr class="audit-total" data-node="positive"><td><button data-row-toggle="positive" aria-expanded="false"><img src="assets/audit/2a444.svg" width="14" height="14" alt=""><span class="audit-row-label">正收益期（&gt;0）</span></button></td><td class="audit-number">56.25%（27期）</td><td class="audit-number">52.08%（25期）</td></tr>' +
    '<tr class="audit-level-1" data-parent="positive"><td>正收益区间明细…</td><td>…</td><td>…</td></tr>' +
    '<tr class="audit-total" data-node="nonpositive"><td><button data-row-toggle="nonpositive" aria-expanded="false"><img src="assets/audit/2a444.svg" width="14" height="14" alt=""><span class="audit-row-label">非正收益期（≤0）</span></button></td><td class="audit-number">43.75%（21期）</td><td class="audit-number">47.92%（23期）</td></tr>' +
    '<tr class="audit-level-1" data-parent="nonpositive"><td>−18% ～ −13%</td><td class="audit-number">6.25%（3期）</td><td class="audit-number">0.00%（0期）</td></tr>' +
    '<tr class="audit-level-1" data-parent="nonpositive"><td>−13% ～ −8%</td><td class="audit-number">2.08%（1期）</td><td class="audit-number">2.08%（1期）</td></tr>' +
    '<tr class="audit-level-1" data-parent="nonpositive"><td>其余非正收益区间…</td><td>…</td><td>…</td></tr>' +
    '<tr><td>有效月度样本</td><td class="audit-number">48期</td><td class="audit-number">48期</td></tr></tbody></table></div>';
  add(tables,'二级层级表格 · 收益分布',distribution,tableSpec);

  add(tables,'合计行','<table class="audit-table"><tbody><tr class="audit-total"><td>合计</td><td class="audit-number">0.00%</td><td class="audit-number">0.00%</td><td class="audit-number">—</td><td></td></tr></tbody></table>',tableSpec);
  tables.querySelectorAll('th,td').forEach(cell => {
    if (cell.classList.contains('audit-number')) return;
    const walker=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT);
    const textNodes=[];
    while(walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(textNode=>{
      const parts=textNode.textContent.split(/(\d+(?:\.\d+)?)/g);
      if(parts.length===1)return;
      const fragment=document.createDocumentFragment();
      parts.forEach((part,index)=>{
        if(index%2){const span=document.createElement('span');span.className='audit-numeral';span.textContent=part;fragment.append(span);}
        else fragment.append(document.createTextNode(part));
      });
      textNode.replaceWith(fragment);
    });
  });
  const rangeSection=document.createElement('article');rangeSection.className='component-spec';rangeSection.dataset.catalogId='chart-range';rangeSection.innerHTML='<div class="original-spec-heading"><h3>图表时间范围选择器</h3></div><div class="audit-range-example"></div>';
  document.getElementById('content').append(rangeSection);
  add(rangeSection.querySelector('.audit-range-example'),'图表时间范围选择器',auditRangeMarkup(),spec([['高度','40px'],['宽度','自适应，最小320px'],['左右预留','12px'],['手柄','命中区24 × 24px；可见8 × 16px'],['选区','边框 #B8C8DA；填充 #D8E0EA / 42%']],'拖动左右手柄修改区间，键盘方向键微调；缩放容器保留起止比例。','160-5759'));
  document.querySelectorAll('.top-wrap').forEach(w=>{w.style.cssText='';const img=w.querySelector('img');img.src='assets/audit/bb45f.svg';img.width=16.067;img.height=19.342;});
  const floating=document.querySelector('#floating-top img');floating.src='assets/audit/bb45f.svg';floating.width=16.067;floating.height=19.342;
  pages.top.spec=[['组件外框','60 × 60px'],['按钮容器','50 × 50px'],['圆角','99px'],['图形','16.067 × 19.342px'],['显示规则','滚动超过一屏显示']];
  const rangeHeading=rangeSection.querySelector('.original-spec-heading');
  rangeHeading.remove();
  const subheading=rangeSection.querySelector('h4');
  const rangeTitle=document.createElement('h3');rangeTitle.textContent=subheading.textContent;subheading.replaceWith(rangeTitle);
  auditRuntime();styleComponentActions();
}
installAuditedComponents();
