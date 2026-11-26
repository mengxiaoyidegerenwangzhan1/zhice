// Prototype sample data from the company-list design. Figures beyond the design
// demonstrate filtering and pagination and do not represent published results.
const rows = [
  // ID, company name, short name, founding date, capital, total scale,
  // non-money-market scale, fund count, manager count, types in display order.
  ['essence', '安信基金管理有限责任公司', '安信基金', '2011-12-06', 5.0625, 1200.63, 926.47, 114, 40, ['混合型', '债券型', '货币型', '股票型', 'FOF']],
  ['gffunds', '广发基金管理有限公司', '广发基金', '2012-07-15', 4.875, 980.45, 850.30, 120, 45, ['股票型', '混合型', '债券型', '货币型', 'FOF']],
  ['chinaamc', '华夏基金管理有限公司', '华夏基金', '2013-04-20', 3.95, 860.32, 760.50, 130, 37, ['债券型', '货币型', '股票型', '混合型']],
  ['efunds', '易方达基金管理有限公司', '易方达基金', '2010-03-12', 5.25, 1100.78, 900.12, 115, 42, ['混合型', '债券型', '股票型', '货币型', 'FOF']],
  ['cmfchina', '招商基金管理有限公司', '招商基金', '2014-11-08', 4.375, 780.55, 670.20, 110, 35, ['货币型', '股票型', '债券型']],
  ['yinhua', '银华基金管理股份有限公司', '银华基金', '2015-06-14', 3.75, 650.88, 590.55, 100, 30, ['混合型', '债券型', '货币型', 'FOF']],
  ['fullgoal', '富国基金管理有限公司', '富国基金', '2009-09-25', 5.5, 1250.45, 1050.60, 140, 47, ['股票型', '混合型', '债券型', '货币型', 'FOF']],
  ['nffund', '南方基金管理股份有限公司', '南方基金', '2013-01-30', 4.125, 700.12, 640.33, 105, 32, ['债券型', '货币型', '混合型']],
  ['huatai-pb', '华泰柏瑞基金管理有限公司', '华泰柏瑞基金', '2008-05-18', 6, 1350.90, 1150.75, 150, 50, ['混合型', '股票型', '债券型', '货币型', 'FOF']],
  ['bosera', '博时基金管理有限公司', '博时基金', '2011-10-22', 4.625, 900.25, 820.40, 125, 38, ['货币型', '混合型', '债券型', '股票型']],
  ['icbccs', '工银瑞信基金管理有限公司', '工银瑞信基金', '2005-06-21', 2, 3370.20, 2280.55, 318, 53, ['债券型', '混合型', '股票型', '货币型', 'FOF']],
  ['harvest', '嘉实基金管理有限公司', '嘉实基金', '1999-03-25', 1.5, 2125.40, 1684.72, 286, 58, ['股票型', '混合型', '债券型', '货币型', 'FOF']],
  ['gtfund', '国泰基金管理有限公司', '国泰基金', '1998-03-05', 1.1, 1490.60, 1078.45, 192, 42, ['股票型', '债券型', '混合型', '货币型']],
  ['fortune', '华商基金管理有限公司', '华商基金', '2005-12-20', 1, 426.85, 379.41, 78, 22, ['混合型', '债券型', '股票型', '货币型']],
  ['aes', '泉果基金管理有限公司', '泉果基金', '2022-02-08', 1, 84.26, 84.26, 8, 4, ['混合型', '债券型']],
];

function distributeScale(nonMoneyScale, cashScale, types) {
  const nonMoneyTypes = types.filter(type => type !== '货币型');
  const totalCents = Math.round(nonMoneyScale * 100);
  const totalWeight = nonMoneyTypes.length * (nonMoneyTypes.length + 1) / 2;
  let allocatedCents = 0;
  const scaleByType = {};

  nonMoneyTypes.forEach((type, index) => {
    const weight = nonMoneyTypes.length - index;
    const cents = index === nonMoneyTypes.length - 1
      ? totalCents - allocatedCents
      : Math.round(totalCents * weight / totalWeight);
    scaleByType[type] = cents / 100;
    allocatedCents += cents;
  });

  if (types.includes('货币型')) scaleByType['货币型'] = Math.round(cashScale * 100) / 100;
  return scaleByType;
}

export const companyList = rows.map(([
  id, name, shortName, founded, capital, totalScale, nonMoneyScale, fundCount, managerCount, types,
]) => ({
  id, name, shortName, founded, capital, totalScale, nonMoneyScale, fundCount, managerCount, types,
  legalRepresentative: id === 'essence' ? '刘入领' : '',
  scaleByType: id === 'essence'
    ? { '混合型': 448.37, '债券型': 413.87, '货币型': 274.16, '股票型': 62.82, FOF: 1.41 }
    : distributeScale(nonMoneyScale, totalScale - nonMoneyScale, types),
}));

function orderedNameRanges(name, keyword) {
  const ranges = [];
  let offset = 0;
  for (const character of keyword) {
    const index = name.indexOf(character, offset);
    if (index === -1) return null;
    offset = index + character.length;
    ranges.push([index, offset]);
  }
  return ranges;
}

function companyNameRanges(company, query) {
  const keyword = query.trim().toLocaleLowerCase();
  if (!keyword) return [];

  const name = company.name.toLocaleLowerCase();
  const ranges = [];
  let index = name.indexOf(keyword);
  while (index !== -1) {
    const end = index + keyword.length;
    ranges.push([index, end]);
    index = name.indexOf(keyword, end);
  }
  if (ranges.length) return ranges;

  // Permit skipped characters in the short name, which omits the legal suffix.
  if (!orderedNameRanges(company.shortName.toLocaleLowerCase(), keyword)) return null;
  return orderedNameRanges(name, keyword) ?? [];
}

export function companyMatchesQuery(company, query) {
  return companyNameRanges(company, query) !== null;
}

export function companyNameParts(company, query) {
  const parts = [];
  let offset = 0;
  for (const [start, end] of companyNameRanges(company, query) ?? []) {
    if (start > offset) parts.push({ text: company.name.slice(offset, start), matched: false });
    parts.push({ text: company.name.slice(start, end), matched: true });
    offset = end;
  }
  if (offset < company.name.length) parts.push({ text: company.name.slice(offset), matched: false });
  return parts;
}
