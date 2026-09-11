/**
 * 🎮 Game 55: Jigsaw Puzzle — 3×3 tile shuffle + snap
 */
import { useCallback, useState } from "react";

const SIZE = 3;
const IMAGE_PARTS = ["🌄", "⛰️", "🌅", "🌳", "🏠", "🌸", "🌊", "⛵", "🎑"];

const JigsawPuzzle = ({ onComplete }) => {
    const [pieces, setPieces] = useState(() => {
        const ps = IMAGE_PARTS.map((emoji, i) => ({ id: i, emoji, placed: false }));
        return ps.sort(() => Math.random() - 0.5);
    });
    const [grid, setGrid] = useState(Array(SIZE * SIZE).fill(null));
    const [selected, setSelected] = useState(null);
    const [done, setDone] = useState(false);

    const handlePieceClick = useCallback((piece) => {
        if (done || piece.placed) return;
        setSelected(piece);
    }, [done]);

    const handleSlotClick = useCallback((slotIdx) => {
        if (done || !selected || grid[slotIdx]) return;
        const newGrid = [...grid];
        newGrid[slotIdx] = selected;
        setGrid(newGrid);
        setPieces((ps) => ps.map((p) => p.id === selected.id ? { ...p, placed: true } : p));
        setSelected(null);

        // Check completion
        const allPlaced = newGrid.every((cell) => cell !== null);
        if (allPlaced) {
            const correctCount = newGrid.filter((cell, i) => cell && cell.id === i).length;
            setDone(true);
            setTimeout(() => onComplete(Math.round((correctCount / (SIZE * SIZE)) * 100)), 500);
        }
    }, [selected, grid, done, onComplete]);

    const correctCount = grid.filter((cell, i) => cell && cell.id === i).length;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes snapIn { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes puzzleDone { 0%,100% { border-color: rgba(100,255,218,0.4); } 50% { border-color: rgba(100,255,218,0.8); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                Placed: <span style={{ color: "#64ffda" }}>{correctCount}/{SIZE * SIZE}</span>
                {selected && <span style={{ color: "#FFD700", marginLeft: 8 }}>Select: {selected.emoji}</span>}
            </div>

            {/* Target board */}
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "3px",
                padding: "6px", borderRadius: "12px",
                background: "rgba(0,0,0,0.3)",
                border: done ? "3px solid #64ffda" : "3px solid rgba(255,255,255,0.12)",
                animation: done ? "puzzleDone 1.5s ease infinite" : "none",
            }}>
                {grid.map((cell, i) => {
                    const isCorrect = cell && cell.id === i;
                    return (
                        <div key={i} onClick={() => handleSlotClick(i)}
                            style={{
                                width: 56, height: 56, borderRadius: "8px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: cell ? "28px" : "14px",
                                cursor: cell || !selected ? "default" : "pointer",
                                background: cell
                                    ? (isCorrect ? "rgba(100,255,218,0.12)" : "rgba(255,215,0,0.08)")
                                    : selected ? "rgba(255,215,0,0.06)" : "rgba(255,255,255,0.03)",
                                border: isCorrect ? "2px solid rgba(100,255,218,0.4)"
                                    : cell ? "1px solid rgba(255,255,255,0.15)"
                                        : selected ? "2px dashed rgba(255,215,0,0.3)" : "1px dashed rgba(255,255,255,0.1)",
                                animation: cell ? "snapIn 0.3s ease" : "none",
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => { if (!cell && selected) e.currentTarget.style.background = "rgba(255,215,0,0.12)"; }}
                            onMouseLeave={(e) => { if (!cell) e.currentTarget.style.background = selected ? "rgba(255,215,0,0.06)" : "rgba(255,255,255,0.03)"; }}
                        >{cell ? cell.emoji : `${i + 1}`}</div>
                    );
                })}
            </div>

            {/* Available pieces */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: 250 }}>
                {pieces.filter((p) => !p.placed).map((piece) => (
                    <button key={piece.id} onClick={() => handlePieceClick(piece)}
                        style={{
                            width: 46, height: 46, fontSize: "22px",
                            borderRadius: "10px", cursor: "pointer",
                            background: selected?.id === piece.id ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.06)",
                            border: selected?.id === piece.id ? "2px solid #FFD700" : "2px solid rgba(255,255,255,0.12)",
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    >{piece.emoji}</button>
                ))}
            </div>

            {done && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>
                    🧩 Puzzle Complete! ({correctCount}/{SIZE * SIZE} correct)
                </div>
            )}
        </div>
    );
};

export default JigsawPuzzle;
