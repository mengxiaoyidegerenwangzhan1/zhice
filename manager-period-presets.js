const percent = '%';

// Thresholds are ordered by manager type: general, equity, bond.
const returnThresholds = {
  short: [[0, 1, 5, 10], [0, 3, 5, 10], [0, .5, 1, 2]],
  year: [[0, 3, 10, 20], [0, 5, 10, 20], [0, 1, 3, 5]],
  long: [[0, 5, 20, 40], [0, 10, 30, 50], [0, 3, 10, 20]],
};
const drawdownThresholds = {
  short: [[1, 5, 10, 20], [5, 10, 15, 20], [.5, 1, 3, 5]],
  long: [[3, 10, 20, 40], [10, 20, 30, 40], [1, 3, 5, 10]],
};
const ratioThresholds = [0, .5, 1, 2];

const shortPeriod = period => period === '3m' || period === '6m';
const returnPeriod = period => shortPeriod(period) ? 'short' : period === '1y' ? 'year' : 'long';
const drawdownPeriod = period => shortPeriod(period) ? 'short' : 'long';

const configurations = {
  return: {label: '收益率', unit: percent, thresholds: period => returnThresholds[returnPeriod(period)]},
  cagr: {label: '收益率', unit: percent, thresholds: () => returnThresholds.year},
  excessCagr: {label: '收益率', unit: percent, thresholds: () => [[0, 1, 3, 5], [0, 2, 5, 10], [0, .5, 1, 2]]},
  maxDrawdown: {label: '最大回撤率', unit: percent, upperBound: true, thresholds: period => drawdownThresholds[drawdownPeriod(period)]},
  volatility: {label: '年化波动率', unit: percent, upperBound: true, thresholds: () => [[3, 10, 20, 30], [10, 15, 20, 30], [1, 3, 5, 10]]},
  downsideRisk: {label: '下行风险', unit: percent, upperBound: true, thresholds: () => [[3, 5, 10, 20], [5, 10, 15, 20], [1, 2, 3, 5]]},
  sharpe: {label: '夏普比率', unit: '', fixed: ratioThresholds},
  informationRatio: {label: '信息比率', unit: '', fixed: [0, .25, .5, 1]},
  calmar: {label: '收益回撤比', unit: '', fixed: ratioThresholds},
  sortino: {label: '索提诺比率', unit: '', fixed: ratioThresholds},
  treynor: {label: '特雷诺比率', unit: percent, fixed: [0, 3, 5, 10]},
};

export function performanceValueConfig(metric, period, types) {
  const {label, unit, upperBound, thresholds, fixed} = configurations[metric];
  let typeIndex = 0;
  if (types.length === 1) {
    if (types[0] === '偏股型') typeIndex = 1;
    if (types[0] === '偏债型') typeIndex = 2;
  }
  const values = fixed ?? thresholds(period)[typeIndex];
  return {
    label,
    unit,
    presets: values.map(value => ({
      label: `${upperBound ? '≤' : '≥'}${value}${unit}`,
      min: upperBound ? null : value,
      max: upperBound ? value : null,
    })),
  };
}
