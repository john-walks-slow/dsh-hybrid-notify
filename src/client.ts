/**
 * Client plugin body for dsh-hybrid-notify.
 *
 * Registers:
 * 1. Notification engine (global, event-driven) — subscribes to session list
 * 2. Toast container in shell.overlay (renders in-page toasts)
 * 3. Notification settings in settings.section (id="notify", order=60)
 *
 * @module dsh-hybrid-notify/client
 */

import { NS, zh, en } from "./locales";
import { createNotifyConfigStore } from "./notify-config";
import { createVisibilityDetector } from "./visibility-detector";
import { createToastStore } from "./toast-store";
import { initNotificationEngine } from "./notification-engine";
import { PwaNotificationChannel } from "./channels/pwa-notification";
import { WebNotificationChannel } from "./channels/web-notification";
import { ToastContainer } from "./components/ToastContainer";
import { NotifySettingsSection } from "./components/NotifySettings";

const name = "notify";
const inject = ["slots", "sessions", "locale", "uiWorkspace"];

function apply(ctx: any) {
	// ── Locale dictionaries ──────────────────────────────────────────────
	ctx.effect(() => ctx.locale.register(NS, { zh, en }), "notify: dictionaries");
	const t = ctx.locale.bind(NS);

	// ── Config store ─────────────────────────────────────────────────────
	const configStore = createNotifyConfigStore();

	// ── Visibility detector ──────────────────────────────────────────────
	const visibilityDetector = createVisibilityDetector();

	// ── Toast store ──────────────────────────────────────────────────────
	const toastStore = createToastStore();

	// ── Notification engine (HMR-safe singleton) ────────────────────────
	const engineToastStore = initNotificationEngine(ctx, configStore, visibilityDetector, toastStore);

	const targetSessionId = new URL(window.location.href).searchParams.get("notifySessionId");
	if (targetSessionId) {
		ctx.uiWorkspace.openSession(targetSessionId);
		const url = new URL(window.location.href);
		url.searchParams.delete("notifySessionId");
		window.history.replaceState(window.history.state, "", url.href);
	}

	// ── Channel references for settings page ─────────────────────────────
	const pwaChannel = new PwaNotificationChannel();
	const webChannel = new WebNotificationChannel();
	pwaChannel.init().catch(() => { /* graceful: PWA unavailable */ });

	// ── Toast container in shell.overlay ─────────────────────────────────
	ctx.slots.inject("shell.overlay", () => ctx.slots.register({
		name: "shell.overlay",
		id: "notify-toasts",
		order: 10,
		locale: NS,
		inject: () => ({
			toastStore: engineToastStore,
			onSessionClick: (sessionId: string) => {
				ctx.uiWorkspace.openSession(sessionId);
			},
		}),
	}, ToastContainer));

	// ── Settings section ─────────────────────────────────────────────────
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
			t,
		}),
	}, NotifySettingsSection));
}

export { apply, inject, name };
