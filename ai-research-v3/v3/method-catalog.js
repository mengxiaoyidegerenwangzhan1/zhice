(() => {
  'use strict';
  const methods = [
    ['fund-research','基金深度分析报告','分析单只基金或 ETF 的收益、风险和持仓，整理成研究报告。',['基金','行业','分析'],'1.0.2',true],
    ['market-close','收盘复盘','结合全天行情、资金流向和市场新闻，梳理收盘后的市场表现。',['收盘'],'1.0.1',true],
    ['market-open','早盘梳理','汇总前一交易日行情和盘前新闻，梳理当日值得关注的行业与主题。',['早盘'],'1.0.1',true],
    ['industry-research','行业深度分析','从行业阶段、驱动力和验证指标出发，分析行业变化与潜在风险。',['行业'],'1.0.1',true],
    ['sector-news','板块新闻简报（到点执行）','按指定板块整理相关新闻，汇总研究要点，生成定时简报。',['板块','新闻'],'1.0.0',false],
    ['fund-compare','基金快速比较 Skill','比较两只及以上基金或 ETF 的收益、风险、费率和风格。',['基金','比较'],'1.0.1',false],
    ['project-summary','联调样例：项目摘要','根据提供的项目材料整理摘要，提取主要结论与待确认事项。',['分析'],'1.0.0',false]
  ].map(([id,title,description,tags,version,enabled])=>({id,title,description,tags,version,enabled,preset:enabled,source:'官方'}));

  const directory = {
    '持仓诊断': [
      ['查询组合快照','portfolio_snapshot_query','查看快照列表，或按标识读取一份快照的持仓明细。'],
      ['校验或转换组合快照','portfolio_snapshot_inspect','检查持仓数据的格式，或将快照转换为标准组合。'],
      ['创建持仓快照','portfolio_snapshot_create','根据持仓生成预览，确认后保存为独立快照。'],
      ['修改快照信息','portfolio_snapshot_update_metadata','更新已保存快照的名称和观察日期。'],
      ['删除持仓快照','portfolio_snapshot_delete','按快照标识删除已保存的持仓快照。'],
      ['预览账户持仓更新','portfolio_account_source_update_preview','预览账户持仓及来源的更新内容。'],
      ['确认账户持仓更新','portfolio_account_source_update_confirm','确认并保存预览过的账户持仓更新。'],
      ['组合分析','portfolio_analytics','查看组合诊断摘要、风险和收益指标。'],
      ['识别投资图片','investment_image_extract','识别投资图片并提取持仓信息。'],
      ['查询组合工作台','portfolio_workspace_query','查询组合、持仓及候选基金。'],
      ['预览组合工作台变更','portfolio_workspace_preview','预览组合、成员或持仓的变更。'],
      ['确认组合工作台变更','portfolio_workspace_confirm','确认并应用已预览的工作台变更。'],
      ['读取组合画像','portfolio_portrait_get','读取组合画像及刷新状态。'],
      ['配置组合监控','portfolio_monitoring_configure','预览或确认组合监控配置。'],
      ['查询组合监控','portfolio_monitoring_get','查看监控配置、依赖覆盖和候选信号。']
    ],
    '调仓建议': [
      ['生成组合规划','portfolio_planning_generate','根据目标组合和现有持仓生成配置规划。'],
      ['解读配置方案','portfolio_planning_explain','解释现有配置方案的目标、风险与权衡。'],
      ['单基金投资策略','portfolio_planning_fund_strategy','结合资金投入情况整理单只基金的投资策略。']
    ],
    '估值': [
      ['基金日内估值','','查询基金在交易日内的估值。'],
      ['组合盘中估值','','查看组合在盘中的估值变化。'],
      ['组合可视化','','以图表展示组合构成与估值表现。']
    ]
  };
  const tools=Object.entries(directory).flatMap(([category,rows])=>
    rows.map(([title,id,description])=>({title,id,description,category})));
  const categories=['持仓诊断','调仓建议','估值','基金','市场行情','图表','研究报告','用户画像','资产配置','dbhub_query'];
  window.studyMethodCatalog={methods,tools,categories};
})();
