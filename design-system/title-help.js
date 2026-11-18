(function installTitleHelp() {
  const examples = [
    {key:'single', name:'说明单条移入', title:'持有收益概率', text:'以历史区间内不同日期为买入日，统计持有指定时长后，各收益区间出现的比例。', initialOpen:true, node:'623-219789'},
    {key:'multiple', name:'说明多条移入', title:'大类资产分布', items:['根据基金经理当期在管基金公布的季报统计得到基金经理每个季度所管基金的大类资产分布情况汇总。','不同报告期内，基金经理管理的基金数量可能不同，汇总结果可能存在差异。'], initialOpen:true, node:'623-219792'}
  ];
  const escapeHtml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const question = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1"/><path d="M5.9 5.8a2.1 2.1 0 0 1 4.2 0c0 1.4-2.1 1.5-2.1 3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11.5" r=".7" fill="currentColor"/></svg>';
  function markup(example, prefix) {
    const content = example.items ? '<ul>' + example.items.map(text => '<li><span class="zc-title-help-dot" aria-hidden="true"></span><span>' + escapeHtml(text) + '</span></li>').join('') + '</ul>' : '<p>' + escapeHtml(example.text) + '</p>';
    return '<div class="zc-title-help-demo"><div class="zc-title-help" data-initial-open="' + example.initialOpen + '" data-panel-gap="' + (example.items ? 8 : 12) + '"><span class="zc-title-help-label">' + escapeHtml(example.title) + '</span><button type="button" class="zc-title-help-trigger" aria-label="' + escapeHtml(example.title) + '说明" aria-expanded="false" aria-describedby="' + prefix + '-panel">' + question + '</button><div class="zc-title-help-panel" id="' + prefix + '-panel" role="tooltip" hidden>' + content + '</div></div></div>';
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

  async function exportCode(example) {
    const response = await fetch('title-help.css?v=20261118-title-help');
    if (!response.ok) throw new Error('标题说明样式读取失败');
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>标题说明</title><style>' + await response.text() + '\nbody{margin:24px;color:#333;background:#fff}</style></head><body>' + markup(example, 'title-help-export') + '<script>(' + titleHelpRuntime.toString() + ')();<\/script></body></html>';
  }
  const section = document.createElement('article'); section.id = 'component-title-help'; section.className = 'component-spec'; section.dataset.catalogId = 'title-help';
  section.innerHTML = '<div class="original-spec-heading"><h3>标题说明</h3></div><div class="zc-title-help-examples"></div>';
  document.getElementById('content').append(section);
  examples.forEach(example => {
    const unit = document.createElement('section'); unit.className = 'individual-component zc-title-help-example';
    unit.innerHTML = '<div class="individual-component-heading"><h4>' + example.name + '</h4><div class="actions"><button type="button" data-title-help-action="svg">复制 SVG</button><button type="button" data-title-help-action="spec">查看规范</button><button type="button" data-title-help-action="code">查看代码</button><a href="https://www.figma.com/design/rTKeLXF81fJZFEsIIjZWXp?node-id=' + example.node + '" target="_blank" rel="noreferrer">Figma 源组件</a></div></div>' + markup(example, 'title-help-' + example.key);
    section.querySelector('.zc-title-help-examples').append(unit);
    unit.addEventListener('click', async event => {
      const action = event.target.closest('[data-title-help-action]')?.dataset.titleHelpAction;
      if (!action) return;
      try {
        if (action === 'spec') {
          const rows = [['标题', '16px Semibold / 22px，#333333'], ['布局高度', '随标题自适应；浮层脱离文档流，不预留面板高度'], ['问号', '16 × 16px；距标题4px；默认 #999999，移入/展开 #6865A7'], ['浮层', '宽240px，高度自适应；圆角8px；无箭头'], ['面板内边距', '上下8px，左右12px'], ['面板颜色', '96%白色背景 / 1px #B9B8D8描边'], ['阴影', '0 4px 12px rgba(0,0,0,.08)'], ['单条正文', '14px Regular / 20px，#333333'], ['多条正文', '14px Regular / 22px，#333333；条目间8px'], ['列表圆点', '6px / #6865A7，槽宽8px，距文字4px'], ['位置', '优先标题右侧并顶部对齐；单条间距12px，多条8px；空间不足时自动换边或移至下方']];
          document.getElementById('spec-dialog-title').textContent = example.name + ' · 标题说明规范';
          document.getElementById('spec-dialog-body').innerHTML = '<h3>尺寸与样式</h3><table><tbody>' + rows.map(row => '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>').join('') + '</tbody></table><h3>交互规则</h3><ol><li>移入问号、键盘聚焦或点击问号展开说明，标题保持原颜色。</li><li>移入说明面板继续显示；移出问号与面板后短暂延迟收起。</li><li>点击外部、焦点移出或按Esc收起。说明面板跟随标题定位，不撑宽页面。</li><li>单条使用段落，多条使用主色圆点；保持文字左对齐。</li><li>本页保留单条与多条两个可交互示例，初始展开便于核对样式。</li></ol>';
          document.getElementById('spec-dialog').showModal();
        } else if (action === 'code') {
          codeValue = await exportCode(example); document.getElementById('dialog-title').textContent = '标题说明 · 开发代码'; document.getElementById('code-text').textContent = codeValue; document.getElementById('code-dialog').showModal();
        } else {
          // Canonical SVG preview uses local positioning so it includes the expanded panel.
          const temp = document.createElement('div'); temp.style.cssText = 'position:fixed;left:-10000px;top:0;width:380px;'; temp.innerHTML = markup(example, 'title-help-svg');
          const demo = temp.querySelector('.zc-title-help-demo'); const widget = temp.querySelector('.zc-title-help'); const panel = temp.querySelector('.zc-title-help-panel'); const trigger = temp.querySelector('button');
          demo.style.cssText = 'display:inline-flex;min-height:0;width:max-content;';
          if (example.initialOpen) {
            widget.style.cssText = 'display:flex;align-items:flex-start;gap:4px;max-width:none;'; panel.hidden = false; panel.style.cssText = 'position:relative;left:auto;top:auto;visibility:visible;flex:none;margin-left:' + (example.items ? 4 : 8) + 'px;'; trigger.setAttribute('aria-expanded','true');
          }
          document.body.append(temp);
          try { await copy(await svgFor(demo)); } finally { temp.remove(); }
        }
      } catch (error) { toast('操作失败，请重试'); }
    });
  });
  titleHelpRuntime(section); styleComponentActions();
})();
