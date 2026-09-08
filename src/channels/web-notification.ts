/**
 * Web notification channel — uses the browser Notification API directly.
 *
 * This is the fallback when PWA/SW notifications are unavailable.
 * @module dsh-notify/channels/web-notification
 */

import type { NotificationPayload } from "../types";

export class WebNotificationChannel {
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
		} catch {
			// Some mobile browsers throw TypeError for `new Notification()`.
		}
	}
}
