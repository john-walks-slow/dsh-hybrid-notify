# 261012 notification-navigation 排查与修复

## 现象

点击插件发出的通知后，窗口可能获得焦点，但没有跳转到对应对话；页面内 toast 点击也无法正确打开对话。

## 根因

插件在 `src/notification-engine.ts` 和 `src/client.ts` 中调用 `ctx.sessions.open(sessionId)`。当前 DSH 的会话导航服务是 `ctx.uiWorkspace.openSession(sessionId)`，而 `ctx.sessions` 负责会话数据/控制，并不提供 UI 导航 `open` 方法。原调用使用可选链并捕获异常，因而错误不显现，只表现为通知关闭但对话未切换。

宿主声明的 client inject 也没有列出 `uiWorkspace`，所以仅替换方法名仍不够；需要将服务加入 `inject`。

## 修复

将页面内 toast、Web Notification 点击和 Service Worker postMessage 处理统一切换为 `ctx.uiWorkspace.openSession(sessionId)`，并在 client 插件的 inject 清单中添加 `uiWorkspace`。这使用 DSH 当前正式的 UI 导航服务，能够同时完成对话选择与界面展示。

另外修复 PWA 点击时没有任何已打开窗口的边缘路径：Service Worker 将 sessionId 编码到首页 URL，客户端启动后消费参数、打开会话并移除参数，避免刷新时重复跳转。

## 验收标准

- 点击页面内 toast 后打开对应的 session。
- 点击浏览器通知后聚焦窗口并打开对应的 session。
- 点击 PWA 系统通知后聚焦窗口并打开对应的 session。
- `npm run typecheck`、构建及 client bundle 语法检查通过。
