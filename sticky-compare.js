/* Sticky comparison toolbar: use the real controls so their handlers and state remain shared. */
(()=>{
  const host=document.getElementById('route-view');
  if(!host)return;
  let compact=false,scheduled=false,savedClickScroll=null,lastScrollY=window.scrollY;
  const state={reserved:0,threshold:0};
  const compare=()=>host.querySelector('.zc-compare.has-results');
  const scaleOf=el=>{const size=el?.offsetWidth;return size?el.getBoundingClientRect().width/size:1};
  function update(){
    scheduled=false;
    const page=compare(),header=document.getElementById('zc-header');
    if(!page||!header){compact=false;lastScrollY=window.scrollY;return}
    const selector=page.querySelector('.zc-selector'),row=page.querySelector('.zc-fund-row');
    if(!selector||!row)return;
    const scale=scaleOf(page)||1, headerHeight=header.getBoundingClientRect().height/scale;
    const y=window.scrollY;
    state.threshold=window.innerHeight*.1;
    if(!page.classList.contains('is-sticky-compact'))state.reserved=selector.offsetHeight;
    /* Collapse on downward scroll and expand on upward scroll, while both states remain sticky. */
    const delta=y-lastScrollY;
    if(y<=state.threshold||delta<-.5)compact=false;
    else if(delta>.5&&y>state.threshold)compact=true;
    lastScrollY=y;
    page.style.setProperty('--zc-sticky-header',`${headerHeight}px`);
    page.style.setProperty('--zc-selector-reserved',`${state.reserved||selector.offsetHeight}px`);
    page.classList.toggle('is-sticky-compact',compact);
    page.classList.toggle('is-sticky-scrolling',y>0);
    page.classList.toggle('is-sticky-engaged',y>state.threshold);
    const compactHeight=row.getBoundingClientRect().height/scale;
    page.style.setProperty('--zc-compact-height',`${compactHeight}px`);
    const actions=page.querySelector('.zc-actions');
    const expandedHeight=y>state.threshold&&actions?(actions.getBoundingClientRect().bottom-selector.getBoundingClientRect().top)/scale:selector.getBoundingClientRect().height/scale;
    page.style.setProperty('--zc-sticky-selector-height',`${compact?compactHeight:expandedHeight}px`);
  }
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  const expandSearch=e=>{
    if(compact&&e.target.closest('.zc-search-slot')&&compare()){
      compact=false;
      lastScrollY=window.scrollY;
      update();
    }
  };
  host.addEventListener('pointerdown',expandSearch,true);
  host.addEventListener('focusin',expandSearch,true);
  host.addEventListener('click',e=>{if(compare()&&window.scrollY>72&&e.target.closest('button')){savedClickScroll=window.scrollY;setTimeout(()=>{savedClickScroll=null},0)}},true);
  new MutationObserver(()=>{
    const y=savedClickScroll;savedClickScroll=null;
    if(y!==null&&compare())requestAnimationFrame(()=>{if(compare()&&Math.abs(window.scrollY-y)>1)window.scrollTo({top:y,behavior:'instant'});schedule()});
    schedule();
  }).observe(host,{childList:true});
  schedule();
})();
