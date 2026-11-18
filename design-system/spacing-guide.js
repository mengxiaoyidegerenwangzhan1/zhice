(function () {
  'use strict';

  var host = document.getElementById('spacing-guide');
  if (!host || host.querySelector('.spacing-guide')) return;

  var rules = [
    { key: 'vertical', name: '模块上下内边距', value: 16, description: '模块边缘到内部内容，上下均为 16px。' },
    { key: 'horizontal', name: '模块左右内边距', value: 20, description: '模块边缘到内部内容，左右均为 20px。' },
    { key: 'subtitle', name: '子标题与内容', value: 8, description: '子标题下方到对应内容区域为 8px。' },
    { key: 'title', name: '主标题与子标题', value: 12, description: '模块主标题下方到子标题为 12px。' },
    { key: 'icon', name: '标题与说明图标', value: 4, description: '标题文字与说明图标之间为 4px。' },
    { key: 'column', name: '模块内两列间距', value: 32, description: '同一模块中，左右两列内容之间为 32px。' },
    { key: 'module', name: '模块之间的间距', value: 16, description: '上下相邻模块之间为 16px，与模块内边距分别定义。' }
  ];
  var ruleMap = {};
  rules.forEach(function (rule) { ruleMap[rule.key] = rule; });

  function mark(key, modifier, text) {
    var rule = ruleMap[key];
    return '<button type="button" class="sg-mark sg-color-' + key + ' ' + modifier + '" data-spacing-key="' + key + '" aria-label="' + rule.name + '，' + rule.value + ' 像素" aria-pressed="false">' +
      (text ? '<span class="sg-mark-label">' + text + '</span>' : '<span class="sg-visually-hidden">' + rule.name + ' ' + rule.value + 'px</span>') + '</button>';
  }

  function moduleMarkup(number, leftTitle, rightTitle) {
    return '<section class="sg-module" aria-label="模块' + number + '间距示意">' +
      mark('vertical', 'sg-padding-top', '上下内边距 · 16px') +
      mark('vertical', 'sg-padding-bottom', '') +
      mark('horizontal', 'sg-padding-left', '左右内边距 · 20px') +
      mark('horizontal', 'sg-padding-right', '') +
      '<div class="sg-module-heading"><span class="sg-module-title">模块' + number + '</span>' +
      mark('icon', 'sg-icon-gap', '标题与图标 · 4px') +
      '<span class="sg-help-icon" aria-hidden="true">?</span></div>' +
      '<div class="sg-title-gap-row">' + mark('title', 'sg-title-gap', '主标题至子标题 · 12px') + '</div>' +
      '<div class="sg-columns"><div class="sg-column"><div class="sg-subtitle">' + leftTitle + '</div>' +
      '<div class="sg-subtitle-gap-row">' + mark('subtitle', 'sg-subtitle-gap', '子标题至内容 · 8px') + '</div>' +
      '<div class="sg-content-panel" aria-hidden="true"></div></div>' +
      '<div class="sg-column"><div class="sg-subtitle">' + rightTitle + '</div>' +
      '<div class="sg-subtitle-gap-row">' + mark('subtitle', 'sg-subtitle-gap', '') + '</div>' +
      '<div class="sg-content-panel" aria-hidden="true"></div></div>' +
      mark('column', 'sg-column-gap', '两列间距 · 32px') + '</div></section>';
  }

  host.innerHTML = '<div class="spacing-guide">' +
    '<div class="sg-intro"><h4>模块间距</h4><p id="sg-instructions">移入图例或图中色块，查看对应关系；点击可固定高亮，再次点击或按 Esc 取消。键盘 Tab 可逐项查看。</p></div>' +
    '<div class="sg-legend" aria-label="间距图例" aria-describedby="sg-instructions">' + rules.map(function (rule) {
      return '<button type="button" class="sg-legend-item sg-color-' + rule.key + '" data-spacing-key="' + rule.key + '" aria-pressed="false"><span class="sg-swatch" aria-hidden="true"></span><span class="sg-legend-name">' + rule.name + '</span><strong>' + rule.value + '<span>px</span></strong></button>';
    }).join('') + '</div>' +
    '<div class="sg-status" role="status" aria-live="polite" aria-atomic="true"><span class="sg-status-dot" aria-hidden="true"></span><span class="sg-status-text">选择任一图例或色块，对应位置会同步高亮。</span></div>' +
    '<div class="sg-diagram-scroll" tabindex="0" role="region" aria-label="模块间距示意图，窄屏可横向滚动"><div class="sg-diagram">' +
    moduleMarkup('一', '模块 1.1', '模块 1.2') +
    '<div class="sg-module-gap-row">' + mark('module', 'sg-module-gap', '模块间距 · 16px') + '</div>' +
    moduleMarkup('二', '收益走势', '动态回撤') +
    '</div></div><p class="sg-note">色块仅用于标注间距，不属于实际界面。组件内部间距以各组件规范为准。</p></div>';

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
      statusText.textContent = (pinned === active ? '已固定：' : '') + rule.name + ' · ' + rule.value + 'px。' + rule.description;
    } else {
      statusText.textContent = '选择任一图例或色块，对应位置会同步高亮。';
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
