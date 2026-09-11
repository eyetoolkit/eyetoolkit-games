/**
 * 🎮 Game 49: 로직 게이트 — 논리 게이트 다이어그램
 */
import { useCallback, useState } from "react";

const GATES = [
    { type: "AND", symbol: "&", fn: (a, b) => a && b, desc: "둘 다 1이면 1" },
    { type: "OR", symbol: "≥1", fn: (a, b) => a || b, desc: "하나라도 1이면 1" },
    { type: "XOR", symbol: "=1", fn: (a, b) => a !== b, desc: "서로 다르면 1" },
    { type: "NAND", symbol: "&̄", fn: (a, b) => !(a && b), desc: "AND의 반대" },
    { type: "NOR", symbol: "≥1̄", fn: (a, b) => !(a || b), desc: "OR의 반대" },
];

const genProblem = () => {
    const gate = GATES[Math.floor(Math.random() * GATES.length)];
    const a = Math.random() > 0.5;
    const b = Math.random() > 0.5;
    const output = gate.fn(a, b);
    return { gate, a, b, output };
};

const ROUNDS = 8;

const LogicGate = ({ onComplete }) => {
    const [problem, setProblem] = useState(genProblem);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const handleAnswer = useCallback((ans) => {
        if (feedback) return;
        const isC = ans === problem.output;
        if (isC) setCorrect((x) => x + 1);
        setFeedback(isC ? "correct" : "wrong");

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(n); setProblem(genProblem()); setFeedback(null); }
        }, 1000);
    }, [problem, round, correct, feedback, onComplete]);

    const wireColor = (val) => val ? "#64ffda" : "#444";

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | 정답 <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            {/* Gate diagram */}
            <svg width="220" height="120" viewBox="0 0 220 120">
                {/* Input A wire */}
                <line x1="20" y1="35" x2="65" y2="35" stroke={wireColor(problem.a)} strokeWidth="3" />
                <circle cx="15" cy="35" r="8" fill={problem.a ? "#64ffda" : "#1a1a2e"} stroke={wireColor(problem.a)} strokeWidth="2" />
                <text x="15" y="39" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{problem.a ? "1" : "0"}</text>
                <text x="15" y="18" textAnchor="middle" fill="#8892b0" fontSize="9">A</text>

                {/* Input B wire */}
                <line x1="20" y1="85" x2="65" y2="85" stroke={wireColor(problem.b)} strokeWidth="3" />
                <circle cx="15" cy="85" r="8" fill={problem.b ? "#64ffda" : "#1a1a2e"} stroke={wireColor(problem.b)} strokeWidth="2" />
                <text x="15" y="89" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{problem.b ? "1" : "0"}</text>
                <text x="15" y="105" textAnchor="middle" fill="#8892b0" fontSize="9">B</text>

                {/* Gate body */}
                <rect x="65" y="20" width="70" height="80" rx="8"
                    fill="rgba(124,58,237,0.15)" stroke="#7C3AED" strokeWidth="2" />
                <text x="100" y="55" textAnchor="middle" fill="#A855F7" fontSize="16" fontWeight="bold">{problem.gate.symbol}</text>
                <text x="100" y="78" textAnchor="middle" fill="#8892b0" fontSize="10">{problem.gate.type}</text>

                {/* NOT bubble for NAND/NOR */}
                {(problem.gate.type === "NAND" || problem.gate.type === "NOR") && (
                    <circle cx="139" cy="60" r="5" fill="rgba(124,58,237,0.3)" stroke="#7C3AED" strokeWidth="1.5" />
                )}

                {/* Output wire */}
                <line x1="135" y1="60" x2="175" y2="60" stroke={feedback ? wireColor(problem.output) : "#666"} strokeWidth="3" />

                {/* Output */}
                <circle cx="185" cy="60" r="12"
                    fill={feedback ? (problem.output ? "rgba(100,255,218,0.2)" : "rgba(100,100,100,0.2)") : "rgba(255,215,0,0.1)"}
                    stroke={feedback ? wireColor(problem.output) : "#FFD700"} strokeWidth="2" />
                <text x="185" y="65" textAnchor="middle" fill={feedback ? "white" : "#FFD700"}
                    fontSize="14" fontWeight="bold">{feedback ? (problem.output ? "1" : "0") : "?"}</text>
                <text x="185" y="85" textAnchor="middle" fill="#8892b0" fontSize="9">OUT</text>
            </svg>

            <div style={{ fontSize: "11px", color: "#8892b0" }}>💡 {problem.gate.desc}</div>

            {/* Answer buttons */}
            {!feedback && (
                <div style={{ display: "flex", gap: "16px" }}>
                    <button onClick={() => handleAnswer(true)} style={{
                        width: 60, height: 54, fontSize: "22px", fontWeight: "bold",
                        borderRadius: "14px", cursor: "pointer",
                        background: "rgba(100,255,218,0.1)", color: "#64ffda",
                        border: "2px solid rgba(100,255,218,0.3)",
                    }}>1</button>
                    <button onClick={() => handleAnswer(false)} style={{
                        width: 60, height: 54, fontSize: "22px", fontWeight: "bold",
                        borderRadius: "14px", cursor: "pointer",
                        background: "rgba(255,107,107,0.08)", color: "#FF6B6B",
                        border: "2px solid rgba(255,107,107,0.3)",
                    }}>0</button>
                </div>
            )}

            {feedback && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "✅ 정답!" : `❌ 정답: ${problem.output ? "1" : "0"}`}
                </div>
            )}
        </div>
    );
};

export default LogicGate;
