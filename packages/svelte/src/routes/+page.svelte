<script>
import MyDialog from './my-dialog.svelte'
import DialogRegister from '../lib/library.svelte'

/** @type any */
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