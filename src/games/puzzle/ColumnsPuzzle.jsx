/**
 * 🎮 Game 105: 벽돌 쌓기 퍼즐 (Columns 스타일)
 * 3색 블록이 떨어지며, 3개 이상 같은 색이 연결되면 제거
 */
import { useState, useEffect, useRef, useCallback } from "react";

const COLS = 6;
const ROWS = 12;
const COLORS = ["#FF6B6B", "#6BCB77", "#4D96FF"];
const CELL = 32;

const createEmpty = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const ColumnsPuzzle = ({ onComplete }) => {
    const [board, setBoard] = useState(createEmpty);
    const [score, setScore] = useState(0);
    const [piece, setPiece] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const intervalRef = useRef(null);
    const boardRef = useRef(board);
    boardRef.current = board;

    const spawnPiece = useCallback(() => {
        const col = Math.floor(Math.random() * COLS);
        const colors = Array.from({ length: 3 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
        return { col, row: 0, colors };
    }, []);

    const placePiece = useCallback((b, p) => {
        const newBoard = b.map(r => [...r]);
        for (let i = 0; i < 3; i++) {
            const r = p.row + i;
            if (r >= 0 && r < ROWS) newBoard[r][p.col] = p.colors[i];
        }
        return newBoard;
    }, []);

    const clearMatches = useCallback((b) => {
        const toRemove = new Set();
        // Check horizontal
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS - 2; c++) {
                if (b[r][c] && b[r][c] === b[r][c + 1] && b[r][c] === b[r][c + 2]) {
                    toRemove.add(`${r},${c}`); toRemove.add(`${r},${c + 1}`); toRemove.add(`${r},${c + 2}`);
                }
            }
        }
        // Check vertical
        for (let c = 0; c < COLS; c++) {
            for (let r = 0; r < ROWS - 2; r++) {
                if (b[r][c] && b[r][c] === b[r + 1][c] && b[r][c] === b[r + 2][c]) {
                    toRemove.add(`${r},${c}`); toRemove.add(`${r + 1},${c}`); toRemove.add(`${r + 2},${c}`);
                }
            }
        }
        if (toRemove.size === 0) return { board: b, cleared: 0 };
        const newBoard = b.map(r => [...r]);
        toRemove.forEach(key => { const [r, c] = key.split(",").map(Number); newBoard[r][c] = null; });
        // Gravity
        for (let c = 0; c < COLS; c++) {
            let writeRow = ROWS - 1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (newBoard[r][c] !== null) {
                    if (writeRow !== r) { newBoard[writeRow][c] = newBoard[r][c]; newBoard[r][c] = null; }
                    writeRow--;
                }
            }
        }
        return { board: newBoard, cleared: toRemove.size };
    }, []);

    const tick = useCallback(() => {
        setPiece(prev => {
            if (!prev) return spawnPiece();
            const b = boardRef.current;
            const nextRow = prev.row + 1;
            const canMove = prev.colors.every((_, i) => {
                const r = nextRow + i;
                return r < ROWS && (r < 0 || b[r][prev.col] === null);
            });
            if (canMove) return { ...prev, row: nextRow };
            // Lock piece
            let newBoard = placePiece(b, prev);
            let totalCleared = 0;
            let result = clearMatches(newBoard);
            while (result.cleared > 0) {
                totalCleared += result.cleared;
                newBoard = result.board;
                result = clearMatches(newBoard);
            }
            if (newBoard[0].some(c => c !== null)) {
                setGameOver(true);
                const finalScore = Math.min(100, Math.floor(totalCleared * 5 + (score / 10)));
                setTimeout(() => onComplete(finalScore > 0 ? finalScore : 30), 500);
                return null;
            }
            setBoard(newBoard);
            setScore(s => s + totalCleared * 10);
            return spawnPiece();
        });
    }, [spawnPiece, placePiece, clearMatches, score, onComplete]);

    useEffect(() => {
        if (gameOver) return;
        intervalRef.current = setInterval(tick, 600);
        return () => clearInterval(intervalRef.current);
    }, [tick, gameOver]);

    useEffect(() => {
        const handleKey = (e) => {
            if (gameOver) return;
            setPiece(prev => {
                if (!prev) return prev;
                const b = boardRef.current;
                if (e.key === "ArrowLeft" && prev.col > 0 && prev.colors.every((_, i) => prev.row + i < 0 || prev.row + i >= ROWS || b[prev.row + i]?.[prev.col - 1] === null))
                    return { ...prev, col: prev.col - 1 };
                if (e.key === "ArrowRight" && prev.col < COLS - 1 && prev.colors.every((_, i) => prev.row + i < 0 || prev.row + i >= ROWS || b[prev.row + i]?.[prev.col + 1] === null))
                    return { ...prev, col: prev.col + 1 };
                if (e.key === "ArrowUp")
                    return { ...prev, colors: [prev.colors[2], prev.colors[0], prev.colors[1]] };
                if (e.key === "ArrowDown") {
                    tick();
                    return prev;
                }
                return prev;
            });
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [gameOver, tick]);

    const displayBoard = board.map(r => [...r]);
    if (piece) {
        for (let i = 0; i < 3; i++) {
            const r = piece.row + i;
            if (r >= 0 && r < ROWS) displayBoard[r][piece.col] = piece.colors[i];
        }
    }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                점수: <span style={{ color: "#FFD700" }}>{score}</span>
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: "1px",
                padding: "4px", background: "#1a1a2e", borderRadius: "8px",
                border: "2px solid rgba(255,255,255,0.1)",
            }}>
                {displayBoard.flat().map((cell, idx) => (
                    <div key={idx} style={{
                        width: CELL, height: CELL, borderRadius: "3px",
                        background: cell || "rgba(255,255,255,0.03)",
                        border: cell ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.02)",
                        transition: "background 0.1s",
                    }} />
                ))}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
                {[["←", "ArrowLeft"], ["↻", "ArrowUp"], ["↓", "ArrowDown"], ["→", "ArrowRight"]].map(([label, key]) => (
                    <button key={key} onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key }))} style={colBtnStyle}>{label}</button>
                ))}
            </div>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>←→ 이동 | ↑ 색 회전 | ↓ 빨리 떨어뜨리기</div>
            {gameOver && <div style={{ fontSize: "16px", color: "#FF6B6B", fontWeight: "bold" }}>게임 오버! 점수: {score}</div>}
        </div>
    );
};

const colBtnStyle = {
    width: 44, height: 44, fontSize: "18px",
    background: "rgba(255,255,255,0.1)", color: "white",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", cursor: "pointer",
};

export default ColumnsPuzzle;
