(function installReturnLineChart() {
  'use strict';
  const names = [
    '宝盈中证A500指数增强',
    '国寿安保安泽纯债39个月定期开放债券',
    '易方达纳斯达克100ETF联接(QDII-LOF)'
  ];
  const colors = ['#9793CC','#93B9CC','#CBBE93'];
  const anchors = [
    [[0,0],[7,4.4],[15,3.0],[23,-3.4],[34,7.0],[43,4.8],[52,17.1],[62,4.4],[71,9.8],[79,3.2],[85,-2.3],[91,-11.0],[95,2.4],[100,-10.0]],
    [[0,0],[7,3.3],[15,2.2],[23,-3.9],[34,5.3],[43,3.7],[52,15.0],[62,3.1],[71,8.0],[79,2.2],[85,-3.4],[91,-9.0],[95,1.0],[100,-8.5]],
    [[0,0],[7,1.1],[15,1.6],[23,-4.6],[34,3.8],[43,2.2],[52,12.7],[62,2.7],[71,6.2],[79,1.0],[85,-4.2],[91,-13.6],[95,-.6],[100,-10.8]]
  ];
  const dates = Array.from({length:101}, (_,index) => {
    const start = Date.UTC(2025,11,8), end = Date.UTC(2026,10,17);
    return new Date(start + Math.round((end-start)/86400000*index/100)*86400000).toISOString().slice(0,10);
  });
  function sampleValues(points,index) {
    let segment = 0;
    while (segment < points.length-2 && index > points[segment+1][0]) segment++;
    const [a,valueA] = points[segment], [b,valueB] = points[segment+1];
    const value = valueA + (valueB-valueA)*(index-a)/(b-a);
    const noise = index === 0 || index === 100 ? 0 : .52*Math.sin(index*2.17) + .24*Math.sin(index*4.43);
    return Number(Math.max(-14.8,Math.min(19.4,value+noise)).toFixed(2));
  }
  const series = names.map((name,index) => ({name,color:colors[index],values:dates.map((_,i) => sampleValues(anchors[index],i))}));
  const escapeMarkup = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  function formatDifference(value,baseline) {
    const delta = Math.round((value-baseline)*100)/100;
    return (delta > 0 ? '+' : '') + (Object.is(delta,-0) ? 0 : delta).toFixed(2) + ' pp';
  }

  // Render exactly the stored values. The same point index drives the tooltip and markers.
  function chartSvg(data,dateLabels,visible,requestedWidth,requestedHeight,id) {
    const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    const width = Math.max(240,Math.round(requestedWidth));
    const height = Math.max(260,Math.round(requestedHeight));
    const left = width < 480 ? 39 : 46, right = 12, top = 12, bottom = height-34;
    const plotWidth = width-left-right, plotHeight = bottom-top;
    const number = value => Number(value.toFixed(2));
    const xAt = index => left+plotWidth*index/(dateLabels.length-1);
    const yAt = value => top+(20-value)/35*plotHeight;
    const font = width < 480 ? 11 : 12;
    let out = '<title id="'+id+'-title">收益走势</title><desc id="'+id+'-desc">演示数据；日期'+dateLabels[0]+'至'+dateLabels.at(-1)+'，收益率从负15%到20%。使用左右方向键浏览数据，图例可独立显示和隐藏曲线。</desc><defs><clipPath id="'+id+'-clip"><rect x="'+left+'" y="'+top+'" width="'+plotWidth+'" height="'+plotHeight+'"/></clipPath></defs>';
    for (let value=20;value>=-15;value-=5) {
      const y=number(yAt(value));
      out+='<line x1="'+left+'" y1="'+y+'" x2="'+(width-right)+'" y2="'+y+'" stroke="'+(value===0?'#D8D8D8':'#EEEEEE')+'" stroke-width="1"'+(value===0?'':' stroke-dasharray="4 4"')+'/>';
      out+='<text x="'+(left-7)+'" y="'+(y+font*.34)+'" text-anchor="end" fill="#888888" font-size="'+font+'" font-family="Roboto,Arial,sans-serif">'+value+'%</text>';
    }
    const ticks = width < 390 ? [0,50,100] : width < 650 ? [0,25,50,75,100] : [0,20,40,60,80,100];
    ticks.forEach((ratio,index) => {
      const point = Math.round((dateLabels.length-1)*ratio/100);
      const anchor = index===0?'start':index===ticks.length-1?'end':'middle';
      out+='<text x="'+number(xAt(point))+'" y="'+(height-9)+'" text-anchor="'+anchor+'" fill="#888888" font-size="'+font+'" font-family="Roboto,Arial,sans-serif">'+esc(dateLabels[point])+'</text>';
    });
    out+='<g clip-path="url(#'+id+'-clip)">';
    // Supporting series paint first so the 2px primary curve remains legible.
    [2,1,0].forEach(index => {
      if (!visible[index]) return;
      const path = data[index].values.map((value,i)=>(i?'L':'M')+number(xAt(i))+' '+number(yAt(value))).join(' ');
      out+='<path class="zc-line-curve" data-line-series="'+index+'" d="'+path+'" fill="none" stroke="'+data[index].color+'" stroke-width="'+(index===0?2:1)+'" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
    });
    out+='<g class="zc-line-active" visibility="hidden"><line class="zc-line-guide" x1="0" x2="0" y1="'+top+'" y2="'+bottom+'" stroke="#CFCFD4" stroke-width="1"/>'+data.map((item,index)=>'<circle data-line-marker="'+index+'" cx="0" cy="0" r="3" fill="#FFFFFF" stroke="'+item.color+'" stroke-width="1.5"/>').join('')+'</g></g>';
    if (!visible.some(Boolean)) out+='<text x="'+number(left+plotWidth/2)+'" y="'+number(top+plotHeight/2)+'" text-anchor="middle" fill="#999999" font-size="13" font-family="PingFang SC,Microsoft YaHei,sans-serif">已隐藏全部曲线</text>';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" data-plot-left="'+left+'" data-plot-right="'+(width-right)+'" data-plot-top="'+top+'" data-plot-bottom="'+bottom+'" role="img" aria-labelledby="'+id+'-title '+id+'-desc">'+out+'</svg>';
  }

  function markup(visible=[true,true,true],id='return-trend') {
    return '<figure class="zc-return-line" data-visible="'+visible.map(Boolean).map(Number).join('')+'" data-chart-id="'+id+'"><div class="zc-return-line-heading"><h3>收益走势</h3><span class="zc-return-line-note">演示数据</span></div><div class="zc-return-line-plot" tabindex="0" role="slider" aria-label="收益走势，使用左右方向键查看日期" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div><div class="zc-return-line-recovery"><button type="button" class="zc-line-restore" hidden>恢复全部曲线</button></div><ul class="zc-return-line-legend" aria-label="图例，点击显示或隐藏曲线">'+series.map((item,index)=>'<li><button type="button" data-line-toggle="'+index+'" aria-pressed="'+Boolean(visible[index])+'" aria-label="'+escapeMarkup(item.name)+'，点击'+(visible[index]?'隐藏':'显示')+'" style="--series-color:'+item.color+'"><span class="zc-return-line-swatch" aria-hidden="true"></span><span class="zc-return-line-name">'+escapeMarkup(item.name)+'</span></button></li>').join('')+'</ul><div class="zc-return-line-tooltip" id="'+id+'-tooltip" role="tooltip" hidden></div><span class="zc-return-line-sr" aria-live="polite" role="status"></span></figure>';
  }

  function lineRuntime(root,data,dateLabels,svgBuilder) {
    const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    const valueText = value => (value>0?'+':'')+value.toFixed(2)+'%';
    const diffText = (value,baseline) => {const diff=Math.round((value-baseline)*100)/100;return (diff>0?'+':'')+(Object.is(diff,-0)?0:diff).toFixed(2)+' pp';};
    root.querySelectorAll('.zc-return-line:not([data-ready])').forEach((host,hostIndex) => {
      host.dataset.ready='true';
      const plot=host.querySelector('.zc-return-line-plot'), tooltip=host.querySelector('.zc-return-line-tooltip');
      const restore=host.querySelector('.zc-line-restore'), status=host.querySelector('[role="status"]');
      const visible=(host.dataset.visible||'111').split('').map(value=>value==='1');
      const id=host.dataset.chartId||'return-trend-'+hostIndex;
      let activeIndex=0, active=false, lastWidth=0, frame=0;
      host.zcLineState={visible,get activeIndex(){return activeIndex;},get active(){return active;}};
      function hide() {
        active=false;tooltip.hidden=true;plot.removeAttribute('aria-describedby');
        plot.querySelector('.zc-line-active')?.setAttribute('visibility','hidden');
      }
      function show(index,announce=false) {
        activeIndex=Math.max(0,Math.min(dateLabels.length-1,index));active=true;
        const svg=plot.querySelector('svg');if(!svg)return;
        const left=Number(svg.dataset.plotLeft),right=Number(svg.dataset.plotRight),top=Number(svg.dataset.plotTop),bottom=Number(svg.dataset.plotBottom);
        const x=left+(right-left)*activeIndex/(dateLabels.length-1);
        const yAt=value=>top+(20-value)/35*(bottom-top);
        const activeGroup=svg.querySelector('.zc-line-active');activeGroup.setAttribute('visibility','visible');
        const guide=activeGroup.querySelector('line');guide.setAttribute('x1',x);guide.setAttribute('x2',x);
        activeGroup.querySelectorAll('circle').forEach((circle,index)=>{circle.setAttribute('cx',x);circle.setAttribute('cy',yAt(data[index].values[activeIndex]));circle.style.display=visible[index]?'':'none';});
        const baseline=data[0].values[activeIndex];
        tooltip.innerHTML='<strong>'+esc(dateLabels[activeIndex])+'</strong><ul>'+data.map((item,index)=>'<li class="'+(visible[index]?'':'is-hidden')+'" style="--series-color:'+item.color+'"><i aria-hidden="true"></i><span class="zc-line-tip-name">'+esc(item.name)+(visible[index]?'':'<em>已隐藏</em>')+'</span><b>'+valueText(item.values[activeIndex])+'</b><span class="zc-line-tip-diff">'+(index===0?'参照':diffText(item.values[activeIndex],baseline))+'</span></li>').join('')+'</ul><p>差值 = 当前基金 − 第一只基金'+(visible[0]?'':'（参照基金已隐藏）')+'</p>';
        tooltip.hidden=false;plot.setAttribute('aria-describedby',tooltip.id);
        plot.setAttribute('aria-valuenow',String(activeIndex));
        plot.setAttribute('aria-valuetext',dateLabels[activeIndex]+'；'+data.map((item,index)=>item.name+' '+valueText(item.values[activeIndex])+(index?'；相对参照 '+diffText(item.values[activeIndex],baseline):'')+(visible[index]?'':'，已隐藏')).join('；'));
        const base=host.getBoundingClientRect(), box=svg.getBoundingClientRect(), panel=tooltip.getBoundingClientRect();
        const preferred=box.left-base.left+x+12;
        const panelX=Math.max(8,Math.min(preferred,base.width-panel.width-8));
        const pointY=box.top-base.top+yAt(data[0].values[activeIndex]);
        const panelY=Math.max(box.top-base.top+8,Math.min(pointY-panel.height-12,box.bottom-base.top-panel.height-8));
        tooltip.style.left=panelX+'px';tooltip.style.top=panelY+'px';
        if(announce)status.textContent=plot.getAttribute('aria-valuetext');
      }
      function updateLegend() {
        host.dataset.visible=visible.map(Number).join('');
        host.querySelectorAll('[data-line-toggle]').forEach(button=>{const index=Number(button.dataset.lineToggle);button.setAttribute('aria-pressed',String(visible[index]));button.setAttribute('aria-label',data[index].name+'，点击'+(visible[index]?'隐藏':'显示'));});
        restore.hidden=visible.some(Boolean);
      }
      function render(force=false) {
        const width=Math.round(plot.getBoundingClientRect().width);if(!width)return;
        if(!force&&width===lastWidth)return;lastWidth=width;
        const wasActive=active;
        plot.innerHTML=svgBuilder(data,dateLabels,visible,width,300,id);
        updateLegend();if(wasActive)show(activeIndex);else hide();
      }
      plot.addEventListener('pointermove',event=>{
        const svg=plot.querySelector('svg');if(!svg)return;
        const box=svg.getBoundingClientRect(),left=Number(svg.dataset.plotLeft),right=Number(svg.dataset.plotRight);
        show(Math.round((event.clientX-box.left-left)/(right-left)*(dateLabels.length-1)));
      });
      plot.addEventListener('pointerleave',()=>{if(document.activeElement!==plot)hide();});
      plot.addEventListener('focus',()=>show(activeIndex,true));
      plot.addEventListener('blur',hide);
      plot.addEventListener('keydown',event=>{
        if(event.key==='Escape'){hide();return;}
        let next=activeIndex;
        if(event.key==='ArrowLeft'||event.key==='ArrowDown')next--;
        else if(event.key==='ArrowRight'||event.key==='ArrowUp')next++;
        else if(event.key==='Home')next=0;
        else if(event.key==='End')next=dateLabels.length-1;
        else return;
        event.preventDefault();show(next,true);
      });
      host.querySelectorAll('[data-line-toggle]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.lineToggle);visible[index]=!visible[index];status.textContent=(visible[index]?'已显示':'已隐藏')+data[index].name;render(true);}));
      restore.addEventListener('click',()=>{visible.fill(true);status.textContent='已恢复全部曲线';render(true);});
      const observer=new ResizeObserver(()=>{if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;render();});});
      observer.observe(plot);window.addEventListener('scroll',hide,{passive:true});render(true);
    });
  }

  function exportSvg(visible=[true,true,true]) {
    const width=1000,height=436;
    const plot=chartSvg(series,dates,visible,960,300,'export-return-line').replace(/^<svg[^>]*>/,'<g transform="translate(20 48)">').replace(/<\/svg>$/,'</g>');
    const legend=series.map((item,index)=>{
      const x=index===1?510:20,y=index===2?411:374;
      return '<g'+(visible[index]?'':' opacity=".4"')+'><line x1="'+x+'" y1="'+(y-4)+'" x2="'+(x+14)+'" y2="'+(y-4)+'" stroke="'+item.color+'" stroke-width="'+(index===0?2:1)+'"/><text x="'+(x+22)+'" y="'+y+'" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="13" fill="#333333"'+(visible[index]?'':' text-decoration="line-through"')+'>'+escapeMarkup(item.name)+(visible[index]?'':'（已隐藏）')+'</text></g>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><rect width="'+width+'" height="'+height+'" fill="#FFFFFF"/><text x="20" y="29" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="16" font-weight="600" fill="#333333">收益走势</text><text x="980" y="29" text-anchor="end" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="12" fill="#999999">演示数据</text>'+plot+legend+'</svg>';
  }
  async function exportCode(visible=[true,true,true]) {
    const response=await fetch('line-charts.css?v=20261118-line-trend');
    if(!response.ok)throw new Error('折线图样式读取失败');
    const css=await response.text();
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>收益走势</title><style>'+css+'\nbody{margin:0;padding:24px;background:#F2F3F5}main{max-width:1000px;margin:auto;padding:24px 20px;background:#FFFFFF;border-radius:16px}@media(max-width:460px){body{padding:12px}main{padding:20px 12px}}</style></head><body><main>'+markup(visible,'return-trend-export')+'</main><script>('+lineRuntime.toString()+')(document,'+JSON.stringify(series)+','+JSON.stringify(dates)+','+chartSvg.toString()+');<\/script></body></html>';
  }

  window.ZhiceLineCharts={series,dates,markup,chartSvg,exportSvg,exportCode,formatDifference,pointAt:index=>({date:dates[index],values:series.map(item=>item.values[index])}),mount:root=>lineRuntime(root,series,dates,chartSvg)};
  const panel=document.getElementById('visual-panel-charts');
  if(!panel||document.getElementById('chart-return-trend'))return;
  const section=document.createElement('section');section.id='chart-return-trend';section.className='visual-section';
  const icons={svg:'<rect x="7" y="7" width="11" height="13" rx="2"/><path d="M14 7V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v11h3"/>',spec:'<path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4zM14 7a3 3 0 0 1 3-3h3v14h-3a3 3 0 0 0-3 3"/>',code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>'};
  section.innerHTML='<div class="visual-section-heading"><span>02</span><div><h2>折线图</h2></div></div><div class="zc-line-example-head"><h4>多基金收益走势</h4><div class="zc-line-actions">'+[['svg','复制 SVG'],['spec','查看规范'],['code','查看代码']].map(([key,label])=>'<button type="button" data-line-action="'+key+'"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+icons[key]+'</svg><span>'+label+'</span></button>').join('')+'</div></div>'+markup();
  panel.append(section);lineRuntime(section,series,dates,chartSvg);
  section.addEventListener('click',async event=>{
    const button=event.target.closest('[data-line-action]');if(!button)return;
    const action=button.dataset.lineAction,visible=section.querySelector('.zc-return-line').zcLineState.visible.slice();
    try {
      if(action==='spec') {
        const rules=[['类型','三系列折线图，标题“收益走势”；数据仅为演示'],['日期','2025-12-08 至 2026-11-17，共101个演示采样点'],['纵轴','−15% 至 20%，每5%一条刻度；零基线为实线'],['线条','第一只基金2px，其余1px；全为实线，线型及颜色固定'],['配色','第一系列 #9793CC；第二系列 #93B9CC；第三系列 #CBBE93'],['尺寸','图高300px，宽度随容器变化；窄屏自动减少日期刻度'],['图例','底部两列，第三项在第二行；窄屏一列；各系列独立显隐'],['浮层','同日期显示三只基金完整名称与收益；隐藏项灰化并注明已隐藏'],['差值','第二／第三项减第一项，单位pp；第一项隐藏时仍使用其原始数据作参照']];
        document.getElementById('spec-dialog-title').textContent='折线图 · 设计规范';
        document.getElementById('spec-dialog-body').innerHTML='<h3>尺寸与样式</h3><table><tbody>'+rules.map(row=>'<tr><td>'+row[0]+'</td><td>'+row[1]+'</td></tr>').join('')+'</tbody></table><h3>交互规则</h3><ol><li>移入图表显示竖参考线、可见曲线圆点及同日期浮层；移出、失焦或按 Esc 关闭。</li><li>Tab聚焦图表后，方向键逐点移动，Home／End定位首末日期。</li><li>图例独立显隐，坐标轴及差值参照保持不变；全部隐藏时可点击图例或“恢复全部曲线”恢复。</li><li>SVG与独立HTML保留当前显隐。导出的HTML含完整数据、样式和交互，无外部图表依赖。</li></ol>';
        document.getElementById('spec-dialog').showModal();
      } else if(action==='svg') await copy(exportSvg(visible));
      else {
        button.disabled=true;button.setAttribute('aria-busy','true');
        const source=await exportCode(visible);
        codeValue=source;
        document.getElementById('dialog-title').textContent='折线图 · 开发代码';
        document.getElementById('code-text').textContent=source;
        document.getElementById('code-dialog').showModal();
      }
    } catch(error) {toast('操作失败，请重试');}
    finally {button.disabled=false;button.removeAttribute('aria-busy');}
  });
  function visitLineChartHash() {
    if(location.hash!=='#chart-return-trend')return;
    document.getElementById('visual-tab-charts')?.click();
    requestAnimationFrame(()=>{
      const topbar=document.querySelector('.topbar')?.getBoundingClientRect().height||0;
      const tabs=document.querySelector('.visual-tabs')?.getBoundingClientRect().height||0;
      window.scrollTo({top:Math.max(0,window.scrollY+section.getBoundingClientRect().top-topbar-tabs-16),behavior:'instant'});
    });
  }
  window.addEventListener('hashchange',visitLineChartHash);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',visitLineChartHash,{once:true});else visitLineChartHash();
})();
