/**
 * 🎮 Game 113: Poker Hand
 * Make the best 5-card hand
 */
import { useState, useCallback } from "react";

const SUITS = ["spade", "heart", "diamond", "club"];
const SUIT_DISPLAY = { spade: "\u2660", heart: "\u2665", diamond: "\u2666", club: "\u2663" };
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUIT_COLORS = { spade: "#fff", heart: "#FF6B6B", diamond: "#FF6B6B", club: "#fff" };

const createDeck = () => {
    const deck = [];
    for (const suit of SUITS)
        for (const rank of RANKS)
            deck.push({ suit, rank, value: RANKS.indexOf(rank) });
    return deck.sort(() => Math.random() - 0.5);
};

const evalHand = (hand) => {
    const vals = hand.map(c => c.value).sort((a, b) => a - b);
    const suits = hand.map(c => c.suit);
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = vals.every((v, i) => i === 0 || v === vals[i - 1] + 1) ||
        (vals[0] === 0 && vals[1] === 1 && vals[2] === 2 && vals[3] === 3 && vals[4] === 12);

    const counts = {};
    vals.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    const freq = Object.values(counts).sort((a, b) => b - a);

    if (isFlush && isStraight) return { name: "Straight Flush", score: 100 };
    if (freq[0] === 4) return { name: "Four of a Kind", score: 90 };
    if (freq[0] === 3 && freq[1] === 2) return { name: "Full House", score: 80 };
    if (isFlush) return { name: "Flush", score: 70 };
    if (isStraight) return { name: "Straight", score: 60 };
    if (freq[0] === 3) return { name: "Three of a Kind", score: 50 };
    if (freq[0] === 2 && freq[1] === 2) return { name: "Two Pair", score: 40 };
    if (freq[0] === 2) return { name: "One Pair", score: 30 };
    return { name: "High Card", score: 15 };
};

const PokerHand = ({ onComplete }) => {
    const [deck] = useState(createDeck);
    const [hand, setHand] = useState(() => deck.slice(0, 5));
    const [remaining] = useState(() => deck.slice(5));
    const [held, setHeld] = useState(new Set());
    const [drawn, setDrawn] = useState(false);
    const [done, setDone] = useState(false);
    const [result, setResult] = useState(null);
    const [drawIdx, setDrawIdx] = useState(0);

    const toggleHold = useCallback((idx) => {
        if (drawn || done) return;
        setHeld(prev => {
            const n = new Set(prev);
            n.has(idx) ? n.delete(idx) : n.add(idx);
            return n;
        });
    }, [drawn, done]);

    const draw = useCallback(() => {
        if (drawn || done) return;
        const newHand = [...hand];
        let di = drawIdx;
        for (let i = 0; i < 5; i++) {
            if (!held.has(i) && di < remaining.length) {
                newHand[i] = remaining[di];
                di++;
            }
        }
        setDrawIdx(di);
        setHand(newHand);
        setDrawn(true);
        const evalResult = evalHand(newHand);
        setResult(evalResult);
        setDone(true);
        setTimeout(() => onComplete(evalResult.score), 800);
    }, [drawn, done, hand, held, remaining, drawIdx, onComplete]);

    const currentEval = evalHand(hand);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                {!drawn ? "Keep cards, then draw" : "Result"}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                {hand.map((card, i) => (
                    <div key={i} onClick={() => toggleHold(i)} style={{
                        width: 60, height: 88, borderRadius: "8px", cursor: drawn ? "default" : "pointer",
                        background: held.has(i) ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.06)",
                        border: held.has(i) ? "2px solid #64ffda" : "2px solid rgba(255,255,255,0.15)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s", position: "relative",
                    }}>
                        <span style={{ fontSize: "22px", color: SUIT_COLORS[card.suit] }}>{SUIT_DISPLAY[card.suit]}</span>
                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>{card.rank}</span>
                        {held.has(i) && <span style={{
                            position: "absolute", top: -8, fontSize: "10px", padding: "1px 6px",
                            background: "#64ffda", color: "#000", borderRadius: "8px", fontWeight: "bold",
                        }}>HOLD</span>}
                    </div>
                ))}
            </div>
            <div style={{ fontSize: "14px", color: "#FFD700" }}>{currentEval.name}</div>
            {!drawn && (
                <button onClick={draw} style={{
                    padding: "10px 28px", fontSize: "15px", fontWeight: "bold",
                    background: "linear-gradient(135deg, #4D96FF, #6BCB77)", color: "white",
                    border: "none", borderRadius: "12px", cursor: "pointer",
                }}>
                    Draw
                </button>
            )}
            {done && result && <div style={{ fontSize: "18px", color: "#64ffda", fontWeight: "bold" }}>{result.name}!</div>}
            <div style={{ fontSize: "11px", color: "#8892b0" }}>Selected = HOLD, the rest redraw</div>
        </div>
    );
};

export default PokerHand;
