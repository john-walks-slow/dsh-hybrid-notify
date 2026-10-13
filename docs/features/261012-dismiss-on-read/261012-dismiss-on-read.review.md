# 已读后清除系统通知 — 检视报告

检视对象：`src/notification-engine.ts`、`src/channels/*`、`src/components/NotifySettings.tsx`、配置与文档的未提交改动。
结论：**条件准入**（无阻塞问题）。

## 概要

整体实现与需求一致，未发现阻止准入的问题；有一处 PWA 通知异步时序风险，建议补充处理。

## 需求对齐

实现覆盖了计划中的两类触发条件：会话注意力状态点消失，以及窗口回到前台且主视图显示该会话。撤除范围限于 PWA 和浏览器系统通知，开关默认开启；页面内 toast 不受影响。依赖注入、设置界面双语文案和构建产物也已更新。

## 阻塞问题

无。

## 建议修改

| ID | 位置 | 问题 | 建议 |
| --- | --- | --- | --- |
| S1 | `src/channels/pwa-notification.ts`（`dismissSession`）、`src/notification-engine.ts`（`dismissSessionNotifications`） | PWA 撤除与展示均为异步操作。如果会话在 `showNotification()` 尚未完成时被标记为已读，`getNotifications()` 可能先于通知实际出现执行，导致该通知没有被撤下。尤其在窗口迅速回到前台时，存在短暂留下陈旧通知的时序窗口。 | 协调同一会话的展示与撤除时序，例如在展示完成后检查会话是否已读并再次撤除，或对该会话的操作进行串行化。 |
| S2 | `src/components/NotifySettings.tsx`（新增开关） | 新增开关使用现有自绘按钮样式，但没有暴露 `role="switch"` 和 `aria-checked`；屏幕阅读器无法可靠获知其开关状态。 | 为该开关补充 `role="switch"` 与 `aria-checked`，并确保键盘操作仍可切换。 |

## 非阻塞问题

无。

## 处理结果

- **S1 已修**：`PwaNotificationChannel` 内部把 `show()` / `dismissSession()` 串到同一条 promise 队列上（`enqueue`），撤下不会越过尚未落地的展示。浏览器通道为同步 `new Notification()`，无此竞态。
- **S2 已修（范围扩大）**：抽出 `Toggle` 组件统一承载开关语义，设置页 7 处自绘开关全部改为 `role="switch"` + `aria-checked`，不再局限于新增开关。
- 顺带把 `attended` 变量改名为语义更准确的 `needsAttention`，并把 PWA `dismissSession` 中 `getRegistration()` 的拒绝路径纳入 try。

修改后复验：`npm run typecheck`、`npm run build`、引擎行为四场景、线上 GUI 冒烟（开关 `aria-checked` 与实际配置双向一致）全部通过。
