/**
 * 🎮 Game 45: N-Back — 이전 기억 매칭 + 뇌파 애니메이션
 */
import { useCallback, useEffect, useRef, useState } from "react";

const LETTERS = "ABCDEFG".split("");
const SHOW_TIME = 1500;
const ROUNDS = 15;
const N = 2;

const NBack = ({ onComplete }) => {
    const [sequence, setSequence] = useState([]);
    const [current, setCurrent] = useState(null);
    const [showing, setShowing] = useState(false);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [responded, setResponded] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);
    const seqRef = useRef([]);
    const roundRef = useRef(0);

    const nextRound = useCallback(() => {
        if (roundRef.current >= ROUNDS) {
            setDone(true);
            setTimeout(() => onComplete(total > 0 ? Math.round((score / total) * 100) : 50), 500);
            return;
        }
        const isMatch = seqRef.current.length >= N && Math.random() > 0.6;
        const letter = isMatch ? seqRef.current[seqRef.current.length - N] : LETTERS[Math.floor(Math.random() * LETTERS.length)];
        seqRef.current.push(letter);
        setCurrent(letter);
        setSequence([...seqRef.current]);
        setShowing(true);
        setResponded(false);
        setFeedback(null);
        roundRef.current++;

        setTimeout(() => {
            setShowing(false);
            // Auto-advance after brief pause
            setTimeout(nextRound, 800);
        }, SHOW_TIME);
    }, [score, total, onComplete]);

    useEffect(() => { nextRound(); }, []);

    const handleMatch = useCallback((isMatch) => {
        if (responded || !showing || done) return;
        setResponded(true);
        const actual = sequence.length >= N + 1 && sequence[sequence.length - 1] === sequence[sequence.length - 1 - N];
        const isCorrect = isMatch === actual;
        setTotal((t) => t + 1);
        if (isCorrect) setScore((s) => s + 1);
        setFeedback(isCorrect ? "correct" : "wrong");
    }, [responded, showing, done, sequence]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes brainPulse { 0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.2); } 50% { box-shadow: 0 0 35px rgba(124,58,237,0.5); } }
                @keyframes letterPop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                🧠 {N}-Back | <span style={{ color: "#FFD700" }}>{roundRef.current}/{ROUNDS}</span> | 정답 <span style={{ color: "#64ffda" }}>{score}</span>
            </div>

            {/* Recent letters trail */}
            <div style={{ display: "flex", gap: "6px" }}>
                {sequence.slice(-6).map((l, i) => {
                    const isLast = i === sequence.slice(-6).length - 1;
                    const isNBack = i === sequence.slice(-6).length - 1 - N;
                    return (
                        <div key={i} style={{
                            width: 28, height: 28, borderRadius: "6px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "14px", fontWeight: "bold",
                            background: isLast ? "rgba(124,58,237,0.2)" : isNBack ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.04)",
                            border: isLast ? "2px solid #7C3AED" : isNBack ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                            color: isLast ? "#A855F7" : isNBack ? "#FFD700" : "#555",
                            opacity: isLast ? 1 : 0.4 + i * 0.1,
                        }}>{l}</div>
                    );
                })}
            </div>

            {/* Main display */}
            <div style={{
                width: 120, height: 120, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: showing ? "52px" : "24px", fontWeight: "bold",
                background: feedback === "correct" ? "rgba(100,255,218,0.12)"
                    : feedback === "wrong" ? "rgba(255,107,107,0.12)"
                        : "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
                border: feedback === "correct" ? "3px solid #64ffda"
                    : feedback === "wrong" ? "3px solid #FF6B6B"
                        : "3px solid rgba(124,58,237,0.3)",
                color: showing ? "white" : "#555",
                animation: showing ? "brainPulse 1.5s ease infinite, letterPop 0.3s ease" : "none",
                transition: "all 0.2s ease",
            }}>
                {showing ? current : "…"}
            </div>

            {/* Buttons */}
            {!done && (
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => handleMatch(true)} disabled={!showing || responded}
                        style={{
                            padding: "12px 24px", fontSize: "14px", fontWeight: "bold",
                            borderRadius: "12px", cursor: !showing || responded ? "default" : "pointer",
                            background: "rgba(100,255,218,0.1)", color: "#64ffda",
                            border: "2px solid rgba(100,255,218,0.3)",
                            opacity: !showing || responded ? 0.4 : 1,
                        }}>✅ 같다!</button>
                    <button onClick={() => handleMatch(false)} disabled={!showing || responded}
                        style={{
                            padding: "12px 24px", fontSize: "14px", fontWeight: "bold",
                            borderRadius: "12px", cursor: !showing || responded ? "default" : "pointer",
                            background: "rgba(255,107,107,0.08)", color: "#FF6B6B",
                            border: "2px solid rgba(255,107,107,0.3)",
                            opacity: !showing || responded ? 0.4 : 1,
                        }}>❌ 다르다</button>
                </div>
            )}

            {done && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>
                    🧠 {score}/{total} 정답!
                </div>
            )}
        </div>
    );
};

export default NBack;
