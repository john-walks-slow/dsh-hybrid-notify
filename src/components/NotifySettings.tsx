/**
 * NotifySettingsSection — settings UI registered into `settings.section`.
 *
 * @module dsh-hybrid-notify/components/NotifySettings
 */

import { useSyncExternalStore, useState, useCallback } from "react";
import type { NotifyConfig, NotificationEvent, NotificationPayload } from "../types";
import type { NotifyConfigStore } from "../notify-config";
import type { ToastStore } from "../toast-store";
import { SoundManager } from "../sound-manager";
import { PwaNotificationChannel } from "../channels/pwa-notification";
import { WebNotificationChannel } from "../channels/web-notification";

interface NotifySettingsProps {
	configStore: NotifyConfigStore;
	toastStore: ToastStore;
	pwaChannel: PwaNotificationChannel | null;
	webChannel: WebNotificationChannel | null;
	t: (key: string, params?: Record<string, any>) => string;
}

const EVENT_KEYS: NotificationEvent[] = [
	"turnComplete",
	"approvalRequest",
	"questionRequest",
	"planReviewRequest",
	"agentError",
	"jobComplete",
	"subagentComplete",
];

const EVENT_LABELS: Record<NotificationEvent, string> = {
	turnComplete: "settings.events.turnComplete",
	approvalRequest: "settings.events.approvalRequest",
	questionRequest: "settings.events.questionRequest",
	planReviewRequest: "settings.events.planReviewRequest",
	agentError: "settings.events.agentError",
	jobComplete: "settings.events.jobComplete",
	subagentComplete: "settings.events.subagentComplete",
};

/** Channel metadata for rendering the channels section. */
const CHANNEL_KEYS = ["inpage", "pwa", "web"] as const;
type ChannelKey = (typeof CHANNEL_KEYS)[number];

const CHANNEL_LABELS: Record<ChannelKey, string> = {
	inpage: "settings.channels.inpage",
	pwa: "settings.channels.pwa",
	web: "settings.channels.web",
};

export function NotifySettingsSection({ configStore, toastStore, pwaChannel, webChannel, t }: NotifySettingsProps) {
	const config = useSyncExternalStore(
		(fn) => configStore.subscribe(fn),
		() => configStore.getSnapshot(),
	);
	const [soundMgr] = useState(() => new SoundManager());

	const update = useCallback((patch: Partial<NotifyConfig>) => {
		configStore.update((prev) => ({ ...prev, ...patch }));
	}, [configStore]);

	const updateChannels = useCallback((key: ChannelKey, val: boolean) => {
		configStore.update((prev) => ({ ...prev, channels: { ...prev.channels, [key]: val } }));
	}, [configStore]);

	const updateSound = useCallback((key: keyof NotifyConfig["sound"], val: number | boolean) => {
		configStore.update((prev) => ({ ...prev, sound: { ...prev.sound, [key]: val } }));
	}, [configStore]);

	const updateEvent = useCallback((key: NotificationEvent, val: boolean) => {
		configStore.update((prev) => ({ ...prev, events: { ...prev.events, [key]: val } }));
	}, [configStore]);

	const ensureSoundUnlocked = useCallback(() => {
		if (!soundMgr.isUnlocked) soundMgr.unlock();
	}, [soundMgr]);

	/** Test a specific channel. */
	const testChannel = useCallback((key: ChannelKey) => {
		ensureSoundUnlocked();
		if (config.sound.enabled) soundMgr.play("info", config.sound.volume);

		const payload: NotificationPayload = {
			id: `test-${Date.now()}`,
			event: "turnComplete",
			title: t("settings.channels.test"),
			body: t(CHANNEL_LABELS[key]),
			level: "info",
			timestamp: Date.now(),
		};

		if (key === "inpage") {
			(toastStore as any).add?.(payload, 5000);
		} else if (key === "pwa" && pwaChannel) {
			pwaChannel.show(payload, undefined);
		} else if (key === "web" && webChannel) {
			if (webChannel.getPermission() === "granted") {
				webChannel.show(payload, undefined);
			}
		}
	}, [ensureSoundUnlocked, soundMgr, config.sound, toastStore, pwaChannel, webChannel, t]);

	/** Request permission for a specific channel. */
	const requestChannelPermission = useCallback(async (key: ChannelKey) => {
		if (key === "pwa" && pwaChannel) {
			await pwaChannel.requestPermission();
		} else if (key === "web" && webChannel) {
			await webChannel.requestPermission();
		}
	}, [pwaChannel, webChannel]);

	/** Get permission status for a channel. */
	const getChannelPermission = useCallback((key: ChannelKey): NotificationPermission | null => {
		if (key === "inpage") return "granted"; // in-page always works
		if (typeof Notification === "undefined") return "denied";
		return Notification.permission;
	}, []);

	// ── shared styles ──
	const toggleStyle = (on: boolean): React.CSSProperties => ({
		position: "relative",
		width: "36px",
		height: "20px",
		borderRadius: "10px",
		background: on ? "var(--dsw-alias-brand-primary)" : "var(--dsw-alias-bg-mask-1)",
		cursor: "pointer",
		transition: "background 0.2s ease",
		border: "none",
		flexShrink: 0,
	});

	const knobStyle = (on: boolean): React.CSSProperties => ({
		position: "absolute",
		top: "2px",
		left: on ? "18px" : "2px",
		width: "16px",
		height: "16px",
		borderRadius: "50%",
		background: "#fff",
		transition: "left 0.2s ease",
	});

	const rowStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "8px 0",
		borderBottom: "1px solid var(--dsw-alias-border-l1)",
	};

	const labelStyle: React.CSSProperties = {
		fontSize: "13px",
		color: "var(--dsw-alias-label-primary)",
	};

	const descStyle: React.CSSProperties = {
		fontSize: "11px",
		color: "var(--dsw-alias-label-tertiary)",
		marginTop: "2px",
	};

	const sectionTitleStyle: React.CSSProperties = {
		fontSize: "12px",
		fontWeight: 500,
		color: "var(--dsw-alias-label-secondary)",
		margin: "16px 0 4px",
		textTransform: "uppercase" as const,
		letterSpacing: "0.5px",
	};

	const miniBtnStyle: React.CSSProperties = {
		padding: "2px 8px",
		borderRadius: "4px",
		border: "1px solid var(--dsw-alias-border-l1)",
		background: "var(--dsw-alias-interactive-bg-hover)",
		color: "var(--dsw-alias-label-primary)",
		fontSize: "11px",
		cursor: "pointer",
		flexShrink: 0,
	};

	return (
		<div style={{ maxWidth: "480px", padding: "4px 0" }}>
			{/* Master toggle */}
			<div style={rowStyle}>
				<div>
					<div style={labelStyle}>{t("settings.enabled")}</div>
					<div style={descStyle}>{t("settings.desc")}</div>
				</div>
				<button style={toggleStyle(config.enabled)} onClick={() => update({ enabled: !config.enabled })} aria-label={t("settings.enabled")}>
					<div style={knobStyle(config.enabled)} />
				</button>
			</div>

			{/* Channels — each row has toggle + permission + test */}
			<div style={sectionTitleStyle}>{t("settings.channels")}</div>
			{CHANNEL_KEYS.map((key) => {
				const perm = getChannelPermission(key);
				const showPermissionBtn = key !== "inpage" && perm !== "granted" && perm !== "denied";
				const showDeniedHint = key !== "inpage" && perm === "denied";
				return (
					<div key={key} style={{ ...rowStyle, flexWrap: "wrap" as const, gap: "4px" }}>
						<div style={{ flex: 1, minWidth: 0 }}>
							<div style={labelStyle}>{t(CHANNEL_LABELS[key])}</div>
							{showDeniedHint && (
								<div style={{ ...descStyle, color: "var(--dsw-alias-state-warn-primary)" }}>
									{t("settings.channels.permissionDeniedHint")}
								</div>
							)}
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
							{showPermissionBtn && (
								<button style={miniBtnStyle} onClick={() => requestChannelPermission(key)}>
									{t("settings.channels.permission")}
								</button>
							)}
							<button style={miniBtnStyle} onClick={() => testChannel(key)}>
								{t("settings.channels.test")}
							</button>
							<button style={toggleStyle(config.channels[key])} onClick={() => updateChannels(key, !config.channels[key])} aria-label={t(CHANNEL_LABELS[key])}>
								<div style={knobStyle(config.channels[key])} />
							</button>
						</div>
					</div>
				);
			})}

			{/* Persistent notifications */}
			<div style={sectionTitleStyle}>{t("settings.persistent")}</div>
			<div style={rowStyle}>
				<div>
					<div style={labelStyle}>{t("settings.persistent.enabled")}</div>
					<div style={descStyle}>{t("settings.persistent.desc")}</div>
				</div>
				<button style={toggleStyle(config.persistent.enabled)} onClick={() => update({ persistent: { ...config.persistent, enabled: !config.persistent.enabled } })} aria-label={t("settings.persistent.enabled")}>
					<div style={knobStyle(config.persistent.enabled)} />
				</button>
			</div>

			{/* Sound */}
			<div style={sectionTitleStyle}>{t("settings.sound")}</div>
			<div style={rowStyle}>
				<div style={labelStyle}>{t("settings.sound.enabled")}</div>
				<button style={toggleStyle(config.sound.enabled)} onClick={() => updateSound("enabled", !config.sound.enabled)} aria-label={t("settings.sound.enabled")}>
					<div style={knobStyle(config.sound.enabled)} />
				</button>
			</div>
			{config.sound.enabled && (
				<div style={{ ...rowStyle, flexDirection: "column" as const, alignItems: "stretch", gap: "8px" }}>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<div style={labelStyle}>{t("settings.sound.volume")}</div>
						<button style={miniBtnStyle} onClick={() => { ensureSoundUnlocked(); soundMgr.play("info", config.sound.volume); }}>
							{t("settings.sound.test")}
						</button>
					</div>
					<input
						type="range"
						min={0}
						max={1}
						step={0.05}
						value={config.sound.volume}
						onChange={(e) => updateSound("volume", parseFloat(e.target.value))}
						style={{ width: "100%", accentColor: "var(--dsw-alias-brand-primary)" }}
					/>
				</div>
			)}
			{config.sound.enabled && (
				<div style={rowStyle}>
					<div>
						<div style={labelStyle}>{t("settings.sound.foregroundSound")}</div>
						<div style={descStyle}>{t("settings.sound.foregroundSoundDesc")}</div>
					</div>
					<button style={toggleStyle(config.sound.foregroundSound)} onClick={() => updateSound("foregroundSound", !config.sound.foregroundSound)} aria-label={t("settings.sound.foregroundSound")}>
						<div style={knobStyle(config.sound.foregroundSound)} />
					</button>
				</div>
			)}

			{/* Events */}
			<div style={sectionTitleStyle}>{t("settings.events")}</div>
			{EVENT_KEYS.map((event) => (
				<div key={event} style={rowStyle}>
					<div style={labelStyle}>{t(EVENT_LABELS[event])}</div>
					<button style={toggleStyle(config.events[event])} onClick={() => updateEvent(event, !config.events[event])} aria-label={t(EVENT_LABELS[event])}>
						<div style={knobStyle(config.events[event])} />
					</button>
				</div>
			))}
		</div>
	);
}
