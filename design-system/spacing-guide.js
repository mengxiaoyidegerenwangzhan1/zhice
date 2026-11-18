(function () {
  'use strict';

  var host = document.getElementById('spacing-guide');
  if (!host || host.querySelector('.spacing-guide')) return;

  var rules = [
    { key: 'vertical', name: '模块上下内边距', value: 16, color: '#FF8085', description: '模块边缘到内部内容，上下均为 16px。' },
    { key: 'horizontal', name: '模块左右内边距', value: 20, color: '#929AFA', description: '模块边缘到内部内容，左右均为 20px。' },
    { key: 'subtitle', name: '子标题与内容', value: 8, color: '#FFD0A6', description: '子标题下方到对应内容区域为 8px。' },
    { key: 'title', name: '主标题与子标题', value: 12, color: '#B9FFA1', description: '模块主标题下方到子标题为 12px。' },
    { key: 'icon', name: '标题与说明图标', value: 4, color: '#79DCEE', description: '标题文字与说明图标之间为 4px。' },
    { key: 'column', name: '模块内两列间距', value: 32, color: '#8FF1D4', description: '同一模块中，左右两列内容之间为 32px。' },
    { key: 'module', name: '模块之间的间距', value: 16, color: '#D88CF0', description: '上下相邻模块之间为 16px，与模块内边距分别定义。' }
  ];
  var ruleMap = {};
  rules.forEach(function (rule) { ruleMap[rule.key] = rule; });

  function mark(key, modifier) {
    var rule = ruleMap[key];
    return '<button type="button" class="sg-mark sg-color-' + key + ' ' + modifier + '" data-spacing-key="' + key + '" aria-label="' + rule.name + '，' + rule.value + ' 像素" aria-pressed="false"></button>';
  }

  function moduleMarkup(number, leftTitle, rightTitle, annotated) {
    return '<section class="sg-module" aria-label="模块' + number + '间距示意">' +
      (annotated ? mark('vertical', 'sg-padding-top') + mark('horizontal', 'sg-padding-left') : '') +
      '<div class="sg-module-heading"><span class="sg-module-title">模块' + number + '</span>' +
      (annotated ? mark('icon', 'sg-icon-gap') : '<span class="sg-icon-gap" aria-hidden="true"></span>') +
      '<span class="sg-help-icon" aria-hidden="true">?</span></div>' +
      '<div class="sg-title-gap-row">' + (annotated ? mark('title', 'sg-title-gap') : '') + '</div>' +
      '<div class="sg-columns"><div class="sg-column"><div class="sg-subtitle">' + leftTitle + '</div>' +
      '<div class="sg-subtitle-gap-row">' + (annotated ? mark('subtitle', 'sg-subtitle-gap') : '') + '</div>' +
      '<div class="sg-content-panel" aria-hidden="true"></div></div>' +
      '<div class="sg-column"><div class="sg-subtitle">' + rightTitle + '</div>' +
      '<div class="sg-subtitle-gap-row"></div>' +
      '<div class="sg-content-panel" aria-hidden="true"></div></div>' +
      (annotated ? mark('column', 'sg-column-gap') : '') + '</div></section>';
  }

  host.innerHTML = '<div class="spacing-guide">' +
    '<div class="sg-intro"><h4>模块间距</h4><button type="button" class="component-text-action sg-spec-action" data-spacing-spec><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4zM14 7a3 3 0 0 1 3-3h3v14h-3a3 3 0 0 0-3 3"/></svg><span>查看规范</span></button></div>' +
    '<p class="sg-visually-hidden" id="sg-instructions">移入图例或图中色块查看对应间距；点击固定高亮，再次点击或按 Esc 取消。键盘 Tab 可逐项查看。</p>' +
    '<div class="sg-legend" aria-label="间距图例" aria-describedby="sg-instructions">' + rules.map(function (rule) {
      return '<button type="button" class="sg-legend-item sg-color-' + rule.key + '" data-spacing-key="' + rule.key + '" aria-label="' + rule.name + '，' + rule.value + ' 像素" aria-pressed="false">' + rule.value + 'px</button>';
    }).join('') + '</div>' +
    '<div class="sg-status" role="status" aria-live="polite" aria-atomic="true"><span class="sg-status-text">移入图例或色块，查看对应间距。</span></div>' +
    '<div class="sg-diagram-scroll" tabindex="0" role="region" aria-label="模块间距示意图，窄屏可横向滚动"><div class="sg-diagram">' +
    moduleMarkup('一', '内容1.1', '内容1.2', true) +
    '<div class="sg-module-gap-row">' + mark('module', 'sg-module-gap') + '</div>' +
    moduleMarkup('二', '内容2.1', '内容2.2', false) + '</div></div></div>';

  var root = host.querySelector('.spacing-guide');
  var items = Array.prototype.slice.call(root.querySelectorAll('[data-spacing-key]'));
  var statusText = root.querySelector('.sg-status-text');
  var status = root.querySelector('.sg-status');
  var hovered = null;
  var focused = null;
  var pinned = null;
  var rendered = null;
  var renderedPinned = null;

  function targetItem(node) {
    if (!node || !node.closest) return null;
    var item = node.closest('[data-spacing-key]');
    return item && root.contains(item) ? item : null;
  }

  function render() {
    var active = hovered || focused || pinned;
    if (active === rendered && pinned === renderedPinned) return;
    rendered = active;
    renderedPinned = pinned;
    root.classList.toggle('sg-has-active', !!active);
    items.forEach(function (item) {
      var key = item.getAttribute('data-spacing-key');
      item.classList.toggle('sg-is-active', key === active);
      item.classList.toggle('sg-is-pinned', key === pinned);
      item.setAttribute('aria-pressed', key === pinned ? 'true' : 'false');
    });
    status.className = 'sg-status' + (active ? ' sg-color-' + active : '');
    if (active) {
      var rule = ruleMap[active];
      statusText.textContent = (pinned === active ? '已固定：' : '') + rule.name + ' · ' + rule.value + 'px';
    } else {
      statusText.textContent = '移入图例或色块，查看对应间距。';
    }
  }

  root.addEventListener('pointerover', function (event) {
    if (event.pointerType === 'touch') return;
    var item = targetItem(event.target);
    hovered = item ? item.getAttribute('data-spacing-key') : null;
    render();
  });
  root.addEventListener('pointerout', function (event) {
    if (event.pointerType === 'touch') return;
    var next = targetItem(event.relatedTarget);
    hovered = next ? next.getAttribute('data-spacing-key') : null;
    render();
  });
  root.addEventListener('pointerleave', function () { hovered = null; render(); });
  root.addEventListener('focusin', function (event) {
    var item = targetItem(event.target);
    focused = item && item.matches(':focus-visible') ? item.getAttribute('data-spacing-key') : null;
    render();
  });
  root.addEventListener('focusout', function (event) {
    var next = targetItem(event.relatedTarget);
    focused = next && next.matches(':focus-visible') ? next.getAttribute('data-spacing-key') : null;
    render();
  });
  root.addEventListener('click', function (event) {
    var item = targetItem(event.target);
    if (!item) return;
    var key = item.getAttribute('data-spacing-key');
    pinned = pinned === key ? null : key;
    render();
  });
  root.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    hovered = focused = pinned = null;
    render();
  });

  root.querySelector('[data-spacing-spec]').addEventListener('click', function () {
    var dialog = document.getElementById('spec-dialog');
    var title = document.getElementById('spec-dialog-title');
    var body = document.getElementById('spec-dialog-body');
    if (!dialog || !title || !body) return;
    title.textContent = '模块间距 · 设计规范';
    body.innerHTML = '<h3>尺寸与样式</h3><table class="sg-spec-table"><thead><tr><th>图例</th><th>规范项</th><th>数值</th><th>应用说明</th></tr></thead><tbody>' + rules.map(function (rule) {
      return '<tr><td><span class="sg-spec-swatch" style="background:' + rule.color + '" aria-label="' + rule.color + '"></span></td><td>' + rule.name + '</td><td class="sg-spec-value">' + rule.value + 'px</td><td>' + rule.description + '</td></tr>';
    }).join('') + '</tbody></table><h3>交互说明</h3><p class="component-rule-note">移入图例或图中色块，对应位置同步高亮；点击可固定，再次点击或按 Esc 取消。键盘 Tab 可逐项查看。</p><p class="component-rule-note">色块仅用于标注布局间距。组件内部间距以各组件规范为准。</p>';
    dialog.showModal();
  });

  function visitSpacingHash() {
    if (window.location.hash !== '#general-spacing') return;
    var tab = document.getElementById('visual-tab-general');
    var section = document.getElementById('general-spacing');
    if (!tab || !section) return;
    tab.click();
    var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(function () {
      window.requestAnimationFrame(function () {
        if (window.location.hash !== '#general-spacing') return;
        var topbar = document.querySelector('.topbar');
        var inset = (topbar ? topbar.getBoundingClientRect().height : 0) + 16;
        window.scrollTo({ top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - inset), behavior: 'instant' });
      });
    });
  }
  window.addEventListener('hashchange', visitSpacingHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', visitSpacingHash, { once: true });
  else visitSpacingHash();
}());
