window.__ModuleLoader__.load({
	id: "dsh-hybrid-notify",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);

// src/locales.ts
var NS = "notify";
var zh = {
  "settings.title": "\u901A\u77E5",
  "settings.desc": "\u914D\u7F6E\u591A\u6E20\u9053\u901A\u77E5\u4E0E\u63D0\u793A\u97F3",
  "settings.enabled": "\u542F\u7528\u901A\u77E5",
  "settings.channels": "\u901A\u77E5\u6E20\u9053",
  "settings.channels.inpage": "\u9875\u9762\u5185\u901A\u77E5",
  "settings.channels.pwa": "PWA \u7CFB\u7EDF\u901A\u77E5",
  "settings.channels.web": "\u6D4F\u89C8\u5668\u901A\u77E5",
  "settings.channels.test": "\u6D4B\u8BD5",
  "settings.channels.permission": "\u6388\u6743",
  "settings.channels.permissionGranted": "\u5DF2\u6388\u6743",
  "settings.channels.permissionDenied": "\u5DF2\u62D2\u7EDD",
  "settings.channels.permissionDeniedHint": "\u8BF7\u5728\u6D4F\u89C8\u5668\u8BBE\u7F6E\u4E2D\u624B\u52A8\u5F00\u542F",
  "settings.persistent": "\u6301\u4E45\u901A\u77E5",
  "settings.persistent.enabled": "\u91CD\u8981\u901A\u77E5\u4E0D\u81EA\u52A8\u6D88\u5931",
  "settings.persistent.desc": "\u6388\u6743\u8BF7\u6C42\u3001\u9519\u8BEF\u7B49\u9700\u8981\u64CD\u4F5C\u7684\u901A\u77E5\u4F1A\u7559\u5728\u901A\u77E5\u680F\u76F4\u5230\u624B\u52A8\u5173\u95ED",
  "settings.sound": "\u63D0\u793A\u97F3",
  "settings.sound.enabled": "\u542F\u7528\u63D0\u793A\u97F3",
  "settings.sound.volume": "\u97F3\u91CF",
  "settings.sound.test": "\u8BD5\u542C",
  "settings.sound.foregroundSound": "\u524D\u53F0\u4E5F\u64AD\u653E\u58F0\u97F3",
  "settings.sound.foregroundSoundDesc": "\u67E5\u770B\u5F53\u524D\u4F1A\u8BDD\u65F6\u4ECD\u64AD\u653E\u63D0\u793A\u97F3\uFF08\u4E0D\u5F39\u901A\u77E5\uFF09",
  "settings.events": "\u901A\u77E5\u4E8B\u4EF6",
  "settings.events.turnComplete": "\u4EFB\u52A1\u5B8C\u6210",
  "settings.events.approvalRequest": "\u6388\u6743\u8BF7\u6C42",
  "settings.events.questionRequest": "\u7528\u6237\u95EE\u9898",
  "settings.events.planReviewRequest": "\u8BA1\u5212\u5BA1\u6279\u8BF7\u6C42",
  "settings.events.agentError": "Agent \u9519\u8BEF",
  "settings.events.jobComplete": "\u540E\u53F0\u4EFB\u52A1\u5B8C\u6210",
  "settings.events.subagentComplete": "\u5B50\u4EE3\u7406\u5B8C\u6210",
  "settings.ignore": "\u5FFD\u7565\u4F1A\u8BDD",
  "settings.ignore.title": "\u6309\u6807\u9898\u5FFD\u7565",
  "settings.ignore.desc": "\u6BCF\u884C\u4E00\u4E2A\u6B63\u5219\u8868\u8FBE\u5F0F\uFF1B\u4F1A\u8BDD\u6807\u9898\u5339\u914D\u540E\uFF0C\u8BE5\u4F1A\u8BDD\u4E0D\u5F39\u901A\u77E5\u4E5F\u4E0D\u54CD\u94C3",
  "settings.ignore.placeholder": "^Telegram \xB7",
  "settings.ignore.hint": "\u9ED8\u8BA4\u5FFD\u7565 DSH-IM \u7684 Telegram \u4F1A\u8BDD\uFF1B\u53EF\u52A0 ^\u5FAE\u4FE1 \xB7\u3001^\u98DE\u4E66 \xB7 \u7B49",
  "settings.ignore.invalid": "\u65E0\u6548\u6B63\u5219\uFF0C\u5DF2\u8DF3\u8FC7\uFF1A",
  "settings.ignore.reset": "\u6062\u590D\u9ED8\u8BA4",
  "notify.turnComplete": "\u4EFB\u52A1\u5B8C\u6210",
  "notify.approvalRequest": "\u9700\u8981\u6388\u6743",
  "notify.questionRequest": "\u7B49\u5F85\u4F60\u7684\u56DE\u7B54",
  "notify.planReviewRequest": "\u7B49\u5F85\u4F60\u5BA1\u6279\u8BA1\u5212",
  "notify.agentError": "Agent \u51FA\u9519\u4E86",
  "notify.jobComplete": "\u540E\u53F0\u4EFB\u52A1\u5B8C\u6210",
  "notify.subagentComplete": "\u5B50\u4EE3\u7406\u5B8C\u6210",
  "toast.close": "\u5173\u95ED"
};
var en = {
  "settings.title": "Notifications",
  "settings.desc": "Configure multi-channel notifications and sounds",
  "settings.enabled": "Enable notifications",
  "settings.channels": "Channels",
  "settings.channels.inpage": "In-page notification",
  "settings.channels.pwa": "PWA system notification",
  "settings.channels.web": "Browser notification",
  "settings.channels.test": "Test",
  "settings.channels.permission": "Grant",
  "settings.channels.permissionGranted": "Granted",
  "settings.channels.permissionDenied": "Denied",
  "settings.channels.permissionDeniedHint": "Please enable it in your browser settings",
  "settings.persistent": "Persistent notifications",
  "settings.persistent.enabled": "Keep important notifications visible",
  "settings.persistent.desc": "Approval requests, errors and other actionable notifications stay until dismissed",
  "settings.sound": "Sound",
  "settings.sound.enabled": "Enable sound",
  "settings.sound.volume": "Volume",
  "settings.sound.test": "Test",
  "settings.sound.foregroundSound": "Play sound in foreground",
  "settings.sound.foregroundSoundDesc": "Play sound even when viewing the current session (no notification popup)",
  "settings.events": "Events",
  "settings.events.turnComplete": "Task complete",
  "settings.events.approvalRequest": "Approval request",
  "settings.events.questionRequest": "User question",
  "settings.events.planReviewRequest": "Plan review request",
  "settings.events.agentError": "Agent error",
  "settings.events.jobComplete": "Background job complete",
  "settings.events.subagentComplete": "Subagent complete",
  "settings.ignore": "Ignored sessions",
  "settings.ignore.title": "Ignore by title",
  "settings.ignore.desc": "One regex per line; a matching session title produces no notification and no sound",
  "settings.ignore.placeholder": "^Telegram \xB7",
  "settings.ignore.hint": "Defaults to DSH-IM Telegram sessions; add ^WeChat \xB7, ^Feishu \xB7 and so on",
  "settings.ignore.invalid": "Invalid regex, skipped: ",
  "settings.ignore.reset": "Reset to default",
  "notify.turnComplete": "Task complete",
  "notify.approvalRequest": "Approval required",
  "notify.questionRequest": "Waiting for your answer",
  "notify.planReviewRequest": "Waiting for plan review",
  "notify.agentError": "Agent error",
  "notify.jobComplete": "Background job complete",
  "notify.subagentComplete": "Subagent complete",
  "toast.close": "Close"
};

// src/deep-merge.ts
function deepMerge(base, override) {
  if (Array.isArray(override)) return override;
  if (typeof base !== "object" || base === null) return override ?? base;
  if (typeof override !== "object" || override === null) return override ?? base;
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = key in out ? deepMerge(out[key], value) : value;
  }
  return out;
}

// src/ignore-matcher.ts
var DEFAULT_IGNORE_PATTERNS = ["^Telegram \xB7"];
function isTitleIgnored(title, patterns) {
  if (!title) return false;
  for (const pattern of patterns) {
    try {
      if (new RegExp(pattern).test(title)) return true;
    } catch {
    }
  }
  return false;
}
function findInvalidPatterns(lines) {
  const invalid = [];
  for (const line of lines) {
    const pattern = line.trim();
    if (!pattern) continue;
    try {
      new RegExp(pattern);
    } catch {
      invalid.push(pattern);
    }
  }
  return invalid;
}
function parsePatternLines(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

// src/notify-config.ts
var PERSIST_KEY = "dsh.notify.config";
var DEFAULTS = {
  enabled: true,
  ignore: {
    patterns: [...DEFAULT_IGNORE_PATTERNS]
  },
  channels: {
    inpage: true,
    pwa: true,
    web: true
  },
  persistent: {
    enabled: true
  },
  sound: {
    enabled: true,
    volume: 0.5,
    foregroundSound: true
  },
  events: {
    turnComplete: true,
    approvalRequest: true,
    questionRequest: true,
    planReviewRequest: true,
    agentError: true,
    jobComplete: false,
    subagentComplete: false
  }
};
function createNotifyConfigStore() {
  let state = loadInitial();
  const listeners = /* @__PURE__ */ new Set();
  function loadInitial() {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (raw) return deepMerge(DEFAULTS, JSON.parse(raw));
    } catch {
    }
    return { ...DEFAULTS };
  }
  function persist() {
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
    } catch {
    }
  }
  function notify() {
    for (const fn of listeners) fn();
  }
  return {
    getSnapshot: () => state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    update: (updater) => {
      state = updater(state);
      persist();
      notify();
    },
    set: (next) => {
      state = next;
      persist();
      notify();
    }
  };
}

// src/visibility-detector.ts
function createVisibilityDetector() {
  let state = computeState();
  const listeners = /* @__PURE__ */ new Set();
  function computeState() {
    if (typeof document === "undefined") {
      return { isVisible: true, hasFocus: true, isForeground: true };
    }
    const isVisible = document.visibilityState === "visible";
    const hasFocus = document.hasFocus();
    return { isVisible, hasFocus, isForeground: isVisible && hasFocus };
  }
  function notify() {
    for (const fn of listeners) fn();
  }
  function update() {
    const next = computeState();
    if (next.isVisible !== state.isVisible || next.hasFocus !== state.hasFocus || next.isForeground !== state.isForeground) {
      state = next;
      notify();
    }
  }
  const onVisibilityChange = () => update();
  const onFocus = () => update();
  const onBlur = () => update();
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
  return {
    getSnapshot: () => state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    update: (updater) => {
      state = updater(state);
      notify();
    },
    set: (next) => {
      state = next;
      notify();
    },
    // expose cleanup via a custom property
    _cleanup: () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    }
  };
}

// src/toast-store.ts
var DEFAULT_DURATION = 5e3;
function createToastStore() {
  let items = [];
  const listeners = /* @__PURE__ */ new Set();
  const timers = /* @__PURE__ */ new Map();
  function notify() {
    for (const fn of listeners) fn();
  }
  function add(payload, duration = DEFAULT_DURATION) {
    const item = { ...payload, duration, exiting: false };
    items = [...items, item];
    notify();
    if (duration > 0) {
      const timer = setTimeout(() => beginExit(item.id), duration);
      timers.set(item.id, timer);
    }
  }
  function beginExit(id) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    items = items.map((t) => t.id === id ? { ...t, exiting: true } : t);
    notify();
    setTimeout(() => remove(id), 300);
  }
  function remove(id) {
    items = items.filter((t) => t.id !== id);
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    notify();
  }
  function clearAll() {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    items = [];
    notify();
  }
  return {
    getSnapshot: () => items,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    update: (updater) => {
      items = updater(items);
      notify();
    },
    set: (next) => {
      items = next;
      notify();
    },
    ...{ add, remove, beginExit, clearAll }
  };
}

// src/sound-manager.ts
var SoundManager = class {
  audioCtx = null;
  _unlocked = false;
  get isUnlocked() {
    return this._unlocked;
  }
  unlock() {
    if (this._unlocked) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();
      this._unlocked = true;
    } catch {
    }
  }
  play(level = "info", volume = 0.5) {
    if (!this._unlocked || !this.audioCtx) return;
    if (this.audioCtx.state === "suspended") this.audioCtx.resume();
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const pattern = this.getPattern(level);
    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    for (const v of pattern.voices) {
      const osc = ctx.createOscillator();
      osc.type = v.type;
      osc.frequency.value = v.freq;
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(master);
      const start = now + v.start;
      const end = start + v.dur;
      const peak = v.gain;
      g.gain.setValueAtTime(1e-4, start);
      g.gain.exponentialRampToValueAtTime(peak, start + 8e-3);
      g.gain.exponentialRampToValueAtTime(1e-4, end);
      osc.start(start);
      osc.stop(end + 0.01);
    }
  }
  getPattern(level) {
    switch (level) {
      case "success": {
        return {
          totalDur: 0.35,
          voices: [
            { freq: 523.25, type: "triangle", start: 0, dur: 0.22, gain: 0.5 },
            { freq: 659.25, type: "triangle", start: 0.06, dur: 0.22, gain: 0.4 },
            { freq: 783.99, type: "sine", start: 0.12, dur: 0.23, gain: 0.45 }
          ]
        };
      }
      case "error": {
        return {
          totalDur: 0.4,
          voices: [
            { freq: 329.63, type: "triangle", start: 0, dur: 0.18, gain: 0.45 },
            { freq: 415.3, type: "sine", start: 0.04, dur: 0.18, gain: 0.3 },
            { freq: 220, type: "triangle", start: 0.14, dur: 0.26, gain: 0.5 }
          ]
        };
      }
      case "warning": {
        return {
          totalDur: 0.3,
          voices: [
            { freq: 440, type: "triangle", start: 0, dur: 0.1, gain: 0.4 },
            { freq: 440, type: "triangle", start: 0.14, dur: 0.1, gain: 0.4 }
          ]
        };
      }
      default: {
        return {
          totalDur: 0.25,
          voices: [
            { freq: 392, type: "triangle", start: 0, dur: 0.12, gain: 0.35 },
            { freq: 493.88, type: "sine", start: 0.08, dur: 0.16, gain: 0.35 }
          ]
        };
      }
    }
  }
  installUnlockListeners() {
    const onGesture = () => this.unlock();
    document.addEventListener("click", onGesture, { once: false });
    document.addEventListener("keydown", onGesture, { once: false });
    return () => {
      document.removeEventListener("click", onGesture);
      document.removeEventListener("keydown", onGesture);
    };
  }
};

// src/channels/inpage-toast.ts
var InPageToastChannel = class {
  constructor(toastStore) {
    this.toastStore = toastStore;
  }
  toastStore;
  show(payload, duration = 5e3) {
    this.toastStore.add(payload, duration);
  }
};

// src/channels/pwa-notification.ts
var SW_URL = "/plugins/dsh-hybrid-notify/sw.js";
var SW_SCOPE = "/plugins/dsh-hybrid-notify/";
var PwaNotificationChannel = class {
  registration = null;
  initPromise = null;
  /**
   * Register the service worker. Idempotent.
   * Returns true if SW is registered and active.
   */
  async init() {
    if (this.initPromise) return this.initPromise;
    this.initPromise = this._doInit();
    return this.initPromise;
  }
  async _doInit() {
    if (!("serviceWorker" in navigator)) return false;
    try {
      const existing = await navigator.serviceWorker.getRegistration(SW_SCOPE);
      if (existing) {
        this.registration = existing;
        return true;
      }
      this.registration = await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
      if (this.registration.active) return true;
      await navigator.serviceWorker.ready;
      return true;
    } catch {
      return false;
    }
  }
  /** Whether this channel is available (SW registered + permission granted). */
  isAvailable() {
    return this.registration !== null && this.registration.active !== null && Notification.permission === "granted";
  }
  /** Request notification permission. */
  async requestPermission() {
    if (!("Notification" in window)) return "denied";
    if (Notification.permission === "granted") return "granted";
    return await Notification.requestPermission();
  }
  async show(payload, onOpen, requireInteraction) {
    if (!this.registration) await this.init();
    if (!this.registration) return;
    try {
      await this.registration.showNotification(payload.title, {
        body: payload.body,
        tag: payload.id,
        data: { sessionId: payload.sessionId },
        silent: true,
        requireInteraction: requireInteraction ?? false
      });
    } catch {
    }
  }
};

// src/channels/web-notification.ts
var WebNotificationChannel = class {
  /** Whether basic Notification API is available. */
  isAvailable() {
    return typeof Notification !== "undefined";
  }
  /** Current permission state. */
  getPermission() {
    if (typeof Notification === "undefined") return "denied";
    return Notification.permission;
  }
  /** Request notification permission. */
  async requestPermission() {
    if (typeof Notification === "undefined") return "denied";
    if (Notification.permission === "granted") return "granted";
    return await Notification.requestPermission();
  }
  /**
   * Show a notification. On click: focus window + open the source session.
   * Same behavior as PWA channel's notificationclick handler.
   */
  show(payload, onOpen, requireInteraction) {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;
    try {
      const n = new Notification(payload.title, {
        body: payload.body,
        tag: payload.id,
        silent: true,
        requireInteraction: requireInteraction ?? false
      });
      n.onclick = () => {
        window.focus();
        onOpen?.(payload.sessionId);
        n.close();
      };
    } catch {
    }
  }
};

// src/notification-engine.ts
var WINDOW_KEY = "__dshNotifyEngine";
function initNotificationEngine(ctx, configStore, visibilityDetector, toastStore) {
  const g = globalThis;
  if (g[WINDOW_KEY] && g[WINDOW_KEY].alive) {
    visibilityDetector._cleanup();
    return g[WINDOW_KEY].toastStore;
  }
  if (g[WINDOW_KEY]) g[WINDOW_KEY].dispose();
  g[WINDOW_KEY] = createEngine(ctx, configStore, visibilityDetector, toastStore);
  return g[WINDOW_KEY].toastStore;
}
function createEngine(ctx, configStore, visibilityDetector, toastStore) {
  const sessions = ctx.sessions;
  const t = ctx.locale.bind("notify");
  const inPageChannel = new InPageToastChannel(toastStore);
  const pwaChannel = new PwaNotificationChannel();
  const webChannel = new WebNotificationChannel();
  const sound = new SoundManager();
  const unlockCleanup = sound.installUnlockListeners();
  pwaChannel.init().catch(() => {
  });
  const notifiedSet = /* @__PURE__ */ new Set();
  let prevSnap = null;
  let prevSessionStates = {};
  let prevJobs = {};
  function makeFingerprint(sessionId, event, extra) {
    return `${sessionId}:${event}${extra ? ":" + extra : ""}`;
  }
  function shouldNotify(event, sessionId) {
    const config = configStore.getSnapshot();
    if (!config.enabled) return false;
    if (!config.events[event]) return false;
    const visState = visibilityDetector.getSnapshot();
    if (visState.isForeground && sessionId && sessionId === prevSnap?.current) {
      return false;
    }
    return true;
  }
  function shouldPlaySound(event, sessionId, _level) {
    const config = configStore.getSnapshot();
    if (!config.enabled) return false;
    if (!config.events[event]) return false;
    if (!config.sound.enabled) return false;
    const visState = visibilityDetector.getSnapshot();
    if (visState.isForeground && sessionId && sessionId === prevSnap?.current) {
      return config.sound.foregroundSound;
    }
    return true;
  }
  let permissionRequested = false;
  async function ensurePermission() {
    if (permissionRequested) return;
    permissionRequested = true;
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "default") return;
    try {
      await Notification.requestPermission();
    } catch {
    }
  }
  const openSession = (sessionId) => {
    window.focus();
    if (sessionId) {
      ctx.uiWorkspace.openSession(sessionId);
    }
  };
  function dispatchNotification(payload) {
    const config = configStore.getSnapshot();
    if (!config.enabled) return;
    const visState = visibilityDetector.getSnapshot();
    const isForeground = visState.isForeground;
    const requireInteraction = config.persistent.enabled && (payload.level === "warning" || payload.level === "error");
    if (isForeground && config.channels.inpage) {
      inPageChannel.show(payload, requireInteraction ? 0 : 5e3);
      return;
    }
    if (!isForeground) {
      if (config.channels.pwa && pwaChannel.isAvailable()) {
        pwaChannel.show(payload, openSession, requireInteraction);
      } else if (config.channels.web && webChannel.isAvailable()) {
        if (webChannel.getPermission() === "granted") {
          webChannel.show(payload, openSession, requireInteraction);
        } else {
          ensurePermission();
          if (config.channels.inpage) inPageChannel.show(payload, requireInteraction ? 0 : 5e3);
        }
      } else if (config.channels.inpage) {
        inPageChannel.show(payload, requireInteraction ? 0 : 5e3);
      }
    }
  }
  function notify(event, sessionId, title, body, level) {
    const config = configStore.getSnapshot();
    if (!config.enabled || !config.events[event]) return;
    if (isTitleIgnored(getSessionTitle(sessions.list.getSnapshot(), sessionId), config.ignore.patterns)) return;
    const fp = makeFingerprint(sessionId, event);
    if (notifiedSet.has(fp)) return;
    notifiedSet.add(fp);
    if (shouldPlaySound(event, sessionId, level)) {
      sound.play(level, config.sound.volume);
    }
    if (!shouldNotify(event, sessionId)) return;
    const payload = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      event,
      title,
      body,
      level,
      sessionId,
      timestamp: Date.now()
    };
    dispatchNotification(payload);
  }
  function getSessionTitle(snap, sessionId) {
    const s = snap.byId[sessionId];
    return s?.displayTitle || s?.title || sessionId.slice(0, 8);
  }
  function check() {
    const snap = sessions.list.getSnapshot();
    for (const [id, summary] of Object.entries(snap.byId)) {
      const prev = prevSessionStates[id] ?? { running: summary.running, pendingInteraction: summary.pendingInteraction };
      if (prev.running === true && summary.running === false) {
        if (summary.origin === "subagent") {
          notify("subagentComplete", id, t("notify.subagentComplete"), getSessionTitle(snap, id), "success");
        } else {
          notify("turnComplete", id, t("notify.turnComplete"), getSessionTitle(snap, id), "success");
        }
      }
      if (prev.pendingInteraction !== summary.pendingInteraction) {
        if (summary.pendingInteraction === "approval") {
          notify("approvalRequest", id, t("notify.approvalRequest"), getSessionTitle(snap, id), "warning");
        }
        if (summary.pendingInteraction === "question") {
          notify("questionRequest", id, t("notify.questionRequest"), getSessionTitle(snap, id), "info");
        }
        if (summary.pendingInteraction === "plan-review") {
          notify("planReviewRequest", id, t("notify.planReviewRequest"), getSessionTitle(snap, id), "info");
        }
      }
    }
    const liveSessionIds = new Set(Object.keys(snap.byId));
    for (const [sessionId, jobList] of Object.entries(snap.jobsBySession ?? {})) {
      const prevJobMap = prevJobs[sessionId] ?? /* @__PURE__ */ new Map();
      const currJobMap = /* @__PURE__ */ new Map();
      for (const job of jobList) {
        currJobMap.set(job.id, job);
        const prev = prevJobMap.get(job.id);
        if (prev && prev.status === "running" && (job.status === "completed" || job.status === "failed" || job.status === "killed")) {
          const level = job.status === "completed" ? "success" : job.status === "failed" ? "error" : "warning";
          notify("jobComplete", sessionId, t("notify.jobComplete"), job.label, level);
        }
      }
      prevJobs[sessionId] = currJobMap;
    }
    for (const id of Object.keys(prevJobs)) {
      if (!liveSessionIds.has(id)) delete prevJobs[id];
    }
    const nextStates = {};
    for (const [id, summary] of Object.entries(snap.byId)) {
      nextStates[id] = { running: summary.running, pendingInteraction: summary.pendingInteraction };
    }
    prevSessionStates = nextStates;
    prevSnap = snap;
  }
  const unsubSessions = sessions.list.subscribe(() => check());
  const onMessage = (event) => {
    const data = event.data;
    if (data?.type === "notify:focus-session") {
      openSession(data.sessionId);
    }
  };
  navigator.serviceWorker?.addEventListener?.("message", onMessage);
  check();
  const cleanupTimer = setInterval(() => {
    notifiedSet.clear();
  }, 5 * 60 * 1e3);
  const handle = {
    toastStore,
    alive: true,
    dispose() {
      handle.alive = false;
      unsubSessions();
      unlockCleanup();
      visibilityDetector._cleanup();
      navigator.serviceWorker?.removeEventListener?.("message", onMessage);
      clearInterval(cleanupTimer);
      toastStore.clearAll?.();
      if (globalThis[WINDOW_KEY] === handle) globalThis[WINDOW_KEY] = null;
    }
  };
  ctx.effect(() => {
    return () => {
      handle.dispose();
    };
  }, "notify: notification engine");
  return handle;
}

// src/components/ToastContainer.tsx
var import_react2 = require("react");

// src/components/Toast.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var LEVEL_STYLES = {
  info: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-border-l1)", icon: "\u2139" },
  success: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-state-success-primary)", icon: "\u2713" },
  warning: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-state-warn-primary)", icon: "\u26A0" },
  error: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-state-error-primary)", icon: "\u2715" }
};
var Toast = (0, import_react.memo)(function Toast2({ item, onClose, onClick }) {
  const [progress, setProgress] = (0, import_react.useState)(100);
  const rafRef = (0, import_react.useRef)(0);
  const startRef = (0, import_react.useRef)(0);
  (0, import_react.useEffect)(() => {
    if (item.duration <= 0 || item.exiting) return;
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.max(0, 100 - elapsed / item.duration * 100);
      setProgress(pct);
      if (pct > 0 && !item.exiting) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [item.duration, item.exiting]);
  const style = LEVEL_STYLES[item.level] ?? LEVEL_STYLES.info;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      onClick: () => onClick?.(item),
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        padding: "10px 12px",
        marginBottom: "8px",
        minWidth: "280px",
        maxWidth: "360px",
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderLeft: `3px solid ${style.border}`,
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        cursor: onClick ? "pointer" : "default",
        pointerEvents: "auto",
        color: "var(--dsw-alias-label-primary)",
        fontSize: "13px",
        lineHeight: "1.4",
        opacity: item.exiting ? 0 : 1,
        transform: item.exiting ? "translateX(100%)" : "translateX(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        position: "relative",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: "14px", flexShrink: 0, marginTop: "1px" }, children: style.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontWeight: 500, marginBottom: item.body ? "2px" : 0 }, children: item.title }),
          item.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { color: "var(--dsw-alias-label-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: item.body })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onClose(item.id);
            },
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "var(--dsw-alias-label-tertiary)",
              padding: "0",
              flexShrink: 0,
              lineHeight: 1
            },
            "aria-label": "Close",
            children: "\u2715"
          }
        ),
        item.duration > 0 && !item.exiting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "2px",
              width: `${progress}%`,
              background: style.border,
              opacity: 0.5,
              transition: "none"
            }
          }
        )
      ]
    }
  );
});

// src/components/ToastContainer.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ToastContainer = (0, import_react2.memo)(function ToastContainer2({ toastStore, onSessionClick }) {
  const items = (0, import_react2.useSyncExternalStore)(
    (fn) => toastStore.subscribe(fn),
    () => toastStore.getSnapshot(),
    () => []
  );
  if (items.length === 0) return null;
  const handleClose = (id) => {
    toastStore.beginExit?.(id);
  };
  const handleClick = (item) => {
    if (item.sessionId && onSessionClick) {
      onSessionClick(item.sessionId);
    }
    handleClose(item.id);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      style: {
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 20,
        padding: "16px",
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "flex-end",
        pointerEvents: "none",
        maxHeight: "100vh",
        overflow: "hidden"
      },
      children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Toast, { item, onClose: handleClose, onClick: handleClick }, item.id))
    }
  );
});

// src/components/NotifySettings.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var EVENT_KEYS = [
  "turnComplete",
  "approvalRequest",
  "questionRequest",
  "planReviewRequest",
  "agentError",
  "jobComplete",
  "subagentComplete"
];
var EVENT_LABELS = {
  turnComplete: "settings.events.turnComplete",
  approvalRequest: "settings.events.approvalRequest",
  questionRequest: "settings.events.questionRequest",
  planReviewRequest: "settings.events.planReviewRequest",
  agentError: "settings.events.agentError",
  jobComplete: "settings.events.jobComplete",
  subagentComplete: "settings.events.subagentComplete"
};
var CHANNEL_KEYS = ["inpage", "pwa", "web"];
var CHANNEL_LABELS = {
  inpage: "settings.channels.inpage",
  pwa: "settings.channels.pwa",
  web: "settings.channels.web"
};
function NotifySettingsSection({ configStore, toastStore, pwaChannel, webChannel, t }) {
  const config = (0, import_react3.useSyncExternalStore)(
    (fn) => configStore.subscribe(fn),
    () => configStore.getSnapshot()
  );
  const [soundMgr] = (0, import_react3.useState)(() => new SoundManager());
  const [ignoreText, setIgnoreText] = (0, import_react3.useState)(() => configStore.getSnapshot().ignore.patterns.join("\n"));
  const invalidPatterns = findInvalidPatterns(ignoreText.split("\n"));
  const update = (0, import_react3.useCallback)((patch) => {
    configStore.update((prev) => ({ ...prev, ...patch }));
  }, [configStore]);
  const updateChannels = (0, import_react3.useCallback)((key, val) => {
    configStore.update((prev) => ({ ...prev, channels: { ...prev.channels, [key]: val } }));
  }, [configStore]);
  const updateSound = (0, import_react3.useCallback)((key, val) => {
    configStore.update((prev) => ({ ...prev, sound: { ...prev.sound, [key]: val } }));
  }, [configStore]);
  const updateEvent = (0, import_react3.useCallback)((key, val) => {
    configStore.update((prev) => ({ ...prev, events: { ...prev.events, [key]: val } }));
  }, [configStore]);
  const updateIgnoreText = (0, import_react3.useCallback)((text) => {
    setIgnoreText(text);
    const patterns = parsePatternLines(text);
    configStore.update((prev) => ({ ...prev, ignore: { patterns } }));
  }, [configStore]);
  const ensureSoundUnlocked = (0, import_react3.useCallback)(() => {
    if (!soundMgr.isUnlocked) soundMgr.unlock();
  }, [soundMgr]);
  const testChannel = (0, import_react3.useCallback)((key) => {
    ensureSoundUnlocked();
    if (config.sound.enabled) soundMgr.play("info", config.sound.volume);
    const payload = {
      id: `test-${Date.now()}`,
      event: "turnComplete",
      title: t("settings.channels.test"),
      body: t(CHANNEL_LABELS[key]),
      level: "info",
      timestamp: Date.now()
    };
    if (key === "inpage") {
      toastStore.add?.(payload, 5e3);
    } else if (key === "pwa" && pwaChannel) {
      pwaChannel.show(payload, void 0);
    } else if (key === "web" && webChannel) {
      if (webChannel.getPermission() === "granted") {
        webChannel.show(payload, void 0);
      }
    }
  }, [ensureSoundUnlocked, soundMgr, config.sound, toastStore, pwaChannel, webChannel, t]);
  const requestChannelPermission = (0, import_react3.useCallback)(async (key) => {
    if (key === "pwa" && pwaChannel) {
      await pwaChannel.requestPermission();
    } else if (key === "web" && webChannel) {
      await webChannel.requestPermission();
    }
  }, [pwaChannel, webChannel]);
  const getChannelPermission = (0, import_react3.useCallback)((key) => {
    if (key === "inpage") return "granted";
    if (typeof Notification === "undefined") return "denied";
    return Notification.permission;
  }, []);
  const toggleStyle = (on) => ({
    position: "relative",
    width: "36px",
    height: "20px",
    borderRadius: "10px",
    background: on ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-bg-mask-1)",
    cursor: "pointer",
    transition: "background 0.2s ease",
    border: "none",
    flexShrink: 0
  });
  const knobStyle = (on) => ({
    position: "absolute",
    top: "2px",
    left: on ? "18px" : "2px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#fff",
    transition: "left 0.2s ease"
  });
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid var(--dsw-alias-border-l1)"
  };
  const labelStyle = {
    fontSize: "13px",
    color: "var(--dsw-alias-label-primary)"
  };
  const descStyle = {
    fontSize: "11px",
    color: "var(--dsw-alias-label-tertiary)",
    marginTop: "2px"
  };
  const sectionTitleStyle = {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--dsw-alias-label-secondary)",
    margin: "16px 0 4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };
  const miniBtnStyle = {
    padding: "2px 8px",
    borderRadius: "4px",
    border: "1px solid var(--dsw-alias-border-l1)",
    background: "var(--dsw-alias-interactive-bg-hover)",
    color: "var(--dsw-alias-label-primary)",
    fontSize: "11px",
    cursor: "pointer",
    flexShrink: 0
  };
  const textareaStyle = {
    width: "100%",
    minHeight: "60px",
    resize: "vertical",
    boxSizing: "border-box",
    padding: "6px 8px",
    borderRadius: "4px",
    border: "1px solid var(--dsw-alias-border-l1)",
    background: "var(--dsw-alias-bg-mask-1)",
    color: "var(--dsw-alias-label-primary)",
    fontSize: "12px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: "480px", padding: "4px 0" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t("settings.enabled") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: descStyle, children: t("settings.desc") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: toggleStyle(config.enabled), onClick: () => update({ enabled: !config.enabled }), "aria-label": t("settings.enabled"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: knobStyle(config.enabled) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: sectionTitleStyle, children: t("settings.channels") }),
    CHANNEL_KEYS.map((key) => {
      const perm = getChannelPermission(key);
      const showPermissionBtn = key !== "inpage" && perm !== "granted" && perm !== "denied";
      const showDeniedHint = key !== "inpage" && perm === "denied";
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { ...rowStyle, flexWrap: "wrap", gap: "4px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t(CHANNEL_LABELS[key]) }),
          showDeniedHint && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { ...descStyle, color: "var(--dsw-alias-state-warn-primary)" }, children: t("settings.channels.permissionDeniedHint") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }, children: [
          showPermissionBtn && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: miniBtnStyle, onClick: () => requestChannelPermission(key), children: t("settings.channels.permission") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: miniBtnStyle, onClick: () => testChannel(key), children: t("settings.channels.test") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: toggleStyle(config.channels[key]), onClick: () => updateChannels(key, !config.channels[key]), "aria-label": t(CHANNEL_LABELS[key]), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: knobStyle(config.channels[key]) }) })
        ] })
      ] }, key);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: sectionTitleStyle, children: t("settings.persistent") }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t("settings.persistent.enabled") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: descStyle, children: t("settings.persistent.desc") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: toggleStyle(config.persistent.enabled), onClick: () => update({ persistent: { ...config.persistent, enabled: !config.persistent.enabled } }), "aria-label": t("settings.persistent.enabled"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: knobStyle(config.persistent.enabled) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: sectionTitleStyle, children: t("settings.sound") }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t("settings.sound.enabled") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: toggleStyle(config.sound.enabled), onClick: () => updateSound("enabled", !config.sound.enabled), "aria-label": t("settings.sound.enabled"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: knobStyle(config.sound.enabled) }) })
    ] }),
    config.sound.enabled && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { ...rowStyle, flexDirection: "column", alignItems: "stretch", gap: "8px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t("settings.sound.volume") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: miniBtnStyle, onClick: () => {
          ensureSoundUnlocked();
          soundMgr.play("info", config.sound.volume);
        }, children: t("settings.sound.test") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
          value: config.sound.volume,
          onChange: (e) => updateSound("volume", parseFloat(e.target.value)),
          style: { width: "100%", accentColor: "var(--dsw-alias-brand-primary)" }
        }
      )
    ] }),
    config.sound.enabled && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t("settings.sound.foregroundSound") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: descStyle, children: t("settings.sound.foregroundSoundDesc") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: toggleStyle(config.sound.foregroundSound), onClick: () => updateSound("foregroundSound", !config.sound.foregroundSound), "aria-label": t("settings.sound.foregroundSound"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: knobStyle(config.sound.foregroundSound) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: sectionTitleStyle, children: t("settings.events") }),
    EVENT_KEYS.map((event) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: rowStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t(EVENT_LABELS[event]) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: toggleStyle(config.events[event]), onClick: () => updateEvent(event, !config.events[event]), "aria-label": t(EVENT_LABELS[event]), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: knobStyle(config.events[event]) }) })
    ] }, event)),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: sectionTitleStyle, children: t("settings.ignore") }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { ...rowStyle, flexDirection: "column", alignItems: "stretch", gap: "6px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: labelStyle, children: t("settings.ignore.title") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: descStyle, children: t("settings.ignore.desc") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "textarea",
        {
          style: textareaStyle,
          value: ignoreText,
          onChange: (e) => updateIgnoreText(e.target.value),
          placeholder: t("settings.ignore.placeholder"),
          spellCheck: false,
          rows: 3,
          "aria-label": t("settings.ignore.title")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
          ...descStyle,
          marginTop: 0,
          color: invalidPatterns.length ? "var(--dsw-alias-state-warn-primary)" : "var(--dsw-alias-label-tertiary)"
        }, children: invalidPatterns.length ? `${t("settings.ignore.invalid")}${invalidPatterns.join("  ")}` : t("settings.ignore.hint") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { style: miniBtnStyle, onClick: () => updateIgnoreText(DEFAULT_IGNORE_PATTERNS.join("\n")), children: t("settings.ignore.reset") })
      ] })
    ] })
  ] });
}

// src/client.ts
var name = "notify";
var inject = ["slots", "sessions", "locale", "uiWorkspace"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "notify: dictionaries");
  const t = ctx.locale.bind(NS);
  const configStore = createNotifyConfigStore();
  const visibilityDetector = createVisibilityDetector();
  const toastStore = createToastStore();
  const engineToastStore = initNotificationEngine(ctx, configStore, visibilityDetector, toastStore);
  const targetSessionId = new URL(window.location.href).searchParams.get("notifySessionId");
  if (targetSessionId) {
    ctx.uiWorkspace.openSession(targetSessionId);
    const url = new URL(window.location.href);
    url.searchParams.delete("notifySessionId");
    window.history.replaceState(window.history.state, "", url.href);
  }
  const pwaChannel = new PwaNotificationChannel();
  const webChannel = new WebNotificationChannel();
  pwaChannel.init().catch(() => {
  });
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "notify-toasts",
    order: 10,
    locale: NS,
    inject: () => ({
      toastStore: engineToastStore,
      onSessionClick: (sessionId) => {
        ctx.uiWorkspace.openSession(sessionId);
      }
    })
  }, ToastContainer));
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "notify",
    order: 60,
    label: () => t("settings.title"),
    locale: NS,
    inject: () => ({
      configStore,
      toastStore: engineToastStore,
      pwaChannel,
      webChannel,
      t
    })
  }, NotifySettingsSection));
}

		return module.exports;
	}
});
