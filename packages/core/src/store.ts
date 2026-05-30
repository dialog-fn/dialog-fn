import type {
  DialogListener,
  DialogOptions,
  DialogStore,
  DialogStoreState,
} from "./types";

/**
 * Creates the framework-agnostic dialog state machine.
 *
 * The whole open → confirm/dismiss → resolve → (optional) unmount lifecycle lives
 * here so every framework adapter shares identical semantics. The promise returned
 * by `showDialog` resolves with the confirm value, or with `undefined` when the
 * dialog is dismissed (closed, superseded by a new dialog, or destroyed) — it never
 * rejects, so `await showDialog()` is safe without try/catch.
 */
export function createDialogStore<T = void, K = void>(
  options: DialogOptions = {},
): DialogStore<T, K> {
  const { forceUnmount = false, delayUnmount = 0 } = options;

  const listeners = new Set<DialogListener<T, K>>();
  let unmountTimer: ReturnType<typeof setTimeout> | null = null;

  let state: DialogStoreState<T, K> = {
    isOpen: false,
    data: {},
    // When forceUnmount is disabled the component stays mounted at all times.
    shouldRender: !forceUnmount,
    promise: {},
  };

  const setState = (partial: Partial<DialogStoreState<T, K>>) => {
    const previousState = state;
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state, previousState));
  };

  const clearUnmountTimer = () => {
    if (unmountTimer) {
      clearTimeout(unmountTimer);
      unmountTimer = null;
    }
  };

  // Hides the component once the dialog has closed, clearing data so nothing stale
  // (or sensitive) lingers in state after the dialog is gone.
  const scheduleUnmount = () => {
    if (!forceUnmount) return;
    const hidden: Partial<DialogStoreState<T, K>> = { shouldRender: false, data: {} };
    if (delayUnmount <= 0) {
      setState(hidden);
    } else if (!unmountTimer) {
      unmountTimer = setTimeout(() => {
        setState(hidden);
        unmountTimer = null;
      }, delayUnmount);
    }
  };

  // The promise has already been settled by the caller; reset shared state.
  const reset = () => {
    setState({
      isOpen: false,
      promise: {},
      // Keep data while the exit animation plays; scheduleUnmount clears it on hide.
      ...(forceUnmount ? {} : { data: {} }),
    });
    scheduleUnmount();
  };

  // Settles the in-flight promise (confirm value, or undefined when dismissed).
  const settle = (value?: K) => {
    state.promise.resolve?.(value);
  };

  const open = () => {
    clearUnmountTimer();
    setState({ isOpen: true, shouldRender: true });
  };

  const setData = (data?: T) =>
    setState({ data: (data ?? {}) as Partial<T> });

  const confirm = (value?: K) => {
    settle(value);
    reset();
  };

  const close = () => {
    settle(undefined);
    reset();
  };

  const showDialog = (data?: T): Promise<K | undefined> =>
    new Promise<K | undefined>((resolve) => {
      // Supersede any in-flight dialog: resolve it as dismissed so its caller's
      // await settles instead of hanging forever.
      settle(undefined);
      // Open in a single state update so listeners are notified once, not three times.
      clearUnmountTimer();
      setState({
        isOpen: true,
        shouldRender: true,
        data: (data ?? {}) as Partial<T>,
        promise: { resolve },
      });
    });

  const destroy = () => {
    // Resolve any pending dialog as dismissed so a caller awaiting it is not left hanging.
    settle(undefined);
    clearUnmountTimer();
    listeners.clear();
  };

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    open,
    close,
    confirm,
    setData,
    showDialog,
    destroy,
  };
}
