(function installPagination() {
  'use strict';
  const examples = [
    {kind:'page',name:'一级（整个页面）',node:'83-14418'},
    {kind:'module',name:'二级（单个模块）',node:'83-14566'}
  ];
  function markup(kind, state) {
    state = state || {};
    return '<nav class="zc-pagination' + (kind === 'module' ? ' zc-pagination-module' : '') + '" aria-label="' + (kind === 'module' ? '模块分页' : '整页分页') + '" data-pg-kind="' + kind + '" data-pg-total="283" data-pg-current="' + (state.page || 1) + '" data-pg-size="' + (state.size || 5) + '" data-pg-page-count="' + (state.pages || 10) + '"></nav>';
  }

  // pageCount is explicitly configurable. The design specimen uses 10 pages;
  // changing page size returns to Math.ceil(total / size), as in a real table.
  function paginationRuntime(scope = document) {
    scope.querySelectorAll('.zc-pagination').forEach(widget => {
      if (widget.dataset.pgMounted) return;
      widget.dataset.pgMounted = 'true';
      const module = widget.dataset.pgKind === 'module';
      const total = Math.max(0, Number(widget.dataset.pgTotal) || 0);
      let size = Number(widget.dataset.pgSize) || 5;
      let pages = Math.max(1, Number(widget.dataset.pgPageCount) || Math.ceil(total / size));
      let page = Math.max(1, Math.min(pages, Number(widget.dataset.pgCurrent) || 1));
      let open = false, lastJump = '', rendering = false;
      const sizes = [5,10,20,50];
      const slotSize = module ? 20 : 28;
      const arrow = direction => {
        const d = module
          ? direction === 'prev' ? 'M11.6998 13.4L8.2998 10L11.6998 6.60001' : 'M8.3002 13.4L11.7002 10L8.3002 6.60001'
          : direction === 'prev' ? 'M16.0479 18.0957L11.9521 14L16.0479 9.9043' : 'M11.9521 18.0957L16.0479 14L11.9521 9.9043';
        return '<svg aria-hidden="true" width="' + slotSize + '" height="' + slotSize + '" viewBox="0 0 ' + slotSize + ' ' + slotSize + '" fill="none"><path d="' + d + '" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      };
      const down = '<svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="' + (module ? 'M1.6 3.3L5 6.7L8.4 3.3' : 'M0.904297 2.95215L5 7.04785L9.0957 2.95215') + '" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      function slots() {
        if (pages <= 7) return Array.from({length:pages},(_,i) => i + 1);
        if (page <= 4) return [1,2,3,4,5,'next',pages];
        if (page >= pages - 3) return [1,'prev',pages-4,pages-3,pages-2,pages-1,pages];
        return [1,'prev',page-1,page,page+1,'next',pages];
      }
      function render(focus) {
        rendering = true;
        try {
        widget.dataset.pgCurrent = page;
        widget.dataset.pgSize = size;
        widget.dataset.pgPageCount = pages;
        const dots = '<svg aria-hidden="true" width="' + slotSize + '" height="' + slotSize + '" viewBox="0 0 ' + slotSize + ' ' + slotSize + '">' + [slotSize/2-3.164,slotSize/2,slotSize/2+3.164].map(x => '<ellipse cx="' + x + '" cy="' + slotSize/2 + '" rx=".732" ry=".738" fill="currentColor"/>').join('') + '</svg>';
        const pageButtons = slots().map(value => typeof value === 'number'
          ? '<button type="button" class="zc-pg-slot" data-pg-number="' + value + '" aria-label="第' + value + '页"' + (value === page ? ' aria-current="page"' : '') + '>' + value + '</button>'
          : '<button type="button" class="zc-pg-slot" data-pg-skip="' + value + '" aria-label="' + (value === 'prev' ? '向前' : '向后') + '跳过5页">' + dots + '</button>').join('');
        widget.innerHTML = '<span class="zc-pg-count"><span>共</span><strong>' + total + '</strong><span>条</span></span><div class="zc-pg-controls"><div class="zc-pg-pages"><button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="prev" aria-label="上一页"' + (page === 1 ? ' disabled' : '') + '>' + arrow('prev') + '</button>' + pageButtons + '<button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="next" aria-label="下一页"' + (page === pages ? ' disabled' : '') + '>' + arrow('next') + '</button></div><div class="zc-pg-size"><button type="button" class="zc-pg-size-trigger" aria-label="每页条数" aria-haspopup="listbox" aria-expanded="' + open + '"><span class="zc-pg-size-label">' + size + '条/页</span>' + down + '</button><div class="zc-pg-menu" role="listbox" aria-label="每页条数选项"' + (open ? '' : ' hidden') + '>' + sizes.map(value => '<button type="button" class="zc-pg-option" role="option" data-pg-size-option="' + value + '" aria-selected="' + (value === size) + '">' + value + '条/页</button>').join('') + '</div></div>' + (module ? '' : '<label class="zc-pg-jump"><span>跳至</span><span class="zc-pg-jump-field"><input aria-label="跳至页码" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="9" autocomplete="off" value="' + lastJump + '"><span>页</span></span></label>') + '</div><span class="zc-pg-live-status" role="status" aria-live="polite">第' + page + '页，共' + pages + '页，每页' + size + '条</span>';
        if (open) placeMenu();
        if (focus) widget.querySelector(focus)?.focus({preventScroll:true});
        } finally { rendering = false; }
      }
      function placeMenu() {
        if (!open) return;
        const trigger = widget.querySelector('.zc-pg-size-trigger');
        const menu = widget.querySelector('.zc-pg-menu');
        const box = trigger.getBoundingClientRect();
        if (!box.width || box.bottom < 0 || box.top > window.innerHeight) { close(false); return; }
        menu.style.width = box.width + 'px';
        const bounds = menu.getBoundingClientRect();
        const left = Math.max(8,Math.min(box.left,window.innerWidth - bounds.width - 8));
        let top = box.bottom + 6;
        if (top + bounds.height > window.innerHeight - 8 && box.top - bounds.height - 6 >= 8) top = box.top - bounds.height - 6;
        top = Math.max(8,Math.min(top,window.innerHeight - bounds.height - 8));
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
      }
      function changePage(next, focus) {
        page = Math.max(1, Math.min(pages, next));
        open = false;
        render(focus);
        widget.dispatchEvent(new CustomEvent('paginationchange',{bubbles:true,detail:{page,pageSize:size,total,pageCount:pages}}));
      }
      function close(focus) { if (open) { open = false; render(focus ? '.zc-pg-size-trigger' : undefined); } }
      function jump(input, focus) {
        if (!input.value.trim()) { input.value = lastJump; return; }
        const value = Number(input.value);
        if (!Number.isFinite(value)) { input.value = lastJump; return; }
        lastJump = String(Math.max(1,Math.min(pages,Math.trunc(value))));
        input.value = lastJump;
        changePage(Number(lastJump), focus ? '.zc-pg-jump input' : undefined);
      }
      widget.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button || button.disabled) return;
        if (button.hasAttribute('data-pg-number')) changePage(Number(button.dataset.pgNumber),'[data-pg-number="' + button.dataset.pgNumber + '"]');
        else if (button.hasAttribute('data-pg-direction')) {
          const direction = button.dataset.pgDirection;
          changePage(page + (direction === 'prev' ? -1 : 1),'[data-pg-number="' + (page + (direction === 'prev' ? -1 : 1)) + '"]');
        } else if (button.hasAttribute('data-pg-skip')) changePage(page + (button.dataset.pgSkip === 'prev' ? -5 : 5));
        else if (button.classList.contains('zc-pg-size-trigger')) {
          open = !open;
          const focusOption = open && event.detail === 0;
          render(focusOption ? '[data-pg-size-option="' + size + '"]' : '.zc-pg-size-trigger');
        } else if (button.hasAttribute('data-pg-size-option')) {
          size = Number(button.dataset.pgSizeOption);
          pages = Math.max(1,Math.ceil(total / size));
          lastJump = '';
          changePage(1,'.zc-pg-size-trigger');
        }
      });
      widget.addEventListener('input', event => {
        if (event.target.matches('.zc-pg-jump input')) event.target.value = event.target.value.replace(/\D/g,'');
      });
      widget.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          if (open) { event.preventDefault(); close(true); }
          else if (event.target.matches('.zc-pg-jump input')) event.target.value = lastJump;
          return;
        }
        if (event.target.matches('.zc-pg-jump input') && event.key === 'Enter') { event.preventDefault(); jump(event.target, true); return; }
        if (event.target.closest('.zc-pg-size')) {
          const options = Array.from(widget.querySelectorAll('.zc-pg-option'));
          if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
            event.preventDefault();
            if (!open) { open = true; render('[data-pg-size-option="' + size + '"]'); return; }
            const focusedIndex = options.indexOf(document.activeElement);
            const index = focusedIndex < 0 ? sizes.indexOf(size) : focusedIndex;
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length-1 : Math.max(0,Math.min(options.length-1,index + (event.key === 'ArrowDown' ? 1 : -1)));
            options[next]?.focus();
          }
        }
      });
      widget.addEventListener('focusout', event => {
        if (rendering) return;
        if (event.target.matches('.zc-pg-jump input') && !widget.contains(event.relatedTarget)) jump(event.target, false);
        if (!widget.contains(event.relatedTarget)) close(false);
      });
      document.addEventListener('pointerdown', event => { if (!widget.contains(event.target)) close(false); });
      window.addEventListener('resize', placeMenu);
      window.addEventListener('scroll', placeMenu, true);
      document.addEventListener('keydown', event => {
        if (open && (event.key === 'Escape' || event.key === 'Esc' || event.code === 'Escape' || event.keyCode === 27)) {
          event.preventDefault();
          close(true);
        }
      }, true);
      render();
    });
  }

  function snapshot(widget) {
    return {page:Number(widget.dataset.pgCurrent),size:Number(widget.dataset.pgSize),pages:Number(widget.dataset.pgPageCount)};
  }
  async function exportCode(example, widget) {
    const response = await fetch('pagination.css?v=20261123-pagination-r3');
    if (!response.ok) throw new Error('分页样式读取失败');
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>分页 · ' + example.name + '</title><style>' + await response.text() + '\nbody{margin:32px;background:#fff}.zc-pagination-export{overflow:auto;padding:12px 0 160px}</style></head><body><div class="zc-pagination-export">' + markup(example.kind,snapshot(widget)) + '</div><script>(' + paginationRuntime.toString() + ')();<\/script></body></html>';
  }

  async function exportCurrentSvg(example, widget) {
    const live = widget.querySelector('.zc-pg-live-status');
    const wasHidden = live?.hidden;
    if (live) live.hidden = true;
    try {
      const source = await svgFor(widget);
      const xml = new DOMParser().parseFromString(source,'image/svg+xml');
      const svg = xml.documentElement;
      const ns = 'http://www.w3.org/2000/svg';
      const box = widget.getBoundingClientRect();
      const current = widget.querySelector('[aria-current="page"]');
      const canonical = await fetch('assets/pagination/' + example.kind + '-reference.svg?v=20261123-pagination-r2');
      if (!canonical.ok) throw new Error('分页SVG读取失败');
      const reference = new DOMParser().parseFromString(await canonical.text(),'image/svg+xml');
      const template = reference.querySelector('filter');
      if (example.kind === 'page' && current && template) {
        const bounds = current.getBoundingClientRect();
        const filter = xml.importNode(template,true);
        const id = 'zc-pg-shadow-' + example.kind;
        filter.setAttribute('id',id);
        filter.setAttribute('x',String(bounds.x - box.x - 12));
        filter.setAttribute('y',String(bounds.y - box.y - 12));
        filter.setAttribute('width',String(bounds.width + 24));
        filter.setAttribute('height',String(bounds.height + 24));
        // Keep the shadow-only output so appending it cannot cover the number.
        filter.querySelectorAll('feBlend').forEach(node => { if (node.getAttribute('in') === 'SourceGraphic') node.remove(); });
        const defs = xml.createElementNS(ns,'defs'); defs.append(filter); svg.prepend(defs);
        const shadow = xml.createElementNS(ns,'rect');
        Object.entries({x:bounds.x-box.x,y:bounds.y-box.y,width:bounds.width,height:bounds.height,rx:bounds.height/2,fill:'#fff',filter:'url(#'+id+')'}).forEach(([key,value]) => shadow.setAttribute(key,String(value)));
        svg.append(shadow);
      }
      for (const element of widget.querySelectorAll('.zc-pg-size-trigger,.zc-pg-jump input')) {
        const bounds = element.getBoundingClientRect();
        const outline = xml.createElementNS(ns,'rect');
        const color = element.matches('input') ? '#DCDCDC' : '#EBEBEB';
        Object.entries({x:bounds.x-box.x+.5,y:bounds.y-box.y+.5,width:bounds.width-1,height:bounds.height-1,rx:(bounds.height-1)/2,fill:'none',stroke:color,'stroke-width':1}).forEach(([key,value]) => outline.setAttribute(key,String(value)));
        svg.append(outline);
      }
      return new XMLSerializer().serializeToString(svg);
    } finally { if (live) live.hidden = wasHidden; }
  }

  const section = document.createElement('article');
  section.id = 'component-pagination'; section.className = 'component-spec'; section.dataset.catalogId = 'pagination';
  section.innerHTML = '<div class="original-spec-heading"><h3>分页</h3></div><div class="zc-pagination-examples"></div>';
  document.getElementById('content').append(section);
  examples.forEach(example => {
    const unit = document.createElement('section'); unit.className = 'individual-component zc-pagination-example';
    unit.innerHTML = '<div class="individual-component-heading"><h4>' + example.name + '</h4><div class="actions"><button type="button" data-pagination-action="svg">复制 SVG</button><button type="button" data-pagination-action="spec">查看规范</button><button type="button" data-pagination-action="code">查看代码</button><a href="https://www.figma.com/design/FREXPoab3AHT0GRuMht2vf?node-id=' + example.node + '" target="_blank" rel="noreferrer">Figma 源组件</a></div></div><div class="zc-pagination-viewport">' + markup(example.kind) + '</div>';
    section.querySelector('.zc-pagination-examples').append(unit);
    unit.addEventListener('click', async event => {
      const action = event.target.closest('[data-pagination-action]')?.dataset.paginationAction;
      if (!action) return;
      const widget = unit.querySelector('.zc-pagination');
      try {
        if (action === 'code') {
          codeValue = await exportCode(example,widget);
          document.getElementById('dialog-title').textContent = '分页 · ' + example.name + ' · 开发代码';
          document.getElementById('code-text').textContent = codeValue;
          document.getElementById('code-dialog').showModal();
        } else if (action === 'spec') {
          const module = example.kind === 'module';
          const rows = [
            ['Figma 原稿', example.node.replace('-',':')],
            ['组件尺寸', module ? '742 × 40px；上下8px，左右0' : '742 × 52px；上下12px，左右0'],
            ['布局', '左侧总条数，右侧操作组；两端对齐'],
            ['总条数', (module ? '12px / 17px' : '14px / 20px') + '；共/条 #999999 Regular；283 #333333 Medium'],
            ['页码', (module ? '20 × 20px；12px / 17px' : '28 × 28px；14px / 20px') + '；页码槽间距4px；PingFang SC'],
            ['当前页', module ? '#6865A7 Medium；无投影' : '白底圆形；#6865A7 Medium；投影 0 0 12px rgba(0,0,0,.08)'],
            ['普通页码 / 箭头', '#333333 Regular / #666666；禁用箭头 #D2D2D2；箭头描边1px'],
            ['条数选择', (module ? '70 × 24px；文字12px；左右8px' : '84 × 28px；文字14px；左右12px') + '；文字 #333333；圆角99px；内描边1px #EBEBEB；图文间距6px'],
            ['条数展开态', '菜单与触发器等宽、左对齐，下方间隔6px；白底、圆角8px、描边 #E7E7E7、轻投影。菜单高118px，选项高27px，选中文字 #5D579B。触发器描边 #B0AED1，箭头向上。'],
            ['操作组间距', '页码与条数选择间12px'],
            ['跳页', module ? '模块分页隐藏跳页' : '跳至 / 页：14px #666666；输入52 × 28px、圆角99px、内描边1px #DCDCDC；跳至与输入间12px，输入与页间6px'],
            ['示例页数', '原稿演示保留283条、5条/页、末页10；总页数可单独传入。切换条数后按总数重新计算页数。']
          ];
          document.getElementById('spec-dialog-title').textContent = '分页 · ' + example.name;
          document.getElementById('spec-dialog-body').innerHTML = '<h3>尺寸与样式</h3><table><tbody>' + rows.map(row => '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>').join('') + '</tbody></table><h3>交互规则</h3><ol><li>两款示例各自维护当前页与每页条数，互不影响。</li><li>点击页码、上一页或下一页切换；首尾页禁用对应方向。省略号每次向对应方向跳过5页。</li><li>每页条数支持5、10、20、50；切换后回到第一页并重新计算总页数。</li><li>点击每页条数向下展开；下方空间不足时向上展开，不改变分页行高度。</li><li>点击外部或按Esc收起条数菜单；方向键与Home/End移动选项，Enter或空格选择。</li><li>整页跳页输入仅保留数字；Enter或焦点离开分页组件确认，超范围取首尾边界，留空恢复上次确认值。点击同组件内的页码或翻页按钮优先响应翻页。</li><li>业务接入监听paginationchange事件，获取page、pageSize、total、pageCount。</li></ol>';
          document.getElementById('spec-dialog').showModal();
        } else {
          const state = snapshot(widget);
          if (state.page === 1 && state.size === 5 && state.pages === 10 && !widget.querySelector('.zc-pg-jump input')?.value && widget.querySelector('.zc-pg-menu').hidden) {
            const response = await fetch('assets/pagination/' + example.kind + '-reference.svg?v=20261123-pagination-r2');
            if (!response.ok) throw new Error('分页SVG读取失败');
            const xml = new DOMParser().parseFromString(await response.text(),'image/svg+xml');
            xml.querySelectorAll('script').forEach(node => node.remove());
            await copy(new XMLSerializer().serializeToString(xml.documentElement));
          } else await copy(await exportCurrentSvg(example,widget));
        }
      } catch (error) { toast('操作失败，请重试'); }
    });
  });
  paginationRuntime(section);
  styleComponentActions();
})();
