export const companyData = {
  name: '安信基金管理有限责任公司',
  founded: '2011-12-06',
  capital: '5.0625',
  legalRepresentative: '刘入领',
  generalManager: '刘入领',
  url: 'https://www.essencefund.com/',
  metrics: [
    { label: '总规模', value: 1200.63, unit: '亿', rank: 63, total: 163 },
    { label: '非货币理财规模', value: 926.47, unit: '亿', rank: 54, total: 162 },
    { label: '旗下基金数', value: 114, unit: '只', rank: 34, total: 163 },
    { label: '旗下基金经理数', value: 40, unit: '人', rank: 33, total: 163 },
  ],
  scaleAnnual: [
    { year: 2026, total: 1200.63, change: 149.95, rank: '63/163', fundCount: 114 },
    { year: 2025, total: 1050.68, change: -108.67, rank: '66/164', fundCount: 107 },
    { year: 2024, total: 1159.35, change: -125.88, rank: '58/183', fundCount: 95 },
    { year: 2023, total: 1285.22, change: -45.06, rank: '44/186', fundCount: 87 },
    { year: 2022, total: 1330.29, change: 153.73, rank: '37/183', fundCount: 83 },
  ],
  // Quarterly values approximate the chart in the source screenshot.
  // The annual table above retains the reported figures.
  scale: [
    { date: '2022-03-31', total: 1190, change: 260 },
    { date: '2022-06-30', total: 1405, change: 215 },
    { date: '2022-09-30', total: 1500, change: 90 },
    { date: '2022-12-31', total: 1485, change: -10 },
    { date: '2023-03-31', total: 1340, change: -150 },
    { date: '2023-06-30', total: 1330, change: -10 },
    { date: '2023-09-30', total: 1365, change: 35 },
    { date: '2023-12-31', total: 1335, change: -30 },
    { date: '2024-03-31', total: 1295, change: -40 },
    { date: '2024-06-30', total: 1155, change: -140 },
    { date: '2024-09-30', total: 1290, change: 135 },
    { date: '2024-12-31', total: 1155, change: -135 },
    { date: '2025-03-31', total: 1165, change: 10 },
    { date: '2025-06-30', total: 1105, change: -55 },
    { date: '2025-09-30', total: 1090, change: -15 },
    { date: '2025-12-31', total: 1030, change: -60 },
    { date: '2026-03-31', total: 1055, change: 25 },
    { date: '2026-06-30', total: 1195, change: 130 },
    { date: '2026-09-30', total: 1245, change: 45 },
    { date: '2026-11-20', total: 1200.63, change: -35 },
  ],
  products: [
    { label: '混合型', percent: 37.34, count: 47, countRank: '27/160', total: 448.37, scaleRank: '25/162', color: '#e387a2' },
    { label: '债券型', percent: 34.47, count: 25, countRank: '42/160', total: 413.87, scaleRank: '65/156', color: '#e3cc87' },
    { label: '货币型', percent: 22.83, count: 3, countRank: '29/160', total: 274.16, scaleRank: '67/119', color: '#aec9a0' },
    { label: '股票型', percent: 5.23, count: 4, countRank: '33/160', total: 62.82, scaleRank: '49/133', color: '#bbb4dc' },
    { label: 'FOF', percent: 0.11, count: 2, countRank: '42/160', total: 1.40, scaleRank: '71/83', color: '#91c6c2' },
  ],
  // Example counts reproduce the displayed percentages to the nearest whole percent.
  ratings: [
    { rating: 5, percent: 7, exampleCount: 7 },
    { rating: 4, percent: 7, exampleCount: 7 },
    { rating: 3, percent: 27, exampleCount: 27 },
    { rating: 2, percent: 9, exampleCount: 9 },
    { rating: 1, percent: 2, exampleCount: 2 },
    { rating: null, percent: 49, exampleCount: 49 },
  ],
  managerRatings: [
    { rating: 5, percent: 5, exampleCount: 5 },
    { rating: 4, percent: 10, exampleCount: 10 },
    { rating: 3, percent: 20, exampleCount: 20 },
    { rating: 2, percent: 5, exampleCount: 5 },
    { rating: 1, percent: 3, exampleCount: 3 },
    { rating: null, percent: 57, exampleCount: 57 },
  ],
  ratedFunds: [
    { name: '安信新回报灵活配置混合A', rating: 5, annual: 24.99, returns: 95.38, drawdown: 57.68, status: '可申购｜可赎回', type: '混合型' },
    { name: '安信新回报灵活配置混合C', rating: 5, annual: 24.74, returns: 94.22, drawdown: 57.71, status: '可申购｜可赎回', type: '混合型' },
    { name: '安信新价值灵活配置混合A', rating: 5, annual: 8.62, returns: 28.20, drawdown: 4.89, status: '可申购｜可赎回', type: '混合型' },
    { name: '安信新价值灵活配置混合C', rating: 5, annual: 8.41, returns: 27.43, drawdown: 4.95, status: '可申购｜可赎回', type: '混合型' },
    { name: '安信新优选灵活配置混合A', rating: 5, annual: 4.65, returns: 14.63, drawdown: 4.52, status: '可申购｜可赎回', type: '混合型' },
    { name: '安信价值驱动三年持有期混合', rating: 5, annual: 1.61, returns: 4.91, drawdown: 24.32, status: '可申购｜可赎回', type: '混合型' },
    { name: '安信华享纯债债券C', rating: 1, annual: 2.91, returns: 9.00, drawdown: 2.53, status: '可申购｜可赎回', type: '债券型' },
    { name: '安信永鑫增强债券A', rating: 2, annual: 2.72, returns: 8.38, drawdown: 3.74, status: '可申购｜可赎回', type: '债券型' },
    { name: '安信永鑫增强债券C', rating: 2, annual: 2.61, returns: 8.05, drawdown: 3.76, status: '可申购｜可赎回', type: '债券型' },
    { name: '安信瑞鸿中短债债券A', rating: 1, annual: 1.71, returns: 5.22, drawdown: 0.28, status: '不可申购｜可赎回', type: '债券型' },
    { name: '安信瑞鸿中短债债券B', rating: 1, annual: 1.71, returns: 5.22, drawdown: 0.27, status: '不可申购｜可赎回', type: '债券型' },
    { name: '安信瑞鸿中短债债券C', rating: 1, annual: 1.41, returns: 4.29, drawdown: 0.30, status: '不可申购｜可赎回', type: '债券型' },
  ],
  funds: [
    { name: '安信新回报灵活配置混合A', code: '002770', type: '混合型', manager: '陈鹏', founded: '2016-05-09', rating3: 5, rating5: 5, navDate: '2026-11-20', returns: -43.90, rank: '5116/5959' },
    { name: '安信新回报灵活配置混合C', code: '002771', type: '混合型', manager: '陈鹏', founded: '2016-05-09', rating3: 5, rating5: 5, navDate: '2026-11-20', returns: -43.95, rank: '5123/5959' },
    { name: '安信新价值灵活配置混合A', code: '003026', type: '混合型', manager: '梁冰哲｜柴迪伊', founded: '2016-08-19', rating3: 5, rating5: 5, navDate: '2026-11-20', returns: -0.10, rank: '268/1472' },
    { name: '安信新价值灵活配置混合C', code: '003027', type: '混合型', manager: '梁冰哲｜柴迪伊', founded: '2016-08-19', rating3: 5, rating5: 5, navDate: '2026-11-20', returns: -0.21, rank: '289/1472' },
    { name: '安信新优选灵活配置混合A', code: '003028', type: '混合型', manager: '张明｜应隽', founded: '2016-07-28', rating3: 5, rating5: 5, navDate: '2026-11-20', returns: 1.63, rank: '68/1472' },
    { name: '安信新优选灵活配置混合C', code: '003029', type: '混合型', manager: '张明｜应隽', founded: '2016-07-28', rating3: 5, rating5: 5, navDate: '2026-11-20', returns: 1.58, rank: '74/1472' },
    { name: '安信价值驱动三年持有期混合', code: '008477', type: '混合型', manager: '陈思', founded: '2020-01-15', rating3: 5, rating5: null, navDate: '2026-11-20', returns: -17.16, rank: '1671/5959' },
    { name: '安信成长精选混合A', code: '010033', type: '混合型', manager: '陈鹏', founded: '2020-09-29', rating3: 5, rating5: 4, navDate: '2026-11-20', returns: -44.64, rank: '5183/5959' },
    { name: '安信成长精选混合C', code: '010034', type: '混合型', manager: '陈鹏', founded: '2020-09-29', rating3: 5, rating5: 4, navDate: '2026-11-20', returns: -44.78, rank: '5196/5959' },
    { name: '安信浩盈6个月持有期混合A', code: '010408', type: '混合型', manager: '张竞｜张睿', founded: '2020-12-30', rating3: 5, rating5: null, navDate: '2026-11-20', returns: -3.47, rank: '903/1472' },
  ],
  managers: [
    { name: '陈鹏', type: '偏股型', scale: 40.34, tenure: 17.8, experience: 23, count: 8, product: '安信新回报灵活配置混合A', annual: 15.31, returns: -8.37 },
    { name: '蓝雁书', type: '偏股型', scale: 0.54, tenure: 5.6, experience: 20, count: 2, product: '安信价值启航混合A', annual: -61.80, returns: -16.61 },
    { name: '占冠良', type: 'FOF型', scale: 6.04, tenure: 11.2, experience: 25, count: 6, product: '安信禧悦稳健养老目标一年持有期混合(FOF)A', annual: 1.89, returns: -9.09 },
    { name: '聂世林', type: '偏股型', scale: 38.65, tenure: 10.7, experience: 19, count: 10, product: '安信优势增长灵活配置混合A', annual: 10.90, returns: -22.71 },
    { name: '陈一峰', type: '偏股型', scale: 28.70, tenure: 12.5, experience: 18, count: 9, product: '安信价值精选股票A', annual: 12.34, returns: -4.91 },
    { name: '王涛', type: '偏债型', scale: 96.89, tenure: 10.5, experience: 23, count: 9, product: '安信丰泽39个月定期开放债券', annual: 2.53, returns: 2.43 },
    { name: '张明', type: '偏股型', scale: 15.00, tenure: 9.5, experience: 15, count: 13, product: '安信企业价值优选混合A', annual: 9.86, returns: 0.47 },
    { name: '谭珏娜', type: '偏股型', scale: 0.18, tenure: 8.7, experience: 20, count: 2, product: '安信工业4.0主题沪港深精选灵活配置混合A', annual: -7.44, returns: -28.66 },
    { name: '张竞', type: '偏股型', scale: 50.67, tenure: 8.9, experience: 19, count: 17, product: '安信策略精选灵活配置混合A', annual: 9.98, returns: -11.74 },
    { name: '郭成东', type: '偏股型', scale: 0.13, tenure: 6.8, experience: 24, count: 2, product: '安信港股通臻选混合A', annual: -32.42, returns: -31.89 },
  ],
};

const managerRatingSeeds = [
  { name: '陈鹏', fundType: '混合型', rating: 5, return1y: 24.99, return3y: 95.38, maxReturn: 675.23, drawdown: 58.14 },
  { name: '聂世林', fundType: '混合型', rating: 5, return1y: -23.91, return3y: 8.18, maxReturn: 143.92, drawdown: 27.78 },
  { name: '陈一峰', fundType: '股票型', rating: 5, return1y: -6.45, return3y: 9.48, maxReturn: 362.13, drawdown: 40.44 },
  { name: '王涛', fundType: '债券型', rating: 5, return1y: 2.38, return3y: 9.49, maxReturn: 41.74, drawdown: 2.96 },
  { name: '张明', fundType: '混合型', rating: 5, return1y: 0.47, return3y: 13.49, maxReturn: 82.32, drawdown: 37.18 },
  { name: '张竞', fundType: '混合型', rating: 4, return1y: -11.74, return3y: 19.43, maxReturn: 204.15, drawdown: 30.17 },
  { name: '占冠良', fundType: 'FOF', rating: 3, return1y: -8.67, return3y: -0.03, maxReturn: 46.17, drawdown: 62.79 },
  { name: '蓝雁书', fundType: '混合型', rating: 2, return1y: -18.59, return3y: -18.59, maxReturn: 52.49, drawdown: 29.84 },
  { name: '郭成东', fundType: '混合型', rating: 1, return1y: -31.89, return3y: -46.29, maxReturn: 46.21, drawdown: 66.07 },
  { name: '谭珏娜', fundType: '混合型', rating: null, return1y: -28.66, return3y: -23.12, maxReturn: 138.75, drawdown: 58.41 },
];

// Complete the prototype distribution with fictional managers for each rating bucket.
export const managerRatingExamples = companyData.managerRatings.flatMap(({ rating, exampleCount }) => {
  const seeds = managerRatingSeeds.filter(manager => manager.rating === rating).map(manager => ({
    ...manager,
    product: companyData.managers.find(item => item.name === manager.name).product,
  }));
  const remaining = Array.from({ length: exampleCount - seeds.length }, (_, index) => {
    const grade = rating ?? 0;
    const id = `${grade}${String(index + 1).padStart(2, '0')}`;
    const { label: fundType } = companyData.products[index % companyData.products.length];
    const moneyMarket = fundType === '货币型';
    return {
      name: `示例经理 ${id}`, product: `示例${fundType}基金 ${id}`, fundType, rating,
      return1y: moneyMarket ? 1.25 + index % 8 / 20 : grade * 3.2 - 11 + index % 9 * 1.14,
      return3y: moneyMarket ? 4.5 + index % 7 / 10 : grade * 11.4 - 24 + index % 11 * 2.18,
      maxReturn: moneyMarket ? 6.7 + index % 11 / 10 : grade * 38.2 + 30 + index % 17 * 3.25,
      drawdown: moneyMarket ? 0.08 + index % 5 / 100 : 14 + index % 19 * 1.45 + (5 - grade) * 2.2,
    };
  });
  return [...seeds, ...remaining];
});

export const fundCategories = [
  ['股票型', [
    '普通股票型', '行业股票型-科技', '行业股票型-消费', '行业股票型-医药卫生',
    '行业股票型-制造', '行业股票型-其他', '被动指数股票型', '增强指数股票型',
  ]],
  ['混合型', [
    '偏股混合型', '平衡混合型', '偏债混合型', '灵活配置混合型', '行业混合型-科技',
    '行业混合型-消费', '行业混合型-医药卫生', '行业混合型-制造', '行业混合型-其他', '其他混合型',
  ]],
  ['债券型', [
    '短期纯债型', '中长期纯债型', '混合债券型一级', '混合债券型二级', '可转债型',
    '利率债型', '信用债型', '被动指数债券型', '增强指数债券型', '其他债券型',
  ]],
  ['货币型', ['普通货币型', '场内货币型', '短期理财型']],
  ['FOF', ['股票型FOF', '混合型FOF', '债券型FOF', '养老目标FOF']],
];

const exampleFundTypes = fundCategories.flatMap(([type, subtypes]) =>
  subtypes.map(subtype => ({ type, subtype })),
);

// Add fictional entries so both status tabs and the full filter hierarchy can be exercised.
function makeFundExamples(count, status, offset) {
  const running = status === 'running';
  return Array.from({ length: count }, (_, index) => {
    // Every fourth share class belongs to the preceding fund's main code.
    const isMaster = index % 4 !== 3;
    const product = index - Math.floor((index + 1) / 4);
    const typeIndex = product % exampleFundTypes.length;
    const { type, subtype } = exampleFundTypes[typeIndex];
    const id = String(offset + product + 1).padStart(3, '0');
    const year = 2013 + product % 11;
    const month = String(product % 12 + 1).padStart(2, '0');
    const finalYear = running ? 2026 : Math.min(2025, year + 2 + product % 3);
    const years = finalYear - year - Number(running && month === '12');
    const rankTotal = 580 + typeIndex * 7;
    const returns = type === '货币型' ? 0.65 + product % 12 / 100 : (product * 73 % 3800 - 1250) / 100;
    return {
      name: `示例${subtype}基金 ${id}${isMaster ? 'A' : 'C'}`,
      code: String(990001 + offset + index),
      type,
      subtype,
      status,
      isMaster,
      manager: `示例经理 ${String(product % 28 + 1).padStart(2, '0')}`,
      founded: `${year}-${month}-08`,
      rating3: years >= 3 ? product % 5 + 1 : null,
      rating5: years >= 5 ? (product + 2) % 5 + 1 : null,
      navDate: running ? '2026-11-20' : `${finalYear}-${month}-20`,
      returns: Number((returns - (isMaster ? 0 : 0.05)).toFixed(2)),
      rank: `${(product * 19 + Number(!isMaster)) % rankTotal + 1}/${rankTotal}`,
    };
  });
}

const originalFundExamples = companyData.funds.map(fund => ({
  ...fund,
  subtype: fund.name.includes('灵活配置') ? '灵活配置混合型' : '偏股混合型',
  status: 'running',
  isMaster: !/[BCEIY]$/.test(fund.name),
}));
const runningFundExamples = makeFundExamples(229 - originalFundExamples.length, 'running', 0);

export const fundListExamples = [
  ...originalFundExamples,
  ...runningFundExamples,
  ...makeFundExamples(54, 'liquidated', runningFundExamples.length),
];
