(function () {
  "use strict";

  const listPages = ["ETF总览", "ETF排行榜", "ETF筛选", "指数行情", "基金筛选"];
  const percent = n => (n < 0 ? "−" : n > 0 ? "+" : "") + Math.abs(n).toFixed(2) + "%";
  const riskQuestion = {
    question:"怎么一起看收益和最大回撤？",
    answer:"先统一起止日期。区间收益看期末相对期初的变化，最大回撤看期间从高点到随后低点的最大跌幅。两项并排看，可以区分收益接近、但持有过程差异较大的产品。"
  };

  function ranked(rows, key, count = 1) {
    return [...rows].sort((a,b) => b[key] - a[key]).slice(0,count);
  }
  function breadth(rows, unit) {
    const up = rows.filter(f => f.daily > 0).length;
    const down = rows.filter(f => f.daily < 0).length;
    return "当日上涨 "+up+unit+"，下跌 "+down+unit+"，持平 "+(rows.length-up-down)+unit+"。";
  }
  function filterDescription(ctx) {
    const parts = [];
    if (ctx.filter && ctx.filter !== "全部") parts.push("类型为「"+ctx.filter+"」");
    if (ctx.query) parts.push("关键词为「"+ctx.query+"」");
    return parts.length ? parts.join("，") : "当前包含全部类型，搜索栏为空";
  }
  function emptyResults(ctx) {
    return [
      {question:"哪些条件限制了筛选结果？",answer:filterDescription(ctx)+"，当前匹配 0 条。"},
      {question:"怎样放宽筛选范围？",answer:"可以先切回「全部」类型，再缩短搜索关键词，逐步确认哪项条件缩小了结果范围。"},
      {question:"可以用哪些信息搜索？",answer:"支持基金代码、名称和跟踪指数。名称可以只输入一部分，例如输入一个指数简称。"}
    ];
  }

  function indexQuestions(rows, chosen) {
    const scope = chosen ? "已选指数" : "指数列表";
    if (rows.length === 1) {
      const f = rows[0];
      return [
        {question:"这只指数的最新点位是多少？",answer:f.name+"在当前示例中的最新点位为 "+f.size.toFixed(2)+" 点，当日涨跌幅为 "+percent(f.daily)+"。"},
        {question:"这只指数近一年表现如何？",answer:f.name+"近一年收益为 "+percent(f.performance)+"，同期最大回撤为 "+percent(f.drawdown)+"。"},
        {question:"这只指数属于哪一类？",answer:f.name+"在当前列表中的分类为「"+f.type+"」。"}
      ];
    }
    const returnLeader = ranked(rows,"performance")[0], drawdownLeader = ranked(rows,"drawdown")[0];
    return [
      {question:scope+"中，今天涨跌各有多少？",answer:"当前"+scope+"共有 "+rows.length+" 个，"+breadth(rows,"个")},
      {question:"哪个指数近一年收益最高？",answer:"当前"+scope+"中，"+returnLeader.name+"的近一年收益最高，为 "+percent(returnLeader.performance)+"。"},
      {question:"哪个指数近一年最大回撤最小？",answer:"当前"+scope+"中，"+drawdownLeader.name+"的最大回撤幅度最小，近一年最大回撤为 "+percent(drawdownLeader.drawdown)+"。"}
    ];
  }
  function listQuestions(ctx, rows) {
    if (!rows.length) return emptyResults(ctx);
    if (ctx.page === "指数行情") return indexQuestions(rows,false);
    if (ctx.page === "ETF总览") {
      const largest = ranked(rows,"size")[0];
      return [
        {question:"这里覆盖了哪些 ETF 类型？",answer:"当前列表涵盖"+[...new Set(rows.map(f=>f.type))].join("、")+"，共 "+rows.length+" 只 ETF。"},
        {question:"哪只 ETF 的规模最大？",answer:largest.name+"的规模在当前列表中最大，为 "+largest.size.toFixed(2)+" 亿元。"},
        {question:"今天上涨和下跌的 ETF 各有多少？",answer:"当前列表共 "+rows.length+" 只 ETF，"+breadth(rows,"只")}
      ];
    }
    const label = ctx.page === "基金筛选" ? "基金" : "ETF";
    const leaders = ranked(rows,"performance",3), resilient = ranked(rows,"drawdown")[0];
    const result = [
      {question:"哪些"+label+"近一年收益靠前？",answer:"按近一年收益由高到低，当前结果中排名靠前的是"+leaders.map(f=>f.name+"（"+percent(f.performance)+"）").join("、")+"。"},
      {question:"哪只"+label+"近一年最大回撤最小？",answer:"当前结果中，"+resilient.name+"的最大回撤幅度最小，近一年最大回撤为 "+percent(resilient.drawdown)+"。"}
    ];
    if (ctx.page === "ETF排行榜") result.push(riskQuestion);
    else result.unshift({question:"当前条件筛出了多少只"+label+"？",answer:filterDescription(ctx)+"，共匹配 "+rows.length+" 只"+label+"。"});
    return result;
  }

  function singleFundQuestions(fund, period) {
    const gain = fund.performance.toFixed(2).replace("-", "−")+"%";
    const drop = Math.abs(fund.drawdown).toFixed(2)+"%";
    const interval = period === "近1年" ? "近一年" : "所选区间";
    return [
      {question:interval+"收益 "+gain+"、最大回撤 "+drop+"，这两个数放在一起怎么看？",
        answer:fund.name+interval+"的收益为 "+gain+"。按这一收益率折算，期初的 100 元到期末相当于 "+(100+fund.performance).toFixed(2)+" 元。同期最大回撤为 "+drop+"，衡量的是这段时间里从某个高点到随后低点的最大跌幅。前一个数描述期末结果，后一个数描述期间经历过的下跌。"},
      {question:"如果从阶段高点持有，"+drop+" 的最大回撤意味着什么？",
        answer:"以发生最大回撤的那段时间为例，如果在阶段高点持有价值 100 元的"+fund.name+"，按净值变化折算，到随后低点约剩 "+(100-Math.abs(fund.drawdown)).toFixed(2)+" 元。实际持有期间的盈亏取决于买入和卖出日期。"},
      {question:"要判断这只基金的表现是否稳定，还需要看哪些数据？",
        answer:"可以把"+fund.name+"的收益按月拆开，看全年表现是否集中在少数月份；再比较不同起点的滚动收益、波动率，以及每次回撤后恢复前高所用的时间。比较同类基金时，尽量对齐观察日期和基金类型。"}
    ];
  }
  function selectedQuestions(ctx) {
    const funds = ctx.funds;
    if (ctx.page === "指数行情") return indexQuestions(funds,true);
    const single = funds.length === 1;
    if (single && Number.isFinite(funds[0].performance) && Number.isFinite(funds[0].drawdown)) {
      return singleFundQuestions(funds[0], ctx.period);
    }
    if (!single && ctx.page === "基金比较" && funds.every(f=>Number.isFinite(f.performance) && Number.isFinite(f.drawdown))) {
      const bestReturn = Math.max(...funds.map(f=>f.performance));
      const smallestLoss = Math.max(...funds.map(f=>f.drawdown));
      const returnNames = funds.filter(f=>f.performance === bestReturn).map(f=>f.name).join("、");
      const drawdownNames = funds.filter(f=>f.drawdown === smallestLoss).map(f=>f.name).join("、");
      return [
        {question:"这 "+funds.length+" 只基金里，哪只的最大回撤最小？"},
        {question:"收益最高的基金，回撤也最小吗？",answer:"在当前比较区间，"+returnNames+"的区间收益最高，为 "+percent(bestReturn)+"。最大回撤幅度最小的是"+drawdownNames+"，从阶段高点到低点的跌幅为 "+Math.abs(smallestLoss).toFixed(2)+"%。"},
        {question:"回撤最小的基金，最大回撤发生在哪个时段？"}
      ];
    }
    const label = ctx.page.startsWith("ETF") ? "ETF" : "基金";
    const noun = single ? "这只"+label : "哪只"+label;
    const result = [
      {question:noun+(single ? "的区间收益是多少？" : "的区间收益最高？")},
      {question:noun+(single ? "的最大回撤有多大？" : "的最大回撤最小？")}
    ];
    if (ctx.page === "基金比较") {
      result.push({question:noun+(single ? "的年化波动率是多少？" : "的年化波动率最低？")});
      result.push({question:single ? "最大回撤发生在哪个时段？" : "回撤最小的基金，最大回撤发生在哪个时段？"});
    } else if (funds.every(f=>f.benchmark)) {
      const question = ctx.page.startsWith("ETF") ? (single?"这只 ETF 跟踪什么标的？":"已选 ETF 分别跟踪哪些标的？") :
        (single?"这只基金的比较基准是什么？":"已选基金的比较基准分别是什么？");
      result.push({question,answer:funds.map(f=>f.name+"对应「"+f.benchmark+"」").join("，")+"。"});
    } else result.push(riskQuestion);
    return result;
  }

  window.fundStarters = {
    forContext(ctx) {
      if (!ctx) return null;
      const isList = listPages.includes(ctx.page);
      if (!isList && ctx.page !== "基金比较" && ctx.page !== "基金分析" && !/基金.*池$/.test(ctx.page)) return null;
      if (ctx.funds?.length) return selectedQuestions(ctx);
      if (isList) return listQuestions(ctx,ctx.matchedRows || []);
      return [
        {question:"比较基金时该选什么时间区间？",answer:"选择各只基金均有净值记录的重叠时段，再统一比较起止日期。"},
        riskQuestion,
        {question:"怎样选择合适的对照基金？",answer:"可先比较投资范围、产品类型和业绩比较基准相近的基金，再对照同一区间的收益与回撤。"}
      ];
    }
  };
}());
