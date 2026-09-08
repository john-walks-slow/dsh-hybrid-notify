/**
 * ToastStore — observable queue of in-page toast notifications.
 *
 * Follows the SnapshotStore pattern (compatible with useSyncExternalStore).
 *
 * @module dsh-notify/toast-store
 */

import type { ToastItem, NotificationPayload, SnapshotStore } from "./types";

type Listener = () => void;

const DEFAULT_DURATION = 5000; // 5s auto-dismiss

export function createToastStore(): SnapshotStore<ToastItem[]> {
	let items: ToastItem[] = [];
	const listeners = new Set<Listener>();
	const timers = new Map<string, ReturnType<typeof setTimeout>>();

	function notify() {
		for (const fn of listeners) fn();
	}

	function add(payload: NotificationPayload, duration: number = DEFAULT_DURATION): void {
		const item: ToastItem = { ...payload, duration, exiting: false };
		items = [...items, item];
		notify();

		if (duration > 0) {
			const timer = setTimeout(() => beginExit(item.id), duration);
			timers.set(item.id, timer);
		}
	}

	function beginExit(id: string): void {
		const timer = timers.get(id);
		if (timer) {
			clearTimeout(timer);
			timers.delete(id);
		}
		items = items.map((t) => t.id === id ? { ...t, exiting: true } : t);
		notify();
		// Remove after exit animation
		setTimeout(() => remove(id), 300);
	}

	function remove(id: string): void {
		items = items.filter((t) => t.id !== id);
		const timer = timers.get(id);
		if (timer) {
			clearTimeout(timer);
			timers.delete(id);
		}
		notify();
	}

	function clearAll(): void {
		for (const timer of timers.values()) clearTimeout(timer);
		timers.clear();
		items = [];
		notify();
	}

	return {
		getSnapshot: () => items,
		subscribe: (fn: Listener) => {
			listeners.add(fn);
			return () => { listeners.delete(fn); };
		},
		update: (updater: (prev: ToastItem[]) => ToastItem[]) => {
			items = updater(items);
			notify();
		},
		set: (next: ToastItem[]) => {
			items = next;
			notify();
		},
		...({ add, remove, beginExit, clearAll } as any),
	};
}

export type ToastStore = ReturnType<typeof createToastStore>;
