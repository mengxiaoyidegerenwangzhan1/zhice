(() => {
  'use strict';
  const numericText = value => /^(?:[+−-]?\d[\d,.]*(?:\s*(?:%|亿|亿元|万|万元|天|年|个月|只|人))?|[+−-]?\d[\d,.]*\s*[/|]\s*\d[\d,.]*|--|—|无)?$/.test(value.trim());
  const normalize = text => text.replace(/\s+/g,' ').trim();
  const labelHeader = /^(?:序号|代码|证券代码|债券代码|证券名称|债券名称|基金名称|名称|资产|行业|收益.*因子|字段|内容|项目|指标|时间|日期|报告时间|年份|时段|事件|类型|产品类型|持有状态|申赎状态|判断|来源|任职信息|基金类型|股票代码\/名称)$/;
  let observer;

  function unpackStackedRows(table) {
    const stacked=table.querySelector('tbody tr:has(.is-stack-3)');
    if (stacked && !table.dataset.unpacked) {
      const cells=[...stacked.cells];
      const labels=cells[0].innerHTML.split(/<br\s*\/?\s*>/i).slice(0,3);
      const values=cells.map(cell=>[...cell.children].filter(el=>el.matches('span,em')));
      if(labels.length===3) {
        labels.forEach((label,index)=>{
          const row=document.createElement('tr');
          const heading=document.createElement('th'); heading.scope='row'; heading.innerHTML=label;row.append(heading);
          cells.slice(1).forEach((cell,column)=>{const next=document.createElement('td');next.innerHTML=values[column+1][index]?.outerHTML || '';row.append(next);});
          stacked.before(row);
        });
        stacked.remove();
      }
      table.dataset.unpacked='true';
    }
    // Old mock tables contained an entirely empty “时段” column beside the row label.
    const headers=[...table.querySelectorAll('thead tr:last-child > *')];
    const index=headers.findIndex((h,i)=>i>0&&normalize(h.textContent)==='时段');
    if(index>0 && [...table.tBodies].every(body=>[...body.rows].every(row=>row.cells[index]&&!normalize(row.cells[index].textContent)))) {
      [...table.rows].forEach(row=>row.cells[index]?.remove());
    }
  }
  function prepare(table) {
    if(table.dataset.fundTableReady) return;
    unpackStackedRows(table);
    table.dataset.fundTableReady='true';
    table.classList.add('audit-table','fund-canonical-table');
    const rows=[...table.tBodies].flatMap(body=>[...body.rows]);
    const headers=[...table.querySelectorAll('thead tr:last-child > *')];
    const columnCount=Math.max(headers.length,...rows.map(row=>[...row.cells].reduce((n,cell)=>n+cell.colSpan,0)),1);
    const numericColumns=new Set();
    for(let i=1;i<columnCount;i++) {
      const heading=normalize(headers[i]?.textContent || '');
      if(labelHeader.test(heading) || /代码|名称|类型|行业|状态|日期|开始|结束/.test(heading))continue;
      const values=rows.filter(row=>![...row.cells].some(cell=>cell.colSpan>1)).map(row=>normalize(row.cells[i]?.textContent||'')).filter(Boolean);
      if(values.length && values.filter(numericText).length/values.length>=.75) numericColumns.add(i);
    }
    const specialNumeric=table.matches('.fund-stage-table,.fund-rolling-table,.fund-risk-table,.fund-prob-table,.fund-region-table,.fund-bar-table,.fund-chart-data-table,.fund-weight-matrix');
    const nonLabelColumns=headers.map((header,i)=>i>0&&!labelHeader.test(normalize(header.textContent))?i:-1).filter(i=>i>0);
    const mode=specialNumeric || (numericColumns.size && numericColumns.size>=Math.max(1,nonLabelColumns.length*.7)) ? 'numeric':'comprehensive';
    table.classList.add('audit-table-'+mode);
    table.dataset.fundTableType=mode;
    table.style.setProperty('--fund-table-min-width',Math.max(280,(mode==='numeric'?120:200)+(columnCount-1)*110)+'px');
    if(!table.querySelector(':scope > colgroup')) {
      const group=document.createElement('colgroup');
      headers.forEach((header,index)=>{
        const col=document.createElement('col');const label=normalize(header.textContent);
        if(index===0)col.style.width=(label==='序号'?60:mode==='numeric'?120:260)+'px';
        else if(/代码/.test(label))col.style.width='120px';
        else if(/证券名称|债券名称/.test(label))col.style.width='180px';
        group.append(col);
      });
      if(group.children.length)table.prepend(group);
    }
    if (mode==='numeric' && specialNumeric && !table.matches('.fund-weight-matrix')) headers.forEach((_,i)=>{if(i>0)numericColumns.add(i);});
    table.querySelectorAll('thead tr').forEach(row=>row.classList.add('audit-table-header'));
    table.querySelectorAll('thead th').forEach((cell,i)=>{cell.scope='col';if(mode==='numeric'&&numericColumns.has(i))cell.classList.add('audit-number-heading');});
    rows.forEach(row=>{
      const summary=row.classList.contains('is-total-row') || row.classList.contains('fund-total-row') || /^(?:合计|总计|集中度|总收益)/.test(normalize(row.textContent));
      row.classList.add(summary?'audit-total':'audit-level-1');
      const explicit=Number(row.dataset.level || row.getAttribute('aria-level') || 1);
      if(row.classList.contains('is-level-2') || explicit>1){row.classList.remove('audit-level-1');row.classList.add('audit-level-2');}
      let column=0;
      [...row.cells].forEach((cell,index)=>{
        if(index===0 || labelHeader.test(normalize(headers[column]?.textContent||'')))cell.classList.add('fund-table-label');
        if(mode==='numeric'&&numericColumns.has(column))cell.classList.add('audit-number');
        else cell.classList.add('audit-value-text');
        if(index===0 && cell.colSpan===1 && !cell.querySelector('.audit-row-heading')) {
          const span=document.createElement('span');span.className='audit-row-heading';while(cell.firstChild)span.append(cell.firstChild);cell.append(span);
        }
        column+=cell.colSpan;
      });
    });
    table.querySelectorAll('tbody th,tbody td').forEach(cell=>{
      if(cell.classList.contains('audit-number'))return;
      const walker=document.createTreeWalker(cell,NodeFilter.SHOW_TEXT);const nodes=[];
      while(walker.nextNode())if(!walker.currentNode.parentElement.closest('.audit-numeral'))nodes.push(walker.currentNode);
      nodes.forEach(node=>{
        const parts=node.textContent.split(/(\d+(?:\.\d+)?)/g);if(parts.length===1)return;
        const fragment=document.createDocumentFragment();parts.forEach((part,index)=>{if(index%2){const span=document.createElement('span');span.className='audit-numeral';span.textContent=part;fragment.append(span);}else fragment.append(document.createTextNode(part));});node.replaceWith(fragment);
      });
    });
    if(!table.parentElement.matches('.fund-table-wrap,.fund-matrix-wrap,.fund-canonical-scroll')) {
      const scroll=document.createElement('div');scroll.className='fund-canonical-scroll';table.before(scroll);scroll.append(table);
    }
    const wrap=table.parentElement;wrap.classList.add('fund-canonical-scroll');wrap.tabIndex=0;wrap.setAttribute('role','region');
    wrap.setAttribute('aria-label',(table.closest('.fund-panel')?.querySelector('h2 .zc-title-help-label,h2')?.textContent.trim()||'基金分析')+'表格');
    // Reuse existing hierarchy metadata; do not invent hierarchy for flat data.
    function updateRows(){
      const nodeMap=new Map(rows.filter(row=>row.dataset.node).map(row=>[row.dataset.node,row]));
      rows.forEach(row=>{let parent=row.dataset.parent;let hidden=false;const seen=new Set();while(parent&&!seen.has(parent)){seen.add(parent);const ancestor=nodeMap.get(parent);if(!ancestor)break;if(ancestor.querySelector('[data-row-toggle]')?.getAttribute('aria-expanded')==='false')hidden=true;parent=ancestor.dataset.parent;}if(row.dataset.parent)row.hidden=hidden;});
    }
    table.addEventListener('click',event=>{
      if(event.target.closest('input,select,a'))return;
      const toggle=event.target.closest('[data-row-toggle]')||event.target.closest('tr')?.querySelector('[data-row-toggle]');
      if(!toggle)return;toggle.setAttribute('aria-expanded',String(toggle.getAttribute('aria-expanded')!=='true'));updateRows();
    });
    updateRows();
  }
  function mount(root=document.querySelector('.fund-page')) {
    observer?.disconnect();
    if(!root)return;
    root.querySelectorAll('table').forEach(prepare);
    observer=new MutationObserver(records=>{
      const added=records.flatMap(record=>[...record.addedNodes]).filter(node=>node.nodeType===1);
      added.forEach(node=>{if(node.matches('table'))prepare(node);node.querySelectorAll?.('table').forEach(prepare);});
    });
    observer.observe(root,{childList:true,subtree:true});
  }
  window.FundTables={mount};
})();
