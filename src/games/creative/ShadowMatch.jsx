/**
 * 🎮 Game 57: Shadow Match — silhouette compare + vignette effects
 */
import { useCallback, useState } from "react";

const ITEMS = [
    { emoji: "🐕", silhouettes: ["🐕", "🐈", "🐇", "🦊"] },
    { emoji: "🚗", silhouettes: ["🚗", "🚕", "🏎️", "🚌"] },
    { emoji: "🌸", silhouettes: ["🌸", "🌺", "🌻", "🌷"] },
    { emoji: "⭐", silhouettes: ["⭐", "💫", "✨", "🌟"] },
    { emoji: "🍎", silhouettes: ["🍎", "🍐", "🍊", "🍑"] },
    { emoji: "🏠", silhouettes: ["🏠", "🏡", "🏢", "🏫"] },
    { emoji: "🎸", silhouettes: ["🎸", "🎹", "🎺", "🥁"] },
    { emoji: "🦁", silhouettes: ["🦁", "🐯", "🐻", "🐼"] },
];
const ROUNDS = 8;

const ShadowMatch = ({ onComplete }) => {
    const [items] = useState(() => [...ITEMS].sort(() => Math.random() - 0.5));
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [shuffled] = useState(() => ITEMS.map((item) => [...item.silhouettes].sort(() => Math.random() - 0.5)));

    const current = items[round % ITEMS.length];
    const choices = shuffled[round % ITEMS.length];

    const handleChoice = useCallback((choice) => {
        if (feedback) return;
        const isC = choice === current.emoji;
        if (isC) setCorrect((c) => c + 1);
        setFeedback({ isCorrect: isC, answer: current.emoji, selected: choice });

        setTimeout(() => {
            const next = round + 1;
            if (next >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(next); setFeedback(null); }
        }, 800);
    }, [current, round, correct, feedback, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes shadowReveal { 0% { filter: brightness(0) contrast(3); } 100% { filter: brightness(1) contrast(1); } }
                @keyframes choiceHover { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | Answer <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>What does this shadow really look like?</div>

            {/* Shadow card */}
            <div style={{
                width: 100, height: 100, borderRadius: "20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "56px",
                background: "radial-gradient(circle, #1a1a3e, #0a0a1e)",
                border: "3px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.5)",
                filter: feedback ? "brightness(1) contrast(1)" : "brightness(0.15) contrast(2.5)",
                animation: feedback ? "shadowReveal 0.5s ease" : "none",
                transition: "filter 0.3s ease",
            }}>
                {current.emoji}
            </div>

            {/* Choices */}
            <div style={{ display: "flex", gap: "10px" }}>
                {choices.map((s, i) => {
                    const isCorrectChoice = feedback && s === current.emoji;
                    const isWrongSelected = feedback && s === feedback.selected && !feedback.isCorrect;

                    return (
                        <button key={i} onClick={() => handleChoice(s)}
                            disabled={!!feedback}
                            style={{
                                width: 64, height: 64, fontSize: "34px",
                                borderRadius: "14px", cursor: feedback ? "default" : "pointer",
                                background: isCorrectChoice ? "rgba(100,255,218,0.2)"
                                    : isWrongSelected ? "rgba(255,107,107,0.15)"
                                        : "rgba(255,255,255,0.05)",
                                border: isCorrectChoice ? "3px solid #64ffda"
                                    : isWrongSelected ? "3px solid #FF6B6B"
                                        : "2px solid rgba(255,255,255,0.12)",
                                boxShadow: isCorrectChoice ? "0 0 15px rgba(100,255,218,0.3)" : "0 4px 12px rgba(0,0,0,0.2)",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => { if (!feedback) { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.borderColor = "#FFD700"; } }}
                            onMouseLeave={(e) => { if (!feedback) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; } }}
                        >{s}</button>
                    );
                })}
            </div>

            {feedback && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback.isCorrect ? "#64ffda" : "#FF6B6B" }}>
                    {feedback.isCorrect ? "✅ Correct!" : "❌ Wrong"}
                </div>
            )}
        </div>
    );
};

export default ShadowMatch;
