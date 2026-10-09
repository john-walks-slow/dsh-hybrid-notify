# 按标题正则忽略会话通知 — 计划

日期：2026-10-10

## 需求

按会话标题的正则表达式忽略部分会话的通知；默认忽略 `Telegram ·` 开头的会话（DSH-IM 的 Telegram 会话）。

## 背景

- dsh-im 建会话时标题前缀固定为 `<渠道名> · `（`src/channels/shared/session-channel-labels.mjs`），Telegram 即 `Telegram · <chat>`。
- 这类会话由 IM 消息驱动，turn 完成事件频繁，在桌面 GUI 侧是纯噪声。
- 现有配置只有事件级/通道级开关，无法按会话过滤。

## 设计

- 配置新增 `ignore.patterns: string[]`，默认 `["^Telegram ·"]`，随其他配置一起存 `localStorage`。
- 命中判断放在 `notify()` 最前：**命中即整体静默**（不弹通知、不响铃、不占去重指纹）。
- 判断用会话 `displayTitle`，与通知正文里的标题同源（`getSessionTitle`）。
- 正则逐条 `new RegExp(p).test(title)` 即时编译：事件频率低，无需缓存，也就不引入订阅/失配风险。无效正则跳过（永不匹配），设置页单独提示。
- 设置页新增「忽略会话」一栏：textarea（每行一个正则）+ 无效正则提示 + 「恢复默认」。textarea 文本本地态、只把解析后的 patterns 落库，避免行尾换行被回写吞掉。
- 顺带修两个既有隐患：
  - `deepMerge` 对数组按下标合并，用户清空规则时 `[]` 会被默认值撑回对象 `{0: ...}`，导致 `patterns` 不再是数组而抛错；现改为数组整体替换。
  - `build.mjs` 部署会 `rm` 掉 `node_modules/dsh-hybrid-notify` 这个指向本仓库的符号链接；现识别符号链接改为写穿，不再破坏 link 开发态。

## 影响面

`src/notify-config.ts`、`src/types.ts`、`src/notification-engine.ts`、`src/components/NotifySettings.tsx`、`src/locales.ts`，新增 `src/ignore-matcher.ts`、`src/deep-merge.ts`，`build.mjs`，双语 README。

## 验证方案

见 `261010-ignore-session-titles.validation.md`。
