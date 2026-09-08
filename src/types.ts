/**
 * Shared type definitions for dsh-notify.
 * @module dsh-notify/types
 */

/** Notification severity / icon type. */
export type NotificationLevel = "info" | "success" | "warning" | "error";

/** Which event triggered the notification. */
export type NotificationEvent =
	| "turnComplete"
	| "approvalRequest"
	| "questionRequest"
	| "planReviewRequest"
	| "agentError"
	| "jobComplete"
	| "subagentComplete";

/** A single notification payload that flows through all channels. */
export interface NotificationPayload {
	/** Unique id for dedup. */
	id: string;
	/** Which event type triggered this. */
	event: NotificationEvent;
	/** Human-readable title. */
	title: string;
	/** Optional body text. */
	body?: string;
	/** Severity level (drives icon + color). */
	level: NotificationLevel;
	/** Session this notification belongs to (for click-to-focus). */
	sessionId?: string;
	/** Timestamp (epoch ms). */
	timestamp: number;
}

/** A toast item shown in the in-page overlay. */
export interface ToastItem extends NotificationPayload {
	/** Auto-dismiss timeout (ms); 0 = manual dismiss only. */
	duration: number;
	/** Whether the toast is currently exiting (for animation). */
	exiting: boolean;
}

/** Plugin configuration shape. */
export interface NotifyConfig {
	/** Master switch. */
	enabled: boolean;
	/** Per-channel toggles. */
	channels: {
		inpage: boolean;
		pwa: boolean;
		web: boolean;
	};
	/** Persistent notifications: requireInteraction for important events. */
	persistent: {
		/** Use requireInteraction so important notifications stay until dismissed. */
		enabled: boolean;
	};
	/** Sound settings. */
	sound: {
		enabled: boolean;
		volume: number; // 0–1
		/** Play sound even when the current session is in the foreground (notification itself is suppressed). */
		foregroundSound: boolean;
	};
	/** Per-event toggles. */
	events: {
		turnComplete: boolean;
		approvalRequest: boolean;
		questionRequest: boolean;
		planReviewRequest: boolean;
		agentError: boolean;
		jobComplete: boolean;
		subagentComplete: boolean;
	};
}

/** Snapshot store interface (compatible with useSyncExternalStore). */
export interface SnapshotStore<T> {
	getSnapshot(): T;
	subscribe(fn: () => void): () => void;
	update(updater: (prev: T) => T): void;
	set(state: T): void;
}

/** Visibility state. */
export interface VisibilityState {
	isVisible: boolean;
	hasFocus: boolean;
	isForeground: boolean;
}
