# 已读后清除系统通知 — 实施总结

日期：2026-10-12
版本：0.3.0

## 背景

系统通知弹出后留在通知栏，直到手动划掉或点击。用户常常先切回 DSH 窗口把内容看了、侧边栏状态点也消了，通知栏里那条却还挂着，看起来像还有未读。

## 实现

新增可开关选项 `dismissOnRead`（默认开，设置 → 通知 → 「已读后清除」），命中以下任一条件即撤下该会话的系统通知：

1. **未读点消失**：`uiSession.sessionStatus` 中该会话由「需要关注」（`completionUnread === true` 或 `pendingInteraction !== undefined`）转为「不需要关注」。
2. **回到前台查看**：窗口 `isForeground` 由假转真，且会话列表 `current`（主视图正在显示的会话）就是该通知所属会话。

撤下机制按通道各自实现：

- **PWA 通道**：`registration.getNotifications()` 遍历，关闭 `data.sessionId` 匹配的通知；`data.sessionId` 在 `show()` 时已写入，无需另建台账。展示与撤下都是异步的，通道内部用一条 promise 队列（`enqueue`）串行化，避免撤下越过尚未落地的展示。
- **浏览器通道**：页面侧无法枚举自己创建的 `Notification`，改为按 `sessionId → Set<Notification>` 持引用并 `close()`；`onclose`（用户划掉、点击、系统回收）时自清理，无界增长风险已消除。

页面内 toast 不在范围内：它就是眼前的界面元素，会自动过期或点一下关闭，与通知栏的陈旧感不同源。

设置页顺带把 7 处自绘开关统一收敛为 `Toggle` 组件，全部带 `role="switch"` / `aria-checked`。

## 变更文件

`src/notification-engine.ts`（订阅与撤下编排）、`src/channels/pwa-notification.ts`、`src/channels/web-notification.ts`、`src/types.ts`、`src/notify-config.ts`、`src/client.ts`（inject 增加 `uiSession`）、`src/components/NotifySettings.tsx`、`src/locales.ts`、`package.json`（版本 + `dsh.client.inject` 增加 `@deepseek-ai/dsh-client-ui-session`）、双语 README、`lib/`（构建产物）。

## 验证

- `npm run typecheck`、`node build.mjs`、`node --check lib/client.js|lib/index.js`、`git diff --check` 全通过。
- 真实浏览器内以假 ctx / 假 `Notification` 驱动真实引擎代码，四个场景全部符合预期（见 validation.md 第 1 节）。
- 真实 GUI（headless Chrome 打开线上实例）冒烟：插件仍正常加载（`globalThis.__dshNotifyEngine.alive === true`，说明 `uiSession` 注入解析成功）、设置页新行渲染正常、7 个开关的 `aria-checked` 与实际配置双向一致、无 console 报错。
- 检视（见 `.review.md`）结论条件准入，两条建议（PWA 展示/撤下时序竞态、开关可访问性）已修复并复验。
- 真机通知栏行为需用户验收，见 `261012-dismiss-on-read.validation.md`。
