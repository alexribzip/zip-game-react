import { useState, useEffect, useRef } from "react";
import "./App.css";

const generatePuzzle = (size) => {
  // Exemple simple : chemin de 1 à 5 en ligne droite (à remplacer plus tard par une vraie génération)
  const grid = Array(size).fill(null).map(() => Array(size).fill(null));
  for (let i = 0; i < 5; i++) {
    grid[0][i] = i + 1; // Place 1 à 5 sur la première ligne
  }
  return grid;
};

export default function App() {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(5);
  const [grid, setGrid] = useState(generatePuzzle(5));
  const [path, setPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const gridRef = useRef(null);

  useEffect(() => {
    const size = getGridSizeForLevel(level);
    setGridSize(size);
    setGrid(generatePuzzle(size));
    setPath([]);
  }, [level]);

  const getGridSizeForLevel = (lvl) => {
    if (lvl < 4) return 5;
    if (lvl < 7) return 6;
    if (lvl < 10) return 7;
    return 8;
  };

  const handleMouseDown = (row, col) => {
    if (grid[row][col]) return; // ignore chiffres fixes
    setIsDrawing(true);
    setPath([{ row, col }]);
  };

  const handleMouseEnter = (row, col) => {
    if (!isDrawing || grid[row][col]) return;
    const last = path[path.length - 1];
    if (last && Math.abs(last.row - row) + Math.abs(last.col - col) === 1) {
      setPath([...path, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // TODO: valider le chemin ici
  };

  const isInPath = (r, c) => path.some(p => p.row === r && p.col === c);

  return (
    <div className="app" onMouseUp={handleMouseUp}>
      <header>
        <h1>ZIP GAME</h1>
        <div className="info">
          <p>Niveau : {level}</p>
        </div>
      </header>

      <div
        className="grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((val, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`cell ${isInPath(rIdx, cIdx) ? "selected" : val ? "fixed" : ""}`}
              onMouseDown={() => handleMouseDown(rIdx, cIdx)}
              onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
            >
              {val || path.findIndex(p => p.row === rIdx && p.col === cIdx) + 1 || ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
