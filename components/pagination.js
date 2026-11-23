// Standalone pagination component from the Zhice design library.
const pageSizes = [5, 10, 20, 50];

export function mountPagination(widget) {
  if (!widget || widget.dataset.pgMounted) return () => {};

  const controller = new AbortController();
  const { signal } = controller;
  widget.dataset.pgMounted = 'true';

  const module = widget.dataset.pgKind === 'module';
  const total = Math.max(0, Number(widget.dataset.pgTotal) || 0);
  const slotSize = module ? 20 : 28;
  let size = Number(widget.dataset.pgSize) || 5;
  let pages = Math.max(1, Number(widget.dataset.pgPageCount) || Math.ceil(total / size));
  let page = Math.max(1, Math.min(pages, Number(widget.dataset.pgCurrent) || 1));
  let open = false;
  let lastJump = '';
  let rendering = false;

  function arrow(direction) {
    const paths = module
      ? { prev: 'M11.6998 13.4L8.2998 10L11.6998 6.60001', next: 'M8.3002 13.4L11.7002 10L8.3002 6.60001' }
      : { prev: 'M16.0479 18.0957L11.9521 14L16.0479 9.9043', next: 'M11.9521 18.0957L16.0479 14L11.9521 9.9043' };
    return `<svg aria-hidden="true" width="${slotSize}" height="${slotSize}" viewBox="0 0 ${slotSize} ${slotSize}" fill="none"><path d="${paths[direction]}" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  const downPath = module ? 'M1.6 3.3L5 6.7L8.4 3.3' : 'M0.904297 2.95215L5 7.04785L9.0957 2.95215';
  const down = `<svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="${downPath}" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const dotCenter = slotSize / 2;
  const dots = `<svg aria-hidden="true" width="${slotSize}" height="${slotSize}" viewBox="0 0 ${slotSize} ${slotSize}">${[dotCenter - 3.164, dotCenter, dotCenter + 3.164].map(x => `<ellipse cx="${x}" cy="${dotCenter}" rx=".732" ry=".738" fill="currentColor"/>`).join('')}</svg>`;

  function slots() {
    if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, 'next', pages];
    if (page >= pages - 3) return [1, 'prev', pages - 4, pages - 3, pages - 2, pages - 1, pages];
    return [1, 'prev', page - 1, page, page + 1, 'next', pages];
  }

  function render(focus) {
    rendering = true;
    try {
      widget.dataset.pgCurrent = page;
      widget.dataset.pgSize = size;
      widget.dataset.pgPageCount = pages;
      const pageButtons = slots().map(value => typeof value === 'number'
        ? `<button type="button" class="zc-pg-slot" data-pg-number="${value}" aria-label="第${value}页"${value === page ? ' aria-current="page"' : ''}>${value}</button>`
        : `<button type="button" class="zc-pg-slot" data-pg-skip="${value}" aria-label="${value === 'prev' ? '向前' : '向后'}跳过5页">${dots}</button>`).join('');
      const sizeOptions = pageSizes.map(value => `<button type="button" class="zc-pg-option" role="option" data-pg-size-option="${value}" aria-selected="${value === size}">${value}条/页</button>`).join('');
      widget.innerHTML = `
        <span class="zc-pg-count"><span>共</span><strong>${total}</strong><span>条</span></span>
        <div class="zc-pg-controls">
          <div class="zc-pg-pages">
            <button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="prev" aria-label="上一页"${page === 1 ? ' disabled' : ''}>${arrow('prev')}</button>
            ${pageButtons}
            <button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="next" aria-label="下一页"${page === pages ? ' disabled' : ''}>${arrow('next')}</button>
          </div>
          <div class="zc-pg-size">
            <button type="button" class="zc-pg-size-trigger" aria-label="每页条数" aria-haspopup="listbox" aria-expanded="${open}"><span class="zc-pg-size-label">${size}条/页</span>${down}</button>
            <div class="zc-pg-menu" role="listbox" aria-label="每页条数选项"${open ? '' : ' hidden'}>${sizeOptions}</div>
          </div>
          ${module ? '' : `<label class="zc-pg-jump"><span>跳至</span><span class="zc-pg-jump-field"><input aria-label="跳至页码" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="9" autocomplete="off" value="${lastJump}"><span>页</span></span></label>`}
        </div>
        <span class="zc-pg-live-status" role="status" aria-live="polite">第${page}页，共${pages}页，每页${size}条</span>`;

      if (open) placeMenu();
      if (focus) widget.querySelector(focus)?.focus({ preventScroll: true });
    } finally {
      rendering = false;
    }
  }

  function placeMenu() {
    if (!open) return;
    const trigger = widget.querySelector('.zc-pg-size-trigger');
    const menu = widget.querySelector('.zc-pg-menu');
    const box = trigger.getBoundingClientRect();
    if (!box.width || box.bottom < 0 || box.top > window.innerHeight) {
      close(false);
      return;
    }
    menu.style.minWidth = `${box.width}px`;
    const bounds = menu.getBoundingClientRect();
    const left = Math.max(8, Math.min(box.right - bounds.width, window.innerWidth - bounds.width - 8));
    let top = box.bottom + 6;
    if (top + bounds.height > window.innerHeight - 8 && box.top - bounds.height - 6 >= 8) {
      top = box.top - bounds.height - 6;
    }
    top = Math.max(8, Math.min(top, window.innerHeight - bounds.height - 8));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function changePage(next, focus) {
    page = Math.max(1, Math.min(pages, next));
    open = false;
    render(focus);
    widget.dispatchEvent(new CustomEvent('paginationchange', {
      bubbles: true,
      detail: { page, pageSize: size, total, pageCount: pages },
    }));
  }

  function close(focus) {
    if (!open) return;
    open = false;
    render(focus ? '.zc-pg-size-trigger' : undefined);
  }

  function jump(input, focus) {
    const value = Number(input.value);
    if (!input.value.trim() || !Number.isFinite(value)) {
      input.value = lastJump;
      return;
    }
    lastJump = String(Math.max(1, Math.min(pages, Math.trunc(value))));
    input.value = lastJump;
    changePage(Number(lastJump), focus ? '.zc-pg-jump input' : undefined);
  }

  widget.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;

    if (button.hasAttribute('data-pg-number')) {
      const next = Number(button.dataset.pgNumber);
      changePage(next, `[data-pg-number="${next}"]`);
    } else if (button.hasAttribute('data-pg-direction')) {
      const next = page + (button.dataset.pgDirection === 'prev' ? -1 : 1);
      changePage(next, `[data-pg-number="${next}"]`);
    } else if (button.hasAttribute('data-pg-skip')) {
      changePage(page + (button.dataset.pgSkip === 'prev' ? -5 : 5));
    } else if (button.classList.contains('zc-pg-size-trigger')) {
      open = !open;
      render(open ? `[data-pg-size-option="${size}"]` : '.zc-pg-size-trigger');
    } else if (button.hasAttribute('data-pg-size-option')) {
      size = Number(button.dataset.pgSizeOption);
      pages = Math.max(1, Math.ceil(total / size));
      lastJump = '';
      changePage(1, '.zc-pg-size-trigger');
    }
  }, { signal });

  widget.addEventListener('input', event => {
    if (event.target.matches('.zc-pg-jump input')) event.target.value = event.target.value.replace(/\D/g, '');
  }, { signal });

  widget.addEventListener('keydown', event => {
    const jumpField = event.target.matches('.zc-pg-jump input');
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        close(true);
      } else if (jumpField) event.target.value = lastJump;
      return;
    }
    if (jumpField && event.key === 'Enter') {
      event.preventDefault();
      jump(event.target, true);
      return;
    }
    if (!event.target.closest('.zc-pg-size') || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    if (!open) {
      open = true;
      render(`[data-pg-size-option="${size}"]`);
      return;
    }
    const options = Array.from(widget.querySelectorAll('.zc-pg-option'));
    const index = options.indexOf(document.activeElement);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : Math.max(0, Math.min(options.length - 1, index + step));
    options[next]?.focus();
  }, { signal });

  widget.addEventListener('focusout', event => {
    if (rendering || widget.contains(event.relatedTarget)) return;
    if (event.target.matches('.zc-pg-jump input')) jump(event.target, false);
    close(false);
  }, { signal });

  document.addEventListener('pointerdown', event => {
    if (!widget.contains(event.target)) close(false);
  }, { signal });

  window.addEventListener('resize', placeMenu, { signal });
  window.addEventListener('scroll', placeMenu, { capture: true, signal });
  document.addEventListener('keydown', event => {
    if (open && (event.key === 'Escape' || event.key === 'Esc' || event.code === 'Escape' || event.keyCode === 27)) {
      event.preventDefault();
      close(true);
    }
  }, { capture: true, signal });

  render();
  return () => {
    controller.abort();
    delete widget.dataset.pgMounted;
  };
}
