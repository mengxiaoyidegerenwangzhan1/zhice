(function improveDesignLibrary() {
  const componentPanel = document.getElementById('visual-panel-components');
  const components = Array.from(componentPanel.querySelectorAll('.component-spec'));
  const directory = document.createElement('nav');
  directory.className = 'component-directory';
  directory.setAttribute('aria-label', '组件目录');
  directory.innerHTML = '<div class="directory-links"></div>';
  const directoryLinks = directory.querySelector('.directory-links');
  const componentIds = ['business-tags', 'tabs', 'select', 'table', 'buttons', 'date', 'quick', 'back-top'];

  components.forEach((component, index) => {
    component.id = 'component-' + (component.dataset.catalogId || componentIds[index]);
    const title = component.querySelector('h3').textContent.trim();
    const link = document.createElement('a');
    link.href = '#' + component.id;
    link.textContent = title;
    directoryLinks.append(link);
  });
  componentPanel.prepend(directory);
  componentPanel.classList.add('has-component-directory');

  function visitComponentHash() {
    const id = location.hash.slice(1);
    if (!id.startsWith('component-')) return;
    const component = document.getElementById(id);
    if (!component) return;
    document.getElementById('visual-tab-components').click();
    requestAnimationFrame(() => component.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  window.addEventListener('hashchange', visitComponentHash);
  visitComponentHash();
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    directoryLinks.querySelectorAll('a').forEach(link => {
      const active = link.hash === '#' + visible[0].target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-100px 0px -50% 0px' });
  components.forEach(component => observer.observe(component));

  const iconGrid = document.getElementById('icon-library-grid');
  const icons = Array.from(iconGrid.querySelectorAll('.icon-cell'));
  const searchBar = document.createElement('div');
  searchBar.className = 'icon-search-bar';
  searchBar.innerHTML = '<label for="icon-search">搜索图标</label><input id="icon-search" type="search" placeholder="输入中文用途或英文名称，例如 下载 / download" autocomplete="off"><button type="button" id="clear-icon-search">清空</button><span id="icon-search-count" role="status" aria-live="polite"></span>';
  iconGrid.before(searchBar);
  const empty = document.createElement('p');
  empty.className = 'icon-no-results';
  empty.textContent = '没有找到匹配的图标，请更换关键词。';
  empty.hidden = true;
  iconGrid.after(empty);

  const aliases = {
    download: '下载 保存 导出', upload: '上传 导入', search: '搜索 查找 放大镜',
    close: '关闭 取消 叉', delete: '删除 垃圾桶 清除', remove: '删除 移除 减少',
    edit: '编辑 修改 铅笔', document: '文档 文件', file: '文件 文档', folder: '文件夹 目录',
    user: '用户 个人 人员', avatar: '头像 用户', setting: '设置 配置 齿轮', tools: '工具 设置',
    home: '首页 主页 房子', house: '首页 房子', calendar: '日历 日期 时间', date: '日期 日历',
    time: '时间 时钟', clock: '时钟 时间', timer: '计时 时间', view: '查看 显示 眼睛',
    hide: '隐藏 不可见 眼睛', lock: '锁 锁定', unlock: '解锁', link: '链接 连接',
    refresh: '刷新 更新 重置', reload: '刷新', loading: '加载 等待', check: '勾 选中 确认 成功',
    select: '选择 选中', success: '成功 正确', warning: '警告 提醒', warn: '警告',
    error: '错误 失败', info: '信息 提示', question: '问题 帮助', help: '帮助 问题',
    bell: '通知 铃铛', notification: '通知 消息', message: '消息 对话', chat: '聊天 对话',
    mail: '邮箱 邮件', phone: '电话 手机', mobile: '手机 移动', location: '位置 地点 定位',
    map: '地图 位置', star: '星星 收藏 评分', collection: '收藏', heart: '心 喜欢 收藏',
    plus: '添加 新增 加号', add: '添加 新增 加号', minus: '减少 减号', more: '更多 省略号',
    arrow: '箭头 方向', left: '左 向左 上一页', right: '右 向右 下一页', top: '上 顶部 置顶',
    bottom: '下 底部', back: '返回 后退', sort: '排序', filter: '筛选 过滤',
    menu: '菜单 目录', grid: '网格 宫格', list: '列表', table: '表格', data: '数据 图表',
    chart: '图表 统计', pie: '饼图 环图', trend: '趋势 折线 增长', histogram: '柱状图 直方图',
    money: '金额 钱 财务', coin: '硬币 钱', wallet: '钱包 钱', shopping: '购物 购物车',
    copy: '复制', printer: '打印', print: '打印', share: '分享 转发', export: '导出 下载',
    expand: '展开', fold: '折叠 收起', full: '全屏', zoom: '缩放', picture: '图片 照片',
    camera: '相机 拍照', video: '视频', play: '播放', pause: '暂停', stop: '停止',
    sun: '太阳 晴天', moon: '月亮 夜晚', cloud: '云 多云', rain: '雨 下雨', wind: '风',
    light: '灯 光', key: '钥匙 密钥', connection: '连接 网络', wifi: '无线 网络',
    monitor: '显示器 屏幕', computer: '电脑', ticket: '票据', flag: '旗帜 标记',
    aim: '目标 定位', compass: '指南针', position: '定位 位置', rank: '排名 排序'
  };
  const normalize = value => value.toLowerCase().replace(/[\s_-]+/g, '');
  icons.forEach(icon => {
    const name = icon.querySelector('.icon-cell-name').textContent;
    const keywords = Object.entries(aliases).filter(([key]) => name.toLowerCase().includes(key)).map(([, values]) => values).join(' ');
    icon.dataset.searchText = normalize(name + ' ' + keywords);
    icon.setAttribute('aria-label', name);
  });
  const input = document.getElementById('icon-search');
  function filterIcons() {
    const query = normalize(input.value.trim());
    let visible = 0;
    icons.forEach(icon => {
      const matches = !query || icon.dataset.searchText.includes(query);
      icon.hidden = !matches;
      if (matches) visible++;
    });
    document.getElementById('icon-search-count').textContent = visible + ' / ' + icons.length + ' 个图标';
    empty.hidden = visible !== 0;
  }
  input.addEventListener('input', filterIcons);
  document.getElementById('clear-icon-search').addEventListener('click', () => {
    input.value = '';
    filterIcons();
    input.focus();
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      input.value = '';
      filterIcons();
    }
  });
  filterIcons();
})();
