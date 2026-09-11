/**
 * 🎮 Game 123: 진법 변환
 * 10진수↔2진수 빠르게 변환
 */
import { useState, useEffect, useRef, useCallback } from "react";

const BaseConvert = ({ onComplete }) => {
    const genProblem = useCallback(() => {
        const toBin = Math.random() > 0.5;
        const num = 1 + Math.floor(Math.random() * 63);
        return { num, toBin, answer: toBin ? num.toString(2) : parseInt(num.toString(), 2).toString() };
    }, []);

    const [problem, setProblem] = useState(() => {
        const num = 1 + Math.floor(Math.random() * 63);
        return { num, toBin: true, answer: num.toString(2) };
    });
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45);
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
        const correct = problem.toBin
            ? input === problem.answer
            : parseInt(input, 10) === parseInt(problem.answer, 10);
        if (correct) {
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
    }, [input, problem, done, genProblem]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda" }}>{score}</span></span>
                <span>시간: <span style={{ color: timeLeft <= 10 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}s</span></span>
            </div>
            <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#8892b0", marginBottom: "8px" }}>
                    {problem.toBin ? "10진수 → 2진수" : "2진수 → 10진수"}
                </div>
                <div style={{ fontSize: "32px", fontWeight: "bold", fontFamily: "monospace", color: problem.toBin ? "#FFD700" : "#4D96FF" }}>
                    {problem.toBin ? problem.num : problem.num.toString(2)}
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: "18px", fontFamily: "monospace", width: "140px", textAlign: "center" }}
                    placeholder={problem.toBin ? "2진수" : "10진수"} autoFocus />
                <button onClick={submit} style={{ padding: "10px 20px", fontSize: "14px", fontWeight: "bold", background: "rgba(100,255,218,0.15)", color: "#64ffda", border: "1px solid #64ffda", borderRadius: "10px", cursor: "pointer" }}>확인</button>
            </div>
            {feedback && <div style={{ fontSize: "18px", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                {feedback === "correct" ? "✅" : `❌ 정답: ${problem.answer}`}
            </div>}
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>완료! {score}문제 정답</div>}
        </div>
    );
};

export default BaseConvert;
