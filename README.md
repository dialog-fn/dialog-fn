<p align="center">
<img src="https://github.com/dialog-fn/dialog-fn/assets/36113236/2d08f4d0-09fb-4e06-8508-2076738385c3" width="300" height="300"> 
</p>

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mui/material-ui/blob/HEAD/LICENSE)
![NPM Version](https://img.shields.io/npm/v/%40dialog-fn%2Freact?style=flat-square&logo=react&label=%40dialog-fn%2Freact)
![NPM Version](https://img.shields.io/npm/v/%40dialog-fn%2Fsvelte?style=flat-square&logo=svelte&label=%40dialog-fn%2Fsvelte)

# dialog-fn

**One promise-dialog core, every framework.** `dialog-fn` is a framework-agnostic core with
first-class adapters for **React**, **React Native**, and **Svelte** — the same mental model
and identical semantics everywhere. Drive any dialog component as a single promise: open it,
`await` the result.

- 🧩 **Bring your own component** — fully unstyled and render-agnostic, no design lock-in
- 🪶 **~1 KB, zero runtime dependencies** — built on native primitives (React's
  `useSyncExternalStore`, Svelte stores)
- 🚫 **No providers** — no context wrapper to mount
- 🤝 **Promise-based** — `const res = await show(data)` resolves the confirm value, or
  `undefined` when dismissed; it never rejects, so no `try/catch`

> Other libraries solve this well for a single framework (e.g. `react-call`,
> `@ebay/nice-modal-react`). `dialog-fn` matches their ergonomics and footprint on React —
> and gives you the **same API across frameworks**.

# Supported with popular frameworks

| Framework    | supported |
| ------------ | --------- |
| react        | ✅        |
| react native | ✅        |
| svelte       | ✅        |

## Get started

React:

```
npm i @dialog-fn/react
npm i @dialog-fn/svelte
```

## Example (react)

> [!TIP]
> `show` is a plain function — call it from event handlers, services, or anywhere outside a
> component. `<Dialog />` can live anywhere in your tree.

```jsx
import { MyDialog } from "./my-dialog";
import { createDialog } from "@dialog-fn/react";

// Pass your component in; call this once at module scope (the store is a singleton).
// Types are inferred from MyDialog — or be explicit: createDialog<Input, Output>(MyDialog).
const { Dialog, show } = createDialog(MyDialog);

export const Page = () => {
  const handleClick = async () => {
    // you can pass any data to your dialog component
    const response = await show({ foo: "bar" });
    if (response) {
      // resolved with the value passed to onConfirm
      console.log(response);
    } else {
      // resolved with undefined because the user dismissed the dialog
      console.log("dismissed");
    }
  };

  return (
    <div>
      <button onClick={handleClick}>demo</button>
      {/** your ui code */}

      <Dialog />
    </div>
  );
};
```

### What `createDialog` returns

`createDialog(MyDialog, options?)` returns:

- **`Dialog`** — the component to render once (anywhere). Optionally takes a `state` prop for
  extra render-time state.
- **`show(data)`** — opens the dialog and returns a `Promise` that resolves with the
  `onConfirm` value, or `undefined` when dismissed. Also exposes `show.close()` to dismiss
  programmatically.
- **`close()`** — dismiss the dialog (alias of `show.close()`).

Your dialog component receives these injected props:

- isOpen: boolean
- data: T
- onClose: () => void
- onConfirm: (response: K) => void

make sure your component is ready to recieve and handle these props

this is an example of a simpe dialog you can create

```jsx
export const MyDialog = ({ isOpen, data, onClose, onConfirm }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const response = Object.fromEntries(data.entries());
    onConfirm(response);
  };

  return (
    <dialog open={isOpen}>
      <div>
        <h1>My Dialog</h1>
        <p>{data.foo}</p>
        <form>
          <input name="demo" />
          <button type="submit">Confirm</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </dialog>
  );
};
```

## Example (svelte)

```svelte
<script>
import MyDialog from './my-dialog.svelte'
import { DialogRegister } from '@dialog-fn/svelte'

let showDialog

const handleDialog = async () => {
    const response = await showDialog({foo:'bar'})
    if (response) {
        console.log('confirmed', response)
    } else {
        // resolved with undefined because the user dismissed the dialog
        console.log('dismissed')
    }
}

</script>

<h1>Welcome!</h1>
<p>this is a demo example</p>
<button on:click={handleDialog} >hello</button>

<DialogRegister dialogComponent={MyDialog} bind:showDialog={showDialog} />
```

Your custom dialog component should be able to handle the injected props coming from <DialogRegister/> for example:

```svelte
<script>
    // these props will be provided by @dialog-fn/svelte
    export let isOpen = false;
    export let data = {};
    export let onClose = () => {};
    export let onConfirm = () => {};

    const handleClose = ()=>{
        onClose()
    }
    const handleConfirm = ()=>{
        onConfirm({ custom:'foo-bar' })
    }
</script>


<dialog open={isOpen}>
    <div>
      <h1>My Dialog</h1>
      <p>Is open: {isOpen.toString()}</p>
      <p>Data: {JSON.stringify(data)}</p>
      <button on:click={handleClose}>Close</button>
      <button on:click={handleConfirm}>Confirm</button>
    </div>
  </dialog>
```

## Accessibility

`dialog-fn` only controls visibility and the confirm/dismiss promise — **rendering and
accessibility are up to your component.** The examples above use the native `<dialog open>`
attribute, which is *non-modal*: it does not trap focus, dim the background, or close on
`Esc`.

For a real modal, drive a `<dialog>` with `showModal()` and forward the native `cancel`
event (fired on `Esc`) to `onClose`:

```jsx
export const MyDialog = ({ isOpen, data, onClose, onConfirm }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isOpen && !el.open) el.showModal(); // focus trap + backdrop + Esc
    if (!isOpen && el.open) el.close();
  }, [isOpen]);

  return (
    <dialog ref={ref} onCancel={onClose} onClose={onClose}>
      {/* ...your content, call onConfirm(value) to resolve... */}
    </dialog>
  );
};
```
