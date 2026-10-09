/**
 * Title-based session ignore rules.
 *
 * Sessions whose title matches any configured regular expression are
 * silenced entirely (no notification, no sound). The shipped default
 * targets DSH-IM Telegram sessions, which dsh-im titles `Telegram · <chat>`.
 *
 * @module dsh-hybrid-notify/ignore-matcher
 */

/** Shipped default: DSH-IM Telegram sessions. */
export const DEFAULT_IGNORE_PATTERNS: readonly string[] = ["^Telegram ·"];

/** Whether any pattern matches the session title. Invalid patterns are skipped. */
export function isTitleIgnored(title: string | undefined, patterns: readonly string[]): boolean {
	if (!title) return false;
	for (const pattern of patterns) {
		try {
			if (new RegExp(pattern).test(title)) return true;
		} catch { /* invalid pattern → never matches */ }
	}
	return false;
}

/** The trimmed, non-empty patterns that fail to compile — for surfacing in the settings UI. */
export function findInvalidPatterns(lines: readonly string[]): string[] {
	const invalid: string[] = [];
	for (const line of lines) {
		const pattern = line.trim();
		if (!pattern) continue;
		try {
			new RegExp(pattern);
		} catch {
			invalid.push(pattern);
		}
	}
	return invalid;
}

/** Parse a textarea value (one pattern per line) into a normalized pattern list. */
export function parsePatternLines(text: string): string[] {
	return text.split("\n").map((line) => line.trim()).filter(Boolean);
}
