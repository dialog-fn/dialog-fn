export { createDialog } from "../src/library";

export interface DialogProps<T = any, K = any, S=any> {
  isOpen?: boolean;
  data?: T;
  onClose?: () => void;
  onConfirm?: (response?: K) => void;
  status?: S;
}
