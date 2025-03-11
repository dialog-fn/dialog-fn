<script lang="ts">
    import { createStore } from '@dialog-fn/core';
    import type { DialogComponentProps } from '@dialog-fn/core';
    import type { ComponentType, SvelteComponent } from 'svelte';
    import { readable } from 'svelte/store';
    import { onDestroy } from 'svelte';

    function storeToSvelte(store: any) {
        const svelteStore = readable(store.getState(), (set) => {
            const unsubscribe = store.subscribe((value: any) => set(value));
            return unsubscribe;
        });
        return {
            ...store,
            subscribe: svelteStore.subscribe
        };
    }

    const dialogStore = storeToSvelte(
        createStore((set: any, get: any) => ({
            isOpen: false,
            data: {},
            promise: {},
            onClose: () => {
                const reject = get().promise.reject;
                if (reject) {
                    reject();
                }
                return set({ isOpen: false, data: {}, promise: {} });
            },
            setPromise: (resolve: any, reject: any) =>
                set({ promise: { resolve, reject } }),
            setData: (data: any) => set({ data }),
            open: () => set({ isOpen: true }),
            onConfirm: (data: any) => {
                const resolve = get().promise.resolve;
                if (resolve) {
                    resolve(data);
                }
                return set({ isOpen: false, data: {}, promise: {} });
            },
        }))
    );

    export let dialogComponent: ComponentType<SvelteComponent<DialogComponentProps>>;
    export let forceUnmount: boolean = false;
    export let delayUnmount: number = 0;

    export const showDialog = (data: any): Promise<any> =>
        new Promise((resolve, reject) => {
            dialogStore.setPromise(resolve, reject);
            dialogStore.open();
            dialogStore.setData(data);
        });

    let shouldRender = $dialogStore.isOpen;
    let timer: ReturnType<typeof setTimeout> | null = null;

    $: {
        if ($dialogStore.isOpen) {
            shouldRender = true;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        } else if (forceUnmount) {
            if (delayUnmount > 0) {
                if (!timer) {
                    timer = setTimeout(() => {
                        shouldRender = false;
                        timer = null;
                    }, delayUnmount);
                }
            } else {
                shouldRender = false;
            }
        }
    }

    onDestroy(() => {
        if (timer) clearTimeout(timer);
    });
</script>

{#if !forceUnmount || shouldRender}
    <svelte:component
            this={dialogComponent}
            isOpen={$dialogStore.isOpen}
            data={$dialogStore.data}
            onClose={$dialogStore.onClose}
            onConfirm={$dialogStore.onConfirm} />
{/if}
