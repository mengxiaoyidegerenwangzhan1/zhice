import { getManagerListData } from './manager-list-data.js?v=20261125-manager-screen';

const formatNumber = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const escapeHtml = value => String(value).replace(/[&<>"']/g, character =>
  ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[character]);
const backLink = '<a class="md-back" href="#/manager-screener">返回经理筛选</a>';

function withUnit(value, unit, formatter = String) {
  return Number.isFinite(value) ? `${formatter(value)}${unit}` : null;
}

function field(label, value) {
  return `<div><dt>${label}</dt><dd>${value ?? '—'}</dd></div>`;
}

export function renderManagerDetail(view, managerId) {
  const {companies, managers} = getManagerListData();
  const manager = managers.find(entry => entry.id === managerId);
  if (!manager) {
    view.innerHTML = `<div class="cl-page md-page">${backLink}
      <section class="cl-card md-detail" aria-labelledby="md-title">
        <h1 id="md-title">未找到基金经理</h1>
      </section>
    </div>`;
    return;
  }

  const company = companies.find(entry => entry.id === manager.companyId);
  const companyName = company ? escapeHtml(company.name) : null;
  const companyValue = company?.hasDetail
    ? `<a class="md-company-link" href="#/company/${encodeURIComponent(company.id)}">${companyName}</a>`
    : companyName;
  const details = [
    ['现任公司', companyValue],
    ['经理类型', manager.type && escapeHtml(manager.type)],
    ['综合评级', withUnit(manager.rating, '星')],
    ['从业年限', withUnit(manager.careerYears, '年')],
    ['管理年限', manager.tenureLabel ? escapeHtml(manager.tenureLabel) : withUnit(manager.tenure, '年')],
    ['在管规模', withUnit(manager.scale, '亿', value => formatNumber.format(value))],
    ['在管基金数', withUnit(manager.fundCount, '只')],
    ['代表基金', manager.product && escapeHtml(manager.product)],
    ['基金类型', manager.productType && escapeHtml(manager.productType)],
  ];
  const returns = [
    ['代表基金年化回报', manager.representativeAnnualized],
    ['经理指数总回报', manager.indexTotal],
    ['经理指数近3月', manager.index3m],
    ['经理指数近1年', manager.index1y],
    ['经理指数近3年', manager.index3y],
  ].filter(([, value]) => Number.isFinite(value));

  view.innerHTML = `<div class="cl-page md-page">${backLink}
    <section class="cl-card md-detail" aria-labelledby="md-title">
      <header class="md-heading">
        <h1 id="md-title">${escapeHtml(manager.name)}</h1>
        ${manager.isDemo ? '<span class="md-demo-label">示例</span>' : ''}
      </header>
      <dl class="md-fields">${details.map(([label, value]) => field(label, value)).join('')}</dl>
    </section>
    ${returns.length ? `<section class="cl-card md-detail" aria-labelledby="md-returns">
      <h2 id="md-returns">业绩指标</h2>
      <dl class="md-fields">${returns.map(([label, value]) => field(label, withUnit(value, '%', number => formatNumber.format(number)))).join('')}</dl>
    </section>` : ''}
  </div>`;
}
