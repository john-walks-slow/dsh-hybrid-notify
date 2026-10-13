/**
 * Web notification channel — uses the browser Notification API directly.
 *
 * This is the fallback when PWA/SW notifications are unavailable.
 * @module dsh-hybrid-notify/channels/web-notification
 */

import type { NotificationPayload } from "../types";

export class WebNotificationChannel {
	/**
	 * Live notifications per session. The page cannot enumerate its own
	 * notifications, so retraction holds the instances; `onclose` (user swipe,
	 * click, OS recycling) prunes the entry so the map cannot grow unbounded.
	 */
	private liveBySession = new Map<string, Set<Notification>>();

	/** Whether basic Notification API is available. */
	isAvailable(): boolean {
		return typeof Notification !== "undefined";
	}

	/** Current permission state. */
	getPermission(): NotificationPermission {
		if (typeof Notification === "undefined") return "denied";
		return Notification.permission;
	}

	/** Request notification permission. */
	async requestPermission(): Promise<NotificationPermission> {
		if (typeof Notification === "undefined") return "denied";
		if (Notification.permission === "granted") return "granted";
		return await Notification.requestPermission();
	}

	/**
	 * Show a notification. On click: focus window + open the source session.
	 * Same behavior as PWA channel's notificationclick handler.
	 */
	show(payload: NotificationPayload, onOpen?: (sessionId?: string) => void, requireInteraction?: boolean): void {
		if (typeof Notification === "undefined") return;
		if (Notification.permission !== "granted") return;
		try {
			const n = new Notification(payload.title, {
				body: payload.body,
				tag: payload.id,
				silent: true,
				requireInteraction: requireInteraction ?? false,
			});
			n.onclick = () => {
				window.focus();
				onOpen?.(payload.sessionId);
				n.close();
			};
			const sessionId = payload.sessionId;
			if (sessionId) {
				const live = this.liveBySession.get(sessionId) ?? new Set<Notification>();
				live.add(n);
				this.liveBySession.set(sessionId, live);
				n.onclose = () => {
					live.delete(n);
					if (live.size === 0) this.liveBySession.delete(sessionId);
				};
			}
		} catch {
			// Some mobile browsers throw TypeError for `new Notification()`.
		}
	}

	/** Close this session's notifications from the system notification shade. */
	dismissSession(sessionId: string): void {
		const live = this.liveBySession.get(sessionId);
		if (!live) return;
		this.liveBySession.delete(sessionId);
		for (const notification of live) {
			try { notification.close(); } catch { /* already gone */ }
		}
	}
}
