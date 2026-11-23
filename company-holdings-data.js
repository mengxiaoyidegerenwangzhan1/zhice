// Prototype data. Reference snapshots transcribe the supplied design, and
// earlier periods and rows beyond the reference are simulated for interaction.

export const assetCategories = [
  '债券', '股票', '银行存款', '买入返售金融资产', '其他资产', '基金', '资产支持证券',
];

const assetSnapshots = [
  ['2024-03-31', [56.31, 27.14, 10.28, 5.20, 0.90, 0.14, 0.03]],
  ['2024-06-30', [57.60, 25.90, 9.74, 5.63, 0.97, 0.14, 0.02]],
  ['2024-09-30', [59.20, 25.70, 10.06, 4.03, 0.85, 0.13, 0.03]],
  ['2024-12-31', [58.32, 26.24, 9.60, 4.83, 0.85, 0.13, 0.03]],
  ['2025-03-31', [60.90, 24.80, 9.08, 4.22, 0.86, 0.12, 0.02]],
  ['2025-06-30', [59.87, 25.16, 10.40, 3.51, 0.92, 0.12, 0.02]],
  ['2025-09-30', [61.41, 24.68, 9.85, 3.00, 0.93, 0.11, 0.02]],
  ['2025-12-31', [62.35, 26.42, 8.13, 2.10, 0.87, 0.11, 0.02]],
  ['2026-03-31', [67.42, 24.35, 4.46, 2.77, 0.87, 0.11, 0.02]],
  // Keep the underlying precision so the displayed ratios and changes both
  // round to the reference values without making the stacked series exceed 100%.
  ['2026-06-30', [65.438, 23.665, 7.817, 1.928, 1.037, 0.097, 0.018]],
  ['2026-09-30', [65.469, 22.329, 7.149, 4.089, 0.849, 0.099, 0.016]],
];

export const assetHistory = assetSnapshots.map(([date, values]) => ({ date, values }));

const industryBreakdown = [
  ['电子', 7.65], ['医药生物', 2.43], ['通信', 2.28], ['食品饮料', 1.65],
  ['电力设备', 1.49], ['石油石化', 1.33], ['有色金属', 1.16], ['银行', 1.14],
  ['机械设备', 1.14], ['建筑材料', 0.94], ['家用电器', 0.82], ['汽车', 0.72],
  ['煤炭', 0.60], ['基础化工', 0.54], ['房地产', 0.47], ['传媒', 0.43],
  ['轻工制造', 0.36], ['非银金融', 0.30], ['计算机', 0.26], ['公用事业', 0.24],
  ['钢铁', 0.19], ['农林牧渔', 0.17], ['国防军工', 0.16], ['纺织服饰', 0.14],
  ['商贸零售', 0.10], ['建筑装饰', 0.10], ['交通运输', 0.07], ['环保', 0.06],
  ['美容护理', 0.05], ['社会服务', 0.03], ['综合', 0.02],
];

export const industryCategories = industryBreakdown.map(([name]) => name);
const finalIndustryWeights = industryBreakdown.map(([, weight]) => weight);
const industryPeriods = [
  // date, total weight, visible anchor industries in industryBreakdown order
  ['2023-12-31', 21.24, [1.25, 4.12, 0.59, 2.27, 2.34, 0.85], { 农林牧渔: 0.42 }],
  ['2024-06-30', 17.67, [1.29, 2.63, 0.73, 1.87, 1.56, 0.76]],
  ['2024-12-31', 17.81, [1.18, 2.58, 0.79, 1.76, 1.55, 0.79]],
  ['2025-06-30', 19.08, [1.91, 2.76, 0.92, 1.79, 1.53, 0.83]],
  ['2025-12-31', 28.84, [4.18, 4.96, 1.43, 2.84, 2.25, 1.26]],
];

const rounded = value => Math.round(value * 100) / 100;
const sum = values => values.reduce((total, value) => total + value, 0);

export const industryHistory = [
  ...industryPeriods.map(([date, total, leading, reference = {}]) => {
    const remainder = industryBreakdown.slice(leading.length);
    const simulatedWeights = remainder.filter(([name]) => !Object.hasOwn(reference, name)).map(([, weight]) => weight);
    const scale = (total - sum(leading) - sum(Object.values(reference))) / sum(simulatedWeights);
    return { date, values: [...leading, ...remainder.map(([name, weight]) => reference[name] ?? rounded(weight * scale))] };
  }),
  { date: '2026-06-30', values: finalIndustryWeights },
];

export const stockReportDates = industryHistory.map(({ date }) => date).reverse();

const referenceStockRows = [
  ['000001', '平安银行', 12.36, 0.00, '减持', 9.32, 5.45, '银行'],
  ['000032', '深桑达A', 30.94, 0.00, '新进', -48.04, -123.41, '建筑装饰'],
  ['000034', '神州数码', 66.60, 0.00, '增持', -37.81, 30.17, '计算机'],
  ['000035', '中国天楹', 2.51, 0.00, '新进', -33.03, 37.09, '环保'],
  ['000039', '中集集团', 183.04, 0.01, '增持', 4.82, 470.13, '机械设备'],
  ['000050', '深天马A', 156.28, 0.00, '减持', -42.34, -9.03, '电子'],
  ['000060', '中金岭南', 105.22, 0.00, '增持', -12.47, 15.23, '有色金属'],
  ['000063', '中兴通讯', 1165.69, 0.03, '减持', -32.25, 28.88, '通信'],
  ['000100', 'TCL科技', 2059.87, 0.06, '增持', 19.24, 16.32, '电子'],
  ['00013', '和黄医药', 1206.02, 0.04, '增持', -8.24, null, '医药生物'],
];

const changes = ['增持', '减持', '新进', '持平'];
const referenceStocks = referenceStockRows.map(([code, name, value, weight, change, return1y, pe, industry]) =>
  ({ code, name, value, weight, change, return1y, pe, industry }));

export function getStockHoldings(date = stockReportDates[0]) {
  const period = Math.max(0, stockReportDates.indexOf(date));
  const reference = referenceStocks.map((stock, index) => {
    if (!period) return { ...stock };
    const value = rounded(stock.value * (1 + ((index + period) % 5 - 2) * 0.065 * period));
    return {
      ...stock,
      value,
      weight: rounded(value / 35000),
      change: changes[(index + period) % changes.length],
      return1y: rounded(stock.return1y + ((index + period) % 7 - 2) * period * 1.29),
      pe: stock.pe == null ? null : rounded(stock.pe * (1 + (index % 3 - 1) * period * 0.03)),
    };
  });
  const examples = Array.from({ length: 30 }, (_, index) => {
    const industry = industryCategories[(index * 7) % industryCategories.length];
    const value = rounded(20 + ((index * 681.43 + period * 97.43) % 1800));
    return {
      code: String(990001 + index),
      name: `示例股票${String(index + 1).padStart(2, '0')}`,
      value,
      weight: rounded(value / 35000),
      change: changes[(index + period) % changes.length],
      return1y: rounded(((index * 7.28 + period * 9.44) % 100) - 45),
      pe: index % 13 === 0 ? null : rounded(7.04 + ((index * 4.28 + period * 2.01) % 42)),
      industry,
    };
  });
  return [...reference, ...examples];
}
