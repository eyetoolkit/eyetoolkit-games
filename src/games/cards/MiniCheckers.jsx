/**
 * 🎮 Game 111: 미니 체커
 * 6×6 체커 — AI와 대전
 */
import { useState, useCallback } from "react";

const SIZE = 6;
const EMPTY = 0;
const P1 = 1; // player (dark)
const P2 = 2; // AI (light)
const P1K = 3; // king
const P2K = 4; // king

const initBoard = () => {
    const b = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
    for (let r = 0; r < 2; r++)
        for (let c = 0; c < SIZE; c++)
            if ((r + c) % 2 === 1) b[r][c] = P2;
    for (let r = SIZE - 2; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
            if ((r + c) % 2 === 1) b[r][c] = P1;
    return b;
};

const isPlayer = (piece) => piece === P1 || piece === P1K;
const isAI = (piece) => piece === P2 || piece === P2K;
const isKing = (piece) => piece === P1K || piece === P2K;

const getMoves = (board, r, c) => {
    const piece = board[r][c];
    if (!piece) return [];
    const moves = [];
    const dirs = isKing(piece) ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] :
        isPlayer(piece) ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

    for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
            if (board[nr][nc] === EMPTY) moves.push({ to: [nr, nc], capture: null });
            else {
                const jr = nr + dr, jc = nc + dc;
                if (jr >= 0 && jr < SIZE && jc >= 0 && jc < SIZE && board[jr][jc] === EMPTY) {
                    const enemy = board[nr][nc];
                    if ((isPlayer(piece) && isAI(enemy)) || (isAI(piece) && isPlayer(enemy)))
                        moves.push({ to: [jr, jc], capture: [nr, nc] });
                }
            }
        }
    }
    return moves;
};

const MiniCheckers = ({ onComplete }) => {
    const [board, setBoard] = useState(initBoard);
    const [selected, setSelected] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [turn, setTurn] = useState("player");
    const [done, setDone] = useState(false);

    const promote = (b) => {
        for (let c = 0; c < SIZE; c++) {
            if (b[0][c] === P1) b[0][c] = P1K;
            if (b[SIZE - 1][c] === P2) b[SIZE - 1][c] = P2K;
        }
    };

    const checkWin = useCallback((b) => {
        let hasP1 = false, hasP2 = false;
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++) {
                if (isPlayer(b[r][c])) hasP1 = true;
                if (isAI(b[r][c])) hasP2 = true;
            }
        if (!hasP2) return "player";
        if (!hasP1) return "ai";
        return null;
    }, []);

    const aiMove = useCallback((b) => {
        const allMoves = [];
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (isAI(b[r][c])) {
                    const moves = getMoves(b, r, c);
                    moves.forEach(m => allMoves.push({ from: [r, c], ...m }));
                }
        if (allMoves.length === 0) return b;

        const captures = allMoves.filter(m => m.capture);
        const chosen = captures.length > 0
            ? captures[Math.floor(Math.random() * captures.length)]
            : allMoves[Math.floor(Math.random() * allMoves.length)];

        const newB = b.map(row => [...row]);
        newB[chosen.to[0]][chosen.to[1]] = newB[chosen.from[0]][chosen.from[1]];
        newB[chosen.from[0]][chosen.from[1]] = EMPTY;
        if (chosen.capture) newB[chosen.capture[0]][chosen.capture[1]] = EMPTY;
        promote(newB);
        return newB;
    }, []);

    const handleClick = useCallback((r, c) => {
        if (done || turn !== "player") return;

        if (selected) {
            const move = validMoves.find(m => m.to[0] === r && m.to[1] === c);
            if (move) {
                const newB = board.map(row => [...row]);
                newB[r][c] = newB[selected[0]][selected[1]];
                newB[selected[0]][selected[1]] = EMPTY;
                if (move.capture) newB[move.capture[0]][move.capture[1]] = EMPTY;
                promote(newB);

                const winner = checkWin(newB);
                if (winner) {
                    setBoard(newB);
                    setDone(true);
                    setTimeout(() => onComplete(winner === "player" ? 85 : 30), 500);
                    return;
                }

                setBoard(newB);
                setSelected(null);
                setValidMoves([]);
                setTurn("ai");

                setTimeout(() => {
                    const afterAI = aiMove(newB);
                    setBoard(afterAI);
                    const w = checkWin(afterAI);
                    if (w) {
                        setDone(true);
                        setTimeout(() => onComplete(w === "player" ? 85 : 30), 300);
                    } else {
                        setTurn("player");
                    }
                }, 500);
            } else {
                if (isPlayer(board[r][c])) {
                    setSelected([r, c]);
                    setValidMoves(getMoves(board, r, c));
                } else {
                    setSelected(null);
                    setValidMoves([]);
                }
            }
        } else {
            if (isPlayer(board[r][c])) {
                setSelected([r, c]);
                setValidMoves(getMoves(board, r, c));
            }
        }
    }, [selected, validMoves, board, turn, done, checkWin, aiMove, onComplete]);

    const CELL = 52;
    const colors = { [P1]: "#2d2d2d", [P2]: "#e8e8e8", [P1K]: "#1a1a1a", [P2K]: "#fff" };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                {done ? "게임 종료!" : turn === "player" ? "당신의 차례 (어두운 말)" : "AI 생각 중..."}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, ${CELL}px)`, gap: "0px", borderRadius: "8px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
                {Array.from({ length: SIZE * SIZE }, (_, idx) => {
                    const r = Math.floor(idx / SIZE), c = idx % SIZE;
                    const isDark = (r + c) % 2 === 1;
                    const piece = board[r][c];
                    const isSel = selected && selected[0] === r && selected[1] === c;
                    const isValidTarget = validMoves.some(m => m.to[0] === r && m.to[1] === c);
                    return (
                        <div key={idx} onClick={() => handleClick(r, c)} style={{
                            width: CELL, height: CELL, cursor: "pointer",
                            background: isSel ? "rgba(100,255,218,0.3)" : isDark ? "#5a3e28" : "#d4a76a",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative",
                        }}>
                            {isValidTarget && <div style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "rgba(100,255,218,0.5)" }} />}
                            {piece !== EMPTY && (
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: colors[piece],
                                    border: `3px solid ${isKing(piece) ? "#FFD700" : "rgba(128,128,128,0.5)"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "14px", boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                }}>
                                    {isKing(piece) ? "👑" : ""}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>어두운 말을 선택하고 이동할 칸을 클릭</div>
        </div>
    );
};

export default MiniCheckers;
