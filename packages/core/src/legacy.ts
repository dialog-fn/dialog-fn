/**
 * Backwards-compatibility surface for `@dialog-fn/core` v4 and earlier.
 *
 * Everything here is superseded by {@link createDialogStore} and the types in
 * `./types`. It is retained so existing consumers keep working and will be
 * removed in the next major version.
 */

/** @deprecated Use {@link DialogStoreState} from `./types`. */
export type DialogMutableState<T, K> = {
  isOpen: boolean;
  data: Partial<T>;
  promise: {
    resolve?: (value?: K) => void;
    reject?: (reason?: string) => void;
  };
  shouldRender: boolean;
  delayUnmount: number;
  forceUnmount: boolean;
};

type DialogHandlers<T, K> = {
  onClose: () => void;
  setPromise: (r: (value?: K) => void, re: (reason?: string) => void) => void;
  setData: (data?: T) => void;
  open: () => void;
  onConfirm: (v?: K) => void;
};

type RenderController = {
  resetRender: () => void;
  hideRender: () => void;
};

/** @deprecated Use {@link DialogStore} from `./types`. */
export type DialogState<T, K> = DialogMutableState<T, K> &
  DialogHandlers<T, K> &
  RenderController;

type Get<T> = () => T;
type Set<T, K> = (value: Partial<DialogMutableState<T, K>>) => void;

/** @deprecated Use {@link createDialogStore} from `./store`. */
export type StateCreator<T, K> = (set: Set<T, K>, get: Get<T>) => T;

/** @deprecated Use {@link createDialogStore} from `./store`. */
export const createStore = (createState: any): any => {
  let state: any;

  const listeners = new Set<any>();

  const setState = (partial: any, replace?: boolean) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;
      state =
        (replace ?? (typeof nextState !== "object" || nextState === null))
          ? nextState
          : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;

  const subscribe = (listener: any) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState, api);
  return api;
};
