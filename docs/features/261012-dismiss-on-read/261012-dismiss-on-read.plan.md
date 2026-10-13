# 已读后清除系统通知 — 计划

日期：2026-10-12

## 需求

界面上已经看过、会话状态点已经消掉之后，把该会话留在系统通知栏里的通知一并撤下。做成可开关的选项（默认开）。

## 背景

- 系统通知（PWA / 浏览器通知）弹出后留在通知栏，直到用户手动划掉或点击。用户往往先切回 DSH 窗口在界面里把内容看了，通知栏里那条却还挂着，容易误以为还有未读。
- DSH 侧边栏的状态点由 `uiSession.sessionStatus` 提供（`dsh-client-ui-workspace` 的 `completed: status?.completionUnread === true`）：
  - `completionUnread`：非主视图会话 running → idle 后置位，会话进入主视图（`retainedBy.mainView > 0`）时清除 —— 即「完成未读点」。
  - `pendingInteraction`：等待授权 / 回答 / 计划评审，清空即点消失 —— 即「待交互点」。
- 通知本身：PWA 通道经 `registration.showNotification()` 弹出并带 `tag` 与 `data.sessionId`；浏览器通道用 `new Notification()` 弹出，页面持有引用。

## 设计

### 触发（两种，任一命中即撤下该会话的系统通知）

1. **未读点消失**：`completionUnread || pendingInteraction !== undefined` 由真转假。
2. **回到前台看该会话**：窗口 `isForeground` 由假转真，且会话列表的 `current`（主视图正在显示的会话）就是该通知所属会话。覆盖「该会话本就在主视图、结束时不产生点，但通知已弹」的情况。

`completionUnread` 还包含「会话重新开始运行」的清除路径（用户发了新消息），此时旧通知同样是陈旧信息，一并撤下符合语义。

### 撤下机制（按通道各管各的）

- **PWA 通道**：`registration.getNotifications()` 遍历，关闭 `data.sessionId` 匹配的通知。无需自建台账——`data.sessionId` 在 `show()` 时已写入。
- **浏览器通道**：页面侧无枚举 API，按 `sessionId → Set<Notification>` 持引用，逐个 `close()`；`onclose`（用户划掉 / 点击 / 系统回收）时自清理，不会无界增长。
- 页面内 toast **不**纳入本次范围：它是同一界面内的提示，用户点开即关，不与通知栏的陈旧感同源。

### 配置与 UI

- 配置新增顶层 `dismissOnRead: boolean`，默认 `true`，与其余配置同存 `localStorage`。
- 设置页在「持久通知」之后新增「已读后清除」一栏，一个开关 + 说明文案。

### 依赖声明

引擎直接访问 `ctx.uiSession`，client 插件 `inject` 加入 `uiSession`，`package.json` 的 `dsh.client.inject` 加入 `@deepseek-ai/dsh-client-ui-session`（与 dsh-client-ui-approval 等内置 UI 插件一致）。

## 影响面

`src/types.ts`、`src/notify-config.ts`、`src/notification-engine.ts`、`src/client.ts`、`src/channels/pwa-notification.ts`、`src/channels/web-notification.ts`、`src/components/NotifySettings.tsx`、`src/locales.ts`、`package.json`（版本 0.3.0 + inject）、双语 README。

## 验证方案

见 `261012-dismiss-on-read.validation.md`（需真机 / 真实浏览器通知栏核验，无法用单测覆盖）。
