/**
 * 🎮 Game 135: 반의어 퀴즈
 * 제시어의 반의어를 고르세요
 */
import { useState, useCallback, useMemo } from "react";

const QUESTIONS = [
    { word: "크다", answer: "작다", options: ["작다", "길다", "넓다", "높다"] },
    { word: "빠르다", answer: "느리다", options: ["느리다", "무겁다", "가볍다", "높다"] },
    { word: "밝다", answer: "어둡다", options: ["어둡다", "크다", "좁다", "넓다"] },
    { word: "뜨겁다", answer: "차갑다", options: ["차갑다", "따뜻하다", "시원하다", "미지근하다"] },
    { word: "높다", answer: "낮다", options: ["낮다", "깊다", "넓다", "좁다"] },
    { word: "부지런하다", answer: "게으르다", options: ["게으르다", "똑똑하다", "착하다", "바쁘다"] },
    { word: "무겁다", answer: "가볍다", options: ["가볍다", "크다", "작다", "두껍다"] },
    { word: "행복하다", answer: "불행하다", options: ["불행하다", "즐겁다", "편하다", "잔잔하다"] },
    { word: "많다", answer: "적다", options: ["적다", "크다", "길다", "넓다"] },
    { word: "길다", answer: "짧다", options: ["짧다", "넓다", "높다", "낮다"] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const AntonymQuiz = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(QUESTIONS).slice(0, 8));
    const shuffledOptions = useMemo(() => questions.map(q => shuffle(q.options)), [questions]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);

    const choose = useCallback((answer) => {
        if (done || feedback) return;
        const correct = answer === questions[current].answer;
        setFeedback(correct ? "correct" : "wrong");
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            setFeedback(null);
            if (current + 1 >= questions.length) {
                setDone(true);
                const finalScore = Math.min(100, (score + (correct ? 1 : 0)) * 12 + 4);
                setTimeout(() => onComplete(finalScore), 300);
            } else {
                setCurrent(c => c + 1);
            }
        }, 600);
    }, [current, questions, score, done, feedback, onComplete]);

    const q = questions[current];
    const progress = ((current + (done ? 1 : 0)) / questions.length) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes quizPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
                @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .ant-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #FF6B6B, #FFD93D)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                padding: "20px 28px", borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animation: "fadeSlideIn 0.3s ease",
            }}>
                <div style={{ fontSize: "12px", color: "#8892b0", marginBottom: "6px" }}>반의어를 고르세요:</div>
                <div style={{ fontSize: "30px", fontWeight: "bold", color: "#FF6B6B", textShadow: "0 0 20px rgba(255,107,107,0.3)" }}>{q.word}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 130px)", gap: "8px" }}>
                {shuffledOptions[current].map((opt) => (
                    <button key={opt} className="ant-opt" onClick={() => choose(opt)} style={{
                        padding: "12px", fontSize: "14px", fontWeight: "600",
                        background: feedback && opt === q.answer ? "rgba(100,255,218,0.2)" : "rgba(255,255,255,0.06)",
                        color: "white",
                        border: feedback && opt === q.answer ? "1px solid #64ffda" : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px", cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>{opt}</button>
                ))}
            </div>
            {feedback && <div style={{
                fontSize: "16px", fontWeight: "bold",
                color: feedback === "correct" ? "#64ffda" : "#FF6B6B",
                animation: "quizPulse 0.4s ease",
            }}>
                {feedback === "correct" ? "✓ 정답!" : `✗ 정답: ${q.answer}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 완료! {score}/{questions.length}</div>}
        </div>
    );
};

export default AntonymQuiz;
