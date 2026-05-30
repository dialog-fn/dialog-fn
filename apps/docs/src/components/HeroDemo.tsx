import { useState } from "react";
import { createDialog, type DialogComponentProps } from "@dialog-fn/react";

function ConfirmDialog({ isOpen, data, onClose, onConfirm }: DialogComponentProps<{ q: string }, boolean>) {
  return (
    <dialog
      open={isOpen}
      style={{
        border: "none",
        borderRadius: 14,
        padding: 0,
        maxWidth: 320,
        boxShadow: "0 20px 60px #0004",
      }}
    >
      <div style={{ padding: 20 }}>
        <h3 style={{ margin: "0 0 8px" }}>Confirm</h3>
        <p style={{ margin: "0 0 16px", color: "#71717a" }}>{data?.q}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="hero-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="hero-btn hero-btn--primary" onClick={() => onConfirm?.(true)}>
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}

const { Dialog, show } = createDialog(ConfirmDialog);

export default function HeroDemo() {
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    const ok = await show({ q: "Ship the new dialog API?" });
    setResult(ok ? "Resolved: true ✅" : "Resolved: undefined (dismissed)");
  }

  return (
    <div className="hero-demo">
      <button className="hero-btn hero-btn--primary" onClick={run}>
        ▶ Run a live dialog
      </button>
      {result && <code className="hero-demo__out">{result}</code>}
      <Dialog />
    </div>
  );
}
