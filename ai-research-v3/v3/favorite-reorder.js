(() => {
  'use strict';

  const rowSelector = '.nav-favorite-row[data-favorite-name]';
  const gripSelector = '.nav-favorite-grip';

  function handle(name) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-favorite-grip';
    button.setAttribute('aria-label', '调整' + name + '的顺序');
    button.title = '拖动排序';
    const icon = document.createElement('img');
    icon.src = './icons/nav-favorite-grip.png';
    icon.alt = '';
    icon.width = icon.height = 12;
    icon.draggable = false;
    button.append(icon);
    return button;
  }

  function bind(scroller, moveBefore) {
    let drag = null;
    let frame = 0;

    function rowsIn(group) {
      return [...group.querySelectorAll(rowSelector)];
    }

    function clearMarker() {
      if (drag.marker) delete drag.marker.dataset.dropEdge;
      drag.marker = null;
    }

    function showPosition() {
      clearMarker();
      if (!drag.group.isConnected) return;
      const groupBox = drag.group.getBoundingClientRect();
      const scrollBox = scroller.getBoundingClientRect();
      const { x, y } = drag;
      if (x < groupBox.left || x > groupBox.right ||
          y < Math.max(groupBox.top - 2, scrollBox.top) ||
          y > Math.min(groupBox.bottom + 2, scrollBox.bottom)) return;
      const rows = rowsIn(drag.group);
      const others = rows.filter(row => row !== drag.row);
      if (!others.length) return;
      const next = others.find(row => {
        const bounds = row.getBoundingClientRect();
        return y < bounds.top + bounds.height / 2;
      });
      const currentNext = rows[rows.indexOf(drag.row) + 1];
      if (next === currentNext) return;
      drag.marker = next || others[others.length - 1];
      drag.marker.dataset.dropEdge = next ? 'before' : 'after';
    }

    function scrollAtEdge() {
      frame = 0;
      if (!drag || !drag.active) return;
      if (!drag.group.isConnected) { finish(); return; }
      const box = scroller.getBoundingClientRect();
      const group = drag.group.getBoundingClientRect();
      const { x, y } = drag;
      if (x < group.left || x > group.right || y < box.top || y > box.bottom) return;
      const edge = 30;
      let delta = 0;
      if (group.top < box.top && y < box.top + edge) delta = (y - box.top - edge) / 3;
      if (group.bottom > box.bottom && y > box.bottom - edge) delta = (y - box.bottom + edge) / 3;
      if (!delta) return;
      const previous = scroller.scrollTop;
      scroller.scrollTop += Math.sign(delta) * Math.ceil(Math.abs(delta));
      if (scroller.scrollTop !== previous) {
        showPosition();
        frame = requestAnimationFrame(scrollAtEdge);
      }
    }

    function finish() {
      if (!drag) return;
      const { group, row, pointerId } = drag;
      cancelAnimationFrame(frame);
      frame = 0;
      clearMarker();
      group.classList.remove('is-reordering');
      row.classList.remove('is-dragged');
      drag = null;
      if (scroller.hasPointerCapture(pointerId)) scroller.releasePointerCapture(pointerId);
    }

    scroller.addEventListener('pointerdown', event => {
      const grip = event.target.closest(gripSelector);
      if (!grip || drag || !event.isPrimary || event.button !== 0) return;
      const row = grip.closest(rowSelector);
      const group = row.closest('.nav-favorites-list');
      if (rowsIn(group).length < 2) return;
      drag = { row, group, pointerId: event.pointerId, x: event.clientX, y: event.clientY,
        startX: event.clientX, startY: event.clientY, active: false, marker: null };
      event.preventDefault();
      scroller.setPointerCapture(event.pointerId);
    });
    scroller.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag.x = event.clientX;
      drag.y = event.clientY;
      if (!drag.active) {
        if (Math.hypot(drag.x - drag.startX, drag.y - drag.startY) < 4) return;
        drag.active = true;
        drag.group.classList.add('is-reordering');
        drag.row.classList.add('is-dragged');
      }
      showPosition();
      if (!frame) frame = requestAnimationFrame(scrollAtEdge);
    });
    scroller.addEventListener('pointerup', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag.x = event.clientX;
      drag.y = event.clientY;
      if (drag.active) showPosition();
      const { marker, row } = drag;
      const beforeName = marker?.dataset.dropEdge === 'before' ? marker.dataset.favoriteName : null;
      finish();
      if (marker) moveBefore(row.dataset.favoriteName, beforeName);
    });
    for (const type of ['pointercancel', 'lostpointercapture']) {
      scroller.addEventListener(type, event => {
        if (drag?.pointerId === event.pointerId) finish();
      });
    }
    window.addEventListener('blur', finish);
  }

  window.favoriteReorder = {handle, bind};
})();
