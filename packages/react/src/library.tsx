import { useSyncExternalStore, type FC } from "react";
import {
  createDialogStore,
  type DialogComponentProps,
  type DialogOptions,
} from "./core";

export type { DialogComponentProps } from "./core";

/**
 * Imperative trigger returned by {@link createDialog}. Open the dialog and await
 * the result: resolves with the confirm value, or with `undefined` when dismissed.
 * It never rejects and is a plain function — usable in event handlers, services,
 * or anywhere outside React, not just inside a component.
 */
export interface ShowDialog<T, K> {
  (data?: T): Promise<K | undefined>;
  /** Dismiss the dialog programmatically (resolves the pending promise with `undefined`). */
  close: () => void;
}

export interface DialogInstance<T, K, S> {
  /** Mount this once anywhere in your tree to render the dialog. */
  Dialog: FC<{ state?: S }>;
  /** Open the dialog and await the result. */
  show: ShowDialog<T, K>;
  /** Dismiss the dialog (alias of {@link ShowDialog.close}). */
  close: () => void;
}

/**
 * Wraps a dialog component and returns its placement `Dialog` plus an imperative,
 * promise-returning `show`. Call once at module scope — the store is a singleton:
 *
 * ```tsx
 * const { Dialog, show } = createDialog(MyDialog);
 * // render <Dialog /> once, then `await show(data)` from anywhere.
 * ```
 *
 * `show(data)` resolves with the value passed to `onConfirm`, or with `undefined`
 * when the dialog is dismissed, so `await show()` is safe without try/catch.
 * Generics are inferred from the component's props; you can also be explicit:
 * `createDialog<Input, Output>(MyDialog)`.
 */
export function createDialog<T = void, K = void, S = void>(
  Component: FC<DialogComponentProps<T, K, S>>,
  options?: DialogOptions,
): DialogInstance<T, K, S> {
  const store = createDialogStore<T, K>(options);

  const Dialog: FC<{ state?: S }> = ({ state }) => {
    const { isOpen, data, shouldRender } = useSyncExternalStore(
      store.subscribe,
      store.getState,
      store.getState,
    );

    if (!shouldRender) {
      return null;
    }

    return (
      <Component
        isOpen={isOpen}
        data={data as T}
        onClose={store.close}
        onConfirm={store.confirm}
        state={state}
      />
    );
  };

  Dialog.displayName = `Dialog(${Component.displayName ?? Component.name ?? "Component"})`;

  const close = () => store.close();
  const show: ShowDialog<T, K> = Object.assign(
    (data?: T): Promise<K | undefined> => store.showDialog(data),
    { close },
  );

  return { Dialog, show, close };
}
