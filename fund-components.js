/* Canonical component runtimes from the live design system, November 18. */
(() => {
function auditRuntime(root = document) {
  function closeMenus() {
    root.querySelectorAll('.audit-menu').forEach(menu=>menu.remove());
    root.querySelectorAll('.audit-select-trigger').forEach(button=>{button.setAttribute('aria-expanded','false');button.querySelector('img').src='./design-system/assets/audit/20df2.svg';});
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
        button.innerHTML='<span>'+label+'</span>'+(typeof item==='object'?'<img width="12" height="12" src="./design-system/assets/audit/06b99.svg" alt="">':selected?'<img width="12" height="12" src="./design-system/assets/audit/2b0ea.svg" alt="">':'');
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
    trigger.setAttribute('aria-expanded','true');trigger.querySelector('img').src='./design-system/assets/audit/dc355.svg';
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
  function updateSelection(table) {
    const selectAll = table.querySelector('[data-audit-select-all]');
    if (!selectAll) return;
    const checkboxes = Array.from(table.querySelectorAll('[data-audit-row-select]:not(:disabled)'));
    const count = checkboxes.filter(checkbox => checkbox.checked).length;
    selectAll.checked = checkboxes.length > 0 && count === checkboxes.length;
    selectAll.indeterminate = count > 0 && count < checkboxes.length;
    selectAll.toggleAttribute('checked', selectAll.checked);
    selectAll.toggleAttribute('data-indeterminate', selectAll.indeterminate);
    selectAll.disabled = checkboxes.length === 0;
    checkboxes.forEach(checkbox => checkbox.toggleAttribute('checked', checkbox.checked));
  }
  function selectionDetail(table) {
    return {selected: Array.from(table.querySelectorAll('[data-audit-row-select]:checked')).map(checkbox => checkbox.dataset.auditRowSelect)};
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
  root.querySelectorAll('.audit-table').forEach(table => { updateRows(table); updateSelection(table); });
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
      else{select.dataset.selection=path.join(',');const text=labels.join(' / ');select.querySelector('.audit-select-value').textContent=labels[labels.length-1];select.querySelector('.audit-select-trigger').title=text;closeMenus();select.dispatchEvent(new CustomEvent('change',{bubbles:true,detail:{value:labels}}));}
    } else if(!event.target.closest('.audit-select,.actions'))closeMenus();
    if (event.target.closest('.audit-checkbox-cell')) return;
    const toggle=event.target.closest('tr[data-node]')?.querySelector('[data-row-toggle]');
    if(toggle){toggle.setAttribute('aria-expanded',String(toggle.getAttribute('aria-expanded')!=='true'));updateRows(toggle.closest('table'));}
  });
  root.addEventListener('change', event => {
    const checkbox = event.target.closest('[data-audit-select-all], [data-audit-row-select]');
    if (!checkbox || checkbox.disabled) return;
    const table = checkbox.closest('table');
    if (checkbox.hasAttribute('data-audit-select-all')) {
      table.querySelectorAll('[data-audit-row-select]:not(:disabled)').forEach(rowCheckbox => { rowCheckbox.checked = checkbox.checked; });
    }
    updateSelection(table);
    table.dispatchEvent(new CustomEvent('tableselectionchange', {bubbles:true, detail:selectionDetail(table)}));
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

function titleHelpRuntime(root = document) {
    root.querySelectorAll('.zc-title-help').forEach(widget => {
      const trigger = widget.querySelector('.zc-title-help-trigger');
      const panel = widget.querySelector('.zc-title-help-panel');
      const initialOpen = widget.dataset.initialOpen === 'true';
      let open = false, closeTimer = null, frame = 0;
      function place() {
        if (!open) return;
        const box = widget.getBoundingClientRect();
        const headerBottom = document.querySelector('.topbar')?.getBoundingClientRect().bottom || 0;
        const visible = box.width > 0 && box.height > 0 && box.top >= headerBottom && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth;
        panel.style.visibility = visible ? 'visible' : 'hidden';
        if (!visible) return;
        const width = panel.getBoundingClientRect().width;
        const height = panel.getBoundingClientRect().height;
        const gap = Number(widget.dataset.panelGap) || 12;
        const inset = 8;
        let left = box.right + gap, top = box.top, below = false;
        if (left + width > window.innerWidth - inset) {
          if (box.left - gap - width >= inset) left = box.left - gap - width;
          else { left = box.left; top = box.bottom + 8; below = true; }
        }
        if (below && top + height > window.innerHeight - inset && box.top - height - 8 >= inset) top = box.top - height - 8;
        left = Math.max(inset, Math.min(left, window.innerWidth - width - inset));
        top = Math.max(inset, Math.min(top, window.innerHeight - height - inset));
        panel.style.left = left + 'px'; panel.style.top = top + 'px';
      }
      function schedulePlace() {
        if (frame) return;
        frame = requestAnimationFrame(() => { frame = 0; place(); });
      }
      function show() {
        clearTimeout(closeTimer); open = true; panel.hidden = false;
        trigger.setAttribute('aria-expanded','true'); place();
      }
      function hide() {
        clearTimeout(closeTimer); open = false; panel.hidden = true;
        trigger.setAttribute('aria-expanded','false');
      }
      function leave() { clearTimeout(closeTimer); closeTimer = setTimeout(() => { if (!trigger.matches(':focus-visible')) hide(); }, 160); }
      trigger.addEventListener('pointerenter', show);
      trigger.addEventListener('pointerleave', leave);
      trigger.addEventListener('focus', show);
      trigger.addEventListener('click', show);
      panel.addEventListener('pointerenter', () => clearTimeout(closeTimer));
      panel.addEventListener('pointerleave', leave);
      widget.addEventListener('focusout', event => { if (!widget.contains(event.relatedTarget) && !widget.matches(':hover')) hide(); });
      document.addEventListener('pointerdown', event => { if (!widget.contains(event.target)) hide(); });
      document.addEventListener('keydown', event => { if (event.key === 'Escape' && open) hide(); });
      window.addEventListener('resize', schedulePlace);
      window.addEventListener('scroll', schedulePlace, true);
      const observer = new ResizeObserver(schedulePlace); observer.observe(widget); observer.observe(panel);
      document.fonts.ready.then(schedulePlace);
      if (initialOpen) show();
    });
  }

function viewSwitchRuntime(root = document) {
    root.querySelectorAll('.zc-view-switch').forEach(group => {
      function render(button) {
        group.dataset.view = button.dataset.viewValue;
        group.querySelectorAll('button').forEach(item => {
          const selected = item === button;
          item.setAttribute('aria-pressed', String(selected)); item.tabIndex = selected ? 0 : -1;
          const icon = item.querySelector('img'); icon.src = selected ? icon.dataset.selectedSrc : icon.dataset.defaultSrc;
        });
      }
      function select(button) {
        if (button.disabled || group.dataset.view === button.dataset.viewValue) return;
        render(button);
        group.dispatchEvent(new CustomEvent('viewchange', {bubbles:true, detail:{value:group.dataset.view}}));
      }
      const configured = group.querySelector('[data-view-value="' + (group.dataset.view === 'chart' ? 'chart' : 'list') + '"]:not(:disabled)') || group.querySelector('button:not(:disabled)');
      if (configured) render(configured);
      group.addEventListener('click', event => { const button = event.target.closest('[data-view-value]'); if (button && group.contains(button)) select(button); });
      group.addEventListener('keydown', event => {
        const button = event.target.closest('[data-view-value]');
        if (!button || button.disabled || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const buttons = Array.from(group.querySelectorAll('button:not(:disabled)'));
        if (!buttons.length) return;
        const current = buttons.indexOf(button);
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        select(buttons[index]); buttons[index].focus();
      });
    });
  }

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ASSETS = './design-system/assets/';
  const dateText = value => {
    const match = String(value ?? '').match(/^(\d{4})[-/]([01]?\d)(?:[-/]([0-3]?\d))?$/);
    if (!match) return null;
    const date = `${match[1]}-${match[2].padStart(2,'0')}-${(match[3] || '01').padStart(2,'0')}`;
    const parsed=new Date(date);return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0,10) === date ? date : null;
  };
  const getCharts = root => window.FundChartUI?.charts(root) || [...root.querySelectorAll('.fund-chart[id],.fund-donut-chart[id]')].map(el=>window.echarts?.getInstanceByDom(el)).filter(Boolean);
  const toolsMarkup = (kind) => '<div class="zc-module-actions" role="group" aria-label="模块操作" style="width:62px">' + [[kind,kind==='table'?'下载表格':'下载图片',kind==='table'?'table-download':'image-download'],['refresh','刷新','refresh']].map(([action,label,file])=>`<button class="zc-module-icon" type="button" data-module-do="${action}" aria-label="${label}" title="${label}"><img src="${ASSETS}module-actions/${file}.png" width="28" height="28" alt=""></button>`).join('') + '</div>';
  const switchMarkup = () => '<div class="zc-view-switch" role="group" aria-label="图表和列表视图" data-view="chart">' + ['chart','list'].map(view=>`<button type="button" data-view-value="${view}" aria-label="${view==='chart'?'图表视图':'列表视图'}" title="${view==='chart'?'图表':'列表'}" aria-pressed="${view==='chart'}" tabindex="${view==='chart'?0:-1}"><img src="${ASSETS}view-switch/${view}-${view==='chart'?'selected':'default'}.png" data-default-src="${ASSETS}view-switch/${view}-default.png" data-selected-src="${ASSETS}view-switch/${view}-selected.png" width="28" height="28" alt=""></button>`).join('') + '</div>';
  const definitions = {
    '收益表现':'展示基金、同类平均与所选基准在选定区间内的累计收益变化。',
    '风险表现':'展示选定区间内各时点相对前期最高净值的回撤，数值越接近零，回撤越小。',
    '区间收益':'统计指定时段内的基金收益及同类排名，排名口径与同类分类保持一致。',
    '收益预测':'以历史区间内不同日期为买入日，统计持有指定时长后，各收益区间出现的比例。',
    '持有收益概率':'以历史区间内不同日期为买入日，统计持有指定时长后，各收益区间出现的比例。',
    '风险、波动与有效基准':'对比基金相对于适配基准、法定基准和分类基准的风险收益特征。R²反映收益解释程度，Beta反映对基准变化的敏感度。',
    '波动与回撤':'波动反映收益率变化的幅度；回撤反映净值相对历史高点的下降幅度。',
    '区间最大回撤':'选定区间内，从净值最高点到其后最低点的最大跌幅。',
    '滚动最大回撤':'在连续滚动窗口内计算最大回撤，用于观察不同时间段的下行风险。',
    '收益风险指标':'按照选定的频率与时间范围计算收益、波动、回撤及风险调整后收益指标。',
    '情景分析':'统计基金在所列历史事件区间内的收益表现，用于对照不同市场情景。',
    '资产配置与变化':'按基金定期报告披露的数据展示大类资产比例及其历史变化。',
    '资产分布':'按所选报告期的持仓数据展示资产构成，未披露或无持仓时不计算该分类占比。',
    '股票行业分布':'按所选行业分类统计股票持仓权重，分类及占比以对应报告期为准。',
    '漂移对比图':'对照公布持仓与回归分析结果。括号内为p值，较高p值表示估计结果的统计显著性较弱。',
    '股票估值水平':'根据所选估值指标，展示基金持仓与对照对象在历史报告期的估值情况。',
    '前十大重仓股票':'按报告期内披露的持仓权重从高到低展示前十只股票。',
    '前五大重仓债券':'按报告期内披露的持仓权重从高到低展示前五只债券。'
  };
  const question = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1"/><path d="M5.9 5.8a2.1 2.1 0 0 1 4.2 0c0 1.4-2.1 1.5-2.1 3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11.5" r=".7" fill="currentColor"/></svg>';
  function mountHelp(root) {
    let index = 0;
    root.querySelectorAll('.fund-panel h2,.fund-chart-block h3,.fund-section-title').forEach(title=>{
      if (title.querySelector('.zc-title-help')) return;
      const old = title.querySelector('[title],[aria-label="说明"],.fund-info-icon');
      const key = title.textContent.trim();
      const info = old?.getAttribute('title') || definitions[key];
      if (!info) return;
      old?.remove();
      const id = `fund-help-${root.dataset.fundView || 'page'}-${index++}`;
      const label = title.innerHTML;
      title.innerHTML = `<span class="zc-title-help" data-initial-open="false" data-panel-gap="12"><span class="zc-title-help-label">${label}</span><button type="button" class="zc-title-help-trigger" aria-label="${esc(key)}说明" aria-expanded="false" aria-describedby="${id}">${question}</button><span class="zc-title-help-panel" id="${id}" role="tooltip" hidden><p>${esc(info)}</p></span></span>`;
    });
    titleHelpRuntime(root);
  }
  const benchmarkTree = [{label:'A股指数',children:[{label:'规模指数',children:[{label:'上证规模指数',children:['上证综指','上证180','上证50','上证380','科创50']},{label:'深证规模指数',children:['深证成指','深证100']},{label:'中证规模指数',children:['沪深300','中证500','中证1000']}]},{label:'行业指数',children:['申万行业指数','中证行业指数']},{label:'风格指数',children:['成长指数','价值指数']}]},{label:'债券指数',children:['中债综合指数','中证全债指数']},{label:'基金指数',children:['股票基金指数','混合基金指数']},{label:'港股指数',children:['恒生指数','恒生科技指数']}];
  function configFor(label, native) {
    let current = label.replace(/^(同类|频率|基准|报告期|行业|分布)\s*[:：]\s*/, '');
    if (/^(?:\d{4}[-/]\d\d[-/]\d\d)$/.test(current)) return {title:'报告期',current,kind:'report',tree:[current,'2026-06-30','2026-03-31','2025-12-31'].filter((x,i,a)=>a.indexOf(x)===i)};
    if (/沪深300|上证|中证|基准|A股指/.test(current) || /选择基准/.test(native.getAttribute('aria-label') || '')) return {title:'基准',current:current || '沪深300',kind:'benchmark',tree:benchmarkTree};
    if (/申万|中信|行业分类|一级行业/.test(current)) return {title:'行业',current,kind:'industry',tree:['申万一级行业','中信一级行业','中证行业分类','证监会行业分类']};
    if (/偏股|混合|股票型|同类/.test(label)) return {title:'同类',current,kind:'peer',tree:[{label:'混合型',children:['偏股混合型','平衡混合型','偏债混合型','灵活配置型']},{label:'股票型',children:['普通股票型','被动指数型']},{label:'债券型',children:['纯债型','混合债券型']}]};
    if (/^持有/.test(current)) return {title:'持有期',current,kind:'holding',tree:['持有一个月','持有三个月','持有六个月','持有一年','持有三年']};
    if (/频率|月度|季度|年度/.test(label)) return {title:'频率',current,kind:'frequency',tree:['原始频率','月度','季度','年度']};
    if (/^PE$|^PB$|^PS$/.test(current)) return {title:'指标',current,kind:'metric',tree:['PE','PB','PS']};
    const values=[...native.options].map(o=>o.textContent.trim()).filter(Boolean);
    return {title:/大小盘/.test(current)?'风格':'',current,kind:'other',tree:values.length>1?values:[current]};
  }
  function findPath(tree, target, path=[]) {
    for(let i=0;i<tree.length;i++) {
      const item=tree[i], label=typeof item==='string'?item:item.label;
      if(label===target)return [...path,i];
      if(item.children){const found=findPath(item.children,target,[...path,i]);if(found)return found;}
    }
    return null;
  }
  function selectMarkup(config) {
    if (!findPath(config.tree,config.current)) config.tree=[config.current,...config.tree];
    const path=findPath(config.tree,config.current) || [0];
    return `<div class="audit-select-row"><div class="audit-select" data-fund-select="${config.kind}" data-original-value="${esc(config.current)}" data-tree="${esc(JSON.stringify(config.tree))}" data-selection="${path.join(',')}"><button type="button" class="audit-select-trigger" aria-haspopup="listbox" aria-expanded="false" title="${esc(config.current)}">${config.title?`<span class="audit-field-label">${esc(config.title)}</span>`:''}<span class="audit-select-value">${esc(config.current)}</span><img src="${ASSETS}audit/20df2.svg" width="12" height="12" alt=""></button></div></div>`;
  }
  function transformSelects(root) {
    root.querySelectorAll('.fund-panel select').forEach(native=>{
      const label=native.selectedOptions[0]?.textContent.trim() || native.closest('strong')?.querySelector('.fund-benchmark-name')?.textContent.trim() || native.getAttribute('aria-label') || '';
      if (/^(?:成立以来|近[一二三五六十12356]+[年月周日]|今年以来|共同时段)$/.test(label)) return;
      const holder=native.closest('label') || native;
      const config=configFor(label,native);
      const target=document.createElement('div'); target.innerHTML=selectMarkup(config);
      holder.replaceWith(target.firstElementChild);
    });
  }
  function chartExtent(panel) {
    const dates=getCharts(panel).flatMap(instance=>(instance.getOption().xAxis || []).flatMap(axis=>(axis.data || []).map(value=>dateText(typeof value==='object'?value.value:value)).filter(Boolean))).sort();
    return dates.length?{start:dates[0],end:dates.at(-1)}:null;
  }
  let periodCleanups = [];
  function bindPeriodPresentation(host) {
    let frame = 0;
    const positionPanels = () => {
      frame = 0;
      host.querySelectorAll('.lt-more-panel,.lt-calendar').forEach(panel => {
        if (panel.hidden || !panel.getClientRects().length) return;
        panel.style.translate = 'none';
        const rect = panel.getBoundingClientRect();
        const viewport = document.documentElement.clientWidth;
        const scale = panel.offsetWidth ? rect.width / panel.offsetWidth : 1;
        const shift = rect.left < 8 ? 8 - rect.left : rect.right > viewport - 8 ? viewport - 8 - rect.right : 0;
        if (shift) panel.style.translate = (shift / scale) + 'px 0';
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(positionPanels); };
    const observer = new MutationObserver(schedule);
    observer.observe(host, {childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
    host.addEventListener('click', schedule);
    host.addEventListener('focusin', schedule);
    window.addEventListener('resize', schedule, {passive:true});
    window.addEventListener('scroll', schedule, {passive:true,capture:true});
    periodCleanups.push(() => {
      observer.disconnect();
      host.removeEventListener('click',schedule);host.removeEventListener('focusin',schedule);
      window.removeEventListener('resize',schedule);window.removeEventListener('scroll',schedule,true);
      if (frame) cancelAnimationFrame(frame);
    });
  }
  function mountPeriods(root) {
    periodCleanups.forEach(cleanup=>cleanup());periodCleanups=[];
    const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    root.querySelectorAll('[data-fund-fixed-period]').forEach(host => {
      const { fundFixedPeriod: label, start } = host.dataset;
      const end = host.dataset.end || today;
      window.ZhiceLinkedTime?.mount(host, () => ({ shortcuts:[{key:'fixed',label,start,end}], showDate:false, min:start, max:end, end }));
    });
    root.querySelectorAll('.fund-panel').forEach(panel=>{
      const period = [...panel.querySelectorAll('select')].find(input=>/^(?:成立以来|近[一二三五六十12356]+[年月周日]|今年以来|共同时段)$/.test(input.selectedOptions[0]?.textContent.trim()));
      const oldRange=panel.querySelector('.fund-date-range');
      if (!period && !oldRange) return;
      const text=period?.selectedOptions[0]?.textContent.trim() || '成立以来';
      const defaultKey=({'近1年':'year','近3年':'three-years','近1月':'month','近3月':'three-months','近6月':'six-months','今年以来':'year-to-date'})[text] || 'inception';
      const extent=window.FundChartUI?.extent(panel) || chartExtent(panel);
      const anchor=extent?.end || today;
      const host=document.createElement('div');host.className='linked-time-widget fund-linked-time';host.dataset.linkedTime='';host.dataset.defaultShortcut=defaultKey;
      const target=period?.closest('label') || period || oldRange;
      target.replaceWith(host);oldRange?.remove();
      window.ZhiceLinkedTime?.mount(host,()=>({inception:'2001-12-18',min:'2001-12-18',max:anchor,end:anchor,managers:[],common:null,firstShortcut:{key:'inception',label:'成立以来'}}));
      bindPeriodPresentation(host);
      const initial=host.linkedTimeApi?.getState().committed;
      if(initial?.start && initial?.end)window.FundChartUI?.applyRange?.(panel,initial.start,initial.end);
      host.addEventListener('timerangechange',event=>{
        window.FundChartUI?.applyRange?.(panel,event.detail.start,event.detail.end);
        panel.dispatchEvent(new CustomEvent('fundrangechange',{bubbles:true,detail:event.detail}));
        if(panel.querySelector('.zc-view-switch')?.dataset.view==='list') getCharts(panel).forEach(instance=>window.FundChartUI?.showTable(instance,true));
      });
    });
  }
  function segmented(root) {
    root.querySelectorAll('.fund-scope-pills,.fund-text-toggle,.fund-style-segments').forEach(group=>{
      [...group.children].forEach(item=>{if(item.tagName==='BUTTON')return;const button=document.createElement('button');button.type='button';button.className=item.className;button.textContent=item.textContent;item.replaceWith(button);});
      const initial=[...group.children].find(button=>button.classList.contains('is-on')) || group.firstElementChild;group.dataset.originalValue=initial?.textContent.trim() || '';
      const wrap=document.createElement('div');wrap.className='tab-variant fund-module-tabs';group.before(wrap);wrap.append(group);
      group.className='visual-segmented module-segmented';group.setAttribute('role','tablist');
      [...group.children].forEach((button,index)=>{
        const selected=button.classList.contains('is-on') || (!index&&!group.querySelector('.is-on'));
        button.setAttribute('role','tab');button.classList.toggle('is-active',selected);button.setAttribute('aria-selected',String(selected));button.setAttribute('aria-pressed',String(selected));button.tabIndex=selected?0:-1;
      });
      function activate(button){
        if(button.disabled||button.getAttribute('aria-selected')==='true')return;
        [...group.children].forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.classList.remove('is-on');item.setAttribute('aria-selected',String(active));item.setAttribute('aria-pressed',String(active));item.tabIndex=active?0:-1;});
        const panel=group.closest('.fund-panel');const chosen=button.textContent.trim();
        const target=group.closest('.fund-rolling') || panel;
        if(!/前十大|全部持仓/.test(chosen))setNoData(target,group,chosen!==group.dataset.originalValue,chosen);
        if(/前十大|全部持仓/.test(chosen))panel.querySelectorAll('tbody').forEach(body=>[...body.rows].forEach((row,index)=>{if(index>=10&&!row.textContent.includes('合计'))row.hidden=chosen==='前十大重仓';}));
        panel.dispatchEvent(new CustomEvent('moduletabchange',{bubbles:true,detail:{value:chosen}}));
      }
      group.addEventListener('click',event=>{const button=event.target.closest('button');if(button&&group.contains(button))activate(button);});
      group.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const items=[...group.querySelectorAll('button:not(:disabled)')];const current=items.indexOf(document.activeElement);const index=event.key==='Home'?0:event.key==='End'?items.length-1:(current+(event.key==='ArrowRight'?1:-1)+items.length)%items.length;activate(items[index]);items[index].focus();});
    });
  }
  function download(blob,name) {const link=document.createElement('a'),url=URL.createObjectURL(blob);link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function tableImage(panel) {
    const rows=[...panel.querySelectorAll('table tr')].filter(row=>!row.hidden).map(row=>[...row.cells].map(cell=>cell.textContent.trim()));
    if(!rows.length)return false;
    const canvas=document.createElement('canvas'),context=canvas.getContext('2d');const columns=Math.max(...rows.map(row=>row.length));const width=Math.max(600,columns*180),height=80+rows.length*42;canvas.width=width*2;canvas.height=height*2;context.scale(2,2);context.fillStyle='#fff';context.fillRect(0,0,width,height);context.fillStyle='#333';context.font='600 16px "PingFang SC",sans-serif';context.fillText(panel.querySelector('h2')?.textContent.trim() || '基金分析',20,30);context.font='14px "PingFang SC",sans-serif';rows.forEach((row,y)=>{context.fillStyle='#eee';context.fillRect(20,65+y*42,width-40,1);context.fillStyle='#333';row.forEach((value,x)=>{context.fillText(value,20+x*(width-40)/columns,91+y*42,(width-56)/columns);});});
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(blob)download(blob,(panel.querySelector('h2')?.textContent.trim()||'基金分析')+'.png');return Boolean(blob);
  }
  // Presence is copied from the eight original Sketch pages, not inferred
  // from whether a rebuilt module happens to contain a chart or a table.
  const originalActionModules = {
    overview: [false,true,true,true,true,true,true,true,true,true,true],
    returns: [true,true,true,true],
    risk: [true,true,true,true],
    holdings: [true,true,true,true,true,true,true,true,true,true,true,true,true],
    attribution: [true,true,true,true,true,true],
    manager: [true,true], company: [true,true,true],
    basics: [false,false,false,true]
  };
  function displayed(node) {
    return !node.closest('[hidden]') && node.getClientRects().length > 0 && getComputedStyle(node).display !== 'none';
  }
  function downloadKind(panel) {
    if (panel.querySelector('.zc-view-switch')?.dataset.view === 'list') return 'table';
    const graphic = [...panel.querySelectorAll('.fund-chart,.fund-donut-chart,.fund-rating-block,.fund-style-matrix,.fund-vbars,.fund-factor-range,[data-source-chart]')].some(displayed);
    if (graphic) return 'image';
    if ([...panel.querySelectorAll('table,.fund-awards')].some(displayed)) return 'table';
    return 'image';
  }
  function updateDownloadKind(panel) {
    const button = panel.querySelector(':scope > .fund-panel-head [data-module-do]:not([data-module-do="refresh"])');
    if (!button) return;
    const kind = downloadKind(panel), label = kind === 'table' ? '下载表格' : '下载图片';
    button.dataset.moduleDo=kind;button.setAttribute('aria-label',label);button.title=label;
    button.querySelector('img').src=ASSETS+'module-actions/'+(kind==='table'?'table-download':'image-download')+'.png';
  }
  function listCSV(panel) {
    const list = panel.querySelector('.fund-awards');
    if (!list) return false;
    const rows=[['奖项','年份'],...[...list.children].map(row=>[row.firstElementChild?.textContent.trim() || '',row.lastElementChild?.textContent.trim() || ''])];
    const cell = value => '"'+String(value).replace(/"/g,'""')+'"';
    download(new Blob(['\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),(panel.querySelector('h2')?.textContent.trim()||'基金分析')+'.csv');return true;
  }
  async function panelImage(panel) {
    // Non-ECharts visuals (ratings/style matrices) are real DOM. Export the
    // rendered values and their computed styles, without inventing chart data.
    const clone=panel.cloneNode(true), originals=[panel,...panel.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
    originals.forEach((node,index)=>{
      const copy=copies[index];if(!copy)return;
      const style=getComputedStyle(node);
      copy.setAttribute('style',[...style].map(key=>key+':'+style.getPropertyValue(key)).join(';'));
      if(node.tagName==='CANVAS'){
        const image=document.createElement('img');image.src=node.toDataURL('image/png');image.setAttribute('style',copy.getAttribute('style'));copy.replaceWith(image);
      }
    });
    clone.querySelectorAll('.fund-panel-controls,.zc-title-help-trigger,.zc-title-help-panel,.fund-selection-empty,[hidden]').forEach(node=>node.remove());
    const rect=panel.getBoundingClientRect(),width=Math.ceil(rect.width),height=Math.ceil(Math.max(rect.height,panel.scrollHeight));
    clone.style.cssText+=';position:relative;inset:auto;margin:0;transform:none;width:'+width+'px;height:auto;min-height:'+height+'px;max-width:none;';
    clone.setAttribute('xmlns','http://www.w3.org/1999/xhtml');
    await Promise.all([...clone.querySelectorAll('img')].map(async image=>{
      if(!image.src||image.src.startsWith('data:'))return;
      try{const blob=await (await fetch(image.src)).blob();image.src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});}catch{image.remove();}
    }));
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><foreignObject width="100%" height="100%">'+new XMLSerializer().serializeToString(clone)+'</foreignObject></svg>';
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    // SVG remains a complete image fallback if a browser disallows rasterizing
    // foreignObject. All image resources above have already been embedded.
    download(blob,(panel.querySelector('h2')?.textContent.trim()||'基金分析')+'.svg');return true;
  }
  function mountTools(root) {
    const view=root.dataset.fundView, original=originalActionModules[view] || [];
    root.querySelectorAll('.fund-panel').forEach((panel,index)=>{
      const head=panel.querySelector(':scope > .fund-panel-head');if(!head)return;
      let controls=head.querySelector('.fund-panel-controls');
      controls?.querySelectorAll('.fund-tool-btn,.fund-dot-pill,.zc-module-actions,.zc-view-switch').forEach(el=>el.remove());
      if(!original[index]){
        if(controls&&!controls.children.length)controls.remove();
        return;
      }
      if(!controls){controls=document.createElement('div');controls.className='fund-panel-controls';head.append(controls);}
      // Only the original stock-liquidity module exposes chart/list switching.
      if(view==='holdings'&&index===8&&getCharts(panel).length)controls.insertAdjacentHTML('beforeend',switchMarkup());
      controls.insertAdjacentHTML('beforeend',toolsMarkup(downloadKind(panel)));
      panel.addEventListener('viewchange',event=>{getCharts(panel).forEach(instance=>window.FundChartUI?.showTable(instance,event.detail.value==='list'));updateDownloadKind(panel);});
      panel.addEventListener('moduletabchange',()=>requestAnimationFrame(()=>updateDownloadKind(panel)));
      panel.addEventListener('change',()=>requestAnimationFrame(()=>updateDownloadKind(panel)));
      controls.querySelector('.zc-module-actions').addEventListener('click',async event=>{
        const button=event.target.closest('[data-module-do]');if(!button||button.disabled)return;
        button.disabled=true;const action=button.dataset.moduleDo;
        try {
          if(action!=='refresh' && panel.classList.contains('is-selection-empty'))return;
          if(action==='refresh') {
            button.classList.add('is-loading');panel.classList.add('is-refreshing');panel.setAttribute('aria-busy','true');
            await new Promise(resolve=>setTimeout(resolve,550));await window.FundChartUI?.refresh(panel);
            if(controls.querySelector('.zc-view-switch')?.dataset.view==='list')getCharts(panel).forEach(instance=>window.FundChartUI?.showTable(instance,true));
            panel.dispatchEvent(new CustomEvent('modulerefresh',{bubbles:true}));
          } else if(action==='table') {
            if(!window.FundChartUI?.exportCSV(panel)&&!listCSV(panel))window.toast?.('当前模块暂无可导出的表格数据');
          } else if(!(await window.FundChartUI?.exportImage(panel)))await panelImage(panel);
        } finally {button.disabled=false;button.classList.remove('is-loading');panel.classList.remove('is-refreshing');panel.removeAttribute('aria-busy');}
      });
    });
    viewSwitchRuntime(root);
  }
  function setNoData(scope, control, unavailable, label) {
    if(!scope)return;
    if(!scope.fundUnsupportedFilters)scope.fundUnsupportedFilters=new Map();
    if(unavailable)scope.fundUnsupportedFilters.set(control,label);else scope.fundUnsupportedFilters.delete(control);
    const empty=scope.fundUnsupportedFilters.size>0;
    scope.classList.toggle('is-selection-empty',empty);
    let message=scope.querySelector(':scope > .fund-selection-empty');
    if(empty&&!message){message=document.createElement('div');message.className='fund-selection-empty';message.setAttribute('role','status');scope.append(message);}
    if(message){message.hidden=!empty;message.textContent=empty?'当前选择暂无数据':'';}
    scope.querySelectorAll(':scope > .fund-panel-head [data-module-do="image"],:scope > .fund-panel-head [data-module-do="table"]').forEach(button=>button.disabled=empty);
    if(!empty)getCharts(scope).forEach(instance=>instance.resize());
  }
  function handleSelections(root) {
    root.addEventListener('change',event=>{
      const select=event.target.closest('.audit-select');if(!select || !event.detail?.value)return;
      const label=event.detail.value.at(-1);const panel=select.closest('.fund-panel');
      setNoData(panel,select,label!==select.dataset.originalValue,label);
      panel?.dispatchEvent(new CustomEvent('fundfilterchange',{bubbles:true,detail:{kind:select.dataset.fundSelect,value:label,path:event.detail.value}}));
    });
  }
  let outsideAbort=null;
  function mount(root=document.querySelector('.fund-page')) {
    if(!root||root.dataset.componentsMounted)return;root.dataset.componentsMounted='true';
    transformSelects(root);mountPeriods(root);segmented(root);mountHelp(root);mountTools(root);auditRuntime(root);handleSelections(root);
    outsideAbort?.abort();outsideAbort=new AbortController();
    document.addEventListener('pointerdown',event=>{if(root.contains(event.target))return;root.querySelectorAll('.audit-menu').forEach(menu=>menu.remove());root.querySelectorAll('.audit-select-trigger').forEach(button=>{button.setAttribute('aria-expanded','false');button.querySelector('img').src=ASSETS+'audit/20df2.svg';});},{signal:outsideAbort.signal});
  }
  window.FundComponents={mount};
})();
