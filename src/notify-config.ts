/**
 * NotifyConfigStore — persisted plugin configuration.
 * @module dsh-notify/notify-config
 */

import type { NotifyConfig, SnapshotStore } from "./types";

const PERSIST_KEY = "dsh.notify.config";

const DEFAULTS: NotifyConfig = {
	enabled: true,
	channels: {
		inpage: true,
		pwa: true,
		web: true,
	},
	persistent: {
		enabled: true,
	},
	sound: {
		enabled: true,
		volume: 0.5,
		foregroundSound: true,
	},
	events: {
		turnComplete: true,
		approvalRequest: true,
		questionRequest: true,
		planReviewRequest: true,
		agentError: true,
		jobComplete: true,
	},
};

type Listener = () => void;

export function createNotifyConfigStore(): SnapshotStore<NotifyConfig> {
	let state: NotifyConfig = loadInitial();
	const listeners = new Set<Listener>();

	function loadInitial(): NotifyConfig {
		try {
			const raw = localStorage.getItem(PERSIST_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				return deepMerge(DEFAULTS, parsed);
			}
		} catch { /* ignore */ }
		return { ...DEFAULTS };
	}

	function deepMerge(base: any, override: any): any {
		if (typeof base !== "object" || base === null) return override ?? base;
		if (typeof override !== "object" || override === null) return override ?? base;
		const out: any = { ...base };
		for (const key of Object.keys(override)) {
			if (key in base) {
				out[key] = deepMerge(base[key], override[key]);
			} else {
				out[key] = override[key];
			}
		}
		return out;
	}

	function persist() {
		try { localStorage.setItem(PERSIST_KEY, JSON.stringify(state)); } catch { /* ignore */ }
	}

	function notify() {
		for (const fn of listeners) fn();
	}

	return {
		getSnapshot: () => state,
		subscribe: (fn: Listener) => {
			listeners.add(fn);
			return () => { listeners.delete(fn); };
		},
		update: (updater: (prev: NotifyConfig) => NotifyConfig) => {
			state = updater(state);
			persist();
			notify();
		},
		set: (next: NotifyConfig) => {
			state = next;
			persist();
			notify();
		},
	};
}

export type NotifyConfigStore = ReturnType<typeof createNotifyConfigStore>;
