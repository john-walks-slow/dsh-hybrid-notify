/**
 * VisibilityDetector — detects whether the DSH window is in the foreground.
 *
 * Uses Page Visibility API + window focus events, following the same pattern
 * as dsh-zen-tracker's foreground-tracker.
 *
 * @module dsh-hybrid-notify/visibility-detector
 */

import type { VisibilityState, SnapshotStore } from "./types";

type Listener = () => void;

export function createVisibilityDetector(): SnapshotStore<VisibilityState> {
	let state: VisibilityState = computeState();
	const listeners = new Set<Listener>();

	function computeState(): VisibilityState {
		if (typeof document === "undefined") {
			return { isVisible: true, hasFocus: true, isForeground: true };
		}
		const isVisible = document.visibilityState === "visible";
		const hasFocus = document.hasFocus();
		return { isVisible, hasFocus, isForeground: isVisible && hasFocus };
	}

	function notify() {
		for (const fn of listeners) fn();
	}

	function update() {
		const next = computeState();
		if (next.isVisible !== state.isVisible ||
			next.hasFocus !== state.hasFocus ||
			next.isForeground !== state.isForeground) {
			state = next;
			notify();
		}
	}

	const onVisibilityChange = () => update();
	const onFocus = () => update();
	const onBlur = () => update();

	document.addEventListener("visibilitychange", onVisibilityChange);
	window.addEventListener("focus", onFocus);
	window.addEventListener("blur", onBlur);

	return {
		getSnapshot: () => state,
		subscribe: (fn: Listener) => {
			listeners.add(fn);
			return () => {
				listeners.delete(fn);
			};
		},
		update: (updater: (prev: VisibilityState) => VisibilityState) => {
			state = updater(state);
			notify();
		},
		set: (next: VisibilityState) => {
			state = next;
			notify();
		},
		// expose cleanup via a custom property
		...({ _cleanup: () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("focus", onFocus);
			window.removeEventListener("blur", onBlur);
		} } as any),
	};
}

export type VisibilityDetector = ReturnType<typeof createVisibilityDetector>;
