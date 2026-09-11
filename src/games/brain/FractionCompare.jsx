/**
 * 🎮 Game 122: 분수 비교
 * 두 분수 중 큰 쪽을 빠르게 선택
 */
import { useState, useEffect, useRef, useCallback } from "react";

const genFraction = () => {
    const d = 2 + Math.floor(Math.random() * 9);
    const n = 1 + Math.floor(Math.random() * (d - 1));
    return { n, d };
};

const FractionCompare = ({ onComplete }) => {
    const [left, setLeft] = useState(genFraction);
    const [right, setRight] = useState(genFraction);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [done, setDone] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const timerRef = useRef(null);
    const scoreRef = useRef(0);
    const maxRounds = 15;

    useEffect(() => {
        if (done) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setDone(true);
                    setTimeout(() => onComplete(Math.min(100, scoreRef.current * 7 + 10)), 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [done, onComplete]);

    const choose = useCallback((side) => {
        if (done) return;
        const leftVal = left.n / left.d;
        const rightVal = right.n / right.d;
        const correct = (side === "left" && leftVal >= rightVal) || (side === "right" && rightVal >= leftVal) || (leftVal === rightVal && side === "equal");

        if (correct) {
            scoreRef.current++;
            setScore(scoreRef.current);
            setFeedback("correct");
        } else {
            setFeedback("wrong");
        }

        const newRound = round + 1;
        setRound(newRound);

        if (newRound >= maxRounds) {
            clearInterval(timerRef.current);
            setDone(true);
            setTimeout(() => onComplete(Math.min(100, scoreRef.current * 7 + 10)), 500);
            return;
        }

        setTimeout(() => {
            setLeft(genFraction());
            setRight(genFraction());
            setFeedback(null);
        }, 400);
    }, [left, right, round, done, onComplete]);

    const renderFraction = (f, side) => (
        <div onClick={() => choose(side)} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "16px 28px", borderRadius: "14px", cursor: "pointer",
            background: feedback === "correct" && side === "left" ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.06)",
            border: "2px solid rgba(255,255,255,0.15)",
            transition: "all 0.15s",
        }}>
            <span style={{ fontSize: "32px", fontWeight: "bold", borderBottom: "3px solid #fff", paddingBottom: "4px" }}>{f.n}</span>
            <span style={{ fontSize: "32px", fontWeight: "bold", paddingTop: "4px" }}>{f.d}</span>
        </div>
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda" }}>{score}/{round}</span></span>
                <span>시간: <span style={{ color: timeLeft <= 5 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}s</span></span>
            </div>
            <div style={{ fontSize: "14px", color: "#8892b0" }}>더 큰 분수를 클릭!</div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {renderFraction(left, "left")}
                <span style={{ fontSize: "24px", color: "#8892b0" }}>vs</span>
                {renderFraction(right, "right")}
            </div>
            {feedback && (
                <div style={{ fontSize: "20px", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "✅ 정답!" : "❌ 오답!"}
                </div>
            )}
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>완료! {score}/{round} 정답</div>}
        </div>
    );
};

export default FractionCompare;
