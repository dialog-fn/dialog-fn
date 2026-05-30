import { Sandpack } from "@codesandbox/sandpack-react";
// The real @dialog-fn/react source, bundled to a single ESM file at build time.
import dialogFnSource from "../playground/dialog-fn.bundle.js?raw";

const indexHtml = `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body><div id="root"></div></body>
</html>`;

const indexTsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

// Minimal, neutral styling so demos look intentional without teaching CSS.
const styles = `* { box-sizing: border-box; }
body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; color: #1c1c22; }
button { font: inherit; padding: 7px 14px; border-radius: 8px; border: 1px solid #d4d4d8; background: #fff; cursor: pointer; }
button:hover { background: #f4f4f5; }
button.primary { background: #6d28d9; border-color: #6d28d9; color: #fff; }
dialog { border: none; border-radius: 14px; padding: 0; box-shadow: 0 20px 60px #0003; max-width: 360px; }
dialog::backdrop { background: #0007; }
.panel { padding: 20px; }
.row { display: flex; gap: 8px; margin-top: 16px; }
input { font: inherit; padding: 8px 10px; border: 1px solid #d4d4d8; border-radius: 8px; width: 100%; }
.muted { color: #71717a; }
`;

export interface PlaygroundProps {
  code: string;
  height?: number;
}

export default function Playground({ code, height = 460 }: PlaygroundProps) {
  return (
    <Sandpack
      template="react-ts"
      theme="auto"
      files={{
        "/dialog-fn.tsx": { code: dialogFnSource, hidden: true },
        "/styles.css": { code: styles, hidden: true },
        "/index.html": { code: indexHtml, hidden: true },
        "/index.tsx": { code: indexTsx, hidden: true },
        "/App.tsx": { code, active: true },
      }}
      options={{
        editorHeight: height,
        showLineNumbers: true,
        showTabs: false,
        showConsoleButton: true,
      }}
    />
  );
}
