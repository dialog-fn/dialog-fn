import { createDialog, type DialogComponentProps } from "./dialog-fn";

function Modal({ isOpen, onClose, onConfirm }: DialogComponentProps<void, boolean>) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#0006",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity .2s ease",
      }}
    >
      <div
        className="panel"
        style={{
          background: "#fff",
          borderRadius: 14,
          minWidth: 260,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(.92)",
          transition: "transform .2s ease, opacity .2s ease",
        }}
      >
        <h3>Animated modal</h3>
        <p className="muted">
          The exit transition plays before the node unmounts, thanks to <code>delayUnmount</code>.
        </p>
        <div className="row">
          <button onClick={onClose}>Close</button>
          <button className="primary" onClick={() => onConfirm?.(true)}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// forceUnmount removes the node when closed; delayUnmount keeps it 200ms longer so the
// fade/scale-out transition can finish first.
const { Dialog, show } = createDialog(Modal, { forceUnmount: true, delayUnmount: 200 });

export default function App() {
  return (
    <main>
      <button className="primary" onClick={() => show()}>
        Open animated modal
      </button>
      <Dialog />
    </main>
  );
}
