/**
 * 🎮 Game 134: 동의어 퀴즈
 * 제시어의 동의어를 고르세요
 */
import { useState, useCallback, useMemo } from "react";

const QUESTIONS = [
    { word: "아름답다", answer: "예쁘다", options: ["예쁘다", "못생기다", "크다", "작다"] },
    { word: "빠르다", answer: "신속하다", options: ["신속하다", "느리다", "무겁다", "가볍다"] },
    { word: "기쁘다", answer: "즐겁다", options: ["즐겁다", "슬프다", "화나다", "무섭다"] },
    { word: "어렵다", answer: "힘들다", options: ["힘들다", "쉽다", "크다", "길다"] },
    { word: "크다", answer: "거대하다", options: ["거대하다", "작다", "낮다", "짧다"] },
    { word: "중요하다", answer: "핵심적이다", options: ["핵심적이다", "사소하다", "간단하다", "복잡하다"] },
    { word: "조용하다", answer: "고요하다", options: ["고요하다", "시끄럽다", "밝다", "어둡다"] },
    { word: "슬프다", answer: "비통하다", options: ["비통하다", "기쁘다", "놀랍다", "편하다"] },
    { word: "똑똑하다", answer: "영리하다", options: ["영리하다", "어리석다", "느리다", "크다"] },
    { word: "맛있다", answer: "별미이다", options: ["별미이다", "맛없다", "뜨겁다", "차갑다"] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SynonymQuiz = ({ onComplete }) => {
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
                .syn-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #4D96FF, #6BCB77)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                padding: "20px 28px", borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animation: "fadeSlideIn 0.3s ease",
            }}>
                <div style={{ fontSize: "12px", color: "#8892b0", marginBottom: "6px" }}>동의어를 고르세요:</div>
                <div style={{ fontSize: "30px", fontWeight: "bold", color: "#4D96FF", textShadow: "0 0 20px rgba(77,150,255,0.3)" }}>{q.word}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 130px)", gap: "8px" }}>
                {shuffledOptions[current].map((opt) => (
                    <button key={opt} className="syn-opt" onClick={() => choose(opt)} style={{
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

export default SynonymQuiz;
