import type {
  DialogListener,
  DialogOptions,
  DialogStore,
  DialogStoreState,
} from "./types";

/**
 * Creates the framework-agnostic dialog state machine.
 *
 * The whole open → confirm/close → resolve/reject → (optional) unmount lifecycle
 * lives here so every framework adapter shares identical semantics.
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

  // Drives the unmount lifecycle once the dialog has closed.
  const scheduleUnmount = () => {
    if (!forceUnmount) return;
    if (delayUnmount <= 0) {
      setState({ shouldRender: false });
    } else if (!unmountTimer) {
      unmountTimer = setTimeout(() => {
        setState({ shouldRender: false });
        unmountTimer = null;
      }, delayUnmount);
    }
  };

  // The promise has already been settled by the caller; reset shared state.
  const reset = () => {
    setState({
      isOpen: false,
      promise: {},
      // Keep data while the exit animation plays; otherwise clear it.
      ...(forceUnmount ? {} : { data: {} }),
    });
    scheduleUnmount();
  };

  const open = () => {
    clearUnmountTimer();
    setState({ isOpen: true, shouldRender: true });
  };

  const setData = (data?: T) =>
    setState({ data: (data ?? {}) as Partial<T> });

  const confirm = (value?: K) => {
    state.promise.resolve?.(value);
    reset();
  };

  const close = () => {
    state.promise.reject?.();
    reset();
  };

  const showDialog = (data?: T): Promise<K | undefined> =>
    new Promise<K | undefined>((resolve, reject) => {
      // Open in a single state update so listeners are notified once, not three times.
      clearUnmountTimer();
      setState({
        isOpen: true,
        shouldRender: true,
        data: (data ?? {}) as Partial<T>,
        promise: { resolve: (value) => resolve(value), reject },
      });
    });

  const destroy = () => {
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
