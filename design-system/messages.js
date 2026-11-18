(function installMessages() {
  const types = [
    {type: 'error', title: '错误', text: '什么什么操作失败', accent: '#F26173', background: '#FFF0F2', border: '#FFD8DC', node: '610-83961'},
    {type: 'warning', title: '警告', text: '您选择了不同类型的基金，建议同类型基金对比更具有参考意义。', accent: '#FFC069', background: '#FFFAF2', border: '#FFECD2', node: '610-83973'},
    {type: 'success', title: '正确', text: '什么什么操作已经成功', accent: '#48CB95', background: '#F0FFF9', border: '#C9FFE9', node: '610-83985'}
  ];

  function markup(item) {
    return '<div class="zhice-message" data-type="' + item.type + '" role="' + (item.type === 'success' ? 'status' : 'alert') + '">' +
      '<img class="zhice-message-icon" width="12" height="12" src="assets/messages/' + item.type + '.png" alt="">' +
      '<span class="zhice-message-text">' + item.text + '</span>' +
      '<button class="zhice-message-close" type="button" aria-label="关闭' + item.title + '提示"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.1"/><path d="m4.7 4.7 4.6 4.6m0-4.6L4.7 9.3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg></button></div>';
  }

  function messageRuntime(root = document) {
    root.querySelectorAll('.zhice-message-close').forEach(button => {
      button.addEventListener('click', () => {
        const message = button.closest('.zhice-message');
        message.hidden = true;
        message.dispatchEvent(new CustomEvent('messageclose', {bubbles: true, detail: {type: message.dataset.type}}));
      });
    });
  }

  const sharedRules = [
    ['标准尺寸', '600 × 35px；窄屏随容器缩小，长文本自动换行'],
    ['圆角 / 描边', '99px / 1px'],
    ['内边距', '上下8px，左右12px'],
    ['正文', 'PingFang SC Regular · 12px / 17px · #333333'],
    ['状态图标', '使用提供的24 × 24px透明PNG切图，以12 × 12px显示；与正文间距6px'],
    ['关闭图标', '14 × 14px · #999999，右侧内边距12px'],
    ['阴影', '0 0 12px rgba(0,0,0,.08)']
  ];

  async function exportCode(item) {
    const response = await fetch('messages.css?v=20261118-message-titles');
    if (!response.ok) throw new Error('气泡样式读取失败');
    const css = await response.text();
    const iconResponse = await fetch('assets/messages/' + item.type + '.png');
    if (!iconResponse.ok) throw new Error('气泡图标读取失败');
    const bytes = new Uint8Array(await iconResponse.arrayBuffer());
    const iconData = 'data:image/png;base64,' + btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
    const component = markup(item).replace('assets/messages/' + item.type + '.png', iconData);
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + item.title + '气泡</title><style>' + css + '\nbody{margin:24px}</style></head><body>' + component + '<script>(' + messageRuntime.toString() + ')();<\/script></body></html>';
  }

  const section = document.createElement('article');
  section.id = 'component-message';
  section.className = 'component-spec';
  section.dataset.catalogId = 'message';
  section.innerHTML = '<div class="original-spec-heading"><h3>气泡</h3></div><div class="message-examples"></div>';
  document.getElementById('content').append(section);

  types.forEach(item => {
    const example = document.createElement('section');
    example.className = 'individual-component message-example';
    example.style.setProperty('--message-title-color', item.accent);
    example.innerHTML = '<div class="individual-component-heading"><h4>' + item.title + '</h4><div class="actions">' +
      '<button type="button" data-message-action="svg">复制 SVG</button>' +
      '<button type="button" data-message-action="spec">查看规范</button>' +
      '<button type="button" data-message-action="code">查看代码</button>' +
      '<a href="https://www.figma.com/design/rTKeLXF81fJZFEsIIjZWXp?node-id=' + item.node + '" target="_blank" rel="noreferrer">Figma 源组件</a></div></div>' +
      '<div class="message-preview">' + markup(item) + '<button class="message-restore" type="button" hidden>重新展示' + item.title + '气泡</button></div>';
    section.querySelector('.message-examples').append(example);
    const message = example.querySelector('.zhice-message');
    const restore = example.querySelector('.message-restore');
    message.addEventListener('messageclose', () => { restore.hidden = false; restore.focus(); });
    restore.addEventListener('click', () => { restore.hidden = true; message.hidden = false; message.querySelector('button').focus(); });
    example.addEventListener('click', async event => {
      const action = event.target.closest('[data-message-action]')?.dataset.messageAction;
      if (!action) return;
      try {
        if (action === 'spec') {
          document.getElementById('spec-dialog-title').textContent = item.title + '气泡 · 设计规范';
          document.getElementById('spec-dialog-body').innerHTML = '<h3>尺寸与样式</h3><table><tbody>' +
            [...sharedRules, ['背景', item.background], ['描边颜色', item.border], ['状态颜色', item.accent]].map(row => '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>').join('') +
            '</tbody></table><h3>交互规则</h3><ol><li>错误用于操作失败，警告用于需要关注的信息，正确用于操作完成。</li><li>点击右侧关闭按钮，仅关闭当前气泡，支持键盘聚焦和触发。</li><li>当前示例保持显示以便核对；关闭后可点击“重新展示”恢复。</li><li>内容过长时换行，状态和关闭图标保持完整显示。</li></ol>';
          document.getElementById('spec-dialog').showModal();
        } else if (action === 'code') {
          codeValue = await exportCode(item);
          document.getElementById('dialog-title').textContent = item.title + '气泡 · 开发代码';
          document.getElementById('code-text').textContent = codeValue;
          document.getElementById('code-dialog').showModal();
        } else {
          // Export the canonical visible component even when its preview was dismissed.
          const temporary = document.createElement('div');
          temporary.style.cssText = 'position:fixed;left:-10000px;top:0;width:600px;';
          temporary.innerHTML = markup(item);
          document.body.append(temporary);
          try { await copy(await svgFor(temporary.querySelector('.zhice-message'))); }
          finally { temporary.remove(); }
        }
      } catch (error) { toast('操作失败，请重试'); }
    });
  });
  messageRuntime(section);
  styleComponentActions();
})();
