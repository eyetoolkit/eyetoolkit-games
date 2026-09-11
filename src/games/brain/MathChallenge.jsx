/**
 * 🎮 Game 41: Math Challenge — visual formulas + combo + timer bar
 */
import { useCallback, useEffect, useRef, useState } from "react";

const GAME_TIME = 30;
const genProblem = (level) => {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * (level > 5 ? 3 : 2))];
    let a, b, answer;
    if (op === "+") { a = 10 + Math.floor(Math.random() * 40 * Math.min(level, 3)); b = 5 + Math.floor(Math.random() * 30); answer = a + b; }
    else if (op === "-") { a = 20 + Math.floor(Math.random() * 50); b = Math.floor(Math.random() * a); answer = a - b; }
    else { a = 2 + Math.floor(Math.random() * 12); b = 2 + Math.floor(Math.random() * 9); answer = a * b; }
    const choices = [answer];
    while (choices.length < 4) {
        const wrong = answer + (Math.floor(Math.random() * 10) - 5);
        if (wrong !== answer && !choices.includes(wrong) && wrong >= 0) choices.push(wrong);
    }
    choices.sort(() => Math.random() - 0.5);
    return { text: `${a} ${op} ${b}`, answer, choices };
};

const MathChallenge = ({ onComplete }) => {
    const [problem, setProblem] = useState(() => genProblem(1));
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [correct, setCorrect] = useState(0);
    const [total, setTotal] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [combo, setCombo] = useState(0);
    const correctRef = useRef(0);
    const comboRef = useRef(0);

    useEffect(() => {
        const t = setInterval(() => {
            setTimeLeft((tt) => {
                if (tt <= 1) {
                    clearInterval(t);
                    setTimeout(() => onComplete(Math.min(100, correctRef.current * 8)), 300);
                    return 0;
                }
                return tt - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [onComplete]);

    const handleAnswer = useCallback((choice) => {
        if (timeLeft <= 0 || feedback) return;
        const isCorrect = choice === problem.answer;
        setTotal((t) => t + 1);
        if (isCorrect) {
            correctRef.current += 1;
            comboRef.current += 1;
            setCorrect(correctRef.current);
            setCombo(comboRef.current);
        } else {
            comboRef.current = 0;
            setCombo(0);
        }
        setFeedback(isCorrect ? "correct" : "wrong");
        setTimeout(() => {
            setFeedback(null);
            setProblem(genProblem(Math.ceil(correctRef.current / 3)));
        }, 300);
    }, [problem, timeLeft, feedback]);

    const progress = (timeLeft / GAME_TIME) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes correctPop { 0% { transform: scale(1.15); } 100% { transform: scale(1); } }
                @keyframes wrongShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
            `}</style>

            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>⏱ <span style={{ color: timeLeft <= 5 ? "#FF6B6B" : "#FFD700", fontWeight: "bold" }}>{timeLeft}s</span></span>
                <span>✅ <span style={{ color: "#64ffda" }}>{correct}</span>/{total}</span>
                {combo >= 3 && <span style={{ color: "#A855F7" }}>🔥 x{combo}</span>}
            </div>

            {/* Timer bar */}
            <div style={{ width: 240, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{
                    width: `${progress}%`, height: "100%",
                    background: timeLeft <= 5 ? "#FF6B6B" : timeLeft <= 10 ? "#FFD700" : "linear-gradient(90deg, #64ffda, #3B82F6)",
                    borderRadius: 4, transition: "width 1s linear",
                }} />
            </div>

            {/* Problem display */}
            {timeLeft > 0 ? (
                <div style={{
                    fontSize: "36px", fontWeight: "bold", color: "#FFD700",
                    padding: "16px 28px", borderRadius: "16px",
                    background: "rgba(255,215,0,0.06)",
                    border: "2px solid rgba(255,215,0,0.15)",
                    animation: feedback === "correct" ? "correctPop 0.2s ease" : feedback === "wrong" ? "wrongShake 0.3s ease" : "none",
                    minWidth: 180, textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}>
                    {problem.text} = ?
                </div>
            ) : (
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#64ffda" }}>🏆 {correct}question Correct!</div>
            )}

            {/* Feedback */}
            {feedback && (
                <div style={{
                    fontSize: "20px", fontWeight: "bold",
                    color: feedback === "correct" ? "#64ffda" : "#FF6B6B",
                }}>
                    {feedback === "correct" ? "✅" : "❌"}
                    {combo >= 3 && feedback === "correct" && <span style={{ fontSize: "14px", color: "#A855F7", marginLeft: 8 }}>+Combo!</span>}
                </div>
            )}

            {/* Answer buttons */}
            {timeLeft > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {problem.choices.map((c, i) => (
                        <button key={i} onClick={() => handleAnswer(c)}
                            disabled={!!feedback}
                            style={{
                                padding: "14px 28px", fontSize: "18px", fontWeight: "bold",
                                minWidth: 80,
                                background: "rgba(255,255,255,0.06)",
                                color: "white",
                                border: "2px solid rgba(255,255,255,0.15)",
                                borderRadius: "12px", cursor: feedback ? "default" : "pointer",
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => { if (!feedback) { e.currentTarget.style.background = "rgba(255,215,0,0.1)"; e.currentTarget.style.borderColor = "#FFD700"; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                        >{c}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MathChallenge;
