
/**
 * 
 * @param {any} createState 
 * @returns void
 */
export const createStore = (createState) => {
  /** @type {any} */
  let state;

  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;
      state =
        replace ?? (typeof nextState !== "object" || nextState === null)
          ? nextState
          : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    // Unsubscribe
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState, api);
  return api;
};


