import { companyData, managerRatingExamples } from './company-detail-data.js?v=20261123-affiliated-funds';
import { companyList } from './company-list-data.js?v=20261125-company-search';

const additionalCompanies = [
  { id: 'shangzheng', name: '尚正基金管理有限公司', shortName: '尚正基金' },
  { id: 'guolianan', name: '国联安基金管理有限公司', shortName: '国联安基金' },
  { id: 'morgan', name: '摩根基金', shortName: '摩根基金' },
  { id: 'invesco-greatwall', name: '景顺长城基金管理有限公司', shortName: '景顺长城基金' },
  { id: 'changjiang-asset', name: '长江资管', shortName: '长江资管' },
  { id: 'demo-asset', name: '示例基金管理公司', shortName: '示例基金' },
];
const companiesByName = new Map([...companyList, ...additionalCompanies].flatMap(company => [
  [company.name, company],
  [company.shortName, company],
]));
const companyDetails = new Set(companyList.map(company => company.id));
const essenceRatings = new Map(managerRatingExamples.map(manager => [manager.name, manager]));

// The manager comparison's overview contains these three profile summaries.
// Only carry over returns that refer to the same representative product.
const compareProfiles = {
  a: { rating: 2, scale: 1.46, tenure: 7 },
  b: { rating: 1, scale: 324.99, tenure: 17, representativeAnnualized: 2.91 },
  c: { rating: 1, scale: 12.07, tenure: 7 },
};
// The design's example is followed by clearly labelled fictional profiles.
// Historical figures on these rows demonstrate the prototype's filters only.
const demonstrationProfiles = [
  {
    id: 'demo:xu-jie', name: '徐婕', company: '长江资管', type: '偏股型', rating: 3,
    careerYears: 25, years: 7, days: 227, scale: 1.52, product: '长江添利混合A', productType: '偏债混合型',
    representativeAnnualized: 2.82, indexTotal: 214.37,
    returns: { representative: [-1.7, 1.38, 2.82, 8.68, 12.86], index: [-2.78, -1.28, .82, 15.03, 19.82] },
    risk: { representative: { drawdown: 9, volatility: 12, beta: .55 }, index: { drawdown: 16, volatility: 18, beta: .82 } },
  },
  {
    id: 'demo:equity', name: '示例经理 A', company: '示例基金', type: '偏股型', rating: 4,
    careerYears: 14, years: 8, days: 160, scale: 58.3, fundCount: 5,
    product: '示例成长混合A', productType: '偏股混合型', productStyle: '大盘-成长型', productThemes: ['科技', '高端制造'],
    representativeAnnualized: 12.68, indexTotal: 135.06,
    returns: { representative: [5.8, 9.4, 13.6, 42.5, 84.2], index: [4.15, 11.4, 18.85, 38.62, 72.44] },
    risk: { representative: { drawdown: 21, volatility: 26, beta: 1.15 }, index: { drawdown: 18, volatility: 22, beta: 1.07 } },
  },
  {
    id: 'demo:bond', name: '示例经理 B', company: '示例基金', type: '偏债型', rating: 5,
    careerYears: 18, years: 12, days: 56, scale: 146.1, fundCount: 8,
    product: '示例稳健债券A', productType: '中长期纯债型', productStyle: '中盘-价值型', productThemes: ['金融地产'],
    representativeAnnualized: 5.41, indexTotal: 49.33,
    returns: { representative: [1.9, 2.65, 5.92, 16.9, 28.8], index: [1.36, 3.33, 5.74, 18.21, 25.23] },
    risk: { representative: { drawdown: 2.6, volatility: 3.9, beta: .22 }, index: { drawdown: 2.3, volatility: 3.2, beta: .18 } },
  },
  {
    id: 'demo:index', name: '示例经理 C', company: '示例基金', type: '指数型', rating: 2,
    careerYears: 10, years: 6, days: 98, scale: 29.7, fundCount: 3,
    product: '示例均衡指数A', productType: '被动指数股票型', productStyle: '小盘-平衡型', productThemes: ['消费', '医药'],
    representativeAnnualized: -1.42, indexTotal: 22.8,
    returns: { representative: [-3.65, -1.72, -2.14, 8.15, 9.28], index: [-1.92, -3.47, -3.61, 6.92, 16.82] },
    risk: { representative: { drawdown: 26, volatility: 28, beta: 1.3 }, index: { drawdown: 24, volatility: 27, beta: 1.22 } },
  },
];

const rankPeriods = [
  { id: '3m', years: .25, drawdownWeight: .58, benchmark: 1.7 },
  { id: '6m', years: .5, drawdownWeight: .75, benchmark: 3.1 },
  { id: '1y', years: 1, drawdownWeight: 1, benchmark: 5.4 },
  { id: '3y', years: 3, drawdownWeight: 1.42, benchmark: 6.2 },
  { id: '5y', years: 5, drawdownWeight: 1.72, benchmark: 6.5 },
];
const lowerIsBetter = new Set(['maxDrawdown', 'volatility', 'downsideRisk']);

function demonstrationMetrics(demo, scope, period, position) {
  const totalReturn = demo.returns[scope][position];
  const cagr = ((1 + totalReturn / 100) ** (1 / period.years) - 1) * 100;
  const excessCagr = cagr - period.benchmark;
  const risk = demo.risk[scope];
  const volatility = risk.volatility * (.9 + .05 * position);
  const maxDrawdown = risk.drawdown * period.drawdownWeight;
  const downsideRisk = volatility * (totalReturn < 0 ? .72 : .54);
  const excessRiskFree = cagr - 1.5;
  return {
    return: totalReturn, cagr, excessCagr, maxDrawdown, volatility, downsideRisk,
    sharpe: excessRiskFree / volatility, informationRatio: excessCagr / (volatility * .6),
    calmar: cagr / maxDrawdown, sortino: excessRiskFree / downsideRisk, treynor: excessRiskFree / risk.beta,
  };
}

function demonstrationPerformance() {
  const profiles = new Map(demonstrationProfiles.map(({ id }) => [id, {
    performance: { representative: {}, index: {} },
    performanceValues: { representative: {}, index: {} },
  }]));
  for (const scope of ['representative', 'index']) {
    rankPeriods.forEach((period, periodIndex) => {
      const sample = demonstrationProfiles.map(demo => ({ id: demo.id, metrics: demonstrationMetrics(demo, scope, period, periodIndex) }));
      for (const metric of Object.keys(sample[0].metrics)) {
        const direction = lowerIsBetter.has(metric) ? 1 : -1;
        const ranked = [...sample].sort((left, right) => direction * (left.metrics[metric] - right.metrics[metric]));
        ranked.forEach(({ id, metrics }, position) => {
          const { performance, performanceValues } = profiles.get(id);
          const ranks = performance[scope];
          const values = performanceValues[scope];
          ranks[metric] ??= {};
          values[metric] ??= {};
          // A rank represents the midpoint of its bucket in the demonstration cohort.
          ranks[metric][period.id] = 100 * (position + .5) / sample.length;
          values[metric][period.id] = metrics[metric];
        });
      }
    });
  }
  return profiles;
}

const samplePerformance = demonstrationPerformance();
const blankMetrics = {
  product: null, productType: null, productStyle: null, type: null, tenure: null, tenureDays: null,
  careerYears: null, scale: null, fundCount: null, rating: null, representativeAnnualized: null,
  indexTotal: null, index3m: null, index1y: null, index3y: null,
};

export function getManagerListData() {
  const companies = new Map();
  function useCompany(companyName) {
    const { id, name, shortName } = companiesByName.get(companyName)
      ?? { id: companyName, name: companyName, shortName: companyName };
    companies.set(id, { id, name, shortName, hasDetail: companyDetails.has(id) });
    return id;
  }

  const essenceId = useCompany(companyData.name);
  const essenceManagers = companyData.managers.map(manager => {
    const rated = essenceRatings.get(manager.name);
    return {
      ...blankMetrics, id: `${essenceId}:${manager.name}`, name: manager.name, companyId: essenceId,
      type: manager.type ?? null, product: manager.product ?? null, productType: rated?.fundType ?? null,
      tenure: manager.tenure ?? null, tenureDays: Number.isFinite(manager.tenure) ? Math.round(manager.tenure * 365) : null,
      careerYears: manager.experience ?? null, scale: manager.scale ?? null, fundCount: manager.count ?? null,
      rating: rated?.rating ?? null, representativeAnnualized: manager.annual ?? null,
    };
  });

  const compareCatalog = window.ManagerCompareView?.getCatalog() ?? [];
  const compareManagers = compareCatalog.map(({ id, name, company, product, productType, type }) => {
    const profile = compareProfiles[id];
    return {
      ...blankMetrics, ...profile, id: `compare:${id}`, name, companyId: useCompany(company),
      product: product ?? null, productType: productType ?? null, type: type ?? null,
      tenureDays: Number.isFinite(profile?.tenure) ? profile.tenure * 365 : null,
    };
  });

  const demoManagers = demonstrationProfiles.map(({ company, years, days, returns, risk, ...profile }) => ({
    ...blankMetrics, ...profile, companyId: useCompany(company),
    tenure: years + days / 365, tenureDays: years * 365 + days, tenureLabel: `${years}年${days}天`,
    index3m: returns.index[0], index1y: returns.index[2], index3y: returns.index[3],
    isDemo: true, ...samplePerformance.get(profile.id),
  }));

  const managers = [...essenceManagers, ...compareManagers, ...demoManagers].map(manager => ({
    ...manager,
    productThemes: manager.productThemes ?? [],
    performance: manager.performance ?? { representative: {}, index: {} },
    performanceValues: manager.performanceValues ?? { representative: {}, index: {} },
  }));
  return { companies: [...companies.values()], managers };
}
