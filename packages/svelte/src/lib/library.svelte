<script lang="ts">
import {createStore} from '@dialog-fn/core';
import type {DialogComponentProps} from '@dialog-fn/core';
import type { ComponentType, SvelteComponent } from 'svelte';
import { readable } from 'svelte/store';


const storeToSvelte = (store:any) => {
  const svelteStore = readable(store.getState(), (set) => {
    store.subscribe((value:any) => set(value));
  });

  return {
    ...store,
    subscribe: svelteStore.subscribe
  };
}

const dialogStore = storeToSvelte(createStore(
    (set:any, get:any) =>
    ({
      isOpen: false,
      data: {},
      promise: {},
      onClose: () => {
        const reject = get().promise.reject;
        if (reject) {
          reject({});
        }

        return set({ isOpen: false, data: {}, promise: {} });
      },
      setPromise: (r:any, re:any) =>
        set({ promise: { resolve: r, reject: re } }),
      setData: (data:any) => set({ data }),
      open: () => set({ isOpen: true }),
      onConfirm: (data:any) => {
        const resolve = get().promise.resolve;
        if (resolve) {
          resolve(data);
        }

        return set({ isOpen: false, data: {}, promise: {} });
      },
    })
));

export let wrappedComponent:ComponentType<SvelteComponent<DialogComponentProps>>
export let forceUnmount: boolean = false;
export let Wrapper: ComponentType<SvelteComponent<any>> | null = null;

export const showDialog = (data: any) =>
        new Promise((resolve, reject) => {
          $dialogStore.setPromise(resolve, reject);
          $dialogStore.open();
          $dialogStore.setData(data);
        });
</script>

{#if !forceUnmount || $dialogStore.isOpen || Wrapper}
    {#if Wrapper}
        <svelte:component
                this={Wrapper}
                isOpen={$dialogStore.isOpen}
                data={$dialogStore.data}
                onClose={$dialogStore.onClose}
                onConfirm={$dialogStore.onConfirm}
        >
            <svelte:component
                    this={wrappedComponent}
                    isOpen={$dialogStore.isOpen}
                    data={$dialogStore.data}
                    onClose={$dialogStore.onClose}
                    onConfirm={$dialogStore.onConfirm} />
        </svelte:component>
    {:else}
        <svelte:component
                this={wrappedComponent}
                isOpen={$dialogStore.isOpen}
                data={$dialogStore.data}
                onClose={$dialogStore.onClose}
                onConfirm={$dialogStore.onConfirm} />
    {/if}
{/if}
