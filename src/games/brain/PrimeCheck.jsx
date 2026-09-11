/**
 * 🎮 Game 44: 소수 판별 — 시각적 숫자 카드 + 팩터 시각화
 */
import { useCallback, useState } from "react";

const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) return false; } return true; };
const getFactors = (n) => { const f = []; for (let i = 2; i <= n; i++) { while (n % i === 0) { f.push(i); n /= i; } } return f; };

const ROUNDS = 10;

const PrimeCheck = ({ onComplete }) => {
    const [number, setNumber] = useState(() => Math.floor(Math.random() * 50) + 2);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const handleAnswer = useCallback((ans) => {
        if (feedback) return;
        const isP = isPrime(number);
        const isC = ans === isP;
        if (isC) setCorrect((c) => c + 1);
        setFeedback({ isCorrect: isC, isPrime: isP, factors: isP ? [] : getFactors(number) });

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else {
                setRound(n);
                setNumber(Math.floor(Math.random() * 50) + 2);
                setFeedback(null);
            }
        }, 1500);
    }, [number, round, correct, feedback, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes numPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                @keyframes factorSlide { 0% { opacity: 0; transform: translateX(-10px); } 100% { opacity: 1; transform: translateX(0); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | 정답 <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            {/* Number card */}
            <div style={{
                width: 120, height: 120, borderRadius: "20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "42px", fontWeight: "bold",
                background: feedback
                    ? (feedback.isPrime ? "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(34,197,94,0.08))" : "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(239,68,68,0.08))")
                    : "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
                border: feedback
                    ? (feedback.isPrime ? "3px solid #64ffda" : "3px solid #FF6B6B")
                    : "3px solid rgba(124,58,237,0.3)",
                color: "#FFD700",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                animation: !feedback ? "numPulse 2s ease infinite" : "none",
            }}>
                {number}
            </div>

            <div style={{ fontSize: "14px", color: "#8892b0" }}>이 숫자는 소수일까요?</div>

            {/* Factor visualization */}
            {feedback && !feedback.isPrime && feedback.factors.length > 0 && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center", animation: "factorSlide 0.4s ease" }}>
                    <span style={{ fontSize: "12px", color: "#8892b0" }}>{number} =</span>
                    {feedback.factors.map((f, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                            {i > 0 && <span style={{ color: "#8892b0" }}>×</span>}
                            <span style={{
                                padding: "3px 8px", borderRadius: "6px", fontSize: "14px", fontWeight: "bold",
                                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                                color: "#FF6B6B",
                            }}>{f}</span>
                        </span>
                    ))}
                </div>
            )}

            {/* Answer buttons */}
            {!feedback && (
                <div style={{ display: "flex", gap: "16px" }}>
                    <button onClick={() => handleAnswer(true)} style={{
                        padding: "14px 28px", fontSize: "16px", fontWeight: "bold",
                        borderRadius: "14px", cursor: "pointer",
                        background: "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))",
                        color: "#64ffda", border: "2px solid rgba(100,255,218,0.3)",
                        boxShadow: "0 4px 15px rgba(100,255,218,0.1)",
                    }}>✅ 소수</button>
                    <button onClick={() => handleAnswer(false)} style={{
                        padding: "14px 28px", fontSize: "16px", fontWeight: "bold",
                        borderRadius: "14px", cursor: "pointer",
                        background: "linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,107,107,0.04))",
                        color: "#FF6B6B", border: "2px solid rgba(255,107,107,0.3)",
                        boxShadow: "0 4px 15px rgba(255,107,107,0.1)",
                    }}>❌ 합성수</button>
                </div>
            )}

            {feedback && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback.isCorrect ? "#64ffda" : "#FF6B6B" }}>
                    {feedback.isCorrect ? "✅ 정답!" : "❌ 오답"}
                    <span style={{ fontSize: "12px", color: "#8892b0", marginLeft: 8 }}>
                        ({feedback.isPrime ? "소수" : "합성수"})
                    </span>
                </div>
            )}
        </div>
    );
};

export default PrimeCheck;
