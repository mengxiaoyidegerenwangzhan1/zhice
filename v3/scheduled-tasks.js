(() => {
  'use strict';

  let activeView;
  let draftInstruction = '';
  const store = () => window.studyTaskStore;

  function element(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(cls, text, label) {
    const control = element('button', cls, text);
    control.type = 'button';
    if (label) control.setAttribute('aria-label', label);
    return control;
  }
  function edit(task, opener, afterSave) {
    window.studyTaskDialog.open({
      task,
      opener,
      projects: store().projects(),
      onSave(fields) {
        const error = store().createOrUpdate(task.id ? {...fields, id:task.id} : fields);
        if (!error) afterSave?.();
        return error;
      }
    });
  }
  function create(opener) {
    edit({}, opener);
  }
  function taskMenu(task) {
    const trigger = button('st-action st-more','···',task.title+' · 更多操作');
    trigger.setAttribute('aria-haspopup','menu');
    trigger.dataset.taskMenu = task.id;
    const menu = element('div','st-menu');
    menu.popover = 'auto';
    menu.setAttribute('role','menu');
    menu.setAttribute('aria-label',task.title+'的操作');
    trigger.popoverTargetElement = menu;
    const choices = [
      ['编辑',() => edit(task,trigger)],
      ['试运行',async () => {
        try {
          const error = await window.studyTaskRunner.preview(task.id);
          if (error) showError(error);
        } catch { showError('试运行未完成，请重试。'); }
      }],
      [task.enabled ? '暂停' : '恢复',() => {
        const error = store().toggle(task.id);
        if (error) showError(error);
        else {
          const next = [...activeView.groups.querySelectorAll('[data-task-menu]')].find(item => item.dataset.taskMenu === task.id);
          next?.focus({preventScroll:true});
        }
      }],
      ['删除',() => window.openNavNameDialog(trigger, {
        title:'删除定时任务', submitLabel:'删除', name:task.title,
        confirmation:'确定删除「'+task.title+'」吗？已生成的对话会保留。',
        save:() => store().remove(task.id),
        onSaved:() => activeView?.field.focus({preventScroll:true})
      })]
    ];
    for (const [label, action] of choices) {
      const item = button('st-menu-item',label);
      item.setAttribute('role','menuitem');
      item.addEventListener('click', () => {
        menu.hidePopover();
        action();
      });
      menu.append(item);
    }
    menu.firstElementChild.autofocus = true;
    menu.addEventListener('keydown',event => {
      const items = [...menu.children];
      const index = items.indexOf(event.target);
      const next = {ArrowUp:(index+items.length-1)%items.length,ArrowDown:(index+1)%items.length,Home:0,End:items.length-1};
      if (!Object.hasOwn(next,event.key)) return;
      event.preventDefault();
      items[next[event.key]].focus();
    });
    function position(width,height) {
      const rect = trigger.getBoundingClientRect();
      menu.style.left = Math.max(4,Math.min(rect.right-width,document.documentElement.clientWidth-width-4))+'px';
      menu.style.top = (rect.bottom+4+height <= innerHeight ? rect.bottom+4 : Math.max(4,rect.top-height-4))+'px';
    }
    menu.addEventListener('beforetoggle',event => { if(event.newState==='open') position(120,146); });
    menu.addEventListener('toggle',event => { if(event.newState==='open') position(menu.offsetWidth,menu.offsetHeight); });
    return [trigger,menu];
  }
  function taskCard(task, projects) {
    const card = element('article', 'st-card');
    const main = button('st-card-main', undefined, '编辑定时任务：'+task.title);
    const name = element('strong', 'st-task-name', task.title);
    const instruction = element('span', 'st-task-copy', task.instruction);
    main.append(name, instruction);
    main.addEventListener('click', () => edit(task, main));
    const footer = element('div', 'st-card-footer');
    const schedule = element('span', 'st-schedule', store().scheduleLabel(task));
    const project = projects.get(task.projectId);
    if (project) schedule.append(document.createTextNode(' · '+project));
    schedule.title = schedule.textContent;
    const actions = element('div', 'st-card-actions');
    if (window.researchCanvas.taskChatTitle(task.id)) {
      const chat = button('st-action st-view-chat', '查看对话', '查看任务对话：'+task.title);
      chat.addEventListener('click', () => window.studyNavigation.openTaskChat(task.id));
      actions.append(chat);
    }
    actions.append(...taskMenu(task));
    footer.append(schedule, actions);
    card.append(main, footer);
    return card;
  }
  function section(title) {
    const block = element('section','st-section');
    block.setAttribute('aria-label', title);
    block.append(element('h2','st-heading',title));
    return block;
  }
  function recommendations() {
    const block = section('为你推荐');
    const grid = element('div', 'st-grid');
    for (const item of store().templates) {
      const add = button('st-template', undefined, '使用模板：'+item.title);
      const copy = element('span','st-template-copy');
      copy.append(element('strong','st-task-name',item.title), element('span','st-template-desc',item.summary || item.instruction));
      const plus = element('span','st-template-plus','＋');
      plus.setAttribute('aria-hidden','true');
      add.append(copy,plus);
      add.addEventListener('click', () => edit(item, add));
      grid.append(add);
    }
    block.append(grid);
    return block;
  }
  function showError(message) {
    if (!activeView?.groups.isConnected) return;
    activeView.error.textContent = message;
    activeView.error.hidden = !message;
  }
  function refresh() {
    if (!activeView?.groups.isConnected) return;
    const current = store().list();
    const projects = new Map(store().projects().map(project => [project.id, project.name]));
    const content = document.createDocumentFragment();
    if (!current.length) {
      const empty = section('我的任务');
      empty.append(element('p','st-empty','暂无定时任务'));
      content.append(empty);
    }
    for (const [enabled, heading] of [[true,'已启用'],[false,'已暂停']]) {
      const tasks = current.filter(task => task.enabled === enabled);
      if (!tasks.length) continue;
      const block = section(heading);
      const grid = element('div','st-grid');
      for (const task of tasks) grid.append(taskCard(task, projects));
      block.append(grid);
      content.append(block);
    }
    activeView.groups.replaceChildren(content);
    showError('');
  }
  function mount(container) {
    const page = element('div','st-page');
    const scroll = element('div','st-scroll');
    scroll.addEventListener('scroll', () => scroll.querySelector('.st-menu:popover-open')?.hidePopover(), {passive:true});
    const groups = element('div', 'st-groups');
    const error = element('p','st-error');
    error.hidden = true;
    error.setAttribute('role','alert');
    const content = element('div','st-content');
    content.append(groups, error, recommendations());
    scroll.append(content);

    const footer = element('div','st-dock');
    const composer = element('form','st-composer');
    composer.setAttribute('aria-label','快速创建定时任务');
    const field = element('textarea','st-instruction');
    field.rows = 2;
    field.placeholder = '描述你想定时执行的投研任务…';
    field.setAttribute('aria-label','定时任务描述');
    field.value = draftInstruction;
    const submit = button('st-continue','继续设置');
    submit.type = 'submit';
    submit.disabled = !field.value.trim();
    field.addEventListener('input', () => {
      draftInstruction = field.value;
      submit.disabled = !field.value.trim();
    });
    composer.addEventListener('submit', event => {
      event.preventDefault();
      const instruction = field.value.trim();
      if (!instruction) return;
      edit({instruction}, field, () => {
        draftInstruction = '';
        field.value = '';
        submit.disabled = true;
      });
    });
    composer.append(field,submit);
    footer.append(composer);
    page.append(scroll,footer);
    container.replaceChildren(page);
    activeView = {groups, error, field};
    refresh();
  }
  window.addEventListener('study-tasks-changed',refresh);
  window.addEventListener('study-projects-changed',refresh);
  window.studyScheduledTasks = {mount,create};
})();
