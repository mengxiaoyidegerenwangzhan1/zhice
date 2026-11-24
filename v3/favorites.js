(() => {
  'use strict';

  window.createResearchFavorites = function ({directory, defaults, list, catalog, shortcut, rowMenu, openFavorites}) {
    const key = 'zhice.navlab.favorites.v3';
    const categories = new Map();
    for (const [category, groups] of Object.entries(directory)) {
      for (const items of Object.values(groups)) {
        for (const name of items) categories.set(name, category);
      }
    }
    let saved = defaults.slice();
    let canStore = true;
    function read() {
      if (!canStore) return saved;
      let raw;
      try { raw = localStorage.getItem(key); }
      catch { canStore = false; return saved; }
      if (raw === null) return defaults.slice();
      try {
        const values = JSON.parse(raw);
        if (Array.isArray(values)) return [...new Set(values.filter(name => categories.has(name)))];
      } catch { /* Ignore invalid data from an older browser session. */ }
      return defaults.slice();
    }
    saved = read();

    function paintHeart(heart) {
      const name = heart.dataset.favorite;
      const on = saved.includes(name);
      const action = on ? '取消收藏' : '添加到收藏';
      heart.setAttribute('aria-pressed', String(on));
      heart.setAttribute('aria-label', name + ' · ' + action);
      heart.title = action;
      heart.firstChild.src = './icons/nav-heart-' + (on ? 'saved' : 'empty') + '.png';
    }
    function sync(next) {
      if (saved.length === next.length && saved.every((name, i) => name === next[i])) return;
      saved = next;
      const currentList = list.querySelector('.nav-favorites-list');
      if (currentList) currentList.replaceWith(shortcuts());
      catalog.querySelectorAll('.portal-heart').forEach(paintHeart);
    }
    function update(change) {
      const commit = () => {
        const next = change(read());
        if (canStore) {
          try { localStorage.setItem(key, JSON.stringify(next)); }
          catch { canStore = false; }
        }
        sync(next);
      };
      // Serialize edits from separate open tabs against the latest saved order.
      try {
        if (canStore && navigator.locks) {
          return navigator.locks.request(key, commit).catch(error => {
            if (error.name !== 'SecurityError' && error.name !== 'NotAllowedError') throw error;
            commit();
          });
        }
      } catch (error) {
        if (error.name !== 'SecurityError' && error.name !== 'NotAllowedError') throw error;
      }
      commit();
    }
    function toggle(name, on) {
      return update(items => {
        if (on) return items.includes(name) ? items : [...items, name];
        return items.filter(item => item !== name);
      });
    }
    function reorder(name, beforeName) {
      return update(items => {
        if (!items.includes(name) || beforeName === name || (beforeName && !items.includes(beforeName))) return items;
        const next = items.filter(value => value !== name);
        next.splice(beforeName ? next.indexOf(beforeName) : next.length, 0, name);
        return next;
      });
    }
    function catalogRow(button) {
      const name = button.dataset.value;
      const wrap = document.createElement('div');
      wrap.className = 'portal-favorite-row';
      const heart = document.createElement('button');
      heart.type = 'button';
      heart.className = 'portal-heart';
      heart.dataset.favorite = name;
      const icon = document.createElement('img');
      icon.alt = '';
      icon.width = icon.height = 12;
      heart.append(icon);
      paintHeart(heart);
      heart.addEventListener('click', () => toggle(name, heart.getAttribute('aria-pressed') !== 'true'));
      wrap.append(button, heart);
      return wrap;
    }
    function attachContextMenu(row, link, name, remove) {
      let opener = link;
      const menu = rowMenu(name + ' · 收藏操作', [['取消收藏', remove]], () => opener.focus({preventScroll:true}));
      row.append(menu);
      row.addEventListener('contextmenu', event => {
        if (menu.contains(event.target)) return;
        event.preventDefault();
        opener = event.target.closest('button') || link;
        const anchor = opener.getBoundingClientRect();
        const hasPosition = Boolean(event.clientX || event.clientY);
        const x = hasPosition ? event.clientX : anchor.left;
        const y = hasPosition ? event.clientY : anchor.bottom;
        menu.showPopover();
        const bounds = menu.getBoundingClientRect();
        menu.style.left = Math.max(4, Math.min(x, document.documentElement.clientWidth - bounds.width - 4)) + 'px';
        menu.style.top = Math.max(4, Math.min(y, window.innerHeight - bounds.height - 4)) + 'px';
      });
    }
    function shortcuts() {
      const box = document.createElement('div');
      box.className = 'nav-children nav-favorites-list';
      box.setAttribute('role', 'group');
      box.setAttribute('aria-label', '我的收藏');
      if (!saved.length) {
        const add = document.createElement('button');
        add.type = 'button';
        add.className = 'nav-add-favorite';
        add.textContent = '＋ 添加收藏';
        add.addEventListener('click', openFavorites);
        box.append(add);
        return box;
      }
      for (const name of saved) {
        const row = document.createElement('div');
        row.className = 'nav-favorite-row';
        row.dataset.favoriteName = name;
        const remove = async () => {
          const position = saved.indexOf(name);
          await toggle(name, false);
          const buttons = list.querySelectorAll('.nav-favorite-row > .nav-leaf');
          (buttons[Math.min(position, buttons.length - 1)] || list.querySelector('.nav-add-favorite'))?.focus({preventScroll:true});
        };
        const link = shortcut(name, categories.get(name));
        row.append(link);
        if (saved.length > 1) row.append(window.favoriteReorder.handle(name));
        attachContextMenu(row, link, name, remove);
        box.append(row);
      }
      return box;
    }
    window.favoriteReorder.bind(list, reorder);
    window.addEventListener('storage', event => {
      if (event.key === key || event.key === null) sync(read());
    });
    return {shortcuts, catalogRow};
  };
})();
