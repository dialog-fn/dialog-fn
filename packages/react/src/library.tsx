import {FC, HTMLAttributes, ReactNode} from "react";
import {useSyncExternalStore} from "use-sync-external-store/shim";
import {createStore} from "@dialog-fn/core";
import type {
    DialogMutableState,
    DialogState,
    DialogComponentProps,
} from "@dialog-fn/core";

type Get<T> = () => T;
type Set<T, K> = (value: Partial<DialogMutableState<T, K>>) => void;

type StateCreator<T, K> = (set: Set<T, K>, get: Get<T>) => T;

type RegisterOptions = {
    Wrapper?: FC<{ children: ReactNode } & HTMLAttributes<HTMLElement>>;
    forceUnmount?: boolean;
}

function createUniqueStore<T, K>(createState: StateCreator<T, K>) {
    const api = createStore(createState) as any;
    return () => useSyncExternalStore(api.subscribe, api.getState);
}

export function createDialog<T = void, K = void>() {
    const useDialogStore = createUniqueStore<DialogState<T, K>, K>(
        (set, get) =>
            ({
                isOpen: false,
                data: {},
                promise: {},
                onConfirm: (data: K) => {
                    const resolve = get().promise.resolve;
                    if (resolve) {
                        resolve(data);
                    }

                    return set({isOpen: false, data: {}, promise: {}});
                },
                onClose: () => {
                    const reject = get().promise.reject;
                    if (reject) {
                        reject();
                    }

                    return set({isOpen: false, data: {}, promise: {}});
                },
                setPromise: (r, re) => set({promise: {resolve: r, reject: re}}),
                setData: (data: T) => set({data} as any),
                open: () => set({isOpen: true}),
            }) as DialogState<T, K>
    ) as () => DialogState<T, K>;

    return {
        register: (DialogComponent: FC<DialogComponentProps<T, K>>, options?: RegisterOptions) => {
            return () => {
                const { Wrapper, forceUnmount } = options ?? {};
                const { isOpen, data, onClose, onConfirm } = useDialogStore();

                if (forceUnmount && !isOpen && !Wrapper) {
                    return null;
                }

                const dialog = (
                    <DialogComponent
                        isOpen={isOpen}
                        data={data as T}
                        onClose={onClose}
                        onConfirm={onConfirm}
                    />
                );

                return Wrapper ? <Wrapper>{dialog}</Wrapper> : dialog;
            };
        },
        useDialog: () => {
            const {setPromise, setData, open} = useDialogStore();

            const showDialog = (data: T): Promise<K> =>
                new Promise((resolve, reject) => {
                    const handleResolver = (v?: K) => resolve(v as K);
                    setPromise(handleResolver, reject);
                    open();
                    setData(data);
                });

            return showDialog;
        },
    };
}
