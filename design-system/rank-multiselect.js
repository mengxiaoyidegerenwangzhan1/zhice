(function installRankMultiselect() {
  const host = document.querySelector('#visual-panel-components .select-control-demo');
  const name = '多选下拉 · 排名';
  const stylesheet = 'rank-multiselect.css?v=20261126-rank-multiselect';
  const presets = ['1–10名', '11–20名', '21–50名', '51–100名', '101名以上'];
  const bound = (name, label) => `<label class="zr-bound">
    <input type="number" name="${name}" min="1" step="1" placeholder="第" aria-label="${label}" aria-describedby="zr-range-error">
    <span class="zr-unit" aria-hidden="true">名</span>
  </label>`;

  function mount(widget) {
    const trigger = widget.querySelector('.zr-toggle');
    const values = widget.querySelector('.zr-values');
    const menu = widget.querySelector('.zr-menu');
    const options = [...widget.querySelectorAll('.zr-option input')];
    const form = widget.querySelector('.zr-range-form');
    const {minimum, maximum, useCustom} = form.elements;
    const error = widget.querySelector('.zr-error');
    const clear = widget.querySelector('.zr-clear');
    const readBounds = () => [minimum, maximum].map(input => input.value === '' ? null : input.valueAsNumber);
    const formatRange = ([min, max]) => min === null ? `≤${max}名` : max === null ? `≥${min}名` : `${min}–${max}名`;
    let custom = useCustom.checked ? readBounds() : null;

    function fitValues() {
      const count = values.querySelector('.zr-count');
      if (!count) return;
      const chips = [...values.querySelectorAll('.zr-chip')];
      chips.forEach(chip => { chip.hidden = false; });
      count.hidden = true;
      const available = values.getBoundingClientRect().width;
      if (!available) return;
      const gap = parseFloat(getComputedStyle(values).columnGap) || 0;
      const widths = chips.map(chip => chip.getBoundingClientRect().width);
      let visible = chips.length;
      let used = widths.reduce((total, width) => total + width, 0) + gap * (visible - 1);
      if (used > available) {
        count.hidden = false;
        do {
          visible--;
          used -= widths[visible] + (visible ? gap : 0);
          count.textContent = `+${chips.length - visible}`;
        } while (visible && used + gap + count.getBoundingClientRect().width > available);
      }
      const overflow = chips.slice(visible);
      const focusHidden = overflow.some(chip => chip.contains(document.activeElement));
      overflow.forEach(chip => { chip.hidden = true; });
      count.title = overflow.map(chip => chip.firstElementChild.textContent).join('、');
      if (focusHidden) trigger.focus({preventScroll: true});
    }

    function render() {
      const picked = options.flatMap(input => input.checked
        ? [[input.value, input.nextElementSibling.textContent]] : []);
      if (custom) picked.push(['custom', formatRange(custom)]);
      trigger.setAttribute('aria-label', `排名，${picked.map(([, label]) => label).join('、') || '不限'}`);
      clear.disabled = picked.length === 0;
      values.innerHTML = picked.length ? picked.map(([key, label]) => `<span class="zr-chip"><span>${label}</span>
        <button type="button" class="zr-remove" data-zr-remove="${key}" aria-label="移除${label}">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12"><path d="M3.2 3.2 8.8 8.8M8.8 3.2 3.2 8.8" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>
        </button></span>`).join('') + '<span class="zr-count" hidden></span>' : '<span class="zr-placeholder">不限</span>';
      fitValues();
    }

    function updateRange(focusInvalid = false) {
      const [min, max] = readBounds();
      const invalid = [minimum, maximum].find(input => !input.validity.valid);
      error.textContent = invalid ? '请输入大于或等于 1 的整数'
        : min === null && max === null ? '请至少填写区间的一端'
        : min !== null && max !== null && min > max ? '起始值不能大于结束值' : '';
      if (error.textContent) {
        useCustom.checked = Boolean(custom);
        if (focusInvalid) (invalid || minimum).focus();
        return;
      }
      useCustom.checked = true;
      custom = [min, max];
      render();
    }

    function setOpen(open, focus = false) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (focus) trigger.focus({preventScroll: true});
    }

    trigger.addEventListener('click', () => setOpen(menu.hidden));
    widget.addEventListener('change', event => {
      if (event.target === useCustom) {
        if (useCustom.checked) updateRange(true);
        else { custom = null; error.textContent = ''; render(); }
      } else if (options.includes(event.target)) render();
    });
    form.addEventListener('input', event => {
      if (event.target.type !== 'number') return;
      if (useCustom.checked) updateRange();
      else error.textContent = '';
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      updateRange(true);
    });
    clear.addEventListener('click', () => {
      options.forEach(input => { input.checked = false; });
      form.reset();
      minimum.value = maximum.value = '';
      useCustom.checked = false;
      custom = null;
      error.textContent = '';
      menu.querySelector('.zr-menu-body').scrollTop = 0;
      render();
      options[0]?.focus({preventScroll: true});
    });
    values.addEventListener('click', event => {
      const remove = event.target.closest('[data-zr-remove]');
      if (!remove) return;
      if (remove.dataset.zrRemove === 'custom') {
        minimum.value = maximum.value = '';
        useCustom.checked = false;
        custom = null;
        error.textContent = '';
      } else options[Number(remove.dataset.zrRemove)].checked = false;
      render();
      trigger.focus({preventScroll: true});
    });
    widget.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        event.preventDefault();
        setOpen(false, true);
      }
    });
    document.addEventListener('pointerdown', event => {
      if (!menu.hidden && !widget.closest('.individual-component')?.contains(event.target) && !widget.contains(event.target)) {
        setOpen(false);
      }
    });
    new ResizeObserver(fitValues).observe(widget);
    document.fonts.ready.then(fitValues);
    render();
    return () => custom;
  }

  const sample = document.createElement('div');
  sample.className = 'individual-component-sample';
  sample.innerHTML = `<div class="zr-multiselect">
    <div class="zr-trigger">
      <button type="button" class="zr-toggle" aria-label="排名，不限" aria-expanded="true" aria-controls="zr-rank-menu"></button>
      <span class="zr-label">排名</span>
      <span class="zr-values"><span class="zr-placeholder">不限</span></span>
      <span class="zr-chevron" aria-hidden="true" data-component-bitmap></span>
    </div>
    <div id="zr-rank-menu" class="zr-menu" role="group" aria-label="排名选项">
      <div class="zr-menu-body">
        <div class="zr-options">${presets.map((label, index) => `<label class="zr-option">
          <input type="checkbox" class="zr-checkbox" value="${index}" data-component-bitmap><span>${label}</span>
        </label>`).join('')}</div>
        <form class="zr-range-form" novalidate>
          <div class="zr-range-fields">
            <input type="checkbox" name="useCustom" class="zr-checkbox" aria-label="自定义排名区间" aria-describedby="zr-range-error" data-component-bitmap>
            ${bound('minimum', '起始名次')}<span class="zr-dash" aria-hidden="true">–</span>${bound('maximum', '结束名次')}
          </div>
          <p class="zr-error" id="zr-range-error" role="alert"></p>
          <button type="submit" hidden>确定</button>
        </form>
      </div>
      <div class="zr-menu-footer"><button type="button" class="zr-clear" aria-label="清空排名" data-component-bitmap disabled></button></div>
    </div>
  </div>`;
  host.append(sample);
  const widget = sample.querySelector('.zr-multiselect');
  const currentRange = mount(widget);
  // Keep the example visible while opening its code or specification.
  const spec = `<dl class="component-rule-list">
    <div><dt>触发器</dt><dd>292 × 32px，圆角 20px，左右内距 12px</dd></div>
    <div><dt>菜单</dt><dd>与触发器同宽，间距 6px，圆角 8px，选项行高 32px</dd></div>
    <div><dt>多选</dt><dd>勾选后保留菜单。触发器尽量展示完整标签，剩余项用 +N</dd></div>
    <div><dt>自定义名次</dt><dd>填写正整数，允许只填一端。勾选自定义或按 Enter 应用</dd></div>
    <div><dt>占位文字</dt><dd>空值显示「第」，输入后隐藏，右侧单位「名」保留</dd></div>
    <div><dt>底部清空</dt><dd>未选时置灰。点击后重置预设和自定义，恢复「不限」并保持展开</dd></div>
  </dl>`;
  async function exportCode() {
    const response = await fetch(stylesheet);
    if (!response.ok) throw new Error('组件样式读取失败');
    let css = await response.text();
    const assets = new Set([...css.matchAll(/url\("([^"]+\.png)"\)/g)].map(([, path]) => path));
    const embedded = await Promise.all([...assets].map(async path => {
      const image = await fetch(path);
      if (!image.ok) throw new Error('组件素材读取失败');
      const bytes = new Uint8Array(await image.arrayBuffer());
      return [path, 'data:image/png;base64,' + btoa(String.fromCharCode(...bytes))];
    }));
    for (const [path, data] of embedded) css = css.replaceAll(path, data);
    const snapshot = widget.cloneNode(true);
    const checkboxes = widget.querySelectorAll('.zr-option input');
    snapshot.querySelectorAll('.zr-option input').forEach((input, index) => {
      input.toggleAttribute('checked', checkboxes[index].checked);
    });
    const range = currentRange();
    snapshot.querySelector('[name="useCustom"]').toggleAttribute('checked', Boolean(range));
    snapshot.querySelectorAll('input[type="number"]').forEach((input, index) => {
      input.setAttribute('value', range?.[index] ?? '');
    });
    snapshot.querySelector('.zr-error').textContent = '';
    return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title>
<style>body{margin:24px;background:#fff}${css}</style></head><body>
${snapshot.outerHTML}
<script>(${mount.toString()})(document.querySelector('.zr-multiselect'));</script></body></html>`;
  }
  addIndividualActions(sample, name, spec, undefined, {exportCode, exportSvg: () => svgFor(widget)});
  sample.closest('.individual-component').id = 'component-rank-multiselect';
  styleComponentActions();
})();
