const escapeHtml = value => String(value).replace(/[&<>"']/g, character => (
  {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]
));

export function renderCustomRange(key, field, bounds = [], checked = false) {
  const [min, max] = bounds;
  const errorId = `cl-range-error-${key}`;
  const isRank = field.unit === '名';
  const [lowLabel, highLabel] = isRank ? ['起始名次', '结束名次']
    : field.unit === '年' ? ['最短', '最长'] : ['最低', '最高'];
  const bound = (name, label, value) => `<label class="cl-custom-bound">
    <input type="number" name="${name}" min="${field.min ?? (isRank ? 1 : 0)}" step="${field.continuous ? 'any' : 1}"
      placeholder="${isRank ? '第' : label}" aria-label="${field.label}${label}（${field.unit}）" aria-describedby="${errorId}" value="${escapeHtml(value ?? '')}">
    <span class="cl-unit">${field.unit}</span></label>`;
  return `<form class="cl-custom-form" data-cl-custom-form="${key}" novalidate>
    <div class="cl-custom-fields">
      <input type="checkbox" class="cl-checkbox" name="useCustom" aria-label="自定义${field.label}区间"
        aria-describedby="${errorId}"${checked ? ' checked' : ''}>
      ${bound('minimum', lowLabel, min)}<span class="cl-custom-separator" aria-hidden="true">–</span>${bound('maximum', highLabel, max)}
    </div>
    <p class="cl-form-error" id="${errorId}" role="alert"></p><button type="submit" hidden>确定</button>
  </form>`;
}

export function validateCustomRange(form, enabled, currentBounds, focusInvalid = false) {
  const {minimum, maximum, useCustom} = form.elements;
  const error = form.querySelector('.cl-form-error');
  error.textContent = '';
  if (!enabled) {
    useCustom.checked = false;
    return undefined;
  }

  const min = minimum.value === '' ? null : minimum.valueAsNumber;
  const max = maximum.value === '' ? null : maximum.valueAsNumber;
  if (!minimum.validity.valid || !maximum.validity.valid) {
    error.textContent = '请输入有效的区间数值';
  } else if (min === null && max === null) {
    error.textContent = '请至少填写区间的一端';
  } else if (min !== null && max !== null && min > max) {
    error.textContent = '起始值不能大于结束值';
  }
  if (error.textContent) {
    useCustom.checked = Boolean(currentBounds);
    if (focusInvalid) (maximum.validity.valid ? minimum : maximum).focus();
    return null;
  }
  useCustom.checked = true;
  return [min, max];
}

export function customRangeLabel([min, max], unit) {
  if (min === null) return `≤${max}${unit}`;
  if (max === null) return `≥${min}${unit}`;
  return `${min}–${max}${unit}`;
}
