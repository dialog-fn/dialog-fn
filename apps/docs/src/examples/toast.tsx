import { createDialog, type DialogComponentProps } from "./dialog-fn";

type Toast = { text: string };

function ToastView({ isOpen, data }: DialogComponentProps<Toast>) {
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        background: "#1c1c22",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 12,
        boxShadow: "0 10px 30px #0004",
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(8px)",
        transition: "opacity .2s ease, transform .2s ease",
      }}
    >
      {data?.text}
    </div>
  );
}

const { Dialog, show } = createDialog(ToastView, { forceUnmount: true, delayUnmount: 250 });

// A plain function — no hook, no provider. Call it from events, services, anywhere.
function toast(text: string, ms = 2000) {
  show({ text });
  setTimeout(() => show.close(), ms);
}

export default function App() {
  return (
    <main>
      <button className="primary" onClick={() => toast("Saved! ✅")}>
        Show toast
      </button>
      <p className="muted">
        <code>toast()</code> is just a function calling <code>show()</code> — the same
        primitive as a modal, no provider required.
      </p>
      <Dialog />
    </main>
  );
}
