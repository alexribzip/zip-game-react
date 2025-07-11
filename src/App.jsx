
import { useState, useEffect } from "react";
import "./App.css";

const generateGrid = (size) => {
  const total = size * size;
  const numbers = Array.from({ length: total }, (_, i) => i + 1);
  return shuffle(numbers).reduce(
    (rows, key, i) => (i % size === 0 ? [...rows, [key]] : [...rows.slice(0, -1), [...rows[rows.length - 1], key]]),
    []
  );
};

const shuffle = (arr) => {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function App() {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(5);
  const [grid, setGrid] = useState(generateGrid(5));
  const [path, setPath] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const size = getGridSizeForLevel(level);
    setGridSize(size);
    setGrid(generateGrid(size));
    setPath([]);
  }, [level]);

  const getGridSizeForLevel = (lvl) => {
    if (lvl < 4) return 5;
    if (lvl < 7) return 6;
    if (lvl < 10) return 7;
    return 8;
  };

  const handleClick = (value) => {
    const expected = path.length + 1;
    if (value === expected) {
      setPath([...path, value]);
      if (value === gridSize * gridSize) {
        setScore(score + 10 * level);
        setLevel(level + 1);
      }
    }
  };

  return (
    <div className="app">
      <header>
        <h1>ZIP GAME</h1>
        <div className="info">
          <p>Niveau : {level}</p>
          <p>Score : {score}</p>
        </div>
      </header>

      <div className="grid" style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }}>
        {grid.flat().map((value) => (
          <div
            key={value}
            className={`cell ${path.includes(value) ? "selected" : ""}`}
            onClick={() => handleClick(value)}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}
