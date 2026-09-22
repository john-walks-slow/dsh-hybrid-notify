# 260922 engine-leaks 问题记录

## 现象

dsh web 长时间运行后内存持续增长、频繁 OOM。在另一台机器上通过二分法禁用全部本地 `link:` 插件后立即恢复流畅，确认泄漏源包含本插件。

## 根因

两处独立缺陷，均在 `src/notification-engine.ts`：

1. **visibility-detector 监听器泄漏**：`createVisibilityDetector()`（`src/visibility-detector.ts`）每次调用注册 3 个全局监听器（`visibilitychange` / `focus` / `blur`），并暴露 `_cleanup()` 方法；但引擎的 `dispose()` 从未调用它。客户端重初始化（HMR 热更新 / 插件重复注入，见 `client.ts` 的 `WINDOW_KEY` 单例替换路径）一次 = 永久泄漏 3 个监听器及其闭包。
2. **prevJobs 无限增长**：`check()` 中 `prevJobs`（`Record<sessionId, Map<jobId, job>>`）在每次快照变化时为每个 session 写入新的 job Map，但从不清理已删除 session 的旧 Map。随 session 创建/删除累积，已结束 session 的 job Map 永久驻留内存。

## 修复

1. `dispose()` 中补充 `(visibilityDetector as any)._cleanup?.()`，随引擎销毁移除 3 个全局监听器。
2. `check()` 的 job diff 循环后新增清理：以 `snap.byId` 的 key 集合为存活基准，删除 `prevJobs` 中已不存在 session 的条目。

## 验证

- `npm run typecheck` 通过。
- `npm run build` 成功，`node --check lib/client.js` 语法通过，产物包含两处修复。
- 代码检视：见同目录 `260922-engine-leaks.review.md`。
