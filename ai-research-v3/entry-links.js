(function () {
  "use strict";

  let linkedView = "";
  function openLinkedView() {
    linkedView = "";
    switch (window.location.hash) {
      case "#fund-screen":
        window.studyNavigation.openPage("基金筛选");
        linkedView = "page:基金筛选";
        break;
      case "#fund-analysis":
        window.studyNavigation.openPage("基金分析");
        linkedView = "page:基金分析";
        break;
      case "#compare":
        window.studyNavigation.openPage("基金比较");
        linkedView = "page:基金比较";
        break;
      case "#manager-compare":
        window.studyNavigation.openPage("经理比较");
        linkedView = "page:经理比较";
        break;
      case "#etf-screen":
        window.studyNavigation.openPage("ETF筛选");
        linkedView = "page:ETF筛选";
        break;
      case "#allocation":
      case "#allocation-summary":
        linkedView = "chat:"+window.researchCanvas.openAllocationExample();
        if (window.location.hash === "#allocation-summary") {
          const summary = document.querySelector('#work [data-resource-trigger][aria-expanded="false"],#work [data-action="summary"][aria-expanded="false"]');
          if (summary) summary.click();
        }
        break;
    }
  }

  openLinkedView();
  window.addEventListener("hashchange", openLinkedView);
  window.addEventListener("study-view", event => {
    if (linkedView && event.detail !== linkedView) {
      linkedView = "";
      window.history.replaceState(null, "", window.location.pathname+window.location.search);
    }
  });
}());
