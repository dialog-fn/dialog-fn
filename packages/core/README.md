<p align="center">
  <img src="https://github.com/dialog-fn/dialog-fn/assets/36113236/2d08f4d0-09fb-4e06-8508-2076738385c3" width="160" height="160" alt="dialog-fn logo" />
</p>

<h1 align="center">@dialog-fn/core</h1>

<p align="center">
  <b>The framework-agnostic promise-dialog state machine</b> behind
  <code>@dialog-fn/react</code> and <code>@dialog-fn/svelte</code>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@dialog-fn/core"><img src="https://img.shields.io/npm/v/@dialog-fn/core?style=flat-square&color=7c3aed" alt="npm version" /></a>
  <img src="https://img.shields.io/npm/l/@dialog-fn/core?style=flat-square" alt="MIT license" />
</p>

<p align="center">
  <a href="https://dialog-fn.github.io/dialog-fn/"><b>📖 Documentation →</b></a>
</p>

---

> **Most users want an adapter, not this package.** Install
> [`@dialog-fn/react`](https://www.npmjs.com/package/@dialog-fn/react) or
> [`@dialog-fn/svelte`](https://www.npmjs.com/package/@dialog-fn/svelte) instead.

`@dialog-fn/core` is the tiny, dependency-free state machine that powers the whole open →
confirm/dismiss → resolve → (optional) unmount lifecycle. Use it to build an adapter for a
framework that doesn't have one yet.

## Install

```sh
npm install @dialog-fn/core
```

## Usage

```ts
import { createDialogStore } from "@dialog-fn/core";

const store = createDialogStore({ forceUnmount: false, delayUnmount: 0 });

// Subscribe your view to state changes.
const unsubscribe = store.subscribe((state) => render(state));

// Open and await the result: resolves the confirm value, or undefined on dismiss.
const result = await store.showDialog({ message: "Delete?" });
```

`createDialogStore(options?)` returns `{ getState, subscribe, open, close, confirm, setData,
showDialog, destroy }`. `showDialog` never rejects; `destroy()` settles any pending promise and
clears listeners.

## Documentation

**→ [dialog-fn.github.io/dialog-fn](https://dialog-fn.github.io/dialog-fn/)**

## License

MIT © [Jacob Gonzalez](https://github.com/dialog-fn)
