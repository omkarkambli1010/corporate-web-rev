/**
 * Copies the Rive WebAssembly runtime out of node_modules into public/rive so
 * the site serves it from its own origin instead of the runtime's default
 * unpkg CDN (no third-party request, and it stays allowed once a CSP lands).
 * Runs on postinstall, so the files always match the installed runtime.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules", "@rive-app", "canvas");
const to = join(root, "public", "rive");

if (!existsSync(from)) {
  console.warn("[rive] @rive-app/canvas is not installed; skipping wasm copy.");
  process.exit(0);
}

mkdirSync(to, { recursive: true });
for (const file of ["rive.wasm", "rive_fallback.wasm"]) {
  copyFileSync(join(from, file), join(to, file));
}
console.log("[rive] wasm copied to public/rive");
