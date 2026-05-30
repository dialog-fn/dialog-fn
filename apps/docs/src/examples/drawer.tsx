import { createDialog, type DialogComponentProps } from "./dialog-fn";

type Input = { title: string };

function Drawer({ isOpen, data, onClose, onConfirm }: DialogComponentProps<Input, string>) {
  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#0006" }} />
      )}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 280,
          background: "#fff",
          boxShadow: "-10px 0 40px #0002",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .25s ease",
        }}
      >
        <div className="panel">
          <h3>{data?.title}</h3>
          <p className="muted">A drawer is just a dialog with different chrome.</p>
          <div className="row">
            <button onClick={onClose}>Close</button>
            <button className="primary" onClick={() => onConfirm?.("applied")}>
              Apply
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// No forceUnmount: the drawer stays mounted and slides in/out via `isOpen`.
const { Dialog, show } = createDialog(Drawer);

export default function App() {
  return (
    <main>
      <button className="primary" onClick={() => show({ title: "Filters" })}>
        Open drawer
      </button>
      <Dialog />
    </main>
  );
}
