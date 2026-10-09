/**
 * Recursive merge used to layer persisted config over defaults.
 *
 * Arrays are replaced wholesale: merging them index-wise would turn an
 * intentionally emptied list (`[]`) back into the default entries.
 *
 * @module dsh-hybrid-notify/deep-merge
 */

export function deepMerge<T>(base: T, override: unknown): T {
	if (Array.isArray(override)) return override as unknown as T;
	if (typeof base !== "object" || base === null) return (override ?? base) as T;
	if (typeof override !== "object" || override === null) return (override ?? base) as T;

	const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
	for (const [key, value] of Object.entries(override)) {
		out[key] = key in out ? deepMerge(out[key], value) : value;
	}
	return out as unknown as T;
}
