/**
 * 🎮 Game 139: Card Fortune
 * Draw 3 fortune cards — tarot visuals
 */
import { useState, useCallback } from "react";

const CARDS = [
    { name: "Sun", meaning: "Success and happiness", score: 90, emoji: "sun" },
    { name: "Moon", meaning: "Intuition and dreams", score: 70, emoji: "moon" },
    { name: "Star", meaning: "Hope and inspiration", score: 80, emoji: "star" },
    { name: "Tower", meaning: "Sudden change", score: 40, emoji: "tower" },
    { name: "Chariot", meaning: "Victory and progress", score: 85, emoji: "chariot" },
    { name: "World", meaning: "Completion and achievement", score: 95, emoji: "world" },
    { name: "Hermit", meaning: "Reflection and wisdom", score: 60, emoji: "hermit" },
    { name: "Strength", meaning: "Courage and patience", score: 75, emoji: "strength" },
    { name: "Wheel", meaning: "Turning of fate", score: 50, emoji: "wheel" },
    { name: "Justice", meaning: "Fairness and balance", score: 65, emoji: "justice" },
    { name: "Lovers", meaning: "Choice and love", score: 80, emoji: "lovers" },
    { name: "Emperor", meaning: "Authority and stability", score: 70, emoji: "emperor" },
];

const EMOJIS = {
    sun: "☀️", moon: "🌙", star: "⭐", tower: "🏰",
    chariot: "🚀", world: "🌍", hermit: "🧙", strength: "💪",
    wheel: "☸️", justice: "⚖️", lovers: "❤️", emperor: "👑",
};

const CARD_COLORS = {
    sun: "#FFD700", moon: "#9B59B6", star: "#4D96FF", tower: "#EF4444",
    chariot: "#22C55E", world: "#3B82F6", hermit: "#8892b0", strength: "#FF6B6B",
    wheel: "#F97316", justice: "#A855F7", lovers: "#EC4899", emperor: "#FFD700",
};

const CardFortune = ({ onComplete }) => {
    const [deck] = useState(() => [...CARDS].sort(() => Math.random() - 0.5));
    const [drawn, setDrawn] = useState([]);
    const [flipped, setFlipped] = useState(new Set());
    const [done, setDone] = useState(false);
    const [drawing, setDrawing] = useState(false);
    const maxDraw = 3;

    const drawCard = useCallback(() => {
        if (done || drawn.length >= maxDraw || drawing) return;
        setDrawing(true);
        setTimeout(() => {
            const card = deck[drawn.length];
            setDrawn(prev => [...prev, card]);
            setDrawing(false);
        }, 400);
    }, [deck, drawn, done, drawing]);

    const flipCard = useCallback((idx) => {
        if (flipped.has(idx)) return;
        const newFlipped = new Set(flipped);
        newFlipped.add(idx);
        setFlipped(newFlipped);

        if (newFlipped.size === drawn.length && drawn.length === maxDraw) {
            setDone(true);
            const avgScore = Math.round(drawn.reduce((s, c) => s + c.score, 0) / drawn.length);
            setTimeout(() => onComplete(avgScore), 1200);
        }
    }, [flipped, drawn, done, onComplete]);

    const avgScore = done ? Math.round(drawn.reduce((s, c) => s + c.score, 0) / drawn.length) : 0;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes cardDraw { from{transform:translateY(30px) rotateZ(-5deg) scale(0.8);opacity:0} to{transform:translateY(0) rotateZ(0) scale(1);opacity:1} }
                @keyframes cardFlip { 0%{transform:rotateY(0)} 50%{transform:rotateY(90deg)} 100%{transform:rotateY(0)} }
                @keyframes mysticalGlow { 0%,100%{box-shadow:0 0 15px rgba(155,89,182,0.3)} 50%{box-shadow:0 0 30px rgba(155,89,182,0.6)} }
                @keyframes fortuneReveal { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
            `}</style>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#9B59B6", letterSpacing: "2px" }}>
                ✨ Tarot Fortune ✨
            </div>
            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{drawn.length}/{maxDraw} drawn</span>
                {flipped.size > 0 && flipped.size < drawn.length && <span style={{ color: "#9B59B6", marginLeft: "8px" }}>Flip the card</span>}
            </div>
            <div style={{ display: "flex", gap: "12px", perspective: "600px" }}>
                {drawn.map((card, i) => {
                    const isFlipped = flipped.has(i);
                    const color = CARD_COLORS[card.emoji] || "#9B59B6";
                    return (
                        <div key={i} onClick={() => flipCard(i)} style={{
                            width: 82, height: 126, borderRadius: "12px",
                            cursor: isFlipped ? "default" : "pointer",
                            animation: `cardDraw 0.5s ease ${i * 0.15}s both${isFlipped ? ", cardFlip 0.5s ease" : ""}`,
                            background: isFlipped
                                ? `linear-gradient(145deg, ${color}22, ${color}08)`
                                : "linear-gradient(145deg, #4D96FF, #2563EB)",
                            border: isFlipped ? `2px solid ${color}66` : "2px solid rgba(255,255,255,0.2)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            transition: "all 0.3s", gap: "6px",
                            boxShadow: isFlipped
                                ? `0 8px 24px ${color}33`
                                : "0 4px 16px rgba(77,150,255,0.3)",
                        }}>
                            {isFlipped ? (
                                <>
                                    <span style={{ fontSize: "32px", filter: `drop-shadow(0 0 8px ${color})` }}>{EMOJIS[card.emoji]}</span>
                                    <span style={{ fontSize: "13px", fontWeight: "bold", color }}>{card.name}</span>
                                    <span style={{ fontSize: "9px", color: "#8892b0", textAlign: "center", padding: "0 4px", lineHeight: "1.3" }}>{card.meaning}</span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: "32px", animation: "mysticalGlow 2s ease infinite" }}>🂠</span>
                                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>click to flip</span>
                                </>
                            )}
                        </div>
                    );
                })}
                {drawn.length < maxDraw && Array.from({ length: maxDraw - drawn.length }, (_, i) => (
                    <div key={`empty-${i}`} style={{
                        width: 82, height: 126, borderRadius: "12px",
                        border: "2px dashed rgba(155,89,182,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", color: "#8892b0",
                    }}>?</div>
                ))}
            </div>
            {drawn.length < maxDraw && (
                <button onClick={drawCard} disabled={drawing} style={{
                    padding: "12px 30px", fontSize: "15px", fontWeight: "bold",
                    background: drawing ? "rgba(155,89,182,0.1)" : "linear-gradient(135deg, #9B59B6, #6BCB77)",
                    color: "white", border: "none", borderRadius: "14px",
                    cursor: drawing ? "wait" : "pointer",
                    boxShadow: "0 4px 16px rgba(155,89,182,0.3)",
                    transition: "all 0.3s",
                }}>🎴 {drawing ? "Drawing..." : "Draw a card"}</button>
            )}
            {done && (
                <div style={{
                    textAlign: "center", animation: "fortuneReveal 0.6s ease",
                    padding: "12px 20px", borderRadius: "14px",
                    background: "rgba(155,89,182,0.1)",
                    border: "1px solid rgba(155,89,182,0.2)",
                }}>
                    <div style={{
                        fontSize: "18px", fontWeight: "bold",
                        color: avgScore >= 80 ? "#64ffda" : avgScore >= 60 ? "#FFD700" : "#FF6B6B",
                    }}>
                        {avgScore >= 80 ? "🌟 Great fortune!" : avgScore >= 60 ? "✨ Lucky!" : "🌊 Neutral!"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9B59B6", marginTop: "4px" }}>
                        {drawn.map(c => c.name).join(" · ")}
                    </div>
                    <div style={{ fontSize: "11px", color: "#8892b0", marginTop: "2px" }}>
                        {drawn.map(c => c.meaning).join(", ")}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardFortune;
