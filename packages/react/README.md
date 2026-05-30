<p align="center">
  <img src="https://github.com/dialog-fn/dialog-fn/assets/36113236/2d08f4d0-09fb-4e06-8508-2076738385c3" width="160" height="160" alt="dialog-fn logo" />
</p>

<h1 align="center">@dialog-fn/react</h1>

<p align="center">
  <b>Promise-based dialogs for React.</b> Open a dialog, <code>await</code> the result.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@dialog-fn/react"><img src="https://img.shields.io/npm/v/@dialog-fn/react?style=flat-square&logo=react&color=7c3aed" alt="npm version" /></a>
  <a href="https://bundlephobia.com/package/@dialog-fn/react"><img src="https://img.shields.io/bundlephobia/minzip/@dialog-fn/react?style=flat-square&label=size" alt="bundle size" /></a>
  <img src="https://img.shields.io/npm/l/@dialog-fn/react?style=flat-square" alt="MIT license" />
</p>

<p align="center">
  <a href="https://dialog-fn.github.io/dialog-fn/"><b>📖 Documentation &amp; live playground →</b></a>
</p>

---

Drive any dialog component as a single promise — **no providers, no boilerplate**. Part of
[dialog-fn](https://github.com/dialog-fn/dialog-fn): one promise-dialog core with first-class
adapters for **React**, **React Native**, and **Svelte**.

- 🧩 **Bring your own component** — fully unstyled and render-agnostic
- 🪶 **~1 KB, zero runtime dependencies** — built on React's `useSyncExternalStore`
- 🚫 **No providers** — no context wrapper to mount
- 🤝 **Promise-based** — `await show(data)` resolves the confirm value, or `undefined` when
  dismissed; it never rejects, so no `try/catch`
- 🔡 **Fully typed** — generics inferred from your component

## Install

```sh
npm install @dialog-fn/react
```

## Usage

```tsx
import { createDialog, type DialogComponentProps } from "@dialog-fn/react";

// Your component — style it however you like.
function MyDialog({ isOpen, data, onClose, onConfirm }: DialogComponentProps<{ name: string }, boolean>) {
  return (
    <dialog open={isOpen}>
      <p>Delete {data?.name}?</p>
      <button onClick={onClose}>Cancel</button>
      <button onClick={() => onConfirm?.(true)}>Delete</button>
    </dialog>
  );
}

// Pass the component in — call once at module scope. Types are inferred.
const { Dialog, show } = createDialog(MyDialog);

export function Page() {
  async function remove() {
    const confirmed = await show({ name: "report.pdf" }); // true | undefined
    if (confirmed) console.log("deleted");
  }

  return (
    <>
      <button onClick={remove}>Delete</button>
      <Dialog />
    </>
  );
}
```

`createDialog(Component, options?)` returns:

- **`Dialog`** — render once, anywhere.
- **`show(data)`** — opens the dialog; returns `Promise<value | undefined>`. A plain function,
  usable in handlers, services, or outside React. `show.close()` dismisses programmatically.
- **`close()`** — dismiss the dialog.

## Recipes

Confirm, prompt/form, toast, drawer, and animated dialogs — each with an **editable live
playground** — are in the docs:

**→ [dialog-fn.github.io/dialog-fn](https://dialog-fn.github.io/dialog-fn/)**

## License

MIT © [Jacob Gonzalez](https://github.com/dialog-fn)
