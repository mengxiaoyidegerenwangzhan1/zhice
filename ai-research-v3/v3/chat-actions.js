(() => {
  'use strict';

  function icon(asset) {
    const img = document.createElement('img');
    img.src = './icons/'+asset;
    img.alt = '';
    return img;
  }

  function menuItem(label, asset) {
    const item = document.createElement('button');
    item.type = 'button';
    item.setAttribute('role', 'menuitem');
    if (asset) item.append(icon(asset));
    const text = document.createElement('span');
    text.textContent = label;
    item.append(text);
    return item;
  }

  function menuBox(className, label) {
    const box = document.createElement('div');
    box.className = className;
    box.popover = 'auto';
    box.setAttribute('role', 'menu');
    box.setAttribute('aria-label', label);
    return box;
  }

  function position(box, trigger, side) {
    const anchor = trigger.getBoundingClientRect();
    const gap = 4;
    const width = box.offsetWidth, height = box.offsetHeight;
    const viewWidth = document.documentElement.clientWidth, viewHeight = window.innerHeight;
    let left = anchor.right - width;
    let top = anchor.bottom + gap;
    if (side) {
      left = anchor.right+gap+width <= viewWidth ? anchor.right+gap : anchor.left-width-gap;
      top = anchor.top;
    } else if (top+height > viewHeight-gap) top = anchor.top-gap-height;
    box.style.left = Math.max(gap,Math.min(left,viewWidth-width-gap))+'px';
    box.style.top = Math.max(gap,Math.min(top,viewHeight-height-gap))+'px';
  }

  function menuKeys(event, box) {
    const items = [...box.querySelectorAll(':scope > [role="menuitem"]:not(:disabled)')];
    const current = items.indexOf(document.activeElement);
    const index = {ArrowDown:(current+1)%items.length, ArrowUp:(current+items.length-1)%items.length,
      Home:0, End:items.length-1}[event.key];
    if (index===undefined) return;
    event.preventDefault();
    items[index]?.focus();
  }

  function openChatDialog(action,title,opener,onSaved) {
    const canvas = window.researchCanvas;
    const options = action==='rename' ? {
      title:'重命名', fieldLabel:'聊天名称', maxLength:80, submitLabel:'保存',
      save:name=>canvas.renameChat(title,name)
    } : {
      title:'删除聊天', submitLabel:'删除',
      confirmation:'确定删除「'+title+'」吗？该聊天的记录将一并删除。',
      save:()=>canvas.deleteChat(title)
    };
    window.openNavNameDialog(opener,{...options,name:title,onSaved});
  }

  window.studyChatActions = {
    isPinned(title) {
      return window.researchCanvas.isChatPinned(title,window.studyNavigation.isRecentChatContext(title));
    },
    run(action,title,opener) {
      if (action==='pin') {
        return window.researchCanvas.toggleChatPin(title,window.studyNavigation.isRecentChatContext(title));
      }
      if (action==='rename' || action==='delete') {
        openChatDialog(action,title,opener,()=>{
          const focusTarget = action==='delete' ? '#work textarea' : '#work [data-action="chat-more"]';
          document.querySelector(focusTarget)?.focus({preventScroll:true});
        });
      }
    }
  };

  window.createProjectChatMore = function ({title, project, canvas, onChange, recent=false}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-row-tool nav-chat-more';
    const label = title+' · 更多操作';
    button.dataset.tooltip = '更多操作';
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded','false');
    button.append(icon('folder-more.png'));
    const menu = menuBox('nav-row-menu nav-chat-menu'+(recent?' nav-recent-menu':''), label);
    button.popoverTargetElement = menu;
    const pin = menuItem('置顶','nav-pin-default.png');
    const rename = menuItem('重命名','chat-rename.svg');
    const section = document.createElement('div');
    section.className = 'nav-menu-section';
    section.textContent = '智策';
    const move = menuItem('移至项目','chat-move.svg');
    move.setAttribute('aria-haspopup','menu');
    move.setAttribute('aria-expanded','false');
    const arrow = document.createElement('i');
    arrow.className = 'nav-submenu-arrow';
    arrow.setAttribute('aria-hidden','true');
    move.append(arrow);
    const remove = recent ? null : menuItem('从项目中移除','chat-remove.svg');
    const del = menuItem('删除','folder-delete.svg');
    del.className = 'nav-menu-danger';
    const status = document.createElement('div');
    status.hidden = true;
    status.setAttribute('role','alert');
    const destinations = menuBox('nav-row-menu nav-chat-menu nav-chat-destinations','移至项目');
    if (recent) menu.append(pin,rename,move,del);
    else menu.append(pin,rename,section,move,remove,del);
    menu.append(status,destinations);

    function changed(action, nextTitle = title, nextProject = project) {
      onChange({action, oldTitle:title, title:nextTitle, fromProject:project, toProject:nextProject});
    }
    function commit(action, change, nextProject = project) {
      const message = change();
      if (message) {
        status.textContent = message;
        status.hidden = false;
        return;
      }
      if (menu.matches(':popover-open')) menu.hidePopover();
      changed(action,title,nextProject);
    }
    function closeDestinations() {
      if (destinations.matches(':popover-open')) destinations.hidePopover();
      move.setAttribute('aria-expanded','false');
    }
    function showDestinations(focusFirst) {
      if (move.disabled) return;
      if (!destinations.matches(':popover-open')) destinations.showPopover();
      position(destinations,move,true);
      move.setAttribute('aria-expanded','true');
      if (focusFirst) destinations.firstElementChild?.focus();
    }

    menu.addEventListener('beforetoggle', event => {
      if (event.target!==menu || event.newState!=='open') return;
      const pinned = canvas.isChatPinned(title,recent);
      pin.querySelector('span').textContent = pinned?'取消置顶':'置顶';
      pin.querySelector('img').src = pinned?'./icons/nav-pin-active.png':'./icons/nav-pin-default.png';
      status.hidden = true;
      destinations.replaceChildren();
      for (const name of canvas.projectNames().filter(name => name!==project)) {
        const item = menuItem(name);
        item.addEventListener('click',()=>commit('move',()=>canvas.moveChatToProject(title,name),name));
        destinations.append(item);
      }
      move.disabled = !destinations.childElementCount;
    });
    menu.addEventListener('toggle', event => {
      if (event.target!==menu) return;
      button.setAttribute('aria-expanded',String(event.newState==='open'));
      if (event.newState==='open') {
        position(menu,button,false);
        pin.focus({preventScroll:true});
      } else move.setAttribute('aria-expanded','false');
    });
    pin.addEventListener('click',()=>commit('pin',()=>canvas.toggleChatPin(title,recent)));
    rename.addEventListener('click',()=>{
      menu.hidePopover();
      openChatDialog('rename',title,button,name=>changed('rename',name));
    });
    del.addEventListener('click',()=>{
      menu.hidePopover();
      openChatDialog('delete',title,button,()=>changed('delete'));
    });
    remove?.addEventListener('click',()=>commit('remove',()=>canvas.moveChatToProject(title,''),''));
    destinations.addEventListener('toggle',event=>{
      move.setAttribute('aria-expanded',String(event.newState==='open'));
    });
    move.addEventListener('click',()=>showDestinations(true));
    move.addEventListener('pointerenter',event=>{
      if (event.pointerType==='mouse') showDestinations(false);
    });
    for (const item of [pin,rename,remove,del]) {
      item?.addEventListener('pointerenter',closeDestinations);
      item?.addEventListener('focus',closeDestinations);
    }
    destinations.addEventListener('keydown',event=>{
      if (event.key==='ArrowLeft'||event.key==='Escape') {
        event.preventDefault();
        closeDestinations();
        move.focus({preventScroll:true});
      } else menuKeys(event,destinations);
      event.stopPropagation();
    });
    menu.addEventListener('keydown',event=>{
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
      if (event.key==='Escape') {
        event.preventDefault();
        menu.hidePopover();
        button.focus({preventScroll:true});
      } else if (event.key==='ArrowRight' && event.target===move && !move.disabled) {
        event.preventDefault();
        showDestinations(true);
      } else menuKeys(event,menu);
    });
    return {button,menu};
  };
})();
