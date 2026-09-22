# 代码审查：引擎重初始化监听器泄漏 + prevJobs 无限增长修复

- 审查日期：2026-09-22
- 审查范围：`src/notification-engine.ts`（本次改动）、`src/visibility-detector.ts` / `src/client.ts`（上下游核对）、dsh web 上游（`dsh-client-hmr` / `cordis` / `dsh-api-session-controller` / `dsh-subagent`，验证重初始化路径与快照语义）、`lib/client.js`（产物核对）、`package.json`（版本号）
- 审查基线：工作区未提交改动（`git diff`，HEAD `06874b1`）

## 结论：准入

两处修复方向与实现均正确，泄漏闭环经代码路径逐一验证（含 dsh 上游源码核对）。未发现阻塞问题；3 项非阻塞建议见下。

## 修复 1：`dispose()` 补 `visibilityDetector._cleanup()` —— 有效，泄漏闭环

验证链（每一步均核对过源码）：

1. `_cleanup()` 存在于 `createVisibilityDetector()` 返回对象（`visibility-detector.ts:66-70`），移除且仅移除 3 个全局监听器（visibilitychange / focus / blur）。
2. **detector 归属**：`client.ts:34` 每次 `apply()` 创建一个新 detector，传给同一次 apply 创建的引擎（`initNotificationEngine` → `createEngine`），一一独占。dispose 时清理无共享风险；引擎已死，无 use-after-cleanup。
3. **真实重初始化路径（关键）**：dsh web 的 client-plugin HMR（`dsh-client-hmr/lib/client.js` 的 `reload()`）执行顺序为：
   `entry.ctx.registry.delete(runtime.callback)` → cordis `RegistryService.delete` 语义为 "Dispose every running fiber for a plugin"（逐 fiber dispose，子 ctx 销毁，所有 `ctx.effect` cleanup 执行）→ `await oldFiber.inertia`（等待拆卸完成）→ `entry.refresh()`（重新执行 apply：新 ctx、新 detector、新引擎）。
   即**旧引擎 `dispose()` 必然先于新 apply 运行**：旧 detector 的 3 个监听器被移除，新 detector 由新引擎持有。修复完整覆盖该路径。
4. 本机高频触发场景：`npm run build` 重写部署目录 `~/.dsh/profiles/web/node_modules/<pkg>/lib/client.js` → bundle mtime/size 变化 → client-hmr 轮询（默认 500ms）触发 SSE `rebuilt` 帧 → 打开中的浏览器热替换 entry。开发期每次重构建 = 一次引擎重初始化：修复前每次永久泄漏 3 个监听器及其闭包，修复后归零。
5. `initNotificationEngine` 中 `if (g[WINDOW_KEY]) g[WINDOW_KEY].dispose()` 分支实际为防御性死代码（`dispose()` 总是同时把 `g[WINDOW_KEY]` 置 null，"存在但已死"的状态不可达），无碍正确性。

## 修复 2：prevJobs 死 session 清理 —— 正确，存活基准选取恰当

1. `snap.byId` 是权威完整会话集合，不是过滤子集：
   - 顶层会话：host `session.list`（persisted ∪ live，`dsh-session-query` 的 `listSessions` 无 origin 过滤）全量投影；
   - subagent 会话：运行中经 `handleSessionAdded` **无条件 upsert**（显式处理 `origin === "subagent"`，`dsh-api-session-controller/lib/client.js:1927-1934`）；结束后 durable 保留（`handleSessionRemoved` 对 durable subagent 仅置 running:false，不 remove，`:1941-1958`）；冷记录继承父会话 cwd（`dsh-subagent/lib/index.js:663`）而入列（已实证 2026-09-21 一个 subagent 会话 header 带 cwd）。
   → **后台运行的 subagent 不会被误删 job map**，其 job 完成通知不受影响。
2. 清理模式与 dsh core 自身惯用法一致（session-manager 的 `prevRunning` / `completedNotifications` 同样按 seen-set 清理）。
3. 引擎内其余 diff 状态均有界：`prevSessionStates` 每次 check 全量重建（死 session 自然消失）、`prevSnap` 单引用替换、`notifiedSet` 5 分钟定时清空。无其他泄漏点。
4. 已知微小窗口：会话创建事件未达的竞态毫秒窗内，`jobsBySession` 可能先于 `byId` 出现新会话 → 其 prevJobs 条目被清 → 若 job 恰在该窗口内完成则丢一次通知。`jobComplete` 默认关闭（`notify-config.ts:31`），影响可忽略。

## 阻塞问题

无。

## 建议优化（非阻塞）

### 1. `_cleanup` 的类型安全

- 文件:行号：`src/notification-engine.ts:315`
- 问题：`(visibilityDetector as any)._cleanup?.()` —— 参数类型为 `SnapshotStore<VisibilityState>`，`_cleanup` 是经 `as any` spread 注入的自定义属性。`?.` 在方法必然存在时反而会掩盖未来重命名导致的**静默退化为泄漏**。
- 建议：在 `types.ts` 定义含 `_cleanup(): void` 的显式 detector 接口并作为 `initNotificationEngine` / `createEngine` 的参数类型，去掉 as any 与 `?.`。低优先级。

### 2. early-return 路径的 detector 遗弃（结构性隐患，当前无现实触发）

- 文件:行号：`src/notification-engine.ts:61-63`、`src/client.ts:31-40`
- 问题：旧引擎存活时 `initNotificationEngine` 直接返回，遗弃本次 apply 新建的 detector（3 个全局监听器）与新建 configStore / toastStore。当前无真实触发路径（HMR 先 dispose 旧 fiber；重复 factory 注册被 module loader 以 duplicate registration 拒绝；整页刷新清空 globalThis）。同路径下 settings 页绑定新 configStore 而引擎读旧 configStore（既有行为，非本次引入）。
- 建议：后续版本把 detector / toastStore 创建移入 init（或加窗口级单例），从根上消除该路径的遗弃可能。

### 3. client.ts 冗余 `pwaChannel.init()`

- 文件:行号：`src/client.ts:43-45`
- 问题：每次 apply 都 `new PwaNotificationChannel()` 并 `init()`，与引擎内部实例（`notification-engine.ts:83,90`）重复。SW 注册幂等（getRegistration → register），无泄漏无行为问题；仅整洁度。

## 无需修改项简述

- `dispose()` 内清理顺序（`_cleanup` 位于 unsubSessions / unlockCleanup 之后）：各清理项互不依赖，顺序无影响。✓
- `handle.alive = false` 先行 + `g[WINDOW_KEY]` 置空守卫：重复 dispose 安全。✓
- `package.json` 0.1.0 → 0.1.1：与修复发布匹配。✓

## 建议处理记录（2026-09-22，实施方）

1. **建议 1（`_cleanup` 类型安全）——已采纳**：`types.ts` 新增 `VisibilityDetectorStore` 接口（含**必选** `_cleanup: () => void`），`createVisibilityDetector()` 显式标注返回类型并移除 `as any` spread 注入；`initNotificationEngine` / `createEngine` 参数改用该接口，`dispose()` 中改为直接 `visibilityDetector._cleanup()`。未来重命名 `_cleanup` 将产生编译错误而非静默泄漏。
2. **建议 2（early-return 遗弃 detector）——已采纳最小修复**：`initNotificationEngine` 的存活早退路径现在调用 `visibilityDetector._cleanup()` 释放本次新建 detector 的 3 个监听器（该 detector 仅被引擎消费，无其他订阅方，清理安全）。"把 detector/toastStore 创建移入 init 或窗口级单例"的更大重构不在本次紧急修复范围，暂缓。
3. **建议 3（client.ts 冗余 `pwaChannel.init()`）——暂不采纳**：审查已确认 SW 注册幂等、无泄漏无行为问题，且该实例服务于 settings 页的可用性检测；紧急补丁中不做与泄漏无关的整理。

采纳建议 1、2 后已重新 `npm run typecheck`（通过）、`npm run build`（`node --check lib/client.js` 通过，产物含 3 处 `_cleanup`）并重新部署。

## 验证记录

- `npm run typecheck` 通过（本机独立复核）。
- 产物新鲜度：以与 build.mjs 完全相同的 esbuild 参数在 /tmp 重新打包 `src/client.ts`，与工作区 `lib/client.js` **字节级一致**；`node --check lib/client.js` 通过。
- 部署一致性：`~/.dsh/profiles/web/node_modules/dsh-hybrid-notify/lib/client.js` 与工作区一致（修复已于今日 14:03 部署线上）。
- 与 `260922-engine-leaks.validation.md` 验证项对应：本审查从代码路径上确认通知行为无回归（修复 2 分析第 1、4 条），内存趋势与通知行为两项留待实机确认。
