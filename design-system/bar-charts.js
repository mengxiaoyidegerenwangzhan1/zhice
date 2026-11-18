(function installMonthlyBarCharts() {
  'use strict';
  const colors = ['#9793CC','#93B9CC','#CBBE93'];
  const names = ['宝盈中证A500指数增强','国寿安保安泽纯债39个月定期开放债券','易方达纳斯达克100ETF联接(QDII-LOF)'];
  const makeSeries = values => names.map((name,index) => ({name,color:colors[index],values:values[index]}));
  const variants = {
    positive:{key:'positive',label:'正向',title:'月度收益分布',min:0,max:100,step:20,labels:['-2%','0%','2%','4%','6%','8%','10%'],visible:[true,true,true],series:makeSeries([[20,20,20,35,35,20,20],[16,16,16,31,31,16,16],[16,16,16,31,31,16,16]])},
    mixed:{key:'mixed',label:'正负项',title:'月度收益',min:-15,max:15,step:5,labels:['2025-12-08','2026-02-09','2026-03-26','2026-05-08','2026-06-16','2026-07-24','2026-08-21','2026-09-18','2026-10-16','2026-11-13'],visible:[true,false,true],range:[0,6],series:makeSeries([[7,-7,2.06,12,12,-7,-7,5,-3,6],[5.5,-5.5,.32,10,10,-5.5,-5.5,4,-2,4.5],[5.5,-5.5,3.12,10.5,10.5,-5.5,-5.5,4.5,-2.5,5]])},
    negative:{key:'negative',label:'负项',title:'月度收益',min:-40,max:0,step:10,labels:['今年以来','近一个月','近三个月','近六个月','近一年','近三年','近五年','共同时段'],visible:[true,true,true],difference:true,series:makeSeries([[-9,-9,-11.36,-9,-9,-9,-9,-15.5],[-12,-7,-1.24,-7,-8,-9,-22,-25],[-7,-7,-15.62,-7,-5,-7,-25,-28]])}
  };
  const escapeMarkup = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const initialState = config => ({visible:config.visible.slice(),start:config.range ? config.range[0] : 0,end:config.range ? config.range[1] : config.labels.length-1});
  const normalizeState = (config, input) => {
    const state = initialState(config);
    if (Array.isArray(input)) state.visible = input.slice();
    else if (input) Object.assign(state,input,{visible:(input.visible || state.visible).slice()});
    state.start = Math.max(0,Math.min(config.labels.length-2,Number(state.start)||0));
    state.end = Math.min(config.labels.length-1,Math.max(state.start+1,Number(state.end)));
    return state;
  };

  // All SVG coordinates derive from the domain and current view. Zero remains the bar origin.
  function renderSvg(config,state,requestedWidth,requestedHeight,id) {
    const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    const width = Math.max(280,Math.round(requestedWidth));
    const height = Math.max(230,Math.round(requestedHeight));
    const narrow = width < 600, axisFont = narrow ? 11 : 12;
    const left = narrow ? 44 : 52, right = 10, top = 14, bottom = height-38;
    const plotWidth = width-left-right, plotHeight = bottom-top;
    const start = config.key === 'mixed' ? state.start : 0;
    const end = config.key === 'mixed' ? state.end : config.labels.length-1;
    const count = end-start+1, categoryWidth = plotWidth/count;
    const barGap = narrow ? 2 : 3;
    const barWidth = Math.min(36,Math.max(5,(categoryWidth-(narrow ? 8 : 22)-2*barGap)/3));
    const n = value => Number(value.toFixed(2));
    const y = value => top + (config.max-value)/(config.max-config.min)*plotHeight;
    const zero = y(0);
    const tickWidth = config.key === 'positive' ? 35 : config.key === 'negative' ? (narrow ? 52 : 64) : (narrow ? 42 : 82);
    const every = Math.max(1,Math.ceil(tickWidth/categoryWidth));
    let contents = '<title id="'+id+'-title">'+config.title+' · '+config.label+'</title><desc id="'+id+'-desc">演示数据。纵轴'+config.min+'%到'+config.max+'%。图例控制绘图显隐，提示保留所有系列数据。</desc>';
    contents += '<rect data-hover-band="" x="'+left+'" y="'+top+'" width="'+n(categoryWidth)+'" height="'+n(plotHeight)+'" fill="#F2F3F5" visibility="hidden" pointer-events="none"/>';
    for(let value=config.max;value>=config.min;value-=config.step) {
      const pos=n(y(value));
      contents += '<line x1="'+left+'" y1="'+pos+'" x2="'+(width-right)+'" y2="'+pos+'" stroke="'+(value===0?'#CCCCCC':'#EEEEEE')+'" stroke-width="1"'+(value===0?'':' stroke-dasharray="4 4"')+'/>';
      contents += '<text x="'+(left-7)+'" y="'+n(pos+axisFont*.34)+'" text-anchor="end" fill="#888888" font-size="'+axisFont+'" font-family="Roboto,Arial,sans-serif">'+value+'%</text>';
    }
    for(let category=start;category<=end;category++) {
      const local=category-start, bandX=left+categoryWidth*local, center=bandX+categoryWidth/2;
      contents += '<rect class="zc-bars-hit" data-category="'+category+'" data-band-x="'+n(bandX)+'" data-band-width="'+n(categoryWidth)+'" x="'+n(bandX)+'" y="'+top+'" width="'+n(categoryWidth)+'" height="'+n(plotHeight)+'" fill="transparent"/>';
      if(local%every===0 || category===end) {
        let label=config.labels[category];
        if(narrow && config.key==='mixed') label=label.slice(5);
        contents += '<text x="'+n(center)+'" y="'+(bottom+25)+'" text-anchor="middle" fill="#888888" font-size="'+axisFont+'" font-family="'+(config.key==='negative'?'PingFang SC,Microsoft YaHei':'Roboto,Arial')+',sans-serif">'+escape(label)+'</text>';
      }
      config.series.forEach((item,index) => {
        if(!state.visible[index]) return;
        const value=item.values[category], endY=y(value), x=center-(3*barWidth+2*barGap)/2+index*(barWidth+barGap);
        const radius=Math.min(3,barWidth/2,Math.abs(endY-zero)/2);
        let path;
        if(value>=0) path='M'+n(x)+' '+n(zero)+'V'+n(endY+radius)+'Q'+n(x)+' '+n(endY)+' '+n(x+radius)+' '+n(endY)+'H'+n(x+barWidth-radius)+'Q'+n(x+barWidth)+' '+n(endY)+' '+n(x+barWidth)+' '+n(endY+radius)+'V'+n(zero)+'Z';
        else path='M'+n(x)+' '+n(zero)+'V'+n(endY-radius)+'Q'+n(x)+' '+n(endY)+' '+n(x+radius)+' '+n(endY)+'H'+n(x+barWidth-radius)+'Q'+n(x+barWidth)+' '+n(endY)+' '+n(x+barWidth)+' '+n(endY-radius)+'V'+n(zero)+'Z';
        contents += '<path class="zc-monthly-bars-bar" data-series="'+index+'" data-category="'+category+'" data-band-x="'+n(bandX)+'" data-band-width="'+n(categoryWidth)+'" data-value="'+value+'" data-zero-y="'+n(zero)+'" data-end-y="'+n(endY)+'" d="'+path+'" fill="'+item.color+'" tabindex="0" role="img" aria-label="'+escape(item.name+'，'+config.labels[category]+'，'+value+'%')+'"/>';
      });
    }
    if(!state.visible.some(Boolean)) contents += '<text x="'+n(left+plotWidth/2)+'" y="'+n(top+plotHeight/2)+'" text-anchor="middle" fill="#999999" font-size="12" font-family="PingFang SC,Microsoft YaHei,sans-serif">已隐藏全部系列，点击图例重新显示</text>';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" role="group" aria-labelledby="'+id+'-title '+id+'-desc">'+contents+'</svg>';
  }

  function renderMarkup(config,state,id) {
    const range=config.key==='mixed'?'<div class="zc-bars-range" role="group" aria-label="显示日期范围"><div class="zc-bars-range-track"><div class="zc-bars-range-window"></div></div><input class="zc-bars-range-input" data-range-start type="range" min="0" max="'+(config.labels.length-1)+'" step="1" value="'+state.start+'" aria-label="开始日期"><input class="zc-bars-range-input" data-range-end type="range" min="0" max="'+(config.labels.length-1)+'" step="1" value="'+state.end+'" aria-label="结束日期"><div class="zc-bars-range-labels"><span data-range-start-label>'+config.labels[state.start]+'</span><span data-range-end-label>'+config.labels[state.end]+'</span></div></div>':'';
    return '<figure class="zc-monthly-bars" data-variant="'+config.key+'" data-visible="'+state.visible.map(Number).join('')+'" data-start="'+state.start+'" data-end="'+state.end+'" data-chart-id="'+id+'"><div class="zc-monthly-bars-heading"><h3>'+config.title+'</h3><span class="zc-monthly-bars-note">演示数据</span></div><div class="zc-monthly-bars-plot"></div>'+range+'<ul class="zc-monthly-bars-legend" aria-label="图例，点击显示或隐藏系列">'+config.series.map((item,index)=>'<li><button type="button" data-toggle-series="'+index+'" aria-pressed="'+state.visible[index]+'" aria-label="'+escapeMarkup(item.name)+'，点击'+(state.visible[index]?'隐藏':'显示')+'" style="--series-color:'+item.color+'"><span class="zc-monthly-bars-swatch" aria-hidden="true"></span><span class="zc-monthly-bars-name">'+escapeMarkup(item.name)+'</span></button></li>').join('')+'</ul><div class="zc-monthly-bars-tooltip" id="'+id+'-tooltip" role="tooltip" hidden></div><span class="zc-monthly-bars-sr" role="status" aria-live="polite"></span></figure>';
  }

  function monthlyBarsRuntime(root,configs,svgBuilder) {
    const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    root.querySelectorAll('.zc-monthly-bars:not([data-ready])').forEach((host,hostIndex)=>{
      host.dataset.ready='true';
      const config=configs[host.dataset.variant || 'positive'];
      const plot=host.querySelector('.zc-monthly-bars-plot'),tooltip=host.querySelector('.zc-monthly-bars-tooltip'),status=host.querySelector('[role="status"]');
      const state={visible:(host.dataset.visible||config.visible.map(Number).join('')).split('').map(v=>v==='1'),start:Number(host.dataset.start)||0,end:Number(host.dataset.end)||config.labels.length-1};
      const id=host.dataset.chartId||'monthly-bars-'+hostIndex;
      let lastWidth=0,activeElement=null,activeCategory=-1,frame=0;
      host.zcMonthlyBarState=state;
      function hideTooltip() {
        tooltip.hidden=true;activeElement?.removeAttribute('aria-describedby');activeElement=null;activeCategory=-1;
        plot.querySelector('[data-hover-band]')?.setAttribute('visibility','hidden');
      }
      function showTooltip(element,event) {
        const category=Number(element.dataset.category);
        const highlight=plot.querySelector('[data-hover-band]');
        highlight?.setAttribute('x',element.dataset.bandX);highlight?.setAttribute('width',element.dataset.bandWidth);highlight?.setAttribute('visibility','visible');
        activeElement?.removeAttribute('aria-describedby');activeElement=element;
        if(activeCategory!==category || tooltip.hidden) {
          const reference=config.series[0].values[category];
          tooltip.innerHTML='<strong>'+(config.key==='positive'?'收益区间 ':'')+config.labels[category]+'</strong><ul>'+config.series.map((item,index)=>{
            const value=item.values[category],difference=Math.round((value-reference)*100)/100;
            const differenceText=config.difference && index>0?(difference>0?'+':'')+difference.toFixed(2)+'pp':'';
            return '<li'+(!state.visible[index]?' class="is-hidden-series"':'')+' style="--series-color:'+item.color+'"><i aria-hidden="true"></i><span>'+escape(item.name)+(!state.visible[index]?'<em>已隐藏</em>':'')+'</span><b>'+Number(value.toFixed(2))+'%</b>'+(config.difference?'<small>'+differenceText+'</small>':'')+'</li>';
          }).join('')+'</ul>'+(config.difference?'<p>差值参照第一只基金，单位为百分点（pp）</p>':'');
        }
        activeCategory=category;tooltip.hidden=false;element.setAttribute('aria-describedby',tooltip.id);
        const base=host.getBoundingClientRect(),target=element.getBoundingClientRect(),panel=tooltip.getBoundingClientRect();
        const center=target.left-base.left+target.width/2;
        const left=Math.max(8,Math.min(center-panel.width/2,base.width-panel.width-8));
        const anchorY=event?event.clientY-base.top:target.top-base.top;
        let top=anchorY-panel.height-10;
        if(top<32) top=Math.min(anchorY+12,base.height-panel.height-8);
        tooltip.style.left=left+'px';tooltip.style.top=Math.max(32,top)+'px';
      }
      function render(force) {
        const measured=Math.round(plot.getBoundingClientRect().width);if(!measured)return;
        if(!force&&measured===lastWidth)return;lastWidth=measured;hideTooltip();
        const height=Math.max(240,Math.min(300,measured*.29));
        plot.innerHTML=svgBuilder(config,state,measured,height,id);
        plot.querySelectorAll('.zc-monthly-bars-bar').forEach(bar=>{
          bar.addEventListener('focus',()=>showTooltip(bar));bar.addEventListener('blur',hideTooltip);
          bar.addEventListener('keydown',event=>{
            if(event.key==='Escape'){hideTooltip();return;}
            let category=Number(bar.dataset.category),index=Number(bar.dataset.series);
            const first=config.key==='mixed'?state.start:0,last=config.key==='mixed'?state.end:config.labels.length-1;
            const shown=state.visible.map((value,i)=>value?i:-1).filter(i=>i>=0);
            if(event.key==='ArrowLeft')category=Math.max(first,category-1);
            else if(event.key==='ArrowRight')category=Math.min(last,category+1);
            else if(event.key==='ArrowUp')index=shown[Math.max(0,shown.indexOf(index)-1)];
            else if(event.key==='ArrowDown')index=shown[Math.min(shown.length-1,shown.indexOf(index)+1)];
            else if(event.key==='Home')category=first;
            else if(event.key==='End')category=last;
            else return;
            event.preventDefault();plot.querySelector('[data-series="'+index+'"][data-category="'+category+'"]')?.focus();
          });
        });
      }
      plot.addEventListener('pointermove',event=>{const target=event.target.closest('[data-category]');if(target)showTooltip(target,event);});
      plot.addEventListener('pointerleave',()=>{const focused=document.activeElement;if(focused&&plot.contains(focused)&&focused.matches('.zc-monthly-bars-bar'))showTooltip(focused);else hideTooltip();});
      host.querySelectorAll('[data-toggle-series]').forEach(button=>button.addEventListener('click',()=>{
        const index=Number(button.dataset.toggleSeries);state.visible[index]=!state.visible[index];host.dataset.visible=state.visible.map(Number).join('');
        button.setAttribute('aria-pressed',String(state.visible[index]));button.setAttribute('aria-label',config.series[index].name+'，点击'+(state.visible[index]?'隐藏':'显示'));
        status.textContent=(state.visible[index]?'已显示':'已隐藏')+config.series[index].name;render(true);
      }));
      if(config.key==='mixed') {
        const startInput=host.querySelector('[data-range-start]'),endInput=host.querySelector('[data-range-end]'),selection=host.querySelector('.zc-bars-range-window');
        function syncRange() {
          startInput.value=state.start;endInput.value=state.end;
          startInput.setAttribute('aria-valuetext',config.labels[state.start]);endInput.setAttribute('aria-valuetext',config.labels[state.end]);
          host.querySelector('[data-range-start-label]').textContent=config.labels[state.start];host.querySelector('[data-range-end-label]').textContent=config.labels[state.end];
          selection.style.left=100*state.start/(config.labels.length-1)+'%';selection.style.right=100*(1-state.end/(config.labels.length-1))+'%';
          host.dataset.start=state.start;host.dataset.end=state.end;
        }
        startInput.addEventListener('input',()=>{state.start=Math.min(Number(startInput.value),state.end-1);syncRange();render(true);});
        endInput.addEventListener('input',()=>{state.end=Math.max(Number(endInput.value),state.start+1);syncRange();render(true);});
        [startInput,endInput].forEach(input=>input.addEventListener('change',()=>{status.textContent='显示'+config.labels[state.start]+'至'+config.labels[state.end]+'，共'+(state.end-state.start+1)+'个日期。';}));
        syncRange();
      }
      const observer=new ResizeObserver(()=>{if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;render(false);});});observer.observe(plot);
      host.addEventListener('keydown',event=>{if(event.key==='Escape')hideTooltip();});window.addEventListener('scroll',hideTooltip,{passive:true});render(true);
    });
  }

  function resolveExport(key,input) {
    if(Array.isArray(key))return {config:variants.positive,state:normalizeState(variants.positive,key)};
    const config=variants[key||'positive']||variants.positive;
    return {config,state:normalizeState(config,input)};
  }
  function exportSvg(key='positive',input) {
    const {config,state}=resolveExport(key,input),width=1140,plotHeight=300;
    const plot=renderSvg(config,state,width-40,plotHeight,'export-'+config.key).replace(/^<svg[^>]*>/,'<g transform="translate(20 48)">').replace(/<\/svg>$/,'</g>');
    const hasRange=config.key==='mixed',legendTop=hasRange?404:370,height=legendTop+68;
    let range='';
    if(hasRange) {
      const x=72,w=1038,a=x+w*state.start/(config.labels.length-1),b=x+w*state.end/(config.labels.length-1);
      range='<rect x="'+x+'" y="352" width="'+w+'" height="10" rx="2" fill="#EEF0F5"/><rect x="'+a+'" y="352" width="'+(b-a)+'" height="10" rx="2" fill="#DFE5F0" stroke="#C8D0DF"/><rect x="'+(a-3)+'" y="349" width="6" height="16" rx="2" fill="#FFFFFF" stroke="#AAB9D0"/><rect x="'+(b-3)+'" y="349" width="6" height="16" rx="2" fill="#FFFFFF" stroke="#AAB9D0"/><text x="72" y="382" font-size="11" fill="#999999" font-family="Arial,sans-serif">'+config.labels[state.start]+'</text><text x="1110" y="382" text-anchor="end" font-size="11" fill="#999999" font-family="Arial,sans-serif">'+config.labels[state.end]+'</text>';
    }
    function wrap(text) { const lines=[];let line='',units=0;for(const char of text){const unit=char.charCodeAt(0)>255?12:6.2;if(units+unit>325){lines.push(line);line='';units=0;}line+=char;units+=unit;}if(line)lines.push(line);return lines; }
    const legends=config.series.map((item,index)=>{
      const x=20+index*(width-40)/3,lines=wrap(item.name);
      return '<g'+(state.visible[index]?'':' opacity=".35"')+'><rect x="'+x+'" y="'+(legendTop-9)+'" width="10" height="10" rx="2" fill="'+item.color+'"/><text x="'+(x+17)+'" y="'+legendTop+'" fill="#333333" font-size="12" font-family="PingFang SC,Microsoft YaHei,sans-serif"'+(state.visible[index]?'':' text-decoration="line-through"')+'>'+lines.map((line,i)=>'<tspan x="'+(x+17)+'" dy="'+(i?17:0)+'">'+escapeMarkup(line)+'</tspan>').join('')+'</text></g>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><rect width="'+width+'" height="'+height+'" fill="#FFFFFF"/><text x="20" y="27" fill="#333333" font-size="16" font-weight="600" font-family="PingFang SC,Microsoft YaHei,sans-serif">'+config.title+'</text><text x="1120" y="27" text-anchor="end" fill="#999999" font-size="12" font-family="PingFang SC,Microsoft YaHei,sans-serif">演示数据</text>'+plot+range+legends+'</svg>';
  }
  async function exportCode(key='positive',input) {
    const {config,state}=resolveExport(key,input),response=await fetch('bar-charts.css?v=20261118-bar-variants');
    if(!response.ok)throw new Error('图表样式读取失败');
    const css=await response.text();
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+config.title+' · '+config.label+'</title><style>'+css+'\nbody{margin:0;padding:24px;background:#f2f3f5}main{max-width:1180px;margin:auto;padding:20px;background:#fff;border-radius:16px}@media(max-width:460px){body{padding:12px}main{padding:20px 12px}}</style></head><body><main>'+renderMarkup(config,state,'export-'+config.key)+'</main><script>('+monthlyBarsRuntime.toString()+')(document,'+JSON.stringify(variants)+','+renderSvg.toString()+');<\/script></body></html>';
  }
  function openSpec(config) {
    const axis=config.key==='positive'?'X轴-2%、0%、2%、4%、6%、8%、10%；Y轴0%至100%，每20%一格':config.key==='mixed'?'X轴为日期；Y轴-15%至15%，每5%一格；上下双向绘制':'X轴为今年以来、近一个月、近三个月、近六个月、近一年、近三年、近五年、共同时段；Y轴0%至-40%，每10%一格';
    const rows=[['类型',config.label+'分组柱状图，图内标题“'+config.title+'”'],['坐标轴',axis],['柱形','以零线为起点；正柱顶部圆角、负柱底部圆角，零端平直；半径不超过柱高及柱宽的一半'],['比例','随容器适配，1000px宽时SVG约290px高；窄屏减少刻度标签密度'],['网格','水平#EEEEEE 1px虚线；零线#CCCCCC 1px实线'],['配色','第一系列#9793CC，第二系列#93B9CC，第三系列#CBBE93；不随显隐改变'],['图例','优先三列一行，长名称换行；窄屏两列或一列，隐藏态置灰'],['提示','高亮当前类别整条竖向背景；列出全部系列及当前值，隐藏绘图的系列标“已隐藏”'],['默认状态',config.key==='mixed'?'第二系列默认隐藏；其他系列显示；初始显示前7个日期':'三系列默认全部显示'],['日期范围',config.key==='mixed'?'双端范围条支持拖动及键盘方向键；至少保留2个日期；更新当前图表，不影响另两图':'无日期范围条'],['差值',config.difference?'第二/第三系列减第一系列的原始数值，保留2位小数，单位pp；第一系列隐藏仍保留参照':'不显示差值'],['数据','示例使用演示数据，不代表基金真实业绩']];
    document.getElementById('spec-dialog-title').textContent=config.label+'柱状图 · 设计规范';
    document.getElementById('spec-dialog-body').innerHTML='<h3>尺寸与样式</h3><table><tbody>'+rows.map(row=>'<tr><td>'+row[0]+'</td><td>'+row[1]+'</td></tr>').join('')+'</tbody></table><h3>交互规则</h3><ol><li>点击图例只控制对应系列的绘图显隐，图例位置、颜色、柱位和纵轴范围保持不变。</li><li>移入当前类别或通过Tab聚焦柱形显示提示；左右键切换类别，上下键切换可见系列，Home/End定位首末项，Esc关闭提示。</li><li>三个示例各自独立；显隐及日期范围互不影响。</li><li>复制SVG和独立HTML导出当前系列显隐与日期范围；HTML内嵌所有数据、样式及交互，无外部依赖。</li></ol>';
    document.getElementById('spec-dialog').showModal();
  }

  const panel=document.getElementById('visual-panel-charts');
  if(!panel||document.getElementById('chart-monthly-distribution'))return;
  const section=document.createElement('section');section.id='chart-monthly-distribution';section.className='visual-section';
  const icons={svg:'<rect x="7" y="7" width="11" height="13" rx="2"/><path d="M14 7V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v11h3"/>',spec:'<path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4zM14 7a3 3 0 0 1 3-3h3v14h-3a3 3 0 0 0-3 3"/>',code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>'};
  section.innerHTML='<div class="visual-section-heading"><span>01</span><div><h2>柱状图</h2></div></div>'+Object.values(variants).map(config=>'<section class="zc-bars-example" data-bars-example="'+config.key+'" id="chart-bars-'+config.key+'"><div class="zc-bars-example-head"><h4>'+config.label+'</h4><div class="zc-bars-actions">'+[['svg','复制 SVG'],['spec','查看规范'],['code','查看代码']].map(([key,label])=>'<button type="button" data-bars-action="'+key+'"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+icons[key]+'</svg><span>'+label+'</span></button>').join('')+'</div></div>'+renderMarkup(config,initialState(config),'monthly-bars-'+config.key)+'</section>').join('');
  panel.append(section);monthlyBarsRuntime(section,variants,renderSvg);
  section.addEventListener('click',async event=>{
    const action=event.target.closest('[data-bars-action]')?.dataset.barsAction;if(!action)return;
    const example=event.target.closest('[data-bars-example]'),key=example.dataset.barsExample,config=variants[key];
    const live=example.querySelector('.zc-monthly-bars').zcMonthlyBarState;
    const state={...live,visible:live.visible.slice()};
    try {
      if(action==='spec')openSpec(config);
      else if(action==='svg')await copy(exportSvg(key,state));
      else {codeValue=await exportCode(key,state);document.getElementById('dialog-title').textContent=config.label+'柱状图 · 开发代码';document.getElementById('code-text').textContent=codeValue;document.getElementById('code-dialog').showModal();}
    } catch(error) {toast('操作失败，请重试');}
  });
  function visitChartHash() {
    if(!['#chart-monthly-distribution','#chart-bars-positive','#chart-bars-mixed','#chart-bars-negative'].includes(location.hash))return;
    document.getElementById('visual-tab-charts')?.click();
    requestAnimationFrame(()=>{
      const target=document.getElementById(location.hash.slice(1))||section;
      const header=document.querySelector('.topbar')?.getBoundingClientRect().height||0;
      const tabs=document.querySelector('.visual-tabs')?.getBoundingClientRect().height||0;
      window.scrollTo({top:Math.max(0,window.scrollY+target.getBoundingClientRect().top-header-tabs-16),behavior:'instant'});
    });
  }
  window.addEventListener('hashchange',visitChartHash);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',visitChartHash,{once:true});else visitChartHash();
  window.ZhiceMonthlyBars={
    series:variants.positive.series,variants,renderSvg,renderMarkup,exportSvg,exportCode,
    markup:(visibleOrKey=[true,true,true],id='monthly-bars',state)=>{const result=resolveExport(visibleOrKey,state);return renderMarkup(result.config,result.state,id);},
    chartSvg:(data,visible,width,height,id)=>renderSvg({...variants.positive,series:data},{visible,start:0,end:6},width,height,id),
    mount:root=>monthlyBarsRuntime(root,variants,renderSvg)
  };
})();
