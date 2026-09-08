/**
 * Toast — single toast notification component.
 * @module dsh-notify/components/Toast
 */

import { memo, useEffect, useRef, useState } from "react";
import type { ToastItem, NotificationLevel } from "../types";

interface ToastProps {
	item: ToastItem;
	onClose: (id: string) => void;
	onClick?: (item: ToastItem) => void;
}

const LEVEL_STYLES: Record<NotificationLevel, { bg: string; border: string; icon: string }> = {
	info: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-border-l1)", icon: "ℹ" },
	success: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-state-success-primary)", icon: "✓" },
	warning: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-state-warn-primary)", icon: "⚠" },
	error: { bg: "var(--dsw-alias-bg-layer-1)", border: "var(--dsw-alias-state-error-primary)", icon: "✕" },
};

export const Toast = memo(function Toast({ item, onClose, onClick }: ToastProps) {
	const [progress, setProgress] = useState(100);
	const rafRef = useRef<number>(0);
	const startRef = useRef<number>(0);

	useEffect(() => {
		if (item.duration <= 0 || item.exiting) return;
		startRef.current = performance.now();

		const tick = (now: number) => {
			const elapsed = now - startRef.current;
			const pct = Math.max(0, 100 - (elapsed / item.duration) * 100);
			setProgress(pct);
			if (pct > 0 && !item.exiting) {
				rafRef.current = requestAnimationFrame(tick);
			}
		};
		rafRef.current = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(rafRef.current);
	}, [item.duration, item.exiting]);

	const style = LEVEL_STYLES[item.level] ?? LEVEL_STYLES.info;

	return (
		<div
			onClick={() => onClick?.(item)}
			style={{
				display: "flex",
				alignItems: "flex-start",
				gap: "8px",
				padding: "10px 12px",
				marginBottom: "8px",
				minWidth: "280px",
				maxWidth: "360px",
				background: style.bg,
				border: `1px solid ${style.border}`,
				borderLeft: `3px solid ${style.border}`,
				borderRadius: "6px",
				boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
				cursor: onClick ? "pointer" : "default",
				pointerEvents: "auto",
				color: "var(--dsw-alias-label-primary)",
				fontSize: "13px",
				lineHeight: "1.4",
				opacity: item.exiting ? 0 : 1,
				transform: item.exiting ? "translateX(100%)" : "translateX(0)",
				transition: "opacity 0.3s ease, transform 0.3s ease",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{style.icon}</span>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontWeight: 500, marginBottom: item.body ? "2px" : 0 }}>{item.title}</div>
				{item.body && (
					<div style={{ color: "var(--dsw-alias-label-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
						{item.body}
					</div>
				)}
			</div>
			<button
				onClick={(e) => { e.stopPropagation(); onClose(item.id); }}
				style={{
					background: "none",
					border: "none",
					cursor: "pointer",
					fontSize: "14px",
					color: "var(--dsw-alias-label-tertiary)",
					padding: "0",
					flexShrink: 0,
					lineHeight: 1,
				}}
				aria-label="Close"
			>
				✕
			</button>
			{item.duration > 0 && !item.exiting && (
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						height: "2px",
						width: `${progress}%`,
						background: style.border,
						opacity: 0.5,
						transition: "none",
					}}
				/>
			)}
		</div>
	);
});
