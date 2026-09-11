/**
 * 🎮 Game 5: Nonogram (5×5)
 * Use the number hints to reveal the picture!
 */
import { useCallback, useMemo, useState } from "react";

const SIZE = 5;

const PATTERNS = [
    // Heart
    [[0, 1, 0, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]],
    // Cross
    [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
    // Diamond
    [[0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0]],
    // Arrow
    [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 0, 1, 0, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
    // T
    [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
];

const calcHints = (pattern) => {
    const rowHints = pattern.map((row) => {
        const groups = [];
        let count = 0;
        for (const v of row) {
            if (v) count++;
            else if (count > 0) { groups.push(count); count = 0; }
        }
        if (count > 0) groups.push(count);
        return groups.length ? groups : [0];
    });

    const colHints = Array.from({ length: SIZE }, (_, c) => {
        const groups = [];
        let count = 0;
        for (let r = 0; r < SIZE; r++) {
            if (pattern[r][c]) count++;
            else if (count > 0) { groups.push(count); count = 0; }
        }
        if (count > 0) groups.push(count);
        return groups.length ? groups : [0];
    });

    return { rowHints, colHints };
};

const Nonogram = ({ onComplete }) => {
    const [patternIdx] = useState(() => Math.floor(Math.random() * PATTERNS.length));
    const pattern = PATTERNS[patternIdx];
    const { rowHints, colHints } = useMemo(() => calcHints(pattern), [pattern]);
    const [grid, setGrid] = useState(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
    const [mistakes, setMistakes] = useState(0);

    const handleClick = useCallback(
        (r, c) => {
            const newGrid = grid.map((row) => [...row]);
            if (newGrid[r][c] === 1) return; // Already filled
            newGrid[r][c] = 1;

            if (!pattern[r][c]) {
                setMistakes(mistakes + 1);
                newGrid[r][c] = -1; // Mark wrong
                setGrid(newGrid);
                if (mistakes + 1 >= 3) {
                    const score = Math.max(20, 50 - mistakes * 10);
                    setTimeout(() => onComplete(score), 400);
                }
                return;
            }

            setGrid(newGrid);

            // Check win
            let allFilled = true;
            for (let rr = 0; rr < SIZE; rr++)
                for (let cc = 0; cc < SIZE; cc++)
                    if (pattern[rr][cc] === 1 && newGrid[rr][cc] !== 1) allFilled = false;

            if (allFilled) {
                const score = Math.max(50, 100 - mistakes * 15);
                setTimeout(() => onComplete(score), 400);
            }
        },
        [grid, pattern, mistakes, onComplete]
    );

    const cellSize = 44;
    const hintW = 40;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                Mistakes: <span style={{ color: mistakes >= 2 ? "#FF6B6B" : "#FFD700" }}>{mistakes}/3</span>
                <span style={{ marginLeft: 10, color: "#64ffda" }}>{grid.flat().filter(v => v === 1).length}/{pattern.flat().filter(v => v === 1).length}</span>
            </div>
            {/* Progress bar */}
            <div style={{ width: SIZE * 44 + 40, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${(grid.flat().filter(v => v === 1).length / pattern.flat().filter(v => v === 1).length) * 100}%`, height: "100%", background: "linear-gradient(90deg, #0cbfff, #7c3aed)", borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex" }}>
                {/* Corner spacer */}
                <div style={{ width: hintW, height: hintW }} />
                {/* Column hints */}
                {colHints.map((h, c) => (
                    <div
                        key={c}
                        style={{
                            width: cellSize,
                            height: hintW,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            fontSize: "12px",
                            color: "#64ffda",
                            fontWeight: "bold",
                            padding: "2px 0",
                        }}
                    >
                        {h.map((v, i) => (
                            <div key={i}>{v}</div>
                        ))}
                    </div>
                ))}
            </div>
            {/* Grid rows */}
            {grid.map((row, r) => (
                <div key={r} style={{ display: "flex" }}>
                    {/* Row hint */}
                    <div
                        style={{
                            width: hintW,
                            height: cellSize,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "3px",
                            paddingRight: "6px",
                            fontSize: "12px",
                            color: "#64ffda",
                            fontWeight: "bold",
                        }}
                    >
                        {rowHints[r].map((v, i) => (
                            <span key={i}>{v}</span>
                        ))}
                    </div>
                    {row.map((val, c) => (
                        <div
                            key={c}
                            onClick={() => val === 0 && handleClick(r, c)}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                margin: "1px",
                                borderRadius: "4px",
                                cursor: val === 0 ? "pointer" : "default",
                                background:
                                    val === 1
                                        ? "linear-gradient(135deg, #0cbfff, #7c3aed)"
                                        : val === -1
                                            ? "rgba(255,50,50,0.3)"
                                            : "rgba(255,255,255,0.06)",
                                transition: "all 0.15s",
                                boxShadow: val === 1 ? "0 0 6px rgba(12,191,255,0.2)" : "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                            }}
                        >
                            {val === -1 ? "✕" : ""}
                        </div>
                    ))}
                </div>
            ))}
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                Use hints, click cells to fill (3 mistakes = over!)
            </div>
        </div>
    );
};

export default Nonogram;
