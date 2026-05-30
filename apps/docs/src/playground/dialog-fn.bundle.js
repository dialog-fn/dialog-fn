// ../../packages/react/src/library.tsx
import { useSyncExternalStore } from "react";

// ../../packages/core/dist/store.js
function createDialogStore(options = {}) {
  const { forceUnmount = false, delayUnmount = 0 } = options;
  const listeners = /* @__PURE__ */ new Set();
  let unmountTimer = null;
  let state = {
    isOpen: false,
    data: {},
    // When forceUnmount is disabled the component stays mounted at all times.
    shouldRender: !forceUnmount,
    promise: {}
  };
  const setState = (partial) => {
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
  const scheduleUnmount = () => {
    if (!forceUnmount)
      return;
    const hidden = { shouldRender: false, data: {} };
    if (delayUnmount <= 0) {
      setState(hidden);
    } else if (!unmountTimer) {
      unmountTimer = setTimeout(() => {
        setState(hidden);
        unmountTimer = null;
      }, delayUnmount);
    }
  };
  const reset = () => {
    setState({
      isOpen: false,
      promise: {},
      // Keep data while the exit animation plays; scheduleUnmount clears it on hide.
      ...forceUnmount ? {} : { data: {} }
    });
    scheduleUnmount();
  };
  const settle = (value) => {
    state.promise.resolve?.(value);
  };
  const open = () => {
    clearUnmountTimer();
    setState({ isOpen: true, shouldRender: true });
  };
  const setData = (data) => setState({ data: data ?? {} });
  const confirm = (value) => {
    settle(value);
    reset();
  };
  const close = () => {
    settle(void 0);
    reset();
  };
  const showDialog = (data) => new Promise((resolve) => {
    settle(void 0);
    clearUnmountTimer();
    setState({
      isOpen: true,
      shouldRender: true,
      data: data ?? {},
      promise: { resolve }
    });
  });
  const destroy = () => {
    settle(void 0);
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
    destroy
  };
}

// ../../packages/react/src/library.tsx
import { jsx } from "react/jsx-runtime";
function createDialog(Component, options) {
  const store = createDialogStore(options);
  const Dialog = ({ state }) => {
    const { isOpen, data, shouldRender } = useSyncExternalStore(
      store.subscribe,
      store.getState,
      store.getState
    );
    if (!shouldRender) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      Component,
      {
        isOpen,
        data,
        onClose: store.close,
        onConfirm: store.confirm,
        state
      }
    );
  };
  Dialog.displayName = `Dialog(${Component.displayName ?? Component.name ?? "Component"})`;
  const close = () => store.close();
  const show = Object.assign(
    (data) => store.showDialog(data),
    { close }
  );
  return { Dialog, show, close };
}
export {
  createDialog
};
