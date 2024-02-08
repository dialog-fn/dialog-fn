<script>
    export let isOpen = false;
    export let data = {};
    export let onClose = () => {};
    /**
     * @param v {any}
     */
    export let onConfirm = (v) => {};



    const handleClose = ()=>{
        onClose()
    }


    const handleConfirm = () => {
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