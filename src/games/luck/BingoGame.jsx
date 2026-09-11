/**
 * 🎮 Game 79: 빙고 — 빙고 보드 + 마킹 애니메이션 + 라인 시각화
 */
import { useCallback, useEffect, useState } from "react";

const SIZE = 5;
const genBoard = () => { const nums = []; while (nums.length < SIZE * SIZE) { const n = Math.floor(Math.random() * 30) + 1; if (!nums.includes(n)) nums.push(n); } return nums; };

const BingoGame = ({ onComplete }) => {
    const [board] = useState(genBoard);
    const [marked, setMarked] = useState(() => { const m = Array(SIZE * SIZE).fill(false); m[12] = true; return m; }); // Center free
    const [called, setCalled] = useState([]);
    const [lastCalled, setLastCalled] = useState(null);
    const [animating, setAnimating] = useState(false);

    const call = useCallback(() => {
        if (animating) return;
        let n;
        do { n = Math.floor(Math.random() * 30) + 1; } while (called.includes(n));
        setAnimating(true);
        setLastCalled(n);
        setCalled((c) => [...c, n]);
        setMarked((m) => {
            const nm = [...m];
            const idx = board.indexOf(n);
            if (idx >= 0) nm[idx] = true;
            return nm;
        });
        setTimeout(() => setAnimating(false), 500);
    }, [board, called, animating]);

    const getLines = useCallback(() => {
        const lines = [];
        for (let r = 0; r < SIZE; r++) { if (Array.from({ length: SIZE }, (_, c) => marked[r * SIZE + c]).every(Boolean)) lines.push({ type: "row", idx: r }); }
        for (let c = 0; c < SIZE; c++) { if (Array.from({ length: SIZE }, (_, r) => marked[r * SIZE + c]).every(Boolean)) lines.push({ type: "col", idx: c }); }
        if (Array.from({ length: SIZE }, (_, i) => marked[i * SIZE + i]).every(Boolean)) lines.push({ type: "diag1" });
        if (Array.from({ length: SIZE }, (_, i) => marked[i * SIZE + (SIZE - 1 - i)]).every(Boolean)) lines.push({ type: "diag2" });
        return lines;
    }, [marked]);

    const lines = getLines();

    useEffect(() => {
        if (lines.length >= 3 && called.length > 0) {
            setTimeout(() => onComplete(100), 500);
        }
    }, [lines, called, onComplete]);

    const isOnLine = (r, c) => {
        return lines.some((l) =>
            (l.type === "row" && l.idx === r) ||
            (l.type === "col" && l.idx === c) ||
            (l.type === "diag1" && r === c) ||
            (l.type === "diag2" && r === SIZE - 1 - c)
        );
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes bingoMark { 0% { transform: scale(0.5); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
                @keyframes bingoLine { 0%,100% { box-shadow: 0 0 8px rgba(255,215,0,0.4); } 50% { box-shadow: 0 0 16px rgba(255,215,0,0.8); } }
                @keyframes numberPop { 0% { transform: scale(2); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ fontSize: "13px" }}>빙고 줄: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{lines.length}/3</span></div>
                {lastCalled && (
                    <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.15))",
                        border: "2px solid #FFD700",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px", fontWeight: "bold", color: "#FFD700",
                        animation: "numberPop 0.4s ease",
                    }}>{lastCalled}</div>
                )}
            </div>

            {/* Bingo board */}
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "3px",
                padding: "6px", borderRadius: "12px",
                background: "rgba(0,0,0,0.2)", border: "2px solid rgba(255,215,0,0.2)",
            }}>
                {/* B-I-N-G-O header */}
                {["B", "I", "N", "G", "O"].map((l) => (
                    <div key={l} style={{
                        width: 40, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: "bold", color: "#FFD700",
                    }}>{l}</div>
                ))}
                {board.map((n, i) => {
                    const r = Math.floor(i / SIZE), c = i % SIZE;
                    const isMarked = marked[i];
                    const onLine = isOnLine(r, c);
                    const isCenter = i === 12;
                    const isNew = n === lastCalled;

                    return (
                        <div key={i} style={{
                            width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: isCenter ? "14px" : "15px", fontWeight: "bold",
                            borderRadius: "8px",
                            background: onLine ? "rgba(255,215,0,0.25)"
                                : isMarked ? "rgba(100,255,218,0.2)"
                                    : "rgba(255,255,255,0.04)",
                            border: onLine ? "2px solid #FFD700"
                                : isMarked ? "2px solid rgba(100,255,218,0.4)"
                                    : "1px solid rgba(255,255,255,0.1)",
                            color: isMarked ? "#64ffda" : "white",
                            animation: isNew && isMarked ? "bingoMark 0.4s ease"
                                : onLine ? "bingoLine 1.5s ease infinite" : "none",
                            position: "relative",
                        }}>
                            {isCenter ? "⭐" : n}
                            {isMarked && !isCenter && (
                                <div style={{
                                    position: "absolute", width: "70%", height: 2,
                                    background: "#64ffda", borderRadius: 1,
                                    transform: "rotate(-45deg)",
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Recent calls */}
            <div style={{ display: "flex", gap: "4px", fontSize: "11px", color: "#8892b0" }}>
                {called.slice(-8).map((n, i) => (
                    <span key={i} style={{
                        padding: "2px 6px", borderRadius: "4px",
                        background: board.includes(n) ? "rgba(100,255,218,0.1)" : "rgba(255,255,255,0.05)",
                        color: board.includes(n) ? "#64ffda" : "#666",
                    }}>{n}</span>
                ))}
            </div>

            <button onClick={call} disabled={animating} style={{
                padding: "10px 28px", fontSize: "14px", fontWeight: "bold",
                background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.1))",
                color: "white", border: "2px solid #FFD700", borderRadius: "14px",
                cursor: animating ? "wait" : "pointer",
                boxShadow: "0 4px 15px rgba(255,215,0,0.15)",
            }}>🎱 번호 뽑기!</button>
        </div>
    );
};

export default BingoGame;
