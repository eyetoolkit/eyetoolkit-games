/**
 * 🎮 Game 125: Unit Convert Quiz
 * Fast cm→in, kg→lb conversions
 */
import { useState, useEffect, useRef, useCallback } from "react";

const CONVERSIONS = [
    { from: "cm", to: "inch", factor: 0.3937, template: (n) => `${n}cm = ? inch` },
    { from: "inch", to: "cm", factor: 2.54, template: (n) => `${n}inch = ? cm` },
    { from: "kg", to: "lb", factor: 2.205, template: (n) => `${n}kg = ? lb` },
    { from: "lb", to: "kg", factor: 0.4536, template: (n) => `${n}lb = ? kg` },
    { from: "km", to: "mile", factor: 0.6214, template: (n) => `${n}km = ? mile` },
    { from: "mile", to: "km", factor: 1.609, template: (n) => `${n}mile = ? km` },
    { from: "C", to: "F", factor: null, template: (n) => `${n}\u00b0C = ? \u00b0F`, calc: (n) => n * 9 / 5 + 32 },
];

const genProblem = () => {
    const conv = CONVERSIONS[Math.floor(Math.random() * CONVERSIONS.length)];
    const num = 1 + Math.floor(Math.random() * 50);
    const answer = conv.calc ? conv.calc(num) : num * conv.factor;
    return { text: conv.template(num), answer: Math.round(answer * 10) / 10 };
};

const UnitConvert = ({ onComplete }) => {
    const [problem, setProblem] = useState(genProblem);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [timeLeft, setTimeLeft] = useState(40);
    const [done, setDone] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const timerRef = useRef(null);
    const scoreRef = useRef(0);

    useEffect(() => {
        if (done) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setDone(true);
                    setTimeout(() => onComplete(Math.min(100, scoreRef.current * 8 + 10)), 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [done, onComplete]);

    const submit = useCallback(() => {
        if (done) return;
        const userVal = parseFloat(input);
        const diff = Math.abs(userVal - problem.answer);
        const tolerance = Math.max(0.5, problem.answer * 0.1);
        if (diff <= tolerance) {
            scoreRef.current++;
            setScore(scoreRef.current);
            setFeedback("correct");
        } else {
            setFeedback("wrong");
        }
        setRound(r => r + 1);
        setTimeout(() => {
            setProblem(genProblem());
            setInput("");
            setFeedback(null);
        }, 500);
    }, [input, problem, done]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>Score: <span style={{ color: "#64ffda" }}>{score}</span></span>
                <span>Time: <span style={{ color: timeLeft <= 10 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}s</span></span>
            </div>
            <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", fontFamily: "monospace" }}>{problem.text}</div>
            </div>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>One decimal place, 10% tolerance</div>
            <div style={{ display: "flex", gap: "8px" }}>
                <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: "18px", width: "100px", textAlign: "center" }}
                    placeholder="?" autoFocus />
                <button onClick={submit} style={{ padding: "10px 20px", fontSize: "14px", fontWeight: "bold", background: "rgba(100,255,218,0.15)", color: "#64ffda", border: "1px solid #64ffda", borderRadius: "8px", cursor: "pointer" }}>OK</button>
            </div>
            {feedback && <div style={{ fontSize: "16px", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                {feedback === "correct" ? "✅ Correct!" : `❌ Answer: ${problem.answer}`}
            </div>}
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>Done! {score}question Answer</div>}
        </div>
    );
};

export default UnitConvert;
