import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import interact from "interactjs";

function App() {
  const [count, setCount] = useState(0);
  const [pos1, setPos1] = useState({ x: 100, y: 100, scale: 1, rotation: 0 });
  const [pos2, setPos2] = useState({ x: 250, y: 300, scale: 1, rotation: 0 });

  useEffect(() => {
    interact(".drag1")
      .draggable({
        listeners: {
          move(event) {
            setPos1((p) => ({
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
            setPos1((p) => ({
              ...p,
              scale: p.scale * (1 + event.ds),
              rotation: p.rotation + event.da,
            }));
          },
        },
      });

    interact(".drag2")
      .draggable({
        listeners: {
          move(event) {
            setPos2((p) => ({
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
            setPos2((p) => ({
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
        <img
          className="drag1 logo"
          style={{
            position: "absolute",
            left: `${pos1.x}px`,
            top: `${pos1.y}px`,
            transform: `scale(${pos1.scale}) rotate(${pos1.rotation}deg)`,
            touchAction: "none", // Important for gestures
            userSelect: "none",
          }}
          src={viteLogo}
          alt="Vite logo"
        />
        <img
          className="drag2 logo react"
          style={{
            position: "absolute",
            left: `${pos2.x}px`,
            top: `${pos2.y}px`,
            transform: `scale(${pos2.scale}) rotate(${pos2.rotation}deg)`,
            touchAction: "none", // Important for gestures
            userSelect: "none",
          }}
          src={reactLogo}
          alt="React logo"
        />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
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
