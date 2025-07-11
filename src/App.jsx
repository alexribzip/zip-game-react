import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const GRID_SIZE = 5; // 5x5 grille
const NUMBERS_COUNT = 9; // Nombre de cases numérotées

// Génère une liste de positions fixes pour les chiffres 1 à NUMBERS_COUNT
function generateNumberPositions(gridSize, count) {
  // Pour simplifier, on place les chiffres dans la première ligne puis colonne si besoin
  let positions = [];
  for (let i = 0; i < count; i++) {
    let row = Math.floor(i / gridSize);
    let col = i % gridSize;
    positions.push({ row, col, number: i + 1 });
  }
  return positions;
}

export default function App() {
  const [numberPositions, setNumberPositions] = useState([]);
  const [path, setPath] = useState([]); // Liste des cases {row, col} dans le chemin tracé
  const [isDragging, setIsDragging] = useState(false);
  const pathRef = useRef([]);

  useEffect(() => {
    setNumberPositions(generateNumberPositions(GRID_SIZE, NUMBERS_COUNT));
  }, []);

  // Vérifie si une case est dans numberPositions
  function getNumberAt(row, col) {
    const pos = numberPositions.find((p) => p.row === row && p.col === col);
    return pos ? pos.number : null;
  }

  // Vérifie si la case est dans le chemin
  function isInPath(row, col) {
    return path.some((p) => p.row === row && p.col === col);
  }

  // Quand la souris passe sur une case pendant un drag
  function handleMouseEnter(row, col) {
    if (!isDragging) return;

    // Si la case est déjà la dernière dans path, pas besoin de rien faire
    if (
      path.length > 0 &&
      path[path.length - 1].row === row &&
      path[path.length - 1].col === col
    ) {
      return;
    }

    const currentNumber = getNumberAt(row, col);

    if (path.length === 0) {
      // Doit commencer par la case 1 uniquement
      if (currentNumber === 1) {
        setPath([{ row, col }]);
        pathRef.current = [{ row, col }];
      }
      return;
    }

    // Récupérer dernier point du path
    const last = path[path.length - 1];
    const lastNumber = getNumberAt(last.row, last.col);

    // Si la case est déjà dans path mais pas la dernière, on revient en arrière (undo)
    const indexInPath = path.findIndex(
      (p) => p.row === row && p.col === col
    );
    if (indexInPath !== -1) {
      // Permet de revenir en arrière en supprimant les points après cette case
      const newPath = path.slice(0, indexInPath + 1);
      setPath(newPath);
      pathRef.current = newPath;
      return;
    }

    // Sinon on ajoute la case si elle est adjacente à la dernière case dans path
    const dr = Math.abs(row - last.row);
    const dc = Math.abs(col - last.col);

    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      // On ajoute la case seulement si le numéro est le suivant dans la séquence
      if (currentNumber === lastNumber + 1) {
        const newPath = [...path, { row, col }];
        setPath(newPath);
        pathRef.current = newPath;
      }
    }
  }

  function handleMouseDown(row, col) {
    const currentNumber = getNumberAt(row, col);
    if (currentNumber === 1) {
      setPath([{ row, col }]);
      pathRef.current = [{ row, col }];
      setIsDragging(true);
    }
  }

  function handleMouseUp() {
    setIsDragging(false);

    // Optionnel : vérifier si on a bien atteint le dernier numéro
    if (path.length === NUMBERS_COUNT) {
      alert("Bravo, tu as complété le chemin !");
    }
  }

  return (
    <div className="App">
      <h1>Jeu Zip amélioré</h1>
      <div
        className="grid"
        onMouseLeave={() => {
          if (isDragging) setIsDragging(false);
        }}
      >
        {[...Array(GRID_SIZE)].map((_, row) => (
          <div className="row" key={row}>
            {[...Array(GRID_SIZE)].map((_, col) => {
              const number = getNumberAt(row, col);
              const selected = isInPath(row, col);
              const isNext =
                selected &&
                path.length > 0 &&
                path[path.length - 1].row === row &&
                path[path.length - 1].col === col;

              return (
                <div
                  key={col}
                  className={`cell ${selected ? "selected" : ""} ${
                    number ? "numbered" : ""
                  }`}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                >
                  {number || ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p>
        Trace le chemin du 1 jusqu’à {NUMBERS_COUNT} en suivant les cases numérotées
        dans l’ordre. Tu peux revenir en arrière en repassant sur une case déjà
        tracée.
      </p>
    </div>
  );
}
