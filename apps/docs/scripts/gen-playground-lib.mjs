// Bundles the REAL @dialog-fn/react source into a single self-contained ESM file
// that the in-browser Sandpack playgrounds import. React is left external (Sandpack
// provides it). Regenerated on every dev/build so the playground library can never
// drift from the package source.
import { build } from "esbuild";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const entry = resolve(repoRoot, "packages/react/lib/main.ts");
const outfile = resolve(here, "../src/playground/dialog-fn.bundle.js");

await build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  jsx: "automatic",
  jsxImportSource: "react",
  // Provided by the Sandpack react template at runtime.
  external: ["react", "react-dom", "react/jsx-runtime"],
  outfile,
  legalComments: "none",
  logLevel: "info",
});

console.log(`[gen-playground-lib] wrote ${outfile}`);
