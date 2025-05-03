import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import interact from "interactjs";

function App() {
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });

  useEffect(() => {
    interact(".drag")
      .draggable({
        listeners: {
          move(event) {
            // console.log(event.pageX, event.pageY);
            console.log({ event });
            setPos((p) => ({
              ...p,
              x: p.x + event.dx,
              y: p.y + event.dy,
            }));
          },
        },
      })
      .gesturable({
        listeners: {
          move(event) {
            console.log("gesturable", event);
            setPos((p) => ({
              ...p,
              scale: p.scale * (1 + event.ds),
              rotation: p.rotation + event.da,
            }));
          },
        },
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p
          className="drag"
          style={{
            position: "absolute",
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`,
            touchAction: "none", // Important for gestures
            userSelect: "none",
          }}
        >
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
