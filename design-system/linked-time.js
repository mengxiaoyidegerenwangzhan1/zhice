(function exposeLinkedTime() {
  'use strict';

  const title = '时段快捷选择与日期区间';
  const rules = [
    ['默认进入', '有时段快捷选择时，选中配置的默认项并同步日期范围；单独使用日期框时保持为空。'],
    ['点击快捷项', '选项高亮，日期框同步显示起止日期，结果立即更新。'],
    ['选择更多区间或年度', '其他选项取消高亮，更多回显所选名称，面板收起。'],
    ['展开经理任期', '点击后在入口下方显示二级浮层，保留同级特殊区间及其他选项的位置；当前生效范围保持不变。'],
    ['选择经理', '更多与特殊区间入口均回显经理任期名称，日期和结果同步更新，面板收起；再次展开时显示经理名单并保留勾选。'],
    ['手动修改日期', '可在快捷区间基础上单独修改任一端，保留另一端；有效的新范围生效后清除快捷项高亮，更多恢复原名称。'],
    ['选择起止日期', '点击字段切换单日历，首次选好开始日期后自动进入结束日期选择；开始不能晚于结束，结束不能早于开始。'],
    ['打开日历或尚未选完', '保留上一次生效的结果及快捷项选中态。'],
    ['清空日期', '有日期时，移入日期框或获得焦点后显示右侧清空按钮，提示“清空日期”；一次清空两端日期和快捷项选中态。']
  ];
  const specHtml = '<h3>尺寸与样式</h3><table><thead><tr><th>规范项</th><th>值 / 说明</th></tr></thead><tbody>' + [
    ['默认范围', '组合组件默认选中成立以来；可用data-default-shortcut指定其他默认项；data-shortcuts="false"时仅显示日期框，初始为空'],
    ['快捷选择', '高32px，选项高28px，左右内边距12px，容器圆角32px，选项圆角22px'],
    ['更多面板', '宽271px，内边距上下16px、左右12px，圆角8px，描边#B9B8D8'],
    ['经理任期浮层', '与主面板内容区等宽，距入口下方6px，圆角8px，描边#B9B8D8；悬停底色铺满整行，左右无外间距；选中经理显示勾选和主色文字'],
    ['经理任期展开态', '入口无填充，主色文字；入口、经理浮层与更多面板的描边统一#B9B8D8'],
    ['日期输入框', '294 × 32px，圆角20px，日历图标默认#666，移入或展开使用#6865A7'],
    ['单日历', '314 × 324px，内边距16px，日期单元格40 × 32px，行间距6px；打开时定位当前字段对应月份'],
    ['当前字段', '开始或结束字段使用主色强调；首次开始选定后自动切换结束字段，已有完整范围时可单独修改任一端，另一端保留'],
    ['日期边界', '结束日历禁用开始日期之前的日期；开始日历禁用结束日期之后的日期，允许起止同一天；月份和年份导航遵循相同边界'],
    ['日历导航', '双箭头位于外侧，切换年份；单箭头位于内侧，切换月份；不可切换时禁用并使用#CBCBCB'],
    ['年份快切', '目标年份仍有可选日期时允许切换；原月份超出范围时定位至该年的边界月份，整年无可选日期时禁用'],
    ['选中区间', '起止数字使用24px圆形主色底；浅紫区间端点圆弧半径16px，上下及外侧与主色圆均间隔4px'],
    ['日单元格', '40 × 32px，数字区域24 × 24px，14px / 20px；普通#666，悬停仅数字变为#6865A7，今日使用Medium，禁用#CCC'],
    ['日状态', '普通、悬停、今日、禁用、区间内、区间内今日、起点、终点；区间底色#F4F4FC，起止数字为白色Regular'],
    ['字体与配色', '苹方14px，经理任期明细12px；选中背景#F2F3F5，区间底色#F4F4FC'],
    ['演示数据', '成立日2001-12-18；孙悦萌2025-08-25至今；姜华2024-06-07至2025-08-25。共同任期使用演示重叠范围。']
  ].map(row => '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>').join('') +
    '</tbody></table><h3>联动规则</h3><ol>' + rules.map(row => '<li>' + row[0] + '，' + row[1] + '</li>').join('') + '</ol>';

  function markup() {
    return '<div class="linked-time-widget" data-linked-time></div>';
  }

  function runtime(root = document, optionsFor = () => ({})) {
    const hosts = root.matches?.('[data-linked-time]') ? [root] : Array.from(root.querySelectorAll('[data-linked-time]'));
    hosts.forEach(host => {
      if (host.linkedTimeApi) return;
      const options = optionsFor(host);
      const icon = (name, extra = '') => '<span aria-hidden="true" class="lt-icon lt-icon-' + name + ' ' + extra + '"></span>';
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p => [p.type,p.value]));
      const today = parts.year + '-' + parts.month + '-' + parts.day;
      const anchor = options.end || today;
      const inception = options.inception || host.dataset.inception || '2001-12-18';
      const allowInception = options.inception !== '';
      const minimum = options.min || host.dataset.min || '1900-01-01';
      const maximum = options.max || host.dataset.max || '2100-12-31';
      const commonLabel = options.commonLabel || '共同任期';
      const common = options.common || { start:'2025-08-25', end:today };
      const firstShortcut = options.firstShortcut || { key:'inception', label:'成立以来' };
      const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
      const parse = value => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
        const [year,month,day] = value.split('-').map(Number);
        const result = new Date(Date.UTC(year,month-1,day));
        return result.getUTCFullYear() === year && result.getUTCMonth() === month-1 && result.getUTCDate() === day ? result : null;
      };
      const format = date => date.getUTCFullYear() + '-' + String(date.getUTCMonth()+1).padStart(2,'0') + '-' + String(date.getUTCDate()).padStart(2,'0');
      const monthValue = value => { const d = parse(value); return d.getUTCFullYear()*12+d.getUTCMonth(); };
      const monthStart = value => format(new Date(Date.UTC(Math.floor(value/12), value%12, 1)));
      const monthEnd = value => format(new Date(Date.UTC(Math.floor(value/12), value%12+1, 0)));
      const withinBounds = value => parse(value) && value >= minimum && value <= maximum;
      const clamp = value => value < minimum ? minimum : value > maximum ? maximum : value;
      const subtractMonths = (value, count) => {
        const d = parse(value), target = d.getUTCFullYear()*12+d.getUTCMonth()-count;
        const last = new Date(Date.UTC(Math.floor(target/12),target%12+1,0)).getUTCDate();
        return format(new Date(Date.UTC(Math.floor(target/12),target%12,Math.min(d.getUTCDate(),last))));
      };
      const managers = options.managers || [
        {key:'sun',name:'孙悦萌',start:'2025-08-25',end:today,endLabel:'至今'},
        {key:'jiang',name:'姜华',start:'2024-06-07',end:'2025-08-25',endLabel:'2025-08-25'}
      ];
      const restored = host.dataset.ltState === 'committed';
      const hasShortcuts = host.dataset.shortcuts !== 'false';
      const initial = restored ? {start:host.dataset.ltStart || '',end:host.dataset.ltEnd || ''} : {start:'',end:''};
      const state = {
        committed:{...initial},
        draft:{...initial},
        selected:restored ? host.dataset.ltSelection || null : null,moreLabel:restored ? host.dataset.ltLabel || '更多' : '更多',moreOpen:false,managerOpen:false,calendarOpen:false,
        months:[monthValue(today),monthValue(today)+1],views:[null,null],active:'start',previewEnd:'',revision:0,error:''
      };
      const shortcuts = [firstShortcut,{key:'year',label:'近1年'},{key:'three-years',label:'近3年'}];
      host.innerHTML = '<div class="lt-controls"><div class="lt-quick"><div class="lt-bar" role="group" aria-label="快捷时间范围">' +
        shortcuts.map(({key,label}) => '<button type="button" data-lt-shortcut="' + escape(key) + '">' + escape(label) + '</button>').join('') +
        '<button type="button" class="lt-more-toggle" data-lt-more aria-expanded="false"><span data-lt-more-label>更多</span>' + icon('caret') + '</button></div>' +
        '<div class="lt-more-panel" data-lt-more-panel hidden></div></div>' +
        '<div class="lt-date-wrap"><div class="lt-date-field" data-lt-date-field>' + icon('calendar') +
        '<input class="lt-input" data-lt-input="start" aria-label="开始日期" placeholder="开始日期" inputmode="numeric" maxlength="10" autocomplete="off">' +
        '<span class="lt-to">至</span><input class="lt-input" data-lt-input="end" aria-label="结束日期" placeholder="结束日期" inputmode="numeric" maxlength="10" autocomplete="off">' +
        '<button type="button" class="lt-clear" data-lt-clear aria-label="清空日期" title="清空日期">' + icon('clear') + '</button></div>' +
        '<div class="lt-calendar" data-lt-calendar aria-label="开始日期选择面板" hidden></div></div></div>' +
        '<p class="lt-error" data-lt-error role="alert" hidden></p>';
      const get = selector => host.querySelector(selector);
      const getAll = selector => host.querySelectorAll(selector);
      get('.lt-quick').hidden = !hasShortcuts;
      get('.lt-date-wrap').hidden = options.showDate === false;
      const fields = {start:get('[data-lt-input="start"]'),end:get('[data-lt-input="end"]')};

      function emitChange(source) {
        state.revision += 1;
        host.dispatchEvent(new CustomEvent('timerangechange',{bubbles:true,detail:{...state.committed,source,selection:state.selected,label:state.moreLabel,revision:state.revision}}));
      }
      function renderSelection() {
        getAll('[data-lt-shortcut]').forEach(button => {
          const selected = button.dataset.ltShortcut === state.selected;
          button.classList.toggle('is-selected',selected);
          button.setAttribute('aria-pressed',String(selected));
        });
        const more = get('[data-lt-more]');
        const moreSelected = Boolean(state.selected && !shortcuts.some(({key})=>key===state.selected));
        more.classList.toggle('is-selected',moreSelected);
        more.classList.toggle('is-open',state.moreOpen);
        more.setAttribute('aria-pressed',String(moreSelected));
        more.setAttribute('aria-expanded',String(state.moreOpen));
        get('[data-lt-more-label]').textContent = state.moreLabel;
        get('[data-lt-more-panel]').hidden = !state.moreOpen;
        get('[data-lt-calendar]').hidden = !state.calendarOpen;
        get('[data-lt-date-field]').classList.toggle('is-open',state.calendarOpen);
        host.dataset.ltActive=state.calendarOpen ? state.active : '';
        fields.start.classList.toggle('is-active',state.calendarOpen && state.active==='start');
        fields.end.classList.toggle('is-active',state.calendarOpen && state.active==='end');
        fields.start.setAttribute('aria-expanded',String(state.calendarOpen && state.active==='start'));
        fields.end.setAttribute('aria-expanded',String(state.calendarOpen && state.active==='end'));
        get('[data-lt-calendar]').setAttribute('aria-label',(state.active==='start'?'开始':'结束')+'日期选择面板');
        get('[data-lt-clear]').disabled = !state.draft.start && !state.draft.end && !state.committed.start && !state.committed.end;
      }
      function renderFields() {
        fields.start.value = state.draft.start;
        fields.end.value = state.draft.end;
        renderSelection();
      }
      function syncCommittedState() {
        const {start,end} = state.committed;
        host.dataset.ltState='committed';
        host.dataset.ltStart=start;
        host.dataset.ltEnd=end;
        host.dataset.ltSelection=state.selected || '';
        host.dataset.ltLabel=state.moreLabel;
      }
      function setError(message) {
        state.error = message;
        get('[data-lt-error]').textContent = message;
        get('[data-lt-error]').hidden = !message;
        fields.start.setAttribute('aria-invalid',String(Boolean(message)));
        fields.end.setAttribute('aria-invalid',String(Boolean(message)));
      }
      function validRange() {
        return withinBounds(state.draft.start) && withinBounds(state.draft.end) && state.draft.start <= state.draft.end;
      }
      function commit(source, selection = null, label = '更多') {
        if (!validRange()) return false;
        if (source === 'manual' && state.draft.start === state.committed.start && state.draft.end === state.committed.end) {
          closePanels();
          return true;
        }
        state.committed = {...state.draft};
        state.selected = selection;
        state.moreLabel = label;
        state.moreOpen = false;
        state.managerOpen = false;
        state.views = [null,null];
        state.previewEnd = '';
        state.calendarOpen = false;
        setError('');
        renderFields();
        syncCommittedState();
        emitChange(source);
        return true;
      }
      function applyRange(start,end,selection,label) {
        state.draft = {start:clamp(start),end:clamp(end)};
        return commit('shortcut',selection,label);
      }
      function renderMore() {
        const year = Number(anchor.slice(0,4));
        const selectedManager = managers.find(manager => state.selected === 'manager-' + manager.key);
        const option = (key,label) => '<button type="button" data-lt-option="' + key + '" aria-pressed="' + (state.selected===key) + '" class="' + (state.selected===key?'is-selected':'') + '">' + escape(label) + '</button>';
        const managerRows = managers.map(manager => '<button type="button" class="lt-manager-row ' + (state.selected==='manager-'+manager.key?'is-selected':'') + '" aria-pressed="' + (state.selected==='manager-'+manager.key) + '" data-lt-manager="' + escape(manager.key) + '">' +
          icon('check') + '<span class="lt-manager-name">' + escape(manager.name) + '</span><span class="lt-manager-dates">' + escape(manager.start + ' – ' + (manager.endLabel || manager.end)) + '</span></button>').join('');
        const managerUnavailable = managers.length ? '' : ' disabled title="暂无经理任期数据"';
        get('[data-lt-more-panel]').innerHTML = '<div class="lt-menu-group"><span class="lt-menu-heading">特殊区间</span><div class="lt-special-options">' +
          '<button type="button" class="lt-manager-toggle ' + (state.managerOpen?'is-open ':'') + (selectedManager?'is-selected':'') + '" data-lt-manager-toggle aria-pressed="' + Boolean(selectedManager) + '" aria-expanded="' + state.managerOpen + '"' + managerUnavailable + '>' + (selectedManager?escape(selectedManager.name)+'任期':'经理任期') + icon('caret') + '</button>' +
          (firstShortcut.key==='common'?'':option('common',commonLabel)) +
          (allowInception && firstShortcut.key!=='inception'?option('inception','成立以来'):'') + '</div>' +
          (state.managerOpen?'<div class="lt-manager-list" role="group" aria-label="经理任期列表">'+managerRows+'</div>':'') + '</div>' +
          '<div class="lt-menu-group"><span class="lt-menu-heading">区间</span><div class="lt-option-grid lt-intervals">' +
          [['month','近1月'],['three-months','近3月'],['six-months','近6月'],['five-years','近5年']].map(row=>option(...row)).join('') + '</div></div>' +
          '<div class="lt-menu-group"><span class="lt-menu-heading">年度</span><div class="lt-option-grid lt-years">' + option('year-to-date','今年以来') +
          [year-1,year-2,year-3].map(value=>option('annual-'+value,value+'年度')).join('') + '</div></div>';
      }
      function openCalendar(active = 'start') {
        const changedField = state.active !== active;
        if (!state.calendarOpen) {
          state.draft = {...state.committed};
          const currentMonth = monthValue(clamp(anchor));
          state.months = [state.committed.start?monthValue(state.committed.start):currentMonth,state.committed.end?monthValue(state.committed.end):currentMonth];
          state.views = [null,null];
        }
        if (changedField) {
          const value = state.draft[active] || state.draft.start || anchor;
          state.months[active==='start'?0:1] = monthValue(clamp(parse(value)?value:anchor));
        }
        state.active = active;
        state.previewEnd = '';
        state.calendarOpen = true;
        state.moreOpen = false;
        renderFields();
        renderCalendar();
      }
      function closePanels(discard = true) {
        state.moreOpen = false;
        state.calendarOpen = false;
        state.views = [null,null];
        state.previewEnd = '';
        if (discard) state.draft = {...state.committed};
        setError('');
        renderFields();
      }
      function dateBounds(side) {
        return {
          min: side === 1 && withinBounds(state.draft.start) ? state.draft.start : minimum,
          max: side === 0 && withinBounds(state.draft.end) ? state.draft.end : maximum
        };
      }
      function monthAvailable(month) {
        const bounds = dateBounds(state.active === 'start' ? 0 : 1);
        return monthEnd(month) >= bounds.min && monthStart(month) <= bounds.max;
      }
      function navigationMonth(month, amount) {
        const target = month + amount;
        if (Math.abs(amount) !== 12) return target;
        const bounds = dateBounds(state.active === 'start' ? 0 : 1);
        const bounded = Math.min(monthValue(bounds.max), Math.max(monthValue(bounds.min), target));
        return Math.floor(bounded / 12) === Math.floor(target / 12) ? bounded : target;
      }
      function renderCalendar() {
        const panel = get('[data-lt-calendar]');
        const side = state.active==='start' ? 0 : 1;
        const month = state.months[side];
        const bounds = dateBounds(side);
        const fieldName = side ? '结束日期' : '开始日期';
        panel.innerHTML = (() => {
          const year = Math.floor(month/12), mon = month%12;
          const arrow = (kind,amount,aria) => '<button type="button" class="lt-nav" data-lt-nav="' + amount + '" data-lt-side="' + side + '" aria-label="' + fieldName + aria + '" ' + (monthAvailable(navigationMonth(month,amount))?'':'disabled') + '>' + icon(kind) + '</button>';
          const view = state.views[side];
          const header = '<div class="lt-month-head">' + arrow('prev-year',-12,'上一年') + arrow('prev-month',-1,'上个月') +
            '<div class="lt-year-month"><button type="button" data-lt-view="year" data-lt-side="'+side+'" aria-label="'+fieldName+'选择年份" class="'+(view==='year'?'is-active':'')+'">'+year+'</button>' +
            '<button type="button" data-lt-view="month" data-lt-side="'+side+'" aria-label="'+fieldName+'选择月份" class="'+(view==='month'?'is-active':'')+'">'+(mon+1)+'月</button></div>' +
            arrow('next-month',1,'下个月') + arrow('next-year',12,'下一年') + '</div>';
          let body = '';
          if (view) {
            const values = view==='year'?Array.from({length:12},(_,i)=>year-5+i):Array.from({length:12},(_,i)=>i);
            body = '<div class="lt-month-options">' + values.map(value => {
              let candidate = view==='year'?value*12+mon:year*12+value;
              if (view === 'year') candidate = Math.min(monthValue(bounds.max), Math.max(monthValue(bounds.min), candidate));
              const available = view === 'year' ? Math.floor(candidate/12) === value : monthAvailable(candidate);
              const selected = view==='year'?value===year:value===mon;
              return '<button type="button" data-lt-pick="'+candidate+'" data-lt-side="'+side+'" class="'+(selected?'is-selected':'')+'" '+(available?'':'disabled')+'>'+ (view==='year'?value:(value+1)+'月') + '</button>';
            }).join('') + '</div>';
          } else {
            const first = new Date(Date.UTC(year,mon,1)).getUTCDay();
            const cells = Array.from({length:42},(_,index) => {
              const date = new Date(Date.UTC(year,mon,1-first+index)), value = format(date);
              const own = date.getUTCMonth()===mon;
              const disabled = !own || !withinBounds(value) || value < bounds.min || value > bounds.max;
              return {date,value,own,disabled};
            });
            const rangeStart = state.draft.start;
            const rangeEnd = state.draft.end || (state.active==='end'?state.previewEnd:'');
            const inRange = value => parse(rangeStart)&&parse(rangeEnd)&&rangeStart<=rangeEnd&&value>=rangeStart&&value<=rangeEnd;
            body = '<div class="lt-week">'+['日','一','二','三','四','五','六'].map(label=>'<span>'+label+'</span>').join('')+'</div><div class="lt-days">' +
              cells.map((cell,index) => {
                const endpoint = cell.own && (cell.value===rangeStart || cell.value===state.draft.end);
                const range = cell.own && inRange(cell.value);
                return '<button type="button" data-lt-day="'+cell.value+'" data-lt-side="'+side+'" aria-label="'+(side?'结束日期 ':'开始日期 ')+cell.value+'" aria-pressed="'+Boolean(endpoint)+'" '+(cell.disabled?'disabled':'')+' class="'+
                  [endpoint?'is-endpoint':'',range?'is-range':'',range&&cell.value===rangeStart?'is-range-start':'',range&&cell.value===rangeEnd?'is-range-end':'',cell.value===today?'is-today':''].join(' ')+'"><span>'+cell.date.getUTCDate()+'</span></button>';
              }).join('') + '</div>';
          }
          return '<div class="lt-month" data-lt-month="'+side+'">'+header+body+'</div>';
        })();
      }
      function selectOption(key) {
        if (key==='inception' && allowInception) return applyRange(inception,anchor,key,firstShortcut.key==='inception'?'更多':'成立以来');
        if (key==='year') return applyRange(subtractMonths(anchor,12),anchor,key,'更多');
        if (key==='three-years') return applyRange(subtractMonths(anchor,36),anchor,key,'更多');
        if (key==='common') return applyRange(common.start,common.end,key,firstShortcut.key==='common'?'更多':commonLabel);
        const months = {'month':1,'three-months':3,'six-months':6,'five-years':60};
        const names = {'month':'近1月','three-months':'近3月','six-months':'近6月','five-years':'近5年'};
        if (months[key]) return applyRange(subtractMonths(anchor,months[key]),anchor,key,names[key]);
        if (key==='year-to-date') return applyRange(anchor.slice(0,4)+'-01-01',anchor,key,'今年以来');
        if (key.startsWith('annual-')) { const year=key.slice(7); return applyRange(year+'-01-01',year+'-12-31',key,year+'年度'); }
      }
      function renderPreview() {
        const start = state.draft.start;
        const end = state.draft.end || state.previewEnd;
        getAll('[data-lt-day]').forEach(button => {
          const value = button.dataset.ltDay;
          const inRange = !button.disabled && Boolean(parse(start) && parse(end) && value >= start && value <= end);
          button.classList.toggle('is-range', inRange);
          button.classList.toggle('is-range-start', inRange && value === start);
          button.classList.toggle('is-range-end', inRange && value === end);
        });
      }
      host.addEventListener('click',event => {
        const button = event.target.closest('button');
        if (button?.disabled) return;
        const shortcut = button?.dataset.ltShortcut;
        if (shortcut) return selectOption(shortcut);
        if (button?.hasAttribute('data-lt-more')) {
          state.moreOpen=!state.moreOpen;
          if (state.moreOpen) state.managerOpen=Boolean(state.selected?.startsWith('manager-'));
          state.calendarOpen=false;
          state.draft={...state.committed};
          state.previewEnd='';
          renderMore();renderFields();return;
        }
        if (button?.hasAttribute('data-lt-manager-toggle')) {state.managerOpen=!state.managerOpen;renderMore();return;}
        if (button?.dataset.ltManager) {
          const manager=managers.find(value=>value.key===button.dataset.ltManager);
          if (!manager) return;
          return applyRange(manager.start,manager.end,'manager-'+manager.key,manager.name+'任期');
        }
        if (button?.dataset.ltOption) return selectOption(button.dataset.ltOption);
        if (button?.hasAttribute('data-lt-clear')) {
          state.committed={start:'',end:''};state.draft={start:'',end:''};state.selected=null;state.moreLabel='更多';
          closePanels();syncCommittedState();emitChange('clear');return;
        }
        if (button?.dataset.ltNav) {
          const side = Number(button.dataset.ltSide);
          state.previewEnd='';state.months[side]=navigationMonth(state.months[side],Number(button.dataset.ltNav));renderCalendar();return;
        }
        if (button?.dataset.ltView) {
          const side=Number(button.dataset.ltSide);state.views[side]=state.views[side]===button.dataset.ltView?null:button.dataset.ltView;renderCalendar();return;
        }
        if (button?.dataset.ltPick) {
          const side=Number(button.dataset.ltSide);state.months[side]=Number(button.dataset.ltPick);state.views[side]=null;renderCalendar();return;
        }
        if (button?.dataset.ltDay) {
          const side=Number(button.dataset.ltSide), value=button.dataset.ltDay;
          state.previewEnd='';
          setError('');
          state.draft[side ? 'end' : 'start'] = value;
          if (commit('manual')) return;
          if (!side) {
            state.active='end';
            state.months[1]=state.months[0];
            state.views[1]=null;
          } else {
            state.active='start';
            state.months[0]=state.months[1];
            state.views[0]=null;
          }
          renderFields();renderCalendar();
          fields[state.active].focus({preventScroll:true});
          return;
        }
        if (event.target.closest('[data-lt-date-field]')) openCalendar(event.target.dataset.ltInput || 'start');
      });
      host.addEventListener('focusin',event => {
        if (event.target.dataset.ltInput) openCalendar(event.target.dataset.ltInput);
      });
      host.addEventListener('pointerover',event => {
        const day=event.target.closest('[data-lt-day]');
        if (!day || day.disabled || state.active!=='end' || state.draft.end || !parse(state.draft.start)) return;
        if (state.previewEnd!==day.dataset.ltDay) {
          state.previewEnd=day.dataset.ltDay;
          renderPreview();
        }
      });
      get('[data-lt-calendar]').addEventListener('pointerleave',() => {
        if (state.previewEnd) {state.previewEnd='';renderPreview();}
      });
      host.addEventListener('input',event => {
        const side=event.target.dataset.ltInput;
        if (!side) return;
        state.draft[side]=event.target.value.trim();
        state.previewEnd='';
        setError('');
        if (validRange()) commit('manual');
        else {renderSelection();if(state.calendarOpen)renderCalendar();}
      });
      host.addEventListener('change',event => {
        if (!event.target.dataset.ltInput || validRange()) return;
        if (state.draft.start && !withinBounds(state.draft.start) || state.draft.end && !withinBounds(state.draft.end)) setError('请输入有效日期，格式为 YYYY-MM-DD');
        else if (state.draft.start && state.draft.end && state.draft.start>state.draft.end) setError('结束日期应不早于开始日期');
      });
      host.addEventListener('keydown',event => {
        if (event.key==='Escape') {event.preventDefault();closePanels();}
        if (event.key==='ArrowDown' && event.target.dataset.ltInput) {event.preventDefault();openCalendar(event.target.dataset.ltInput);get('[data-lt-nav]')?.focus();}
        if (event.key==='Enter' && event.target.dataset.ltInput) {event.preventDefault();commit('manual');}
      });
      host.linkedTimeApi={getState:()=>JSON.parse(JSON.stringify(state)),select:selectOption,clear:()=>get('[data-lt-clear]').click(),close:closePanels};
      renderMore();renderFields();syncCommittedState();
      if (!restored && hasShortcuts && !selectOption(host.dataset.defaultShortcut || firstShortcut.key)) selectOption(firstShortcut.key);
    });
    if (!document.linkedTimeOutsideListening) {
      document.linkedTimeOutsideListening = true;
      const closeOutside = event => {
        document.querySelectorAll('[data-linked-time]').forEach(host => {
          if (!host.contains(event.target)) host.linkedTimeApi?.close();
        });
      };
      document.addEventListener('pointerdown',closeOutside);
      document.addEventListener('focusin',closeOutside);
    }
  }

  async function exportCode(html) {
    let css = await (await fetch('linked-time.css?v=20261116-full-row-hover')).text();
    const assets = [...new Set(Array.from(css.matchAll(/assets\/time\/[\w-]+\.svg/g),match=>match[0]))];
    for (const asset of assets) {
      const response=await fetch(asset);
      if (!response.ok) throw new Error('Missing component asset');
      const svg=await response.text();
      css=css.replaceAll(asset,'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg))));
    }
    const holder=document.createElement('div');
    holder.innerHTML=html || markup();
    const current=holder.querySelector('[data-linked-time]');
    let example=markup();
    if (current) {
      const saved=document.createElement('div');
      saved.className='linked-time-widget';
      saved.setAttribute('data-linked-time','');
      ['ltState','ltStart','ltEnd','ltSelection','ltLabel','inception','min','max','shortcuts','defaultShortcut'].forEach(key=>{
        if (current.dataset[key]!==undefined) saved.dataset[key]=current.dataset[key];
      });
      example=saved.outerHTML;
    }
    return '<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>body{margin:32px;background:#fff}'+css+'</style>'+example+'<script>('+runtime.toString()+')();<\/script></html>';
  }
  window.ZhiceLinkedTime={markup,mount:runtime,runtime,exportCode,specHtml,title,rules};
})();
