/**
 * 🎮 Game 47: Balance Scale — CSS tilt animation
 */
import { useCallback, useState } from "react";

const genProblem = () => {
    const left = Math.floor(Math.random() * 8) + 2;
    const right = Math.floor(Math.random() * 8) + 2;
    const answer = left - right;
    const choices = [answer];
    while (choices.length < 4) {
        const wrong = answer + Math.floor(Math.random() * 7) - 3;
        if (!choices.includes(wrong)) choices.push(wrong);
    }
    return { left, right, answer, choices: choices.sort(() => Math.random() - 0.5) };
};
const ROUNDS = 8;

const BalanceScale = ({ onComplete }) => {
    const [problem, setProblem] = useState(genProblem);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const tilt = problem.left > problem.right ? -8 : problem.left < problem.right ? 8 : 0;

    const handleChoice = useCallback((c) => {
        if (feedback) return;
        const isC = c === problem.answer;
        if (isC) setCorrect((x) => x + 1);
        setFeedback(isC ? "correct" : "wrong");

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(n); setProblem(genProblem()); setFeedback(null); }
        }, 1000);
    }, [problem, round, correct, feedback, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | Answer <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>What number in place of ? balances the scale?</div>

            {/* Scale SVG */}
            <svg width="240" height="140" viewBox="0 0 240 140">
                {/* Base */}
                <polygon points="95,130 145,130 120,110" fill="#8B6914" />
                <rect x="117" y="50" width="6" height="60" fill="#A0784C" rx="2" />

                {/* Beam (tilts) */}
                <g transform={`rotate(${feedback ? 0 : tilt}, 120, 50)`} style={{ transition: "transform 0.5s ease" }}>
                    <rect x="30" y="47" width="180" height="6" fill="#B8860B" rx="3" />
                    {/* Fulcrum */}
                    <circle cx="120" cy="50" r="6" fill="#FFD700" />

                    {/* Left pan */}
                    <line x1="50" y1="53" x2="50" y2="85" stroke="#888" strokeWidth="1.5" />
                    <ellipse cx="50" cy="88" rx="28" ry="8" fill="rgba(100,255,218,0.15)" stroke="#64ffda" strokeWidth="1.5" />
                    {/* Left weights */}
                    {Array.from({ length: Math.min(problem.left, 8) }).map((_, i) => (
                        <rect key={i} x={38 + (i % 4) * 7} y={78 - Math.floor(i / 4) * 8} width="6" height="6" rx="1" fill="#64ffda" opacity="0.7" />
                    ))}
                    <text x="50" y="105" textAnchor="middle" fill="#64ffda" fontSize="14" fontWeight="bold">{problem.left}</text>

                    {/* Right pan */}
                    <line x1="190" y1="53" x2="190" y2="85" stroke="#888" strokeWidth="1.5" />
                    <ellipse cx="190" cy="88" rx="28" ry="8" fill="rgba(255,107,107,0.15)" stroke="#FF6B6B" strokeWidth="1.5" />
                    {/* Right weights */}
                    {Array.from({ length: Math.min(problem.right, 8) }).map((_, i) => (
                        <rect key={i} x={178 + (i % 4) * 7} y={78 - Math.floor(i / 4) * 8} width="6" height="6" rx="1" fill="#FF6B6B" opacity="0.7" />
                    ))}
                    <text x="190" y="105" textAnchor="middle" fill="#FF6B6B" fontSize="14" fontWeight="bold">{problem.right} + ?</text>
                </g>
            </svg>

            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                <span style={{ color: "#64ffda" }}>{problem.left}</span>
                <span style={{ color: "#8892b0" }}> = </span>
                <span style={{ color: "#FF6B6B" }}>{problem.right}</span>
                <span style={{ color: "#8892b0" }}> + </span>
                <span style={{ color: "#FFD700" }}>?</span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
                {problem.choices.map((c, i) => (
                    <button key={i} onClick={() => handleChoice(c)} disabled={!!feedback}
                        style={{
                            width: 48, height: 48, fontSize: "18px", fontWeight: "bold",
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
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "✅ Balanced!" : `❌ Answer: ${problem.answer}`}
                </div>
            )}
        </div>
    );
};

export default BalanceScale;
