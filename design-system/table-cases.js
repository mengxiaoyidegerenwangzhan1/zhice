// The six table examples mirror the supplied component artwork.
function auditTableCases() {
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const funds = [
    '基金名称1基金名称1基金名称1',
    '基金名称2基金名称2基金名称2基金名称2',
    '基金名称3基金名称3基金名称3',
    '基金名称4基金名称4基金名称4'
  ];
  const commonRules = [
    ['表面', '白底。横向分隔线为 1px、#EAEAEA，包含表格底线。三级明细组内无横线，组末用同样的分隔线'],
    ['行移入', '表体行移入时填充极浅灰 #FAFAFA，移出恢复白底。跨行合并标题保持白底'],
    ['顶部表头', 'PingFang SC Regular（400），14px，#999999'],
    ['表体', '正文使用 PingFang SC Regular（400），数字使用 Roboto Regular（400）。字号 14px，行高 20px，颜色 #333333'],
    ['尺寸', '原稿宽 1286px。普通单行 45px，两行 65px，含 1px 分隔线。普通单元格上下及左右 12px，行标题左右 10px'],
    ['缺失与空白', '缺失值为 PingFang SC Regular（400）的 --，颜色 #333333。示例中的空单元格保留为空']
  ];
  const selectionRule = ['多选框', '列宽 38px，控件 14 × 14px，圆角 4px。未选为透明底、#DCDCDC 描边。已选为 #6865A7 底、白色对勾，未全选用白色横线。表头支持全选和取消全选'];

  function wrapper(key, html) {
    return '<div class="audit-case-example" data-audit-case="' + key + '"><div class="audit-table-scroll">' + html + '</div></div>';
  }
  function selectHeader(half) {
    return '<th scope="col" class="audit-checkbox-cell"><input class="audit-checkbox" type="checkbox" data-audit-select-all aria-label="全选当前表格"' + (half ? ' data-indeterminate' : '') + '></th>';
  }
  function selectCell(key, checked) {
    return '<td class="audit-checkbox-cell"><input class="audit-checkbox" type="checkbox" data-audit-row-select="' + key + '" aria-label="选择当前行"' + (checked ? ' checked' : '') + '></td>';
  }
  function cols(checkbox, fieldCount, dataCount) {
    return '<colgroup>' + (checkbox ? '<col class="audit-checkbox-column">' : '')
      + Array.from({length: fieldCount}, (_, index) => '<col class="audit-field-column audit-field-column-' + (index + 1) + '">').join('')
      + Array.from({length: dataCount}, (_, index) => '<col class="audit-data-column audit-data-column-' + (index + 1) + '">').join('') + '</colgroup>';
  }
  function table(key, className, colgroup, head, rows) {
    return '<table class="audit-table audit-screenshot-table audit-table-case-' + key + ' ' + className + '">' + colgroup
      + '<thead><tr class="audit-table-header">' + head + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }
  function fundHeaders(doubleTitle = false) {
    return funds.map((name, index) => {
      const span = doubleTitle ? ' colspan="3"' : '';
      const title = doubleTitle && index === 1 ? name + '基金名称2' : name;
      return '<th scope="col" class="audit-number-heading"' + span + '>' + escape(title) + '</th>';
    }).join('');
  }
  function valueCell(value, color, attributes = '') {
    const missing = value === '--';
    const empty = value === '';
    const number = Number(String(value).replace('%', ''));
    const kind = missing ? 'missing' : empty ? 'empty' : color ? (number > 0 ? 'positive' : number < 0 ? 'negative' : 'zero') : 'neutral';
    return '<td class="audit-number audit-value-' + kind + '"' + attributes + '>' + escape(value) + '</td>';
  }
  function values(items, color = true) {
    return items.map(value => valueCell(value, color)).join('');
  }
  function label(value, options = {}) {
    const text = '<span class="audit-row-label">' + value + '</span>';
    if (options.node) return '<button type="button" class="audit-row-heading" data-row-toggle="' + options.node + '" aria-expanded="' + (options.expanded !== false) + '"><img class="audit-arrow-open" src="assets/table-reference/51fa3.svg" width="14" height="14" alt=""><img class="audit-arrow-closed" src="assets/table-reference/f4160.svg" width="14" height="14" alt="">' + text + '</button>';
    return '<span class="audit-row-heading">' + text + '</span>';
  }
  function result(key, name, html, rules, note) {
    return {key, name, html: wrapper(key, html), rules: commonRules.concat(rules), note};
  }
  function rating() {
    return '<span class="audit-table-rating" role="img" aria-label="评分2/5">' + Array.from({length: 5}, (_, index) => '<img src="assets/table-reference/' + (index < 2 ? '6f09c' : '5a853') + '.svg" alt="">').join('') + '</span>';
  }

  const shortName = '这里是基金名称这里是基金名称';
  const longName = '这里是基金名称这里是基金名称这里是基金名称这里是基金名称';
  const linkText = '这里是链接这里是链接这里是链接';
  const comprehensiveRows = [
    '<span class="audit-shot-name">' + shortName + '</span>',
    '<span class="audit-shot-name-wrap">' + longName + '</span>',
    '<span class="audit-shot-name-ellipsis" title="' + longName + '">' + longName + '</span>'
  ].map((name, index) => '<tr class="audit-shot-body' + (index === 1 ? ' audit-shot-wrap-row' : '') + '">' + selectCell('reference-comprehensive-' + index, false)
    + '<td class="audit-fund-name">' + name + '</td><td>' + rating() + '</td><td><a class="audit-table-link" href="#component-table">' + linkText + '</a></td>'
    + '<td class="audit-number audit-value-neutral">3222.00</td><td class="audit-number audit-value-neutral">35</td></tr>');
  const comprehensive = result('comprehensive', '普通综合表格',
    table('comprehensive', 'audit-table-comprehensive audit-table-selectable', cols(true, 0, 5),
      selectHeader(false) + ['基金名称', '评分', '链接', '金额 (万元)', '数量 (个)'].map(name => '<th scope="col">' + name + '</th>').join(''), comprehensiveRows), [
      selectionRule,
      ['结构', '最左多选列，其后依次为基金名称、评分、链接、金额（万元）、数量（个）'],
      ['列宽', '原稿从左至右为 38、332、155、332、214、215px'],
      ['长名称', '三行分别展示短名称、两行名称、单行省略名称；省略项通过title保留完整名称'],
      ['样式', '五颗评分星各 14.8px，间距 4px。链接为 #6078D9。内容列及对应表头统一左对齐']
    ], '支持单行选择与表头全选；长名称分别展示换行和省略规则。');

  const numericRows = Array.from({length: 3}, (_, index) => '<tr class="audit-shot-body">' + selectCell('reference-numeric-' + index, index !== 1)
    + values(['3222.00万元', '3222.00万元', '--', ''], false) + '</tr>');
  const numeric = result('numeric', '纯数字表格',
    table('numeric', 'audit-table-numeric audit-table-selectable', cols(true, 0, 4), selectHeader(true) + fundHeaders(), numericRows), [
      selectionRule,
      ['结构', '多选列后是四个等宽基金列，原稿每列 312px'],
      ['数据', '每行前两列3222.00万元，第三列--，第四列保持空白；数值与对应列标题居右'],
      ['初始选择', '第一、第三行选中，中间行未选；表头半选；初始化及导出不得清空当前勾选']
    ], '数量金额使用中性色，不按正数套用收益红色。');

  const rowTitleRows = Array.from({length: 3}, (_, index) => '<tr class="audit-shot-body">' + selectCell('reference-row-title-' + index, false)
    + '<th scope="row">' + label('这里是行标题') + '</th>' + values(['32.00%', '--', '', '-32.00%']) + '</tr>');
  const rowTitle = result('row-title', '带行标题',
    table('row-title', 'audit-table-numeric audit-table-selectable', cols(true, 1, 4), selectHeader(false) + '<th scope="col" class="audit-field-heading">这里是总标题</th>' + fundHeaders(), rowTitleRows), [
      selectionRule,
      ['结构', '左侧依次是 38px 多选列、118px 行标题列，右侧为四个等宽基金列'],
      ['数据', '行标题居左，数值和对应表头居右。正值 #BF3A61，负值 #36B397']
    ], '行标题对应各基金指标数据，文字居左、数值居右。');

  function foldedRow(key, title, data, options = {}) {
    const node = options.node ? ' data-node="' + options.node + '"' : '';
    const parent = options.parent ? ' data-parent="' + options.parent + '"' : '';
    const level = options.third ? 'audit-level-2 audit-shot-third' : options.total ? 'audit-total audit-shot-root' : 'audit-level-1 audit-shot-second';
    return '<tr class="' + level + (options.wrap ? ' audit-shot-wrap-row' : '') + '" data-audit-row="' + key + '"' + node + parent + (options.hidden ? ' hidden' : '') + '>'
      + '<th scope="row">' + label(title, options) + '</th>' + values(data) + '</tr>';
  }
  const foldedRows = [
    foldedRow('reference-fold-total-row', '汇总行 (一级)', ['160.00%', '32.00%', '', '-160.00%'], {total: true, node: 'reference-fold-total', expanded: true}),
    foldedRow('reference-fold-static', '二级正常1', ['100.00%', '--', '', '-100.00%'], {parent: 'reference-fold-total'}),
    foldedRow('reference-fold-second-row', '二级带折叠', ['40.00%', '--', '', '-40.00%'], {node: 'reference-fold-second', parent: 'reference-fold-total', expanded: true}),
    foldedRow('reference-fold-detail-1', '三级标题', ['10.00%', '--', '', '-10.00%'], {third: true, parent: 'reference-fold-second'}),
    foldedRow('reference-fold-detail-2', '三级标题三级标题', ['10.00%', '--', '', '-10.00%'], {third: true, parent: 'reference-fold-second', wrap: true}),
    foldedRow('reference-fold-detail-3', '三级标题', ['10.00%', '--', '', '-10.00%'], {third: true, parent: 'reference-fold-second'}),
    foldedRow('reference-fold-detail-4', '三级标题', ['10.00%', '--', '', '-10.00%'], {third: true, parent: 'reference-fold-second'}),
    foldedRow('reference-fold-last-row', '二级带<br>折叠', ['20.00%', '--', '', '-20.00%'], {node: 'reference-fold-last', parent: 'reference-fold-total', expanded: false, wrap: true}),
    foldedRow('reference-fold-last-1', '三级标题', ['10.00%', '--', '', '-10.00%'], {third: true, parent: 'reference-fold-last', hidden: true}),
    foldedRow('reference-fold-last-2', '三级标题', ['10.00%', '--', '', '-10.00%'], {third: true, parent: 'reference-fold-last', hidden: true})
  ];
  const folded = result('folded', '带行标题 · 带折叠',
    table('folded', 'audit-table-numeric', cols(false, 1, 4), '<th scope="col" class="audit-field-heading">这里是总标题</th>' + fundHeaders(), foldedRows), [
      ['选择列', '此例无多选列'],
      ['列宽与汇总', '行标题列宽 124px。汇总标题用 PingFang SC Medium（500），汇总数字用 Roboto Medium（500）'],
      ['初始展开', '汇总行和首个二级折叠组默认展开。末组默认收起，展开后显示两个 10.00% 子项'],
      ['行头左内距', '一级 10px，二级 28px，三级 46px。有折叠箭头时从箭头外框起算，无箭头时从文字起算。箭头尺寸 14px'],
      ['三级', '字号 12px，行高 17px，标题 #666666。单行 41px，两行 58px，组末另加 1px 分隔线'],
      ['涨跌色', '正值 #BF3A61，负值 #36B397']
    ], '父子行通过层级关联，收起父级后保留内部展开状态。');

  const bottomRows = [
    '<tr class="audit-shot-body"><th scope="row">' + label('行标题1') + '</th>' + values(['32.00%', '32.00%', '', '-32.00%']) + '</tr>',
    '<tr class="audit-shot-body"><th scope="row">' + label('行标题2') + '</th>' + values(['32.00%', '32.00%', '', '-32.00%']) + '</tr>',
    '<tr class="audit-total audit-shot-bottom-total"><th scope="row">' + label('汇总行 (一级)') + '</th>' + values(['64.00%', '64.00%', '', '-64.00%']) + '</tr>'
  ];
  const bottomTotal = result('bottom-total', '带下方汇总',
    table('bottom-total', 'audit-table-numeric', cols(false, 1, 4), '<th scope="col" class="audit-field-heading">这里是总标题</th>' + fundHeaders(), bottomRows), [
      ['结构', '左侧 124px 行标题列，右侧四个等宽基金列。底部汇总行保留通栏底线'],
      ['汇总与涨跌', '汇总标题使用 PingFang SC Medium（500），汇总数字使用 Roboto Medium（500）。正值 #BF3A61，负值 #36B397']
    ], '汇总行位于明细下方，展示各列的合计值。');

  // Twelve equal tracks support four header columns and three body columns in the same table.
  const doubleRows = [['32.00%', '32.00%', '-32.00%'], ['-32.00%', '-32.00%', '--']].map((items, index) => {
    const group = index === 0 ? '<th scope="rowgroup" rowspan="2" class="audit-double-rowgroup">行标题1</th>' : '';
    return '<tr class="audit-shot-body">' + group
      + '<th scope="row" class="audit-double-row-label">' + label('行标题1') + '</th>'
      + items.map(value => valueCell(value, false, ' colspan="4"')).join('') + '</tr>';
  });
  const doubleTitle = result('double-title', '左侧双层标题',
    table('double-title', 'audit-table-numeric', cols(false, 2, 12), '<th scope="col" colspan="2" class="audit-field-heading">这里是总标题</th>' + fundHeaders(true), doubleRows), [
      ['表头', '左侧总标题 248px，右侧四等分，基金名居右、顶部对齐。原稿表头两行高 65px'],
      ['表体', '左侧两列各 124px，外层标题跨两行，内层标题 #666666。数据区三等分，正负值统一 #333333，居右'],
      ['分隔线', '合并标题右侧有 1px 竖线。两条明细之间的横线从内层标题开始，表格底线通栏']
    ], '左侧两层标题用跨列的总标题和跨行的外层标题表达。');

  return [comprehensive, numeric, rowTitle, folded, bottomTotal, doubleTitle];
}

// Keep native checkbox state in exported HTML; folding/selection belongs to auditRuntime.
function auditTableCaseRuntime(root = document) {
  root.querySelectorAll('.audit-case-example [data-audit-select-all][data-indeterminate]').forEach(input => {
    input.indeterminate = true;
  });
}
