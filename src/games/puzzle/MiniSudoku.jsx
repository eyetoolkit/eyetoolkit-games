/**
 * 🎮 Game 4: 미니 스도쿠 (4×4)
 * 각 행, 열, 2×2 블록에 1~4가 한 번씩!
 */
import { useCallback, useState } from "react";

const SIZE = 4;
const BLOCK = 2;

const generatePuzzle = () => {
    // Pre-made puzzles (4x4 sudoku, 0 = empty)
    const puzzles = [
        [[1, 0, 0, 4], [0, 4, 1, 0], [0, 1, 4, 0], [4, 0, 0, 1]],
        [[0, 2, 3, 0], [3, 0, 0, 2], [2, 0, 0, 3], [0, 3, 2, 0]],
        [[0, 3, 0, 1], [1, 0, 3, 0], [0, 1, 0, 3], [3, 0, 1, 0]],
        [[4, 0, 0, 2], [0, 2, 4, 0], [0, 4, 2, 0], [2, 0, 0, 4]],
        [[0, 1, 4, 0], [4, 0, 0, 1], [0, 4, 1, 0], [1, 0, 0, 4]],
    ];
    const solutions = [
        [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]],
        [[4, 2, 3, 1], [3, 1, 4, 2], [2, 4, 1, 3], [1, 3, 2, 4]],
        [[2, 3, 4, 1], [1, 4, 3, 2], [4, 1, 2, 3], [3, 2, 1, 4]],
        [[4, 1, 3, 2], [3, 2, 4, 1], [1, 4, 2, 3], [2, 3, 1, 4]],
        [[3, 1, 4, 2], [4, 2, 3, 1], [2, 4, 1, 3], [1, 3, 2, 4]],
    ];
    const idx = Math.floor(Math.random() * puzzles.length);
    return { puzzle: puzzles[idx], solution: solutions[idx] };
};

const MiniSudoku = ({ onComplete }) => {
    const [{ puzzle, solution }] = useState(generatePuzzle);
    const [grid, setGrid] = useState(puzzle.map((r) => [...r]));
    const [errors, setErrors] = useState(new Set());
    const [selected, setSelected] = useState(null);

    const isFixed = (r, c) => puzzle[r][c] !== 0;

    const validate = useCallback(
        (g) => {
            const errs = new Set();
            for (let r = 0; r < SIZE; r++)
                for (let c = 0; c < SIZE; c++)
                    if (g[r][c] !== 0 && g[r][c] !== solution[r][c])
                        errs.add(`${r}-${c}`);
            return errs;
        },
        [solution]
    );

    const handleInput = useCallback(
        (num) => {
            if (!selected) return;
            const [r, c] = selected;
            if (isFixed(r, c)) return;
            const newGrid = grid.map((row) => [...row]);
            newGrid[r][c] = num;
            setGrid(newGrid);
            const errs = validate(newGrid);
            setErrors(errs);

            // Check completion
            if (newGrid.flat().every((v) => v !== 0) && errs.size === 0) {
                const score = 100;
                setTimeout(() => onComplete(score), 400);
            }
        },
        [selected, grid, validate, onComplete, puzzle]
    );

    const cellSize = 60;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            {/* Progress */}
            <div style={{ fontSize: "13px" }}>
                진행: <span style={{ color: "#64ffda" }}>{grid.flat().filter(v => v !== 0).length}</span>/{SIZE * SIZE}
                {errors.size > 0 && <span style={{ color: "#FF6B6B", marginLeft: 8 }}>❌ {errors.size}</span>}
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${SIZE}, ${cellSize}px)`,
                    gap: "2px",
                    padding: "4px",
                    background: "#1a1a2e",
                    borderRadius: "8px",
                    border: "2px solid rgba(255,255,255,0.06)",
                }}
            >
                {grid.flat().map((val, idx) => {
                    const r = Math.floor(idx / SIZE), c = idx % SIZE;
                    const fixed = isFixed(r, c);
                    const isError = errors.has(`${r}-${c}`);
                    const isSelected = selected && selected[0] === r && selected[1] === c;
                    const blockBorderR = r % BLOCK === BLOCK - 1 && r < SIZE - 1 ? "2px solid rgba(12,191,255,0.3)" : "";
                    const blockBorderB = c % BLOCK === BLOCK - 1 && c < SIZE - 1 ? "2px solid rgba(12,191,255,0.3)" : "";

                    return (
                        <div
                            key={idx}
                            onClick={() => !fixed && setSelected([r, c])}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: isSelected
                                    ? "rgba(12,191,255,0.3)"
                                    : isError
                                        ? "rgba(255,50,50,0.2)"
                                        : fixed
                                            ? "rgba(255,255,255,0.1)"
                                            : "rgba(255,255,255,0.04)",
                                borderRadius: "4px",
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: fixed ? "#64ffda" : isError ? "#FF6B6B" : "white",
                                cursor: fixed ? "default" : "pointer",
                                borderBottom: blockBorderR,
                                borderRight: blockBorderB,
                                transition: "background 0.15s",
                            }}
                        >
                            {val > 0 ? val : ""}
                        </div>
                    );
                })}
            </div>

            {/* Number pad */}
            <div style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4].map((n) => (
                    <button
                        key={n}
                        onClick={() => handleInput(n)}
                        style={{
                            width: 48,
                            height: 48,
                            fontSize: "20px",
                            fontWeight: "bold",
                            background: "rgba(255,255,255,0.1)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "background 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.background = "rgba(12,191,255,0.3)")}
                        onMouseOut={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
                    >
                        {n}
                    </button>
                ))}
                <button
                    onClick={() => handleInput(0)}
                    style={{
                        width: 48,
                        height: 48,
                        fontSize: "14px",
                        background: "rgba(255,100,100,0.15)",
                        color: "#FF6B6B",
                        border: "1px solid rgba(255,100,100,0.3)",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    지우기
                </button>
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                칸을 선택 후 숫자를 입력하세요
            </div>
        </div>
    );
};

export default MiniSudoku;
