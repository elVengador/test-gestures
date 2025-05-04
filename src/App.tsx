import { PointerEvent, useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import interact from "interactjs";
import getStroke from "perfect-freehand";

function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<number[][][]>([]);
  const [points, setPoints] = useState<number[][]>([]);
  const [count, setCount] = useState(0);
  const [pos1, setPos1] = useState({ x: 100, y: 100, scale: 1, rotation: 0 });
  const [pos2, setPos2] = useState({ x: 250, y: 300, scale: 1, rotation: 0 });

  function getSVGCoords(e: PointerEvent, svg: SVGSVGElement) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return [svgP.x, svgP.y];
  }

  function handlePointerDown(e: PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return;

    console.log("handlePointerDown");
    const [x, y] = getSVGCoords(e, svgRef.current);

    svgRef.current.setPointerCapture(e.pointerId);
    setPoints([[x, y, e.pressure as number]]);
  }

  function handlePointerMove(e: PointerEvent<SVGSVGElement>) {
    if (!svgRef.current || points.length === 0) return;

    console.log("handlePointerMove");
    if (e.buttons !== 1) return;
    console.log("handlePointerMove", 1);
    const [x, y] = getSVGCoords(e, svgRef.current);
    setPoints([...points, [x, y, e.pressure as number]]);
  }

  const handlePointerUp = () => {
    if (points.length > 0) {
      setStrokes((prev) => [...prev, points]);
      setPoints([]);
    }
  };

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

  const getPathData = (pts: number[][]): string => {
    const stroke = getStroke(pts, {
      size: 4,
      thinning: 0.7,
      streamline: 0.5,
      smoothing: 0.5,
      easing: (t) => t,
    });

    if (stroke.length === 0) return "";

    return stroke
      .map(
        ([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
      )
      .join(" ");
  };

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
      </div>
      <svg
        ref={svgRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: "600px",
          height: "800px",
          touchAction: "none",
          border: "dashed 2px white",
          position: "relative",
        }}
        viewBox="0 0 800 600"
      >
        {strokes.map((pts, i) => (
          <path
            key={i}
            d={getPathData(pts)}
            stroke="black"
            fill="none"
            strokeWidth={2}
          />
        ))}
        {points.length > 0 && (
          <path
            d={getPathData(points)}
            stroke="red"
            fill="none"
            strokeWidth={2}
          />
        )}
        {/* {points && <path d={pathData} />} */}
      </svg>
    </>
  );
}

export default App;
