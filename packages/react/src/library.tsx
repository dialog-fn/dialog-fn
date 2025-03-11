import {FC, useEffect, useRef} from "react";
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
    forceUnmount?: boolean;
    delayUnmount?: number;
}

function createUniqueStore<T, K>(createState: StateCreator<T, K>) {
    const api = createStore(createState) as any;
    return () => useSyncExternalStore(api.subscribe, api.getState);
}

export function createDialog<T = void, K = void>(options?: RegisterOptions) {
    const useDialogStore = createUniqueStore<DialogState<T, K>, K>(
        (set, get) =>
            ({
                isOpen: false,
                data: {},
                promise: {},
                delayUnmount: options?.delayUnmount,
                forceUnmount: options?.forceUnmount,
                shouldRender: false,
                hideRender: () => set({ shouldRender: false, data: {} }),
                resetRender: () => set({ shouldRender: true }),
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

                    return set({isOpen: false, promise: {}});
                },
                setPromise: (r, re) => set({ promise: { resolve: r, reject: re } }),
                setData: (data: T) => set({data} as any),
                open: () => set({isOpen: true}),
            }) as DialogState<T, K>
    ) as () => DialogState<T, K>;

    return {
        register: (DialogComponent: FC<DialogComponentProps<T, K>>) => {
            return () => {
                const { isOpen, data, onClose, onConfirm, delayUnmount, forceUnmount, shouldRender, hideRender, resetRender } = useDialogStore();
                const timerRef = useRef<NodeJS.Timeout | null>(null);

                useEffect(() => {
                    if (isOpen) {
                        resetRender()
                        if (timerRef.current) {
                            clearTimeout(timerRef.current);
                            timerRef.current = null;
                        }
                    } else if (forceUnmount) {
                        if (delayUnmount) {
                            timerRef.current = setTimeout(() => {
                                hideRender()
                                timerRef.current = null;
                            }, delayUnmount);
                        } else {
                            hideRender()
                        }
                    }
                    return () => {
                        if (timerRef.current) {
                            clearTimeout(timerRef.current);
                        }
                    };
                }, [isOpen, forceUnmount, delayUnmount]);

                if (forceUnmount && !shouldRender) {
                    return null;
                }

                return (
                    <DialogComponent
                        isOpen={isOpen}
                        data={data as T}
                        onClose={onClose}
                        onConfirm={onConfirm}
                    />
                )
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
