(function installTaskModal() {
  const promptPlaceholder = '描述这个定时任务要做的投研分析，例如:汇总隔夜市场要闻、北向资金与主要指数表现，结合估值水位，输出今日基金市场晨报与关注方向。';
  function panelMarkup(prefix) {
    const options = count => Array.from({length: count}, (_, i) => '<option value="' + String(i).padStart(2, '0') + '">' + String(i).padStart(2, '0') + '</option>').join('');
    return `<section class="zc-task-panel" aria-label="新建定时任务">
      <form class="zc-task-form" novalidate>
        <div class="zc-task-header"><h4 id="${prefix}-title">新建定时任务</h4><button class="zc-task-close" type="button" aria-label="关闭新建定时任务"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg></button></div>
        <div class="zc-task-body">
          <div class="zc-task-field"><label class="zc-task-label" for="${prefix}-name">任务名称</label><input class="zc-task-control" id="${prefix}-name" name="name" required aria-describedby="${prefix}-name-error" placeholder="例如：每日基金市场晨报" autocomplete="off"><p class="zc-task-error" id="${prefix}-name-error" data-error="name" hidden></p></div>
          <div class="zc-task-field"><label class="zc-task-label" for="${prefix}-frequency">触发时间</label><div class="zc-task-trigger-row">
            <div class="zc-task-select-wrap"><select class="zc-task-control" id="${prefix}-frequency" name="frequency" aria-label="触发频率"><option value="trading-day">每交易日</option><option value="daily">每天</option><option value="monday">每周一</option></select><svg class="zc-task-select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2 4 4 4 4-4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div class="zc-task-time-wrap"><input class="zc-task-control" id="${prefix}-time" name="time" aria-label="触发时刻" aria-describedby="${prefix}-time-error" inputmode="numeric" value="08:00" placeholder="HH:mm" required><button class="zc-task-clock" type="button" aria-label="选择触发时刻" aria-expanded="false" aria-controls="${prefix}-time-picker"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor"/><path d="M7 3.5V7h3.2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <div class="zc-task-time-popover" id="${prefix}-time-picker" role="group" aria-label="选择时间" hidden><div class="zc-task-time-options"><label>小时<select class="zc-task-control" data-task-hour aria-label="小时">${options(24)}</select></label><span>:</span><label>分钟<select class="zc-task-control" data-task-minute aria-label="分钟">${options(60)}</select></label></div><button class="zc-task-button" type="button" data-task-time-confirm>确定</button></div>
            </div></div><p class="zc-task-error" id="${prefix}-time-error" data-error="time" hidden></p></div>
          <div class="zc-task-field"><label class="zc-task-label" for="${prefix}-prompt">你希望投研助手做什么？</label><textarea class="zc-task-control zc-task-textarea" id="${prefix}-prompt" name="prompt" required aria-describedby="${prefix}-prompt-error" placeholder="${promptPlaceholder}"></textarea><p class="zc-task-error" id="${prefix}-prompt-error" data-error="prompt" hidden></p></div>
        </div>
        <div class="zc-task-footer"><button class="zc-task-button zc-task-button-secondary" type="button" data-task-cancel>取消</button><button class="zc-task-button" type="submit">创建</button></div>
      </form></section>`;
  }

  function demoMarkup() {
    return '<div class="zc-task-demo"><div class="zc-task-preview">' + panelMarkup('task-preview') + '</div><p class="zc-task-feedback" role="status" hidden></p></div>';
  }

  function taskModalRuntime(root = document) {
    root.querySelectorAll('.zc-task-demo').forEach(host => {
      const preview = host.querySelector('.zc-task-preview .zc-task-panel');
      const feedback = host.querySelector('.zc-task-feedback');
      function bind(panel, onClose) {
        const form = panel.querySelector('form');
        const submit = form.querySelector('[type="submit"]');
        const time = form.elements.namedItem('time');
        const clock = panel.querySelector('.zc-task-clock');
        const popover = panel.querySelector('.zc-task-time-popover');
        const hour = panel.querySelector('[data-task-hour]');
        const minute = panel.querySelector('[data-task-minute]');
        let timer = null;
        function closeTime() { popover.hidden = true; clock.setAttribute('aria-expanded', 'false'); }
        function errorFor(name) {
          const value = form.elements.namedItem(name).value.trim();
          if (!value) return name === 'name' ? '请输入任务名称' : name === 'prompt' ? '请描述投研任务内容' : '请选择触发时刻';
          if (name === 'time' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return '请输入有效时间，例如 08:00';
          return '';
        }
        function validate(name) {
          const message = errorFor(name);
          const input = form.elements.namedItem(name);
          const error = form.querySelector('[data-error="' + name + '"]');
          input.setAttribute('aria-invalid', String(Boolean(message)));
          error.textContent = message;
          error.hidden = !message;
          return !message;
        }
        function cancelPending() { clearTimeout(timer); timer = null; submit.disabled = false; submit.textContent = '创建'; form.removeAttribute('aria-busy'); }
        function close(reason) { cancelPending(); closeTime(); onClose(reason); }
        panel.querySelector('.zc-task-close').addEventListener('click', () => close('cancel'));
        panel.querySelector('[data-task-cancel]').addEventListener('click', () => close('cancel'));
        clock.addEventListener('click', () => {
          const shouldOpen = popover.hidden;
          closeTime();
          if (!shouldOpen) return;
          const match = time.value.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
          hour.value = match ? match[1] : '08';
          minute.value = match ? match[2] : '00';
          popover.hidden = false;
          clock.setAttribute('aria-expanded', 'true');
          hour.focus();
        });
        panel.querySelector('[data-task-time-confirm]').addEventListener('click', () => { time.value = hour.value + ':' + minute.value; validate('time'); closeTime(); clock.focus(); });
        document.addEventListener('pointerdown', event => { if (!panel.querySelector('.zc-task-time-wrap').contains(event.target)) closeTime(); });
        form.addEventListener('keydown', event => {
          if (event.key !== 'Escape') return;
          event.preventDefault(); event.stopPropagation();
          if (!popover.hidden) { closeTime(); clock.focus(); }
          else close('cancel');
        });
        form.addEventListener('input', event => {
          const name = event.target.name;
          if (['name', 'time', 'prompt'].includes(name) && event.target.getAttribute('aria-invalid') === 'true') validate(name);
        });
        form.addEventListener('submit', event => {
          event.preventDefault();
          if (submit.disabled) return;
          closeTime();
          const names = ['name', 'time', 'prompt'];
          const validity = names.map(validate);
          if (validity.some(valid => !valid)) { form.elements.namedItem(names[validity.indexOf(false)]).focus(); return; }
          const detail = Object.fromEntries(['name', 'frequency', 'time', 'prompt'].map(name => [name, form.elements.namedItem(name).value.trim()]));
          submit.disabled = true; submit.textContent = '创建中…'; form.setAttribute('aria-busy', 'true');
          // A local demonstration only. Applications can handle taskcreate to save the task.
          timer = setTimeout(() => {
            cancelPending(); closeTime(); onClose('created');
            feedback.hidden = false; feedback.textContent = '演示任务“' + detail.name + '”创建成功';
            host.dispatchEvent(new CustomEvent('taskcreate', {bubbles: true, detail}));
          }, 650);
        });
        return {
          cancel: cancelPending,
          reset() { cancelPending(); closeTime(); form.reset(); form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid')); form.querySelectorAll('.zc-task-error').forEach(error => { error.hidden = true; error.textContent = ''; }); }
        };
      }
      const inlineState = bind(preview, reason => {
        inlineState.reset();
        if (reason !== 'created') {
          feedback.hidden = false;
          feedback.textContent = '已取消，示例已恢复默认值';
        }
        preview.querySelector('[name="name"]').focus();
      });
    });
  }

  const section = document.createElement('article');
  section.className = 'component-spec'; section.dataset.catalogId = 'modal'; section.id = 'component-modal';
  section.innerHTML = '<div class="original-spec-heading"><h3>弹窗</h3></div><section class="individual-component"><div class="individual-component-heading"><h4>表单弹窗 · 新建定时任务</h4><div class="actions"><button type="button" data-modal-action="svg">复制 SVG</button><button type="button" data-modal-action="spec">查看规范</button><button type="button" data-modal-action="code">查看代码</button><a href="https://www.figma.com/design/rTKeLXF81fJZFEsIIjZWXp?node-id=610-84006" target="_blank" rel="noreferrer">Figma 源组件</a></div></div>' + demoMarkup() + '</section>';
  document.getElementById('content').append(section);
  taskModalRuntime(section); styleComponentActions();
  section.addEventListener('click', async event => {
    const action = event.target.closest('[data-modal-action]')?.dataset.modalAction;
    if (!action) return;
    try {
      if (action === 'spec') {
        document.getElementById('spec-dialog-title').textContent = '表单弹窗 · 设计规范';
        const rows = [['外框', '宽520px，高度自适应（默认约434px）；圆角16px；白底，无外描边；投影0 0 12px rgba(0,0,0,.08)'], ['标题', '16px Semibold / 22px，#333333'], ['标题区内距', '左右24px，上16px，下12px'], ['正文内距', '左右24px，上下16px；字段间20px，标签与控件间8px'], ['表单控件', '高度32px，14px Regular / 20px；胶囊圆角99px；左右12px内距'], ['文字颜色', '正文 #333333；占位 #999999'], ['控件描边', '默认1px #EAEAEA（85%）；移入、聚焦及键盘焦点均为单层1px #B9B8D8，不叠加outline或外圈阴影'], ['多行输入', '默认高100px，圆角12px；上下8px、左右12px内距'], ['触发时间', '频率与时刻两列等宽，间距12px'], ['操作区', '左右24px，上12px，下16px；按钮间16px'], ['按钮', '高34px，取消70px / 创建68px；主色 #6865A7'], ['关闭图标', '18px / #999999'], ['分割线', '标题区下方与操作区上方：1px #EEEEEE']];
        document.getElementById('spec-dialog-body').innerHTML = '<h3>尺寸与样式</h3><table><tbody>' + rows.map(row => '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>').join('') + '</tbody></table><h3>交互规则</h3><ol><li>页面直接展示一个可编辑示例，不额外提供打开或重新展示工具栏。</li><li>右上角关闭、取消或Esc重置当前表单并显示取消反馈；示例保持可见，方便继续试用。时间选择展开时，Esc先收起时间选择。</li><li>名称与任务内容必填；时刻采用24小时制HH:mm，可直接编辑或点击时钟选择。</li><li>点击创建先校验，错误在对应字段下方显示；提交中禁用创建，防止重复点击。</li><li>演示提交成功后显示反馈并恢复默认值；独立代码通过taskcreate事件传出表单数据，未连接实际定时任务服务。</li><li>窄屏缩小宽度，内容过高时可滚动，操作区和字段不溢出。</li></ol>';
        document.getElementById('spec-dialog').showModal();
      } else if (action === 'code') {
        const response = await fetch('modals.css?v=20261118-modal-single-border');
        if (!response.ok) throw new Error('弹窗样式读取失败');
        codeValue = '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>新建定时任务 · 表单弹窗</title><style>' + await response.text() + '\nbody{margin:24px;background:#f2f3f5}.zc-task-demo{max-width:640px;margin:auto}</style></head><body>' + demoMarkup() + '<script>(' + taskModalRuntime.toString() + ')();<\/script></body></html>';
        document.getElementById('dialog-title').textContent = '表单弹窗 · 开发代码'; document.getElementById('code-text').textContent = codeValue; document.getElementById('code-dialog').showModal();
      } else {
        const temporary = document.createElement('div'); temporary.style.cssText = 'position:fixed;left:-10000px;top:0;width:520px;'; temporary.innerHTML = panelMarkup('task-export'); document.body.append(temporary);
        try { await copy(await svgFor(temporary.querySelector('.zc-task-panel'))); } finally { temporary.remove(); }
      }
    } catch (error) { toast('操作失败，请重试'); }
  });
})();
