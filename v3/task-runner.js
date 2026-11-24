(() => {
  'use strict';

  const minuteMs = 60000;
  const markerPrefix = 'zhice.navlab.task-last-run.v3.';
  const writeLock = 'zhice.navlab.task-execution.v3';
  const lastRun = new Map();
  const chinaTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let timer;

  function minuteAt(time) {
    return Math.floor(time / minuteMs) * minuteMs;
  }
  function beijingClock(at) {
    const parts = Object.fromEntries(chinaTime.formatToParts(at).map(part => [part.type, part.value]));
    return {weekday: weekdayNames.indexOf(parts.weekday) + 1, time: parts.hour + ':' + parts.minute, minute: Number(parts.minute)};
  }
  function due(task, at, clock) {
    if (!task?.enabled || task.scheduleChangedAt > at) return false;
    if (task.frequency === 'hourly') return task.minute === clock.minute;
    if (task.time !== clock.time) return false;
    switch (task.frequency) {
      case 'daily': return true;
      case 'weekdays': return clock.weekday >= 1 && clock.weekday <= 5;
      case 'weekly': return task.weekday === clock.weekday;
      default: return false;
    }
  }

  // Every task writes to the same workspace conversation store, including manual previews.
  function serialize(run) {
    return navigator.locks ? navigator.locks.request(writeLock, run) : Promise.resolve().then(run);
  }
  function seen(id, slot) {
    if (lastRun.get(id) === slot) return true;
    try { return localStorage.getItem(markerPrefix + id) === slot; }
    catch { return false; }
  }
  async function scheduled(id, at, clock) {
    const slot = 'scheduled:' + at;
    if (seen(id, slot)) return;
    await serialize(async () => {
      if (seen(id, slot) || minuteAt(Date.now()) !== at) return;
      const current = window.studyTaskStore.list().find(task => task.id === id);
      if (!due(current, at, clock)) return;
      const error = await window.researchCanvas.runScheduledTask(current, {slot, at});
      if (error) return;
      lastRun.set(id, slot);
      try { localStorage.setItem(markerPrefix + id, slot); }
      catch { /* The conversation also records the slot if browser storage is restricted. */ }
    });
  }
  function check() {
    clearTimeout(timer);
    const now = Date.now();
    const at = minuteAt(now);
    timer = setTimeout(check, at + minuteMs - now);
    const clock = beijingClock(at);
    for (const task of window.studyTaskStore.list()) {
      if (due(task, at, clock)) scheduled(task.id, at, clock).catch(error => console.error('定时任务执行失败', error));
    }
  }
  async function preview(id) {
    try {
      const error = await serialize(() => {
        const task = window.studyTaskStore.list().find(item => item.id === id);
        if (!task) return '任务已不存在';
        const slot = 'manual:' + Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');
        return window.researchCanvas.runScheduledTask(task, {slot, at: Date.now()});
      });
      if (error) return error;
      window.studyNavigation.openTaskChat(id);
      return '';
    } catch { return '任务执行失败，请重试'; }
  }

  window.addEventListener('pageshow', check);
  window.addEventListener('pagehide', () => clearTimeout(timer));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  window.addEventListener('study-tasks-changed', check);
  window.studyTaskRunner = {preview};
  check();
})();
