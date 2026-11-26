export function fitFilterChips(control) {
  const value = control.querySelector('.cl-trigger-value');
  const count = value.querySelector('.cl-overflow-count');
  if (!count) return;

  const chips = [...value.querySelectorAll('[data-cl-chip]')];
  chips.forEach(chip => { chip.hidden = false; });
  count.hidden = true;

  const available = value.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(value).columnGap) || 0;
  const widths = chips.map(chip => chip.getBoundingClientRect().width);
  let visible = chips.length;
  let used = widths.reduce((sum, width) => sum + width, 0) + gap * (visible - 1);

  if (used > available) {
    count.hidden = false;
    do {
      visible--;
      used -= widths[visible] + (visible ? gap : 0);
      count.textContent = `+${chips.length - visible}`;
    } while (visible && used + gap + count.getBoundingClientRect().width > available);
  }

  const overflow = chips.slice(visible);
  const focused = overflow.some(chip => chip.contains(document.activeElement));
  overflow.forEach(chip => { chip.hidden = true; });
  count.title = overflow.map(chip => chip.dataset.clChip).join('、');
  if (focused) control.querySelector('.cl-trigger').focus({preventScroll: true});
}
