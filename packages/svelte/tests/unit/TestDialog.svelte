<script>
    export let isOpen = false;
    export let data = {};
    /** @type {(value?: any) => void} */
    export let onConfirm = () => {};
    /** @type {() => void} */
    export let onClose = () => {};
</script>

<div data-testid="dialog">
    <span data-testid="open">{isOpen}</span>
    <span data-testid="data">{JSON.stringify(data)}</span>
    <button on:click={() => onConfirm({ bar: 'ok' })}>confirm</button>
    <button on:click={onClose}>close</button>
</div>
