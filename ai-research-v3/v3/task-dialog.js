(() => {
  'use strict';

  function open({task = {}, projects = [], onSave, opener = document.activeElement}) {
    if (document.querySelector('.scheduled-task-dialog[open]')) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'zc-modal scheduled-task-dialog';
    dialog.setAttribute('aria-labelledby', 'scheduled-task-title');
    dialog.innerHTML = `
      <form class="zc-modal-form">
        <header class="zc-modal-header">
          <h2 id="scheduled-task-title" class="zc-modal-title"></h2>
          <button type="button" class="zc-modal-close" aria-label="关闭弹窗">
            <svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg>
          </button>
        </header>
        <div class="zc-modal-body">
          <label>
            <span class="zc-modal-label">任务名称</span>
            <input class="zc-modal-control" name="title" placeholder="例如：每日基金市场晨报" autocomplete="off" required autofocus>
          </label>
          <label>
            <span class="zc-modal-label">任务内容</span>
            <textarea class="zc-modal-control zc-modal-textarea" name="instruction" placeholder="描述你希望投研助手定期做什么" required></textarea>
          </label>
          <label>
            <span class="zc-modal-label">所属项目<span class="scheduled-task-optional">（选填）</span></span>
            <select class="zc-modal-control" name="projectId"><option value="">不关联项目</option></select>
          </label>
          <fieldset class="scheduled-task-trigger">
            <legend class="zc-modal-label">触发时间</legend>
            <div class="scheduled-task-controls">
              <select class="zc-modal-control" name="frequency" aria-label="重复频率">
                <option value="hourly">每小时</option><option value="daily">每天</option>
                <option value="weekdays">每个工作日（周一至周五）</option><option value="weekly">每周</option>
              </select>
              <select class="zc-modal-control" name="weekday" aria-label="星期" hidden>
                <option value="1">周一</option><option value="2">周二</option><option value="3">周三</option>
                <option value="4">周四</option><option value="5">周五</option><option value="6">周六</option><option value="7">周日</option>
              </select>
              <input class="zc-modal-control" type="time" name="time" aria-label="执行时间" step="60" required>
              <label class="scheduled-task-minute" hidden>
                <span>第</span><input class="zc-modal-control" type="number" name="minute" aria-label="每小时的第几分钟" min="0" max="59" step="1" required><span>分钟</span>
              </label>
            </div>
            <p class="scheduled-task-note">北京时间，原型在工作台打开时触发。</p>
          </fieldset>
          <p class="zc-modal-error" role="alert" hidden></p>
        </div>
        <footer class="zc-modal-footer">
          <button type="button" class="zc-modal-button zc-modal-secondary">取消</button>
          <button type="submit" class="zc-modal-button">保存</button>
        </footer>
      </form>`;

    dialog.querySelector('h2').textContent = task.id ? '编辑定时任务' : '新建定时任务';
    const form = dialog.querySelector('form');
    const {title, instruction, projectId, frequency, weekday, time, minute} = form.elements;
    const minuteGroup = minute.closest('label');
    const save = form.querySelector('[type="submit"]');
    const error = form.querySelector('[role="alert"]');
    title.value = task.title || '';
    instruction.value = task.instruction || '';
    for (const project of projects) projectId.add(new Option(project.name, project.id));
    if (projects.some(project => project.id === task.projectId)) projectId.value = task.projectId;
    frequency.value = task.frequency || 'daily';
    if (!frequency.value) frequency.value = 'daily';
    weekday.value = String(task.weekday || 1);
    if (!weekday.value) weekday.value = '1';
    minute.value = String(task.minute ?? 0);
    time.value = task.time || '08:00';

    function syncFields() {
      const hourly = frequency.value === 'hourly';
      const weekly = frequency.value === 'weekly';
      minuteGroup.hidden = !hourly;
      minute.disabled = !hourly;
      time.hidden = hourly;
      time.disabled = hourly;
      weekday.hidden = !weekly;
      weekday.disabled = !weekly;
      save.disabled = !title.value.trim() || !instruction.value.trim() || !form.checkValidity();
    }
    function changed() {
      error.hidden = true;
      syncFields();
    }
    form.addEventListener('input', changed);
    form.addEventListener('change', changed);
    form.addEventListener('submit', event => {
      event.preventDefault();
      syncFields();
      if (save.disabled) return;
      const message = onSave({
        title:title.value.trim(), instruction:instruction.value.trim(), projectId:projectId.value,
        frequency:frequency.value, weekday:Number(weekday.value),
        time:time.value || '08:00', minute:minute.disabled ? 0 : Number(minute.value)
      });
      if (message) {
        error.textContent = message;
        error.hidden = false;
        return;
      }
      dialog.close();
    });
    dialog.querySelector('.zc-modal-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.zc-modal-secondary').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      dialog.remove();
      const previous = opener?.isConnected ? opener :
        [...document.querySelectorAll('[data-task-menu]')].find(item => item.dataset.taskMenu === task.id);
      (previous || document.getElementById('work'))?.focus({preventScroll:true});
    }, {once:true});
    syncFields();
    document.body.append(dialog);
    dialog.showModal();
  }

  window.studyTaskDialog = {open};
})();
