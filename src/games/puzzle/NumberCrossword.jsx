/**
 * 🎮 Game 148: 숫자 크로스워드
 * 가로세로 합이 맞도록 숫자 배치
 */
import { useState, useCallback } from "react";

const SIZE = 3;

const createPuzzle = () => {
    const grid = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => 1 + Math.floor(Math.random() * 9))
    );
    const rowSums = grid.map(row => row.reduce((s, v) => s + v, 0));
    const colSums = Array.from({ length: SIZE }, (_, c) => grid.reduce((s, row) => s + row[c], 0));
    const blanks = [];
    const cells = grid.map(r => [...r]);
    while (blanks.length < 4) {
        const r = Math.floor(Math.random() * SIZE);
        const c = Math.floor(Math.random() * SIZE);
        if (cells[r][c] !== 0) {
            cells[r][c] = 0;
            blanks.push({ r, c, answer: grid[r][c] });
        }
    }
    return { grid, cells, rowSums, colSums, blanks };
};

const NumberCrossword = ({ onComplete }) => {
    const [puzzle] = useState(createPuzzle);
    const [userGrid, setUserGrid] = useState(() => puzzle.cells.map(r => [...r]));
    const [done, setDone] = useState(false);

    const setCell = useCallback((r, c, val) => {
        if (done) return;
        const newGrid = userGrid.map(row => [...row]);
        newGrid[r][c] = parseInt(val, 10) || 0;
        setUserGrid(newGrid);
    }, [userGrid, done]);

    const check = useCallback(() => {
        if (done) return;
        const correct = puzzle.blanks.every(({ r, c, answer }) => userGrid[r][c] === answer);
        setDone(true);
        setTimeout(() => onComplete(correct ? 100 : 40), 500);
    }, [puzzle, userGrid, done, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>합이 맞도록 빈칸을 채우세요</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE + 1}, 50px)`, gap: "4px", alignItems: "center" }}>
                {userGrid.map((row, r) => (
                    <>
                        {row.map((cell, c) => {
                            const isBlank = puzzle.cells[r][c] === 0;
                            return (
                                <div key={`${r}-${c}`} style={{
                                    width: 50, height: 50, borderRadius: "8px",
                                    background: isBlank ? "rgba(255,255,255,0.06)" : "rgba(100,255,218,0.08)",
                                    border: isBlank ? "2px solid rgba(255,217,61,0.3)" : "1px solid rgba(255,255,255,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {isBlank ? (
                                        <input value={cell || ""} onChange={e => setCell(r, c, e.target.value)}
                                            style={{ width: "36px", height: "36px", textAlign: "center", fontSize: "20px", fontWeight: "bold", background: "transparent", border: "none", color: "#FFD93D", outline: "none" }}
                                            maxLength={1} />
                                    ) : (
                                        <span style={{ fontSize: "20px", fontWeight: "bold", color: "#64ffda" }}>{cell}</span>
                                    )}
                                </div>
                            );
                        })}
                        <div key={`sum-r-${r}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#FFD700", fontWeight: "bold" }}>
                            ={puzzle.rowSums[r]}
                        </div>
                    </>
                ))}
                {puzzle.colSums.map((sum, c) => (
                    <div key={`sum-c-${c}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#FFD700", fontWeight: "bold" }}>
                        ={sum}
                    </div>
                ))}
            </div>
            {!done && (
                <button onClick={check} style={{ padding: "8px 20px", fontSize: "14px", fontWeight: "bold", background: "rgba(100,255,218,0.15)", color: "#64ffda", border: "1px solid #64ffda", borderRadius: "8px", cursor: "pointer" }}>확인</button>
            )}
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🔢 완성!</div>}
        </div>
    );
};

export default NumberCrossword;
