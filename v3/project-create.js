(() => {
  'use strict';

  function openNavNameDialog(opener, options) {
    if (document.querySelector('.nav-project-dialog[open]')) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'nav-project-dialog zc-modal';
    dialog.setAttribute('aria-labelledby', 'nav-project-dialog-title');
    const deleting = Boolean(options.confirmation);
    const field = deleting
      ? '<p id="nav-project-dialog-confirmation"></p>'
      : `<label class="zc-modal-label" for="nav-project-dialog-name">项目名称</label>
         <input class="zc-modal-control" id="nav-project-dialog-name" type="text" maxlength="40" autocomplete="off"
           placeholder="输入项目名称" aria-describedby="nav-project-dialog-error" required autofocus>`;
    dialog.innerHTML = `
      <form class="zc-modal-form" novalidate>
        <header class="zc-modal-header">
          <h2 class="zc-modal-title" id="nav-project-dialog-title"></h2>
          <button class="zc-modal-close" type="button" aria-label="关闭">
            <svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg>
          </button>
        </header>
        <div class="zc-modal-body">
          <div class="zc-modal-field">
            ${field}
            <p class="zc-modal-error" id="nav-project-dialog-error" role="alert" hidden></p>
          </div>
        </div>
        <footer class="zc-modal-footer">
          <button type="button" class="zc-modal-button zc-modal-secondary">取消</button>
          <button type="submit" class="zc-modal-button"></button>
        </footer>
      </form>`;
    dialog.querySelector('h2').textContent = options.title;
    const form = dialog.querySelector('form');
    const input = form.querySelector('input');
    const error = form.querySelector('[role="alert"]');
    const submit = form.querySelector('[type="submit"]');
    const close = form.querySelector('.zc-modal-close');
    const cancel = form.querySelector('.zc-modal-secondary');
    close.setAttribute('aria-label', '关闭'+options.title);
    submit.textContent = options.submitLabel;

    if (deleting) {
      const description = form.querySelector('#nav-project-dialog-confirmation');
      description.textContent = options.confirmation;
      dialog.setAttribute('aria-describedby', description.id);
      dialog.setAttribute('role', 'alertdialog');
      submit.classList.add('zc-modal-danger');
      cancel.autofocus = true;
    } else {
      if (options.fieldLabel) {
        form.querySelector('label').textContent = options.fieldLabel;
        input.placeholder = '输入'+options.fieldLabel;
      }
      if (options.maxLength) input.maxLength = options.maxLength;
      input.value = options.name || '';
      input.addEventListener('input', () => {
        error.hidden = true;
        input.removeAttribute('aria-invalid');
      });
    }

    let savedName = '';
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = input ? input.value.trim() : options.name;
      const message = options.save(name);
      if (message) {
        error.textContent = message;
        error.hidden = false;
        if (input) {
          input.setAttribute('aria-invalid', 'true');
          input.focus();
        }
        return;
      }
      savedName = name;
      dialog.close();
    });
    cancel.addEventListener('click', () => dialog.close());
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      dialog.remove();
      if (savedName) {
        options.onSaved?.(savedName);
      } else if (opener?.isConnected) {
        // Focusing the row makes its hover-only action buttons visible again.
        opener.closest('.nav-action-row,.nav-chat-row')?.querySelector('.nav-row')?.focus({preventScroll:true});
        opener.focus({preventScroll:true});
      }
    }, {once:true});
    document.body.append(dialog);
    dialog.showModal();
    if (input && options.name) input.select();
  }

  window.openNavNameDialog = openNavNameDialog;
  window.openNavProjectDialog = (opener, onCreated) => openNavNameDialog(opener, {
    title:'新增项目', submitLabel:'创建',
    save:name => window.researchCanvas.createSidebarProject(name), onSaved:onCreated
  });
  window.openNavProjectSettings = (opener, oldName, onRenamed) => openNavNameDialog(opener, {
    title:'项目设置', submitLabel:'保存', name:oldName,
    save:name => window.researchCanvas.renameProject(oldName,name), onSaved:onRenamed
  });
  window.openNavProjectDelete = (opener, name, onDeleted) => openNavNameDialog(opener, {
    title:'删除项目', submitLabel:'删除项目', name,
    confirmation:'确定删除「'+name+'」吗？该项目及其中的所有聊天记录将被一并删除。',
    save:() => window.researchCanvas.deleteProject(name), onSaved:() => onDeleted?.()
  });
})();
