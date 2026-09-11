/**
 * 🎮 Game 23: Solitaire — card hover + match effects + progress bar
 */
import { useCallback, useEffect, useState } from "react";

const SUITS = ["♠", "♥", "♦", "♣"];

const MiniSolitaire = ({ onComplete }) => {
    const [columns, setColumns] = useState([[], [], [], []]);
    const [deck, setDeck] = useState([]);
    const [selected, setSelected] = useState(null);
    const [removed, setRemoved] = useState(0);
    const [moves, setMoves] = useState(0);
    const [totalCards, setTotalCards] = useState(24);

    useEffect(() => {
        const cards = [];
        for (const s of SUITS) { for (let r = 1; r <= 6; r++) cards.push({ suit: s, rank: r, id: `${s}${r}` }); }
        for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[cards[i], cards[j]] = [cards[j], cards[i]]; }
        const cols = [[], [], [], []];
        for (let i = 0; i < 12; i++) cols[i % 4].push(cards.pop());
        setColumns(cols); setDeck(cards); setTotalCards(24);
    }, []);

    const handleSelect = useCallback((colIdx) => {
        const col = columns[colIdx]; if (col.length === 0) return;
        if (selected === null) { setSelected(colIdx); }
        else if (selected === colIdx) { setSelected(null); }
        else {
            const selCard = columns[selected][columns[selected].length - 1];
            const topCard = col[col.length - 1];
            if (selCard.rank === topCard.rank) {
                const newCols = columns.map((c, i) => (i === selected || i === colIdx) ? c.slice(0, -1) : c);
                setColumns(newCols); setRemoved((r) => r + 2); setMoves((m) => m + 1);
                const totalLeft = newCols.reduce((a, c) => a + c.length, 0) + deck.length;
                if (totalLeft === 0) setTimeout(() => onComplete(Math.min(100, Math.max(40, 100 - moves * 2))), 500);
            }
            setSelected(null);
        }
    }, [columns, selected, deck, moves, onComplete]);

    const drawCards = useCallback(() => {
        if (deck.length === 0) return;
        const newCols = columns.map((c) => [...c]); const newDeck = [...deck];
        for (let i = 0; i < 4 && newDeck.length > 0; i++) newCols[i].push(newDeck.pop());
        setColumns(newCols); setDeck(newDeck); setMoves((m) => m + 1);
    }, [deck, columns]);

    const giveUp = useCallback(() => { onComplete(Math.min(80, Math.round(removed * 4))); }, [removed, onComplete]);
    const rankDisplay = (r) => r === 1 ? "A" : String(r);
    const progress = Math.round((removed / totalCards) * 100);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ display: "flex", gap: "14px", fontSize: "13px" }}>
                <span>Moves: <span style={{ color: "#FFD700" }}>{moves}</span></span>
                <span>Cleared: <span style={{ color: "#64ffda" }}>{removed}</span>/{totalCards}</span>
                <span>Deck: <span style={{ color: "#0cbfff" }}>{deck.length}</span></span>
            </div>
            <div style={{ width: 240, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #64ffda, #22C55E)", borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                {columns.map((col, ci) => (
                    <div key={ci} onClick={() => handleSelect(ci)}
                        style={{
                            width: 60, minHeight: 180,
                            background: selected === ci ? "rgba(100,255,218,0.08)" : "rgba(255,255,255,0.02)",
                            border: selected === ci ? "2px solid #64ffda" : "2px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px", padding: "6px 4px",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                            cursor: "pointer", transition: "all 0.15s",
                        }}
                    >
                        {col.map((card, i) => {
                            const isTop = i === col.length - 1;
                            const isRed = card.suit === "♥" || card.suit === "♦";
                            return (
                                <div key={card.id} style={{
                                    width: 48, height: 30, borderRadius: "6px",
                                    background: "white", color: isRed ? "#EF4444" : "#1a1a2e",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "11px", fontWeight: "bold",
                                    border: isTop && selected === ci ? "2px solid #FFD700" : "1px solid #e0e0e0",
                                    boxShadow: isTop ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
                                    transform: isTop ? "scale(1)" : "scale(0.97)",
                                    transition: "all 0.15s",
                                }}>{rankDisplay(card.rank)}{card.suit}</div>
                            );
                        })}
                        {col.length === 0 && <div style={{ fontSize: "18px", opacity: 0.15 }}>□</div>}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={drawCards} disabled={deck.length === 0}
                    style={{ ...btnS, opacity: deck.length === 0 ? 0.3 : 1 }}>📥 Draw ({deck.length})</button>
                <button onClick={giveUp} style={btnS}>🏳️ Give up</button>
            </div>
            <div style={{ fontSize: "10px", color: "#8892b0" }}>Select two matching cards to remove</div>
        </div>
    );
};

const btnS = { padding: "6px 14px", fontSize: "12px", background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", cursor: "pointer" };

export default MiniSolitaire;
