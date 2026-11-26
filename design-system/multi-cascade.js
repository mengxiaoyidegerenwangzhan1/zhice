(function installMultiCascade() {
  'use strict';
  const INLINE_CSS = ".zcm-cascader,.zcm-cascader *{box-sizing:border-box}\n.zcm-cascader{width:max-content;color:#333;font:400 14px/20px \"PingFang SC\",\"Microsoft YaHei\",sans-serif}\n.zcm-cascader button,.zcm-cascader input{font:inherit}\n.zcm-cascader button{appearance:none;border:0;margin:0;cursor:pointer}\n.zcm-trigger{position:relative;display:flex;align-items:center;gap:8px;width:max-content;height:32px;padding:0 12px;cursor:pointer;border:1px solid transparent;border-radius:20px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.08)}\n.zcm-trigger:hover,\n.zcm-trigger:has(>.zcm-toggle:focus-visible),\n.zcm-cascader[data-zcm-open=\"true\"] .zcm-trigger{border-color:#b9b8d8}\n.zcm-toggle:focus-visible{outline:none}\n.zcm-toggle{position:absolute;inset:0;width:100%;height:100%;padding:0;background:transparent;border-radius:inherit}\n.zcm-trigger>:not(.zcm-toggle){position:relative}\n.zcm-trigger .zcm-field-label,.zcm-trigger .zcm-placeholder,.zcm-trigger .zcm-collapse{pointer-events:none}\n.zcm-field-label{flex:none;width:56px;color:#999;white-space:nowrap}\n.zcm-values,.zcm-value{display:flex;align-items:center}\n.zcm-values{gap:8px}\n.zcm-value{gap:2px}\n.zcm-value-label,.zcm-count{color:#6865a7;font-weight:500;white-space:nowrap}\n.zcm-remove{display:grid;flex:0 0 12px;place-items:center;width:12px;height:24px;padding:0;background:transparent;border-radius:2px}\n.zcm-remove img{display:block;width:12px;height:12px}\n.zcm-placeholder{width:197px;color:#999;white-space:nowrap}\n.zcm-collapse{display:block;flex:0 0 12px;width:12px;height:12px;color:#999999}\n.zcm-cascader[data-zcm-open=\"false\"] .zcm-collapse{transform:rotate(180deg)}\n.zcm-cascader[data-zcm-open=\"true\"] .zcm-collapse{color:#6865a7}\n.zcm-cascader svg{display:block;flex:none}\n.zcm-cascader button:not(.zcm-toggle):focus-visible,.zcm-check input:focus-visible+svg{outline:1px solid #6865a7;outline-offset:2px}\n.zcm-menu{display:flex;margin-top:8px;width:371px;height:210px;padding:8px 0;border:1px solid #b9b8d8;border-radius:8px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.08);overflow:hidden}\n.zcm-menu[hidden]{display:none}\n.zcm-groups{flex:0 0 160px;width:160px;height:192px;overflow:hidden}\n.zcm-divider{flex:0 0 1px;width:1px;height:192px;background:#eaeaea}\n.zcm-leaves{flex:0 0 208px;width:208px;height:192px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#c9c9d3 transparent}\n.zcm-row{display:flex;align-items:center;gap:8px;width:100%;height:32px;margin:0;padding:0 12px;background:#fff;color:#333;font:inherit;cursor:pointer;white-space:nowrap}\n.zcm-row:hover{background:#f7f7f9}\n.zcm-row.is-browsing{background:#f7f7f9}\n.zcm-row.is-selected{color:#6865a7}\n.zcm-check{position:relative;display:block;flex:0 0 14px;width:14px;height:14px}\n.zcm-check input{position:absolute;z-index:1;inset:0;appearance:none;width:14px;height:14px;margin:0;padding:0;border:0;opacity:0;cursor:pointer}\n.zcm-check svg{width:14px;height:14px;pointer-events:none}\n.zcm-branch{display:flex;flex:1;align-items:center;justify-content:space-between;gap:8px;min-width:0;height:32px;padding:0;background:transparent;color:inherit;font:inherit!important;text-align:left}\n.zcm-branch-label,.zcm-leaf-label{min-width:0;overflow:hidden;text-overflow:ellipsis}\n.zcm-branch-label{flex:1}\n.zcm-arrow{flex:0 0 12px;width:12px;height:12px}\n#visual-panel-components #component-select{padding-bottom:8px}\n#component-select .zcm-component-preview{max-width:100%;overflow-x:auto;padding:12px}\n@media print{.zcm-trigger,.zcm-menu{box-shadow:none}}\n";
  const INLINE_ICONS = {"arrow": "<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4.5 2.5L8 6L4.5 9.5\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke=\"#999999\"/>\n</svg>\n", "mixed": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect width=\"14\" height=\"14\" rx=\"4\" fill=\"#6865A7\"/>\n<rect x=\"3\" y=\"6.39999\" width=\"8\" height=\"1.2\" rx=\"0.6\" fill=\"white\"/>\n</svg>\n", "checked": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect width=\"14\" height=\"14\" rx=\"4\" fill=\"#6865A7\"/>\n<path d=\"M3.7002 7.15001L5.7502 9.20001L10.3002 4.70001\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke=\"white\"/>\n</svg>\n", "unchecked": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"0.5\" y=\"0.5\" width=\"13\" height=\"13\" rx=\"3.5\" fill=\"white\"/>\n<rect x=\"0.5\" y=\"0.5\" width=\"13\" height=\"13\" rx=\"3.5\" stroke=\"#C9C9D3\"/>\n</svg>\n", "collapse": "<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M2.5 7.5L6 4L9.5 7.5\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke=\"#999999\"/>\n</svg>\n"};
  const FIGMA = 'https://www.figma.com/design/FREXPoab3AHT0GRuMht2vf?node-id=80-379';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function multiCascadeData() {
    return [
      {label:'股票型',children:['普通股票型','行业股票型-科技','行业股票型-消费','行业股票型-医药卫生','行业股票型-制造','行业股票型-其他','被动指数股票型','增强指数股票型']},
      {label:'混合型',children:['偏股混合型','平衡混合型','偏债混合型','灵活配置型']},
      {label:'债券型',children:['纯债型','一级债基','二级债基','可转债型','指数债券型']},
      {label:'货币型',children:['普通货币型']},
      {label:'FOF',children:['股票型FOF','混合型FOF','债券型FOF','养老目标FOF']}
    ];
  }

  function multiCascadeRuntime(scope = document) {
    const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const data = multiCascadeData();
    const removeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAO9JREFUeAHtlUEOgjAURPs5AVdhBezwJngCj2C5gTfQm+gOWHEVb1D/J22CTW2nJO6YxDTCzDwIv6DUoVxN03QZx7FXmZJMKFcEvDcius/zfFWgxCsZ+S3LUkYBxpjBrhqBiEe8LltV1Xt7nkIhvlXNV7OW86rruh6Q8rZtte8JAhAIUh4FxCBoeRIQgthSqBwC+BAnpBwGiHh/PHnp7N9X0zQnJFcgJjuu3eZQh+6T5B34D3QNASMMAX5NC7pPooDUKKIQ2lOeA6G95SiEPHMvb0S0PATh3JlzD3fua0zZVOaWi8TrJuyv8r8FhyB9AP1b4eVRtwZPAAAAAElFTkSuQmCC';
    const icons = {
      arrow:'<svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6L4.5 9.5" stroke="#999999" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      mixed:'<svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect width="14" height="14" rx="4" fill="#6865A7"/><rect x="3" y="6.39999" width="8" height="1.2" rx=".6" fill="white"/></svg>',
      checked:'<svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect width="14" height="14" rx="4" fill="#6865A7"/><path d="M3.7002 7.15001L5.7502 9.20001L10.3002 4.70001" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      unchecked:'<svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x=".5" y=".5" width="13" height="13" rx="3.5" fill="white" stroke="#C9C9D3"/></svg>',
      collapse:'<svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 7.5L6 4L9.5 7.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
    const allIds = data.flatMap((group,g) => group.children.map((_,i) => g + '-' + i));
    scope.querySelectorAll('.zcm-cascader').forEach(widget => {
      if (widget.dataset.zcmMounted) return;
      widget.dataset.zcmMounted = 'true';
      let supplied = {};
      try { supplied = JSON.parse(widget.dataset.zcmState || '{}'); } catch (_) {}
      const selected = new Set((supplied.selected || []).filter(id => allIds.includes(id)));
      let active = Math.max(0,Math.min(data.length - 1,Number(supplied.active) || 0));
      let browsed = supplied.browsed === true;
      let open = supplied.open === true;
      let rendering = false;
      function ordered() { return allIds.filter(id => selected.has(id)); }
      function path(id) { const [g,i]=id.split('-').map(Number); return data[g].terminal ? data[g].label : data[g].label + ' / ' + data[g].children[i]; }
      function check(name,key,checked,mixed) {
        return '<span class="zcm-check"><input type="checkbox" aria-label="' + esc(name) + '" data-zcm-check="' + key + '"' + (checked?' checked':'') + (mixed?' data-zcm-mixed="true"':'') + '>' + icons[mixed?'mixed':checked?'checked':'unchecked'] + '</span>';
      }
      function render(focus, scroll = widget.querySelector('.zcm-leaves')?.scrollTop || 0) {
        rendering = true;
        try {
          const ids=ordered();
          widget.dataset.zcmOpen=String(open);
          widget.dataset.zcmState=JSON.stringify({selected:ids,active,browsed,open});
          const first = ids[0];
          let option = '';
          if (first) {
            const label = esc(path(first));
            option = '<span class="zcm-value"><span class="zcm-value-label" title="'+label+'">'+label+'</span><button type="button" class="zcm-remove" aria-label="移除'+label+'" data-zcm-remove="'+first+'"><img src="'+removeImage+'" alt=""></button></span>';
          }
          const hidden = ids.slice(1);
          const count = hidden.length ? '<span class="zcm-count" title="'+esc(hidden.map(path).join('\n'))+'">+'+hidden.length+'</span>' : '';
          const values = option+count || '<span class="zcm-placeholder">请选择</span>';
          const allSelected = ids.length === allIds.length;
          const someSelected = ids.length > 0 && !allSelected;
          const groups='<label class="zcm-row zcm-all'+(allSelected?' is-selected':'')+'">'+check('全部','all',allSelected,someSelected)+'<span>全部</span></label>'+data.map((group,g)=>{
            const count=group.children.filter((_,i)=>selected.has(g+'-'+i)).length;
            return '<div class="zcm-row'+(browsed&&active===g&&!group.terminal?' is-browsing':'')+(count===group.children.length?' is-selected':'')+'">'+check('选择'+group.label,'g'+g,count===group.children.length,count>0&&count<group.children.length)+'<button type="button" class="zcm-branch" data-zcm-branch="'+g+'" aria-label="'+(group.terminal?'选择':'展开')+esc(group.label)+'"'+(!group.terminal?' aria-expanded="'+(open&&active===g)+'"':'')+'><span class="zcm-branch-label">'+esc(group.label)+'</span>'+(!group.terminal?'<span class="zcm-arrow">'+icons.arrow+'</span>':'')+'</button></div>';
          }).join('');
          const leaves=data[active].children.map((label,i)=>{const id=active+'-'+i;return '<label class="zcm-row'+(selected.has(id)?' is-selected':'')+'">'+check('选择'+label,'l'+id,selected.has(id),false)+'<span class="zcm-leaf-label">'+esc(label)+'</span></label>';}).join('');
          widget.innerHTML='<div class="zcm-trigger"><button type="button" class="zcm-toggle" aria-label="基金类型，多选级联选择器" aria-haspopup="dialog" aria-expanded="'+open+'"></button><span class="zcm-field-label">基金类型</span><div class="zcm-values">'+values+'</div><span class="zcm-collapse">'+icons.collapse+'</span></div><div class="zcm-menu" role="dialog" aria-label="基金类型选项"'+(open?'':' hidden')+'><div class="zcm-groups" role="group" aria-label="一级分类">'+groups+'</div><div class="zcm-divider"></div><div class="zcm-leaves" role="group" aria-label="'+esc(data[active].label)+'子级">'+leaves+'</div></div>';
          widget.querySelectorAll('[data-zcm-mixed]').forEach(input=>{input.indeterminate=true;});
          widget.querySelector('.zcm-leaves').scrollTop=scroll;
          if(focus)widget.querySelector(focus)?.focus({preventScroll:true});
        } finally {rendering=false;}
      }
      function emit() {
        const ids=ordered();
        widget.dispatchEvent(new CustomEvent('cascaderchange',{bubbles:true,detail:{values:ids,paths:ids.map(path),selected:ids.map(id=>{const[g,i]=id.split('-').map(Number);return {value:id,group:data[g].label,label:data[g].children[i]};})}}));
      }
      function toggleGroup(g) {
        const ids=data[g].children.map((_,i)=>g+'-'+i), next=!ids.every(id=>selected.has(id));
        ids.forEach(id=>next?selected.add(id):selected.delete(id));
      }
      function browse(groupIndex, focus) {
        active = groupIndex;
        browsed = true;
        render(focus, 0);
      }
      function close(focus) {if(open){open=false;render(focus?'.zcm-toggle':undefined);}}
      widget.addEventListener('change',event=>{
        const input=event.target.closest('[data-zcm-check]');if(!input)return;
        const key=input.dataset.zcmCheck;
        if(key==='all'){const next=input.checked;allIds.forEach(id=>next?selected.add(id):selected.delete(id));}
        else if(key[0]==='g')toggleGroup(Number(key.slice(1)));
        else {const id=key.slice(1);input.checked?selected.add(id):selected.delete(id);}
        render('[data-zcm-check="'+key+'"]');emit();
      });
      widget.addEventListener('click',event=>{
        const remove = event.target.closest('[data-zcm-remove]');
        if (remove) {
          selected.delete(remove.dataset.zcmRemove);
          render(selected.size ? '.zcm-remove' : '.zcm-toggle');
          emit();
          return;
        }
        if(event.target.closest('.zcm-trigger')){open=!open;render('.zcm-toggle');return;}
        const branch=event.target.closest('[data-zcm-branch]');
        if(branch){const g=Number(branch.dataset.zcmBranch);if(data[g].terminal){toggleGroup(g);render('[data-zcm-branch="'+g+'"]');emit();}else browse(g,'[data-zcm-branch="'+g+'"]');}
      });
      widget.addEventListener('keydown',event=>{
        if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();close(true);return;}
        if(event.target.closest('.zcm-toggle')&&event.key==='ArrowDown'){event.preventDefault();event.stopPropagation();open=true;render('[data-zcm-check="all"]');return;}
        const group=event.target.closest('.zcm-groups'), leaves=event.target.closest('.zcm-leaves');
        if(!group&&!leaves)return;
        if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
          event.preventDefault();event.stopPropagation();
          const list=Array.from((group||leaves).querySelectorAll(event.target.matches('input')?'input':'.zcm-branch'));
          const idx=list.indexOf(event.target), next=event.key==='Home'?0:event.key==='End'?list.length-1:Math.max(0,Math.min(list.length-1,idx+(event.key==='ArrowDown'?1:-1)));
          list[next]?.focus();
        }else if(group&&event.key==='ArrowRight'){
          event.preventDefault();
          event.stopPropagation();
          const branch = event.target.closest('.zcm-row')?.querySelector('[data-zcm-branch]');
          if (branch) browse(Number(branch.dataset.zcmBranch), '.zcm-leaves input');
          else widget.querySelector('.zcm-leaves input')?.focus();
        }else if(leaves&&event.key==='ArrowLeft'){event.preventDefault();event.stopPropagation();widget.querySelector('[data-zcm-branch="'+active+'"]')?.focus();}
      });
      const boundary=widget.closest('.zcm-component')||widget;
      boundary.addEventListener('focusout',event=>{if(!rendering&&event.relatedTarget&&!boundary.contains(event.relatedTarget))close(false);});
      document.addEventListener('pointerdown',event=>{if(!boundary.contains(event.target))close(false);});
      render();
    });
  }

  function markup(state) {return '<div class="zcm-cascader" data-zcm-state="'+escape(JSON.stringify(state||{}))+'"></div>';}
  function state(widget) {return JSON.parse(widget.dataset.zcmState);}

  async function currentSvg(widget) {
    const value=state(widget), data=multiCascadeData(), selected=new Set(value.selected);
    const sources=Object.fromEntries(Object.entries(INLINE_ICONS).map(([name,source])=>[name,source.replace(/<\/?svg[^>]*>/g,'')]));
    const icon=(name,x,y)=>'<g transform="translate('+x+' '+y+')">'+sources[name]+'</g>';
    const text=(x,y,label,color,weight=400)=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="14" font-weight="'+weight+'">'+escape(label)+'</text>';
    const trigger = widget.querySelector('.zcm-trigger').getBoundingClientRect();
    const x = node => Math.round((node.getBoundingClientRect().left-trigger.left)*100)/100;
    const triggerWidth = Math.ceil(trigger.width);
    const svgWidth = (value.open ? Math.max(371,triggerWidth) : triggerWidth) + 24;
    const svgHeight = value.open ? 274 : 56;
    const parts=['<svg xmlns="http://www.w3.org/2000/svg" width="'+svgWidth+'" height="'+svgHeight+'" viewBox="-12 -12 '+svgWidth+' '+svgHeight+'"><defs><filter id="zcm-shadow" x="-12" y="-12" width="'+svgWidth+'" height="'+svgHeight+'" filterUnits="userSpaceOnUse"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#000" flood-opacity=".08"/></filter><clipPath id="zcm-right"><rect x="162" y="49" width="208" height="192"/></clipPath></defs><rect width="'+triggerWidth+'" height="32" rx="20" fill="white" filter="url(#zcm-shadow)"/>'];
    const field = widget.querySelector('.zcm-field-label');
    parts.push(text(x(field),21,field.textContent,'#999999'));
    if (value.open) parts.push('<rect x=".5" y=".5" width="'+(triggerWidth-1)+'" height="31" rx="19.5" fill="none" stroke="#B9B8D8"/>');
    widget.querySelectorAll('.zcm-value-label,.zcm-count,.zcm-placeholder').forEach(node => {
      const placeholder = node.classList.contains('zcm-placeholder');
      parts.push(text(x(node),21,node.textContent,placeholder ? '#999999' : '#6865A7',placeholder ? 400 : 500));
    });
    widget.querySelectorAll('.zcm-remove img').forEach(node => {
      parts.push('<image x="'+x(node)+'" y="10" width="12" height="12" href="'+node.getAttribute('src')+'"/>');
    });
    const arrowX = x(widget.querySelector('.zcm-collapse'));
    const collapseIcon = icon('collapse',arrowX,10);
    parts.push(value.open ? collapseIcon.replace('#999999','#6865A7') : '<g transform="rotate(180 '+(arrowX+6)+' 16)">'+collapseIcon+'</g>');
    if(value.open){
      parts.push('<rect x="0" y="40" width="371" height="210" rx="8" fill="white" filter="url(#zcm-shadow)"/><rect x=".5" y="40.5" width="370" height="209" rx="7.5" fill="none" stroke="#B9B8D8"/>');
      const total = data.reduce((count, group) => count + group.children.length, 0);
      const allSelected = selected.size === total;
      const allIcon = allSelected ? 'checked' : selected.size ? 'mixed' : 'unchecked';
      parts.push(icon(allIcon,13,58),text(35,70,'全部',allSelected?'#6865A7':'#333333'));
      for(let g=0;g<data.length;g++){
        const rowY=81+g*32,count=data[g].children.filter((_,i)=>selected.has(g+'-'+i)).length,browsing=value.browsed&&value.active===g&&!data[g].terminal;
        if(browsing)parts.push('<rect x="1" y="'+rowY+'" width="160" height="32" fill="#F7F7F9"/>');
        parts.push(await icon(count===data[g].children.length?'checked':count?'mixed':'unchecked',13,rowY+9),text(35,rowY+21,data[g].label,count===data[g].children.length?'#6865A7':'#333333'));
        if(!data[g].terminal)parts.push(await icon('arrow',137,rowY+10));
      }
      parts.push('<rect x="161" y="49" width="1" height="192" fill="#EAEAEA"/><g clip-path="url(#zcm-right)">');
      const scroll=widget.querySelector('.zcm-leaves')?.scrollTop||0;
      for(let i=0;i<data[value.active].children.length;i++){const y=49+i*32-scroll,id=value.active+'-'+i;parts.push(await icon(selected.has(id)?'checked':'unchecked',174,y+9),text(196,y+21,data[value.active].children[i],selected.has(id)?'#6865A7':'#333333'));}
      parts.push('</g>');
    }
    parts.push('</svg>');return parts.join('');
  }

  const host=document.querySelector('#visual-panel-components .select-control-demo');
  if(!host||document.getElementById('component-multi-cascade'))return;
  const unit=document.createElement('section');unit.id='component-multi-cascade';unit.className='individual-component zcm-component';
  unit.innerHTML='<div class="individual-component-heading"><h4>多选级联选择器</h4><div class="actions"><button type="button" data-zcm-action="svg">复制 SVG</button><button type="button" data-zcm-action="spec">查看规范</button><button type="button" data-zcm-action="code">查看代码</button><a href="'+FIGMA+'" target="_blank" rel="noreferrer">Figma 源组件</a></div></div><div class="zcm-component-preview">'+markup()+'</div>';
  host.append(unit);multiCascadeRuntime(unit);styleComponentActions();
  unit.addEventListener('click',async event=>{
    const action=event.target.closest('[data-zcm-action]')?.dataset.zcmAction;if(!action)return;
    const widget=unit.querySelector('.zcm-cascader');
    try{
      if(action==='svg'){
        await copy(await currentSvg(widget));
      }else if(action==='code'){
        codeValue='<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>多选级联选择器</title><style>'+INLINE_CSS+'\nbody{margin:32px;background:#fff}.zcm-export{overflow-x:auto;padding:12px}</style></head><body><div class="zcm-export">'+markup(state(widget))+'</div><script>'+multiCascadeData.toString()+'\n('+multiCascadeRuntime.toString()+')();<\/script><\/body><\/html>';
        document.getElementById('dialog-title').textContent='多选级联选择器 · 开发代码';document.getElementById('code-text').textContent=codeValue;document.getElementById('code-dialog').showModal();
      }else{
        const rows=[['Figma 原稿','80:379'],['触发框','高32px；已选时宽度随内容变化；圆角20px；左右内距12px；默认无描边；移入、键盘聚焦或展开时显示1px #B9B8D8 描边；阴影0 0 12px rgba(0,0,0,.08)'],['默认状态','未选择时显示“请选择”。首次展开时右栏显示股票型子项，一级行保持默认样式。'],['展开与收起箭头','12 × 12px。收起时朝下，#999999。展开时朝上，#6865A7。'],['内置标题','基金类型；14px / PingFang SC Regular / #999999；宽56px'],['已选项','显示第一项的完整路径。PingFang SC Medium，14px / 20px，主色 #6865A7，无底色。关闭图标12px，距选项文字2px，已选项与折叠计数间距8px。'],['折叠计数','第二项起以 +N 显示，N 为其余已选项数量。字号、字重和颜色同已选项。移入可查看其余路径。'],['菜单','371 × 210px；与触发框间距8px；圆角8px；内描边1px #B9B8D8；上下8px；阴影同触发框'],['两列','一级160px；分栏线1px #EAEAEA；二级208px；内容可视高度192px；二级选项溢出时可滚动'],['选项','行高32px；左右内距12px；复选框14px，圆角4px；图文间距8px；文字14px / 20px / PingFang SC Regular'],['颜色','普通文字#333333；选中#6865A7；主动浏览的一级行背景#F7F7F9；未选框描边#C9C9D3'],['勾选行为','父项复选框勾选或取消所有子项；部分子项已选时父项半选；「全部」在部分选中时显示半选，全选后显示勾选和主色文字。点击半选框可补齐全选'],['浏览与删除','父项文字/箭头仅展开子级；勾选子项不收起菜单；移除当前显示项后，下一项自动补位，并更新 +N'],['键盘与接入','Esc、点击外部或焦点移出时收起；Tab 移动焦点，空格勾选；←/→ 切换栏，↑/↓、Home/End 浏览选项；监听cascaderchange读取values、paths、selected']];
        document.getElementById('spec-dialog-title').textContent='多选级联选择器';document.getElementById('spec-dialog-body').innerHTML='<table><tbody>'+rows.map(row=>'<tr><td>'+row[0]+'</td><td>'+row[1]+'</td></tr>').join('')+'</tbody></table>';document.getElementById('spec-dialog').showModal();
      }
    }catch(error){toast('操作失败，请重试');}
  });
})();
