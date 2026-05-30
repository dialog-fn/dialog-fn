export type {
  DialogComponentProps,
  DialogListener,
  DialogOptions,
  DialogPromise,
  DialogStore,
  DialogStoreState,
} from "./types";
export { createDialogStore } from "./store";

// Deprecated v4 surface — kept for backwards compatibility.
export {
  createStore,
  type DialogMutableState,
  type DialogState,
  type StateCreator,
} from "./legacy";
