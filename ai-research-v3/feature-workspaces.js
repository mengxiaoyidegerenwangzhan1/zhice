(function () {
  "use strict";

  // Each feature remembers its own open documents for this visit to the workbench.
  const features = new Map();
  function get(page) {
    if (!features.has(page)) {
      const home = {id:"", label:page};
      features.set(page, {home, active:home, tabs:[], recent:[home], assistant:false});
    }
    return features.get(page);
  }

  function select(space, document) {
    space.active = document;
    space.recent = [document, ...space.recent.filter(item => item !== document)];
  }

  function open(space, id, makeDocument) {
    let document = space.tabs.find(item => item.id === id);
    if (!document) {
      document = {...makeDocument(), id};
      space.tabs.push(document);
    }
    select(space, document);
    return document;
  }

  function openFund(space, fund) {
    if (!fund?.id || !fund.name) return false;
    open(space, "fund-" + fund.id, () => ({label:fund.name, fund}));
    return true;
  }

  function comparisonKey(funds){
    return "comparison-" + funds.map(fund=>fund.id).sort().join("-");
  }

  function compare(space, funds) {
    if (!Array.isArray(funds) || funds.length < 2 || funds.length > 4) return false;
    open(space, comparisonKey(funds), () => ({
      label:"基金比较 · " + funds.map(fund => fund.name).join(" / "),
      comparison:window.fundComparison.create(funds)
    }));
    return true;
  }

  function resolveFunds(items) {
    if(!Array.isArray(items) || !items.length)return [];
    const found=new Map();
    for(const item of items){
      const source=typeof item==="string" ? {name:item} : item;
      if(!source || typeof source!=="object")return [];
      const key=String(source.code || source.id || source.name || "").trim();
      const known=window.studyFundsPages.mentionedFunds(key).find(f=>f.id===key || f.name===key) ||
        window.fundComparison.findFund(key);
      const id=known?.id || key;
      const name=typeof item==="object" && source.name && source.name!==id ? source.name : known?.name;
      if(!/^\d{6}$/.test(id) || !name)return [];
      found.set(id,{...known,...source,id,name});
    }
    return [...found.values()];
  }

  function showAnswerTarget(space,page,{funds,period,start,end}){
    if(page==="基金分析" && funds.length===1){
      const record={...funds[0],period:period || funds[0].period,start:start || funds[0].start,end:end || funds[0].end};
      const doc=open(space,"fund-"+record.id,()=>({label:record.name}));
      doc.fund=record;
      return;
    }
    if(page==="基金比较" && funds.length>=2 && funds.length<=4 &&
        funds.every(f=>Number.isFinite(f.performance) && Number.isFinite(f.drawdown))){
      const doc=open(space,comparisonKey(funds),()=>({label:"基金比较 · "+funds.map(f=>f.name).join(" / ")}));
      const ctx=doc.comparison?.context();
      // A user may have edited this tab's fund set or dates since opening the answer.
      const matches=ctx && (!period || ctx.period===period) && (!start || ctx.start===start) &&
        (!end || ctx.end===end) && ctx.funds.length===funds.length &&
        funds.every(f=>ctx.funds.some(row=>row.id===f.id && !row.hidden &&
          Math.abs(row.performance-f.performance)<.01 && Math.abs(row.drawdown-f.drawdown)<.01));
      if(!matches)doc.comparison=window.fundComparison.create(funds,{period,start,end});
      return;
    }
    select(space,space.home);
  }

  function activate(space, id) {
    const document = id === "" ? space.home : space.tabs.find(item => item.id === id);
    if (!document || document === space.active) return false;
    select(space, document);
    return true;
  }

  function close(space, id) {
    const index = space.tabs.findIndex(item => item.id === id);
    if (index < 0) return false;
    const [closed] = space.tabs.splice(index, 1);
    space.recent = space.recent.filter(item => item !== closed);
    if (space.active === closed) space.active = space.recent[0] || space.home;
    return true;
  }

  // Keep the document scroll separate from the AI conversation's scroll position.
  const scrollAreas = [".fp-scroll", ".rc-table-wrap", ".fc-tabs", ".fc-table-wrap"];
  function saveScroll(document, body) {
    if (!document || !body?.getClientRects().length) return;
    document.scroll = [body, ...scrollAreas.map(s => body.querySelector(s))].map(el =>
      el && {top:el.scrollTop, left:el.scrollLeft}
    );
  }
  function restoreScroll(document, body) {
    // A temporary tab can cover this feature before the next navigation records its position.
    body.addEventListener("scroll", () => saveScroll(document, body), {capture:true, passive:true});
    if (!document.scroll) return;
    function restore() {
      [body, ...scrollAreas.map(s => body.querySelector(s))].forEach((el, i) => {
        if (el && document.scroll[i]) el.scrollTo(document.scroll[i].left, document.scroll[i].top);
      });
    }
    if (body.getClientRects().length) {
      restore();
    } else {
      const observer = new ResizeObserver(() => {
        if (!body.isConnected) { observer.disconnect(); return; }
        if (!body.getClientRects().length) return;
        observer.disconnect();
        restore();
      });
      observer.observe(body);
    }
  }

  window.featureWorkspaces = {get, openFund, compare, resolveFunds, showAnswerTarget, activate, close, saveScroll, restoreScroll};
})();
