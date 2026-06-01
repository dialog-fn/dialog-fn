// Inlines @dialog-fn/core into this package so the published output is self-contained
// (core is not published separately). Regenerated from the core source on every
// build/package, so it can never drift. Writes src/core.ts.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const coreSrc = resolve(here, "../../core/src");

const types = readFileSync(resolve(coreSrc, "types.ts"), "utf8");
let store = readFileSync(resolve(coreSrc, "store.ts"), "utf8");

// Drop the cross-file type import — the types live in this same generated file.
store = store.replace(/import type \{[\s\S]*?\} from "\.\/types";\n/, "");

const banner =
  "// AUTO-GENERATED from @dialog-fn/core — do not edit. Run `pnpm gen:core` to refresh.\n\n";
const out = resolve(here, "../src/core.ts");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, banner + types.trimEnd() + "\n\n" + store.trimStart());

console.log(`[gen-core] wrote ${out}`);
