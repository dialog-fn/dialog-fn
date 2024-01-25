import { FC } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { createStore } from "@dialog-fn/core";

type DialogMutableState<T> = {
  isOpen: boolean;
  data: T;
  promise: { resolve?: (value: T) => void; reject?: (reason?: string) => void };
};

type DialogHandlers<T> = {
  onClose: () => void;
  setPromise: (r: (value: any) => void, re: (reason?: string) => void) => void;
  setData: (data: T) => void;
  open: () => void;
  onConfirm: () => void;
};

type DialogState<T> = DialogMutableState<T> & DialogHandlers<T>;

type Get<T> = () => T;
type Set<T> = (value: DialogMutableState<T>) => void;

type StateCreator<T> = (set: Set<T>, get: Get<T>) => T;

function createUniqueStore<T>(createState: StateCreator<T>) {
  const api = createStore(createState) as any;
  return () => useSyncExternalStore(api.subscribe, api.getState);
}

type ComponentProps<T> = {
  isOpen: boolean;
  data: T;
  onClose: () => void;
  onConfirm: () => void;
};

export function createDialog<T, K>(Component: FC<ComponentProps<T>>) {
  const useDialog = createUniqueStore<DialogState<T>>(
    (set, get) =>
      ({
        isOpen: false,
        data: {},
        promise: {},
        onClose: () => {
          const resolve = get().promise.resolve;
          if (resolve) {
            resolve({} as T);
          }

          return set({ isOpen: false, data: {} as any, promise: {} });
        },
        setPromise: (r, re) =>
          set({ promise: { resolve: r, reject: re } } as any),
        setData: (data: any) => set({ data } as any),
        open: () => set({ isOpen: true } as any),
        onConfirm: (data: any) => {
          const resolve = get().promise.resolve;
          if (resolve) {
            resolve(data);
          }

          return set({ isOpen: false, data: {}, promise: {} } as any);
        },
      }) as DialogState<T>
  ) as () => DialogState<T>;

  return {
    Dialog: () => {
      const { isOpen, data, onClose, onConfirm } = useDialog();
      return (
        <Component
          isOpen={isOpen}
          data={data}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      );
    },
    useDialog: () => {
      const { setPromise, setData, open } = useDialog();

      const showDialog = (data: T): Promise<K> =>
        new Promise((resolve, reject) => {
          setPromise(resolve, reject);
          open();
          setData(data);
        });

      return showDialog;
    },
  };
}
