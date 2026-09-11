/**
 * 🎮 Game 102: 킬러 스도쿠
 * 합 조건(cage)이 있는 4×4 스도쿠 변형
 */
import { useState, useCallback } from "react";

const CAGE_COLORS = [
    "rgba(255,107,107,0.15)", "rgba(100,255,218,0.15)", "rgba(255,217,61,0.15)",
    "rgba(77,150,255,0.15)", "rgba(155,89,182,0.15)", "rgba(255,140,66,0.15)",
    "rgba(56,182,255,0.15)", "rgba(107,203,119,0.15)",
];

const PUZZLES = [
    {
        solution: [[1, 2, 3, 4], [3, 4, 1, 2], [2, 3, 4, 1], [4, 1, 2, 3]],
        cages: [
            { cells: [[0, 0], [0, 1]], sum: 3 },
            { cells: [[0, 2], [0, 3]], sum: 7 },
            { cells: [[1, 0], [2, 0]], sum: 5 },
            { cells: [[1, 1], [1, 2]], sum: 5 },
            { cells: [[1, 3], [2, 3]], sum: 3 },
            { cells: [[2, 1], [2, 2], [3, 2]], sum: 9 },
            { cells: [[3, 0], [3, 1]], sum: 5 },
            { cells: [[3, 3]], sum: 3 },
        ],
        given: [[1, 0, 0, 0], [0, 0, 0, 2], [0, 3, 0, 0], [0, 0, 2, 0]],
    },
    {
        solution: [[2, 1, 4, 3], [4, 3, 2, 1], [1, 4, 3, 2], [3, 2, 1, 4]],
        cages: [
            { cells: [[0, 0], [1, 0]], sum: 6 },
            { cells: [[0, 1], [0, 2]], sum: 5 },
            { cells: [[0, 3], [1, 3]], sum: 4 },
            { cells: [[1, 1], [1, 2]], sum: 5 },
            { cells: [[2, 0], [3, 0]], sum: 4 },
            { cells: [[2, 1], [2, 2]], sum: 7 },
            { cells: [[2, 3], [3, 3]], sum: 6 },
            { cells: [[3, 1], [3, 2]], sum: 3 },
        ],
        given: [[0, 1, 0, 0], [4, 0, 0, 0], [0, 0, 3, 0], [0, 0, 0, 4]],
    },
];

const KillerSudoku = ({ onComplete }) => {
    const [puzzleIdx] = useState(() => Math.floor(Math.random() * PUZZLES.length));
    const puzzle = PUZZLES[puzzleIdx];
    const [grid, setGrid] = useState(() => puzzle.given.map(r => [...r]));
    const [selected, setSelected] = useState(null);
    const [errors, setErrors] = useState(new Set());
    const [done, setDone] = useState(false);
    const [mistakeCount, setMistakeCount] = useState(0);

    const getCageIdx = (r, c) => puzzle.cages.findIndex(cage => cage.cells.some(([cr, cc]) => cr === r && cc === c));

    const checkComplete = useCallback((g) => {
        for (let r = 0; r < 4; r++)
            for (let c = 0; c < 4; c++)
                if (g[r][c] !== puzzle.solution[r][c]) return false;
        return true;
    }, [puzzle.solution]);

    const handleInput = useCallback((num) => {
        if (!selected || done) return;
        const [r, c] = selected;
        if (puzzle.given[r][c] !== 0) return;
        const newGrid = grid.map(row => [...row]);
        newGrid[r][c] = num;
        setGrid(newGrid);

        if (num !== 0 && num !== puzzle.solution[r][c]) {
            setErrors(prev => new Set([...prev, `${r},${c}`]));
            setMistakeCount(prev => prev + 1);
        } else {
            setErrors(prev => { const n = new Set(prev); n.delete(`${r},${c}`); return n; });
        }

        if (checkComplete(newGrid)) {
            setDone(true);
            const score = Math.max(30, 100 - mistakeCount * 10);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [selected, grid, puzzle, done, mistakeCount, checkComplete, onComplete]);

    const isCageTopLeft = (r, c, cageIdx) => {
        if (cageIdx < 0) return false;
        const cage = puzzle.cages[cageIdx];
        return cage.cells[0][0] === r && cage.cells[0][1] === c;
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                킬러 스도쿠 4×4 <span style={{ marginLeft: 10, color: "#FF6B6B" }}>실수: {mistakeCount}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 52px)", gap: "2px", padding: "4px", background: "#1a1a2e", borderRadius: "8px", border: "2px solid rgba(255,255,255,0.1)" }}>
                {Array.from({ length: 16 }, (_, idx) => {
                    const r = Math.floor(idx / 4), c = idx % 4;
                    const val = grid[r][c];
                    const isGiven = puzzle.given[r][c] !== 0;
                    const isSel = selected && selected[0] === r && selected[1] === c;
                    const isErr = errors.has(`${r},${c}`);
                    const cageIdx = getCageIdx(r, c);

                    return (
                        <div
                            key={idx}
                            onClick={() => !done && setSelected([r, c])}
                            style={{
                                width: 52, height: 52,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                borderRadius: "4px", cursor: "pointer", position: "relative",
                                fontSize: "20px", fontWeight: isGiven ? "bold" : "normal",
                                color: isErr ? "#FF6B6B" : isGiven ? "#FFD700" : "#fff",
                                background: isSel ? "rgba(100,255,218,0.2)" : cageIdx >= 0 ? CAGE_COLORS[cageIdx % CAGE_COLORS.length] : "rgba(255,255,255,0.04)",
                                border: isSel ? "2px solid #64ffda" : "1px solid rgba(255,255,255,0.08)",
                                transition: "all 0.15s",
                            }}
                        >
                            {isCageTopLeft(r, c, cageIdx) && (
                                <span style={{ position: "absolute", top: 2, left: 4, fontSize: "9px", color: "#8892b0" }}>
                                    {puzzle.cages[cageIdx].sum}
                                </span>
                            )}
                            {val !== 0 ? val : ""}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4].map(n => (
                    <button key={n} onClick={() => handleInput(n)} style={numBtnStyle}>{n}</button>
                ))}
                <button onClick={() => handleInput(0)} style={{ ...numBtnStyle, background: "rgba(255,107,107,0.2)" }}>✕</button>
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                cage 합계를 맞추며 1~4를 채우세요
            </div>
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🎉 완료!</div>}
        </div>
    );
};

const numBtnStyle = {
    width: 44, height: 44, fontSize: "18px", fontWeight: "bold",
    background: "rgba(255,255,255,0.1)", color: "white",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", cursor: "pointer",
};

export default KillerSudoku;
