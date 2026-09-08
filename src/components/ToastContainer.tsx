/**
 * ToastContainer — registered into the `shell.overlay` slot.
 * Renders the toast stack in the bottom-right corner.
 *
 * @module dsh-hybrid-notify/components/ToastContainer
 */

import { useSyncExternalStore, memo } from "react";
import type { ToastItem } from "../types";
import type { ToastStore } from "../toast-store";
import { Toast } from "./Toast";

interface ToastContainerProps {
	toastStore: ToastStore;
	onSessionClick?: (sessionId: string) => void;
}

export const ToastContainer = memo(function ToastContainer({ toastStore, onSessionClick }: ToastContainerProps) {
	const items = useSyncExternalStore(
		(fn) => toastStore.subscribe(fn),
		() => toastStore.getSnapshot(),
		() => [] as ToastItem[],
	);

	if (items.length === 0) return null;

	const handleClose = (id: string) => {
		(toastStore as any).beginExit?.(id);
	};

	const handleClick = (item: ToastItem) => {
		if (item.sessionId && onSessionClick) {
			onSessionClick(item.sessionId);
		}
		handleClose(item.id);
	};

	return (
		<div
			style={{
				position: "absolute",
				bottom: 0,
				right: 0,
				zIndex: 20,
				padding: "16px",
				display: "flex",
				flexDirection: "column-reverse",
				alignItems: "flex-end",
				pointerEvents: "none",
				maxHeight: "100vh",
				overflow: "hidden",
			}}
		>
			{items.map((item) => (
				<Toast key={item.id} item={item} onClose={handleClose} onClick={handleClick} />
			))}
		</div>
	);
});
