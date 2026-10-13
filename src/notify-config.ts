/**
 * NotifyConfigStore — persisted plugin configuration.
 * @module dsh-hybrid-notify/notify-config
 */

import type { NotifyConfig, SnapshotStore } from "./types";
import { deepMerge } from "./deep-merge";
import { DEFAULT_IGNORE_PATTERNS } from "./ignore-matcher";

const PERSIST_KEY = "dsh.notify.config";

const DEFAULTS: NotifyConfig = {
	enabled: true,
	ignore: {
		patterns: [...DEFAULT_IGNORE_PATTERNS],
	},
	channels: {
		inpage: true,
		pwa: true,
		web: true,
	},
	persistent: {
		enabled: true,
	},
	dismissOnRead: true,
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
		jobComplete: false,
		subagentComplete: false,
	},
};

type Listener = () => void;

export function createNotifyConfigStore(): SnapshotStore<NotifyConfig> {
	let state: NotifyConfig = loadInitial();
	const listeners = new Set<Listener>();

	function loadInitial(): NotifyConfig {
		try {
			const raw = localStorage.getItem(PERSIST_KEY);
			if (raw) return deepMerge(DEFAULTS, JSON.parse(raw));
		} catch { /* ignore */ }
		return { ...DEFAULTS };
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
