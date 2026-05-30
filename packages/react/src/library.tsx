import { useSyncExternalStore, type FC } from "react";
import {
  createDialogStore,
  type DialogComponentProps,
  type DialogOptions,
} from "@dialog-fn/core";

export type { DialogComponentProps } from "@dialog-fn/core";

/**
 * Creates an isolated dialog instance.
 *
 * `register` wraps a dialog component with the injected lifecycle props, and
 * `useDialog` returns an imperative `showDialog(data)` that resolves on confirm
 * and rejects on close. All state lives in the framework-agnostic core store.
 */
export function createDialog<T = void, K = void, S = void>(options?: DialogOptions) {
  const store = createDialogStore<T, K>(options);

  const useDialogState = () =>
    useSyncExternalStore(store.subscribe, store.getState, store.getState);

  const register = (
    DialogComponent: FC<DialogComponentProps<T, K, S>>,
  ): FC<{ state?: S }> => {
    const RegisteredDialog: FC<{ state?: S }> = ({ state }) => {
      const { isOpen, data, shouldRender } = useDialogState();

      if (!shouldRender) {
        return null;
      }

      return (
        <DialogComponent
          isOpen={isOpen}
          data={data as T}
          onClose={store.close}
          onConfirm={store.confirm}
          state={state}
        />
      );
    };

    RegisteredDialog.displayName = `Dialog(${DialogComponent.displayName ?? DialogComponent.name ?? "Component"})`;
    return RegisteredDialog;
  };

  const useDialog = () => {
    const showDialog = (data?: T): Promise<K | undefined> => store.showDialog(data);
    showDialog.close = () => store.close();
    return showDialog;
  };

  return { register, useDialog };
}
