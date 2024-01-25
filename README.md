<p align="center">
<img src="https://github.com/dialog-fn/dialog-fn/assets/36113236/2d08f4d0-09fb-4e06-8508-2076738385c3" width="300" height="300"> 
</p>

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mui/material-ui/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@dialog-fn/react/latest.svg)](https://www.npmjs.com/package/@dialog-fn/react)

# dialog-fn

This is a very lightweight implementation, provider free, compatible with any kind of component since it use only native tools and adapted for different frameworks like react.

Improve development experience using dialogs as promise function, this library transform your Dialog component and expose a handler to control the visibility and the confirm/cancel actions, using only a single promise.

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
> Once you have wrapped your dialog with register function, you are able to place the Dialog component anywhere, thanks to dependency free implementation of this library

```jsx
import MyDialog from "./my-dialog";
import { createDialog } from "@dialog-fn/react";

// you could also add type notation, eg: createDialog<Input, Output>(MyDialog)
const { Dialog, useDialog } = createDialog(MyDialog);

export const Page = () => {
  const showDialog = useDialog();

  const handleClik = async () => {
    // you can pass any data to your dialog component
    const data = { foo: "bar" };
    const response = await showDialog(data);
    console.log(response);
  };

  return (
    <div>
      <button onClick={handleClik}>demo</button>
      {/** your ui code */}

      <Dialog />
    </div>
  );
};
```

### register HOC

When you wrap a component using `register` HOC it will pass 4 props to control the dialog:

- isOpen: boolean
- onClose: () => void
- onConfirm: (response: T) => void
- data: T

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
import { DialogRegister } from '@dialog-fn/react'

let showDialog

const handleDialog = async () => {
    const response = await showDialog({foo:'bar'})
    console.log(response)
}

</script>

<h1>Welcome!</h1>
<p>this is a demo example</p>
<button on:click={handleDialog} >hello</button>

<DialogRegister wrappedComponent={MyDialog} bind:showDialog={showDialog} />
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
