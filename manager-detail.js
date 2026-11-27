import { attachDetailHeaderScroll } from './components/detail-header-scroll.js';
import { getManagerListData } from './manager-list-data.js?v=20261126-period-conditions';
import { companyList } from './company-list-data.js?v=20261125-company-search';

const formatNumber = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const escapeHtml = value => String(value).replace(/[&<>"']/g, character =>
  ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[character]);
const backLink = '<a class="md-back" href="#/manager-screener">返回经理筛选</a>';
const tabs = [
  ['overview', '人物概览'], ['funds', '旗下基金'], ['returns', '收益'],
  ['risk', '风险'], ['holdings', '持仓分析'], ['profile', '基本信息'],
];

function withUnit(value, unit, formatter = String) {
  return Number.isFinite(value) ? `${formatter(value)}${unit}` : null;
}

function field(label, value) {
  return `<div><dt>${label}</dt><dd>${value ?? '—'}</dd></div>`;
}

function managerHref(id) {
  return `#/manager/${encodeURIComponent(id)}`;
}

const headerAssets = './assets/manager-detail';
const evaluationPeriods = [['1y', '近1年'], ['3y', '近3年'], ['5y', '近5年']];
const evaluationDimensions = ['盈利能力', '业绩稳定性', '行业稳定性', '回撤控制', '夏普率'];
const designSummaryGroups = [
  ['管理经验', [
    '最新评级<span class="is-fall">2星</span>，较上一季度<span class="is-fall">下降1星</span>。',
    '公募基金管理年限8.7年，目前在管基金8只，在管规模1.61亿元。',
    '代表基金：<strong>国联安中证全指半导体产品与设备ETF</strong>',
    '主要在管基金类型为<strong>股票型</strong>。',
  ]],
  ['业绩表现', [
    '<span class="is-fall">博取收益能力弱</span>，<strong>控制风险能力中等</strong>。',
    '近5年，年化收益率为−8.19%，<span class="is-fall">差于</span>沪深300。最大回撤为46.84%，<span class="is-fall">差于</span>沪深300。',
    '在股市牛市中收益表现<span class="is-fall">较差</span>，熊市中风控表现<strong>中等</strong>。',
  ]],
  ['投资偏好', [
    '投资<strong>偏重股票</strong>，整体风格为<strong>大盘–平衡型</strong>。',
    '股票行业偏好<strong>分散</strong>，前三大为<strong>其他–科创板、电子、其他–港股</strong>。重仓股票<strong>持有时间短</strong>。行业分布<strong>稳定</strong>。',
    '债券投资中偏好的券种为可转换债券。',
  ]],
  ['基金公司', [
    '弘毅远方基金管理有限公司成立于2018年。当前管理规模为9.0亿元，规模<strong>较小</strong>。旗下基金以<strong>混合型</strong>为主，占54%。旗下基金经理共5名，团队<strong>较小</strong>。在智君经理评级中获得4星及以上的有1人，数量<strong>较少</strong>。',
  ]],
];
// Design fixtures for the prototype profiles. Other managers use the shared manager list.
const sampleHeaders = {
  'demo:xu-jie': {
    summaryGroups: designSummaryGroups,
    companyName: '长江证券(上海)资产管理有限公司',
    avatar: headerAssets + '/avatar.png',
    degree: '博士',
    industries: '非银金融、银行、基础化工',
    awards: '金牛奖、明星基金奖',
    tenureLabel: '8年',
    nonCurrencyScale: 1.52,
    fundCount: 6,
    totalFundCount: 7,
    representativeAnnualized: 2.75,
    representativeBenchmark: -3.20,
    evaluation: { '3y': [58.49, 96.09, 69.03, 94.87, 46.07] },
  },
  'compare:b': {
    summaryGroups: designSummaryGroups,
    avatar: headerAssets + '/huang-xin.png',
    rating: null,
    degree: '硕士',
    industries: '其他-科创板、电子',
    awards: '英华奖',
    tenureLabel: '17年',
    careerYears: 24,
    scale: 327.35,
    nonCurrencyScale: 327.35,
    fundCount: 26,
    totalFundCount: 34,
    representativeAnnualized: 3.99,
    representativeBenchmark: 0.87,
    evaluation: {
      '1y': [86.25, 14.42, 8.70, 17.60, 79.33],
      '3y': [90.72, 6.58, 3.60, 10.15, 83.40],
      '5y': [93.98, 1.61, 0, 4.82, 86.35],
    },
  },
};

function rating(stars) {
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return '';
  const icons = Array.from({ length: 5 }, (_, index) => {
    const state = index >= stars ? 'star-background' : index === 2 ? 'star-foreground' : 'star-default';
    return `<img src="${headerAssets}/${state}.svg" width="14.8" height="14.8" alt="">`;
  });
  return `<span class="md-stars" role="img" aria-label="智君评级 ${stars} 星">${icons.join('')}</span>`;
}

function metricValue(value, unit) {
  return `<span class="company-metric-value">
    <span class="company-metric-number">${escapeHtml(value ?? '—')}</span>${unit && value != null ? `<span class="company-metric-unit">${unit}</span>` : ''}
  </span>`;
}

function metricNote(label, value, unit = '', secondary = false) {
  const benchmark = secondary ? ' md-benchmark' : '';
  return `<span class="md-metric-note${benchmark}"><span>${label}</span><span class="md-note-value">${escapeHtml(value ?? '—')}${unit && value != null ? `<span class="company-metric-unit">${unit}</span>` : ''}</span></span>`;
}

function metaField(label, value) {
  return `<span class="md-meta-field"><span class="md-meta-label">${label}：</span> ${value ?? '—'}</span>`;
}

function number(value) {
  return Number.isFinite(value) ? formatNumber.format(value) : null;
}

function header(manager, companyValue) {
  const compare = new URLSearchParams({ manager: manager.id });
  const annualized = withUnit(manager.representativeAnnualized, '%', number);
  const benchmark = withUnit(manager.representativeBenchmark, '%', number);
  const tenure = manager.tenureLabel || withUnit(manager.tenure, '年');
  const career = withUnit(manager.careerYears, '年');
  const showDemoLabel = manager.isDemo && !manager.avatar;
  return `<div class="company-header-slot"><header class="company-header md-header" aria-labelledby="md-title">
    <div class="company-header-top md-header-top">
      <div class="company-identity md-identity">
        <span class="md-avatar" aria-hidden="true">${manager.avatar
          ? `<img src="${manager.avatar}" width="40" height="40" alt="">`
          : escapeHtml(Array.from(manager.name)[0] ?? '基')}</span>
        <div class="md-heading">
          <h1 id="md-title">${escapeHtml(manager.name)}</h1>
          ${manager.type || showDemoLabel ? `<div class="company-chips">${manager.type ? `<span>${escapeHtml(manager.type)}</span>` : ''}${showDemoLabel ? '<span>示例</span>' : ''}</div>` : ''}
          ${rating(manager.rating)}
        </div>
      </div>
      <div class="company-header-actions md-actions">
        <a class="md-compare" href="#/manager-compare?${compare}" aria-label="经理PK" title="经理PK"><span>经理</span><img src="${headerAssets}/pk.svg" width="26.6162" height="13.9651" alt=""></a>
        <button type="button" aria-label="切换经理" title="切换经理" aria-expanded="false" aria-controls="md-switch-panel" data-md-action="switch">
          <span class="md-switch-artwork" aria-hidden="true">
            <img src="${headerAssets}/switch-default.png" width="46" height="20" alt="">
            <img src="${headerAssets}/switch-hover.png" width="46" height="20" alt="">
          </span>
        </button>
        <div id="md-switch-panel" class="md-switch-panel" hidden>
          <input type="search" class="md-switch-search" aria-label="搜索基金经理" aria-controls="md-switch-results" placeholder="输入经理姓名" autocomplete="off">
          <div id="md-switch-results" class="md-switch-results" role="group" aria-label="基金经理搜索结果" hidden></div>
        </div>
      </div>
    </div>
    <div class="company-facts-wrap md-facts-wrap">
      <div class="md-header-body">
        <div class="md-meta">
          ${metaField('现任公司', companyValue)}
          ${metaField('学历', manager.degree && escapeHtml(manager.degree))}
          ${metaField('管理/从业年限', tenure || career ? `${escapeHtml(tenure ?? '—')}/${escapeHtml(career ?? '—')}` : null)}
          ${metaField('偏爱行业', manager.industries && escapeHtml(manager.industries))}
          ${metaField('获奖', manager.awards && escapeHtml(manager.awards))}
        </div>
        <dl class="company-metrics md-metrics">
          <div class="md-metric--scale"><dt>在管规模</dt>
            <dd class="company-metric-readout">${metricValue(number(manager.scale), '亿')}${metricNote('剔除货币规模', number(manager.nonCurrencyScale), '亿')}</dd>
          </div>
          <div class="md-metric--products"><dt>在管产品</dt>
            <dd class="company-metric-readout">${metricValue(manager.fundCount, '个')}${metricNote('累计', manager.totalFundCount, '个')}</dd>
          </div>
          <div class="md-metric--representative"><dt>代表产品</dt>
            <dd class="company-metric-readout">
              ${manager.product ? `<span class="md-representative-name" title="${escapeHtml(manager.product)}">${escapeHtml(manager.product)}</span>` : '<span class="md-representative-name md-representative-missing">—</span>'}
              <span class="md-representative-notes">${metricNote('年化回报', annualized)}${metricNote('同期大盘', benchmark, '', true)}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="company-tabs md-tabs" role="tablist" aria-label="经理详情">
      ${tabs.map(([key, label]) => `<button type="button" role="tab" id="md-tab-${key}" aria-controls="md-tab-panel" data-md-tab="${key}">${label}</button>`).join('')}
    </div>
  </header></div>`;
}

function section(title, fields, empty) {
  return `<section class="cl-card md-detail">
    <h2>${title}</h2>
    ${fields.length ? `<dl class="md-fields">${fields.map(([label, value]) => field(label, value)).join('')}</dl>`
      : `<p class="md-empty">${empty}</p>`}
  </section>`;
}

function summaryGroup(title, lines) {
  const copy = lines.filter(Boolean).map(line => `<p>${line}</p>`).join('');
  return `<section class="md-summary-group">
    <h3>${title}</h3>
    <div class="md-summary-copy">${copy || '<p>暂无数据</p>'}</div>
  </section>`;
}

function managerSummaryGroups(manager, company, companyValue) {
  if (manager.summaryGroups) return manager.summaryGroups;

  const tenure = manager.tenureLabel || withUnit(manager.tenure, '年');
  const fundCount = withUnit(manager.fundCount, '只');
  const scale = withUnit(manager.scale, '亿元', number);
  const experience = [
    tenure && `公募基金管理年限${escapeHtml(tenure)}`,
    fundCount && `目前在管基金${fundCount}`,
    scale && `在管规模${scale}`,
  ].filter(Boolean).join('，');
  const annualized = withUnit(manager.representativeAnnualized, '%', number);
  const benchmark = withUnit(manager.representativeBenchmark, '%', number);
  const performance = [
    annualized && `代表基金年化回报${annualized}`,
    benchmark && `同期大盘${benchmark}`,
  ].filter(Boolean).join('，');
  const difference = Number.isFinite(manager.representativeAnnualized) && Number.isFinite(manager.representativeBenchmark)
    ? Number((manager.representativeAnnualized - manager.representativeBenchmark).toFixed(2))
    : null;
  const comparison = difference == null ? '' : difference === 0 ? '代表基金与同期大盘年化回报持平。'
    : `代表基金年化回报<span class="${difference > 0 ? 'is-rise' : 'is-fall'}">${difference > 0 ? '高于' : '低于'}</span>同期大盘 ${number(Math.abs(difference))} 个百分点。`;
  const companyDetails = companyList.find(entry => entry.id === company?.id);
  const companyMetrics = companyDetails ? [
    companyDetails.founded && `成立于${escapeHtml(companyDetails.founded)}`,
    Number.isFinite(companyDetails.totalScale) && `管理规模${number(companyDetails.totalScale)}亿元`,
    Number.isFinite(companyDetails.fundCount) && `旗下基金${companyDetails.fundCount}只`,
    Number.isFinite(companyDetails.managerCount) && `基金经理${companyDetails.managerCount}名`,
  ].filter(Boolean).join('，') : '';

  return [
    ['管理经验', [
      Number.isInteger(manager.rating) && `最新评级${manager.rating}星。`,
      experience && `${experience}。`,
      manager.product && `代表基金：<strong>${escapeHtml(manager.product)}</strong>。`,
      manager.productType && `代表基金类型为<strong>${escapeHtml(manager.productType)}</strong>。`,
    ]],
    ['业绩表现', [performance && `${performance}。`, comparison]],
    ['投资偏好', [
      manager.industries && `偏爱行业为<strong>${escapeHtml(manager.industries)}</strong>。`,
      manager.productStyle && `代表基金风格为<strong>${escapeHtml(manager.productStyle)}</strong>。`,
      manager.productThemes?.length && `代表基金主题为<strong>${escapeHtml(manager.productThemes.join('、'))}</strong>。`,
    ]],
    ['基金公司', [
      companyValue && `现任公司：${companyValue}。`,
      companyMetrics && `${companyMetrics}。`,
    ]],
  ];
}

function managerSummary(manager, company, companyValue) {
  const groups = managerSummaryGroups(manager, company, companyValue);
  const summary = document.createElement('section');
  summary.className = 'cl-card md-summary';
  summary.setAttribute('aria-labelledby', 'md-summary-title');
  summary.innerHTML = `
    <div class="md-summary-head">
      <h2 id="md-summary-title">核心总结</h2>
      <div class="md-summary-periods" role="group" aria-label="评估时段">
        ${evaluationPeriods.map(([key, label]) => `<button type="button" data-md-summary-period="${key}" aria-controls="md-summary-scores" aria-pressed="${key === '3y'}">${label}</button>`).join('')}
      </div>
    </div>
    <dl class="md-summary-scores" id="md-summary-scores" aria-live="polite">
      ${evaluationDimensions.map(label => `<div><dt>${label}</dt><dd>—</dd></div>`).join('')}
    </dl>
    <div class="md-summary-details" id="md-summary-details" hidden>
      ${groups.map(([title, lines]) => summaryGroup(title, lines)).join('')}
    </div>
    <button type="button" class="md-summary-toggle" aria-controls="md-summary-details" aria-expanded="false" aria-label="展开">
      <span class="md-summary-expand-art" aria-hidden="true">
        <img src="${headerAssets}/summary-expand-default.png" width="42" height="28" alt="">
        <img src="${headerAssets}/summary-expand-hover.png" width="42" height="28" alt="">
      </span>
      <span class="md-summary-collapse-art" aria-hidden="true">
        <img src="${headerAssets}/summary-collapse-default.png" width="42" height="28" alt="">
        <img src="${headerAssets}/summary-collapse-hover.png" width="42" height="28" alt="">
      </span>
    </button>`;

  const periods = summary.querySelectorAll('[data-md-summary-period]');
  const scores = summary.querySelectorAll('.md-summary-scores dd');
  function selectPeriod(period) {
    const values = manager.evaluation?.[period];
    periods.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mdSummaryPeriod === period)));
    scores.forEach((score, index) => {
      score.textContent = number(values?.[index]) ?? '—';
    });
  }
  periods.forEach(button => button.addEventListener('click', () => selectPeriod(button.dataset.mdSummaryPeriod)));
  selectPeriod('3y');

  const details = summary.querySelector('.md-summary-details');
  const toggle = summary.querySelector('.md-summary-toggle');
  toggle.addEventListener('click', () => {
    const expanded = details.hidden;
    details.hidden = !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? '收起' : '展开');
  });
  return summary;
}

function bindManagerSwitch(root, currentManager, managers, companies) {
  const trigger = root.querySelector('[data-md-action="switch"]');
  const panel = root.querySelector('.md-switch-panel');
  const search = panel.querySelector('.md-switch-search');
  const results = panel.querySelector('.md-switch-results');
  const employers = new Map(companies.map(company => [company.id, company]));
  const otherManagers = managers.filter(entry => entry.id !== currentManager.id);

  function showManagers() {
    const query = search.value.trim();
    if (!query) {
      results.hidden = true;
      results.replaceChildren();
      return;
    }
    const keyword = query.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&');
    const match = new RegExp('(' + keyword + ')', 'iu');
    const matching = otherManagers.filter(entry => match.test(entry.name));
    const onlyCurrent = matching.length === 0 && match.test(currentManager.name);
    results.hidden = onlyCurrent;
    if (onlyCurrent) {
      results.replaceChildren();
      return;
    }
    results.innerHTML = matching.map(entry => {
      const company = employers.get(entry.companyId);
      const employer = company?.shortName ?? company?.name ?? '—';
      const type = entry.type ?? '—';
      const name = entry.name.split(match).map((part, index) => {
        const safePart = escapeHtml(part);
        return index % 2 ? '<strong>' + safePart + '</strong>' : safePart;
      }).join('');
      return `<a class="md-switch-result" href="${managerHref(entry.id)}">
        <span class="md-switch-name" title="${escapeHtml(entry.name)}">${name}</span>
        <span class="md-switch-employer" title="${escapeHtml(employer)}">${escapeHtml(employer)}</span>
        <span class="md-switch-type" title="${escapeHtml(type)}">${escapeHtml(type)}</span>
      </a>`;
    }).join('') || '<p class="md-switch-empty" role="status">未找到匹配的基金经理</p>';
    results.scrollTop = 0;
  }

  function close(restoreFocus = false) {
    if (panel.hidden) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', () => {
    if (!panel.hidden) {
      close(true);
      return;
    }
    search.value = '';
    showManagers();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    search.focus({ preventScroll: true });
  });
  search.addEventListener('input', showManagers);
  results.addEventListener('click', event => {
    const result = event.target.closest('.md-switch-result');
    if (!result || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    close();
  });

  panel.addEventListener('keydown', event => {
    if (event.isComposing || !['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
    const entries = [...results.querySelectorAll('.md-switch-result')];
    if (!entries.length) return;
    if (event.key === 'Enter') {
      if (event.target === search) {
        event.preventDefault();
        entries[0].click();
      }
      return;
    }
    event.preventDefault();
    const current = entries.indexOf(event.target);
    const next = current + (event.key === 'ArrowDown' ? 1 : -1);
    const target = next < 0 ? search : entries[Math.min(next, entries.length - 1)];
    target.focus();
  });
  root.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.isComposing || panel.hidden) return;
    event.preventDefault();
    close(true);
  });

  function dismissOutside(event) {
    if (!panel.contains(event.target) && !trigger.contains(event.target)) close();
  }

  document.addEventListener('pointerdown', dismissOutside);
  document.addEventListener('focusin', dismissOutside);
  return () => {
    document.removeEventListener('pointerdown', dismissOutside);
    document.removeEventListener('focusin', dismissOutside);
  };
}

export function renderManagerDetail(view, managerId, { initialTab, onTabChange = () => {} } = {}) {
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
  const headerManager = { ...manager, ...sampleHeaders[manager.id] };
  const companyValue = company
    ? `<a class="md-company-link" href="#/company/${encodeURIComponent(company.id)}">${escapeHtml(headerManager.companyName ?? company.name)}</a>`
    : null;
  const details = [
    ['现任公司', companyValue],
    ['经理类型', manager.type && escapeHtml(manager.type)],
    ['综合评级', withUnit(headerManager.rating, '星')],
    ['从业年限', withUnit(headerManager.careerYears, '年')],
    ['管理年限', headerManager.tenureLabel ? escapeHtml(headerManager.tenureLabel) : withUnit(manager.tenure, '年')],
    ['在管规模', withUnit(headerManager.scale, '亿', number)],
    ['在管基金数', withUnit(headerManager.fundCount, '只')],
    ['代表基金', manager.product && escapeHtml(manager.product)],
    ['基金类型', manager.productType && escapeHtml(manager.productType)],
  ];
  const returns = [
    ['代表基金年化回报', headerManager.representativeAnnualized],
    ['经理指数总回报', manager.indexTotal],
    ['经理指数近3月', manager.index3m],
    ['经理指数近1年', manager.index1y],
    ['经理指数近3年', manager.index3y],
  ].filter(([, value]) => Number.isFinite(value))
    .map(([label, value]) => [label, withUnit(value, '%', number => formatNumber.format(number))]);

  view.innerHTML = `<div class="cl-page md-page">
    ${header(headerManager, companyValue)}
    <div class="md-content" id="md-tab-panel" role="tabpanel" tabindex="0"></div>
    ${backLink}
  </div>`;

  const root = view.firstElementChild;
  const panel = root.querySelector('.md-content');
  const scrollHeader = root.querySelector('.md-header');
  const tabList = root.querySelector('.md-tabs');
  const tabButtons = [...tabList.querySelectorAll('[data-md-tab]')];
  const disposeSwitch = bindManagerSwitch(root, manager, managers, companies);
  const summary = managerSummary(headerManager, company, companyValue);
  const profiles = section('基本信息', details);
  const performance = section('业绩指标', returns, '暂无业绩数据');
  const fundFields = manager.product
    ? [['代表基金', escapeHtml(manager.product)], ['基金类型', manager.productType && escapeHtml(manager.productType)]]
    : [];
  const risk = manager.performanceValues.representative;
  const riskFields = [['最大回撤', risk.maxDrawdown?.['1y']], ['年化波动率', risk.volatility?.['1y']], ['下行风险', risk.downsideRisk?.['1y']]]
    .filter(([, value]) => Number.isFinite(value))
    .map(([label, value]) => [label, withUnit(value, '%', number => formatNumber.format(number))]);
  const panels = {
    overview: profiles + (returns.length ? performance : ''),
    funds: section('代表基金', fundFields, '暂无代表基金数据'),
    returns: performance,
    risk: section(riskFields.length ? '代表基金近一年风险' : '风险', riskFields, '暂无风险数据'),
    holdings: section('持仓分析', [], '暂无持仓数据'),
    profile: profiles,
  };

  function showTab(button) {
    for (const item of tabButtons) {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    }
    panel.setAttribute('aria-labelledby', button.id);
    panel.innerHTML = panels[button.dataset.mdTab];
    if (button.dataset.mdTab === 'overview') panel.prepend(summary);
    const listBounds = tabList.getBoundingClientRect();
    const tabBounds = button.getBoundingClientRect();
    const leftOverflow = Math.min(0, tabBounds.left - listBounds.left);
    const rightOverflow = Math.max(0, tabBounds.right - listBounds.right);
    tabList.scrollLeft += leftOverflow + rightOverflow;
  }

  function selectTab(button) {
    showTab(button);
    onTabChange(button.dataset.mdTab);
    if (scrollHeader.classList.contains('is-pinned') && panel.getBoundingClientRect().top < scrollHeader.getBoundingClientRect().bottom) {
      const y = window.scrollY + panel.getBoundingClientRect().top - scrollHeader.getBoundingClientRect().bottom - 10;
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
    }
    root.dispatchEvent(new Event('md-tab-scroll'));
  }

  tabList.addEventListener('click', event => {
    const button = event.target.closest('[data-md-tab]');
    if (button) selectTab(button);
  });
  tabList.addEventListener('keydown', event => {
    const index = tabButtons.indexOf(event.target);
    if (index === -1 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabButtons.length - 1
      : (index + (event.key === 'ArrowLeft' ? -1 : 1) + tabButtons.length) % tabButtons.length;
    const button = tabButtons[next];
    selectTab(button);
    button.focus({ preventScroll: true });
  });

  showTab(tabButtons.find(button => button.dataset.mdTab === initialTab) ?? tabButtons[0]);
  const disposeScroll = attachDetailHeaderScroll(root, { tabScrollEvent: 'md-tab-scroll', revealTallHeader: true });
  return () => {
    disposeScroll();
    disposeSwitch();
  };
}
