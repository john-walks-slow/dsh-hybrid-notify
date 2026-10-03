/**
 * NotificationEngine — the core orchestrator.
 *
 * Subscribes to DSH session list snapshots, detects state transitions
 * (turn complete, approval/question requests, errors, job completions),
 * and dispatches notifications through the appropriate channel based on
 * window visibility state.
 *
 * HMR-safe: uses globalThis singleton pattern (same as dsh-zen-tracker).
 *
 * @module dsh-hybrid-notify/notification-engine
 */

import type { Context } from "@deepseek-ai/cordis";
import type { NotifyConfig, NotificationPayload, NotificationEvent, NotificationLevel, SnapshotStore, VisibilityDetectorStore } from "./types";
import type { NotifyConfigStore } from "./notify-config";
import type { ToastStore } from "./toast-store";
import { SoundManager } from "./sound-manager";
import { InPageToastChannel } from "./channels/inpage-toast";
import { PwaNotificationChannel } from "./channels/pwa-notification";
import { WebNotificationChannel } from "./channels/web-notification";

const WINDOW_KEY = "__dshNotifyEngine";

interface SessionSummaryLike {
	id: string;
	title?: string;
	displayTitle: string;
	running: boolean;
	pendingInteraction?: "approval" | "plan-review" | "question" | undefined;
	origin?: string;
	parentId?: string;
}

interface JobViewLike {
	id: string;
	kind: string;
	label: string;
	status: "running" | "stopping" | "completed" | "killed" | "failed";
}

interface SessionListSnapshotLike {
	current?: string;
	byId: Record<string, SessionSummaryLike>;
	/** Optional: DSH 0.1.7 removed job views from the session list snapshot. */
	jobsBySession?: Record<string, readonly JobViewLike[]>;
}

interface EngineHandle {
	dispose(): void;
	alive: boolean;
}

export function initNotificationEngine(
	ctx: Context,
	configStore: NotifyConfigStore,
	visibilityDetector: VisibilityDetectorStore,
	toastStore: ToastStore,
): ToastStore {
	const g = globalThis as any;
	if (g[WINDOW_KEY] && g[WINDOW_KEY].alive) {
		// The singleton engine survives, so this apply()'s fresh detector is
		// redundant — release its listeners instead of leaking them.
		visibilityDetector._cleanup();
		return g[WINDOW_KEY].toastStore;
	}
	if (g[WINDOW_KEY]) g[WINDOW_KEY].dispose();
	g[WINDOW_KEY] = createEngine(ctx, configStore, visibilityDetector, toastStore);
	return g[WINDOW_KEY].toastStore;
}

function createEngine(
	ctx: Context,
	configStore: NotifyConfigStore,
	visibilityDetector: VisibilityDetectorStore,
	toastStore: ToastStore,
): EngineHandle & { toastStore: ToastStore } {
	const sessions = (ctx as any).sessions as {
		list: SnapshotStore<SessionListSnapshotLike>;
	};
	const t = (ctx as any).locale.bind("notify") as (key: string, params?: Record<string, any>) => string;

	// ── Channels ────────────────────────────────────────────────────
	const inPageChannel = new InPageToastChannel(toastStore);
	const pwaChannel = new PwaNotificationChannel();
	const webChannel = new WebNotificationChannel();

	// ── Sound ──────────────────────────────────────────────────────
	const sound = new SoundManager();
	const unlockCleanup = sound.installUnlockListeners();

	// ── Init PWA channel (async, non-blocking) ─────────────────────
	pwaChannel.init().catch(() => { /* graceful: PWA unavailable */ });

	// ── State tracking for diffing ──────────────────────────────────
	const notifiedSet = new Set<string>(); // event fingerprint dedup
	let prevSnap: SessionListSnapshotLike | null = null;
	let prevSessionStates: Record<string, {
		running: boolean;
		pendingInteraction: string | undefined;
	}> = {};
	let prevJobs: Record<string, Map<string, JobViewLike>> = {}; // sessionId → (jobId → job)

	function makeFingerprint(sessionId: string, event: NotificationEvent, extra?: string): string {
		return `${sessionId}:${event}${extra ? ":" + extra : ""}`;
	}

	function shouldNotify(event: NotificationEvent, sessionId?: string): boolean {
		const config = configStore.getSnapshot();
		if (!config.enabled) return false;
		if (!config.events[event]) return false;

		// Don't notify (show toast/PWA/web) for the current foreground session
		const visState = visibilityDetector.getSnapshot();
		if (visState.isForeground && sessionId && sessionId === prevSnap?.current) {
			return false;
		}
		return true;
	}

	/** Whether sound should play for this event — independent of the notification dispatch. */
	function shouldPlaySound(event: NotificationEvent, sessionId: string | undefined, _level: NotificationLevel): boolean {
		const config = configStore.getSnapshot();
		if (!config.enabled) return false;
		if (!config.events[event]) return false;
		if (!config.sound.enabled) return false;

		// Foreground current session: only play sound if foregroundSound is enabled
		const visState = visibilityDetector.getSnapshot();
		if (visState.isForeground && sessionId && sessionId === prevSnap?.current) {
			return config.sound.foregroundSound;
		}
		return true;
	}

	// ── Auto-request notification permission on first background event ──
	let permissionRequested = false;
	async function ensurePermission(): Promise<void> {
		if (permissionRequested) return;
		permissionRequested = true;
		if (typeof Notification === "undefined") return;
		if (Notification.permission !== "default") return;
		try {
			await Notification.requestPermission();
		} catch { /* ignore */ }
	}

	// ── Shared callback: focus window + open session (used by PWA postMessage + web channel onclick) ──
	const openSession = (sessionId?: string) => {
		window.focus();
		if (sessionId) {
			try {
				(ctx as any).sessions?.open?.(sessionId);
			} catch { /* ignore */ }
		}
	};

	function dispatchNotification(payload: NotificationPayload): void {
		const config = configStore.getSnapshot();
		if (!config.enabled) return;

		const visState = visibilityDetector.getSnapshot();
		const isForeground = visState.isForeground;

		// Persistent: warning/error events stay until dismissed (requireInteraction)
		const requireInteraction = config.persistent.enabled &&
			(payload.level === "warning" || payload.level === "error");

		// Channel selection:
		// 1. Foreground → in-page toast
		// 2. Background + PWA available → PWA notification
		// 3. Background + no PWA → web notification
		if (isForeground && config.channels.inpage) {
			inPageChannel.show(payload, requireInteraction ? 0 : 5000);
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
					if (config.channels.inpage) inPageChannel.show(payload, requireInteraction ? 0 : 5000);
				}
			} else if (config.channels.inpage) {
				inPageChannel.show(payload, requireInteraction ? 0 : 5000);
			}
		}
	}

	function notify(event: NotificationEvent, sessionId: string, title: string, body: string | undefined, level: NotificationPayload["level"]): void {
		const config = configStore.getSnapshot();
		if (!config.enabled || !config.events[event]) return;

		const fp = makeFingerprint(sessionId, event);
		if (notifiedSet.has(fp)) return;
		notifiedSet.add(fp);

		// Sound: independent of notification dispatch (can play even when toast is suppressed)
		if (shouldPlaySound(event, sessionId, level)) {
			sound.play(level, config.sound.volume);
		}

		// Notification dispatch: suppressed for foreground current session
		if (!shouldNotify(event, sessionId)) return;

		const payload: NotificationPayload = {
			id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
			event,
			title,
			body,
			level,
			sessionId,
			timestamp: Date.now(),
		};
		dispatchNotification(payload);
	}

	function getSessionTitle(snap: SessionListSnapshotLike, sessionId: string): string {
		const s = snap.byId[sessionId];
		return s?.displayTitle || s?.title || sessionId.slice(0, 8);
	}

	/** Main diff function — called on every session list snapshot change. */
	function check(): void {
		const snap = sessions.list.getSnapshot();

		// Track all sessions, not just the current one
		for (const [id, summary] of Object.entries(snap.byId)) {
			const prev = prevSessionStates[id] ?? { running: summary.running, pendingInteraction: summary.pendingInteraction };

			// ── Turn complete: running → idle ──
			if (prev.running === true && summary.running === false) {
				// Subagent completions have their own event type
				if (summary.origin === "subagent") {
					notify("subagentComplete", id, t("notify.subagentComplete"), getSessionTitle(snap, id), "success");
				} else {
					notify("turnComplete", id, t("notify.turnComplete"), getSessionTitle(snap, id), "success");
				}
			}

			// ── Approval/Question/Plan-review request: idle → pending ──
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

		// ── Job completions: diff jobsBySession ──
		const liveSessionIds = new Set(Object.keys(snap.byId));
		for (const [sessionId, jobList] of Object.entries(snap.jobsBySession ?? {})) {
			const prevJobMap = prevJobs[sessionId] ?? new Map<string, JobViewLike>();
			const currJobMap = new Map<string, JobViewLike>();
			for (const job of jobList) {
				currJobMap.set(job.id, job);
				const prev = prevJobMap.get(job.id);
				if (prev && prev.status === "running" && (job.status === "completed" || job.status === "failed" || job.status === "killed")) {
					const level = job.status === "completed" ? "success" : job.status === "failed" ? "error" : "warning";
					notify("jobComplete", sessionId, t("notify.jobComplete"), job.label, level as NotificationPayload["level"]);
				}
			}
			prevJobs[sessionId] = currJobMap;
		}
		// Drop job maps of sessions that no longer exist — without this,
		// prevJobs grows without bound as sessions are created and deleted.
		for (const id of Object.keys(prevJobs)) {
			if (!liveSessionIds.has(id)) delete prevJobs[id];
		}

		// Update session states for next diff
		const nextStates: Record<string, { running: boolean; pendingInteraction: string | undefined }> = {};
		for (const [id, summary] of Object.entries(snap.byId)) {
			nextStates[id] = { running: summary.running, pendingInteraction: summary.pendingInteraction };
		}
		prevSessionStates = nextStates;
		prevSnap = snap;
	}

	// ── Subscribe ──────────────────────────────────────────────────
	const unsubSessions = sessions.list.subscribe(() => check());

	// Listen for SW notification clicks — SW postMessages back, we call openSession
	const onMessage = (event: MessageEvent) => {
		const data = event.data;
		if (data?.type === "notify:focus-session") {
			openSession(data.sessionId);
		}
	};
	navigator.serviceWorker?.addEventListener?.("message", onMessage);

	// Initial check
	check();

	// ── Periodic cleanup of notifiedSet (every 5 min) ─────────────
	const cleanupTimer = setInterval(() => {
		notifiedSet.clear();
	}, 5 * 60 * 1000);

	const handle: EngineHandle & { toastStore: ToastStore } = {
		toastStore,
		alive: true,
		dispose() {
			handle.alive = false;
			unsubSessions();
			unlockCleanup();
			// Remove the visibility detector's 3 global listeners (leaked on every
			// engine re-init/HMR otherwise — the detector is per-engine, not global).
			visibilityDetector._cleanup();
			navigator.serviceWorker?.removeEventListener?.("message", onMessage);
			clearInterval(cleanupTimer);
			(toastStore as any).clearAll?.();
			if ((globalThis as any)[WINDOW_KEY] === handle) (globalThis as any)[WINDOW_KEY] = null;
		},
	};

	(ctx as any).effect(() => {
		return () => { handle.dispose(); };
	}, "notify: notification engine");

	return handle;
}
