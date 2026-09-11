/**
 * 🎮 Game 43: Pattern Recognition — CSS shape pattern visualization
 */
import { useCallback, useState } from "react";

const SHAPES = ["●", "■", "▲", "◆", "★"];
const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#FFD700", "#A855F7"];

const genPattern = () => {
    const len = 3 + Math.floor(Math.random() * 2);
    const base = Array.from({ length: len }, () => ({
        shape: Math.floor(Math.random() * SHAPES.length),
        color: Math.floor(Math.random() * COLORS.length),
    }));
    // Repeat pattern and pick answer position
    const sequence = [...base, ...base, ...base.slice(0, 2)];
    const answerIdx = base.length + Math.floor(Math.random() * base.length);
    const answer = sequence[answerIdx];
    const wrong = Array.from({ length: 3 }, () => ({
        shape: Math.floor(Math.random() * SHAPES.length),
        color: Math.floor(Math.random() * COLORS.length),
    }));
    return { sequence, answerIdx, answer, choices: [answer, ...wrong].sort(() => Math.random() - 0.5) };
};

const ROUNDS = 6;

const PatternRecognition = ({ onComplete }) => {
    const [pattern, setPattern] = useState(genPattern);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const handleChoice = useCallback((choice) => {
        if (feedback) return;
        const isC = choice.shape === pattern.answer.shape && choice.color === pattern.answer.color;
        if (isC) setCorrect((c) => c + 1);
        setFeedback(isC ? "correct" : "wrong");

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(n); setPattern(genPattern()); setFeedback(null); }
        }, 1000);
    }, [pattern, round, correct, feedback, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`@keyframes patternPop { 0% { transform: scale(0); } 100% { transform: scale(1); } }`}</style>

            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | Answer <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>Spot the pattern and pick the missing shape!</div>

            {/* Pattern display */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
                {pattern.sequence.map((item, i) => (
                    <div key={i} style={{
                        width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "20px",
                        background: i === pattern.answerIdx
                            ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.04)",
                        border: i === pattern.answerIdx
                            ? "2px dashed rgba(255,215,0,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        color: i === pattern.answerIdx && !feedback
                            ? "transparent" : COLORS[item.color],
                        animation: `patternPop 0.3s ease ${i * 0.05}s both`,
                    }}>
                        {i === pattern.answerIdx && !feedback ? "?" : SHAPES[item.shape]}
                    </div>
                ))}
            </div>

            {/* Choices */}
            <div style={{ display: "flex", gap: "10px" }}>
                {pattern.choices.map((choice, i) => {
                    const isCorrectChoice = choice.shape === pattern.answer.shape && choice.color === pattern.answer.color;
                    return (
                        <button key={i} onClick={() => handleChoice(choice)}
                            disabled={!!feedback}
                            style={{
                                width: 54, height: 54, fontSize: "28px",
                                borderRadius: "12px", cursor: feedback ? "default" : "pointer",
                                background: feedback
                                    ? (isCorrectChoice ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.03)")
                                    : "rgba(255,255,255,0.06)",
                                border: feedback && isCorrectChoice
                                    ? "2px solid #64ffda" : "2px solid rgba(255,255,255,0.12)",
                                color: COLORS[choice.color],
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => { if (!feedback) e.currentTarget.style.transform = "scale(1.12)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                        >{SHAPES[choice.shape]}</button>
                    );
                })}
            </div>

            {feedback && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "✅ Correct!" : "❌ Wrong"}
                </div>
            )}
        </div>
    );
};

export default PatternRecognition;
