const snapshot = {
  meta: {
    source: "智策 AMP 页面可见业务数据",
    capturedAt: "2026-09-04T14:00:00+08:00",
    asOf: "2026-09-04",
    containsCredentials: false,
    note: "标记为 effect 的序列仅用于视觉与交互评审。"
  },
  market: {
    updatedAt: "2026-09-04 13:34",
    indices: [
      { name: "上证指数", value: 3954.11, delta: 12.02, change: 0.30 },
      { name: "深证成指", value: 13644.53, delta: 19.41, change: 0.14 },
      { name: "创业板指", value: 3319.60, delta: 7.06, change: 0.21 },
      { name: "沪深300", value: 4576.71, delta: 24.13, change: 0.53 }
    ],
    categories: [
      { name: "医药卫生", change: 1.19 },
      { name: "普通股票型", change: 0.28 },
      { name: "偏股混合型", change: 0.31 },
      { name: "科技", change: -0.12 },
      { name: "可转债型", change: -0.42 }
    ],
    etf: [
      { name: "南方深证主板50ETF", change: 1.19, group: "深证" },
      { name: "华夏中小企业100ETF", change: 1.06, group: "深证" },
      { name: "博时创业板ETF", change: 1.30, group: "创业板" },
      { name: "嘉实上证科创板综合ETF", change: -0.48, group: "科创板" },
      { name: "鹏华中证科创创业50ETF", change: 1.25, group: "科创创业" },
      { name: "国联中证A50ETF", change: 1.13, group: "全市场" }
    ],
    portfolios: [
      { name: "红利打底", daily: 0.17, annual: 4.48, drawdown: -9.48 },
      { name: "价值配置", daily: 0.11, annual: 4.58, drawdown: -9.21 },
      { name: "中国股票-核心卫星策略", daily: 0.08, annual: 3.19, drawdown: -10.26 }
    ]
  },
  fund: {
    code: "000001",
    name: "华夏成长混合",
    category: "偏股混合型",
    style: "大盘-成长型",
    navDate: "2026-09-03",
    nav: 1.2700,
    daily: -0.70,
    accumulatedNav: 3.8430,
    size: 39.38,
    inception: "2001-12-18",
    company: "华夏基金管理有限公司",
    managers: ["郑晓辉", "刘睿聪"],
    returns: { "近1月": 6.28, "近3月": -3.64, "近6月": 15.77, "近1年": 22.64, "近3年": 43.84 },
    benchmark: "中证800成长指数收益率×70% + 中债-综合全价指数收益率×30%",
    benchmarks: [
      { type: "适配基准", name: "科技传媒通信150全收益×65% + 中证综合债×35%", r2: 0.90, beta: 1.01, alpha: -10.36, excess: -12.56 },
      { type: "法定基准", name: "中证800成长×70% + 中债综合全价×30%", r2: null, beta: null, alpha: null, excess: null },
      { type: "分类基准", name: "偏股混合型基金指数", r2: 0.68, beta: 0.99, alpha: 6.85, excess: 5.83 }
    ],
    assets: [
      { name: "股票", fund: 79.98, peer: 87.69, color: "stock" },
      { name: "债券", fund: 20.19, peer: 1.93, color: "bond" },
      { name: "现金", fund: 0.79, peer: 10.94, color: "cash" },
      { name: "其他", fund: 0.59, peer: 1.66, color: "other" }
    ],
    industries: [
      { name: "通信", fund: 16.2, benchmark: 7.8 },
      { name: "电子", fund: 14.1, benchmark: 10.6 },
      { name: "医药生物", fund: 9.7, benchmark: 11.2 },
      { name: "电力设备", fund: 8.6, benchmark: 7.1 },
      { name: "非银金融", fund: 6.2, benchmark: 8.4 },
      { name: "基础化工", fund: 4.8, benchmark: 5.5 }
    ],
    factors: [
      { name: "贝塔", min: -0.54, max: 0.81, current: 0.64, peer: 0.58 },
      { name: "动量", min: -0.53, max: 0.65, current: 0.52, peer: 0.35 },
      { name: "规模", min: -0.22, max: 0.29, current: 0.25, peer: 0.03 },
      { name: "盈利", min: -0.48, max: 0.00, current: -0.15, peer: -0.12 },
      { name: "波动", min: -0.12, max: 0.46, current: 0.21, peer: 0.15 },
      { name: "价值", min: -0.71, max: 0.00, current: -0.38, peer: -0.34 }
    ]
  },
  screener: {
    total: 6816,
    templates: ["核心权益", "稳健债基", "低费率指数"],
    // 列表数据以截图为准：指数型基金，含申购/赎回状态、双分类、跟踪指数、星级、近1月/近1年收益及排名
    rows: [
      { code: "023616", name: "博时中证800指数增强A", size: "0.13", star: 3, hold: "1年19天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "增强指数股票型", tracking: "中证800指数", tags: "指数增强", manager: "杨建", m1: -5.68, m1Rank: 35.76, y1: 0.90, y1Rank: 55.60 },
      { code: "023617", name: "博时中证800指数增强C", size: "0.14", star: 3, hold: "1年19天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "增强指数股票型", tracking: "中证800指数", tags: "指数增强", manager: "杨建", m1: -5.89, m1Rank: 36.00, y1: -0.46, y1Rank: 56.63 },
      { code: "023905", name: "中欧上证科创板综合指数A", size: "1.54", star: 2, hold: "1年12天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "被动指数股票型", tracking: "上证科创板综合指数", tags: "被动指数", manager: "宋巍巍", m1: -13.23, m1Rank: 71.05, y1: -13.94, y1Rank: 11.40 },
      { code: "023906", name: "中欧上证科创板综合指数C", size: "1.44", star: 2, hold: "1年12天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "被动指数股票型", tracking: "上证科创板综合指数", tags: "被动指数", manager: "宋巍巍", m1: -13.34, m1Rank: 71.79, y1: -13.79, y1Rank: 11.58 },
      { code: "023968", name: "博时创业板50指数A", size: "0.99", star: 2, hold: "1年6天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "被动指数股票型", tracking: "创业板50指数", tags: "被动指数", manager: "赵云阳", m1: -22.61, m1Rank: 97.63, y1: 0.31, y1Rank: 28.56 },
      { code: "023969", name: "博时创业板50指数C", size: "0.32", star: 2, hold: "1年6天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "被动指数股票型", tracking: "创业板50指数", tags: "被动指数", manager: "赵云阳", m1: -22.67, m1Rank: 97.68, y1: 0.61, y1Rank: 29.09 },
      { code: "024025", name: "国联安上证科创板综合指数A", size: "2.11", star: 2, hold: "1年2天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "增强指数股票型", tracking: "上证科创板综合指数", tags: "指数增强", manager: "冯明", m1: -15.42, m1Rank: 90.27, y1: -15.12, y1Rank: 9.15 },
      { code: "024026", name: "国联安上证科创板综合指数C", size: "1.27", star: 2, hold: "1年2天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "增强指数股票型", tracking: "上证科创板综合指数", tags: "指数增强", manager: "冯明", m1: -15.46, m1Rank: 90.60, y1: -14.90, y1Rank: 8.86 },
      { code: "024241", name: "鹏华中证空天一体军工指数(LOF)A", size: "0.02", star: 3, hold: "1年64天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "被动指数股票型", tracking: "中证空天一体", tags: "被动指数", manager: "陈龙", m1: -10.37, m1Rank: 63.21, y1: -17.18, y1Rank: 48.02 },
      { code: "024242", name: "银华中证A500指数A", size: "<100万", star: 2, hold: "1年44天", subscribe: "可申购", redeem: "可赎回", category: "股票型", category2: "被动指数股票型", tracking: "中证A500指数", tags: "被动指数", manager: "马君", m1: -7.51, m1Rank: 52.22, y1: -6.97, y1Rank: 70.33 }
    ]
  },
  comparison: {
    funds: [
      { code: "360001", name: "光大保德信量化核心A", color: "#1F55AF", ytd: 10.45, m1: 8.78, m3: 3.20, y1: 21.78, y3: 39.05, size: 12.25, benchmark: "沪深300×90% + 同业存款利率×10%" },
      { code: "000409", name: "鹏华环保产业股票", color: "#A50032", ytd: 4.80, m1: -2.10, m3: -21.17, y1: 23.01, y3: 30.05, size: 12.77, benchmark: "中证环保产业×80% + 中证综合债×20%" },
      { code: "004241", name: "中欧时代先锋股票C", color: "#518428", ytd: 6.53, m1: 4.01, m3: -6.88, y1: 24.02, y3: 57.11, size: 18.91, benchmark: "中证500×90% + 中证综合债×10%" },
      { code: "001878", name: "嘉实沪港深精选股票", color: "#EF7622", ytd: -11.11, m1: 0.04, m3: -3.18, y1: -14.09, y3: 29.09, size: 18.31, benchmark: "沪深300×45% + 恒生×45% + 中债财富×10%" }
    ]
  },
  indices: {
    tags: ["全部", "宽基", "大盘", "成长", "科技", "红利", "境外"],
    rows: [
      { code: "000300", name: "沪深300", change: 11.03, etfCount: 48, relatedCount: 126, size: 4218, flow: 318.6, tags: ["宽基", "大盘"] },
      { code: "000905", name: "中证500", change: 8.76, etfCount: 34, relatedCount: 82, size: 1168, flow: 96.2, tags: ["宽基", "中盘"] },
      { code: "000852", name: "中证1000", change: 3.69, etfCount: 21, relatedCount: 45, size: 722, flow: 68.4, tags: ["宽基", "小盘"] },
      { code: "399006", name: "创业板指", change: 7.06, etfCount: 29, relatedCount: 63, size: 986, flow: 74.9, tags: ["成长", "科技"] },
      { code: "931151", name: "光伏产业", change: -1.70, etfCount: 18, relatedCount: 55, size: 238, flow: -8.4, tags: ["科技"] },
      { code: "000922", name: "中证红利", change: 5.42, etfCount: 15, relatedCount: 39, size: 515, flow: 42.7, tags: ["红利"] }
    ],
    etfs: [
      { code: "510300", name: "华泰柏瑞沪深300ETF", relation: "场内ETF", size: 1432.6, volume: 36.8, tracking: 0.42, fee: 0.20, excess: -0.18 },
      { code: "510330", name: "华夏沪深300ETF", relation: "场内ETF", size: 481.2, volume: 11.6, tracking: 0.51, fee: 0.20, excess: -0.23 },
      { code: "159919", name: "嘉实沪深300ETF", relation: "场内ETF", size: 466.9, volume: 9.7, tracking: 0.48, fee: 0.20, excess: -0.20 },
      { code: "000051", name: "华夏沪深300ETF联接A", relation: "联接基金", size: 215.4, volume: null, tracking: 0.73, fee: 0.60, excess: -0.38 },
      { code: "000311", name: "景顺长城沪深300增强A", relation: "指数增强", size: 64.8, volume: null, tracking: 5.80, fee: 1.20, excess: 4.12 }
    ]
  }
};

// 暴露为全局变量，供普通脚本（非 ES Module）在 file:// 直接打开时使用。
window.snapshot = snapshot;
