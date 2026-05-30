export interface DialogOptions {
  /** Unmount the dialog component when closed instead of only toggling `isOpen`. */
  forceUnmount?: boolean;
  /** Delay (ms) before unmounting when `forceUnmount` is set — useful for exit animations. */
  delayUnmount?: number;
}

/**
 * Props injected by the framework adapters into a registered dialog component.
 * This is the single public contract shared by every `@dialog-fn/*` package.
 */
export interface DialogComponentProps<T = unknown, K = unknown, S = unknown> {
  isOpen?: boolean;
  data?: T;
  onClose?: () => void;
  onConfirm?: (response?: K) => void;
  state?: S;
}

export interface DialogPromise<K> {
  resolve?: (value?: K) => void;
  reject?: (reason?: unknown) => void;
}

export interface DialogStoreState<T, K> {
  isOpen: boolean;
  data: Partial<T>;
  /** Whether the component should be mounted. Only toggled when `forceUnmount` is set. */
  shouldRender: boolean;
  promise: DialogPromise<K>;
}

export type DialogListener<T, K> = (
  state: DialogStoreState<T, K>,
  previousState: DialogStoreState<T, K>,
) => void;

/**
 * Framework-agnostic dialog store. React and Svelte adapters subscribe to this
 * and render a thin view over it, so the open/confirm/close lifecycle lives in
 * exactly one place and behaves identically everywhere.
 */
export interface DialogStore<T, K> {
  getState: () => DialogStoreState<T, K>;
  subscribe: (listener: DialogListener<T, K>) => () => void;
  /** Open the dialog without arming the promise (rarely needed directly). */
  open: () => void;
  /** User cancelled — rejects the pending promise and resets state. */
  close: () => void;
  /** User confirmed — resolves the pending promise with `value` and resets state. */
  confirm: (value?: K) => void;
  setData: (data?: T) => void;
  /** Open the dialog and await the user's confirm (resolve) / close (reject). */
  showDialog: (data?: T) => Promise<K | undefined>;
  /** Clear timers and listeners. Call when the host component unmounts. */
  destroy: () => void;
}
