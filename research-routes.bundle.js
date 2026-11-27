var ZhiceResearchRoutes = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // dist/research-routes.js
  var research_routes_exports = {};
  __export(research_routes_exports, {
    getManagerListData: () => getManagerListData,
    mountCompanyDetail: () => mountCompanyDetail,
    mountCompanyList: () => mountCompanyList,
    mountManagerList: () => mountManagerList,
    renderManagerDetail: () => renderManagerDetail
  });

  // dist/company-detail-data.js?v=20261123-affiliated-funds
  var companyData = {
    name: "\u5B89\u4FE1\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u8D23\u4EFB\u516C\u53F8",
    founded: "2011-12-06",
    capital: "5.0625",
    legalRepresentative: "\u5218\u5165\u9886",
    generalManager: "\u5218\u5165\u9886",
    url: "https://www.essencefund.com/",
    metrics: [
      { label: "\u603B\u89C4\u6A21", value: 1200.63, unit: "\u4EBF", rank: 63, total: 163 },
      { label: "\u975E\u8D27\u5E01\u7406\u8D22\u89C4\u6A21", value: 926.47, unit: "\u4EBF", rank: 54, total: 162 },
      { label: "\u65D7\u4E0B\u57FA\u91D1\u6570", value: 114, unit: "\u53EA", rank: 34, total: 163 },
      { label: "\u65D7\u4E0B\u57FA\u91D1\u7ECF\u7406\u6570", value: 40, unit: "\u4EBA", rank: 33, total: 163 }
    ],
    scaleAnnual: [
      { year: 2026, total: 1200.63, change: 149.95, rank: "63/163", fundCount: 114 },
      { year: 2025, total: 1050.68, change: -108.67, rank: "66/164", fundCount: 107 },
      { year: 2024, total: 1159.35, change: -125.88, rank: "58/183", fundCount: 95 },
      { year: 2023, total: 1285.22, change: -45.06, rank: "44/186", fundCount: 87 },
      { year: 2022, total: 1330.29, change: 153.73, rank: "37/183", fundCount: 83 }
    ],
    // Quarterly values approximate the chart in the source screenshot.
    // The annual table above retains the reported figures.
    scale: [
      { date: "2022-03-31", total: 1190, change: 260 },
      { date: "2022-06-30", total: 1405, change: 215 },
      { date: "2022-09-30", total: 1500, change: 90 },
      { date: "2022-12-31", total: 1485, change: -10 },
      { date: "2023-03-31", total: 1340, change: -150 },
      { date: "2023-06-30", total: 1330, change: -10 },
      { date: "2023-09-30", total: 1365, change: 35 },
      { date: "2023-12-31", total: 1335, change: -30 },
      { date: "2024-03-31", total: 1295, change: -40 },
      { date: "2024-06-30", total: 1155, change: -140 },
      { date: "2024-09-30", total: 1290, change: 135 },
      { date: "2024-12-31", total: 1155, change: -135 },
      { date: "2025-03-31", total: 1165, change: 10 },
      { date: "2025-06-30", total: 1105, change: -55 },
      { date: "2025-09-30", total: 1090, change: -15 },
      { date: "2025-12-31", total: 1030, change: -60 },
      { date: "2026-03-31", total: 1055, change: 25 },
      { date: "2026-06-30", total: 1195, change: 130 },
      { date: "2026-09-30", total: 1245, change: 45 },
      { date: "2026-11-20", total: 1200.63, change: -35 }
    ],
    products: [
      { label: "\u6DF7\u5408\u578B", percent: 37.34, count: 47, countRank: "27/160", total: 448.37, scaleRank: "25/162", color: "#e387a2" },
      { label: "\u503A\u5238\u578B", percent: 34.47, count: 25, countRank: "42/160", total: 413.87, scaleRank: "65/156", color: "#e3cc87" },
      { label: "\u8D27\u5E01\u578B", percent: 22.83, count: 3, countRank: "29/160", total: 274.16, scaleRank: "67/119", color: "#aec9a0" },
      { label: "\u80A1\u7968\u578B", percent: 5.23, count: 4, countRank: "33/160", total: 62.82, scaleRank: "49/133", color: "#bbb4dc" },
      { label: "FOF", percent: 0.11, count: 2, countRank: "42/160", total: 1.4, scaleRank: "71/83", color: "#91c6c2" }
    ],
    // Example counts reproduce the displayed percentages to the nearest whole percent.
    ratings: [
      { rating: 5, percent: 7, exampleCount: 7 },
      { rating: 4, percent: 7, exampleCount: 7 },
      { rating: 3, percent: 27, exampleCount: 27 },
      { rating: 2, percent: 9, exampleCount: 9 },
      { rating: 1, percent: 2, exampleCount: 2 },
      { rating: null, percent: 49, exampleCount: 49 }
    ],
    managerRatings: [
      { rating: 5, percent: 5, exampleCount: 5 },
      { rating: 4, percent: 10, exampleCount: 10 },
      { rating: 3, percent: 20, exampleCount: 20 },
      { rating: 2, percent: 5, exampleCount: 5 },
      { rating: 1, percent: 3, exampleCount: 3 },
      { rating: null, percent: 57, exampleCount: 57 }
    ],
    ratedFunds: [
      { name: "\u5B89\u4FE1\u65B0\u56DE\u62A5\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", rating: 5, annual: 24.99, returns: 95.38, drawdown: 57.68, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u6DF7\u5408\u578B" },
      { name: "\u5B89\u4FE1\u65B0\u56DE\u62A5\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408C", rating: 5, annual: 24.74, returns: 94.22, drawdown: 57.71, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u6DF7\u5408\u578B" },
      { name: "\u5B89\u4FE1\u65B0\u4EF7\u503C\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", rating: 5, annual: 8.62, returns: 28.2, drawdown: 4.89, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u6DF7\u5408\u578B" },
      { name: "\u5B89\u4FE1\u65B0\u4EF7\u503C\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408C", rating: 5, annual: 8.41, returns: 27.43, drawdown: 4.95, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u6DF7\u5408\u578B" },
      { name: "\u5B89\u4FE1\u65B0\u4F18\u9009\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", rating: 5, annual: 4.65, returns: 14.63, drawdown: 4.52, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u6DF7\u5408\u578B" },
      { name: "\u5B89\u4FE1\u4EF7\u503C\u9A71\u52A8\u4E09\u5E74\u6301\u6709\u671F\u6DF7\u5408", rating: 5, annual: 1.61, returns: 4.91, drawdown: 24.32, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u6DF7\u5408\u578B" },
      { name: "\u5B89\u4FE1\u534E\u4EAB\u7EAF\u503A\u503A\u5238C", rating: 1, annual: 2.91, returns: 9, drawdown: 2.53, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u503A\u5238\u578B" },
      { name: "\u5B89\u4FE1\u6C38\u946B\u589E\u5F3A\u503A\u5238A", rating: 2, annual: 2.72, returns: 8.38, drawdown: 3.74, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u503A\u5238\u578B" },
      { name: "\u5B89\u4FE1\u6C38\u946B\u589E\u5F3A\u503A\u5238C", rating: 2, annual: 2.61, returns: 8.05, drawdown: 3.76, status: "\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u503A\u5238\u578B" },
      { name: "\u5B89\u4FE1\u745E\u9E3F\u4E2D\u77ED\u503A\u503A\u5238A", rating: 1, annual: 1.71, returns: 5.22, drawdown: 0.28, status: "\u4E0D\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u503A\u5238\u578B" },
      { name: "\u5B89\u4FE1\u745E\u9E3F\u4E2D\u77ED\u503A\u503A\u5238B", rating: 1, annual: 1.71, returns: 5.22, drawdown: 0.27, status: "\u4E0D\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u503A\u5238\u578B" },
      { name: "\u5B89\u4FE1\u745E\u9E3F\u4E2D\u77ED\u503A\u503A\u5238C", rating: 1, annual: 1.41, returns: 4.29, drawdown: 0.3, status: "\u4E0D\u53EF\u7533\u8D2D\uFF5C\u53EF\u8D4E\u56DE", type: "\u503A\u5238\u578B" }
    ],
    funds: [
      { name: "\u5B89\u4FE1\u65B0\u56DE\u62A5\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", code: "002770", type: "\u6DF7\u5408\u578B", manager: "\u9648\u9E4F", founded: "2016-05-09", rating3: 5, rating5: 5, navDate: "2026-11-20", returns: -43.9, rank: "5116/5959" },
      { name: "\u5B89\u4FE1\u65B0\u56DE\u62A5\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408C", code: "002771", type: "\u6DF7\u5408\u578B", manager: "\u9648\u9E4F", founded: "2016-05-09", rating3: 5, rating5: 5, navDate: "2026-11-20", returns: -43.95, rank: "5123/5959" },
      { name: "\u5B89\u4FE1\u65B0\u4EF7\u503C\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", code: "003026", type: "\u6DF7\u5408\u578B", manager: "\u6881\u51B0\u54F2\uFF5C\u67F4\u8FEA\u4F0A", founded: "2016-08-19", rating3: 5, rating5: 5, navDate: "2026-11-20", returns: -0.1, rank: "268/1472" },
      { name: "\u5B89\u4FE1\u65B0\u4EF7\u503C\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408C", code: "003027", type: "\u6DF7\u5408\u578B", manager: "\u6881\u51B0\u54F2\uFF5C\u67F4\u8FEA\u4F0A", founded: "2016-08-19", rating3: 5, rating5: 5, navDate: "2026-11-20", returns: -0.21, rank: "289/1472" },
      { name: "\u5B89\u4FE1\u65B0\u4F18\u9009\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", code: "003028", type: "\u6DF7\u5408\u578B", manager: "\u5F20\u660E\uFF5C\u5E94\u96BD", founded: "2016-07-28", rating3: 5, rating5: 5, navDate: "2026-11-20", returns: 1.63, rank: "68/1472" },
      { name: "\u5B89\u4FE1\u65B0\u4F18\u9009\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408C", code: "003029", type: "\u6DF7\u5408\u578B", manager: "\u5F20\u660E\uFF5C\u5E94\u96BD", founded: "2016-07-28", rating3: 5, rating5: 5, navDate: "2026-11-20", returns: 1.58, rank: "74/1472" },
      { name: "\u5B89\u4FE1\u4EF7\u503C\u9A71\u52A8\u4E09\u5E74\u6301\u6709\u671F\u6DF7\u5408", code: "008477", type: "\u6DF7\u5408\u578B", manager: "\u9648\u601D", founded: "2020-01-15", rating3: 5, rating5: null, navDate: "2026-11-20", returns: -17.16, rank: "1671/5959" },
      { name: "\u5B89\u4FE1\u6210\u957F\u7CBE\u9009\u6DF7\u5408A", code: "010033", type: "\u6DF7\u5408\u578B", manager: "\u9648\u9E4F", founded: "2020-09-29", rating3: 5, rating5: 4, navDate: "2026-11-20", returns: -44.64, rank: "5183/5959" },
      { name: "\u5B89\u4FE1\u6210\u957F\u7CBE\u9009\u6DF7\u5408C", code: "010034", type: "\u6DF7\u5408\u578B", manager: "\u9648\u9E4F", founded: "2020-09-29", rating3: 5, rating5: 4, navDate: "2026-11-20", returns: -44.78, rank: "5196/5959" },
      { name: "\u5B89\u4FE1\u6D69\u76C86\u4E2A\u6708\u6301\u6709\u671F\u6DF7\u5408A", code: "010408", type: "\u6DF7\u5408\u578B", manager: "\u5F20\u7ADE\uFF5C\u5F20\u777F", founded: "2020-12-30", rating3: 5, rating5: null, navDate: "2026-11-20", returns: -3.47, rank: "903/1472" }
    ],
    managers: [
      { name: "\u9648\u9E4F", type: "\u504F\u80A1\u578B", scale: 40.34, tenure: 17.8, experience: 23, count: 8, product: "\u5B89\u4FE1\u65B0\u56DE\u62A5\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", annual: 15.31, returns: -8.37 },
      { name: "\u84DD\u96C1\u4E66", type: "\u504F\u80A1\u578B", scale: 0.54, tenure: 5.6, experience: 20, count: 2, product: "\u5B89\u4FE1\u4EF7\u503C\u542F\u822A\u6DF7\u5408A", annual: -61.8, returns: -16.61 },
      { name: "\u5360\u51A0\u826F", type: "FOF\u578B", scale: 6.04, tenure: 11.2, experience: 25, count: 6, product: "\u5B89\u4FE1\u79A7\u60A6\u7A33\u5065\u517B\u8001\u76EE\u6807\u4E00\u5E74\u6301\u6709\u671F\u6DF7\u5408(FOF)A", annual: 1.89, returns: -9.09 },
      { name: "\u8042\u4E16\u6797", type: "\u504F\u80A1\u578B", scale: 38.65, tenure: 10.7, experience: 19, count: 10, product: "\u5B89\u4FE1\u4F18\u52BF\u589E\u957F\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", annual: 10.9, returns: -22.71 },
      { name: "\u9648\u4E00\u5CF0", type: "\u504F\u80A1\u578B", scale: 28.7, tenure: 12.5, experience: 18, count: 9, product: "\u5B89\u4FE1\u4EF7\u503C\u7CBE\u9009\u80A1\u7968A", annual: 12.34, returns: -4.91 },
      { name: "\u738B\u6D9B", type: "\u504F\u503A\u578B", scale: 96.89, tenure: 10.5, experience: 23, count: 9, product: "\u5B89\u4FE1\u4E30\u6CFD39\u4E2A\u6708\u5B9A\u671F\u5F00\u653E\u503A\u5238", annual: 2.53, returns: 2.43 },
      { name: "\u5F20\u660E", type: "\u504F\u80A1\u578B", scale: 15, tenure: 9.5, experience: 15, count: 13, product: "\u5B89\u4FE1\u4F01\u4E1A\u4EF7\u503C\u4F18\u9009\u6DF7\u5408A", annual: 9.86, returns: 0.47 },
      { name: "\u8C2D\u73CF\u5A1C", type: "\u504F\u80A1\u578B", scale: 0.18, tenure: 8.7, experience: 20, count: 2, product: "\u5B89\u4FE1\u5DE5\u4E1A4.0\u4E3B\u9898\u6CAA\u6E2F\u6DF1\u7CBE\u9009\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", annual: -7.44, returns: -28.66 },
      { name: "\u5F20\u7ADE", type: "\u504F\u80A1\u578B", scale: 50.67, tenure: 8.9, experience: 19, count: 17, product: "\u5B89\u4FE1\u7B56\u7565\u7CBE\u9009\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408A", annual: 9.98, returns: -11.74 },
      { name: "\u90ED\u6210\u4E1C", type: "\u504F\u80A1\u578B", scale: 0.13, tenure: 6.8, experience: 24, count: 2, product: "\u5B89\u4FE1\u6E2F\u80A1\u901A\u81FB\u9009\u6DF7\u5408A", annual: -32.42, returns: -31.89 }
    ]
  };
  var managerRatingSeeds = [
    { name: "\u9648\u9E4F", fundType: "\u6DF7\u5408\u578B", rating: 5, return1y: 24.99, return3y: 95.38, maxReturn: 675.23, drawdown: 58.14 },
    { name: "\u8042\u4E16\u6797", fundType: "\u6DF7\u5408\u578B", rating: 5, return1y: -23.91, return3y: 8.18, maxReturn: 143.92, drawdown: 27.78 },
    { name: "\u9648\u4E00\u5CF0", fundType: "\u80A1\u7968\u578B", rating: 5, return1y: -6.45, return3y: 9.48, maxReturn: 362.13, drawdown: 40.44 },
    { name: "\u738B\u6D9B", fundType: "\u503A\u5238\u578B", rating: 5, return1y: 2.38, return3y: 9.49, maxReturn: 41.74, drawdown: 2.96 },
    { name: "\u5F20\u660E", fundType: "\u6DF7\u5408\u578B", rating: 5, return1y: 0.47, return3y: 13.49, maxReturn: 82.32, drawdown: 37.18 },
    { name: "\u5F20\u7ADE", fundType: "\u6DF7\u5408\u578B", rating: 4, return1y: -11.74, return3y: 19.43, maxReturn: 204.15, drawdown: 30.17 },
    { name: "\u5360\u51A0\u826F", fundType: "FOF", rating: 3, return1y: -8.67, return3y: -0.03, maxReturn: 46.17, drawdown: 62.79 },
    { name: "\u84DD\u96C1\u4E66", fundType: "\u6DF7\u5408\u578B", rating: 2, return1y: -18.59, return3y: -18.59, maxReturn: 52.49, drawdown: 29.84 },
    { name: "\u90ED\u6210\u4E1C", fundType: "\u6DF7\u5408\u578B", rating: 1, return1y: -31.89, return3y: -46.29, maxReturn: 46.21, drawdown: 66.07 },
    { name: "\u8C2D\u73CF\u5A1C", fundType: "\u6DF7\u5408\u578B", rating: null, return1y: -28.66, return3y: -23.12, maxReturn: 138.75, drawdown: 58.41 }
  ];
  var managerRatingExamples = companyData.managerRatings.flatMap(({ rating: rating2, exampleCount }) => {
    const seeds = managerRatingSeeds.filter((manager) => manager.rating === rating2).map((manager) => ({
      ...manager,
      product: companyData.managers.find((item) => item.name === manager.name).product
    }));
    const remaining = Array.from({ length: exampleCount - seeds.length }, (_, index) => {
      const grade = rating2 ?? 0;
      const id = `${grade}${String(index + 1).padStart(2, "0")}`;
      const { label: fundType } = companyData.products[index % companyData.products.length];
      const moneyMarket = fundType === "\u8D27\u5E01\u578B";
      return {
        name: `\u793A\u4F8B\u7ECF\u7406 ${id}`,
        product: `\u793A\u4F8B${fundType}\u57FA\u91D1 ${id}`,
        fundType,
        rating: rating2,
        return1y: moneyMarket ? 1.25 + index % 8 / 20 : grade * 3.2 - 11 + index % 9 * 1.14,
        return3y: moneyMarket ? 4.5 + index % 7 / 10 : grade * 11.4 - 24 + index % 11 * 2.18,
        maxReturn: moneyMarket ? 6.7 + index % 11 / 10 : grade * 38.2 + 30 + index % 17 * 3.25,
        drawdown: moneyMarket ? 0.08 + index % 5 / 100 : 14 + index % 19 * 1.45 + (5 - grade) * 2.2
      };
    });
    return [...seeds, ...remaining];
  });
  var fundCategories = [
    ["\u80A1\u7968\u578B", [
      "\u666E\u901A\u80A1\u7968\u578B",
      "\u884C\u4E1A\u80A1\u7968\u578B-\u79D1\u6280",
      "\u884C\u4E1A\u80A1\u7968\u578B-\u6D88\u8D39",
      "\u884C\u4E1A\u80A1\u7968\u578B-\u533B\u836F\u536B\u751F",
      "\u884C\u4E1A\u80A1\u7968\u578B-\u5236\u9020",
      "\u884C\u4E1A\u80A1\u7968\u578B-\u5176\u4ED6",
      "\u88AB\u52A8\u6307\u6570\u80A1\u7968\u578B",
      "\u589E\u5F3A\u6307\u6570\u80A1\u7968\u578B"
    ]],
    ["\u6DF7\u5408\u578B", [
      "\u504F\u80A1\u6DF7\u5408\u578B",
      "\u5E73\u8861\u6DF7\u5408\u578B",
      "\u504F\u503A\u6DF7\u5408\u578B",
      "\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408\u578B",
      "\u884C\u4E1A\u6DF7\u5408\u578B-\u79D1\u6280",
      "\u884C\u4E1A\u6DF7\u5408\u578B-\u6D88\u8D39",
      "\u884C\u4E1A\u6DF7\u5408\u578B-\u533B\u836F\u536B\u751F",
      "\u884C\u4E1A\u6DF7\u5408\u578B-\u5236\u9020",
      "\u884C\u4E1A\u6DF7\u5408\u578B-\u5176\u4ED6",
      "\u5176\u4ED6\u6DF7\u5408\u578B"
    ]],
    ["\u503A\u5238\u578B", [
      "\u77ED\u671F\u7EAF\u503A\u578B",
      "\u4E2D\u957F\u671F\u7EAF\u503A\u578B",
      "\u6DF7\u5408\u503A\u5238\u578B\u4E00\u7EA7",
      "\u6DF7\u5408\u503A\u5238\u578B\u4E8C\u7EA7",
      "\u53EF\u8F6C\u503A\u578B",
      "\u5229\u7387\u503A\u578B",
      "\u4FE1\u7528\u503A\u578B",
      "\u88AB\u52A8\u6307\u6570\u503A\u5238\u578B",
      "\u589E\u5F3A\u6307\u6570\u503A\u5238\u578B",
      "\u5176\u4ED6\u503A\u5238\u578B"
    ]],
    ["\u8D27\u5E01\u578B", ["\u666E\u901A\u8D27\u5E01\u578B", "\u573A\u5185\u8D27\u5E01\u578B", "\u77ED\u671F\u7406\u8D22\u578B"]],
    ["FOF", ["\u80A1\u7968\u578BFOF", "\u6DF7\u5408\u578BFOF", "\u503A\u5238\u578BFOF", "\u517B\u8001\u76EE\u6807FOF"]]
  ];
  var exampleFundTypes = fundCategories.flatMap(
    ([type, subtypes]) => subtypes.map((subtype) => ({ type, subtype }))
  );
  function makeFundExamples(count, status, offset) {
    const running = status === "running";
    return Array.from({ length: count }, (_, index) => {
      const isMaster = index % 4 !== 3;
      const product = index - Math.floor((index + 1) / 4);
      const typeIndex = product % exampleFundTypes.length;
      const { type, subtype } = exampleFundTypes[typeIndex];
      const id = String(offset + product + 1).padStart(3, "0");
      const year = 2013 + product % 11;
      const month = String(product % 12 + 1).padStart(2, "0");
      const finalYear = running ? 2026 : Math.min(2025, year + 2 + product % 3);
      const years = finalYear - year - Number(running && month === "12");
      const rankTotal = 580 + typeIndex * 7;
      const returns = type === "\u8D27\u5E01\u578B" ? 0.65 + product % 12 / 100 : (product * 73 % 3800 - 1250) / 100;
      return {
        name: `\u793A\u4F8B${subtype}\u57FA\u91D1 ${id}${isMaster ? "A" : "C"}`,
        code: String(990001 + offset + index),
        type,
        subtype,
        status,
        isMaster,
        manager: `\u793A\u4F8B\u7ECF\u7406 ${String(product % 28 + 1).padStart(2, "0")}`,
        founded: `${year}-${month}-08`,
        rating3: years >= 3 ? product % 5 + 1 : null,
        rating5: years >= 5 ? (product + 2) % 5 + 1 : null,
        navDate: running ? "2026-11-20" : `${finalYear}-${month}-20`,
        returns: Number((returns - (isMaster ? 0 : 0.05)).toFixed(2)),
        rank: `${(product * 19 + Number(!isMaster)) % rankTotal + 1}/${rankTotal}`
      };
    });
  }
  var originalFundExamples = companyData.funds.map((fund) => ({
    ...fund,
    subtype: fund.name.includes("\u7075\u6D3B\u914D\u7F6E") ? "\u7075\u6D3B\u914D\u7F6E\u6DF7\u5408\u578B" : "\u504F\u80A1\u6DF7\u5408\u578B",
    status: "running",
    isMaster: !/[BCEIY]$/.test(fund.name)
  }));
  var runningFundExamples = makeFundExamples(229 - originalFundExamples.length, "running", 0);
  var fundListExamples = [
    ...originalFundExamples,
    ...runningFundExamples,
    ...makeFundExamples(54, "liquidated", runningFundExamples.length)
  ];

  // dist/company-list-data.js?v=20261125-company-search
  var rows = [
    // ID, company name, short name, founding date, capital, total scale,
    // non-money-market scale, fund count, manager count, types in display order.
    ["essence", "\u5B89\u4FE1\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u8D23\u4EFB\u516C\u53F8", "\u5B89\u4FE1\u57FA\u91D1", "2011-12-06", 5.0625, 1200.63, 926.47, 114, 40, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "\u80A1\u7968\u578B", "FOF"]],
    ["gffunds", "\u5E7F\u53D1\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5E7F\u53D1\u57FA\u91D1", "2012-07-15", 4.875, 980.45, 850.3, 120, 45, ["\u80A1\u7968\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["chinaamc", "\u534E\u590F\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u534E\u590F\u57FA\u91D1", "2013-04-20", 3.95, 860.32, 760.5, 130, 37, ["\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "\u80A1\u7968\u578B", "\u6DF7\u5408\u578B"]],
    ["efunds", "\u6613\u65B9\u8FBE\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u6613\u65B9\u8FBE\u57FA\u91D1", "2010-03-12", 5.25, 1100.78, 900.12, 115, 42, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u80A1\u7968\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["cmfchina", "\u62DB\u5546\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u62DB\u5546\u57FA\u91D1", "2014-11-08", 4.375, 780.55, 670.2, 110, 35, ["\u8D27\u5E01\u578B", "\u80A1\u7968\u578B", "\u503A\u5238\u578B"]],
    ["yinhua", "\u94F6\u534E\u57FA\u91D1\u7BA1\u7406\u80A1\u4EFD\u6709\u9650\u516C\u53F8", "\u94F6\u534E\u57FA\u91D1", "2015-06-14", 3.75, 650.88, 590.55, 100, 30, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["fullgoal", "\u5BCC\u56FD\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5BCC\u56FD\u57FA\u91D1", "2009-09-25", 5.5, 1250.45, 1050.6, 140, 47, ["\u80A1\u7968\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["nffund", "\u5357\u65B9\u57FA\u91D1\u7BA1\u7406\u80A1\u4EFD\u6709\u9650\u516C\u53F8", "\u5357\u65B9\u57FA\u91D1", "2013-01-30", 4.125, 700.12, 640.33, 105, 32, ["\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "\u6DF7\u5408\u578B"]],
    ["huatai-pb", "\u534E\u6CF0\u67CF\u745E\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u534E\u6CF0\u67CF\u745E\u57FA\u91D1", "2008-05-18", 6, 1350.9, 1150.75, 150, 50, ["\u6DF7\u5408\u578B", "\u80A1\u7968\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["bosera", "\u535A\u65F6\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u535A\u65F6\u57FA\u91D1", "2011-10-22", 4.625, 900.25, 820.4, 125, 38, ["\u8D27\u5E01\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u80A1\u7968\u578B"]],
    ["icbccs", "\u5DE5\u94F6\u745E\u4FE1\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5DE5\u94F6\u745E\u4FE1\u57FA\u91D1", "2005-06-21", 2, 3370.2, 2280.55, 318, 53, ["\u503A\u5238\u578B", "\u6DF7\u5408\u578B", "\u80A1\u7968\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["harvest", "\u5609\u5B9E\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5609\u5B9E\u57FA\u91D1", "1999-03-25", 1.5, 2125.4, 1684.72, 286, 58, ["\u80A1\u7968\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["gtfund", "\u56FD\u6CF0\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u56FD\u6CF0\u57FA\u91D1", "1998-03-05", 1.1, 1490.6, 1078.45, 192, 42, ["\u80A1\u7968\u578B", "\u503A\u5238\u578B", "\u6DF7\u5408\u578B", "\u8D27\u5E01\u578B"]],
    ["fortune", "\u534E\u5546\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u534E\u5546\u57FA\u91D1", "2005-12-20", 1, 426.85, 379.41, 78, 22, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u80A1\u7968\u578B", "\u8D27\u5E01\u578B"]],
    ["aes", "\u6CC9\u679C\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u6CC9\u679C\u57FA\u91D1", "2022-02-08", 1, 84.26, 84.26, 8, 4, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B"]]
  ];
  function distributeScale(nonMoneyScale, cashScale, types2) {
    const nonMoneyTypes = types2.filter((type) => type !== "\u8D27\u5E01\u578B");
    const totalCents = Math.round(nonMoneyScale * 100);
    const totalWeight = nonMoneyTypes.length * (nonMoneyTypes.length + 1) / 2;
    let allocatedCents = 0;
    const scaleByType = {};
    nonMoneyTypes.forEach((type, index) => {
      const weight = nonMoneyTypes.length - index;
      const cents = index === nonMoneyTypes.length - 1 ? totalCents - allocatedCents : Math.round(totalCents * weight / totalWeight);
      scaleByType[type] = cents / 100;
      allocatedCents += cents;
    });
    if (types2.includes("\u8D27\u5E01\u578B")) scaleByType["\u8D27\u5E01\u578B"] = Math.round(cashScale * 100) / 100;
    return scaleByType;
  }
  var companyList = rows.map(([
    id,
    name,
    shortName,
    founded,
    capital2,
    totalScale,
    nonMoneyScale,
    fundCount,
    managerCount,
    types2
  ]) => ({
    id,
    name,
    shortName,
    founded,
    capital: capital2,
    totalScale,
    nonMoneyScale,
    fundCount,
    managerCount,
    types: types2,
    legalRepresentative: id === "essence" ? "\u5218\u5165\u9886" : "",
    scaleByType: id === "essence" ? { "\u6DF7\u5408\u578B": 448.37, "\u503A\u5238\u578B": 413.87, "\u8D27\u5E01\u578B": 274.16, "\u80A1\u7968\u578B": 62.82, FOF: 1.41 } : distributeScale(nonMoneyScale, totalScale - nonMoneyScale, types2)
  }));

  // dist/manager-list-data.js?v=20261126-period-conditions
  var additionalCompanies = [
    { id: "shangzheng", name: "\u5C1A\u6B63\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", shortName: "\u5C1A\u6B63\u57FA\u91D1" },
    { id: "guolianan", name: "\u56FD\u8054\u5B89\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", shortName: "\u56FD\u8054\u5B89\u57FA\u91D1" },
    { id: "morgan", name: "\u6469\u6839\u57FA\u91D1", shortName: "\u6469\u6839\u57FA\u91D1" },
    { id: "invesco-greatwall", name: "\u666F\u987A\u957F\u57CE\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", shortName: "\u666F\u987A\u957F\u57CE\u57FA\u91D1" },
    { id: "changjiang-asset", name: "\u957F\u6C5F\u8D44\u7BA1", shortName: "\u957F\u6C5F\u8D44\u7BA1" },
    { id: "demo-asset", name: "\u793A\u4F8B\u57FA\u91D1\u7BA1\u7406\u516C\u53F8", shortName: "\u793A\u4F8B\u57FA\u91D1" }
  ];
  var companiesByName = new Map([...companyList, ...additionalCompanies].flatMap((company) => [
    [company.name, company],
    [company.shortName, company]
  ]));
  var companyDetails = new Set(companyList.map((company) => company.id));
  var essenceRatings = new Map(managerRatingExamples.map((manager) => [manager.name, manager]));
  var compareProfiles = {
    a: { rating: 2, scale: 1.46, tenure: 7 },
    b: { rating: 1, scale: 324.99, tenure: 17, representativeAnnualized: 2.91 },
    c: { rating: 1, scale: 12.07, tenure: 7 }
  };
  var demonstrationProfiles = [
    {
      id: "demo:xu-jie",
      name: "\u5F90\u5A55",
      company: "\u957F\u6C5F\u8D44\u7BA1",
      type: "\u504F\u80A1\u578B",
      rating: 3,
      careerYears: 25,
      years: 7,
      days: 227,
      scale: 1.52,
      product: "\u957F\u6C5F\u6DFB\u5229\u6DF7\u5408A",
      productType: "\u504F\u503A\u6DF7\u5408\u578B",
      representativeAnnualized: 2.82,
      indexTotal: 214.37,
      returns: { representative: [-1.7, 1.38, 2.82, 8.68, 12.86], index: [-2.78, -1.28, 0.82, 15.03, 19.82] },
      risk: { representative: { drawdown: 9, volatility: 12, beta: 0.55 }, index: { drawdown: 16, volatility: 18, beta: 0.82 } }
    },
    {
      id: "demo:equity",
      name: "\u793A\u4F8B\u7ECF\u7406 A",
      company: "\u793A\u4F8B\u57FA\u91D1",
      type: "\u504F\u80A1\u578B",
      rating: 4,
      careerYears: 14,
      years: 8,
      days: 160,
      scale: 58.3,
      fundCount: 5,
      product: "\u793A\u4F8B\u6210\u957F\u6DF7\u5408A",
      productType: "\u504F\u80A1\u6DF7\u5408\u578B",
      productStyle: "\u5927\u76D8-\u6210\u957F\u578B",
      productThemes: ["\u79D1\u6280", "\u9AD8\u7AEF\u5236\u9020"],
      representativeAnnualized: 12.68,
      indexTotal: 135.06,
      returns: { representative: [5.8, 9.4, 13.6, 42.5, 84.2], index: [4.15, 11.4, 18.85, 38.62, 72.44] },
      risk: { representative: { drawdown: 21, volatility: 26, beta: 1.15 }, index: { drawdown: 18, volatility: 22, beta: 1.07 } }
    },
    {
      id: "demo:bond",
      name: "\u793A\u4F8B\u7ECF\u7406 B",
      company: "\u793A\u4F8B\u57FA\u91D1",
      type: "\u504F\u503A\u578B",
      rating: 5,
      careerYears: 18,
      years: 12,
      days: 56,
      scale: 146.1,
      fundCount: 8,
      product: "\u793A\u4F8B\u7A33\u5065\u503A\u5238A",
      productType: "\u4E2D\u957F\u671F\u7EAF\u503A\u578B",
      productStyle: "\u4E2D\u76D8-\u4EF7\u503C\u578B",
      productThemes: ["\u91D1\u878D\u5730\u4EA7"],
      representativeAnnualized: 5.41,
      indexTotal: 49.33,
      returns: { representative: [1.9, 2.65, 5.92, 16.9, 28.8], index: [1.36, 3.33, 5.74, 18.21, 25.23] },
      risk: { representative: { drawdown: 2.6, volatility: 3.9, beta: 0.22 }, index: { drawdown: 2.3, volatility: 3.2, beta: 0.18 } }
    },
    {
      id: "demo:index",
      name: "\u793A\u4F8B\u7ECF\u7406 C",
      company: "\u793A\u4F8B\u57FA\u91D1",
      type: "\u6307\u6570\u578B",
      rating: 2,
      careerYears: 10,
      years: 6,
      days: 98,
      scale: 29.7,
      fundCount: 3,
      product: "\u793A\u4F8B\u5747\u8861\u6307\u6570A",
      productType: "\u88AB\u52A8\u6307\u6570\u80A1\u7968\u578B",
      productStyle: "\u5C0F\u76D8-\u5E73\u8861\u578B",
      productThemes: ["\u6D88\u8D39", "\u533B\u836F"],
      representativeAnnualized: -1.42,
      indexTotal: 22.8,
      returns: { representative: [-3.65, -1.72, -2.14, 8.15, 9.28], index: [-1.92, -3.47, -3.61, 6.92, 16.82] },
      risk: { representative: { drawdown: 26, volatility: 28, beta: 1.3 }, index: { drawdown: 24, volatility: 27, beta: 1.22 } }
    }
  ];
  var rankPeriods = [
    { id: "3m", years: 0.25, drawdownWeight: 0.58, benchmark: 1.7 },
    { id: "6m", years: 0.5, drawdownWeight: 0.75, benchmark: 3.1 },
    { id: "1y", years: 1, drawdownWeight: 1, benchmark: 5.4 },
    { id: "3y", years: 3, drawdownWeight: 1.42, benchmark: 6.2 },
    { id: "5y", years: 5, drawdownWeight: 1.72, benchmark: 6.5 }
  ];
  var lowerIsBetter = /* @__PURE__ */ new Set(["maxDrawdown", "volatility", "downsideRisk"]);
  function demonstrationMetrics(demo, scope, period, position) {
    const totalReturn = demo.returns[scope][position];
    const cagr = ((1 + totalReturn / 100) ** (1 / period.years) - 1) * 100;
    const excessCagr = cagr - period.benchmark;
    const risk = demo.risk[scope];
    const volatility = risk.volatility * (0.9 + 0.05 * position);
    const maxDrawdown = risk.drawdown * period.drawdownWeight;
    const downsideRisk = volatility * (totalReturn < 0 ? 0.72 : 0.54);
    const excessRiskFree = cagr - 1.5;
    return {
      return: totalReturn,
      cagr,
      excessCagr,
      maxDrawdown,
      volatility,
      downsideRisk,
      sharpe: excessRiskFree / volatility,
      informationRatio: excessCagr / (volatility * 0.6),
      calmar: cagr / maxDrawdown,
      sortino: excessRiskFree / downsideRisk,
      treynor: excessRiskFree / risk.beta
    };
  }
  function demonstrationPerformance() {
    const profiles = new Map(demonstrationProfiles.map(({ id }) => [id, {
      performance: { representative: {}, index: {} },
      performanceValues: { representative: {}, index: {} }
    }]));
    for (const scope of ["representative", "index"]) {
      rankPeriods.forEach((period, periodIndex) => {
        const sample = demonstrationProfiles.map((demo) => ({ id: demo.id, metrics: demonstrationMetrics(demo, scope, period, periodIndex) }));
        for (const metric2 of Object.keys(sample[0].metrics)) {
          const direction = lowerIsBetter.has(metric2) ? 1 : -1;
          const ranked = [...sample].sort((left, right) => direction * (left.metrics[metric2] - right.metrics[metric2]));
          ranked.forEach(({ id, metrics }, position) => {
            const { performance, performanceValues } = profiles.get(id);
            const ranks2 = performance[scope];
            const values = performanceValues[scope];
            ranks2[metric2] ??= {};
            values[metric2] ??= {};
            ranks2[metric2][period.id] = 100 * (position + 0.5) / sample.length;
            values[metric2][period.id] = metrics[metric2];
          });
        }
      });
    }
    return profiles;
  }
  var samplePerformance = demonstrationPerformance();
  var blankMetrics = {
    product: null,
    productType: null,
    productStyle: null,
    type: null,
    tenure: null,
    tenureDays: null,
    careerYears: null,
    scale: null,
    fundCount: null,
    rating: null,
    representativeAnnualized: null,
    indexTotal: null,
    index3m: null,
    index1y: null,
    index3y: null
  };
  function getManagerListData() {
    const companies = /* @__PURE__ */ new Map();
    function useCompany(companyName) {
      const { id, name, shortName } = companiesByName.get(companyName) ?? { id: companyName, name: companyName, shortName: companyName };
      companies.set(id, { id, name, shortName, hasDetail: companyDetails.has(id) });
      return id;
    }
    const essenceId = useCompany(companyData.name);
    const essenceManagers = companyData.managers.map((manager) => {
      const rated = essenceRatings.get(manager.name);
      return {
        ...blankMetrics,
        id: `${essenceId}:${manager.name}`,
        name: manager.name,
        companyId: essenceId,
        type: manager.type ?? null,
        product: manager.product ?? null,
        productType: rated?.fundType ?? null,
        tenure: manager.tenure ?? null,
        tenureDays: Number.isFinite(manager.tenure) ? Math.round(manager.tenure * 365) : null,
        careerYears: manager.experience ?? null,
        scale: manager.scale ?? null,
        fundCount: manager.count ?? null,
        rating: rated?.rating ?? null,
        representativeAnnualized: manager.annual ?? null
      };
    });
    const compareCatalog = window.ManagerCompareView?.getCatalog() ?? [];
    const compareManagers = compareCatalog.map(({ id, name, company, product, productType, type }) => {
      const profile = compareProfiles[id];
      return {
        ...blankMetrics,
        ...profile,
        id: `compare:${id}`,
        name,
        companyId: useCompany(company),
        product: product ?? null,
        productType: productType ?? null,
        type: type ?? null,
        tenureDays: Number.isFinite(profile?.tenure) ? profile.tenure * 365 : null
      };
    });
    const demoManagers = demonstrationProfiles.map(({ company, years, days, returns, risk, ...profile }) => ({
      ...blankMetrics,
      ...profile,
      companyId: useCompany(company),
      tenure: years + days / 365,
      tenureDays: years * 365 + days,
      tenureLabel: `${years}\u5E74${days}\u5929`,
      index3m: returns.index[0],
      index1y: returns.index[2],
      index3y: returns.index[3],
      isDemo: true,
      ...samplePerformance.get(profile.id)
    }));
    const managers = [...essenceManagers, ...compareManagers, ...demoManagers].map((manager) => ({
      ...manager,
      productThemes: manager.productThemes ?? [],
      performance: manager.performance ?? { representative: {}, index: {} },
      performanceValues: manager.performanceValues ?? { representative: {}, index: {} }
    }));
    return { companies: [...companies.values()], managers };
  }

  // dist/company-list-data.js?v=20261125-company-abbreviation
  var rows2 = [
    // ID, company name, short name, founding date, capital, total scale,
    // non-money-market scale, fund count, manager count, types in display order.
    ["essence", "\u5B89\u4FE1\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u8D23\u4EFB\u516C\u53F8", "\u5B89\u4FE1\u57FA\u91D1", "2011-12-06", 5.0625, 1200.63, 926.47, 114, 40, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "\u80A1\u7968\u578B", "FOF"]],
    ["gffunds", "\u5E7F\u53D1\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5E7F\u53D1\u57FA\u91D1", "2012-07-15", 4.875, 980.45, 850.3, 120, 45, ["\u80A1\u7968\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["chinaamc", "\u534E\u590F\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u534E\u590F\u57FA\u91D1", "2013-04-20", 3.95, 860.32, 760.5, 130, 37, ["\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "\u80A1\u7968\u578B", "\u6DF7\u5408\u578B"]],
    ["efunds", "\u6613\u65B9\u8FBE\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u6613\u65B9\u8FBE\u57FA\u91D1", "2010-03-12", 5.25, 1100.78, 900.12, 115, 42, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u80A1\u7968\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["cmfchina", "\u62DB\u5546\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u62DB\u5546\u57FA\u91D1", "2014-11-08", 4.375, 780.55, 670.2, 110, 35, ["\u8D27\u5E01\u578B", "\u80A1\u7968\u578B", "\u503A\u5238\u578B"]],
    ["yinhua", "\u94F6\u534E\u57FA\u91D1\u7BA1\u7406\u80A1\u4EFD\u6709\u9650\u516C\u53F8", "\u94F6\u534E\u57FA\u91D1", "2015-06-14", 3.75, 650.88, 590.55, 100, 30, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["fullgoal", "\u5BCC\u56FD\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5BCC\u56FD\u57FA\u91D1", "2009-09-25", 5.5, 1250.45, 1050.6, 140, 47, ["\u80A1\u7968\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["nffund", "\u5357\u65B9\u57FA\u91D1\u7BA1\u7406\u80A1\u4EFD\u6709\u9650\u516C\u53F8", "\u5357\u65B9\u57FA\u91D1", "2013-01-30", 4.125, 700.12, 640.33, 105, 32, ["\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "\u6DF7\u5408\u578B"]],
    ["huatai-pb", "\u534E\u6CF0\u67CF\u745E\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u534E\u6CF0\u67CF\u745E\u57FA\u91D1", "2008-05-18", 6, 1350.9, 1150.75, 150, 50, ["\u6DF7\u5408\u578B", "\u80A1\u7968\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["bosera", "\u535A\u65F6\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u535A\u65F6\u57FA\u91D1", "2011-10-22", 4.625, 900.25, 820.4, 125, 38, ["\u8D27\u5E01\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u80A1\u7968\u578B"]],
    ["icbccs", "\u5DE5\u94F6\u745E\u4FE1\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5DE5\u94F6\u745E\u4FE1\u57FA\u91D1", "2005-06-21", 2, 3370.2, 2280.55, 318, 53, ["\u503A\u5238\u578B", "\u6DF7\u5408\u578B", "\u80A1\u7968\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["harvest", "\u5609\u5B9E\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u5609\u5B9E\u57FA\u91D1", "1999-03-25", 1.5, 2125.4, 1684.72, 286, 58, ["\u80A1\u7968\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u8D27\u5E01\u578B", "FOF"]],
    ["gtfund", "\u56FD\u6CF0\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u56FD\u6CF0\u57FA\u91D1", "1998-03-05", 1.1, 1490.6, 1078.45, 192, 42, ["\u80A1\u7968\u578B", "\u503A\u5238\u578B", "\u6DF7\u5408\u578B", "\u8D27\u5E01\u578B"]],
    ["fortune", "\u534E\u5546\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u534E\u5546\u57FA\u91D1", "2005-12-20", 1, 426.85, 379.41, 78, 22, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "\u80A1\u7968\u578B", "\u8D27\u5E01\u578B"]],
    ["aes", "\u6CC9\u679C\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8", "\u6CC9\u679C\u57FA\u91D1", "2022-02-08", 1, 84.26, 84.26, 8, 4, ["\u6DF7\u5408\u578B", "\u503A\u5238\u578B"]]
  ];
  function distributeScale2(nonMoneyScale, cashScale, types2) {
    const nonMoneyTypes = types2.filter((type) => type !== "\u8D27\u5E01\u578B");
    const totalCents = Math.round(nonMoneyScale * 100);
    const totalWeight = nonMoneyTypes.length * (nonMoneyTypes.length + 1) / 2;
    let allocatedCents = 0;
    const scaleByType = {};
    nonMoneyTypes.forEach((type, index) => {
      const weight = nonMoneyTypes.length - index;
      const cents = index === nonMoneyTypes.length - 1 ? totalCents - allocatedCents : Math.round(totalCents * weight / totalWeight);
      scaleByType[type] = cents / 100;
      allocatedCents += cents;
    });
    if (types2.includes("\u8D27\u5E01\u578B")) scaleByType["\u8D27\u5E01\u578B"] = Math.round(cashScale * 100) / 100;
    return scaleByType;
  }
  var companyList2 = rows2.map(([
    id,
    name,
    shortName,
    founded,
    capital2,
    totalScale,
    nonMoneyScale,
    fundCount,
    managerCount,
    types2
  ]) => ({
    id,
    name,
    shortName,
    founded,
    capital: capital2,
    totalScale,
    nonMoneyScale,
    fundCount,
    managerCount,
    types: types2,
    legalRepresentative: id === "essence" ? "\u5218\u5165\u9886" : "",
    scaleByType: id === "essence" ? { "\u6DF7\u5408\u578B": 448.37, "\u503A\u5238\u578B": 413.87, "\u8D27\u5E01\u578B": 274.16, "\u80A1\u7968\u578B": 62.82, FOF: 1.41 } : distributeScale2(nonMoneyScale, totalScale - nonMoneyScale, types2)
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
    if (!orderedNameRanges(company.shortName.toLocaleLowerCase(), keyword)) return null;
    return orderedNameRanges(name, keyword) ?? [];
  }
  function companyMatchesQuery(company, query) {
    return companyNameRanges(company, query) !== null;
  }
  function companyNameParts(company, query) {
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

  // dist/components/custom-range.js?v=20261126-range-placeholder
  var escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  function renderCustomRange(key, field2, bounds = [], checked = false) {
    const [min, max] = bounds;
    const errorId = `cl-range-error-${key}`;
    const isRank = field2.unit === "\u540D";
    const [lowLabel, highLabel] = isRank ? ["\u8D77\u59CB\u540D\u6B21", "\u7ED3\u675F\u540D\u6B21"] : field2.unit === "\u5E74" ? ["\u6700\u77ED", "\u6700\u957F"] : ["\u6700\u4F4E", "\u6700\u9AD8"];
    const bound = (name, label, value) => `<label class="cl-custom-bound">
    <input type="number" name="${name}" min="${field2.min ?? (isRank ? 1 : 0)}" step="${field2.continuous ? "any" : 1}"
      placeholder="${isRank ? "\u7B2C" : label}" aria-label="${field2.label}${label}\uFF08${field2.unit}\uFF09" aria-describedby="${errorId}" value="${escapeHtml(value ?? "")}">
    <span class="cl-unit">${field2.unit}</span></label>`;
    return `<form class="cl-custom-form" data-cl-custom-form="${key}" novalidate>
    <div class="cl-custom-fields">
      <input type="checkbox" class="cl-checkbox" name="useCustom" aria-label="\u81EA\u5B9A\u4E49${field2.label}\u533A\u95F4"
        aria-describedby="${errorId}"${checked ? " checked" : ""}>
      ${bound("minimum", lowLabel, min)}<span class="cl-custom-separator" aria-hidden="true">\u2013</span>${bound("maximum", highLabel, max)}
    </div>
    <p class="cl-form-error" id="${errorId}" role="alert"></p><button type="submit" hidden>\u786E\u5B9A</button>
  </form>`;
  }
  function validateCustomRange(form, enabled, currentBounds, focusInvalid = false) {
    const { minimum, maximum, useCustom } = form.elements;
    const error = form.querySelector(".cl-form-error");
    error.textContent = "";
    if (!enabled) {
      useCustom.checked = false;
      return void 0;
    }
    const min = minimum.value === "" ? null : minimum.valueAsNumber;
    const max = maximum.value === "" ? null : maximum.valueAsNumber;
    if (!minimum.validity.valid || !maximum.validity.valid) {
      error.textContent = "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u533A\u95F4\u6570\u503C";
    } else if (min === null && max === null) {
      error.textContent = "\u8BF7\u81F3\u5C11\u586B\u5199\u533A\u95F4\u7684\u4E00\u7AEF";
    } else if (min !== null && max !== null && min > max) {
      error.textContent = "\u8D77\u59CB\u503C\u4E0D\u80FD\u5927\u4E8E\u7ED3\u675F\u503C";
    }
    if (error.textContent) {
      useCustom.checked = Boolean(currentBounds);
      if (focusInvalid) (maximum.validity.valid ? minimum : maximum).focus();
      return null;
    }
    useCustom.checked = true;
    return [min, max];
  }
  function customRangeLabel([min, max], unit) {
    if (min === null) return `\u2264${max}${unit}`;
    if (max === null) return `\u2265${min}${unit}`;
    return `${min}\u2013${max}${unit}`;
  }

  // dist/components/filter-chips.js?v=20261125-fit-chips
  function fitFilterChips(control) {
    const value = control.querySelector(".cl-trigger-value");
    const count = value.querySelector(".cl-overflow-count");
    if (!count) return;
    const chips = [...value.querySelectorAll("[data-cl-chip]")];
    chips.forEach((chip) => {
      chip.hidden = false;
    });
    count.hidden = true;
    const available = value.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(value).columnGap) || 0;
    const widths = chips.map((chip) => chip.getBoundingClientRect().width);
    let visible = chips.length;
    let used = widths.reduce((sum2, width) => sum2 + width, 0) + gap * (visible - 1);
    if (used > available) {
      count.hidden = false;
      do {
        visible--;
        used -= widths[visible] + (visible ? gap : 0);
        count.textContent = `+${chips.length - visible}`;
      } while (visible && used + gap + count.getBoundingClientRect().width > available);
    }
    const overflow = chips.slice(visible);
    const focused = overflow.some((chip) => chip.contains(document.activeElement));
    overflow.forEach((chip) => {
      chip.hidden = true;
    });
    count.title = overflow.map((chip) => chip.dataset.clChip).join("\u3001");
    if (focused) control.querySelector(".cl-trigger").focus({ preventScroll: true });
  }

  // dist/manager-period-presets.js?v=20261126-period-conditions
  var percent = "%";
  var returnThresholds = {
    short: [[0, 1, 5, 10], [0, 3, 5, 10], [0, 0.5, 1, 2]],
    year: [[0, 3, 10, 20], [0, 5, 10, 20], [0, 1, 3, 5]],
    long: [[0, 5, 20, 40], [0, 10, 30, 50], [0, 3, 10, 20]]
  };
  var drawdownThresholds = {
    short: [[1, 5, 10, 20], [5, 10, 15, 20], [0.5, 1, 3, 5]],
    long: [[3, 10, 20, 40], [10, 20, 30, 40], [1, 3, 5, 10]]
  };
  var ratioThresholds = [0, 0.5, 1, 2];
  var shortPeriod = (period) => period === "3m" || period === "6m";
  var returnPeriod = (period) => shortPeriod(period) ? "short" : period === "1y" ? "year" : "long";
  var drawdownPeriod = (period) => shortPeriod(period) ? "short" : "long";
  var configurations = {
    return: { label: "\u6536\u76CA\u7387", unit: percent, thresholds: (period) => returnThresholds[returnPeriod(period)] },
    cagr: { label: "\u6536\u76CA\u7387", unit: percent, thresholds: () => returnThresholds.year },
    excessCagr: { label: "\u6536\u76CA\u7387", unit: percent, thresholds: () => [[0, 1, 3, 5], [0, 2, 5, 10], [0, 0.5, 1, 2]] },
    maxDrawdown: { label: "\u6700\u5927\u56DE\u64A4\u7387", unit: percent, upperBound: true, thresholds: (period) => drawdownThresholds[drawdownPeriod(period)] },
    volatility: { label: "\u5E74\u5316\u6CE2\u52A8\u7387", unit: percent, upperBound: true, thresholds: () => [[3, 10, 20, 30], [10, 15, 20, 30], [1, 3, 5, 10]] },
    downsideRisk: { label: "\u4E0B\u884C\u98CE\u9669", unit: percent, upperBound: true, thresholds: () => [[3, 5, 10, 20], [5, 10, 15, 20], [1, 2, 3, 5]] },
    sharpe: { label: "\u590F\u666E\u6BD4\u7387", unit: "", fixed: ratioThresholds },
    informationRatio: { label: "\u4FE1\u606F\u6BD4\u7387", unit: "", fixed: [0, 0.25, 0.5, 1] },
    calmar: { label: "\u6536\u76CA\u56DE\u64A4\u6BD4", unit: "", fixed: ratioThresholds },
    sortino: { label: "\u7D22\u63D0\u8BFA\u6BD4\u7387", unit: "", fixed: ratioThresholds },
    treynor: { label: "\u7279\u96F7\u8BFA\u6BD4\u7387", unit: percent, fixed: [0, 3, 5, 10] }
  };
  function performanceValueConfig(metric2, period, types2) {
    const { label, unit, upperBound, thresholds, fixed } = configurations[metric2];
    let typeIndex = 0;
    if (types2.length === 1) {
      if (types2[0] === "\u504F\u80A1\u578B") typeIndex = 1;
      if (types2[0] === "\u504F\u503A\u578B") typeIndex = 2;
    }
    const values = fixed ?? thresholds(period)[typeIndex];
    return {
      label,
      unit,
      presets: values.map((value) => ({
        label: `${upperBound ? "\u2264" : "\u2265"}${value}${unit}`,
        min: upperBound ? null : value,
        max: upperBound ? value : null
      }))
    };
  }

  // dist/manager-list-filters.js?v=20261126-range-placeholder
  var esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  var scopes = { representative: "\u4EE3\u8868\u57FA\u91D1", index: "\u57FA\u91D1\u7ECF\u7406\u6307\u6570" };
  var periods = { "3m": "\u8FD13\u4E2A\u6708", "6m": "\u8FD16\u4E2A\u6708", "1y": "\u8FD11\u5E74", "3y": "\u8FD13\u5E74", "5y": "\u8FD15\u5E74" };
  var periodOrder = Object.keys(periods);
  var ranking = {
    label: "\u6392\u540D",
    unit: "%",
    presets: [20, 40, 60, 80].map((max) => ({ label: `\u524D${max}%`, min: null, max }))
  };
  var groups = [
    { key: "returns", label: "\u6536\u76CA", metrics: { return: "\u533A\u95F4\u6536\u76CA\u7387", cagr: "\u5E74\u5316\u6536\u76CA\u7387", excessCagr: "\u8D85\u989D\u5E74\u5316\u6536\u76CA\u7387" } },
    { key: "risk", label: "\u98CE\u9669", metrics: { maxDrawdown: "\u6700\u5927\u56DE\u64A4\u7387", volatility: "\u5E74\u5316\u6CE2\u52A8\u7387", downsideRisk: "\u4E0B\u884C\u98CE\u9669" } },
    { key: "adjusted", label: "\u8C03\u6574", metrics: { sharpe: "\u590F\u666E\u6BD4\u7387", informationRatio: "\u4FE1\u606F\u6BD4\u7387", calmar: "\u6536\u76CA\u56DE\u64A4\u6BD4", sortino: "\u7D22\u63D0\u8BFA\u6BD4\u7387", treynor: "\u7279\u96F7\u8BFA\u6BD4\u7387" } }
  ];
  var controls = [
    ["\u7ECF\u7406\u4FE1\u606F", ["company", "tenure"]],
    ["\u5728\u7BA1\u57FA\u91D1", ["type", "scale", "count"]],
    ["\u4EE3\u8868\u57FA\u91D1\u753B\u50CF", ["style", "themes"]]
  ];
  var finite = (value) => typeof value === "number" && Number.isFinite(value);
  var range = (label, low, high) => ({ label, matches: (value) => finite(value) && value >= low && value < high });
  var filterOptions = (values) => values.map((label) => ({ label, matches: (value) => Array.isArray(value) ? value.includes(label) : value === label }));
  var clearImage = '<img src="./assets/company-list/search-clear.png" width="14" height="14" alt="">';
  var checkImage = '<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">';
  var unrestricted = ["", "\u4E0D\u9650"];
  var activePair = (pair) => pair.period && (pair.rank || pair.threshold);
  var rangeChoices = (config) => [unrestricted, ...config.presets.map(({ label }) => [label, label])];
  var matchesBounds = (value, { min, max }) => finite(value) && (min === null || value >= min) && (max === null || value <= max);
  function thresholdLabel({ min, max }, unit) {
    const format = (value) => String(value).replace(/^-/, "\u2212");
    if (min === null) return `\u2264${format(max)}${unit}`;
    if (max === null) return `\u2265${format(min)}${unit}`;
    return `${format(min)}${unit}\uFF5E${format(max)}${unit}`;
  }
  function rankLabel({ min, max }) {
    if (min === null) return `\u6392\u540D\u524D${max}%`;
    if (max === null) return `\u6392\u540D\u2265${min}%`;
    return `\u6392\u540D${min}\uFF5E${max}%`;
  }
  function buildFields(managers) {
    return {
      tenure: {
        label: "\u5E74\u9650",
        summary: "\u7BA1\u7406\u5E74\u9650",
        unit: "\u5E74",
        continuous: true,
        value: (manager) => manager.tenure ?? (finite(manager.tenureDays) ? manager.tenureDays / 365.25 : null),
        options: [range("\u5C11\u4E8E1\u5E74", 0, 1), range("1\u20133\u5E74", 1, 3), range("3\u20135\u5E74", 3, 5), range("5\u5E74\u4EE5\u4E0A", 5, Infinity)]
      },
      type: {
        label: "\u7C7B\u578B",
        summary: "\u5728\u7BA1\u57FA\u91D1\u7C7B\u578B",
        value: (manager) => manager.type,
        options: filterOptions([.../* @__PURE__ */ new Set(["\u504F\u80A1\u578B", "\u504F\u503A\u578B", "\u8D27\u5E01\u578B", "QDII\u578B", "\u6307\u6570\u578B", "\u7406\u8D22\u578B", "FOF\u578B", "REITs", ...managers.flatMap((manager) => manager.type ?? [])])])
      },
      scale: {
        label: "\u603B\u89C4\u6A21",
        summary: "\u5728\u7BA1\u603B\u89C4\u6A21",
        unit: "\u4EBF",
        continuous: true,
        value: (manager) => manager.scale,
        options: [range("1\u4EBF\u4EE5\u4E0B", 0, 1), range("1\u20135\u4EBF", 1, 5), range("5\u201310\u4EBF", 5, 10), range("10\u4EBF\u4EE5\u4E0A", 10, Infinity)]
      },
      count: {
        label: "\u57FA\u91D1\u6570",
        summary: "\u5728\u7BA1\u57FA\u91D1\u6570",
        unit: "\u53EA",
        value: (manager) => manager.fundCount,
        options: [range("1\u201310\u53EA", 1, 11), range("11\u201330\u53EA", 11, 31), range("31\u2013100\u53EA", 31, 101), range("101\u53EA\u53CA\u4EE5\u4E0A", 101, Infinity)]
      },
      style: {
        label: "\u98CE\u683C",
        summary: "\u4EE3\u8868\u57FA\u91D1\u98CE\u683C",
        value: (manager) => manager.productStyle,
        options: filterOptions([.../* @__PURE__ */ new Set([
          ...["\u5927\u76D8", "\u4E2D\u76D8", "\u5C0F\u76D8"].flatMap((size) => ["\u4EF7\u503C\u578B", "\u5E73\u8861\u578B", "\u6210\u957F\u578B"].map((style) => `${size}-${style}`)),
          ...managers.flatMap((manager) => manager.productStyle ?? [])
        ])])
      },
      themes: {
        label: "\u4E3B\u9898",
        summary: "\u4EE3\u8868\u57FA\u91D1\u4E3B\u9898",
        value: (manager) => manager.productThemes,
        options: filterOptions([.../* @__PURE__ */ new Set([
          "\u533B\u836F",
          "\u6D88\u8D39",
          "\u79D1\u6280",
          "\u91D1\u878D\u5730\u4EA7",
          "\u56FD\u9632\u519B\u5DE5",
          "\u9AD8\u7AEF\u5236\u9020",
          "\u5468\u671F",
          "\u57FA\u5EFA",
          "\u516C\u7528",
          ...managers.flatMap((manager) => manager.productThemes ?? [])
        ])])
      }
    };
  }
  function makeScope() {
    return Object.fromEntries(groups.map(({ key, metrics }) => [key, { metric: Object.keys(metrics)[0], pairs: [] }]));
  }
  function mountManagerFilters(container, { companies, managers, onChange, signal }) {
    const fields2 = buildFields(managers);
    const companyById = new Map(companies.map((company) => [company.id, company]));
    const selected = Object.fromEntries(Object.keys(fields2).map((key) => [key, /* @__PURE__ */ new Set()]));
    const customRanges = /* @__PURE__ */ new Map();
    const selections = { representative: makeScope(), index: makeScope() };
    const queries = { name: "", company: "" };
    let scope = "representative";
    let baseOpen = null;
    let performanceOpen = null;
    let pairId = 0;
    function baseControl(key) {
      if (key === "company") return `<div class="cl-search-field ml-company-search">
      <label class="cl-field-name" for="ml-company-name">\u516C\u53F8</label>
      <input id="ml-company-name" type="search" aria-label="\u73B0\u4EFB\u516C\u53F8" placeholder="\u8F93\u5165\u516C\u53F8\u540D\u79F0" autocomplete="off">
      <button type="button" class="cl-search-clear" data-ml-clear-query="company" aria-label="\u6E05\u9664\u516C\u53F8\u540D\u79F0">${clearImage}</button>
    </div>`;
      const field2 = fields2[key];
      return `<div class="cl-select" data-ml-dropdown data-ml-field="${key}">
      <div class="cl-control">
        <button type="button" class="cl-trigger" data-ml-toggle-field="${key}" aria-label="${field2.summary}" aria-expanded="false" aria-controls="ml-filter-${key}"></button>
        <span class="cl-field-name">${field2.label}</span>
        <span class="cl-trigger-value"><span class="cl-unlimited">\u4E0D\u9650</span></span>
        <span class="cl-chevron" aria-hidden="true"></span>
      </div>
      <div class="cl-menu" id="ml-filter-${key}" hidden>
        <div class="ml-base-menu-body">
          <div class="cl-options" role="group" aria-label="${field2.summary}\u9009\u9879"></div>
          ${field2.unit ? renderCustomRange(key, { ...field2, label: field2.summary }) : ""}
        </div>
        <div class="ml-base-menu-footer">
          <button type="button" class="cl-clear" data-ml-clear-field="${key}" aria-label="\u6E05\u7A7A${field2.summary}" disabled></button>
        </div>
      </div>
    </div>`;
    }
    container.classList.add("ml-filters");
    container.innerHTML = `
    <h1 class="cl-page-heading" id="ml-title">\u7ECF\u7406\u7B5B\u9009</h1>
    <div class="cl-filter-rows">
      <div class="cl-filter-row">
        <label class="cl-filter-label" for="ml-manager-name">\u57FA\u91D1\u7ECF\u7406\u59D3\u540D</label>
        <div class="ml-base-controls">
          <div class="cl-search-field"><input id="ml-manager-name" type="search" placeholder="\u8F93\u5165\u57FA\u91D1\u7ECF\u7406\u59D3\u540D" autocomplete="off">
            <button type="button" class="cl-search-clear" data-ml-clear-query="name" aria-label="\u6E05\u9664\u57FA\u91D1\u7ECF\u7406\u59D3\u540D">${clearImage}</button>
          </div>
        </div>
      </div>
      ${controls.map(([label, keys]) => `<div class="cl-filter-row">
        <span class="cl-filter-label">${label}</span>
        <div class="ml-base-controls">${keys.map(baseControl).join("")}</div>
      </div>`).join("")}
      <div class="cl-filter-row ml-performance" id="ml-performance" hidden></div>
    </div>
    <button type="button" class="ml-performance-toggle" aria-label="\u66F4\u591A\u7B5B\u9009" aria-controls="ml-performance" aria-expanded="false"></button>
    <div class="cl-summary" hidden></div>`;
    const searchInputs = {
      name: container.querySelector("#ml-manager-name"),
      company: container.querySelector("#ml-company-name")
    };
    const summary = container.querySelector(".cl-summary");
    const performance = container.querySelector(".ml-performance");
    const toggle = container.querySelector(".ml-performance-toggle");
    function renderOptions(key) {
      const field2 = fields2[key];
      const options = field2.options.map((option, index) => {
        const label = esc(option.label);
        const checked = selected[key].has(index) ? " checked" : "";
        return `<label class="cl-option">
        <input type="checkbox" class="cl-checkbox" data-ml-choice="${key}" value="${index}" aria-label="${label}"${checked}>
        <span>${label}</span>
      </label>`;
      }).join("");
      container.querySelector(`#ml-filter-${key} .cl-options`).innerHTML = options;
    }
    function fieldTrigger(key) {
      return container.querySelector(`[data-ml-toggle-field="${key}"]`);
    }
    function closeBaseMenu(restoreFocus = false) {
      if (!baseOpen) return;
      const trigger = fieldTrigger(baseOpen);
      trigger.setAttribute("aria-expanded", "false");
      container.querySelector(`#ml-filter-${baseOpen}`).hidden = true;
      baseOpen = null;
      if (restoreFocus) trigger.focus({ preventScroll: true });
    }
    function openBaseMenu(key, keyboard) {
      closePerformanceMenu();
      const previous = baseOpen;
      closeBaseMenu();
      if (previous === key) return;
      baseOpen = key;
      const menu = container.querySelector(`#ml-filter-${key}`);
      renderOptions(key);
      menu.hidden = false;
      menu.querySelector(".ml-base-menu-body").scrollTop = 0;
      fieldTrigger(key).setAttribute("aria-expanded", "true");
      if (keyboard) menu.querySelector(".cl-checkbox")?.focus({ preventScroll: true });
    }
    function chip(text, key, value, summaryChip = false) {
      const label = esc(text);
      const query = key === "name" || key === "company" ? ` class="cl-summary-query" title="${label}"` : "";
      const marker = summaryChip ? "" : ` data-cl-chip="${label}"`;
      return `<span class="${summaryChip ? "cl-summary-value" : "cl-selected-value"}"${marker}>
      <span${query}>${label}</span><button type="button" class="cl-value-remove" data-ml-remove-field="${key}" data-ml-remove-value="${value}" aria-label="\u79FB\u9664${label}"></button>
    </span>`;
    }
    function fieldChips(key, summaryChip = false) {
      const { options, unit } = fields2[key];
      const picked = [...selected[key]].sort((a, b) => a - b);
      const chips = picked.map((index) => chip(options[index].label, key, index, summaryChip));
      const bounds = customRanges.get(key);
      if (bounds) chips.push(chip(customRangeLabel(bounds, unit), key, "custom", summaryChip));
      return chips;
    }
    function renderBaseValue(key) {
      const chips = fieldChips(key);
      const control = fieldTrigger(key).closest(".cl-control");
      control.querySelector(".cl-trigger-value").innerHTML = chips.length ? chips.join("") + '<span class="cl-selected-value cl-overflow-count" hidden></span>' : '<span class="cl-unlimited">\u4E0D\u9650</span>';
      container.querySelector(`[data-ml-clear-field="${key}"]`).disabled = chips.length === 0;
      fitFilterChips(control);
    }
    function applyCustomRange(form, enabled, focusInvalid = false) {
      const key = form.dataset.clCustomForm;
      const current = customRanges.get(key);
      const bounds = validateCustomRange(form, enabled, current, focusInvalid);
      if (bounds === null || bounds?.[0] === current?.[0] && bounds?.[1] === current?.[1]) return;
      if (bounds) customRanges.set(key, bounds);
      else customRanges.delete(key);
      renderBaseValue(key);
      apply();
    }
    function resetCustomForm(form) {
      form.reset();
      form.querySelector(".cl-form-error").textContent = "";
    }
    function clearBaseField(key) {
      selected[key].clear();
      customRanges.delete(key);
      const form = container.querySelector(`[data-cl-custom-form="${key}"]`);
      if (form) resetCustomForm(form);
      renderBaseValue(key);
      renderOptions(key);
      const body = container.querySelector(`#ml-filter-${key} .ml-base-menu-body`);
      body.scrollTop = 0;
      body.querySelector(".cl-checkbox")?.focus({ preventScroll: true });
      apply();
    }
    function completePairs() {
      return groups.flatMap((group) => {
        const { metric: metric2, pairs } = selections[scope][group.key];
        return pairs.filter(activePair).map((pair) => ({ ...pair, group: group.key, metric: metric2, label: group.metrics[metric2] }));
      });
    }
    function valueConfig(metric2, period) {
      const types2 = [...selected.type].map((index) => fields2.type.options[index].label);
      return performanceValueConfig(metric2, period, types2);
    }
    function renderSummary() {
      const { name, company } = queries;
      const fieldsSelected = controls.map(([label, keys]) => {
        const values = keys.flatMap((key) => {
          if (key === "company") return company ? [chip(company, key, 0, true)] : [];
          return fieldChips(key, true);
        });
        return values.length ? `<div class="cl-summary-chip"><span class="cl-summary-label">${label}</span>${values.join("")}</div>` : "";
      }).join("");
      const conditions = completePairs();
      const performanceSummary = groups.map(({ key }) => {
        const pairs = conditions.filter((pair) => pair.group === key).sort((first, second) => periodOrder.indexOf(first.period) - periodOrder.indexOf(second.period));
        if (!pairs.length) return "";
        return `<div class="cl-summary-chip ml-rank-summary"><span class="cl-summary-label">${scopes[scope]}\uFF5C${pairs[0].label}</span>
        ${pairs.map(({ id, label, metric: metric2, period, rank: rank2, threshold }) => {
          const values = [periods[period]];
          if (rank2) values.push(rankLabel(rank2));
          if (threshold) values.push(thresholdLabel(threshold, valueConfig(metric2, period).unit));
          return `<span class="cl-summary-value"><span>${values.join("\uFF5C")}</span>
            <button type="button" class="cl-value-remove" data-ml-remove-pair="${id}" data-ml-group="${key}" aria-label="\u79FB\u9664${periods[period]}${label}\u6761\u4EF6"></button></span>`;
        }).join("")}</div>`;
      }).join("");
      const count = Number(Boolean(name)) + Number(Boolean(company)) + customRanges.size + Object.values(selected).reduce((total, values) => total + values.size, 0) + conditions.length;
      summary.hidden = count === 0;
      summary.innerHTML = count ? `<span class="cl-summary-count">\u5DF2\u9009 <strong>(${count})</strong></span>
      <div class="cl-summary-tags">${name ? `<div class="cl-summary-chip"><span class="cl-summary-label">\u57FA\u91D1\u7ECF\u7406\u59D3\u540D</span>${chip(name, "name", 0, true)}</div>` : ""}${fieldsSelected}${performanceSummary}</div>
      <button type="button" class="cl-clear" data-ml-clear-filters aria-label="\u6E05\u7A7A\u7B5B\u9009"></button>` : "";
    }
    function apply() {
      renderSummary();
      const { name, company } = queries;
      const activeScope = scope;
      const conditions = completePairs();
      const filters = Object.entries(fields2).flatMap(([key, field2]) => {
        const bounds = customRanges.get(key);
        if (!bounds && !selected[key].size) return [];
        return [{ value: field2.value, options: [...selected[key]].map((index) => field2.options[index]), bounds }];
      });
      onChange((manager) => {
        if (name && !companyMatchesQuery({ name: manager.name, shortName: manager.name }, name)) return false;
        if (company) {
          const employer = companyById.get(manager.companyId);
          if (!employer || !companyMatchesQuery(employer, company)) return false;
        }
        if (!filters.every(({ value, options, bounds }) => {
          const metric2 = value(manager);
          if (bounds && finite(metric2)) {
            const [min, max] = bounds;
            if ((min === null || metric2 >= min) && (max === null || metric2 <= max)) return true;
          }
          return options.some((option) => option.matches(metric2));
        })) return false;
        return conditions.every(
          ({ metric: metric2, period, rank: rank2, threshold }) => (!rank2 || matchesBounds(manager.performance?.[activeScope]?.[metric2]?.[period], rank2)) && (!threshold || matchesBounds(manager.performanceValues?.[activeScope]?.[metric2]?.[period], threshold))
        );
      }, name);
    }
    function renderPerformanceRange(group, kind, pair, id, label, unit, custom) {
      const errorId = `ml-error-${id}`;
      const isRank = kind === "rank";
      const inputBounds = isRank ? ' min="0" max="100"' : group.key === "risk" ? ' min="0"' : "";
      const [minimumLabel, maximumLabel] = isRank ? ["\u8D77\u59CB", "\u7ED3\u675F"] : ["\u6700\u4F4E", "\u6700\u9AD8"];
      const formLabel = isRank ? "\u81EA\u5B9A\u4E49\u6392\u540D\u533A\u95F4" : "\u81EA\u5B9A\u4E49\u533A\u95F4";
      const bound = (name, hint, value) => `<label class="ml-threshold-bound">
      <input type="number" step="any"${inputBounds} name="${name}" placeholder="${hint}"
        aria-label="${hint}${label}${unit ? `\uFF08${unit}\uFF09` : ""}" aria-describedby="${errorId}" value="${esc(value ?? "")}">
      ${unit ? `<span aria-hidden="true">${unit}</span>` : ""}</label>`;
      return `<form class="ml-threshold-form" data-ml-range-form="${kind}" data-ml-group="${group.key}" data-ml-pair="${pair.id}" novalidate>
      <div class="ml-threshold-custom-row" role="group" aria-label="${formLabel}${custom ? "\uFF08\u5DF2\u9009\uFF09" : ""}"${custom ? ' data-ml-custom-selected tabindex="-1"' : ""}>
        <div class="ml-threshold-range">
          ${bound("minimum", minimumLabel, custom?.min)}<span class="ml-threshold-dash" aria-hidden="true">\u2013</span>${bound("maximum", maximumLabel, custom?.max)}
        </div>
        ${custom ? checkImage : ""}
      </div>
      <div class="ml-threshold-error" id="${errorId}" role="alert"></div>
      <div class="ml-threshold-actions" hidden><button type="button" data-ml-cancel-range>\u53D6\u6D88</button><button type="submit">\u786E\u5B9A</button></div>
    </form>`;
    }
    function dropdown2(group, kind, pair, label, choices, value, config) {
      const id = `${group.key}-${kind}${pair ? `-${pair.id}` : ""}`;
      const expanded = performanceOpen === id;
      const selectedValue = config ? value?.custom ? null : value?.label ?? "" : value;
      const custom = config && value && !choices.some(([choice]) => choice === selectedValue) ? value : null;
      const list = expanded ? `<div class="cl-menu ml-single-menu${config ? " ml-threshold-menu" : ""}" id="ml-menu-${id}">
      <div class="cl-options" role="listbox" aria-label="${label}\u9009\u9879">${choices.map(([choice, text]) => {
        const checked = choice === selectedValue;
        return `<button type="button" class="cl-option" role="option" aria-selected="${checked}" data-ml-perf-choice="${esc(choice)}"
          data-ml-group="${group.key}" data-ml-kind="${kind}" ${pair ? `data-ml-pair="${pair.id}"` : ""}>
          <span>${esc(text)}</span>${checked ? checkImage : ""}</button>`;
      }).join("")}</div>
      ${config ? renderPerformanceRange(group, kind, pair, id, label, config.unit, custom) : ""}
    </div>` : "";
      const selectedLabel = !value ? "" : kind === "rank" ? rankLabel(value) : config ? thresholdLabel(value, config.unit) : choices.find(([choice]) => choice === value)?.[1];
      const title = selectedLabel || label;
      const disabled = config && !pair.period;
      const accessibleTitle = kind === "metric" || kind === "threshold" && value ? `${label} ${title}` : config && !value ? `${label}\uFF08\u4E0D\u9650\uFF09` : title;
      return `<div class="ml-perf-select ml-perf-${kind}" data-ml-dropdown>
      <button type="button" class="ml-perf-trigger" id="ml-trigger-${id}" data-ml-menu="${id}" aria-label="${esc(accessibleTitle)}"${config ? "" : ' aria-haspopup="listbox"'} aria-expanded="${expanded}"${expanded ? ` aria-controls="ml-menu-${id}"` : ""}${disabled ? " disabled" : ""}>
        ${kind === "metric" ? `<span class="ml-perf-placeholder">${label}</span>` : ""}
        <span class="${value ? "ml-perf-value" : "ml-perf-placeholder"}"${value ? ` title="${esc(title)}"` : ""}>${esc(title)}</span><span class="cl-chevron" aria-hidden="true"></span>
      </button>${list}
    </div>`;
    }
    function renderPerformance() {
      performance.innerHTML = `
      <div class="cl-scale-modes ml-filter-modes" role="group" aria-label="\u4E1A\u7EE9\u7B5B\u9009\u5BF9\u8C61">
        ${Object.entries(scopes).map(([key, label]) => `<button type="button" data-ml-scope="${key}" aria-pressed="${scope === key}">${label}</button>`).join("")}
      </div>
      <div class="ml-metric-rows">${groups.map((group) => {
        const { metric: metric2, pairs } = selections[scope][group.key];
        return `<div class="ml-metric-row">
          ${dropdown2(group, "metric", null, group.label, Object.entries(group.metrics), metric2)}
          <div class="ml-perf-pairs">${pairs.map((pair) => {
          const availablePeriods = Object.entries(periods).filter(([period]) => !pairs.some((other) => other !== pair && other.period === period));
          const config = valueConfig(metric2, pair.period);
          return `<div class="ml-perf-pair"${pair.rank?.custom && pair.rank.min !== null ? " data-ml-custom-rank" : ""}>
              <div class="ml-perf-segments">
                ${dropdown2(group, "period", pair, "\u65F6\u6BB5", availablePeriods, pair.period)}
                ${dropdown2(group, "rank", pair, ranking.label, rangeChoices(ranking), pair.rank, ranking)}
                ${dropdown2(group, "threshold", pair, config.label, rangeChoices(config), pair.threshold, config)}
              </div>
              <button type="button" class="cl-value-remove" data-ml-remove-pair="${pair.id}" data-ml-group="${group.key}" aria-label="\u79FB\u9664\u6B64\u7EC4\u65F6\u6BB5\u6761\u4EF6"></button>
            </div>`;
        }).join("")}
          ${pairs.length < periodOrder.length ? `<button type="button" class="ml-add-pair" data-ml-add-pair="${group.key}" data-ml-dropdown>\u6DFB\u52A0\u65F6\u6BB5\u6761\u4EF6</button>` : ""}</div>
        </div>`;
      }).join("")}</div>`;
    }
    function focusMenu(id) {
      const menu = container.querySelector(`#ml-menu-${id}`);
      (menu?.querySelector('[aria-selected="true"], [data-ml-custom-selected]') || menu?.querySelector('[role="option"]'))?.focus({ preventScroll: true });
    }
    function openPerformanceMenu(id) {
      closeBaseMenu();
      const wasOpen = performanceOpen === id;
      performanceOpen = wasOpen ? null : id;
      renderPerformance();
      if (performanceOpen) focusMenu(id);
      else container.querySelector(`#ml-trigger-${id}`)?.focus({ preventScroll: true });
    }
    function closePerformanceMenu(restoreFocus = false) {
      if (!performanceOpen) return;
      const id = performanceOpen;
      performanceOpen = null;
      renderPerformance();
      if (restoreFocus) container.querySelector(`#ml-trigger-${id}`)?.focus({ preventScroll: true });
    }
    function choosePerformance(option) {
      const { mlPerfChoice: choice, mlGroup: group, mlKind: kind, mlPair } = option.dataset;
      const data = selections[scope][group];
      const pair = data.pairs.find((item) => String(item.id) === mlPair);
      const wasActive = kind === "metric" ? data.pairs.some(activePair) : activePair(pair);
      if (kind === "metric" && data.metric !== choice) {
        data.metric = choice;
        data.pairs.forEach((item) => {
          item.threshold = null;
        });
      } else if (kind === "period") {
        pair.period = choice;
      } else if (kind === "rank" || kind === "threshold") {
        const { presets } = kind === "rank" ? ranking : valueConfig(data.metric, pair.period);
        pair[kind] = presets.find((preset) => preset.label === choice) ?? null;
      }
      closePerformanceMenu(true);
      if (wasActive || pair && activePair(pair)) apply();
    }
    function choosePerformanceRange(form) {
      const { minimum, maximum } = form.elements;
      const { mlGroup, mlPair, mlRangeForm: kind } = form.dataset;
      const isRank = kind === "rank";
      const min = minimum.value === "" ? null : minimum.valueAsNumber;
      const max = maximum.value === "" ? null : maximum.valueAsNumber;
      const error = form.querySelector(".ml-threshold-error");
      if (!minimum.validity.valid || !maximum.validity.valid) {
        const invalid = minimum.validity.valid ? maximum : minimum;
        if (isRank && (invalid.validity.rangeUnderflow || invalid.validity.rangeOverflow)) {
          error.textContent = "\u6392\u540D\u767E\u5206\u6BD4\u987B\u5728 0%\uFF5E100% \u4E4B\u95F4";
        } else {
          error.textContent = invalid.validity.rangeUnderflow ? "\u98CE\u9669\u6307\u6807\u7684\u6570\u503C\u987B\u5927\u4E8E\u6216\u7B49\u4E8E 0" : "\u8BF7\u8F93\u5165\u6709\u6548\u6570\u503C";
        }
        invalid.focus();
        return;
      }
      if (min === null && max === null || min !== null && max !== null && min > max) {
        error.textContent = min === null && max === null ? "\u8BF7\u81F3\u5C11\u586B\u5199\u4E00\u4E2A\u503C" : isRank ? "\u8D77\u59CB\u767E\u5206\u6BD4\u4E0D\u80FD\u5927\u4E8E\u7ED3\u675F\u767E\u5206\u6BD4" : "\u6700\u4F4E\u503C\u4E0D\u80FD\u5927\u4E8E\u6700\u9AD8\u503C";
        minimum.focus();
        return;
      }
      const pair = selections[scope][mlGroup].pairs.find((item) => String(item.id) === mlPair);
      pair[kind] = { min, max, custom: true };
      closePerformanceMenu(true);
      apply();
    }
    function addPair(group) {
      const pair = { id: ++pairId, period: "", rank: null, threshold: null };
      selections[scope][group].pairs.push(pair);
      openPerformanceMenu(`${group}-period-${pair.id}`);
    }
    function removePair(group, id, fromSummary) {
      const data = selections[scope][group];
      const removed = data.pairs.find((pair) => String(pair.id) === id);
      data.pairs = data.pairs.filter((pair) => pair !== removed);
      performanceOpen = null;
      renderPerformance();
      if (removed && activePair(removed)) apply();
      const add = performance.querySelector(`[data-ml-add-pair="${group}"]`);
      (fromSummary ? summary.querySelector("button") || toggle : add)?.focus({ preventScroll: true });
    }
    function clearFields() {
      for (const [key, input] of Object.entries(searchInputs)) {
        queries[key] = "";
        input.value = "";
      }
      customRanges.clear();
      container.querySelectorAll("[data-cl-custom-form]").forEach(resetCustomForm);
      for (const [key, values] of Object.entries(selected)) {
        values.clear();
        renderBaseValue(key);
        if (baseOpen === key) renderOptions(key);
      }
      selections.representative = makeScope();
      selections.index = makeScope();
      performanceOpen = null;
      renderPerformance();
      apply();
      searchInputs.name.focus({ preventScroll: true });
    }
    function syncQuery(key) {
      const next = searchInputs[key].value.trim();
      if (next === queries[key]) return;
      queries[key] = next;
      apply();
    }
    for (const [key, input] of Object.entries(searchInputs)) {
      input.addEventListener("input", (event) => {
        if (!event.isComposing) syncQuery(key);
      }, { signal });
      input.addEventListener("compositionend", () => syncQuery(key), { signal });
    }
    toggle.addEventListener("click", () => {
      const expanded = performance.hidden;
      closeBaseMenu();
      closePerformanceMenu();
      performance.hidden = !expanded;
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute("aria-label", expanded ? "\u6536\u8D77\u7B5B\u9009" : "\u66F4\u591A\u7B5B\u9009");
    }, { signal });
    container.addEventListener("change", (event) => {
      const input = event.target;
      const form = input.form;
      if (form?.dataset.clCustomForm && input === form.elements.useCustom) {
        applyCustomRange(form, input.checked, true);
        return;
      }
      const key = input.dataset.mlChoice;
      if (!key) return;
      if (input.checked) selected[key].add(Number(input.value));
      else selected[key].delete(Number(input.value));
      renderBaseValue(key);
      apply();
    }, { signal });
    container.addEventListener("input", (event) => {
      const input = event.target;
      const form = input.form;
      if (form?.dataset.mlRangeForm) {
        form.querySelector(".ml-threshold-error").textContent = "";
        return;
      }
      if (input.type !== "number" || !form?.dataset.clCustomForm) return;
      if (form.elements.useCustom.checked) applyCustomRange(form, true);
      else form.querySelector(".cl-form-error").textContent = "";
    }, { signal });
    container.addEventListener("focusin", (event) => {
      const form = event.target.form;
      if (event.target.matches("input") && form?.dataset.mlRangeForm) {
        form.querySelector(".ml-threshold-actions").hidden = false;
      }
    }, { signal });
    container.addEventListener("submit", (event) => {
      const form = event.target;
      const isPerformanceRange = form.dataset.mlRangeForm;
      if (!isPerformanceRange && !form.dataset.clCustomForm) return;
      event.preventDefault();
      if (isPerformanceRange) choosePerformanceRange(form);
      else applyCustomRange(form, true, true);
    }, { signal });
    container.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button === toggle) return;
      const data = button.dataset;
      const queryKey = data.mlClearQuery || data.mlRemoveField;
      if (data.mlToggleField) openBaseMenu(data.mlToggleField, event.detail === 0);
      else if (data.mlClearField) clearBaseField(data.mlClearField);
      else if (data.mlMenu) openPerformanceMenu(data.mlMenu);
      else if ("mlPerfChoice" in data) choosePerformance(button);
      else if ("mlCancelRange" in data) closePerformanceMenu(true);
      else if (data.mlAddPair) addPair(data.mlAddPair);
      else if (data.mlRemovePair) removePair(data.mlGroup, data.mlRemovePair, summary.contains(button));
      else if (data.mlScope && data.mlScope !== scope) {
        scope = data.mlScope;
        performanceOpen = null;
        renderPerformance();
        performance.querySelector(`[data-ml-scope="${scope}"]`).focus({ preventScroll: true });
        apply();
      } else if (queryKey === "name" || queryKey === "company") {
        const input = searchInputs[queryKey];
        input.value = "";
        syncQuery(queryKey);
        input.focus({ preventScroll: true });
      } else if (data.mlRemoveField) {
        const key = data.mlRemoveField;
        if (data.mlRemoveValue === "custom") {
          customRanges.delete(key);
          resetCustomForm(container.querySelector(`[data-cl-custom-form="${key}"]`));
        } else {
          selected[key].delete(Number(data.mlRemoveValue));
        }
        renderBaseValue(key);
        if (baseOpen === key) renderOptions(key);
        apply();
        fieldTrigger(key).focus({ preventScroll: true });
      } else if ("mlClearFilters" in data) clearFields();
    }, { signal });
    container.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && (baseOpen || performanceOpen)) {
        event.preventDefault();
        closeBaseMenu(true);
        closePerformanceMenu(true);
      } else if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) && event.target.matches('[role="option"]')) {
        event.preventDefault();
        const options = [...event.target.closest('[role="listbox"]').querySelectorAll('[role="option"]')];
        const current = options.indexOf(event.target);
        const target = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
        options[target].focus();
      }
    }, { signal });
    document.addEventListener("click", (event) => {
      const path = event.composedPath();
      if (path.includes(container) && path.some((node) => node instanceof Element && node.hasAttribute("data-ml-dropdown"))) return;
      closeBaseMenu();
      closePerformanceMenu();
    }, { signal });
    const baseControls = [...container.querySelectorAll(".ml-base-controls .cl-control")];
    const fitBaseControls = () => baseControls.forEach(fitFilterChips);
    const resize = new ResizeObserver(fitBaseControls);
    baseControls.forEach((control) => resize.observe(control));
    document.fonts.addEventListener("loadingdone", fitBaseControls, { signal });
    signal.addEventListener("abort", () => resize.disconnect(), { once: true });
    renderPerformance();
  }

  // dist/components/pagination.js?v=20261125-units
  var pageSizes = [5, 10, 20, 50];
  function mountPagination(widget) {
    if (!widget || widget.dataset.pgMounted) return () => {
    };
    const controller = new AbortController();
    const { signal } = controller;
    widget.dataset.pgMounted = "true";
    const module = widget.dataset.pgKind === "module";
    const total = Math.max(0, Number(widget.dataset.pgTotal) || 0);
    const slotSize = module ? 20 : 28;
    let size = Number(widget.dataset.pgSize) || 5;
    let pages = Math.max(1, Number(widget.dataset.pgPageCount) || Math.ceil(total / size));
    let page = Math.max(1, Math.min(pages, Number(widget.dataset.pgCurrent) || 1));
    let open = false;
    let lastJump = "";
    let rendering = false;
    function arrow(direction) {
      const paths = module ? { prev: "M11.6998 13.4L8.2998 10L11.6998 6.60001", next: "M8.3002 13.4L11.7002 10L8.3002 6.60001" } : { prev: "M16.0479 18.0957L11.9521 14L16.0479 9.9043", next: "M11.9521 18.0957L16.0479 14L11.9521 9.9043" };
      return `<svg aria-hidden="true" width="${slotSize}" height="${slotSize}" viewBox="0 0 ${slotSize} ${slotSize}" fill="none"><path d="${paths[direction]}" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    const downPath = module ? "M1.6 3.3L5 6.7L8.4 3.3" : "M0.904297 2.95215L5 7.04785L9.0957 2.95215";
    const down = `<svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="${downPath}" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const dotCenter = slotSize / 2;
    const dots = `<svg aria-hidden="true" width="${slotSize}" height="${slotSize}" viewBox="0 0 ${slotSize} ${slotSize}">${[dotCenter - 3.164, dotCenter, dotCenter + 3.164].map((x) => `<ellipse cx="${x}" cy="${dotCenter}" rx=".732" ry=".738" fill="currentColor"/>`).join("")}</svg>`;
    function slots() {
      if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1);
      if (page <= 4) return [1, 2, 3, 4, 5, "next", pages];
      if (page >= pages - 3) return [1, "prev", pages - 4, pages - 3, pages - 2, pages - 1, pages];
      return [1, "prev", page - 1, page, page + 1, "next", pages];
    }
    function render(focus) {
      rendering = true;
      try {
        widget.dataset.pgCurrent = page;
        widget.dataset.pgSize = size;
        widget.dataset.pgPageCount = pages;
        const pageButtons = slots().map((value) => typeof value === "number" ? `<button type="button" class="zc-pg-slot" data-pg-number="${value}" aria-label="\u7B2C${value}\u9875"${value === page ? ' aria-current="page"' : ""}>${value}</button>` : `<button type="button" class="zc-pg-slot" data-pg-skip="${value}" aria-label="${value === "prev" ? "\u5411\u524D" : "\u5411\u540E"}\u8DF3\u8FC75\u9875">${dots}</button>`).join("");
        const sizeOptions = pageSizes.map((value) => `<button type="button" class="zc-pg-option" role="option" data-pg-size-option="${value}" aria-selected="${value === size}">${value}<span class="zc-pg-unit">\u6761/\u9875</span></button>`).join("");
        widget.innerHTML = `
        <span class="zc-pg-count"><span>\u5171</span><strong>${total}</strong><span class="zc-pg-unit">\u6761</span></span>
        <div class="zc-pg-controls">
          <div class="zc-pg-pages">
            <button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="prev" aria-label="\u4E0A\u4E00\u9875"${page === 1 ? " disabled" : ""}>${arrow("prev")}</button>
            ${pageButtons}
            <button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="next" aria-label="\u4E0B\u4E00\u9875"${page === pages ? " disabled" : ""}>${arrow("next")}</button>
          </div>
          <div class="zc-pg-size">
            <button type="button" class="zc-pg-size-trigger" aria-label="\u6BCF\u9875\u6761\u6570" aria-haspopup="listbox" aria-expanded="${open}"><span class="zc-pg-size-label">${size}<span class="zc-pg-unit">\u6761/\u9875</span></span>${down}</button>
            <div class="zc-pg-menu" role="listbox" aria-label="\u6BCF\u9875\u6761\u6570\u9009\u9879"${open ? "" : " hidden"}>${sizeOptions}</div>
          </div>
          ${module ? "" : `<label class="zc-pg-jump"><span>\u8DF3\u81F3</span><span class="zc-pg-jump-field"><input aria-label="\u8DF3\u81F3\u9875\u7801" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="9" autocomplete="off" value="${lastJump}"><span class="zc-pg-unit">\u9875</span></span></label>`}
        </div>
        <span class="zc-pg-live-status" role="status" aria-live="polite">\u7B2C${page}\u9875\uFF0C\u5171${pages}\u9875\uFF0C\u6BCF\u9875${size}\u6761</span>`;
        if (open) placeMenu();
        if (focus) widget.querySelector(focus)?.focus({ preventScroll: true });
      } finally {
        rendering = false;
      }
    }
    function placeMenu() {
      if (!open) return;
      const trigger = widget.querySelector(".zc-pg-size-trigger");
      const menu = widget.querySelector(".zc-pg-menu");
      const box = trigger.getBoundingClientRect();
      if (!box.width || box.bottom < 0 || box.top > window.innerHeight) {
        close(false);
        return;
      }
      menu.style.minWidth = `${box.width}px`;
      const bounds = menu.getBoundingClientRect();
      const left = Math.max(8, Math.min(box.right - bounds.width, window.innerWidth - bounds.width - 8));
      let top = box.bottom + 6;
      if (top + bounds.height > window.innerHeight - 8 && box.top - bounds.height - 6 >= 8) {
        top = box.top - bounds.height - 6;
      }
      top = Math.max(8, Math.min(top, window.innerHeight - bounds.height - 8));
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
    }
    function changePage(next, focus) {
      page = Math.max(1, Math.min(pages, next));
      open = false;
      render(focus);
      widget.dispatchEvent(new CustomEvent("paginationchange", {
        bubbles: true,
        detail: { page, pageSize: size, total, pageCount: pages }
      }));
    }
    function close(focus) {
      if (!open) return;
      open = false;
      render(focus ? ".zc-pg-size-trigger" : void 0);
    }
    function jump(input, focus) {
      const value = Number(input.value);
      if (!input.value.trim() || !Number.isFinite(value)) {
        input.value = lastJump;
        return;
      }
      lastJump = String(Math.max(1, Math.min(pages, Math.trunc(value))));
      input.value = lastJump;
      changePage(Number(lastJump), focus ? ".zc-pg-jump input" : void 0);
    }
    widget.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button.disabled) return;
      if (button.hasAttribute("data-pg-number")) {
        const next = Number(button.dataset.pgNumber);
        changePage(next, `[data-pg-number="${next}"]`);
      } else if (button.hasAttribute("data-pg-direction")) {
        const next = page + (button.dataset.pgDirection === "prev" ? -1 : 1);
        changePage(next, `[data-pg-number="${next}"]`);
      } else if (button.hasAttribute("data-pg-skip")) {
        changePage(page + (button.dataset.pgSkip === "prev" ? -5 : 5));
      } else if (button.classList.contains("zc-pg-size-trigger")) {
        open = !open;
        render(open ? `[data-pg-size-option="${size}"]` : ".zc-pg-size-trigger");
      } else if (button.hasAttribute("data-pg-size-option")) {
        size = Number(button.dataset.pgSizeOption);
        pages = Math.max(1, Math.ceil(total / size));
        lastJump = "";
        changePage(1, ".zc-pg-size-trigger");
      }
    }, { signal });
    widget.addEventListener("input", (event) => {
      if (event.target.matches(".zc-pg-jump input")) event.target.value = event.target.value.replace(/\D/g, "");
    }, { signal });
    widget.addEventListener("keydown", (event) => {
      const jumpField = event.target.matches(".zc-pg-jump input");
      if (event.key === "Escape") {
        if (open) {
          event.preventDefault();
          close(true);
        } else if (jumpField) event.target.value = lastJump;
        return;
      }
      if (jumpField && event.key === "Enter") {
        event.preventDefault();
        jump(event.target, true);
        return;
      }
      if (!event.target.closest(".zc-pg-size") || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (!open) {
        open = true;
        render(`[data-pg-size-option="${size}"]`);
        return;
      }
      const options = Array.from(widget.querySelectorAll(".zc-pg-option"));
      const index = options.indexOf(document.activeElement);
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : Math.max(0, Math.min(options.length - 1, index + step));
      options[next]?.focus();
    }, { signal });
    widget.addEventListener("focusout", (event) => {
      if (rendering || widget.contains(event.relatedTarget)) return;
      if (event.target.matches(".zc-pg-jump input")) jump(event.target, false);
      close(false);
    }, { signal });
    document.addEventListener("pointerdown", (event) => {
      if (!widget.contains(event.target)) close(false);
    }, { signal });
    window.addEventListener("resize", placeMenu, { signal });
    window.addEventListener("scroll", placeMenu, { capture: true, signal });
    document.addEventListener("keydown", (event) => {
      if (open && (event.key === "Escape" || event.key === "Esc" || event.code === "Escape" || event.keyCode === 27)) {
        event.preventDefault();
        close(true);
      }
    }, { capture: true, signal });
    render();
    return () => {
      controller.abort();
      delete widget.dataset.pgMounted;
    };
  }

  // dist/manager-list.js
  var escapeHtml2 = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  var money = new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var integer = new Intl.NumberFormat("zh-CN");
  var nameOrder = new Intl.Collator("zh-Hans-CN-u-co-pinyin");
  var comparisonLimit = 4;
  var defaultSort = { key: "scale", direction: -1 };
  var emptyCell = "--";
  var columns = [
    { key: "select", label: "\u9009\u62E9", width: 38 },
    { key: "sequence", label: "\u5E8F\u53F7", width: 52 },
    { key: "name", label: "\u57FA\u91D1\u7ECF\u7406", width: 96, sort: 1 },
    { key: "type", label: "\u7ECF\u7406\u7C7B\u578B", width: 80 },
    { key: "rating", label: "\u57FA\u91D1\u7ECF\u7406\u661F\u7EA7", title: "\u57FA\u91D1\u7ECF\u7406\u661F\u7EA7\uFF08\u7EFC\u5408\uFF09", width: 124, sort: -1 },
    { key: "company", label: "\u73B0\u4EFB\u516C\u53F8", width: 120 },
    { key: "careerYears", label: "\u4ECE\u4E1A\u5E74\u9650", width: 96, sort: -1, numeric: true },
    { key: "tenureDays", label: "\u7BA1\u7406\u5E74\u9650", width: 96, sort: -1, numeric: true },
    { key: "scale", label: "\u5728\u7BA1\u89C4\u6A21", width: 96, sort: -1, numeric: true },
    { key: "product", label: "\u4EE3\u8868\u57FA\u91D1", width: 120 },
    { key: "productType", label: "\u57FA\u91D1\u7C7B\u578B", width: 112 },
    { key: "representativeAnnualized", label: "\u4EE3\u8868\u57FA\u91D1\u5E74\u5316\u56DE\u62A5", width: 152, sort: -1, numeric: true, percent: true },
    { key: "indexTotal", label: "\u57FA\u91D1\u7ECF\u7406\u6307\u6570", title: "\u7ECF\u7406\u6307\u6570\u603B\u56DE\u62A5", width: 126, sort: -1, numeric: true, percent: true },
    { key: "index3m", label: "\u7ECF\u7406\u6307\u6570\u8FD13\u6708", width: 133, sort: -1, numeric: true, percent: true },
    { key: "index1y", label: "\u7ECF\u7406\u6307\u6570\u8FD11\u5E74", width: 130, sort: -1, numeric: true, percent: true },
    { key: "index3y", label: "\u7ECF\u7406\u6307\u6570\u8FD13\u5E74", width: 133, sort: -1, numeric: true, percent: true }
  ];
  var sortIndicator = '<svg class="cl-sort-arrow" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path class="cl-sort-up" d="M6 1 10 5H2Z"/><path class="cl-sort-down" d="m6 11-4-4h8Z"/></svg>';
  function sortValue(manager, key) {
    if (key === "tenureDays" && manager.tenureDays == null) {
      return Number.isFinite(manager.tenure) ? manager.tenure * 365 : null;
    }
    return manager[key];
  }
  function compareRows(left, right, { key, direction }) {
    const a = sortValue(left, key);
    const b = sortValue(right, key);
    const aMissing = a == null || key !== "name" && !Number.isFinite(a);
    const bMissing = b == null || key !== "name" && !Number.isFinite(b);
    if (aMissing !== bMissing) return aMissing ? 1 : -1;
    if (!aMissing) {
      const order = key === "name" ? nameOrder.compare(a, b) : a - b;
      if (order) return order * direction;
    }
    return nameOrder.compare(left.name, right.name) || left.id.localeCompare(right.id);
  }
  function plainTenure(manager) {
    if (manager.tenureLabel) return manager.tenureLabel;
    if (Number.isFinite(manager.tenure)) return `${manager.tenure}\u5E74`;
    if (!Number.isFinite(manager.tenureDays)) return null;
    const years = Math.floor(manager.tenureDays / 365);
    const remainder = manager.tenureDays % 365;
    return `${years}\u5E74${remainder ? `${remainder}\u5929` : ""}`;
  }
  function units(text) {
    return escapeHtml2(text).replace(/[年天亿]/g, (character) => `<span class="cl-unit">${character}</span>`);
  }
  function badge(text) {
    return text ? `<span class="cl-type-tag" title="${escapeHtml2(text)}">${escapeHtml2(text)}</span>` : emptyCell;
  }
  function ratingCell(value) {
    if (!Number.isInteger(value) || value < 1 || value > 5) return emptyCell;
    const filled = '<img src="./assets/manager-list/rating-filled.png" width="29" height="27" alt="">';
    const empty = '<img src="./assets/manager-list/rating-empty.png" width="29" height="27" alt="">';
    return `<span class="ml-stars" role="img" aria-label="\u7EFC\u5408\u8BC4\u7EA7 ${value} \u661F">${filled.repeat(value)}${empty.repeat(5 - value)}</span>`;
  }
  function percentage(value) {
    if (!Number.isFinite(value)) return emptyCell;
    const tone = value > 0 ? "ml-return-up" : value < 0 ? "ml-return-down" : "";
    return `<span class="${tone}">${money.format(value)}%</span>`;
  }
  function companyCell(company) {
    if (!company) return emptyCell;
    const label = escapeHtml2(company.shortName || company.name);
    const title = escapeHtml2(company.name);
    return `<a class="cl-company-link ml-ellipsize" href="#/company/${encodeURIComponent(company.id)}" title="${title}">${label}</a>`;
  }
  function makeCell(column, manager, company, sequence, nameQuery) {
    const { key } = column;
    if (column.percent) return percentage(manager[key]);
    switch (key) {
      case "select":
        return `<input class="cl-checkbox" type="checkbox" data-ml-manager="${escapeHtml2(manager.id)}" aria-label="\u9009\u62E9${escapeHtml2(manager.name)}\u8FDB\u884C\u6BD4\u8F83">`;
      case "sequence":
        return sequence;
      case "name": {
        const sample = manager.isDemo && !manager.name.startsWith("\u793A\u4F8B");
        const label = companyNameParts({ name: manager.name, shortName: manager.name }, nameQuery).map(({ text, matched }) => {
          const escaped = escapeHtml2(text);
          return matched ? `<strong class="cl-company-match">${escaped}</strong>` : escaped;
        }).join("");
        return `<a class="cl-company-link ml-manager-name" href="#/manager/${encodeURIComponent(manager.id)}" title="${escapeHtml2(manager.name)}">${label}</a>${sample ? ' <span class="ml-demo-label" title="\u793A\u4F8B\u6570\u636E">\u793A\u4F8B</span>' : ""}`;
      }
      case "type":
        return badge(manager.type);
      case "rating":
        return ratingCell(manager.rating);
      case "company":
        return companyCell(company);
      case "careerYears":
        return Number.isFinite(manager.careerYears) ? units(`${manager.careerYears}\u5E74`) : emptyCell;
      case "tenureDays": {
        const tenure = plainTenure(manager);
        return tenure ? units(tenure) : emptyCell;
      }
      case "scale":
        return Number.isFinite(manager.scale) ? units(`${money.format(manager.scale)}\u4EBF`) : emptyCell;
      case "product":
        return manager.product ? `<span class="ml-ellipsize" title="${escapeHtml2(manager.product)}">${escapeHtml2(manager.product)}</span>` : emptyCell;
      case "productType":
        return badge(manager.productType);
    }
  }
  function csvRow(manager, company, sequence) {
    return [
      sequence,
      manager.name,
      manager.type,
      manager.rating,
      company?.name,
      manager.careerYears,
      plainTenure(manager),
      manager.scale,
      manager.product,
      manager.productType,
      ...columns.filter((column) => column.percent).map(({ key }) => Number.isFinite(manager[key]) ? `${manager[key]}%` : ""),
      manager.isDemo ? "\u793A\u4F8B" : ""
    ];
  }
  function downloadCsv(rows3, filename) {
    const csv = rows3.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  function mountManagerList(root) {
    const { companies, managers } = getManagerListData();
    const companyById = new Map(companies.map((company) => [company.id, company]));
    const comparedManagers = /* @__PURE__ */ new Set();
    const events = new AbortController();
    const { signal } = events;
    let filterRecords = () => true;
    let nameQuery = "";
    let records = [];
    let sort = defaultSort;
    let page = 1;
    let pageSize = 10;
    let unmountPagination;
    let noticeTimeout;
    let noticeTrigger;
    root.innerHTML = `
    <div class="cl-page ml-page">
      <section class="cl-card cl-filters" aria-labelledby="ml-title"></section>
      <section class="cl-card cl-results" aria-label="\u7ECF\u7406\u5217\u8868">
        <div class="cl-results-toolbar ml-results-toolbar">
          <p class="cl-result-count" role="status"><span>\u4E3A\u60A8\u627E\u5230</span> <strong>0</strong> <span>\u4F4D\u57FA\u91D1\u7ECF\u7406</span></p>
          <div class="ml-results-actions">
            <button class="ml-compare-button" type="button" aria-label="\u7ECF\u7406 PK" aria-disabled="true" aria-describedby="ml-compare-tip"></button>
            <span class="zc-title-help-panel ml-compare-tip" id="ml-compare-tip" role="tooltip">\u8BF7\u9009\u62E9\u81F3\u5C11 2 \u4F4D\u57FA\u91D1\u7ECF\u7406\u8FDB\u884C\u6BD4\u8F83\u3002</span>
            <div class="zc-module-actions" role="group" aria-label="\u7ECF\u7406\u5217\u8868\u64CD\u4F5C">
              <button class="zc-module-icon" type="button" data-ml-export-toggle aria-label="\u5BFC\u51FA\u7ECF\u7406\u5217\u8868" title="\u5BFC\u51FA\u7ECF\u7406\u5217\u8868"
                aria-expanded="false" aria-haspopup="menu" aria-controls="ml-export-menu">
                <img src="./design-system/assets/module-actions/table-download.png" width="28" height="28" alt="">
              </button>
              <button class="zc-module-icon" type="button" data-ml-refresh aria-label="\u5237\u65B0\u5217\u8868" title="\u5237\u65B0\u5217\u8868">
                <img src="./design-system/assets/module-actions/refresh.png" width="28" height="28" alt="">
              </button>
              <div class="cl-menu cl-export-menu" id="ml-export-menu" role="menu" aria-label="\u5BFC\u51FA\u8303\u56F4" hidden>
                <div class="cl-options" role="none">
                  <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-ml-export="page">
                    \u5BFC\u51FA\u5F53\u524D\u9875<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
                  </button>
                  <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-ml-export="all">
                    \u5BFC\u51FA\u5168\u90E8\u7ED3\u679C<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cl-table-scroll" role="region" aria-label="\u7ECF\u7406\u7B5B\u9009\u7ED3\u679C" tabindex="0">
          <table class="cl-table ml-table" aria-label="\u7ECF\u7406\u7B5B\u9009\u7ED3\u679C">
            <colgroup>${columns.map(({ width }) => `<col style="width:${width}px">`).join("")}</colgroup>
            <thead></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="cl-pagination zc-pagination" data-pg-kind="page" role="navigation" aria-label="\u7ECF\u7406\u5217\u8868\u5206\u9875"></div>
      </section>
      <div class="zhice-message cl-results-message" data-type="success" role="status" popover="manual">
        <img class="zhice-message-icon" width="12" height="12" src="./design-system/assets/messages/success.png" alt="">
        <span class="zhice-message-text"></span>
        <button class="zhice-message-close" type="button" aria-label="\u5173\u95ED\u63D0\u793A">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.1"/><path d="m4.7 4.7 4.6 4.6m0-4.6L4.7 9.3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>`;
    const toolbar = root.querySelector(".ml-results-toolbar");
    const resultCount = toolbar.querySelector(".cl-result-count strong");
    const compareButton = toolbar.querySelector(".ml-compare-button");
    const moduleActions = toolbar.querySelector(".zc-module-actions");
    const exportToggle = moduleActions.querySelector("[data-ml-export-toggle]");
    const refreshButton = moduleActions.querySelector("[data-ml-refresh]");
    const exportMenu = moduleActions.querySelector(".cl-export-menu");
    const exportOptions = [...exportMenu.querySelectorAll("[data-ml-export]")];
    const resultsMessage = root.querySelector(".cl-results-message");
    const noticeIcon = resultsMessage.querySelector(".zhice-message-icon");
    const tableScroll = root.querySelector(".cl-table-scroll");
    const thead = tableScroll.querySelector("thead");
    const tbody = tableScroll.querySelector("tbody");
    const pagination = root.querySelector(".cl-pagination");
    function columnClass(key, numeric) {
      return `ml-cell-${key}${numeric ? " cl-number" : ""}`;
    }
    function renderHeader() {
      thead.innerHTML = `<tr>${columns.map(({ key, label, title, sort: sortable, numeric }) => {
        const direction = sort.key === key ? sort.direction === 1 ? "ascending" : "descending" : null;
        const content = key === "select" ? '<input class="cl-checkbox" type="checkbox" data-ml-select-page aria-label="\u5168\u9009\u5F53\u524D\u9875\u7ECF\u7406" title="\u5168\u9009\u5F53\u524D\u9875\u7ECF\u7406">' : sortable ? `<button type="button" class="cl-sort" data-ml-sort="${key}"${title ? ` title="${title}" aria-label="${title}"` : ""}>${label}${sortIndicator}</button>` : label;
        return `<th scope="col" class="${columnClass(key, numeric)}"${direction ? ` aria-sort="${direction}"` : ""}>${content}</th>`;
      }).join("")}</tr>`;
    }
    function updateOverflow() {
      tableScroll.classList.toggle("has-horizontal-overflow", tableScroll.scrollWidth > tableScroll.clientWidth);
    }
    function renderRows() {
      const start = (page - 1) * pageSize;
      const visible = records.slice(start, start + pageSize);
      tbody.innerHTML = visible.length ? visible.map((manager, index) => {
        const company = companyById.get(manager.companyId);
        return `<tr>${columns.map((column) => `<td class="${columnClass(column.key, column.numeric)}">${makeCell(column, manager, company, start + index + 1, nameQuery)}</td>`).join("")}</tr>`;
      }).join("") : `<tr><td class="cl-empty" colspan="${columns.length}">\u672A\u627E\u5230\u7B26\u5408\u6761\u4EF6\u7684\u7ECF\u7406</td></tr>`;
      syncCompareCheckboxes();
      updateOverflow();
    }
    function syncCompareCheckboxes() {
      const boxes = tbody.querySelectorAll("[data-ml-manager]");
      let checked = 0;
      for (const box of boxes) {
        box.checked = comparedManagers.has(box.dataset.mlManager);
        if (box.checked) checked++;
        box.closest("tr").classList.toggle("ml-selected-row", box.checked);
      }
      const selectPage = thead.querySelector("[data-ml-select-page]");
      selectPage.disabled = boxes.length === 0;
      selectPage.checked = !selectPage.disabled && checked === boxes.length;
      selectPage.indeterminate = checked > 0 && !selectPage.checked;
    }
    function renderComparedManagers() {
      const disabled = comparedManagers.size < 2;
      compareButton.setAttribute("aria-disabled", String(disabled));
      if (disabled) compareButton.setAttribute("aria-describedby", "ml-compare-tip");
      else compareButton.removeAttribute("aria-describedby");
      syncCompareCheckboxes();
    }
    function renderResults() {
      records = managers.filter(filterRecords).sort((left, right) => compareRows(left, right, sort));
      page = Math.min(page, Math.max(1, Math.ceil(records.length / pageSize)));
      resultCount.textContent = integer.format(records.length);
      exportToggle.disabled = records.length === 0;
      if (exportToggle.disabled) setExportMenu(false);
      renderHeader();
      renderRows();
      unmountPagination?.();
      Object.assign(pagination.dataset, { pgTotal: records.length, pgCurrent: page, pgSize: pageSize });
      unmountPagination = mountPagination(pagination);
      tableScroll.scrollTop = 0;
    }
    function setExportMenu(open) {
      exportMenu.hidden = !open;
      exportToggle.setAttribute("aria-expanded", String(open));
      if (open) (exportMenu.querySelector('[aria-checked="true"]') ?? exportOptions[0]).focus({ preventScroll: true });
    }
    function hideNotice() {
      clearTimeout(noticeTimeout);
      if (resultsMessage.contains(document.activeElement)) {
        const trigger = noticeTrigger?.isConnected && !noticeTrigger.disabled ? noticeTrigger : refreshButton;
        trigger.focus({ preventScroll: true });
      }
      resultsMessage.hidePopover();
    }
    function showNotice(text, trigger, type = "success") {
      clearTimeout(noticeTimeout);
      noticeTrigger = trigger;
      resultsMessage.dataset.type = type;
      noticeIcon.src = `./design-system/assets/messages/${type}.png`;
      if (!resultsMessage.matches(":popover-open")) resultsMessage.showPopover();
      resultsMessage.querySelector(".zhice-message-text").textContent = text;
      noticeTimeout = window.setTimeout(hideNotice, 3e3);
    }
    function exportManagers(scope) {
      const currentPage = scope === "page";
      const start = currentPage ? (page - 1) * pageSize : 0;
      const entries = currentPage ? records.slice(start, start + pageSize) : records;
      const headings = columns.slice(1).map(({ key, label, title }) => {
        if (key === "scale") return `${label}\uFF08\u4EBF\uFF09`;
        if (key === "careerYears") return `${label}\uFF08\u5E74\uFF09`;
        return title || label;
      });
      const data = entries.map((manager, index) => csvRow(manager, companyById.get(manager.companyId), start + index + 1));
      downloadCsv([[...headings, "\u6570\u636E\u6807\u8BB0"], ...data], currentPage ? "\u7ECF\u7406\u5217\u8868-\u5F53\u524D\u9875.csv" : "\u7ECF\u7406\u5217\u8868-\u5168\u90E8\u7ED3\u679C.csv");
      showNotice(currentPage ? "\u5F53\u524D\u9875\u5BFC\u51FA\u6210\u529F" : "\u5168\u90E8\u7ED3\u679C\u5BFC\u51FA\u6210\u529F", exportToggle);
    }
    mountManagerFilters(root.querySelector(".cl-filters"), {
      companies,
      managers,
      signal,
      onChange(predicate, query) {
        filterRecords = predicate;
        nameQuery = query;
        page = 1;
        renderResults();
      }
    });
    thead.addEventListener("click", (event) => {
      const button = event.target.closest("[data-ml-sort]");
      if (!button) return;
      const column = columns.find(({ key }) => key === button.dataset.mlSort);
      if (sort.key !== column.key) sort = { key: column.key, direction: column.sort };
      else if (sort.direction === column.sort) sort = { key: column.key, direction: -column.sort };
      else sort = defaultSort;
      page = 1;
      renderResults();
      thead.querySelector(`[data-ml-sort="${column.key}"]`).focus({ preventScroll: true });
    }, { signal });
    thead.addEventListener("change", (event) => {
      const selectPage = event.target;
      if (!selectPage.hasAttribute("data-ml-select-page")) return;
      for (const { dataset: { mlManager } } of tbody.querySelectorAll("[data-ml-manager]")) {
        if (selectPage.checked) comparedManagers.add(mlManager);
        else comparedManagers.delete(mlManager);
      }
      renderComparedManagers();
    }, { signal });
    pagination.addEventListener("paginationchange", ({ detail }) => {
      page = detail.page;
      pageSize = detail.pageSize;
      renderRows();
      tableScroll.scrollTop = 0;
    }, { signal });
    tbody.addEventListener("change", (event) => {
      const box = event.target;
      const id = box.dataset.mlManager;
      if (!id) return;
      if (box.checked) comparedManagers.add(id);
      else comparedManagers.delete(id);
      renderComparedManagers();
    }, { signal });
    compareButton.addEventListener("click", () => {
      if (comparedManagers.size < 2) return;
      if (comparedManagers.size > comparisonLimit) {
        showNotice(`\u6700\u591A\u9009\u62E9 ${comparisonLimit} \u4F4D\u57FA\u91D1\u7ECF\u7406\u8FDB\u884C\u6BD4\u8F83\u3002`, compareButton, "warning");
        return;
      }
      const params = new URLSearchParams([...comparedManagers].map((id) => ["manager", id]));
      location.hash = `#/manager-compare?${params}`;
    }, { signal });
    exportToggle.addEventListener("click", () => setExportMenu(exportMenu.hidden), { signal });
    exportMenu.addEventListener("click", (event) => {
      const selected = event.target.closest("[data-ml-export]");
      if (!selected) return;
      exportOptions.forEach((option) => option.setAttribute("aria-checked", String(option === selected)));
      setExportMenu(false);
      exportToggle.focus({ preventScroll: true });
      exportManagers(selected.dataset.mlExport);
    }, { signal });
    moduleActions.addEventListener("keydown", (event) => {
      if (exportMenu.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setExportMenu(false);
        exportToggle.focus({ preventScroll: true });
      } else if (exportMenu.contains(event.target) && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const current = exportOptions.indexOf(event.target);
        const next = event.key === "Home" ? 0 : event.key === "End" ? exportOptions.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + exportOptions.length) % exportOptions.length;
        exportOptions[next].focus({ preventScroll: true });
      }
    }, { signal });
    moduleActions.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !moduleActions.contains(event.relatedTarget)) setExportMenu(false);
    }, { signal });
    refreshButton.addEventListener("click", () => {
      setExportMenu(false);
      renderResults();
      showNotice("\u5DF2\u5237\u65B0", refreshButton);
    }, { signal });
    resultsMessage.querySelector(".zhice-message-close").addEventListener("click", hideNotice, { signal });
    document.addEventListener("click", (event) => {
      if (!moduleActions.contains(event.target)) setExportMenu(false);
    }, { signal });
    const resize = new ResizeObserver(updateOverflow);
    resize.observe(tableScroll);
    renderResults();
    renderComparedManagers();
    return () => {
      events.abort();
      unmountPagination?.();
      resize.disconnect();
      clearTimeout(noticeTimeout);
    };
  }

  // dist/components/detail-header-scroll.js
  function attachDetailHeaderScroll(root, { tabScrollEvent = "company-tab-scroll", onCompact = () => {
  }, revealTallHeader = false } = {}) {
    const slot = root.querySelector(".company-header-slot");
    const header3 = root.querySelector(".company-header");
    const facts = root.querySelector(".company-facts-wrap");
    const title = header3.querySelector("h1");
    const switchAction = header3.querySelector('[data-company-action="switch"], [data-md-action="switch"]');
    const topbar = document.querySelector(".app-topbar");
    let compact = false;
    let pinned = false;
    let previousY = 0;
    let accumulated = 0;
    let frame = 0;
    let top = 52;
    let anchor = 0;
    function fitCompactMetadata() {
      header3.classList.remove("is-metadata-hidden");
      const fits = title.scrollWidth <= title.clientWidth;
      header3.classList.toggle("is-metadata-hidden", !fits);
    }
    function measure() {
      top = topbar?.offsetHeight ?? 0;
      root.style.setProperty("--company-sticky-top", `${top}px`);
      anchor = slot.getBoundingClientRect().top + window.scrollY - top;
      header3.classList.add("company-no-transition");
      header3.classList.remove("is-compact");
      const expandedHeight = header3.offsetHeight;
      slot.style.height = `${expandedHeight}px`;
      if (revealTallHeader) {
        anchor += Math.max(0, top + expandedHeight - window.innerHeight + 8);
      }
      header3.classList.toggle("is-compact", compact);
      if (compact) fitCompactMetadata();
      void header3.offsetHeight;
      header3.classList.remove("company-no-transition");
    }
    function draw(nextCompact, nextPinned) {
      if (pinned !== nextPinned) {
        pinned = nextPinned;
        header3.classList.toggle("is-pinned", pinned);
      }
      if (compact !== nextCompact) {
        compact = nextCompact;
        const movingFocus = compact && facts?.contains(document.activeElement);
        header3.classList.toggle("is-compact", compact);
        if (compact) fitCompactMetadata();
        if (facts) {
          facts.inert = compact;
          facts.setAttribute("aria-hidden", String(compact));
        }
        if (movingFocus) switchAction?.focus({ preventScroll: true });
        if (compact) onCompact();
      }
    }
    function tick() {
      frame = 0;
      if (!root.isConnected) return;
      const y = Math.max(0, window.scrollY);
      const delta = y - previousY;
      previousY = y;
      if (delta !== 0) accumulated = Math.sign(delta) === Math.sign(accumulated) ? accumulated + delta : delta;
      const atAnchor = y <= Math.max(0, anchor + 2);
      const nextPinned = !atAnchor;
      let nextCompact = compact;
      if (atAnchor || accumulated <= -28) nextCompact = false;
      else if (y >= anchor + 48 && accumulated >= 14) nextCompact = true;
      draw(nextCompact, nextPinned);
    }
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    }
    function onResize() {
      if (!root.isConnected) return;
      measure();
      onScroll();
    }
    measure();
    tick();
    function resetDirection() {
      previousY = Math.max(0, window.scrollY);
      accumulated = 0;
      onScroll();
    }
    root.addEventListener(tabScrollEvent, resetDirection);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize);
    return () => {
      root.removeEventListener(tabScrollEvent, resetDirection);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }

  // dist/manager-detail.js
  var formatNumber = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  var escapeHtml3 = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  var backLink = '<a class="md-back" href="#/manager-screener">\u8FD4\u56DE\u7ECF\u7406\u7B5B\u9009</a>';
  var tabs = [
    ["overview", "\u4EBA\u7269\u6982\u89C8"],
    ["funds", "\u65D7\u4E0B\u57FA\u91D1"],
    ["returns", "\u6536\u76CA"],
    ["risk", "\u98CE\u9669"],
    ["holdings", "\u6301\u4ED3\u5206\u6790"],
    ["profile", "\u57FA\u672C\u4FE1\u606F"]
  ];
  function withUnit(value, unit, formatter2 = String) {
    return Number.isFinite(value) ? `${formatter2(value)}${unit}` : null;
  }
  function field(label, value) {
    return `<div><dt>${label}</dt><dd>${value ?? "\u2014"}</dd></div>`;
  }
  function managerHref(id) {
    return `#/manager/${encodeURIComponent(id)}`;
  }
  var headerAssets = "./assets/manager-detail";
  var evaluationPeriods = [["1y", "\u8FD11\u5E74"], ["3y", "\u8FD13\u5E74"], ["5y", "\u8FD15\u5E74"]];
  var evaluationDimensions = ["\u76C8\u5229\u80FD\u529B", "\u4E1A\u7EE9\u7A33\u5B9A\u6027", "\u884C\u4E1A\u7A33\u5B9A\u6027", "\u56DE\u64A4\u63A7\u5236", "\u590F\u666E\u7387"];
  var designSummaryGroups = [
    ["\u7BA1\u7406\u7ECF\u9A8C", [
      '\u6700\u65B0\u8BC4\u7EA7<span class="is-fall">2\u661F</span>\uFF0C\u8F83\u4E0A\u4E00\u5B63\u5EA6<span class="is-fall">\u4E0B\u964D1\u661F</span>\u3002',
      "\u516C\u52DF\u57FA\u91D1\u7BA1\u7406\u5E74\u96508.7\u5E74\uFF0C\u76EE\u524D\u5728\u7BA1\u57FA\u91D18\u53EA\uFF0C\u5728\u7BA1\u89C4\u6A211.61\u4EBF\u5143\u3002",
      "\u4EE3\u8868\u57FA\u91D1\uFF1A<strong>\u56FD\u8054\u5B89\u4E2D\u8BC1\u5168\u6307\u534A\u5BFC\u4F53\u4EA7\u54C1\u4E0E\u8BBE\u5907ETF</strong>",
      "\u4E3B\u8981\u5728\u7BA1\u57FA\u91D1\u7C7B\u578B\u4E3A<strong>\u80A1\u7968\u578B</strong>\u3002"
    ]],
    ["\u4E1A\u7EE9\u8868\u73B0", [
      '<span class="is-fall">\u535A\u53D6\u6536\u76CA\u80FD\u529B\u5F31</span>\uFF0C<strong>\u63A7\u5236\u98CE\u9669\u80FD\u529B\u4E2D\u7B49</strong>\u3002',
      '\u8FD15\u5E74\uFF0C\u5E74\u5316\u6536\u76CA\u7387\u4E3A\u22128.19%\uFF0C<span class="is-fall">\u5DEE\u4E8E</span>\u6CAA\u6DF1300\u3002\u6700\u5927\u56DE\u64A4\u4E3A46.84%\uFF0C<span class="is-fall">\u5DEE\u4E8E</span>\u6CAA\u6DF1300\u3002',
      '\u5728\u80A1\u5E02\u725B\u5E02\u4E2D\u6536\u76CA\u8868\u73B0<span class="is-fall">\u8F83\u5DEE</span>\uFF0C\u718A\u5E02\u4E2D\u98CE\u63A7\u8868\u73B0<strong>\u4E2D\u7B49</strong>\u3002'
    ]],
    ["\u6295\u8D44\u504F\u597D", [
      "\u6295\u8D44<strong>\u504F\u91CD\u80A1\u7968</strong>\uFF0C\u6574\u4F53\u98CE\u683C\u4E3A<strong>\u5927\u76D8\u2013\u5E73\u8861\u578B</strong>\u3002",
      "\u80A1\u7968\u884C\u4E1A\u504F\u597D<strong>\u5206\u6563</strong>\uFF0C\u524D\u4E09\u5927\u4E3A<strong>\u5176\u4ED6\u2013\u79D1\u521B\u677F\u3001\u7535\u5B50\u3001\u5176\u4ED6\u2013\u6E2F\u80A1</strong>\u3002\u91CD\u4ED3\u80A1\u7968<strong>\u6301\u6709\u65F6\u95F4\u77ED</strong>\u3002\u884C\u4E1A\u5206\u5E03<strong>\u7A33\u5B9A</strong>\u3002",
      "\u503A\u5238\u6295\u8D44\u4E2D\u504F\u597D\u7684\u5238\u79CD\u4E3A\u53EF\u8F6C\u6362\u503A\u5238\u3002"
    ]],
    ["\u57FA\u91D1\u516C\u53F8", [
      "\u5F18\u6BC5\u8FDC\u65B9\u57FA\u91D1\u7BA1\u7406\u6709\u9650\u516C\u53F8\u6210\u7ACB\u4E8E2018\u5E74\u3002\u5F53\u524D\u7BA1\u7406\u89C4\u6A21\u4E3A9.0\u4EBF\u5143\uFF0C\u89C4\u6A21<strong>\u8F83\u5C0F</strong>\u3002\u65D7\u4E0B\u57FA\u91D1\u4EE5<strong>\u6DF7\u5408\u578B</strong>\u4E3A\u4E3B\uFF0C\u536054%\u3002\u65D7\u4E0B\u57FA\u91D1\u7ECF\u7406\u51715\u540D\uFF0C\u56E2\u961F<strong>\u8F83\u5C0F</strong>\u3002\u5728\u667A\u541B\u7ECF\u7406\u8BC4\u7EA7\u4E2D\u83B7\u5F974\u661F\u53CA\u4EE5\u4E0A\u7684\u67091\u4EBA\uFF0C\u6570\u91CF<strong>\u8F83\u5C11</strong>\u3002"
    ]]
  ];
  var sampleHeaders = {
    "demo:xu-jie": {
      summaryGroups: designSummaryGroups,
      companyName: "\u957F\u6C5F\u8BC1\u5238(\u4E0A\u6D77)\u8D44\u4EA7\u7BA1\u7406\u6709\u9650\u516C\u53F8",
      avatar: headerAssets + "/avatar.png",
      degree: "\u535A\u58EB",
      industries: "\u975E\u94F6\u91D1\u878D\u3001\u94F6\u884C\u3001\u57FA\u7840\u5316\u5DE5",
      awards: "\u91D1\u725B\u5956\u3001\u660E\u661F\u57FA\u91D1\u5956",
      tenureLabel: "8\u5E74",
      nonCurrencyScale: 1.52,
      fundCount: 6,
      totalFundCount: 7,
      representativeAnnualized: 2.75,
      representativeBenchmark: -3.2,
      evaluation: { "3y": [58.49, 96.09, 69.03, 94.87, 46.07] }
    },
    "compare:b": {
      summaryGroups: designSummaryGroups,
      avatar: headerAssets + "/huang-xin.png",
      rating: null,
      degree: "\u7855\u58EB",
      industries: "\u5176\u4ED6-\u79D1\u521B\u677F\u3001\u7535\u5B50",
      awards: "\u82F1\u534E\u5956",
      tenureLabel: "17\u5E74",
      careerYears: 24,
      scale: 327.35,
      nonCurrencyScale: 327.35,
      fundCount: 26,
      totalFundCount: 34,
      representativeAnnualized: 3.99,
      representativeBenchmark: 0.87,
      evaluation: {
        "1y": [86.25, 14.42, 8.7, 17.6, 79.33],
        "3y": [90.72, 6.58, 3.6, 10.15, 83.4],
        "5y": [93.98, 1.61, 0, 4.82, 86.35]
      }
    }
  };
  function rating(stars2) {
    if (!Number.isInteger(stars2) || stars2 < 1 || stars2 > 5) return "";
    const icons = Array.from({ length: 5 }, (_, index) => {
      const state2 = index >= stars2 ? "star-background" : index === 2 ? "star-foreground" : "star-default";
      return `<img src="${headerAssets}/${state2}.svg" width="14.8" height="14.8" alt="">`;
    });
    return `<span class="md-stars" role="img" aria-label="\u667A\u541B\u8BC4\u7EA7 ${stars2} \u661F">${icons.join("")}</span>`;
  }
  function metricValue(value, unit) {
    return `<span class="company-metric-value">
    <span class="company-metric-number">${escapeHtml3(value ?? "\u2014")}</span>${unit && value != null ? `<span class="company-metric-unit">${unit}</span>` : ""}
  </span>`;
  }
  function metricNote(label, value, unit = "", secondary = false) {
    const benchmark = secondary ? " md-benchmark" : "";
    return `<span class="md-metric-note${benchmark}"><span>${label}</span><span class="md-note-value">${escapeHtml3(value ?? "\u2014")}${unit && value != null ? `<span class="company-metric-unit">${unit}</span>` : ""}</span></span>`;
  }
  function metaField(label, value) {
    return `<span class="md-meta-field"><span class="md-meta-label">${label}\uFF1A</span> ${value ?? "\u2014"}</span>`;
  }
  function number(value) {
    return Number.isFinite(value) ? formatNumber.format(value) : null;
  }
  function header(manager, companyValue) {
    const compare = new URLSearchParams({ manager: manager.id });
    const annualized = withUnit(manager.representativeAnnualized, "%", number);
    const benchmark = withUnit(manager.representativeBenchmark, "%", number);
    const tenure = manager.tenureLabel || withUnit(manager.tenure, "\u5E74");
    const career = withUnit(manager.careerYears, "\u5E74");
    const showDemoLabel = manager.isDemo && !manager.avatar;
    return `<div class="company-header-slot"><header class="company-header md-header" aria-labelledby="md-title">
    <div class="company-header-top md-header-top">
      <div class="company-identity md-identity">
        <span class="md-avatar" aria-hidden="true">${manager.avatar ? `<img src="${manager.avatar}" width="40" height="40" alt="">` : escapeHtml3(Array.from(manager.name)[0] ?? "\u57FA")}</span>
        <div class="md-heading">
          <h1 id="md-title">${escapeHtml3(manager.name)}</h1>
          ${manager.type || showDemoLabel ? `<div class="company-chips">${manager.type ? `<span>${escapeHtml3(manager.type)}</span>` : ""}${showDemoLabel ? "<span>\u793A\u4F8B</span>" : ""}</div>` : ""}
          ${rating(manager.rating)}
        </div>
      </div>
      <div class="company-header-actions md-actions">
        <a class="md-compare" href="#/manager-compare?${compare}" aria-label="\u7ECF\u7406PK" title="\u7ECF\u7406PK"><span>\u7ECF\u7406</span><img src="${headerAssets}/pk.svg" width="26.6162" height="13.9651" alt=""></a>
        <button type="button" aria-label="\u5207\u6362\u7ECF\u7406" title="\u5207\u6362\u7ECF\u7406" aria-expanded="false" aria-controls="md-switch-panel" data-md-action="switch">
          <span class="md-switch-artwork" aria-hidden="true">
            <img src="${headerAssets}/switch-default.png" width="46" height="20" alt="">
            <img src="${headerAssets}/switch-hover.png" width="46" height="20" alt="">
          </span>
        </button>
        <div id="md-switch-panel" class="md-switch-panel" hidden>
          <input type="search" class="md-switch-search" aria-label="\u641C\u7D22\u57FA\u91D1\u7ECF\u7406" aria-controls="md-switch-results" placeholder="\u8F93\u5165\u7ECF\u7406\u59D3\u540D" autocomplete="off">
          <div id="md-switch-results" class="md-switch-results" role="group" aria-label="\u57FA\u91D1\u7ECF\u7406\u641C\u7D22\u7ED3\u679C" hidden></div>
        </div>
      </div>
    </div>
    <div class="company-facts-wrap md-facts-wrap">
      <div class="md-header-body">
        <div class="md-meta">
          ${metaField("\u73B0\u4EFB\u516C\u53F8", companyValue)}
          ${metaField("\u5B66\u5386", manager.degree && escapeHtml3(manager.degree))}
          ${metaField("\u7BA1\u7406/\u4ECE\u4E1A\u5E74\u9650", tenure || career ? `${escapeHtml3(tenure ?? "\u2014")}/${escapeHtml3(career ?? "\u2014")}` : null)}
          ${metaField("\u504F\u7231\u884C\u4E1A", manager.industries && escapeHtml3(manager.industries))}
          ${metaField("\u83B7\u5956", manager.awards && escapeHtml3(manager.awards))}
        </div>
        <dl class="company-metrics md-metrics">
          <div class="md-metric--scale"><dt>\u5728\u7BA1\u89C4\u6A21</dt>
            <dd class="company-metric-readout">${metricValue(number(manager.scale), "\u4EBF")}${metricNote("\u5254\u9664\u8D27\u5E01\u89C4\u6A21", number(manager.nonCurrencyScale), "\u4EBF")}</dd>
          </div>
          <div class="md-metric--products"><dt>\u5728\u7BA1\u4EA7\u54C1</dt>
            <dd class="company-metric-readout">${metricValue(manager.fundCount, "\u4E2A")}${metricNote("\u7D2F\u8BA1", manager.totalFundCount, "\u4E2A")}</dd>
          </div>
          <div class="md-metric--representative"><dt>\u4EE3\u8868\u4EA7\u54C1</dt>
            <dd class="company-metric-readout">
              ${manager.product ? `<span class="md-representative-name" title="${escapeHtml3(manager.product)}">${escapeHtml3(manager.product)}</span>` : '<span class="md-representative-name md-representative-missing">\u2014</span>'}
              <span class="md-representative-notes">${metricNote("\u5E74\u5316\u56DE\u62A5", annualized)}${metricNote("\u540C\u671F\u5927\u76D8", benchmark, "", true)}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="company-tabs md-tabs" role="tablist" aria-label="\u7ECF\u7406\u8BE6\u60C5">
      ${tabs.map(([key, label]) => `<button type="button" role="tab" id="md-tab-${key}" aria-controls="md-tab-panel" data-md-tab="${key}">${label}</button>`).join("")}
    </div>
  </header></div>`;
  }
  function section(title, fields2, empty) {
    return `<section class="cl-card md-detail">
    <h2>${title}</h2>
    ${fields2.length ? `<dl class="md-fields">${fields2.map(([label, value]) => field(label, value)).join("")}</dl>` : `<p class="md-empty">${empty}</p>`}
  </section>`;
  }
  function summaryGroup(title, lines) {
    const copy = lines.filter(Boolean).map((line) => `<p>${line}</p>`).join("");
    return `<section class="md-summary-group">
    <h3>${title}</h3>
    <div class="md-summary-copy">${copy || "<p>\u6682\u65E0\u6570\u636E</p>"}</div>
  </section>`;
  }
  function managerSummaryGroups(manager, company, companyValue) {
    if (manager.summaryGroups) return manager.summaryGroups;
    const tenure = manager.tenureLabel || withUnit(manager.tenure, "\u5E74");
    const fundCount = withUnit(manager.fundCount, "\u53EA");
    const scale = withUnit(manager.scale, "\u4EBF\u5143", number);
    const experience = [
      tenure && `\u516C\u52DF\u57FA\u91D1\u7BA1\u7406\u5E74\u9650${escapeHtml3(tenure)}`,
      fundCount && `\u76EE\u524D\u5728\u7BA1\u57FA\u91D1${fundCount}`,
      scale && `\u5728\u7BA1\u89C4\u6A21${scale}`
    ].filter(Boolean).join("\uFF0C");
    const annualized = withUnit(manager.representativeAnnualized, "%", number);
    const benchmark = withUnit(manager.representativeBenchmark, "%", number);
    const performance = [
      annualized && `\u4EE3\u8868\u57FA\u91D1\u5E74\u5316\u56DE\u62A5${annualized}`,
      benchmark && `\u540C\u671F\u5927\u76D8${benchmark}`
    ].filter(Boolean).join("\uFF0C");
    const difference = Number.isFinite(manager.representativeAnnualized) && Number.isFinite(manager.representativeBenchmark) ? Number((manager.representativeAnnualized - manager.representativeBenchmark).toFixed(2)) : null;
    const comparison = difference == null ? "" : difference === 0 ? "\u4EE3\u8868\u57FA\u91D1\u4E0E\u540C\u671F\u5927\u76D8\u5E74\u5316\u56DE\u62A5\u6301\u5E73\u3002" : `\u4EE3\u8868\u57FA\u91D1\u5E74\u5316\u56DE\u62A5<span class="${difference > 0 ? "is-rise" : "is-fall"}">${difference > 0 ? "\u9AD8\u4E8E" : "\u4F4E\u4E8E"}</span>\u540C\u671F\u5927\u76D8 ${number(Math.abs(difference))} \u4E2A\u767E\u5206\u70B9\u3002`;
    const companyDetails2 = companyList.find((entry) => entry.id === company?.id);
    const companyMetrics = companyDetails2 ? [
      companyDetails2.founded && `\u6210\u7ACB\u4E8E${escapeHtml3(companyDetails2.founded)}`,
      Number.isFinite(companyDetails2.totalScale) && `\u7BA1\u7406\u89C4\u6A21${number(companyDetails2.totalScale)}\u4EBF\u5143`,
      Number.isFinite(companyDetails2.fundCount) && `\u65D7\u4E0B\u57FA\u91D1${companyDetails2.fundCount}\u53EA`,
      Number.isFinite(companyDetails2.managerCount) && `\u57FA\u91D1\u7ECF\u7406${companyDetails2.managerCount}\u540D`
    ].filter(Boolean).join("\uFF0C") : "";
    return [
      ["\u7BA1\u7406\u7ECF\u9A8C", [
        Number.isInteger(manager.rating) && `\u6700\u65B0\u8BC4\u7EA7${manager.rating}\u661F\u3002`,
        experience && `${experience}\u3002`,
        manager.product && `\u4EE3\u8868\u57FA\u91D1\uFF1A<strong>${escapeHtml3(manager.product)}</strong>\u3002`,
        manager.productType && `\u4EE3\u8868\u57FA\u91D1\u7C7B\u578B\u4E3A<strong>${escapeHtml3(manager.productType)}</strong>\u3002`
      ]],
      ["\u4E1A\u7EE9\u8868\u73B0", [performance && `${performance}\u3002`, comparison]],
      ["\u6295\u8D44\u504F\u597D", [
        manager.industries && `\u504F\u7231\u884C\u4E1A\u4E3A<strong>${escapeHtml3(manager.industries)}</strong>\u3002`,
        manager.productStyle && `\u4EE3\u8868\u57FA\u91D1\u98CE\u683C\u4E3A<strong>${escapeHtml3(manager.productStyle)}</strong>\u3002`,
        manager.productThemes?.length && `\u4EE3\u8868\u57FA\u91D1\u4E3B\u9898\u4E3A<strong>${escapeHtml3(manager.productThemes.join("\u3001"))}</strong>\u3002`
      ]],
      ["\u57FA\u91D1\u516C\u53F8", [
        companyValue && `\u73B0\u4EFB\u516C\u53F8\uFF1A${companyValue}\u3002`,
        companyMetrics && `${companyMetrics}\u3002`
      ]]
    ];
  }
  function managerSummary(manager, company, companyValue) {
    const groups2 = managerSummaryGroups(manager, company, companyValue);
    const summary = document.createElement("section");
    summary.className = "cl-card md-summary";
    summary.setAttribute("aria-labelledby", "md-summary-title");
    summary.innerHTML = `
    <div class="md-summary-head">
      <h2 id="md-summary-title">\u6838\u5FC3\u603B\u7ED3</h2>
      <div class="md-summary-periods" role="group" aria-label="\u8BC4\u4F30\u65F6\u6BB5">
        ${evaluationPeriods.map(([key, label]) => `<button type="button" data-md-summary-period="${key}" aria-controls="md-summary-scores" aria-pressed="${key === "3y"}">${label}</button>`).join("")}
      </div>
    </div>
    <dl class="md-summary-scores" id="md-summary-scores" aria-live="polite">
      ${evaluationDimensions.map((label) => `<div><dt>${label}</dt><dd>\u2014</dd></div>`).join("")}
    </dl>
    <div class="md-summary-details" id="md-summary-details" hidden>
      ${groups2.map(([title, lines]) => summaryGroup(title, lines)).join("")}
    </div>
    <button type="button" class="md-summary-toggle" aria-controls="md-summary-details" aria-expanded="false" aria-label="\u5C55\u5F00">
      <span class="md-summary-expand-art" aria-hidden="true">
        <img src="${headerAssets}/summary-expand-default.png" width="42" height="28" alt="">
        <img src="${headerAssets}/summary-expand-hover.png" width="42" height="28" alt="">
      </span>
      <span class="md-summary-collapse-art" aria-hidden="true">
        <img src="${headerAssets}/summary-collapse-default.png" width="42" height="28" alt="">
        <img src="${headerAssets}/summary-collapse-hover.png" width="42" height="28" alt="">
      </span>
    </button>`;
    const periods2 = summary.querySelectorAll("[data-md-summary-period]");
    const scores = summary.querySelectorAll(".md-summary-scores dd");
    function selectPeriod(period) {
      const values = manager.evaluation?.[period];
      periods2.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mdSummaryPeriod === period)));
      scores.forEach((score, index) => {
        score.textContent = number(values?.[index]) ?? "\u2014";
      });
    }
    periods2.forEach((button) => button.addEventListener("click", () => selectPeriod(button.dataset.mdSummaryPeriod)));
    selectPeriod("3y");
    const details = summary.querySelector(".md-summary-details");
    const toggle = summary.querySelector(".md-summary-toggle");
    toggle.addEventListener("click", () => {
      const expanded = details.hidden;
      details.hidden = !expanded;
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute("aria-label", expanded ? "\u6536\u8D77" : "\u5C55\u5F00");
    });
    return summary;
  }
  function bindManagerSwitch(root, currentManager, managers, companies) {
    const trigger = root.querySelector('[data-md-action="switch"]');
    const panel = root.querySelector(".md-switch-panel");
    const search = panel.querySelector(".md-switch-search");
    const results = panel.querySelector(".md-switch-results");
    const employers = new Map(companies.map((company) => [company.id, company]));
    const otherManagers = managers.filter((entry) => entry.id !== currentManager.id);
    function showManagers() {
      const query = search.value.trim();
      if (!query) {
        results.hidden = true;
        results.replaceChildren();
        return;
      }
      const keyword = query.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");
      const match = new RegExp("(" + keyword + ")", "iu");
      const matching = otherManagers.filter((entry) => match.test(entry.name));
      const onlyCurrent = matching.length === 0 && match.test(currentManager.name);
      results.hidden = onlyCurrent;
      if (onlyCurrent) {
        results.replaceChildren();
        return;
      }
      results.innerHTML = matching.map((entry) => {
        const company = employers.get(entry.companyId);
        const employer = company?.shortName ?? company?.name ?? "\u2014";
        const type = entry.type ?? "\u2014";
        const name = entry.name.split(match).map((part, index) => {
          const safePart = escapeHtml3(part);
          return index % 2 ? "<strong>" + safePart + "</strong>" : safePart;
        }).join("");
        return `<a class="md-switch-result" href="${managerHref(entry.id)}">
        <span class="md-switch-name" title="${escapeHtml3(entry.name)}">${name}</span>
        <span class="md-switch-employer" title="${escapeHtml3(employer)}">${escapeHtml3(employer)}</span>
        <span class="md-switch-type" title="${escapeHtml3(type)}">${escapeHtml3(type)}</span>
      </a>`;
      }).join("") || '<p class="md-switch-empty" role="status">\u672A\u627E\u5230\u5339\u914D\u7684\u57FA\u91D1\u7ECF\u7406</p>';
      results.scrollTop = 0;
    }
    function close(restoreFocus = false) {
      if (panel.hidden) return;
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus) trigger.focus({ preventScroll: true });
    }
    trigger.addEventListener("click", () => {
      if (!panel.hidden) {
        close(true);
        return;
      }
      search.value = "";
      showManagers();
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      search.focus({ preventScroll: true });
    });
    search.addEventListener("input", showManagers);
    results.addEventListener("click", (event) => {
      const result = event.target.closest(".md-switch-result");
      if (!result || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      close();
    });
    panel.addEventListener("keydown", (event) => {
      if (event.isComposing || !["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return;
      const entries = [...results.querySelectorAll(".md-switch-result")];
      if (!entries.length) return;
      if (event.key === "Enter") {
        if (event.target === search) {
          event.preventDefault();
          entries[0].click();
        }
        return;
      }
      event.preventDefault();
      const current = entries.indexOf(event.target);
      const next = current + (event.key === "ArrowDown" ? 1 : -1);
      const target = next < 0 ? search : entries[Math.min(next, entries.length - 1)];
      target.focus();
    });
    root.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || event.isComposing || panel.hidden) return;
      event.preventDefault();
      close(true);
    });
    function dismissOutside(event) {
      if (!panel.contains(event.target) && !trigger.contains(event.target)) close();
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
    };
  }
  function renderManagerDetail(view, managerId, { initialTab, onTabChange = () => {
  } } = {}) {
    const { companies, managers } = getManagerListData();
    const manager = managers.find((entry) => entry.id === managerId);
    if (!manager) {
      view.innerHTML = `<div class="cl-page md-page">${backLink}
      <section class="cl-card md-detail" aria-labelledby="md-title">
        <h1 id="md-title">\u672A\u627E\u5230\u57FA\u91D1\u7ECF\u7406</h1>
      </section>
    </div>`;
      return;
    }
    const company = companies.find((entry) => entry.id === manager.companyId);
    const headerManager = { ...manager, ...sampleHeaders[manager.id] };
    const companyValue = company ? `<a class="md-company-link" href="#/company/${encodeURIComponent(company.id)}">${escapeHtml3(headerManager.companyName ?? company.name)}</a>` : null;
    const details = [
      ["\u73B0\u4EFB\u516C\u53F8", companyValue],
      ["\u7ECF\u7406\u7C7B\u578B", manager.type && escapeHtml3(manager.type)],
      ["\u7EFC\u5408\u8BC4\u7EA7", withUnit(headerManager.rating, "\u661F")],
      ["\u4ECE\u4E1A\u5E74\u9650", withUnit(headerManager.careerYears, "\u5E74")],
      ["\u7BA1\u7406\u5E74\u9650", headerManager.tenureLabel ? escapeHtml3(headerManager.tenureLabel) : withUnit(manager.tenure, "\u5E74")],
      ["\u5728\u7BA1\u89C4\u6A21", withUnit(headerManager.scale, "\u4EBF", number)],
      ["\u5728\u7BA1\u57FA\u91D1\u6570", withUnit(headerManager.fundCount, "\u53EA")],
      ["\u4EE3\u8868\u57FA\u91D1", manager.product && escapeHtml3(manager.product)],
      ["\u57FA\u91D1\u7C7B\u578B", manager.productType && escapeHtml3(manager.productType)]
    ];
    const returns = [
      ["\u4EE3\u8868\u57FA\u91D1\u5E74\u5316\u56DE\u62A5", headerManager.representativeAnnualized],
      ["\u7ECF\u7406\u6307\u6570\u603B\u56DE\u62A5", manager.indexTotal],
      ["\u7ECF\u7406\u6307\u6570\u8FD13\u6708", manager.index3m],
      ["\u7ECF\u7406\u6307\u6570\u8FD11\u5E74", manager.index1y],
      ["\u7ECF\u7406\u6307\u6570\u8FD13\u5E74", manager.index3y]
    ].filter(([, value]) => Number.isFinite(value)).map(([label, value]) => [label, withUnit(value, "%", (number2) => formatNumber.format(number2))]);
    view.innerHTML = `<div class="cl-page md-page">
    ${header(headerManager, companyValue)}
    <div class="md-content" id="md-tab-panel" role="tabpanel" tabindex="0"></div>
    ${backLink}
  </div>`;
    const root = view.firstElementChild;
    const panel = root.querySelector(".md-content");
    const scrollHeader = root.querySelector(".md-header");
    const tabList = root.querySelector(".md-tabs");
    const tabButtons = [...tabList.querySelectorAll("[data-md-tab]")];
    const disposeSwitch = bindManagerSwitch(root, manager, managers, companies);
    const summary = managerSummary(headerManager, company, companyValue);
    const profiles = section("\u57FA\u672C\u4FE1\u606F", details);
    const performance = section("\u4E1A\u7EE9\u6307\u6807", returns, "\u6682\u65E0\u4E1A\u7EE9\u6570\u636E");
    const fundFields = manager.product ? [["\u4EE3\u8868\u57FA\u91D1", escapeHtml3(manager.product)], ["\u57FA\u91D1\u7C7B\u578B", manager.productType && escapeHtml3(manager.productType)]] : [];
    const risk = manager.performanceValues.representative;
    const riskFields = [["\u6700\u5927\u56DE\u64A4", risk.maxDrawdown?.["1y"]], ["\u5E74\u5316\u6CE2\u52A8\u7387", risk.volatility?.["1y"]], ["\u4E0B\u884C\u98CE\u9669", risk.downsideRisk?.["1y"]]].filter(([, value]) => Number.isFinite(value)).map(([label, value]) => [label, withUnit(value, "%", (number2) => formatNumber.format(number2))]);
    const panels = {
      overview: profiles + (returns.length ? performance : ""),
      funds: section("\u4EE3\u8868\u57FA\u91D1", fundFields, "\u6682\u65E0\u4EE3\u8868\u57FA\u91D1\u6570\u636E"),
      returns: performance,
      risk: section(riskFields.length ? "\u4EE3\u8868\u57FA\u91D1\u8FD1\u4E00\u5E74\u98CE\u9669" : "\u98CE\u9669", riskFields, "\u6682\u65E0\u98CE\u9669\u6570\u636E"),
      holdings: section("\u6301\u4ED3\u5206\u6790", [], "\u6682\u65E0\u6301\u4ED3\u6570\u636E"),
      profile: profiles
    };
    function showTab(button) {
      for (const item of tabButtons) {
        const selected = item === button;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      }
      panel.setAttribute("aria-labelledby", button.id);
      panel.innerHTML = panels[button.dataset.mdTab];
      if (button.dataset.mdTab === "overview") panel.prepend(summary);
      const listBounds = tabList.getBoundingClientRect();
      const tabBounds = button.getBoundingClientRect();
      const leftOverflow = Math.min(0, tabBounds.left - listBounds.left);
      const rightOverflow = Math.max(0, tabBounds.right - listBounds.right);
      tabList.scrollLeft += leftOverflow + rightOverflow;
    }
    function selectTab(button) {
      showTab(button);
      onTabChange(button.dataset.mdTab);
      if (scrollHeader.classList.contains("is-pinned") && panel.getBoundingClientRect().top < scrollHeader.getBoundingClientRect().bottom) {
        const y = window.scrollY + panel.getBoundingClientRect().top - scrollHeader.getBoundingClientRect().bottom - 10;
        window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
      }
      root.dispatchEvent(new Event("md-tab-scroll"));
    }
    tabList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-md-tab]");
      if (button) selectTab(button);
    });
    tabList.addEventListener("keydown", (event) => {
      const index = tabButtons.indexOf(event.target);
      if (index === -1 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabButtons.length - 1 : (index + (event.key === "ArrowLeft" ? -1 : 1) + tabButtons.length) % tabButtons.length;
      const button = tabButtons[next];
      selectTab(button);
      button.focus({ preventScroll: true });
    });
    showTab(tabButtons.find((button) => button.dataset.mdTab === initialTab) ?? tabButtons[0]);
    const disposeScroll = attachDetailHeaderScroll(root, { tabScrollEvent: "md-tab-scroll", revealTallHeader: true });
    return () => {
      disposeScroll();
      disposeSwitch();
    };
  }

  // dist/company-list.js
  var money2 = new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var capital = new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  var integer2 = new Intl.NumberFormat("zh-CN");
  var types = ["\u80A1\u7968\u578B", "\u6DF7\u5408\u578B", "\u503A\u5238\u578B", "QDII", "\u6307\u6570\u578B", "\u8D27\u5E01\u578B", "ETF\u8054\u63A5", "\u7406\u8D22\u578B", "FOF"];
  var modes = { total: "\u603B\u89C4\u6A21", nonMoney: "\u975E\u8D27\u89C4\u6A21" };
  var sampleDate = "2026-11-24";
  var amounts = [
    ["100\u4EBF\u4EE5\u4E0B", 0, 100],
    ["100\u2013500\u4EBF", 100, 500],
    ["500\u20131,000\u4EBF", 500, 1e3],
    ["1,000\u20133,000\u4EBF", 1e3, 3e3],
    ["3,000\u4EBF\u4EE5\u4E0A", 3e3, null]
  ];
  var ranks = [
    ["1\u201310\u540D", 1, 10],
    ["11\u201320\u540D", 11, 20],
    ["21\u201350\u540D", 21, 50],
    ["51\u2013100\u540D", 51, 100],
    ["101\u540D\u4EE5\u4E0A", 101, null]
  ];
  var fields = {
    amount: { label: "\u91D1\u989D", options: amounts, unit: "\u4EBF", continuous: true },
    rank: { label: "\u6392\u540D", options: ranks, unit: "\u540D" },
    aggregateTypes: { label: "\u8BA1\u5165\u57FA\u91D1\u7C7B\u578B", name: "\u7C7B\u578B", options: types },
    aggregateAmount: { label: "\u5408\u8BA1\u91D1\u989D", name: "\u91D1\u989D", options: amounts, unit: "\u4EBF", continuous: true },
    aggregateRank: { label: "\u5408\u8BA1\u6392\u540D", name: "\u6392\u540D", options: ranks, unit: "\u540D" },
    ownedTypes: { label: "\u65D7\u4E0B\u57FA\u91D1\u7C7B\u578B", name: "\u7C7B\u578B", options: types },
    fundCount: { label: "\u65D7\u4E0B\u57FA\u91D1\u6570", name: "\u603B\u6570", unit: "\u53EA", options: [
      ["1\u201310\u53EA", 1, 10],
      ["11\u201330\u53EA", 11, 30],
      ["31\u2013100\u53EA", 31, 100],
      ["101\u2013300\u53EA", 101, 300],
      ["300\u53EA\u4EE5\u4E0A", 301, null]
    ] },
    age: { label: "\u6210\u7ACB\u5E74\u9650", name: "\u5E74\u9650", unit: "\u5E74", options: [
      ["5\u5E74\u4EE5\u4E0B", 0, 4],
      ["5\u201310\u5E74", 5, 9],
      ["10\u201315\u5E74", 10, 14],
      ["15\u201320\u5E74", 15, 19],
      ["20\u5E74\u4EE5\u4E0A", 20, null]
    ] }
  };
  var columns2 = [
    ["sequence", "\u5E8F\u53F7", 52],
    ["name", "\u516C\u53F8\u540D\u79F0", 244],
    ["totalScale", "\u603B\u89C4\u6A21\uFF5C\u6392\u540D", 160],
    ["nonMoneyScale", "\u975E\u8D27\u89C4\u6A21\uFF5C\u6392\u540D", 160],
    ["fundCount", "\u57FA\u91D1\u603B\u6570\uFF5C\u6392\u540D", 160],
    ["managerCount", "\u57FA\u91D1\u7ECF\u7406\u6570\uFF5C\u6392\u540D", 160],
    ["capital", "\u6CE8\u518C\u8D44\u672C", 110],
    ["founded", "\u6210\u7ACB\u65F6\u95F4", 110]
  ];
  var sortKeys = /* @__PURE__ */ new Set(["name", "totalScale", "nonMoneyScale", "aggregateScale", "fundCount", "managerCount", "capital", "founded"]);
  var defaultSort2 = { key: "totalScale", direction: -1 };
  var state = {
    query: "",
    scale: "total",
    scales: { total: {}, nonMoney: {} },
    criteria: {},
    sort: defaultSort2,
    page: 1,
    pageSize: 10
  };
  var escapeHtml4 = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  var unitText = (unit) => `<span class="cl-unit">${unit}</span>`;
  var rangeLabel = (key, label) => {
    const unit = fields[key].unit;
    const text = escapeHtml4(label);
    return `<span>${unit ? text.replace(unit, unitText(unit)) : text}</span>`;
  };
  var chevron = '<span class="cl-chevron" aria-hidden="true"></span>';
  var sortIndicator2 = `<svg class="cl-sort-arrow" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path class="cl-sort-up" d="M6 1 10 5H2Z"/><path class="cl-sort-down" d="m6 11-4-4h8Z"/></svg>`;
  function ageAt(founded) {
    const years = Number(sampleDate.slice(0, 4)) - Number(founded.slice(0, 4));
    return years - Number(sampleDate.slice(5) < founded.slice(5));
  }
  function companyNameMarkup(company, query) {
    return companyNameParts(company, query).map(({ text, matched }) => {
      const escaped = escapeHtml4(text);
      return matched ? `<span class="cl-company-match">${escaped}</span>` : escaped;
    }).join("");
  }
  function rankBy(getValue, include = () => true) {
    const ordered = companyList2.filter(include).sort((a, b) => getValue(b) - getValue(a));
    let position = 0;
    return new Map(ordered.map((company, i) => {
      if (!i || getValue(company) !== getValue(ordered[i - 1])) position = i + 1;
      return [company.id, { position, total: ordered.length }];
    }));
  }
  var baseRanks = Object.fromEntries(["totalScale", "nonMoneyScale", "fundCount", "managerCount"].map((key) => [key, rankBy((company) => company[key])]));
  function selection(key) {
    return (key === "amount" || key === "rank" ? state.scales[state.scale] : state.criteria)[key];
  }
  function setSelection(key, { choices = [], custom } = {}) {
    const group = key === "amount" || key === "rank" ? state.scales[state.scale] : state.criteria;
    if (choices.length || custom) group[key] = { choices, custom };
    else delete group[key];
    if (key === "aggregateTypes" && !choices.length) {
      delete state.criteria.aggregateAmount;
      delete state.criteria.aggregateRank;
    }
  }
  function choiceLabels(key) {
    const current = selection(key);
    if (!current) return [];
    const { options, unit } = fields[key];
    const labels = current.choices.map((index) => ({ id: index, label: unit ? options[index][0] : options[index] }));
    if (current.custom) labels.push({ id: "custom", label: customRangeLabel(current.custom, unit) });
    return labels;
  }
  function meetsRange(key, value) {
    const current = selection(key);
    if (!current) return true;
    if (value == null) return false;
    if (current.custom) {
      const [min, max] = current.custom;
      if ((min == null || value >= min) && (max == null || value <= max)) return true;
    }
    const { options, continuous } = fields[key];
    return current.choices.some((index) => {
      const [, min, max] = options[index];
      return value >= min && (max == null || (continuous ? value < max : value <= max));
    });
  }
  function getResults() {
    const aggregateTypes = choiceLabels("aggregateTypes").map(({ label }) => label);
    const ownedTypes = choiceLabels("ownedTypes").map(({ label }) => label);
    const aggregateActive = Boolean(aggregateTypes.length && (selection("aggregateAmount") || selection("aggregateRank")));
    if (!aggregateActive && state.sort.key === "aggregateScale") state.sort = defaultSort2;
    const aggregateScale = (company) => Math.round(aggregateTypes.reduce((total, type) => total + (company.scaleByType[type] || 0), 0) * 100) / 100;
    const aggregateRanks = aggregateActive ? rankBy(aggregateScale, (company) => aggregateScale(company) > 0) : /* @__PURE__ */ new Map();
    const scaleKey = state.scale === "total" ? "totalScale" : "nonMoneyScale";
    const records = companyList2.filter((company) => {
      return companyMatchesQuery(company, state.query) && meetsRange("amount", company[scaleKey]) && meetsRange("rank", baseRanks[scaleKey].get(company.id).position) && meetsRange("fundCount", company.fundCount) && meetsRange("age", ageAt(company.founded)) && ownedTypes.every((type) => company.types.includes(type)) && (!aggregateActive || aggregateRanks.has(company.id) && meetsRange("aggregateAmount", aggregateScale(company)) && meetsRange("aggregateRank", aggregateRanks.get(company.id).position));
    });
    const { key, direction } = state.sort;
    records.sort((a, b) => {
      const first = key === "aggregateScale" ? aggregateScale(a) : a[key];
      const second = key === "aggregateScale" ? aggregateScale(b) : b[key];
      return direction * (typeof first === "string" ? first.localeCompare(second, "zh-CN") : first - second);
    });
    return { records, aggregateTypes, aggregateActive, aggregateScale, aggregateRanks };
  }
  function metric(value, unit, rank2) {
    return `<span class="cl-metric"><span class="cl-metric-value">${value}${unitText(unit)}</span>
    ${rank2 ? `<span class="cl-rank" aria-label="\u7B2C ${rank2.position} \u540D\uFF0C\u5171 ${rank2.total} \u5BB6">${rank2.position}<span class="cl-rank-total"> / ${rank2.total}</span></span>` : ""}</span>`;
  }
  function mountCompanyList(container) {
    const controller = new AbortController();
    const { signal } = controller;
    let open = null;
    let unmountPagination;
    let result;
    let resultsMessageTimeout;
    let resultsMessageTrigger;
    container.innerHTML = `<div class="cl-page cl-company-page">
    <section class="cl-card cl-filters" aria-labelledby="cl-title">
      <h1 class="cl-page-heading" id="cl-title">\u516C\u53F8\u7B5B\u9009</h1>
      <form class="cl-filter-row cl-search-row" role="search" aria-label="\u641C\u7D22\u516C\u53F8">
        <label class="cl-filter-label" for="cl-company-query">\u516C\u53F8\u540D\u79F0</label>
        <div class="cl-filter-controls">
          <div class="cl-search-field">
            <input id="cl-company-query" type="search" autocomplete="off" placeholder="\u8F93\u5165\u516C\u53F8\u540D\u79F0" value="${escapeHtml4(state.query)}">
            <button class="cl-search-clear" type="button" data-cl-clear-query aria-label="\u6E05\u9664\u516C\u53F8\u540D\u79F0" title="\u6E05\u9664\u516C\u53F8\u540D\u79F0">
              <img src="./assets/company-list/search-clear.png" width="14" height="14" alt="">
            </button>
          </div>
        </div>
      </form>
      <div class="cl-filter-rows"></div><div class="cl-summary" hidden></div>
    </section>
    <section class="cl-card cl-results" aria-label="\u516C\u53F8\u5217\u8868">
      <div class="cl-results-toolbar">
        <p class="cl-result-count" role="status"><span>\u4E3A\u60A8\u627E\u5230</span> <strong>0</strong> <span>\u5BB6\u516C\u53F8</span></p>
        <div class="zc-module-actions" role="group" aria-label="\u516C\u53F8\u5217\u8868\u64CD\u4F5C">
          <button class="zc-module-icon" type="button" data-cl-export-toggle aria-label="\u5BFC\u51FA\u516C\u53F8\u5217\u8868" title="\u5BFC\u51FA\u516C\u53F8\u5217\u8868"
            aria-expanded="false" aria-haspopup="menu" aria-controls="cl-export-menu">
            <img src="./design-system/assets/module-actions/table-download.png" width="28" height="28" alt="">
          </button>
          <button class="zc-module-icon" type="button" data-cl-refresh aria-label="\u5237\u65B0\u5217\u8868" title="\u5237\u65B0\u5217\u8868">
            <img src="./design-system/assets/module-actions/refresh.png" width="28" height="28" alt="">
          </button>
          <div class="cl-menu cl-export-menu" id="cl-export-menu" role="menu" aria-label="\u5BFC\u51FA\u8303\u56F4" hidden>
            <div class="cl-options" role="none">
              <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-cl-export="page">
                \u5BFC\u51FA\u5F53\u524D\u9875<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
              </button>
              <button class="cl-option" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-cl-export="all">
                \u5BFC\u51FA\u5168\u90E8\u7ED3\u679C<img src="./assets/compare-allocation/check.svg" width="12" height="12" alt="">
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="cl-table-scroll" role="region" aria-label="\u516C\u53F8\u7B5B\u9009\u7ED3\u679C" tabindex="0">
        <table class="cl-table"><colgroup></colgroup><thead></thead><tbody></tbody></table>
      </div>
      <div class="cl-pagination zc-pagination" data-pg-kind="page" role="navigation" aria-label="\u516C\u53F8\u5217\u8868\u5206\u9875"></div>
    </section>
    <div class="zhice-message cl-results-message" data-type="success" role="status" popover="manual">
      <img class="zhice-message-icon" width="12" height="12" src="./design-system/assets/messages/success.png" alt="">
      <span class="zhice-message-text"></span>
      <button class="zhice-message-close" type="button" aria-label="\u5173\u95ED\u63D0\u793A">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.1"/><path d="m4.7 4.7 4.6 4.6m0-4.6L4.7 9.3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>`;
    const root = container.querySelector(".cl-page");
    const rows3 = root.querySelector(".cl-filter-rows");
    const summary = root.querySelector(".cl-summary");
    const searchForm = root.querySelector(".cl-search-row");
    const input = searchForm.querySelector("input");
    const pagination = root.querySelector(".cl-pagination");
    const tableScroll = root.querySelector(".cl-table-scroll");
    const resultCount = root.querySelector(".cl-result-count strong");
    const toolbar = root.querySelector(".cl-results-toolbar");
    const exportToggle = toolbar.querySelector("[data-cl-export-toggle]");
    const refreshButton = toolbar.querySelector("[data-cl-refresh]");
    const exportMenu = toolbar.querySelector(".cl-export-menu");
    const exportOptions = [...exportMenu.querySelectorAll("[data-cl-export]")];
    const resultsMessage = root.querySelector(".cl-results-message");
    function controlContents(key) {
      const field2 = fields[key];
      const selected = choiceLabels(key);
      return `<button class="cl-trigger" type="button" data-cl-toggle="${key}" aria-expanded="${open === key}"
          aria-controls="cl-menu-${key}" aria-label="${escapeHtml4(`${field2.label}\uFF0C${selected.map((item) => item.label).join("\u3001") || "\u4E0D\u9650"}`)}"></button>
        <span class="cl-field-name">${field2.name || field2.label}</span>
        <span class="cl-trigger-value">${selected.length ? selected.map(({ id, label }) => `<span class="cl-selected-value" data-cl-chip="${escapeHtml4(label)}">${rangeLabel(key, label)}<button type="button" class="cl-value-remove"
            data-cl-remove="${key}" data-choice="${id}" aria-label="\u79FB\u9664${escapeHtml4(label)}"></button></span>`).join("") : '<span class="cl-unlimited">\u4E0D\u9650</span>'}
          ${selected.length ? '<span class="cl-selected-value cl-overflow-count" hidden></span>' : ""}
        </span>${chevron}`;
    }
    function fitFilterControls() {
      rows3.querySelectorAll(".cl-control").forEach(fitFilterChips);
    }
    function rangeForm(key, field2, current) {
      const existing = rows3.querySelector(`[data-cl-custom-form="${key}"]`);
      const bounds = existing ? [existing.elements.minimum.value, existing.elements.maximum.value] : current?.custom ?? [];
      return renderCustomRange(key, field2, bounds, Boolean(current?.custom));
    }
    function selectControl(key) {
      const field2 = fields[key];
      const current = selection(key);
      const expanded = open === key;
      return `<div class="cl-select">
      <div class="cl-control">${controlContents(key)}</div>
      <div class="cl-menu" id="cl-menu-${key}" role="group" aria-label="${field2.label}\u9009\u9879"${expanded ? "" : " hidden"}>
        ${expanded ? `<div class="cl-multiselect-body">
          <div class="cl-options">${field2.options.map((item, i) => `<label class="cl-option">
            <input type="checkbox" class="cl-checkbox" data-cl-choice="${key}" value="${i}"${current?.choices.includes(i) ? " checked" : ""}>
            ${rangeLabel(key, field2.unit ? item[0] : item)}</label>`).join("")}</div>
          ${field2.unit ? rangeForm(key, field2, current) : ""}
        </div>
        <div class="cl-multiselect-footer">
          <button class="cl-clear" type="button" data-cl-clear-field="${key}" aria-label="\u6E05\u7A7A${field2.label}"${current ? "" : " disabled"}></button>
        </div>` : ""}
      </div>
    </div>`;
    }
    function renderFilters(focus) {
      const scrollTop = rows3.querySelector(`#cl-menu-${open} .cl-multiselect-body`)?.scrollTop;
      const aggregateSelected = choiceLabels("aggregateTypes").length > 0;
      rows3.innerHTML = `<div class="cl-filter-row">
      <div class="cl-filter-label cl-scale-modes" role="radiogroup" aria-label="\u89C4\u6A21\u53E3\u5F84">${Object.entries(modes).map(([key, label]) => {
        const selected = state.scale === key;
        return `<button type="button" role="radio" data-cl-scale="${key}" aria-checked="${selected}" tabindex="${selected ? 0 : -1}">${label}</button>`;
      }).join("")}</div>
      <div class="cl-filter-controls">${selectControl("amount")}${selectControl("rank")}</div>
    </div><div class="cl-filter-row"><div class="cl-filter-label">\u57FA\u91D1\u7C7B\u578B\u89C4\u6A21</div>
      <div class="cl-filter-controls">${selectControl("aggregateTypes")}${aggregateSelected ? selectControl("aggregateAmount") + selectControl("aggregateRank") : ""}</div>
    </div><div class="cl-filter-row"><div class="cl-filter-label">\u65D7\u4E0B\u57FA\u91D1</div>
      <div class="cl-filter-controls">${selectControl("ownedTypes")}${selectControl("fundCount")}</div>
    </div><div class="cl-filter-row"><div class="cl-filter-label">\u6210\u7ACB\u5E74\u9650</div>
      <div class="cl-filter-controls">${selectControl("age")}</div></div>`;
      if (scrollTop) rows3.querySelector(`#cl-menu-${open} .cl-multiselect-body`).scrollTop = scrollTop;
      fitFilterControls();
      renderSummary();
      if (focus) root.querySelector(focus)?.focus({ preventScroll: true });
    }
    function renderSummary() {
      const groups2 = [
        [modes[state.scale], ["amount", "rank"]],
        ["\u57FA\u91D1\u7C7B\u578B\u89C4\u6A21", ["aggregateTypes", "aggregateAmount", "aggregateRank"]],
        ["\u65D7\u4E0B\u57FA\u91D1", ["ownedTypes", "fundCount"]],
        ["\u6210\u7ACB\u5E74\u9650", ["age"]]
      ].map(([label, keys]) => ({ label, items: keys.flatMap((key) => choiceLabels(key).map((item) => ({ ...item, key }))) })).filter((group) => group.items.length);
      if (state.query) {
        groups2.unshift({ label: "\u516C\u53F8\u540D\u79F0", items: [{ key: "query", id: "query", label: state.query }] });
      }
      const count = groups2.reduce((total, group) => total + group.items.length, 0);
      summary.hidden = !count;
      summary.innerHTML = count ? `<span class="cl-summary-count">\u5DF2\u9009 <strong>(${count})</strong></span>
      <div class="cl-summary-tags">${groups2.map(({ label, items }) => `<div class="cl-summary-chip"><span class="cl-summary-label">${label}</span>${items.map(({ key, id, label: label2 }) => {
        const text = escapeHtml4(label2);
        const value = key === "query" ? `<span class="cl-summary-query" title="${text}">${text}</span>` : rangeLabel(key, label2);
        return `<span class="cl-summary-value">${value}<button type="button" class="cl-value-remove"
             data-cl-remove="${key}" data-choice="${id}" aria-label="\u79FB\u9664${key === "query" ? "\u516C\u53F8\u540D\u79F0\u641C\u7D22\uFF1A" : ""}${text}"></button></span>`;
      }).join("")}</div>`).join("")}</div>
      <button class="cl-clear" type="button" data-cl-clear aria-label="\u6E05\u7A7A"></button>` : "";
    }
    function renderTable() {
      const { records, aggregateTypes, aggregateActive, aggregateScale, aggregateRanks } = result;
      const items = records.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
      const visibleColumns = [...columns2];
      if (aggregateActive) visibleColumns.splice(4, 0, ["aggregateScale", "\u6240\u9009\u7C7B\u578B\u5408\u8BA1\u89C4\u6A21\uFF5C\u6392\u540D", 190]);
      const totalWidth = visibleColumns.reduce((total, [, , width]) => total + width, 0);
      root.querySelector("colgroup").innerHTML = visibleColumns.map(([key, , width]) => `<col${key === "aggregateScale" ? ' class="cl-aggregate-column"' : ""} style="width:${width / totalWidth * 100}%">`).join("");
      const header3 = root.querySelector("thead");
      header3.innerHTML = `<tr>${visibleColumns.map(([key, label]) => {
        const sort = state.sort.key === key ? state.sort.direction === 1 ? "ascending" : "descending" : null;
        const sortable = sortKeys.has(key);
        const numeric = !["name", "founded"].includes(key);
        return `<th scope="col" class="${numeric ? "cl-number" : ""}"${sort ? ` aria-sort="${sort}"` : ""}>
        ${sortable ? `<button type="button" class="cl-sort" data-cl-sort="${key}"${key === "aggregateScale" ? ` title="${escapeHtml4(aggregateTypes.join("\uFF0B"))}"` : ""}>${label}${sortIndicator2}</button>` : label}</th>`;
      }).join("")}</tr>`;
      root.querySelector("tbody").innerHTML = items.length ? items.map((company, index) => {
        const ranked = (key, value, unit) => metric(value, unit, baseRanks[key].get(company.id));
        const companyName = escapeHtml4(company.name);
        const cells = {
          sequence: (state.page - 1) * state.pageSize + index + 1,
          name: `<a class="cl-company-link" href="#/company/${company.id}" title="${companyName}">${companyNameMarkup(company, state.query)}</a>`,
          totalScale: ranked("totalScale", money2.format(company.totalScale), "\u4EBF"),
          nonMoneyScale: ranked("nonMoneyScale", money2.format(company.nonMoneyScale), "\u4EBF"),
          aggregateScale: aggregateActive ? metric(money2.format(aggregateScale(company)), "\u4EBF", aggregateRanks.get(company.id)) : "",
          fundCount: ranked("fundCount", integer2.format(company.fundCount), "\u53EA"),
          managerCount: ranked("managerCount", integer2.format(company.managerCount), "\u4EBA"),
          capital: metric(capital.format(company.capital), "\u4EBF"),
          founded: `<span class="cl-metric"><time datetime="${company.founded}">${company.founded}</time><span class="cl-rank">${ageAt(company.founded)}${unitText("\u5E74")}</span></span>`
        };
        return `<tr>${visibleColumns.map(([key]) => `<td class="${["name", "founded"].includes(key) ? "" : "cl-number"}"${key === "name" ? ` title="${companyName}"` : ""}>${cells[key]}</td>`).join("")}</tr>`;
      }).join("") : `<tr><td colspan="${visibleColumns.length}" class="cl-empty">\u672A\u627E\u5230\u7B26\u5408\u6761\u4EF6\u7684\u516C\u53F8</td></tr>`;
      updateTableOverflow();
    }
    function updateTableOverflow() {
      tableScroll.classList.toggle("has-horizontal-overflow", tableScroll.scrollWidth > tableScroll.clientWidth);
    }
    function renderResults() {
      result = getResults();
      resultCount.textContent = integer2.format(result.records.length);
      exportToggle.disabled = result.records.length === 0;
      state.page = Math.min(state.page, Math.max(1, Math.ceil(result.records.length / state.pageSize)));
      renderTable();
      unmountPagination?.();
      Object.assign(pagination.dataset, { pgTotal: result.records.length, pgCurrent: state.page, pgSize: state.pageSize });
      delete pagination.dataset.pgPageCount;
      unmountPagination = mountPagination(pagination);
    }
    function setExportMenu(visible) {
      exportMenu.hidden = !visible;
      exportToggle.setAttribute("aria-expanded", String(visible));
      if (visible) (exportMenu.querySelector('[aria-checked="true"]') ?? exportOptions[0]).focus({ preventScroll: true });
    }
    function hideResultsMessage() {
      clearTimeout(resultsMessageTimeout);
      if (resultsMessage.contains(document.activeElement)) {
        const trigger = resultsMessageTrigger.disabled ? refreshButton : resultsMessageTrigger;
        trigger.focus({ preventScroll: true });
      }
      resultsMessage.hidePopover();
    }
    function showResultsMessage(message, trigger) {
      clearTimeout(resultsMessageTimeout);
      resultsMessageTrigger = trigger;
      if (!resultsMessage.matches(":popover-open")) resultsMessage.showPopover();
      resultsMessage.querySelector(".zhice-message-text").textContent = message;
      resultsMessageTimeout = window.setTimeout(hideResultsMessage, 3e3);
    }
    function exportCompanies(scope) {
      const onPage = scope === "page";
      const start = onPage ? (state.page - 1) * state.pageSize : 0;
      const records = onPage ? result.records.slice(start, start + state.pageSize) : result.records;
      const { aggregateActive, aggregateScale, aggregateRanks } = result;
      const ranking2 = ({ position, total }) => `\u7B2C${position}\u540D / \u5171${total}\u5BB6`;
      const headers = [
        "\u5E8F\u53F7",
        "\u516C\u53F8\u540D\u79F0",
        "\u57FA\u91D1\u7C7B\u578B",
        "\u603B\u89C4\u6A21\uFF08\u4EBF\uFF09",
        "\u603B\u89C4\u6A21\u6392\u540D",
        "\u975E\u8D27\u89C4\u6A21\uFF08\u4EBF\uFF09",
        "\u975E\u8D27\u89C4\u6A21\u6392\u540D",
        ...aggregateActive ? ["\u6240\u9009\u7C7B\u578B\u5408\u8BA1\u89C4\u6A21\uFF08\u4EBF\uFF09", "\u6240\u9009\u7C7B\u578B\u5408\u8BA1\u89C4\u6A21\u6392\u540D"] : [],
        "\u57FA\u91D1\u603B\u6570\uFF08\u53EA\uFF09",
        "\u57FA\u91D1\u603B\u6570\u6392\u540D",
        "\u57FA\u91D1\u7ECF\u7406\u6570\uFF08\u4EBA\uFF09",
        "\u57FA\u91D1\u7ECF\u7406\u6570\u6392\u540D",
        "\u6CE8\u518C\u8D44\u672C\uFF08\u4EBF\uFF09",
        "\u6210\u7ACB\u65F6\u95F4",
        "\u6210\u7ACB\u5E74\u9650\uFF08\u5E74\uFF09"
      ];
      const data = records.map((company, index) => [
        start + index + 1,
        company.name,
        company.types.join("\u3001"),
        company.totalScale,
        ranking2(baseRanks.totalScale.get(company.id)),
        company.nonMoneyScale,
        ranking2(baseRanks.nonMoneyScale.get(company.id)),
        ...aggregateActive ? [aggregateScale(company), ranking2(aggregateRanks.get(company.id))] : [],
        company.fundCount,
        ranking2(baseRanks.fundCount.get(company.id)),
        company.managerCount,
        ranking2(baseRanks.managerCount.get(company.id)),
        company.capital.toFixed(4),
        company.founded,
        ageAt(company.founded)
      ]);
      const csv = [headers, ...data].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = onPage ? "\u516C\u53F8\u5217\u8868-\u5F53\u524D\u9875.csv" : "\u516C\u53F8\u5217\u8868-\u5168\u90E8\u7ED3\u679C.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
      showResultsMessage(onPage ? "\u5F53\u524D\u9875\u5BFC\u51FA\u6210\u529F" : "\u5168\u90E8\u7ED3\u679C\u5BFC\u51FA\u6210\u529F", exportToggle);
    }
    function changeFilters(focus) {
      state.page = 1;
      renderFilters(focus);
      renderResults();
    }
    function applyCompanyQuery() {
      const query = input.value.trim();
      if (query === state.query) return;
      state.query = query;
      open = null;
      changeFilters();
    }
    function closeMenu(focus = false) {
      const last = open;
      open = null;
      renderFilters(focus ? `[data-cl-toggle="${last}"]` : void 0);
    }
    function applyCustomRange(form, enabled, focusInvalid = false) {
      const key = form.dataset.clCustomForm;
      const current = selection(key);
      const custom = validateCustomRange(form, enabled, current?.custom, focusInvalid);
      if (custom === null) return;
      if (custom?.[0] === current?.custom?.[0] && custom?.[1] === current?.custom?.[1]) return;
      setSelection(key, { ...current, custom });
      state.page = 1;
      const select = form.closest(".cl-select");
      const control = select.querySelector(".cl-control");
      control.innerHTML = controlContents(key);
      select.querySelector("[data-cl-clear-field]").disabled = !selection(key);
      fitFilterChips(control);
      renderSummary();
      renderResults();
    }
    exportToggle.addEventListener("click", () => setExportMenu(exportMenu.hidden), { signal });
    exportMenu.addEventListener("click", (event) => {
      const selected = event.target.closest("[data-cl-export]");
      if (!selected) return;
      exportOptions.forEach((option) => option.setAttribute("aria-checked", String(option === selected)));
      setExportMenu(false);
      exportToggle.focus({ preventScroll: true });
      exportCompanies(selected.dataset.clExport);
    }, { signal });
    refreshButton.addEventListener("click", () => {
      setExportMenu(false);
      renderResults();
      showResultsMessage("\u5DF2\u5237\u65B0", refreshButton);
    }, { signal });
    toolbar.addEventListener("keydown", (event) => {
      if (exportMenu.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setExportMenu(false);
        exportToggle.focus({ preventScroll: true });
      } else if (exportMenu.contains(event.target) && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const current = exportOptions.indexOf(event.target);
        const next = event.key === "Home" ? 0 : event.key === "End" ? exportOptions.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + exportOptions.length) % exportOptions.length;
        exportOptions[next].focus({ preventScroll: true });
      }
    }, { signal });
    resultsMessage.querySelector(".zhice-message-close").addEventListener("click", hideResultsMessage, { signal });
    toolbar.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !toolbar.contains(event.relatedTarget)) setExportMenu(false);
    }, { signal });
    root.addEventListener("click", (event) => {
      const target = event.target.closest("button");
      if (!target) return;
      const { clToggle, clRemove, clScale, clSort, clClearField, choice } = target.dataset;
      if (clToggle) {
        if (open === clToggle) closeMenu(true);
        else {
          open = clToggle;
          renderFilters(`[data-cl-toggle="${clToggle}"]`);
        }
      } else if (clRemove === "query" || target.hasAttribute("data-cl-clear-query")) {
        open = null;
        state.query = "";
        input.value = "";
        changeFilters("#cl-company-query");
      } else if (clRemove) {
        open = null;
        const current = selection(clRemove);
        setSelection(clRemove, choice === "custom" ? { choices: current.choices } : { ...current, choices: current.choices.filter((index) => index !== Number(choice)) });
        const field2 = !selection("aggregateTypes") && ["aggregateAmount", "aggregateRank"].includes(clRemove) ? "aggregateTypes" : clRemove;
        changeFilters(`[data-cl-toggle="${field2}"]`);
      } else if (clScale && clScale !== state.scale) {
        open = null;
        state.scale = clScale;
        changeFilters(`[data-cl-scale="${clScale}"]`);
      } else if (clClearField) {
        setSelection(clClearField);
        const body = target.closest(".cl-menu").querySelector(".cl-multiselect-body");
        body.querySelector("[data-cl-custom-form]")?.remove();
        body.scrollTop = 0;
        changeFilters(`[data-cl-choice="${clClearField}"]`);
      } else if (target.hasAttribute("data-cl-clear")) {
        open = null;
        state.query = "";
        input.value = "";
        state.scales = { total: {}, nonMoney: {} };
        state.criteria = {};
        changeFilters('[data-cl-toggle="amount"]');
      } else if (clSort && sortKeys.has(clSort)) {
        const firstDirection = ["name", "founded"].includes(clSort) ? 1 : -1;
        if (state.sort.key !== clSort) {
          state.sort = { key: clSort, direction: firstDirection };
        } else if (state.sort.direction === firstDirection) {
          state.sort = { key: clSort, direction: -firstDirection };
        } else {
          state.sort = defaultSort2;
        }
        state.page = 1;
        renderResults();
        root.querySelector(`[data-cl-sort="${clSort}"]`)?.focus({ preventScroll: true });
      }
    }, { signal });
    root.addEventListener("change", (event) => {
      const target = event.target;
      const form = target.form;
      if (form?.dataset.clCustomForm && target === form.elements.useCustom) {
        applyCustomRange(form, target.checked, true);
        return;
      }
      const key = target.dataset.clChoice;
      if (!key) return;
      const index = Number(target.value);
      const current = selection(key);
      const previous = current?.choices || [];
      const picked = target.checked ? [...previous, index].sort((a, b) => a - b) : previous.filter((item) => item !== index);
      setSelection(key, { ...current, choices: picked });
      changeFilters(`[data-cl-choice="${key}"][value="${index}"]`);
    }, { signal });
    rows3.addEventListener("input", (event) => {
      const target = event.target;
      const form = target.form;
      if (target.type !== "number" || !form?.dataset.clCustomForm) return;
      if (form.elements.useCustom.checked) applyCustomRange(form, true);
      else form.querySelector(".cl-form-error").textContent = "";
    }, { signal });
    input.addEventListener("input", (event) => {
      if (!event.isComposing) applyCompanyQuery();
    }, { signal });
    input.addEventListener("compositionend", applyCompanyQuery, { signal });
    root.addEventListener("submit", (event) => {
      event.preventDefault();
      if (event.target === searchForm) {
        input.value = input.value.trim();
        applyCompanyQuery();
        return;
      }
      if (event.target.dataset.clCustomForm) applyCustomRange(event.target, true, true);
    }, { signal });
    pagination.addEventListener("paginationchange", ({ detail }) => {
      state.page = detail.page;
      state.pageSize = detail.pageSize;
      renderTable();
      tableScroll.scrollTop = 0;
    }, { signal });
    document.addEventListener("click", (event) => {
      if (open && !event.target.closest(".cl-select")) closeMenu();
      if (!exportMenu.hidden && !toolbar.contains(event.target)) setExportMenu(false);
    }, { signal });
    root.addEventListener("keydown", (event) => {
      const scale = event.target.dataset.clScale;
      if (scale && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const otherScale = scale === "total" ? "nonMoney" : "total";
        root.querySelector(`[data-cl-scale="${otherScale}"]`).click();
      } else if (open && event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      } else if (event.key === "ArrowDown" && event.target.dataset.clToggle) {
        event.preventDefault();
        const key = event.target.dataset.clToggle;
        open = key;
        renderFilters(`[data-cl-choice="${key}"]`);
      }
    }, { signal });
    window.addEventListener("resize", updateTableOverflow, { signal });
    document.fonts.addEventListener("loadingdone", fitFilterControls, { signal });
    renderFilters();
    renderResults();
    const filterResize = new ResizeObserver(fitFilterControls);
    filterResize.observe(rows3);
    return () => {
      controller.abort();
      clearTimeout(resultsMessageTimeout);
      filterResize.disconnect();
      unmountPagination?.();
    };
  }

  // dist/company-charts.js?v=20261123-rating-counts
  var palette = ["#E68BA9", "#E7BA70", "#B8CC80", "#AA99DA", "#7CBDC3"];
  var textColor = "#666";
  var lineColor = "#c9c7e8";
  var labelFont = 'Roboto, "PingFang SC", sans-serif';
  var axisNumber = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 });
  var preciseNumber = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  var tooltip = {
    renderMode: "richText",
    confine: true,
    borderColor: "#E8E7EE",
    textStyle: { color: "#333", fontFamily: labelFont, fontSize: 12 }
  };
  function emptyChart() {
    return {
      animation: false,
      title: {
        text: "\u6682\u65E0\u6570\u636E",
        left: "center",
        top: "middle",
        textStyle: { color: textColor, fontFamily: labelFont, fontSize: 14, fontWeight: "normal" }
      }
    };
  }
  function amount(value) {
    return Number.isFinite(value) ? preciseNumber.format(value) + " \u4EBF\u5143" : "\u2014";
  }
  function scaleChart(rows3, approximate) {
    const data = rows3.filter((item) => item?.date && (Number.isFinite(item.total) || Number.isFinite(item.change))).sort((a, b) => a.date.localeCompare(b.date));
    if (!data.length) return emptyChart();
    const values = (key) => data.map((item) => Number.isFinite(item[key]) ? item[key] : null);
    return {
      animation: false,
      textStyle: { fontFamily: labelFont },
      tooltip: {
        ...tooltip,
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "#B7B4D2", type: "dashed" } },
        valueFormatter: amount,
        ...approximate && {
          formatter: (items) => [
            items[0]?.axisValueLabel,
            ...items.map((item) => `${item.marker}${item.seriesName}\uFF1A${amount(item.value)}`),
            "\u56FE\u8868\u70B9\u4F4D\u4E3A\u793A\u610F\u503C"
          ].filter(Boolean).join("\n")
        }
      },
      legend: {
        bottom: 3,
        itemWidth: 12,
        itemHeight: 8,
        itemGap: 20,
        data: ["\u603B\u89C4\u6A21", "\u89C4\u6A21\u53D8\u5316"],
        textStyle: { color: textColor, fontSize: 12 }
      },
      grid: { left: 4, right: 12, top: 24, bottom: 37, containLabel: true },
      xAxis: {
        type: "category",
        data: data.map((item) => item.date),
        axisTick: { show: false },
        axisLine: { show: true, onZero: false, lineStyle: { color: "#E1E1E9" } },
        axisLabel: {
          color: textColor,
          fontSize: 12,
          margin: 10,
          showMinLabel: true,
          showMaxLabel: true,
          hideOverlap: true,
          formatter: (date, index) => {
            const year = date.slice(0, 4);
            const earlier = data[index - 1];
            if (index === data.length - 1 && earlier?.date.startsWith(year)) return date.slice(5);
            return earlier?.date.startsWith(year) ? "" : year;
          },
          interval: (index, date) => !index || index === data.length - 1 || !data[index - 1].date.startsWith(date.slice(0, 4))
        }
      },
      yAxis: {
        type: "value",
        name: "\u4EBF\u5143",
        nameLocation: "end",
        nameGap: 9,
        nameTextStyle: { color: textColor, fontSize: 12, align: "right" },
        splitNumber: 5,
        axisLabel: { formatter: (value) => axisNumber.format(value), color: textColor, fontSize: 12 },
        splitLine: { lineStyle: { color: "#ECECF2", type: "dashed" } }
      },
      series: [
        {
          name: "\u603B\u89C4\u6A21",
          type: "line",
          data: values("total"),
          showSymbol: data.length === 1,
          symbolSize: 5,
          connectNulls: false,
          z: 3,
          lineStyle: { color: "#6865A7", width: 2 },
          itemStyle: { color: "#6865A7" }
        },
        {
          name: "\u89C4\u6A21\u53D8\u5316",
          type: "bar",
          data: values("change"),
          barMaxWidth: 22,
          itemStyle: { color: lineColor }
        }
      ]
    };
  }
  function productChart(rows3, useLegend) {
    const items = rows3.filter((item) => item?.label && Number.isFinite(item.percent) && item.percent > 0);
    if (!items.length) return emptyChart();
    const data = items.map((item, index) => ({
      name: item.label,
      value: item.percent,
      itemStyle: { color: item.color || palette[index % palette.length] }
    }));
    return {
      animation: false,
      textStyle: { fontFamily: labelFont },
      tooltip: {
        ...tooltip,
        trigger: "item",
        valueFormatter: (value) => preciseNumber.format(value) + "%"
      },
      legend: useLegend ? {
        bottom: 3,
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 12,
        icon: "circle",
        selectedMode: false,
        textStyle: { color: textColor, fontSize: 12 }
      } : void 0,
      series: [{
        name: "\u89C4\u6A21\u5360\u6BD4",
        type: "pie",
        data,
        center: ["50%", useLegend ? "44%" : "50%"],
        radius: ["53%", "82%"],
        startAngle: 90,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scaleSize: 4 }
      }]
    };
  }
  function ratingChartImage(distribution) {
    if (!distribution?.querySelector(".company-rating-plot")) return null;
    const { left, top, width, height } = distribution.getBoundingClientRect();
    if (!width || !height) return null;
    const padding = 16;
    const pixelRatio = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil((width + padding * 2) * pixelRatio);
    canvas.height = Math.ceil((height + padding * 2) * pixelRatio);
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.scale(pixelRatio, pixelRatio);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
    context.translate(padding - left, padding - top);
    function drawShape(element) {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const style = getComputedStyle(element);
      context.fillStyle = style.backgroundColor;
      context.beginPath();
      if (typeof context.roundRect === "function") {
        context.roundRect(rect.left, rect.top, rect.width, rect.height, Number.parseFloat(style.borderTopLeftRadius) || 0);
      } else {
        context.rect(rect.left, rect.top, rect.width, rect.height);
      }
      context.fill();
    }
    function drawLabel(element) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      context.fillStyle = style.color;
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      context.textBaseline = "middle";
      context.fillText(element.textContent.trim(), rect.left, rect.top + rect.height / 2);
    }
    distribution.querySelectorAll('.company-rating-row[aria-pressed="true"]').forEach(drawShape);
    context.setLineDash([4, 4]);
    distribution.querySelectorAll(".company-rating-guides span").forEach((guide) => {
      const rect = guide.getBoundingClientRect();
      const style = getComputedStyle(guide);
      context.lineWidth = Number.parseFloat(style.borderLeftWidth) || 1;
      context.strokeStyle = style.borderLeftColor;
      const x = rect.left + rect.width / 2;
      context.beginPath();
      context.moveTo(x, rect.top);
      context.lineTo(x, rect.bottom);
      context.stroke();
    });
    distribution.querySelectorAll(".company-bar").forEach(drawShape);
    distribution.querySelectorAll(
      "h3, .company-rating-row > span:not(.company-bar-track, .company-rating-quantity), .company-rating-quantity > span, .company-rating-axis span"
    ).forEach(drawLabel);
    return canvas.toDataURL("image/png");
  }
  function mountCompanyCharts(root, data = {}) {
    const echarts = globalThis.echarts;
    if (!root || !echarts) return () => {
    };
    const onProductHover = data.onProductHover;
    let hoveredProduct = null;
    function setHoveredProduct(name) {
      if (hoveredProduct === name) return;
      hoveredProduct = name;
      onProductHover(name);
    }
    function bindProductHover(chart) {
      const isSlice = (params) => params?.componentType === "series" && params.seriesType === "pie" && typeof params.name === "string";
      chart.on("mouseover", (params) => {
        if (isSlice(params)) setHoveredProduct(params.name);
      });
      chart.on("mouseout", (params) => {
        if (isSlice(params) && hoveredProduct === params.name) setHoveredProduct(null);
      });
      chart.on("globalout", () => setHoveredProduct(null));
    }
    const entries = [
      ["scale", () => scaleChart(data.scale ?? [], data.scaleApproximate)],
      ["products", (element) => productChart(data.products ?? [], element.dataset.companyChartLegend !== "external")]
    ].map(([key, getOptions]) => {
      const element = root.querySelector('[data-company-chart="' + key + '"]');
      return { key, element, getOptions, chart: void 0 };
    }).filter((entry) => entry.element);
    if (!entries.length) return () => {
    };
    function syncSize(entry) {
      const { element } = entry;
      if (!element.clientWidth || !element.clientHeight) return;
      if (entry.chart && !entry.chart.isDisposed()) {
        entry.chart.resize();
        return;
      }
      const chart = echarts.getInstanceByDom(element) || echarts.init(element, null, { renderer: "canvas" });
      chart.setOption(entry.getOptions(element), { notMerge: true });
      if (entry.key === "products" && typeof onProductHover === "function") bindProductHover(chart);
      entry.chart = chart;
    }
    const syncCharts = () => entries.forEach(syncSize);
    syncCharts();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(syncCharts) : void 0;
    if (observer) {
      entries.forEach((entry) => observer.observe(entry.element));
    } else {
      window.addEventListener("resize", syncCharts);
    }
    return () => {
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", syncCharts);
      entries.forEach(({ chart }) => {
        if (chart && !chart.isDisposed()) chart.dispose();
      });
      if (hoveredProduct !== null) setHoveredProduct(null);
    };
  }

  // dist/company-detail-lists.js?v=20261123-fund-pagination
  var EMPTY = "\u2014";
  function escapeText(value) {
    return String(value ?? EMPTY).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }
  function valueWithUnit(value, unit, digits) {
    if (value == null || value === "") return EMPTY;
    if (typeof value !== "number") return value;
    return `${digits === void 0 ? value : value.toFixed(digits)}${unit}`;
  }
  function returnCell(value) {
    if (value == null || value === "") return '<td class="num">\u2014</td>';
    const number2 = Number(String(value).replace(/^−/, "-").replace(/[%+,]/g, ""));
    const className = number2 > 0 ? " is-rise" : number2 < 0 ? " is-fall" : "";
    return `<td class="num${className}">${escapeText(valueWithUnit(value, "%", 2))}</td>`;
  }
  function ratingCell2(value) {
    if (value == null || value === "") return "<td>\u2014</td>";
    const rating2 = Number(value);
    if (!Number.isInteger(rating2) || rating2 < 1 || rating2 > 5) return "<td>\u2014</td>";
    return `<td><span class="company-stars" role="img" aria-label="${rating2} \u661F"><span aria-hidden="true">${"\u2605".repeat(rating2)}<span class="company-stars-muted">${"\u2605".repeat(5 - rating2)}</span></span></span></td>`;
  }
  var fundColumns = [
    ["name", "\u57FA\u91D1\u540D\u79F0/\u4EE3\u7801"],
    ["type", "\u57FA\u91D1\u7C7B\u578B"],
    ["manager", "\u57FA\u91D1\u7ECF\u7406"],
    ["founded", "\u6210\u7ACB\u65E5\u671F"],
    ["rating3", "3\u5E74\u8BC4\u7EA7"],
    ["rating5", "5\u5E74\u8BC4\u7EA7"],
    ["navDate", "\u6700\u65B0\u51C0\u503C\u65E5\u671F"],
    ["returns", "\u8FD16\u6708\u6536\u76CA"],
    ["rank", "\u8FD16\u6708\u6392\u540D"]
  ];
  var managerColumns = [
    ["name", "\u57FA\u91D1\u7ECF\u7406"],
    ["type", "\u6295\u8D44\u7C7B\u578B"],
    ["scale", "\u5728\u7BA1\u89C4\u6A21"],
    ["tenure", "\u7BA1\u7406\u5E74\u9650"],
    ["experience", "\u4ECE\u4E1A\u7ECF\u9A8C"],
    ["count", "\u5728\u7BA1\u4EA7\u54C1\u6570\u91CF"],
    ["product", "\u4EE3\u8868\u4EA7\u54C1"],
    ["annual", "\u4EE3\u8868\u4EA7\u54C1\u5E74\u5316\u56DE\u62A5"],
    ["returns", "\u8FD1\u4E00\u5E74\u6536\u76CA\u7387"]
  ];
  var fundStatuses = [["running", "\u8FD0\u884C\u4E2D"], ["liquidated", "\u5DF2\u6E05\u7B97"], ["all", "\u5168\u90E8"]];
  var fundTypeOptions = fundCategories.flatMap(([, types2]) => types2);
  var fundListDefaults = {
    fundStatus: "running",
    fundTypes: fundTypeOptions,
    fundBranch: fundCategories[0][0],
    fundMenuOpen: false,
    masterOnly: false,
    fundPage: 1,
    fundPageSize: 10,
    fundSort: "rating3",
    fundSortDirection: "desc"
  };
  var managerListDefaults = {
    managerFilter: "all",
    managerPage: 1,
    managerPageSize: 10,
    managerSort: "",
    managerSortDirection: "asc"
  };
  function sortListRows(a, b, key, direction) {
    const left = a[key];
    const right = b[key];
    if (left == null || right == null) return Number(left == null) - Number(right == null);
    const comparison = key === "rank" ? Number(left.split("/")[0]) - Number(right.split("/")[0]) : typeof left === "number" ? left - right : left.localeCompare(right, "zh-CN", { numeric: true });
    return direction === "asc" ? comparison : -comparison;
  }
  function listPage(length, requestedPage, pageSize) {
    const pageCount = Math.max(1, Math.ceil(length / pageSize));
    const page = Math.min(pageCount, Math.max(1, requestedPage));
    return { pageCount, page, start: (page - 1) * pageSize };
  }
  function fundListSnapshot(state2) {
    const types2 = new Set(state2.fundTypes);
    const matching = fundListExamples.filter((fund) => types2.has(fund.subtype) && (!state2.masterOnly || fund.isMaster));
    const running = matching.filter((fund) => fund.status === "running").length;
    const counts = { running, liquidated: matching.length - running, all: matching.length };
    const records = (state2.fundStatus === "all" ? matching : matching.filter((fund) => fund.status === state2.fundStatus)).sort((a, b) => sortListRows(a, b, state2.fundSort, state2.fundSortDirection));
    return { records, counts, ...listPage(records.length, state2.fundPage, state2.fundPageSize) };
  }
  function managerListSnapshot(managers, state2) {
    const records = managers.filter((manager) => state2.managerFilter === "all" || manager.type === state2.managerFilter);
    if (state2.managerSort) records.sort((a, b) => sortListRows(a, b, state2.managerSort, state2.managerSortDirection));
    return { records, ...listPage(records.length, state2.managerPage, state2.managerPageSize) };
  }
  function fundListCsv(state2) {
    return [
      ["\u5E8F\u53F7", "\u57FA\u91D1\u540D\u79F0", "\u57FA\u91D1\u4EE3\u7801", ...fundColumns.slice(1).map(([, label]) => label)],
      ...fundListSnapshot(state2).records.map((fund, index) => [
        index + 1,
        fund.name,
        fund.code,
        fund.type,
        fund.manager,
        fund.founded,
        fund.rating3,
        fund.rating5,
        fund.navDate,
        valueWithUnit(fund.returns, "%"),
        fund.rank
      ])
    ];
  }
  function fundChevron() {
    return '<svg class="company-fund-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function fundOptionCheck(kind, key, label, checked, mixed) {
    const name = `${kind === "branch" ? "\u9009\u62E9" : ""}${label}`;
    return `<label class="company-fund-option-check">
    <input type="checkbox" data-fund-check="${kind}" value="${escapeText(key)}" aria-label="${escapeText(name)}"${checked ? " checked" : ""}${mixed ? ' data-indeterminate aria-checked="mixed"' : ""}>
    ${kind === "branch" ? "" : `<span>${escapeText(label)}</span>`}
  </label>`;
  }
  function fundCascade(state2) {
    const selected = new Set(state2.fundTypes);
    const all = selected.size === fundTypeOptions.length;
    const first = fundTypeOptions.find((key) => selected.has(key));
    const firstCategory = fundCategories.find(([, keys]) => keys.includes(first))?.[0];
    const label = all ? "\u5168\u90E8" : first ? `${firstCategory} / ${first}` : "\u8BF7\u9009\u62E9";
    const removeLabel = all ? "\u53D6\u6D88\u5168\u9009" : "\u79FB\u9664\u9996\u4E2A\u5DF2\u9009\u9879";
    const extra = Math.max(0, selected.size - 1);
    const branchRows = fundCategories.map(([parent, keys]) => {
      const count = keys.filter((key) => selected.has(key)).length;
      const active = parent === state2.fundBranch;
      return `<div class="company-fund-option${active ? " is-active" : ""}${count === keys.length ? " is-checked" : ""}">
      ${fundOptionCheck("branch", parent, parent, count === keys.length, count > 0 && count < keys.length)}
      <button class="company-fund-branch" type="button" data-fund-branch="${escapeText(parent)}" aria-pressed="${active}"><span>${escapeText(parent)}</span>${fundChevron()}</button>
    </div>`;
    }).join("");
    const activeTypes = fundCategories.find(([parent]) => parent === state2.fundBranch)?.[1] ?? [];
    return `<div class="company-fund-cascade"${extra ? " data-extra" : ""}>
    <button type="button" class="company-fund-trigger" data-fund-menu aria-label="\u57FA\u91D1\u7C7B\u578B ${escapeText(label)}${extra ? `\uFF0C\u53E6\u6709 ${extra} \u9879` : ""}"
      aria-expanded="${state2.fundMenuOpen}" aria-controls="company-fund-menu">
      <span class="company-fund-filter-label">\u57FA\u91D1\u7C7B\u578B</span><span class="company-fund-chip">${escapeText(label)}</span>
      ${extra ? `<span class="company-fund-chip company-fund-chip--count">+${extra}</span>` : ""}${fundChevron()}
    </button>
    ${first ? `<button type="button" class="company-fund-clear" data-fund-clear aria-label="${removeLabel}" title="${removeLabel}"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m3.5 3.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg></button>` : ""}
    <div class="company-fund-menu" id="company-fund-menu" role="group" aria-label="\u57FA\u91D1\u7C7B\u578B\u7EA7\u8054\u591A\u9009"${state2.fundMenuOpen ? "" : " hidden"}>
      <div class="company-fund-column" role="group" aria-label="\u4E00\u7EA7\u5206\u7C7B">
        <div class="company-fund-option${all ? " is-checked" : ""}">${fundOptionCheck("all", "", "\u5168\u90E8", all, !all && selected.size > 0)}</div>
        ${branchRows}
      </div>
      <div class="company-fund-column" role="group" aria-label="${escapeText(state2.fundBranch)}\u5B50\u7C7B">
        ${activeTypes.map((key) => `<div class="company-fund-option${selected.has(key) ? " is-checked" : ""}">${fundOptionCheck("leaf", key, key, selected.has(key), false)}</div>`).join("")}
      </div>
    </div>
  </div>`;
  }
  function listPageNumbers(page, last) {
    if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, null, last];
    if (page >= last - 3) return [1, null, last - 4, last - 3, last - 2, last - 1, last];
    return [1, null, page - 1, page, page + 1, null, last];
  }
  function listPagination(title, page, last, total, pageSize, pageSizeControl) {
    return `<nav class="company-fund-pagination" aria-label="${title}\u5206\u9875">
    <div class="company-fund-total" aria-live="polite">\u5171 <b>${total}</b> \u6761</div>
    <div class="company-fund-page-controls">
      <div class="company-fund-pages">
        <button type="button" class="company-fund-page" data-company-list-page="${page - 1}" data-company-list-page-step="prev" aria-label="\u4E0A\u4E00\u9875"${page === 1 ? " disabled" : ""}>${fundChevron()}</button>
        ${listPageNumbers(page, last).map((number2) => number2 == null ? '<span class="company-fund-page" aria-hidden="true">\u2026</span>' : `<button type="button" class="company-fund-page" data-company-list-page="${number2}" aria-label="\u7B2C ${number2} \u9875"${number2 === page ? ' aria-current="page"' : ""}>${number2}</button>`).join("")}
        <button type="button" class="company-fund-page" data-company-list-page="${page + 1}" data-company-list-page-step="next" aria-label="\u4E0B\u4E00\u9875"${page === last ? " disabled" : ""}>${fundChevron()}</button>
      </div>
      <label class="company-fund-page-size"><select data-company-control="${pageSizeControl}" aria-label="\u6BCF\u9875\u6761\u6570">${[5, 10, 20, 50].map((size) => `<option value="${size}"${size === pageSize ? " selected" : ""}>${size}\u6761/\u9875</option>`).join("")}</select></label>
      <form class="company-fund-jump" data-company-list-jump><label for="company-list-page-input">\u8DF3\u81F3</label>
        <input id="company-list-page-input" type="number" inputmode="numeric" min="1" max="${last}" step="1" required aria-label="\u8DF3\u81F3\u9875\u7801"> \u9875
      </form>
    </div>
  </nav>`;
  }
  function listTable({ title, tableClass, columns: columns3, sort, sortDirection, rows: rows3, empty }) {
    return `<div class="company-table-scroll" tabindex="0" role="region" aria-label="${title}\u6570\u636E\u8868">
    <table class="company-table company-table--wide company-list-table ${tableClass}">
      <thead><tr><th scope="col" class="company-fund-seq">\u5E8F\u53F7</th>
        ${columns3.map(([key, label]) => {
      const direction = key === sort ? sortDirection : "";
      return `<th scope="col"${direction ? ` aria-sort="${direction === "asc" ? "ascending" : "descending"}"` : ""}>
            <button type="button" class="company-fund-sort" data-company-list-sort="${key}">${label}<span class="company-fund-sort-icon${direction ? ` is-${direction}` : ""}" aria-hidden="true"></span></button>
          </th>`;
    }).join("")}
      </tr></thead>
      <tbody>${rows3 || `<tr><td colspan="${columns3.length + 1}" class="company-empty">${empty}</td></tr>`}</tbody>
    </table>
  </div>`;
  }
  function renderFundTable(state2, snapshot = fundListSnapshot(state2)) {
    const { records, start } = snapshot;
    const rows3 = records.slice(start, start + state2.fundPageSize).map((fund, index) => {
      const [position, total] = fund.rank.split("/");
      const managers = String(fund.manager ?? "").split(/[｜|]/).map((name) => name.trim()).filter(Boolean);
      const managerNames = (managers.length ? managers : [EMPTY]).map((name) => `<span class="company-list-name">${escapeText(name)}</span>`).join(" ");
      return `<tr>
      <td class="company-fund-seq">${start + index + 1}</td>
      <td><span class="company-list-name">${escapeText(fund.name)}</span><small class="company-list-code">${escapeText(fund.code)}</small></td>
      <td>${escapeText(fund.type)}</td><td><div class="company-fund-manager-names">${managerNames}</div></td>
      <td>${escapeText(fund.founded)}</td>${ratingCell2(fund.rating3)}${ratingCell2(fund.rating5)}
      <td>${escapeText(fund.navDate)}</td>${returnCell(fund.returns)}
      <td class="num">${escapeText(position)} <span class="company-quiet">/ ${escapeText(total)}</span></td>
    </tr>`;
    }).join("");
    return listTable({
      title: "\u65D7\u4E0B\u57FA\u91D1",
      tableClass: "company-fund-table",
      columns: fundColumns,
      sort: state2.fundSort,
      sortDirection: state2.fundSortDirection,
      rows: rows3,
      empty: "\u5F53\u524D\u7B5B\u9009\u6761\u4EF6\u4E0B\u6682\u65E0\u57FA\u91D1\u3002"
    });
  }
  function fundList(state2, actions2) {
    const snapshot = fundListSnapshot(state2);
    const { records, counts, page } = snapshot;
    return `<section class="company-panel company-fund-panel" aria-label="\u65D7\u4E0B\u57FA\u91D1">
    <div class="company-fund-toolbar">
      <div class="company-fund-statuses" role="group" aria-label="\u57FA\u91D1\u72B6\u6001">
        ${fundStatuses.map(([key, label]) => `<button type="button" class="company-fund-status" data-fund-status="${key}" aria-pressed="${key === state2.fundStatus}">${label} <b>${counts[key]}</b></button>`).join("")}
      </div>
      <div class="company-fund-toolbar-controls">
        <label class="company-fund-master"><input type="checkbox" role="switch" data-company-control="masterOnly"${state2.masterOnly ? " checked" : ""}><span class="company-fund-switch" aria-hidden="true"></span><span>\u4EC5\u663E\u793A\u4E3B\u4EE3\u7801\u57FA\u91D1</span></label>
        ${fundCascade(state2)}${actions2}
      </div>
    </div>
    ${renderFundTable(state2, snapshot)}
    <nav class="zc-pagination" aria-label="\u65D7\u4E0B\u57FA\u91D1\u5206\u9875" data-pg-kind="page"
      data-pg-total="${records.length}" data-pg-current="${page}" data-pg-size="${state2.fundPageSize}"></nav>
  </section>`;
  }
  function managerValues(manager) {
    return [
      manager.name,
      manager.type,
      valueWithUnit(manager.scale, "\u4EBF", 2),
      valueWithUnit(manager.tenure, "\u5E74", 1),
      valueWithUnit(manager.experience, "\u5E74"),
      valueWithUnit(manager.count, "\u53EA"),
      manager.product,
      manager.annual,
      manager.returns
    ];
  }
  function managerListCsv(managers, state2) {
    const { records } = managerListSnapshot(managers, state2);
    return [
      ["\u5E8F\u53F7", ...managerColumns.map(([, label]) => label)],
      ...records.map((manager, index) => {
        const [name, type, scale, tenure, experience, count, product, annual, returns] = managerValues(manager);
        return [index + 1, name, type, scale, tenure, experience, count, product, valueWithUnit(annual, "%", 2), valueWithUnit(returns, "%", 2)];
      })
    ];
  }
  function managerList(managers, state2, { actions: actions2, filter }) {
    const { records, page, pageCount, start } = managerListSnapshot(managers, state2);
    const rows3 = records.slice(start, start + state2.managerPageSize).map((manager, index) => {
      const [name, type, scale, tenure, experience, count, product, annual, returns] = managerValues(manager);
      return `<tr>
      <td class="company-fund-seq">${start + index + 1}</td>
      <td class="company-list-name">${escapeText(name)}</td>
      <td>${escapeText(type)}</td>
      <td class="num">${escapeText(scale)}</td><td class="num">${escapeText(tenure)}</td>
      <td class="num">${escapeText(experience)}</td><td class="num">${escapeText(count)}</td>
      <td><span class="company-list-name" title="${escapeText(product)}">${escapeText(product)}</span></td>
      ${returnCell(annual)}${returnCell(returns)}
    </tr>`;
    }).join("");
    return `<section class="company-panel company-manager-panel" aria-label="\u5728\u804C\u7ECF\u7406">
    <div class="company-fund-toolbar">
      <h2>\u5728\u804C\u7ECF\u7406</h2>
      <div class="company-fund-toolbar-controls">${filter}${actions2}</div>
    </div>
    ${listTable({
      title: "\u5728\u804C\u7ECF\u7406",
      tableClass: "company-manager-table",
      columns: managerColumns,
      sort: state2.managerSort,
      sortDirection: state2.managerSortDirection,
      rows: rows3,
      empty: "\u5F53\u524D\u6295\u8D44\u7C7B\u578B\u6682\u65E0\u57FA\u91D1\u7ECF\u7406\u3002"
    })}
    ${listPagination("\u5728\u804C\u7ECF\u7406", page, pageCount, records.length, state2.managerPageSize, "managerPageSize")}
  </section>`;
  }
  function renderCompanyList(tab, data, state2 = {}, { actions: actions2 = "", filter = "" } = {}) {
    if (tab === "funds") return fundList({ ...fundListDefaults, ...state2 }, actions2);
    if (tab === "managers") return managerList(data.managers ?? [], { ...managerListDefaults, ...state2 }, { actions: actions2, filter });
    return "";
  }

  // dist/components/pagination.js?v=20261123
  var pageSizes2 = [5, 10, 20, 50];
  function mountPagination2(widget) {
    if (!widget || widget.dataset.pgMounted) return () => {
    };
    const controller = new AbortController();
    const { signal } = controller;
    widget.dataset.pgMounted = "true";
    const module = widget.dataset.pgKind === "module";
    const total = Math.max(0, Number(widget.dataset.pgTotal) || 0);
    const slotSize = module ? 20 : 28;
    let size = Number(widget.dataset.pgSize) || 5;
    let pages = Math.max(1, Number(widget.dataset.pgPageCount) || Math.ceil(total / size));
    let page = Math.max(1, Math.min(pages, Number(widget.dataset.pgCurrent) || 1));
    let open = false;
    let lastJump = "";
    let rendering = false;
    function arrow(direction) {
      const paths = module ? { prev: "M11.6998 13.4L8.2998 10L11.6998 6.60001", next: "M8.3002 13.4L11.7002 10L8.3002 6.60001" } : { prev: "M16.0479 18.0957L11.9521 14L16.0479 9.9043", next: "M11.9521 18.0957L16.0479 14L11.9521 9.9043" };
      return `<svg aria-hidden="true" width="${slotSize}" height="${slotSize}" viewBox="0 0 ${slotSize} ${slotSize}" fill="none"><path d="${paths[direction]}" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    const downPath = module ? "M1.6 3.3L5 6.7L8.4 3.3" : "M0.904297 2.95215L5 7.04785L9.0957 2.95215";
    const down = `<svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="${downPath}" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const dotCenter = slotSize / 2;
    const dots = `<svg aria-hidden="true" width="${slotSize}" height="${slotSize}" viewBox="0 0 ${slotSize} ${slotSize}">${[dotCenter - 3.164, dotCenter, dotCenter + 3.164].map((x) => `<ellipse cx="${x}" cy="${dotCenter}" rx=".732" ry=".738" fill="currentColor"/>`).join("")}</svg>`;
    function slots() {
      if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1);
      if (page <= 4) return [1, 2, 3, 4, 5, "next", pages];
      if (page >= pages - 3) return [1, "prev", pages - 4, pages - 3, pages - 2, pages - 1, pages];
      return [1, "prev", page - 1, page, page + 1, "next", pages];
    }
    function render(focus) {
      rendering = true;
      try {
        widget.dataset.pgCurrent = page;
        widget.dataset.pgSize = size;
        widget.dataset.pgPageCount = pages;
        const pageButtons = slots().map((value) => typeof value === "number" ? `<button type="button" class="zc-pg-slot" data-pg-number="${value}" aria-label="\u7B2C${value}\u9875"${value === page ? ' aria-current="page"' : ""}>${value}</button>` : `<button type="button" class="zc-pg-slot" data-pg-skip="${value}" aria-label="${value === "prev" ? "\u5411\u524D" : "\u5411\u540E"}\u8DF3\u8FC75\u9875">${dots}</button>`).join("");
        const sizeOptions = pageSizes2.map((value) => `<button type="button" class="zc-pg-option" role="option" data-pg-size-option="${value}" aria-selected="${value === size}">${value}<span class="zc-pg-unit">\u6761/\u9875</span></button>`).join("");
        widget.innerHTML = `
        <span class="zc-pg-count"><span>\u5171</span><strong>${total}</strong><span class="zc-pg-unit">\u6761</span></span>
        <div class="zc-pg-controls">
          <div class="zc-pg-pages">
            <button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="prev" aria-label="\u4E0A\u4E00\u9875"${page === 1 ? " disabled" : ""}>${arrow("prev")}</button>
            ${pageButtons}
            <button type="button" class="zc-pg-slot zc-pg-arrow" data-pg-direction="next" aria-label="\u4E0B\u4E00\u9875"${page === pages ? " disabled" : ""}>${arrow("next")}</button>
          </div>
          <div class="zc-pg-size">
            <button type="button" class="zc-pg-size-trigger" aria-label="\u6BCF\u9875\u6761\u6570" aria-haspopup="listbox" aria-expanded="${open}"><span class="zc-pg-size-label">${size}<span class="zc-pg-unit">\u6761/\u9875</span></span>${down}</button>
            <div class="zc-pg-menu" role="listbox" aria-label="\u6BCF\u9875\u6761\u6570\u9009\u9879"${open ? "" : " hidden"}>${sizeOptions}</div>
          </div>
          ${module ? "" : `<label class="zc-pg-jump"><span>\u8DF3\u81F3</span><span class="zc-pg-jump-field"><input aria-label="\u8DF3\u81F3\u9875\u7801" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="9" autocomplete="off" value="${lastJump}"><span class="zc-pg-unit">\u9875</span></span></label>`}
        </div>
        <span class="zc-pg-live-status" role="status" aria-live="polite">\u7B2C${page}\u9875\uFF0C\u5171${pages}\u9875\uFF0C\u6BCF\u9875${size}\u6761</span>`;
        if (open) placeMenu();
        if (focus) widget.querySelector(focus)?.focus({ preventScroll: true });
      } finally {
        rendering = false;
      }
    }
    function placeMenu() {
      if (!open) return;
      const trigger = widget.querySelector(".zc-pg-size-trigger");
      const menu = widget.querySelector(".zc-pg-menu");
      const box = trigger.getBoundingClientRect();
      if (!box.width || box.bottom < 0 || box.top > window.innerHeight) {
        close(false);
        return;
      }
      menu.style.minWidth = `${box.width}px`;
      const bounds = menu.getBoundingClientRect();
      const left = Math.max(8, Math.min(box.right - bounds.width, window.innerWidth - bounds.width - 8));
      let top = box.bottom + 6;
      if (top + bounds.height > window.innerHeight - 8 && box.top - bounds.height - 6 >= 8) {
        top = box.top - bounds.height - 6;
      }
      top = Math.max(8, Math.min(top, window.innerHeight - bounds.height - 8));
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
    }
    function changePage(next, focus) {
      page = Math.max(1, Math.min(pages, next));
      open = false;
      render(focus);
      widget.dispatchEvent(new CustomEvent("paginationchange", {
        bubbles: true,
        detail: { page, pageSize: size, total, pageCount: pages }
      }));
    }
    function close(focus) {
      if (!open) return;
      open = false;
      render(focus ? ".zc-pg-size-trigger" : void 0);
    }
    function jump(input, focus) {
      const value = Number(input.value);
      if (!input.value.trim() || !Number.isFinite(value)) {
        input.value = lastJump;
        return;
      }
      lastJump = String(Math.max(1, Math.min(pages, Math.trunc(value))));
      input.value = lastJump;
      changePage(Number(lastJump), focus ? ".zc-pg-jump input" : void 0);
    }
    widget.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button.disabled) return;
      if (button.hasAttribute("data-pg-number")) {
        const next = Number(button.dataset.pgNumber);
        changePage(next, `[data-pg-number="${next}"]`);
      } else if (button.hasAttribute("data-pg-direction")) {
        const next = page + (button.dataset.pgDirection === "prev" ? -1 : 1);
        changePage(next, `[data-pg-number="${next}"]`);
      } else if (button.hasAttribute("data-pg-skip")) {
        changePage(page + (button.dataset.pgSkip === "prev" ? -5 : 5));
      } else if (button.classList.contains("zc-pg-size-trigger")) {
        open = !open;
        render(open ? `[data-pg-size-option="${size}"]` : ".zc-pg-size-trigger");
      } else if (button.hasAttribute("data-pg-size-option")) {
        size = Number(button.dataset.pgSizeOption);
        pages = Math.max(1, Math.ceil(total / size));
        lastJump = "";
        changePage(1, ".zc-pg-size-trigger");
      }
    }, { signal });
    widget.addEventListener("input", (event) => {
      if (event.target.matches(".zc-pg-jump input")) event.target.value = event.target.value.replace(/\D/g, "");
    }, { signal });
    widget.addEventListener("keydown", (event) => {
      const jumpField = event.target.matches(".zc-pg-jump input");
      if (event.key === "Escape") {
        if (open) {
          event.preventDefault();
          close(true);
        } else if (jumpField) event.target.value = lastJump;
        return;
      }
      if (jumpField && event.key === "Enter") {
        event.preventDefault();
        jump(event.target, true);
        return;
      }
      if (!event.target.closest(".zc-pg-size") || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (!open) {
        open = true;
        render(`[data-pg-size-option="${size}"]`);
        return;
      }
      const options = Array.from(widget.querySelectorAll(".zc-pg-option"));
      const index = options.indexOf(document.activeElement);
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : Math.max(0, Math.min(options.length - 1, index + step));
      options[next]?.focus();
    }, { signal });
    widget.addEventListener("focusout", (event) => {
      if (rendering || widget.contains(event.relatedTarget)) return;
      if (event.target.matches(".zc-pg-jump input")) jump(event.target, false);
      close(false);
    }, { signal });
    document.addEventListener("pointerdown", (event) => {
      if (!widget.contains(event.target)) close(false);
    }, { signal });
    window.addEventListener("resize", placeMenu, { signal });
    window.addEventListener("scroll", placeMenu, { capture: true, signal });
    document.addEventListener("keydown", (event) => {
      if (open && (event.key === "Escape" || event.key === "Esc" || event.code === "Escape" || event.keyCode === 27)) {
        event.preventDefault();
        close(true);
      }
    }, { capture: true, signal });
    render();
    return () => {
      controller.abort();
      delete widget.dataset.pgMounted;
    };
  }

  // dist/company-detail-lists.js?v=20261123-holdings
  var fundTypeOptions2 = fundCategories.flatMap(([, types2]) => types2);
  var fundListDefaults2 = {
    fundStatus: "running",
    fundTypes: fundTypeOptions2,
    fundBranch: fundCategories[0][0],
    fundMenuOpen: false,
    masterOnly: false,
    fundPage: 1,
    fundPageSize: 10,
    fundSort: "rating3",
    fundSortDirection: "desc"
  };
  function sortListRows2(a, b, key, direction) {
    const left = a[key];
    const right = b[key];
    if (left == null || right == null) return Number(left == null) - Number(right == null);
    const comparison = key === "rank" ? Number(left.split("/")[0]) - Number(right.split("/")[0]) : typeof left === "number" ? left - right : left.localeCompare(right, "zh-CN", { numeric: true });
    return direction === "asc" ? comparison : -comparison;
  }
  function listPage2(length, requestedPage, pageSize) {
    const pageCount = Math.max(1, Math.ceil(length / pageSize));
    const page = Math.min(pageCount, Math.max(1, requestedPage));
    return { pageCount, page, start: (page - 1) * pageSize };
  }
  function fundChevron2() {
    return '<svg class="company-fund-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function listPageNumbers2(page, last) {
    if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, null, last];
    if (page >= last - 3) return [1, null, last - 4, last - 3, last - 2, last - 1, last];
    return [1, null, page - 1, page, page + 1, null, last];
  }
  function listPagination2(title, page, last, total, pageSize, pageSizeControl) {
    return `<nav class="company-fund-pagination" aria-label="${title}\u5206\u9875">
    <div class="company-fund-total" aria-live="polite">\u5171 <b>${total}</b> \u6761</div>
    <div class="company-fund-page-controls">
      <div class="company-fund-pages">
        <button type="button" class="company-fund-page" data-company-list-page="${page - 1}" data-company-list-page-step="prev" aria-label="\u4E0A\u4E00\u9875"${page === 1 ? " disabled" : ""}>${fundChevron2()}</button>
        ${listPageNumbers2(page, last).map((number2) => number2 == null ? '<span class="company-fund-page" aria-hidden="true">\u2026</span>' : `<button type="button" class="company-fund-page" data-company-list-page="${number2}" aria-label="\u7B2C ${number2} \u9875"${number2 === page ? ' aria-current="page"' : ""}>${number2}</button>`).join("")}
        <button type="button" class="company-fund-page" data-company-list-page="${page + 1}" data-company-list-page-step="next" aria-label="\u4E0B\u4E00\u9875"${page === last ? " disabled" : ""}>${fundChevron2()}</button>
      </div>
      <label class="company-fund-page-size"><select data-company-control="${pageSizeControl}" aria-label="\u6BCF\u9875\u6761\u6570">${[5, 10, 20, 50].map((size) => `<option value="${size}"${size === pageSize ? " selected" : ""}>${size}\u6761/\u9875</option>`).join("")}</select></label>
      <form class="company-fund-jump" data-company-list-jump><label for="company-list-page-input">\u8DF3\u81F3</label>
        <input id="company-list-page-input" type="number" inputmode="numeric" min="1" max="${last}" step="1" required aria-label="\u8DF3\u81F3\u9875\u7801"> \u9875
      </form>
    </div>
  </nav>`;
  }
  function listTable2({ title, tableClass, columns: columns3, sort, sortDirection, rows: rows3, empty }) {
    return `<div class="company-table-scroll" tabindex="0" role="region" aria-label="${title}\u6570\u636E\u8868">
    <table class="company-table company-table--wide company-list-table ${tableClass}">
      <thead><tr><th scope="col" class="company-fund-seq">\u5E8F\u53F7</th>
        ${columns3.map(([key, label]) => {
      const direction = key === sort ? sortDirection : "";
      return `<th scope="col"${direction ? ` aria-sort="${direction === "asc" ? "ascending" : "descending"}"` : ""}>
            <button type="button" class="company-fund-sort" data-company-list-sort="${key}">${label}<span class="company-fund-sort-icon${direction ? ` is-${direction}` : ""}" aria-hidden="true"></span></button>
          </th>`;
    }).join("")}
      </tr></thead>
      <tbody>${rows3 || `<tr><td colspan="${columns3.length + 1}" class="company-empty">${empty}</td></tr>`}</tbody>
    </table>
  </div>`;
  }

  // dist/company-holdings-data.js?v=20261123-holdings
  var assetCategories = [
    "\u503A\u5238",
    "\u80A1\u7968",
    "\u94F6\u884C\u5B58\u6B3E",
    "\u4E70\u5165\u8FD4\u552E\u91D1\u878D\u8D44\u4EA7",
    "\u5176\u4ED6\u8D44\u4EA7",
    "\u57FA\u91D1",
    "\u8D44\u4EA7\u652F\u6301\u8BC1\u5238"
  ];
  var assetSnapshots = [
    ["2024-03-31", [56.31, 27.14, 10.28, 5.2, 0.9, 0.14, 0.03]],
    ["2024-06-30", [57.6, 25.9, 9.74, 5.63, 0.97, 0.14, 0.02]],
    ["2024-09-30", [59.2, 25.7, 10.06, 4.03, 0.85, 0.13, 0.03]],
    ["2024-12-31", [58.32, 26.24, 9.6, 4.83, 0.85, 0.13, 0.03]],
    ["2025-03-31", [60.9, 24.8, 9.08, 4.22, 0.86, 0.12, 0.02]],
    ["2025-06-30", [59.87, 25.16, 10.4, 3.51, 0.92, 0.12, 0.02]],
    ["2025-09-30", [61.41, 24.68, 9.85, 3, 0.93, 0.11, 0.02]],
    ["2025-12-31", [62.35, 26.42, 8.13, 2.1, 0.87, 0.11, 0.02]],
    ["2026-03-31", [67.42, 24.35, 4.46, 2.77, 0.87, 0.11, 0.02]],
    // Keep the underlying precision so the displayed ratios and changes both
    // round to the reference values without making the stacked series exceed 100%.
    ["2026-06-30", [65.438, 23.665, 7.817, 1.928, 1.037, 0.097, 0.018]],
    ["2026-09-30", [65.469, 22.329, 7.149, 4.089, 0.849, 0.099, 0.016]]
  ];
  var assetHistory = assetSnapshots.map(([date, values]) => ({ date, values }));
  var industryBreakdown = [
    ["\u7535\u5B50", 7.65],
    ["\u533B\u836F\u751F\u7269", 2.43],
    ["\u901A\u4FE1", 2.28],
    ["\u98DF\u54C1\u996E\u6599", 1.65],
    ["\u7535\u529B\u8BBE\u5907", 1.49],
    ["\u77F3\u6CB9\u77F3\u5316", 1.33],
    ["\u6709\u8272\u91D1\u5C5E", 1.16],
    ["\u94F6\u884C", 1.14],
    ["\u673A\u68B0\u8BBE\u5907", 1.14],
    ["\u5EFA\u7B51\u6750\u6599", 0.94],
    ["\u5BB6\u7528\u7535\u5668", 0.82],
    ["\u6C7D\u8F66", 0.72],
    ["\u7164\u70AD", 0.6],
    ["\u57FA\u7840\u5316\u5DE5", 0.54],
    ["\u623F\u5730\u4EA7", 0.47],
    ["\u4F20\u5A92", 0.43],
    ["\u8F7B\u5DE5\u5236\u9020", 0.36],
    ["\u975E\u94F6\u91D1\u878D", 0.3],
    ["\u8BA1\u7B97\u673A", 0.26],
    ["\u516C\u7528\u4E8B\u4E1A", 0.24],
    ["\u94A2\u94C1", 0.19],
    ["\u519C\u6797\u7267\u6E14", 0.17],
    ["\u56FD\u9632\u519B\u5DE5", 0.16],
    ["\u7EBA\u7EC7\u670D\u9970", 0.14],
    ["\u5546\u8D38\u96F6\u552E", 0.1],
    ["\u5EFA\u7B51\u88C5\u9970", 0.1],
    ["\u4EA4\u901A\u8FD0\u8F93", 0.07],
    ["\u73AF\u4FDD", 0.06],
    ["\u7F8E\u5BB9\u62A4\u7406", 0.05],
    ["\u793E\u4F1A\u670D\u52A1", 0.03],
    ["\u7EFC\u5408", 0.02]
  ];
  var industryCategories = industryBreakdown.map(([name]) => name);
  var finalIndustryWeights = industryBreakdown.map(([, weight]) => weight);
  var industryPeriods = [
    // date, total weight, visible anchor industries in industryBreakdown order
    ["2023-12-31", 21.24, [1.25, 4.12, 0.59, 2.27, 2.34, 0.85], { \u519C\u6797\u7267\u6E14: 0.42 }],
    ["2024-06-30", 17.67, [1.29, 2.63, 0.73, 1.87, 1.56, 0.76]],
    ["2024-12-31", 17.81, [1.18, 2.58, 0.79, 1.76, 1.55, 0.79]],
    ["2025-06-30", 19.08, [1.91, 2.76, 0.92, 1.79, 1.53, 0.83]],
    ["2025-12-31", 28.84, [4.18, 4.96, 1.43, 2.84, 2.25, 1.26]]
  ];
  var rounded = (value) => Math.round(value * 100) / 100;
  var sum = (values) => values.reduce((total, value) => total + value, 0);
  var industryHistory = [
    ...industryPeriods.map(([date, total, leading, reference = {}]) => {
      const remainder = industryBreakdown.slice(leading.length);
      const simulatedWeights = remainder.filter(([name]) => !Object.hasOwn(reference, name)).map(([, weight]) => weight);
      const scale = (total - sum(leading) - sum(Object.values(reference))) / sum(simulatedWeights);
      return { date, values: [...leading, ...remainder.map(([name, weight]) => reference[name] ?? rounded(weight * scale))] };
    }),
    { date: "2026-06-30", values: finalIndustryWeights }
  ];
  var stockReportDates = industryHistory.map(({ date }) => date).reverse();
  var referenceStockRows = [
    ["000001", "\u5E73\u5B89\u94F6\u884C", 12.36, 0, "\u51CF\u6301", 9.32, 5.45, "\u94F6\u884C"],
    ["000032", "\u6DF1\u6851\u8FBEA", 30.94, 0, "\u65B0\u8FDB", -48.04, -123.41, "\u5EFA\u7B51\u88C5\u9970"],
    ["000034", "\u795E\u5DDE\u6570\u7801", 66.6, 0, "\u589E\u6301", -37.81, 30.17, "\u8BA1\u7B97\u673A"],
    ["000035", "\u4E2D\u56FD\u5929\u6979", 2.51, 0, "\u65B0\u8FDB", -33.03, 37.09, "\u73AF\u4FDD"],
    ["000039", "\u4E2D\u96C6\u96C6\u56E2", 183.04, 0.01, "\u589E\u6301", 4.82, 470.13, "\u673A\u68B0\u8BBE\u5907"],
    ["000050", "\u6DF1\u5929\u9A6CA", 156.28, 0, "\u51CF\u6301", -42.34, -9.03, "\u7535\u5B50"],
    ["000060", "\u4E2D\u91D1\u5CAD\u5357", 105.22, 0, "\u589E\u6301", -12.47, 15.23, "\u6709\u8272\u91D1\u5C5E"],
    ["000063", "\u4E2D\u5174\u901A\u8BAF", 1165.69, 0.03, "\u51CF\u6301", -32.25, 28.88, "\u901A\u4FE1"],
    ["000100", "TCL\u79D1\u6280", 2059.87, 0.06, "\u589E\u6301", 19.24, 16.32, "\u7535\u5B50"],
    ["00013", "\u548C\u9EC4\u533B\u836F", 1206.02, 0.04, "\u589E\u6301", -8.24, null, "\u533B\u836F\u751F\u7269"]
  ];
  var changes = ["\u589E\u6301", "\u51CF\u6301", "\u65B0\u8FDB", "\u6301\u5E73"];
  var referenceStocks = referenceStockRows.map(([code, name, value, weight, change, return1y, pe, industry]) => ({ code, name, value, weight, change, return1y, pe, industry }));
  function getStockHoldings(date = stockReportDates[0]) {
    const period = Math.max(0, stockReportDates.indexOf(date));
    const reference = referenceStocks.map((stock, index) => {
      if (!period) return { ...stock };
      const value = rounded(stock.value * (1 + ((index + period) % 5 - 2) * 0.065 * period));
      return {
        ...stock,
        value,
        weight: rounded(value / 35e3),
        change: changes[(index + period) % changes.length],
        return1y: rounded(stock.return1y + ((index + period) % 7 - 2) * period * 1.29),
        pe: stock.pe == null ? null : rounded(stock.pe * (1 + (index % 3 - 1) * period * 0.03))
      };
    });
    const examples = Array.from({ length: 30 }, (_, index) => {
      const industry = industryCategories[index * 7 % industryCategories.length];
      const value = rounded(20 + (index * 681.43 + period * 97.43) % 1800);
      return {
        code: String(990001 + index),
        name: `\u793A\u4F8B\u80A1\u7968${String(index + 1).padStart(2, "0")}`,
        value,
        weight: rounded(value / 35e3),
        change: changes[(index + period) % changes.length],
        return1y: rounded((index * 7.28 + period * 9.44) % 100 - 45),
        pe: index % 13 === 0 ? null : rounded(7.04 + (index * 4.28 + period * 2.01) % 42),
        industry
      };
    });
    return [...reference, ...examples];
  }

  // dist/company-holdings.js?v=20261124-asset-years
  var companyOnlyAssetColors = { \u4E70\u5165\u8FD4\u552E\u91D1\u878D\u8D44\u4EA7: "#63A6A6", \u8D44\u4EA7\u652F\u6301\u8BC1\u5238: "#A69B63" };
  var industryColors = {
    \u94F6\u884C: "#D36FAA",
    \u975E\u94F6\u91D1\u878D: "#E387A2",
    \u623F\u5730\u4EA7: "#F2A2A1",
    \u98DF\u54C1\u996E\u6599: "#F28098",
    \u5BB6\u7528\u7535\u5668: "#F2858E",
    \u519C\u6797\u7267\u6E14: "#F28F8A",
    \u5546\u8D38\u96F6\u552E: "#F2A18E",
    \u793E\u4F1A\u670D\u52A1: "#F2B293",
    \u8F7B\u5DE5\u5236\u9020: "#F2C198",
    \u7EBA\u7EC7\u670D\u9970: "#F2CF9D",
    \u7F8E\u5BB9\u62A4\u7406: "#F2DCA2",
    \u533B\u836F\u751F\u7269: "#E3CC88",
    \u516C\u7528\u4E8B\u4E1A: "#AFB987",
    \u5EFA\u7B51\u88C5\u9970: "#AEBD8D",
    \u6709\u8272\u91D1\u5C5E: "#ADC193",
    \u7164\u70AD: "#ADC59A",
    \u57FA\u7840\u5316\u5DE5: "#AEC9A0",
    \u77F3\u6CB9\u77F3\u5316: "#AFCDA7",
    \u94A2\u94C1: "#AED0AB",
    \u5EFA\u7B51\u6750\u6599: "#AED4AF",
    \u4EA4\u901A\u8FD0\u8F93: "#B1D8B7",
    \u673A\u68B0\u8BBE\u5907: "#7EBAA2",
    \u6C7D\u8F66: "#88C1B3",
    \u56FD\u9632\u519B\u5DE5: "#91C7C2",
    \u7EFC\u5408: "#9CC9CD",
    \u7535\u529B\u8BBE\u5907: "#A6C8D3",
    \u73AF\u4FDD: "#B1C9D9",
    \u4F20\u5A92: "#91A1C7",
    \u901A\u4FE1: "#A2A5D2",
    \u8BA1\u7B97\u673A: "#BBB4DC",
    \u7535\u5B50: "#CCBDE6"
  };
  var breakdowns = {
    assets: {
      title: "\u5927\u7C7B\u8D44\u4EA7\u5206\u5E03",
      categoryLabel: "\u8D44\u4EA7",
      history: assetHistory,
      periods: [1, 2, 3, 5].map((years) => [String(years), `\u8FD1${years}\u5E74`, 12 * years]),
      dateKey: "holdingAssetDate",
      periodKey: "holdingAssetPeriod",
      rangeKey: "holdingAssetRange",
      defaultPeriod: "1"
    },
    industry: {
      title: "\u80A1\u7968\u884C\u4E1A\u5206\u5E03",
      categoryLabel: "\u7533\u4E07\u4E00\u7EA7\u884C\u4E1A",
      history: industryHistory,
      periods: [2, 3, 5].map((years) => [String(years), `\u8FD1${years}\u5E74`, 12 * years]),
      dateKey: "holdingIndustryDate",
      periodKey: "holdingIndustryPeriod",
      rangeKey: "holdingIndustryRange",
      defaultPeriod: "3"
    }
  };
  var stockTitle = "\u80A1\u7968\u6301\u4ED3\u8BE6\u60C5";
  var stockColumns = [
    ["code", "\u80A1\u7968\u4EE3\u7801"],
    ["name", "\u80A1\u7968\u540D\u79F0"],
    ["value", "\u6301\u4ED3\u5E02\u503C"],
    ["weight", "\u6301\u4ED3\u5360\u6BD4"],
    ["change", "\u8F83\u4E0A\u671F\u53D8\u5316"],
    ["return1y", "\u8FD11\u5E74\u6DA8\u8DCC\u5E45"],
    ["pe", "PE"],
    ["industry", "\u884C\u4E1A"]
  ];
  var holdingDefaults = {
    holdingAssetDate: assetHistory.at(-1).date,
    holdingAssetPeriod: breakdowns.assets.defaultPeriod,
    holdingAssetRange: null,
    holdingIndustryDate: industryHistory.at(-1).date,
    holdingIndustryPeriod: "3",
    holdingIndustryRange: null,
    holdingIndustryScope: "all",
    holdingStockDate: stockReportDates[0],
    holdingPage: 1,
    holdingPageSize: 10,
    holdingSort: "",
    holdingSortDirection: "asc"
  };
  function presetRange({ history, periods: periods2, defaultPeriod }, period) {
    const end = history.at(-1).date;
    const [year, month] = end.split("-").map(Number);
    const [, , months] = periods2.find(([key]) => key === period) ?? periods2.find(([key]) => key === defaultPeriod);
    const start = new Date(Date.UTC(year, month - months, 0)).toISOString().slice(0, 10);
    return { start, end };
  }
  function breakdownRange(state2, breakdown) {
    const { periodKey, rangeKey } = breakdown;
    const period = state2[periodKey];
    if (period === "custom" && state2[rangeKey]) return state2[rangeKey];
    return presetRange(breakdown, period);
  }
  function holdingTimeOptions(key) {
    const { history } = breakdowns[key];
    const end = history.at(-1).date;
    return { min: history[0].date, max: end, end };
  }
  function holdingRangeControl(key, { start, end }) {
    const { periodKey, rangeKey, defaultPeriod } = breakdowns[key];
    const manual = start && end;
    return {
      periodKey,
      rangeKey,
      period: manual ? "custom" : defaultPeriod,
      range: manual ? { start, end } : null
    };
  }
  function assetConfig(state2) {
    const index = assetHistory.findIndex((point) => point.date === state2.holdingAssetDate);
    const current = assetHistory[index];
    const previous = assetHistory[index - 1];
    const range2 = breakdownRange(state2, breakdowns.assets);
    const { assetColors } = window.CompareAllocationView;
    const colors = assetCategories.map((category) => assetColors[category === "\u503A\u5238" ? "\u56FA\u5B9A\u6536\u76CA" : category] ?? companyOnlyAssetColors[category]);
    return {
      date: current.date,
      categories: assetCategories,
      colors,
      values: current.values,
      changes: current.values.map((value, i) => previous ? value - previous.values[i] : null),
      history: assetHistory.filter((point) => point.date >= range2.start && point.date <= range2.end),
      range: range2
    };
  }
  function industryConfig(state2) {
    const current = industryHistory.find((point) => point.date === state2.holdingIndustryDate);
    const ranking2 = current.values.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value);
    const selected = state2.holdingIndustryScope === "top10" ? ranking2.slice(0, 10) : ranking2;
    const categories = selected.map(({ index }) => industryCategories[index]);
    const range2 = breakdownRange(state2, breakdowns.industry);
    const history = industryHistory.filter((point) => point.date >= range2.start && point.date <= range2.end).map((point) => ({ date: point.date, values: selected.map(({ index }) => point.values[index]) }));
    return {
      date: current.date,
      categories,
      colors: categories.map((category) => industryColors[category]),
      values: selected.map(({ value }) => value),
      history,
      range: range2
    };
  }
  function holdingChartData(state2) {
    return { assets: assetConfig(state2), industry: industryConfig(state2) };
  }
  function escapeText2(text) {
    return String(text ?? "\u2014").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }
  function decimal(value, unit = "") {
    return value == null ? "\u2014" : value.toFixed(2) + unit;
  }
  function directionClass(value) {
    const displayed = value == null ? 0 : Number(value.toFixed(2));
    return displayed > 0 ? " is-rise" : displayed < 0 ? " is-fall" : "";
  }
  function assetTitle() {
    return `<span class="company-holdings-info zc-title-help">
    <span class="zc-title-help-label">\u5927\u7C7B\u8D44\u4EA7\u5206\u5E03</span>
    <button class="zc-title-help-trigger" type="button" aria-label="\u5927\u7C7B\u8D44\u4EA7\u5206\u5E03\u8BF4\u660E" aria-describedby="company-holding-asset-help">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor"/><path d="M5.9 5.8a2.1 2.1 0 0 1 4.2 0c0 1.4-2.1 1.5-2.1 3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11.5" r=".7" fill="currentColor"/></svg>
    </button>
    <span class="zc-title-help-panel" role="tooltip" id="company-holding-asset-help">\u6309\u62A5\u544A\u671F\u5C55\u793A\u65D7\u4E0B\u57FA\u91D1\u7684\u5927\u7C7B\u8D44\u4EA7\u5360\u6BD4\u53CA\u8F83\u4E0A\u4E00\u62A5\u544A\u671F\u7684\u53D8\u5316\u3002</span>
  </span>`;
  }
  function distributionTable(key, label, { categories, colors, values, changes: changes2 }) {
    return `<div class="company-holdings-breakdown" tabindex="0" role="region" aria-label="${label}\u5360\u6BD4\u660E\u7EC6">
    <table class="company-table company-holdings-breakdown-table">
      <thead><tr><th scope="col">${label}</th><th scope="col" class="num">${changes2 ? "\u5360\u603B\u8D44\u4EA7\u6BD4" : "\u5360\u6BD4"}</th>
        ${changes2 ? '<th scope="col" class="num">\u53D8\u52A8\u6BD4\u4F8B</th>' : ""}</tr></thead>
      <tbody>${categories.map((category, index) => `<tr data-holdings-row="${key}" data-holdings-index="${index}">
        <td title="${category}"><span class="company-type-dot" style="--company-type-color:${colors[index]}"></span>${category}</td>
        <td class="num">${decimal(values[index], "%")}</td>${changes2 ? `<td class="num${directionClass(changes2[index])}">${decimal(changes2[index], "%")}</td>` : ""}
      </tr>`).join("")}</tbody>
    </table>
  </div>`;
  }
  function holdingBreakdown(key, state2, config, { dropdown: dropdown2, actions: actions2 }) {
    const { title, categoryLabel, history, periods: periods2, dateKey, periodKey } = breakdowns[key];
    const assets = key === "assets";
    const dates = history.map(({ date }) => [date, date]).reverse();
    const scope = assets ? "" : dropdown2(
      "holdingIndustryScope",
      state2.holdingIndustryScope,
      [["all", "\u7533\u4E07\u4E00\u7EA7\u884C\u4E1A"], ["top10", "\u524D\u5341\u5927\u884C\u4E1A"]],
      { label: "\u5206\u5E03" }
    );
    const period = state2[periodKey];
    return `<section class="company-panel company-holdings-panel ${assets ? "company-holdings-asset" : "company-holdings-industry"}" aria-label="${title}">
    <div class="company-panel-head company-holdings-head">
      <h2>${assets ? assetTitle() : title}</h2>
      <div class="company-holdings-controls">${scope}${actions2(`holdings-${key}`)}</div>
    </div>
    <div class="company-holdings-split">
      <div class="company-holdings-summary">
        <div class="company-holdings-subhead">
          <h3>${assets ? title : categoryLabel + "\u5206\u5E03"}</h3>
          ${dropdown2(dateKey, state2[dateKey], dates, { label: "\u622A\u6B62\u65F6\u95F4" })}
        </div>
        <div class="company-holdings-snapshot">
          <div class="company-holdings-donut" data-holdings-chart="${key}-current" role="img" aria-label="${title}\u73AF\u5F62\u56FE"></div>
          ${distributionTable(key, categoryLabel, config)}
        </div>
      </div>
      <div class="company-holdings-trend">
        <div class="company-holdings-subhead">
          <h3>${assets ? title + "\u53D8\u5316" : categoryLabel + "\u5206\u5E03\u53D8\u5316"}</h3>
          <div class="company-holdings-controls company-holdings-period-controls">
            <div class="linked-time-widget lt-bar company-holdings-shortcuts" role="group" aria-label="\u5FEB\u6377\u65F6\u6BB5">
              ${periods2.map(([value, label]) => `<button type="button" data-company-choice="${periodKey}" data-value="${value}"
                aria-pressed="${value === period}"${value === period ? ' class="is-selected"' : ""}>${label}</button>`).join("")}
            </div>
            <div class="linked-time-widget company-holdings-dates" data-linked-time data-holdings-range="${key}"
              data-shortcuts="false" data-lt-state="committed" data-lt-start="${config.range.start}" data-lt-end="${config.range.end}"></div>
          </div>
        </div>
        <div class="company-holdings-area" data-holdings-chart="${key}-trend" role="img" aria-label="${title}\u53D8\u5316\u5806\u53E0\u9762\u79EF\u56FE"></div>
      </div>
    </div>
  </section>`;
  }
  function holdingListSnapshot(state2) {
    const records = getStockHoldings(state2.holdingStockDate);
    if (state2.holdingSort) records.sort((a, b) => sortListRows2(a, b, state2.holdingSort, state2.holdingSortDirection));
    return { records, ...listPage2(records.length, state2.holdingPage, state2.holdingPageSize) };
  }
  function holdingListCsv(state2) {
    return [
      ["\u5E8F\u53F7", ...stockColumns.map(([, label]) => label)],
      ...holdingListSnapshot(state2).records.map((row, i) => [
        i + 1,
        row.code,
        row.name,
        decimal(row.value, "\u4E07"),
        decimal(row.weight, "%"),
        row.change,
        decimal(row.return1y, "%"),
        decimal(row.pe),
        row.industry
      ])
    ];
  }
  function renderHoldingStock(state2, { dropdown: dropdown2, actions: actions2 }) {
    const { records, start, page, pageCount } = holdingListSnapshot(state2);
    const rows3 = records.slice(start, start + state2.holdingPageSize).map((row, index) => `<tr>
    <td class="company-fund-seq">${start + index + 1}</td><td class="num">${escapeText2(row.code)}</td><td>${escapeText2(row.name)}</td>
    <td class="num">${decimal(row.value, "\u4E07")}</td><td class="num">${decimal(row.weight, "%")}</td>
    <td class="${row.change === "\u51CF\u6301" ? "is-fall" : ["\u589E\u6301", "\u65B0\u8FDB"].includes(row.change) ? "is-rise" : ""}">${escapeText2(row.change)}</td>
    <td class="num${directionClass(row.return1y)}">${decimal(row.return1y, "%")}</td><td class="num">${decimal(row.pe)}</td><td>${escapeText2(row.industry)}</td>
  </tr>`).join("");
    return `<section class="company-panel company-holdings-panel company-holdings-stock" aria-label="${stockTitle}">
    <div class="company-panel-head company-holdings-head">
      <h2>${stockTitle}</h2>
      <div class="company-holdings-controls">${dropdown2(
      "holdingStockDate",
      state2.holdingStockDate,
      stockReportDates.map((date) => [date, date]),
      { label: "\u62A5\u544A\u671F" }
    )}${actions2("holdings-stock")}</div>
    </div>
    ${listTable2({
      title: stockTitle,
      tableClass: "company-holdings-table",
      columns: stockColumns,
      sort: state2.holdingSort,
      sortDirection: state2.holdingSortDirection,
      rows: rows3,
      empty: "\u5F53\u524D\u62A5\u544A\u671F\u6682\u65E0\u80A1\u7968\u6301\u4ED3\u3002"
    })}
    ${listPagination2(stockTitle, page, pageCount, records.length, state2.holdingPageSize, "holdingPageSize")}
  </section>`;
  }
  function renderCompanyHoldings(state2, data, components) {
    return holdingBreakdown("assets", state2, data.assets, components) + holdingBreakdown("industry", state2, data.industry, components) + renderHoldingStock(state2, components);
  }

  // dist/company-holdings-charts.js?v=20261123-holdings-axis
  var labelFont2 = 'Roboto, "PingFang SC", sans-serif';
  var textColor2 = "#666";
  var dividerColor = "#eaeaea";
  var primary = "#6865a7";
  var labelStyle = { color: textColor2, fontSize: 12 };
  var ratio = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  var tooltip2 = {
    renderMode: "richText",
    confine: true,
    borderColor: dividerColor,
    textStyle: { ...labelStyle, fontFamily: labelFont2, color: "#333" }
  };
  function percent2(value) {
    return Number.isFinite(value) ? ratio.format(value) + "%" : "\u2014";
  }
  function emptyChart2() {
    return {
      animation: false,
      title: {
        text: "\u6682\u65E0\u6570\u636E",
        left: "center",
        top: "middle",
        textStyle: { ...labelStyle, fontFamily: labelFont2, fontWeight: "normal" }
      }
    };
  }
  function donutChart({ categories, colors, values }) {
    if (!values.some((value) => Number.isFinite(value) && value > 0)) return emptyChart2();
    return {
      animation: false,
      textStyle: { fontFamily: labelFont2 },
      tooltip: { ...tooltip2, trigger: "item", valueFormatter: percent2 },
      series: [{
        name: "\u5360\u6BD4",
        type: "pie",
        center: ["50%", "50%"],
        radius: ["54%", "86%"],
        startAngle: 90,
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scaleSize: 4 },
        data: categories.map((name, index) => ({
          name,
          value: Number.isFinite(values[index]) && values[index] > 0 ? values[index] : 0,
          itemStyle: { color: colors[index] ?? primary }
        }))
      }]
    };
  }
  function legendLayout(categories, width, height, selected) {
    const itemGap = 12;
    const rowHeight = 24;
    let rows3 = 1;
    let occupied = 0;
    for (const label of categories) {
      const itemWidth = Math.min(width, Array.from(label).reduce(
        (pixels, char) => pixels + (char.charCodeAt(0) > 255 ? 12 : 7),
        16
      ));
      if (occupied && occupied + itemWidth + itemGap > width - 20) {
        rows3 += 1;
        occupied = 0;
      }
      occupied += itemWidth + itemGap;
    }
    const scroll = rows3 > 4 || height - rows3 * rowHeight < 195;
    return {
      legend: {
        type: scroll ? "scroll" : "plain",
        data: categories,
        selected,
        bottom: 0,
        left: 4,
        right: 4,
        icon: "roundRect",
        itemWidth: 10,
        itemHeight: 8,
        itemGap,
        textStyle: labelStyle,
        pageIconColor: primary,
        pageIconInactiveColor: "#cbcbcb",
        pageTextStyle: labelStyle
      },
      grid: {
        top: 16,
        right: 40,
        bottom: (scroll ? 1 : rows3) * rowHeight + 4,
        left: 3,
        containLabel: true
      }
    };
  }
  function trendChart({ categories, colors, history }, key, width, height) {
    if (!history.length) return emptyChart2();
    const isAsset = key === "assets";
    const industryMaximum = Math.max(...history.map(
      (row) => row.values.reduce((sum2, value) => sum2 + (Number.isFinite(value) ? value : 0), 0)
    ));
    const maximum = isAsset ? 100 : Math.max(30, Math.ceil(industryMaximum / 5) * 5);
    return {
      animation: false,
      textStyle: { fontFamily: labelFont2 },
      ...legendLayout(categories, width, height),
      tooltip: {
        ...tooltip2,
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "#b9b8d8", type: "dashed" } },
        formatter: (items) => {
          const values = items.filter((item) => Number.isFinite(item.value) && item.value > 0).sort((a, b) => b.value - a.value);
          const limit = 8;
          const labels = values.slice(0, limit).map(
            (item) => item.marker + item.seriesName + "  " + percent2(item.value)
          );
          if (values.length > limit) labels.push("\u53E6\u6709 " + (values.length - limit) + " \u7C7B");
          return [items[0]?.axisValueLabel, ...labels].filter(Boolean).join("\n");
        }
      },
      xAxis: {
        type: "category",
        data: history.map((row) => row.date),
        boundaryGap: history.length === 1,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: dividerColor } },
        axisLabel: {
          ...labelStyle,
          margin: 10,
          showMinLabel: true,
          showMaxLabel: true,
          hideOverlap: true
        }
      },
      yAxis: {
        type: "value",
        min: 0,
        max: maximum,
        ...isAsset ? { interval: 20 } : { splitNumber: 6 },
        axisLabel: { ...labelStyle, formatter: "{value}%" },
        splitLine: { lineStyle: { color: dividerColor, type: "dashed" } }
      },
      series: categories.map((name, index) => {
        const color = colors[index] ?? primary;
        return {
          name,
          type: "line",
          stack: key,
          data: history.map((row) => Number.isFinite(row.values[index]) ? row.values[index] : null),
          symbol: "circle",
          showSymbol: history.length === 1,
          symbolSize: 6,
          connectNulls: false,
          lineStyle: { color, width: 1 },
          itemStyle: { color },
          areaStyle: { color, opacity: 0.9 },
          emphasis: { focus: "series" }
        };
      })
    };
  }
  function mountHoldingCharts(root, config) {
    const echarts = globalThis.echarts;
    if (!root || !echarts) return () => {
    };
    const entries = ["assets", "industry"].flatMap(
      (key) => ["current", "trend"].map((view) => ({
        key,
        view,
        model: config[key],
        element: root.querySelector('[data-holdings-chart="' + key + "-" + view + '"]')
      }))
    ).filter((entry) => entry.element && entry.model);
    if (!entries.length) return () => {
    };
    function selectSlice(entry, index) {
      if (entry.hovered === index) return;
      if (entry.hovered != null) {
        entry.chart.dispatchAction({ type: "downplay", seriesIndex: 0, dataIndex: entry.hovered });
      }
      entry.hovered = index;
      config.onHover?.(entry.key, index);
    }
    function bindDonut(entry) {
      const isSlice = (params) => params?.seriesType === "pie" && Number.isInteger(params.dataIndex);
      entry.chart.on("mouseover", (params) => {
        if (isSlice(params)) selectSlice(entry, params.dataIndex);
      });
      entry.chart.on("mouseout", (params) => {
        if (isSlice(params) && entry.hovered === params.dataIndex) selectSlice(entry, null);
      });
      entry.chart.on("globalout", () => selectSlice(entry, null));
    }
    function syncChart(entry) {
      const width = entry.element.clientWidth;
      const height = entry.element.clientHeight;
      if (!width || !height || width === entry.width && height === entry.height) return;
      entry.width = width;
      entry.height = height;
      if (entry.chart && !entry.chart.isDisposed()) {
        entry.chart.resize();
        if (entry.view === "trend" && entry.model.history.length) {
          const selected = entry.chart.getOption().legend?.[0]?.selected;
          entry.chart.setOption(legendLayout(entry.model.categories, width, height, selected), {
            replaceMerge: ["legend"]
          });
        }
        return;
      }
      const isCurrent = entry.view === "current";
      entry.chart = echarts.getInstanceByDom(entry.element) ?? echarts.init(entry.element, null, { renderer: "canvas" });
      entry.chart.setOption(isCurrent ? donutChart(entry.model) : trendChart(entry.model, entry.key, width, height), { notMerge: true });
      if (isCurrent) bindDonut(entry);
    }
    function hoverTableRow(event) {
      const row = event.target.closest?.("[data-holdings-row][data-holdings-index]");
      if (!row || row.contains(event.relatedTarget)) return;
      const entry = entries.find((item) => item.key === row.dataset.holdingsRow && item.view === "current");
      if (!entry?.chart || entry.chart.isDisposed()) return;
      const index = Number(row.dataset.holdingsIndex);
      if (!Number.isInteger(index) || index < 0 || index >= entry.model.categories.length) return;
      const over = event.type === "mouseover" || event.type === "focusin";
      if (over) {
        selectSlice(entry, index);
        entry.chart.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: index });
      } else if (entry.hovered === index) {
        selectSlice(entry, null);
      }
    }
    const syncCharts = () => entries.forEach(syncChart);
    syncCharts();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(syncCharts) : null;
    if (observer) entries.forEach((entry) => observer.observe(entry.element));
    else window.addEventListener("resize", syncCharts);
    const hoverEvents = ["mouseover", "mouseout", "focusin", "focusout"];
    hoverEvents.forEach((event) => root.addEventListener(event, hoverTableRow));
    return () => {
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", syncCharts);
      hoverEvents.forEach((event) => root.removeEventListener(event, hoverTableRow));
      entries.forEach((entry) => {
        if (entry.chart && !entry.chart.isDisposed()) entry.chart.dispose();
        if (entry.hovered != null) config.onHover?.(entry.key, null);
      });
    };
  }

  // dist/company-detail.js
  var tabs2 = [
    ["overview", "\u516C\u53F8\u6982\u89C8"],
    ["funds", "\u65D7\u4E0B\u57FA\u91D1"],
    ["managers", "\u5728\u804C\u7ECF\u7406"],
    ["holdings", "\u6301\u4ED3\u5206\u6790"]
  ];
  var scaleEnd = companyData.scale.at(-1).date;
  var scaleYear = Number(scaleEnd.slice(0, 4));
  var scaleShortcuts = [3, 5, 10].map((years) => ({
    key: String(years),
    label: `\u8FD1${years}\u5E74`,
    start: `${scaleYear - years + 1}-01-01`,
    end: scaleEnd
  }));
  var formatter = new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var assetRoot = "./assets/company-detail/";
  var stars = Array.from({ length: 5 }, (_, index) => index);
  var ratedFundHeaders = ["\u57FA\u91D1\u540D\u79F0", "\u57FA\u91D1\u661F\u7EA7", "\u8FD13\u5E74\u5E74\u5316\u6536\u76CA", "\u8FD13\u5E74\u6536\u76CA", "\u8FD13\u5E74\u6700\u5927\u56DE\u64A4", "\u7533\u8D4E\u72B6\u6001"];
  var ratedManagerHeaders = ["\u7ECF\u7406\u540D\u79F0", "\u4EE3\u8868\u57FA\u91D1", "\u7ECF\u7406\u661F\u7EA7", "\u8FD11\u5E74\u6536\u76CA\u7387", "\u8FD13\u5E74\u6536\u76CA\u7387", "\u4EFB\u671F\u6700\u5927\u56DE\u62A5\u7387", "\u4EFB\u671F\u6700\u5927\u56DE\u64A4\u7387"];
  var managerMetricKeys = ["return1y", "return3y", "maxReturn", "drawdown"];
  var defaults = {
    ...fundListDefaults,
    ...managerListDefaults,
    ...holdingDefaults,
    scaleType: "all",
    scaleYears: "5",
    ratingMode: "fund",
    ratingType: "all",
    rating: "5"
  };
  var listTypes = { funds: "fund", managers: "manager", holdings: "holding" };
  var holdingChartTitles = { "holdings-assets": "\u5927\u7C7B\u8D44\u4EA7\u5206\u5E03", "holdings-industry": "\u80A1\u7968\u884C\u4E1A\u5206\u5E03" };
  function escapeHtml5(value) {
    return String(value ?? "\u2014").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function icon(name) {
    return `<img class="company-icon" src="${assetRoot}${name}.svg" alt="" aria-hidden="true">`;
  }
  function amount2(value) {
    return typeof value === "number" ? formatter.format(value) : value ?? "\u2014";
  }
  function percent3(value) {
    return typeof value === "number" ? `${value.toFixed(2)}%` : value ?? "\u2014";
  }
  function signClass(value) {
    const numeric = Number(String(value).replace(/[%,]/g, "").replace("\u2212", "-"));
    return numeric > 0 ? "is-rise" : numeric < 0 ? "is-fall" : "";
  }
  function ratingKey(rating2) {
    return rating2 == null ? "unrated" : String(rating2);
  }
  function ratingGrade(key) {
    return key === "unrated" ? "\u6682\u65E0\u661F\u7EA7" : `${key}\u661F`;
  }
  function ratingLabel(state2) {
    const grade = state2.rating === "all" ? "\u5168\u90E8" : ratingGrade(state2.rating);
    return state2.ratingMode === "manager" ? `${grade}\u57FA\u91D1\u7ECF\u7406` : `${grade}\u57FA\u91D1`;
  }
  function ratingDistribution(state2) {
    if (state2.ratingMode !== "manager") return companyData.ratings;
    if (state2.ratingType === "all") return companyData.managerRatings;
    const managers = managerRatingExamples.filter((manager) => manager.fundType === state2.ratingType);
    return companyData.managerRatings.map(({ rating: rating2 }) => {
      const exampleCount = managers.filter((manager) => manager.rating === rating2).length;
      return { rating: rating2, exampleCount, percent: managers.length ? Math.round(exampleCount * 100 / managers.length) : 0 };
    });
  }
  function readFavorite(favoriteKey) {
    try {
      return localStorage.getItem(favoriteKey) === "1";
    } catch {
      return false;
    }
  }
  function rank(value) {
    const [position, total] = String(value ?? "").split("/").map((part) => part.trim());
    return total ? `${escapeHtml5(position)} <span class="company-quiet">/ ${escapeHtml5(total)}</span>` : escapeHtml5(value);
  }
  function dropdown(key, selected, choices, { label, asHeading = false, value = choices.find(([id]) => id === selected)?.[1] }) {
    const menuId = `company-${key}-menu`;
    return `<div class="company-dropdown zc-allocation-select${asHeading ? " company-dropdown--heading" : ""}">
    <button type="button" class="zc-allocation-select-trigger" data-company-dropdown="${key}" aria-label="${escapeHtml5(`${label} ${value}`)}"
      aria-controls="${menuId}" aria-expanded="false" aria-haspopup="listbox">
      ${asHeading ? "" : `<span class="zc-allocation-select-label">${escapeHtml5(label)}</span>`}
      <span class="zc-allocation-select-value">${escapeHtml5(value)}</span>${icon(asHeading ? "rating-chevron" : "chevron")}
    </button>
    <div class="zc-allocation-select-menu" id="${menuId}" role="listbox" aria-label="${escapeHtml5(label)}" hidden>
      ${choices.map(([id, name]) => `<button type="button" role="option" tabindex="-1" data-company-choice="${key}"
        data-value="${escapeHtml5(id)}" aria-selected="${id === selected}"><span>${escapeHtml5(name)}</span>${id === selected ? icon("check") : ""}</button>`).join("")}
    </div>
  </div>`;
  }
  function typeControl(key, selected) {
    return dropdown(key, selected, [["all", "\u5168\u90E8"], ...companyData.products.map(({ label }) => [label, label])], { label: "\u57FA\u91D1\u7C7B\u578B" });
  }
  function actions(module) {
    const controls2 = [["image-download", "\u4E0B\u8F7D\u56FE\u7247"], ["table-download", "\u4E0B\u8F7D\u8868\u683C"], ["refresh", "\u5237\u65B0"]];
    const list = ["funds", "managers", "holdings-stock"].includes(module);
    const visible = controls2.filter(([name]) => !(list && name === "image-download") && !(holdingChartTitles[module] && name === "table-download"));
    return `<div class="company-actions" role="group" aria-label="\u6A21\u5757\u64CD\u4F5C">${visible.map(
      ([name, label]) => `<button type="button" data-company-action="${name}" data-module="${module}" title="${label}" aria-label="${label}">${icon(name)}</button>`
    ).join("")}</div>`;
  }
  function getCompanyProfile(companyId) {
    if (companyId === "essence") return companyData;
    const entry = companyList2.find((item) => item.id === companyId);
    if (!entry) {
      const { companies, managers } = getManagerListData();
      const employer = companies.find((item) => item.id === companyId);
      if (!employer) return null;
      return {
        name: employer.name,
        listedManagers: managers.filter((manager) => manager.companyId === companyId)
      };
    }
    const metrics = [
      ["totalScale", "\u603B\u89C4\u6A21", "\u4EBF"],
      ["nonMoneyScale", "\u975E\u8D27\u5E01\u7406\u8D22\u89C4\u6A21", "\u4EBF"],
      ["fundCount", "\u65D7\u4E0B\u57FA\u91D1\u6570", "\u53EA"],
      ["managerCount", "\u65D7\u4E0B\u57FA\u91D1\u7ECF\u7406\u6570", "\u4EBA"]
    ].map(([key, label, unit]) => ({
      label,
      unit,
      value: entry[key],
      rank: companyList2.filter((item) => item[key] > entry[key]).length + 1,
      total: companyList2.length
    }));
    return {
      name: entry.name,
      founded: entry.founded,
      capital: entry.capital.toFixed(4),
      legalRepresentative: entry.legalRepresentative || null,
      metrics
    };
  }
  function emptyAnalysis(tab) {
    const labels = tab === "overview" ? ["\u89C4\u6A21\u53D8\u5316", "\u65D7\u4E0B\u4EA7\u54C1\u7ED3\u6784", "\u57FA\u91D1\u661F\u7EA7\u5206\u5E03"] : [tabs2.find(([key]) => key === tab)[1]];
    return labels.map((label) => `<section class="company-panel" aria-label="${label}">
    <div class="company-panel-head"><h2>${label}</h2></div>
    <p class="company-empty" role="status">\u6682\u65E0${label}\u6570\u636E</p>
  </section>`).join("");
  }
  function header2(profile) {
    const website = escapeHtml5(profile.url);
    return `<div class="company-header-slot">
    <header class="company-header" aria-label="\u516C\u53F8\u8BE6\u60C5\u9875\u5934">
      <div class="company-header-top">
        <div class="company-identity">
          <h1>${escapeHtml5(profile.name)}</h1>
          ${profile.metrics ? `<div class="company-chips">
            <span>\u6210\u7ACB\u65E5\u671F\uFF1A<b>${escapeHtml5(profile.founded)}</b></span>
            <span>\u6CE8\u518C\u8D44\u672C\uFF1A<b>${escapeHtml5(profile.capital)}</b> \u4EBF</span>
          </div>` : ""}
        </div>
        <div class="company-header-actions">
          <button type="button" data-company-action="switch" title="\u5207\u6362\u516C\u53F8" aria-label="\u5207\u6362\u516C\u53F8">${icon("switch")}<span>\u5207\u6362</span></button>
          <button type="button" data-company-action="favorite" aria-label="\u6536\u85CF\u516C\u53F8" aria-pressed="false">${icon("favorite")}<span>\u6536\u85CF</span></button>
        </div>
      </div>
      ${profile.metrics ? `<div class="company-facts-wrap">
        <div class="company-facts">
          <div class="company-facts-left">
            <div><span>\u6CD5\u4EBA\u4EE3\u8868\uFF1A<b>${escapeHtml5(profile.legalRepresentative)}</b></span><span>\u603B\u7ECF\u7406\uFF1A<b>${escapeHtml5(profile.generalManager)}</b></span></div>
            <div>\u5B98\u7F51\uFF1A<span class="company-website-address">${website}</span></div>
          </div>
          <dl class="company-metrics">
            ${profile.metrics.map((metric2) => `<div><dt>${escapeHtml5(metric2.label)}</dt>
              <dd class="company-metric-readout">
                <span class="company-metric-value">
                  <span class="company-metric-number">${escapeHtml5(metric2.unit === "\u4EBF" ? amount2(metric2.value) : metric2.value)}</span>
                  <span class="company-metric-unit">${escapeHtml5(metric2.unit)}</span>
                </span>
                <span class="company-rank">
                  <span>\u6392\u540D</span>
                  <span class="company-rank-numbers"><span>${escapeHtml5(metric2.rank)}</span><span>/</span><span>${escapeHtml5(metric2.total)}</span></span>
                </span>
              </dd>
            </div>`).join("")}
          </dl>
        </div>
      </div>` : ""}
      <div class="company-tabs" role="tablist" aria-label="\u516C\u53F8\u8BE6\u60C5">
        ${tabs2.map(([key, label]) => `<button type="button" id="company-tab-${key}" role="tab" aria-controls="company-tab-panel" data-company-tab="${key}">${label}</button>`).join("")}
      </div>
    </header>
  </div>`;
  }
  function switchDialog(profile) {
    return `<dialog class="company-dialog zc-dialog" aria-labelledby="company-switch-title">
    <form method="dialog" class="zc-dialog-head">
      <h2 id="company-switch-title" class="zc-dialog-title">\u5207\u6362\u516C\u53F8</h2>
      <button type="submit" class="zc-dialog-close" aria-label="\u5173\u95ED\u5207\u6362\u516C\u53F8">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor"/><path d="m6 6 6 6m0-6-6 6" stroke="currentColor" stroke-linecap="round"/></svg>
      </button>
    </form>
    <div class="zc-dialog-body">
      <input class="zc-dialog-control" type="search" aria-label="\u641C\u7D22\u57FA\u91D1\u516C\u53F8" placeholder="\u8F93\u5165\u516C\u53F8\u540D\u79F0" data-company-search>
      <button type="button" class="company-dialog-result" data-company-action="select-company">${escapeHtml5(profile.name)}${icon("check")}</button>
      <p class="company-dialog-empty" hidden>\u6682\u65E0\u5339\u914D\u516C\u53F8</p>
    </div>
  </dialog>`;
  }
  function dataTable(headers, rows3, { numeric = [], label, ratingMode, productKeys = [] } = {}) {
    if (!rows3.length) return `<p class="company-empty" role="status">\u6682\u65E0${escapeHtml5(label)}\u6570\u636E</p>`;
    const cell = (value, type) => `<${type}${type === "th" ? ' scope="col"' : ""} class="${value.numeric ? "num" : ""}${value.className ? " " + value.className : ""}">${value.html ?? escapeHtml5(value.value)}</${type}>`;
    return `<div class="company-table-scroll" tabindex="0" role="region" aria-label="${escapeHtml5(label)}">
    <table class="company-table${ratingMode ? " company-table--rating" : ""}${ratingMode === "manager" ? " company-table--manager-rating" : ""}">
      <thead><tr>${headers.map((value, i) => cell({ value, numeric: numeric.includes(i) }, "th")).join("")}</tr></thead>
      <tbody>${rows3.map((line, index) => `<tr${productKeys[index] ? ` data-company-product="${escapeHtml5(productKeys[index])}"` : ""}>${line.map((value, i) => cell({
      ...typeof value === "object" && value !== null ? value : { value },
      numeric: numeric.includes(i)
    }, "td")).join("")}</tr>`).join("")}</tbody>
    </table>
  </div>`;
  }
  function listedManagersPanel(managers) {
    const label = "\u7ECF\u7406\u7B5B\u9009\u6536\u5F55\u7684\u5728\u804C\u7ECF\u7406";
    const rows3 = managers.map((manager) => {
      const name = escapeHtml5(manager.name);
      const sample = manager.isDemo && !manager.name.startsWith("\u793A\u4F8B") ? ' <small class="company-quiet">\u793A\u4F8B</small>' : "";
      return [
        { html: `<a class="company-list-name" href="#/manager/${encodeURIComponent(manager.id)}">${name}</a>${sample}` },
        manager.product
      ];
    });
    return `<section class="company-panel" aria-label="${label}">
    <div class="company-panel-head"><h2>${label}</h2></div>
    ${dataTable(["\u7ECF\u7406\u540D\u79F0", "\u4EE3\u8868\u57FA\u91D1"], rows3, { label })}
  </section>`;
  }
  function scaleRows(state2) {
    if (state2.scaleType !== "all") return [];
    return companyData.scaleAnnual.slice(0, Number(state2.scaleYears));
  }
  function ratedRows(state2) {
    return companyData.ratedFunds.filter((item) => (state2.ratingType === "all" || item.type === state2.ratingType) && (state2.rating === "all" || ratingKey(item.rating) === state2.rating)).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }
  function managerRatingRows(state2) {
    return managerRatingExamples.filter((manager) => (state2.ratingType === "all" || manager.fundType === state2.ratingType) && (state2.rating === "all" || ratingKey(manager.rating) === state2.rating));
  }
  function scalePanel(state2) {
    const period = scaleShortcuts.find(({ key }) => key === state2.scaleYears);
    const rows3 = scaleRows(state2).map((row) => [
      `${row.year}\u5E74`,
      amount2(row.total),
      { value: amount2(row.change), className: signClass(row.change) },
      { html: rank(row.rank) },
      row.fundCount
    ]);
    return `<section class="company-panel" aria-labelledby="company-scale-title">
    <div class="company-panel-head company-panel-head--scale"><h2 id="company-scale-title">\u89C4\u6A21\u53D8\u5316</h2>
      <div class="company-panel-controls">${typeControl("scaleType", state2.scaleType)}
      <div class="linked-time-widget company-scale-time" data-linked-time data-company-scale-range
        data-lt-state="committed" data-lt-start="${period.start}" data-lt-end="${period.end}"
        data-lt-selection="${period.key}"></div></div>
      ${actions("scale")}
    </div>
    <div class="company-block company-scale">
      <div class="company-chart" data-company-chart="scale" role="img" aria-label="\u603B\u89C4\u6A21\u53CA\u89C4\u6A21\u53D8\u5316\u8D8B\u52BF\u56FE"></div>
      ${dataTable(["\u65F6\u95F4", "\u603B\u89C4\u6A21\uFF08\u4EBF\uFF09", "\u89C4\u6A21\u53D8\u5316\uFF08\u4EBF\uFF09", "\u89C4\u6A21\u6392\u540D", "\u57FA\u91D1\u6570"], rows3, { numeric: [1, 2, 3, 4], label: "\u89C4\u6A21\u53D8\u5316" })}
    </div>
  </section>`;
  }
  function productsPanel() {
    const products = companyData.products;
    const rows3 = products.map((item) => [
      { html: `<span class="company-type-dot" style="--company-type-color:${escapeHtml5(item.color)}"></span>${escapeHtml5(item.label)}` },
      percent3(item.percent),
      item.count,
      { html: rank(item.countRank) },
      amount2(item.total),
      { html: rank(item.scaleRank) }
    ]);
    return `<section class="company-panel" aria-labelledby="company-products-title">
    <div class="company-panel-head"><h2 id="company-products-title">\u65D7\u4E0B\u4EA7\u54C1\u7ED3\u6784</h2>
      ${actions("products")}
    </div>
    <div class="company-block company-products">
      <div class="company-chart" data-company-chart="products" data-company-chart-legend="external" role="img" aria-label="\u65D7\u4E0B\u4EA7\u54C1\u7BA1\u7406\u89C4\u6A21\u5360\u6BD4\u73AF\u5F62\u56FE"></div>
      ${dataTable(["\u57FA\u91D1\u7C7B\u578B", "\u5360\u6BD4", "\u57FA\u91D1\u6570\u91CF", "\u57FA\u91D1\u4E2A\u6570\u6392\u540D", "\u89C4\u6A21\u5408\u8BA1\uFF08\u4EBF\u5143\uFF09", "\u89C4\u6A21\u6392\u540D"], rows3, { numeric: [1, 2, 3, 4, 5], label: "\u65D7\u4E0B\u4EA7\u54C1\u7ED3\u6784", productKeys: products.map((item) => item.label) })}
    </div>
  </section>`;
  }
  function ratingBars(state2) {
    const managerMode = state2.ratingMode === "manager";
    const unit = managerMode ? "\u4EBA" : "\u53EA";
    const distribution = ratingDistribution(state2);
    const axisMax = managerMode ? Math.max(1, ...distribution.map((item) => item.percent)) : 50;
    const empty = !managerMode && state2.ratingType !== "all";
    return `<div class="company-distribution">
    <h3>${managerMode ? "\u667A\u541B\u57FA\u91D1\u7ECF\u7406\u661F\u7EA7\u5360\u6BD4" : "\u667A\u541B\u57FA\u91D1\u661F\u7EA7\u5360\u6BD4"}</h3>
    ${empty ? '<p class="company-empty" role="status">\u6682\u65E0\u8BE5\u7C7B\u578B\u7684\u89C4\u6A21\u5360\u6BD4\u6570\u636E</p>' : `<div class="company-ratings">
      <div class="company-rating-plot">
        <div class="company-rating-guides" aria-hidden="true"><span></span><span></span><span></span></div>
        ${distribution.map((item) => {
      const key = ratingKey(item.rating);
      const label = ratingGrade(key);
      const count = item.count ?? item.exampleCount;
      const countLabel = count == null ? "\u6682\u65E0\u6570\u91CF\u6570\u636E" : `${item.count == null ? "\u793A\u4F8B\u6570\u91CF" : "\u6570\u91CF"} ${count} ${unit}`;
      return `<button type="button" class="company-rating-row" data-company-choice="rating" data-value="${key}" aria-pressed="${key === state2.rating}"
            aria-label="${label}\uFF0C\u5360\u6BD4 ${item.percent}%\uFF0C${countLabel}">
            <span>${label}</span>
            <span class="company-bar-track" aria-hidden="true"><span class="company-bar${key === "unrated" ? " is-unrated" : ""}" style="--company-bar-size:${item.percent / axisMax * 100}%"></span></span>
            <span class="num">${item.percent}%</span>
            <span class="company-rating-quantity" title="${countLabel}"><span class="num">${count ?? "\u2014"}</span>${count == null ? "" : `<span class="company-rating-unit">${unit}</span>`}</span>
          </button>`;
    }).join("")}
      </div>
      <div class="company-rating-axis" aria-hidden="true"><span>0%</span><span>${Math.round(axisMax / 2)}%</span><span>${axisMax}%</span></div>
    </div>`}
  </div>`;
  }
  function ratingDropdown(state2) {
    const label = state2.ratingMode === "manager" ? "\u57FA\u91D1\u7ECF\u7406\u661F\u7EA7" : "\u57FA\u91D1\u661F\u7EA7";
    const grades = ratingDistribution(state2).map((row) => ratingKey(row.rating));
    const choices = [["all", "\u5168\u90E8"], ...grades.map((key) => [key, ratingGrade(key)])];
    return dropdown("rating", state2.rating, choices, { label, asHeading: true, value: ratingLabel(state2) });
  }
  function rowStars(rating2) {
    if (rating2 == null) return "\u6682\u65E0\u661F\u7EA7";
    return `<span class="company-stars" role="img" aria-label="${rating2} \u661F">${stars.map(
      (i) => `<span${i >= rating2 ? ' class="company-stars-muted"' : ""}>${icon("star")}</span>`
    ).join("")}</span>`;
  }
  function ratingsPanel(state2) {
    const modes2 = [["fund", "\u57FA\u91D1\u661F\u7EA7\u5206\u5E03"], ["manager", "\u57FA\u91D1\u7ECF\u7406\u661F\u7EA7\u5206\u5E03"]];
    const managerMode = state2.ratingMode === "manager";
    const rows3 = managerMode ? managerRatingRows(state2).map((manager) => [
      { html: `<span class="company-list-name" title="${escapeHtml5(manager.name)}">${escapeHtml5(manager.name)}</span>` },
      { html: `<span class="company-list-name" title="${escapeHtml5(manager.product)}">${escapeHtml5(manager.product)}</span>` },
      { html: rowStars(manager.rating) },
      ...managerMetricKeys.map((key, index) => ({
        value: percent3(manager[key]),
        className: index < 2 ? signClass(manager[key]) : ""
      }))
    ]) : ratedRows(state2).map((item) => [
      { html: `<span class="company-list-name">${escapeHtml5(item.name)}</span>` },
      { html: rowStars(item.rating) },
      { value: percent3(item.annual), className: signClass(item.annual) },
      percent3(item.returns),
      percent3(item.drawdown),
      item.status
    ]);
    return `<section class="company-panel company-rating-panel" aria-label="\u661F\u7EA7\u5206\u5E03">
    <div class="company-panel-head">
      <div class="company-rating-modes" aria-label="\u8BC4\u7EA7\u7EF4\u5EA6" role="group">
        ${modes2.map(([value, label]) => `<button type="button" data-company-choice="ratingMode" data-value="${value}" aria-pressed="${value === state2.ratingMode}">${label}</button>`).join("")}
      </div>
      <div class="company-panel-controls">${typeControl("ratingType", state2.ratingType)}${actions("rating")}</div>
    </div>
    <div class="company-block company-ratings-block">
      ${ratingBars(state2)}
      <div class="company-rating-detail">
        <div class="company-rating-detail-head">
          ${ratingDropdown(state2)}
        </div>
        ${dataTable(managerMode ? ratedManagerHeaders : ratedFundHeaders, rows3, {
      numeric: managerMode ? [3, 4, 5, 6] : [2, 3, 4],
      label: ratingLabel(state2),
      ratingMode: state2.ratingMode
    })}
      </div>
    </div>
  </section>`;
  }
  function chartData(state2) {
    const lastYear = companyData.scaleAnnual[0]?.year ?? 2026;
    return {
      scale: state2.scaleType === "all" ? companyData.scale.filter((point) => Number(point.date.slice(0, 4)) > lastYear - Number(state2.scaleYears)) : [],
      scaleApproximate: true,
      products: companyData.products
    };
  }
  function csvRows(module, state2) {
    if (module === "funds") return fundListCsv(state2);
    if (module === "managers") return managerListCsv(companyData.managers, state2);
    if (module === "holdings-stock") return holdingListCsv(state2);
    if (module === "scale") return [
      ["\u65F6\u95F4", "\u603B\u89C4\u6A21\uFF08\u4EBF\uFF09", "\u89C4\u6A21\u53D8\u5316\uFF08\u4EBF\uFF09", "\u89C4\u6A21\u6392\u540D", "\u57FA\u91D1\u6570"],
      ...scaleRows(state2).map((row) => [row.year, row.total, row.change, row.rank, row.fundCount])
    ];
    if (module === "products") return [
      ["\u57FA\u91D1\u7C7B\u578B", "\u5360\u6BD4", "\u57FA\u91D1\u6570\u91CF", "\u57FA\u91D1\u4E2A\u6570\u6392\u540D", "\u89C4\u6A21\u5408\u8BA1\uFF08\u4EBF\u5143\uFF09", "\u89C4\u6A21\u6392\u540D"],
      ...companyData.products.map((row) => [row.label, percent3(row.percent), row.count, row.countRank, row.total, row.scaleRank])
    ];
    if (state2.ratingMode === "manager") return [
      ratedManagerHeaders,
      ...managerRatingRows(state2).map((manager) => [
        manager.name,
        manager.product,
        manager.rating ?? "\u6682\u65E0\u661F\u7EA7",
        ...managerMetricKeys.map((key) => percent3(manager[key]))
      ])
    ];
    return [
      ratedFundHeaders,
      ...ratedRows(state2).map((row) => [row.name, row.rating ?? "\u6682\u65E0\u661F\u7EA7", percent3(row.annual), percent3(row.returns), percent3(row.drawdown), row.status])
    ];
  }
  function download(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }
  function limitRatingTable(content) {
    const table = content.querySelector(".company-table--rating");
    const sixthRow = table?.tBodies[0]?.rows[5];
    if (!sixthRow) return null;
    const viewport = table.parentElement;
    viewport.classList.add("company-rating-scroll");
    function updateHeight() {
      const row = sixthRow.getBoundingClientRect();
      const visibleHeight = row.top - table.getBoundingClientRect().top + row.height / 2;
      const horizontalScrollbar = viewport.offsetHeight - viewport.clientHeight;
      const maxHeight = `${visibleHeight + horizontalScrollbar}px`;
      if (viewport.style.maxHeight !== maxHeight) viewport.style.maxHeight = maxHeight;
    }
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(table);
    observer.observe(viewport);
    return observer;
  }
  function highlightProductRows(content) {
    const rows3 = new Map([...content.querySelectorAll("[data-company-product]")].map((row) => [row.dataset.companyProduct, row]));
    let active;
    return (label) => {
      const next = rows3.get(label);
      if (next === active) return;
      active?.classList.remove("is-chart-hovered");
      next?.classList.add("is-chart-hovered");
      active = next;
    };
  }
  function mountCompanyDetail(container, { companyId = "essence", initialTab = "overview", onTabChange = () => {
  }, toast = () => {
  } } = {}) {
    const profile = getCompanyProfile(companyId);
    if (!profile) {
      container.innerHTML = '<div class="company-detail"><section class="company-panel"><p class="company-empty" role="status">\u6CA1\u6709\u627E\u5230\u8FD9\u5BB6\u516C\u53F8\u3002</p></section></div>';
      return;
    }
    const favoriteKey = `zhice-company-favorite-${companyId}`;
    const state2 = { ...defaults, tab: tabs2.some(([key]) => key === initialTab) ? initialTab : "overview", favorite: readFavorite(favoriteKey) };
    container.innerHTML = `<div class="company-detail">${header2(profile)}<div class="company-content" id="company-tab-panel" role="tabpanel" tabindex="0"></div>${switchDialog(profile)}</div>`;
    const root = container.firstElementChild;
    const content = root.querySelector(".company-content");
    const dialog = root.querySelector(".company-dialog");
    const search = root.querySelector("[data-company-search]");
    const result = dialog.querySelector(".company-dialog-result");
    const favorite = root.querySelector('[data-company-action="favorite"]');
    let disposeCharts = () => {
    };
    let disposeFundPagination = () => {
    };
    let ratingTableObserver;
    let dialogTrigger;
    let activeDropdown;
    function updateFavorite() {
      favorite.setAttribute("aria-pressed", String(state2.favorite));
      favorite.setAttribute("aria-label", state2.favorite ? "\u53D6\u6D88\u6536\u85CF\u516C\u53F8" : "\u6536\u85CF\u516C\u53F8");
      favorite.querySelector("span").textContent = state2.favorite ? "\u5DF2\u6536\u85CF" : "\u6536\u85CF";
    }
    function renderContent(focus) {
      closeDropdown();
      disposeCharts();
      disposeFundPagination();
      ratingTableObserver?.disconnect();
      content.setAttribute("aria-labelledby", `company-tab-${state2.tab}`);
      root.querySelectorAll("[data-company-tab]").forEach((button) => {
        const active = button.dataset.companyTab === state2.tab;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      if (companyId !== "essence") {
        content.innerHTML = profile.listedManagers && (state2.tab === "overview" || state2.tab === "managers") ? listedManagersPanel(profile.listedManagers) : emptyAnalysis(state2.tab);
        return;
      }
      const isManagerList = state2.tab === "managers";
      const holdings = state2.tab === "holdings" ? holdingChartData(state2) : null;
      const managerTypes = isManagerList ? [...new Set(companyData.managers.map((manager) => manager.type).filter(Boolean))] : [];
      content.innerHTML = state2.tab === "overview" ? scalePanel(state2) + productsPanel() + ratingsPanel(state2) : holdings ? renderCompanyHoldings(state2, holdings, { dropdown, actions }) : renderCompanyList(state2.tab, companyData, state2, {
        actions: state2.tab === "funds" || isManagerList ? actions(state2.tab) : "",
        filter: isManagerList ? dropdown(
          "managerFilter",
          state2.managerFilter,
          [["all", "\u5168\u90E8"], ...managerTypes.map((type) => [type, type])],
          { label: "\u6295\u8D44\u7C7B\u578B" }
        ) : ""
      });
      if (state2.tab === "funds") {
        disposeFundPagination = mountPagination2(content.querySelector(".company-fund-panel > .zc-pagination"));
        content.querySelectorAll("[data-indeterminate]").forEach((input) => {
          input.indeterminate = true;
        });
        if (state2.fundMenuOpen) positionFundMenu();
      }
      disposeCharts = state2.tab === "overview" ? mountCompanyCharts(content, {
        ...chartData(state2),
        onProductHover: highlightProductRows(content)
      }) : () => {
      };
      if (holdings) {
        const rows3 = /* @__PURE__ */ new Map();
        content.querySelectorAll("[data-holdings-row]").forEach((row) => {
          const { holdingsRow, holdingsIndex } = row.dataset;
          rows3.set(`${holdingsRow}-${holdingsIndex}`, row);
        });
        const hovered = {};
        disposeCharts = mountHoldingCharts(content, { ...holdings, onHover(key, index) {
          hovered[key]?.classList.remove("is-chart-hovered");
          hovered[key] = rows3.get(`${key}-${index}`);
          hovered[key]?.classList.add("is-chart-hovered");
        } });
        window.ZhiceLinkedTime?.mount(content, (host) => holdingTimeOptions(host.dataset.holdingsRange));
      } else if (state2.tab === "overview") {
        window.ZhiceLinkedTime?.mount(content, () => ({
          shortcuts: scaleShortcuts,
          showDate: false,
          min: scaleShortcuts.at(-1).start,
          max: scaleEnd,
          end: scaleEnd,
          defaultShortcut: defaults.scaleYears
        }));
      }
      ratingTableObserver = limitRatingTable(content);
      if (focus) {
        const target = typeof focus === "string" ? root.querySelector(focus) : focus();
        target?.focus({ preventScroll: true });
      }
    }
    function setTab(tab) {
      if (tab === state2.tab) return;
      state2.fundMenuOpen = false;
      state2.tab = tab;
      onTabChange(tab);
      renderContent();
      const header3 = root.querySelector(".company-header");
      if (header3.classList.contains("is-pinned") && content.getBoundingClientRect().top < header3.getBoundingClientRect().bottom) {
        const y = window.scrollY + content.getBoundingClientRect().top - header3.getBoundingClientRect().bottom - 10;
        window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
      }
      root.dispatchEvent(new Event("company-tab-scroll"));
    }
    function setControl(key, value, focus) {
      if (!Object.hasOwn(defaults, key)) return;
      state2[key] = key.endsWith("PageSize") ? Number(value) : value;
      if (key === "ratingMode") state2.rating = value === "manager" ? "5" : "all";
      if (key === "holdingAssetPeriod") state2.holdingAssetRange = null;
      if (key === "holdingIndustryPeriod") state2.holdingIndustryRange = null;
      if (key === "masterOnly" || key === "fundPageSize") {
        state2.fundPage = 1;
        state2.fundMenuOpen = false;
        renderList(focus);
      } else if (key === "managerFilter" || key === "managerPageSize") {
        state2.managerPage = 1;
        renderList(focus);
      } else if (key === "holdingStockDate" || key === "holdingPageSize") {
        state2.holdingPage = 1;
        renderList(focus);
      } else renderContent(focus);
    }
    function positionFundMenu() {
      const trigger = content.querySelector("[data-fund-menu]");
      const menu = content.querySelector("#company-fund-menu");
      if (!trigger || !menu || menu.hidden) return;
      const { left, top, bottom } = trigger.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const toolbar = trigger.closest(".company-fund-toolbar");
      const { left: toolbarLeft, right: toolbarRight } = toolbar.getBoundingClientRect();
      const edge = Math.min(viewportWidth - 8, toolbarRight);
      const menuLeft = Math.max(toolbarLeft, Math.min(left, edge - menu.offsetWidth));
      menu.style.insetInlineStart = `${menuLeft - left}px`;
      const headerBottom = root.querySelector(".company-header.is-pinned")?.getBoundingClientRect().bottom ?? 52;
      menu.classList.toggle("opens-up", window.innerHeight - bottom < menu.offsetHeight + 16 && top - headerBottom > window.innerHeight - bottom);
    }
    function renderList(focus, resetChildScroll = false) {
      const columns3 = [...content.querySelectorAll(".company-fund-column")];
      const scrollPositions = columns3.map((column) => column.scrollTop);
      const tableScroll = content.querySelector(".company-table-scroll")?.scrollLeft ?? 0;
      if (state2.tab === "holdings") {
        closeDropdown();
        content.querySelector(".company-holdings-stock").outerHTML = renderHoldingStock(state2, { dropdown, actions });
      } else renderContent();
      content.querySelector(".company-table-scroll").scrollLeft = tableScroll;
      [...content.querySelectorAll(".company-fund-column")].forEach((column, index) => {
        column.scrollTop = index === 1 && resetChildScroll ? 0 : scrollPositions[index] ?? 0;
      });
      if (focus) content.querySelector(focus)?.focus({ preventScroll: true });
    }
    function changeListPage(value, focus) {
      const type = listTypes[state2.tab];
      const { pageCount } = type === "fund" ? fundListSnapshot(state2) : type === "manager" ? managerListSnapshot(companyData.managers, state2) : holdingListSnapshot(state2);
      if (!Number.isInteger(value) || value < 1 || value > pageCount) return;
      state2.fundMenuOpen = false;
      state2[`${type}Page`] = value;
      const nextFocus = focus && !(focus.includes("prev") && value === 1 || focus.includes("next") && value === pageCount) ? focus : '[aria-current="page"]';
      renderList(nextFocus);
      scrollToListStart();
    }
    function scrollToListStart() {
      const toolbar = content.querySelector(".company-fund-toolbar, .company-holdings-stock .company-panel-head");
      const headerBottom = root.querySelector(".company-header.is-pinned")?.getBoundingClientRect().bottom ?? 52;
      const top = toolbar.getBoundingClientRect().top;
      if (top < headerBottom) window.scrollBy({ top: top - headerBottom - 12, behavior: "instant" });
    }
    function onFundPagination(event) {
      if (state2.tab !== "funds" || !event.target.matches(".company-fund-panel > .zc-pagination")) return;
      const { page, pageSize } = event.detail;
      if (page === state2.fundPage && pageSize === state2.fundPageSize) return;
      state2.fundPage = page;
      state2.fundPageSize = pageSize;
      const table = content.querySelector(".company-fund-panel .company-table-scroll");
      const scrollLeft = table.scrollLeft;
      table.outerHTML = renderFundTable(state2);
      content.querySelector(".company-fund-panel .company-table-scroll").scrollLeft = scrollLeft;
      scrollToListStart();
    }
    function changeFundTypes(input) {
      const { fundCheck: kind } = input.dataset;
      const key = input.value;
      const keys = kind === "all" ? fundTypeOptions : kind === "branch" ? fundCategories.find(([parent]) => parent === key)[1] : [key];
      const selected = new Set(state2.fundTypes);
      for (const type of keys) {
        if (input.checked) selected.add(type);
        else selected.delete(type);
      }
      const nextBranch = kind === "branch" && state2.fundBranch !== key;
      if (kind === "branch") state2.fundBranch = key;
      state2.fundTypes = [...selected];
      state2.fundPage = 1;
      renderList(`[data-fund-check="${kind}"][value="${CSS.escape(key)}"]`, nextBranch);
    }
    function onChange(event) {
      const fundCheck = event.target.closest("[data-fund-check]");
      if (fundCheck) {
        changeFundTypes(fundCheck);
        return;
      }
      const field2 = event.target.closest("[data-company-control]");
      if (field2) setControl(field2.dataset.companyControl, field2.type === "checkbox" ? field2.checked : field2.value, `[data-company-control="${field2.dataset.companyControl}"]`);
    }
    function onSubmit(event) {
      if (!event.target.matches("[data-company-list-jump]")) return;
      event.preventDefault();
      changeListPage(event.target.querySelector("input").valueAsNumber);
    }
    function onTimeRange(event) {
      const { target, detail } = event;
      if (target.hasAttribute("data-company-scale-range")) {
        if (state2.tab === "overview" && state2.scaleYears !== detail.selection) {
          state2.scaleYears = detail.selection;
          queueMicrotask(() => {
            if (root.isConnected && state2.tab === "overview") renderContent("[data-company-scale-range] .lt-bar > .is-selected");
          });
        }
        return;
      }
      const key = target.dataset.holdingsRange;
      if (!key || state2.tab !== "holdings") return;
      const { periodKey, rangeKey, period, range: range2 } = holdingRangeControl(key, detail);
      if (state2[periodKey] === period && state2[rangeKey]?.start === range2?.start && state2[rangeKey]?.end === range2?.end) return;
      state2[periodKey] = period;
      state2[rangeKey] = range2;
      queueMicrotask(() => {
        if (root.isConnected && state2.tab === "holdings") renderContent();
      });
    }
    function changeListSort(key) {
      const type = listTypes[state2.tab];
      const sort = `${type}Sort`;
      const direction = `${type}SortDirection`;
      const descending = ["rating3", "rating5", "returns", "scale", "tenure", "experience", "count", "annual", "value", "weight", "return1y"].includes(key);
      state2[direction] = state2[sort] === key ? state2[direction] === "asc" ? "desc" : "asc" : descending ? "desc" : "asc";
      state2[sort] = key;
      state2[`${type}Page`] = 1;
      state2.fundMenuOpen = false;
      renderList(`[data-company-list-sort="${key}"]`);
    }
    function onFundClick(button) {
      const { fundMenu, fundClear, fundBranch, fundStatus } = button.dataset;
      if (fundMenu !== void 0) {
        state2.fundMenuOpen = !state2.fundMenuOpen;
        renderList("[data-fund-menu]");
      } else if (fundClear !== void 0) {
        const first = fundTypeOptions.find((type) => state2.fundTypes.includes(type));
        state2.fundTypes = state2.fundTypes.length === fundTypeOptions.length ? [] : state2.fundTypes.filter((type) => type !== first);
        state2.fundPage = 1;
        renderList("[data-fund-menu]");
      } else if (fundBranch !== void 0) {
        if (state2.fundBranch !== fundBranch) {
          state2.fundBranch = fundBranch;
          renderList(`[data-fund-branch="${CSS.escape(fundBranch)}"]`, true);
        }
      } else if (fundStatus !== void 0) {
        state2.fundMenuOpen = false;
        state2.fundPage = 1;
        state2.fundStatus = fundStatus;
        renderList(`[data-fund-status="${fundStatus}"]`);
      } else return false;
      return true;
    }
    function closeDropdown(restoreFocus = false) {
      if (!activeDropdown) return;
      const dropdown2 = activeDropdown;
      activeDropdown = null;
      const trigger = dropdown2.querySelector("[data-company-dropdown]");
      const menu = trigger.nextElementSibling;
      menu.hidden = true;
      menu.style.removeProperty("max-height");
      dropdown2.classList.remove("opens-up");
      trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus) trigger.focus({ preventScroll: true });
    }
    function openDropdown(trigger) {
      closeDropdown();
      activeDropdown = trigger.closest(".company-dropdown");
      const menu = trigger.nextElementSibling;
      trigger.setAttribute("aria-expanded", "true");
      menu.hidden = false;
      const { top, bottom } = trigger.getBoundingClientRect();
      const headerBottom = root.querySelector(".company-header.is-pinned")?.getBoundingClientRect().bottom ?? 52;
      const spaceBelow = window.innerHeight - bottom - 16;
      const spaceAbove = top - headerBottom - 16;
      const opensUp = spaceBelow < menu.offsetHeight && spaceAbove > spaceBelow;
      activeDropdown.classList.toggle("opens-up", opensUp);
      menu.style.maxHeight = `${Math.min(menu.offsetHeight, Math.max(64, opensUp ? spaceAbove : spaceBelow))}px`;
      (menu.querySelector('[aria-selected="true"]') ?? menu.firstElementChild)?.focus();
    }
    function onClick(event) {
      const button = event.target.closest("button");
      if (!button) return;
      if (state2.tab === "funds" && onFundClick(button)) return;
      const {
        companyTab,
        companyDropdown,
        companyChoice,
        value,
        companyAction,
        module,
        companyListPage,
        companyListPageStep,
        companyListSort
      } = button.dataset;
      if (companyListSort !== void 0) {
        changeListSort(companyListSort);
        return;
      }
      if (companyListPage !== void 0) {
        changeListPage(Number(companyListPage), companyListPageStep && `[data-company-list-page-step="${companyListPageStep}"]`);
        return;
      }
      if (companyTab) {
        setTab(companyTab);
        return;
      }
      if (companyDropdown) {
        if (button.getAttribute("aria-expanded") === "true") closeDropdown(true);
        else openDropdown(button);
        return;
      }
      if (companyChoice) {
        const fromMenu = button.getAttribute("role") === "option";
        const choice = companyChoice === "rating" && !fromMenu && value === state2.rating ? "all" : value;
        const focus = fromMenu ? `[data-company-dropdown="${companyChoice}"]` : `[data-company-choice="${companyChoice}"][data-value="${value}"]`;
        if (fromMenu && choice === state2[companyChoice]) closeDropdown(true);
        else setControl(companyChoice, choice, focus);
        return;
      }
      if (!companyAction) return;
      if (companyAction === "favorite") {
        state2.favorite = !state2.favorite;
        try {
          localStorage.setItem(favoriteKey, state2.favorite ? "1" : "0");
        } catch {
        }
        updateFavorite();
        toast(state2.favorite ? "\u5DF2\u6536\u85CF\u516C\u53F8" : "\u5DF2\u53D6\u6D88\u6536\u85CF");
      } else if (companyAction === "switch") {
        dialogTrigger = button;
        search.value = "";
        filterCompanies();
        dialog.showModal();
        search.focus();
      } else if (companyAction === "select-company") {
        dialog.close();
        setTab("overview");
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (companyAction === "refresh") {
        if (module === "funds") state2.fundMenuOpen = false;
        const focus = `[data-company-action="refresh"][data-module="${module}"]`;
        if (module === "holdings-stock") renderList(focus);
        else renderContent(focus);
        toast("\u5DF2\u5237\u65B0\u5F53\u524D\u6A21\u5757");
      } else if (companyAction === "table-download") {
        const rows3 = csvRows(module, state2);
        if (rows3.length < 2) {
          toast("\u6682\u65E0\u53EF\u4E0B\u8F7D\u7684\u6570\u636E");
          return;
        }
        const csv = rows3.map((row) => row.map((value2) => '"' + String(value2 ?? "").replaceAll('"', '""') + '"').join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
        const ratingTitle = state2.ratingMode === "manager" ? "\u57FA\u91D1\u7ECF\u7406\u661F\u7EA7-\u793A\u4F8B\u6570\u636E" : "\u57FA\u91D1\u661F\u7EA7";
        const tableTitles = {
          scale: "\u89C4\u6A21\u53D8\u5316",
          products: "\u65D7\u4E0B\u4EA7\u54C1\u7ED3\u6784",
          rating: ratingTitle,
          funds: "\u65D7\u4E0B\u57FA\u91D1-\u793A\u4F8B\u6570\u636E",
          managers: "\u5728\u804C\u7ECF\u7406",
          "holdings-stock": `\u80A1\u7968\u6301\u4ED3\u8BE6\u60C5-${state2.holdingStockDate}-\u793A\u4F8B\u6570\u636E`
        };
        download(url, `\u5B89\u4FE1\u57FA\u91D1-${tableTitles[module]}.csv`);
        window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
      } else if (companyAction === "image-download") {
        if (module === "rating") {
          const image = ratingChartImage(content.querySelector(".company-distribution"));
          const title = state2.ratingMode === "manager" ? "\u57FA\u91D1\u7ECF\u7406\u661F\u7EA7\u5206\u5E03" : "\u57FA\u91D1\u661F\u7EA7\u5206\u5E03";
          if (image) download(image, `\u5B89\u4FE1\u57FA\u91D1-${title}.png`);
          else toast("\u6682\u65E0\u53EF\u4E0B\u8F7D\u7684\u56FE\u8868");
          return;
        }
        if (holdingChartTitles[module]) {
          const key = module.slice("holdings-".length);
          const nodes = content.querySelectorAll(`[data-holdings-chart^="${key}-"]`);
          const charts = [...nodes].map((node2) => window.echarts?.getInstanceByDom(node2)).filter(Boolean);
          if (!charts.length) {
            toast("\u6682\u65E0\u53EF\u4E0B\u8F7D\u7684\u56FE\u8868");
            return;
          }
          if (charts.length === 1) {
            download(charts[0].getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff" }), `\u5B89\u4FE1\u57FA\u91D1-${holdingChartTitles[module]}.png`);
            return;
          }
          const group = window.echarts.connect(charts);
          try {
            download(
              charts[0].getConnectedDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff", connectedBackgroundColor: "#fff" }),
              `\u5B89\u4FE1\u57FA\u91D1-${holdingChartTitles[module]}.png`
            );
          } finally {
            window.echarts.disconnect(group);
          }
          return;
        }
        const node = content.querySelector(`[data-company-chart="${module}"]`);
        const chart = node && window.echarts?.getInstanceByDom(node);
        if (!chart || module === "scale" && !chartData(state2).scale.length) {
          toast("\u6682\u65E0\u53EF\u4E0B\u8F7D\u7684\u56FE\u8868");
          return;
        }
        download(chart.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff" }), `\u5B89\u4FE1\u57FA\u91D1-${module === "scale" ? "\u89C4\u6A21\u53D8\u5316" : "\u65D7\u4E0B\u4EA7\u54C1\u7ED3\u6784"}.png`);
      }
    }
    function onKeydown(event) {
      const fundCascade2 = event.target.closest(".company-fund-cascade");
      if (fundCascade2 && state2.fundMenuOpen && event.key === "Escape") {
        event.preventDefault();
        state2.fundMenuOpen = false;
        renderList("[data-fund-menu]");
        return;
      }
      if (event.target.matches("[data-fund-menu]") && event.key === "ArrowDown") {
        event.preventDefault();
        state2.fundMenuOpen = true;
        renderList('[data-fund-check="all"]');
        return;
      }
      const button = event.target.closest("[data-company-tab]");
      if (button && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const current = tabs2.findIndex(([key]) => key === button.dataset.companyTab);
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs2.length - 1 : (current + (event.key === "ArrowLeft" ? -1 : 1) + tabs2.length) % tabs2.length;
        setTab(tabs2[next][0]);
        root.querySelector(`[data-company-tab="${tabs2[next][0]}"]`).focus();
      }
      const trigger = event.target.closest("[data-company-dropdown]");
      if (trigger && ["ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        openDropdown(trigger);
      } else if (activeDropdown?.contains(event.target)) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeDropdown(true);
        } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const options = [...activeDropdown.querySelectorAll('[role="option"]')];
          const index = options.indexOf(event.target);
          const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
          options[next]?.focus();
        }
      }
    }
    function onOutsideClick(event) {
      if (activeDropdown && !activeDropdown.contains(event.target)) closeDropdown();
      if (state2.tab === "funds" && state2.fundMenuOpen && !event.composedPath().some((part) => part.classList?.contains("company-fund-cascade"))) {
        state2.fundMenuOpen = false;
        const trigger = content.querySelector("[data-fund-menu]");
        const menu = content.querySelector("#company-fund-menu");
        if (menu.contains(document.activeElement)) trigger.focus({ preventScroll: true });
        trigger.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      }
    }
    function onFocusOut(event) {
      if (activeDropdown?.contains(event.target) && !activeDropdown.contains(event.relatedTarget)) closeDropdown();
    }
    function filterCompanies() {
      result.hidden = !profile.name.includes(search.value.trim());
      dialog.querySelector(".company-dialog-empty").hidden = !result.hidden;
    }
    root.addEventListener("click", onClick);
    root.addEventListener("change", onChange);
    root.addEventListener("submit", onSubmit);
    root.addEventListener("paginationchange", onFundPagination);
    root.addEventListener("timerangechange", onTimeRange);
    root.addEventListener("keydown", onKeydown);
    root.addEventListener("focusout", onFocusOut);
    search.addEventListener("input", filterCompanies);
    dialog.addEventListener("close", () => dialogTrigger?.focus({ preventScroll: true }));
    document.addEventListener("click", onOutsideClick);
    window.addEventListener("resize", positionFundMenu);
    updateFavorite();
    renderContent();
    const disposeScroll = attachDetailHeaderScroll(root);
    return () => {
      disposeScroll();
      disposeCharts();
      disposeFundPagination();
      ratingTableObserver?.disconnect();
      document.removeEventListener("click", onOutsideClick);
      window.removeEventListener("resize", positionFundMenu);
      if (dialog.open) dialog.close();
      root.remove();
    };
  }
  return __toCommonJS(research_routes_exports);
})();
