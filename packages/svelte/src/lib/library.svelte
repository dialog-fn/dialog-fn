<script lang="ts">
import {createStore} from '@dialog-fn/core';
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
        const resolve = get().promise.resolve;
        if (resolve) {
          resolve({});
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

export let wrappedComponent:any
export const showDialog = (data: any) =>
        new Promise((resolve, reject) => {
          $dialogStore.setPromise(resolve, reject);
          $dialogStore.open();
          $dialogStore.setData(data);
        });

</script>

<svelte:component this={wrappedComponent} isOpen={$dialogStore.isOpen} data={$dialogStore.data} onClose={$dialogStore.onClose} onConfirm={$dialogStore.onConfirm} />
