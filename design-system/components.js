const $=s=>document.querySelector(s);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const base='https://www.figma.com/design/rTKeLXF81fJZFEsIIjZWXp/?node-id=';
const pages={
buttons:{title:'按钮',en:'Button',node:'110-5339',desc:'明确操作层级，让每一次行动都有清晰的引导。',rules:['主要按钮用于核心操作，次要按钮用于辅助操作。','每类包含默认、移入、禁用。主要按钮禁用沿用浅紫底与主色文字。','图文组合：16 px 图标 + 4 px 间距 + 14 px 文字。'],spec:[['按钮高度','34 px'],['主 / 次按钮示例','96 × 34 / 70 × 34 px'],['左右内边距','20 px'],['圆角','99 px'],['文字','14 px · 主按钮 Medium / 次按钮 Regular'],['操作组间距','16 px']]},
date:{title:'日期范围选择器',en:'Date Range Picker',node:'93-4904',desc:'从起点到终点，清晰展示日期选择的每一个状态。',rules:['初始显示灰色占位文字，默认图标 #666666；悬停或展开使用主题色。选完起止日期后回显并收起。','左右展示连续月份，仅在各自本月绘制选区。','年、月可独立切换，导航按月或年浏览并保留已选区间。','默认范围为 2020-01-01 至今天，可通过容器 data-min / data-max 配置。边界日期外禁用，年份与月份选项按范围生成。','点击外部或按 Esc 收起，未完成的选择恢复到上次确认结果。'],spec:[['选择框','260 × 32 px · 圆角 20 px'],['日历面板','526 × 310 px · 圆角 8 px'],['日期单元格','26 × 26 px · 间距 8 px'],['面板内边距','16 px'],['面板描边','#B9B8D8'],['日历图标','默认 #666666 / 展开 #6865A7'],['文字','14 px · PingFang SC Regular']]},
quick:{title:'快捷时间选择器',en:'Quick Time Select',node:'117-5215',desc:'常用区间一步直达，更多选项保持轻巧、有序。',rules:['默认选择共同时段，常用区间互斥。','移入更多展开，移出触发项和面板后收起；点击更多也可展开，点击外部或按 Esc 收起。','展开时保留当前选择；点选后收起并回显所选项；再次展开保留面板内高亮；点击常用项恢复“更多”。'],spec:[['整体 / 选项高度','32 / 28 px'],['选项左右内边距','12 px'],['外壳 / 选项圆角','32 / 22 px'],['更多面板','224px 宽 / 高度自适应'],['面板间距','8 px'],['选中样式','#F2F3F5 背景 / #333333 Medium']]},
top:{title:'回到顶部',en:'Back to Top',node:'117-5943',desc:'在长页面中提供轻量、稳定的返回入口。',rules:['页面滚动超过一屏显示，一屏以内隐藏。','固定在可视区域右下角，不随内容滚动。','点击平滑回到顶部，返回一屏以内时隐藏。'],spec:[['组件外框','80 × 80 px'],['按钮容器','68 × 68 px'],['圆角','8 px'],['图标槽','40 × 40 px'],['图形','26.92 × 38.263 px'],['描边 / 阴影','1 px #E2E2E2 / 0 0 12 px rgba(0,0,0,.08)'],['固定位置示例','右 24 px / 下 24 px']]}}
let current='buttons',tab='components',filter='',cards=[],codeValue='';
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(window.tt);window.tt=setTimeout(()=>$('#toast').style.display='none',2300)}
async function copy(t){try{await navigator.clipboard.writeText(t);toast('已复制到剪贴板')}catch(e){const a=document.createElement('textarea');a.value=t;document.body.append(a);a.select();const ok=document.execCommand('copy');a.remove();toast(ok?'已复制到剪贴板':'复制失败，请下载代码')}}
function btn(k='primary',s='默认'){return '<button class="z-btn '+(k==='secondary'?'secondary ':'')+(s==='移入'?'hover':'')+'" '+(s==='禁用'?'disabled':'')+'>'+(k==='primary'?'开始比较':'清空')+'</button>'}
function dl(s='默认'){return '<button class="z-download '+(s==='移入'?'hover':'')+'" '+(s==='禁用'?'disabled':'')+'><img alt="" width="16" height="16" src="assets/'+(s==='禁用'?'56360':s==='移入'?'e5209':'6d79d')+'.svg">下载</button>'}
function topComponent(s='默认',icon=false){const img='<img alt="" src="assets/top'+(s==='移入'?'-hover':'')+'.svg" width="27" height="38">';return icon?'<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center">'+img+'</div>':'<div class="top-wrap"><button class="backtop" aria-label="回到顶部">'+img+'</button></div>'}
function field(s='默认'){return '<button aria-label="选择日期范围" class="z-date is-empty '+(s==='移入'?'hover':s==='展开'?'open':'')+'" '+(s==='禁用'?'disabled':'')+'><span class="start-value">选择日期</span><span class="to">至</span><span class="end-value">选择日期</span><img alt="" width="13" height="13" src="assets/'+(s==='展开'?'calendar-active':'a435c')+'.svg"></button>'}
function date(open=false){return '<div class="date-wrap">'+field(open?'展开':'默认')+(open?calendar():'')+'</div>'}
function panel(s=0){return '<div class="quick-panel"><div><small>区间</small>'+['近3月','近6月','近5年'].map((x,i)=>'<button data-option="'+x+'" class="'+(s===4&&i===1||s===7&&i===0?'chosen':'')+'">'+x+'</button>').join('')+'</div><div><small>年度</small>'+['今年以来',...Array.from({length:3},(_,i)=>(todayDate().getFullYear()-i-1)+'年度')].map(x=>'<button data-option="'+x+'">'+x+'</button>').join('')+'</div></div>'}
function quick(s=0){const open=[3,4,7].includes(s),selected=s===1?1:s===2?2:[5,6,7].includes(s)?3:0;return '<div class="z-quick '+(open?'open':'')+'"><div class="quick-bar">'+['共同时段','近1年','近3年',s===6?'2025年度':[5,7].includes(s)?'近3月':'更多'].map((x,i)=>'<button data-quick="'+i+'" class="'+(i===selected?'chosen ':'')+(i===3?'more':'')+'" '+(s===8?'disabled':'')+'>'+x+(i===3?'<img alt="" width="10" height="10" src="assets/f2d08.svg">':'')+'</button>').join('')+'</div>'+(open?panel(s):'')+'</div>'}
function getCards(){
 const items={
 buttons:{name:'操作按钮组',html:'<div class="z-group">'+btn()+btn('secondary')+dl()+'</div>',dim:'34 高 / 16 间距'},
 date:{name:'日期范围选择器',html:date(false),dim:'260 × 32'},
 quick:{name:'快捷时间选择器',html:quick(),dim:'270 × 32'},
 top:{name:'回到顶部',html:topComponent(),dim:'80 × 80'}
 };
 return [{...items[current],page:current,section:'常用组件',state:'可交互'}];
}
function specText(c){const p=pages[c?.page||current];return p.title+(c?' / '+c.name:'')+'\nFigma 来源：'+base+p.node+'\n'+p.spec.map(x=>x.join('：')).join('\n')+'\n\n交互规则\n'+p.rules.join('\n')+(c?'\n当前示例尺寸：'+c.dim+' px':'')}
function specs(){const p=pages[current];return '<div class="spec-box"><h3>尺寸与样式 <button class="source-link" data-copy-spec style="float:right;background:white">复制规范说明</button></h3><table><thead><tr><th>规范项</th><th>值 / 规则</th></tr></thead><tbody>'+p.spec.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</tbody></table></div><div class="spec-box"><h3>交互规则</h3>'+p.rules.map((r,i)=>'<p>0'+(i+1)+' &nbsp; '+r+'</p>').join('')+'</div><div class="spec-box"><h3>设计变量 <small style="color:#aaa;font-weight:400">点击复制色值</small></h3><div class="swatches">'+[['主色','#6865A7'],['移入主色','#7774B3'],['面板描边','#B9B8D8'],['日历图标','默认 #666666 / 展开 #6865A7'],['选区 / 禁用底色','#F4F4FC'],['正文','#555759'],['禁用文字','#CBCBCB']].map(r=>'<button class="swatch" data-color="'+r[1]+'" style="background:white;text-align:left"><div style="background:'+r[1]+'"></div>'+r[0]+'<code>'+r[1]+'</code></button>').join('')+'</div></div>'+(current==='date'?'<div class="notice">源稿导航描述同时存在月 / 日及月 / 年，本实现按母组件说明采用月 / 年。示例日历使用 2026 年 11、12 月。</div>':'')}
function card(c,i){
 const p=pages[c.page||current];
 return '<article class="component-spec card integrated-spec" data-card="'+i+'"><div class="spec-heading"><h3>'+c.name+'</h3><div class="actions"><button data-action="svg" data-i="'+i+'">复制 SVG</button><button data-action="spec" data-i="'+i+'">查看规范</button><button data-action="code" data-i="'+i+'">&lt;/&gt; 查看代码</button><a class="component-source-link" href="'+base+p.node+'" target="_blank" rel="noreferrer">Figma 源组件 ↗</a></div></div><div class="component-spec-layout"><div class="preview-column"><div class="component-demo-surface stage"><div class="sample">'+c.html+'</div></div></div></div></article>';
}
function viewSpec(c){
 const p=pages[c.page];
 $('#spec-dialog-title').textContent=c.name+' · 设计规范';
 $('#spec-dialog-body').innerHTML='<h3>尺寸与样式</h3><table><thead><tr><th>规范项</th><th>值 / 说明</th></tr></thead><tbody>'+p.spec.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</tbody></table><h3>交互规则</h3><ol>'+p.rules.map(r=>'<li>'+r+'</li>').join('')+'</ol>';
 $('#spec-dialog').showModal();
}
function render(){
 const previous=current;
 cards=Object.keys(pages).flatMap(key=>{current=key;return getCards()});
 current=previous;
 $('#content').innerHTML=cards.map((c,i)=>card(c,i)).join('');
 document.querySelectorAll('.z-calendar').forEach(initCalendar);
 document.querySelectorAll('.z-date').forEach(b=>b.setAttribute('aria-expanded',String(b.classList.contains('open'))));
}
const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function todayDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Shanghai",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return new Date(Number(value.year), Number(value.month) - 1, Number(value.day));
}

function dateBounds(element) {
  const owner = element.closest('.date-wrap') || element;
  const minimum = owner.dataset.min || '2020-01-01';
  const maximum = owner.dataset.max || fmt(todayDate());
  return { minimum, maximum };
}

function monthNumber(date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function setCalendarMonth(calendarElement, requestedMonth) {
  const { minimum, maximum } = dateBounds(calendarElement);
  const firstMonth = monthNumber(parseLocalDate(minimum));
  const lastMonth = Math.max(firstMonth, monthNumber(parseLocalDate(maximum)) - 1);
  const month = Math.max(firstMonth, Math.min(lastMonth, requestedMonth));
  calendarElement.dataset.year = Math.floor(month / 12);
  calendarElement.dataset.month = month % 12;
}

function calendar() {
  const today = todayDate();
  const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return '<div class="z-calendar" role="group" aria-label="选择日期范围" data-year="' + first.getFullYear() + '" data-month="' + first.getMonth() + '" data-start="" data-end=""></div>';
}

function initCalendar(calendarElement) {
  setCalendarMonth(calendarElement, Number(calendarElement.dataset.year) * 12 + Number(calendarElement.dataset.month));
  drawCalendar(calendarElement);
}

function drawCalendar(calendarElement) {
  const year = Number(calendarElement.dataset.year);
  const month = Number(calendarElement.dataset.month);
  const unit = calendarElement.dataset.unit === 'year' ? 'year' : 'month';
  const { minimum, maximum } = dateBounds(calendarElement);
  const firstMonth = monthNumber(parseLocalDate(minimum));
  const lastMonth = Math.max(firstMonth, monthNumber(parseLocalDate(maximum)) - 1);
  const visibleMonth = year * 12 + month;
  const today = fmt(todayDate());
  const caret = '<img class="calendar-caret" alt="" width="12" height="12" src="assets/94ac9.svg">';
  let html = '';

  for (let side = 0; side < 2; side++) {
    const first = new Date(year, month + side, 1);
    const currentYear = first.getFullYear();
    const currentMonth = first.getMonth();
    const offset = (first.getDay() + 6) % 7;
    html += '<div class="month"><div class="month-head"><div class="month-selectors">';
    html += '<button class="cal-select" data-select="year" data-side="' + side + '" aria-label="' + (side ? '右侧' : '左侧') + '年份" aria-expanded="false">' + currentYear + caret + '</button>';
    html += '<button class="cal-select" data-select="month" data-side="' + side + '" aria-label="' + (side ? '右侧' : '左侧') + '月份" aria-expanded="false">' + (currentMonth + 1) + '月' + caret + '</button></div>';
    html += '<div class="navigation"><button data-nav="-1" aria-label="向前浏览" ' + (visibleMonth <= firstMonth ? 'disabled' : '') + '><img alt="" width="14" height="14" src="assets/e7b5b.svg"></button>';
    html += '<button data-unit aria-label="切换导航单位">' + (unit === 'year' ? '年' : '月') + '</button>';
    html += '<button class="next" data-nav="1" aria-label="向后浏览" ' + (visibleMonth >= lastMonth ? 'disabled' : '') + '><img alt="" width="14" height="14" src="assets/6958d.svg"></button></div></div>';
    html += '<div class="days">' + ['一', '二', '三', '四', '五', '六', '日'].map(day => '<span class="week">' + day + '</span>').join('');

    for (let cell = 0; cell < 42; cell++) {
      const date = new Date(currentYear, currentMonth, 1 - offset + cell);
      const value = fmt(date);
      const disabled = date.getMonth() !== currentMonth || value < minimum || value > maximum;
      html += '<button data-date="' + value + '" aria-label="' + value + '" aria-pressed="false" ' + (disabled ? 'disabled' : '') + ' class="' + (!disabled && value === today ? 'today' : '') + '"><span class="day-number">' + date.getDate() + '</span></button>';
    }
    html += '</div></div>';
  }
  calendarElement.innerHTML = html;
  updateCalendarRange(calendarElement);
}

function updateCalendarRange(calendarElement) {
  const start = calendarElement.dataset.start;
  const end = calendarElement.dataset.end || calendarElement.dataset.preview;
  const lower = start && end ? [start, end].sort()[0] : start;
  const upper = start && end ? [start, end].sort()[1] : '';
  calendarElement.querySelectorAll('.days').forEach(grid => {
    const buttons = Array.from(grid.querySelectorAll('[data-date]'));
    buttons.forEach((button, index) => {
      const selected = !button.disabled && (button.dataset.date === start || button.dataset.date === calendarElement.dataset.end);
      const inRange = !button.disabled && lower && upper && button.dataset.date >= lower && button.dataset.date <= upper;
      const next = buttons[index + 1];
      const continues = inRange && index % 7 !== 6 && next && !next.disabled && next.dataset.date <= upper;
      button.classList.toggle('selected', Boolean(selected));
      button.classList.toggle('range', Boolean(inRange));
      button.classList.toggle('range-continues', Boolean(continues));
      button.setAttribute('aria-pressed', String(Boolean(selected)));
    });
  });
}

function closeCalendarOptions(calendarElement) {
  calendarElement.querySelector('.cal-options')?.remove();
  calendarElement.querySelectorAll('.cal-select').forEach(button => {
    button.classList.remove('expanded');
    button.setAttribute('aria-expanded', 'false');
  });
}

function showSelect(calendarElement, type, side) {
  const trigger = calendarElement.querySelector('.month:nth-child(' + (side + 1) + ') [data-select="' + type + '"]');
  const wasOpen = trigger.classList.contains('expanded');
  closeCalendarOptions(calendarElement);
  if (wasOpen) return;
  trigger.classList.add('expanded');
  trigger.setAttribute('aria-expanded', 'true');

  const { minimum, maximum } = dateBounds(calendarElement);
  const visible = new Date(Number(calendarElement.dataset.year), Number(calendarElement.dataset.month) + side, 1);
  const chosen = type === 'year' ? visible.getFullYear() : visible.getMonth() + 1;
  const firstYear = parseLocalDate(minimum).getFullYear();
  const lastYear = parseLocalDate(maximum).getFullYear();
  const values = type === 'year' ? Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index) : Array.from({ length: 12 }, (_, index) => index + 1);
  const options = document.createElement('div');
  options.className = 'cal-options';
  options.setAttribute('role', 'group');
  options.setAttribute('aria-label', type === 'year' ? '年份选项' : '月份选项');
  options.style.left = (side * 262 + 16 + (type === 'month' ? 88 : 0)) + 'px';
  options.innerHTML = values.map(value => {
    const candidate = type === 'year' ? new Date(value, visible.getMonth(), 1) : new Date(visible.getFullYear(), value - 1, 1);
    const end = new Date(candidate.getFullYear(), candidate.getMonth() + 1, 0);
    const disabled = fmt(end) < minimum || fmt(candidate) > maximum;
    return '<button class="' + (value === chosen ? 'chosen' : '') + '" data-value="' + value + '" data-type="' + type + '" data-side="' + side + '" ' + (disabled ? 'disabled' : '') + '>' + value + (type === 'month' ? '月' : '') + '</button>';
  }).join('');
  calendarElement.append(options);
  options.scrollTop = Math.max(0, (values.indexOf(chosen) - 4) * 32);
}

function closeDatePicker(wrapper, restoreFocus = false) {
  const trigger = wrapper.querySelector('.z-date');
  const panel = wrapper.querySelector('.z-calendar');
  if (panel) {
    closeCalendarOptions(panel);
    panel.hidden = true;
    panel.dataset.start = wrapper.dataset.start || '';
    panel.dataset.end = wrapper.dataset.end || '';
    panel.dataset.preview = '';
  }
  trigger.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.querySelector('img').src = 'assets/a435c.svg';
  if (restoreFocus) trigger.focus();
}

function openDatePicker(wrapper) {
  document.querySelectorAll('.date-wrap').forEach(other => {
    if (other !== wrapper) closeDatePicker(other);
  });
  let panel = wrapper.querySelector('.z-calendar');
  if (!panel) {
    wrapper.insertAdjacentHTML('beforeend', calendar());
    panel = wrapper.querySelector('.z-calendar');
  }
  panel.hidden = false;
  panel.dataset.start = wrapper.dataset.start || '';
  panel.dataset.end = wrapper.dataset.end || '';
  panel.dataset.preview = '';
  initCalendar(panel);
  const trigger = wrapper.querySelector('.z-date');
  trigger.classList.add('open');
  trigger.setAttribute('aria-expanded', 'true');
  trigger.querySelector('img').src = 'assets/calendar-active.svg';
}

function dateRuntime(root = document) {
  root.addEventListener('click', event => {
    const wrapper = event.target.closest('.date-wrap');
    if (!wrapper) {
      if (event.target.closest('[data-action=svg], [data-action=code]')) return;
      root.querySelectorAll('.date-wrap').forEach(item => closeDatePicker(item));
      return;
    }
    const trigger = event.target.closest('.z-date');
    if (trigger && !trigger.disabled) {
      trigger.classList.contains('open') ? closeDatePicker(wrapper) : openDatePicker(wrapper);
      return;
    }
    const panel = wrapper.querySelector('.z-calendar');
    const direction = event.target.closest('[data-nav]');
    const unit = event.target.closest('[data-unit]');
    const select = event.target.closest('[data-select]');
    const option = event.target.closest('[data-value]');
    const day = event.target.closest('[data-date]');
    if (direction && !direction.disabled) {
      const step = panel.dataset.unit === 'year' ? 12 : 1;
      setCalendarMonth(panel, Number(panel.dataset.year) * 12 + Number(panel.dataset.month) + Number(direction.dataset.nav) * step);
      drawCalendar(panel);
    } else if (unit) {
      panel.dataset.unit = panel.dataset.unit === 'year' ? 'month' : 'year';
      drawCalendar(panel);
    } else if (select) {
      showSelect(panel, select.dataset.select, Number(select.dataset.side));
    } else if (option && !option.disabled) {
      const side = Number(option.dataset.side);
      const visible = new Date(Number(panel.dataset.year), Number(panel.dataset.month) + side, 1);
      const requested = option.dataset.type === 'year' ? Number(option.dataset.value) * 12 + visible.getMonth() - side : visible.getFullYear() * 12 + Number(option.dataset.value) - 1 - side;
      setCalendarMonth(panel, requested);
      drawCalendar(panel);
    } else if (day && !day.disabled) {
      if (!panel.dataset.start || panel.dataset.end) {
        panel.dataset.start = day.dataset.date;
        panel.dataset.end = '';
        panel.dataset.preview = '';
        updateCalendarRange(panel);
      } else {
        const [start, end] = [panel.dataset.start, day.dataset.date].sort();
        wrapper.dataset.start = start;
        wrapper.dataset.end = end;
        wrapper.querySelector('.start-value').textContent = start;
        wrapper.querySelector('.end-value').textContent = end;
        wrapper.querySelector('.z-date').classList.remove('is-empty');
        wrapper.querySelector('.z-date').setAttribute('aria-label', start + ' 至 ' + end);
        closeDatePicker(wrapper, true);
        wrapper.dispatchEvent(new CustomEvent('datechange', { bubbles: true, detail: { start, end } }));
      }
    } else if (!event.target.closest('.cal-options')) {
      closeCalendarOptions(panel);
    }
  });
  root.addEventListener('mouseover', event => {
    const trigger = event.target.closest('.z-date');
    if (trigger && !trigger.disabled) trigger.querySelector('img').src = 'assets/calendar-active.svg';
    const day = event.target.closest('[data-date]');
    if (!day || day.disabled) return;
    const panel = day.closest('.z-calendar');
    if (panel.dataset.start && !panel.dataset.end) {
      panel.dataset.preview = day.dataset.date;
      updateCalendarRange(panel);
    }
  });
  root.addEventListener('mouseout', event => {
    const trigger = event.target.closest('.z-date');
    if (trigger && !trigger.contains(event.relatedTarget) && !trigger.classList.contains('open')) trigger.querySelector('img').src = 'assets/a435c.svg';
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') root.querySelectorAll('.date-wrap .z-date.open').forEach(trigger => closeDatePicker(trigger.closest('.date-wrap'), true));
    if (event.key === 'ArrowDown' && event.target.matches('.z-date') && !event.target.disabled) {
      event.preventDefault();
      openDatePicker(event.target.closest('.date-wrap'));
      event.target.closest('.date-wrap').querySelector('.cal-select')?.focus();
    }
  });
}

function quickRuntime(root=document){
 const timers=new WeakMap();
 const arrow='<img alt="" width="10" height="10" src="assets/f2d08.svg">';
 function close(wrap){
  clearTimeout(timers.get(wrap));wrap.querySelector('.quick-panel')?.remove();wrap.classList.remove('open');
  wrap.querySelector('.more')?.setAttribute('aria-expanded','false');
 }
 function open(wrap){
  clearTimeout(timers.get(wrap));const more=wrap.querySelector('.more');if(!more||more.disabled)return;
  if(!wrap.querySelector('.quick-panel')){
   root.querySelectorAll('.z-quick.open').forEach(w=>{if(w!==wrap)close(w)});
   wrap.insertAdjacentHTML('beforeend',panel());
  }
  wrap.classList.add('open');more.setAttribute('aria-expanded','true');more.setAttribute('aria-haspopup','listbox');
  const chosen=wrap.dataset.moreSelection||'';
  wrap.querySelectorAll('[data-option]').forEach(b=>{b.classList.toggle('chosen',b.dataset.option===chosen);b.setAttribute('aria-selected',String(b.dataset.option===chosen));});
 }
 function later(wrap){clearTimeout(timers.get(wrap));timers.set(wrap,setTimeout(()=>close(wrap),120))}
 root.addEventListener('mouseover',e=>{
  const wrap=e.target.closest('.z-quick');if(!wrap)return;
  if(e.target.closest('.more,.quick-panel'))open(wrap);
 });
 root.addEventListener('mouseout',e=>{
  const from=e.target.closest('.more,.quick-panel');if(!from)return;
  const wrap=from.closest('.z-quick'),to=e.relatedTarget;
  if(to instanceof Element&&to.closest('.more,.quick-panel')?.closest('.z-quick')===wrap)return;
  later(wrap);
 });
 root.addEventListener('click',e=>{
  const button=e.target.closest('[data-quick]'),option=e.target.closest('[data-option]');
  if(button&&!button.disabled){
   const wrap=button.closest('.z-quick');
   if(button.dataset.quick==='3')open(wrap);
   else{
    wrap.querySelectorAll('[data-quick]').forEach(b=>{b.classList.toggle('chosen',b===button);b.setAttribute('aria-pressed',String(b===button))});
    delete wrap.dataset.moreSelection;wrap.querySelector('.more').innerHTML='更多'+arrow;close(wrap);
    wrap.dispatchEvent(new CustomEvent('quickchange',{bubbles:true,detail:{value:button.textContent.trim()}}));
   }
  }else if(option&&!option.disabled){
   const wrap=option.closest('.z-quick');if(!wrap)return;
   wrap.dataset.moreSelection=option.dataset.option;
   wrap.querySelectorAll('[data-quick]').forEach(b=>{b.classList.toggle('chosen',b.dataset.quick==='3');b.setAttribute('aria-pressed',String(b.dataset.quick==='3'))});
   wrap.querySelector('.more').innerHTML=esc(option.dataset.option)+arrow;close(wrap);
   wrap.dispatchEvent(new CustomEvent('quickchange',{bubbles:true,detail:{value:option.dataset.option}}));
  }else if(!e.target.closest('.z-quick')&&!e.target.closest('[data-action=svg], [data-action=code]'))root.querySelectorAll('.z-quick.open').forEach(close);
 });
 root.addEventListener('focusin',e=>{const more=e.target.closest('.more');if(more)open(more.closest('.z-quick'));else if(e.target.closest('.quick-panel'))clearTimeout(timers.get(e.target.closest('.z-quick')))});
 root.addEventListener('focusout',e=>{const wrap=e.target.closest('.z-quick');if(wrap&&!wrap.contains(e.relatedTarget))later(wrap)});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'){root.querySelectorAll('.z-quick.open').forEach(w=>{close(w);w.querySelector('.more')?.blur()})}});
}
function legacyRuntime(root = document) {
  root.addEventListener('click', event => {
    const tab = event.target.closest('.fund-tabs-demo button, .tab-variant .visual-segmented button');
    if (tab && !tab.disabled) {
      tab.parentElement.querySelectorAll('button').forEach(button => {
        const selected = button === tab;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-selected', String(selected));
        if (button.hasAttribute('aria-pressed')) button.setAttribute('aria-pressed', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
    }

    const trigger = event.target.closest('.select-control');
    const option = event.target.closest('[data-legacy-value]');
    const parent = event.target.closest('[data-legacy-parent]');
    if (trigger) {
      const container = trigger.closest('.control-example');
      const existing = container.querySelector('.legacy-menu');
      root.querySelectorAll('.legacy-menu').forEach(menu => menu.remove());
      root.querySelectorAll('.select-control').forEach(button => button.setAttribute('aria-expanded', 'false'));
      if (existing) return;
      const menu = document.createElement('div');
      menu.className = 'legacy-menu';
      menu.setAttribute('role', 'group');
      menu.setAttribute('aria-label', '下拉选项');
      if (trigger.classList.contains('cascader-control')) {
        menu.classList.add('legacy-cascade');
        menu.innerHTML = '<div class="legacy-parent">' + ['板块', '申万行业', '中信行业'].map(label => '<button data-legacy-parent="' + label + '">' + label + ' ›</button>').join('') + '</div><div class="legacy-child"><button data-legacy-value="板块 / 申万一级行业">申万一级行业</button><button data-legacy-value="板块 / 中信一级行业">中信一级行业</button></div>';
      } else {
        menu.innerHTML = ['近一月', '近三月', '近半年', '近一年', '近三年'].map(label => '<button data-legacy-value="' + label + '" class="' + (trigger.textContent.trim() === label ? 'selected' : '') + '">' + label + '</button>').join('');
      }
      trigger.setAttribute('aria-expanded', 'true');
      container.append(menu);
    } else if (parent) {
      const children = parent.dataset.legacyParent === '板块' ? ['申万一级行业', '中信一级行业'] : ['一级行业', '二级行业', '三级行业'];
      parent.closest('.legacy-menu').querySelector('.legacy-child').innerHTML = children.map(label => '<button data-legacy-value="' + parent.dataset.legacyParent + ' / ' + label + '">' + label + '</button>').join('');
      parent.parentElement.querySelectorAll('button').forEach(button => button.classList.toggle('selected', button === parent));
    } else if (option) {
      const container = option.closest('.control-example');
      const button = container.querySelector('.select-control');
      button.textContent = option.dataset.legacyValue;
      button.setAttribute('aria-expanded', 'false');
      container.querySelector('.legacy-menu').remove();
    } else {
      root.querySelectorAll('.legacy-menu').forEach(menu => menu.remove());
      root.querySelectorAll('.select-control').forEach(button => button.setAttribute('aria-expanded', 'false'));
    }
  });
  root.addEventListener('keydown', event => {
    const tab = event.target.closest('.fund-tabs-demo button, .tab-variant .visual-segmented button');
    if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const tabs = Array.from(tab.parentElement.querySelectorAll('button:not(:disabled)'));
      let index = tabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : -1);
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      const next = tabs[(index + tabs.length) % tabs.length];
      next.click();
      next.focus();
    }
    if (event.key === 'Escape') {
      root.querySelectorAll('.legacy-menu').forEach(menu => menu.remove());
      root.querySelectorAll('.select-control').forEach(button => button.setAttribute('aria-expanded', 'false'));
    }
  });
}

function runtime(root = document) {
  quickRuntime(root);
  dateRuntime(root);
  legacyRuntime(root);
  root.addEventListener('click', event => {
    if (event.target.closest('.backtop')) window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
runtime();
async function svgFor(element) {
  await document.fonts.ready;
  let bounds = element.getBoundingClientRect();
  for (const child of element.querySelectorAll('*')) {
    const rectangle = child.getBoundingClientRect();
    if (!rectangle.width || !rectangle.height || getComputedStyle(child).visibility === 'hidden') continue;
    const left = Math.min(bounds.x, rectangle.x);
    const top = Math.min(bounds.y, rectangle.y);
    bounds = {
      x: left,
      y: top,
      width: Math.max(bounds.x + bounds.width, rectangle.right) - left,
      height: Math.max(bounds.y + bounds.height, rectangle.bottom) - top
    };
  }
  const parts = [];
  const namespace = 'http://www.w3.org/2000/svg';

  function vectorMarkup(source, x, y, width, height, color, angle = 0) {
    const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
    const svg = parsed.documentElement;
    if (svg.tagName.toLowerCase() !== 'svg') throw new Error('SVG 资源格式错误');
    svg.querySelectorAll('script, foreignObject').forEach(node => node.remove());
    const sourceWidth = parseFloat(svg.getAttribute('width')) || width;
    const sourceHeight = parseFloat(svg.getAttribute('height')) || height;
    if (!svg.hasAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 ' + sourceWidth + ' ' + sourceHeight);
    svg.setAttribute('xmlns', namespace);
    svg.setAttribute('x', x);
    svg.setAttribute('y', y);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('color', color);
    if (angle) svg.setAttribute('transform', 'rotate(' + angle + ' ' + (x + width / 2) + ' ' + (y + height / 2) + ')');
    return new XMLSerializer().serializeToString(svg);
  }

  async function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rectangle = range.getBoundingClientRect();
      if (!rectangle.width) return;
      const style = getComputedStyle(node.parentElement);
      parts.push('<text x="' + (rectangle.x - bounds.x) + '" y="' + (rectangle.y - bounds.y + rectangle.height * 0.8) + '" fill="' + style.color + '" font-family="' + esc(style.fontFamily) + '" font-size="' + style.fontSize + '" font-weight="' + style.fontWeight + '">' + esc(node.textContent.trim()) + '</text>');
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const style = getComputedStyle(node);
    const rectangle = node.getBoundingClientRect();
    if (!rectangle.width || !rectangle.height || style.display === 'none' || style.visibility === 'hidden') return;
    const x = rectangle.x - bounds.x;
    const y = rectangle.y - bounds.y;
    if (node.tagName.toLowerCase() === 'svg') {
      parts.push(vectorMarkup(node.outerHTML, x, y, rectangle.width, rectangle.height, style.color));
      return;
    }
    if (node.tagName === 'IMG') {
      const response = await fetch(node.currentSrc || node.src);
      if (!response.ok) throw new Error('图标资源读取失败');
      const source = await response.text();
      let angle = 0;
      if (style.transform.startsWith('matrix(')) {
        const matrix = style.transform.slice(7, -1).split(',').map(Number);
        angle = Math.atan2(matrix[1], matrix[0]) * 180 / Math.PI;
      }
      parts.push(vectorMarkup(source, x, y, rectangle.width, rectangle.height, style.color, angle));
      return;
    }
    if (node.classList.contains('range')) {
      parts.push('<rect x="' + x + '" y="' + y + '" width="' + (rectangle.width + (node.classList.contains('range-continues') ? 8 : 0)) + '" height="' + rectangle.height + '" fill="#f4f4fc"/>');
    }
    const border = parseFloat(style.borderTopWidth);
    const background = style.backgroundColor;
    if (background !== 'rgba(0, 0, 0, 0)' || border) {
      parts.push('<rect x="' + (x + border / 2) + '" y="' + (y + border / 2) + '" width="' + Math.max(0, rectangle.width - border) + '" height="' + Math.max(0, rectangle.height - border) + '" rx="' + Math.min(parseFloat(style.borderTopLeftRadius) || 0, rectangle.height / 2) + '" fill="' + (background === 'rgba(0, 0, 0, 0)' ? 'none' : background) + '" stroke="' + (border ? style.borderTopColor : 'none') + '" stroke-width="' + border + '"/>');
    }
    if (node.classList.contains('fund-tabs-demo')) {
      parts.push('<rect x="'+x+'" y="'+(y+rectangle.height-1)+'" width="'+rectangle.width+'" height="1" fill="#d9d9d9"/>');
    }
    if (node.classList.contains('fund-tab-demo') && node.classList.contains('is-active')) {
      parts.push('<path d="M'+x+' '+(y+rectangle.height)+'v-1a2 2 0 0 1 2-2h'+Math.max(0,rectangle.width-4)+'a2 2 0 0 1 2 2v1z" fill="#6865a7"/>');
    }
    for (const child of node.childNodes) await walk(child);
    // The original select arrow is a CSS pseudo-element containing a vector.
    if (node.classList.contains('select-control')) {
      const pseudo = getComputedStyle(node, '::after');
      const match = pseudo.backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);
      if (match) {
        const response = await fetch(match[1]);
        parts.push(vectorMarkup(await response.text(), x + rectangle.width - 22, y + (rectangle.height - 12) / 2, 12, 12, style.color));
      }
    }
  }
  await walk(element);
  return '<svg xmlns="' + namespace + '" width="' + Math.ceil(bounds.width) + '" height="' + Math.ceil(bounds.height) + '" viewBox="0 0 ' + Math.ceil(bounds.width) + ' ' + Math.ceil(bounds.height) + '">' + parts.join('') + '</svg>';
}

async function makeCode(c){const css='*{box-sizing:border-box}body{font:14px/1.6 "PingFang SC",sans-serif;color:#333}button{font:inherit;cursor:pointer}button:disabled{cursor:not-allowed}'+(await(await fetch('design-tokens.css')).text())+(await(await fetch('component-tokens.css')).text())+(await(await fetch('legacy-tokens.css')).text())+(await(await fetch('audit-components.css')).text())+'\n/* '+(await(await fetch('assets/audit/Roboto-OFL.txt')).text())+' */';let out='<!doctype html>\n<html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+c.name+'</title><style>'+css+'\nbody{margin:32px}#export{display:inline-flex}</style><div id="export">'+c.html+'</div><script>const esc='+esc.toString()+';const fmt='+fmt.toString()+';'+[parseLocalDate,todayDate,dateBounds,monthNumber,setCalendarMonth,calendar,panel,initCalendar,drawCalendar,updateCalendarRange,closeCalendarOptions,showSelect,closeDatePicker,openDatePicker,dateRuntime,quickRuntime,legacyRuntime,runtime,auditRuntime].map(f=>f.toString()).join('\n')+';document.querySelectorAll(".z-calendar").forEach(drawCalendar);runtime();auditRuntime();<\/script></html>';const files=[...new Set([...out.matchAll(/assets\/(?:[\w-]+\/)*[\w-]+\.(?:svg|ttf)/g)].map(m=>m[0]))];for (const file of files) {
  const response = await fetch(file);
  if (!response.ok) throw new Error('Missing export asset');
  if (file.endsWith('.ttf')) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    out = out.replaceAll(file, 'data:font/ttf;base64,' + btoa(binary));
  } else {
    const text = (await response.text()).replace(/<script[\s\S]*?<\/script>/g, '');
    out = out.replaceAll(file, 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(text))));
  }
}
return out}

function save(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
document.addEventListener('click',async e=>{const p=e.target.closest('[data-page]'),t=e.target.closest('[data-tab]'),f=e.target.closest('[data-filter]'),a=e.target.closest('[data-action]');if(p){if(p.dataset.page==='overview'){overview();return}current=p.dataset.page;filter='';$('#search').value='';location.hash=current;render()}if(t){tab=t.dataset.tab;render()}if(f){filter=f.dataset.filter;render()}if(e.target.closest('[data-copy-spec]'))copy(specText());const color=e.target.closest('[data-color]');if(color)copy(color.dataset.color);if(a){const legacy=a.closest('[data-original-component]');const c=legacy?{name:legacy.querySelector('h3').textContent,html:legacy.querySelector('.component-demo-surface').innerHTML}:cards[+a.dataset.i];try{if(a.dataset.action==='spec')viewSpec(c);else if(a.dataset.action==='svg')await copy(await svgFor((legacy?legacy.querySelector('.component-demo-surface'):a.closest('.card').querySelector('.sample'))));else{const sample=legacy?legacy.querySelector('.component-demo-surface'):a.closest('.card')?.querySelector('.sample');const live=sample?{...c,html:sample.innerHTML}:c;codeValue=await makeCode(live);$('#dialog-title').textContent=c.name+' · 开发代码';$('#code-text').textContent=codeValue;$('#code-dialog').showModal()}}catch(err){toast('操作失败，请重试')}}});
$('#copy-code').onclick=()=>copy(codeValue);$('#download-code').onclick=()=>save('zhice-component.html',codeValue,'text/html');$('#close-dialog').onclick=()=>$('#code-dialog').close();$('#code-dialog').addEventListener('click',e=>{if(e.target===$('#code-dialog'))$('#code-dialog').close()});$('#search')?.addEventListener('input',()=>{tab='components';render()});document.addEventListener('keydown',e=>{if(e.key==='/'&&e.target.tagName!=='INPUT'){e.preventDefault();$('#search')?.focus()}});window.addEventListener('scroll',()=>{$('#floating-top').style.display=scrollY>innerHeight?'flex':'none'});
function overview(){$('#title').innerHTML='设计规范 <span>Design System</span>';$('#description').textContent='一份标准，连接产品设计与开发实现。';$('#crumb').textContent='规范总览';document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='overview'));$('#content').innerHTML='<div class="section-heading"><h2>组件目录</h2><span>04 COMPONENTS</span></div><div class="overview-grid">'+Object.entries(pages).map(([k,p],i)=>'<button class="overview-item" data-page="'+k+'"><span>0'+(i+1)+' / '+p.en+'</span><h3>'+p.title+'</h3><p>'+p.desc+'</p><span>查看组件与规范 →</span></button>').join('')+'</div><div class="section-heading"><h2>基础规范</h2></div>'+specs()}
if(pages[location.hash.slice(1)])current=location.hash.slice(1);render();

document.addEventListener('click', e=>{
 const sample=e.target.closest('.component-workbench .sample');
 if(!sample)return;
 const action=e.target.closest('.z-btn,.z-download');
 if(!action||action.disabled)return;
 if(action.classList.contains('secondary'))toast('已清空示例选择');
 else if(action.classList.contains('z-download'))toast('下载操作已触发');
 else toast('开始比较操作已触发');
});

$('#close-spec-dialog').onclick=()=>$('#spec-dialog').close();
$('#spec-dialog').addEventListener('click',e=>{if(e.target===$('#spec-dialog'))$('#spec-dialog').close()});

// Keep the original component documentation in the same on-demand dialog.
const originalComponentSpecs = new Map();

document.querySelectorAll('#visual-panel-components .component-spec:not(.integrated-spec)').forEach((component, index) => {
  const heading = component.querySelector(':scope > h3');
  const layout = component.querySelector(':scope > .component-spec-layout');
  if (!heading || !layout) return;

  const description = Array.from(layout.children).find(child => child.querySelector('.component-rule-list'));
  if (!description) return;

  const key = 'original-' + index;
  component.dataset.originalComponent = key;
  originalComponentSpecs.set(key, {
    title: heading.textContent.trim(),
    html: description.innerHTML
  });
  description.remove();

  const headingRow = document.createElement('div');
  headingRow.className = 'original-spec-heading';
  heading.before(headingRow);
  headingRow.append(heading);

  const viewButton = document.createElement('button');
  viewButton.type = 'button';
  viewButton.className = 'original-spec-button';
  viewButton.dataset.originalSpec = key;
  viewButton.textContent = '查看规范';
  const actions = document.createElement('div');
  actions.className = 'actions';
  const svgButton = document.createElement('button');
  svgButton.type = 'button';
  svgButton.dataset.action = 'svg';
  svgButton.textContent = '复制 SVG';
  const codeButton = document.createElement('button');
  codeButton.type = 'button';
  codeButton.dataset.action = 'code';
  codeButton.textContent = '</> 查看代码';
  actions.append(svgButton, viewButton, codeButton);
  headingRow.append(actions);
});

document.addEventListener('click', event => {
  const button = event.target.closest('[data-original-spec]');
  if (!button) return;

  const specification = originalComponentSpecs.get(button.dataset.originalSpec);
  if (!specification) return;
  document.getElementById('spec-dialog-title').textContent = specification.title + ' · 设计规范';
  document.getElementById('spec-dialog-body').innerHTML = specification.html;
  document.getElementById('spec-dialog').showModal();
});

// Each preview owns its export and documentation controls.
function installIndividualComponentActions() {
  const sections = document.querySelectorAll('[data-original-component]');
  sections.forEach(section => {
    const key = section.dataset.originalComponent;
    const specification = originalComponentSpecs.get(key);
    const variants = section.querySelectorAll('.tab-variant, .control-example, .business-tag-example');
    const targets = variants.length ? Array.from(variants) : [section.querySelector('.component-demo-surface')];
    section.querySelector('.original-spec-heading .actions')?.remove();
    targets.forEach(target => {
      const label = target.querySelector(':scope > span');
      const name = label?.textContent.trim() || specification.title;
      const sample = document.createElement('div');
      sample.className = 'individual-component-sample';
      // Keep the original wrapper so exported controls retain their runtime selectors.
      target.before(sample);
      sample.append(target);
      addIndividualActions(sample, name, specification.html);
    });
  });

  const buttonCard = document.querySelector('#content [data-card="0"]');
  const group = buttonCard?.querySelector('.z-group');
  if (group) {
    buttonCard.querySelector('.spec-heading .actions')?.remove();
    Array.from(group.children).forEach((button, index) => {
      const sample = document.createElement('div');
      sample.className = 'individual-component-sample';
      button.before(sample);
      sample.append(button);
      addIndividualActions(sample, ['主要按钮', '次要按钮', '下载按钮'][index], null, 'buttons');
    });
  }
}

function addIndividualActions(sample, name, specification, page) {
  const unit = document.createElement('section');
  unit.className = 'individual-component';
  sample.before(unit);
  const heading = document.createElement('div');
  heading.className = 'individual-component-heading';
  const title = document.createElement('h4');
  title.textContent = name;
  const actions = document.createElement('div');
  actions.className = 'actions';
  [['svg', '复制 SVG'], ['spec', '查看规范'], ['code', '</> 查看代码']].forEach(([action, text]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', async event => {
      event.stopPropagation();
      const component = {name, html: sample.innerHTML, page};
      try {
        if (action === 'svg') await copy(await svgFor(sample));
        if (action === 'code') {
          codeValue = await makeCode(component);
          $('#dialog-title').textContent = name + ' · 开发代码';
          $('#code-text').textContent = codeValue;
          $('#code-dialog').showModal();
        }
        if (action === 'spec') {
          if (page) viewSpec(component);
          else {
            $('#spec-dialog-title').textContent = name + ' · 设计规范';
            const content = document.createElement('div');
            content.innerHTML = specification;
            if (name === '胶囊分段 Tab') {
              content.innerHTML = '<dl class="component-rule-list">' + [
                ['容器高度','32px'],['选项高度','28px'],['容器内距','2px'],
                ['选项内距','左右12px'],['圆角','容器32px / 选项22px'],
                ['文字','14px 苹方 Regular；选中 Medium'],
                ['默认文字','#555759'],['选中样式','#F2F3F5 背景 / #333333 文字'],
                ['容器背景','#FFFFFF'],['容器阴影','0 0 12px rgba(0,0,0,.08)'],
                ['宽度','根据选项内容自适应']
              ].map(row=>'<div><dt>'+row[0]+'</dt><dd>'+row[1]+'</dd></div>').join('') + '</dl><p class="component-rule-note">同一时间只选中一项；点击切换，移入显示浅灰底。整体样式按提供的胶囊选择器规范。</p>';
            }

            if (name === '下划线 Tab（一级 Tab）') {
              content.innerHTML = '<dl class="component-rule-list">' + [
                ['整组尺寸','默认 1328 × 65px，宽度填充容器'],
                ['单项内容高度','64px'],['底部分割线','1px / #D9D9D9'],
                ['文字','16px / PingFang SC；默认 400，选中 600'],
                ['文字颜色','默认 #555759；移入 #6865A7；选中 #333333；禁用 #CBCBCB'],
                ['左右内边距 / 项间距','20px / 20px'],
                ['选中指示线','3px / #6865A7；顶部圆角 4px；宽度跟随文字']
              ].map(row => '<div><dt>'+row[0]+'</dt><dd>'+row[1]+'</dd></div>').join('') + '</dl><p>单击切换，同一时间只选中一项；再次点击当前项保持不变。移入仅强调文字，禁用项不可切换。支持方向键、Home 和 End 切换。</p><a href="https://www.figma.com/design/rTKeLXF81fJZFEsIIjZWXp/?node-id=235-9961" target="_blank" rel="noreferrer">查看 Figma 源组件 ↗</a>';
            }
            const excluded = name === '下划线 Tab' ? ['分段', '容器圆角'] : name === '胶囊分段 Tab' ? ['下划线', '指示条'] : name === '普通下拉' ? ['联级宽度'] : name === '分级标签' ? ['单级底色', '同级间距'] : [];
            content.querySelectorAll('.component-rule-list > div').forEach(row => {
              if (excluded.some(text => row.querySelector('dt')?.textContent.includes(text))) row.remove();
            });
            const notes = {
              '下划线 Tab': '用于页面主要内容视图切换。同一个控件内只保留一个选中项。',
              '胶囊分段 Tab': '用于图表或模块内的平级数据视图切换。同一个控件内只保留一个选中项。',
              '普通下拉': '用于周期、基准等单级选择。弹出菜单宽度不小于触发器。',
              '联级下拉': '用于板块与行业等树形分类，触发器中保留层级路径。',
              '分级标签': '按父级到子级从左向右排列，底色逐级变浅。',
              '单级标签': '使用浅紫胶囊表达独立的分类信息。'
            };
            if (notes[name] && content.querySelector('.component-rule-note')) content.querySelector('.component-rule-note').textContent = notes[name];
            $('#spec-dialog-body').replaceChildren(content);
            $('#spec-dialog').showModal();
          }
        }
      } catch (error) { toast('操作失败，请重试'); }
    });
    actions.append(button);
  });
  heading.append(title, actions);
  unit.append(heading, sample);
}
installIndividualComponentActions();

function styleComponentActions() {
  const paths = {
    svg: '<rect x="7" y="7" width="11" height="13" rx="2"/><path d="M14 7V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v11h3"/>',
    spec: '<path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4zM14 7a3 3 0 0 1 3-3h3v14h-3a3 3 0 0 0-3 3"/>',
    code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>',
    figma: '<path d="M14 4h6v6M20 4l-9 9M10 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-5"/>'
  };
  document.querySelectorAll('#visual-panel-components .actions button, #visual-panel-components .actions a').forEach(action => {
    const text = action.textContent;
    const kind = text.includes('SVG') ? 'svg' : text.includes('规范') ? 'spec' : text.includes('代码') ? 'code' : 'figma';
    const label = kind === 'svg' ? '复制 SVG' : kind === 'spec' ? '查看规范' : kind === 'code' ? '查看代码' : 'Figma 源组件';
    action.classList.add('component-text-action');
    action.innerHTML = '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + paths[kind] + '</svg><span>' + label + '</span>';
  });
}
styleComponentActions();

// Keep the catalog focused on component previews and their own actions.
const catalog = document.getElementById('visual-panel-components');
catalog.querySelector('.visual-section-heading')?.remove();
catalog.querySelector('.visual-method-note')?.remove();
catalog.querySelectorAll('.individual-component-sample').forEach(sample => {
  sample.querySelectorAll('.tab-variant > span, .control-example > span, .business-tag-example > span').forEach(label => label.remove());
});
const tableSection = catalog.querySelector('.table-spec');
if (tableSection) {
  const duplicateHeading = tableSection.querySelector('.original-spec-heading');
  if (duplicateHeading) duplicateHeading.remove();
  const heading = tableSection.querySelector('.individual-component-heading h4');
  if (heading) {
    const title = document.createElement('h3');
    title.textContent = heading.textContent;
    heading.replaceWith(title);
  }
}
