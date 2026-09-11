/**
 * 🎮 Game 112: 바둑 (9×9)
 * 미니 바둑판 — 간단한 AI와 대전
 */
import { useState, useCallback } from "react";

const SIZE = 9;
const EMPTY = 0, BLACK = 1, WHITE = 2;

const createBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));

const getGroup = (board, r, c, visited = new Set()) => {
    const color = board[r][c];
    if (color === EMPTY) return { stones: [], liberties: new Set() };
    const key = `${r},${c}`;
    if (visited.has(key)) return { stones: [], liberties: new Set() };
    visited.add(key);
    const group = { stones: [[r, c]], liberties: new Set() };
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
        if (board[nr][nc] === EMPTY) group.liberties.add(`${nr},${nc}`);
        else if (board[nr][nc] === color) {
            const sub = getGroup(board, nr, nc, visited);
            group.stones.push(...sub.stones);
            sub.liberties.forEach(l => group.liberties.add(l));
        }
    }
    return group;
};

const removeCaptures = (board, color) => {
    const newB = board.map(r => [...r]);
    let captured = 0;
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
            if (newB[r][c] === color) {
                const g = getGroup(newB, r, c);
                if (g.liberties.size === 0) {
                    g.stones.forEach(([sr, sc]) => { newB[sr][sc] = EMPTY; captured++; });
                }
            }
    return { board: newB, captured };
};

const MiniGo = ({ onComplete }) => {
    const [board, setBoard] = useState(createBoard);
    const [turn, setTurn] = useState(BLACK);
    const [scores, setScores] = useState({ black: 0, white: 0 });
    const [passes, setPasses] = useState(0);
    const [done, setDone] = useState(false);
    const [moveCount, setMoveCount] = useState(0);

    const placeStone = useCallback((r, c) => {
        if (done || board[r][c] !== EMPTY || turn !== BLACK) return;

        const newB = board.map(row => [...row]);
        newB[r][c] = BLACK;
        const opponent = WHITE;

        // Remove opponent captures
        const { board: afterCap, captured } = removeCaptures(newB, opponent);
        // Check self-capture (suicide)
        const selfGroup = getGroup(afterCap, r, c);
        if (selfGroup.liberties.size === 0 && captured === 0) return; // illegal

        const newScores = { ...scores, black: scores.black + captured };
        setBoard(afterCap);
        setScores(newScores);
        setPasses(0);
        setMoveCount(m => m + 1);
        setTurn(WHITE);

        // Simple AI: play after delay
        setTimeout(() => {
            const empties = [];
            for (let rr = 0; rr < SIZE; rr++)
                for (let cc = 0; cc < SIZE; cc++)
                    if (afterCap[rr][cc] === EMPTY) empties.push([rr, cc]);

            // Shuffle and try
            empties.sort(() => Math.random() - 0.5);
            let played = false;
            for (const [ar, ac] of empties) {
                const tryB = afterCap.map(row => [...row]);
                tryB[ar][ac] = WHITE;
                const { board: tryCap, captured: aiCap } = removeCaptures(tryB, BLACK);
                const g = getGroup(tryCap, ar, ac);
                if (g.liberties.size > 0) {
                    setBoard(tryCap);
                    setScores(prev => ({ ...prev, white: prev.white + aiCap }));
                    setPasses(0);
                    played = true;
                    break;
                }
            }
            if (!played) {
                setPasses(p => {
                    if (p >= 1) {
                        setDone(true);
                        const playerWins = newScores.black >= scores.white;
                        setTimeout(() => onComplete(playerWins ? 80 : 40), 500);
                    }
                    return p + 1;
                });
            }
            setTurn(BLACK);
            setMoveCount(m => m + 1);
        }, 400);
    }, [board, turn, scores, done, onComplete]);

    const handlePass = useCallback(() => {
        if (done) return;
        const newPasses = passes + 1;
        setPasses(newPasses);
        if (newPasses >= 2) {
            setDone(true);
            const playerWins = scores.black >= scores.white + 2.5; // komi
            setTimeout(() => onComplete(playerWins ? 80 : 40), 500);
            return;
        }
        setTurn(WHITE);
        setTimeout(() => {
            setPasses(p => p + 1);
            setDone(true);
            setTimeout(() => onComplete(scores.black >= scores.white + 2.5 ? 80 : 40), 500);
        }, 400);
    }, [done, passes, scores, onComplete]);

    const CELL = 34;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>⚫ 흑(나): <span style={{ color: "#64ffda" }}>{scores.black}</span></span>
                <span>⚪ 백(AI): <span style={{ color: "#FFD700" }}>{scores.white}</span></span>
                <span>수: {moveCount}</span>
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, ${CELL}px)`, gap: "0px",
                padding: "8px", background: "#C4A35A", borderRadius: "4px",
                border: "2px solid rgba(0,0,0,0.3)",
            }}>
                {Array.from({ length: SIZE * SIZE }, (_, idx) => {
                    const r = Math.floor(idx / SIZE), c = idx % SIZE;
                    const stone = board[r][c];
                    const isStarPoint = [2, 4, 6].includes(r) && [2, 4, 6].includes(c);
                    return (
                        <div key={idx} onClick={() => placeStone(r, c)} style={{
                            width: CELL, height: CELL, position: "relative", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {/* Grid lines */}
                            <div style={{ position: "absolute", width: "100%", height: "1px", background: "#333", top: "50%" }} />
                            <div style={{ position: "absolute", height: "100%", width: "1px", background: "#333", left: "50%" }} />
                            {isStarPoint && stone === EMPTY && (
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#333", zIndex: 1 }} />
                            )}
                            {stone !== EMPTY && (
                                <div style={{
                                    width: CELL - 4, height: CELL - 4, borderRadius: "50%", zIndex: 2,
                                    background: stone === BLACK
                                        ? "radial-gradient(circle at 30% 30%, #555, #111)"
                                        : "radial-gradient(circle at 30% 30%, #fff, #ccc)",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
            <button onClick={handlePass} style={{
                padding: "8px 20px", fontSize: "13px", background: "rgba(255,255,255,0.1)",
                color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", cursor: "pointer",
            }}>
                패스
            </button>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>교차점을 클릭해 돌 놓기 | 덤 2.5</div>
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>
                게임 종료! {scores.black >= scores.white + 2.5 ? "흑 승리!" : "백 승리!"}
            </div>}
        </div>
    );
};

export default MiniGo;
