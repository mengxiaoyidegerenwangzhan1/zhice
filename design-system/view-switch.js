(function installViewSwitch() {
  const icons = {
    chart:'assets/view-switch/chart-default.png',
    chartSelected:'assets/view-switch/chart-selected.png',
    list:'assets/view-switch/list-default.png',
    listSelected:'assets/view-switch/list-selected.png'
  };
  function markup(value, sources = icons) {
    return '<div class="zc-view-switch" role="group" aria-label="图表和列表视图" data-view="' + value + '">' + ['chart','list'].map(view => '<button type="button" data-view-value="' + view + '" aria-label="' + (view === 'chart' ? '图表视图' : '列表视图') + '" title="' + (view === 'chart' ? '图表' : '列表') + '" aria-pressed="' + (value === view) + '" tabindex="' + (value === view ? 0 : -1) + '"><img src="' + sources[view + (value === view ? 'Selected' : '')] + '" data-default-src="' + sources[view] + '" data-selected-src="' + sources[view + 'Selected'] + '" width="28" height="28" alt=""></button>').join('') + '</div>';
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
  async function exportCode(value) {
    const response = await fetch('view-switch.css?v=20261118-view-switch');
    if (!response.ok) throw new Error('切换组件样式读取失败');
    const css = await response.text(), sources = {};
    for (const [key, source] of Object.entries(icons)) {
      const iconResponse = await fetch(source);
      if (!iconResponse.ok) throw new Error('切换组件图标读取失败');
      const bytes = new Uint8Array(await iconResponse.arrayBuffer());
      sources[key] = 'data:image/png;base64,' + btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
    }
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>图表 / 列表切换</title><style>' + css + '\nbody{margin:24px;background:#fff}</style></head><body>' + markup(value, sources) + '<script>(' + viewSwitchRuntime.toString() + ')();<\/script></body></html>';
  }
  const section = document.createElement('article'); section.className = 'component-spec'; section.dataset.catalogId = 'view-switch'; section.id = 'component-view-switch';
  section.innerHTML = '<div class="original-spec-heading"><h3>图表 / 列表切换</h3></div><div class="zc-view-switch-samples"></div>';
  document.getElementById('content').append(section);
  for (const value of ['chart']) {
    const unit = document.createElement('section'); unit.className = 'individual-component zc-view-switch-example';
    const title = '交互示例';
    unit.innerHTML = '<div class="individual-component-heading"><h4>' + title + '</h4><div class="actions"><button type="button" data-view-export="svg">复制 SVG</button><button type="button" data-view-export="spec">查看规范</button><button type="button" data-view-export="code">查看代码</button><a href="https://www.figma.com/design/rTKeLXF81fJZFEsIIjZWXp?node-id=623-219794" target="_blank" rel="noreferrer">Figma 源组件</a></div></div>' + markup(value);
    section.querySelector('.zc-view-switch-samples').append(unit);
    unit.addEventListener('click', async event => {
      const action = event.target.closest('[data-view-export]')?.dataset.viewExport;
      if (!action) return;
      try {
        if (action === 'spec') {
          const rules = [['整体尺寸', '62 × 32px；左图表，右列表'], ['外壳', '白底，圆角99px，无描边；内边距2px，按钮间距2px'], ['按钮 / 原始切图', '按钮28 × 28px；56 × 56px原切图以28 × 28px显示，有效图形约18 × 18px'], ['默认态', '透明背景，图形 #666666'], ['选中态', '使用自带 #F2F3F5 圆底与 #333333 图形的选中切图；不重复叠加底色'], ['移入', '未选中项显示 #F2F3F5 圆形底色'], ['阴影', '0 0 12px rgba(0,0,0,.08)'], ['初始状态', '本页示例初始选中图表，可由data-view配置']];
          document.getElementById('spec-dialog-title').textContent = '图表 / 列表切换 · 设计规范';
          document.getElementById('spec-dialog-body').innerHTML = '<h3>尺寸与样式</h3><table><tbody>' + rules.map(row => '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>').join('') + '</tbody></table><h3>交互规则</h3><ol><li>同一时间仅选中一个视图；点击后切换对应的默认 / 选中切图。</li><li>重复点击当前项保持选中，不重复触发切换。</li><li>Tab聚焦当前项，左右方向键或Home / End切换；支持Enter与空格操作。</li><li>切换通过viewchange事件通知对应模块；示例只展示控件，不附加演示数据。</li><li>SVG导出当前选中态；独立HTML内嵌全部原切图和交互代码。</li></ol>';
          document.getElementById('spec-dialog').showModal();
        } else if (action === 'code') {
          codeValue = await exportCode(unit.querySelector('.zc-view-switch').dataset.view); document.getElementById('dialog-title').textContent = '图表 / 列表切换 · 开发代码'; document.getElementById('code-text').textContent = codeValue; document.getElementById('code-dialog').showModal();
        } else { await copy(await svgFor(unit.querySelector('.zc-view-switch'))); }
      } catch (error) { toast('操作失败，请重试'); }
    });
  }
  viewSwitchRuntime(section); styleComponentActions();
})();
