# 260922 engine-leaks 修复总结

## 背景

另一台机器上 dsh web 频繁 OOM，二分法禁用本地 `link:` 插件后定位到泄漏源，本插件在列。本机复核确认两处缺陷存在（`src/notification-engine.ts`）：

1. `dispose()` 未调用 visibilityDetector 的 `_cleanup()` → 每次引擎重初始化（HMR/重复注入）泄漏 3 个全局监听器。
2. `check()` 中 `prevJobs` 从不清理已删除 session 的条目 → 无限增长。

## 修复内容（v0.1.1）

1. `dispose()` 调用 `visibilityDetector._cleanup()` 移除监听器；并按检视建议升级为类型安全实现：`types.ts` 新增 `VisibilityDetectorStore` 接口（必选 `_cleanup`），`createVisibilityDetector()` 显式返回该类型，去除 `as any` 与 `?.`。
2. `check()` 以 `snap.byId` 为存活基准清理 `prevJobs` 中已删除 session 的条目。
3. 按检视建议修复 `initNotificationEngine` 存活早退路径遗弃新 detector 的隐患（早退时调用 `_cleanup()`）。

## 验证

- `npm run typecheck` 通过；`npm run build` + `node --check lib/client.js` 通过；产物与部署副本一致。
- 代码检视：准入（见 `260922-engine-leaks.review.md`），3 项非阻塞建议中 2 项采纳、1 项暂缓（处理记录附于 review 文档）。
- 线上实例 serve 的 combo bundle 已含修复标记，刷新页面即生效（client 侧改动无需重启 host）。
- 用户实机验证项见 `260922-engine-leaks.validation.md`（内存趋势 + 通知行为无回归）。

## 发布

- npm `dsh-hybrid-notify@0.1.1`；GitHub `john-walks-slow/dsh-hybrid-notify` main 分支。
