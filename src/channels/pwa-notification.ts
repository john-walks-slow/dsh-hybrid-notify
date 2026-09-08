/**
 * PWA notification channel — uses Service Worker + Notifications API.
 *
 * The SW script is served by the host half at /plugins/dsh-hybrid-notify/sw.js.
 * (Blob URL registration is not spec-compliant and fails in all modern browsers.)
 *
 * @module dsh-hybrid-notify/channels/pwa-notification
 */

import type { NotificationPayload } from "../types";

const SW_URL = "/plugins/dsh-hybrid-notify/sw.js";
const SW_SCOPE = "/plugins/dsh-hybrid-notify/";

export class PwaNotificationChannel {
	private registration: ServiceWorkerRegistration | null = null;
	private initPromise: Promise<boolean> | null = null;

	/**
	 * Register the service worker. Idempotent.
	 * Returns true if SW is registered and active.
	 */
	async init(): Promise<boolean> {
		if (this.initPromise) return this.initPromise;
		this.initPromise = this._doInit();
		return this.initPromise;
	}

	private async _doInit(): Promise<boolean> {
		if (!("serviceWorker" in navigator)) return false;
		try {
			// Check for existing registration at our scope
			const existing = await navigator.serviceWorker.getRegistration(SW_SCOPE);
			if (existing) {
				this.registration = existing;
				return true;
			}
			this.registration = await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
			// Wait for the SW to be activated
			if (this.registration.active) return true;
			await navigator.serviceWorker.ready;
			return true;
		} catch {
			return false;
		}
	}

	/** Whether this channel is available (SW registered + permission granted). */
	isAvailable(): boolean {
		return this.registration !== null && this.registration.active !== null && Notification.permission === "granted";
	}

	/** Request notification permission. */
	async requestPermission(): Promise<NotificationPermission> {
		if (!("Notification" in window)) return "denied";
		if (Notification.permission === "granted") return "granted";
		return await Notification.requestPermission();
	}

	async show(payload: NotificationPayload, onOpen?: (sessionId?: string) => void, requireInteraction?: boolean): Promise<void> {
		if (!this.registration) await this.init();
		if (!this.registration) return;
		try {
			await this.registration.showNotification(payload.title, {
				body: payload.body,
				tag: payload.id,
				data: { sessionId: payload.sessionId },
				silent: true,
				requireInteraction: requireInteraction ?? false,
			});
		} catch {
			// SW not active or other error — engine falls back to web channel
		}
	}
}
