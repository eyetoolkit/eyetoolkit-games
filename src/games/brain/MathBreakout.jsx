/**
 * 🎮 Game 124: 수학 벽돌깨기
 * 정답을 맞혀야 벽돌이 깨짐
 */
import { useState, useCallback } from "react";

const genProblem = () => {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    if (op === "+") { a = 1 + Math.floor(Math.random() * 50); b = 1 + Math.floor(Math.random() * 50); answer = a + b; }
    else if (op === "-") { a = 10 + Math.floor(Math.random() * 50); b = 1 + Math.floor(Math.random() * a); answer = a - b; }
    else { a = 2 + Math.floor(Math.random() * 12); b = 2 + Math.floor(Math.random() * 12); answer = a * b; }
    return { text: `${a} ${op} ${b}`, answer };
};

const COLS = 5;
const ROWS = 4;

const MathBreakout = ({ onComplete }) => {
    const [bricks, setBricks] = useState(() =>
        Array.from({ length: ROWS * COLS }, () => ({ alive: true, color: ["#FF6B6B", "#FFD93D", "#4D96FF", "#6BCB77", "#9B59B6"][Math.floor(Math.random() * 5)] }))
    );
    const [problem, setProblem] = useState(genProblem);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const submit = useCallback(() => {
        if (done) return;
        const userAnswer = parseInt(input, 10);
        if (userAnswer === problem.answer) {
            setFeedback("correct");
            const aliveIdx = bricks.map((b, i) => b.alive ? i : -1).filter(i => i >= 0);
            if (aliveIdx.length > 0) {
                const breakIdx = aliveIdx[Math.floor(Math.random() * aliveIdx.length)];
                const newBricks = [...bricks];
                newBricks[breakIdx] = { ...newBricks[breakIdx], alive: false };
                setBricks(newBricks);
                setScore(s => s + 10);
                if (newBricks.every(b => !b.alive)) {
                    setDone(true);
                    setTimeout(() => onComplete(100), 500);
                    return;
                }
            }
        } else {
            setFeedback("wrong");
        }
        setTimeout(() => {
            setProblem(genProblem());
            setInput("");
            setFeedback(null);
        }, 400);
    }, [input, problem, bricks, done, onComplete]);

    const aliveCount = bricks.filter(b => b.alive).length;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#FFD700" }}>{score}</span></span>
                <span>남은 벽돌: <span style={{ color: "#FF6B6B" }}>{aliveCount}</span></span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 50px)`, gap: "3px", padding: "6px", background: "#1a1a2e", borderRadius: "10px" }}>
                {bricks.map((brick, i) => (
                    <div key={i} style={{
                        width: 50, height: 28, borderRadius: "4px",
                        background: brick.alive ? brick.color : "rgba(255,255,255,0.03)",
                        border: brick.alive ? `1px solid ${brick.color}88` : "1px solid rgba(255,255,255,0.02)",
                        transition: "all 0.3s",
                        opacity: brick.alive ? 1 : 0.2,
                    }} />
                ))}
            </div>
            <div style={{ padding: "12px 20px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", fontSize: "24px", fontWeight: "bold", fontFamily: "monospace" }}>
                {problem.text} = ?
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: "18px", width: "100px", textAlign: "center" }}
                    placeholder="?" autoFocus />
                <button onClick={submit} style={{ padding: "10px 20px", fontSize: "14px", fontWeight: "bold", background: "rgba(100,255,218,0.15)", color: "#64ffda", border: "1px solid #64ffda", borderRadius: "8px", cursor: "pointer" }}>확인</button>
            </div>
            {feedback && <div style={{ fontSize: "16px", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                {feedback === "correct" ? "💥 벽돌 파괴!" : `❌ 정답: ${problem.answer}`}
            </div>}
            {done && <div style={{ fontSize: "18px", color: "#64ffda", fontWeight: "bold" }}>🎉 모든 벽돌 파괴!</div>}
        </div>
    );
};

export default MathBreakout;
