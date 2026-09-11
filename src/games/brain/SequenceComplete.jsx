/**
 * 🎮 Game 50: Sequence Complete — number cards + slide-in
 */
import { useCallback, useState } from "react";

const genSequence = () => {
    const type = Math.floor(Math.random() * 4);
    let seq, rule;
    switch (type) {
        case 0: { // Arithmetic
            const start = Math.floor(Math.random() * 5) + 1;
            const diff = Math.floor(Math.random() * 4) + 2;
            seq = Array.from({ length: 6 }, (_, i) => start + diff * i);
            rule = `Common difference: ${diff}`;
            break;
        }
        case 1: { // Geometric
            const start2 = Math.floor(Math.random() * 3) + 1;
            const ratio = Math.floor(Math.random() * 2) + 2;
            seq = Array.from({ length: 6 }, (_, i) => start2 * Math.pow(ratio, i));
            rule = `Common ratio: ${ratio}`;
            break;
        }
        case 2: { // Fibonacci-like
            const a = Math.floor(Math.random() * 3) + 1;
            const b = Math.floor(Math.random() * 3) + 2;
            seq = [a, b];
            for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
            rule = "Sum of previous two";
            break;
        }
        default: { // Square numbers
            const offset = Math.floor(Math.random() * 3);
            seq = Array.from({ length: 6 }, (_, i) => (i + 1 + offset) * (i + 1 + offset));
            rule = "Perfect square";
        }
    }
    const hideIdx = 3 + Math.floor(Math.random() * 2);
    const answer = seq[hideIdx];
    const choices = [answer];
    while (choices.length < 4) {
        const wrong = answer + Math.floor(Math.random() * 10) - 5;
        if (wrong > 0 && !choices.includes(wrong)) choices.push(wrong);
    }
    return { seq, hideIdx, answer, rule, choices: choices.sort((a2, b2) => a2 - b2) };
};

const ROUNDS = 6;

const SequenceComplete = ({ onComplete }) => {
    const [problem, setProblem] = useState(genSequence);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const handleChoice = useCallback((c) => {
        if (feedback) return;
        const isC = c === problem.answer;
        if (isC) setCorrect((x) => x + 1);
        setFeedback(isC ? "correct" : "wrong");

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(n); setProblem(genSequence()); setFeedback(null); }
        }, 1200);
    }, [problem, round, correct, feedback, onComplete]);

    const CARD_COLORS = ["#3B82F6", "#7C3AED", "#059669", "#D97706", "#DC2626", "#DB2777"];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`@keyframes slideIn { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }`}</style>

            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | Answer <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>What number fits the blank?</div>

            {/* Sequence cards */}
            <div style={{ display: "flex", gap: "6px" }}>
                {problem.seq.map((num, i) => {
                    const isHidden = i === problem.hideIdx;
                    const solved = feedback && isHidden;
                    return (
                        <div key={i} style={{
                            width: 42, height: 52, borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: isHidden ? "16px" : "16px", fontWeight: "bold",
                            background: solved
                                ? (feedback === "correct" ? "rgba(100,255,218,0.2)" : "rgba(255,107,107,0.15)")
                                : isHidden ? "rgba(255,215,0,0.1)" : `${CARD_COLORS[i]}15`,
                            border: solved
                                ? (feedback === "correct" ? "2px solid #64ffda" : "2px solid #FF6B6B")
                                : isHidden ? "2px dashed rgba(255,215,0,0.5)" : `1px solid ${CARD_COLORS[i]}44`,
                            color: isHidden && !solved ? "#FFD700" : "white",
                            animation: `slideIn 0.3s ease ${i * 0.08}s both`,
                            boxShadow: `0 3px 10px ${CARD_COLORS[i]}15`,
                        }}>
                            {isHidden && !solved ? "?" : num}
                        </div>
                    );
                })}
            </div>

            {/* Arrow connectors */}
            <div style={{ display: "flex", gap: "28px", fontSize: "10px", color: "#8892b0", marginTop: -8 }}>
                {problem.seq.slice(0, -1).map((_, i) => <span key={i}>→</span>)}
            </div>

            {/* Choices */}
            <div style={{ display: "flex", gap: "8px" }}>
                {problem.choices.map((c, i) => (
                    <button key={i} onClick={() => handleChoice(c)} disabled={!!feedback}
                        style={{
                            width: 52, height: 48, fontSize: "18px", fontWeight: "bold",
                            borderRadius: "12px", cursor: feedback ? "default" : "pointer",
                            background: feedback && c === problem.answer ? "rgba(100,255,218,0.2)" : "rgba(255,255,255,0.06)",
                            border: feedback && c === problem.answer ? "2px solid #64ffda" : "2px solid rgba(255,255,255,0.12)",
                            color: "white", transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { if (!feedback) e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    >{c}</button>
                ))}
            </div>

            {feedback && (
                <div style={{ fontSize: "14px" }}>
                    <span style={{ color: feedback === "correct" ? "#64ffda" : "#FF6B6B", fontWeight: "bold" }}>
                        {feedback === "correct" ? "✅ Correct!" : `❌ Answer: ${problem.answer}`}
                    </span>
                    <span style={{ color: "#8892b0", marginLeft: 8, fontSize: "11px" }}>({problem.rule})</span>
                </div>
            )}
        </div>
    );
};

export default SequenceComplete;
