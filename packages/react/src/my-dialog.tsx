import type { DialogComponentProps } from "../lib/main.ts";

export const MyDialog = ({
  isOpen,
  data,
  onClose,
  onConfirm,
}: DialogComponentProps<{foo:string}, {bar:string}>) => {
  const handleConfirm = () =>{
    onConfirm?.({bar:'demo'});
  }
  return (
    <dialog open={isOpen}>
      <div>
        <h1>My Dialog</h1>
        <p>Is open: {isOpen?.toString()}</p>
        <p>Data: {JSON.stringify(data)}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </dialog>
  );
};
