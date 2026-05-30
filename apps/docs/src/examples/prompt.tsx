import { useState } from "react";
import { createDialog, type DialogComponentProps } from "./dialog-fn";

type Input = { title: string; initial?: string };
type Output = { name: string };

function PromptDialog({ isOpen, data, onClose, onConfirm }: DialogComponentProps<Input, Output>) {
  return (
    <dialog open={isOpen}>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          onConfirm?.({ name: String(form.get("name") ?? "") });
        }}
      >
        <h3>{data?.title}</h3>
        <input name="name" defaultValue={data?.initial} placeholder="Your name" autoFocus />
        <div className="row">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary">
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}

const { Dialog, show } = createDialog(PromptDialog);

export default function App() {
  const [name, setName] = useState("");

  async function edit() {
    // Data flows in (title/initial) and back out (the typed result).
    const result = await show({ title: "Edit your name", initial: name });
    if (result) setName(result.name);
  }

  return (
    <main>
      <p>
        Name: <strong>{name || "—"}</strong>
      </p>
      <button className="primary" onClick={edit}>
        Edit name
      </button>
      <Dialog />
    </main>
  );
}
