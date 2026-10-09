/**
 * Build script for dsh-hybrid-notify.
 * Bundles src/client.ts into the DSH browser module format:
 *   window.__ModuleLoader__.load({ id, factory })
 *
 * Also bundles src/index.ts → lib/index.js (host-side).
 *
 * pnpm link: on Windows creates broken junctions. The deploy step
 * replaces the broken junction with real files, but leaves a symlink
 * pointing at this repo alone (writing through it would copy onto itself).
 * Node.js fs.rm is safe for junctions — removes the link, not the target.
 *
 * Usage: node build.mjs
 */
import { build } from "esbuild";
import { writeFile, mkdir, cp, rm } from "node:fs/promises";
import { existsSync, lstatSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_NAME = "dsh-hybrid-notify";
const ROOT = dirname(fileURLToPath(import.meta.url));
const DSH_HOME = process.env.DSH_HOME || join(homedir(), ".dsh");
const DEPLOY_DIR = join(DSH_HOME, "profiles", "web", "node_modules", PKG_NAME);

// ── Build client bundle ──────────────────────────────────────────────────────
const clientResult = await build({
	entryPoints: [join(ROOT, "src/client.ts")],
	bundle: true,
	format: "cjs",
	target: "es2022",
	platform: "browser",
	write: false,
	minify: false,
	external: [
		"react",
		"react/jsx-runtime",
		"react-dom",
		"@deepseek-ai/*",
	],
});

const clientCode = clientResult.outputFiles[0].text;

// Wrap in the DSH module loader format
const clientOutput = `window.__ModuleLoader__.load({
	id: "${PKG_NAME}",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		${clientCode}
		return module.exports;
	}
});
`;

await mkdir(join(ROOT, "lib"), { recursive: true });
await writeFile(join(ROOT, "lib/client.js"), clientOutput, "utf8");
console.log("✓ Built lib/client.js");

// ── Build host entry ──────────────────────────────────────────────────────────
const hostResult = await build({
	entryPoints: [join(ROOT, "src/index.ts")],
	bundle: true,
	format: "esm",
	target: "es2022",
	platform: "node",
	write: false,
	minify: false,
});

await writeFile(join(ROOT, "lib/index.js"), hostResult.outputFiles[0].text, "utf8");
console.log("✓ Built lib/index.js");

// ── Deploy ──
// A symlinked deploy dir (pnpm link / manual link) is a view of the source
// tree, so it must never be replaced with real files. Copy through the link
// instead; when it points back at this repo the built files are already there.
const deployIsLink = lstatSync(DEPLOY_DIR, { throwIfNoEntry: false })?.isSymbolicLink() === true;

if (deployIsLink && realpathSync(DEPLOY_DIR) === realpathSync(ROOT)) {
	console.log("✓ Deploy dir is a symlink to this repo — lib/ is already in place");
} else {
	if (!deployIsLink && existsSync(DEPLOY_DIR)) {
		try { await rm(DEPLOY_DIR, { recursive: true, force: true }); } catch {}
	}
	await mkdir(DEPLOY_DIR, { recursive: true });
	await cp(join(ROOT, "lib"), join(DEPLOY_DIR, "lib"), { recursive: true });
	await cp(join(ROOT, "package.json"), join(DEPLOY_DIR, "package.json"));
	await cp(join(ROOT, "cordis.patch.yml"), join(DEPLOY_DIR, "cordis.patch.yml"));
	console.log("✓ Deployed to", DEPLOY_DIR);
}

console.log("\nBuild complete.");
