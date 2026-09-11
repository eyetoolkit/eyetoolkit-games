/**
 * 🎮 Game 30: Triple Triad
 * Place cards on a 3×3 board to capture!
 * Each card has 4 numbers; the higher adjacent number captures.
 */
import { useCallback, useEffect, useState } from "react";

const genCard = () => ({
    top: Math.floor(Math.random() * 9) + 1,
    right: Math.floor(Math.random() * 9) + 1,
    bottom: Math.floor(Math.random() * 9) + 1,
    left: Math.floor(Math.random() * 9) + 1,
});

const TripleTriad = ({ onComplete }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [playerHand, setPlayerHand] = useState([]);
    const [aiHand, setAiHand] = useState([]);
    const [selected, setSelected] = useState(null);
    const [turn, setTurn] = useState("player");
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setPlayerHand(Array.from({ length: 5 }, () => ({ ...genCard(), owner: "player" })));
        setAiHand(Array.from({ length: 5 }, () => ({ ...genCard(), owner: "ai" })));
    }, []);

    const flip = useCallback((b, idx, card) => {
        const nb = [...b];
        nb[idx] = card;
        const r = Math.floor(idx / 3), c = idx % 3;
        const adj = [
            { dr: -1, dc: 0, myFace: "top", oppFace: "bottom" },
            { dr: 1, dc: 0, myFace: "bottom", oppFace: "top" },
            { dr: 0, dc: -1, myFace: "left", oppFace: "right" },
            { dr: 0, dc: 1, myFace: "right", oppFace: "left" },
        ];
        for (const { dr, dc, myFace, oppFace } of adj) {
            const nr = r + dr, nc = c + dc, ni = nr * 3 + nc;
            if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 && nb[ni]) {
                if (nb[ni].owner !== card.owner && card[myFace] > nb[ni][oppFace]) {
                    nb[ni] = { ...nb[ni], owner: card.owner };
                }
            }
        }
        return nb;
    }, []);

    const handlePlace = useCallback((idx) => {
        if (gameOver || board[idx] || turn !== "player" || selected === null) return;
        const card = { ...playerHand[selected], owner: "player" };
        const nb = flip(board, idx, card);
        setBoard(nb);
        setPlayerHand((h) => h.filter((_, i) => i !== selected));
        setSelected(null);

        // Check end
        if (nb.every(c => c !== null)) {
            endGame(nb); return;
        }
        setTurn("ai");
    }, [board, turn, selected, playerHand, flip, gameOver]);

    // AI turn
    useEffect(() => {
        if (turn !== "ai" || aiHand.length === 0 || gameOver) return;
        const timer = setTimeout(() => {
            const empties = board.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
            if (empties.length === 0) return;
            const cardIdx = 0;
            const pos = empties[Math.floor(Math.random() * empties.length)];
            const card = { ...aiHand[cardIdx], owner: "ai" };
            const nb = flip(board, pos, card);
            setBoard(nb);
            setAiHand((h) => h.filter((_, i) => i !== cardIdx));
            if (nb.every(c => c !== null)) { endGame(nb); return; }
            setTurn("player");
        }, 600);
        return () => clearTimeout(timer);
    }, [turn, aiHand, board, flip, gameOver]);

    const endGame = (b) => {
        let pCount = 0, aCount = 0;
        for (const c of b) { if (c?.owner === "player") pCount++; else aCount++; }
        setGameOver(true);
        const score = pCount > aCount ? Math.min(100, 50 + (pCount - aCount) * 10) : Math.max(20, 50 - (aCount - pCount) * 8);
        setTimeout(() => onComplete(score), 800);
    };

    const renderCard = (card, small = false) => {
        const s = small ? 40 : 60;
        const fs = small ? "10px" : "13px";
        const isP = card.owner === "player";
        return (
            <div style={{
                width: s, height: s, borderRadius: "6px",
                background: isP ? "linear-gradient(135deg, #3B82F6, #1D4ED8)" : "linear-gradient(135deg, #EF4444, #B91C1C)",
                display: "grid", gridTemplateRows: "1fr 1fr 1fr", gridTemplateColumns: "1fr 1fr 1fr",
                fontSize: fs, fontWeight: "bold", color: "white", textAlign: "center",
                border: "1px solid rgba(255,255,255,0.2)",
            }}>
                <div /><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{card.top}</div><div />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{card.left}</div>
                <div />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{card.right}</div>
                <div /><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{card.bottom}</div><div />
            </div>
        );
    };

    let pScore = 0, aScore = 0;
    for (const c of board) { if (c?.owner === "player") pScore++; else if (c?.owner === "ai") aScore++; }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>🔵 {pScore + playerHand.length} — 🔴 {aScore + aiHand.length}
                <span style={{ marginLeft: 8, color: "#8892b0", fontSize: "11px" }}>{gameOver ? "" : turn === "player" ? "My turn" : "AI's turn"}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 64px)", gap: "4px", padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: gameOver ? "3px solid #FFD700" : "2px solid rgba(255,255,255,0.06)" }}>
                {board.map((cell, i) => (
                    <div key={i} onClick={() => handlePlace(i)} style={{
                        width: 64, height: 64, borderRadius: "6px",
                        background: cell ? "transparent" : "rgba(255,255,255,0.03)",
                        border: cell ? "none" : "2px dashed rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: !cell && turn === "player" && selected !== null ? "pointer" : "default",
                    }}>
                        {cell && renderCard(cell)}
                    </div>
                ))}
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>My card (click to select):</div>
            <div style={{ display: "flex", gap: "6px" }}>
                {playerHand.map((card, i) => (
                    <div key={i} onClick={() => setSelected(i)} style={{
                        cursor: "pointer", borderRadius: "8px",
                        border: selected === i ? "2px solid #FFD700" : "2px solid transparent",
                        padding: "2px",
                    }}>
                        {renderCard(card, true)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TripleTriad;
