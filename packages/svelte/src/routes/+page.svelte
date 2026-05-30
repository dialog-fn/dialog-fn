<script>
import MyDialog from './my-dialog.svelte'
import DialogRegister from '../lib/library.svelte'

/** @type {any} */
let showDialog

const handleDialog = async () => {
    const response = await showDialog({foo:'bar'})
    if (response) {
        console.log('confirmed', response)
    } else {
        console.log('dismissed')
    }
}

  </script>

<h1>Welcome!</h1>
<p>this is a demo example</p>
<button on:click={handleDialog} >hello</button>

<DialogRegister dialogComponent={MyDialog} bind:showDialog={showDialog} />