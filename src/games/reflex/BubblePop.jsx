/**
 * 🎮 Game 108: 버블 팝
 * 같은 색 버블을 쏴서 3개 이상 연결하면 터트리기
 */
import { useState, useCallback } from "react";

const COLS = 8;
const ROWS = 8;
const COLORS = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#9B59B6"];
const CELL = 38;

const createBoard = () => {
    const board = [];
    for (let r = 0; r < 5; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            row.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }
        board.push(row);
    }
    for (let r = 5; r < ROWS; r++) {
        board.push(Array(COLS).fill(null));
    }
    return board;
};

const findCluster = (board, r, c, color, visited) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return [];
    if (visited.has(`${r},${c}`)) return [];
    if (board[r][c] !== color) return [];
    visited.add(`${r},${c}`);
    let cluster = [[r, c]];
    cluster = cluster.concat(findCluster(board, r - 1, c, color, visited));
    cluster = cluster.concat(findCluster(board, r + 1, c, color, visited));
    cluster = cluster.concat(findCluster(board, r, c - 1, color, visited));
    cluster = cluster.concat(findCluster(board, r, c + 1, color, visited));
    return cluster;
};

const BubblePop = ({ onComplete }) => {
    const [board, setBoard] = useState(createBoard);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [nextColor] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
    const [done, setDone] = useState(false);

    const handleClick = useCallback((r, c) => {
        if (done) return;
        if (board[r][c] === null) return;

        const color = board[r][c];
        const cluster = findCluster(board, r, c, color, new Set());

        if (cluster.length < 3) return;

        const newBoard = board.map(row => [...row]);
        cluster.forEach(([cr, cc]) => { newBoard[cr][cc] = null; });

        // Gravity — drop cells down
        for (let col = 0; col < COLS; col++) {
            let writeRow = ROWS - 1;
            for (let row = ROWS - 1; row >= 0; row--) {
                if (newBoard[row][col] !== null) {
                    if (writeRow !== row) {
                        newBoard[writeRow][col] = newBoard[row][col];
                        newBoard[row][col] = null;
                    }
                    writeRow--;
                }
            }
        }

        const newScore = score + cluster.length * 10;
        setBoard(newBoard);
        setScore(newScore);
        setMoves(m => m + 1);

        // Check if board is empty or no more moves
        const hasColors = newBoard.some(row => row.some(c => c !== null));
        if (!hasColors) {
            setDone(true);
            setTimeout(() => onComplete(100), 500);
            return;
        }

        // Check if no valid clusters remain
        let hasValidMove = false;
        for (let rr = 0; rr < ROWS && !hasValidMove; rr++) {
            for (let cc = 0; cc < COLS && !hasValidMove; cc++) {
                if (newBoard[rr][cc]) {
                    const cl = findCluster(newBoard, rr, cc, newBoard[rr][cc], new Set());
                    if (cl.length >= 3) hasValidMove = true;
                }
            }
        }

        if (!hasValidMove) {
            setDone(true);
            const finalScore = Math.min(100, Math.floor(newScore / 5) + 20);
            setTimeout(() => onComplete(finalScore), 500);
        }
    }, [board, score, done, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#FFD700" }}>{score}</span></span>
                <span>이동: <span style={{ color: "#64ffda" }}>{moves}</span></span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    다음: <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: nextColor }} />
                </span>
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: "2px",
                padding: "6px", background: "#1a1a2e", borderRadius: "10px",
                border: "2px solid rgba(255,255,255,0.1)",
            }}>
                {board.flat().map((cell, idx) => {
                    const r = Math.floor(idx / COLS), c = idx % COLS;
                    return (
                        <div
                            key={idx}
                            onClick={() => cell && handleClick(r, c)}
                            style={{
                                width: CELL, height: CELL, borderRadius: "50%",
                                background: cell || "rgba(255,255,255,0.03)",
                                cursor: cell ? "pointer" : "default",
                                transition: "all 0.15s",
                                boxShadow: cell ? `0 2px 8px ${cell}44` : "none",
                                border: cell ? `2px solid ${cell}88` : "1px solid rgba(255,255,255,0.02)",
                            }}
                        />
                    );
                })}
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                같은 색 3개 이상 연결된 버블을 클릭!
            </div>
            {done && (
                <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>
                    🫧 완료! 점수: {score}
                </div>
            )}
        </div>
    );
};

export default BubblePop;
