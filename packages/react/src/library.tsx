import {FC, useEffect, useRef} from "react";
import type {
    DialogState,
} from "@dialog-fn/core";
import {create} from "zustand/react";


export interface DialogComponentProps<T = any, K = any, S = any>{
    isOpen?: boolean;
    data?: T;
    onClose?: () => void;
    onConfirm?: (response?: K) => void;
    state?: S
}

type RegisterOptions = {
    forceUnmount?: boolean;
    delayUnmount?: number;
}

export function createDialog<T = void, K = void, S = void>(options?: RegisterOptions) {
    const useDialogStore = create<DialogState<T, K>>(
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

                    const newData: any = {isOpen: false, promise: {}}
                    if (!options?.forceUnmount) {
                        newData.data = {}
                    }

                    return set(newData);
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
        register: (DialogComponent: FC<DialogComponentProps<T, K, S>>): FC<{ state?: S }> => {
            return ({ state }) => {
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
                        state={state}
                    />
                )
            };
        },
        useDialog: () => {
            const {setPromise, setData, open,onClose} = useDialogStore();

            const showDialog = (data: T): Promise<K> =>
                new Promise((resolve, reject) => {
                    const handleResolver = (v?: K) => resolve(v as K);
                    setPromise(handleResolver, reject);
                    open();
                    setData(data);
                });


            showDialog.close = () =>{
                onClose();
            }

            return showDialog;
        },
    };
}
