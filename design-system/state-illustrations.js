(function stateIllustrationLibrary() {
  'use strict';

  const panel = document.getElementById('visual-panel-states');
  if (!panel) return;

  const illustrations = [
    { id: 'empty', title: '空状态', caption: '暂无数据' },
    { id: 'permission', title: '暂无权限', caption: '暂无访问权限' },
    { id: 'network', title: '加载失败 / 网络异常', caption: '加载失败 / 网络异常' },
    { id: 'search', title: '搜索无结果', caption: '暂无搜索结果' },
    { id: 'not-found', title: '页面不存在（404）', caption: '页面不存在' }
  ];
  const assetBase = 'assets/state-illustrations/';
  const svgCache = new Map();
  const copyIcon = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5.5" y="4.5" width="7" height="9" rx=".5" stroke="currentColor"/><path d="M10.5 4V2.5h-7v9H5" stroke="currentColor" stroke-linejoin="round"/></svg>';
  const downloadIcon = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7.5l3 3 3-3M2.5 11v2.5h11V11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  panel.innerHTML = '<section id="state-illustrations" class="state-illustration-library" aria-labelledby="state-illustrations-title">' +
    '<h2 id="state-illustrations-title">状态插画</h2>' +
    '<nav class="state-illustration-nav" aria-label="状态插画目录">' + illustrations.map(item =>
      '<a href="#state-illustration-' + item.id + '">' + item.title + '</a>'
    ).join('') + '</nav>' +
    '<div class="state-illustration-grid">' + illustrations.map(item =>
      '<article class="state-illustration-card" id="state-illustration-' + item.id + '" aria-labelledby="state-title-' + item.id + '">' +
        '<div class="state-illustration-card-heading"><h3 id="state-title-' + item.id + '">' + item.title + '</h3></div>' +
        '<figure class="state-illustration-preview"><img src="' + assetBase + item.id + '.svg" alt="" width="200" height="160" decoding="async">' +
          '<figcaption>' + item.caption + '</figcaption></figure>' +
        '<div class="state-illustration-actions">' +
          '<a href="' + assetBase + item.id + '.png" download="zhice-state-' + item.id + '.png" aria-label="下载' + item.title + ' PNG切图">' + downloadIcon + '<span>下载 PNG</span></a>' +
          '<a href="' + assetBase + item.id + '.svg" download="zhice-state-' + item.id + '.svg" aria-label="下载' + item.title + ' SVG切图">' + downloadIcon + '<span>下载 SVG</span></a>' +
          '<button type="button" data-state-art-copy="' + item.id + '" aria-label="复制' + item.title + ' SVG">' + copyIcon + '<span>复制 SVG</span></button>' +
        '</div>' +
      '</article>'
    ).join('') + '</div></section>';

  function notify(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    clearTimeout(window.tt);
    window.tt = setTimeout(() => { toast.style.display = 'none'; }, 2300);
  }

  function fetchSvg(id) {
    if (!svgCache.has(id)) {
      const request = fetch(assetBase + id + '.svg').then(response => {
        if (!response.ok) throw new Error('SVG unavailable');
        return response.text();
      }).then(text => {
        const document = new DOMParser().parseFromString(text, 'image/svg+xml');
        if (document.documentElement.localName !== 'svg' || document.querySelector('parsererror')) throw new Error('Invalid SVG');
        document.querySelectorAll('script').forEach(node => node.remove());
        return new XMLSerializer().serializeToString(document.documentElement);
      }).catch(error => {
        svgCache.delete(id);
        throw error;
      });
      svgCache.set(id, request);
    }
    return svgCache.get(id);
  }

  async function copySvg(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Embedded previews can deny Clipboard API access; try the local fallback.
      }
    }
    const active = document.activeElement;
    const selection = window.getSelection();
    const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i)) : [];
    const input = document.createElement('textarea');
    input.value = text;
    input.readOnly = true;
    input.className = 'state-illustration-clipboard';
    input.setAttribute('aria-label', '待复制的SVG');
    document.body.append(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } finally {
      input.remove();
      if (active instanceof HTMLElement) active.focus({ preventScroll: true });
      if (selection) {
        selection.removeAllRanges();
        ranges.forEach(range => selection.addRange(range));
      }
    }
    return copied;
  }

  panel.addEventListener('click', async event => {
    const button = event.target.closest('[data-state-art-copy]');
    if (!button || button.disabled) return;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    try {
      const copied = await copySvg(await fetchSvg(button.dataset.stateArtCopy));
      notify(copied ? 'SVG 已复制到剪贴板' : '复制未成功，请使用下载 SVG');
    } catch (error) {
      notify('复制未成功，请使用下载 SVG');
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  });

  let prefetched = false;
  function prefetchSvg() {
    if (prefetched) return;
    prefetched = true;
    illustrations.forEach(item => { fetchSvg(item.id).catch(() => {}); });
  }
  const tab = document.getElementById('visual-tab-states');
  tab?.addEventListener('click', prefetchSvg);

  function visitStateHash() {
    const id = location.hash.slice(1);
    if (id !== 'state-illustrations' && !illustrations.some(item => id === 'state-illustration-' + item.id)) return;
    const target = document.getElementById(id);
    if (!target || !tab) return;
    tab.click();
    requestAnimationFrame(() => {
      const offset = (document.querySelector('.topbar')?.getBoundingClientRect().height || 52) + 20;
      window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset), behavior: 'instant' });
    });
  }
  panel.querySelector('.state-illustration-nav').addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    visitStateHash();
  });
  window.addEventListener('hashchange', visitStateHash);
  visitStateHash();
})();
