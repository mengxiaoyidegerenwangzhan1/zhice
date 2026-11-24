(() => {
  'use strict';
  const trigger = document.getElementById('identity');
  const panel = document.getElementById('account-pop');
  const nameNode = trigger.querySelector('.identity-text strong');
  const storageKey = 'zhice.nav-profile-name.'+(document.documentElement.dataset.prototype || 'v1');
  const options = [
    ['settings', '设置', '<path d="m9.4 2.5 5.2 0 .7 2.1 2 .9 2-.6 2.6 4.4-1.4 1.6v2.2l1.4 1.6-2.6 4.4-2-.6-2 .9-.7 2.1H9.4l-.7-2.1-2-.9-2 .6-2.6-4.4 1.4-1.6v-2.2L2.1 9.3l2.6-4.4 2 .6 2-.9z"/><circle cx="12" cy="12" r="3.2"/>'],
    ['help', '使用帮助', '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .3c0 2-2.5 2.2-2.5 4M12 16h.01"/>']
  ];
  const icon = path => '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
  const isV3 = document.documentElement.dataset.prototype === 'v3';
  const workspace = document.getElementById('workspace');
  const layoutStorageKey = 'zhice.navlab.v3.conversation-position';
  let conversationPosition = 'center';
  function applyConversationPosition(value) {
    const position = value === 'right' ? 'right' : 'center';
    if (workspace.dataset.conversationPosition === position) return;
    workspace.dataset.conversationPosition = position;
    window.dispatchEvent(new Event('study-layout-change'));
  }
  if (isV3) {
    try {
      if (localStorage.getItem(layoutStorageKey) === 'right') conversationPosition = 'right';
    } catch {}
    applyConversationPosition(conversationPosition);
  }
  let section = 'menu';
  function setName(value) {
    nameNode.textContent = value;
    trigger.setAttribute('aria-label', value + '，账户菜单');
    trigger.title = value + ' · 账户菜单';
  }
  let name = nameNode.textContent;
  try { name = localStorage.getItem(storageKey) || name; } catch {}
  setName(name);
  function saveName(value) {
    setName(value);
    try { localStorage.setItem(storageKey, value); } catch {}
  }
  trigger.setAttribute('aria-haspopup', 'menu');
  function close(restoreFocus = false) {
    if (panel.hidden) return;
    panel.hidden = true;
    section = 'menu';
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }
  function showMenu(id = 'settings') {
    section = 'menu';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', '账户菜单');
    panel.innerHTML = options.map(([key, label, path]) =>
      (key === 'help' ? '<hr class="account-divider" role="separator">' : '') +
      '<button type="button" role="menuitem" class="account-option" data-section="' + key + '">' + icon(path) +
      '<span class="account-option-title">' + label + '</span></button>'
    ).join('');
    panel.querySelector('[data-section="' + id + '"]').focus({ preventScroll: true });
  }
  const helpContent = '<ul class="account-help"><li>从「发起研究」选一个任务，或直接输入问题。</li><li>点击侧栏顶部的搜索，可查找聊天记录和功能导航。</li></ul>';
  function layoutOptions() {
    const choices = [
      ['center', '会话区居中 · 内容区居右'],
      ['right', '会话区居右 · 内容区居中']
    ];
    return '<section class="account-layout" aria-labelledby="account-layout-title">'+
      '<h3 id="account-layout-title">调整会话区、内容区展示顺序</h3><p id="account-layout-hint">选择会话区和内容区的排列方式</p>'+
      '<fieldset class="account-layout-options" aria-label="会话区和内容区排列方式" aria-describedby="account-layout-hint">'+
      choices.map(([value, label]) => '<label class="account-layout-option">'+
        '<span class="account-layout-option-heading"><span>'+label+'</span><input type="radio" name="conversation-position" value="'+value+'"'+(conversationPosition === value ? ' checked' : '')+'></span>'+
        '<span class="account-layout-thumbnail" data-position="'+value+'" aria-hidden="true"><span class="account-layout-nav"></span><span class="account-layout-chat"></span><span class="account-layout-content"></span></span></label>').join('')+
      '</fieldset></section>';
  }
  function openSectionDialog(id, title) {
    if (document.querySelector('dialog.account-dialog[open]')) return;
    close();
    const dialog = document.createElement('dialog');
    dialog.className = 'zc-modal account-dialog';
    dialog.setAttribute('aria-labelledby', 'account-dialog-title');
    const settings = id === 'settings';
    dialog.classList.toggle('account-settings', settings);
    const content = settings
      ? '<div class="zc-modal-field"><label class="zc-modal-label" for="account-name">显示名称</label><input class="zc-modal-control" id="account-name" maxlength="24" autocomplete="off" required aria-describedby="account-name-error" autofocus><p id="account-name-error" class="zc-modal-error" hidden>请输入显示名称</p></div>'+layoutOptions()
      : helpContent;
    const actions = settings
      ? '<button class="zc-modal-button zc-modal-secondary" type="button" data-dismiss>取消</button><button class="zc-modal-button" type="submit">保存</button>'
      : '<button class="zc-modal-button" type="button" data-dismiss>关闭</button>';
    dialog.innerHTML = '<form class="zc-modal-form" novalidate><header class="zc-modal-header"><h2 id="account-dialog-title" class="zc-modal-title">'+title+'</h2>'+
      '<button class="zc-modal-close" type="button" data-dismiss aria-label="关闭'+title+'"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg></button></header>'+
      '<div class="zc-modal-body">'+content+'</div><footer class="zc-modal-footer">'+actions+'</footer></form>';
    const input = dialog.querySelector('#account-name');
    if (input) {
      input.value = nameNode.textContent;
      const submit = dialog.querySelector('[type="submit"]');
      const error = dialog.querySelector('#account-name-error');
      function validate() {
        const blank = !input.value.trim();
        submit.disabled = blank;
        error.hidden = !blank;
        input.setAttribute('aria-invalid', String(blank));
        return !blank;
      }
      input.addEventListener('input', validate);
      dialog.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        if (!validate()) { input.focus(); return; }
        saveName(input.value.trim());
        conversationPosition = dialog.querySelector('[name="conversation-position"]:checked').value;
        applyConversationPosition(conversationPosition);
        try { localStorage.setItem(layoutStorageKey, conversationPosition); } catch {}
        dialog.close();
      });
    }
    dialog.addEventListener('change', event => {
      if (event.target.matches('[name="conversation-position"]')) applyConversationPosition(event.target.value);
    });
    dialog.addEventListener('click', event => {
      if (event.target.closest('[data-dismiss]')) { dialog.close(); return; }
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !event.isComposing && event.keyCode !== 229) {
        event.stopPropagation();
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      if (settings) applyConversationPosition(conversationPosition);
      dialog.remove();
      const handle = document.getElementById('nav-handle');
      const visible = trigger.getClientRects().length && getComputedStyle(trigger).visibility !== 'hidden';
      (visible ? trigger : handle)?.focus({preventScroll:true});
    }, {once:true});
    document.body.append(dialog);
    dialog.showModal();
    if (input) input.select();
  }
  function showSection(id) {
    const entry = options.find(([key]) => key === id);
    if (!entry) return;
    if (isV3) { openSectionDialog(id, entry[1]); return; }
    section = id;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', entry[1]);
    const content = id === 'settings'
      ? '<form><label for="account-name">显示名称</label><input required maxlength="24" id="account-name" autocomplete="off"><div class="account-controls"><button type="button" data-back>取消</button><button type="submit" class="account-primary">保存</button></div></form>'
      : helpContent;
    panel.innerHTML = '<div class="account-panel"><div class="account-heading"><button class="account-back" type="button" data-back aria-label="返回账户菜单">' +
      icon('<path d="m15 5-7 7 7 7"/>') + '</button><h2>' + entry[1] + '</h2></div>' + content + '</div>';
    const input = panel.querySelector('input');
    if (input) { input.value = nameNode.textContent; input.focus(); input.select(); }
    else panel.querySelector('[data-back]').focus({ preventScroll: true });
  }
  trigger.addEventListener('click', () => {
    if (!panel.hidden) { close(true); return; }
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    showMenu();
  });
  panel.addEventListener('click', e => {
    const item = e.target.closest('button');
    if (!item) return;
    if (item.dataset.section) showSection(item.dataset.section);
    else if (item.hasAttribute('data-back')) showMenu(section);
  });
  panel.addEventListener('input', e => {
    if (e.target.id === 'account-name') panel.querySelector('[type="submit"]').disabled = !e.target.value.trim();
  });
  panel.addEventListener('submit', e => {
    e.preventDefault();
    const value = panel.querySelector('input').value.trim();
    if (!value) return;
    saveName(value);
    close(true);
  });
  document.addEventListener('pointerdown', e => {
    if (!trigger.contains(e.target) && !panel.contains(e.target)) close();
  });
  document.addEventListener('focusin', e => {
    if (!panel.contains(e.target) && !trigger.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => {
    if (panel.hidden || e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (section === 'menu') close(true);
      else showMenu(section);
      return;
    }
    if (section !== 'menu' || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const rows = [...panel.querySelectorAll('[role="menuitem"]')];
    let index = rows.indexOf(document.activeElement);
    if (e.key === 'Home') index = 0;
    else if (e.key === 'End') index = rows.length - 1;
    else index = (index + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
    rows[index].focus();
  }, true);
  window.studyAccount = { close };
})();
