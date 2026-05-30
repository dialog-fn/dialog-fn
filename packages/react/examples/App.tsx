import { useState } from "react";
import { createDialog } from "../lib/main";
import { MyDialog } from "./my-dialog";
import "./App.css";

const { register, useDialog } = createDialog<{ foo: string }, { bar: string }>();

const Dialog = register(MyDialog);

function App() {
  const showDialog = useDialog();
  const [result, setResult] = useState<string>("");

  const handleDialog = async () => {
    try {
      const response = await showDialog({ foo: "test" });
      setResult(`confirmed: ${response?.bar ?? ""}`);
    } catch {
      setResult("dismissed");
    }
  };

  return (
    <>
      <Dialog />
      <h1>@dialog-fn/react demo</h1>
      <div className="card">
        <button onClick={handleDialog}>open dialog</button>
        <p>Last result: {result || "—"}</p>
      </div>
    </>
  );
}

export default App;
