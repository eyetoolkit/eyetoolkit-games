/**
 * 🎮 Game 147: 타일 매칭
 * 같은 타일 2개를 연달아 클릭하여 제거
 */
import { useState, useCallback } from "react";

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🫐", "🍒", "🥝", "🍑"];
const SIZE = 4;

const createBoard = () => {
    const pairs = SIZE * SIZE / 2;
    const selected = EMOJIS.slice(0, pairs);
    const tiles = [...selected, ...selected].sort(() => Math.random() - 0.5);
    return tiles.map((emoji, i) => ({ emoji, id: i, matched: false }));
};

const TileMatch = ({ onComplete }) => {
    const [board, setBoard] = useState(createBoard);
    const [first, setFirst] = useState(null);
    const [second, setSecond] = useState(null);
    const [moves, setMoves] = useState(0);
    const [done, setDone] = useState(false);
    const [checking, setChecking] = useState(false);

    const click = useCallback((idx) => {
        if (done || checking || board[idx].matched) return;
        if (first === idx) return;

        if (first === null) {
            setFirst(idx);
            return;
        }

        setSecond(idx);
        setChecking(true);
        setMoves(m => m + 1);

        setTimeout(() => {
            const match = board[first].emoji === board[idx].emoji;
            if (match) {
                const newBoard = board.map((t, i) =>
                    (i === first || i === idx) ? { ...t, matched: true } : t
                );
                setBoard(newBoard);
                if (newBoard.every(t => t.matched)) {
                    setDone(true);
                    const score = Math.max(30, 100 - (moves + 1 - SIZE * SIZE / 2) * 5);
                    setTimeout(() => onComplete(Math.min(100, score)), 400);
                }
            }
            setFirst(null);
            setSecond(null);
            setChecking(false);
        }, 500);
    }, [board, first, checking, moves, done, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                이동: <span style={{ color: "#FFD700" }}>{moves}</span>
                <span style={{ marginLeft: 12 }}>남은 쌍: <span style={{ color: "#64ffda" }}>{board.filter(t => !t.matched).length / 2}</span></span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, 60px)`, gap: "6px" }}>
                {board.map((tile, i) => {
                    const isRevealed = first === i || second === i || tile.matched;
                    return (
                        <div key={i} onClick={() => click(i)} style={{
                            width: 60, height: 60, borderRadius: "10px", cursor: tile.matched ? "default" : "pointer",
                            background: tile.matched ? "rgba(100,255,218,0.1)" : isRevealed ? "rgba(255,217,61,0.15)" : "rgba(255,255,255,0.08)",
                            border: isRevealed ? "2px solid #FFD93D" : "2px solid rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: isRevealed ? "28px" : "20px",
                            opacity: tile.matched ? 0.4 : 1,
                            transition: "all 0.2s",
                        }}>
                            {isRevealed ? tile.emoji : "?"}
                        </div>
                    );
                })}
            </div>
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🎉 모든 쌍 발견! {moves}회</div>}
        </div>
    );
};

export default TileMatch;
