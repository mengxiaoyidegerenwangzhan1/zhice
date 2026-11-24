(() => {
  'use strict';

  const keyPrefix = 'zhice.navlab.tasks.v3.';
  const changedEvent = 'study-tasks-changed';
  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  const templates = [
    {
      title: '基金市场晨报', summary: '开盘前梳理影响基金市场的重要信息。',
      instruction: '梳理上一交易日主要指数、基金板块表现及隔夜市场要闻，列出今天值得关注的事项。',
      frequency: 'weekdays', time: '08:00'
    }, {
      title: '收盘复盘', summary: '回顾当日市场表现和行业轮动。',
      instruction: '汇总当日主要指数涨跌、行业表现和资金流向，分析对基金持仓的影响。',
      frequency: 'weekdays', time: '16:00'
    }, {
      title: '基金组合周报', summary: '每周跟踪组合收益与持仓变化。',
      instruction: '汇总本周组合收益与回撤，比较各类资产的收益贡献，并列出下周需要跟踪的风险。',
      frequency: 'weekly', time: '17:00', weekday: 5
    }, {
      title: '行业资金流向跟踪', summary: '观察各行业的资金流向与变化趋势。',
      instruction: '整理行业资金净流入与净流出情况，结合近期趋势，列出资金方向发生明显变化的行业。',
      frequency: 'weekdays', time: '16:30'
    }
  ].map(template => ({minute: 0, weekday: 1, projectId: '', ...template}));

  function projects() {
    return window.researchCanvas.projectOptions();
  }

  function list() {
    const rows = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(keyPrefix)) continue;
        try {
          const task = JSON.parse(localStorage.getItem(key));
          if (task?.id && key === keyPrefix + task.id) rows.push(task);
        } catch { /* An unreadable task does not hide the rest of the list. */ }
      }
    } catch { /* Storage may be unavailable in this browser. */ }
    return rows.sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
  }

  function scheduleLabel(task) {
    switch (task.frequency) {
      case 'hourly': return '每小时 ' + String(task.minute).padStart(2, '0') + ' 分';
      case 'daily': return '每天 ' + task.time;
      case 'weekdays': return '工作日 ' + task.time;
      case 'weekly': return '每周' + weekdays[task.weekday - 1] + ' ' + task.time;
      default: return '';
    }
  }

  function validate(task) {
    if (!task.title) return '请输入任务名称';
    if (!task.instruction) return '请输入任务内容';
    if (!['hourly', 'daily', 'weekdays', 'weekly'].includes(task.frequency)) return '请选择执行频率';
    if (task.frequency === 'hourly') {
      if (!Number.isInteger(task.minute) || task.minute < 0 || task.minute > 59) return '请选择有效的分钟';
    } else if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(task.time)) return '请选择有效的执行时间';
    if (task.frequency === 'weekly' && (!Number.isInteger(task.weekday) || task.weekday < 1 || task.weekday > 7)) {
      return '请选择有效的星期';
    }
    if (task.projectId && !projects().some(item => item.id === task.projectId)) return '所选项目已不存在，请重新选择';
    return '';
  }

  function change(id, update) {
    try {
      const key = keyPrefix + id;
      const previous = JSON.parse(localStorage.getItem(key));
      const next = update(previous);
      if (typeof next === 'string') return next;
      if (next) localStorage.setItem(key, JSON.stringify(next));
      else localStorage.removeItem(key);
    } catch { return '保存失败，请重试'; }
    window.dispatchEvent(new Event(changedEvent));
    return '';
  }

  function createOrUpdate(input) {
    const id = input.id || Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');
    return change(id, previous => {
      if (input.id && !previous) return '任务已不存在';
      const now = Date.now();
      const task = {
        id, title: String(input.title ?? '').trim(), instruction: String(input.instruction ?? '').trim(),
        projectId: input.projectId || '', frequency: input.frequency, time: input.time ?? '08:00',
        minute: Number(input.minute ?? 0), weekday: Number(input.weekday ?? 1),
        enabled: previous ? previous.enabled : true, createdAt: previous?.createdAt ?? now,
        scheduleChangedAt: previous?.scheduleChangedAt ?? previous?.createdAt ?? now
      };
      const error = validate(task);
      if (error) return error;
      if (previous && (previous.frequency !== task.frequency ||
        (task.frequency === 'hourly' ? previous.minute !== task.minute : previous.time !== task.time) ||
        (task.frequency === 'weekly' && previous.weekday !== task.weekday))) {
        task.scheduleChangedAt = now;
      }
      return task;
    });
  }

  function toggle(id) {
    return change(id, task => {
      if (!task) return '任务已不存在';
      task.enabled = !task.enabled;
      if (task.enabled) task.scheduleChangedAt = Date.now();
      return task;
    });
  }
  function remove(id) {
    return change(id, task => task ? null : '任务已不存在');
  }
  window.addEventListener('storage', event => {
    if ((event.key === null || event.key.startsWith(keyPrefix)) && event.storageArea === localStorage) {
      window.dispatchEvent(new Event(changedEvent));
    }
  });
  window.studyTaskStore = {list, createOrUpdate, toggle, remove, scheduleLabel, projects, templates};
})();
