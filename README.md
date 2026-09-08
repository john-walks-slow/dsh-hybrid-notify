# dsh-notify

多渠道通知插件 for DeepSeek Harness。

## 功能

- **三渠道自适应选择**：
  - 前台（visible + focused）→ 页面内 Toast
  - 后台 + PWA 可用 → PWA 系统通知（Service Worker）
  - 后台 + 无 PWA → 浏览器通知（Notification API）
- **提示音**：Web Audio API 合成音效，无需音频文件
- **事件监听**：
  - Agent 任务完成（turn/end）
  - 授权请求（approval/requested）
  - 用户问题（question/requested）
  - 计划审批请求（plan-review）
  - Agent 错误（agent-error）
  - 后台任务完成（job complete）
- **设置页面**：设置 → 通知
  - 总开关
  - 各渠道开关
  - 提示音开关 + 音量 + 试听
  - 各事件类型开关
  - 浏览器通知权限管理

## 构建

```bash
node build.mjs
```

自动部署到 `~/.dsh/profiles/web/node_modules/dsh-notify/`。

## 与 dsh-web-ui-notify 的关系

`dsh-web-ui-notify` 是已有的基础通知插件，仅支持浏览器通知（`new Notification()`），无页面内通知、无 PWA、无提示音。

`dsh-notify` 是其超集，安装时需禁用 `dsh-web-ui-notify` 以避免重复通知。

## 技术要点

- HMR 安全：`globalThis.__dshNotifyEngine` 单例模式
- Autoplay policy：首次用户交互时解锁 Web Audio
- Service Worker：Blob URL 动态注册，失败优雅降级
- 前台当前会话不通知（用户已看到）
