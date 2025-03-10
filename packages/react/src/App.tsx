import { useState } from "react";
import { createDialog } from "./library";
import { MyDialog } from "./my-dialog";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const { register, useDialog } = createDialog<{foo:string},{bar:string}>();

const Dialog = register(MyDialog);

function App() {
  const myDialog = useDialog();

  const handleDialog = async () => {
    const result = await myDialog({foo:'test'});

    console.log(result.bar);
  };

  const [count, setCount] = useState(0);

  return (
    <>
      <Dialog />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
            handleDialog();
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
