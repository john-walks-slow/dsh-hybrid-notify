# 261012 notification-navigation 修复总结

## 背景

通知点击后窗口可能获得焦点，但没有打开对应会话。排查确认插件调用了不存在的 `ctx.sessions.open()`；当前 DSH 将 UI 导航提供为 `ctx.uiWorkspace.openSession()`。

## 修复

- Toast 与系统通知统一通过 `ctx.uiWorkspace.openSession(sessionId)` 打开会话。
- 在 client 插件 inject 声明中加入 `uiWorkspace`。
- Service Worker 无可复用窗口时，打开带 sessionId 参数的首页；客户端启动时识别该参数并打开会话，然后清理 URL 参数，避免刷新重复导航。

## 验证

- `npm run typecheck` 通过。
- `npm run build`、`node --check lib/client.js`、`git diff --check` 通过。
- bundle 中不再包含 `sessions.open`，导航调用已切换为 `uiWorkspace.openSession`。
