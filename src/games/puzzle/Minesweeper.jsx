/**
 * 🎮 Game 7: 미니 지뢰찾기 (6×6, 6 mines)
 * 지뢰를 피해 모든 안전한 칸을 열어보세요!
 */
import { useCallback, useState } from "react";

const SIZE = 6;
const MINES = 6;

const createBoard = () => {
    const board = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
    );
    let placed = 0;
    while (placed < MINES) {
        const r = Math.floor(Math.random() * SIZE);
        const c = Math.floor(Math.random() * SIZE);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placed++;
        }
    }
    // Calculate counts
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
            if (!board[r][c].mine) {
                let cnt = 0;
                for (let dr = -1; dr <= 1; dr++)
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].mine) cnt++;
                    }
                board[r][c].count = cnt;
            }
    return board;
};

const Minesweeper = ({ onComplete }) => {
    const [board, setBoard] = useState(createBoard);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    const reveal = useCallback(
        (r, c, b) => {
            if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return;
            if (b[r][c].revealed || b[r][c].flagged) return;
            b[r][c].revealed = true;
            if (b[r][c].count === 0 && !b[r][c].mine) {
                for (let dr = -1; dr <= 1; dr++)
                    for (let dc = -1; dc <= 1; dc++)
                        reveal(r + dr, c + dc, b);
            }
        },
        []
    );

    const checkWin = (b) => {
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (!b[r][c].mine && !b[r][c].revealed) return false;
        return true;
    };

    const handleClick = useCallback(
        (r, c) => {
            if (gameOver || won) return;
            if (board[r][c].flagged || board[r][c].revealed) return;

            const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

            if (newBoard[r][c].mine) {
                // Reveal all mines
                newBoard.forEach((row) => row.forEach((cell) => { if (cell.mine) cell.revealed = true; }));
                setBoard(newBoard);
                setGameOver(true);
                setTimeout(() => onComplete(10), 600);
                return;
            }

            reveal(r, c, newBoard);
            setBoard(newBoard);

            if (checkWin(newBoard)) {
                setWon(true);
                const revealedCount = newBoard.flat().filter((c) => c.revealed).length;
                const score = Math.min(100, Math.round((revealedCount / (SIZE * SIZE - MINES)) * 100));
                setTimeout(() => onComplete(score), 600);
            }
        },
        [board, gameOver, won, reveal, onComplete]
    );

    const handleRightClick = useCallback(
        (e, r, c) => {
            e.preventDefault();
            if (gameOver || won) return;
            if (board[r][c].revealed) return;
            const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
            newBoard[r][c].flagged = !newBoard[r][c].flagged;
            setBoard(newBoard);
        },
        [board, gameOver, won]
    );

    const cellSize = 44;
    const COUNT_COLORS = ["", "#0cbfff", "#64ffda", "#FF6B6B", "#7c3aed", "#FFD700", "#FF4444", "#fff", "#888"];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                💣 {MINES}개 | 🚩 <span style={{ color: "#FFD700" }}>{board.flat().filter(c => c.flagged).length}</span> | ⬛ <span style={{ color: "#64ffda" }}>{board.flat().filter(c => c.revealed && !c.mine).length}</span>/{SIZE * SIZE - MINES}
                {gameOver && <span style={{ color: "#FF6B6B" }}> — 💥 BOOM!</span>}
                {won && <span style={{ color: "#64ffda" }}> — 🎉 클리어!</span>}
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${SIZE}, ${cellSize}px)`,
                    gap: "2px",
                    padding: "4px",
                    background: "#1a1a2e",
                    borderRadius: "8px",
                    border: won ? "3px solid #64ffda" : gameOver ? "3px solid #FF6B6B" : "2px solid rgba(255,255,255,0.06)",
                }}
            >
                {board.flat().map((cell, idx) => {
                    const r = Math.floor(idx / SIZE), c = idx % SIZE;
                    return (
                        <div
                            key={idx}
                            onClick={() => handleClick(r, c)}
                            onContextMenu={(e) => handleRightClick(e, r, c)}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "4px",
                                fontSize: cell.revealed && cell.mine ? "18px" : "16px",
                                fontWeight: "bold",
                                cursor: cell.revealed ? "default" : "pointer",
                                background: cell.revealed
                                    ? cell.mine
                                        ? "rgba(255,50,50,0.3)"
                                        : "rgba(255,255,255,0.12)"
                                    : "rgba(255,255,255,0.06)",
                                color: COUNT_COLORS[cell.count] || "white",
                                transition: "all 0.15s",
                                userSelect: "none",
                            }}
                        >
                            {cell.flagged && !cell.revealed
                                ? "🚩"
                                : cell.revealed
                                    ? cell.mine
                                        ? "💣"
                                        : cell.count > 0
                                            ? cell.count
                                            : ""
                                    : ""}
                        </div>
                    );
                })}
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                좌클릭: 열기 | 우클릭: 깃발 🚩
            </div>
        </div>
    );
};

export default Minesweeper;
