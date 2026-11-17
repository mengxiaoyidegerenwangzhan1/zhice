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

function auditTableMarkup() {
  function row(note, label, value, level, id = '', parent = '') {
    const parentAttribute = parent ? ` data-parent="${parent}"` : '';
    const labelMarkup = id ? `<button type="button" data-row-toggle="${id}" aria-expanded="true"><img src="assets/audit/2a444.svg" width="14" height="14" alt=""><span class="audit-row-label">${label}</span></button>` : label;
    return `<tr class="audit-table-caption"${parentAttribute}><td colspan="5">${note}</td></tr>
      <tr class="${level}"${id ? ` data-node="${id}"` : ''}${parentAttribute}>
        <th scope="row">${labelMarkup}</th>
        <td class="audit-number">${value}</td>
        <td class="audit-number">${value}</td>
        <td class="audit-number">--</td>
        <td></td>
      </tr>`;
  }

  return `<div class="audit-table-scroll" role="region" aria-label="简洁表格示例" tabindex="0">
    <table class="audit-table">
      <colgroup><col class="audit-label-column"><col span="4"></colgroup>
      <thead>
        <tr class="audit-table-caption"><td colspan="5">表头</td></tr>
        <tr class="audit-table-header">
          <th scope="col">收益 / 因子</th>
          <th scope="col">宝盈中证A500指数增强 A</th>
          <th scope="col">国寿安保安泽纯债39个月定期开放债券 A</th>
          <th scope="col">易方达纳斯达克100ETF联接(QDII-LOF) A</th>
          <th scope="col" aria-label="预留基金列"></th>
        </tr>
      </thead>
      <tbody>
        ${row('汇总行', '总收益', '6.63%', 'audit-total', 'total')}
        ${row('一级', '全A因子', '5.07%', 'audit-level-1', '', 'total')}
        ${row('一级 · 可展开', '风格因子', '3.46%', 'audit-level-1', 'style', 'total')}
        ${row('二级', '贝塔', '2.54%', 'audit-level-2', '', 'style')}
      </tbody>
    </table>
  </div>`;
}

function auditFlatTableMarkup(name, columns, rows, numericColumns = false) {
  const columnHeader = label => `<th scope="col">${esc(label)}</th>`;

  return `<div class="audit-table-scroll audit-table-flat-preview" role="region" aria-label="${esc(name)}示例" tabindex="0">
    <table class="audit-table audit-table-flat${numericColumns ? ' audit-table-numeric' : ''}">
      <thead>
        <tr class="audit-table-header">${columns.map(columnHeader).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map(({label, values, total}) => `<tr${total ? ' class="audit-total"' : ''}>
          <th scope="row">${esc(label)}</th>
          ${values.map(value => `<td class="${/^[+−-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?%?$/.test(value) ? 'audit-number' : 'audit-value-text'}">${esc(value)}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
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
  const spec=(rows,note,node)=>'<dl class="component-rule-list">'+rows.map(row=>'<div><dt>'+row[0]+'</dt><dd>'+row[1]+'</dd></div>').join('')+'</dl><p class="component-rule-note">'+note+'</p>'+(node?'<a target="_blank" rel="noreferrer" href="'+base+node+'">查看 Figma 源组件 ↗</a>':'');
  function add(container,name,html,documentation) {
    const sample=document.createElement('div');sample.className='individual-component-sample';sample.innerHTML=html;container.append(sample);addIndividualActions(sample,name,documentation);
  }
  const selectStack=document.querySelector('.select-control-demo');selectStack.replaceChildren();
  const selectSpec=spec([['触发器','高32px / 圆角20px'],['宽度','普通154px起；级联188px起'],['内边距','左右12px'],['菜单','圆角8px / 内边距8px / 行高32px'],['选中','浅紫底 #F5F5FF / #6865A7'],['字体','14px 苹方 Regular']],'普通菜单选择后回填并收起。级联父级仅浏览，末级确认；重开恢复路径。下方空间不足时向上展开，Esc或点击外部关闭且保留原值。','206-9185');
  for(const cascade of [false,true])for(const position of ['', 'inside'])add(selectStack,(cascade?'级联选择器':'普通下拉')+(position==='inside'?' · 内置标题':position==='outside'?' · 前置标题':''),auditSelectMarkup(cascade,position),selectSpec);
  const tables = document.querySelector('.table-spec .audit-table-examples');
  const tableHoverRule = ['移入', '数据行整行填充 #F7F8FA，移出后恢复'];
  const tableSpec = spec([
    ['表面', '白底，无竖向分割线'],
    tableHoverRule,
    ['单元格内边距', '上、下各 12px，行高随内容自适应'],
    ['表头', '14px Medium，文字 #333333，左对齐，长名称换行'],
    ['汇总行', '14px Medium，可展开一级明细'],
    ['一级', '14px Regular，可展开项左侧显示箭头'],
    ['二级', '12px Regular，文字 #666666'],
    ['列宽', '首列 120px，基金列等宽'],
    ['缩进', '汇总 10px / 一级 28px / 二级 46px'],
    ['数值', 'Roboto 等宽数字，右对齐，缺失值显示 --'],
    ['分割线', '表头下方 1px #D9D9D9。汇总与一级下方 1px #EAEAEA（85%）。二级行省略底线']
  ], '点击汇总行或可展开的一级行，显示或收起下一级明细。表头和行高可随内容换行增高，窄屏可横向滚动。', '564-55005');
  add(tables, '简洁表格 · 层级规范', auditTableMarkup(), tableSpec);

  const pair = document.createElement('div');
  pair.className = 'audit-table-pair';
  tables.append(pair);

  const flatRules = [
    tableHoverRule,
    ['单元格内边距', '上、下各 12px，行高随内容自适应'],
    ['数值字体', 'Roboto 等宽数字']
  ];

  function addFlatTable(container, name, columns, rows, note, extraRules = [], numericColumns = false) {
    const markup = auditFlatTableMarkup(name, columns, rows, numericColumns);
    const headerRules = [['表头', '14px Medium，文字 #333333']];
    const alignmentRule = ['对齐', numericColumns ? '项目名称居左，数字及对应列标题居右' : '所有表头与表体内容均居左'];
    const documentation = spec([...headerRules, ...flatRules, alignmentRule, ...extraRules], note);
    add(container, name, markup, documentation);
  }

  addFlatTable(pair, '数值汇总表', ['资产类别', '市值（万元）', '权重'], [
    {label:'合计', values:['1,000.0', '100.00%'], total:true},
    {label:'股票', values:['620.5', '62.05%']},
    {label:'债券', values:['248.3', '24.83%']},
    {label:'现金', values:['131.2', '13.12%']}
  ], '示例为资产配置，汇总行在明细上方。', [['汇总行', '14px Medium，与明细共享列宽和对齐方式']], true);

  addFlatTable(pair, '文字与数字混合表', ['基金名称', '近1年收益', '持有时长'], [
    {label:'华夏成长混合', values:['6.63%', '1 年 5 个月']},
    {label:'宝盈中证A500指数增强 A', values:['3.46%', '8 个月']},
    {label:'易方达蓝筹精选混合', values:['−2.18%', '未持有']}
  ], '示例为持有明细，收益率是纯数值，持有时长包含文字。');

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
