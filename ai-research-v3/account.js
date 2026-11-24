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
  function readSavedConversationPosition() {
    try {
      const saved = localStorage.getItem(layoutStorageKey);
      return saved === 'right' || saved === 'center' ? saved : 'center';
    } catch {
      return conversationPosition;
    }
  }
  function saveConversationPosition(value) {
    conversationPosition = value === 'right' ? 'right' : 'center';
    try { localStorage.setItem(layoutStorageKey, conversationPosition); } catch {}
    applyConversationPosition(conversationPosition);
  }
  function restoreSavedConversationPosition() {
    if (!isV3) return;
    const previous = conversationPosition;
    conversationPosition = readSavedConversationPosition();
    const settings = document.querySelector('dialog.account-settings[open]');
    const selection = settings?.querySelector('[name="conversation-position"]:checked');
    // Keep a user's unsaved preview intact if another browser tab changes its settings.
    if (selection && selection.value !== previous) return;
    if (settings) {
      const savedRadio = settings.querySelector('[name="conversation-position"][value="'+conversationPosition+'"]');
      if (savedRadio) savedRadio.checked = true;
    }
    applyConversationPosition(conversationPosition);
  }
  if (isV3) {
    restoreSavedConversationPosition();
    window.addEventListener('pageshow', restoreSavedConversationPosition);
    window.addEventListener('storage', event => {
      if (event.key === layoutStorageKey || event.key === null) restoreSavedConversationPosition();
    });
  }
  const titleStorageKey = 'zhice.nav-profile-title.'+(document.documentElement.dataset.prototype || 'v1');
  const titleNode = isV3 ? document.createElement('small') : null;
  if (titleNode) {
    titleNode.className = 'account-profile-title';
    titleNode.hidden = true;
    nameNode.after(titleNode);
  }
  const avatarNode = trigger.querySelector('.nav-avatar');
  const defaultAvatar = avatarNode?.textContent || '';
  const defaultName = nameNode.textContent;
  let section = 'menu';
  function setName(value) {
    nameNode.textContent = value;
    const profileTitle = titleNode?.textContent || '';
    const description = value + (profileTitle ? '，'+profileTitle : '');
    trigger.setAttribute('aria-label', description + '，账户菜单');
    trigger.title = description + ' · 账户菜单';
    if (isV3 && avatarNode) avatarNode.textContent = value === defaultName ? defaultAvatar : (Array.from(value.trim())[0] || defaultAvatar);
  }
  let name = nameNode.textContent;
  try { name = localStorage.getItem(storageKey) || name; } catch {}
  if (titleNode) {
    try { titleNode.textContent = localStorage.getItem(titleStorageKey) || ''; } catch {}
    titleNode.hidden = !titleNode.textContent;
  }
  setName(name);
  function saveProfileTitle(value) {
    if (!titleNode) return;
    titleNode.textContent = value;
    titleNode.hidden = !value;
    try { localStorage.setItem(titleStorageKey, value); } catch {}
    setName(nameNode.textContent);
  }
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
      '<h3 id="account-layout-title">调整会话区、内容区展示顺序</h3><p id="account-layout-hint">选择会话区和内容区的排列方式，保存后将沿用上次选择。</p>'+
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
    if (settings) restoreSavedConversationPosition();
    dialog.classList.toggle('account-settings', settings);
    const dismiss = '<button class="zc-modal-close" type="button" data-dismiss aria-label="关闭'+title+'"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg></button>';
    if (settings) {
      const personIcon = icon('<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/>');
      const preferencesIcon = icon('<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="#f5f5f7"/><circle cx="16" cy="12" r="2" fill="#f5f5f7"/><circle cx="10" cy="18" r="2" fill="#f5f5f7"/>');
      dialog.innerHTML = '<form class="zc-modal-form" novalidate>'+
        '<aside class="account-settings-nav"><h2 id="account-dialog-title" class="zc-modal-title">设置</h2>'+
        '<div class="account-settings-tabs" role="tablist" aria-label="设置分类">'+
        '<button type="button" id="account-tab-profile" role="tab" data-settings-tab="profile" aria-selected="true" aria-controls="account-pane-profile">'+personIcon+'<span>账号</span></button>'+
        '<button type="button" id="account-tab-preferences" role="tab" data-settings-tab="preferences" aria-selected="false" aria-controls="account-pane-preferences" tabindex="-1">'+preferencesIcon+'<span>偏好</span></button></div></aside>'+
        '<div class="account-settings-main"><header class="account-settings-head"><h3>账号</h3>'+dismiss+'</header>'+
        '<div class="zc-modal-body account-settings-body">'+
        '<section class="account-settings-pane" id="account-pane-profile" role="tabpanel" aria-labelledby="account-tab-profile">'+
        '<div class="zc-modal-field"><label class="zc-modal-label" for="account-name">姓名</label><input class="zc-modal-control" id="account-name" maxlength="24" autocomplete="off" required aria-describedby="account-name-error" placeholder="请输入姓名"><p id="account-name-error" class="zc-modal-error" hidden>请输入姓名</p></div>'+
        '<div class="zc-modal-field"><label class="zc-modal-label" for="account-profile-title">头衔</label><input class="zc-modal-control" id="account-profile-title" maxlength="24" autocomplete="off" placeholder="例如：基金研究员（选填）"></div>'+
        '</section><section class="account-settings-pane" id="account-pane-preferences" role="tabpanel" aria-labelledby="account-tab-preferences" hidden>'+layoutOptions()+'</section></div>'+
        '<footer class="zc-modal-footer"><button class="zc-modal-button zc-modal-secondary" type="button" data-dismiss>取消</button><button class="zc-modal-button" type="submit">保存</button></footer></div></form>';
      const input = dialog.querySelector('#account-name');
      const profileTitle = dialog.querySelector('#account-profile-title');
      const error = dialog.querySelector('#account-name-error');
      const tabs = [...dialog.querySelectorAll('[data-settings-tab]')];
      input.value = nameNode.textContent;
      profileTitle.value = titleNode?.textContent || '';
      function selectTab(key, focus=false) {
        tabs.forEach(tab => {
          const selected = tab.dataset.settingsTab === key;
          tab.setAttribute('aria-selected', String(selected));
          tab.tabIndex = selected ? 0 : -1;
          dialog.querySelector('#account-pane-'+tab.dataset.settingsTab).hidden = !selected;
          if (selected && focus) tab.focus({preventScroll:true});
        });
        dialog.querySelector('.account-settings-head h3').textContent = key === 'profile' ? '账号' : '偏好';
      }
      tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab.dataset.settingsTab)));
      dialog.querySelector('[role="tablist"]').addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
        const index = tabs.indexOf(document.activeElement);
        if (index < 0) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (index + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
        selectTab(tabs[next].dataset.settingsTab, true);
      });
      function validate() {
        const blank = !input.value.trim();
        error.hidden = !blank;
        input.setAttribute('aria-invalid', String(blank));
        return !blank;
      }
      input.addEventListener('input', validate);
      dialog.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        if (!validate()) { selectTab('profile'); input.focus(); return; }
        saveName(input.value.trim());
        saveProfileTitle(profileTitle.value.trim());
        saveConversationPosition(dialog.querySelector('[name="conversation-position"]:checked').value);
        dialog.close();
      });
    } else {
      dialog.innerHTML = '<form class="zc-modal-form" novalidate><header class="zc-modal-header"><h2 id="account-dialog-title" class="zc-modal-title">'+title+'</h2>'+dismiss+'</header>'+
        '<div class="zc-modal-body">'+helpContent+'</div><footer class="zc-modal-footer"><button class="zc-modal-button" type="button" data-dismiss>关闭</button></footer></form>';
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
    if (settings) dialog.querySelector('[aria-selected="true"]').focus({preventScroll:true});
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
