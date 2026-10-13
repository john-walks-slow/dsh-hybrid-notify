/**
 * NotifySettingsSection — settings UI registered into `settings.section`.
 *
 * @module dsh-hybrid-notify/components/NotifySettings
 */

import { useSyncExternalStore, useState, useCallback } from "react";
import type { NotifyConfig, NotificationEvent, NotificationPayload } from "../types";
import type { NotifyConfigStore } from "../notify-config";
import type { ToastStore } from "../toast-store";
import { DEFAULT_IGNORE_PATTERNS, findInvalidPatterns, parsePatternLines } from "../ignore-matcher";
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

/** Switch control: carries switch semantics so assistive tech reads the state. */
function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
	return (
		<button type="button" role="switch" aria-checked={on} aria-label={label} style={toggleStyle(on)} onClick={onChange}>
			<div style={knobStyle(on)} />
		</button>
	);
}

export function NotifySettingsSection({ configStore, toastStore, pwaChannel, webChannel, t }: NotifySettingsProps) {
	const config = useSyncExternalStore(
		(fn) => configStore.subscribe(fn),
		() => configStore.getSnapshot(),
	);
	const [soundMgr] = useState(() => new SoundManager());
	// The textarea keeps its own text so pending newlines/blank lines survive typing;
	// only the parsed patterns are persisted.
	const [ignoreText, setIgnoreText] = useState(() => configStore.getSnapshot().ignore.patterns.join("\n"));
	const invalidPatterns = findInvalidPatterns(ignoreText.split("\n"));

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

	const updateIgnoreText = useCallback((text: string) => {
		setIgnoreText(text);
		const patterns = parsePatternLines(text);
		configStore.update((prev) => ({ ...prev, ignore: { patterns } }));
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

	const textareaStyle: React.CSSProperties = {
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
		fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
	};

	return (
		<div style={{ maxWidth: "480px", padding: "4px 0" }}>
			{/* Master toggle */}
			<div style={rowStyle}>
				<div>
					<div style={labelStyle}>{t("settings.enabled")}</div>
					<div style={descStyle}>{t("settings.desc")}</div>
				</div>
				<Toggle on={config.enabled} label={t("settings.enabled")} onChange={() => update({ enabled: !config.enabled })} />
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
							<Toggle on={config.channels[key]} label={t(CHANNEL_LABELS[key])} onChange={() => updateChannels(key, !config.channels[key])} />
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
				<Toggle on={config.persistent.enabled} label={t("settings.persistent.enabled")} onChange={() => update({ persistent: { ...config.persistent, enabled: !config.persistent.enabled } })} />
			</div>

			{/* Dismiss system notifications once the session is read */}
			<div style={sectionTitleStyle}>{t("settings.dismiss")}</div>
			<div style={rowStyle}>
				<div>
					<div style={labelStyle}>{t("settings.dismiss.enabled")}</div>
					<div style={descStyle}>{t("settings.dismiss.desc")}</div>
				</div>
				<Toggle on={config.dismissOnRead} label={t("settings.dismiss.enabled")} onChange={() => update({ dismissOnRead: !config.dismissOnRead })} />
			</div>

			{/* Sound */}
			<div style={sectionTitleStyle}>{t("settings.sound")}</div>
			<div style={rowStyle}>
				<div style={labelStyle}>{t("settings.sound.enabled")}</div>
				<Toggle on={config.sound.enabled} label={t("settings.sound.enabled")} onChange={() => updateSound("enabled", !config.sound.enabled)} />
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
					<Toggle on={config.sound.foregroundSound} label={t("settings.sound.foregroundSound")} onChange={() => updateSound("foregroundSound", !config.sound.foregroundSound)} />
				</div>
			)}

			{/* Events */}
			<div style={sectionTitleStyle}>{t("settings.events")}</div>
			{EVENT_KEYS.map((event) => (
				<div key={event} style={rowStyle}>
					<div style={labelStyle}>{t(EVENT_LABELS[event])}</div>
					<Toggle on={config.events[event]} label={t(EVENT_LABELS[event])} onChange={() => updateEvent(event, !config.events[event])} />
				</div>
			))}

			{/* Ignored sessions */}
			<div style={sectionTitleStyle}>{t("settings.ignore")}</div>
			<div style={{ ...rowStyle, flexDirection: "column" as const, alignItems: "stretch", gap: "6px" }}>
				<div>
					<div style={labelStyle}>{t("settings.ignore.title")}</div>
					<div style={descStyle}>{t("settings.ignore.desc")}</div>
				</div>
				<textarea
					style={textareaStyle}
					value={ignoreText}
					onChange={(e) => updateIgnoreText(e.target.value)}
					placeholder={t("settings.ignore.placeholder")}
					spellCheck={false}
					rows={3}
					aria-label={t("settings.ignore.title")}
				/>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
					<div style={{
						...descStyle,
						marginTop: 0,
						color: invalidPatterns.length ? "var(--dsw-alias-state-warn-primary)" : "var(--dsw-alias-label-tertiary)",
					}}>
						{invalidPatterns.length
							? `${t("settings.ignore.invalid")}${invalidPatterns.join("  ")}`
							: t("settings.ignore.hint")}
					</div>
					<button style={miniBtnStyle} onClick={() => updateIgnoreText(DEFAULT_IGNORE_PATTERNS.join("\n"))}>
						{t("settings.ignore.reset")}
					</button>
				</div>
			</div>
		</div>
	);
}
