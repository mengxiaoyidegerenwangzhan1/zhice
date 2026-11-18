(function installModuleActions() {
  const iconSources = {
    image:'assets/module-actions/image-download.png',
    table:'assets/module-actions/table-download.png',
    refresh:'assets/module-actions/refresh.png'
  };
  const iconLabels = {image:'下载图片', table:'下载表格', refresh:'刷新'};
  function iconMarkup(action, sources = iconSources, hover = false) {
    return '<button class="zc-module-icon' + (hover ? ' is-hover' : '') + '" type="button" data-module-do="' + action + '" aria-label="' + iconLabels[action] + '" title="' + iconLabels[action] + '"><img src="' + sources[action] + '" width="28" height="28" alt=""></button>';
  }
  function groupMarkup(sources = iconSources) {
    return '<div class="zc-module-actions" role="group" aria-label="模块操作">' + ['image','table','refresh'].map(action => iconMarkup(action, sources)).join('') + '</div>';
  }
  function demoMarkup(sources = iconSources) {
    return '<div class="zc-module-demo"><div class="zc-module-states"><div class="zc-module-state"><span class="zc-module-state-label">默认</span>' + groupMarkup(sources) + '</div><div class="zc-module-state"><span class="zc-module-state-label">移入</span>' + iconMarkup('image', sources, true) + '</div></div><div class="zc-module-data"><span class="zc-module-data-label">演示数据</span><span>近1年收益</span><strong data-module-value>6.63%</strong></div><p class="zc-module-feedback" role="status" aria-live="polite"></p></div>';
  }
  function moduleActionsRuntime(root = document) {
    function download(blob, filename) {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url; link.download = filename;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function imageBlob(value) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = 640; canvas.height = 160;
        const context = canvas.getContext('2d');
        if (!context) { reject(new Error('图片生成失败')); return; }
        context.fillStyle = '#fff'; context.fillRect(0,0,640,160);
        context.fillStyle = '#666'; context.font = '14px "PingFang SC",sans-serif';
        context.fillText('近1年收益', 28, 36);
        context.fillStyle = '#6865a7'; context.font = '500 32px Arial,sans-serif';
        context.fillText(value, 28, 86);
        context.fillStyle = '#999'; context.font = '12px "PingFang SC",sans-serif';
        context.fillText('智策 · 组件交互演示数据', 28, 132);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('图片生成失败')), 'image/png');
      });
    }
    root.querySelectorAll('.zc-module-demo').forEach(host => {
      const value = host.querySelector('[data-module-value]');
      const feedback = host.querySelector('.zc-module-feedback');
      let revision = 0;
      host.addEventListener('click', async event => {
        const button = event.target.closest('[data-module-do]');
        if (!button || button.disabled) return;
        const action = button.dataset.moduleDo;
        if (action === 'refresh') {
          button.disabled = true; button.classList.add('is-loading');
          button.setAttribute('aria-label', '正在刷新');
          button.closest('.zc-module-actions')?.setAttribute('aria-busy', 'true');
          feedback.textContent = '正在刷新…';
          setTimeout(() => {
            revision++;
            value.textContent = [6.63,6.71,6.68][revision % 3].toFixed(2) + '%';
            button.disabled = false; button.classList.remove('is-loading');
            button.setAttribute('aria-label', '刷新');
            button.closest('.zc-module-actions')?.removeAttribute('aria-busy');
            feedback.textContent = '已刷新：近1年收益 ' + value.textContent;
            host.dispatchEvent(new CustomEvent('modulerefresh', {bubbles:true, detail:{metric:'近1年收益', value:value.textContent}}));
          }, 650);
          return;
        }
        button.disabled = true;
        try {
          const currentValue = value.textContent;
          if (action === 'image') {
            download(await imageBlob(currentValue), '近1年收益-演示.png');
            feedback.textContent = '已下载当前演示数据图片（PNG）';
          } else if (action === 'table') {
            const csv = '\uFEFF指标,收益率\r\n近1年收益,' + currentValue + '\r\n';
            download(new Blob([csv], {type:'text/csv;charset=utf-8'}), '近1年收益-演示.csv');
            feedback.textContent = '已下载当前演示数据表格（CSV）';
          }
          host.dispatchEvent(new CustomEvent('moduledownload', {bubbles:true, detail:{type:action, value:currentValue}}));
        } catch (error) { feedback.textContent = '下载失败，请重试'; }
        finally { button.disabled = false; }
      });
    });
  }
  async function exportCode() {
    const response = await fetch('module-actions.css?v=20261118-module-actions');
    if (!response.ok) throw new Error('组件样式读取失败');
    const css = await response.text();
    const embedded = {};
    for (const [action, source] of Object.entries(iconSources)) {
      const iconResponse = await fetch(source);
      if (!iconResponse.ok) throw new Error('组件切图读取失败');
      const bytes = new Uint8Array(await iconResponse.arrayBuffer());
      embedded[action] = 'data:image/png;base64,' + btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
    }
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>图片/表格下载、刷新</title><style>' + css + '\nbody{margin:24px;background:#fff}</style></head><body>' + demoMarkup(embedded) + '<script>(' + moduleActionsRuntime.toString() + ')();<\/script></body></html>';
  }

  const section = document.createElement('article');
  section.id = 'component-module-actions'; section.className = 'component-spec'; section.dataset.catalogId = 'module-actions';
  section.innerHTML = '<div class="original-spec-heading"><h3>模块操作</h3></div><section class="individual-component"><div class="individual-component-heading"><h4>图片/表格下载、刷新</h4><div class="actions"><button type="button" data-module-export="svg">复制 SVG</button><button type="button" data-module-export="spec">查看规范</button><button type="button" data-module-export="code">查看代码</button><a href="https://www.figma.com/design/rTKeLXF81fJZFEsIIjZWXp?node-id=620-214366" target="_blank" rel="noreferrer">Figma 源组件</a></div></div>' + demoMarkup() + '</section>';
  document.getElementById('content').append(section);
  moduleActionsRuntime(section); styleComponentActions();
  section.addEventListener('click', async event => {
    const action = event.target.closest('[data-module-export]')?.dataset.moduleExport;
    if (!action) return;
    try {
      if (action === 'spec') {
        const rules = [['组合尺寸', '92 × 32px；图片下载 → 表格下载 → 刷新'], ['外壳', '白底；圆角99px；内边距2px；选项间距2px'], ['单个按钮', '28 × 28px，圆角99px'], ['原始切图', '使用提供的56 × 56px透明PNG，以28 × 28px原比例显示；有效图形约18 × 18px'], ['移入', '当前按钮显示圆形 #F2F3F5 背景'], ['阴影', '0 0 12px rgba(0,0,0,.08)'], ['键盘', 'Tab聚焦按钮；Enter / 空格触发，聚焦显示主色轮廓'], ['刷新中', '旋转刷新图标并禁用当前刷新按钮，完成后恢复'], ['下载示例', '图片导出当前演示数据为PNG；表格导出当前演示数据为CSV']];
        document.getElementById('spec-dialog-title').textContent = '图片/表格下载、刷新 · 设计规范';
        document.getElementById('spec-dialog-body').innerHTML = '<h3>尺寸与样式</h3><table><tbody>' + rules.map(row => '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>').join('') + '</tbody></table><h3>交互规则</h3><ol><li>三个按钮分别作用于当前模块，不改变其他模块。</li><li>下载图片或表格时使用当前已生效数据；刷新期间保留上次数据显示，完成后更新。</li><li>刷新中不可重复触发；完成和下载后给出轻量反馈。</li><li>此处为本地演示：PNG和CSV实际下载，刷新在三组示例值间轮换。独立HTML已内嵌PNG和交互，不需要外部依赖。</li></ol>';
        document.getElementById('spec-dialog').showModal();
      } else if (action === 'code') {
        codeValue = await exportCode();
        document.getElementById('dialog-title').textContent = '图片/表格下载、刷新 · 开发代码';
        document.getElementById('code-text').textContent = codeValue;
        document.getElementById('code-dialog').showModal();
      } else {
        const temporary = document.createElement('div'); temporary.style.cssText = 'position:fixed;left:-10000px;top:0;width:92px;height:32px;';
        temporary.innerHTML = groupMarkup(); document.body.append(temporary);
        try { await copy(await svgFor(temporary.querySelector('.zc-module-actions'))); }
        finally { temporary.remove(); }
      }
    } catch (error) { toast('操作失败，请重试'); }
  });
})();
