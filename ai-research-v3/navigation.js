(() => {
  'use strict';

  const workspace = document.querySelector('#workspace');
  const primary = document.querySelector('#primary-nav');
  const handle = document.querySelector('#nav-handle');
  const list = document.querySelector('#nav-list');
  const catalog = document.querySelector('#portal-catalog');
  const searchTrigger = document.querySelector('#search-trigger');
  const narrow = matchMedia('(max-width:600px)');
  const canvas = window.researchCanvas;
  const hasSidebarPortal = document.documentElement.dataset.prototype === 'v3';

  const directory = {
    '基金研究': {
      '公募基金': ['基金分析', '基金筛选', '基金比较'],
      'ETF专区': ['ETF总览', 'ETF筛选', 'ETF排行榜', '指数行情'],
      '经理&公司': ['经理筛选', '经理比较', '基金公司列表'],
      '选基工具': ['指标筛选', '数据浏览器', '股基交互', '相似基金']
    },
    '基金池': {'我的基金池': ['关注基金池', '权益基金优选池', '混合基金池']},
    '组合与配置': {'组合研究': ['我的组合', '组合分析'], '资产配置': ['配置分析']},
    '跟踪复盘': {'跟踪与复盘': ['自选与跟踪', '组合复盘']}
  };
  const quick = directory['基金研究']['公募基金'];
  const recentTitles = () => canvas.recentTitles().slice(0,12);
  const state = {
    collapsed:narrow.matches, floating:false, catalog:false, feature:'',
    activeGroups:new Set(['公募基金']), favorites:true, projects:true, recents:true,
    folders:new Set(['项目名称1']), location:'', chatFromRecents:false
  };
  let favoriteGroups = null;
  const asset = {
    newStudy:'nav-new-study.png', favorites:'nav-research-site.png', methods:'nav-methods.png',
    tasks:'nav-tasks.png', folder:'nav-project.png', recent:'nav-recent-chat.png',
    chat:'7a70f.svg', right:'63748.svg', down:'51083.svg', smallRight:'58d60.svg',
    smallDown:'c7557.svg', utilityRight:'6a8fd.svg', close:'nav-catalog-collapse.png', closeBottom:'12227.svg',
    sectionAdd:'nav-section-add.png',
    folderCompose:'folder-compose.png', folderMore:'folder-more.png',
    pinDefault:'nav-pin-default.png', pinActive:'nav-pin-active.png',
    folderSettings:'folder-settings.svg', folderDelete:'folder-delete.svg'
  };
  const el = (tag, name) => {const node=document.createElement(tag);if(name)node.className=name;return node;};
  function image(key, rotate = false) {
    const img=el('img');
    img.src='./icons/'+asset[key];
    img.alt='';
    if(rotate)img.style.transform='rotate(90deg)';
    return img;
  }
  function row(text, klass, act, options={}) {
    const button=el('button','nav-row '+klass+(options.selected?' current':''));
    button.type='button';
    button.dataset.nav=act;
    if(options.value!==undefined) button.dataset.value=String(options.value);
    if(options.icon) button.append(image(options.icon));
    const label=el('span','nav-label');label.textContent=text;button.append(label);
    button.setAttribute('aria-label',text);
    if(options.expanded!==undefined)button.setAttribute('aria-expanded',String(options.expanded));
    if(options.selected)button.setAttribute('aria-current',options.isPage?'page':'true');
    if(options.arrow){
      const end=el('span','nav-arrow');
      end.append(image(options.arrow,['down','smallDown','utilityRight','right'].includes(options.arrow)));
      button.append(end);
    }
    return button;
  }
  function group(klass,...children){const g=el('div',klass);g.append(...children);return g;}
  function toggleGroup(title,act,open,icon) {
    return row(title,'nav-unit',act,{icon,expanded:open,arrow:open?'down':'utilityRight'});
  }
  function textLeaves(names,act,current='') {
    return group('nav-children',...names.map(t=>row(t,'nav-leaf',act,{value:t,selected:current===t,isPage:act==='page'})));
  }
  function sectionHeader(title,act,isOpen,initialRight=false) {
    const button=row(title,'nav-caption',act,{expanded:isOpen});
    if(!hasSidebarPortal){
      button.append(image(isOpen&&!initialRight?'smallDown':'smallRight',true));
      return button;
    }
    const arrow=el('span','nav-section-chevron');
    arrow.setAttribute('aria-hidden','true');
    button.append(arrow);
    const isProject=act==='projects';
    const add=el('button','nav-section-add');
    add.type='button';
    add.dataset.tooltip=isProject?'新增项目':'新增研究';
    add.setAttribute('aria-label',add.dataset.tooltip);
    add.append(image('sectionAdd'));
    if(isProject){
      add.setAttribute('aria-haspopup','dialog');
      add.addEventListener('click',()=>{
        closeAccount();
        window.openNavProjectDialog(add,name=>{
          state.projects=true;
          render();
          showFloating();
          const folder=[...list.querySelectorAll('[data-nav="folder"]')].find(item=>item.dataset.value===name);
          folder?.focus({preventScroll:true});
          folder?.scrollIntoView({block:'nearest'});
        });
      });
    }else add.addEventListener('click',()=>activate('new'));
    return group('nav-section-heading',button,add);
  }
  function rowTool(iconKey,label,tooltip){
    const control=el('button','nav-row-tool');
    control.type='button';
    control.dataset.tooltip=tooltip;
    control.setAttribute('aria-label',label);
    control.append(image(iconKey));
    return control;
  }
  function pinButton(label,kind,pinned,toggle){
    const action=pinned?'取消置顶':'置顶';
    const control=rowTool(pinned?'pinActive':'pinDefault',label+' · '+action,pinned?action:action+kind);
    control.classList.add('nav-pin-toggle');
    control.setAttribute('aria-pressed',String(pinned));
    control.addEventListener('click',event=>{
      toggle();
      if(event.detail===0){
        const focusedRow=document.activeElement?.closest('.nav-folder-row,.nav-chat-row');
        focusedRow?.querySelector('.nav-pin-toggle')?.focus({preventScroll:true});
      }
    });
    return control;
  }
  function rowMenu(title,actions,returnFocus,folder=false){
    const menu=el('div',folder?'nav-row-menu nav-folder-menu':'nav-row-menu');
    menu.popover='auto';
    menu.setAttribute('role',folder?'menu':'group');
    menu.setAttribute('aria-label',title);
    for(const [label,callback,icon,klass] of actions){
      const item=el('button',klass);
      item.type='button';
      if(folder)item.setAttribute('role','menuitem');
      if(icon)item.append(image(icon));
      const text=el('span');text.textContent=label;item.append(text);
      item.addEventListener('click',()=>{menu.hidePopover();callback();});
      menu.append(item);
    }
    menu.addEventListener('keydown',event=>{
      if(event.key==='Escape'){
        event.preventDefault();menu.hidePopover();returnFocus();return;
      }
      if(!folder||!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
      const items=[...menu.children], i=items.indexOf(document.activeElement);
      const next={ArrowDown:(i+1)%items.length,ArrowUp:(i+items.length-1)%items.length,Home:0,End:items.length-1};
      event.preventDefault();items[next[event.key]].focus();
    });
    menu.firstElementChild.autofocus=true;
    return menu;
  }
  function folderMoreMenu(title,actions){
    const button=rowTool('folderMore',title,'更多操作');
    const menu=rowMenu(title,actions,()=>button.focus(),true);
    button.popoverTargetElement=menu;
    button.setAttribute('aria-haspopup','menu');
    function position(width,height){
      const anchor=button.getBoundingClientRect();
      const viewport=document.documentElement.clientWidth;
      const left=Math.max(4,Math.min(anchor.right-width,viewport-width-4));
      menu.style.left=left+'px';
      menu.style.top=(anchor.bottom+4+height<=window.innerHeight?anchor.bottom+4:Math.max(4,anchor.top-4-height))+'px';
    }
    menu.addEventListener('beforetoggle',event=>{
      if(event.newState!=='open')return;
      position(180,145);
    });
    menu.addEventListener('toggle',event=>{
      if(event.newState==='open')position(menu.offsetWidth,menu.offsetHeight);
    });
    return {button,menu};
  }
  function withFolderActions(button){
    if(!hasSidebarPortal)return button;
    const title=button.dataset.value;
    const compose=rowTool('folderCompose',title+' · 新研究','新研究');
    compose.addEventListener('click',()=>{
      closeAccount();
      visit('__new__',title);
    });
    const pinned=canvas.isProjectPinned(title);
    const togglePin=()=>{
      canvas.toggleProjectPin(title);
      navigationFocus('folder',title,true);
    };
    const pin=pinButton(title,'项目',pinned,togglePin);
    const actions=[
      [pinned?'取消置顶':'置顶项目',togglePin,pinned?'pinActive':'pinDefault'],
      ['项目设置',()=>{
        window.openNavProjectSettings(more.button,title,newName=>{
          if(state.folders.delete(title))state.folders.add(newName);
          render();navigationFocus('folder',newName);
        });
      },'folderSettings'],
      ['删除项目',()=>{
        window.openNavProjectDelete(more.button,title,()=>{
          state.folders.delete(title);
          navigationFocus('projects');
        });
      },'folderDelete','nav-menu-danger']
    ];
    const more=folderMoreMenu(title+' · 更多操作',actions);
    const entry=group('nav-action-row nav-folder-row',button,group('nav-row-tools',compose,pin,more.button),more.menu);
    entry.dataset.pinned=String(pinned);
    return entry;
  }
  function afterProjectChatAction({action,title,fromProject,toProject}){
    if(action==='move'){
      state.folders.add(toProject);
      render();
    }
    if(action==='remove'||action==='delete')navigationFocus('folder',fromProject);
    else navigationFocus('chat',title,action==='move'||action==='pin');
  }
  function afterRecentChatAction({action,title}){
    if(action==='delete'){
      navigationFocus('recents');
      return;
    }
    const target=[...list.querySelectorAll('.nav-recent')].find(item=>item.dataset.value===title);
    if(!target){navigationFocus('recents');return;}
    target?.focus({preventScroll:true});
    if(action==='pin')target?.scrollIntoView({block:'nearest'});
  }
  function chatRow(title,project,recent=false){
    const chat=row(title,recent?'nav-recent':'nav-chat','chat',{value:title,icon:recent?'recent':undefined,selected:state.location===title,isPage:true});
    if(!hasSidebarPortal)return chat;
    const onChange=recent?afterRecentChatAction:afterProjectChatAction;
    const more=window.createProjectChatMore({title,project,recent,canvas,onChange});
    const pinned=canvas.isChatPinned(title,recent);
    const pin=pinButton(title,'聊天',pinned,()=>{
      canvas.toggleChatPin(title,recent);
      onChange({action:'pin',title});
    });
    const entry=group(recent?'nav-chat-row nav-recent-chat-row':'nav-chat-row',chat,group('nav-row-tools',pin,more.button),more.menu);
    entry.dataset.chatName=title;
    entry.dataset.pinned=String(pinned);
    return entry;
  }
  function projectList(){
    const tree=group('nav-secondary-group',sectionHeader('项目','projects',state.projects));
    if(!state.projects)return tree;
    const folders=group('nav-stack');
    canvas.projectNames().forEach(name=>{
      const open=state.folders.has(name);
      const node=group('nav-project-group',withFolderActions(row(name,'nav-project','folder',{value:name,icon:'folder',expanded:open})));
      if(open){
        const chats=group('project-children',...canvas.projectChatTitles(name).map(title=>chatRow(title,name)));
        chats.dataset.projectName=name;
        node.append(chats);
      }
      folders.append(node);
    });
    tree.append(folders);
    return tree;
  }
  function recentList(){
    const box=group('nav-secondary-group',sectionHeader('最近','recents',state.recents,true));
    if(state.recents)box.append(group('nav-rows nav-recent-chats',...recentTitles().map(title=>chatRow(title,canvas.threadProject(title),true))));
    return box;
  }
  function visibleFeature(){
    if(document.querySelector('#work > .rc-utility'))return state.feature;
    return workspace.matches('.pane-tabs-open,.resources-open') ? '' : state.feature;
  }
  function syncFeatureSelection(){
    const feature=visibleFeature();
    for(const button of list.querySelectorAll('[data-nav="leaf"],[data-nav="page"]')){
      const selected=button.dataset.value===feature;
      button.classList.toggle('current',selected);
      if(selected)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    }
    if(state.catalog)buildCatalog();
  }
  const researchFavorites=hasSidebarPortal && window.createResearchFavorites({
    directory, defaults:quick, list, catalog, rowMenu,
    openFavorites(){openCatalog(true);},
    shortcut(name,category){
      const button=row(name,'nav-leaf','leaf',{value:name,selected:visibleFeature()===name,isPage:true});
      button.dataset.category=category;
      return button;
    }
  });

  function buildNavigation(){
    const feature=visibleFeature();
    const start=row('发起研究','nav-unit','new',{icon:'newStudy'});
    const fav=toggleGroup(hasSidebarPortal?'投研网站':'常用功能','favorites',state.favorites,'favorites');
    const methods=row('研究方法库','nav-unit','page',{value:'研究方法库',icon:'methods',selected:feature==='研究方法库',isPage:true});
    const tasks=row('定时任务','nav-unit','page',{value:'定时任务',icon:'tasks',arrow:hasSidebarPortal?undefined:'utilityRight',selected:feature==='定时任务',isPage:true});
    const favorites=group('');
    if(hasSidebarPortal){
      const all=el('button','nav-all-tools');
      all.type='button';
      all.dataset.portalToggle='sidebar';
      all.title='全部功能';
      all.setAttribute('aria-label','全部功能');
      all.setAttribute('aria-controls',catalog.id);
      const grid=el('img');
      grid.src='./icons/all-research-tools.png';
      grid.alt='';
      grid.width=18;
      grid.height=18;
      all.append(grid);
      favorites.append(group('nav-research-heading',fav,all));
    }else favorites.append(fav);
    if(state.favorites)favorites.append(researchFavorites ? researchFavorites.shortcuts() : textLeaves(quick,'page',feature));
    list.replaceChildren(group('nav-block',start),group('nav-block nav-stack',favorites),group('nav-block nav-stack',methods,tasks),projectList(),recentList());
  }

  function portalControl(label, klass, action, value, expanded) {
    const button=el('button',klass);
    button.type='button';
    button.dataset.nav=action;
    button.dataset.value=value;
    button.append(document.createTextNode(label));
    if(expanded!==undefined){
      button.setAttribute('aria-expanded',String(expanded));
      const arrow=el('i');arrow.setAttribute('aria-hidden','true');button.append(arrow);
    }
    return button;
  }
  function portalOpener(){
    if(hasSidebarPortal)return list.querySelector('.nav-all-tools');
    const featureButton=workspace.querySelector('.rc-function-actions [data-portal-toggle]');
    return featureButton?.getClientRects().length ? featureButton : workspace.querySelector('#work [data-portal-toggle]');
  }
  function positionPortal(){
    if(!state.catalog || (!state.feature && state.catalog!=='sidebar'))return;
    const opener=portalOpener();
    if(!opener?.getClientRects().length)return;
    const bounds=workspace.getBoundingClientRect();
    if(state.catalog==='sidebar'){
      const header=workspace.querySelector('#work .rc-toolbar, #work .rc-thread-head, #work .rc-function-head');
      if(!header)return;
      const edge=primary.getBoundingClientRect().right-bounds.left;
      const left=Math.max(8,Math.min(edge,bounds.width-catalog.offsetWidth-8));
      const top=header.getBoundingClientRect().bottom-bounds.top;
      catalog.style.setProperty('--portal-left',left+'px');
      catalog.style.setProperty('--portal-top',top+'px');
      return;
    }
    const anchor=opener.getBoundingClientRect();
    catalog.style.setProperty('--portal-top',(anchor.bottom-bounds.top+6)+'px');
    catalog.style.setProperty('--portal-right',Math.max(8,bounds.right-anchor.right)+'px');
  }
  function syncPortal(){
    const side=state.catalog==='sidebar', toolbar=state.catalog==='toolbar';
    workspace.classList.toggle('portal-docked',toolbar && !state.feature);
    workspace.classList.toggle('portal-dropdown',side || (toolbar && !!state.feature));
    workspace.classList.toggle('portal-from-sidebar',side);
    workspace.querySelectorAll('[data-portal-toggle]').forEach(button=>
      button.setAttribute('aria-expanded',String(button.dataset.portalToggle==='sidebar' ? side : toolbar)));
    positionPortal();
  }
  function buildCatalog(){
    catalog.hidden=!state.catalog;
    if(!state.catalog)favoriteGroups=null;
    catalog.toggleAttribute('data-manage-favorites',!!favoriteGroups);
    syncPortal();
    if(!state.catalog)return;
    const side=state.catalog==='sidebar';
    const feature=visibleFeature();
    const heading=el('h2');heading.textContent=side?'投研导航':'全局导航';
    catalog.setAttribute('aria-label',heading.textContent);
    const header=el('header','portal-header');header.append(heading);
    const close=el('button',side?'portal-side-close':'portal-toggle');
    close.type='button';close.dataset.portalToggle=side?'sidebar':'';
    close.setAttribute('aria-controls',catalog.id);
    close.setAttribute('aria-expanded','true');
    close.title='收起'+heading.textContent;
    if(side){
      close.setAttribute('aria-label',close.title);
      close.append(image('close'));
    }else close.append('投研网站',el('i'));
    header.append(close);
    const navigation=el('nav','portal-scroll');
    navigation.setAttribute('aria-label','投研网站功能');
    for(const [category,groups] of Object.entries(directory)){
      const section=el('section','portal-section');
      const title=el('h3','portal-section-title');
      title.textContent=category;
      title.id='portal-category-'+category;
      title.tabIndex=-1;
      section.setAttribute('aria-labelledby',title.id);
      section.append(title);
      const groupList=el('div','portal-section-groups');
      for(const [name,items] of Object.entries(groups)){
        const expanded=(favoriteGroups || state.activeGroups).has(name);
        const toggle=portalControl(name,'portal-group-toggle','subgroup',name,expanded);
        if(side && !expanded && items.includes(feature))toggle.setAttribute('aria-current','true');
        const container=group('portal-group',toggle);
        const leaves=el('div','portal-leaves');leaves.hidden=!expanded;
        for(const item of items){
          const button=portalControl(item,'portal-leaf','leaf',item);
          button.dataset.category=category;
          if(item===feature && (expanded || !side))button.setAttribute('aria-current','page');
          leaves.append(side ? researchFavorites.catalogRow(button) : button);
        }
        container.append(leaves);groupList.append(container);
      }
      section.append(groupList);navigation.append(section);
    }
    const scrollTop=catalog.querySelector('.portal-scroll')?.scrollTop || 0;
    catalog.replaceChildren(header,navigation);navigation.scrollTop=scrollTop;
  }
  function functionExpanded(){
    return workspace.classList.contains('rc-function-expanded');
  }
  function navCollapsed(){
    return state.collapsed || functionExpanded();
  }
  function showNavigationState(){
    const collapsed=navCollapsed();
    const canPin=!narrow.matches && !functionExpanded();
    workspace.classList.toggle('nav-collapsed',collapsed);
    handle.hidden=!collapsed;
    primary.hidden=collapsed&&!state.floating;
    handle.setAttribute('aria-expanded',String(state.floating));
    handle.setAttribute('aria-label',state.floating?(canPin?'固定导航':'关闭导航'):'展开导航');
    handle.title=state.floating && canPin?'点击固定导航':handle.getAttribute('aria-label');
  }
  function render(){
    showNavigationState();
    buildNavigation();buildCatalog();
  }
  function closeAccount(){window.studyAccount.close();}
  function navigationFocus(action,value,reveal=false){
    const buttons=[...workspace.querySelectorAll('button[data-nav]')];
    const target=buttons.find(b=>b.dataset.nav===action&&(value===undefined||b.dataset.value===value));
    target?.focus({preventScroll:true});
    if(reveal)target?.scrollIntoView({block:'nearest'});
  }
  let leaveTimer;
  function stopDismissTimer(){
    clearTimeout(leaveTimer);
  }
  function inNavigation(node){
    return node instanceof Node && (handle.contains(node)||primary.contains(node)||
      (node instanceof Element && !!node.closest('.nav-project-dialog')) ||
      (state.catalog==='sidebar' && catalog.contains(node)));
  }
  function showFloating(){
    stopDismissTimer();
    if(!navCollapsed()||state.floating)return;
    state.floating=true;
    showNavigationState();
  }
  function hideFloating(restoreFocus=false){
    stopDismissTimer();
    if(!state.floating)return;
    if(state.catalog==='sidebar')closeCatalog();
    state.floating=false;
    closeAccount();
    showNavigationState();
    if(restoreFocus)handle.focus({preventScroll:true});
  }
  function scheduleDismiss(){
    stopDismissTimer();
    leaveTimer=setTimeout(()=>{
      if(state.catalog==='sidebar'||document.querySelector('.nav-project-dialog[open]'))return;
      const focused=document.activeElement;
      if(focused!==handle && inNavigation(focused) && focused.matches(':focus-visible'))return;
      hideFloating();
    },240);
  }
  function changeDock(collapsed){
    stopDismissTimer();
    state.collapsed=collapsed;
    state.floating=false;
    state.catalog=false;
    closeAccount();
    render();
    const target=collapsed?handle:workspace.querySelector('#work [data-action="nav"]');
    target?.focus({preventScroll:true});
  }
  function toggleNavigation(){
    if(navCollapsed()&&(narrow.matches||functionExpanded())){
      if(state.floating)hideFloating(true);else showFloating();
      return;
    }
    changeDock(!state.collapsed);
  }
  function closeCatalog(focus=false){
    state.catalog=false;buildCatalog();
    if(focus)portalOpener()?.focus({preventScroll:true});
  }
  function openCatalog(manageFavorites=false){
    if(hasSidebarPortal)showFloating();
    else{
      if(functionExpanded() && !portalOpener()?.getClientRects().length)canvas.restoreFunction();
      hideFloating();
    }
    favoriteGroups=hasSidebarPortal && manageFavorites
      ? new Set(Object.values(directory).flatMap(groups=>Object.keys(groups)))
      : null;
    state.catalog=hasSidebarPortal?'sidebar':'toolbar';
    closeAccount();buildCatalog();
    if(favoriteGroups){
      catalog.querySelector('.portal-scroll').scrollTop=0;
      catalog.querySelector('.portal-heart')?.focus({preventScroll:true});
      return;
    }
    const feature=visibleFeature();
    const target=feature?'[aria-current]':hasSidebarPortal?'.portal-group-toggle':'.portal-header [data-portal-toggle]';
    const current=catalog.querySelector(target) || catalog.querySelector('.portal-group-toggle');
    current?.focus({preventScroll:true});
    if(hasSidebarPortal && feature)current?.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  function visit(page,section,answerTarget){
    state.catalog=false;
    state.location=page;
    stopDismissTimer();state.floating=false;
    if(page==='__new__'){
      state.feature='';canvas.compose(section);
    }else if(section==='chat'){
      state.feature='';canvas.chat(page);
    }else{
      window.studyPaneTabs?.revealApplication();
      window.studyResources?.close();
      state.feature=page;
      const subgroup=Object.keys(directory[section]||{}).find(name=>directory[section][name].includes(page));
      if(subgroup)state.activeGroups.add(subgroup);
      canvas.navigate(page,section,answerTarget);
    }
    render();
    if(page!=='__new__')document.querySelector('#work').focus({preventScroll:true});
  }
  function activate(action,value,keyboard,category){
    closeAccount();
    switch(action){
      case 'new': return visit('__new__','');
      case 'page': return visit(value,quick.includes(value)?'基金研究':'研究工具');
      case 'chat': return visit(value,'chat');
      case 'leaf': return visit(value,category);
      case 'subgroup': {
        const groups=favoriteGroups || state.activeGroups;
        if(groups.has(value))groups.delete(value);else groups.add(value);
        break;
      }
      case 'favorites': case 'projects': case 'recents':
        state[action]=!state[action];break;
      case 'folder':
        if(state.folders.has(value))state.folders.delete(value);else state.folders.add(value);break;
      default:return;
    }
    render();
    if(keyboard)navigationFocus(action,value);
  }
  function delegatedClick(e){
    const button=e.target.closest('[data-nav]');if(!button)return;
    if(button.dataset.nav==='chat')state.chatFromRecents=button.classList.contains('nav-recent');
    activate(button.dataset.nav,button.dataset.value,e.detail===0,button.dataset.category);
  }
  function searchableRoutes(){
    const routes=[
      {title:'发起研究',path:'工作台',action:'new'},
      {title:'研究方法库',path:'研究工具',action:'page'},
      {title:'定时任务',path:'研究工具',action:'page'}
    ];
    for(const [category,groups] of Object.entries(directory)){
      routes.push({title:category,path:'投研网站',action:'category',category});
      for(const [group,items] of Object.entries(groups)){
        routes.push({title:group,path:'投研网站 › '+category,action:'group',category,group});
        for(const title of items)routes.push({title,path:category+' › '+group,action:'leaf',category,group,aliases:title.replace('比较','对比')});
      }
    }
    return routes;
  }
  function openRoute(item){
    closeAccount();
    if(item.action==='new'||item.action==='page')return activate(item.action,item.title,false);
    if(item.action==='leaf')return visit(item.title,item.category);
    if(item.group)state.activeGroups.add(item.group);
    openCatalog();
    const target=item.group
      ? [...catalog.querySelectorAll('.portal-group-toggle')].find(button=>button.dataset.value===item.group)
      : document.getElementById('portal-category-'+item.category);
    target?.focus({preventScroll:true});
    target?.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  function openChat(item){
    state.chatFromRecents=!item.project;
    if(item.project){state.projects=true;state.folders.add(item.project);}
    else state.recents=true;
    visit(item.title,'chat');
  }
  window.studyNavigation={
    openTaskChat(id){
      const title=canvas.taskChatTitle(id);
      if(title)openChat({title,project:canvas.threadProject(title)});
    },
    isPortalOpen(){return state.catalog==='toolbar';},
    isRecentChatContext(title){
      return !canvas.threadProject(title) || (state.location===title && state.chatFromRecents);
    },
    syncPortal,
    searchableRoutes,
    closeFeature({background=false}={}){
      const view=canvas.closeFeature();
      if(!view)return;
      state.feature='';state.catalog=false;state.location=view.thread || '';
      render();
      if (!background) {
        const opener=portalOpener();
        (opener?.getClientRects().length?opener:handle).focus({preventScroll:true});
      }
    },
    setFunctionExpanded(active){
      if(functionExpanded()===active)return;
      stopDismissTimer();
      state.floating=false;state.catalog=false;
      closeAccount();
      workspace.classList.toggle('rc-function-expanded',active);
      render();
    },
    newStudy(){visit('__new__','');},
    openResearchTool({page,funds,period,start,end}={}){
      const selected=window.featureWorkspaces.resolveFunds(funds);
      let target=page;
      if(["基金比较","基金分析"].includes(page) && selected.length){
        target=selected.length===1 ? "基金分析" : "基金比较";
      }
      const item=searchableRoutes().find(route=>route.title===target && ["leaf","page"].includes(route.action));
      if(!item)return false;
      closeAccount();
      visit(target,item.category || "研究工具",{funds:selected,period,start,end});
      return true;
    },
    openPage(title){
      const item=searchableRoutes().find(route=>route.title===title && ['leaf','page'].includes(route.action));
      if(!item)return false;
      openRoute(item);
      return true;
    }
  };
  window.studySearch.setSource({
    chats:()=>canvas.searchThreads(),
    nav:searchableRoutes,
    openChat,
    openNav:openRoute
  });
  list.addEventListener('click',delegatedClick);catalog.addEventListener('click',delegatedClick);
  // Allow a short crossing between the navigation handle and its flyout.
  for(const surface of [handle,primary]){
    surface.addEventListener('pointerenter',event=>{
      if(event.pointerType==='touch')return;
      stopDismissTimer();
      if(surface===handle)showFloating();
    });
    surface.addEventListener('pointerleave',event=>{
      if(event.pointerType!=='touch' && state.floating && !inNavigation(event.relatedTarget))scheduleDismiss();
    });
  }
  handle.addEventListener('click',event=>{
    const floatingOnly=event.pointerType==='touch'||narrow.matches||functionExpanded();
    if(!state.floating && (event.detail===0||floatingOnly)){
      showFloating();
      if(event.detail===0)searchTrigger.focus({preventScroll:true});
    } else if(floatingOnly){
      hideFloating(true);
    } else {
      changeDock(false);
    }
  });
  document.addEventListener('pointerdown',event=>{
    if(state.floating && !inNavigation(event.target))hideFloating();
  });
  document.addEventListener('focusin',event=>{
    const menu=list.querySelector('.nav-row-menu:popover-open');
    if(menu && !menu.parentElement.contains(event.target))menu.hidePopover();
    if(state.floating && !inNavigation(event.target))hideFloating();
  });
  window.addEventListener('study-toggle-navigation',toggleNavigation);
  window.addEventListener('study-pane-tabs-visibility',syncFeatureSelection);
  window.addEventListener('study-resources-visibility',syncFeatureSelection);
  searchTrigger.addEventListener('click',()=>{
    const opener=state.floating?handle:searchTrigger;
    hideFloating();closeAccount();window.studySearch.open('all',opener);
  });
  workspace.addEventListener('click',event=>{
    const button=event.target.closest('[data-portal-toggle]');
    if(!button)return;
    if(state.catalog)closeCatalog(true);else openCatalog();
  });
  document.addEventListener('click',event=>{
    if(state.catalog && (state.catalog==='sidebar' || state.feature || narrow.matches) && !event.composedPath().includes(catalog) && !event.target.closest('[data-portal-toggle], .nav-add-favorite, .nav-favorite-row, .nav-favorites-list'))closeCatalog();
  },{capture:hasSidebarPortal});
  const portalObserver=new ResizeObserver(positionPortal);
  portalObserver.observe(workspace);
  portalObserver.observe(document.getElementById('work'));
  if(hasSidebarPortal){
    const closeRowPopup=()=>list.querySelector('.nav-row-menu:popover-open')?.hidePopover();
    list.addEventListener('scroll',()=>{closeRowPopup();positionPortal();},{passive:true});
    window.addEventListener('resize',closeRowPopup);
    window.addEventListener('study-pane-resized',closeRowPopup);
  }
  window.addEventListener('study-pane-resized',positionPortal);
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||event.defaultPrevented||document.querySelector('.nav-project-dialog[open]'))return;
    if(state.catalog)closeCatalog(true);
    else if(state.floating)hideFloating(true);
  });
  narrow.addEventListener('change',event=>{
    stopDismissTimer();
    state.collapsed=event.matches;state.floating=false;state.catalog=false;closeAccount();render();
  });
  window.onStudyCreated = (title, project)=>{
    if(state.location!==title)state.chatFromRecents=!project;
    state.location=title;state.feature='';state.recents=true;
    if(project)state.folders.add(project);
    render();
  };
  window.addEventListener('study-projects-changed',event=>{
    if(event.detail && state.location===event.detail.oldTitle)state.location=event.detail.newTitle;
    render();
  });
  canvas.home();render();
})();
