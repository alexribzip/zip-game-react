import { useState, useEffect } from "react";
import "./App.css";

const LEVEL_1_PATH = [
  [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 4], [1, 3], [1, 2], [1, 1], [1, 0],
  [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
  [3, 4], [3, 3], [3, 2], [3, 1], [3, 0],
  [4, 0], [4, 1], [4, 2], [4, 3], [4, 4],
];

const GRID_SIZE = 5;

export default function App() {
  const [path, setPath] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [grid, setGrid] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Create empty grid and place 1 and 25
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(null)
    );
    newGrid[0][0] = 1;
    newGrid[4][4] = 25;
    setGrid(newGrid);
  }, []);

  const isSameCell = (a, b) => a[0] === b[0] && a[1] === b[1];

  const handleCellEnter = (row, col) => {
    if (!isMouseDown) return;

    const current = [row, col];
    const alreadyUsed = path.some((p) => isSameCell(p, current));
    const start = isSameCell(current, [0, 0]);
    const end = isSameCell(current, [4, 4]);

    if (!alreadyUsed && !start && !end) {
      setPath([...path, current]);
    }
  };

  const handleMouseDown = (row, col) => {
    if (isSameCell([row, col], [0, 0])) {
      setIsMouseDown(true);
      setPath([[0, 0]]);
      setMessage("");
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    // Check if path is complete and matches solution
    const fullPath = [...path, [4, 4]];
    if (fullPath.length === LEVEL_1_PATH.length &&
      fullPath.every((pos, i) => isSameCell(pos, LEVEL_1_PATH[i]))) {
      setMessage("🎉 Bravo, niveau réussi !");
    } else {
      setMessage("❌ Mauvais chemin, réessaie !");
    }
  };

  return (
    <div className="app"
      onMouseUp={handleMouseUp}
    >
      <header>
        <h1>ZIP - Niveau 1</h1>
        <p>Trace un chemin de 1 à 25 en utilisant toutes les cases</p>
        <p className="status">{message}</p>
      </header>

      <div className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const pos = [rIdx, cIdx];
            const isStart = rIdx === 0 && cIdx === 0;
            const isEnd = rIdx === 4 && cIdx === 4;
            const inPath = path.some((p) => isSameCell(p, pos));
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`cell 
                  ${isStart ? "start" : ""}
                  ${isEnd ? "end" : ""}
                  ${inPath ? "selected" : ""}`}
                onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                onMouseEnter={() => handleCellEnter(rIdx, cIdx)}
              >
                {isStart ? "1" : isEnd ? "25" : ""}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
