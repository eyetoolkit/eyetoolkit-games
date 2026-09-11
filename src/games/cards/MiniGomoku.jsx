/**
 * 🎮 Game 29: Mini Gomoku — last-stone marker + placement anim
 */
import { useCallback, useState } from "react";

const SIZE = 9;
const EMPTY = 0, PLAYER = 1, AI = 2;
const initBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));

const checkFive = (board, player) => {
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) for (const [dr, dc] of dirs) {
        let count = 0;
        for (let i = 0; i < 5; i++) { const nr = r + dr * i, nc = c + dc * i; if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === player) count++; }
        if (count === 5) return true;
    }
    return false;
};

const MiniGomoku = ({ onComplete }) => {
    const [board, setBoard] = useState(initBoard);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("");
    const [lastMove, setLastMove] = useState(null);

    const aiPlay = useCallback((b) => {
        const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
        let best = null, bestScore = -1;
        for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
            if (b[r][c] !== EMPTY) continue;
            let score = (4 - Math.abs(r - 4)) + (4 - Math.abs(c - 4));
            for (const [dr, dc] of dirs) {
                let aiCount = 0, pCount = 0;
                for (let i = -4; i <= 4; i++) { const nr = r + dr * i, nc = c + dc * i; if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) { if (b[nr][nc] === AI) aiCount++; if (b[nr][nc] === PLAYER) pCount++; } }
                score += aiCount * 3 + pCount * 2;
            }
            b[r][c] = AI; if (checkFive(b, AI)) score += 1000;
            b[r][c] = PLAYER; if (checkFive(b, PLAYER)) score += 500;
            b[r][c] = EMPTY;
            if (score > bestScore) { bestScore = score; best = [r, c]; }
        }
        return best;
    }, []);

    const handleClick = useCallback((r, c) => {
        if (gameOver || board[r][c] !== EMPTY) return;
        const nb = board.map(row => [...row]);
        nb[r][c] = PLAYER; setLastMove([r, c]);
        if (checkFive(nb, PLAYER)) { setBoard(nb); setGameOver(true); setMessage("🏆 Victory!"); setTimeout(() => onComplete(100), 800); return; }
        const am = aiPlay(nb);
        if (am) { nb[am[0]][am[1]] = AI; if (checkFive(nb, AI)) { setBoard(nb); setGameOver(true); setMessage("😢 Defeat!"); setTimeout(() => onComplete(35), 800); return; } }
        setBoard(nb);
        if (nb.every(row => row.every(c => c !== EMPTY))) { setGameOver(true); setMessage("🤝 Draw!"); setTimeout(() => onComplete(60), 800); }
    }, [board, gameOver, aiPlay, onComplete]);

    const cs = 36;
    const stoneCount = board.flat().filter(c => c !== EMPTY).length;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <style>{`@keyframes stoneDrop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
            <div style={{ fontSize: "13px" }}>
                ⚫ Me vs ⚪ AI <span style={{ color: "#8892b0", marginLeft: 8 }}>({stoneCount} moves)</span>
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, ${cs}px)`,
                background: "linear-gradient(135deg, #D4A574, #C4955A)", padding: "2px",
                borderRadius: "6px", border: gameOver ? "3px solid #FFD700" : "2px solid #B8925A",
            }}>
                {board.map((row, r) => row.map((cell, c) => {
                    const isLast = lastMove && lastMove[0] === r && lastMove[1] === c;
                    return (
                        <div key={`${r}-${c}`} onClick={() => handleClick(r, c)} style={{
                            width: cs, height: cs, display: "flex", alignItems: "center", justifyContent: "center",
                            border: "0.5px solid #B8925A", cursor: !gameOver && cell === EMPTY ? "pointer" : "default",
                            background: "transparent",
                        }}
                            onMouseEnter={(e) => { if (!gameOver && cell === EMPTY) e.currentTarget.style.background = "rgba(0,0,0,0.08)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        >
                            {cell !== EMPTY && (
                                <div style={{
                                    width: cs - 6, height: cs - 6, borderRadius: "50%",
                                    background: cell === PLAYER ? "radial-gradient(circle at 35% 35%, #444, #000)" : "radial-gradient(circle at 35% 35%, #fff, #ccc)",
                                    boxShadow: isLast ? `0 0 8px ${cell === PLAYER ? "rgba(100,255,218,0.5)" : "rgba(255,215,0,0.5)"}` : "0 1px 3px rgba(0,0,0,0.4)",
                                    animation: "stoneDrop 0.2s ease",
                                    position: "relative",
                                }}>
                                    {isLast && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #FF6B6B" }} />}
                                </div>
                            )}
                        </div>
                    );
                }))}
            </div>
            {message && <div style={{ fontSize: "16px", fontWeight: "bold" }}>{message}</div>}
            {!gameOver && <div style={{ fontSize: "10px", color: "#8892b0" }}>Place a stone on an intersection</div>}
        </div>
    );
};

export default MiniGomoku;
