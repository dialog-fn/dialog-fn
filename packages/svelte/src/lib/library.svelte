<script lang="ts">
    import { createDialogStore } from '@dialog-fn/core';
    import type { DialogComponentProps } from '@dialog-fn/core';
    import type { ComponentType, SvelteComponent } from 'svelte';
    import { onDestroy } from 'svelte';
    import { readable } from 'svelte/store';

    export let dialogComponent: ComponentType<SvelteComponent<DialogComponentProps>>;
    export let forceUnmount = false;
    export let delayUnmount = 0;
    export let customState: Record<string, unknown> = {};

    // The whole open/confirm/close lifecycle lives in the framework-agnostic core store.
    const store = createDialogStore<any, any>({ forceUnmount, delayUnmount });

    // Bridge the core store into a Svelte-readable so the template stays reactive.
    const state = readable(store.getState(), (set) => store.subscribe((next: any) => set(next)));

    export const showDialog = (data?: unknown): Promise<unknown> => store.showDialog(data);
    export const close = (): void => store.close();

    onDestroy(() => store.destroy());
</script>

{#if $state.shouldRender}
    <svelte:component
        this={dialogComponent}
        isOpen={$state.isOpen}
        data={$state.data}
        onClose={store.close}
        onConfirm={store.confirm}
        state={customState} />
{/if}
