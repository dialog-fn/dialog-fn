<p align="center">
  <img src="https://github.com/dialog-fn/dialog-fn/assets/36113236/2d08f4d0-09fb-4e06-8508-2076738385c3" width="160" height="160" alt="dialog-fn logo" />
</p>

<h1 align="center">@dialog-fn/svelte</h1>

<p align="center">
  <b>Promise-based dialogs for Svelte.</b> Open a dialog, <code>await</code> the result.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@dialog-fn/svelte"><img src="https://img.shields.io/npm/v/@dialog-fn/svelte?style=flat-square&logo=svelte&color=ff3e00" alt="npm version" /></a>
  <a href="https://bundlephobia.com/package/@dialog-fn/svelte"><img src="https://img.shields.io/bundlephobia/minzip/@dialog-fn/svelte?style=flat-square&label=size" alt="bundle size" /></a>
  <img src="https://img.shields.io/npm/l/@dialog-fn/svelte?style=flat-square" alt="MIT license" />
</p>

<p align="center">
  <a href="https://dialog-fn.github.io/dialog-fn/"><b>📖 Documentation &amp; recipes →</b></a>
</p>

---

Drive any Svelte dialog component as a single promise — **no providers, no boilerplate**. Part
of [dialog-fn](https://github.com/dialog-fn/dialog-fn): one promise-dialog core with first-class
adapters for **React**, **React Native**, and **Svelte**.

- 🧩 **Bring your own component** — fully unstyled and render-agnostic
- 🪶 **Zero runtime dependencies** — built on native Svelte stores
- 🚫 **No providers** — just render `<DialogRegister>`
- 🤝 **Promise-based** — `await showDialog(data)` resolves the confirm value, or `undefined`
  when dismissed; it never rejects

## Install

```sh
npm install @dialog-fn/svelte
```

## Usage

```svelte
<script>
  import { DialogRegister } from "@dialog-fn/svelte";
  import MyDialog from "./MyDialog.svelte";

  let showDialog;

  async function remove() {
    const confirmed = await showDialog({ name: "report.pdf" });
    if (confirmed) console.log("deleted");
  }
</script>

<button on:click={remove}>Delete</button>

<DialogRegister dialogComponent={MyDialog} bind:showDialog />
```

Your component receives the injected props (`isOpen`, `data`, `onClose`, `onConfirm`):

```svelte
<!-- MyDialog.svelte -->
<script>
  export let isOpen = false;
  export let data = {};
  export let onClose = () => {};
  export let onConfirm = (value) => {};
</script>

<dialog open={isOpen}>
  <p>Delete {data.name}?</p>
  <button on:click={onClose}>Cancel</button>
  <button on:click={() => onConfirm(true)}>Delete</button>
</dialog>
```

`showDialog.close()` (or the standalone `close` export) dismisses programmatically.

## Documentation

Full guides, the props/options reference, and recipes (confirm, prompt, toast, drawer,
animated):

**→ [dialog-fn.github.io/dialog-fn](https://dialog-fn.github.io/dialog-fn/)**

## License

MIT © [Jacob Gonzalez](https://github.com/dialog-fn)
