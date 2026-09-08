/**
 * Local type shims for DSH packages that are only available at runtime
 * through the browser module loader. These allow `tsc --noEmit` to pass
 * without installing the full DSH monorepo.
 */

declare module "@deepseek-ai/cordis" {
	export interface Context {
		effect(body: () => (() => void) | void, label?: string): (() => void) | void;
		locale: {
			register(ns: string, dicts: Record<string, Record<string, string>>): (() => void) | void;
			bind(ns: string): (key: string, params?: Record<string, any>) => string;
		};
		slots: {
			inject(key: string, callback: () => (() => void) | void): (() => void) | void;
			register(spec: any, component: any): (() => void) | void;
		};
		sessions: any;
		[k: string]: any;
	}
}

declare module "@deepseek-ai/dsh-api-remotes/client" {
	export type SessionId = string;
}

declare const require: (id: string) => any;
