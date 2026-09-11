/**
 * 🎮 Game 26: 체스 퍼즐 — 가능 이동 하이라이트 + 진행 도트
 */
import { useCallback, useState } from "react";

const PUZZLES = [
    {
        pieces: [{ type: "♚", pos: [0, 4], color: "black" }, { type: "♔", pos: [2, 4], color: "white" }, { type: "♖", pos: [7, 7], color: "white" }],
        answer: [[7, 7], [0, 7]], hint: "룩을 8번째 줄로!"
    },
    {
        pieces: [{ type: "♜", pos: [0, 0], color: "black" }, { type: "♚", pos: [0, 4], color: "black" }, { type: "♔", pos: [2, 4], color: "white" }, { type: "♖", pos: [7, 0], color: "white" }],
        answer: [[7, 0], [0, 0]], hint: "룩으로 체크!"
    },
    {
        pieces: [{ type: "♚", pos: [0, 3], color: "black" }, { type: "♔", pos: [2, 3], color: "white" }, { type: "♕", pos: [7, 0], color: "white" }],
        answer: [[7, 0], [1, 0]], hint: "퀸을 2번째 줄로!"
    },
];

const ChessPuzzle = ({ onComplete }) => {
    const [puzzleIdx, setPuzzleIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [solved, setSolved] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const puzzle = PUZZLES[puzzleIdx];

    const handleClick = useCallback((row, col) => {
        if (feedback) return;
        const piece = puzzle.pieces.find((p) => p.pos[0] === row && p.pos[1] === col && p.color === "white");
        if (selected === null) { if (piece) setSelected([row, col]); }
        else {
            const [from, to] = puzzle.answer;
            if (selected[0] === from[0] && selected[1] === from[1] && row === to[0] && col === to[1]) {
                setFeedback("correct"); const ns = solved + 1; setSolved(ns);
                setTimeout(() => {
                    if (puzzleIdx + 1 < PUZZLES.length) { setPuzzleIdx(puzzleIdx + 1); setSelected(null); setFeedback(null); setShowHint(false); }
                    else { onComplete(Math.round((ns / PUZZLES.length) * 100)); }
                }, 800);
            } else { setFeedback("wrong"); setTimeout(() => { setFeedback(null); setSelected(null); }, 600); }
        }
    }, [selected, puzzle, puzzleIdx, solved, feedback, onComplete]);

    const SIZE = 8, cs = 42;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`@keyframes wrongShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }`}</style>
            <div style={{ fontSize: "13px" }}>퍼즐: <span style={{ color: "#FFD700" }}>{puzzleIdx + 1}/{PUZZLES.length}</span> | 정답: <span style={{ color: "#64ffda" }}>{solved}</span></div>
            <div style={{ display: "flex", gap: "4px" }}>
                {PUZZLES.map((_, i) => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < puzzleIdx ? "#64ffda" : i === puzzleIdx ? "#FFD700" : "rgba(255,255,255,0.1)" }} />))}
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, ${cs}px)`,
                border: feedback === "correct" ? "3px solid #64ffda" : "2px solid #8B7355",
                borderRadius: "4px",
                animation: feedback === "wrong" ? "wrongShake 0.3s ease" : "none",
            }}>
                {Array.from({ length: SIZE * SIZE }, (_, i) => {
                    const row = Math.floor(i / SIZE), col = i % SIZE;
                    const isLight = (row + col) % 2 === 0;
                    const piece = puzzle.pieces.find((p) => p.pos[0] === row && p.pos[1] === col);
                    const isSelected = selected && selected[0] === row && selected[1] === col;
                    const isTarget = selected && puzzle.answer[0][0] === selected[0] && puzzle.answer[0][1] === selected[1] && puzzle.answer[1][0] === row && puzzle.answer[1][1] === col;
                    return (
                        <div key={i} onClick={() => handleClick(row, col)}
                            style={{
                                width: cs, height: cs,
                                background: isSelected ? "rgba(255,215,0,0.5)" : isTarget ? "rgba(100,255,218,0.15)" : feedback === "correct" ? (isLight ? "#c8e6c9" : "#81c784") : isLight ? "#F0D9B5" : "#B58863",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "26px", cursor: "pointer", transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => { if (!feedback && !isSelected) e.currentTarget.style.background = isLight ? "#e8d5a0" : "#a07848"; }}
                            onMouseLeave={(e) => { if (!feedback && !isSelected) e.currentTarget.style.background = isLight ? "#F0D9B5" : "#B58863"; }}
                        >{piece?.type || ""}</div>
                    );
                })}
            </div>
            {feedback && <div style={{ fontSize: "18px" }}>{feedback === "correct" ? "✅ 정답!" : "❌ 다시"}</div>}
            <button onClick={() => setShowHint(true)} style={{ padding: "5px 14px", fontSize: "11px", background: "rgba(255,255,255,0.06)", color: "#8892b0", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", cursor: "pointer" }}>
                {showHint ? `💡 ${puzzle.hint}` : "💡 힌트"}
            </button>
        </div>
    );
};

export default ChessPuzzle;
