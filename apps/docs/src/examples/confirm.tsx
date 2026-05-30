import { useState } from "react";
import { createDialog, type DialogComponentProps } from "./dialog-fn";

type Input = { message: string };

function ConfirmDialog({ isOpen, data, onClose, onConfirm }: DialogComponentProps<Input, boolean>) {
  return (
    <dialog open={isOpen}>
      <div className="panel">
        <h3>Are you sure?</h3>
        <p className="muted">{data?.message}</p>
        <div className="row">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={() => onConfirm?.(true)}>
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}

// Pass the component in, get back a Dialog to render + a `show` you can call anywhere.
const { Dialog, show } = createDialog(ConfirmDialog);

export default function App() {
  const [status, setStatus] = useState("—");

  async function remove() {
    // Resolves `true` on confirm, or `undefined` when dismissed. Never rejects.
    const confirmed = await show({ message: "This deletes the item permanently." });
    setStatus(confirmed ? "✅ confirmed" : "✋ dismissed");
  }

  return (
    <main>
      <button className="primary" onClick={remove}>
        Delete item
      </button>
      <p className="muted">Result: {status}</p>
      <Dialog />
    </main>
  );
}
