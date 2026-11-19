# Figwright 本机连接说明

本配置用于同一仓库中的业务网站（根目录）和设计规范（design-system/）。请在本机编辑器中打开 zhice 仓库根目录；如果只打开 design-system 子目录，Cursor 不会读取上层仓库的项目配置。

## 已配置的客户端

任选你使用的一种，无需同时安装三个客户端：

| 客户端 | 项目配置 |
| --- | --- |
| Cursor | `.cursor/mcp.json` |
| Codex CLI / IDE | `.codex/config.toml` |
| Claude Code | `.mcp.json` |

三份配置均使用 `npx -y @figwright/mcp@0.7.0`。首次由本机客户端启动时下载并运行，无需给网站安装运行时依赖。固定版本与下方插件一致，更新时请同时更新服务端版本和插件。

## 本机准备

1. 安装 Node.js 20.19+ 或 22.12+，并确认编辑器能找到 `node` 和 `npx`。
2. 把仓库拉取到运行 Figma 桌面版的同一台电脑，打开仓库根目录。
3. 重启所用客户端，并在其 MCP 列表中启用 figwright。Codex 的项目配置仅在项目被信任后加载；保留客户端正常的工具确认机制。

## Figma 桌面端

1. 下载并解压 [Figwright v0.7.0 插件 ZIP](https://github.com/awdr74100/figwright/releases/download/v0.7.0/figwright-plugin-v0.7.0.zip)。
2. 打开 Figma 桌面版，在菜单选择 Plugins → Development → Import plugin from manifest…，选中解压目录中的 `manifest.json`。
3. 打开需要查看的设计文件，运行 Plugins → Development → Figwright。
4. 本机 MCP 客户端启动后，插件应显示 **Connected**。
5. 让本机客户端的 AI 调用 Figwright 的 `ping`，然后读取当前选中画板。可使用提示：“用 Figwright 执行 ping，再读取我当前选中的画板；本次只读，不修改设计。”
6. 使用期间保持客户端与插件运行。插件面板的 Run in background 可以隐藏面板；Figma 的关闭按钮会断开插件。

## 连接范围与排查

- GitHub 只保存启动配置，不运行桌面插件，也不会自动给 ChatGPT 云端会话增加本机 MCP 工具。
- Figwright 的转发服务使用本机 `127.0.0.1:3055`；客户端、服务端和 Figma 插件必须在同一台电脑。无需把端口开放到公网。
- 一直显示 Waiting：先确认本机 MCP 客户端中的 figwright 已启动，再确认插件运行在同一台电脑。
- 找不到 npx：在本机终端运行 `which npx`，按输出将当前客户端配置的 command 改为该电脑的绝对路径；个人路径不要提交到共享仓库。
- 版本不一致：在插件 Debug 页查看双方版本，并一起更新。
- 仓库配置语法可以检查，但真实连接需在本机以 Connected 和 ping 成功为准；未连接前不能视为安装验收完成。

## 参考

- [Figwright 官方说明](https://github.com/awdr74100/figwright)
- [Cursor MCP 配置](https://cursor.com/docs/mcp)
- [OpenAI 官方 Codex MCP 配置](https://developers.openai.com/codex/mcp)
