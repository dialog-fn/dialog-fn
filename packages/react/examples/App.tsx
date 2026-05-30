import { useState } from "react";
import { createDialog } from "../lib/main";
import { MyDialog } from "./my-dialog";
import "./App.css";

const { Dialog, show } = createDialog<{ foo: string }, { bar: string }>(MyDialog);

function App() {
  const [result, setResult] = useState<string>("");

  const handleDialog = async () => {
    const response = await show({ foo: "test" });
    setResult(response ? `confirmed: ${response.bar}` : "dismissed");
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
