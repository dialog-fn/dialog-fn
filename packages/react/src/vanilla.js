const createStoreImpl = (createState) => {
  /**
   * @typedef {object} State
   * @property {string} id - an ID.
   * @property {string} name - your name.
   * @property {number} age - your age.
   */

  /** @type {State} */
  let state;

  /** @type {Set<(state: any, prevState: any) => void>} */
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

export const createStore = (createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl;
