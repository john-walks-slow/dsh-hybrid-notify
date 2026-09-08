/**
 * In-page toast channel — shows toasts in the DSH window overlay.
 * @module dsh-notify/channels/inpage-toast
 */

import type { NotificationPayload, SnapshotStore } from "../types";
import type { ToastStore } from "../toast-store";

export class InPageToastChannel {
	constructor(private toastStore: ToastStore) {}

	show(payload: NotificationPayload, duration: number = 5000): void {
		(this.toastStore as any).add(payload, duration);
	}
}
