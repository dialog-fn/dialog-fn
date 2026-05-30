<script lang="ts">
    import { createDialogStore } from './core.js';
    import type { ComponentType } from 'svelte';
    import { onDestroy } from 'svelte';
    import { readable } from 'svelte/store';

    // Any Svelte component — it receives the injected DialogComponentProps
    // (isOpen, data, onClose, onConfirm, state). Svelte 4 components aren't generic,
    // so the props aren't statically enforced here.
    export let dialogComponent: ComponentType;
    // forceUnmount/delayUnmount are read once when the store is created below;
    // changing them reactively after mount has no effect.
    export let forceUnmount = false;
    export let delayUnmount = 0;
    export let customState: Record<string, unknown> = {};

    // The whole open/confirm/dismiss lifecycle lives in the framework-agnostic core store.
    // Svelte 4 components are not generic, so data/response are `any` here; annotate
    // `showDialog` at the call site for type safety, e.g. `let showDialog: (d: In) => Promise<Out | undefined>`.
    const store = createDialogStore<any, any>({ forceUnmount, delayUnmount });

    // Bridge the core store into a Svelte-readable so the template stays reactive.
    const state = readable(store.getState(), (set) => store.subscribe((next: any) => set(next)));

    // showDialog resolves with the confirm value, or `undefined` when dismissed.
    // `.close()` is attached for parity with @dialog-fn/react; the standalone
    // `close` export is the idiomatic Svelte form.
    export const showDialog = Object.assign(
        (data?: unknown): Promise<unknown> => store.showDialog(data),
        { close: (): void => store.close() },
    );
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
